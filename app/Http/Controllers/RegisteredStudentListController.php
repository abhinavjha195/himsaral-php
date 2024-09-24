<?php

namespace App\Http\Controllers;
 
use Illuminate\Http\Request; 
use Illuminate\Support\Facades\Validator;  				
use Illuminate\Support\Facades\DB; 
use Illuminate\Support\Facades\Hash;      
 		
use App\Models\Course;  
use App\Models\School;     	   
use App\Models\ParentLogin;       
use App\Models\SessionMaster;  
use App\Models\StudentMaster;  
use App\Exports\RegistrationExport;
use Helper; 
use Image;  
use Maatwebsite\Excel\Facades\Excel;  

class RegisteredStudentListController extends Controller
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

		
		$offset = ($page-1)*$limit;   			
		
		$query = StudentMaster::leftJoin('course_master as cm', 'student_master.course_id', '=', 'cm.courseId') 		
				->select(DB::raw('count(*) as row_count'))
				->where('student_master.registration_id', '<>', '0');
		
		if($search !='')	
		{  
			$query->where(function($q) use ($search) {
				 $q->where('student_master.student_name', 'like', '%'.$search.'%')
                 ->orwhere('student_master.father_name', 'like', '%'.$search.'%')
                 ->orwhere('student_master.email', 'like', '%'.$search.'%')	
                 ->orwhere('student_master.mobile', 'like', '%'.$search.'%')	
                 ->orwhere('student_master.permanent_address', 'like', '%'.$search.'%')		   		   		   	
                 ->orWhere('cm.courseName', 'like', '%'.$search.'%');				
			 });   
		}
			 
		$records = $query->get();  	
		
		$student_query = StudentMaster::leftJoin('course_master as cm', 'student_master.course_id', '=', 'cm.courseId') 		
		->select(DB::raw('count(*) as row_count'))
		->where('student_master.registration_id', '<>', '0')
		->selectRaw("student_master.id,student_master.student_name,student_master.mobile,student_master.father_name,student_master.email,student_master.permanent_address,cm.courseName")	
		->offset($offset)->limit($limit);  	
					
		
		if($search !='')	
		{  
			$student_query->where(function($q) use ($search) {
				 $q->where('student_master.student_name', 'like', '%'.$search.'%')
				   ->orwhere('student_master.father_name', 'like', '%'.$search.'%')
				   ->orwhere('student_master.email', 'like', '%'.$search.'%')	
                   ->orwhere('student_master.mobile', 'like', '%'.$search.'%')	
                   ->orwhere('student_master.permanent_address', 'like', '%'.$search.'%')		   		   		   	
				   ->orWhere('cm.courseName', 'like', '%'.$search.'%');		
			 });   
		}
		
		if($order_by !='')	
		{
			$student_query->orderBy($order_by,$order); 				
		}	
		
		$registrations = $student_query->groupBy('student_master.id')->get();  
 		
        if(count($registrations) > 0) 
		{
			$response_arr = array('data'=>$registrations,'total'=>$records[0]->row_count,'query'=>$request->all());			
            return response()->json(["status" => "successed", "success" => true,"data" => $response_arr]);	
        }
        else {
			$response_arr = array('data'=>[],'total'=>$records[0]->row_count,'query'=>$request->all());	
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found","data" => $response_arr]);		
        }	
		
    } 
}
