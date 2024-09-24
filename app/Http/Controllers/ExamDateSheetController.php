<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

use App\Models\Course;
use App\Models\Exam;
use App\Models\ExamSheetMark;
use App\Models\ExamDateSheet;
use App\Models\ExamDateSheetDesc;
use App\Models\StudentMaster;
use DB;

class ExamDateSheetController extends Controller
{
    public function __construct()
    {
        DB::statement("SET SQL_MODE=''");
    }

    public function index(Request $request)
    {
		$search = empty($request->search)?'':$request->search;
		$limit = empty($request->limit)?0:$request->limit;
		$page = empty($request->page)?0:$request->page;
		$order = empty($request->order)?'':$request->order;
		$order_by = empty($request->orderBy)?'':$request->orderBy;
		$offset = ($page-1)*$limit;

		$query1 = ExamDateSheet::leftJoin('exam_date_sheet_desc as ed', 'exam_date_sheet.id', '=', 'ed.row_id')
		->leftJoin('exams', 'exam_date_sheet.exam_id', '=', 'exams.id')
		->leftJoin('course_master as cm', 'exam_date_sheet.course_id', '=', 'cm.courseId')
		->leftJoin('class_master as cs', 'exam_date_sheet.class_id', '=', 'cs.classId')
		->leftJoin('section_master as sm', 'exam_date_sheet.section_id', '=', 'sm.sectionId')

		->leftJoin("classwisesubject as cw",function($join){
            $join->on("cw.courseId","=","exam_date_sheet.course_id")
                 ->on("cw.classId","=","exam_date_sheet.class_id")
				 ->on("cw.sectionId","=","exam_date_sheet.section_id");
        })
		->leftJoin("class_wise_sub_desc as cd",function($join){
            $join->on("cw.id","=","cd.csid")
                 ->on("cd.subjectId","=","ed.sub_id");
        })

		->leftJoin('subject_master as sb','cd.subjectId','=','sb.subjectId')
		->select(DB::raw('count(DISTINCT exam_date_sheet.id) as row_count'));

		if($search !='')
		{
			$query1->where('exams.name', 'like', '%'.$search.'%')
				   ->orWhere('cm.courseName', 'like', '%'.$search.'%');
		}

		$records = $query1->get();

		$query2 = ExamDateSheet::leftJoin('exam_date_sheet_desc as ed', 'exam_date_sheet.id', '=', 'ed.row_id')
		->leftJoin('exams', 'exam_date_sheet.exam_id', '=', 'exams.id')
		->leftJoin('course_master as cm', 'exam_date_sheet.course_id', '=', 'cm.courseId')
		->leftJoin('class_master as cs', 'exam_date_sheet.class_id', '=', 'cs.classId')
		->leftJoin('section_master as sm', 'exam_date_sheet.section_id', '=', 'sm.sectionId')

		->leftJoin("classwisesubject as cw",function($join){
            $join->on("cw.courseId","=","exam_date_sheet.course_id")
                 ->on("cw.classId","=","exam_date_sheet.class_id")
				 ->on("cw.sectionId","=","exam_date_sheet.section_id");
        })
		->leftJoin("class_wise_sub_desc as cd",function($join){
            $join->on("cw.id","=","cd.csid")
                 ->on("cd.subjectId","=","ed.sub_id");
        })

		->leftJoin('subject_master as sb','cd.subjectId','=','sb.subjectId')

		->selectRaw("exam_date_sheet.id,exams.name,cm.courseName,cs.className,IFNULL(sm.sectionName,'') as sec_name,IFNULL(GROUP_CONCAT(sb.subjectName),'') as sub_list,GROUP_CONCAT(CASE WHEN cd.compulsary=1 THEN 'Compulsory' WHEN cd.elective=1 THEN 'Elective' WHEN cd.addition=1 THEN 'Additional' ELSE 'N/A' END) AS sub_type");

		$query2->offset($offset)->limit($limit);

		if($search !='')
		{
			$query2->where('exams.name', 'like', '%'.$search.'%')
				   ->orWhere('cm.courseName', 'like', '%'.$search.'%');
		}

		if($order_by !='')
		{
			$query2->orderBy($order_by,$order);
		}

		$exams = $query2->groupBy('exam_date_sheet.id')->get();

        if(count($exams) > 0)
		{
			$response_arr = array('data'=>$exams,'total'=>$records[0]->row_count);
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
		$subjects=$request->subjects;
		$theories = $request->theories;
		$assessments = $request->assessments;
		$internals = $request->internals;
		$dateset = $request->dateset;

		$rules=[
				'course_id' => 'required',
				'class_id' => 'required',
				'section_id' => 'required',
				'exam_id' => 'required',
				//'max_mark' => 'required',
			];

			$fields = [
				'course_id' => 'Course Name',
				'class_id' => 'Class Name',
				'section_id' => 'Section Name',
				'exam_id' => 'Exam Name',
				//'max_mark' => 'Maximum Marks',
			];

			$messages = [
				'required' => 'The :attribute field is required.',
			];

		$validator = Validator::make($inputs, $rules, $messages, $fields);

        if ($validator->fails()) {
			$errors=$validator->errors();
			$response_arr=array("status"=>"failed","message"=>"Please fill required fields!!","errors"=>$errors);
		    return response()->json($response_arr);
        }
		else if(count($subjects)==0)
		{
			$response_arr=array("status"=>"failed","message"=>"Please select subjects and add them!!","errors"=>[]);
		    return response()->json($response_arr);
		}
		else {
            // Ensure $section_ids is an array
            $section_ids = is_array($request->section_id) ? $request->section_id : [$request->section_id];
            $all_responses = [];

            foreach ($section_ids as $section_id) {
                $insert_arr = [
                    'course_id' => $request->course_id,
                    'class_id' => $request->class_id,
                    'section_id' => $section_id,
                    'exam_id' => $request->exam_id,
                    'max_mark' => empty($request->max_mark) ? 0 : $request->max_mark,
                ];
                // dd($insert_arr);
                $examsheet = ExamDateSheet::create($insert_arr);
                $examsheet_id = $examsheet->id;

                if ($examsheet_id) {
                    $sheet_data = [];

                    foreach ($subjects as $sub) {
                        $th_mark = $theories[$sub] ?? 0;
                        $as_mark = $assessments[$sub] ?? 0;
                        $in_mark = $internals[$sub] ?? 0;
                        $ex_date = $dateset[$sub] ?? '1900-01-01';

                        $sheet_data[] = [
                            'row_id' => $examsheet_id,
                            'sub_id' => $sub,
                            'theory' => $th_mark,
                            'assessment' => $as_mark,
                            'internal' => $in_mark,
                            'exam_date' => $ex_date,
                        ];
                    }

                    $datesheet = ExamDateSheetDesc::insert($sheet_data);

                    if ($datesheet) {
                        $message = "Exam date sheet created successfully";
                        $response_arr = [
                            "status" => 'successed',
                            "success" => true,
                            "message" => $message,
                            "errors" => [],
                            "data" => $datesheet
                        ];
                    } else {
                        $message = "Could not create date sheet!";
                        $response_arr = [
                            "status" => 'failed',
                            "success" => false,
                            "message" => $message,
                            "errors" => [],
                            "data" => []
                        ];
                    }
                } else {
                    $message = "Could not create examsheet!";
                    $response_arr = [
                        "status" => 'failed',
                        "success" => false,
                        "message" => $message,
                        "errors" => [],
                        "data" => []
                    ];
                }

                $all_responses[] = $response_arr;
            }

            // Return all responses or the final response
        }
        return response()->json($response_arr);

	}
   public function edit($id)
   {
	   $sheetinfo = ExamDateSheet::leftJoin('exam_date_sheet_desc as ed','exam_date_sheet.id','=','ed.row_id')
				->selectRaw('exam_date_sheet.course_id,exam_date_sheet.class_id,exam_date_sheet.section_id,exam_date_sheet.exam_id,ed.id as desc_id')
				->where('exam_date_sheet.id',$id)
				->get();

		$courses = Course::all();
		$exams = Exam::all();

		if(count($sheetinfo)>0)
		{
			$info = ExamDateSheet::leftJoin('exam_date_sheet_desc as ed', 'exam_date_sheet.id', '=', 'ed.row_id')
				->select('exam_date_sheet.course_id','exam_date_sheet.class_id','exam_date_sheet.section_id','exam_date_sheet.exam_id','exam_date_sheet.max_mark', DB::raw('group_concat(ed.sub_id) as sub_list'),DB::raw('group_concat(ed.theory) as theory_list'),DB::raw('group_concat(assessment) as assessment_list'),DB::raw('group_concat(internal) as internal_list'),DB::raw('group_concat(exam_date) as date_list'))
				->where('exam_date_sheet.id',$id)
				->get();

			$data=array('course_data'=>$courses,'exam_data'=>$exams,'sheet_data'=>$info);
			return response()->json(["status" =>'successed', "success" => true, "message" => "Exam date sheet record found","data" => $data]);
		}
		else
		{
			return response()->json(["status" => "failed","success" => false,"message" => "Whoops! no record found!!","errors" =>'',"data" =>[]]);
		}

   }
   public function update(Request $request,$id)
   {
		$inputs=$request->all();

		$sheetinfo = ExamDateSheet::leftJoin('exam_date_sheet_desc as ed','exam_date_sheet.id','=','ed.row_id')
				->selectRaw('exam_date_sheet.course_id,exam_date_sheet.class_id,exam_date_sheet.section_id,exam_date_sheet.exam_id,ed.id as desc_id')
				->where('exam_date_sheet.id',$id)
				->get();

		if(count($sheetinfo)>0)
		{
			$course_id = empty($request->course_id)?0:(int)$request->course_id;
			$class_id = empty($request->class_id)?0:(int)$request->class_id;
			$section_id = empty($request->section_id)?0:(int)$request->section_id;
			$exam_id = empty($request->exam_id)?0:$request->exam_id;
			$max_mark=empty($request->max_mark)?0:$request->max_mark;

			$courseid=$sheetinfo[0]->course_id;
			$classid=$sheetinfo[0]->class_id;
			$sectionid=$sheetinfo[0]->section_id;
			$examid=$sheetinfo[0]->exam_id;

			$desc_arr=array();

			foreach($sheetinfo AS $sh)
			{
				array_push($desc_arr,$sh->desc_id);
			}

			if($course_id==$courseid && $class_id==$classid && $section_id==$sectionid && $exam_id==$examid)
			{
				$checkExist= ExamDateSheet::select(DB::raw('count(*) as record_count'))
							 ->where([
								['course_id',0],
								['class_id',0],
								['section_id',0],
								['exam_id',0],
							])->get();
			}
			else
			{
				$checkExist= ExamDateSheet::select(DB::raw('count(*) as record_count'))
							 ->where([
								['course_id',$course_id],
								['class_id',$class_id],
								['section_id',$section_id],
								['exam_id',$exam_id],
							])->get();
			}

			$subjects=$request->subjects;
			$theories = $request->theories;
			$assessments = $request->assessments;
			$internals = $request->internals;
			$dateset = $request->dateset;

			$rules=[
				'course_id' => 'required|not_in:0',
				'class_id' => 'required|not_in:0',
				'exam_id' => 'required|not_in:0',
			];

			$fields = [
				'course_id' => 'Course Name',
				'class_id' => 'Class Name',
				'exam_id' => 'Exam Name',
			];

			$messages = [
				'required' => 'The :attribute field is required.',
			];

			$validator = Validator::make($inputs, $rules, $messages, $fields);

			if ($validator->fails()) {
				$errors=$validator->errors();
				$response_arr=array("status"=>"failed","message"=>"Please fill required fields!!","errors"=>$errors);
			}
			else if(count($subjects)==0)
			{
				$response_arr=array("status"=>"failed","message"=>"Please select subjects and add them!!","errors"=>[]);
			}
			else if($checkExist[0]->record_count >0)
			{
				$response_arr=array("status"=>"failed","message"=>"Exam date sheet already exist!!","errors"=>[]);
			}
			else
			{
				$update_arr = array(
					'course_id' => $course_id,
					'class_id' => $class_id,
					'section_id' => $section_id,
					'exam_id' => $exam_id,
					'max_mark' => $max_mark,
				);

				foreach($subjects AS $sub)
				{
					$th_mark=0;
					$as_mark=0;
					$in_mark=0;
					$ex_date='1900-01-01';

					foreach($theories AS $k=>$v)
					{
						if($k==$sub)
						{
							$th_mark=is_null($v)?0:$v;
							break;
						}
					}

					foreach($assessments AS $k=>$v)
					{
						if($k==$sub)
						{
							$as_mark=is_null($v)?0:$v;
							break;
						}
					}

					foreach($internals AS $k=>$v)
					{
						if($k==$sub)
						{
							$in_mark=is_null($v)?0:$v;
							break;
						}
					}

					foreach($dateset AS $k=>$v)
					{
						if($k==$sub)
						{
							$ex_date=is_null($v)?'1900-01-01':$v;
							break;
						}
					}

					$sheet_data[]=array('row_id'=>$id,'sub_id'=>$sub,'theory'=>$th_mark,'assessment'=>$as_mark,'internal'=>$in_mark,'exam_date'=>$ex_date);

				}

				$affected = ExamDateSheet::where('id',$id)->update($update_arr);

				if($affected)
				{
					$deleted = ExamDateSheetDesc::whereIn('id',$desc_arr)->delete();

					if($deleted)
					{
						$datesheet = ExamDateSheetDesc::insert($sheet_data);

						if($datesheet)
						{
							$response_arr=array("status"=>'successed',"success"=>true,"message"=>"Exam date sheet updated successfully.","errors"=>[],"data" =>$datesheet);
						}
						else
						{
							$response_arr=array("status"=>'failed',"success"=>false,"message"=>"could not updated!!","errors"=>[],"data"=>[]);
						}

					}
					else
					{
						$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>"Exam date sheet description could not updated!!","data"=>[]);
					}
				}
				else
				{
					$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>"Exam date sheet could not updated!!","data"=>[]);
				}

			}

		}
		else
		{
			$response_arr=array("status" => "failed","success" => false,"message" => "Whoops! no record found!!","errors" =>'',"data" =>[]);
		}

