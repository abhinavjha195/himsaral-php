<?php
 
namespace App\Http\Controllers;
 
use Illuminate\Http\Request; 
use Illuminate\Support\Facades\Validator;  						
use Illuminate\Support\Facades\DB;   

use App\Models\StudentMaster; 
use App\Models\SessionMaster;       
use Carbon\Carbon;  
use Helper;     		       		  							 
 
class StudentPromotionController extends Controller						
{  
	public function __construct()
    {
       DB::statement("SET SQL_MODE=''"); 			
    }  
	
	public function getDetail($course_id,$class_id,$section_id = null)		
	{
		$fiscal_yr=Helper::getFiscalYear(date('m'));  
		$fiscal_arr=explode(':',$fiscal_yr);

		$next_start = Carbon::parse($fiscal_arr[0]);  
		$next_end = Carbon::parse($fiscal_arr[1]); 

		$fiscal_start = $next_start->copy()->addYear();   
		$fiscal_end = $next_end->copy()->addYear(); 
		
		$fiscalYear=SessionMaster::where('session_start',$fiscal_arr[0])->where('session_end',$fiscal_arr[1])->get();
		$fiscal_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0;    		
		
		$fiscalNext=SessionMaster::where('session_start',date('Y-m-d',strtotime($fiscal_start)))
					->where('session_end',date('Y-m-d',strtotime($fiscal_end)))
					->get(); 		
		
		$next_id=(count($fiscalNext)>0)?$fiscalNext[0]->id:0; 	
		$promote_arr=array(0);  

		$promotes = StudentMaster::select("student_master.origin_id")   									
				->where('student_master.session_id',$next_id)  
				->get();	
				
		foreach($promotes AS $promote)		
		{
			array_push($promote_arr,$promote->origin_id); 		
		}				
		
		if ($section_id != '') {		
				
			$info = StudentMaster::leftJoin('class_master as cs','student_master.class_id','=','cs.classId')
				->leftJoin('course_master as cm', 'student_master.course_id', '=', 'cm.courseId')  
				->leftJoin('section_master as sm', 'student_master.section_id', '=', 'sm.sectionId')
				->select(DB::raw('count(*) as row_count'))  
				->where('student_master.course_id',$course_id)
				->where('student_master.class_id',$class_id)
				->where('student_master.section_id',$section_id)
				->where('student_master.session_id',$fiscal_id)  
				->whereNotIn('student_master.id',$promote_arr)
                ->get();  
				
        } else {
            $info = StudentMaster::leftJoin('class_master as cs','student_master.class_id','=','cs.classId')
				->leftJoin('course_master as cm', 'student_master.course_id', '=', 'cm.courseId')   				
				->select(DB::raw('count(*) as row_count'))  
				->where('student_master.course_id',$course_id)
				->where('student_master.class_id',$class_id)
				->where('student_master.session_id',$fiscal_id)
				->whereNotIn('student_master.id',$promote_arr)
                ->get();  
        }		

		if($info[0]->row_count > 0)  	
		{
			if ($section_id != '') {	
				
				$record = StudentMaster::leftJoin('class_master as cs','student_master.class_id','=','cs.classId')
					->leftJoin('course_master as cm', 'student_master.course_id', '=', 'cm.courseId')  
					->leftJoin('section_master as sm', 'student_master.section_id', '=', 'sm.sectionId')
					->selectRaw("student_master.id,student_master.student_name,student_master.admission_no,cs.className,ifnull(sm.sectionName,'N/A') AS section_name")   
					->where('student_master.course_id',$course_id)
					->where('student_master.class_id',$class_id)
					->where('student_master.section_id',$section_id)
					->where('student_master.session_id',$fiscal_id)  
					->whereNotIn('student_master.id',$promote_arr)
					->get();  
					
			} else {
				$record = StudentMaster::leftJoin('class_master as cs','student_master.class_id','=','cs.classId')
					->leftJoin('course_master as cm', 'student_master.course_id', '=', 'cm.courseId')
					->leftJoin('section_master as sm', 'student_master.section_id', '=', 'sm.sectionId')  	
					->selectRaw("student_master.id,student_master.student_name,student_master.admission_no,cs.className,ifnull(sm.sectionName,'N/A') AS section_name")      
					->where('student_master.course_id',$course_id)
					->where('student_master.class_id',$class_id)
					->where('student_master.session_id',$fiscal_id)   	
					->whereNotIn('student_master.id',$promote_arr)
					->get();      
			}		

			$response_arr = array("status" => "successed", "success" => true, "message" => "Students record found","data" =>$record);  					
        }
        else {
			$response_arr = array("status" => "failed", "success" => false, "message" => "Whoops! no record found","data" =>[]);	         		
        }			

		return response()->json($response_arr);							
	}
	
	public function add(Request $request)	  		
	{
		$inputs=$request->all();   	
		$lists=$request->students;   
		$id_arr=array();  
		$count=0; 	
		
		foreach($lists AS $k=>$v)
		{
			if($v==true)
			{
				array_push($id_arr,$k);  				
			} 			
		}  	

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
		
		$rules=[ 
			'course_id' => 'required', 		
			'class_id' => 'required', 			
		];   
		
		$fields = [       
			'course_id' => 'Course',	  
			'class_id' => 'Class',	  
		]; 

		$messages = [
			'required' => 'The :attribute field is required.',    
		];  	
		
		$validator = Validator::make($inputs, $rules, $messages, $fields);   	    		
 
        if ($validator->fails()) {  	
			$errors=$validator->errors();      			  
			$response_arr=array("status"=>"failed","message"=>"Please fill required fields!!","errors"=>$errors);     
        }
		else if(count($id_arr)==0)		
		{ 					  
			$response_arr=array("status"=>"failed","message"=>"No student found to promote!!","errors"=>"");     
		}
		else if(count($fiscalYear)==0)		
		{ 					  
			$response_arr=array("status"=>"failed","message"=>"Please create next financial year!!","errors"=>"");     
		}
		else
		{ 	
			// $promotions=StudentMaster::whereIn('id',$id_arr)->get();    			

			foreach($id_arr as $id) 
			{	
				$student = StudentMaster::find($id);		
				if($student)
				{						
					$promote = $student->replicate();  
					$promote->course_id = $request->course_id;			
					$promote->class_id = $request->class_id;	
					$promote->section_id = empty($request->section_id)?0:$request->section_id;	  
					$promote->session_id = $fiscal_id;	  	
					$promote->origin_id = $id;	
					$promote->compulsary_set = '';	  	
					$promote->elective_set = '';
					$promote->additional_set = '';  
					$promote->save(); 
					$count++;  	
				}
			}		
			
			if($count)		
			{ 	
				$message="Students promoted successfully";
				$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data"=>$count);	 
			}
			else
			{
				$message="could not promoted!!";     
				$response_arr=array("status"=>'failed',"success"=>false,"message"=>$message,"errors"=>[],"data"=>[]);	
			} 		
      		
		}			
		return response()->json($response_arr);								
	}	
	
   
}