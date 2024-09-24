<?php
 
namespace App\Http\Controllers;  
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;  
use Illuminate\Http\Request;
  
use App\Models\StudentMaster;	    			
use App\Models\Template;	
use App\Models\School;   
use PDF;  		    	
use DB;	   
 
class PrintIdController extends Controller	   
{     
	
	public function getStudentList($obj1,$obj2=null) 
	{
		$course = json_decode($obj1);   
		$class = json_decode($obj2);  
		$course_arr = array();  
		$class_arr = array();    
		$section_arr = array();    
		foreach($course AS $k=>$v)	
		{
			array_push($course_arr,(int)$k);  
			$arr = explode(',',$v);	  
			for($i=0;$i<count($arr);$i++)
			{
				array_push($class_arr,(int)$arr[$i]);  
				foreach($class AS $ky=>$vl)				
				{
					if($arr[$i]==$ky)
					{
						$arc = explode(',',$vl);  
						for($j=0;$j<count($arc);$j++)
						{
							array_push($section_arr,(int)$arc[$j]);    
						}	
					}
				}
			}
			
		}     	
        	
        if(count($course_arr) > 0) 
		{
			$query=StudentMaster::leftJoin('class_master as cm','student_master.class_id','=','cm.classId')
			->whereIn('student_master.course_id',$course_arr);	
			
			if(count($class_arr) > 0) 
			{
				$query->whereIn('student_master.class_id',$class_arr);  
			}
			if(count($section_arr) > 0) 
			{
				$query->whereIn('student_master.section_id',$section_arr);  
			}
            $students=$query->select('student_master.id','student_master.admission_no','student_master.dob','student_master.gender','student_master.father_name','student_master.student_name','student_master.mobile','student_master.student_image','cm.className')->get();		
			
            return response()->json(["status" => "successed", "success" => true,"data" => $students]);	
        }
        else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found"]);
        } 
		
    }
	
	public function getLayouts($list)		
	{
		$arr=explode(',',$list);
		if(count($arr)>0){
			$layouts=Template::whereIn('mode',$arr)->get();			
			return response()->json(["status" => "successed", "success" => true,"data" => $layouts]);		
        }
        else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found"]);
        } 
	}
	
	public function getPrints($list1,$list2)		
	{		
		$arr1=json_decode($list1);		
		$arr2=json_decode($list2);	
		$mode=$temp="";  	

		foreach($arr1 AS $k=>$v)	
		{
			$mode=$k;
			$temp=$v;  
		}
		
		if($mode=='')
		{
			$message="Please select a layout!!";  
			$response_arr=array("status"=>'failed',"success"=>false,"message"=>$message,"data"=>[]);	
		}
		else if($temp=='')
		{
			$message="Please select a template!!";  
			$response_arr=array("status"=>'failed',"success"=>false,"message"=>$message,"data"=>[]);	
		}
		else if(count($arr2)==0)		
		{
			$message="Please select student!!";  
			$response_arr=array("status"=>'failed',"success"=>false,"message"=>$message,"data"=>[]);	  
		}  
		else 
		{
			$school=School::where('school_code','S110')->get();  
			$students=StudentMaster::leftJoin('class_master as cm','student_master.class_id','=','cm.classId')  		
			->leftJoin('station_master as sm','student_master.station_id','=','sm.stationId')  	  
			->leftJoin('route_master as rm','student_master.route_id','=','rm.routeId')  	   	
			->whereIn('student_master.id',$arr2)		
			->select('student_master.*','cm.className','sm.stationName','rm.routeNo')    
			->get();	
			
			if(count($students)>0)
			{
				$receipt_name=time().rand(1,99).'.'.'pdf';  
				$data = array('school'=>$school,'students'=>$students); 	
			
				$pdf = PDF::loadView("template_{$temp}",$data)->setPaper("A4",'portrait')->save(public_path("idcards/$mode/$receipt_name"));	
				
				$message="Id card printed successfully";   
				$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"data" =>$receipt_name);	
			}	
			
		} 		
		
		return response()->json($response_arr);	   
	}
	
	public function getPreview($temp_id)		  
	{
		$school=School::where('school_code','S110')->get(); 		

	    $page_data = array('school'=>$school); 						
	    $html_view = view("preview_{$temp_id}",$page_data)->render();    	       	
        return response()->json(["status"=>"successed","success"=>true,"data"=>$html_view]); 	 		 		 
		
	}

}