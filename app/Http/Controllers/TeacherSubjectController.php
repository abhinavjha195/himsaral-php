<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

use App\Models\ClasswiseSubject;
use App\Models\SessionMaster;
use App\Models\SectionMaster;
use App\Models\SubjectMaster;
use App\Models\EmployeeSubject;
use App\Models\Employee;
use App\Models\Classic;
use App\Models\Course;
use Helper;

class TeacherSubjectController extends Controller
{
	public function __construct()
    {
       DB::statement("SET SQL_MODE=''");
    }

    public function empList($emp_id)
    {
        // Retrieve the employee
        $employee = Employee::where('id', $emp_id)->first();

        // Check if the employee exists
        if ($employee) {
            // Check if class_set and section_set are not empty
            if (!empty($employee->class_set) && !empty($employee->section_set)) {
                // Explode class_set and section_set to get the individual values
                $classSetArray = explode(',', $employee->class_set);
                $sectionSetArray = explode(',', $employee->section_set);

                // Fetch sections that match the criteria from section_master
                $sections = SectionMaster::whereIn('sectionId', $sectionSetArray)
                        ->join('class_master', 'section_master.classId', '=', 'class_master.classId')
                        ->join('course_master', 'section_master.courseId', '=', 'course_master.courseId')
                        ->whereIn('class_master.classId', $classSetArray)
                        ->select('section_master.*', 'class_master.className', 'course_master.courseName')
                        ->get();

                // Check if class-wise subjects exist
                $info = ClasswiseSubject::leftJoin('course_master as cm', 'classwisesubject.courseId', '=', 'cm.courseId')
                    ->leftJoin('class_master as cs', 'classwisesubject.classId', '=', 'cs.classId')
                    ->leftJoin('section_master as sc', 'classwisesubject.sectionId', '=', 'sc.sectionId')
                    ->leftJoin('class_wise_sub_desc as cd', 'classwisesubject.id', '=', 'cd.csId')
                    ->leftJoin('subject_master as sm', 'cd.subjectId', '=', 'sm.subjectId')
                    ->selectRaw('classwisesubject.id, classwisesubject.sectionId, cm.courseName, cs.className, sc.sectionName, group_concat(sm.subjectId) as sub_set, group_concat(sm.subjectName) as sub_list, group_concat(cd.compulsary) as com_list, group_concat(cd.elective) as elec_list, group_concat(cd.addition) as ado_list')
                    ->groupBy('classwisesubject.id')
                    ->get();

                if ($info->isNotEmpty()) {
                    // Map class-wise subjects by sectionId
                    $classwiseMap = [];
                    foreach ($info as $subject) {
                        $sectionId = $subject->sectionId;
                        if (!isset($classwiseMap[$sectionId])) {
                            $classwiseMap[$sectionId] = [];
                        }
                        $classwiseMap[$sectionId][] = [
                            'subjectIds' => $subject->sub_set,
                            'subjectNames' => $subject->sub_list,
                            'compulsory' => $subject->com_list,
                            'elective' => $subject->elec_list,
                            'additional' => $subject->ado_list
                        ];
                    }

                    // Integrate class-wise subjects into sections
                    foreach ($sections as $section) {
                        $sectionId = $section->sectionId;
                        $section->classwiselist = isset($classwiseMap[$sectionId]) ? $classwiseMap[$sectionId] : [];
                    }

                    return response()->json([
                        "status" => "success",
                        "success" => true,
                        "data" => [
                            "employee" => $employee,
                            "sections" => $sections
                        ]
                    ]);
                } else {
                    return response()->json([
                        "status" => "success",
                        "success" => true,
                        "data" => [
                            "employee" => $employee,
                            "sections" => $sections // Even if no class-wise subjects, return sections
                        ]
                    ]);
                }
            } else {
                return response()->json([
                    "status" => "failed",
                    "success" => false,
                    "message" => "First assign the class to teacher and then choose subject",
                    "data" => []
                ]);
            }
        } else {
            // Employee not found
            return response()->json([
                "status" => "failed",
                "success" => false,
                "message" => "Whoops! no record found",
                "data" => []
            ]);
        }
    }


