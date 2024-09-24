<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use App\Models\Htl_user;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;   
use Illuminate\Http\Request;

use App\Models\SessionMaster;   
use App\Models\Course;
use App\Models\Classic;
use Carbon\Carbon;  
use Helper;    

class CourseController extends Controller
{

    public function add_course_process(Request $req)  
	{
		$inputs = $req->all();		
		
        $rules = [             
            'courseName'=>"required|unique:course_master,courseName|max:255",		            
        ];

        $messages = [
            'required' => 'The :attribute field is required.',
        ];

        $fields = [
            'courseName' => 'Course Name',  
        ];
		
		$validator = Validator::make($inputs, $rules, $messages, $fields);

        // if validation fails
        if ($validator->fails()) {	
			
			foreach($validator->errors()->getMessages() as $validationErrors)
			{
				if (is_array($validationErrors)) 
				{
					foreach($validationErrors as $validationError)
					{
						$error[] = $validationError;				
					} 
				} else {
					$error[] = $validationErrors;
				} 				
			}
            return response()->json(["status"=>false,"message"=>implode(',',$error)]);  
        } else {	

			$courseName=$req->input('courseName');
			$remark=$req->input('remark');
			$school_id=$req->input('schoolId');  
			$fiscal_yr=Helper::getFiscalYear(date('m'));  
			$fiscal_arr=explode(':',$fiscal_yr);	
			$fiscalYear=SessionMaster::where('session_start',$fiscal_arr[0])->where('session_end',$fiscal_arr[1])->get();
			$fiscal_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0;      
			$values = array('courseName' => ucfirst($courseName),'remark' => $remark,'session_id'=>$fiscal_id,'school_id'=>$school_id,'status'=>1);		       

			if(DB::table('course_master')->insert($values))
			{ 				
				return response()->json(["status"=>true,"message"=>"Course Added"]);  			
			}
			else{
				return response()->json(["status"=>false,"message"=>"Course Not Added"]);    					
			}
       
		}

    }



    public function course_list(Request $request){
        $search = $request->search;
		$limit = $request->limit;
		$page = $request->page;
		$order = $request->order;
		$order_by = $request->orderBy;

		$offset = ($page-1)*$limit;

		$query1 = Course::select(DB::raw('count(*) as row_count'));
		if($search !='')
		{
			$query1->where('courseName', 'like', '%'.$search.'%');
		}

		$records = $query1->get();

		$query2 = Course::offset($offset)->limit($limit);
		if($search !='')
		{
			$query2->where('courseName', 'like', '%'.$search.'%');
		}
		if($order_by !='')
		{
			$query2->orderBy($order_by,$order);
		}

		$courses = $query2->get();

        if(count($courses) > 0)
		{
			$response_arr = array('data'=>$courses,'total'=>$records[0]->row_count);
            return response()->json(["status" => "successed", "success" => true,"data" => $response_arr]);
        }
        else {
			$response_arr = array('data'=>[],'total'=>0);
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found","data" => $response_arr]);
        }
    }

    public function course_list_id($id){
        $data=array();
        $data= DB::table('course_master')
         ->where('courseId',$id)
         ->get();

         if(count($data) > 0){
             return ['status'=>True, 'data'=> $data];
         }
         else{
             return ['status'=>False, 'data'=>$data];
         }
    }


    public function update_course_process(Request $req){

        $courseName =   $req->input('courseName');
        $remark     =   $req->input('remark');
        $id         =   $req->input('id');

        // dd($req);
        $values = array('Remark' => $remark, 'courseName'=> ucfirst($courseName));

        if( DB::table('course_master')->where('courseId','=',$id)->update($values)){
            return ['status'=>True, 'message'=>'Course Updated'];
        }
        else{
            return ['status'=>False, 'message'=>'Course Not Updated'];
        }

    }

    public function delete_course_process($id){
        $courses = Course::where('courseId', $id)->get();
        $courseId = $courses[0]->courseId ?? '';			

        if ($courseId > 0) {
            $classes = Classic::select(DB::raw('count(*) as record_count'))
                ->where('courseId', $courseId)
                ->get();

            if ($classes[0]->record_count > 0) {
                return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! failed to delete, course having classes!!", "errors" => '']);
            } else {
                Course::where('courseId', $id)->delete();
                return response()->json(["status" => 'successed', "success" => true, "message" => "Course record deleted successfully", "data" => '']);
            }
        } else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! failed to delete,!!", "errors" => '']);
        }
    }
}
