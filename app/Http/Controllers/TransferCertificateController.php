<?php
 
namespace App\Http\Controllers;
 
use Illuminate\Http\Request; 
use Illuminate\Support\Facades\Validator;  						
use Illuminate\Support\Facades\DB; 
use Illuminate\Support\Facades\Hash;      

use App\Models\TransferCertificate;       
use App\Models\StudentMaster;      
use App\Models\SessionMaster;   
use App\Models\School;  

use App\Exports\SlcExport;			
use Helper; 
use Excel;			
use PDF;  	
		       		  							 
 
class TransferCertificateController extends Controller			
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
		
		$query = TransferCertificate::leftJoin('student_master as sm','slc_certificates.student_id','=','sm.id')  
				->leftJoin('class_master as cm','sm.class_id','=','cm.classId')		 				
				->select(DB::raw('count(*) as row_count'));		
		
		if($search !='')	
		{  
			$query->where(function($q) use ($search) {
				 $q->where('slc_certificates.tc_no', 'like', '%'.$search.'%') 	
				   ->orWhere('sm.admission_no', 'like', '%'.$search.'%')   	
				   ->orWhere('sm.student_name', 'like', '%'.$search.'%')
				   ->orWhere('cm.className', 'like', '%'.$search.'%');		
			 });   
		}
			 
		$records = $query->get();  	
		
		$student_query = TransferCertificate::leftJoin('student_master as sm','slc_certificates.student_id','=','sm.id')
						->leftJoin('tbl_school as ts', 'sm.school_id', '=', 'ts.id') 	 
						->leftJoin('class_master as cm','sm.class_id','=','cm.classId')	  	
						->selectRaw("slc_certificates.id,slc_certificates.tc_no,sm.student_name,sm.admission_no,sm.father_name,sm.f_mobile,cm.className")	
						->offset($offset)->limit($limit);  	 		  		
			
		
		if($search !='')	
		{  
			$student_query->where(function($q) use ($search) {
				 $q->where('slc_certificates.tc_no', 'like', '%'.$search.'%') 
				   ->orWhere('sm.admission_no', 'like', '%'.$search.'%')   	   	
				   ->orWhere('sm.student_name', 'like', '%'.$search.'%')
				   ->orWhere('cm.className', 'like', '%'.$search.'%');		   	
			 });   
		}
		
		if($order_by !='')	
		{
			$student_query->orderBy($order_by,$order); 				
		}	
		
		$certificates = $student_query->groupBy('slc_certificates.id')->get();  
 		
        if(count($certificates) > 0) 		
		{
			$response_arr = array('data'=>$certificates,'total'=>$records[0]->row_count,'query'=>$request->all());			
            return response()->json(["status" => "successed", "success" => true,"data" => $response_arr]);			
        }
        else {
			$response_arr = array('data'=>[],'total'=>0,'query'=>$request->all());	
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found","data" => $response_arr]);		
        }	
		
    } 
	
	public function add(Request $request)	
	{
		$inputs=$request->all();  	
		$action=$request->button;  
		
		$rules=[            	 			 				
				'id' => 'required|unique:slc_certificates,student_id',	
				'name' => 'required',  		  	
				'f_name' => 'required',
				'm_name' => 'required',
				'dob' => 'required|date',
				'admission_date' => 'required|date',  
				'application_date' => 'required|date', 
				'issue_date' => 'required|date',  
				'admission_class' => 'required',  		  	
				'present_class' => 'required',
				'fee_month' => 'required',
				'fee_year' => 'required',
				'nationality' => 'required',  						  	
				'ncc_cadet' => 'required',
				'general_conduct' => 'required',   
				'last_exam' => 'required',  		  					
				'working_days' => 'required',   	
				'reason' => 'required',    
				'days_present' => 'required',   	
				'remark' => 'required',  				
			];   
			
			$fields = [  									  	
				'id' => 'Student Id',       
				'name' => 'Student Name',	      	
				'f_name' => 'Father Name',		
				'm_name' => 'Mother Name',  
				'dob' => 'Date Of Birth',	      	
				'admission_date' => 'Admission Date',		
				'application_date' => 'Application Date',  
				'issue_date' => 'Certificate Issued On',  
				'admission_class' => 'Class At Admission Time',	      	
				'present_class' => 'Class Name(Present)',		
				'fee_month' => 'Fee Month',  
				'fee_year' => 'Fee Year',	 				      	
				'nationality' => 'Nationality',	
				'ncc_cadet' => 'NCC Cadet',						    	
				'last_exam' => 'Last Exam',	
				'general_conduct' => 'General Conduct',	   				
				'working_days' => 'Total Working Days',	 
				'reason' => 'Reason',	      	
				'days_present' => 'Working Days Present',			
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
			$tc=TransferCertificate::selectRaw("ifnull(max(id),0)+1 as next_id")->get();			

			$x=strlen($tc[0]->next_id);		
			$y=$x+3; 
			$z=sprintf("%0{$y}d",$tc[0]->next_id);
			$slc_no='SLC'.$z;		                   
			
			$insert_arr = array(            
				'student_id' => $request->id, 
				'school_code'=> $school[0]->id,   		
				'session_id' => $fiscal_id,		  		
				'tc_no' => $slc_no,					
				'fee_month' => empty($request->fee_month)?0:$request->fee_month,  
				'fee_year' => empty($request->fee_year)?'':$request->fee_year,  
				'concession' => empty($request->concession)?'':$request->concession,  
				'working_days' => empty($request->working_days)?'':$request->working_days,  
				'working_present' => empty($request->days_present)?'':$request->days_present,  
				'ncc_conduct' => empty($request->ncc_cadet)?'':$request->ncc_cadet,  
				'application_date' => $request->application_date,  
				'issue_date' => $request->issue_date,  
				'reason' => empty($request->reason)?'':$request->reason,  
				'remark' => empty($request->remark)?'':$request->remark,  
				'general_conduct' => empty($request->general_conduct)?'':$request->general_conduct,  
				'fail_attempt' => empty($request->fail_attempt)?'':$request->fail_attempt,    
				'qualified' => empty($request->qualify_promote)?0:$request->qualify_promote, 
				'last_exam' => empty($request->last_exam)?0:$request->last_exam,  
				'game' => empty($request->game)?'':$request->game,  
			);
			
			$slc = TransferCertificate::create($insert_arr);				
			
			if($slc->id)		
			{ 				   
				$certificate=TransferCertificate::leftJoin('student_master as sm', 'slc_certificates.student_id', '=', 'sm.id')
				->leftJoin('class_master as cm','sm.class_id','=','cm.classId')	   
				->leftJoin('class_master as cs','slc_certificates.last_exam','=','cs.classId')	    
				->leftJoin('class_master as cd','slc_certificates.qualified','=','cd.classId')	      
				->selectRaw("slc_certificates.tc_no,MONTHNAME(STR_TO_DATE(slc_certificates.fee_month,'%m')) as f_month,slc_certificates.fee_year,slc_certificates.concession,slc_certificates.general_conduct,slc_certificates.working_days,slc_certificates.working_present,slc_certificates.ncc_conduct,slc_certificates.application_date,slc_certificates.issue_date,slc_certificates.reason,slc_certificates.remark,slc_certificates.fail_attempt,slc_certificates.game,sm.id,sm.student_name,sm.father_name,sm.mother_name,sm.admission_no,sm.nationality,sm.caste,sm.dob,sm.admission_date,cm.className,cs.className as classLast,cd.className as qualify")
				->where('slc_certificates.id',$slc->id)
				->get();		  
					
				$updt_arr=array('status'=>0);		
				
				StudentMaster::where('id',$certificate[0]->id)->update($updt_arr);				
				
				if($action=='saveprint')		  
				{ 					
					$page_data = array('school'=>$school,'slc'=>$certificate); 			  						
					$slip_name=time().rand(1,99).'.'.'pdf';  			
					$data_arr['print_id']=$slip_name;	
					$pdf = PDF::loadView("transfer_certificate",$page_data)->save(public_path("certificates/tc/$slip_name"));	
					
					$message="New transfer certificate created successfully, transfer certificate generated.";    
					
				}
				else
				{
					$message="New transfer certificate created successfully"; 
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
		$info = TransferCertificate::leftJoin('student_master as sm', 'slc_certificates.student_id', '=', 'sm.id')
		->leftJoin('class_master as cs','sm.class_id','=','cs.classId')   			  
		->leftJoin('class_master as cm','sm.class_first','=','cm.classId')   					      
		->select(DB::raw('count(*) as row_count'))
		->where('slc_certificates.id',$id)
		->get();	  

		if($info[0]->row_count > 0)  	
		{ 
			$record = TransferCertificate::leftJoin('student_master as sm', 'slc_certificates.student_id', '=', 'sm.id')
					->leftJoin('class_master as cs','sm.class_id','=','cs.classId')   			  
					->leftJoin('class_master as cm','sm.class_first','=','cm.classId')   					      
					->selectRaw("slc_certificates.*,sm.id as student_id,sm.student_name,sm.father_name,sm.mother_name,sm.nationality,sm.caste,sm.dob,sm.admission_date,cs.className as present_class,cm.className as admission_class")
					->where('slc_certificates.id',$id)
					->get();

			$response_arr = array("status" => "successed", "success" => true, "message" => "Transfer certificate record found","data" =>$record);  					
        }
        else {
			$response_arr = array("status" => "failed", "success" => false, "message" => "Whoops! no record found","data" =>[]);	         		
        }			

		return response()->json($response_arr);							
	}
	
	public function update(Request $request,$id)	
	{ 
		$info = TransferCertificate::leftJoin('student_master as sm', 'slc_certificates.student_id', '=', 'sm.id')
		->leftJoin('class_master as cs','sm.class_id','=','cs.classId')   			  
		->leftJoin('class_master as cm','sm.class_first','=','cm.classId')   					      
		->select(DB::raw('count(*) as row_count'))
		->where('slc_certificates.id',$id)
		->get();	  

		if($info[0]->row_count > 0)  	
		{ 	 		 	
			$inputs=$request->all();  	
			$action=$request->button;  
			
			$rules=[ 
					'name' => 'required',  		  	
					'f_name' => 'required',
					'm_name' => 'required',
					'dob' => 'required|date',
					'admission_date' => 'required|date',  
					'application_date' => 'required|date', 
					'issue_date' => 'required|date',  
					'admission_class' => 'required',  		  	
					'present_class' => 'required',
					'fee_month' => 'required|not_in:0',
					'fee_year' => 'required|not_in:0',
					'nationality' => 'required',  						  	
					'ncc_cadet' => 'required',
					'general_conduct' => 'required|not_in:0',   
					'last_exam' => 'required|not_in:0',  		  					
					'working_days' => 'required',   	
					'reason' => 'required',    
					'days_present' => 'required',   	
					'remark' => 'required',  				
				];   
				
				$fields = [  									  	
					'id' => 'Student Id',       
					'name' => 'Student Name',	      	
					'f_name' => 'Father Name',		
					'm_name' => 'Mother Name',  
					'dob' => 'Date Of Birth',	      	
					'admission_date' => 'Admission Date',		
					'application_date' => 'Application Date',  
					'issue_date' => 'Certificate Issued On',  
					'admission_class' => 'Class At Admission Time',	      	
					'present_class' => 'Class Name(Present)',		
					'fee_month' => 'Fee Month',  
					'fee_year' => 'Fee Year',	 				      	
					'nationality' => 'Nationality',	
					'ncc_cadet' => 'NCC Cadet',						    	
					'last_exam' => 'Last Exam',	
					'general_conduct' => 'General Conduct',	   				
					'working_days' => 'Total Working Days',	 
					'reason' => 'Reason',	      	
					'days_present' => 'Working Days Present',			
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
					'fee_month' => empty($request->fee_month)?0:$request->fee_month,  
					'fee_year' => empty($request->fee_year)?'':$request->fee_year,  
					'concession' => empty($request->concession)?'':$request->concession,  
					'working_days' => empty($request->working_days)?'':$request->working_days,  
					'working_present' => empty($request->days_present)?'':$request->days_present,  
					'ncc_conduct' => empty($request->ncc_cadet)?'':$request->ncc_cadet,  
					'application_date' => $request->application_date,  
					'issue_date' => $request->issue_date,  
					'reason' => empty($request->reason)?'':$request->reason,  
					'remark' => empty($request->remark)?'':$request->remark,  
					'general_conduct' => empty($request->general_conduct)?'':$request->general_conduct,  
					'fail_attempt' => empty($request->fail_attempt)?'':$request->fail_attempt,    
					'qualified' => empty($request->qualify_promote)?0:$request->qualify_promote, 
					'last_exam' => empty($request->last_exam)?0:$request->last_exam,  
					'game' => empty($request->game)?'':$request->game,  
				);  

				$update=TransferCertificate::where('id',$id)->update($updt_arr); 		
			
				if($update)		
				{ 
					$certificate=TransferCertificate::leftJoin('student_master as sm', 'slc_certificates.student_id', '=', 'sm.id')
						->leftJoin('class_master as cm','sm.class_id','=','cm.classId')	   
						->leftJoin('class_master as cs','slc_certificates.last_exam','=','cs.classId')	    
						->leftJoin('class_master as cd','slc_certificates.qualified','=','cd.classId')	      
						->selectRaw("slc_certificates.tc_no,MONTHNAME(STR_TO_DATE(slc_certificates.fee_month,'%m')) as f_month,slc_certificates.fee_year,slc_certificates.concession,slc_certificates.general_conduct,slc_certificates.working_days,slc_certificates.working_present,slc_certificates.ncc_conduct,slc_certificates.application_date,slc_certificates.issue_date,slc_certificates.reason,slc_certificates.remark,slc_certificates.fail_attempt,slc_certificates.game,sm.id,sm.student_name,sm.father_name,sm.mother_name,sm.admission_no,sm.nationality,sm.caste,sm.dob,sm.admission_date,cm.className,cs.className as classLast,cd.className as qualify")
						->where('slc_certificates.id',$id)
						->get();		      
					
					if($action=='saveprint')		  
					{
						$school=School::where('school_code','S110')->get();   						
								
						$page_data = array('school'=>$school,'slc'=>$certificate); 			  						
						$slip_name=time().rand(1,99).'.'.'pdf';  			
						
						$pdf = PDF::loadView("transfer_certificate",$page_data)->save(public_path("certificates/tc/$slip_name"));	
						
						$message="Transfer certificate updated successfully, transfer certificate print generated.";    
						$data_arr['print_id']=$slip_name;	
						
						$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data"=>$data_arr);		
					}
					else if($action=='saveidentical')		  
					{
						$updt_arr=array('status'=>1);						
						StudentMaster::where('id',$certificate[0]->id)->update($updt_arr);		
						
						$del=TransferCertificate::where('id',$id)->delete();		
						
						if($del)
						{
							$message="Re-added Successfully.";  
							$data_arr['print_id']="";	 	
							$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data"=>$data_arr);	  
						}
						else
						{
							$message="could not re-added !!";    
							$response_arr=array("status"=>'failed',"success"=>false,"message"=>$message,"errors"=>[],"data"=>[]);	
						}  												
					}	
					else
					{
						$message="Transfer certificate updated successfully.";   		
						$data_arr['print_id']="";
						$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data"=>$data_arr);	    	
					}  
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
   
	public function printSlc($id)		
	{
		$info = TransferCertificate::leftJoin('student_master as sm', 'slc_certificates.student_id', '=', 'sm.id')
					->leftJoin('class_master as cs','sm.class_id','=','cs.classId')   			  
					->leftJoin('class_master as cm','sm.class_first','=','cm.classId')   					      
					->select(DB::raw('count(*) as row_count'))
					->where('slc_certificates.id',$id)
					->get();					

		if($info[0]->row_count > 0) 		
		{
			$certificate=TransferCertificate::leftJoin('student_master as sm', 'slc_certificates.student_id', '=', 'sm.id')
				->leftJoin('class_master as cm','sm.class_id','=','cm.classId')	   
				->leftJoin('class_master as cs','slc_certificates.last_exam','=','cs.classId')	    
				->leftJoin('class_master as cd','slc_certificates.qualified','=','cd.classId')	      
				->selectRaw("slc_certificates.tc_no,MONTHNAME(STR_TO_DATE(slc_certificates.fee_month,'%m')) as f_month,slc_certificates.fee_year,slc_certificates.concession,slc_certificates.general_conduct,slc_certificates.working_days,slc_certificates.working_present,slc_certificates.ncc_conduct,slc_certificates.application_date,slc_certificates.issue_date,slc_certificates.reason,slc_certificates.remark,slc_certificates.fail_attempt,slc_certificates.game,sm.id,sm.student_name,sm.father_name,sm.mother_name,sm.admission_no,sm.nationality,sm.caste,sm.dob,sm.admission_date,cm.className,cs.className as classLast,cd.className as qualify")
				->where('slc_certificates.id',$id)
				->get();				
				
			$school=School::where('school_code','S110')->get();   	
			$page_data = array('school'=>$school,'slc'=>$certificate); 			  						
			$slip_name=time().rand(1,99).'.'.'pdf';  						
			$pdf = PDF::loadView("transfer_certificate",$page_data)->save(public_path("certificates/tc/$slip_name"));	

			$message="Transfer certificate generated.";    
			$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data" =>$slip_name);	 			
        }
        else {
			$response_arr = array("status" => "failed", "success" => false, "message" => "Whoops! no record found","data" =>[]);	         		
        }			

		return response()->json($response_arr);					
	}

	public function exportRec(Request $request) 
	{		
		$search=empty($request->search)?'':$request->search;    
		
		$file_name = 'Transfer_Certificate'.date('Y_m_d_H_i_s').'.xlsx';          
		$export=Excel::store(new SlcExport($search),$file_name,'custom_upload');   			
		
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
    
   public function getSuggest($search)    
   { 		
        $query=StudentMaster::leftJoin('class_master as cs','student_master.class_id','=','cs.classId') 
				->leftJoin('slc_certificates as sl','student_master.id','=','sl.student_id')		  
				->select('student_master.*','cs.className');			

		$query->where(function($q) use ($search) {
			 $q->where('cs.className', 'like', '%'.$search.'%')
			   ->orWhere('student_master.student_name','like','%'.$search.'%')    
			   ->orWhere('student_master.father_name','like','%'.$search.'%')    
			   ->orWhere('student_master.admission_no','like','%'.$search.'%');        		
		});  		
				    
		$result=$query->whereNull('sl.student_id')->get(); 	   				
			
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
			->leftJoin('slc_certificates as sl','student_master.id','=','sl.student_id')		  	
			->selectRaw("student_master.*,cs.className as present_class,cm.className as admission_class")	  
			->where("student_master.admission_no",$key)
			->whereNull('sl.student_id')	    
			->get(); 		 														
		 
        if(count($result)>0) {  
            return response()->json(["status" => "successed", "success" => true, "data" => $result]);	  
        }
        else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found"]);
        }    
   }  		
   
}