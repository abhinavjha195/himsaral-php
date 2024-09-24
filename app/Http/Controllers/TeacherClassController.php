<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

use App\Models\SessionMaster;
use App\Models\SectionMaster;
use App\Models\Employee;
use Helper;

class TeacherClassController extends Controller
{
	public function __construct()
    {
       DB::statement("SET SQL_MODE=''");
    }

	// public function index(Request $request)
    // {
	// 	$search = $request->search;
	// 	$limit = $request->limit;
	// 	$page = $request->page;
	// 	$order = $request->order;
	// 	$order_by = $request->orderBy;

	// 	$offset = ($page-1)*$limit;

	// 	$query = Employee::leftjoin("class_master as cl",DB::raw('FIND_IN_SET(cl.classId,employees.class_set)'),">",DB::raw("'0'"))->leftjoin("course_master as cm",DB::raw('FIND_IN_SET(cm.courseId,cl.courseId)'),">",DB::raw("'0'"))
	// 	->leftjoin("section_master as sm",DB::raw('FIND_IN_SET(sm.sectionId,employees.section_set)'),">",DB::raw("'0'"))
	// 	->selectRaw("count(DISTINCT employees.id) as row_count");

	// 	if($search !='')
	// 	{
	// 		$query->where(function($q) use ($search) {
	// 			 $q->where('employees.emp_name', 'like', '%'.$search.'%')
	// 			   ->orWhere('employees.emp_no', 'like', '%'.$search.'%');
	// 			   //->orWhere('cm.courseName', 'like', '%'.$search.'%');
	// 		});
	// 	}

	// 	$records = $query->where('employees.status',1)->get();

	// 	$emp_query = Employee::leftjoin("class_master as cl",DB::raw('FIND_IN_SET(cl.classId,employees.class_set)'),">",DB::raw("'0'"))->leftjoin("course_master as cm",DB::raw('FIND_IN_SET(cm.courseId,cl.courseId)'),">",DB::raw("'0'"))
	// 	->leftjoin("section_master as sm",DB::raw('FIND_IN_SET(sm.sectionId,employees.section_set)'),">",DB::raw("'0'"))
	// 	->selectRaw("employees.id,employees.emp_name,employees.emp_no,GROUP_CONCAT(DISTINCT IFNULL(cl.className,'N/A') ORDER BY cl.classId ASC) as class_list,GROUP_CONCAT(DISTINCT IFNULL(cm.courseName,'N/A') ORDER BY cm.courseId ASC) as course_list,GROUP_CONCAT(DISTINCT IFNULL(sm.sectionName,'N/A') ORDER BY sm.sectionId ASC) as section_list");

	// 	if($search !='')
	// 	{
	// 		$emp_query->where(function($q) use ($search) {
	// 			 $q->where('employees.emp_name', 'like', '%'.$search.'%')
	// 			   ->orWhere('employees.emp_no', 'like', '%'.$search.'%');
	// 			   //->orWhere('cm.courseName', 'like', '%'.$search.'%');
	// 		});
	// 	}
	// 	if($order_by !='')
	// 	{
	// 		$emp_query->orderBy($order_by,$order);
	// 	}

	// 	$emp_query->where('employees.status',1);
	// 	$employees = $emp_query->groupBy('employees.id')->offset($offset)->limit($limit)->get();

    //     if(count($employees) > 0)
	// 	{
	// 		$response_arr = array('data'=>$employees,'total'=>$records[0]->row_count);
    //         return response()->json(["status" => "successed", "success" => true,"data" => $response_arr]);
    //     }
    //     else {
	// 		$response_arr = array('data'=>[],'total'=>0);
    //         return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found","data" => $response_arr]);
    //     }

    // }

