<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\Models\ParentLogin;
use App\Models\StudentMaster;
use Illuminate\Support\Facades\DB;

class ParentController extends Controller
{

   public function parent_single($id)
   {
		$parent = StudentMaster::where('student_master.id',$id)->join('parent_login','parent_login.s_id','=','student_master.id')->get();
		$recordExist = $parent[0]->s_id ??0;

		if(!$recordExist){
			return response()->json(["status" => "failed", "message" => "Whoops! no records found, parent information does not exist!!","errors" =>'']);
		}
		else {
			return response()->json(["status" =>'successed', "success" => true, "message" => "Parents record found successfully","data" =>$parent]);
		}
   }

   public function child_details()
   {

   }

   public function fee_payment()
   {

   }
   public function getSuggestion($search)
   {
        $result=StudentMaster::leftJoin('class_master as cs','student_master.class_id','=','cs.classId')
			->leftJoin('station_master as sm','student_master.station_id','=','sm.stationId')
			->select('student_master.*','cs.className','sm.stationName')
			->where('cs.className','like','%'.$search.'%')
            ->orWhere('student_master.student_name','like','%'.$search.'%')
			->orWhere('student_master.father_name','like','%'.$search.'%')
			->orWhere('student_master.sibling_admission_no','like','%'.$search.'%')
            ->get();

        if(count($result)>0) {
            return response()->json(["status" => "successed", "success" => true, "data" => $result]);
        }
        else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no result found"]);
        }
   }


   public function fee_history()
   {

   }

   public function homework()
   {

   }

   public function attendance_report()
   {

   }

}
