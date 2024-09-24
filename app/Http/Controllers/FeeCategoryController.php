<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

use App\Models\FeeCategoryMaster;
use Illuminate\Support\Facades\DB;

class FeeCategoryController extends Controller
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

        $offset = ($page - 1) * $limit;

        $query1 = FeeCategoryMaster::select(DB::raw('count(*) as row_count'));
        if ($search != '') {
            $query1->where('name', 'like', '%' . $search . '%')
                ->orWhere('fee_type', 'like', '%' . $search . '%');
        }

        $records = $query1->get();

        $query2 = FeeCategoryMaster::select('fee_category_master.*')
            ->offset($offset)->limit($limit);
        if ($search != '') {
            $query2->where('name', 'like', '%' . $search . '%')
            ->orWhere('fee_type', 'like', '%' . $search . '%');
        }
        if ($order_by != '') {
            $query2->orderBy($order_by, $order);
        }

        $feecats = $query2->get();

        if (count($feecats) > 0) {
            $response_arr = array('data' => $feecats, 'total' => $records[0]->row_count);
            return response()->json(["status" => "successed", "success" => true, "data" => $response_arr]);
        } else {
            $response_arr = array('data' => [], 'total' => 0);
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found", "data" => $response_arr]);
        }
    }

	public function create(Request $request)
	{
		$type=$request->fee_type;
		$type_rule=($type=='other')?'required':'required|unique:fee_category_master,fee_type';

		$validator = Validator::make($request->all(), [
            'title' => 'required|unique:fee_category_master,name|min:3|max:255',
            'fee_type' => $type_rule,
			'applicable' => 'required',
			'changeable' => 'required',
			'printable' => 'required'
        ]);

        if ($validator->fails()) {
			$errors=$validator->errors();
            $response_arr = array(
                "status" => "failed",
                "message" => "Please fill all required fields.",
                "errors" => $errors,
                "data" => []
            );
        }
		else
		{
			$insert_arr = array(
				'name'=>$request->title,
				'fee_type'=>$request->fee_type,
				'applicable'=>$request->applicable,
				'changeable'=>$request->changeable,
				'printable'=>$request->printable
			);

			$fee = FeeCategoryMaster::create($insert_arr);

			if($fee->id)
			{
				$message="Fee Category created successfully";
				$response_arr=array("status"=>'successed',"message"=>$message,"errors"=>[],"data"=>$fee);
			}
			else
			{
				$message="Fee Category could not created!!";
				$response_arr=array("status"=>'failed',"message"=>$message,"errors"=>[],"data"=>[]);
			}

            }
        return response()->json($response_arr);
	}

   public function edit($id)
   {
		$info = FeeCategoryMaster::where('fee_id',$id)->get();
		$recordExist = $info[0]->fee_id??0;

		if(!$recordExist){
			return response()->json(["status" => "failed", "message" => "Whoops! failed to edit, fee category does not exist!!","errors" =>'']);
		}
		else {
			return response()->json(["status" =>'successed', "success" => true, "message" => "Fee Category record found successfully","data" =>$info]);
		}

   }
   public function update(Request $request, $id)
   {
	    $inputs=$request->all();
		$type=$request->fee_type;

		$info = FeeCategoryMaster::where('fee_id',$id)->get();
		$fee_title = $info[0]->name??'';

		if($type !=$info[0]->fee_type)
		{
			$type_rule=($type=='other')?'required':'required|unique:fee_category_master,fee_type';
		}
		else
		{
			$type_rule='required';
		}

		if($fee_title !=$request->title)
		{
			$title_rule='required|unique:fee_category_master,name|min:3|max:255';

		}
		else
		{
			$title_rule='required|min:3|max:255';
		}

        // validate inputs

		$validator = Validator::make($request->all(), [
            'title' => $title_rule,
            'fee_type' => $type_rule,
			'applicable' => 'required',
			'changeable' => 'required',
			'printable' => 'required'
        ]);

        // if validation fails
        if($validator->fails()) {
			$errors=$validator->errors();
            $response_arr = array(
                "status" => "failed",
                "message" => "Please fill all required fields.",
                "errors" => $errors,
                "data" => []
            );
        }
		else
		{
			$updateArr = array(
				'name'=>$request->title,
				'fee_type'=>$request->fee_type,
				'applicable'=>$request->applicable,
				'changeable'=>$request->changeable,
				'printable'=>$request->printable
			);

			$updated=FeeCategoryMaster::where('fee_id',$id)->update($updateArr);
			if($updated)
			{
				$response_arr = array("status" =>'successed',"message" => "Fee Category updated successfully","data" =>[]);
			}
			else
			{
				$response_arr = array("status" =>'failed',"message" => "Fee Category could not updated!!","data" =>[]);
			}
		}
        return response()->json($response_arr);
   }

   public function delete($id)
    {
		$info = FeeCategoryMaster::where('fee_id',$id)->get();

        if(!empty($info))
		{
			/* $slots = RouteMaster::select(DB::raw('count(*) as record_count'))
             ->whereRaw("FIND_IN_SET($id,stationList)")
             ->get();

			if($routes[0]->record_count>0)
			{
				return response()->json(["status" => "failed","success" => false,"message" => "Whoops! failed to delete, station having routes!!","errors" =>'']);
			}
			else
			{
				// FeeCategoryMaster::where('fee_id',$id)->delete();
				return response()->json(["status" =>'successed', "success" => true, "message" => "fee category record deleted successfully","data" => '']);
			} */

			FeeCategoryMaster::where('fee_id',$id)->delete();
			return response()->json(["status" =>'successed', "success" => true, "message" => "Fee Category record deleted successfully","data" => '']);

		}
		else
		{
			return response()->json(["status" => "failed","success" => false,"message" => "Whoops! failed to delete,!!","errors" =>'']);
		}

    }

	public function listAll()
	{
        $categories= FeeCategoryMaster::orderBy('fee_id','ASC')->get();

        if(!empty($categories)) {
			return response()->json(["status" => 'successed',"data" => $categories]);
		}
		else {
			return response()->json(["status" => "failed","message" => "Whoops! no record found","data" =>""]);
		}
    }

}
