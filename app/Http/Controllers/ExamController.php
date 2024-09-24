<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\Models\Exam;
use DB;

class ExamController extends Controller
{
    public function __construct()
    {

    }
    public function index(Request $request)
    {
		$search = $request->search;
		$limit = $request->limit;
		$page = $request->page;
		$order = $request->order;
		$order_by = $request->orderBy;

		$offset = ($page-1)*$limit;

		$query1 = Exam::select(DB::raw('count(*) as row_count'));
		if($search !='')
		{
			$query1->where('name', 'like', '%'.$search.'%')
				   ->orWhere('type', 'like', '%'.$search.'%');
		}

		$records = $query1->get();

		$query2 = Exam::offset($offset)->limit($limit);
		if($search !='')
		{
			$query2->where('name', 'like', '%'.$search.'%')
				   ->orWhere('type', 'like', '%'.$search.'%');
		}
		if($order_by !='')
		{
			$query2->orderBy($order_by,$order);
		}

		$exams = $query2->get();

        if(count($exams) > 0)
		{
			$response_arr = array('data'=>$exams,'total'=>$records[0]->row_count);
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

		$rules=[
				'name' => 'required|unique:exams|max:255',
				'type' => 'required'
			];

			$fields = [
				'name' => 'Exam Name',
				'type' => 'Exam Type'
			];

			$messages = [
				'required' => 'The :attribute field is required.',
			];

		$validator = Validator::make($inputs, $rules, $messages, $fields);

        if ($validator->fails()) {
			$errors=$validator->errors();
			$response_arr=array("status"=>"failed","message"=>"Please fill required fields!!","errors"=>$errors);
        }
		else
		{
			$insert_arr = array(
				'name' => $request->name,
				'type' => $request->type
			);

			$exam = Exam::create($insert_arr);

			if($exam->id)
			{
				$message="New exam created successfully";
				$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data" =>$exam);
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
		$info = Exam::where('id',$id)->get();

		if(count($info)>0)
		{
			return response()->json(["status" =>'successed', "success" => true, "message" => "employee record found","data" => $info]);
		}
		else
		{
			return response()->json(["status" => "failed","success" => false,"message" => "Whoops! no record found!!","errors" =>'',"data" =>[]]);
		}

   }
   public function update(Request $request,$id)
   {
		$inputs=$request->all();

		$info = Exam::where('id',$id)->get();
		$check = 0;

		if(count($info)>0)
		{
			$name = empty($request->name)?'':$request->name;
			$name_rule=($name !=$info[0]->name)?'required|unique:exams|max:255':'required';

			$rules=[
				'name' => $name_rule,
				'type' => 'required'
			];

			$fields = [
				'name' => 'Exam Name',
				'type' => 'Exam Type'
			];

			$messages = [
				'required' => 'The :attribute field is required.',
			];

			$validator = Validator::make($inputs, $rules, $messages, $fields);

			if ($validator->fails()) {
				$errors=$validator->errors();
				$response_arr=array("status"=>"failed","message"=>"Please fill required fields!!","errors"=>$errors);
			}
			else
			{
				$update_arr = array(
					'name' => $request->name,
					'type' => $request->type
				);

				$update=Exam::where('id',$id)->update($update_arr);

				if($update)
				{
					$message="Exam record updated successfully";
					$response_arr=array("status"=>'successed',"success"=>true,"errors"=>[],"message"=>$message,"data" =>$id);
				}
				else
				{
					$message="could not update!!";
					$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);
				}

			}
			//
		}
		else
		{
			$response_arr=array("status" => "failed","success" => false,"message" => "Whoops! no record found!!","errors" =>'',"data" =>[]);
		}

		return response()->json($response_arr);
   }
   public function delete($id)
   {
		$info = Exam::where('id',$id)->get();

        if(count($info)>0)
		{
			$del=Exam::where('id',$id)->delete();
			if($del)
			{
				return response()->json(["status" =>'successed', "success" => true, "message" => "exam record deleted successfully","data" => '']);
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

	public function listAll()
	{
		$exams = Exam::orderBy('id','ASC')->get();

		if(!empty($exams)) {
			return response()->json(["status"=>'successed',"success"=>true,"data"=>$exams]);
		}
		else {
			return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found","data" =>""]);
		}

	}

    public function list_avail()
	{
		$exams = Exam::join('exam_date_sheet', 'exam_date_sheet.exam_id', '=', 'exams.id')
                ->select('exams.id','exams.name','exams.type')
                ->groupBy('exams.id','exams.name','exams.type')
                ->get();

        // dd($exams);
		if(!empty($exams)) {
			return response()->json(["status"=>'successed',"success"=>true,"data"=>$exams]);
		}
		else {
			return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found","data" =>""]);
		}

	}

}
