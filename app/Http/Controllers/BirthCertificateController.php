<?php
 
namespace App\Http\Controllers;
 
use Illuminate\Http\Request; 
use Illuminate\Support\Facades\Validator;  						
use Illuminate\Support\Facades\DB; 
use Illuminate\Support\Facades\Hash;      

use App\Models\BirthCertificate;       
use App\Models\StudentMaster;      
use App\Models\SessionMaster;   
use App\Models\School;   
use Helper; 
use PDF;  	
		       		  							 
 
class BirthCertificateController extends Controller						
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

		$query=BirthCertificate::leftJoin('student_master as sm','birth_certificates.student_id','=','sm.id')
				->leftJoin('class_master as cm','sm.class_id','=','cm.classId')	   											
				->select(DB::raw('count(*) as row_count'));		  				
		
		if($search !='')	
		{  
			$query->where(function($q) use ($search) {
				 $q->where('birth_certificates.bc_no', 'like', '%'.$search.'%') 	
				   ->orWhere('sm.admission_no', 'like', '%'.$search.'%')   	
				   ->orWhere('sm.student_name', 'like', '%'.$search.'%')
				   ->orWhere('cm.className', 'like', '%'.$search.'%');		
			 });   
		}
			 
		$records = $query->get();  		 		
		
		$student_query = BirthCertificate::leftJoin('student_master as sm','birth_certificates.student_id','=','sm.id')
						->leftJoin('class_master as cm','sm.class_id','=','cm.classId')	   							
						->selectRaw("birth_certificates.id,birth_certificates.bc_no,sm.student_name,sm.admission_no,sm.dob,cm.className")  
						->offset($offset)->limit($limit);  	
		
		if($search !='')	
		{  
			$student_query->where(function($q) use ($search) {  
				 $q->where('birth_certificates.bc_no', 'like', '%'.$search.'%') 
				   ->orWhere('sm.admission_no', 'like', '%'.$search.'%')   	   	
				   ->orWhere('sm.student_name', 'like', '%'.$search.'%')
				   ->orWhere('cm.className', 'like', '%'.$search.'%');		   	
			 });   
		}
		
		if($order_by !='')	
		{
			$student_query->orderBy($order_by,$order); 				
		}	
		
		$certificates = $student_query->groupBy('birth_certificates.id')->get();  		
 		
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
		$id=$request->id; 
		$no=$request->issue_no;	
		
		$rules=[            	 			 				
				'id' => 'required',			
				'name' => 'required',  		  	
				'f_name' => 'required',
				'm_name' => 'required',
				'dob' => 'required|date',  							
				'issue_date' => 'required|date',  				  	  	
				'present_class' => 'required',
				'address' => 'required',  		  								
				'issue_no' => 'required',    
				'remark' => 'required',        
			];   
			
			$fields = [  									  	
				'id' => 'Student Id',       
				'name' => 'Student Name',	      	
				'f_name' => 'Father Name',		
				'm_name' => 'Mother Name',  
				'dob' => 'Date Of Birth',	      	 					
				'issue_date' => 'Last Issued Date',  				      	
				'present_class' => 'Class Name',	
				'address' => 'Address',	  
				'issue_no' => 'No. of Certificate Issued',	  			
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
			$info=BirthCertificate::where('student_id',$id)->get();	
			if(count($info)>0)	
			{
				$update_arr = array(            					
					'issue_count' => ($no==$info[0]->issue_count)?++$no:$no, 		  	   							
					'remark' => empty($request->remark)?'':$request->remark,  
					'issue_date' => $request->issue_date,     	
				);
				
				$update = BirthCertificate::where('id',$info[0]->id)->update($update_arr);		
				if($update)
				{
					$certificate=BirthCertificate::leftJoin('tbl_school as ts','birth_certificates.school_code','=','ts.id') 
								->leftJoin('student_master as sm', 'birth_certificates.student_id', '=', 'sm.id')	
								->leftJoin('class_master as cs','sm.class_id','=','cs.classId')	   	  
								->selectRaw("sm.student_name,sm.father_name,sm.mother_name,sm.admission_no,sm.permanent_address,sm.dob,birth_certificates.bc_no,birth_certificates.remark,birth_certificates.issue_date,ts.school_logo,ts.school_name,ts.about,ts.school_address,ts.school_contact,ts.school_email,ts.server_address,cs.className")
								->where('birth_certificates.id',$info[0]->id)
								->get();	 			
					
					$page_data = array('cc'=>$certificate); 			  						
					$slip_name=time().rand(1,99).'.'.'pdf';  					
					$data_arr['print_id']=$slip_name;	
					$pdf = PDF::loadView("birth_certificate",$page_data)->save(public_path("certificates/bc/$slip_name"));	
					
					$message="Birth certificate updated successfully, birth certificate generated.";    
					$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data"=>$data_arr);	  	
					//
				}
				else
				{
					$message="could not updated!!";  
					$response_arr=array("status"=>'failed',"success"=>false,"message"=>$message,"errors"=>[],"data"=>"");	
				}
			}
			else
			{
				$school=School::where('school_code','S110')->get();   
				$fiscal_yr=Helper::getFiscalYear(date('m'));  
				$fiscal_arr=explode(':',$fiscal_yr);	
				$fiscalYear=SessionMaster::where('session_start',$fiscal_arr[0])->where('session_end',$fiscal_arr[1])->get();
				$fiscal_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0; 		
				$serial=BirthCertificate::selectRaw("ifnull(max(id),0)+1 as next_id")->get();							
				$serial_no='BC'.$serial[0]->next_id.$school[0]->school_code;		
				
				$insert_arr = array(            
					'student_id' => $request->id, 		
					'session_id' => $fiscal_id,		
					'school_code'=> $school[0]->id,    
					'bc_no' => $serial_no,	
					'issue_count' => (empty($no) || $no==0)?1:$no,   	   							
					'remark' => empty($request->remark)?'':$request->remark,  			
					'issue_date' => $request->issue_date,     	
				);					
				
				$bc = BirthCertificate::create($insert_arr);						
				
				if($bc->id)		
				{ 			
					$certificate=BirthCertificate::leftJoin('tbl_school as ts','birth_certificates.school_code','=','ts.id') 
								->leftJoin('student_master as sm', 'birth_certificates.student_id', '=', 'sm.id')	
								->leftJoin('class_master as cs','sm.class_id','=','cs.classId')	   	  
								->selectRaw("sm.student_name,sm.father_name,sm.mother_name,sm.admission_no,sm.permanent_address,sm.dob,birth_certificates.bc_no,birth_certificates.remark,birth_certificates.issue_date,ts.school_logo,ts.school_name,ts.about,ts.school_address,ts.school_contact,ts.school_email,ts.server_address,cs.className")
								->where('birth_certificates.id',$bc->id)
								->get();	 			
					
					$page_data = array('cc'=>$certificate); 			  						
					$slip_name=time().rand(1,99).'.'.'pdf';  					
					$data_arr['print_id']=$slip_name;	
					$pdf = PDF::loadView("birth_certificate",$page_data)->save(public_path("certificates/bc/$slip_name"));	
					
					$message="Birth certificate created successfully, birth certificate generated.";    
					$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data"=>$data_arr);	  	
					
				}
				else
				{
					$message="could not created!!";  		
					$response_arr=array("status"=>'failed',"success"=>false,"message"=>$message,"errors"=>[],"data"=>[]);	
				} 
				
			}		
      		
		}			
		return response()->json($response_arr);								
	}			
	
   public function getSuggest($search)    
   { 		
        $query=StudentMaster::leftJoin('class_master as cs','student_master.class_id','=','cs.classId')  					  
				->select('student_master.id','student_master.admission_no','student_master.student_name','student_master.father_name','student_master.mother_name','student_master.permanent_address','student_master.dob','cs.className');			

		$query->where(function($q) use ($search) {
			 $q->where('cs.className', 'like', '%'.$search.'%')
			   ->orWhere('student_master.student_name','like','%'.$search.'%')    
			   ->orWhere('student_master.father_name','like','%'.$search.'%')    
			   ->orWhere('student_master.admission_no','like','%'.$search.'%');        		
		});  		
				    
		$result=$query->get(); 	   								
			
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
			->leftJoin('birth_certificates as bc','student_master.id','=','bc.student_id')		  	
			->selectRaw("student_master.id,student_master.admission_no,student_master.student_name,student_master.father_name,student_master.mother_name,student_master.permanent_address,student_master.dob,ifnull(bc.issue_count,0) as no_bc,ifnull(bc.remark,'') as bc_remark,ifnull(bc.issue_date,'') as last_date,cs.className")  	  
			->where("student_master.admission_no",$key) 						    
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
		$info = BirthCertificate::where('id',$id)->get();				  

		if(count($info) > 0)  	
		{ 	 			
			$del=BirthCertificate::where('id',$id)->delete();
			if($del)
			{
				return response()->json(["status" =>'successed',"success"=>true,"message"=>"Birth certificate deleted successfully","data" =>'']);   
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