<?php
 
namespace App\Http\Controllers;
 
use Illuminate\Http\Request; 
use Illuminate\Support\Facades\Validator;  						
use Illuminate\Support\Facades\DB;   

use App\Models\ClasswiseSubject;	
use App\Models\SubjectMaster;    
use App\Models\SessionMaster;  
use App\Models\Employee;        
use App\Models\EmployeeAttendance;         
use App\Models\AttendanceType;        
use Helper;          		       		  							 
 
class EmployeeAttendanceController extends Controller						
{  
	public function __construct()
    {
       DB::statement("SET SQL_MODE=''"); 	
    }   
	
	public function getDetail($school_id,$depart_id,$atten_date,$desig_id = null)		
	{
		$fiscal_yr=Helper::getFiscalYear(date('m'));  
		$fiscal_arr=explode(':',$fiscal_yr);	
		$fiscalYear=SessionMaster::where('session_start',$fiscal_arr[0])->where('session_end',$fiscal_arr[1])->get();
		$fiscal_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0; 
		$id_arr=array();	

		$designation_id=(is_null($desig_id))?0:$desig_id;  	
		
		$attendances=EmployeeAttendance::where('attend_date',$atten_date)->where('school_id',$school_id)->where('session_id',$fiscal_id)->get();	 				
		
		foreach($attendances AS $attendance)
		{
			array_push($id_arr,$attendance->emp_id);  
		} 
		
		$query = Employee::leftJoin('department_master as dm','employees.dept_id','=','dm.departmentId') 					
				->leftJoin('designation_master as ds','employees.desig_id','=','ds.designationId')	 					 				
				->selectRaw("count(*) as row_count")		   				
				->where('employees.school_id',$school_id);   	  									
					
		if($depart_id !='all')	
		{ 					 
			$query->where('employees.dept_id',$depart_id);		
		}
		
		if($designation_id >0)	
		{ 					 
			$query->where('employees.desig_id',$designation_id);				
		} 		

		if(count($id_arr)>0)	
		{
			$query->whereNotIn('employees.id',$id_arr);					
		}

		$info=$query->where('employees.session_id',$fiscal_id)->get();    			

		if($info[0]->row_count > 0)  	
		{
			$atten_query = Employee::leftJoin('department_master as dm','employees.dept_id','=','dm.departmentId') 					
				->leftJoin('designation_master as ds','employees.desig_id','=','ds.designationId')	  								
				->select('employees.id','employees.emp_name','employees.emp_no','dm.departmentName','ds.designationName')	
				->where('employees.school_id',$school_id);   					  				
				
			if($depart_id !='all')	
			{ 					 
				$atten_query->where('employees.dept_id',$depart_id);		
			}
			
			if($designation_id >0)	
			{ 					 
				$atten_query->where('employees.desig_id',$designation_id);					
			} 		

			if(count($id_arr)>0)	
			{
				$atten_query->whereNotIn('employees.id',$id_arr);							
			}

			$result=$atten_query->where('employees.session_id',$fiscal_id)->get();  	
			$response_arr = array("status" => "successed", "success" => true, "message" => "Employee records found","data" =>$result);  	
		}
		else {
			$response_arr = array("status" => "failed", "success" => false, "message" => "Whoops! no record found","data" =>[]);	         		
        }			

		return response()->json($response_arr);							
	}
	
