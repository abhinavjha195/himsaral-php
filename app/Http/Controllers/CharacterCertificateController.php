<?php
 
namespace App\Http\Controllers;
 
use Illuminate\Http\Request; 
use Illuminate\Support\Facades\Validator;  								
use Illuminate\Support\Facades\DB; 
use Illuminate\Support\Facades\Hash;      

use App\Models\CharacterCertificate;       
use App\Models\StudentMaster;      
use App\Models\SessionMaster;   
use App\Models\School;   
use Helper; 
use PDF;  	
		       		  							 
 
class CharacterCertificateController extends Controller						
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

		$query=CharacterCertificate::leftJoin('student_master as sm','cc_master.student_id','=','sm.id')
				->leftJoin('class_master as cm','sm.class_id','=','cm.classId')	   							
				->leftJoin('tbl_school as ts','cc_master.school_code','=','ts.id')   
				->select(DB::raw('count(*) as row_count'));		  				
		
		if($search !='')	
		{  
			$query->where(function($q) use ($search) {
				 $q->where('cc_master.cc_no', 'like', '%'.$search.'%') 	
				   ->orWhere('sm.admission_no', 'like', '%'.$search.'%')   	
				   ->orWhere('sm.student_name', 'like', '%'.$search.'%')
				   ->orWhere('cm.className', 'like', '%'.$search.'%');		
			 });   
		}
			 
		$records = $query->get();  		 		
		
		$student_query = CharacterCertificate::leftJoin('student_master as sm','cc_master.student_id','=','sm.id')
						->leftJoin('class_master as cm','sm.class_id','=','cm.classId')	   							
						->leftJoin('tbl_school as ts','cc_master.school_code','=','ts.id')   
						->selectRaw("cc_master.id,cc_master.cc_no,sm.student_name,sm.admission_no,ts.school_name,ts.about,cm.className")
						->offset($offset)->limit($limit);  	
		
		if($search !='')	
		{  
			$student_query->where(function($q) use ($search) {
				 $q->where('cc_master.cc_no', 'like', '%'.$search.'%') 
				   ->orWhere('sm.admission_no', 'like', '%'.$search.'%')   	   	
				   ->orWhere('sm.student_name', 'like', '%'.$search.'%')
				   ->orWhere('cm.className', 'like', '%'.$search.'%');		   	
			 });   
		}
		
		if($order_by !='')	
		{
			$student_query->orderBy($order_by,$order); 				
		}	
		
		$certificates = $student_query->groupBy('cc_master.id')->get();  		
 		
        if(count($certificates) > 0) 		
		{
			$response_arr = array('data'=>$certificates,'total'=>$records[0]->row_count);			
            return response()->json(["status" => "successed", "success" => true,"data" => $response_arr]);			
        }
        else {
			$response_arr = array('data'=>[],'total'=>0);	
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found","data" => $response_arr]);		
        }	
		
    } 
	
	public function add(Request $request)	
	{
		$inputs=$request->all();  	
		$action=$request->button;     
		
		$rules=[            	 			 				
				'id' => 'required|unique:cc_master,student_id',	
				'name' => 'required',  		  	
				'f_name' => 'required',
				'm_name' => 'required',
				'dob' => 'required|date',
				'admission_date' => 'required|date',   				
				'issue_date' => 'required|date',  
				'last_date' => 'required|date',     	  	
				'present_class' => 'required',
				'exam_month' => 'required',
				'exam_year' => 'required',		
				'address' => 'required',  						  	
				'secured_marks' => 'required',
				'total_marks' => 'required',   	 
				'general_conduct' => 'required',   
				'curricular_activity' => 'required',     
				'last_exam' => 'required',  
				'serial_no' => 'required|unique:cc_master',	  
				'remark' => 'required',  				
				'exam_board' => 'required',    
			];   
			
			$fields = [  									  	
				'id' => 'Student Id',       
				'name' => 'Student Name',	      	
				'f_name' => 'Father Name',		
				'm_name' => 'Mother Name',  
				'dob' => 'Date Of Birth',	      	
				'admission_date' => 'Admission Date',		
				'last_date' => 'Last Date',  
				'issue_date' => 'Certificate Issued On',  
				'address' => 'Address',	      	
				'present_class' => 'Class Name(Present)',		
				'exam_month' => 'Exam Month',  
				'exam_year' => 'Exam Year',	 				      	
				'secured_marks' => 'Secured Marks',	
				'total_marks' => 'Total Marks',						    	
				'last_exam' => 'Last Exam',	
				'general_conduct' => 'General Conduct',	   				
				'curricular_activity' => 'Curricular Activity',	 
				'serial_no' => 'Serial No.',	      	
				'exam_board' => 'Exam Board',			
				'remark' => 'Remarks',	  
			]; 

			$messages = [
				'required' => 'The :attribute field is required.',    
			];  	
		
		$validator = Validator::make($inputs, $rules, $messages, $fields);   	    		
 
        if ($validator->fails()) {  	
			$errors=$validator->errors();      			  
			$response_arr=array("status"=>"failed","message"=>"Please fill required fields!!","errors"=>$errors);     
        }
		else
		{
			$school=School::where('school_code','S110')->get();   
			$fiscal_yr=Helper::getFiscalYear(date('m'));  
			$fiscal_arr=explode(':',$fiscal_yr);	
			$fiscalYear=SessionMaster::where('session_start',$fiscal_arr[0])->where('session_end',$fiscal_arr[1])->get();
			$fiscal_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0; 		
			$tc=CharacterCertificate::selectRaw("ifnull(max(id),0)+1 as next_id")->get();			

			$x=strlen($tc[0]->next_id);		
			$y=$x+3; 
			$cc=sprintf("%0{$y}d",$tc[0]->next_id);       
			
			$insert_arr = array(            
				'student_id' => $request->id, 		
				'session_id' => $fiscal_id,		
				'school_code'=> $school[0]->id,  
				'last_exam' => empty($request->last_exam)?0:$request->last_exam,    
				'exam_month' => empty($request->exam_month)?0:$request->exam_month,    
				'cc_no' => $cc,		 
				'exam_year' => empty($request->exam_year)?'':$request->exam_year,  
				'exam_board' => empty($request->exam_board)?'':$request->exam_board,  
				'serial_no' => empty($request->serial_no)?'':$request->serial_no,  
				'game' => empty($request->game)?'':$request->game, 
				'general_conduct' => empty($request->general_conduct)?'':$request->general_conduct,  
				'curricular_activity' => empty($request->curricular_activity)?'':$request->curricular_activity,    	
				'remark' => empty($request->remark)?'':$request->remark,  
				'secured_marks' => empty($request->secured_marks)?0:$request->secured_marks,   	
				'total_marks' => empty($request->total_marks)?'':$request->total_marks,  
				'last_date' => $request->last_date,  
				'issue_date' => $request->issue_date,   	
			);
			
			$cc = CharacterCertificate::create($insert_arr);				
			
			if($cc->id)		
			{ 			
				$certificate=CharacterCertificate::leftJoin('student_master as sm', 'cc_master.student_id', '=', 'sm.id')
							->leftJoin('class_master as cm','sm.class_id','=','cm.classId')	   			
							->leftJoin('class_master as cs','cc_master.last_exam','=','cs.classId')	    				
							->leftJoin('tbl_school as ts', 'cc_master.school_code', '=', 'ts.id')   
							->selectRaw("sm.student_name,sm.father_name,sm.admission_date,sm.admission_no,sm.dob,sm.roll_no,cc_master.last_date,cc_master.cc_no,MONTHNAME(STR_TO_DATE(cc_master.exam_month,'%m')) as em_month,cc_master.exam_year,cc_master.secured_marks,cc_master.total_marks,cc_master.curricular_activity,cc_master.general_conduct,cc_master.game,cc_master.exam_board,ts.school_logo,ts.school_name,ts.about,ts.school_address,ts.school_contact,ts.school_email,cm.className,cs.className as classLast")
							->where('cc_master.id',$cc->id)
							->get();	  
				
				if($action=='saveprint')		  
				{ 					
					$page_data = array('cc'=>$certificate); 			  						
					$slip_name=time().rand(1,99).'.'.'pdf';  			
					$data_arr['print_id']=$slip_name;	
					$pdf = PDF::loadView("character_certificate",$page_data)->save(public_path("certificates/cc/$slip_name"));	
					
					$message="New character certificate created successfully, character certificate generated.";    
					
				}
				else
				{
					$message="New character certificate created successfully"; 			
					$data_arr['print_id']="";									
				}  
				
				$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data"=>$data_arr);	
				
			}
			else
			{
				$message="could not created!!";  
				$response_arr=array("status"=>'failed',"success"=>false,"message"=>$message,"errors"=>[],"data"=>[]);	
			} 		
      		
		}			
		return response()->json($response_arr);								
	}		
	
	public function edit($id)		
	{ 		
		$info = CharacterCertificate::leftJoin('student_master as sm', 'cc_master.student_id', '=', 'sm.id')
				->leftJoin('class_master as cm','sm.class_id','=','cm.classId')	   					      
				->select(DB::raw('count(*) as row_count'))
				->where('cc_master.id',$id)
				->get();			

		if($info[0]->row_count > 0)  	
		{ 
			$record = CharacterCertificate::leftJoin('student_master as sm', 'cc_master.student_id', '=', 'sm.id')
						->leftJoin('class_master as cm','sm.class_id','=','cm.classId')	   			 	
						->selectRaw("sm.student_name,sm.father_name,sm.mother_name,sm.admission_date,sm.dob,sm.permanent_address,cc_master.*,cm.className")
						->where('cc_master.id',$id)
						->get();	  			

			$response_arr = array("status" => "successed", "success" => true, "message" => "Character certificate record found","data" =>$record);  					
        }
        else {
			$response_arr = array("status" => "failed", "success" => false, "message" => "Whoops! no record found","data" =>[]);	         		
        }			

		return response()->json($response_arr);							
	}
	
	public function update(Request $request,$id)	
	{ 
		$info = CharacterCertificate::leftJoin('student_master as sm', 'cc_master.student_id', '=', 'sm.id')
				->leftJoin('class_master as cm','sm.class_id','=','cm.classId')	   					      
				->select(DB::raw('count(*) as row_count'))
				->where('cc_master.id',$id)
				->get();		  

		if($info[0]->row_count > 0)  	
		{ 	 		 	
			$inputs=$request->all();  	

			$record = CharacterCertificate::leftJoin('student_master as sm', 'cc_master.student_id', '=', 'sm.id')
						->leftJoin('class_master as cm','sm.class_id','=','cm.classId')	   			 	
						->select("cc_master.serial_no")
						->where('cc_master.id',$id)
						->get();	  	

			$srlno_rule=($request->serial_no==$record[0]->serial_no)?'required':'required|unique:cc_master';  	
			
			$rules=[            	 			 				 				
				'name' => 'required',  		  	
				'f_name' => 'required',
				'm_name' => 'required',
				'dob' => 'required|date',
				'admission_date' => 'required|date',   				
				'issue_date' => 'required|date',  
				'last_date' => 'required|date',     	  	
				'present_class' => 'required',
				'exam_month' => 'required|not_in:0',	
				'exam_year' => 'required|not_in:0',					
				'address' => 'required',  						  	
				'secured_marks' => 'required',
				'total_marks' => 'required',   	 
				'general_conduct' => 'required|not_in:0',   
				'curricular_activity' => 'required|not_in:0',     
				'last_exam' => 'required|not_in:0',  
				'serial_no' => $srlno_rule,	  		
				'remark' => 'required',  				
				'exam_board' => 'required',    
			];   
			
			$fields = [  									  	 				  
				'name' => 'Student Name',	      	
				'f_name' => 'Father Name',		
				'm_name' => 'Mother Name',  
				'dob' => 'Date Of Birth',	      	
				'admission_date' => 'Admission Date',		
				'last_date' => 'Last Date',  
				'issue_date' => 'Certificate Issued On',  
				'address' => 'Address',	      	
				'present_class' => 'Class Name(Present)',		
				'exam_month' => 'Exam Month',  
				'exam_year' => 'Exam Year',	 				      	
				'secured_marks' => 'Secured Marks',	
				'total_marks' => 'Total Marks',						    	
				'last_exam' => 'Last Exam',	
				'general_conduct' => 'General Conduct',	   				
				'curricular_activity' => 'Curricular Activity',	 
				'serial_no' => 'Serial No.',	      	
				'exam_board' => 'Exam Board',			
				'remark' => 'Remarks',	  
			]; 

			$messages = [
				'required' => 'The :attribute field is required.',    
			];  	
			
			$validator = Validator::make($inputs, $rules, $messages, $fields);   	    		
	 
			if ($validator->fails()) {  	
				$errors=$validator->errors();      			  
				$response_arr=array("status"=>"failed","message"=>"Please fill required fields!!","errors"=>$errors);     
			}
			else
			{	
				$updt_arr = array(            				 
					'last_exam' => empty($request->last_exam)?0:$request->last_exam,    
					'exam_month' => empty($request->exam_month)?0:$request->exam_month,    					
					'exam_year' => empty($request->exam_year)?'':$request->exam_year,  
					'exam_board' => empty($request->exam_board)?'':$request->exam_board,  
					'serial_no' => empty($request->serial_no)?'':$request->serial_no,  
					'game' => empty($request->game)?'':$request->game, 
					'general_conduct' => empty($request->general_conduct)?'':$request->general_conduct,  
					'curricular_activity' => empty($request->curricular_activity)?'':$request->curricular_activity,    	
					'remark' => empty($request->remark)?'':$request->remark,  
					'secured_marks' => empty($request->secured_marks)?0:$request->secured_marks,   	
					'total_marks' => empty($request->total_marks)?'':$request->total_marks,  
					'last_date' => $request->last_date,  
					'issue_date' => $request->issue_date,   	
				);  

				$update=CharacterCertificate::where('id',$id)->update($updt_arr); 				
			
				if($update)		
				{ 
					$message="Character certificate updated successfully.";  		
					$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data"=>$update);		
				}
				else
				{
					$message="could not updated!!";  		
					$response_arr=array("status"=>'failed',"success"=>false,"message"=>$message,"errors"=>[],"data"=>[]);	 
				}			 
				
			}	
			
        }
        else {
			$response_arr = array("status" => "failed", "success" => false, "message" => "Whoops! no record found","data" =>[]);	         		
        }	
		
		return response()->json($response_arr);		   				
			
	}
   
	public function printFormat($id,$format)		  
	{
		$info = CharacterCertificate::leftJoin('student_master as sm', 'cc_master.student_id', '=', 'sm.id')
				->leftJoin('class_master as cm','sm.class_id','=','cm.classId')	   			
				->leftJoin('class_master as cs','cc_master.last_exam','=','cs.classId')	    				
				->leftJoin('course_master as co','sm.course_id','=','co.courseId')	
				->leftJoin('session_master as sn','sm.session_id','=','sn.id')	      	
				->leftJoin('tbl_school as ts', 'cc_master.school_code', '=', 'ts.id')     			      
				->select(DB::raw('count(*) as row_count'))
				->where('cc_master.id',$id)
				->get();				

		if($info[0]->row_count > 0) 		
		{
			$certificate=CharacterCertificate::leftJoin('student_master as sm', 'cc_master.student_id', '=', 'sm.id')
						->leftJoin('class_master as cm','sm.class_id','=','cm.classId')	   			
						->leftJoin('class_master as cs','cc_master.last_exam','=','cs.classId')	    				
						->leftJoin('course_master as co','sm.course_id','=','co.courseId')	    
						->leftJoin('session_master as sn','sm.session_id','=','sn.id')	  
						->leftJoin('tbl_school as ts', 'cc_master.school_code', '=', 'ts.id')   		
						->selectRaw("sm.student_name,sm.father_name,sm.mother_name,sm.admission_date,sm.admission_no,sm.dob,sm.roll_no,cc_master.last_date,cc_master.cc_no,MONTHNAME(STR_TO_DATE(cc_master.exam_month,'%m')) as em_month,cc_master.exam_year,cc_master.secured_marks,cc_master.total_marks,cc_master.curricular_activity,cc_master.general_conduct,cc_master.game,cc_master.exam_board,cc_master.serial_no,ts.school_logo,ts.school_name,ts.about,ts.school_address,ts.school_contact,ts.school_email,cm.className,cs.className as classLast,co.courseName,YEAR(sn.session_start) AS session_st,YEAR(sn.session_end) AS session_ed")
						->where('cc_master.id',$id)		 
						->get();	  
			
			$page_data = array('cc'=>$certificate); 			  						
			$slip_name=time().rand(1,99).'.'.'pdf';  									
			$pdf = PDF::loadView("cc_$format",$page_data)->save(public_path("certificates/cc/$slip_name"));	

			$message="Character certificate generated.";    
			$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data" =>$slip_name);	 			
        }
        else {
			$response_arr = array("status" => "failed", "success" => false, "message" => "Whoops! no record found","data" =>[]);	         		
        }			

		return response()->json($response_arr);					
	}
    
   public function getSuggest($search)    
   { 		
        $query=StudentMaster::leftJoin('class_master as cs','student_master.class_id','=','cs.classId') 
				->leftJoin('cc_master as ch','student_master.id','=','ch.student_id')		  
				->select('student_master.*','cs.className');			

		$query->where(function($q) use ($search) {
			 $q->where('cs.className', 'like', '%'.$search.'%')
			   ->orWhere('student_master.student_name','like','%'.$search.'%')    
			   ->orWhere('student_master.father_name','like','%'.$search.'%')    
			   ->orWhere('student_master.admission_no','like','%'.$search.'%');        		
		});  		
				    
		$result=$query->whereNull('ch.student_id')->get(); 	   								
			
        if(count($result)>0) {  
            return response()->json(["status" => "successed", "success" => true, "data" => $result]);  	  
        }
        else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no result found"]);
        }    
   }
   
   public function getDetail($key)       
   { 		
        $result=StudentMaster::leftJoin('class_master as cs','student_master.class_id','=','cs.classId')   			  
			->leftJoin('class_master as cm','student_master.class_first','=','cm.classId')
			->leftJoin('cc_master as ch','student_master.id','=','ch.student_id')		  	
			->selectRaw("student_master.*,cs.className as present_class,cm.className as admission_class")	  
			->where("student_master.admission_no",$key)
			->whereNull('ch.student_id')	    
			->get(); 						 														
		 
        if(count($result)>0) {  
            return response()->json(["status" => "successed", "success" => true, "data" => $result]);	  
        }
        else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found"]);
        }    
   }  		

   public function delete($id)
    {
		$info = CharacterCertificate::leftJoin('student_master as sm', 'cc_master.student_id', '=', 'sm.id')
				->leftJoin('class_master as cm','sm.class_id','=','cm.classId')	   					      
				->select(DB::raw('count(*) as row_count'))
				->where('cc_master.id',$id)
				->get();		  

		if($info[0]->row_count > 0)  	
		{ 	 			
			$del=CharacterCertificate::where('id',$id)->delete();
			if($del)
			{
				return response()->json(["status" =>'successed',"success"=>true,"message"=>"Character certificate deleted successfully","data" =>'']);   
			}
			else
			{
				return response()->json(["status" =>'failed', "success" => false, "message" => "could not deleted !!","data" => []]);	
			}
		}
		else
		{
			return response()->json(["status" => "failed","success" => false,"message" => "Whoops! failed to delete,!!","errors" =>'']);		
		}

    }
   
}