	public function index(Request $request)
    {
		$search = $request->search;
		$limit = $request->limit;
		$page = $request->page;
		$order = $request->order;
		$order_by = $request->orderBy;

		$offset = ($page-1)*$limit;

		$query = Employee::leftJoin('emp_subjects as es','employees.id','=','es.emp_id')
		->leftjoin("subject_master as sb",DB::raw('FIND_IN_SET(sb.subjectId,es.sub_id)'),">",DB::raw("'0'"))
		->leftJoin("class_wise_sub_desc as cw",function($join){
            $join->on("cw.csId","=","es.cs_id")
                ->on("cw.subjectId","=","sb.subjectId");
        })
		->leftjoin("class_master as cl",DB::raw('FIND_IN_SET(cl.classId,employees.class_set)'),">",DB::raw("'0'"))
		->leftjoin("course_master as cm",DB::raw('FIND_IN_SET(cm.courseId,cl.courseId)'),">",DB::raw("'0'"))
		->leftjoin("section_master as sm",DB::raw('FIND_IN_SET(sm.sectionId,employees.section_set)'),">",DB::raw("'0'"))
		->selectRaw("count(DISTINCT employees.id) as row_count")
        ->whereNotNull('cl.classId')
        ->whereNotNull('cm.courseId')
        ->whereNotNull('sm.sectionId');

		if($search !='')
		{
			$query->where(function($q) use ($search) {
				 $q->where('employees.emp_name', 'like', '%'.$search.'%')
				   ->orWhere('employees.emp_no', 'like', '%'.$search.'%');
				   //->orWhere('cm.courseName', 'like', '%'.$search.'%');
			});
		}

		$records = $query->where('employees.status',1)->get();

		$emp_query = Employee::leftJoin('emp_subjects as es','employees.id','=','es.emp_id')
		->leftjoin("subject_master as sb",DB::raw('FIND_IN_SET(sb.subjectId,es.sub_id)'),">",DB::raw("'0'"))
		->leftJoin("class_wise_sub_desc as cw",function($join){
            $join->on("cw.csId","=","es.cs_id")
                ->on("cw.subjectId","=","sb.subjectId");
        })
		->leftjoin("class_master as cl",DB::raw('FIND_IN_SET(cl.classId,employees.class_set)'),">",DB::raw("'0'"))
		->leftjoin("course_master as cm",DB::raw('FIND_IN_SET(cm.courseId,cl.courseId)'),">",DB::raw("'0'"))
		->leftjoin("section_master as sm",DB::raw('FIND_IN_SET(sm.sectionId,employees.section_set)'),">",DB::raw("'0'"))
		->selectRaw("employees.id,employees.emp_name,employees.emp_no,GROUP_CONCAT(DISTINCT IFNULL(cl.className,'N/A')) as class_list,GROUP_CONCAT(DISTINCT IFNULL(cm.courseName,'N/A')) as course_list,GROUP_CONCAT(DISTINCT IFNULL(sm.sectionName,'N/A')) as section_list,IFNULL(group_concat(DISTINCT concat(sb.subjectName,':',cw.id)),'N/A') as sub_list,IFNULL(group_concat(DISTINCT concat(CASE WHEN cw.compulsary = 1 THEN 'comp' WHEN cw.elective = 1 THEN 'elec' WHEN cw.addition = 1 THEN 'ado' ELSE 'N/A' END,':',cw.id )),'N/A') AS sub_type")
        ->whereNotNull('cl.classId')
        ->whereNotNull('cm.courseId')
        ->whereNotNull('sm.sectionId');

		if($search !='')
		{
			$emp_query->where(function($q) use ($search) {
				 $q->where('employees.emp_name', 'like', '%'.$search.'%')
				   ->orWhere('employees.emp_no', 'like', '%'.$search.'%');
				   //->orWhere('cm.courseName', 'like', '%'.$search.'%');
			});
		}

		if($order_by !='')
		{
			$emp_query->orderBy($order_by,$order);
		}

		$emp_query->where('employees.status',1);
		$employees = $emp_query->groupBy('employees.id')->offset($offset)->limit($limit)->get();

        if(count($employees) > 0)
		{
			$response_arr = array('data'=>$employees,'total'=>$records[0]->row_count);
            return response()->json(["status" => "successed", "success" => true,"data" => $response_arr]);
        }
        else {
			$response_arr = array('data'=>[],'total'=>0);
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found","data" => $response_arr]);
        }

    }

