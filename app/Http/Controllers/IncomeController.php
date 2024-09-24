<?php
 
namespace App\Http\Controllers;
 
use Illuminate\Http\Request; 
use Illuminate\Support\Facades\Validator;  						
use Illuminate\Support\Facades\DB;   
     
use App\Models\AccountMaster; 
use App\Models\SessionMaster;        	 
use App\Models\PaymentMode;   
use App\Models\MoneyType;        
use App\Models\Income;     
use Helper;  
use Image;
use PDF;       
 
class IncomeController extends Controller						
{  
	public function __construct()
    {
       DB::statement("SET SQL_MODE=''"); 	
    } 

	public function index(Request $request) 		
	{
		$schoolid = empty($request->school_id)?'':$request->school_id;   
		$search = empty($request->search)?'':$request->search;	  	
		$limit = empty($request->limit)?0:$request->limit;  
		$page = empty($request->page)?0:$request->page;	
		$order = empty($request->order)?'':$request->order;
		$order_by = empty($request->orderBy)?'':$request->orderBy;  
		$offset = ($page-1)*$limit;    		
		
		$fiscal_yr=Helper::getFiscalYear(date('m'));  
		$fiscal_arr=explode(':',$fiscal_yr);	
		$fiscalYear=SessionMaster::where('session_start',$fiscal_arr[0])->where('session_end',$fiscal_arr[1])->get();
		$fiscal_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0;  
		
		$query = Income::leftJoin('account_master as am','incomes.type_id','=','am.id')  
				->leftJoin('payment_modes as pm','incomes.mode_id','=','pm.id')   				 
				->selectRaw("count(incomes.id) as row_count"); 		

		if($search !='')	
		{ 	   
			$query->where(function($q) use ($search) {
				 $q->where('incomes.voucher_no', 'like', '%'.$search.'%') 	 				   	
				   ->orWhere('incomes.receive_from', 'like', '%'.$search.'%')   
				   ->orWhere('pm.pay_mode', 'like', '%'.$search.'%');  				   	
			});   	   				   
		}	
		
		$records = $query->where("incomes.school_id",$schoolid)  
				->where("incomes.session_id",$fiscal_id)	
				->get(); 			
	
		$income_query = Income::leftJoin('account_master as am','incomes.type_id','=','am.id')  
						->leftJoin('payment_modes as pm','incomes.mode_id','=','pm.id')   						   
						->selectRaw("incomes.*,am.name AS title,pm.pay_mode"); 
						
		if($search !='')	
		{ 
			$income_query->where(function($q) use ($search) {
				 $q->where('incomes.voucher_no', 'like', '%'.$search.'%') 	 				   	
				   ->orWhere('incomes.receive_from', 'like', '%'.$search.'%')   
				   ->orWhere('pm.pay_mode', 'like', '%'.$search.'%');  			   	
			});   	   	   				   
		}
		
		if($order_by !='')	
		{
			$income_query->orderBy($order_by,$order); 						
		}	 
		
		$incomes = $income_query->offset($offset)->limit($limit)->where("incomes.school_id",$schoolid)  
					->where("incomes.session_id",$fiscal_id) 						 
					->get();  	 			  	
		  
		if($records[0]->row_count >0) {   
			$response_arr = array('data'=>$incomes,'total'=>$records[0]->row_count);	
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
		$image_rule =($request->file('attachment_image')!=null)?'required|image|mimes:jpeg,png,jpg|max:5120':'';											
		
		$rules=[ 
			'attachment_image' => $image_rule,	
			'voucher_no' =>'required|unique:incomes,voucher_no|max:255', 			
            'type_id' => 'required',
			'mode_id' => 'required', 
			'total_amount' => 'required',
			'receive_from' => 'required',
			'voucher_date' => 'required|date', 	
			'invoice_date' => 'required|date', 	 
        ];   
		
		$messages = [
			'required' => 'The :attribute field is required.',  
		];  
		
		$fields = [
			'attachment_image' => 'Attachment',    
			'type_id' => 'Income Type',  
			'mode_id' => 'Payment Mode',   
			'total_amount' => 'Total Amount',  
			'receive_from' => 'Receive From', 
			'voucher_date' => 'Voucher Date',  
			'invoice_date' => 'Invoice Date',   
		];  
		
		$validator = Validator::make($inputs,$rules,$messages,$fields);       		
		
        if ($validator->fails()) {  	
			$errors=$validator->errors();      			  
			$response_arr=array("status"=>"failed","success"=>false,"message"=>"Please fill required fields!!","errors"=>$errors);   
        } 
		else
		{
			$schoolid=empty($request->school_id)?'':$request->school_id;
			$fiscal_yr=Helper::getFiscalYear(date('m'));  
			$fiscal_arr=explode(':',$fiscal_yr);	
			$fiscalYear=SessionMaster::where('session_start',$fiscal_arr[0])->where('session_end',$fiscal_arr[1])->get();
			$fiscal_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0; 
			$attachment_name=''; 	
			
			if($request->hasFile('attachment_image'))   
			{  
				$image  = $request->file('attachment_image');   
				$imageDimensions = getimagesize($image);  
				
				$width = $imageDimensions[0];		
				$height = $imageDimensions[1]; 

				$new_height = Helper::setDimension($height);	
				$new_width = Helper::setDimension($width);	 				  
				
				$attachment_name = time().rand(3, 9).'.'.$image->getClientOriginalExtension();  
				$imgFile = Image::make($image->getRealPath());  
				
				$destinationPath = public_path().'/uploads/income_image/';  
				
				$imgFile->resize($new_height,$new_width, function ($constraint) {	  	
					$constraint->aspectRatio();   
				})->save($destinationPath.$attachment_name);						
								
			}  
		
			$add_arr=array(   
				'type_id'=>empty($request->type_id)?'':$request->type_id,  
				'mode_id'=>empty($request->mode_id)?'':$request->mode_id,   
				'school_id'=>$schoolid,	     
				'total_amount'=>empty($request->total_amount)?0.0:$request->total_amount, 				
				'invoice_amount'=>empty($request->invoice_amount)?0.0:$request->invoice_amount,	    	
				'receive_from'=>empty($request->receive_from)?'':$request->receive_from,
				'party_name'=>empty($request->party_name)?'':$request->party_name, 				
				'invoice_no'=>empty($request->invoice_no)?'':$request->invoice_no, 				
				'cheque_no'=>empty($request->cheque_no)?'':$request->cheque_no,	
				'voucher_no'=>empty($request->voucher_no)?'':$request->voucher_no,	    
				'party_address'=>empty($request->party_address)?'':$request->party_address,  
				'sender_address'=>empty($request->sender_address)?'':$request->sender_address, 
				'voucher_date'=>empty($request->voucher_date)?'':$request->voucher_date, 				
				'invoice_date'=>empty($request->invoice_date)?'':$request->invoice_date,	  	
				'transection_purpose'=>empty($request->transection_purpose)?'':$request->transection_purpose,
				'attachment'=>$attachment_name, 	  
				'session_id'=>$fiscal_id,							
			);	 			
			
			$inc=Income::create($add_arr);	  		
			
			if($inc)	  	
			{
				$result = Income::leftJoin('account_master as am','incomes.type_id','=','am.id')  
				->leftJoin('payment_modes as pm','incomes.mode_id','=','pm.id')  
				->leftJoin('tbl_school as sl','incomes.school_id','=','sl.id')    
				->selectRaw("incomes.*,am.name AS title,pm.pay_mode,sl.school_name,sl.about,sl.school_address,sl.school_email,sl.school_logo")
				->where("incomes.school_id",$schoolid)  
				->where("incomes.session_id",$fiscal_id)		
				->where("incomes.id",$inc->id)	  
				->get();   

				if($action=='saveprint')		  
				{ 					
					$page_data = array('income'=>$result); 			  						
					$slip_name=time().rand(1,99).'.'.'pdf';   
					$customPaper = array(0,0,504,750);    				   
					
					$pdf = PDF::loadView('income_print',$page_data)->setPaper($customPaper)->save(public_path("incomes/$slip_name")); 	
										
					$message="Income details added successfully and print generated.";    					
					$data_arr['print_id']=$slip_name;  
				}
				else
				{
					$message="Income details added successfully.";   			
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
	
	public function getTypes($id)		
    {
		$fiscal_yr=Helper::getFiscalYear(date('m'));  
		$fiscal_arr=explode(':',$fiscal_yr);	
		$fiscalYear=SessionMaster::where('session_start',$fiscal_arr[0])->where('session_end',$fiscal_arr[1])->get();
		$fiscal_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0; 
			
        $accounts = AccountMaster::leftJoin('money_types as mt','account_master.type_id','=','mt.id')
					->selectRaw("count(account_master.id) as row_count") 					
					->whereRaw("UPPER(mt.name)='INCOME'")		
					->where('account_master.school_id',$id)  
					->where('account_master.session_id',$fiscal_id)  
					->get();  	  	  			
					
        if ($accounts[0]->row_count > 0) 
		{
			$accounts = AccountMaster::leftJoin('money_types as mt','account_master.type_id','=','mt.id')
					->select('account_master.id','account_master.name') 					
					->whereRaw("UPPER(mt.name)='INCOME'")		
					->where('account_master.school_id',$id)  
					->where('account_master.session_id',$fiscal_id)  
					->get();  		
            return response()->json(["status" => "successed", "success" => true, "data" => $accounts]);  
        } else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found"]);
        }
    }	
	
	public function getModes()		
    {			
        $modes=PaymentMode::all();  			  	  			
					
        if (count($modes) > 0)   
		{					
            return response()->json(["status" => "successed", "success" => true, "data" => $modes]);  
        } else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found"]);
        }
    }

	public function printInc($id)		
	{
		$info = Income::where('id',$id)->get();		  	

		if(count($info) > 0)  	
		{ 	
			$result = Income::leftJoin('account_master as am','incomes.type_id','=','am.id')  
						->leftJoin('payment_modes as pm','incomes.mode_id','=','pm.id')  
						->leftJoin('tbl_school as sl','incomes.school_id','=','sl.id')    
						->selectRaw("incomes.*,am.name AS title,pm.pay_mode,sl.school_name,sl.about,sl.school_address,sl.school_email,sl.school_logo")
						->where("incomes.id",$id)	  
						->get();   
						
			$page_data = array('income'=>$result); 			  						
			$slip_name=time().rand(1,99).'.'.'pdf';   
			$customPaper = array(0,0,504,750);    				   

			$pdf = PDF::loadView('income_print',$page_data)->setPaper($customPaper)->save(public_path("incomes/$slip_name")); 	
								
			$message="Income detail print generated.";    		 
			$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data"=> $slip_name);					  
							
		}
		else
		{
			$message="could not generated!!";  
			$response_arr=array("status"=>'failed',"success"=>false,"message"=>$message,"errors"=>[],"data"=>"");	
		} 					

		return response()->json($response_arr);	         
		//
	}	
	
}