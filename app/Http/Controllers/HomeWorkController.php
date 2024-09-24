<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

use App\Models\ClasswiseSubject;
use App\Models\SubjectMaster;
use App\Models\SessionMaster;
use App\Models\Homework;
use Carbon\Carbon;
use Helper;
use Image;

class HomeWorkController extends Controller
{
	public function __construct()
    {
       DB::statement("SET SQL_MODE=''");
    }

	public function getDetail($course_id,$class_id,$section_id = null)
	{

		if ($section_id != '') {

			$info = ClasswiseSubject::leftJoin('course_master as cm','classwisesubject.courseId','=','cm.courseId')
					->leftJoin('class_master as cs','classwisesubject.classId','=','cs.classId')
					->leftJoin('section_master as sc','classwisesubject.sectionId','=','sc.sectionId')
					->leftJoin('class_wise_sub_desc as cd','classwisesubject.id','=','cd.csId')
					->leftJoin('subject_master as sm','cd.subjectId','=','sm.subjectId')
					->leftJoin("emp_subjects as es",function($join){
							$join->on("cd.csId","=","es.cs_id")
							->on(DB::raw('FIND_IN_SET(cd.subjectId,es.sub_id)'),">",DB::raw("'0'"));
					})
					->leftJoin('employees as em','es.emp_id','=','em.id')
					->selectRaw('count(distinct sm.subjectId) as rec_count')
					->where('cm.courseId',$course_id)
					->where('cs.classId',$class_id)
					->where('sc.sectionId',$section_id)
					->get();

        } else {

			$info = ClasswiseSubject::leftJoin('course_master as cm','classwisesubject.courseId','=','cm.courseId')
					->leftJoin('class_master as cs','classwisesubject.classId','=','cs.classId')
					->leftJoin('section_master as sc','classwisesubject.sectionId','=','sc.sectionId')
					->leftJoin('class_wise_sub_desc as cd','classwisesubject.id','=','cd.csId')
					->leftJoin('subject_master as sm','cd.subjectId','=','sm.subjectId')
					->leftJoin("emp_subjects as es",function($join){
							$join->on("cd.csId","=","es.cs_id")
							->on(DB::raw('FIND_IN_SET(cd.subjectId,es.sub_id)'),">",DB::raw("'0'"));
					})
					->leftJoin('employees as em','es.emp_id','=','em.id')
					->selectRaw('count(distinct sm.subjectId) as rec_count')
					->where('cm.courseId',$course_id)
					->where('cs.classId',$class_id)
					->get();
        }

		if($info[0]->rec_count > 0)
		{
			if ($section_id != '') {

					$record = ClasswiseSubject::leftJoin('course_master as cm','classwisesubject.courseId','=','cm.courseId')
					->leftJoin('class_master as cs','classwisesubject.classId','=','cs.classId')
					->leftJoin('section_master as sc','classwisesubject.sectionId','=','sc.sectionId')
					->leftJoin('class_wise_sub_desc as cd','classwisesubject.id','=','cd.csId')
					->leftJoin('subject_master as sm','cd.subjectId','=','sm.subjectId')
					->leftJoin("emp_subjects as es",function($join){
							$join->on("cd.csId","=","es.cs_id")
							->on(DB::raw('FIND_IN_SET(cd.subjectId,es.sub_id)'),">",DB::raw("'0'"));
					})
					->leftJoin('employees as em','es.emp_id','=','em.id')
					->selectRaw("sm.subjectId,sm.subjectName,ifnull(group_concat(distinct em.id),'N/A') as emp_set,ifnull(group_concat(distinct em.emp_name),'N/A') as emp_list,ifnull(group_concat(distinct em.emp_image),'N/A') as img_set")
					->where('cm.courseId',$course_id)
					->where('cs.classId',$class_id)
					->where('sc.sectionId',$section_id)
					->groupBy('sm.subjectId')
					->orderBy('sm.subjectId','asc')
					->get();

			} else {

					$record = ClasswiseSubject::leftJoin('course_master as cm','classwisesubject.courseId','=','cm.courseId')
					->leftJoin('class_master as cs','classwisesubject.classId','=','cs.classId')
					->leftJoin('section_master as sc','classwisesubject.sectionId','=','sc.sectionId')
					->leftJoin('class_wise_sub_desc as cd','classwisesubject.id','=','cd.csId')
					->leftJoin('subject_master as sm','cd.subjectId','=','sm.subjectId')
					->leftJoin("emp_subjects as es",function($join){
							$join->on("cd.csId","=","es.cs_id")
							->on(DB::raw('FIND_IN_SET(cd.subjectId,es.sub_id)'),">",DB::raw("'0'"));
					})
					->leftJoin('employees as em','es.emp_id','=','em.id')
					->selectRaw("sm.subjectId,sm.subjectName,ifnull(group_concat(distinct em.id),'N/A') as emp_set,ifnull(group_concat(distinct em.emp_name),'N/A') as emp_list,ifnull(group_concat(distinct em.emp_image),'N/A') as img_set")
					->where('cm.courseId',$course_id)
					->where('cs.classId',$class_id)
					->groupBy('sm.subjectId')
					->orderBy('sm.subjectId','asc')
					->get();

			}

			$response_arr = array("status" => "successed", "success" => true, "message" => "Subject record found","data" =>$record);
        }
        else {
			$response_arr = array("status" => "failed", "success" => false, "message" => "Whoops! no record found","data" =>[]);
        }

		return response()->json($response_arr);
	}