		return response()->json($response_arr);
   }
   public function delete($id)
   {
		$sheetinfo = ExamDateSheet::leftJoin('exam_date_sheet_desc as ed','exam_date_sheet.id','=','ed.row_id')
				->selectRaw('exam_date_sheet.course_id,exam_date_sheet.class_id,exam_date_sheet.section_id,exam_date_sheet.exam_id,ed.id as desc_id')
				->where('exam_date_sheet.id',$id)
				->get();

        if(count($sheetinfo)>0)
		{
			$q='DELETE ex.*,exd.* FROM exam_date_sheet ex LEFT JOIN exam_date_sheet_desc exd ON ex.id=exd.row_id where ex.id =?';
			$del=DB::delete($q,array($id));

			if($del)
			{
				return response()->json(["status" =>'successed', "success" => true,"errors"=>[], "message" => "Exam date sheet deleted successfully","data" =>[]]);
			}
			else
			{
				return response()->json(["status" => "failed","success" => false,"errors"=>[],"message" => "Whoops! failed to delete,!!","errors" =>'']);
			}
		}
		else
		{
			return response()->json(["status" => "failed","success" => false,"message" => "Whoops! failed to delete,!!","errors" =>'']);
		}

    }

	public function listAll()
	{
		$exams = Exam::all();

		if(!empty($exams)) {
			return response()->json(["status"=>'successed',"success"=>true,"data"=>$exams]);
		}
		else {
			return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found","data" =>""]);
		}

	}

	public function getCourse($id)
	{
		$info = ExamDateSheet::leftJoin('course_master as cm','exam_date_sheet.course_id','=','cm.courseId')
					 ->selectRaw("count(*) as rec_count")
					 ->where('exam_date_sheet.exam_id',$id)
					 ->get();

		if(($info[0]->rec_count>0))
		{
			$courses = ExamDateSheet::leftJoin('course_master as cm','exam_date_sheet.course_id','=','cm.courseId')
					 ->select('cm.courseId','cm.courseName')
					 ->where('exam_date_sheet.exam_id',$id)
                     ->distinct('cm.courseId')
					 ->orderBy('cm.courseId','asc')
					 ->get();

			return response()->json(["status"=>'successed',"success"=>true,"data"=>$courses]);
		}
		else {
			return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found","data" =>""]);
		}

	}

	public function getClass($id1,$id2)
	{
		$info = ExamDateSheet::leftJoin('class_master as cm','exam_date_sheet.class_id','=','cm.classId')
					 ->selectRaw("count(*) as rec_count")
					 ->where('exam_date_sheet.exam_id',$id1)
					 ->where('exam_date_sheet.course_id',$id2)
					 ->get();

		if(($info[0]->rec_count>0))
		{
			$classses = ExamDateSheet::leftJoin('class_master as cm','exam_date_sheet.class_id','=','cm.classId')
					 ->select('cm.classId','cm.className')
					 ->where('exam_date_sheet.exam_id',$id1)
					 ->where('exam_date_sheet.course_id',$id2)
					 ->distinct('cm.classId')
					 ->orderBy('cm.classId','asc')
					 ->get();

			return response()->json(["status"=>'successed',"success"=>true,"data"=>$classses]);
		}
		else {
			return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found","data" =>""]);
		}

	}

	public function getSection($id1,$id2,$id3)
	{
		$info = ExamDateSheet::leftJoin('section_master as sm','exam_date_sheet.section_id','=','sm.sectionId')
					 ->selectRaw("count(*) as rec_count")
					 ->where('exam_date_sheet.exam_id',$id1)
					 ->where('exam_date_sheet.course_id',$id2)
					 ->where('exam_date_sheet.class_id',$id3)
					 ->get();

		if(($info[0]->rec_count>0))
		{
			$sections = ExamDateSheet::leftJoin('section_master as sm','exam_date_sheet.section_id','=','sm.sectionId')
					 ->select('sm.sectionId','sm.sectionName')
					 ->where('exam_date_sheet.exam_id',$id1)
					 ->where('exam_date_sheet.course_id',$id2)
					 ->where('exam_date_sheet.class_id',$id3)
					 ->distinct('sm.sectionId')
					 ->orderBy('sm.sectionId','asc')
					 ->get();

			return response()->json(["status"=>'successed',"success"=>true,"data"=>$sections]);
		}
		else {
			return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found","data" =>""]);
		}

	}

	public function getSubject($id1,$id2,$id3,$id4)
	{
		$info = ExamDateSheet::leftJoin('exam_date_sheet_desc as ed', 'exam_date_sheet.id', '=', 'ed.row_id')
					 ->leftJoin('subject_master as sm', 'ed.sub_id', '=', 'sm.subjectId')
					 ->selectRaw("count(*) as rec_count")
					 ->where('exam_date_sheet.exam_id',$id1)
					 ->where('exam_date_sheet.course_id',$id2)
					 ->where('exam_date_sheet.class_id',$id3)
					 ->where('exam_date_sheet.section_id',$id4)
					 ->get();

		if(($info[0]->rec_count>0))
		{
			$subjects = ExamDateSheet::leftJoin('exam_date_sheet_desc as ed', 'exam_date_sheet.id', '=', 'ed.row_id')
					 ->leftJoin('subject_master as sm', 'ed.sub_id', '=', 'sm.subjectId')
					 ->select('sm.subjectId','sm.subjectName')
					 ->where('exam_date_sheet.exam_id',$id1)
					 ->where('exam_date_sheet.course_id',$id2)
					 ->where('exam_date_sheet.class_id',$id3)
					 ->where('exam_date_sheet.section_id',$id4)
					 ->distinct('sm.subjectId')
					 ->orderBy('sm.subjectId','asc')
					 ->get();

			return response()->json(["status"=>'successed',"success"=>true,"data"=>$subjects]);
		}
		else {
			return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found","data" =>""]);
		}

	}

	public function getMark(Request $request)
	{
		$search = $request->search;
		$limit = $request->limit;
		$page = $request->page;
		$order = $request->order;
		$order_by = $request->orderBy;

		$offset = ($page-1)*$limit;

		$exam_id = empty($request->exam_id)?0:$request->exam_id;
		$course_id = empty($request->course_id)?0:$request->course_id;
		$class_id = empty($request->class_id)?0:$request->class_id;
		$section_id = empty($request->section_id)?0:$request->section_id;
		$subject_id = empty($request->subject_id)?0:$request->subject_id;

		$query = ExamDateSheet::leftJoin("student_master as sm",function($join){
						$join->on("sm.course_id","=","exam_date_sheet.course_id")
							 ->on("sm.class_id","=","exam_date_sheet.class_id")
							 ->on("sm.section_id","=","exam_date_sheet.section_id");
					})
					->leftJoin('exam_date_sheet_desc as ed', 'exam_date_sheet.id', '=', 'ed.row_id')
					->leftJoin("exam_date_sheet_marks as em",function($join){
						$join->on("exam_date_sheet.id","=","em.sheet_id")
							 ->on("ed.sub_id","=","em.subject_id")
							 ->on("sm.id","=","em.student_id");
					})
		     ->selectRaw("count(*) as rec_count")
			 ->where('exam_date_sheet.exam_id',$exam_id)
			 ->where('exam_date_sheet.course_id',$course_id)
			 ->where('exam_date_sheet.class_id',$class_id)
			 ->where('exam_date_sheet.section_id',$section_id)
			 ->where('ed.sub_id',$subject_id);

			$query->where(function($q) use ($subject_id) {
				  $q->whereRaw("FIND_IN_SET($subject_id,sm.compulsary_set)")
					->orWhereRaw("FIND_IN_SET($subject_id,sm.elective_set)")
					->orWhereRaw("FIND_IN_SET($subject_id,sm.additional_set)");
			});

			if($search !='')
			{
				$query->where(function($q) use ($search) {
					 $q->where('sm.roll_no', 'like', '%'.$search.'%')
					   ->orWhere('sm.student_name', 'like', '%'.$search.'%');
				 });
			}

			$records = $query->get();

			$student_query = ExamDateSheet::leftJoin("student_master as sm",function($join){
						$join->on("sm.course_id","=","exam_date_sheet.course_id")
							 ->on("sm.class_id","=","exam_date_sheet.class_id")
							 ->on("sm.section_id","=","exam_date_sheet.section_id");
					})
					->leftJoin('exam_date_sheet_desc as ed', 'exam_date_sheet.id', '=', 'ed.row_id')
					->leftJoin("exam_date_sheet_marks as em",function($join){
						$join->on("exam_date_sheet.id","=","em.sheet_id")
							 ->on("ed.sub_id","=","em.subject_id")
							 ->on("sm.id","=","em.student_id");
					})

		     ->selectRaw("sm.id,sm.student_name,sm.admission_no,sm.roll_no,exam_date_sheet.max_mark,ed.theory as theory_max,ed.assessment as assessment_max,ed.internal as internal_max,IFNULL(em.theory,0) as theory,IFNULL(em.assessment,0) as assessment,IFNULL(em.internal,0) as internal,IFNULL(em.attend,0) as attend,em.marks_obtained")
			 ->where('exam_date_sheet.exam_id',$exam_id)
			 ->where('exam_date_sheet.course_id',$course_id)
			 ->where('exam_date_sheet.class_id',$class_id)
			 ->where('exam_date_sheet.section_id',$section_id)
			 ->where('ed.sub_id',$subject_id)
			 ->where(function($q) use ($subject_id) {
				  $q->whereRaw("FIND_IN_SET($subject_id,sm.compulsary_set)")
					->orWhereRaw("FIND_IN_SET($subject_id,sm.elective_set)")
					->orWhereRaw("FIND_IN_SET($subject_id,sm.additional_set)");
			  });

			if($search !='')
			{
				$student_query->where(function($q) use ($search) {
					 $q->where('sm.roll_no', 'like', '%'.$search.'%')
					   ->orWhere('sm.student_name', 'like', '%'.$search.'%');
				 });
			}
			if($order_by !='')
			{
				$student_query->orderBy($order_by,$order);
			}

			$students = $student_query ->groupBy('sm.id')->get();

			if(count($students) > 0)
			{
				$response_arr = array('data'=>$students,'total'=>$records[0]->rec_count);
				return response()->json(["status" => "successed", "success" => true,"data" => $response_arr]);
			}
			else {
				$response_arr = array('data'=>[],'total'=>0);
				return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found","data" => $response_arr]);
			}

	}

	public function addMark(Request $request)
	{
		$inputs=$request->all();
        // dd($inputs);
		$students=$request->id_arr;
		$theories=$request->theories;
		$assessments=$request->assessments;
		$internals=$request->internals;
		$obts=$request->obts;
		$attendances=$request->attendances;

		$rules=[
			'exam_id' => 'required',
			'course_id' => 'required',
			'class_id' => 'required',
			'section_id' => 'required',
			'subject_id' => 'required'
		];

		$fields = [
			'exam_id' => 'Exam Name',
			'course_id' => 'Course Name',
			'class_id' => 'Class Name',
			'section_id' => 'Section Name',
			'subject_id' => 'Subject Name'
		];

		$messages = [
			'required' => 'The :attribute field is required.',
		];

		$validator = Validator::make($inputs, $rules, $messages, $fields);

        if ($validator->fails()) {
			$errors=$validator->errors();
			$response_arr=array("status"=>"failed","message"=>"Please fill required fields!!","errors"=>$errors);
        }
		else if(count($students)==0)
		{
			$response_arr=array("status"=>"failed","message"=>"Student list is empty!!","errors"=>[]);
		}
		else
		{
			$info=ExamDateSheet::where('exam_date_sheet.exam_id',$request->exam_id)
					 ->where('exam_date_sheet.course_id',$request->course_id)
					 ->where('exam_date_sheet.class_id',$request->class_id)
					 ->where('exam_date_sheet.section_id',$request->section_id)
					 ->get();

			if(count($info)>0)
			{
				$sheet_id=$info[0]->id;
				$subject_id=$request->subject_id;
				$count=0;
				foreach($students AS $i)
				{
					$checkExist=ExamSheetMark::where('sheet_id',$sheet_id)->where('subject_id',$subject_id)->where('student_id',$i)->get();

					if(count($checkExist)>0)
					{
						$sheet_data=array(
							'attend'=>(is_null($attendances[$i]))?'absent':$attendances[$i],
							'theory'=>(is_null($theories[$i]))?0:$theories[$i],
							'assessment'=>(is_null($assessments[$i]))?0:$assessments[$i],
							'internal'=>(is_null($internals[$i]))?0:$internals[$i],
							'marks_obtained'=>(is_null($obts[$i]))?0:$obts[$i],
						);
						$updt =ExamSheetMark::where('id',$checkExist[0]->id)->update($sheet_data);
						if($updt)
						{
							$count++;
						}
					}
					else
					{
						$sheet_data=array(
							'sheet_id'=>$sheet_id,
							'subject_id'=>$subject_id,
							'student_id'=>$i,
							'attend'=>(is_null($attendances[$i]))?'absent':$attendances[$i],
							'theory'=>(is_null($theories[$i]))?0:$theories[$i],
							'assessment'=>(is_null($assessments[$i]))?0:$assessments[$i],
							'internal'=>(is_null($internals[$i]))?0:$internals[$i],
							'marks_obtained'=>(is_null($obts[$i]))?0:$obts[$i],
						);
						$inst =ExamSheetMark::insert($sheet_data);
						if($inst)
						{
							$count++;
						}

					}

				}

				if($count)
				{
					$message="Subject wise marks updated successfully";
					$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data" =>$count);

				}
				else
				{
					$message="could not updated!!";
					$response_arr=array("status"=>'failed',"success"=>false,"message"=>$message,"errors"=>[],"data" =>[]);
				}

			}
			else
			{
				$message="Examsheet not found!!";
				$response_arr=array("status"=>'failed',"success"=>false,"message"=>$message,"errors"=>[],"data"=>[]);
			}
		}

		return response()->json($response_arr);
	}


    public function QuestionReport(Request $request)
    {

    }

    public function section_class_list_by_course($id1,$id2)
	{
        $arr = explode(',', $id2);
		$info = ExamDateSheet::leftJoin('section_master as sm','exam_date_sheet.section_id','=','sm.sectionId')
                    ->leftJoin('course_master as cm','exam_date_sheet.course_id','=','cm.courseId')
                    ->leftJoin('class_master as cls','exam_date_sheet.class_id','=','cls.classId')
					 ->selectRaw("count(*) as rec_count")
					 ->where('exam_date_sheet.exam_id',$id1)
					 ->where('exam_date_sheet.course_id',$id2)
					 ->get();

		if(($info[0]->rec_count>0))
		{
			$sections = ExamDateSheet::leftJoin('section_master as sm','exam_date_sheet.section_id','=','sm.sectionId')
                    ->leftJoin('course_master as cm','exam_date_sheet.course_id','=','cm.courseId')
                    ->leftJoin('class_master as cls','exam_date_sheet.class_id','=','cls.classId')
					 ->select('sm.sectionId','sm.sectionName','cm.courseId','cm.courseName','cls.classId','cls.className','exam_date_sheet.id','exam_date_sheet.exam_id')
					 ->where('exam_date_sheet.exam_id',$id1)
					 ->where('exam_date_sheet.course_id',$id2)
					 ->distinct('sm.sectionId')
					 ->orderBy('sm.sectionId','asc')
					 ->get();
        // dd($sections);
			return response()->json(["status"=>'successed',"success"=>true,"data"=>$sections]);
		}
		else {
			return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found","data" =>""]);
		}

	}

    public function fetch_exam_datesheet($key,Request $request)
	{

        $course_ids = $request->input('course_ids', []);
        $class_id = $request->input('class_id',[]);
        $section_id = $request->input('section_id',[]);
        // dd($course_ids);

		$query = ExamDateSheet::leftJoin('section_master as sm','exam_date_sheet.section_id','=','sm.sectionId')
                    ->leftJoin('course_master as cm','exam_date_sheet.course_id','=','cm.courseId')
                    ->leftJoin('class_master as cls','exam_date_sheet.class_id','=','cls.classId')
                    ->leftJoin('exam_date_sheet_desc as exam_desc','exam_desc.row_id','=','exam_date_sheet.id')
                    ->leftJoin('subject_master as subject', 'exam_desc.sub_id', '=', 'subject.subjectId')
					->where('exam_date_sheet.exam_id',$key);

        if (!empty($course_ids)) {
            $query->whereIn('exam_date_sheet.course_id', $course_ids);
        }

        // if (!empty($class_id)) {
        //     $query->whereIn('exam_date_sheet.class_id', $class_id);
        // }

        if (!empty($section_id)) {
            $query->whereIn('exam_date_sheet.section_id', $section_id);
        }
        $datesheet = $query->orderBy('sm.sectionId', 'ASC')->orderBy('exam_desc.exam_date','ASC')->get();
        // dd($datesheet);

		if ($datesheet->isNotEmpty()) {
			return response()->json(["status"=>'successed',"success"=>true,"data"=>$datesheet]);
		}
		else {
			return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found","data" =>""]);
		}

	}

    public function getStudents($id1,$id2,$id3,$id4)
	{
        $info = StudentMaster::join('exam_date_sheet as eds', function($join) {
                $join->on('student_master.section_id', '=', 'eds.section_id')
                    ->on('student_master.course_id', '=', 'eds.course_id')
                    ->on('student_master.class_id', '=', 'eds.class_id');
                })
                ->select('student_master.course_id', 'student_master.class_id', 'student_master.section_id', 'student_master.student_name', 'student_master.id','student_master.admission_no','student_master.roll_no')
                ->where('eds.exam_id', $id1)
                ->where('student_master.course_id', $id2)
                ->where('student_master.class_id', $id3)
                ->where('student_master.section_id', $id4)
				->distinct('student_master.id')
                ->get();

		if ($info->isNotEmpty())
		{
			return response()->json(["status"=>'successed',"success"=>true,"data"=>$info]);
		}
		else {
			return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found","data" =>""]);
		}

	}

    public function allSubject($id1,$id2,$id3,$id4,$id5)
	{
		$students = ExamDateSheet::leftJoin('exam_date_sheet_marks as ed', 'exam_date_sheet.id', '=', 'ed.sheet_id')
					->leftJoin('subject_master as sm', 'ed.subject_id', '=', 'sm.subjectId')
					 ->where('exam_date_sheet.exam_id',$id1)
					 ->where('exam_date_sheet.course_id',$id2)
					 ->where('exam_date_sheet.class_id',$id3)
					 ->where('exam_date_sheet.section_id',$id4)
					 ->where('ed.student_id',$id5)
					 ->get();
        // dd($students);

		if($students->isNotEmpty())
		{
			return response()->json(["status"=>'successed',"success"=>true,"data"=>$students]);
		}
		else {
			return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found","data" =>""]);
		}

	}





	public function compiledsheetMarks($id1,$id2,$id3,$id4)
	{
		$students = ExamDateSheet::leftJoin('exam_date_sheet_marks as ed', 'exam_date_sheet.id', '=', 'ed.sheet_id')
					->leftJoin('subject_master as sm', 'ed.subject_id', '=', 'sm.subjectId')
					->leftJoin('student_master as st', 'ed.student_id', '=', 'st.id')
					 ->where('exam_date_sheet.exam_id',$id1)
					 ->where('exam_date_sheet.course_id',$id2)
					 ->where('exam_date_sheet.class_id',$id3)
					 ->where('exam_date_sheet.section_id',$id4)
					//  ->where('ed.student_id',$id5)
					
					->orderBy('ed.student_id', 'asc')
					 ->get();
        // dd($students);

		if($students->isNotEmpty())
		{
			return response()->json(["status"=>'successed',"success"=>true,"data"=>$students]);
		}
		else {
			return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found","data" =>""]);
		}

	}






	

}
