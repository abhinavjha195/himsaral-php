<?php

namespace App\Http\Controllers;		
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;  
use Illuminate\Http\Request;
use Carbon\Carbon;
use Carbon\CarbonPeriod;		

use App\Models\FeeCategoryMaster;   
use App\Models\StudentMaster; 
use App\Models\SessionMaster;      
use App\Models\FeeAmtSingle;  
use App\Models\FeeAmtMaster;  
use App\Models\FeeAmtDesc;          
use App\Models\FeeAmount;  
use App\Models\FeeSlot;  
use App\Models\Classic;		  
use App\Models\Course;  
use Helper;          
use DB;  

class FeeIndividualController extends Controller		
{
	public function __construct()
    {
        // DB::statement("SET SQL_MODE=''");   
    }	
	
   public function getDetail($search,$school_id)		
   {
		$fiscal_yr=Helper::getFiscalYear(date('m'));  
		$fiscal_arr=explode(':',$fiscal_yr);	
		$fiscalYear=SessionMaster::where('session_start',$fiscal_arr[0])->where('session_end',$fiscal_arr[1])->get();
		$fiscal_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0; 
		
		$info = StudentMaster::leftJoin('course_master as cm','student_master.course_id','=','cm.courseId')  
				->leftJoin('class_master as cl','student_master.class_id','=','cl.classId') 
				->selectRaw("student_master.id,student_master.student_name,student_master.father_name,student_master.admission_no,cm.courseName,cl.className")
				->where('student_master.admission_no',$search)
				->where('student_master.school_id',$school_id)
				->where('student_master.session_id',$fiscal_id)  		  	
				->get();  			
		
		if(count($info)>0){   
			$cat_fee = FeeAmtSingle::where('AdmissionNo',$info[0]->admission_no)->where('SessionId',$fiscal_id)->where('SchoolId',$school_id)->get();         		
			$data=array('student_data'=>$info,'fee_data'=>$cat_fee);  		
			return response()->json(["status" =>'successed', "success" => true, "message" => "fee record found successfully","data" =>$data]);   									
		}     
		else {  			
			return response()->json(["status" => "failed", "message" => "Whoops! record does not exist!!","errors" =>'']); 		
		}  
					
   }
   
   public function create(Request $request)			
   {   
		$inputs=$request->all(); 		
		$categories = $request->fee_cats;     
		$admission_no=($request->admission_no!=null)?$request->admission_no:'';	
		$school_id=($request->school_id!=null)?$request->school_id:'';	  
		$cat_arr=$id_arr=array();  
		
		$fiscal_yr=Helper::getFiscalYear(date('m'));  
		$fiscal_arr=explode(':',$fiscal_yr);	
		$fiscalYear=SessionMaster::where('session_start',$fiscal_arr[0])->where('session_end',$fiscal_arr[1])->get();
		$fiscal_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0; 
		
		foreach($categories AS $k=>$v)
		{
			array_push($cat_arr,$k);  
		}
		
		$checkExist= FeeAmtSingle::select(DB::raw('count(*) as record_count'))
					 ->where('AdmissionNo',$admission_no)   						  					 
					 ->where('SessionId',$fiscal_id) 
					 ->where('SchoolId',$school_id)  	
					 ->get();   

		$rules=[            	 			
            'admission_no' => 'required'    
        ];   
		
		$messages = [
			'required' => 'The :attribute field is required.',  
		];  
		
		$fields = [
			'admission_no' => 'Admission Number'  
		];  
		
		$validator = Validator::make($inputs, $rules, $messages, $fields);       		
		
        if ($validator->fails()) {  	
			$message='';	
			$errors=$validator->errors();  	
			
			for($i=0;$i<count($errors->all());$i++)  
			{				
				if($i==count($errors->all())-1)
				{
					$message .=$errors->all()[$i];		
				}
				else
				{
					$message .=$errors->all()[$i].",";
				}	 
			}	  			
			
			$response_arr=array("status"=>"failed","message"=>$message);	
            return response()->json($response_arr);		
        } 
		else
		{
			foreach($categories AS $k=>$v)
			{
				$insert_arr[]=array(
					'AdmissionNo'=>$admission_no,
					'FeeCatId'=>$k,  	
					'FeeAmount'=>$v,  
					'SessionId'=>$fiscal_id,
					'SchoolId'=>$school_id  		
				);   	
			}  

			if($checkExist[0]->record_count >0)  
			{
				$fees=FeeAmtSingle::where('AdmissionNo',$admission_no)   						 
					 ->whereIn('FeeCatId',$cat_arr)	
					 ->where('SessionId',$fiscal_id) 
					 ->where('SchoolId',$school_id)  	
					 ->get(); 

				foreach($fees AS $fee)		
				{
					array_push($id_arr,$fee->id);    
				}	 
			}	

			if(count($id_arr)>0)	
			{
				FeeAmtSingle::whereIn('id',$id_arr)->delete(); 		
			}
			
			$amnt = FeeAmtSingle::insert($insert_arr);	  				
			
			if($amnt)	  	
			{	
				$message="Fee individual amount created successfully"; 
				$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data" =>$amnt);	
			}
			else
			{
				$message="could not created!!";  
				$response_arr=array("status"=>'failed',"success"=>false,"message"=>$message,"errors"=>[],"data"=>[]);	
			} 
			
			return response()->json($response_arr);	  		
      		
		}	 		     
		
	}  	  

