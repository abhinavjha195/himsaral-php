<?php
 
namespace App\Http\Controllers;
 
use Illuminate\Http\Request; 
use Illuminate\Support\Facades\Validator;  				
use Illuminate\Support\Facades\DB; 
use Illuminate\Support\Facades\Hash;      

use App\Models\SectionMaster;       
use App\Models\RouteMaster;          
use App\Models\District;      
use App\Models\Classic;   
use App\Models\Vehicle;	        
 		
use App\Models\Course;  
use App\Models\School;     	   
use App\Models\ParentLogin;       
use App\Models\SessionMaster;  
use App\Models\StudentRegister;  

use App\Exports\RegistrationExport;
use Helper; 
use Excel;			
use Image;  
use PDF;  			       		  							 
 
class StudentRegisterController extends Controller			
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
		$amount = is_null($request->amount)?'':(int)$request->amount;	
		
		$offset = ($page-1)*$limit;   			
		
		$query = StudentRegister::leftJoin('class_master as cs','student_registration.class_id','=','cs.classId')		
				->leftJoin('course_master as cm', 'student_registration.course_id', '=', 'cm.courseId') 		
				->leftJoin('station_master as sm','student_registration.station_id','=','sm.stationId')
				->select(DB::raw('count(*) as row_count'));	
		
		if($course_id !='')
		{
			$query->where('student_registration.course_id',$course_id);	
		}
		
		if($class_id !='')
		{
			$query->where('student_registration.class_id',$class_id);	
		}
		
		if($amount !='')
		{
			$query->where('student_registration.fee',$amount);	
		}
		
		if($search !='')	
		{  
			$query->where(function($q) use ($search) {
				 $q->where('student_registration.student_name', 'like', '%'.$search.'%')
				   ->orWhere('cs.className', 'like', '%'.$search.'%')		   	
				   ->orWhere('cm.courseName', 'like', '%'.$search.'%')
				   ->orWhere('sm.stationName', 'like', '%'.$search.'%');		
			 });   
		}
			 
		$records = $query->get();  	
		
		$student_query = StudentRegister::leftJoin('class_master as cs','student_registration.class_id','=','cs.classId')
						->leftJoin('course_master as cm', 'student_registration.course_id', '=', 'cm.courseId') 		
						->leftJoin('station_master as sm','student_registration.station_id','=','sm.stationId')
						->selectRaw("student_registration.id,student_registration.student_name,student_registration.mobile,student_registration.father_name,student_registration.registration_date,student_registration.registration_no,student_registration.fee,cm.courseName,cs.className,ifnull(sm.stationName,'') as stationName")	
						->offset($offset)->limit($limit);  	

		if($course_id !='')
		{
			$student_query->where('student_registration.course_id',$course_id);	
		}
		
		if($class_id !='')
		{
			$student_query->where('student_registration.class_id',$class_id);	
		}
		
		if($amount !='')
		{
			$student_query->where('student_registration.fee',$amount);	
		}					
		
		if($search !='')	
		{  
			$student_query->where(function($q) use ($search) {
				 $q->where('student_registration.student_name', 'like', '%'.$search.'%')
				   ->orWhere('cs.className', 'like', '%'.$search.'%')		   	
				   ->orWhere('cm.courseName', 'like', '%'.$search.'%')
				   ->orWhere('sm.stationName', 'like', '%'.$search.'%');		
			 });   
		}
		
		if($order_by !='')	
		{
			$student_query->orderBy($order_by,$order); 				
		}	
		
		$registrations = $student_query->groupBy('student_registration.id')->get();  
 		
        if(count($registrations) > 0) 
		{
			$response_arr = array('data'=>$registrations,'total'=>$records[0]->row_count,'query'=>$request->all());			
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
		$insert_id=empty($request->insert_id)?'':$request->insert_id;   
		$tab=$request->tab;
		$action=$request->action;	
		$image_rule = $image_rule1= $image_rule2="";		
		$image_name = $image_name1= $image_name2="";  
		$email_rule="";  		
		
		if($insert_id)
		{			
			$info=StudentRegister::leftJoin('class_master as cm','student_registration.class_id','=','cm.classId')
				->leftJoin('station_master as sm','student_registration.station_id','=','sm.stationId')
				->selectRaw("student_registration.*,cm.className,ifnull(sm.stationName,'') as stationName")		
				->where('student_registration.id',$insert_id)
				->get();  	 				
		}

		if($tab=='personal_detail')	
		{
			if($insert_id)
			{ 				
				$email_rule=($request->email==$info[0]->email)?'required|max:255':'required|unique:student_registration|max:255';  
			}
			else
			{
				$email_rule='required|unique:student_registration|max:255';  
			}
			
			if($request->file('student_image')!=null)
			{				
				$image_rule = 'required|image|mimes:jpeg,png,jpg|max:5120';							
			}			
			
			$rules=[            	 			 				
				'student_image' => $image_rule,		  	
				'student_name' => 'required',   
				'dob' => 'required',   	
				'gender' => 'required',   
				'nationality' => 'required', 
				'marital_status'=>'required', 	
				'account_no' => 'required',  
				'ifsc' => 'required',    
				'branch_address' => 'required',     	
				'caste' => 'required',   
				'religion' => 'required',   	
				'mobile' => 'required',     				
				'email' => $email_rule,  
				'blood_group' => 'required',   
				'aadhar_no' => 'required',   	
				'permanent_address' => 'required',   		
				'state_id' => 'required', 
				'district_id' => 'required',   	
				'pincode' => 'required'			  	
			];   
			
			$fields = [  				
				'student_image' => 'Student Image',  
				'student_name' => 'Student Name',     	
				'dob' => 'Date of Birth',  
				'gender' => 'Gender', 
				'nationality' => 'Nationality', 				 
				'marital_status' => 'Maritial Status', 
				'account_no' => 'Account No.',    
				'ifsc' => 'IFSC Code',    
				'branch_address' => 'Branch Address',     	
				'caste' => 'Caste',   
				'religion' => 'Religion',   	
				'mobile' => 'Mobile No.',   
				'email' => 'Email',
				'blood_group' => 'Blood Group',   
				'aadhar_no' => 'Aadhar No.',   	
				'permanent_address' => 'Permanent Address',   		
				'state_id' => 'State', 
				'district_id' => 'District',   	
				'pincode' => 'Pincode'	       	
			]; 

			$messages = [
				'required' => 'The :attribute field is required.',    
			];  	
		}
		else if($tab=='parents_detail')	
		{		
			$parent_type=empty($request->parent_type)?'':$request->parent_type;   
			$parent_rule=($parent_type=='new')?'':'required';   			  
			
			if($request->file('father_image')!=null)
			{				
				$image_rule1 = 'required|image|mimes:jpeg,png,jpg|max:5120';					
			}
			
			if($request->file('mother_image')!=null)
			{				
				$image_rule2 = 'required|image|mimes:jpeg,png,jpg|max:5120';							
			}
			
			if($insert_id)
			{ 				
				$mobile_rule=($request->f_mobile==$info[0]->f_mobile)?'required|max:25':'required|unique:student_registration|max:25';  
			}
			else
			{
				$mobile_rule='required|unique:student_registration|max:25';  
			}
			
			$rules=[
				'parent_type' => 'required',
				'sibling_admission_no' => $parent_rule,	  	
				'sibling_no' => $parent_rule,	    
				'father_image' => $image_rule1,			  	
				'mother_image' => $image_rule2,		  	
				'father_name' => 'required',
				'mother_name' => 'required',  
				'f_occupation' => 'required',
				'f_income' => 'required', 
				'f_designation' => 'required',	
				'f_mobile' => $mobile_rule,  		
				'f_email' => 'required',	   	 				
				'images.*' => 'required|image|mimes:jpeg,png,jpg|max:2048'			
			];   
			
			$messages = [
				'required' => 'The :attribute field is required.',  
			];  
			
			$fields = [   
				'parent_type' => 'Parent Type',        	
				'sibling_admission_no' => 'Sibling Admission No.',  
				'sibling_no' => 'Sibling Child',   
				'father_image' => 'Father Image',   
				'mother_image' => 'Mother Image',   
				'father_name' => 'Father Name',		
				'mother_name' => 'Mother Name',  
				'f_occupation' => "Father's Occupation",	
				'f_income' => "Father's Annual Income", 
				'f_designation' => 'Designation',
				'f_mobile' => 'Mobile No (For SMS)',  
				'f_email' => 'E-Mail ID',   
			];  
		}
		else if($tab=='registration_detail')	  
		{
			if($insert_id)
			{ 				
				$regis_rule=($request->regis_no==$info[0]->registration_no)?'required|max:255':'required|unique:student_registration,registration_no';     
			}
			else
			{
				$regis_rule='required|unique:student_registration,registration_no';  
			}
			
			$rules=[            	 			 				
				'regis_no' => $regis_rule,	 					
				'regis_date' => 'required|date',	
				'doi' => 'required|date',	
				'regis_fee' => 'required',  
				'station_id' => 'required',  				
				'class_id' => 'required',   
				'course_id' => 'required',   
			];   
			
			$fields = [  									  	
				'regis_no' => 'Registration No.',       
				'regis_date' => 'Registration Date',	      	
				'doi' => 'Date of Interview',    
				'regis_fee' => 'Registration Fee',       			
				'class_id' => 'Class Name',	 
				'course_id' => 'Course Name',	 	
				'station_id' => 'Station Name',	 
			]; 
			
			$messages = [
				'required' => 'The :attribute field is required.',    				
			];  	 
		}  		
		else
		{
			$rules=[              	 			
				'images' => 'required',
				'images.*' => 'required|image|mimes:jpeg,png,jpg|max:2048'			
			];   
			
			$messages = [
				'required' => 'The :attribute field is required.',  
			];  
			
			$fields = [
				'images' => 'Student Photo Image'   
			];  
		}  	
		
		$validator = Validator::make($inputs,$rules,$messages,$fields);   		    		
		
        if ($validator->fails()) {  	
			$errors=$validator->errors();      			  
			$response_arr=array("status"=>"failed","success"=>false,"message"=>"Please fill required fields!!","errors"=>$errors);   
        }  		
		else
		{	
			if($request->hasFile('student_image'))   
			{  
				$image  = $request->file('student_image'); 
				
				/* $height = Image::make($image)->height();		
				$width = Image::make($image)->width();    */
				
				$imageDimensions = getimagesize($image);  
				
				$width = $imageDimensions[0];		
				$height = $imageDimensions[1]; 

				$new_height = Helper::setDimension($height);	
				$new_width = Helper::setDimension($width);	 				  
				
				$image_name = time().rand(3, 9).'.'.$image->getClientOriginalExtension();  
				$imgFile = Image::make($image->getRealPath());  
				
				$destinationPath1 = public_path().'/uploads/student_image/';  		
				$destinationPath2 = public_path().'/uploads/student_image/thumbnail/';  
				
				$image->move($destinationPath1,$image_name);  	
				
				$imgFile->resize($new_height,$new_width, function ($constraint) {	  	
					$constraint->aspectRatio();   
				})->save($destinationPath2.$image_name);						
								
			}  

			if($request->hasFile('father_image'))   
			{   					
				$f_image  = $request->file('father_image'); 
				$imgFile = Image::make($f_image->getRealPath());    	
				$imageDimensions = getimagesize($f_image);  
				
				$width = $imageDimensions[0];		
				$height = $imageDimensions[1]; 

				$new_height = Helper::setDimension($height);	
				$new_width = Helper::setDimension($width);	
				
				$image_name1 = time().rand(3, 9).'.'.$f_image->getClientOriginalExtension();    				

				$destinationPath1 = public_path().'/uploads/father_image/';  		
				$destinationPath2 = public_path().'/uploads/father_image/thumbnail/';  

				$f_image->move($destinationPath1,$image_name1);  	

				$imgFile->resize($new_height,$new_width, function ($constraint) {	  	
					$constraint->aspectRatio();   
				})->save($destinationPath2.$image_name1);	
				
			}    		
			if($request->hasFile('mother_image'))   
			{   					
				$m_image = $request->file('mother_image');     	
				$imgFile = Image::make($m_image->getRealPath());    	
				$imageDimensions = getimagesize($m_image);  
				
				$width = $imageDimensions[0];		
				$height = $imageDimensions[1]; 
				
				$new_height = Helper::setDimension($height);	
				$new_width = Helper::setDimension($width);	   
				
				$image_name2 = time().rand(3, 9).'.'.$m_image->getClientOriginalExtension();   				
				
				$destinationPath1 = public_path().'/uploads/mother_image/';  		
				$destinationPath2 = public_path().'/uploads/mother_image/thumbnail/';  

				$m_image->move($destinationPath1,$image_name2);  	

				$imgFile->resize($new_height,$new_width, function ($constraint) {	  	
					$constraint->aspectRatio();   
				})->save($destinationPath2.$image_name2);	
				
			} 

			$school=School::where('school_code','S110')->get();    
			$fiscal_yr=Helper::getFiscalYear(date('m'));  
			$fiscal_arr=explode(':',$fiscal_yr);	
			$fiscalYear=SessionMaster::where('session_start',$fiscal_arr[0])->where('session_end',$fiscal_arr[1])->get();
			$fiscal_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0; 	
			
			if($tab=='personal_detail')	
			{    
				if($insert_id)
				{  					
					$update_arr=array(		
						'student_name'=>$request->student_name,		
						'dob'=>$request->dob,
						'gender'=>$request->gender,
						'nationality'=>$request->nationality,
						'caste'=>$request->caste,
						'religion'=>$request->religion,
						'mobile'=>$request->mobile,
						'email'=>$request->email,
						'blood_group'=>$request->blood_group,
						'aadhar_no'=>$request->aadhar_no,
						'permanent_address'=>$request->permanent_address,    
						'temporary_address'=>($request->temporary_address)?$request->temporary_address:'',  
						'branch_address'=>($request->branch_address)?$request->branch_address:'',      	
						'state_id'=>$request->state_id,
						'district_id'=>$request->district_id,			
						'pincode'=>$request->pincode, 
						'student_image'=>($image_name=='')?$info[0]->student_image:$image_name,  
						'account_no'=>empty($request->account_no)?'':$request->account_no,   
						'ifsc_no'=>empty($request->ifsc)?'':$request->ifsc,    
						'marital_status'=>empty($request->marital_status)?'':$request->marital_status,   	
					);	
					
					$update=StudentRegister::where('id',$insert_id)->update($update_arr); 	
					$id_arr['insert_id']=$insert_id;	
					
					if($action=='saveprint')
					{
						$registration=StudentRegister::leftJoin('class_master as cm','student_registration.class_id','=','cm.classId')
						->leftJoin('station_master as sm','student_registration.station_id','=','sm.stationId')
						->selectRaw("student_registration.*,cm.className,ifnull(sm.stationName,'') as stationName")		
						->where('student_registration.id',$insert_id)
						->get();  	
						
						$page_data = array('school'=>$school,'registration'=>$registration); 						
						$slip_name=time().rand(1,99).'.'.'pdf';   						
						$pdf = PDF::loadView("registration_slip",$page_data)->save(public_path("registrations/$slip_name")); 
						 
						$message="Registration details updated, registration slip generated.";   
						$id_arr['print_id']=$slip_name;    	
					}
					else
					{
						$message="Registration details updated.";   
						$id_arr['print_id']="";		
					}		
		  
					if($update)		
					{							
						$response_arr=array("status"=>'successed',"success"=>true,"errors"=>[],"message"=>$message,"data" =>$id_arr);	  						
					}
					else
					{
						$message="could not saved!!";  
						$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);	
					}				
					
				}
				else
				{  
					$insert_arr=array(
						'student_name'=>$request->student_name,				  
						'dob'=>$request->dob,		
						'gender'=>$request->gender,
						'nationality'=>$request->nationality,		
						'caste'=>$request->caste,
						'religion'=>$request->religion,
						'mobile'=>$request->mobile,
						'email'=>$request->email,
						'blood_group'=>$request->blood_group,
						'aadhar_no'=>$request->aadhar_no,
						'permanent_address'=>$request->permanent_address, 
						'temporary_address'=>empty($request->temporary_address)?'':$request->temporary_address,   
						'branch_address'=>empty($request->branch_address)?'':$request->branch_address, 
						'account_no'=>empty($request->account_no)?'':$request->account_no,   
						'ifsc_no'=>empty($request->ifsc)?'':$request->ifsc,    
						'marital_status'=>empty($request->marital_status)?'':$request->marital_status,	
						'state_id'=>$request->state_id,   
						'district_id'=>$request->district_id,	
						'session_id' => $fiscal_id,		  	
						'pincode'=>$request->pincode, 
						'student_image'=>$image_name,  	
					);	
					
					$register = StudentRegister::create($insert_arr);   
					
					if($register->id)		
					{	
						$id_arr['insert_id']=$register->id;  	
						$registration=StudentRegister::leftJoin('class_master as cm','student_registration.class_id','=','cm.classId')
						->leftJoin('station_master as sm','student_registration.station_id','=','sm.stationId')
						->selectRaw("student_registration.*,cm.className,ifnull(sm.stationName,'') as stationName")		
						->where('student_registration.id',$register->id)
						->get();  	
						
						if($action=='saveprint')
						{
							$page_data = array('school'=>$school,'registration'=>$registration); 						
							$slip_name=time().rand(1,99).'.'.'pdf';   						
							$pdf = PDF::loadView("registration_slip",$page_data)->save(public_path("registrations/$slip_name")); 
							$message="New registration successfull, registration slip generated.";    
							$id_arr['print_id']=$slip_name;    	
						}
						else
						{
							$message="New registration successfull.";    
							$id_arr['print_id']="";		
						}								
						
						$response_arr=array("status"=>'successed',"success"=>true,"errors"=>[],"message"=>$message,"data" =>$id_arr);	 							
					}
					else
					{
						$message="could not saved!!";  
						$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);	
					}
					
				}	
			}
			else if($tab=='parents_detail')	
			{ 	 								
				if($insert_id)
				{
					$parent_type=empty($request->parent_type)?$info[0]->parent_type:$request->parent_type;		
					$sibling_admission_no = ($parent_type=='new')?"":((empty($request->sibling_admission_no))?"":$request->sibling_admission_no);  
					$sibling_no = ($parent_type=='new')?"":((empty($request->sibling_no))?"":$request->sibling_no);  
					
					$update_arr=array(	
						'parent_type'=>$parent_type,     
						'sibling_admission_no'=>$sibling_admission_no,  		
						'sibling_no'=>$sibling_no,     
						'father_name'=>empty($request->father_name)?$info[0]->father_name:$request->father_name,  		 
						'mother_name'=>empty($request->mother_name)?$info[0]->mother_name:$request->mother_name, 	
						'f_occupation'=>empty($request->f_occupation)?'':$request->f_occupation,   
						'f_income'=>empty($request->f_income)?'':$request->f_income,   
						'f_designation'=>empty($request->f_designation)?'':$request->f_designation,   		
						'f_mobile'=>empty($request->f_mobile)?'':$request->f_mobile,   
						'f_email'=>empty($request->f_email)?'':$request->f_email,   
						'residence_no'=>empty($request->residence_no)?'':$request->residence_no,    	  	
						'father_image'=>($image_name1=='')?$info[0]->father_image:$image_name1,     
						'mother_image'=>($image_name2=='')?$info[0]->mother_image:$image_name2    
					);	
					
					$update=StudentRegister::where('id',$insert_id)->update($update_arr);
					$id_arr['insert_id']=$insert_id;   
					if($action=='saveprint')
					{
						$registration=StudentRegister::leftJoin('class_master as cm','student_registration.class_id','=','cm.classId')
						->leftJoin('station_master as sm','student_registration.station_id','=','sm.stationId')
						->selectRaw("student_registration.*,cm.className,ifnull(sm.stationName,'') as stationName")		
						->where('student_registration.id',$insert_id)
						->get(); 
						
						$page_data = array('school'=>$school,'registration'=>$registration); 						
						$slip_name=time().rand(1,99).'.'.'pdf';   						
						$pdf = PDF::loadView("registration_slip",$page_data)->save(public_path("registrations/$slip_name")); 
						$message="Registration details updated, registration slip generated.";      
						$id_arr['print_id']=$slip_name;    	
					}
					else
					{
						$message="Registration details updated.";   
						$id_arr['print_id']="";		
					}			
					
					if($update)		
					{  							
						// $message="student details updated successfully";      
						$checkCredit = ParentLogin::selectRaw('count(*) as row_count') 
									 ->where('s_id',$insert_id) 									 
									 ->get();
									 
						if($checkCredit[0]->row_count>0)			 
						{
							$parent_credential=array(
								'mobile_no'=>$request->f_mobile,
								'password' => Hash::make($request->mobile_no)    
							);	
						
							$credential=ParentLogin::where('s_id',$insert_id)->update($parent_credential);   	
						}
						else
						{
							$parent_credential=array(
								's_id'=>$insert_id, 
								'mobile_no'=>$request->f_mobile,			
								'password' => Hash::make($request->mobile_no)    
							);	
						
							ParentLogin::create($parent_credential);  	
						}			 
						
						$response_arr=array("status"=>'successed',"success"=>true,"errors"=>[],"message"=>$message,"data" =>$id_arr);	
					}
					else
					{
						$message="could not saved!!";  
						$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);	
					}				
					//
				}
				else
				{
					$parent_type=empty($request->parent_type)?'':$request->parent_type;  							
					$sibling_admission_no = ($parent_type=='new')?"":((empty($request->sibling_admission_no))?"":$request->sibling_admission_no);  
					$sibling_no = ($parent_type=='new')?"":((empty($request->sibling_no))?"":$request->sibling_no);  	
	
					$insert_arr=array(
						'parent_type'=>$parent_type,     					
						'sibling_admission_no'=>$sibling_admission_no,				
						'sibling_no'=>$sibling_no,        
						'father_name'=>empty($request->father_name)?'':$request->father_name,  
						'mother_name'=>empty($request->mother_name)?'':$request->mother_name, 	
						'f_occupation'=>empty($request->f_occupation)?'':$request->f_occupation,   
						'f_income'=>empty($request->f_income)?0:$request->f_income,   
						'f_designation'=>empty($request->f_designation)?'':$request->f_designation,   
						'f_mobile'=>empty($request->f_mobile)?'':$request->f_mobile,   
						'f_email'=>empty($request->f_email)?'':$request->f_email,   
						'residence_no'=>empty($request->residence_no)?'':$request->residence_no, 	
						'father_image'=>$image_name1,     
						'mother_image'=>$image_name2, 
						'session_id' => $fiscal_id,		  	
					);								  	
					
					$register = StudentRegister::create($insert_arr);  
					
					if($register->id)		
					{
						$id_arr['insert_id']=$register->id;    						

						$parent_credential=array(
							's_id'=>$register->id,		
							'mobile_no'=>$request->f_mobile,
							'password' => Hash::make($request->mobile_no)    
						);	
						
						$credential = ParentLogin::create($parent_credential);	

						if($credential->id)	
						{
							$message="Parent login password generated.";   
						}
						else 
						{
							$message="";						
						}							
						
						$registration=StudentRegister::leftJoin('class_master as cm','student_registration.class_id','=','cm.classId')
						->leftJoin('station_master as sm','student_registration.station_id','=','sm.stationId')
						->selectRaw("student_registration.*,cm.className,ifnull(sm.stationName,'') as stationName")		
						->where('student_registration.id',$register->id)
						->get();  	
						
						if($action=='saveprint')
						{
							$page_data = array('school'=>$school,'registration'=>$registration); 						
							$slip_name=time().rand(1,99).'.'.'pdf';   						
							$pdf = PDF::loadView("registration_slip",$page_data)->save(public_path("registrations/$slip_name")); 
							$message .="New registration successfull, registration slip generated.";    
							$id_arr['print_id']=$slip_name;    	
						}
						else
						{
							$message .="New registration successfull.";    
							$id_arr['print_id']="";		
						}		
						 
						$response_arr=array("status"=>'successed',"success"=>true,"errors"=>[],"message"=>$message,"data" =>$id_arr);
					}
					else
					{
						$message="could not saved!!";  
						$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);	
					}
					
				}
			}
			else if($tab=='registration_detail')	   
			{    
				if($insert_id)
				{  
					$update_arr=array(		
						'registration_no'=>$request->regis_no,    					
						'registration_date'=>$request->regis_date,	 						
						'interview_date'=>$request->doi,
						'fee'=>$request->regis_fee,		
						'class_id'=>$request->class_id,
						'course_id'=>$request->course_id,
						'station_id'=>$request->station_id,		   
					);	
					
					$update=StudentRegister::where('id',$insert_id)->update($update_arr); 	
					$id_arr['insert_id']=$insert_id;	

					if($action=='saveprint')		
					{
						$registration=StudentRegister::leftJoin('class_master as cm','student_registration.class_id','=','cm.classId')
						->leftJoin('station_master as sm','student_registration.station_id','=','sm.stationId')
						->selectRaw("student_registration.*,cm.className,ifnull(sm.stationName,'') as stationName")		
						->where('student_registration.id',$insert_id)
						->get(); 
						
						$page_data = array('school'=>$school,'registration'=>$registration); 						
						$slip_name=time().rand(1,99).'.'.'pdf';  	
						$id_arr['print_id']=$slip_name;		
						$pdf = PDF::loadView("registration_slip",$page_data)->save(public_path("registrations/$slip_name"));
						$message="Registration details updated, registration slip generated.";   
					}
					else
					{
						$message="Registration details updated.";    
						$id_arr['print_id']="";		 									
					}					

					if($update)		
					{						
						$response_arr=array("status"=>'successed',"success"=>true,"errors"=>[],"message"=>$message,"data" =>$id_arr);	
					}
					else   
					{  					
						$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);	
					}				
					
				}
				else
				{ 					
					$insert_arr=array(
						'registration_no'=>$request->regis_no,    					
						'registration_date'=>$request->regis_date,	 						
						'interview_date'=>$request->doi,
						'fee'=>$request->regis_fee,		
						'class_id'=>$request->class_id,
						'course_id'=>$request->course_id,
						'station_id'=>$request->station_id,	
						'session_id' => $fiscal_id,		  	
					);	  			
					
					$register = StudentRegister::create($insert_arr);  
					if($register->id)		
					{
						$id_arr['insert_id']=$register->id;  
						$registration=StudentRegister::leftJoin('class_master as cm','student_registration.class_id','=','cm.classId')
						->leftJoin('station_master as sm','student_registration.station_id','=','sm.stationId')
						->selectRaw("student_registration.*,cm.className,ifnull(sm.stationName,'') as stationName")		
						->where('student_registration.id',$register->id)
						->get();  	
						
						if($action=='saveprint')		
						{
							$page_data = array('school'=>$school,'registration'=>$registration); 						
							$slip_name=time().rand(1,99).'.'.'pdf';  	
							$id_arr['print_id']=$slip_name;   
							$pdf = PDF::loadView("registration_slip",$page_data)->save(public_path("registrations/$slip_name"));  							
							     							
							$message="Registration details updated, registration slip generated.";   
						}
						else
						{							
							$message="Registration details updated.";   
							$id_arr['print_id']="";		
						}			 						
								
						$response_arr=array("status"=>'successed',"success"=>true,"errors"=>[],"message"=>$message,"data" =>$id_arr);	  					
					}
					else
					{
						$message="could not saved!!";  
						$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);	
					}
					
				}  				
				
			}  			
			else
			{
				$message="could not saved!!";  				
				$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);	

			}   	
      		
		}	 	

		return response()->json($response_arr);	 	  						
								
	}
	
	public function create(Request $request)					
	{
		$inputs=$request->all(); 
		$insert_id=empty($request->insert_id)?'':$request->insert_id;   
		$tab=$request->tab;
		$image_rule = $image_rule1= $image_rule2="";		
		$image_name = $image_name1= $image_name2="";  
		$email_rule="";  		  	
		
		if($insert_id)
		{
			$info = StudentRegister::where('id',$insert_id)->get();   				
		}

		if($tab=='personal_detail')	
		{
			if($insert_id)
			{ 				
				$email_rule=($request->email==$info[0]->email)?'required|max:255':'required|unique:student_registration|max:255';  
			}
			else
			{
				$email_rule='required|unique:student_registration|max:255';  
			}
			
			if($request->file('student_image')!=null)
			{				
				$image_rule = 'required|image|mimes:jpeg,png,jpg|max:5120';							
			}			
			
			$rules=[            	 			 				
				'student_image' => $image_rule,		  	
				'student_name' => 'required',   
				'dob' => 'required',   	
				'gender' => 'required',   
				'nationality' => 'required', 
				'marital_status'=>'required', 	
				'account_no' => 'required',  
				'ifsc' => 'required',    
				'branch_address' => 'required',     	
				'caste' => 'required',   
				'religion' => 'required',   	
				'mobile' => 'required',     				
				'email' => $email_rule,  
				'blood_group' => 'required',   
				'aadhar_no' => 'required',   	
				'permanent_address' => 'required',   		
				'state_id' => 'required', 
				'district_id' => 'required',   	
				'pincode' => 'required'			  	
			];   
			
			$fields = [  				
				'student_image' => 'Student Image',  
				'student_name' => 'Student Name',     	
				'dob' => 'Date of Birth',  
				'gender' => 'Gender', 
				'nationality' => 'Nationality', 				 
				'marital_status' => 'Maritial Status', 
				'account_no' => 'Account No.',    
				'ifsc' => 'IFSC Code',    
				'branch_address' => 'Branch Address',     	
				'caste' => 'Caste',   
				'religion' => 'Religion',   	
				'mobile' => 'Mobile No.',   
				'email' => 'Email',
				'blood_group' => 'Blood Group',   
				'aadhar_no' => 'Aadhar No.',   	
				'permanent_address' => 'Permanent Address',   		
				'state_id' => 'State', 
				'district_id' => 'District',   	
				'pincode' => 'Pincode'	       	
			]; 

			$messages = [
				'required' => 'The :attribute field is required.',    
			];  	
		}
		else if($tab=='parents_detail')	
		{		
			$parent_type=empty($request->parent_type)?'':$request->parent_type;   
			$parent_rule=($parent_type=='new')?'':'required';   			  
			
			if($request->file('father_image')!=null)
			{				
				$image_rule1 = 'required|image|mimes:jpeg,png,jpg|max:5120';					
			}
			
			if($request->file('mother_image')!=null)
			{				
				$image_rule2 = 'required|image|mimes:jpeg,png,jpg|max:5120';							
			}
			
			if($insert_id)
			{ 				
				$mobile_rule=($request->f_mobile==$info[0]->f_mobile)?'required|max:25':'required|unique:student_registration|max:25';  
			}
			else
			{
				$mobile_rule='required|unique:student_registration|max:25';  
			}
			
			$rules=[
				'parent_type' => 'required',
				'sibling_admission_no' => $parent_rule,	  	
				'sibling_no' => $parent_rule,	    
				'father_image' => $image_rule1,			  	
				'mother_image' => $image_rule2,		  	
				'father_name' => 'required',
				'mother_name' => 'required',  
				'f_occupation' => 'required',
				'f_income' => 'required', 
				'f_designation' => 'required',	
				'f_mobile' => $mobile_rule,  		
				'f_email' => 'required',	   	 				
				'images.*' => 'required|image|mimes:jpeg,png,jpg|max:2048'			
			];   
			
			$messages = [
				'required' => 'The :attribute field is required.',  
			];  
			
			$fields = [   
				'parent_type' => 'Parent Type',        	
				'sibling_admission_no' => 'Sibling Admission No.',  
				'sibling_no' => 'Sibling Child',   
				'father_image' => 'Father Image',   
				'mother_image' => 'Mother Image',   
				'father_name' => 'Father Name',		
				'mother_name' => 'Mother Name',  
				'f_occupation' => "Father's Occupation",	
				'f_income' => "Father's Annual Income", 
				'f_designation' => 'Designation',
				'f_mobile' => 'Mobile No (For SMS)',  
				'f_email' => 'E-Mail ID',   
			];  
		}
		else if($tab=='registration_detail')	  
		{
			if($insert_id)
			{ 				
				$regis_rule=($request->regis_no==$info[0]->registration_no)?'required|max:255':'required|unique:student_registration,registration_no';     
			}
			else
			{
				$regis_rule='required|unique:student_registration,registration_no';  
			}
			
			$rules=[            	 			 				
				'regis_no' => $regis_rule,	 					
				'regis_date' => 'required|date',	
				'doi' => 'required|date',	
				'regis_fee' => 'required',  
				'station_id' => 'required',  				
				'class_id' => 'required',   
				'course_id' => 'required',   
			];   
			
			$fields = [  									  	
				'regis_no' => 'Registration No.',       
				'regis_date' => 'Registration Date',	      	
				'doi' => 'Date of Interview',    
				'regis_fee' => 'Registration Fee',       			
				'class_id' => 'Class Name',	 
				'course_id' => 'Course Name',	 	
				'station_id' => 'Station Name',	 
			]; 
			
			$messages = [
				'required' => 'The :attribute field is required.',    				
			];  	 
		}  		
		else
		{
			$rules=[              	 			
				'images' => 'required',
				'images.*' => 'required|image|mimes:jpeg,png,jpg|max:2048'			
			];   
			
			$messages = [
				'required' => 'The :attribute field is required.',  
			];  
			
			$fields = [
				'images' => 'Student Photo Image'   
			];  
		}  	
		
		$validator = Validator::make($inputs,$rules,$messages,$fields);   		    		
		
        if ($validator->fails()) {  	
			$errors=$validator->errors();      			  
			$response_arr=array("status"=>"failed","success"=>false,"message"=>"Please fill required fields!!","errors"=>$errors);   
        }  		
		else
		{	
			if($request->hasFile('student_image'))   
			{  
				$image  = $request->file('student_image'); 
				
				/* $height = Image::make($image)->height();		
				$width = Image::make($image)->width();    */
				
				$imageDimensions = getimagesize($image);  
				
				$width = $imageDimensions[0];		
				$height = $imageDimensions[1]; 

				$new_height = Helper::setDimension($height);	
				$new_width = Helper::setDimension($width);	 				  
				
				$image_name = time().rand(3, 9).'.'.$image->getClientOriginalExtension();  
				$imgFile = Image::make($image->getRealPath());  
				
				$destinationPath1 = public_path().'/uploads/student_image/';  		
				$destinationPath2 = public_path().'/uploads/student_image/thumbnail/';  
				
				$image->move($destinationPath1,$image_name);  	
				
				$imgFile->resize($new_height,$new_width, function ($constraint) {	  	
					$constraint->aspectRatio();   
				})->save($destinationPath2.$image_name);						
								
			}  

			if($request->hasFile('father_image'))   
			{   					
				$f_image  = $request->file('father_image'); 
				$imgFile = Image::make($f_image->getRealPath());    	
				$imageDimensions = getimagesize($f_image);  
				
				$width = $imageDimensions[0];		
				$height = $imageDimensions[1]; 

				$new_height = Helper::setDimension($height);	
				$new_width = Helper::setDimension($width);	
				
				$image_name1 = time().rand(3, 9).'.'.$f_image->getClientOriginalExtension();    				

				$destinationPath1 = public_path().'/uploads/father_image/';  		
				$destinationPath2 = public_path().'/uploads/father_image/thumbnail/';  

				$f_image->move($destinationPath1,$image_name1);  	

				$imgFile->resize($new_height,$new_width, function ($constraint) {	  	
					$constraint->aspectRatio();   
				})->save($destinationPath2.$image_name1);	
				
			}    		
			if($request->hasFile('mother_image'))   
			{   					
				$m_image = $request->file('mother_image');     	
				$imgFile = Image::make($m_image->getRealPath());    	
				$imageDimensions = getimagesize($m_image);  
				
				$width = $imageDimensions[0];		
				$height = $imageDimensions[1]; 
				
				$new_height = Helper::setDimension($height);	
				$new_width = Helper::setDimension($width);	   
				
				$image_name2 = time().rand(3, 9).'.'.$m_image->getClientOriginalExtension();   				
				
				$destinationPath1 = public_path().'/uploads/mother_image/';  		
				$destinationPath2 = public_path().'/uploads/mother_image/thumbnail/';  

				$m_image->move($destinationPath1,$image_name2);  	

				$imgFile->resize($new_height,$new_width, function ($constraint) {	  	
					$constraint->aspectRatio();   
				})->save($destinationPath2.$image_name2);	
				
			} 	
			
			if($tab=='personal_detail')	
			{    
				if($insert_id)
				{  					
					$update_arr=array(		
						'student_name'=>$request->student_name,		
						'dob'=>$request->dob,
						'gender'=>$request->gender,
						'nationality'=>$request->nationality,
						'caste'=>$request->caste,
						'religion'=>$request->religion,
						'mobile'=>$request->mobile,
						'email'=>$request->email,
						'blood_group'=>$request->blood_group,
						'aadhar_no'=>$request->aadhar_no,
						'permanent_address'=>$request->permanent_address,    
						'temporary_address'=>($request->temporary_address)?$request->temporary_address:'',  
						'branch_address'=>($request->branch_address)?$request->branch_address:'',      	
						'state_id'=>$request->state_id,
						'district_id'=>$request->district_id,			
						'pincode'=>$request->pincode, 
						'student_image'=>($image_name=='')?$info[0]->student_image:$image_name,  
						'account_no'=>empty($request->account_no)?'':$request->account_no,   
						'ifsc_no'=>empty($request->ifsc)?'':$request->ifsc,    
						'marital_status'=>empty($request->marital_status)?'':$request->marital_status,   	
					);	
					
					$update=StudentRegister::where('id',$insert_id)->update($update_arr); 	
					$id_arr['insert_id']=$insert_id;			
		  
					if($update)		
					{	
						$message="student details updated successfully";   
						$response_arr=array("status"=>'successed',"success"=>true,"errors"=>[],"message"=>$message,"data" =>$id_arr);	
					}
					else
					{
						$message="could not saved!!";  
						$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);	
					}				
					
				}
				else
				{  
					$insert_arr=array(
						'student_name'=>$request->student_name,				  
						'dob'=>$request->dob,		
						'gender'=>$request->gender,
						'nationality'=>$request->nationality,		
						'caste'=>$request->caste,
						'religion'=>$request->religion,
						'mobile'=>$request->mobile,
						'email'=>$request->email,
						'blood_group'=>$request->blood_group,
						'aadhar_no'=>$request->aadhar_no,
						'permanent_address'=>$request->permanent_address, 
						'temporary_address'=>empty($request->temporary_address)?'':$request->temporary_address,   
						'branch_address'=>empty($request->branch_address)?'':$request->branch_address, 
						'account_no'=>empty($request->account_no)?'':$request->account_no,   
						'ifsc_no'=>empty($request->ifsc)?'':$request->ifsc,    
						'marital_status'=>empty($request->marital_status)?'':$request->marital_status,	
						'state_id'=>$request->state_id,   
						'district_id'=>$request->district_id,		
						'pincode'=>$request->pincode, 
						'student_image'=>$image_name,  						
						       							
					);	
					
					$register = StudentRegister::create($insert_arr);   
					
					if($register->id)		
					{	
						$id_arr['insert_id']=$register->id;  	
						
						$message="student details saved successfully";   
						$response_arr=array("status"=>'successed',"success"=>true,"errors"=>[],"message"=>$message,"data" =>$id_arr);	 							
					}
					else
					{
						$message="could not saved!!";  
						$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);	
					}
					
				}	
			}
			else if($tab=='parents_detail')	
			{ 	 								
				if($insert_id)
				{
					$parent_type=empty($request->parent_type)?$info[0]->parent_type:$request->parent_type;		
					$sibling_admission_no = ($parent_type=='new')?"":((empty($request->sibling_admission_no))?"":$request->sibling_admission_no);  
					$sibling_no = ($parent_type=='new')?"":((empty($request->sibling_no))?"":$request->sibling_no);  
					
					$update_arr=array(	
						'parent_type'=>$parent_type,     
						'sibling_admission_no'=>$sibling_admission_no,  		
						'sibling_no'=>$sibling_no,     
						'father_name'=>empty($request->father_name)?$info[0]->father_name:$request->father_name,  		 
						'mother_name'=>empty($request->mother_name)?$info[0]->mother_name:$request->mother_name, 	
						'f_occupation'=>empty($request->f_occupation)?'':$request->f_occupation,   
						'f_income'=>empty($request->f_income)?'':$request->f_income,   
						'f_designation'=>empty($request->f_designation)?'':$request->f_designation,   		
						'f_mobile'=>empty($request->f_mobile)?'':$request->f_mobile,   
						'f_email'=>empty($request->f_email)?'':$request->f_email,   
						'residence_no'=>empty($request->residence_no)?'':$request->residence_no,    	  	
						'father_image'=>($image_name1=='')?$info[0]->father_image:$image_name1,     
						'mother_image'=>($image_name2=='')?$info[0]->mother_image:$image_name2    
					);	
					
					$update=StudentRegister::where('id',$insert_id)->update($update_arr);
					$id_arr['insert_id']=$insert_id;    					
					
					if($update)		
					{  							
						$message="student details updated successfully";   
						$checkCredit = ParentLogin::selectRaw('count(*) as row_count') 
									 ->where('s_id',$insert_id) 									 
									 ->get();
									 
						if($checkCredit[0]->row_count>0)			 
						{
							$parent_credential=array(
								'mobile_no'=>$request->f_mobile,
								'password' => Hash::make($request->mobile_no)    
							);	
						
							$credential=ParentLogin::where('s_id',$insert_id)->update($parent_credential);   	
						}
						else
						{
							$parent_credential=array(
								's_id'=>$insert_id, 
								'mobile_no'=>$request->f_mobile,			
								'password' => Hash::make($request->mobile_no)    
							);	
						
							ParentLogin::create($parent_credential);  	
						}			 
						
						$response_arr=array("status"=>'successed',"success"=>true,"errors"=>[],"message"=>$message,"data" =>$id_arr);	
					}
					else
					{
						$message="could not saved!!";  
						$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);	
					}				
					//
				}
				else
				{
					$parent_type=empty($request->parent_type)?'':$request->parent_type;  					
					$sibling_admission_no = ($parent_type=='new')?"":((empty($request->sibling_admission_no))?"":$request->sibling_admission_no);  
					$sibling_no = ($parent_type=='new')?"":((empty($request->sibling_no))?"":$request->sibling_no);  	
	
					$insert_arr=array(
						'parent_type'=>$parent_type,     					
						'sibling_admission_no'=>$sibling_admission_no,				
						'sibling_no'=>$sibling_no,        
						'father_name'=>empty($request->father_name)?'':$request->father_name,  
						'mother_name'=>empty($request->mother_name)?'':$request->mother_name, 	
						'f_occupation'=>empty($request->f_occupation)?'':$request->f_occupation,   
						'f_income'=>empty($request->f_income)?0:$request->f_income,   
						'f_designation'=>empty($request->f_designation)?'':$request->f_designation,   
						'f_mobile'=>empty($request->f_mobile)?'':$request->f_mobile,   
						'f_email'=>empty($request->f_email)?'':$request->f_email,   
						'residence_no'=>empty($request->residence_no)?'':$request->residence_no, 	
						'father_image'=>$image_name1,     
						'mother_image'=>$image_name2,     
					);								  	
					
					$register = StudentRegister::create($insert_arr);  
					
					if($register->id)		
					{
						$id_arr['insert_id']=$register->id;    						

						$parent_credential=array(
							's_id'=>$register->id,		
							'mobile_no'=>$request->f_mobile,
							'password' => Hash::make($request->mobile_no)    
						);	
						
						$credential = ParentLogin::create($parent_credential);	

						if($credential->id)	
						{
							$message="student details saved successfully and parent login password generated.";   
						}
						else
						{
							$message="student details saved successfully";   
						}
						 
						$response_arr=array("status"=>'successed',"success"=>true,"errors"=>[],"message"=>$message,"data" =>$id_arr);
					}
					else
					{
						$message="could not saved!!";  
						$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);	
					}
					
				}
			}
			else if($tab=='registration_detail')	   
			{    
				if($insert_id)
				{  
					$update_arr=array(		
						'registration_no'=>$request->regis_no,    					
						'registration_date'=>$request->regis_date,	 						
						'interview_date'=>$request->doi,
						'fee'=>$request->regis_fee,		
						'class_id'=>$request->class_id,
						'course_id'=>$request->course_id,
						'station_id'=>$request->station_id,		   
					);	
					
					$update=StudentRegister::where('id',$insert_id)->update($update_arr); 	
					$id_arr['insert_id']=$insert_id;		

					if($update)		
					{	
						$message="Sudent details updated successfully";   
						$response_arr=array("status"=>'successed',"success"=>true,"errors"=>[],"message"=>$message,"data" =>$id_arr);	
					}
					else   
					{
						$message="could not saved!!";  
						$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);	
					}				
					//
				}
				else
				{ 					
					$insert_arr=array(
						'registration_no'=>$request->regis_no,    					
						'registration_date'=>$request->regis_date,	 						
						'interview_date'=>$request->doi,
						'fee'=>$request->regis_fee,		
						'class_id'=>$request->class_id,
						'course_id'=>$request->course_id,
						'station_id'=>$request->station_id,		   
					);	  			
					
					$register = StudentRegister::create($insert_arr);  
					if($register->id)		
					{
						$id_arr['insert_id']=$register->id;  
						$message="Student details saved successfully";   		
						$response_arr=array("status"=>'successed',"success"=>true,"errors"=>[],"message"=>$message,"data" =>$id_arr);	  					
					}
					else
					{
						$message="could not saved!!";  
						$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);	
					}
					
				}  				
				
			}  			
			else
			{
				$message="could not saved!!";  
				$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);	

			}   	
      		
		}	 	

		return response()->json($response_arr);	 	  			
		
	}
	
	public function getRegistration()		
	{
		$registration=StudentRegister::selectRaw("ifnull(max(id),0)+1 as regis_no")->get();		
		return response()->json(["status" => "successed", "success" => true,"data" => $registration]);	
	}
	
	public function getClassFee($id)		
	{
		$classfee=Course::leftJoin('registration_fees as rf', 'course_master.courseId', '=', 'rf.course_id')
				->leftJoin('class_master as cm', 'course_master.courseId', '=', 'cm.courseId')	
                ->selectRaw("group_concat(cm.classId) as id_list,group_concat(cm.className) as name_list,ifnull(rf.amount,0) as amount")		
                ->where('course_master.courseId',$id)		
                ->groupBy('course_master.courseId')
                ->get();	
				
		return response()->json(["status" => "successed", "success" => true,"data" => $classfee]);	
	}
	
	public function edit($id)		
	{
		$record = StudentRegister::where('student_registration.id',$id)->get();   

		if(count($record) > 0) 		
		{  					
			$classlist=Classic::where('courseId',$record[0]->course_id)->get();  	
			$districts=District::where('state_id',$record[0]->state_id)->get();   			

			$registration_data=array('data'=>$record,'classess'=>$classlist,'districts'=>$districts);  		
				
			$response_arr = array("status" => "successed", "success" => true, "message" => "Registration entry record found","data" =>$registration_data);  					
        }
        else {
			$response_arr = array("status" => "failed", "success" => false, "message" => "Whoops! no record found","data" =>[]);	         		
        }			

		return response()->json($response_arr);					
	}
	
	public function update(Request $request,$id)	
	{
		$info = StudentRegister::where('id',$id)->get();   

		if(count($info) > 0) 		
		{  				
			$inputs=$request->all();    
			
			$tab=$request->tab;
			$action=$request->action;	
			$image_rule = $image_rule1= $image_rule2="";				
			$image_name = $image_name1= $image_name2="";  
			$email_rule="";  	
						
			if($tab=='personal_detail')	
			{
				$email_rule=($request->email==$info[0]->email)?'required|max:255':'required|unique:student_registration|max:255';     
				
				if($request->file('student_image')!=null)
				{				
					$image_rule = 'required|image|mimes:jpeg,png,jpg|max:5120';							
				}			
				
				$rules=[            	 			 				
					'student_image' => $image_rule,		  	
					'student_name' => 'required',   
					'dob' => 'required',   	
					'gender' => 'required',   
					'nationality' => 'required', 
					'marital_status'=>'required|not_in:0',     
					'account_no' => 'required',  
					'ifsc' => 'required',    
					'branch_address' => 'required',     	
					'caste' => 'required|not_in:0',    
					'religion' => 'required|not_in:0',   	
					'mobile' => 'required',     				
					'email' => $email_rule,  
					'blood_group' => 'required',   
					'aadhar_no' => 'required',   	
					'permanent_address' => 'required',   		
					'state_id' => 'required|not_in:0',   
					'district_id' => 'required|not_in:0',     
					'pincode' => 'required'			  	
				];   
				
				$fields = [  				
					'student_image' => 'Student Image',  
					'student_name' => 'Student Name',     	
					'dob' => 'Date of Birth',  
					'gender' => 'Gender', 
					'nationality' => 'Nationality', 				 
					'marital_status' => 'Maritial Status', 
					'account_no' => 'Account No.',    
					'ifsc' => 'IFSC Code',    
					'branch_address' => 'Branch Address',     	
					'caste' => 'Caste',   
					'religion' => 'Religion',   	
					'mobile' => 'Mobile No.',   
					'email' => 'Email',
					'blood_group' => 'Blood Group',   
					'aadhar_no' => 'Aadhar No.',   	
					'permanent_address' => 'Permanent Address',   		
					'state_id' => 'State', 
					'district_id' => 'District',   	
					'pincode' => 'Pincode'	       	
				]; 

				$messages = [
					'required' => 'The :attribute field is required.',    
				];  	
			}
			else if($tab=='parents_detail')	
			{		
				$parent_type=empty($request->parent_type)?'':$request->parent_type;   
				$parent_rule=($parent_type=='new')?'':'required';   			  
				
				if($request->file('father_image')!=null)
				{				
					$image_rule1 = 'required|image|mimes:jpeg,png,jpg|max:5120';					
				}
				
				if($request->file('mother_image')!=null)
				{				
					$image_rule2 = 'required|image|mimes:jpeg,png,jpg|max:5120';							
				}
				
				$mobile_rule=($request->f_mobile==$info[0]->f_mobile)?'required|max:25':'required|unique:student_registration|max:25';  
				
				$rules=[
					'parent_type' => 'required',
					'sibling_admission_no' => $parent_rule,	  	
					'sibling_no' => $parent_rule,	    
					'father_image' => $image_rule1,			  	
					'mother_image' => $image_rule2,		  	
					'father_name' => 'required',
					'mother_name' => 'required',  
					'f_occupation' => 'required',
					'f_income' => 'required', 
					'f_designation' => 'required',	
					'f_mobile' => $mobile_rule,  		
					'f_email' => 'required',	   	 				
					'images.*' => 'required|image|mimes:jpeg,png,jpg|max:2048'			
				];   
				
				$messages = [
					'required' => 'The :attribute field is required.',  
				];  
				
				$fields = [   
					'parent_type' => 'Parent Type',        	
					'sibling_admission_no' => 'Sibling Admission No.',  
					'sibling_no' => 'Sibling Child',   
					'father_image' => 'Father Image',   
					'mother_image' => 'Mother Image',   
					'father_name' => 'Father Name',		
					'mother_name' => 'Mother Name',  
					'f_occupation' => "Father's Occupation",	
					'f_income' => "Father's Annual Income", 
					'f_designation' => 'Designation',
					'f_mobile' => 'Mobile No (For SMS)',  
					'f_email' => 'E-Mail ID',   
				];  
			}
			else if($tab=='registration_detail')	  
			{
				$regis_rule=($request->regis_no==$info[0]->registration_no)?'required|max:255':'required|unique:student_registration,registration_no';        
				
				$rules=[            	 			 				
					'regis_no' => $regis_rule,	 					
					'regis_date' => 'required|date',	
					'doi' => 'required|date',	
					'regis_fee' => 'required',  
					'station_id' => 'required|not_in:0',   			
					'class_id' => 'required|not_in:0',   
					'course_id' => 'required|not_in:0',       
				];   
				
				$fields = [  									  	
					'regis_no' => 'Registration No.',       
					'regis_date' => 'Registration Date',	      	
					'doi' => 'Date of Interview',    
					'regis_fee' => 'Registration Fee',       			
					'class_id' => 'Class Name',	 
					'course_id' => 'Course Name',	 	
					'station_id' => 'Station Name',	 
				]; 
				
				$messages = [
					'required' => 'The :attribute field is required.',    				
				];  	 
			}  		
			else
			{
				$rules=[              	 			
					'images' => 'required',
					'images.*' => 'required|image|mimes:jpeg,png,jpg|max:2048'			
				];   
				
				$messages = [
					'required' => 'The :attribute field is required.',  
				];  
				
				$fields = [
					'images' => 'Student Photo Image'   
				];  
			}  	

			$validator = Validator::make($inputs,$rules,$messages,$fields);   		    		

			if ($validator->fails()) {  	
				$errors=$validator->errors();      			  
				$response_arr=array("status"=>"failed","success"=>false,"message"=>"Please fill required fields!!","errors"=>$errors);   
			}  		
			else
			{	
				if($request->hasFile('student_image'))   
				{  
					$image  = $request->file('student_image'); 
					
					/* $height = Image::make($image)->height();		
					$width = Image::make($image)->width();    */
					
					$imageDimensions = getimagesize($image);  
					
					$width = $imageDimensions[0];		
					$height = $imageDimensions[1]; 

					$new_height = Helper::setDimension($height);	
					$new_width = Helper::setDimension($width);	 				  
					
					$image_name = time().rand(3, 9).'.'.$image->getClientOriginalExtension();  
					$imgFile = Image::make($image->getRealPath());  
					
					$destinationPath1 = public_path().'/uploads/student_image/';  		
					$destinationPath2 = public_path().'/uploads/student_image/thumbnail/';  
					
					$image->move($destinationPath1,$image_name);  	
					
					$imgFile->resize($new_height,$new_width, function ($constraint) {	  	
						$constraint->aspectRatio();   
					})->save($destinationPath2.$image_name);						
									
				}  

				if($request->hasFile('father_image'))   
				{   					
					$f_image  = $request->file('father_image'); 
					$imgFile = Image::make($f_image->getRealPath());    	
					$imageDimensions = getimagesize($f_image);  
					
					$width = $imageDimensions[0];		
					$height = $imageDimensions[1]; 

					$new_height = Helper::setDimension($height);	
					$new_width = Helper::setDimension($width);	
					
					$image_name1 = time().rand(3, 9).'.'.$f_image->getClientOriginalExtension();    				

					$destinationPath1 = public_path().'/uploads/father_image/';  		
					$destinationPath2 = public_path().'/uploads/father_image/thumbnail/';  

					$f_image->move($destinationPath1,$image_name1);  	

					$imgFile->resize($new_height,$new_width, function ($constraint) {	  	
						$constraint->aspectRatio();   
					})->save($destinationPath2.$image_name1);	
					
				}    		
				if($request->hasFile('mother_image'))   
				{   					
					$m_image = $request->file('mother_image');     	
					$imgFile = Image::make($m_image->getRealPath());    	
					$imageDimensions = getimagesize($m_image);  
					
					$width = $imageDimensions[0];		
					$height = $imageDimensions[1]; 
					
					$new_height = Helper::setDimension($height);	
					$new_width = Helper::setDimension($width);	   
					
					$image_name2 = time().rand(3, 9).'.'.$m_image->getClientOriginalExtension();   				
					
					$destinationPath1 = public_path().'/uploads/mother_image/';  		
					$destinationPath2 = public_path().'/uploads/mother_image/thumbnail/';  

					$m_image->move($destinationPath1,$image_name2);  	

					$imgFile->resize($new_height,$new_width, function ($constraint) {	  	
						$constraint->aspectRatio();   
					})->save($destinationPath2.$image_name2);	
					
				} 

				$school=School::where('school_code','S110')->get();    
				$fiscal_yr=Helper::getFiscalYear(date('m'));  
				$fiscal_arr=explode(':',$fiscal_yr);	
				$fiscalYear=SessionMaster::where('session_start',$fiscal_arr[0])->where('session_end',$fiscal_arr[1])->get();
				$fiscal_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0; 	
				
				if($tab=='personal_detail')	
				{  
					$update_arr=array(		
						'student_name'=>$request->student_name,		
						'dob'=>$request->dob,
						'gender'=>$request->gender,
						'nationality'=>$request->nationality,
						'caste'=>$request->caste,
						'religion'=>$request->religion,
						'mobile'=>$request->mobile,
						'email'=>$request->email,
						'blood_group'=>$request->blood_group,
						'aadhar_no'=>$request->aadhar_no,
						'permanent_address'=>$request->permanent_address,    
						'temporary_address'=>($request->temporary_address)?$request->temporary_address:'',  
						'branch_address'=>($request->branch_address)?$request->branch_address:'',      	
						'state_id'=>$request->state_id,
						'district_id'=>$request->district_id,			
						'pincode'=>$request->pincode, 
						'student_image'=>($image_name=='')?$info[0]->student_image:$image_name,  
						'account_no'=>empty($request->account_no)?'':$request->account_no,   
						'ifsc_no'=>empty($request->ifsc)?'':$request->ifsc,    
						'marital_status'=>empty($request->marital_status)?'':$request->marital_status,   	
					);	
					
					$update=StudentRegister::where('id',$id)->update($update_arr); 		
			
					if($update)		
					{
						$message="Registration details updated.";   	  	
						$response_arr=array("status"=>'successed',"success"=>true,"errors"=>[],"message"=>$message,"data" =>$update);	  						
					}
					else
					{
						$message="could not updated!!";  
						$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);	
					}		 						
						
				}
				else if($tab=='parents_detail')			
				{ 	 								
						$parent_type=empty($request->parent_type)?$info[0]->parent_type:$request->parent_type;		
						$sibling_admission_no = ($parent_type=='new')?"":((empty($request->sibling_admission_no))?"":$request->sibling_admission_no);  
						$sibling_no = ($parent_type=='new')?"":((empty($request->sibling_no))?"":$request->sibling_no);  
						
						$update_arr=array(	
							'parent_type'=>$parent_type,     
							'sibling_admission_no'=>$sibling_admission_no,  		
							'sibling_no'=>$sibling_no,     
							'father_name'=>empty($request->father_name)?$info[0]->father_name:$request->father_name,  		 
							'mother_name'=>empty($request->mother_name)?$info[0]->mother_name:$request->mother_name, 	
							'f_occupation'=>empty($request->f_occupation)?'':$request->f_occupation,   
							'f_income'=>empty($request->f_income)?'':$request->f_income,   
							'f_designation'=>empty($request->f_designation)?'':$request->f_designation,   		
							'f_mobile'=>empty($request->f_mobile)?'':$request->f_mobile,   
							'f_email'=>empty($request->f_email)?'':$request->f_email,   
							'residence_no'=>empty($request->residence_no)?'':$request->residence_no,    	  	
							'father_image'=>($image_name1=='')?$info[0]->father_image:$image_name1,     
							'mother_image'=>($image_name2=='')?$info[0]->mother_image:$image_name2    
						);	
						
						$update=StudentRegister::where('id',$id)->update($update_arr);   									
						
						if($update)		
						{  							
							$message="Registration details updated.";           
							$checkCredit = ParentLogin::selectRaw('count(*) as row_count') 
										 ->where('s_id',$id) 									 
										 ->get();		
										 
							if($checkCredit[0]->row_count>0)			 
							{
								$parent_credential=array(
									'mobile_no'=>$request->f_mobile,
									'password' => Hash::make($request->mobile_no)    
								);	
							
								$credential=ParentLogin::where('s_id',$id)->update($parent_credential);   	
							}
							else
							{
								$parent_credential=array(
									's_id'=>$id, 
									'mobile_no'=>$request->f_mobile,			
									'password' => Hash::make($request->mobile_no)    
								);	
							
								ParentLogin::create($parent_credential);  	
							}			 
							
							$response_arr=array("status"=>'successed',"success"=>true,"errors"=>[],"message"=>$message,"data" =>$update);	
						}
						else
						{
							$message="could not saved!!";  
							$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);	
						}				
				}
				else if($tab=='registration_detail')	   
				{    					  
					$update_arr=array(		
						'registration_no'=>$request->regis_no,    					
						'registration_date'=>$request->regis_date,	 						
						'interview_date'=>$request->doi,
						'fee'=>$request->regis_fee,		
						'class_id'=>$request->class_id,
						'course_id'=>$request->course_id,
						'station_id'=>$request->station_id,		   
					);	
					
					$update=StudentRegister::where('id',$id)->update($update_arr); 	

					if($update)		
					{						
						$message="Registration details updated.";      
						$response_arr=array("status"=>'successed',"success"=>true,"errors"=>[],"message"=>$message,"data" =>$update);	
					}
					else   
					{ 
						$message="could not updated!!";         
						$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);	
					}	 		
					
				}  			
				else
				{
					$message="could not updated!!";  				
					$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);	

				}  
			}		
        }
        else {
			$response_arr = array("status" => "failed", "success" => false, "message" => "Whoops! no record found","data" =>[]);	         		
        }			

		return response()->json($response_arr);										
	}
   public function delete($id)
   {
		$info = StudentRegister::where('id',$id)->get();  		
		
        if(count($info)>0)   				  
		{  
			$del=StudentRegister::where('id',$id)->delete();	 				 		  
			if($del)
			{
				return response()->json(["status" =>'successed', "success" => true, "message" => "Registration entry record deleted successfully","data" =>'']);   		
			}
			else
			{
				return response()->json(["status" =>'failed', "success" => false, "message" => "could not deleted !!","data" =>[]]);    			
			}  			
		}
		else
		{
			return response()->json(["status" => "failed","success" => false,"message" => "Whoops! failed to delete,!!","errors" =>'']); 	
		} 		 
		
    }

	public function printReg($id)		
	{
		$info = StudentRegister::leftJoin('class_master as cm','student_registration.class_id','=','cm.classId')
				->leftJoin('station_master as sm','student_registration.station_id','=','sm.stationId') 				
				->select(DB::raw('count(*) as row_count'))
				->where('student_registration.id',$id)
				->get();   

		if($info[0]->row_count > 0) 		
		{
			$school=School::where('school_code','S110')->get();   			
			$registration=StudentRegister::leftJoin('class_master as cm','student_registration.class_id','=','cm.classId')
				->leftJoin('station_master as sm','student_registration.station_id','=','sm.stationId')
				->selectRaw("student_registration.*,cm.className,ifnull(sm.stationName,'') as stationName")		
				->where('student_registration.id',$id)		
				->get();  	
				
			$page_data = array('school'=>$school,'registration'=>$registration); 						
			$slip_name=time().rand(1,99).'.'.'pdf';  	

			$pdf = PDF::loadView("registration_slip",$page_data)->save(public_path("registrations/$slip_name"));

			$message="Registration print generated.";    
			$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data" =>$slip_name);	 			
        }
        else {
			$response_arr = array("status" => "failed", "success" => false, "message" => "Whoops! no record found","data" =>[]);	         		
        }			

		return response()->json($response_arr);		
	}

	public function export(Request $request) 
	{
		$classid=empty($request->class_id)?'':$request->class_id;			
		$courseid=empty($request->course_id)?'':$request->course_id;  
		$amount=empty($request->amount)?'':$request->amount;
		$search=empty($request->search)?'':$request->search;    
		
		$file_name = 'registrations_'.date('Y_m_d_H_i_s').'.xlsx';          
		$export=Excel::store(new RegistrationExport($classid,$courseid,$amount,$search),$file_name,'custom_upload');   	
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
	
	public function getNew(Request $request) 		
	{
		$search = $request->search;			
		$limit = $request->limit;
		$page = $request->page;
		$order = $request->order;
		$order_by = $request->orderBy;
		
		$offset = ($page-1)*$limit;   			
		
		$query = StudentRegister::leftJoin('course_master as cm', 'student_registration.course_id', '=', 'cm.courseId') 	    ->leftJoin('station_master as sm','student_registration.station_id','=','sm.stationId')
				 ->leftJoin('student_master as sd','student_registration.id','=','sd.registration_id')
				 ->select(DB::raw('count(*) as row_count'));	
		
		if($search !='')	
		{  
			$query->where(function($q) use ($search) {
				 $q->where('student_registration.student_name', 'like', '%'.$search.'%')  				   
				   ->orWhere('cm.courseName', 'like', '%'.$search.'%')
				   ->orWhere('sm.stationName', 'like', '%'.$search.'%');		
			 });   
		}
			 
		$records = $query->whereNull('sd.registration_id')->get();				
		
		$student_query = StudentRegister::leftJoin('class_master as cs','student_registration.class_id','=','cs.classId')
						->leftJoin('course_master as cm', 'student_registration.course_id', '=', 'cm.courseId') 		
						->leftJoin('station_master as sm','student_registration.station_id','=','sm.stationId')
						->leftJoin('student_master as sd','student_registration.id','=','sd.registration_id')  
						->selectRaw("student_registration.id,student_registration.student_name,student_registration.mobile,student_registration.father_name,student_registration.email,student_registration.fee,cm.courseName,ifnull(sm.stationName,'') as stationName")	
						->offset($offset)->limit($limit);  			
					
		
		if($search !='')	
		{  
			$student_query->where(function($q) use ($search) {
				 $q->where('student_registration.student_name', 'like', '%'.$search.'%')  				   	   	
				   ->orWhere('cm.courseName', 'like', '%'.$search.'%')
				   ->orWhere('sm.stationName', 'like', '%'.$search.'%');		
			 });   
		}
		
		if($order_by !='')	
		{
			$student_query->orderBy($order_by,$order); 				
		}	
		
		$registrations = $student_query->groupBy('student_registration.id')->whereNull('sd.registration_id')->get();	
		 		
        if(count($registrations) > 0) 
		{
			$response_arr = array('data'=>$registrations,'total'=>$records[0]->row_count);			
            return response()->json(["status" => "successed", "success" => true,"data" => $response_arr]);	
        }
        else {
			$response_arr = array('data'=>[],'total'=>0,'query'=>$request->all());	
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found","data" => $response_arr]);		
        }	
		
    }
    
}