    public function index(Request $request)
    {
		$search = $request->search;
		$limit = $request->limit;
		$page = $request->page;
		$order = $request->order;
		$order_by = $request->orderBy;

		$offset = ($page-1)*$limit;

        $query = Employee::leftJoin("class_master as cl", DB::raw('FIND_IN_SET(cl.classId,employees.class_set)'), ">", DB::raw("'0'"))
        ->leftJoin("course_master as cm", DB::raw('FIND_IN_SET(cm.courseId,cl.courseId)'), ">", DB::raw("'0'"))
        ->leftJoin("section_master as sm", DB::raw('FIND_IN_SET(sm.sectionId,employees.section_set)'), ">", DB::raw("'0'"))
        ->selectRaw("count(DISTINCT employees.id) as row_count");

		if($search !='')
		{
			$query->where(function($q) use ($search) {
				 $q->where('employees.emp_name', 'like', '%'.$search.'%')
				   ->orWhere('employees.emp_no', 'like', '%'.$search.'%');
				   //->orWhere('cm.courseName', 'like', '%'.$search.'%');
			});
		}

		$records = $query->where('employees.status',1)->get();

		$emp_query = Employee::leftJoin("class_master as cl", function ($join) {
            $join->on(DB::raw('FIND_IN_SET(cl.classId, employees.class_set)'), '>', DB::raw('0'))
                 ->whereIn('cl.classId', function ($query) {
                     $query->select('classId')
                           ->from('section_master')
                           ->whereRaw('FIND_IN_SET(section_master.sectionId, employees.section_set) > 0');
                 });
        })
        ->leftJoin("course_master as cm", DB::raw('FIND_IN_SET(cm.courseId, cl.courseId)'), '>', DB::raw('0'))
        ->leftJoin("section_master as sm", function ($join) {
            $join->on(DB::raw('FIND_IN_SET(sm.sectionId, employees.section_set)'), '>', DB::raw('0'))
                 ->on('sm.classId', '=', 'cl.classId');
        })
        ->selectRaw("employees.id,
                     employees.emp_name,
                     employees.emp_no,
                     GROUP_CONCAT(DISTINCT IFNULL(cl.className, 'N/A') ORDER BY cl.classId ASC) as class_list,
                     GROUP_CONCAT(DISTINCT IFNULL(cm.courseName, 'N/A') ORDER BY cm.courseId ASC) as course_list,
                     GROUP_CONCAT(DISTINCT IFNULL(CONCAT(sm.sectionName, ':', sm.classId), 'N/A') ORDER BY sm.sectionId ASC) as section_list");

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
		$class_arr=empty($request->class_list)?[]:explode(',',$request->class_list);
		$school_id=empty($request->school_id)?0:$request->school_id;

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
		else if(count($class_arr)==0)
		{
			$response_arr=array("status"=>"failed","message"=>"Please Select Course","errors"=>"");
		}
		else
		{
			$fiscal_yr=Helper::getFiscalYear(date('m'));
			$fiscal_arr=explode(':',$fiscal_yr);
			$fiscalYear=SessionMaster::where('session_start',$fiscal_arr[0])->where('session_end',$fiscal_arr[1])->get();
			$fiscal_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0;

			$insert_arr = array(
				'emp_name' => $request->employee_name,
				'emp_no' => $request->employee_no,
				'doj' => $request->date_join,
				'email' => $request->email,
				'mobile' => $request->mobile,
				'class_set' => $request->class_list,
				'section_set' => $request->section_list,
				'session_id' => $fiscal_id,
				'school_id' =>$school_id,
				'status' =>1,
			);

			$emp = Employee::create($insert_arr);

			if($emp->id)
			{
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
		$info = Employee::leftjoin("class_master as cl",DB::raw('FIND_IN_SET(cl.classId,employees.class_set)'),">",DB::raw("'0'"))->leftjoin("course_master as cm",DB::raw('FIND_IN_SET(cm.courseId,cl.courseId)'),">",DB::raw("'0'"))
				->leftjoin("section_master as sm",DB::raw('FIND_IN_SET(sm.sectionId,employees.section_set)'),">",DB::raw("'0'"))->selectRaw("count(*) as row_count")
				->where('employees.status',1)
				->where('employees.id',$id)
				->get();

		if($info[0]->row_count > 0)
		{
			 $record = Employee::leftjoin("class_master as cl",DB::raw('FIND_IN_SET(cl.classId,employees.class_set)'),">",DB::raw("'0'"))->leftjoin("course_master as cm",DB::raw('FIND_IN_SET(cm.courseId,cl.courseId)'),">",DB::raw("'0'"))
			->leftjoin("section_master as sm",DB::raw('FIND_IN_SET(sm.sectionId,employees.section_set)'),">",DB::raw("'0'"))
			->selectRaw("employees.id,employees.emp_name,employees.emp_no,employees.doj,employees.email,employees.mobile,GROUP_CONCAT(DISTINCT IFNULL(cl.classId,'N/A')) as class_list,GROUP_CONCAT(DISTINCT IFNULL(cm.courseId,'N/A')) as course_list,GROUP_CONCAT(DISTINCT IFNULL(sm.sectionId,'N/A')) as section_list")
			->where('employees.status',1)
			->where('employees.id',$id)
			->get();
            // dd($record);

			$response_arr = array("status" => "successed", "success" => true, "message" => "Assigned Class record found","data" =>$record);
        }
        else {
			$response_arr = array("status" => "failed", "success" => false, "message" => "Whoops! no record found","data" =>[]);
        }

		return response()->json($response_arr);
	}

    public function update(Request $request,$id)
    {
        $inputs=$request->all();
        $sectionIds = explode(',', $request->section_list);
        //    $class_arr=empty($request->class_list)?[]:explode(',',$request->class_list);
            $class_arr = SectionMaster::whereIn('sectionId', $sectionIds)
                        ->pluck('classId')
                        ->unique()
                        ->toArray();
        //    dd($class_arr);
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
                else if(count($class_arr)==0)
                {
                    $response_arr=array("status"=>"failed","message"=>"Please Select Course","errors"=>"");
                }
                else
                {
                    $update_arr=array(
                        'emp_name' => $request->employee_name,
                        'emp_no' => $request->employee_no,
                        'doj' => $request->date_join,
                        'email' => $request->email,
                        'mobile' => $request->mobile,
                        // 'class_set' => $request->class_list,
                        'section_set' => $request->section_list,
                        'class_set' => implode(',', $class_arr)
                    );

                    $update=Employee::where('id',$id)->update($update_arr);
                    // dd($update);

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
                $response_arr = array("status" => "failed", "success" => false, "message" => "Whoops! no record found","data" =>[]);
            }

        return response()->json($response_arr);

    }

    // old MD
// 	public function edit($id)
// 	{
// 		$info = Employee::leftjoin("class_master as cl",DB::raw('FIND_IN_SET(cl.classId,employees.class_set)'),">",DB::raw(        "'0'"))->leftjoin("course_master as cm",DB::raw('FIND_IN_SET(cm.courseId,cl.courseId)'),">",DB::raw("'0'"))
// 				->leftjoin("section_master as sm",DB::raw('FIND_IN_SET(sm.sectionId,employees.section_set)'),">",DB::raw("'0'"))->selectRaw("count(*) as row_count")
// 				->where('employees.status',1)
// 				->where('employees.id',$id)
// 				->get();

// 		if($info[0]->row_count > 0)
// 		{
// 			 $record = Employee::leftjoin("class_master as cl",DB::raw('FIND_IN_SET(cl.classId,employees.class_set)'),">",DB::raw("'0'"))->leftjoin("course_master as cm",DB::raw('FIND_IN_SET(cm.courseId,cl.courseId)'),">",DB::raw("'0'"))
// 			->leftjoin("section_master as sm",DB::raw('FIND_IN_SET(sm.sectionId,employees.section_set)'),">",DB::raw("'0'"))
// 			->selectRaw("employees.id,employees.emp_name,employees.emp_no,employees.doj,employees.email,employees.mobile,GROUP_CONCAT(DISTINCT IFNULL(cl.classId,'N/A')) as class_list,GROUP_CONCAT(DISTINCT IFNULL(cm.courseId,'N/A')) as course_list,GROUP_CONCAT(DISTINCT IFNULL(sm.sectionId,'N/A')) as section_list")
// 			->where('employees.status',1)
// 			->where('employees.id',$id)
// 			->get();

// 			$response_arr = array("status" => "successed", "success" => true, "message" => "Assigned Class record found","data" =>$record);
//         }
//         else {
// 			$response_arr = array("status" => "failed", "success" => false, "message" => "Whoops! no record found","data" =>[]);
//         }

// 		return response()->json($response_arr);
// 	}

//    public function update(Request $request,$id)
//    {
// 	   $inputs=$request->all();
// 	   $class_arr=empty($request->class_list)?[]:explode(',',$request->class_list);
// 	   $info = Employee::where('id',$id)->get();

// 	   if(count($info)>0)
// 	   {
// 		    $num_rule=($info[0]->emp_no==$request->employee_no)?'required':'required|unique:employees,emp_no';
// 			$email_rule=($info[0]->email==$request->email)?'required':'required|email|unique:employees';

// 			$rules=[
// 				'employee_name' =>'required',
// 				'employee_no' =>$num_rule,
// 				'date_join' =>'required|date',
// 				'email'	=>$email_rule,
// 				'mobile' =>'required',
// 			];

// 			$fields = [
// 				'employee_name' => 'Employee Name',
// 				'employee_no' => 'Employee No.',
// 				'date_join' => 'Date of Joning',
// 				'email' => 'Email ID',
// 				'mobile' => 'Mobile No.',
// 			];

// 			$messages = array('required'=>'The :attribute field is required.');

// 			$validator = Validator::make($inputs,$rules,$messages,$fields);

// 			if ($validator->fails()) {
// 				$errors=$validator->errors();
// 				$response_arr=array("status"=>"failed","success"=>false,"message"=>"Please fill required fields!!","errors"=>$errors);
// 			}
// 			else if(count($class_arr)==0)
// 			{
// 				$response_arr=array("status"=>"failed","message"=>"Please Select Course","errors"=>"");
// 			}
// 			else
// 			{
// 				$update_arr=array(
// 					'emp_name' => $request->employee_name,
// 					'emp_no' => $request->employee_no,
// 					'doj' => $request->date_join,
// 					'email' => $request->email,
// 					'mobile' => $request->mobile,
// 					// 'class_set' => $request->class_list,
// 					'section_set' => $request->section_list,
// 				);

// 				$update=Employee::where('id',$id)->update($update_arr);

// 				if($update)
// 				{
// 					$message="Details updated successfully";
// 					$response_arr=array("status"=>'successed',"success"=>true,"errors"=>[],"message"=>$message,"data" =>$update);
// 				}
// 				else
// 				{
// 					$message="could not update!!";
// 					$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);
// 				}
// 			}
// 		}
// 		else
// 		{
// 			$response_arr = array("status" => "failed", "success" => false, "message" => "Whoops! no record found","data" =>[]);
// 		}

// 	   return response()->json($response_arr);

//    }


    public function employeeIds()
    {
        $fiscal_yr=Helper::getFiscalYear(date('m'));
        $fiscal_arr=explode(':',$fiscal_yr);
        $fiscalYear=SessionMaster::where('session_start',$fiscal_arr[0])->where('session_end',$fiscal_arr[1])->get();
        $session_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0;

        $employees = Employee::where('session_id',$session_id)->orderBy('id','ASC')->get();

        if(count($employees) > 0)
		{
            return response()->json(["status" => "successed", "success" => true,"data" => $employees]);
        }
        else {
			$response_arr = array('data'=>[],'total'=>0);
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found","data" => $response_arr]);
        }

    }

}
