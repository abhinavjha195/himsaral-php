<?php

namespace App\Http\Controllers;		
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;  
use Illuminate\Http\Request;
use Carbon\Carbon;
use Carbon\CarbonPeriod;		

use App\Models\FeeConcession;            
use DB;  

class FeeConcessionController extends Controller		
{
	public function __construct()
    {
        // DB::statement("SET SQL_MODE=''");   
    }

    public function index()   
	{ 
		$concessions=FeeConcession::all();   
		if(count($concessions)>0) {   
			return response()->json(["status" => 'successed',"data" => $concessions]);    	  	
		}
		else {
			return response()->json(["status" => "failed","message" => "Whoops! no record found","data" =>[]]);
		}   
		
    }
    
	public function add(Request $request)			
	{
		$inputs=$request->all();
		$concesion=$request->concession;
		
		if($concesion=='sibling') 	  
		{
			$rules=[            	 			
				'type' => 'required',    
				'type2' => 'required', 
				'amount' => 'required',    
				'amount2' => 'required' 
			];   
			
			$messages = [
				'required' => 'The :attribute field is required.',  
			];  
			
			$fields = [
				'type' => 'Concession Type 1', 
				'type2' => 'Concession Type 2',  
				'amount' => '2nd child Concession Amount', 
				'amount2' => '3rd child Concession Amount'  
			];  
		}
		else if($concesion=='staff') 	
		{
			$rules=[            	 			
				'type' => 'required',    
				'type2' => 'required', 
				'amount' => 'required',    
				'amount2' => 'required' 
			];   
			
			$messages = [
				'required' => 'The :attribute field is required.',  
			];  
			
			$fields = [
				'type' => 'Concession Type 1', 
				'type2' => 'Concession Type 2',  
				'amount' => '1st child Concession Amount', 
				'amount2' => '2nd child Concession Amount'  
			];  
		} 		
		else
		{
			$rules=[            	 			
				'type' => 'required',     				
				'amount' => 'required'  				
			];   
			
			$messages = [
				'required' => 'The :attribute field is required.',  
			];  
			
			$fields = [
				'type' => 'Concession Type',  
				'amount' => 'Concession Amount'  
			];  
		}
		
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
			$info= FeeConcession::where('ConcessionName',$concesion)->get(); 
			
			if(count($info)>0)		
			{
				$update_arr =array(   
					'ConcessionType'=>empty($request->type)?'':$request->type,
					'ConcessionType2'=>empty($request->type2)?'':$request->type2,
					'ConcessionAMount'=>empty($request->amount)?0:$request->amount,     
					'ConcessionAMount2'=>empty($request->amount2)?0:$request->amount2,
					'SchoolCode'=>'',     
					'SessionId'=>0 	
				);	
				
				$update=FeeConcession::where('id',$info[0]->id)     
					  ->where('ConcessionName',$concesion)  
					  ->update($update_arr);     
				
				if($update)		
				{	
					$message="Fee concession updated successfully"; 
					$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data" =>$update);	
				}
				else
				{
					$message="could not updated!!";  
					$response_arr=array("status"=>'failed',"success"=>false,"message"=>$message,"errors"=>[],"data"=>[]);	
				} 
				
			}
			else
			{
				$insert_arr =array(
					'ConcessionName'=>$request->concession,		
					'ConcessionType'=>empty($request->type)?'':$request->type,
					'ConcessionType2'=>empty($request->type2)?'':$request->type2,
					'ConcessionAMount'=>empty($request->amount)?0:$request->amount,     
					'ConcessionAMount2'=>empty($request->amount2)?0:$request->amount2,
					'SchoolCode'=>'',     
					'SessionId'=>0 	   
				);
				
				$insert=FeeConcession::create($insert_arr);    
				
				if($insert)		
				{	
					$message="Fee concession created successfully"; 
					$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data" =>$insert);	
				}
				else
				{
					$message="could not created!!";  
					$response_arr=array("status"=>'failed',"success"=>false,"message"=>$message,"errors"=>[],"data"=>[]);	
				} 
				
			}

			return response()->json($response_arr);	 			
      		
		}	 		     
		
	}  	   
	
   
}
