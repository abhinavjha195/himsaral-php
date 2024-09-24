<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;


use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

use App\Models\Grade;
use Illuminate\Support\Facades\DB;


class GradeController extends Controller
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

		$query1 = Grade::select(DB::raw('count(*) as row_count'));
		if($search !='')
		{
			$query1->where('grade', 'like', '%'.$search.'%')
				   ->orWhere('marksAbove', 'like', '%'.$search.'%')
				   ->orWhere('marksLess', 'like', '%'.$search.'%');
		}

		$records = $query1->get();

		$query2 = Grade::offset($offset)->limit($limit);
		if($search !='')
		{
			$query2->where('grade', 'like', '%'.$search.'%')
                    ->orWhere('marksAbove', 'like', '%'.$search.'%')
                    ->orWhere('marksLess', 'like', '%'.$search.'%');
		}
		if($order_by !='')
		{
			$query2->orderBy($order_by,$order);
		}

		$grades = $query2->get();

        if(count($grades) > 0)
		{
			$response_arr = array('data'=>$grades,'total'=>$records[0]->row_count);
            return response()->json(["status" => "successed", "success" => true,"data" => $response_arr]);
        }
        else {
			$response_arr = array('data'=>[],'total'=>0);
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found","data" => $response_arr]);
        }
    }


    public function create(Request $request)
    {

        $inputs = $request->all();

        $rules = [
            'title' => "required|unique:grades,grade|max:5",
            'marksAbove' => "required|unique:grades,marksAbove",
            'marksLess' => "required|unique:grades,marksLess",
        ];

        $messages = [
            'required' => 'The :attribute field is required.',
        ];

        $fields = [
            'marksAbove' => 'Marks',
            'marksLess' => 'Marks ',
            'title' => 'Grade',
        ];

        $validator = Validator::make($inputs, $rules, $messages, $fields);

        // if validation fails
        if ($validator->fails()) {
            return response()->json(["status" => "failed", "message" => "Please fill all fields!!", "errors" => $validator->errors()]);
        } else {
            $insertArray = array(
                "marksAbove" => $request->marksAbove,
                "marksLess" => $request->marksLess,
                "grade" => $request->title,
            );

            $grade = Grade::create($insertArray);

            if (!is_null($grade)) {

                return response()->json(["status" => 'successed', "success" => true, "message" => "grade record created successfully", "data" => $grade]);

            } else {
                return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! failed to create."]);
            }

        }

    }

    public function edit($id)
   {
		$info = Grade::where('gradeId',$id)->get();

		if(count($info)>0)
		{
			return response()->json(["status" =>'successed', "success" => true, "message" => "grade record found","data" => $info]);
		}
		else
		{
			return response()->json(["status" => "failed","success" => false,"message" => "Whoops! no record found!!","errors" =>'',"data" =>[]]);
		}

   }


   public function update(Request $request,$id)
   {
		$inputs=$request->all();

		$info = Grade::where('gradeId',$id)->get();
		$check = 0;

		if(count($info)>0)
		{
			$grade = empty($request->grade)?'':$request->grade;
			$grade_rule=($grade !=$info[0]->grade)?'required|unique:grades|max:5':'required';

			$rules=[
				'grade' => $grade_rule,
                'marksAbove'=>'required',
				'marksLess' => 'required'
			];

			$fields = [
				'grade' => 'Grade ',
                'marksAbove'=>'Marks ',
				'marksLess' => 'Marks '
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
					'grade' => $request->grade,
                    'marksAbove'=> $request->marksAbove,
				    'marksLess' => $request->marksLess
				);

				$update=Grade::where('gradeId',$id)->update($update_arr);

				if($update)
				{
					$message="Grade record updated successfully";
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
        $delete = Grade::where('gradeId',$id)->delete();
        if ($delete) {
            return ['status' => True, 'message' => 'Grade Deleted'];
        } else {
            return ['status' => True, 'message' => 'Grade not Deleted'];
        }

    }





}
