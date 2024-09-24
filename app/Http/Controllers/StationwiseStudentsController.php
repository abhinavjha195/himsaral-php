<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use PDF;

use App\Models\StationMaster;
use App\Models\StudentMaster;		
use App\Models\School;

class StationwiseStudentsController extends Controller
{
    public function __construct()
    {
    }


    public function getStations()
    {

        $stations = StationMaster::all();
        if (count($stations) > 0) {
            return response()->json(["status" => "successed", "success" => true, "count" => count($stations), "data" => $stations]);
        } else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found"]);
        }
    }

    public function getStudents($id)
    {
        $students = StudentMaster::leftJoin('course_master as cr', 'student_master.course_id', '=', 'cr.courseId')
            ->leftJoin('class_master as cm', 'student_master.class_id', '=', 'cm.classId')
            ->leftJoin('station_master as sm', 'student_master.station_id', '=', 'sm.stationId')
            ->select(
                'student_master.student_name',
                'student_master.father_name',
                'student_master.admission_no',
                'student_master.f_mobile',
                'sm.stationName',
                'sm.stationId',
                'cr.courseName',		
                'cm.className'
            )
            ->where('student_master.station_id', $id)		
            ->get();
        if (count($students) > 0) {
            return response()->json(["status" => "successed", "success" => true, "count" => count($students), "data" => $students]);
        } else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found"]);
        }
    }

    public function getPrints($id)
    {

            $school=School::where('school_code','S110')->get();
			$student_receipt=StudentMaster::leftJoin('course_master as cr', 'student_master.course_id', '=', 'cr.courseId')
            ->leftJoin('class_master as cm', 'student_master.class_id', '=', 'cm.classId')
            ->leftJoin('station_master as sm', 'student_master.station_id', '=', 'sm.stationId')
            ->select(
                'student_master.student_name',
                'student_master.father_name',
                'student_master.admission_no',
                'student_master.f_mobile',			
                'sm.stationName',
                'sm.stationId',
                'cr.courseName',
                'cm.className'
            )
            ->where('student_master.station_id', $id)		
            ->get();

			$data = array('school'=>$school,'receipt'=>$student_receipt);

			$receipt_name=time().rand(1,99).'.'.'pdf';

            $customPaper = array(0,0,216,300);


		    $pdf = PDF::loadView("stationwise_student_print",$data)->setPaper('A4')->save(public_path("print/stationwise_student/$receipt_name"));

			$message="Receipt generated successfully, get the receipt.";

			$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data" =>$receipt_name);

		return response()->json($response_arr);

    }
}