	public function add(Request $request)	  		
	{
		$inputs=$request->all();   
		$school_id=empty($request->school_id)?0:$request->school_id; 
		$attendance_date=empty($request->attend_date)?'':$request->attend_date;  	
		$id_arr=empty($request->emp_arr)?[]:$request->emp_arr;  		
		$insert_arr=array();
		$chk=0;	
		$fiscal_yr=Helper::getFiscalYear(date('m'));  
		$fiscal_arr=explode(':',$fiscal_yr);	
		$fiscalYear=SessionMaster::where('session_start',$fiscal_arr[0])->where('session_end',$fiscal_arr[1])->get();
		$fiscal_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0; 	
		
		foreach($id_arr AS $k=>$v)
		{
			$checkExist=EmployeeAttendance::select(DB::raw('count(*) as row_count'))->where('attend_date',$attendance_date)
					   ->where('emp_id',$k)->where('school_id',$school_id)->where('session_id',$fiscal_id)->get(); 	
			if($checkExist[0]->row_count>0)
			{
				$chk++;  
			}
		}

		$rules=[
			'attend_date' => 'required|date', 		
		];   
		
		$fields = [ 
			'attend_date' => 'Attendance Date',  		 
		]; 

		$messages = [
			'required' => 'The :attribute field is required.',    
		];  	
		
		$validator = Validator::make($inputs,$rules,$messages,$fields);   	    		
 
        if ($validator->fails()) {  	
			$errors=$validator->errors();   			
			$response_arr=array("status"=>"failed","message"=>"Please fill required fields!!","errors"=>$errors);       
        }
		else if(count($id_arr)==0)		
		{ 					  
			$response_arr=array("status"=>"failed","message"=>"No employee found for Attendance!!","errors"=>"");     
		}
		else if($chk >0)		
		{ 					  
			$response_arr=array("status"=>"failed","message"=>"Attendance details already saved!!","errors"=>"");     
		}
		else
		{  			
			foreach($id_arr AS $k=>$v)
			{
				$attend_arr=array(
					'emp_id'=>$k,
					'school_id'=>$school_id, 
					'session_id'=>$fiscal_id, 		
					'attend_date'=>$attendance_date,   
					'attend_type'=>is_null($v)?0:$v,   
				);
				
				array_push($insert_arr,$attend_arr);		
			} 

			$attend = EmployeeAttendance::insert($insert_arr);					
			
			if($attend)		
			{ 	
				$message="Attendance detail saved successfully";		
				$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data"=>$attend);	 
			}
			else
			{
				$message="could not saved!!";  
				$response_arr=array("status"=>'failed',"success"=>false,"message"=>$message,"errors"=>[],"data"=>[]);	
			}  
			
		} 			
				 		
		return response()->json($response_arr);      
	}	  	
	
