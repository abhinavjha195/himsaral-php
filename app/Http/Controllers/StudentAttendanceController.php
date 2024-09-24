<?php
 
namespace App\Http\Controllers;
 
use Illuminate\Http\Request; 
use Illuminate\Support\Facades\Validator;  						
use Illuminate\Support\Facades\DB;   

use App\Models\ClasswiseSubject;	
use App\Models\SubjectMaster;    
use App\Models\SessionMaster;  
use App\Models\StudentMaster;        
use App\Models\StudentAttendance;       
use App\Models\AttendanceType;        
use Helper;          		       		  							 
 
class StudentAttendanceController extends Controller						
{  
	public function __construct()
    {
       DB::statement("SET SQL_MODE=''"); 	
    }   
	
	public function getDetail($course_id,$school_id,$atten_date,$class_id = null,$section_id = null,$subjectid = null)		
	{
		$fiscal_yr=Helper::getFiscalYear(date('m'));  
		$fiscal_arr=explode(':',$fiscal_yr);	
		$fiscalYear=SessionMaster::where('session_start',$fiscal_arr[0])->where('session_end',$fiscal_arr[1])->get();
		$fiscal_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0; 
		$id_arr=array();	

		$subject_id=(is_null($subjectid))?0:$subjectid;  	
		
		$atten_query=StudentAttendance::where('attend_date',$atten_date)->where('subject_id',$subject_id);		 		
		$attendances=$atten_query->where('school_id',$school_id)->where('session_id',$fiscal_id)->get();   
		
		foreach($attendances AS $attendance)
		{
			array_push($id_arr,$attendance->student_id);  
		} 
		
		$query = StudentMaster::leftJoin('course_master as cm', 'student_master.course_id', '=', 'cm.courseId') 					
				->leftJoin('class_master as cs','student_master.class_id','=','cs.classId')	
				->leftJoin('section_master as se','student_master.section_id','=','se.sectionId')  	 				
				->selectRaw("count(*) as row_count")  				
				->where('student_master.course_id',$course_id);   										
					
		if($class_id !='')	
		{ 					 
			$query->where('student_master.class_id',$class_id);		
		}
		
		if($section_id !='')	
		{ 					 
			$query->where('student_master.section_id',$section_id);				
		}
		
		if($subject_id >0)	
		{ 					 
			$query->where(function($q) use ($subject_id) { 				  
				  $q->whereRaw("FIND_IN_SET($subject_id,student_master.compulsary_set)")
					->orWhereRaw("FIND_IN_SET($subject_id,student_master.elective_set)")    
					->orWhereRaw("FIND_IN_SET($subject_id,student_master.additional_set)");   					
			});		
		}

		if(count($id_arr)>0)	
		{
			$query->whereNotIn('student_master.id',$id_arr);					
		}

		$info=$query->where('student_master.session_id',$fiscal_id)->get();    			

		if($info[0]->row_count > 0)  	
		{
			$atten_query = StudentMaster::leftJoin('course_master as cm', 'student_master.course_id', '=', 'cm.courseId') 
				->leftJoin('class_master as cs','student_master.class_id','=','cs.classId')							
				->leftJoin('section_master as se','student_master.section_id','=','se.sectionId')  	 								
				->select('student_master.id','student_master.student_name','student_master.roll_no','student_master.admission_no')	
				->where('student_master.course_id',$course_id); 				
				
			if($class_id !='')	
			{ 					 
				$atten_query->where('student_master.class_id',$class_id);		
			}	
				
			if($section_id !='')	
			{ 					 
				$atten_query->where('student_master.section_id',$section_id);		
			}
			
			if($subject_id >0)	
			{ 					 
				$atten_query->where(function($q) use ($subject_id) { 				  
					  $q->whereRaw("FIND_IN_SET($subject_id,student_master.compulsary_set)")
						->orWhereRaw("FIND_IN_SET($subject_id,student_master.elective_set)")    
						->orWhereRaw("FIND_IN_SET($subject_id,student_master.additional_set)");   					
				});		
			}

			if(count($id_arr)>0)	
			{
				$atten_query->whereNotIn('student_master.id',$id_arr);					
			}	

			$result=$atten_query->where('student_master.session_id',$fiscal_id)->get();  	
			$response_arr = array("status" => "successed", "success" => true, "message" => "student records found","data" =>$result);  	
		}
		else {
			$response_arr = array("status" => "failed", "success" => false, "message" => "Whoops! no record found","data" =>[]);	         		
        }			

		return response()->json($response_arr);					
	}
	
