<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

use App\Models\Course;
use App\Models\Exam;
use App\Models\ExamSheetMark;
use App\Models\SubjectMaster;
use App\Models\ExamDateSheet;
use App\Models\ExamDateSheetDesc;
use App\Models\StudentMaster;
use App\Models\Grade;
use App\Models\School;
use App\Models\Remarks;
use DB;
use Image;
use PDF;
use Helper;

use App\Exports\AllExamMarkReportExport;
use App\Exports\SingleExamMarkReportExport;
use Maatwebsite\Excel\Facades\Excel;


class MarkReportController extends Controller
{
    public function __construct()
    {
        DB::statement("SET SQL_MODE=''");
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

    public function gradesAll()
	{
		$grades = Grade::all();

		if($grades->isNotEmpty())
		{
			return response()->json(["status"=>'successed',"success"=>true,"data"=>$grades]);
		}
		else {
			return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found","data" =>""]);
		}

	}

    public function get_section_student($id1,$id2,$id3)
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

    public function getStudents($id1,$id2,$id3,$id4)
	{
		$students = ExamDateSheet::leftJoin('exam_date_sheet_marks as ed', 'exam_date_sheet.id', '=', 'ed.sheet_id')
                ->leftJoin('subject_master as sm', 'ed.subject_id', '=', 'sm.subjectId')
                ->join('student_master as stud', 'ed.student_id', '=', 'stud.id')
                ->where('exam_date_sheet.exam_id', $id1)
                ->where('exam_date_sheet.course_id', $id2)
                ->where('exam_date_sheet.class_id', $id3)
                ->where('exam_date_sheet.section_id', $id4)
                ->groupBy('ed.student_id')
                ->select(
                    'ed.sheet_id', 'exam_date_sheet.exam_id', 'exam_date_sheet.course_id', 'exam_date_sheet.class_id', 'exam_date_sheet.section_id', 'ed.student_id', 'stud.student_name','stud.admission_no','stud.roll_no',
                    DB::raw('SUM(exam_date_sheet.max_mark) as total_max_marks'),
                    DB::raw('SUM(ed.marks_obtained) as total_marks_obtained'),
                    DB::raw('SUM(ed.theory) as total_theory'),
                    DB::raw('SUM(ed.assessment) as total_assessment'),
                    DB::raw('SUM(ed.internal) as total_internal'),
                    DB::raw('CONCAT("[", GROUP_CONCAT(JSON_OBJECT(
                        "subjectId", sm.subjectId,
                            "subjectName", sm.subjectName,
                            "theory", ed.theory,
                            "assessment", ed.assessment,
                            "internal", ed.internal,
                            "marksObtained", ed.marks_obtained,
                            "maxMark", exam_date_sheet.max_mark
                    )), "]") as subject_details')

                )
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

    public function printStudent($id,Request $request)
    {
        // $remarks = $request->query('remarks');
        $sheet_id = $request->query('sheet_id');
        $exam_id = $request->query('exam_id');
        $course_id = $request->query('course_id');
        $class_id = $request->query('class_id');
        $section_id = $request->query('section_id');
        $student_id = $request->query('student_id');


		$student=StudentMaster::where('id',$id)->get();
        // $grade = Grade::all();

		if(count($student)>0)
		{
			$school=School::where('school_code','S110')->get();
			$student_receipt = ExamDateSheet::leftJoin('exam_date_sheet_marks as ed', 'exam_date_sheet.id', '=', 'ed.sheet_id')
            ->where('exam_date_sheet.exam_id', $exam_id)
            ->where('exam_date_sheet.course_id', $course_id)
            ->where('exam_date_sheet.class_id', $class_id)
            ->where('exam_date_sheet.section_id', $section_id)
            ->where('exam_date_sheet.id', $sheet_id)
            ->where('ed.student_id', $student_id)
            ->leftJoin('subject_master as sm', 'ed.subject_id', '=', 'sm.subjectId')
            ->join('student_master as stud', 'ed.student_id', '=', 'stud.id')
            ->groupBy('ed.student_id')
            ->select(
                'ed.sheet_id', 'exam_date_sheet.exam_id', 'exam_date_sheet.course_id', 'exam_date_sheet.class_id', 'exam_date_sheet.section_id', 'ed.student_id', 'stud.student_name','stud.admission_no','stud.roll_no', 'stud.compulsary_set','stud.elective_set','stud.additional_set', 'stud.dob','stud.father_name','stud.mother_name',
                DB::raw('SUM(exam_date_sheet.max_mark) as total_max_marks'),
                DB::raw('SUM(ed.marks_obtained) as total_marks_obtained'),
                DB::raw('SUM(ed.theory) as total_theory'),
                DB::raw('SUM(ed.assessment) as total_assessment'),
                DB::raw('SUM(ed.internal) as total_internal'),
                DB::raw('CONCAT("[", GROUP_CONCAT(JSON_OBJECT(
                    "subjectId", sm.subjectId,
                        "subjectName", sm.subjectName,
                        "theory", ed.theory,
                        "assessment", ed.assessment,
                        "internal", ed.internal,
                        "marksObtained", ed.marks_obtained,
                        "maxMark", exam_date_sheet.max_mark
                )), "]") as subject_details')

            )
            ->first();
            // dd($student_receipt);

