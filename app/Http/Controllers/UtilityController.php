<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

use App\Models\RouteMaster;
use App\Models\StationMaster;
use App\Models\StudentMaster;
use App\Models\ResultSetting;
use Illuminate\Support\Facades\DB;

class UtilityController extends Controller
{
	public function __construct()
    {
        DB::statement("SET SQL_MODE=''");
    }

    public function getStudents($id1, $id2, $id3=null)
    {
        $info = DB::table('student_master as sm')
            ->select('sm.course_id', 'sm.class_id', 'sm.section_id', 'sm.student_name', 'sm.id', 'sm.admission_no', 'sm.roll_no')
           
            ->where('sm.course_id', $id1)
            ->where('sm.class_id', $id2)
            ->when($id3, function ($query, $id3) {
                return $query->where('sm.section_id', $id3);
            })
          
            ->get();

		if ($info->isNotEmpty())
		{
			return response()->json(["status"=>'successed',"success"=>true,"data"=>$info]);
		}
		else {
			return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found","data" =>""]);
		}

	}

    public function saveResult(Request $request)
    {
        // Validate the request data
        $request->validate([
            'student_id' => 'required|integer',
            'show_result' => 'required|boolean',
        ]);

        // Assuming you have a StudentResultSetting model or similar table
        $studentId = $request->input('student_id');
        $showResult = $request->input('show_result');

        // Example: Update or create a record in the database
        $resultSetting = ResultSetting::updateOrCreate(
            ['student_id' => $studentId], // Find by student_id
            ['show_result' => $showResult] // Update the show_result field
        );

        // Respond with success
        return response()->json([
            'message' => 'Result setting saved successfully',
            'data' => $resultSetting
        ], 200);
    }

  

}
