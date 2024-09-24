<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;	
use Illuminate\Support\Facades\DB;

use App\Models\RegistrationFee;		
use App\Models\StudentRegister;		

class RegistrationFeeController extends Controller		
{
	public function __construct()
    {
        
    }
    public function index(Request $request) 
    {	
		$search = $request->search;			
		$limit = $request->limit;
		$page = $request->page;
		$order = $request->order;
		$order_by = $request->orderBy;
		
		$offset = ($page-1)*$limit;   
		
		$query = RegistrationFee::leftJoin('course_master as cm', 'registration_fees.course_id', '=', 'cm.courseId')
		->select(DB::raw('count(*) as row_count'));	
		if($search !='')	
		{
			$query->where('cm.courseName', 'like', '%'.$search.'%')					
				   ->orWhere('registration_fees.amount', 'like', '%'.$search.'%');				
		}
			 
		$records = $query->get();  	 
		
		$fees_query = RegistrationFee::leftJoin('course_master as cm', 'registration_fees.course_id', '=', 'cm.courseId')
		->select('registration_fees.id','registration_fees.amount','cm.courseName')->offset($offset)->limit($limit);  
		if($search !='')	
		{
			$fees_query->where('cm.courseName', 'like', '%'.$search.'%')					
				   ->orWhere('registration_fees.amount', 'like', '%'.$search.'%');						
		}
		if($order_by !='')	
		{
			$fees_query->orderBy($order_by,$order); 				
		}	
		
		$fees = $fees_query->get();  
 		
        if(count($fees) > 0) 
		{
			$response_arr = array('data'=>$fees,'total'=>$records[0]->row_count);	
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
		
		$rules=[            	 			 				
				'course_id' => 'required|unique:registration_fees',	
				'fee_amount' => 'required'  		  	
			];   
			
			$fields = [  									  	
				'course_id' => 'Course Name',       
				'fee_amount' => 'Amount'	      	
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
			$insert_arr = array(  				 	
				'course_id' => $request->course_id,   	 			            
				'amount' => $request->fee_amount 				 	   
			);
			
			$fee = RegistrationFee::create($insert_arr);				
			
			if($fee->id)		
			{	
				$message="New registration fee created successfully";    
				$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data" =>$fee);	
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
		$info = RegistrationFee::where('id',$id)->get();   
		
		if(count($info)>0)   
		{			
			return response()->json(["status" =>'successed', "success" => true, "message" => "Registration fee record found","data" => $info]);     			
		}
		else
		{
			return response()->json(["status" => "failed","success" => false,"message" => "Whoops! no record found!!","errors" =>'',"data" =>[]]); 	
		} 	

   }	
   public function update(Request $request,$id)		
   {	
		$inputs=$request->all();  
		$info = RegistrationFee::where('id',$id)->get();   
		
		if(count($info)>0)   
		{
			$courseid = empty($request->course_id)?0:$request->course_id;  			
			$course_rule=($courseid==$info[0]->course_id)?'required|not_in:0':'required|unique:registration_fees|not_in:0'; 		
			$rules=[            	 			 				
				'course_id' => $course_rule,		
				'fee_amount' => 'required'    	
			];   
			
			$fields = [  									  	
				'course_id' => 'Course Name',       
				'fee_amount' => 'Amount'	  	
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
				$update_arr = array(  				 	
					'course_id' => $request->course_id,   	 			            
					'amount' => $request->fee_amount 				 	   
				);
				
				$update=RegistrationFee::where('id',$id)->update($update_arr);   		
					
				if($update)		
				{  							
					$message="Registration fee record updated successfully";     
					$response_arr=array("status"=>'successed',"success"=>true,"errors"=>[],"message"=>$message,"data" =>$update);	
				}
				else
				{
					$message="could not update!!";  
					$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);	
				}		
				
			}			
			//    			
		}
		else
		{
			$response_arr=array("status" => "failed","success" => false,"message" => "Whoops! no record found!!","errors" =>'',"data" =>[]);  
		} 		
		
		return response()->json($response_arr);	
   }
   public function delete($id)
   {
		$info = RegistrationFee::where('id',$id)->get();  	
		
        if(count($info)>0)   				  
		{
			$students=StudentRegister::where('course_id',$info[0]->course_id)->get();  	
			if(count($students)>0)   	
			{
				return response()->json(["status" =>'failed', "success" => false, "message" => "could not deleted, students having registration fee !!","data" => []]);   		
			}
			else
			{
				$del=RegistrationFee::where('id',$id)->delete();	 				 		  
				if($del)
				{
					return response()->json(["status" =>'successed', "success" => true, "message" => "exam record deleted successfully","data" => '']);   		
				}
				else
				{
					return response()->json(["status" =>'failed', "success" => false, "message" => "could not deleted !!","data" => []]);    			
				}  		
			}
				
		}
		else
		{
			return response()->json(["status" => "failed","success" => false,"message" => "Whoops! failed to delete,!!","errors" =>'']); 	
		} 		 
		
    }	

}