            $cond = [
                'sheet_id' => $sheet_id,
                'exam_id' => $exam_id,
                'course_id' => $course_id,
                'class_id' => $class_id,
                'section_id' => $section_id,
                'student_id' => $student_id,
            ];
            $remarks = Remarks::where($cond)->first();
            // dd($student_receipt);
            $percent = ($student_receipt->total_marks_obtained / $student_receipt->total_max_marks) * 100;
            $percentage = floor($percent);

            $grade = Grade::where('marksAbove', '<=', $percentage)
                    ->where('marksLess', '>=', $percentage)
                    ->first();

            $exam_name = DB::table('exams')->where('id',$student_receipt->exam_id)->first();
            $class_name = DB::table('class_master')->where('classId',$student_receipt->class_id)->first();

			$data = array('school'=>$school,'receipt'=>$student_receipt,'percentage' => $percent,
            'grade' => $grade ? $grade->grade : 'N/A','exam_name'=>$exam_name,'class_name'=>$class_name,'remarks'=>$remarks);
            // dd($data['receipt']);
            // dd($data);

			$receipt_name=time().rand(1,99).'.'.'pdf'; 
			$customPaper = [0, 0, 505.28, 841.89];

		    $pdf = PDF::loadView("marks_report_print",$data)
                    ->setPaper($customPaper)
                    ->setOptions(['margin-left' => 0, 'margin-right' => 0, 'margin-top' => 0, 'margin-bottom' => 0])
                    ->save(public_path("marks_report/regular/$receipt_name"));

			$message="Student details generated successfully, get the report card.";

