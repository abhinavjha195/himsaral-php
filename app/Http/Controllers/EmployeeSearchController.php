<?php
 
namespace App\Http\Controllers;
 
use Illuminate\Http\Request; 
use Illuminate\Support\Facades\Validator;  				
use Illuminate\Support\Facades\DB;     	

use App\Models\School;     	
use App\Models\Employee;  
use App\Models\SessionMaster;   
use App\Exports\EmployeeSearchExport;			
use Helper; 
use Excel;			
use Image;  
use PDF;  
			       		  							 
 
class EmployeeSearchController extends Controller					
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
		
		$emp_no = empty($request->emp_no)?'':$request->emp_no;	
		$emp_name = empty($request->emp_name)?'':$request->emp_name;	
		$bank_name = empty($request->bank_name)?'':$request->bank_name;	
		$school_id = empty($request->school_id)?'':$request->school_id;	  
		$department_id = empty($request->department_id)?'':$request->department_id;	  
		$designation_id = empty($request->designation_id)?'':$request->designation_id;  			
		
		$offset = ($page-1)*$limit;   

		$fiscal_yr=Helper::getFiscalYear(date('m'));  
		$fiscal_arr=explode(':',$fiscal_yr);	
		$fiscalYear=SessionMaster::where('session_start',$fiscal_arr[0])->where('session_end',$fiscal_arr[1])->get();
		$fiscal_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0; 	
		
		$query = Employee::leftJoin('department_master as dm','employees.dept_id','=','dm.departmentId') 					
				->leftJoin('designation_master as ds','employees.desig_id','=','ds.designationId')	 					 				
				->selectRaw("count(*) as row_count")		   				
				->where('employees.school_id',$school_id)
				->where('employees.session_id',$fiscal_id);   	
				
		if($emp_name !='')		
		{
			$query->where('employees.emp_name', 'like', '%'.$emp_name.'%');   				
		}
		
		if($emp_no !='')		
		{
			$query->where('employees.emp_no', 'like', '%'.$emp_no.'%');   						
		}
		
		if($bank_name !='')		
		{
			$query->where('employees.bank_name', 'like', '%'.$bank_name.'%');   						
		}
		
		if($department_id !='')
		{
			$query->where('employees.dept_id',$department_id);	
		}
		
		if($designation_id !='')
		{
			$query->where('employees.desig_id',$designation_id);	
		}
		
		if($search !='')	
		{  
			$query->where(function($q) use ($search) {
				 $q->where('employees.emp_name', 'like', '%'.$search.'%')
				   ->orWhere('employees.emp_no', 'like', '%'.$search.'%')		   	
				   ->orWhere('employees.mobile', 'like', '%'.$search.'%')
				   ->orWhere('employees.mobile', 'like', '%'.$search.'%')  
				   ->orWhere('dm.departmentName', 'like', '%'.$search.'%')		 
				   ->orWhere('ds.designationName', 'like', '%'.$search.'%');	 		 	
			 });   
		}
			 
		$records = $query->get();  
		
		$employee_query = Employee::leftJoin('department_master as dm','employees.dept_id','=','dm.departmentId') 					
						->leftJoin('designation_master as ds','employees.desig_id','=','ds.designationId')	 					 				
						->selectRaw("employees.*,ifnull(dm.departmentName,'') as department_name,ifnull(ds.designationName,'') as designation")		   				
						->where('employees.school_id',$school_id)
						->where('employees.session_id',$fiscal_id)			
						->offset($offset)->limit($limit);  		

		if($emp_name !='')		
		{
			$employee_query->where('employees.emp_name', 'like', '%'.$emp_name.'%');   				
		}
		
		if($emp_no !='')		
		{
			$employee_query->where('employees.emp_no', 'like', '%'.$emp_no.'%');   						
		}
		
		if($bank_name !='')		
		{
			$employee_query->where('employees.bank_name', 'like', '%'.$bank_name.'%');   						
		}
		
		if($department_id !='')
		{
			$employee_query->where('employees.dept_id',$department_id);	
		}
		
		if($designation_id !='')
		{
			$employee_query->where('employees.desig_id',$designation_id);	
		}
		
		if($search !='')	
		{  
			$employee_query->where(function($q) use ($search) {
				 $q->where('employees.emp_name', 'like', '%'.$search.'%')
				   ->orWhere('employees.emp_no', 'like', '%'.$search.'%')		   	
				   ->orWhere('employees.mobile', 'like', '%'.$search.'%')
				   ->orWhere('employees.mobile', 'like', '%'.$search.'%')  
				   ->orWhere('dm.departmentName', 'like', '%'.$search.'%')				 
				   ->orWhere('ds.designationName', 'like', '%'.$search.'%');	 		 	
			 });   
		}
		
		if($order_by !='')	
		{
			$employee_query->orderBy($order_by,$order); 				
		}
		
		$search_result = $employee_query->groupBy('employees.id')->get();  			
 		
        if(count($search_result) > 0) 
		{
			$response_arr = array('data'=>$search_result,'total'=>$records[0]->row_count,'query'=>$request->all());			
            return response()->json(["status" => "successed", "success" => true,"data" => $response_arr]);	
        }
        else {
			$response_arr = array('data'=>[],'total'=>0,'query'=>$request->all());	
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found","data" => $response_arr]);	  	
        }	
		
    }  	 	

	public function printRec(Request $request) 
    {	 
		$emp_no = empty($request->emp_no)?'':$request->emp_no;	
		$search = empty($request->search)?'':$request->search;	  
		$emp_name = empty($request->emp_name)?'':$request->emp_name;	
		$bank_name = empty($request->bank_name)?'':$request->bank_name;	
		$school_id = empty($request->school_id)?'':$request->school_id;	  
		$department_id = empty($request->department_id)?'':$request->department_id;	  
		$designation_id = empty($request->designation_id)?'':$request->designation_id;  
		
		$fiscal_yr=Helper::getFiscalYear(date('m'));  
		$fiscal_arr=explode(':',$fiscal_yr);	
		$fiscalYear=SessionMaster::where('session_start',$fiscal_arr[0])->where('session_end',$fiscal_arr[1])->get();
		$fiscal_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0;   
		
		$query = Employee::leftJoin('department_master as dm','employees.dept_id','=','dm.departmentId') 					
		->leftJoin('designation_master as ds','employees.desig_id','=','ds.designationId')	 					 				
		->selectRaw("employees.*,ifnull(dm.departmentName,'') as department_name,ifnull(ds.designationName,'') as designation")		   				
		->where('employees.school_id',$school_id)   
		->where('employees.session_id',$fiscal_id);   	
		
		if($emp_name !='')		
		{
			$query->where('employees.emp_name', 'like', '%'.$emp_name.'%');   				
		}

		if($emp_no !='')		
		{
			$query->where('employees.emp_no', 'like', '%'.$emp_no.'%');   						
		}

		if($bank_name !='')		
		{
			$query->where('employees.bank_name', 'like', '%'.$bank_name.'%');   						
		}

		if($department_id !='')
		{
			$query->where('employees.dept_id',$department_id);	
		}

		if($designation_id !='')
		{
			$query->where('employees.desig_id',$designation_id);	
		}

		if($search !='')	
		{ 			 
			$query->where(function($q) use ($search) {
				 $q->where('employees.emp_name', 'like', '%'.$search.'%')
				   ->orWhere('employees.emp_no', 'like', '%'.$search.'%')		   	
				   ->orWhere('employees.mobile', 'like', '%'.$search.'%')
				   ->orWhere('employees.mobile', 'like', '%'.$search.'%')  
				   ->orWhere('dm.departmentName', 'like', '%'.$search.'%')		 
				   ->orWhere('ds.designationName', 'like', '%'.$search.'%');	 		 	
			 });   
		} 
		
		$result = $query->orderBy('employees.id','asc')->get();   
		
		$school=School::where('id',$school_id)->get();   								
		$page_data = array('school'=>$school,'search_result'=>$result,'columns'=>''); 						
		$slip_name=time().rand(1,99).'.'.'pdf';   					
		
		$pdf = PDF::loadView("employee_print",$page_data)->save(public_path("empsearch/$slip_name"));		

		$message="Employee list printed successfully.";    
		$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data" =>$slip_name);	 			
		return response()->json($response_arr);	   		
	}

	public function exportRec(Request $request) 
	{
		$fiscal_yr=Helper::getFiscalYear(date('m'));  
		$fiscal_arr=explode(':',$fiscal_yr);	
		$fiscalYear=SessionMaster::where('session_start',$fiscal_arr[0])->where('session_end',$fiscal_arr[1])->get();
		$fiscal_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0; 
		
		$emp_no = empty($request->emp_no)?'':$request->emp_no;	
		$emp_name = empty($request->emp_name)?'':$request->emp_name;	
		$bank_name = empty($request->bank_name)?'':$request->bank_name;	
		$school_id = empty($request->school_id)?'':$request->school_id;	  
		$department_id = empty($request->department_id)?'':$request->department_id;	  
		$designation_id = empty($request->designation_id)?'':$request->designation_id;     
		$search = empty($request->search)?'':$request->search;  
		$columns = $request->fields;  	
		
		$file_name = 'Employee List_'.date('Y_m_d_H_i_s').'.xlsx';       		     
		$export=Excel::store(new EmployeeSearchExport($emp_no,$emp_name,$bank_name,$school_id,$department_id,$designation_id,$fiscal_id,$search,$columns),$file_name,'custom_upload');  			 			
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
    
}