	public function add(Request $request)
	{
		$inputs=$request->all();
		$lists=$request->sub_set;

		$id_arr=$class_arr=$section_arr=$assign_arr=array();

		foreach($lists AS $k=>$v)
		{
			array_push($id_arr,$k);
		}

		$classwise=ClasswiseSubject::whereIn('id',$id_arr)->get();

		foreach($classwise AS $cw)
		{
			if(!in_array($cw->classId,$class_arr))
			{
				array_push($class_arr,(int)$cw->classId);
			}

			if(!in_array($cw->sectionId,$section_arr))
			{
				array_push($section_arr,(int)$cw->sectionId);
			}
		}

		$rules=[
			'employee_name' => 'required',
			'employee_no' => 'required|unique:employees,emp_no',
			'date_join' => 'required|date',
			'email'	=>'required|email|unique:employees',
			'mobile' =>'required',
		];

		$fields = [
			'employee_name' => 'Employee Name',
			'employee_no' => 'Employee No.',
			'date_join' => 'Date of Joning',
			'email' => 'Email ID',
			'mobile' => 'Mobile No.',
		];

		$messages = [
			'required' => 'The :attribute field is required.',
		];

		$validator = Validator::make($inputs, $rules, $messages, $fields);

        if ($validator->fails()) {
			$errors=$validator->errors();
			$response_arr=array("status"=>"failed","message"=>"Please fill required fields!!","errors"=>$errors);
        }
		else if(count($id_arr)==0)
		{
			$response_arr=array("status"=>"failed","message"=>"Please Select Subject","errors"=>"");
		}
		else
		{
			$fiscal_yr=Helper::getFiscalYear(date('m'));
			$fiscal_arr=explode(':',$fiscal_yr);
			$fiscalYear=SessionMaster::where('session_start',$fiscal_arr[0])->where('session_end',$fiscal_arr[1])->get();
			$fiscal_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0;

			$school_id=empty($request->school_id)?0:$request->school_id;

			$insert_arr = array(
				'emp_name' => $request->employee_name,
				'emp_no' => $request->employee_no,
				'doj' => $request->date_join,
				'email' => $request->email,
				'mobile' => $request->mobile,
				'class_set' => implode(',',$class_arr),
				'section_set' => implode(',',$section_arr),
				'session_id' => $fiscal_id,
				'school_id' =>$school_id,
				'status' =>1,
			);

			$emp = Employee::create($insert_arr);

			if($emp->id)
			{
				foreach($lists AS $k=>$v)
				{
					$insert_arr=array(
						'emp_id'=>$emp->id,
						'cs_id'=>$k,
						'sub_id'=>$v,
					);

					array_push($assign_arr,$insert_arr);
				}

				EmployeeSubject::insert($assign_arr);

				$message="Details saved successfully";
				$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data"=>$emp);
			}
			else
			{
				$message="could not saved!!";
				$response_arr=array("status"=>'failed',"success"=>false,"message"=>$message,"errors"=>[],"data"=>[]);
			}

		}
		return response()->json($response_arr);
	}