   public function update(Request $request,$id)		
   {
	    $inputs=$request->all();  
		
		$info = FeeAmtMaster::leftJoin('feeamtdesc','feeamtmaster.FeeAmtId', '=', 'feeamtdesc.FeeAmtId') 					
					->selectRaw("count(*) as row_count,group_concat(distinct feeamtmaster.CourseId) AS course_id,group_concat(distinct feeamtmaster.ClassId) AS class_id,group_concat(feeamtdesc.FeeCatId) cat_list,group_concat(feeamtdesc.FeeAmount) as amount_list")						
					->where('feeamtmaster.FeeAmtId',$id)   
					->get();

		if($info[0]->row_count>0)
		{   
			$courseid=$info[0]->course_id;
			$classid=$info[0]->class_id;	 
			
			$course_id=$request->course_id;
			$class_id=$request->class_id;	
			
			if($course_id !=$courseid || $class_id !=$classid)     
			{
				$checkExist= FeeAmtMaster::select(DB::raw('count(*) as row_count'))	
							 ->where('CourseId',$course_id)   						 
							 ->where('ClassId',$class_id)	
							 ->get(); 				
			}
			else
			{
				$checkExist= FeeAmtMaster::select(DB::raw('count(*) as row_count'))
							 ->where('CourseId',0)   						 
							 ->where('ClassId',0)	     
							 ->get(); 	
			}  
			
			$rules=[            	 			
				'course_id' => 'required|integer|gt:0',		
				'class_id' => 'required|integer|gt:0'  	
			];   

			$messages = [
				'required' => 'The :attribute field is required.',  
			];  

			$fields = [
				'course_id' => 'Course Name',
				'class_id' => 'Class Name'    	
			];  

			$validator = Validator::make($inputs, $rules, $messages, $fields); 
			if ($validator->fails()) {  	
				$message='';	
				$errors=$validator->errors();  	
				
				for($i=0;$i<count($errors->all());$i++)  
				{				
					if($i==count($errors->all())-1)
					{
						$message .=$errors->all()[$i];		
					}
					else
					{
						$message .=$errors->all()[$i].",";
					}	 
				}	  			
				
				$response_arr=array("status"=>"failed","message"=>$message);	
				return response()->json($response_arr);		
			}
			else if($checkExist[0]->row_count >0)  
			{
				return response()->json(["status" =>'failed', "success" => false, "message" => "could not edited,fee amount already exist!!"]);    
			}
			else
			{
				$categories = $request->cat_arr;  
				
				$update_arr = array(  
					'CourseId'=>$course_id,
					'ClassId'=>$class_id,				
				);  
				
				FeeAmtMaster::where('FeeAmtId',$id)->update($update_arr);	
				
				foreach($categories AS $k=>$v)
				{
					$desc_arr[]=array( 
						'FeeAmtId'=>$id,  
						'FeeCatId'=>$k,    
						'FeeAmount'=>is_null($v)?0:$v  
					);
					
				}	
				
				$del=FeeAmtDesc::where('FeeAmtId',$id)->delete();  
				if($del)
				{
					$desc = FeeAmtDesc::insert($desc_arr);	  
					if($desc)				
					{
						return response()->json(["status" =>'successed', "success" => true, "message" => "Fee amount record updated successfully","data" =>$desc]);     		
					}
					else
					{				
						return response()->json(["status" =>'failed', "success" => false, "message" => "could not updated!!","data" =>[]]);  
					}  					
					
				}
								
			}		
		}
		else
		{
			return response()->json(["status" => "failed", "message" => "Whoops! failed to edit, fee amount does not exist!!","errors" =>'']); 	  
			
		}			 
		
   }	
   
}  