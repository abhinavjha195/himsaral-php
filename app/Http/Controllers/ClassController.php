<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

use App\Models\ClasswiseSubject;
use App\Models\SessionMaster;
use App\Models\SectionMaster;
use App\Models\SubjectMaster;
use App\Models\Classic;
use App\Models\Course;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Helper;

class ClassController extends Controller
{
    public function __construct()
    {
        DB::statement("SET SQL_MODE=''");
    }

    public function index(Request $request)
    {
        $search = $request->search;
        $limit = $request->limit;
        $page = $request->page;
        $order = $request->order;
        $order_by = $request->orderBy;

        $offset = ($page - 1) * $limit;

        $query1 = Classic::leftJoin('course_master', 'class_master.courseId', '=', 'course_master.courseId')
            ->select(DB::raw('count(*) as row_count'));
        if ($search != '') {
            $query1->where('courseName', 'like', '%' . $search . '%')
                ->orWhere('className', 'like', '%' . $search . '%')
                ->orWhere('class_master.status', 'like', '%' . $search . '%')
                ->orWhere('class_master.Remark', 'like', '%' . $search . '%');
        }

        $records = $query1->get();

        $query2 = Classic::leftJoin('course_master', 'class_master.courseId', '=', 'course_master.courseId')
            ->select('class_master.*', 'course_master.courseName')
            ->offset($offset)->limit($limit);
        if ($search != '') {
            $query2->where('courseName', 'like', '%' . $search . '%')
            ->orWhere('className', 'like', '%' . $search . '%')
            ->orWhere('class_master.status', 'like', '%' . $search . '%')
            ->orWhere('class_master.Remark', 'like', '%' . $search . '%');
        }
        if ($order_by != '') {
            $query2->orderBy($order_by, $order);
        }

        $classes = $query2->get();

        if (count($classes) > 0) {
            $response_arr = array('data' => $classes, 'total' => $records[0]->row_count);
            return response()->json(["status" => "successed", "success" => true, "data" => $response_arr]);
        } else {
            $response_arr = array('data' => [], 'total' => 0);
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found", "data" => $response_arr]);
        }
    }

    public function create(Request $request)
    {
        $inputs = $request->all();

        $rules = [
            "course_id"        =>      "required",
            'title'            =>      "required|unique:class_master,className|max:255",
            "status"           =>      "required",
            // "remark"           =>      "required"
        ];

        $messages = [
            'required' => 'The :attribute field is required.',
        ];

        $fields = [
            'course_id' => 'Course Name',
            'title' => 'Title',
            'status' => 'Status',
            'remark' => 'Remark'
        ];

        $validator = Validator::make($inputs, $rules, $messages, $fields);

        // if validation fails
        if ($validator->fails()) {
            return response()->json(["status" => "failed", "message" => "Please fill all fields!!", "errors" => $validator->errors()]);
        } else {
            $course_id                =       $request->course_id;

            $insertArray              =       array(
                "courseId"            =>      $request->course_id,
                "className"           =>      $request->title,
                "status"               =>      $request->status,
                "Remark"               =>      $request->remark

            );

            $class = Classic::create($insertArray);

            if (!is_null($class)) {

                return response()->json(["status" => 'successed', "success" => true, "message" => "class record created successfully", "data" => $class]);
            } else {
                return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! failed to create."]);
            }
        }
    }

