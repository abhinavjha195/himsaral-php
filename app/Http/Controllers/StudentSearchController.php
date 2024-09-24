<?php
 
namespace App\Http\Controllers;
 
use Illuminate\Http\Request; 
use Illuminate\Support\Facades\Validator;  				
use Illuminate\Support\Facades\DB;     	

use App\Models\School;     	
use App\Models\StudentMaster;  
use App\Exports\StudentSearchExport;			
use Helper; 
use Excel;			
use Image;  
use PDF;  			       		  							 
 
class StudentSearchController extends Controller			
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
		
		$course_id = empty($request->course_id)?'':$request->course_id;	
		$class_id = empty($request->class_id)?'':$request->class_id;	
		$section_id = empty($request->section_id)?'':$request->section_id;	
		$station_id = empty($request->station_id)?'':$request->station_id;	     
		
		$student_name = empty($request->student_name)?'':$request->student_name;	
		$father_name = empty($request->father_name)?'':$request->father_name;	
		$mother_name = empty($request->mother_name)?'':$request->mother_name;
		$admission_no = empty($request->admission_no)?'':$request->admission_no;	 		
			   
		$roll_no = empty($request->roll_no)?'':$request->roll_no;	   
		$adhar_no = empty($request->adhar_no)?'':$request->adhar_no;	   		
		$gender = empty($request->gender)?'':$request->gender;	   
		$caste = empty($request->caste)?'':$request->caste;	   
		  
		$transport = empty($request->transport)?'':$request->transport;	   
		$sibling = empty($request->sibling)?'':$request->sibling;	   
		$start_date = empty($request->start_date)?'':$request->start_date;	 	  
		$end_date = empty($request->end_date)?'':$request->end_date;       
		
		$offset = ($page-1)*$limit;    		
		$sibling_arr =[];		
		
		if($sibling !='no')   
		{  			
			$first = DB::table('student_master as sm1')  
					->leftJoin('student_master as sm2','sm1.sibling_admission_no','=','sm2.admission_no')	
					->select('sm1.id as sibling_id')	
					->where('sm1.sibling_admission_no','!=','');   
 
			$siblings = DB::table('student_master as sm2')
						->leftJoin('student_master as sm1','sm2.admission_no','=','sm1.sibling_admission_no')	
						->select('sm2.id as sibling_id')	
						->where('sm1.sibling_admission_no','!=','')		   
						->union($first)
						->get();	

			foreach($siblings AS $sibling)			
			{
				array_push($sibling_arr,$sibling->sibling_id);  
			}
			 			
		}	 			
		
		$query = StudentMaster::leftJoin('class_master as cs','student_master.class_id','=','cs.classId')		
				->leftJoin('course_master as cm', 'student_master.course_id', '=', 'cm.courseId') 	
				->leftJoin('section_master as se','student_master.section_id','=','se.sectionId')  	
				->leftJoin('station_master as sm','student_master.station_id','=','sm.stationId')
				->select(DB::raw('count(*) as row_count'));	
				
		if($student_name !='')		
		{
			$query->where('student_master.student_name', 'like', '%'.$student_name.'%');   				
		}
		
		if($father_name !='')		
		{
			$query->where('student_master.father_name', 'like', '%'.$father_name.'%');   						
		}
		
		if($mother_name !='')		
		{
			$query->where('student_master.mother_name', 'like', '%'.$mother_name.'%');   						
		}
		
		if($roll_no !='')		
		{
			$query->where('student_master.roll_no', 'like', '%'.$roll_no.'%');   						
		}
		
		if($adhar_no !='')		
		{
			$query->where('student_master.aadhar_no', 'like', '%'.$adhar_no.'%');   						
		}
		
		if($admission_no !='')		
		{
			$query->where('student_master.admission_no', 'like', '%'.$admission_no.'%');   						
		}
		
		if($course_id !='')
		{
			$query->where('student_master.course_id',$course_id);	
		}
		
		if($class_id !='')
		{
			$query->where('student_master.class_id',$class_id);	
		}
		
		if($section_id !='')
		{
			$query->where('student_master.section_id',$section_id);	
		}
		
		if($station_id !='')
		{
			$query->where('student_master.station_id',$station_id);	
		}
		
		if($gender !='')
		{
			$query->where('student_master.gender',$gender);	
		}
		
		if($caste !='')
		{
			$query->where('student_master.caste',$caste);	
		}
		
		if($start_date !='' && $end_date !='')   
		{			
			$query->where('student_master.dob', '>=', $start_date);                                 
			$query->where('student_master.dob', '<=', $end_date);   			
		}
		
		if($transport !='no')   
		{
			$query->where('student_master.transportation',$transport);	
		}
		
		if($sibling !='no' && count($sibling_arr)>0)   
		{			
			$query->whereIn('student_master.id',$sibling_arr);		
		}
		
		if($search !='')	
		{  
			$query->where(function($q) use ($search) {
				 $q->where('student_master.student_name', 'like', '%'.$search.'%')
				   ->orWhere('cs.className', 'like', '%'.$search.'%')		   	
				   ->orWhere('cm.courseName', 'like', '%'.$search.'%')
				   ->orWhere('se.sectionName', 'like', '%'.$search.'%');		 
				   	
			 });   
		}
			 
		$records = $query->get();  
		
		$student_query = StudentMaster::leftJoin('class_master as cs','student_master.class_id','=','cs.classId')
						->leftJoin('course_master as cm', 'student_master.course_id', '=', 'cm.courseId') 
						->leftJoin('section_master as se','student_master.section_id','=','se.sectionId')  	  	
						->leftJoin('station_master as sm','student_master.station_id','=','sm.stationId')
						->selectRaw("student_master.*,cm.courseName,cs.className,ifnull(se.sectionName,'') as sectionName,ifnull(sm.stationName,'') as stationName")	
						->offset($offset)->limit($limit);  

		if($student_name !='')		
		{
			$student_query->where('student_master.student_name', 'like', '%'.$student_name.'%');   				
		}					
		
		if($father_name !='')		
		{
			$student_query->where('student_master.father_name', 'like', '%'.$father_name.'%');   				
		}

		if($mother_name !='')		
		{
			$student_query->where('student_master.mother_name', 'like', '%'.$mother_name.'%');   						
		}	
		
		if($roll_no !='')		
		{
			$student_query->where('student_master.roll_no', 'like', '%'.$roll_no.'%');   						
		}
		
		if($adhar_no !='')		
		{
			$student_query->where('student_master.aadhar_no', 'like', '%'.$adhar_no.'%');   						
		}
		
		if($admission_no !='')		
		{
			$student_query->where('student_master.admission_no', 'like', '%'.$admission_no.'%');   						
		}

		if($course_id !='')
		{
			$student_query->where('student_master.course_id',$course_id);	
		}
		
		if($class_id !='')
		{
			$student_query->where('student_master.class_id',$class_id);	
		}

		if($section_id !='')
		{
			$student_query->where('student_master.section_id',$section_id);	
		}
		
		if($station_id !='')
		{
			$student_query->where('student_master.station_id',$station_id);	
		}	
		
		if($gender !='')
		{
			$student_query->where('student_master.gender',$gender);			
		}
		
		if($caste !='')
		{
			$student_query->where('student_master.caste',$caste);	  
		}
		
		if($start_date !='' && $end_date !='')   
		{			
			$student_query->where('student_master.dob', '>=', $start_date);                                 
			$student_query->where('student_master.dob', '<=', $end_date);   			
		}
		
		if($transport !='no')   
		{
			$student_query->where('student_master.transportation',$transport);	
		}
		
		if($sibling !='no' && count($sibling_arr)>0)   
		{			
			$student_query->whereIn('student_master.id',$sibling_arr);		
		}
		
		if($search !='')	
		{  
			$student_query->where(function($q) use ($search) {
				 $q->where('student_master.student_name', 'like', '%'.$search.'%')
				   ->orWhere('cs.className', 'like', '%'.$search.'%')		   	
				   ->orWhere('cm.courseName', 'like', '%'.$search.'%')
				   ->orWhere('se.sectionName', 'like', '%'.$search.'%');   				   		
			 });   
		}
		
		if($order_by !='')	
		{
			$student_query->orderBy($order_by,$order); 				
		}	
		
		$search_result = $student_query->groupBy('student_master.id')->get();  	
 		
        if(count($search_result) > 0) 
		{
			$response_arr = array('data'=>$search_result,'total'=>$records[0]->row_count,'query'=>$request->all());			
            return response()->json(["status" => "successed", "success" => true,"data" => $response_arr]);	
        }
        else {
			$response_arr = array('data'=>[],'total'=>0,'query'=>$request->all());	
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found","data" => $response_arr]);	  	
        }	
		
    }  	 	

	public function printRec(Request $request) 
    {		 		
		$search = empty($request->search)?'':$request->search;					
		
		$course_id = empty($request->course_id)?'':$request->course_id;	
		$class_id = empty($request->class_id)?'':$request->class_id;	
		$section_id = empty($request->section_id)?'':$request->section_id;	
		$station_id = empty($request->station_id)?'':$request->station_id;	     
		
		$student_name = empty($request->student_name)?'':$request->student_name;	
		$father_name = empty($request->father_name)?'':$request->father_name;	
		$mother_name = empty($request->mother_name)?'':$request->mother_name;
		$admission_no = empty($request->admission_no)?'':$request->admission_no;	 		
			   
		$roll_no = empty($request->roll_no)?'':$request->roll_no;	   
		$adhar_no = empty($request->adhar_no)?'':$request->adhar_no;	   		
		$gender = empty($request->gender)?'':$request->gender;	   
		$caste = empty($request->caste)?'':$request->caste;	   
		  
		$transport = empty($request->transport)?'':$request->transport;	   
		$sibling = empty($request->sibling)?'':$request->sibling;	   
		$start_date = empty($request->start_date)?'':$request->start_date;	 	  
		$end_date = empty($request->end_date)?'':$request->end_date;  

		$sibling_arr =[];		
		
		if($sibling !='no')   
		{  			
			$first = DB::table('student_master as sm1')  
					->leftJoin('student_master as sm2','sm1.sibling_admission_no','=','sm2.admission_no')	
					->select('sm1.id as sibling_id')	
					->where('sm1.sibling_admission_no','!=','');   

			$siblings = DB::table('student_master as sm2')
						->leftJoin('student_master as sm1','sm2.admission_no','=','sm1.sibling_admission_no')	
						->select('sm2.id as sibling_id')	
						->where('sm1.sibling_admission_no','!=','')		   
						->union($first)
						->get();	

			foreach($siblings AS $sibling)			
			{
				array_push($sibling_arr,$sibling->sibling_id);  
			}
						
		}		
		
		$query = StudentMaster::leftJoin('class_master as cs','student_master.class_id','=','cs.classId')
						->leftJoin('course_master as cm', 'student_master.course_id', '=', 'cm.courseId') 
						->leftJoin('section_master as se','student_master.section_id','=','se.sectionId')  	  	
						->leftJoin('station_master as sm','student_master.station_id','=','sm.stationId')
						->selectRaw("student_master.*,cm.courseName,cs.className,ifnull(se.sectionName,'') as sectionName,ifnull(sm.stationName,'') as stationName");  						

		if($student_name !='')		
		{
			$query->where('student_master.student_name', 'like', '%'.$student_name.'%');   				
		}					
		
		if($father_name !='')		
		{
			$query->where('student_master.father_name', 'like', '%'.$father_name.'%');   				
		}

		if($mother_name !='')		
		{
			$query->where('student_master.mother_name', 'like', '%'.$mother_name.'%');   						
		}	
		
		if($roll_no !='')		
		{
			$query->where('student_master.roll_no', 'like', '%'.$roll_no.'%');   						
		}
		
		if($adhar_no !='')		
		{
			$query->where('student_master.aadhar_no', 'like', '%'.$adhar_no.'%');   						
		}
		
		if($admission_no !='')		
		{
			$query->where('student_master.admission_no', 'like', '%'.$admission_no.'%');   						
		}

		if($course_id !='')
		{
			$query->where('student_master.course_id',$course_id);	
		}
		
		if($class_id !='')
		{
			$query->where('student_master.class_id',$class_id);	
		}

		if($section_id !='')
		{
			$query->where('student_master.section_id',$section_id);	
		}
		
		if($station_id !='')
		{
			$query->where('student_master.station_id',$station_id);	
		}	
		
		if($gender !='')
		{
			$query->where('student_master.gender',$gender);			
		}
		
		if($caste !='')
		{
			$query->where('student_master.caste',$caste);	  
		}
		
		if($start_date !='' && $end_date !='')   
		{			
			$query->where('student_master.dob', '>=', $start_date);                                 
			$query->where('student_master.dob', '<=', $end_date);   			
		}
		
		if($transport !='no')   
		{
			$query->where('student_master.transportation',$transport);	
		}
		
		if($sibling !='no' && count($sibling_arr)>0)   
		{			
			$query->whereIn('student_master.id',$sibling_arr);		
		}
		
		if($search !='')	
		{  
			$query->where(function($q) use ($search) {
				 $q->where('student_master.student_name', 'like', '%'.$search.'%')
				   ->orWhere('cs.className', 'like', '%'.$search.'%')		   	
				   ->orWhere('cm.courseName', 'like', '%'.$search.'%')
				   ->orWhere('se.sectionName', 'like', '%'.$search.'%');   
				   		
			 });   
		}
		
		$result = $query->groupBy('student_master.id')->get();          
		
		$school=School::where('school_code','S110')->get();   								
		$page_data = array('school'=>$school,'search_result'=>$result,'columns'=>''); 						
		$slip_name=time().rand(1,99).'.'.'pdf';   			
		
		$pdf = PDF::loadView("student_print",$page_data)->save(public_path("studentsearch/$slip_name"));		

		$message="Student list printed successfully.";    
		$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data" =>$slip_name);	 			
		return response()->json($response_arr);	   
	}

	public function exportRec(Request $request) 
	{
		$search = empty($request->search)?'':$request->search;  
		$columns = $request->fields;    	
		
		$course_id = empty($request->course_id)?'':$request->course_id;	
		$class_id = empty($request->class_id)?'':$request->class_id;	
		$section_id = empty($request->section_id)?'':$request->section_id;	
		$station_id = empty($request->station_id)?'':$request->station_id;	     
		
		$student_name = empty($request->student_name)?'':$request->student_name;	
		$father_name = empty($request->father_name)?'':$request->father_name;	
		$mother_name = empty($request->mother_name)?'':$request->mother_name;
		$admission_no = empty($request->admission_no)?'':$request->admission_no;	 		
			   
		$roll_no = empty($request->roll_no)?'':$request->roll_no;	   
		$adhar_no = empty($request->adhar_no)?'':$request->adhar_no;	   		
		$gender = empty($request->gender)?'':$request->gender;	   
		$caste = empty($request->caste)?'':$request->caste;	   
		  
		$transport = empty($request->transport)?'':$request->transport;	   
		$sibling = empty($request->sibling)?'':$request->sibling;	   
		$start_date = empty($request->start_date)?'':$request->start_date;	 	  
		$end_date = empty($request->end_date)?'':$request->end_date;  

		$sibling_arr =[];		
		
		if($sibling !='no')   
		{  			
			$first = DB::table('student_master as sm1')  
					->leftJoin('student_master as sm2','sm1.sibling_admission_no','=','sm2.admission_no')	
					->select('sm1.id as sibling_id')	
					->where('sm1.sibling_admission_no','!=','');   

			$siblings = DB::table('student_master as sm2')
						->leftJoin('student_master as sm1','sm2.admission_no','=','sm1.sibling_admission_no')	
						->select('sm2.id as sibling_id')	
						->where('sm1.sibling_admission_no','!=','')		   
						->union($first)
						->get();	

			foreach($siblings AS $sibling)			
			{
				array_push($sibling_arr,$sibling->sibling_id);  
			}
						
		}	   
		
		$file_name = 'Student List_'.date('Y_m_d_H_i_s').'.xlsx';     		     
		$export=Excel::store(new StudentSearchExport($course_id,$class_id,$section_id,$station_id,$student_name,$father_name,$mother_name,$admission_no,$roll_no,$adhar_no,$gender,$caste,$transport,$sibling,$start_date,$end_date,$search,
		$columns),$file_name,'custom_upload');  			 			
		if($export)	
		{
			$response_arr=array("status"=>'successed',"success"=>true,"message"=>"","errors"=>[],"data" =>$file_name);  
		}	
		else
		{
			$response_arr = array("status" => "failed", "success" => false, "message" => "Whoops! could not export excelsheet","data" =>[]);	
		}
		
		return response()->json($response_arr);	   				
	}	
	
	public function downloadExcel($file_name)		
    {				
		$path=public_path().'/uploads/'.$file_name;		 		
		return response()->download($path)->deleteFileAfterSend(); 		 		
    }	
    
}