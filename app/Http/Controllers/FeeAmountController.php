<?php

namespace App\Http\Controllers;		
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;  
use Illuminate\Http\Request;
use Carbon\Carbon;
use Carbon\CarbonPeriod;		

use App\Models\FeeCategoryMaster;     
use App\Models\FeeAmtMaster;  
use App\Models\FeeAmtDesc;          
use App\Models\FeeAmount;  
use App\Models\FeeSlot;  
use App\Models\Classic;		  
use App\Models\Course;         
use DB;  

class FeeAmountController extends Controller		
{
	public function __construct()
    {
        DB::statement("SET SQL_MODE=''");   
    }

    // public function index(Request $request)			
	// {
	// 	$search = $request->search;
    //     $limit = $request->limit;
    //     $page = $request->page;
    //     $order = $request->order;
    //     $order_by = $request->orderBy;

    //     $offset = ($page - 1) * $limit;		
		
	// 	$query=FeeAmtMaster::leftJoin('feeamtdesc as fc', 'feeamtmaster.FeeAmtId', '=', 'fc.FeeAmtId')   
	// 				->leftJoin('course_master', 'feeamtmaster.CourseId', '=', 'course_master.courseId') 
	// 				->leftJoin('class_master', 'feeamtmaster.ClassId', '=', 'class_master.classId') 				
	// 				->selectRaw("count(DISTINCT feeamtmaster.FeeAmtId) as row_count");	
					
	// 	if ($search != '') {
    //         $query->where('course_master.courseName', 'like', '%' . $search . '%')
    //             ->orWhere('class_master.className', 'like', '%' . $search . '%');
    //     }		

	// 	$records = $query->groupBy('feeamtmaster.FeeAmtId')->get();   

	// 	$fee_query=FeeAmtMaster::leftJoin('feeamtdesc as fc', 'feeamtmaster.FeeAmtId', '=', 'fc.FeeAmtId')   
	// 				->leftJoin('course_master', 'feeamtmaster.CourseId', '=', 'course_master.courseId') 
	// 				->leftJoin('class_master', 'feeamtmaster.ClassId', '=', 'class_master.classId') 				
	// 				->select('feeamtmaster.*', 'course_master.courseName', 'class_master.className');
	// 				dd($fee_query);
	// 	if ($search != '') {
    //         $fee_query->where('course_master.courseName', 'like', '%' . $search . '%')
    //             ->orWhere('class_master.className', 'like', '%' . $search . '%');
    //     }				
	// 	if ($order_by != '') {
    //         $fee_query->orderBy($order_by,$order);		
    //     }		
					
	// 	$fee_amounts=$fee_query->groupBy('feeamtmaster.FeeAmtId')->offset($offset)->limit($limit)->get(); 	

	// 	if (count($fee_amounts) > 0) {		
    //         $response_arr = array('data' => $fee_amounts, 'total' => $records[0]->row_count);
    //         return response()->json(["status" => "successed", "success" => true, "data" => $response_arr]);
    //     } else {
    //         $response_arr = array('data' => [], 'total' => 0);
    //         return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found", "data" => $response_arr]);
    //     }	
		
    // }