	public function add(Request $request)
	{
		$inputs=$request->all();
		$image_rule1=$image_rule2="";
		$insert_arr=$file_arr=array();

		$class_id=$request->class_id;
		$school_id=$request->school_id;
		$assign_date=$request->assign_date;
		$desc_arr=$request->descriptions;

		$section_id=empty($request->section_id)?0:$request->section_id;
		$id_arr=empty($request->subject_arr)?[]:explode(',',$request->subject_arr);

		$fiscal_yr=Helper::getFiscalYear(date('m'));
		$fiscal_arr=explode(':',$fiscal_yr);
		$fiscalYear=SessionMaster::where('session_start',$fiscal_arr[0])->where('session_end',$fiscal_arr[1])->get();
		$fiscal_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0;

		$chk_query=Homework::select(DB::raw('count(*) as record_count'))->where('class_id',$class_id);

		if($section_id !='')
		{
			$chk_query->where('section_id',$section_id);
		}

		$checkExist=$chk_query->where('session_id',$fiscal_id)->where('assign_date',$assign_date)->get();

		if($request->file('attachments')!=null)
		{
			$image_rule1='required';
			$image_rule2 = 'required|mimes:jpeg,png,jpg,pdf,docx,doc|max:5120';
		}

		$rules=[
			'assign_date' => 'required|date',
			'attachments' => $image_rule1,
			'attachments.*' => $image_rule2,
		];

		$fields = [
			'assign_date' => 'Assign Date',
			'attachments' => 'Attachment',
			'attachments.*' => 'Attachments',
		];

		$messages = [
			'required' => 'The :attribute field is required.',
		];

		$validator = Validator::make($inputs,$rules,$messages,$fields);

        if ($validator->fails()) {
			$errors=$validator->errors();
			$response_arr=array("status"=>"failed","message"=>"Please fill required fields!!","errors"=>$errors);
        }
		else if(count($id_arr)==0)
		{
			$response_arr=array("status"=>"failed","message"=>"No subject found for homework!!","errors"=>"");
		}
		else if($checkExist[0]->record_count >0)
		{
			$response_arr=array("status"=>"failed","message"=>'Homework for that course on that date already assigned!!',"errors"=>"");
		}
		else
		{
			if($request->file('attachments')!=null)
			{
				foreach($request->file('attachments') AS $key=>$image)
				{
					$extn=$image->getClientOriginalExtension();
					$file_name = time().rand(3, 9).'.'.$extn;
					$destinationPath = public_path('/uploads/home_work/');

					if($extn=='doc' || $extn=='docx' || $extn=='pdf')
					{
						$image->move($destinationPath,$file_name);
					}
					else
					{
						$imageDimensions = getimagesize($image);

						$width = $imageDimensions[0];
						$height = $imageDimensions[1];

						$new_width = $this->setDimension($width);
						$new_height = $this->setDimension($height);

						$imgFile = Image::make($image->getRealPath());

						$imgFile->resize($new_height,$new_width,function($constraint){
							$constraint->aspectRatio();
						})->save($destinationPath.'/'.$file_name);

					}


					$file_arr[$key] = $file_name;

				}

			}

			foreach($id_arr AS $k=>$v)
			{
				$assign_arr=array(
					'class_id'=>$class_id,
					'section_id'=>$section_id,
					'school_id'=>$school_id,
					'session_id'=>$fiscal_id,
					'subject_id'=>$v,
					'assign_date'=>$assign_date,
					'description'=>is_null($desc_arr[$k])?'':$desc_arr[$k],
					'attachment'=>array_key_exists($k,$file_arr)?$file_arr[$k]:'',
				);

				array_push($insert_arr,$assign_arr);
			}

			$home = Homework::insert($insert_arr);

			if($home)
			{
				$message="Home work assigned successfully";
				$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data"=>$home);
			}
			else
			{
				$message="could not saved!!";
				$response_arr=array("status"=>'failed',"success"=>false,"message"=>$message,"errors"=>[],"data"=>[]);
			}

		}

		return response()->json($response_arr);

	}

