<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use App\Models\SubjectMaster;
use App\Models\ClasswiseSubject;
use DB;



class SubjectController extends Controller
{

    public function add_subject_process(Request $req){


        $SubjectName=$req->input('subjectName');
        $remark=$req->input('remark');
        $shortCode=$req->input('shortCode');


        // echo $userId;
        // echo $password;
        $values = array('remark' => $remark,'shortCode'=>$shortCode,'subjectName'=> ucfirst($SubjectName));




       // echo count($data);

        if( DB::table('subject_master')->insert($values)){
            return ['status'=>True, 'message'=>'Subject Added'];
        }
        else{
            return ['status'=>False, 'message'=>'Subject Not Added'];
        }
       // echo "<br>";

    }



    public function edit_Subject_process(Request $req){


        $subjectName=$req->input('subjectName');
        $remark=$req->input('remark');
        $shortCode=$req->input('shortCode');

        $id=$req->input('id');
        // echo $userId;
        // echo $password;
        $values = array('remark' => $remark,'shortCode'=>$shortCode,'subjectName'=> ucfirst($subjectName));




       // echo count($data);

        if( DB::table('subject_master')->where('subjectId','=',$id)->update($values)){
            return ['status'=>True, 'message'=>'Subject Edited'];
        }
        else{
            return ['status'=>False, 'message'=>'Subject Not Edited'];
        }
       // echo "<br>";

    }



    // public function subject_list(Request $request){

    //     $search = $request->search;
	// 	$limit = $request->limit;
	// 	$page = $request->page;
	// 	$order = $request->order;
	// 	$order_by = $request->orderBy;

	// 	$offset = ($page-1)*$limit;

    //     $query1 = SubjectMaster::select(DB::raw('count(*) as row_count'));
	// 	if($search !='')
	// 	{
	// 		$query1->where('subjectName', 'like', '%'.$search.'%');
	// 	}
	// 	$records = $query1->get();

    //     $query2 = SubjectMaster::offset($offset)->limit($limit);
	// 	if($search !='')
	// 	{
	// 		$query2->where('subjectName', 'like', '%'.$search.'%');
	// 	}
	// 	if($order_by !='')
	// 	{
	// 		$query2->orderBy($order_by,$order);
	// 	}

	// 	$SubjectMaster = $query2->get();

    //     if(count($SubjectMaster) > 0)
	// 	{
	// 		$response_arr = array('data'=>$SubjectMaster,'total'=>$records[0]->row_count);
    //         return response()->json(["status" => "true", "success" => true,"data" => $response_arr]);
    //     }
    //     else {
	// 		$response_arr = array('data'=>[],'total'=>0);
    //         return response()->json(["status" => "false", "success" => false, "message" => "Whoops! no record found","data" => $response_arr]);
    //     }
    // }

    public function subject_list(Request $request) {

        $search = $request->search;
        $limit = $request->limit ? $request->limit : 10; // Default limit to 10 if not set
        $page = $request->page ? $request->page : 1; // Default page to 1 if not set
        $order = $request->order ? $request->order : 'asc'; // Default order to 'asc' if not set
        $order_by = $request->orderBy ? $request->orderBy : 'subjectId'; // Default orderBy to 'id' if not set

        $offset = ($page - 1) * $limit;

        $query1 = SubjectMaster::select(DB::raw('count(*) as row_count'));
        if ($search != '') {
            $query1->where('subjectName', 'like', '%' . $search . '%');
        }
        $records = $query1->first();

        $query2 = SubjectMaster::skip($offset)->take($limit);
        if ($search != '') {
            $query2->where('subjectName', 'like', '%' . $search . '%');
        }
        if ($order_by != '') {
            $query2->orderBy($order_by, $order);
        }

        $SubjectMaster = $query2->get();

        if (count($SubjectMaster) > 0) {
            $response_arr = array('data' => $SubjectMaster, 'total' => $records->row_count);
            return response()->json(["status" => "true", "success" => true, "data" => $response_arr]);
        } else {
            $response_arr = array('data' => [], 'total' => 0);
            return response()->json(["status" => "false", "success" => false, "message" => "Whoops! no record found", "data" => $response_arr]);
        }
    }


    public function subject_by_id($id){
        $data=array();
        $data= DB::table('subject_master')
         ->select('*')
         ->where('subjectId',$id)
         ->get();



        // echo count($data);

         if(count($data) > 0){
             return ['status'=>True, 'data'=> $data];
         }
         else{
             return ['status'=>False, 'data'=>$data];
         }
    }

	public function listSome($list)
	{
		$arr =($list=="")?array():explode(',',$list);

		$subjects=SubjectMaster::whereIn('subjectId',$arr)->where('status',1)->get();

		if(count($subjects)>0) {
			return response()->json(["status"=>'successed',"success"=>true,"data"=>$subjects]);
		}
		else {
			return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found","data" =>[]]);
		}
	}

    public function delete_subject_process($id){
        $subject = SubjectMaster::where('subjectId', $id)->get();
        $subjectId = $subject[0]->subjectId ?? '';

        if ($subjectId > 0) {

            SubjectMaster::where('subjectId', $id)->delete();
                return response()->json(["status" => 'successed', "success" => true, "message" => "Subject List record deleted successfully", "data" => '']);

        } else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! failed to delete,!!", "errors" => '']);
        }
    }
}