	public function index(Request $request) {			
		$search = $request->search ?? '';
		$limit = $request->limit ?? 10;
		$page = $request->page ?? 1;
		$order = 'asc';
		$order_by = $request->orderBy ?? 'feeamtmaster.FeeAmtId';
	
		$offset = ($page - 1) * $limit;		
	
		// Query to count total records
		$countQuery = FeeAmtMaster::leftJoin('feeamtdesc as fc', 'feeamtmaster.FeeAmtId', '=', 'fc.FeeAmtId')   
					->leftJoin('course_master', 'feeamtmaster.CourseId', '=', 'course_master.courseId') 
					->leftJoin('class_master', 'feeamtmaster.ClassId', '=', 'class_master.classId') 				
					->selectRaw("count(DISTINCT feeamtmaster.FeeAmtId) as row_count");
	
		if (!empty($search)) {
			$countQuery->where(function ($query) use ($search) {
				$query->where('course_master.courseName', 'like', '%' . $search . '%')
					  ->orWhere('class_master.className', 'like', '%' . $search . '%');
			});
		}
	
		$totalRecords = $countQuery->first()->row_count;
	
		// Query to fetch the paginated data
		$feeQuery = FeeAmtMaster::leftJoin('feeamtdesc as fc', 'feeamtmaster.FeeAmtId', '=', 'fc.FeeAmtId')   
					->leftJoin('course_master', 'feeamtmaster.CourseId', '=', 'course_master.courseId') 
					->leftJoin('class_master', 'feeamtmaster.ClassId', '=', 'class_master.classId') 				
					->select('feeamtmaster.*', 'course_master.courseName', 'class_master.className');
	
		if (!empty($search)) {
			$feeQuery->where(function ($query) use ($search) {
				$query->where('course_master.courseName', 'like', '%' . $search . '%')
					  ->orWhere('class_master.className', 'like', '%' . $search . '%');
			});
		}
	
		if (!empty($order_by)) {
			$feeQuery->orderBy($order_by, $order);		
		}
	
		$feeAmounts = $feeQuery->groupBy('feeamtmaster.FeeAmtId')->offset($offset)->limit($limit)->get(); 	
	
		if ($feeAmounts->count() > 0) {		
			$responseArr = [
				'data' => $feeAmounts,
				'total' => $totalRecords
			];
			return response()->json(["status" => "success", "success" => true, "data" => $responseArr]);
		} else {
			$responseArr = [
				'data' => [],
				'total' => 0
			];
			return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! No record found", "data" => $responseArr]);
		}	
	}
	
    
	public function create(Request $request)			
	{
		$inputs=$request->all();
		$lists=$request->class_set;
		$categories = $request->fee_cats;     
		$course_id=($request->course_id!=null)?$request->course_id:'';	
		$class_arr=array();  
		
		
		for($i=0;$i<count($lists);$i++)
		{
			array_push($class_arr,$lists[$i]);  
		}	
		
		$checkExist= FeeAmtMaster::select(DB::raw('count(*) as record_count'))
					 ->where('CourseId',$course_id)   						 
					 ->whereIn('ClassId',$class_arr)	
					 ->get();   

		$rules=[            	 			
            'course_id' => 'required'    
        ];   
		
		$messages = [
			'required' => 'The :attribute field is required.',  
		];  
		
		$fields = [
			'course_id' => 'Course Name'  
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
		else if(count($class_arr)==0)		
		{
			$response_arr=array("status"=>"failed","message"=>'Please select a class!!');	
            return response()->json($response_arr);
		}
		else if($checkExist[0]->record_count >0)  
		{
			$response_arr=array("status"=>"failed","message"=>'Fee Amount already exist for those class!!');	  
            return response()->json($response_arr); 
		}  
		else
		{
			for($i=0;$i<count($lists);$i++)
			{
				$insert_arr=array(
					'CourseId'=>(int)$course_id,  
					'ClassId'=>(int)$lists[$i]    	
				);   

				$feeamt = FeeAmtMaster::create($insert_arr);				
				
				foreach($categories AS $k=>$v)
				{
					$desc_arr[]=array(    
						'FeeAmtId'=>$feeamt->id,						
						'FeeCatId'=>$k,	
						'FeeAmount'=>is_null($v)?0:$v    	
					);
				} 				
			}  			
			
			$desc = FeeAmtDesc::insert($desc_arr);	  		
			
			if($desc)	  	
			{	
				$message="Fee amount created successfully"; 
				$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data" =>$desc);	
			}
			else
			{
				$message="could not created!!";  
				$response_arr=array("status"=>'failed',"success"=>false,"message"=>$message,"errors"=>[],"data"=>[]);	
			} 
			
			return response()->json($response_arr);	  		
      		
		}	 		     
		
	}  	  
	
   public function edit($id)		
   {	
		$info = FeeAmtMaster::leftJoin('feeamtdesc','feeamtmaster.FeeAmtId', '=', 'feeamtdesc.FeeAmtId') 					
					->selectRaw("count(*) as row_count,group_concat(distinct feeamtmaster.CourseId) AS course_id,group_concat(distinct feeamtmaster.ClassId) AS class_id,group_concat(feeamtdesc.FeeCatId) cat_list,group_concat(feeamtdesc.FeeAmount) as amount_list")						
					->where('feeamtmaster.FeeAmtId',$id)   
					->get();   					
		
		$courses = Course::all();  
		$categories= FeeCategoryMaster::all();		
		
		if($info[0]->row_count==0){   
			return response()->json(["status" => "failed", "message" => "Whoops! fee amount does not exist!!","errors" =>'']); 					
		}     
		else { 
			$classes = Classic::where('courseId',$info[0]->course_id)->get();         		
			$data=array('fee_data'=>$info,'course_data'=>$courses,'class_data'=>$classes,'category_data'=>$categories);  
		
			return response()->json(["status" =>'successed', "success" => true, "message" => "fee amount record found successfully","data" =>$data]);   			
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
   
   public function delete($id)
   {
		$info = FeeAmtMaster::leftJoin('feeamtdesc','feeamtmaster.FeeAmtId', '=', 'feeamtdesc.FeeAmtId') 					
					->selectRaw("count(*) as row_count,group_concat(distinct feeamtmaster.CourseId) AS course_id,group_concat(distinct feeamtmaster.ClassId) AS class_id,group_concat(feeamtdesc.FeeCatId) cat_list,group_concat(feeamtdesc.FeeAmount) as amount_list")						
					->where('feeamtmaster.FeeAmtId',$id)   
					->get();

        if($info[0]->row_count>0)		
		{	
			$q='DELETE feeamtmaster.*,feeamtdesc.* FROM feeamtmaster LEFT JOIN feeamtdesc ON feeamtmaster.FeeAmtId=feeamtdesc.FeeAmtId where feeamtmaster.FeeAmtId =?';        
			$del=DB::delete($q,array($id));    		  
			
			if($del)	
			{
				return response()->json(["status" =>'successed', "success" => true,"errors"=>[], "message" => "Fee amount record deleted successfully","data" =>[]]);  
			}
			else    
			{
				return response()->json(["status" => "failed","success" => false,"errors"=>[],"message" => "Whoops! failed to delete,!!","errors" =>'']); 	
			} 
			//			
		}
		else
		{
			return response()->json(["status" => "failed","success" => false,"message" => "Whoops! failed to delete,!!","errors" =>'']); 				
		} 		 
		
    }  
	
   
}  