<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\DB;
use App\Models\Holiday;

class HolidayController extends Controller
{
    
    public function index(Request $request)
    {
		$search = $request->search;
		$limit = $request->limit;
		$page = $request->page;
		$order = $request->order;
		$order_by = $request->orderBy;

		$offset = ($page-1)*$limit;

		$query1 = Holiday::select(DB::raw('count(*) as row_count'));
		if($search !='')
		{
			$query1->where('description', 'like', '%'.$search.'%')
            ->orWhere('from_date', 'like', '%'.$search.'%')
            ->orWhere('to_date', 'like', '%'.$search.'%');
		}

		$records = $query1->get();

		$query2 = Holiday::offset($offset)->limit($limit);
		if($search !='')
		{
			$query2->where('description', 'like', '%'.$search.'%')
            ->orWhere('from_date', 'like', '%'.$search.'%')
            ->orWhere('to_date', 'like', '%'.$search.'%');
		}
		if($order_by !='')
		{
			$query2->orderBy($order_by,$order);
		}

		$holidays = $query2->get();

        if(count($holidays) > 0)
		{
			$response_arr = array('data'=>$holidays,'total'=>$records[0]->row_count);
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
            'from_date' => "required",
            'to_date' => "required",
            'description' => "required",
        ];

        $messages = [
            'required' => 'The :attribute field is required.',
        ];

        $fields = [
            'from_date' => 'From Date',
            'to_date' => 'To Date',
            'description' => 'Description',
        ];

        $validator = Validator::make($inputs, $rules, $messages, $fields);

        // if validation fails
        if ($validator->fails()) {
            return response()->json(["status" => "failed", "message" => "Please fill all fields!!", "errors" => $validator->errors()]);
        } else {
            $insertArray = array(
                "from_date" => $request->from_date,
                "to_date" => $request->to_date,
                "description" => $request->description,
            );

            $holiday = Holiday::create($insertArray);

            if (!is_null($holiday)) {

                return response()->json(["status" => 'successed', "success" => true, "message" => "holiday record created successfully", "data" => $holiday]);

            } else {
                return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! failed to create."]);
            }

        }

    }

    public function edit($id)
   {
		$info = HOliday::where('id',$id)->get();

		if(count($info)>0)
		{
			return response()->json(["status" =>'successed', "success" => true, "message" => "holiday record found","data" => $info]);
		}
		else
		{
			return response()->json(["status" => "failed","success" => false,"message" => "Whoops! no record found!!","errors" =>'',"data" =>[]]);
		}

   }

   public function update(Request $request,$id)
   {
		$inputs=$request->all();

		$info = Holiday::where('id',$id)->get();


		if(count($info)>0)
		{
			
			$rules=[
				'description' => "required",
                'from_date'=>'required',
				'to_date' => 'required'
			];

			$fields = [
				'description' => 'Description ',
                'from_date'=>'Marks ',
				'to_date' => 'Marks '
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
					'description' => $request->description,
                    'from_date'=> $request->from_date,
				    'to_date' => $request->to_date
				);

				$update=Holiday::where('id',$id)->update($update_arr);

				if($update)
				{
					$message="Holiday record updated successfully";
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
        $delete = HOliday::where('id',$id)->delete();
        if ($delete) {
            return ['status' => True, 'message' => 'Holiday Deleted'];
        } else {
            return ['status' => True, 'message' => 'Holiday not Deleted'];
        }

    }
}