   public function getSuggest($school_id,$search)    
   { 
		$fiscal_yr=Helper::getFiscalYear(date('m'));  
		$fiscal_arr=explode(':',$fiscal_yr);	
		$fiscalYear=SessionMaster::where('session_start',$fiscal_arr[0])->where('session_end',$fiscal_arr[1])->get();
		$fiscal_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0;
		
        $query=Employee::where('school_id',$school_id)->where('session_id',$fiscal_id);   
		$query->where(function($q) use ($search) {
			 $q->where('emp_no','like','%'.$search.'%')->orWhere('emp_name','like','%'.$search.'%');     		
		});  		
				    
		$result=$query->get(); 				
			
        if(count($result)>0) {  
            return response()->json(["status" => "successed", "success" => true, "data" => $result]);  	  
        }
        else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no result found"]);
        }    
   }
   
   public function getIndividual($school_id,$search)    
   { 
		$fiscal_yr=Helper::getFiscalYear(date('m'));  
		$fiscal_arr=explode(':',$fiscal_yr);	
		$fiscalYear=SessionMaster::where('session_start',$fiscal_arr[0])->where('session_end',$fiscal_arr[1])->get();
		$fiscal_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0;
		
		$result=Employee::leftJoin('department_master as dm','employees.dept_id','=','dm.departmentId') 					
				->leftJoin('designation_master as ds','employees.desig_id','=','ds.designationId')	  								
				->select('employees.id','employees.emp_name','employees.emp_no','dm.departmentName','ds.designationName')					
				->where('employees.school_id',$school_id)
				->where('employees.session_id',$fiscal_id)
				->where('employees.emp_no',$search)   
				->get();  	
		
        if(count($result)>0) {  
            return response()->json(["status" => "successed", "success" => true, "data" => $result]);  	 	   
        }
        else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no result found"]);
        }    
   }	   
   
   public function getAttendance($school_id,$depart_id,$atten_date,$desig_id = null)			
   {
		$fiscal_yr=Helper::getFiscalYear(date('m'));  
		$fiscal_arr=explode(':',$fiscal_yr);	
		$fiscalYear=SessionMaster::where('session_start',$fiscal_arr[0])->where('session_end',$fiscal_arr[1])->get();
		$fiscal_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0; 
		
		$designation_id=(is_null($desig_id))?0:$desig_id;  		

		$query = Employee::leftJoin('employee_attendances as ea','employees.id','=','ea.emp_id') 
			->leftJoin('attendance_types as at','ea.attend_type','=','at.id') 	  
			->leftJoin('department_master as dm','employees.dept_id','=','dm.departmentId') 	  
			->leftJoin('designation_master as ds','employees.desig_id','=','ds.designationId')	 					 				
			->selectRaw("count(*) as row_count")		   				
			->where('ea.attend_date',$atten_date);											
				
		if($depart_id !='all')	
		{ 					 
			$query->where('employees.dept_id',$depart_id);		
		}
		
		if($designation_id >0)	
		{ 					 
			$query->where('employees.desig_id',$designation_id);				
		} 			

		$info=$query->where('employees.school_id',$school_id)->where('employees.session_id',$fiscal_id)->get();    	

		if($info[0]->row_count > 0)  	
		{
			$atten_query = Employee::leftJoin('employee_attendances as ea','employees.id','=','ea.emp_id') 
				->leftJoin('attendance_types as at','ea.attend_type','=','at.id')   
				->leftJoin('department_master as dm','employees.dept_id','=','dm.departmentId') 	  
				->leftJoin('designation_master as ds','employees.desig_id','=','ds.designationId')	 	 					
				->select('employees.id','employees.emp_name','employees.emp_no','dm.departmentName','ds.designationName','ea.attend_type','at.name')	
				->where('ea.attend_date',$atten_date);													
				
			if($depart_id !='all')	
			{ 					 
				$atten_query->where('employees.dept_id',$depart_id);		
			}
			
			if($designation_id >0)	
			{ 					 
				$atten_query->where('employees.desig_id',$designation_id);						
			} 			

			$result=$atten_query->where('employees.school_id',$school_id)->where('employees.session_id',$fiscal_id)->get();  	
			$response_arr = array("status" => "successed", "success" => true, "message" => "students attendance records found","data" =>$result);  	
		}
		else {
			$response_arr = array("status" => "failed", "success" => false, "message" => "Whoops! no record found","data" =>[]);	         		
        }			

		return response()->json($response_arr);												
	}
	
   public function getIndividualAttendance($search,$atten_date,$school_id)				
   {
		$fiscal_yr=Helper::getFiscalYear(date('m'));  
		$fiscal_arr=explode(':',$fiscal_yr);	
		$fiscalYear=SessionMaster::where('session_start',$fiscal_arr[0])->where('session_end',$fiscal_arr[1])->get();
		$fiscal_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0; 

		$info = Employee::leftJoin('employee_attendances as ea','employees.id','=','ea.emp_id') 
			->leftJoin('attendance_types as at','ea.attend_type','=','at.id') 	  
			->leftJoin('department_master as dm','employees.dept_id','=','dm.departmentId') 	  
			->leftJoin('designation_master as ds','employees.desig_id','=','ds.designationId')	 					 				
			->selectRaw("count(*) as row_count")		   				
			->where('ea.attend_date',$atten_date)		
			->where('employees.emp_no',$search)
			->where('employees.school_id',$school_id)
			->where('employees.session_id',$fiscal_id)		
			->get();   		

		if($info[0]->row_count > 0)  	
		{
			$result = Employee::leftJoin('employee_attendances as ea','employees.id','=','ea.emp_id') 
					->leftJoin('attendance_types as at','ea.attend_type','=','at.id')   
					->leftJoin('department_master as dm','employees.dept_id','=','dm.departmentId') 	  
					->leftJoin('designation_master as ds','employees.desig_id','=','ds.designationId')	 	 					
					->select('employees.id','employees.emp_name','employees.emp_no','dm.departmentName','ds.designationName','ea.attend_type','at.name')	
					->where('ea.attend_date',$atten_date)  	  				
					->where('employees.emp_no',$search)
					->where('employees.school_id',$school_id)
					->where('employees.session_id',$fiscal_id)
					->get();    									
			
			$response_arr = array("status" => "successed", "success" => true, "message" => "student attendance record found","data" =>$result);  	
		}
		else {
			$response_arr = array("status" => "failed", "success" => false, "message" => "Whoops! no record found","data" =>[]);	         		
        }			

		return response()->json($response_arr);																
	} 
	
	public function update(Request $request)	  		
	{
		$inputs=$request->all();   
		$subject_id=empty($request->subject_id)?0:$request->subject_id; 
		$school_id=empty($request->school_id)?0:$request->school_id; 
		$attendance_date=empty($request->attend_date)?'':$request->attend_date;  	
		$id_arr=empty($request->emp_arr)?[]:$request->emp_arr;  		
		$insert_arr=$del_arr=array();		
		
		$fiscal_yr=Helper::getFiscalYear(date('m'));  
		$fiscal_arr=explode(':',$fiscal_yr);	
		$fiscalYear=SessionMaster::where('session_start',$fiscal_arr[0])->where('session_end',$fiscal_arr[1])->get();
		$fiscal_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0; 	

		$rules=[
			'attend_date' => 'required|date', 		
		];   
		
		$fields = [ 
			'attend_date' => 'Attendance Date',  		 
		]; 

		$messages = [
			'required' => 'The :attribute field is required.',    
		];  	
		
		$validator = Validator::make($inputs,$rules,$messages,$fields);   	    		
 
        if ($validator->fails()) {  	
			$errors=$validator->errors();   			
			$response_arr=array("status"=>"failed","message"=>"Please fill required fields!!","errors"=>$errors);     
        }
		else if(count($id_arr)==0)		
		{ 					  
			$response_arr=array("status"=>"failed","message"=>"No employee found for attendance!!","errors"=>"");     
		}
		else
		{ 
			foreach($id_arr AS $k=>$v)		
			{				
				$result=EmployeeAttendance::where('emp_id',$k)
						->where('attend_date',$attendance_date)
						->where('school_id',$school_id)
						->where('session_id',$fiscal_id)
						->get();	 				
						
				if(count($result)>0)		
				{
					array_push($del_arr,$result[0]->id); 		
				}
				
				$attend_arr=array(
					'emp_id'=>$k,
					'school_id'=>$school_id, 
					'session_id'=>$fiscal_id, 	  
					'attend_date'=>$attendance_date,   
					'attend_type'=>is_null($v)?0:$v,   
				);
				
				array_push($insert_arr,$attend_arr);					
			}
			
			if(count($del_arr)>0)	
			{
				$del=EmployeeAttendance::whereIn('id',$del_arr)->delete();		
				
				if($del)
				{ 
					$attend = EmployeeAttendance::insert($insert_arr);					
					
					if($attend)		
					{ 	
						$message="Employee attendance details updated successfully";		
						$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data"=>$attend);	 
					}
					else
					{
						$message="could not updated!!";  
						$response_arr=array("status"=>'failed',"success"=>false,"message"=>$message,"errors"=>[],"data"=>[]);	
					}  
					
				}	
			}
			else
			{
				$message="could not updated!!";  	
				$response_arr=array("status"=>'failed',"success"=>false,"message"=>$message,"errors"=>[],"data"=>[]);
			}
			
		} 			
				 		
		return response()->json($response_arr);     		   		  
		  					
	}

	public function getCalender($month_id,$year_id,$school_id,$depart_id = null,$desig_id = null)		
    {
		$fiscal_yr=Helper::getFiscalYear(date('m'));  
		$fiscal_arr=explode(':',$fiscal_yr);
		$sub_arr = array();  	
		$fiscalYear=SessionMaster::where('session_start',$fiscal_arr[0])->where('session_end',$fiscal_arr[1])->get();
		$fiscal_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0;   
		$calc_days=cal_days_in_month(CAL_GREGORIAN,$month_id,$year_id);  
		
		$department_id=(is_null($depart_id))?0:$depart_id;    
		$designation_id=(is_null($desig_id))?0:$desig_id;    		
		
		$attn_query = Employee::leftJoin('employee_attendances as ea','employees.id','=','ea.emp_id') 					 				
		->selectRaw("count(*) as row_count")		   				
		->whereMonth('ea.attend_date',$month_id)
		->whereYear('ea.attend_date',$year_id);   											
			
		if($department_id >0)	
		{ 					 
			$attn_query->where('employees.dept_id',$department_id);		
		}

		if($designation_id >0)	
		{ 					 
			$attn_query->where('employees.desig_id',$designation_id);				
		} 			

		$info=$attn_query->where('employees.school_id',$school_id)->where('employees.session_id',$fiscal_id)->get(); 
		
		if($info[0]->row_count >0)  
		{ 			 
			$query = Employee::leftJoin('employee_attendances as ea','employees.id','=','ea.emp_id') 					 								
			->selectRaw("employees.id,employees.emp_name,employees.emp_no,GROUP_CONCAT(dayofmonth(ea.attend_date)) as attend_days,GROUP_CONCAT(ea.attend_type 
			) as attend_types")		
			->whereMonth('ea.attend_date',$month_id)
			->whereYear('ea.attend_date',$year_id);   													
				
			if($department_id >0)	
			{ 					 
				$query->where('employees.dept_id',$department_id);		
			}

			if($designation_id >0)	
			{ 					 
				$query->where('employees.desig_id',$designation_id);						
			} 			

			$result=$query->where('employees.school_id',$school_id)->where('employees.session_id',$fiscal_id) 
					->groupBy('employees.id')  					
					->get(); 	
					
			$data=array('records'=>$result,'days'=>$calc_days);	  	
			$response_arr=array("status"=>'successed',"success"=>true,"message"=>"Employee attendance records found.","errors"=>[],"data" =>$data);	
		}
		else
		{ 
			$data=array('records'=>[],'days'=>0);	
			$response_arr=array("status"=>'failed',"success"=>false,"message"=>"Whoops! no record found","errors"=>[],"data"=>$data);	
		} 		
		  
		return response()->json($response_arr);       			  
	}
	
	public function updateCalender(Request $request)	  		
	{
		$inputs=$request->all();    		
		$month=empty($request->month_id)?0:$request->month_id; 
		$year=empty($request->year_id)?0:$request->year_id; 
		$school_id=empty($request->school_id)?0:$request->school_id; 	  
		$id_arr=empty($request->attendances)?[]:$request->attendances;  		
		$insert_arr=$del_arr=array();	
		
		$fiscal_yr=Helper::getFiscalYear(date('m'));  
		$fiscal_arr=explode(':',$fiscal_yr);	
		$fiscalYear=SessionMaster::where('session_start',$fiscal_arr[0])->where('session_end',$fiscal_arr[1])->get();
		$fiscal_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0; 	

		$rules=[
			'month_id' => 'required', 
			'year_id' => 'required',   	
		];   
		
		$fields = [ 
			'month_id' => 'Month',  	
			'year_id' => 'Year',   	
		]; 

		$messages = [
			'required' => 'The :attribute field is required.',    
		];  	
		
		$validator = Validator::make($inputs,$rules,$messages,$fields);   	    		
 
        if ($validator->fails()) {  	
			$errors=$validator->errors();   			
			$response_arr=array("status"=>"failed","message"=>"Please fill required fields!!","errors"=>$errors);     
        }
		else if(count($id_arr)==0)		
		{ 					  
			$response_arr=array("status"=>"failed","message"=>"No employee found for attendance!!","errors"=>"");     
		}
		else
		{ 
			foreach($id_arr AS $k=>$v)		
			{
				$arc=explode(',',$v);
				for($i=0;$i<count($arc);$i++)
				{
					$arr=explode(':',$arc[$i]);   					
					$dt=$year.'-'.$month.'-'.$arr[0]; 
					// type = $arr[1] day= $arr[0]  
					
					$result=EmployeeAttendance::select('id')->where('attend_date',$dt)
							->where('emp_id',$k)->where('school_id',$school_id)
							->where('session_id',$fiscal_id)->get(); 		
					
					if(count($result)>0)		
					{
						array_push($del_arr,$result[0]->id); 
					}
					
					$attend_arr=array(
						'emp_id'=>$k,
						'school_id'=>$school_id, 
						'session_id'=>$fiscal_id, 	
						'attend_date'=>$dt,   
						'attend_type'=>$arr[1],   		
					);
					
					array_push($insert_arr,$attend_arr);	
					
				}   	
				
			}  					

			if(count($del_arr)>0)
			{
				EmployeeAttendance::whereIn('id',$del_arr)->delete();	  
			}  				
			
			$attend = EmployeeAttendance::insert($insert_arr);					
					
			if($attend)		
			{ 	
				$message="Attendance details updated successfully";		
				$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data"=>$attend);	 
			}
			else
			{
				$message="could not updated!!";  
				$response_arr=array("status"=>'failed',"success"=>false,"message"=>$message,"errors"=>[],"data"=>[]);	
			}  
			
		} 			
				 		
		return response()->json($response_arr);       		 		  
		  					
	}
	
}