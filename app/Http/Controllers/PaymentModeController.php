<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

use App\Models\PaymentMode;
use Illuminate\Support\Facades\DB;

class PaymentModeController extends Controller
{
	public function __construct()
    {
        // DB::statement("SET SQL_MODE=''");
    }

    public function index(Request $request)
	{
        $search = $request->search;
        $limit = $request->limit;
        $page = $request->page;
        $order = $request->order;
        $order_by = $request->orderBy;

        $offset = ($page - 1) * $limit;

        $query1 = PaymentMode::select(DB::raw('count(*) as row_count'));
        if ($search != '') {
            $query1->where('pay_mode', 'like', '%' . $search . '%')
                ->orWhere('pay_type', 'like', '%' . $search . '%');
        }

        $records = $query1->get();

        $query2 = PaymentMode::select('payment_modes.*')
            ->offset($offset)->limit($limit);
        if ($search != '') {
            $query2->where('pay_mode', 'like', '%' . $search . '%')
            ->orWhere('pay_type', 'like', '%' . $search . '%');
        }
        if ($order_by != '') {
            $query2->orderBy($order_by, $order);
        }

        $pay_modes = $query2->get();

        if (count($pay_modes) > 0) {
            $response_arr = array('data' => $pay_modes, 'total' => $records[0]->row_count);
            return response()->json(["status" => "successed", "success" => true, "data" => $response_arr]);
        } else {
            $response_arr = array('data' => [], 'total' => 0);
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found", "data" => $response_arr]);
        }
    }

	public function add(Request $request)
	{
		$inputs=$request->all();
		$mode=empty($request->pay_mode)?'':$request->pay_mode;
		$type=empty($request->pay_type)?'':$request->pay_type;

		$type_rule=($type=='other')?'required':'required|unique:payment_modes,pay_type';

		$rules=[
			'pay_mode' => 'required|unique:payment_modes|max:255',
			'pay_type' => $type_rule
		];

		$messages = [
			'required' => 'The :attribute field is required.',
		];

		$fields = [
			'pay_mode' => 'Payment Mode',
			'pay_type' => 'Payment Type'
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

			$response_arr=array("status"=>"failed","success"=>false,"message"=>$message);

        }
		else
		{
			$insert_arr =array(
				'pay_mode'=>$mode,
				'pay_type'=>$type
			);

			$insert=PaymentMode::create($insert_arr);

			if($insert)
			{
				$message="Payment mode created successfully";
				$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"data" =>$insert);
			}
			else
			{
				$message="could not created!!";
				$response_arr=array("status"=>'failed',"success"=>false,"message"=>$message,"data"=>[]);

			}

		}

		return response()->json($response_arr);

	}

   public function edit($id)
   {
		$info = PaymentMode::where('id',$id)->get();

		if(count($info)>0){
			return response()->json(["status" =>'successed', "success" => true, "message" => "Payment mode record found successfully","data" =>$info]);
		}
		else {
			return response()->json(["status" => "failed", "message" => "Whoops! failed to edit, payment mode does not exist!!","errors" =>'']);
		}

   }

   public function update(Request $request, $id)
   {
	    $inputs=$request->all();
		$type=$request->pay_type;

		$info = PaymentMode::where('id',$id)->get();
		$pay_title = $info[0]->pay_mode??'';

		if($type !=$info[0]->pay_type)
		{
			$type_rule=($type=='other')?'required':'required|unique:payment_modes,pay_type';
		}
		else
		{
			$type_rule='required';
		}

		if($pay_title !=$request->pay_mode)
		{
			$pay_rule='required|unique:payment_modes|max:255';
		}
		else
		{
			$pay_rule='required|min:3|max:255';
		}

		$rules=[
			'pay_mode' => $pay_rule,
			'pay_type' => $type_rule
		];

		$messages = [
			'required' => 'The :attribute field is required.',
		];

		$fields = [
			'pay_mode' => 'Payment Mode',
			'pay_type' => 'Payment Type'
		];

        // validate inputs
        $validator = Validator::make($inputs, $rules, $messages, $fields);

        // if validation fails
        if($validator->fails()) {

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

			$response_arr=array("status"=>"failed","message"=>$message,"errors"=>$errors);
            return response()->json($response_arr);

        }
		else
		{
			$updateArr       =  array(
				"pay_mode"   =>      $request->pay_mode,
				"pay_type"   =>     $request->pay_type
			);

			$updated=PaymentMode::where('id',$id)->update($updateArr);
			if($updated)
			{
				return response()->json(["status" =>'successed', "success" => true, "message" => "Payment mode record edited successfully","data" =>$updated]);
			}
			else
			{
				return response()->json(["status" =>'failed', "success" => false, "message" => "could not edited!!","data" =>[]]);
			}

		}
   }
   public function delete($id)
   {
		$info = PaymentMode::where('id',$id)->get();

		if(count($info)>0)
		{
			$del=PaymentMode::where('id',$id)->delete();
			if($del)
			{
				return response()->json(["status" =>'successed', "success" => true, "message" => "Payment mode record deleted successfully","data" =>[]]);
			}
			else
			{
				return response()->json(["status" => "failed","success" => false,"message" => "Whoops! failed to delete,!!","errors" =>'']);
			}

		}
		else
		{
			return response()->json(["status" => "failed","success" => false,"message" => "Whoops! payment mode does not exist!!","errors" =>'']);
		}

    }

}
