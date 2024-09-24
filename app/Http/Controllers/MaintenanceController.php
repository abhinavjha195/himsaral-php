<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;


use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

use App\Models\MaintenanceMaster;
use Illuminate\Support\Facades\DB;


class MaintenanceController extends Controller
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

		$query1 = MaintenanceMaster::select(DB::raw('count(*) as row_count'));
		if($search !='')
		{
			$query1->where('maintenance_type', 'like', '%'.$search.'%')
				   ->orWhere('description', 'like', '%'.$search.'%');
		}

		$records = $query1->get();

		$query2 = MaintenanceMaster::offset($offset)->limit($limit);
		if($search !='')
		{
			$query2->where('maintenance_type', 'like', '%'.$search.'%')
                    ->orWhere('description', 'like', '%'.$search.'%');
		}
		if($order_by !='')
		{
			$query2->orderBy($order_by,$order);
		}

		$maintenance = $query2->get();

        if(count($maintenance) > 0)
		{
			$response_arr = array('data'=>$maintenance,'total'=>$records[0]->row_count);
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
            'maintenance_type'  => "required",
            'description'       => "required",
        ];

        $messages = [
            'required'  => 'The :attribute field is required.',
        ];

        $fields = [
            'maintenance_type'      =>'Maintenance Type',
            'description'           => 'Description',
        ];

        $validator = Validator::make($inputs, $rules, $messages, $fields);

        // if validation fails
        if ($validator->fails()) {
            return response()->json(["status" => "failed", "message" => "Please fill all fields!!", "errors" => $validator->errors()]);
        } else {
            $insertArray = array(
                "maintenance_type" => $request->maintenance_type,
                "description" => $request->description,
            );

            $supplier = MaintenanceMaster::create($insertArray);

            if (!is_null($supplier)) {

                return response()->json(["status" => 'successed', "success" => true, "message" => "Maintenance record created successfully", "data" => $supplier]);

            } else {
                return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! failed to create."]);
            }

        }

    }

    public function edit($id)
   {
		$info = MaintenanceMaster::where('maintenance_id',$id)->get();

		if(count($info)>0)
		{
			return response()->json(["status" =>'successed', "success" => true, "message" => "maintenance record found","data" => $info]);
		}
		else
		{
			return response()->json(["status" => "failed","success" => false,"message" => "Whoops! no record found!!","errors" =>'',"data" =>[]]);
		}

   }


   public function update(Request $request,$id)
   {
		$inputs=$request->all();

		$info = MaintenanceMaster::where('maintenance_id',$id)->get();
		$check = 0;

		if(count($info)>0)
		{
			$maintenance = empty($request->maintenance_type)?'':$request->maintenance_type;
			$maintenance_rule=($maintenance !=$info[0]->maintenance_type)?'required|unique:maintenance_master|max:255':'required';

			$rules=[
				'maintenance_type' => $maintenance_rule,
                'description'=>'required',
			];

			$fields = [
				'maintenance_type' => 'maintenance ',
                'description'=>'Description ',
				'DescriptionLess' => 'Description '
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
					'maintenance_type' => $request->maintenance_type,
                    'description'=> $request->description,
				);

				$update=MaintenanceMaster::where('maintenance_id',$id)->update($update_arr);

				if($update)
				{
					$message="maintenance record updated successfully";
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
        $delete = MaintenanceMaster::where('maintenance_id',$id)->delete();
        if ($delete) {
            return ['status' => True, 'message' => 'maintenance Deleted'];
        } else {
            return ['status' => True, 'message' => 'maintenance not Deleted'];
        }

    }





}
