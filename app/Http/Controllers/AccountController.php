<?php
 
namespace App\Http\Controllers;
 
use Illuminate\Http\Request; 
use Illuminate\Support\Facades\Validator;  						
use Illuminate\Support\Facades\DB;   
     
use App\Models\AccountMaster; 
use App\Models\SessionMaster;        	 
use App\Models\MoneyType;        
use Helper;     
 
class AccountController extends Controller						
{  
	public function __construct()
    {
       DB::statement("SET SQL_MODE=''"); 	
    } 

	public function index(Request $request) 		
	{
		$search = empty($request->search)?'':$request->search;			
		$limit = empty($request->limit)?0:$request->limit;  
		$page = empty($request->page)?0:$request->page;	
		$order = empty($request->order)?'':$request->order;
		$order_by = empty($request->orderBy)?'':$request->orderBy;  
		$offset = ($page-1)*$limit;   
		
		$query = AccountMaster::leftJoin('money_types as mt','account_master.type_id','=','mt.id') 
				->selectRaw("count(account_master.id) as row_count");  

		if($search !='')	
		{ 	   
			$query->where(function($q) use ($search) {
				 $q->where('account_master.name', 'like', '%'.$search.'%') 	
				   ->orWhere('account_master.description', 'like', '%'.$search.'%')   	
				   ->orWhere('account_master.remark', 'like', '%'.$search.'%')   
				   ->orWhere('mt.name', 'like', '%'.$search.'%');  				   	
			});   	   				   
		}	
						
		$records = $query->get();  				
	
		$account_query = AccountMaster::leftJoin('money_types as mt','account_master.type_id','=','mt.id')
						->selectRaw("account_master.*,mt.name AS title");		

		if($search !='')	
		{ 
			$account_query->where(function($q) use ($search) {
				 $q->where('account_master.name', 'like', '%'.$search.'%') 	
				   ->orWhere('account_master.description', 'like', '%'.$search.'%')   	
				   ->orWhere('account_master.remark', 'like', '%'.$search.'%')   
				   ->orWhere('mt.name', 'like', '%'.$search.'%');  				   	
			});   	   	   				   
		}
		
		if($order_by !='')	
		{
			$account_query->orderBy($order_by,$order); 				
		}	 
		
		$accounts = $account_query->offset($offset)->limit($limit)->get();   			  	
		  
		if($records[0]->row_count>0) {   
			$response_arr = array('data'=>$accounts,'total'=>$records[0]->row_count);	
            return response()->json(["status" => "successed", "success" => true,"data" => $response_arr]);	  	
		}
		else {
			$response_arr = array('data'=>[],'total'=>0);	
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found","data" => $response_arr]);	
		}    
		
    }	
	
	public function getTypes()		
    {
        $types = MoneyType::all();   		
        if (count($types) > 0) {
            return response()->json(["status" => "successed", "success" => true, "data" => $types]);  
        } else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found"]);
        }
    }	
	
	public function add(Request $request)			
	{
		$inputs=$request->all();				

		$rules=[            	 			
            'type_id' => 'required',
			'income_expense' => 'required|unique:account_master,name|max:255',    
        ];   
		
		$messages = [
			'required' => 'The :attribute field is required.',  
		];  
		
		$fields = [
			'type_id' => 'Specify Type',  
			'income_expense' => 'Name Of Income/Expense',  
		];  
		
		$validator = Validator::make($inputs,$rules,$messages,$fields);       		
		
        if ($validator->fails()) {  	
			$errors=$validator->errors();      			  
			$response_arr=array("status"=>"failed","success"=>false,"message"=>"Please fill required fields!!","errors"=>$errors);   
        } 
		else
		{
			$fiscal_yr=Helper::getFiscalYear(date('m'));  
			$fiscal_arr=explode(':',$fiscal_yr);	
			$fiscalYear=SessionMaster::where('session_start',$fiscal_arr[0])->where('session_end',$fiscal_arr[1])->get();
			$fiscal_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0; 
		
			$insert_arr=array(    
				'name'=>empty($request->income_expense)?'':$request->income_expense,
				'type_id'=>empty($request->type_id)?'':$request->type_id,
				'remark'=>empty($request->remark)?'':$request->remark,	    	
				'description'=>empty($request->description)?'':$request->description,
				'session_id'=>$fiscal_id,				
				'school_id'=>empty($request->school_id)?'':$request->school_id,	 
			);	
			
			$acc=AccountMaster::create($insert_arr);	  		
			
			if($acc)	  	
			{	
				$message="Record added successfully."; 
				$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data" =>$acc);	
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
		$info = AccountMaster::where('account_master.id',$id)->get();			

		if(count($info) > 0)  	
		{ 
			$response_arr = array("status" => "successed", "success" => true, "message" => "Account master record found","data" =>$info);  					
        }
        else {
			$response_arr = array("status" => "failed", "success" => false, "message" => "Whoops! no record found","data" =>[]);	         		
        }			

		return response()->json($response_arr);									
	}
	
	public function update(Request $request,$id)	
	{ 
		$info = AccountMaster::where('account_master.id',$id)->get();			  

		if(count($info) > 0)  	
		{ 	 		 	
			$inputs=$request->all();  			
			
			$title_rule=($request->income_expense==$info[0]->name)?'required|max:255':'required|unique:account_master,name|max:255';  	
			
			$rules=[            	 			
				'type_id' => 'required',
				'income_expense' => $title_rule,    
			];   
			
			$messages = [
				'required' => 'The :attribute field is required.',  
			];  
			
			$fields = [
				'type_id' => 'Specify Type',  
				'income_expense' => 'Name Of Income/Expense',  
			];  
				
			$validator = Validator::make($inputs, $rules, $messages, $fields);   	    		
	 
			if ($validator->fails()) {  	
				$errors=$validator->errors();      			  
				$response_arr=array("status"=>"failed","message"=>"Please fill required fields!!","errors"=>$errors);     
			}
			else
			{	
				$updt_arr = array(               						
					'name'=>empty($request->income_expense)?'':$request->income_expense,
					'type_id'=>empty($request->type_id)?'':$request->type_id,
					'remark'=>empty($request->remark)?'':$request->remark,	    	
					'description'=>empty($request->description)?'':$request->description,  
				);  

				$updt=AccountMaster::where('id',$id)->update($updt_arr); 				
			
				if($updt)		
				{ 
					$message="Account master record updated successfully.";  		
					$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data"=>$updt);		
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
	
	public function delete($id)
    {
		$info = AccountMaster::where('id',$id)->get();		

        if(count($info)>0)
		{
			$del=AccountMaster::where('id',$id)->delete();	
			
			if($del)
			{ 				
				return response()->json(["status" =>'successed', "success" => true, "message" => "account master record deleted successfully","data" => '']);
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