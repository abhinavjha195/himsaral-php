<?php

namespace App\Http\Controllers;		
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;  
use Illuminate\Http\Request;
use Carbon\Carbon;
use Carbon\CarbonPeriod;	

use App\Models\FineSetting;      
use DB;  

class FineSettingController extends Controller   
{
	public function __construct()
    {
        DB::statement("SET SQL_MODE=''");   
    }

    public function index()   
	{ 
		$setting=FineSetting::all();  	 

        if(!empty($setting)) {   
			return response()->json(["status" => 'successed',"data" => $setting]);	  	
		}
		else {
			return response()->json(["status" => "failed","message" => "Whoops! no record found","data" =>[]]);
		}     
		
    }
    
	public function add(Request $request)			
	{
		$inputs=$request->all();
		
		$rules=[            	 			
            'FineType' => 'required',    	
			'DueDate' => 'required',
			'FineAmount' => 'required'   
        ];   
		
		$messages = [
			'required' => 'The :attribute field is required.',  
		];  
		
		$fields = [
			'FineType' => 'Fine Type',  
			'DueDate' => 'Fee Due Date Upto',		
			'FineAmount' => 'Fine Amount'  
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
			$info= FineSetting::all(); 
			$id=$info[0]->id??0; 
			
			if($id)		
			{
				$data_arr = array(  
					'FineType'=>$request->FineType,   
					'DueDate'=>$request->DueDate,   	
					'FineAmount'=>$request->FineAmount        
				);  
				
			   $set = FineSetting::where('id',$id)->update($data_arr);	 
			   $message="Fine setting updated successfully"; 
			   $response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data" =>$set);	
			   
			}
			else
			{
				
				$data_arr = array(  
					'FineType'=>$request->FineType,   
					'DueDate'=>$request->DueDate,   	
					'FineAmount'=>$request->FineAmount        
				);
				
				$set = FineSetting::create($data_arr);
				$message="Fine setting created successfully"; 
				$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data" =>$set);	
				
			} 
			
			return response()->json($response_arr);	     			
      		
		}	 		     
		     
		
	}  	  
   
}  