	public function add(Request $request)	  		
	{
		$inputs=$request->all();   
		$subject_id=empty($request->subject_id)?0:$request->subject_id; 
		$school_id=empty($request->school_id)?0:$request->school_id; 
		$attendance_date=empty($request->attend_date)?'':$request->attend_date;  	
		$id_arr=empty($request->student_arr)?[]:$request->student_arr;  		
		$insert_arr=array();
		$chk=0;	
		$fiscal_yr=Helper::getFiscalYear(date('m'));  
		$fiscal_arr=explode(':',$fiscal_yr);	
		$fiscalYear=SessionMaster::where('session_start',$fiscal_arr[0])->where('session_end',$fiscal_arr[1])->get();
		$fiscal_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0; 	
		
		foreach($id_arr AS $k=>$v)
		{
			$chk_query=StudentAttendance::select(DB::raw('count(*) as row_count'))->where('attend_date',$attendance_date);   
					 
			if($subject_id !='')	
			{ 					 
				$chk_query->where('subject_id',$subject_id);		
			}

			$checkExist=$chk_query->where('student_id',$k)->where('school_id',$school_id)->where('session_id',$fiscal_id)->get(); 
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
			$response_arr=array("status"=>"failed","message"=>"No subject found for Attendance!!","errors"=>"");     
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
					'student_id'=>$k,
					'school_id'=>$school_id, 
					'session_id'=>$fiscal_id, 		
					'subject_id'=>$subject_id, 
					'attend_date'=>$attendance_date,   
					'attend_type'=>is_null($v)?0:$v,   
				);
				
				array_push($insert_arr,$attend_arr);		
			} 

			$attend = StudentAttendance::insert($insert_arr);			
			
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

	public function getYears()  
	{
		$sessions=StudentMaster::join('session_master as sm','student_master.session_id','=','sm.id')
		->selectRaw('YEAR(sm.session_start) AS year_list')  
		->groupBy('sm.id')		
        ->get();		

		if(count($sessions)>0)
		{		
			$response_arr = array("status" => "successed", "success" => true, "message" => "year records found","data" =>$sessions);  		
		}
		else {
			$response_arr = array("status" => "failed", "success" => false, "message" => "Whoops! no record found","data" =>[]);	         		
        }			

		return response()->json($response_arr);					
		
	}		