	public function getSubjectList($course_id,$class_id,$section_id=null)
    {
        if ($section_id != '') {

			$subjects = ClasswiseSubject::leftJoin('class_wise_sub_desc as cw','classwisesubject.id','=','cw.csId')
			->leftJoin('subject_master as sb','cw.subjectId','=','sb.subjectId')
			->select('sb.subjectId','sb.subjectName')
			->where('classwisesubject.courseId',$course_id)
			->where('classwisesubject.classId',$class_id)
			->where('classwisesubject.sectionId',$section_id)
			->where('sb.status',1)
			->groupBy('sb.subjectId')
			->get();

        } else {
            $subjects = ClasswiseSubject::leftJoin('class_wise_sub_desc as cw','classwisesubject.id','=','cw.csId')
			->leftJoin('subject_master as sb','cw.subjectId','=','sb.subjectId')
			->select('sb.subjectId','sb.subjectName')
			->where('classwisesubject.courseId',$course_id)
			->where('classwisesubject.classId',$class_id)
			->where('sb.status',1)
			->groupBy('sb.subjectId')
			->get();
        }

        if (count($subjects) > 0) {
            return response()->json(["status" => "successed", "success" => true, "message" => "subject record found", "data" => $subjects]);
        } else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found", "data" => []]);
        }
    }

	public function getAssignment(Request $request)
	{
		$search = $request->search;
		$limit = $request->limit;
		$page = $request->page;
		$order = $request->order;
		$order_by = $request->orderBy;

		$offset = ($page-1)*$limit;

		$class_id = empty($request->class_id)?'':$request->class_id;
		$school_id = empty($request->school_id)?'':$request->school_id;
		$section_id = empty($request->section_id)?'':$request->section_id;
		$subject_id = empty($request->subject_id)?'':$request->subject_id;
		$assign_date = empty($request->assign_date)?'':$request->assign_date;

		$fiscal_yr=Helper::getFiscalYear(date('m'));
		$fiscal_arr=explode(':',$fiscal_yr);
		$fiscalYear=SessionMaster::where('session_start',$fiscal_arr[0])->where('session_end',$fiscal_arr[1])->get();
		$fiscal_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0;

		$query=Homework::leftJoin('class_master as cm','homeworks.class_id','=','cm.classId')
            ->leftJoin('course_master as co','cm.courseId','=','co.courseId')
			->leftJoin('section_master as sc','homeworks.section_id','=','sc.sectionId')
			->leftJoin('subject_master as sm','homeworks.subject_id','=','sm.subjectId')
			->select(DB::raw('count(*) as row_count'));

		if($class_id !='')
		{
			$query->where('homeworks.class_id',$class_id);
		}

		if($section_id !='')
		{
			$query->where('homeworks.section_id',$section_id);
		}

		if($subject_id !='')
		{
			$query->where('homeworks.subject_id',$subject_id);
		}

		if($school_id !='')
		{
			$query->where('homeworks.school_id',$school_id);
		}

		if($fiscal_id !='')
		{
			$query->where('homeworks.session_id',$fiscal_id);
		}

		if($assign_date !='')
		{
			$query->where('homeworks.assign_date',$assign_date);
		}

		if($search !='')
		{
			$query->where(function($q) use ($search) {
				 $q->where('sm.subjectName', 'like', '%'.$search.'%')
				   ->orWhere('homeworks.description', 'like', '%'.$search.'%');
			});
		}

		$records=$query->get();

		$home_query=Homework::leftJoin('class_master as cm','homeworks.class_id','=','cm.classId')
            ->leftJoin('course_master as co','cm.courseId','=','co.courseId')
			->leftJoin('section_master as sc','homeworks.section_id','=','sc.sectionId')
			->leftJoin('subject_master as sm','homeworks.subject_id','=','sm.subjectId')
			->selectRaw("homeworks.id,homeworks.description,cm.className,co.courseName,ifnull(sc.sectionName,'N/A') as section_name,ifnull(sm.subjectName,'N/A') as subject_name,homeworks.attachment");

		if($class_id !='')
		{
			$home_query->where('homeworks.class_id',$class_id);
		}

		if($section_id !='')
		{
			$home_query->where('homeworks.section_id',$section_id);
		}

		if($subject_id !='')
		{
			$home_query->where('homeworks.subject_id',$subject_id);
		}

		if($school_id !='')
		{
			$home_query->where('homeworks.school_id',$school_id);
		}

		if($fiscal_id !='')
		{
			$home_query->where('homeworks.session_id',$fiscal_id);
		}

		if($assign_date !='')
		{
			$home_query->where('homeworks.assign_date',$assign_date);
		}

		if($order_by !='')
		{
			$home_query->orderBy($order_by,$order);
		}

		if($search !='')
		{
			$home_query->where(function($q) use ($search) {
				 $q->where('sm.subjectName', 'like', '%'.$search.'%')
				   ->orWhere('homeworks.description', 'like', '%'.$search.'%');
			});
		}

		$result=$home_query->offset($offset)->limit($limit)->get();

		if(count($result) > 0)
		{
			$response_arr = array('data'=>$result,'total'=>$records[0]->row_count,'query'=>$request->all());
            return response()->json(["status" => "successed", "success" => true,"data" => $response_arr]);
        }
        else {
			$response_arr = array('data'=>[],'total'=>0,'query'=>$request->all());
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found","data" => $response_arr]);
        }

	}

    public function setDimension($dim)
	{
		if($dim>400)
		{
			$new_dim =400;
		}
		else
		{
			$new_dim = $dim;
		}
		return $new_dim;
	}

	public function delete($id)
    {
		$info = Homework::where('id',$id)->get();

        if(count($info)>0)
		{
			$del=Homework::where('id',$id)->delete();
			if($del)
			{
				return response()->json(["status" =>'successed', "success" => true, "message" => "homework deleted successfully","data" => '']);
			}
			else
			{
				return response()->json(["status" =>'failed', "success" => false, "message" => "could not deleted !!","data" => []]);
			}
		}
		else
		{
			return response()->json(["status" => "failed","success" => false,"message" => "Whoops! failed to delete,!!","errors" =>'']);
		}

    }

}