			$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data" =>$receipt_name);
		}
		else
		{
			return response()->json(["status" => "failed","success" => false,"message" => "Whoops! no record found !!","errors" =>'',"data" =>[]]);
		}

		return response()->json($response_arr);

    }





    public function printStudentAll(Request $request)
    {

        $data = ExamDateSheet::leftJoin('exam_date_sheet_marks as ed', 'exam_date_sheet.id', '=', 'ed.sheet_id')
        
    ->leftJoin('subject_master as sm', 'ed.subject_id', '=', 'sm.subjectId')
    ->leftJoin('student_master as st', 'ed.student_id', '=', 'st.id')
   // ->leftJoin('exam_date_sheet_desc as edsc',  'edsc.row_id', '=','exam_date_sheet.id')
   
    ->where('exam_date_sheet.exam_id', $request->exam_id)
    ->where('exam_date_sheet.course_id', $request->course_id)
    ->where('exam_date_sheet.class_id', $request->class_id)
    ->where('exam_date_sheet.section_id', $request->section_id)
   // ->where('edsc.exam_idd', $request->exam_id)
    // ->leftJoin('edsc',  'edsc.sub_id', '=','sm.subjectId')
   //  ->leftJoin('exam_date_sheet_desc as edsc',  'edsc.row_id', '=','exam_date_sheet.id')
    // ->leftJoin('exam_date_sheet_desc as edsc',  'edsc.row_id', '=','exam_date_sheet.id')
    // ->where('exam_date_sheet_desc.exam_id', $request->exam_id)
    
    ->select('st.id as student_id', 'st.student_name as student_name', 'sm.subjectName', 'sm.subjectId','ed.marks_obtained','exam_date_sheet.max_mark','st.student_name','st.mother_name','st.father_name','st.dob','st.admission_no','st.roll_no','ed.theory','ed.assessment','ed.internal')
    ->orderBy('st.id', 'asc')
    ->get();

// Transform the results
$groupedData = $data->groupBy('student_id')->map(function ($group) {
    return [
        'student_id' => $group->first()->student_id,
        'student_name' => $group->first()->student_name,
        'mother_name' => $group->first()->mother_name,
        'father_name' => $group->first()->father_name,
        'dob' => $group->first()->dob,
        'admission_no' => $group->first()->admission_no,
        'roll_no' => $group->first()->roll_no,
        'subjects' => $group->map(function ($item) {
            return [
                'subjectId' => $item->subjectId,
                'subjectName' => $item->subjectName,
                'marks_obtained' => $item->marks_obtained,
                'theory' => $item->theory,
                'assessment' => $item->assessment,
                'internal' => $item->internal,
                'max_mark' => $item->max_mark
               
            ];
        })
    ];
})->values()->toArray(); // Convert back to array if needed

// Now $groupedData will have the desired format


$school=School::where('school_code','S110')->get();

$by_theory='';
$by_internal='';
$by_assesment='';

if($request->theory){
    $by_theory=$request->theory;
}
if($request->internal){
    $by_internal=$request->internal;
}

if($request->assesment){
    $by_assesment=$request->assesment;
}



//   print('<pre>');
//  print_r($groupedData);
//  print('<pre>');

                      $receipt_name=time().rand(1,99).'.'.'pdf'; 
                      $customPaper = [0, 0, 505.28, 841.89];
         
                  $pdf = PDF::loadView("marks_report_print_all",['data' => $groupedData,'school'=>$school,'by_theory'=>$by_theory,'by_internal'=>$by_internal,'by_assesment'=>$by_assesment])
                          ->setPaper($customPaper)
                            ->setOptions(['margin-left' => 0, 'margin-right' => 0, 'margin-top' => 0, 'margin-bottom' => 0])
                          ->save(public_path("marks_report/all_marks/$receipt_name"));
         






        
			$message="Student details generated successfully, get the report card.";

			$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data" =>$receipt_name);
		

		return response()->json($response_arr);

    }





    public function printStudentAllExam(Request $request)
    {

        $data = ExamDateSheet::leftJoin('exam_date_sheet_marks as ed', 'exam_date_sheet.id', '=', 'ed.sheet_id')
        ->leftJoin('subject_master as sm', 'ed.subject_id', '=', 'sm.subjectId')
        ->leftJoin('student_master as st', 'ed.student_id', '=', 'st.id')
        ->whereIn('exam_date_sheet.exam_id', $request->exam_id)
        ->where('exam_date_sheet.course_id', $request->course_id)
        ->where('exam_date_sheet.class_id', $request->class_id)
        ->where('exam_date_sheet.section_id', $request->section_id)
        ->select(
            'st.id as student_id', 
            'st.student_name', 
            'sm.subjectName', 
            'sm.subjectId', 
            'ed.marks_obtained', 
            'exam_date_sheet.max_mark', 
            'st.mother_name', 
            'st.father_name', 
            'st.dob', 
            'st.admission_no', 
            'st.roll_no', 
            'ed.theory', 
            'ed.assessment', 
            'ed.internal', 
            'exam_date_sheet.exam_id' // Include exam_id in the select statement
        )
        ->orderBy('st.id', 'asc')
        ->get();
    
 // Transform the results
$groupedData = $data->groupBy('student_id')->map(function ($group) {
    return [
        'student_id' => $group->first()->student_id,
        'student_name' => $group->first()->student_name,
        'mother_name' => $group->first()->mother_name,
        'father_name' => $group->first()->father_name,
        'dob' => $group->first()->dob,
        'admission_no' => $group->first()->admission_no,
        'roll_no' => $group->first()->roll_no,
        'subjects' => $group->map(function ($item) {
            return [
                'subjectId' => $item->subjectId, 
                'subjectName' => $item->subjectName,
                'marks_obtained' => $item->marks_obtained,
                'theory' => $item->theory,
                'assessment' => $item->assessment,
                'internal' => $item->internal,
                'max_mark' => $item->max_mark,
                'exam_id' => $item->exam_id // Include exam_id in each subject
            ];
        })
    ];
})->values()->toArray(); // Convert back to array if needed

// Now $groupedData will have the desired format


$school=School::where('school_code','S110')->get();

$exam_ids = $request->exam_id; // Array of school codes

$exams = Exam::whereIn('id', $exam_ids)->get();
$grades = Grade::all();
$grade_by=$request->grade_by;



                      $receipt_name=time().rand(1,99).'.'.'pdf'; 
                      $customPaper = [0, 0, 505.28, 941.89];
         
                  $pdf = PDF::loadView("marks_report_print_all_exam",['data' => $groupedData,'school'=>$school,'exams'=>$exams,'grades'=>$grades,'grade_by'=>$grade_by])
                             ->setPaper($customPaper)
                          ->setOptions(['margin-left' => 0, 'margin-right' => 0, 'margin-top' => 0, 'margin-bottom' => 0])
                           ->save(public_path("marks_report/all_exam_marks/$receipt_name"));
         






        
			$message="Student details generated successfully, get the report card.";

			$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data" =>$receipt_name);
		

		return response()->json($response_arr);

    }



    public function ExcelStudentAllExam(Request $request)
    {









        $data = ExamDateSheet::leftJoin('exam_date_sheet_marks as ed', 'exam_date_sheet.id', '=', 'ed.sheet_id')
        ->leftJoin('subject_master as sm', 'ed.subject_id', '=', 'sm.subjectId')
        ->leftJoin('student_master as st', 'ed.student_id', '=', 'st.id')
        ->whereIn('exam_date_sheet.exam_id', $request->exam_id)
        ->where('exam_date_sheet.course_id', $request->course_id)
        ->where('exam_date_sheet.class_id', $request->class_id)
        ->where('exam_date_sheet.section_id', $request->section_id)
        ->select(
            'st.id as student_id', 
            'st.student_name', 
            'sm.subjectName', 
            'sm.subjectId', 
            'ed.marks_obtained', 
            'exam_date_sheet.max_mark', 
            'st.mother_name', 
            'st.father_name', 
            'st.dob', 
            'st.admission_no', 
            'st.roll_no', 
            'ed.theory', 
            'ed.assessment', 
            'ed.internal', 
            'exam_date_sheet.exam_id' // Include exam_id in the select statement
        )
        ->orderBy('st.id', 'asc')
        ->get();
    
 // Transform the results
$groupedData = $data->groupBy('student_id')->map(function ($group) {
    return [
        'student_id' => $group->first()->student_id,
        'student_name' => $group->first()->student_name,
        'mother_name' => $group->first()->mother_name,
        'father_name' => $group->first()->father_name,
        'dob' => $group->first()->dob,
        'admission_no' => $group->first()->admission_no,
        'roll_no' => $group->first()->roll_no,
        'subjects' => $group->map(function ($item) {
            return [
                'subjectId' => $item->subjectId, 
                'subjectName' => $item->subjectName,
                'marks_obtained' => $item->marks_obtained,
                'theory' => $item->theory,
                'assessment' => $item->assessment,
                'internal' => $item->internal,
                'max_mark' => $item->max_mark,
                'exam_id' => $item->exam_id // Include exam_id in each subject
            ];
        })
    ];
})->values()->toArray(); // Convert back to array if needed

// Now $groupedData will have the desired format


$school=School::where('school_code','S110')->get();

$exam_ids = $request->exam_id; // Array of school codes

$exams = Exam::whereIn('id', $exam_ids)->get();
$grades = Grade::all();
$grade_by=$request->grade_by;




                //       $receipt_name=time().rand(1,99).'.'.'pdf'; 
                //       $customPaper = [0, 0, 505.28, 841.89];
         
                //   $pdf = PDF::loadView("marks_report_print_all_exam",['data' => $groupedData,'school'=>$school,'exams'=>$exams,'grades'=>$grades,'grade_by'=>$grade_by])
                //              ->setPaper($customPaper)
                //           ->setOptions(['margin-left' => 0, 'margin-right' => 0, 'margin-top' => 0, 'margin-bottom' => 0])
                //            ->save(public_path("marks_report/all_exam_marks/$receipt_name"));
         













$data = $groupedData;
$school =$school;

$exams=$exams; $grades=$grades;
$grade_by=$grade_by;

      //  $filename = 'student_exam_report_' . time() . '.xlsx';
        
      $export = new AllExamMarkReportExport($data, $exams, $grades, $grade_by);

//        print("<pre>");
//   print_r($groupedData);
//   print("<pre>");
// die();

      // Return Excel download response
      return Excel::download($export, 'student_exam_report.xlsx');
        // Return Excel download
        //return Excel::download(new AllExamMarkReportExport($request), $filename);
    }







    public function ExcelStudentSingleExam(Request $request)
    {





        $data = ExamDateSheet::leftJoin('exam_date_sheet_marks as ed', 'exam_date_sheet.id', '=', 'ed.sheet_id')
        ->leftJoin('subject_master as sm', 'ed.subject_id', '=', 'sm.subjectId')
        ->leftJoin('student_master as st', 'ed.student_id', '=', 'st.id')
        ->where('exam_date_sheet.exam_id', $request->exam_id)
        ->where('exam_date_sheet.course_id', $request->course_id)
        ->where('exam_date_sheet.class_id', $request->class_id)
        ->where('exam_date_sheet.section_id', $request->section_id)
        ->select('st.id as student_id', 'st.student_name as student_name', 'sm.subjectName', 'sm.subjectId','ed.marks_obtained','exam_date_sheet.max_mark','st.student_name','st.mother_name','st.father_name','st.dob','st.admission_no','st.roll_no','ed.theory','ed.assessment','ed.internal')
        ->orderBy('st.id', 'asc')
        ->get();
    
    // Transform the results
    $groupedData = $data->groupBy('student_id')->map(function ($group) {
        return [
            'student_id' => $group->first()->student_id,
            'student_name' => $group->first()->student_name,
            'mother_name' => $group->first()->mother_name,
            'father_name' => $group->first()->father_name,
            'dob' => $group->first()->dob,
            'admission_no' => $group->first()->admission_no,
            'roll_no' => $group->first()->roll_no,
            'subjects' => $group->map(function ($item) {
                return [
                    'subjectId' => $item->subjectId,
                    'subjectName' => $item->subjectName,
                    'marks_obtained' => $item->marks_obtained,
                    'theory' => $item->theory,
                    'assessment' => $item->assessment,
                    'internal' => $item->internal,
                    'max_mark' => $item->max_mark
                ];
            })
        ];
    })->values()->toArray(); // Convert back to array if needed
    
    // Now $groupedData will have the desired format
    
    
    $school=School::where('school_code','S110')->get();











$students = $groupedData;
// print("<pre>");
//  print_r($groupedData);
//  print("<pre>");
// die();
   return Excel::download(new SingleExamMarkReportExport($students, $school), 'student_exam_report.xlsx');
    }











    public function updateRemark(Request $request)
    {
        $inputs = $request->all();
        $criteria = [
            'exam_id' => $inputs['exam_id'],
            'course_id' => $inputs['course_id'],
            'class_id' => $inputs['class_id'],
            'section_id' => $inputs['section_id'],
            'student_id' => $inputs['subject_id'],
            'sheet_id' => $inputs['sheet_id'],
        ];

        $rules = [
            'remarks' => "nullable|max:500",
        ];
        $messages = [];
        $fields = [
            'remarks' => 'Remarks',
        ];

        $validator = Validator::make($inputs, $rules, $messages, $fields);

        if ($validator->fails()) {
            return response()->json(["status" => "failed", "message" => "Please fill all fields!!", "errors" => $validator->errors()]);
        } else {

            $remark = Remarks::updateOrCreate(
                $criteria, // Matching criteria
                ['remarks' => $inputs['remarks']] // Values to update or insert
            );

            if (!is_null($remark)) {
                return response()->json(["status" => 'successed', "success" => true, "message" => "Student Remark updated successfully", "data" => $remark]);
            } else {
                return response()->json(["status" => "failed","success" => false,"message" => "Whoops! no record found!!","errors" =>'',"data" =>[]]);
            }

        }
    }

    public function getRemarks(Request $request)
	{
        $sheet_id = $request->query('sheet_id');
        $exam_id = $request->query('exam_id');
        $course_id = $request->query('course_id');
        $class_id = $request->query('class_id');
        $section_id = $request->query('section_id');
        $student_id = $request->query('subject_id');

        $remarks = Remarks::where('sheet_id', $sheet_id)
                ->where('exam_id', $exam_id)
                ->where('course_id', $course_id)
                ->where('class_id', $class_id)
                ->where('section_id', $section_id)
                ->where('student_id', $student_id)
                ->get();

		if ($remarks->isNotEmpty())
		{
			return response()->json(["status"=>'successed',"success"=>true,"data"=>$remarks]);
		}
		else {
			return response()->json(["status" => "failed", "success" => false, "message" => "No remarks found for the selected criteria.","data" =>""]);
		}

	}

    public function getStudBySection($id1,$id2,$id3)
	{
        $info = StudentMaster::where('course_id', $id1)
                ->where('class_id', $id2)
                ->where('section_id', $id3)
                ->select('id','student_name','compulsary_set','elective_set','additional_set','session_id')
                ->orderBy('id','ASC')
                ->get();

		if ($info->isNotEmpty())
		{
			return response()->json(["status"=>'successed',"success"=>true,"data"=>$info]);
		}
		else {
			return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found","data" =>""]);
		}

	}


    public function getExamByStudent($id1,$id2,$id3,$id4)
	{
        $students = ExamDateSheet::join('exams','exams.id','=','exam_date_sheet.exam_id')
        ->leftJoin('exam_date_sheet_marks as ed', 'exam_date_sheet.id', '=', 'ed.sheet_id')
        ->select(
            'exam_date_sheet.exam_id',
            'exams.name as exam_name',
            'exams.type',
            DB::raw('GROUP_CONCAT(DISTINCT exam_date_sheet.id) as exam_ids'),
            DB::raw('GROUP_CONCAT(DISTINCT ed.id) as edIds'),
            DB::raw('GROUP_CONCAT(DISTINCT ed.student_id) as student_ids')
        )
        ->where('exam_date_sheet.course_id', $id1)
        ->where('exam_date_sheet.class_id', $id2)
        ->where('exam_date_sheet.section_id', $id3)
        ->where('ed.student_id', $id4)
        ->groupBy('exam_date_sheet.exam_id', 'exams.name', 'exams.type')
        ->orderBy('exam_date_sheet.exam_id','ASC')
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


    public function getAllSubjects($id1,$id2,$id3,$id4,$id5)
	{
        $exam_ids = explode(',', $id1); // Multiple exam IDs
        $jsonResult = [];

        // Initialize arrays for common fields and subject data
        $commonData = [
            'course_id' => $id2,
            'class_id' => $id3,
            'section_id' => $id4,
            'student_id' => $id5,
        ];

        // Array to store unique subjects (names and IDs)
        $subjectDetailsCombined = [];

        foreach ($exam_ids as $examId) {
            $result = ExamDateSheet::join('exams', 'exams.id', '=', 'exam_date_sheet.exam_id')
                ->leftJoin('exam_date_sheet_marks as ed', 'exam_date_sheet.id', '=', 'ed.sheet_id')
                ->leftJoin('subject_master as sm', 'ed.subject_id', '=', 'sm.subjectId')
                ->select(
                    'exam_date_sheet.*',
                    'exams.name as exam_name',
                    'exams.type as exam_type',
                    'ed.subject_id',
                    'ed.marks_obtained',
                    'ed.theory',
                    'ed.assessment',
                    'ed.internal',
                    'ed.attend',
                    'sm.subjectName'
                )
                ->where('exam_date_sheet.exam_id', $examId)
                ->where('exam_date_sheet.course_id', $id2)
                ->where('exam_date_sheet.class_id', $id3)
                ->where('exam_date_sheet.section_id', $id4)
                ->where('ed.student_id', $id5)
                ->orderBy('exam_date_sheet.exam_id', 'ASC')
                ->get();

            if ($result->isNotEmpty()) {
                $subjectDetails = [];

                foreach ($result as $row) {
                    // Check if the subject is already added to avoid duplicates
                    if (!in_array($row->subject_id, array_column($subjectDetailsCombined, 'id'))) {
                        // Add the subject name and id together in one object
                        $subjectDetailsCombined[] = [
                            'id' => $row->subject_id,
                            'name' => $row->subjectName
                        ];
                    }

                    // Prepare subject details for this exam
                    $subjectDetails[] = [
                        'subject_id' => $row->subject_id,
                        'subject_name' => $row->subjectName,
                        'max_mark' => $row->max_mark,
                        'marks_obtained' => $row->marks_obtained,
                        'theory' => $row->theory,
                        'assessment' => $row->assessment,
                        'internal' => $row->internal,
                        'attend' => $row->attend,
                        'exam_id' => $examId,
                    ];
                }

                // Add the exam information and subjects to the result
                $jsonResult[] = [
                    'exam_info' => [
                        'exam_id' => $examId,
                        'exam_name' => $result->first()->exam_name,
                        'exam_type' => $result->first()->exam_type,
                        'sheet_id' => $result->first()->id,
                    ],
                    'subjectDetails' => $subjectDetails
                ];
            }
        }

        // Sort the subject details array by subject IDs in ascending order
        usort($subjectDetailsCombined, function ($a, $b) {
            return $a['id'] <=> $b['id'];
        });

        // Merge the common data with the final output
        $finalResult = array_merge($commonData, [
            'subject_names' => json_encode($subjectDetailsCombined),
            'exams' => $jsonResult
        ]);

        // dd($finalResult);

        if (!empty($finalResult)) {
            return response()->json([ "status" => 'successed',"success" => true,"data" => $finalResult ]);
        } else {
            return response()->json([ "status" => "failed","success" => false,"message" => "Whoops! no record found","data" => "" ]);
        }

	}

    public function consolidatedList($id1,$id2,$id3,$id4,$id5,Request $request)
    {
        $grade_by = $request->query('grades');
        $finals = $request->query('finals');

		$student=StudentMaster::where('id',$id5)->select('id','student_name','father_name','mother_name','dob','admission_no')->get();

		if(count($student)>0)
		{
            $school=School::where('school_code','S110')->get();
			$exam_ids = explode(',', $id1); // Multiple exam IDs
            $jsonResult = [];

            $commonData = [
                'course_id' => $id2,
                'class_id' => $id3,
                'section_id' => $id4,
                'student_id' => $id5,
            ];

            $subjectDetailsCombined = [];

            foreach ($exam_ids as $examId) {
                $result = ExamDateSheet::join('exams', 'exams.id', '=', 'exam_date_sheet.exam_id')
                    ->leftJoin('exam_date_sheet_marks as ed', 'exam_date_sheet.id', '=', 'ed.sheet_id')
                    ->leftJoin('subject_master as sm', 'ed.subject_id', '=', 'sm.subjectId')
                    ->select(
                        'exam_date_sheet.*',
                        'exams.name as exam_name',
                        'exams.type as exam_type',
                        'ed.subject_id',
                        'ed.marks_obtained',
                        'ed.theory',
                        'ed.assessment',
                        'ed.internal',
                        'ed.attend',
                        'sm.subjectName'
                    )
                    ->where('exam_date_sheet.exam_id', $examId)
                    ->where('exam_date_sheet.course_id', $id2)
                    ->where('exam_date_sheet.class_id', $id3)
                    ->where('exam_date_sheet.section_id', $id4)
                    ->where('ed.student_id', $id5)
                    ->orderBy('exam_date_sheet.exam_id', 'ASC')
                    ->get();

                if ($result->isNotEmpty()) {
                    $subjectDetails = [];

                    foreach ($result as $row) {
                        // Check if the subject is already added to avoid duplicates
                        if (!in_array($row->subject_id, array_column($subjectDetailsCombined, 'id'))) {
                            // Add the subject name and id together in one object
                            $subjectDetailsCombined[] = [
                                'id' => $row->subject_id,
                                'name' => $row->subjectName
                            ];
                        }

                        // Prepare subject details for this exam
                        $subjectDetails[] = [
                            'subject_id' => $row->subject_id,
                            'subject_name' => $row->subjectName,
                            'max_mark' => $row->max_mark,
                            'marks_obtained' => $row->marks_obtained,
                            'theory' => $row->theory,
                            'assessment' => $row->assessment,
                            'internal' => $row->internal,
                            'attend' => $row->attend,
                            'exam_id' => $examId,
                        ];
                    }

                    // Add the exam information and subjects to the result
                    $jsonResult[] = [
                        'exam_info' => [
                            'exam_id' => $examId,
                            'exam_name' => $result->first()->exam_name,
                            'exam_type' => $result->first()->exam_type,
                            'sheet_id' => $result->first()->id,
                        ],
                        'subjectDetails' => $subjectDetails
                    ];
                }
            }

            usort($subjectDetailsCombined, function ($a, $b) {
                return $a['id'] <=> $b['id'];
            });

            $finalResult = array_merge($commonData, [
                'subject_names' => json_encode($subjectDetailsCombined),
                'exams' => $jsonResult
            ]);


			$data = array('finalResult'=>$finalResult,'student'=>$student,'grade_by' => $grade_by,'finals'=>$finals ?? '','schoolHeader'=>$school);

			$receipt_name=time().rand(1,99).'.'.'pdf';
			// $customPaper = [0, 0, 505.28, 841.89];
			$customPaper = [0, 0, 700, 800];

		    $pdf = PDF::loadView("marks_consolidated_print",$data)
                    ->setPaper($customPaper)
                    ->setOptions(['margin-left' => 0, 'margin-right' => 0, 'margin-top' => 0, 'margin-bottom' => 0])
                    ->save(public_path("marks_report/consolidated/$receipt_name"));

			$message="Student details generated successfully, get the consolidated sheet.";

			$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data" =>$receipt_name);
		}
		else
		{
			return response()->json(["status" => "failed","success" => false,"message" => "Whoops! no record found !!","errors" =>'',"data" =>[]]);
		}

		return response()->json($response_arr);

    }

    // compiled-sheet of classwise consolidated

    public function getCompiledExam($id1,$id2,$id3)
	{
        $students = ExamDateSheet::join('exams','exams.id','=','exam_date_sheet.exam_id')
        ->join('exam_date_sheet_marks as ed', 'exam_date_sheet.id', '=', 'ed.sheet_id')
        ->select(
            'exam_date_sheet.exam_id',
            'exams.name as exam_name',
            'exams.type',
            DB::raw('GROUP_CONCAT(DISTINCT exam_date_sheet.id) as exam_ids'),
            DB::raw('GROUP_CONCAT(DISTINCT ed.id) as edIds'),
            DB::raw('GROUP_CONCAT(DISTINCT ed.student_id) as student_ids')
        )
        ->where('exam_date_sheet.course_id', $id1)
        ->where('exam_date_sheet.class_id', $id2)
        ->where('exam_date_sheet.section_id', $id3)
        ->groupBy('exam_date_sheet.exam_id', 'exams.name', 'exams.type')
        ->orderBy('exam_date_sheet.exam_id','ASC')
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

    public function compliedAllStudents($id1, $id2, $id3, $id4)
    {
        $exam_ids = explode(',', $id1);
        $jsonResult = [];

        // Initialize arrays for common fields and subject data
        $commonData = [
            'course_id' => $id2,
            'class_id' => $id3,
            'section_id' => $id4,
        ];

        foreach ($exam_ids as $examId) {
            $result = ExamDateSheet::join('exams', 'exams.id', '=', 'exam_date_sheet.exam_id')
                ->join('exam_date_sheet_marks as ed', 'exam_date_sheet.id', '=', 'ed.sheet_id')
                ->join('student_master as stud', 'stud.id', '=', 'ed.student_id')
                ->join('subject_master as sm', 'ed.subject_id', '=', 'sm.subjectId')
                ->select(
                    'exam_date_sheet.*',
                    'exams.name as exam_name',
                    'exams.type as exam_type',
                    'ed.subject_id',
                    'ed.marks_obtained',
                    'exam_date_sheet.max_mark',
                    'ed.theory',
                    'ed.assessment',
                    'ed.internal',
                    'ed.attend',
                    'sm.subjectName',
                    'ed.student_id',
                    'stud.student_name',
                    'stud.roll_no'
                )
                ->where('exam_date_sheet.exam_id', $examId)
                ->where('exam_date_sheet.course_id', $id2)
                ->where('exam_date_sheet.class_id', $id3)
                ->where('exam_date_sheet.section_id', $id4)
                ->orderBy('ed.student_id', 'ASC')
                ->get();

            if ($result->isNotEmpty()) {
                $studentDetailsCombined = [];

                foreach ($result as $row) {
                    $student_id = $row->student_id;

                    // Initialize student details if not set for this exam
                    if (!isset($studentDetailsCombined[$student_id])) {
                        $studentDetailsCombined[$student_id] = [
                            'student_id' => $row->student_id,
                            'student_name' => $row->student_name,
                            'roll_no' => $row->roll_no,
                            'total_marks_obtained' => 0,
                            'total_max_marks' => 0,
                            'grade' => '',
                        ];
                    }

                    // Add marks for the current exam and subject
                    $studentDetailsCombined[$student_id]['total_marks_obtained'] += $row->marks_obtained;
                    $studentDetailsCombined[$student_id]['total_max_marks'] += $row->max_mark;

                    // Calculate percentage and grade for this exam
                    if ($studentDetailsCombined[$student_id]['total_max_marks'] > 0) {
                        $percentage = ($studentDetailsCombined[$student_id]['total_marks_obtained'] / $studentDetailsCombined[$student_id]['total_max_marks']) * 100;

                        // Fetch grade from the Grade table based on the percentage
                        $grade = Grade::where('marksAbove', '<=', $percentage)
                            ->where('marksLess', '>=', $percentage)
                            ->first();

                        $studentDetailsCombined[$student_id]['grade'] = $grade ? $grade->grade : 'N/A';
                    } else {
                        $studentDetailsCombined[$student_id]['grade'] = 'N/A';
                    }
                }

                // Add exam and student details to the result
                $jsonResult[] = [
                    'exam_info' => [
                        'exam_id' => $examId,
                        'exam_name' => $result->first()->exam_name,
                        'exam_type' => $result->first()->exam_type,
                        'sheet_id' => $result->first()->id,
                    ],
                    'studentDetails' => array_values($studentDetailsCombined)
                ];
            }
        }

        $finalResult = array_merge($commonData, [
            'exams' => $jsonResult
        ]);

        if (!empty($finalResult)) {
            return response()->json(["status" => 'successed', "success" => true, "data" => $finalResult]);
        } else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found", "data" => ""]);
        }
    }






}