    public function getCourses()
    {
		$fiscal_yr=Helper::getFiscalYear(date('m'));
		$fiscal_arr=explode(':',$fiscal_yr);
		$fiscalYear=SessionMaster::where('session_start',$fiscal_arr[0])->where('session_end',$fiscal_arr[1])->get();
		$fiscal_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0;

        $courses = Course::where('session_id',$fiscal_id)->get();
        if (count($courses) > 0) {
            return response()->json(["status" => "successed", "success" => true, "data" => $courses]);
        } else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found"]);
        }
    }

	public function getNextCourse()
    {
		$fiscal_yr=Helper::getFiscalYear(date('m'));
		$fiscal_arr=explode(':',$fiscal_yr);

		$next_start = Carbon::parse($fiscal_arr[0]);
		$next_end = Carbon::parse($fiscal_arr[1]);

		$fiscal_start = $next_start->copy()->addYear();
		$fiscal_end = $next_end->copy()->addYear();

		$fiscalYear=SessionMaster::where('session_start',date('Y-m-d',strtotime($fiscal_start)))
					->where('session_end',date('Y-m-d',strtotime($fiscal_end)))
					->get();

		$fiscal_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0;

		$courses = Course::where('session_id',$fiscal_id)->get();

        if (count($courses) > 0) {
            return response()->json(["status" => "successed", "success" => true, "data" => $courses]);
        } else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found"]);
        }
    }

	public function getClasses()
    {
        $classes = Classic::all();
        if (count($classes) > 0) {
            return response()->json(["status" => "successed", "success" => true, "data" => $classes]);
        } else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found", "data" =>[] ]);
        }
    }

    public function edit($id)
    {
        $classInfo = Classic::where('classId', $id)->get();
        $recordExist = $classInfo[0]->classId ?? 0;

        $course_string = '';

        if (!$recordExist) {
            return response()->json(["status" => "failed", "message" => "Whoops! failed to edit, class does not exist!!", "errors" => '']);
        } else {

            $class_data = Classic::leftJoin('course_master', 'class_master.courseId', '=', 'course_master.courseId')
                ->select('class_master.*', 'course_master.courseName')
                ->where('class_master.classId', $id)
                ->get();

            $courses = Course::all();

            $data_arr = array('course_data' => $courses, 'class_data' => $class_data);

            return response()->json(["status" => 'successed', "success" => true, "message" => "class record edited successfully", "data" => $data_arr]);
        }
    }

    public function update(Request $request, $id)
    {
        $inputs = $request->all();

        $classInfo = Classic::where('classId', $id)->get();
        $classTitle = $classInfo[0]->className ?? '';
        $classId = 0;

        if ($classTitle != $request->title) {
            $conditionArr              =       array(
                "courseId"            =>      $request->course_id,
                "className"           =>      $request->title
            );

            $classInfo = Classic::where($conditionArr)->get();
            $classId =  $classInfo[0]->classId ?? 0;
        }

        // validate inputs
        $validator = Validator::make(
            $inputs,
            [
                "course_id"        =>      "required",
                "title"            =>      "required",
                "status"           =>      "required",
                // "remark"           =>      "required"
            ]
        );

        // if validation fails
        if ($validator->fails()) {
            return response()->json(["status" => "failed", "message" => "Please fill all fields!!", "errors" => $validator->errors()]);
        } else if ($classId > 0) {
            return response()->json(["status" => "failed", "message" => "Class already exist!!", "errors" => '']);
        } else {
            $updateArray              =       array(
                "courseId"            =>      $request->course_id,
                "className"           =>      $request->title,
                "status"               =>     $request->status,
                "Remark"               =>     $request->remark

            );

            Classic::where('classId', $id)->update($updateArray);

            return response()->json(["status" => 'successed', "success" => true, "message" => "class record edited successfully", "data" => '']);
        }
    }

    public function delete($id)
    {
        $classInfo = Classic::where('classId', $id)->get();
        $classId = $classInfo[0]->classId ?? '';

        if ($classId > 0) {
            $sections = SectionMaster::select(DB::raw('count(*) as record_count'))
                ->where('classId', $classId)
                ->get();

            if ($sections[0]->record_count > 0) {
                return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! failed to delete, class having sections!!", "errors" => '']);
            } else {
                Classic::where('classId', $id)->delete();
                return response()->json(["status" => 'successed', "success" => true, "message" => "class record deleted successfully", "data" => '']);
            }
        } else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! failed to delete,!!", "errors" => '']);
        }
    }

    public function getClassByCourse($id)
    {
		$fiscal_yr=Helper::getFiscalYear(date('m'));
		$fiscal_arr=explode(':',$fiscal_yr);
		$fiscalYear=SessionMaster::where('session_start',$fiscal_arr[0])->where('session_end',$fiscal_arr[1])->get();
		$fiscal_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0;
        $classlists = Classic::where('courseId',$id)->get();
        // $classlists = Classic::where('courseId',$id)->where('session_id',$fiscal_id)->get();

        if (!empty($classlists)) {
            return response()->json(["status" => "successed", "success" => true, "data" => $classlists]);
        } else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found"]);
        }
    }

	public function getNextClassByCourse($id)
    {
		$fiscal_yr=Helper::getFiscalYear(date('m'));
		$fiscal_arr=explode(':',$fiscal_yr);

		$next_start = Carbon::parse($fiscal_arr[0]);
		$next_end = Carbon::parse($fiscal_arr[1]);

		$fiscal_start = $next_start->copy()->addYear();
		$fiscal_end = $next_end->copy()->addYear();

		$fiscalYear=SessionMaster::where('session_start',date('Y-m-d',strtotime($fiscal_start)))
					->where('session_end',date('Y-m-d',strtotime($fiscal_end)))
					->get();

		$fiscal_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0;

        $classlists = Classic::where('courseId',$id)->where('session_id',$fiscal_id)->get();

        if (!empty($classlists)) {
            return response()->json(["status" => "successed", "success" => true, "data" => $classlists]);
        } else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found"]);
        }
    }

    public function getSectionByClassAndCourse($class_id, $course_id)
    {
		$fiscal_yr=Helper::getFiscalYear(date('m'));
		$fiscal_arr=explode(':',$fiscal_yr);
		$fiscalYear=SessionMaster::where('session_start',$fiscal_arr[0])->where('session_end',$fiscal_arr[1])->get();
		$fiscal_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0;

        $sections = SectionMaster::where('classId',$class_id)->where('courseId',$course_id)->get();

        // $sections = SectionMaster::where('classId',$class_id)->where('courseId',$course_id)->where('session_id',$fiscal_id)->get();
        if (!empty($sections)) {
            return response()->json(["status" => "successed", "success" => true, "data" => $sections]);
        } else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found"]);
        }
    }

	public function getNextSectionByClassAndCourse($class_id, $course_id)
    {
		$fiscal_yr=Helper::getFiscalYear(date('m'));
		$fiscal_arr=explode(':',$fiscal_yr);

		$next_start = Carbon::parse($fiscal_arr[0]);
		$next_end = Carbon::parse($fiscal_arr[1]);

		$fiscal_start = $next_start->copy()->addYear();
		$fiscal_end = $next_end->copy()->addYear();

		$fiscalYear=SessionMaster::where('session_start',date('Y-m-d',strtotime($fiscal_start)))
					->where('session_end',date('Y-m-d',strtotime($fiscal_end)))
					->get();

		$fiscal_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0;

        $sections = SectionMaster::where('classId',$class_id)
					->where('courseId',$course_id)->where('session_id',$fiscal_id)->get();
        if (!empty($sections)) {
            return response()->json(["status" => "successed", "success" => true, "data" => $sections]);
        } else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found"]);
        }
    }

    public function getSectionSubjectByClass($course_id, $class_id, $section_id = null)
    {
        $row_arr = array();
        if ($section_id != '') {
            $classwise = ClasswiseSubject::where('courseId', $course_id)
                ->where('classId', $class_id)
                ->where('sectionId', $section_id)
                ->get();
        } else {
            $classwise = ClasswiseSubject::where('courseId', $course_id)
                ->where('classId', $class_id)
                ->get();
        }

        foreach ($classwise as $cw) {
            array_push($row_arr, $cw->id);
        }

        $sections = SectionMaster::where('classId', $class_id)->where('courseId', $course_id)->get();

        if (count($sections) > 0) {
            $subjects = SubjectMaster::leftJoin('class_wise_sub_desc as cw', 'subject_master.subjectId', '=', 'cw.subjectId')
                ->select('subject_master.subjectId', 'subject_master.subjectName')
                ->whereIn('cw.csId', $row_arr)
                ->where('subject_master.status', 1)
                ->groupBy('subject_master.subjectId')
                ->get();

            $data = array(
                'sections' => $sections,
                'subjects' => $subjects
            );

            return response()->json(["status" => "successed", "success" => true, "message" => "record found", "data" => $data]);
        } else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found", "data" => []]);
        }
    }

    public function getSubjects()
    {
        $subjects = SubjectMaster::where('status', 1)->get();
        if (!empty($subjects)) {
            return response()->json(["status" => "successed", "success" => true, "data" => $subjects]);
        } else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found"]);
        }
    }

    public function class_list_by_id($id)
    {
        $data = DB::table('class_master')
            ->select('*')
            ->where('courseId', $id)
            ->get();

        if (count($data) > 0) {
            return ['status' => True, 'data' => $data];
        } else {
            return ['status' => False, 'data' => $data];
        }
    }
}
