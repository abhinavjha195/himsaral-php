<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use App\Models\Course;
use App\Models\Section;
use Illuminate\Support\Facades\DB;

class SectionController extends Controller
{
    public function __construct()
    {
        DB::statement("SET SQL_MODE=''");
    }

    public function add_section_process(Request $req)
    {

        $courseId = $req->input('courseId');
        $classId = $req->input('classId');
        $sectionName = $req->input('sectionName');
        $remark = $req->input('remark');
        $status = $req->input('status');
        // echo $userId;
        // echo $password;
        $values = array('courseId' => $courseId, 'remark' => $remark, 'classId' => $classId, 'sectionName' => ucfirst($sectionName), 'status' => $status);

        // echo count($data);

        if (DB::table('section_master')->insert($values)) {
            return ['status' => True, 'message' => 'Section Added'];
        } else {
            return ['status' => False, 'message' => 'Section Not Added'];
        }
        // echo "<br>";

    }

    public function edit_section_process(Request $req)
    {

        $courseId = $req->input('courseId');
        $classId = $req->input('classId');
        $sectionName = $req->input('sectionName');
        $remark = $req->input('remark');
        $status = $req->input('status');
        $id = $req->input('id');
        // echo $userId;
        // echo $password;
        $values = array('courseId' => $courseId, 'remark' => $remark, 'classId' => $classId, 'sectionName' => ucfirst($sectionName), 'status' => $status);

        // echo count($data);

        if (DB::table('section_master')->where('sectionId', '=', $id)->update($values)) {
            return ['status' => True, 'message' => 'Section Added'];
        } else {
            return ['status' => False, 'message' => 'Section Not Added'];
        }
        // echo "<br>";

    }

    public function section_list(Request $request)
    {
        $search = $request->search;
        $limit = $request->limit;
        $page = $request->page;
        $order = $request->order;
        $order_by = $request->orderBy;

        $offset = ($page - 1) * $limit;

        $query1 = DB::table('section_master')
            ->join('course_master', 'section_master.courseId', '=', 'course_master.courseId')
            ->join('class_master', 'section_master.classId', '=', 'class_master.classId')
            ->select(DB::raw('count(*) as row_count'));
        if ($search != '') {
            $query1->where('courseName', 'like', '%' . $search . '%')
                ->orWhere('className', 'like', '%' . $search . '%')
                ->orWhere('sectionName', 'like', '%' . $search . '%')
                ->orWhere('section_master.status', 'like', '%' . $search . '%');
        }

        $records = $query1->get();

        $query2 = DB::table('section_master')
            ->join('course_master', 'section_master.courseId', '=', 'course_master.courseId')
            ->join('class_master', 'section_master.classId', '=', 'class_master.classId')
            ->select("section_master.*", 'course_master.courseName', 'class_master.className')
            ->offset($offset)->limit($limit);
        if ($search != '') {
            $query2->where('courseName', 'like', '%' . $search . '%')
            ->orWhere('className', 'like', '%' . $search . '%')
            ->orWhere('sectionName', 'like', '%' . $search . '%')
            ->orWhere('section_master.status', 'like', '%' . $search . '%');
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

    public function section_by_id($id)
    {
        $data = array();
        $data = DB::table('section_master')
            ->select('*')
            ->where('sectionId', $id)
            ->get();

        // echo count($data);

        if (count($data) > 0) {
            return ['status' => True, 'data' => $data];
        } else {
            return ['status' => False, 'data' => $data];
        }
    }

    public function section_list_by_course_class($course_id, $class_id)
    {
        $data = array();
        $data = DB::table('section_master')
            ->select('*')
            ->where('courseId', $course_id)
            ->where('classId', $class_id)
            ->get();

        // echo count($data);

        if (count($data) > 0) {
            return ['status' => True, 'data' => $data];
        } else {
            return ['status' => False, 'data' => $data];
        }
    }

    public function section_class_list_by_course($set)
    {
        $arr = explode(',', $set);

        $result = Course::leftJoin('class_master as cm', 'course_master.courseId', '=', 'cm.courseId')
            ->leftJoin("section_master as sm", function ($join) {
                $join->on("course_master.courseId", "=", "sm.courseId");
                $join->on("cm.classId", "=", "sm.classId");
            })
            ->select(DB::raw("course_master.courseId,course_master.courseName,IFNULL(cm.classId,0) as class_id,IFNULL(cm.className,'') as class_name,IFNULL(GROUP_CONCAT(DISTINCT sm.sectionId ORDER BY sm.sectionId ASC SEPARATOR ','),'') as section_ids,IFNULL(GROUP_CONCAT(DISTINCT sm.sectionName ORDER BY sm.sectionId ASC SEPARATOR ','),'') as section_names"))
            ->where('cm.status', 1)
            ->where(
                function ($query) {
                    return $query
                        ->where('sm.status', 1)
                        ->orWhereNull('sm.status');
                }
            )
            ->where('course_master.status', 1)
            ->whereIn('course_master.courseId', $arr)
            ->groupBy('course_master.courseId')
            ->groupBy('cm.classId')
            ->get();

        if (count($result) > 0) {
            $response_arr = array("status" => 'successed', "success" => true, "message" => "Record found successfully.", "errors" => [], "data" => $result);
        } else {
            $response_arr = array("status" => "failed", "success" => false, "message" => "Whoops! no record found !!", "errors" => '', "data" => []);
        }

        return response()->json($response_arr);
    }

    public function delete_section_process($id)
    {
        $sections = Section::where('sectionId', $id)->get();
        $sectionId = $sections[0]->sectionId ?? '';

        if ($sectionId > 0) {
            Section::where('sectionId', $id)->delete();
            return response()->json(["status" => 'successed', "success" => true, "message" => "Section record deleted successfully", "data" => '']);
        } else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! failed to delete,!!", "errors" => '']);
        }
    }


}