	public function getTypes()		
    {
        $types = AttendanceType::all();   
        if (count($types) > 0) {
            return response()->json(["status" => "successed", "success" => true, "data" => $types]);  
        } else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found"]);
        }
    }	
	
   public function getSuggest($search)    
   { 
		$fiscal_yr=Helper::getFiscalYear(date('m'));  
		$fiscal_arr=explode(':',$fiscal_yr);	
		$fiscalYear=SessionMaster::where('session_start',$fiscal_arr[0])->where('session_end',$fiscal_arr[1])->get();
		$fiscal_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0;
		
        $query=StudentMaster::leftJoin('class_master as cs','student_master.class_id','=','cs.classId')  					  
				->select('student_master.id','student_master.admission_no','student_master.student_name','student_master.father_name','student_master.roll_no','cs.className');			

		$query->where(function($q) use ($search) {
			 $q->where('cs.className','like','%'.$search.'%')		
			   ->orWhere('student_master.student_name','like','%'.$search.'%')    
			   ->orWhere('student_master.father_name','like','%'.$search.'%')    
			   ->orWhere('student_master.admission_no','like','%'.$search.'%');        		
		});  		
				    
		$result=$query->where('student_master.session_id',$fiscal_id)->get();   							  							
			
        if(count($result)>0) {  
            return response()->json(["status" => "successed", "success" => true, "data" => $result]);  	  
        }
        else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no result found"]);
        }    
   }
   
   public function getIndividual($search)    
   { 
		$fiscal_yr=Helper::getFiscalYear(date('m'));  
		$fiscal_arr=explode(':',$fiscal_yr);	
		$fiscalYear=SessionMaster::where('session_start',$fiscal_arr[0])->where('session_end',$fiscal_arr[1])->get();
		$fiscal_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0;
		
        $result=StudentMaster::where('admission_no',$search)->where('session_id',$fiscal_id)->get();   
			
        if(count($result)>0) {  
            return response()->json(["status" => "successed", "success" => true, "data" => $result]);  	 	 
        }
        else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no result found"]);
        }    
   }
   
   public function getIndividualSubject($search)    
   { 		
	   $fiscal_yr=Helper::getFiscalYear(date('m'));  		
	   $fiscal_arr=explode(':',$fiscal_yr);	
	   $fiscalYear=SessionMaster::where('session_start',$fiscal_arr[0])->where('session_end',$fiscal_arr[1])->get();
	   $fiscal_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0;	
	   
        $result=StudentMaster::leftjoin("subject_master as sm",DB::raw('FIND_IN_SET(sm.subjectId,student_master.compulsary_set)'),">",DB::raw("'0'"))	
		->leftjoin("subject_master as sm1",DB::raw('FIND_IN_SET(sm1.subjectId,student_master.elective_set)'),">",DB::raw("'0'"))  	
		->leftjoin("subject_master as sm2",DB::raw('FIND_IN_SET(sm2.subjectId,student_master.additional_set)'),">",DB::raw("'0'"))  
		->selectRaw("group_concat(distinct concat(sm.subjectName,':',sm.subjectId) SEPARATOR',') AS compulsary_subjects,group_concat(distinct concat(sm1.subjectName,':',sm1.subjectId) SEPARATOR',') AS elective_subjects,group_concat(distinct concat(sm2.subjectName,':',sm2.subjectId) SEPARATOR',') AS additional_subjects")
		->where('student_master.admission_no',$search)
		->where('student_master.session_id',$fiscal_id)
		->get();  
			
        if(count($result)>0) {  
            return response()->json(["status" => "successed", "success" => true, "data" => $result]);  	  
        }
        else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no result found"]);
        }    
   }
   
   public function getAttendance($course_id,$school_id,$atten_date,$class_id = null,$section_id = null,$subjectid = null)		
   {
		$fiscal_yr=Helper::getFiscalYear(date('m'));  
		$fiscal_arr=explode(':',$fiscal_yr);	
		$fiscalYear=SessionMaster::where('session_start',$fiscal_arr[0])->where('session_end',$fiscal_arr[1])->get();
		$fiscal_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0; 
		
		$subject_id=(is_null($subjectid))?0:$subjectid;   
		
		$query = StudentAttendance::leftJoin('student_master as sm','student_attendances.student_id','=','sm.id') 		
				->leftJoin('attendance_types as at','student_attendances.attend_type','=','at.id') 	
				->selectRaw("count(*) as row_count")  				
				->where('student_attendances.attend_date',$atten_date);			
				
		if($course_id !='')	
		{ 					 
			$query->where('sm.course_id',$course_id);   	
		} 			

		if($class_id !='')	
		{ 					 
			$query->where('sm.class_id',$class_id);		
		}

		if($section_id !='')	
		{ 					 
			$query->where('sm.section_id',$section_id);				
		} 			

		$info=$query->where('student_attendances.subject_id',$subject_id)->where('student_attendances.school_id',$school_id)->where('student_attendances.session_id',$fiscal_id)->get();    	

		if($info[0]->row_count > 0)  	
		{
			$atten_query = StudentAttendance::leftJoin('student_master as sm','student_attendances.student_id','=','sm.id')
				->leftJoin('attendance_types as at','student_attendances.attend_type','=','at.id') 	 	
				->select('student_attendances.student_id','student_attendances.attend_type','sm.student_name','sm.admission_no','sm.roll_no','at.name')	
				->where('student_attendances.attend_date',$atten_date);	 		

			if($course_id !='')	
			{ 					 
				$query->where('sm.course_id',$course_id);   	
			} 			

			if($class_id !='')	
			{ 					 
				$query->where('sm.class_id',$class_id);		
			}

			if($section_id !='')	
			{ 					 
				$query->where('sm.section_id',$section_id);				
			} 			

			$result=$atten_query->where('student_attendances.subject_id',$subject_id)->where('student_attendances.school_id',$school_id)->where('student_attendances.session_id',$fiscal_id)->get();  	
			$response_arr = array("status" => "successed", "success" => true, "message" => "students attendance records found","data" =>$result);  	
		}
		else {
			$response_arr = array("status" => "failed", "success" => false, "message" => "Whoops! no record found","data" =>[]);	         		
        }			

		return response()->json($response_arr);												
	}
	
   public function getIndividualAttendance($search,$atten_date,$subjectid=null)				
   {
		$fiscal_yr=Helper::getFiscalYear(date('m'));  
		$fiscal_arr=explode(':',$fiscal_yr);	
		$fiscalYear=SessionMaster::where('session_start',$fiscal_arr[0])->where('session_end',$fiscal_arr[1])->get();
		$fiscal_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0; 
		
		$subject_id=(is_null($subjectid))?0:$subjectid;   		
		
		$query = StudentAttendance::leftJoin('student_master as sm','student_attendances.student_id','=','sm.id') 
				->leftJoin('attendance_types as at','student_attendances.attend_type','=','at.id')    
				->selectRaw("count(*) as row_count")  				
				->where('student_attendances.attend_date',$atten_date)
				->where('student_attendances.subject_id',$subject_id);   		

		$info=$query->where('sm.admission_no',$search)->where('student_attendances.session_id',$fiscal_id)->get();    	

		if($info[0]->row_count > 0)  	
		{
			$atten_query = StudentAttendance::leftJoin('student_master as sm','student_attendances.student_id','=','sm.id')  	
				->leftJoin('attendance_types as at','student_attendances.attend_type','=','at.id')   
				->select('student_attendances.student_id','student_attendances.attend_type','sm.student_name','sm.admission_no','sm.roll_no','at.name')	
				->where('student_attendances.attend_date',$atten_date)
				->where('student_attendances.subject_id',$subject_id);      				

			$result=$atten_query->where('sm.admission_no',$search)->where('student_attendances.session_id',$fiscal_id)->get();  	
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
		$id_arr=empty($request->student_arr)?[]:$request->student_arr;  		
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
			$response_arr=array("status"=>"failed","message"=>"No subject found for Attendance!!","errors"=>"");     
		}
		else
		{ 
			foreach($id_arr AS $k=>$v)		
			{
				$attend_query=StudentAttendance::select('id')->where('attend_date',$attendance_date)->where('subject_id',$subject_id);	 
				$result=$attend_query->where('student_id',$k)->where('school_id',$school_id)->where('session_id',$fiscal_id)->get(); 
				
				if(count($result)>0)		
				{
					array_push($del_arr,$result[0]->id); 
				}
				
				$attend_arr=array(
					'student_id'=>$k,
					'school_id'=>$school_id, 
					'session_id'=>$fiscal_id, 		
					'subject_id'=>$subject_id, 
					'attend_date'=>$attendance_date,   
					'attend_type'=>is_null($v)?0:$v,   
				);
				
				array_push($insert_arr,$attend_arr);			
				
			}
			
			if(count($del_arr)>0)	
			{
				$del=StudentAttendance::whereIn('id',$del_arr)->delete();		
				
				if($del)
				{ 
					$attend = StudentAttendance::insert($insert_arr);					
					
					if($attend)		
					{ 	
						$message="Attendance detail updated successfully";		
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

	public function getCalender($month_id,$year_id,$school_id,$course_id = null,$class_id = null,$section_id = null)		
    {
		$fiscal_yr=Helper::getFiscalYear(date('m'));  
		$fiscal_arr=explode(':',$fiscal_yr);
		$sub_arr = array();  	
		$fiscalYear=SessionMaster::where('session_start',$fiscal_arr[0])->where('session_end',$fiscal_arr[1])->get();
		$fiscal_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0;   
		$calc_days=cal_days_in_month(CAL_GREGORIAN,$month_id,$year_id);  
		
		if ($section_id != '') 
		{ 			
			$subjects = ClasswiseSubject::leftJoin('class_wise_sub_desc as cw','classwisesubject.id','=','cw.csId')  			
			->leftJoin('subject_master as sb','cw.subjectId','=','sb.subjectId') 
			->select('sb.subjectId')  
			->where('classwisesubject.courseId',$course_id)
			->where('classwisesubject.classId',$class_id)
			->where('classwisesubject.sectionId',$section_id)		
			->where('sb.status',1)
			->groupBy('sb.subjectId')
			->get();

			foreach ($subjects as $sb) {
				array_push($sub_arr,$sb->subjectId);		
			} 				
			
		}

		$query = StudentAttendance::leftJoin('student_master as sm','student_attendances.student_id','=','sm.id')  			 	 	
			->selectRaw("student_attendances.student_id,student_attendances.subject_id,GROUP_CONCAT(dayofmonth(student_attendances.attend_date) 
			ORDER BY student_attendances.attend_date) as attend_days,GROUP_CONCAT(student_attendances.attend_type 
			ORDER BY student_attendances.attend_date) as attend_types,sm.student_name,sm.admission_no")	
			->whereMonth('student_attendances.attend_date',$month_id)
			->whereYear('student_attendances.attend_date',$year_id);   		

		if($course_id !='')	
		{ 					 
			$query->where('sm.course_id',$course_id);   	
		} 			

		if($class_id !='')	
		{ 					 
			$query->where('sm.class_id',$class_id);		
		}

		if(count($sub_arr)>0)	
		{ 					 
			$query->whereIn('student_attendances.subject_id',$sub_arr);	   			
		} 			

		$result=$query->where('student_attendances.school_id',$school_id)->where('student_attendances.session_id',$fiscal_id)
				->groupBy('student_attendances.student_id','student_attendances.subject_id')  
				->orderBy('sm.student_name','desc')
                ->get(); 			
		
		if(count($result)>0)
		{ 
			$data=array('records'=>$result,'days'=>$calc_days);	  	
			$response_arr=array("status"=>'successed',"success"=>true,"message"=>"student attendance record found.","errors"=>[],"data" =>$data);	
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
			$response_arr=array("status"=>"failed","message"=>"No student found for attendance!!","errors"=>"");     
		}
		else
		{ 
			foreach($id_arr AS $k=>$v)		
			{
				$arc=explode(',',$v);
				for($i=0;$i<count($arc);$i++)
				{
					$arr=explode('#',$arc[$i]); 
					$arq=explode(':',$arr[0]);  
					$dt=$year.'-'.$month.'-'.$arq[0]; 
					// type = $arr[1]  	sub = $arq[1]  day= $arq[0]  
					
					$result=StudentAttendance::select('id')->where('subject_id',$arq[1])->where('student_id',$k)
							->where('attend_date',$dt)->where('school_id',$school_id)->where('session_id',$fiscal_id)->get(); 
					
					if(count($result)>0)		
					{
						array_push($del_arr,$result[0]->id); 
					}
					
					$attend_arr=array(
						'student_id'=>$k,
						'school_id'=>$school_id, 
						'session_id'=>$fiscal_id, 		
						'subject_id'=>$arq[1], 
						'attend_date'=>$dt,   
						'attend_type'=>$arr[1],   
					);
					
					array_push($insert_arr,$attend_arr);	
					
				}   	
				
			}  

			if(count($del_arr)>0)
			{
				StudentAttendance::whereIn('id',$del_arr)->delete();	  
			}  				
			
			$attend = StudentAttendance::insert($insert_arr);					
					
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