	public function edit($id)
	{
		$info = Employee::leftJoin('emp_subjects as es','employees.id','=','es.emp_id')
				->leftjoin("subject_master as sb",DB::raw('FIND_IN_SET(sb.subjectId,es.sub_id)'),">",DB::raw("'0'"))
				->leftJoin("class_wise_sub_desc as cw",function($join){
					$join->on("cw.csId","=","es.cs_id")
						->on("cw.subjectId","=","sb.subjectId");
				})
				->selectRaw("count(*) as row_count")
				->where('employees.status',1)
				->where('employees.id',$id)
				->get();

		if($info[0]->row_count > 0)
		{
			 $record = Employee::leftJoin('emp_subjects as es','employees.id','=','es.emp_id')
				->leftjoin("subject_master as sb",DB::raw('FIND_IN_SET(sb.subjectId,es.sub_id)'),">",DB::raw("'0'"))
				->leftJoin("class_wise_sub_desc as cw",function($join){
					$join->on("cw.csId","=","es.cs_id")
						->on("cw.subjectId","=","sb.subjectId");
				})
				->selectRaw("employees.id,employees.emp_name,employees.emp_no,employees.mobile,employees.email,employees.doj,IFNULL(group_concat(DISTINCT concat(sb.subjectId,':',cw.csId)),'N/A') as sub_list")
				->where('employees.status',1)
				->where('employees.id',$id)
				->get();

			$response_arr = array("status" => "successed", "success" => true, "message" => "Assigned Subject record found","data" =>$record);
        }
        else {
			$response_arr = array("status" => "failed", "success" => false, "message" => "Whoops! no record found","data" =>[]);
        }

		return response()->json($response_arr);
	}

   public function update(Request $request,$id)
   {
	   $inputs=$request->all();
    //    dd($inputs);
	   $lists=$request->sub_set;

	   $id_arr=$class_arr=$section_arr=$assign_arr=array();

	   foreach($lists AS $k=>$v)
	   {
		  array_push($id_arr,$k);
   	   }

	   $info = Employee::where('id',$id)->get();

	   if(count($info)>0)
	   {
		    $num_rule=($info[0]->emp_no==$request->employee_no)?'required':'required|unique:employees,emp_no';
			$email_rule=($info[0]->email==$request->email)?'required':'required|email|unique:employees';

			$rules=[
				'employee_name' =>'required',
				'employee_no' =>$num_rule,
				'date_join' =>'required|date',
				'email'	=>$email_rule,
				'mobile' =>'required',
			];

			$fields = [
				'employee_name' => 'Employee Name',
				'employee_no' => 'Employee No.',
				'date_join' => 'Date of Joning',
				'email' => 'Email ID',
				'mobile' => 'Mobile No.',
			];

			$messages = array('required'=>'The :attribute field is required.');

			$validator = Validator::make($inputs,$rules,$messages,$fields);

			if ($validator->fails()) {
				$errors=$validator->errors();
				$response_arr=array("status"=>"failed","success"=>false,"message"=>"Please fill required fields!!","errors"=>$errors);
			}
			else if(count($id_arr)==0)
			{
				$response_arr=array("status"=>"failed","message"=>"Please Select Subject","errors"=>"");
			}
			else
			{
				$classwise=ClasswiseSubject::whereIn('id',$id_arr)->get();

				foreach($classwise AS $cw)
				{
					if(!in_array($cw->classId,$class_arr))
					{
						array_push($class_arr,(int)$cw->classId);
					}

					if(!in_array($cw->sectionId,$section_arr))
					{
						array_push($section_arr,(int)$cw->sectionId);
					}
				}

				$update_arr=array(
					'emp_name' => $request->employee_name,
					'emp_no' => $request->employee_no,
					'doj' => $request->date_join,
					'email' => $request->email,
					'mobile' => $request->mobile,
					'class_set' => implode(',',$class_arr),
					'section_set' => implode(',',$section_arr),
				);

				foreach($lists AS $k=>$v)
			    {
					$insert_arr=array(
						'emp_id'=>$id,
						'cs_id'=>$k,
						'sub_id'=>$v,
					);
					array_push($assign_arr,$insert_arr);
			    }

				EmployeeSubject::where('emp_id',$id)->delete();
				EmployeeSubject::insert($assign_arr);

				$update=Employee::where('id',$id)->update($update_arr);

				if($update)
				{
					$message="Details updated successfully";
					$response_arr=array("status"=>'successed',"success"=>true,"errors"=>[],"message"=>$message,"data" =>$update);
				}
				else
				{
					$message="could not update!!";
					$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);
				}
			}
		}
		else
		{
			$response_arr = array("status"=>"failed","success"=>false,"errors"=>[],"message"=>"Whoops! no record found","data"=>[]);
		}

	   return response()->json($response_arr);

   }





}
