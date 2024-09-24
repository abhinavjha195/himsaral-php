<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

use App\Models\FuelConsumption;
use App\Models\SupplierMaster;
use App\Models\Vehicle;
use App\Models\PaymentMode;		
use App\Models\FuelType;

use Illuminate\Support\Facades\DB;

class FuelConsumptionController extends Controller
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

        $offset = ($page - 1) * $limit;

        $query1 = FuelConsumption::leftJoin('vehicles as vc', 'fuel_consumption.vehicle_id', '=', 'vc.id')
                ->leftJoin('supplier_master as sm', 'fuel_consumption.supplier_id', '=', 'sm.id')
                ->leftJoin('payment_modes as pm', 'fuel_consumption.payment_id', '=', 'pm.id')
                ->leftJoin('fuel_types as ft', 'fuel_consumption.fuel_id', '=', 'ft.id')
                ->select(DB::raw('count(*) as row_count'));

        if ($search != '') {
            $query1->where('filling_date', 'like', '%'.$search.'%')
                    ->orwhere('bill_no', 'like', '%'.$search.'%')
                    ->orwhere('fuel_qty', 'like', '%'.$search.'%')
                    ->orwhere('amount', 'like', '%'.$search.'%')
                    ->orwhere('type', 'like', '%'.$search.'%')
                    ->orwhere('pay_mode', 'like', '%'.$search.'%');
        }

        $records = $query1->get();

        $query2 = FuelConsumption::leftJoin('vehicles as vc', 'fuel_consumption.vehicle_id', '=', 'vc.id')
                ->leftJoin('supplier_master as sm', 'fuel_consumption.supplier_id', '=', 'sm.id')
                ->leftJoin('payment_modes as pm', 'fuel_consumption.payment_id', '=', 'pm.id')
                ->leftJoin('fuel_types as ft', 'fuel_consumption.fuel_id', '=', 'ft.id')
                ->select('fuel_consumption.*','vc.registration_no', 'sm.supplier_name', 'pm.pay_mode', 'ft.type')
                ->offset($offset)->limit($limit);

        if ($search != '') {
            $query2->where('filling_date', 'like', '%'.$search.'%')
            ->orwhere('bill_no', 'like', '%'.$search.'%')
            ->orwhere('fuel_qty', 'like', '%'.$search.'%')
            ->orwhere('amount', 'like', '%'.$search.'%')
            ->orwhere('type', 'like', '%'.$search.'%')
            ->orwhere('pay_mode', 'like', '%'.$search.'%');
        }

        if ($order_by != '') {
            $query2->orderBy($order_by, $order);
        }

        $suppliers = $query2->get();

        if (count($suppliers) > 0) {
            $response_arr = array('data' => $suppliers, 'total' => $records[0]->row_count);
            return response()->json(["status" => "successed", "success" => true, "data" => $response_arr]);
        } else {
            $response_arr = array('data' => [], 'total' => 0);
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found", "data" => $response_arr]);
        }
    }


    public function getSupplier() {

        $suppliers = SupplierMaster::all();
        if(count($suppliers) > 0) {
            return response()->json(["status" => "successed", "success" => true, "count" => count($suppliers), "data" => $suppliers]);
        }
        else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found"]);
        }
    }

    public function getVehicle() {

        $vehicles = Vehicle::all();
        if(count($vehicles) > 0) {
            return response()->json(["status" => "successed", "success" => true, "count" => count($vehicles), "data" => $vehicles]);
        }
        else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found"]);
        }
    }

    public function getPaymentMode() {

        $payments = PaymentMode::all();
        if(count($payments) > 0) {
            return response()->json(["status" => "successed", "success" => true, "count" => count($payments), "data" => $payments]);
        }
        else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found"]);
        }
    }

    public function getFuelType() {

        $type = FuelType::all();
        if(count($type) > 0) {
            return response()->json(["status" => "successed", "success" => true, "count" => count($type), "data" => $type]);
        }
        else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found"]);
        }
    }



    public function create(Request $request) {

		$inputs=$request->all();

		$rules=[
            'vehicle_id'        => "required",
            'filling_date'      => "required",
            'bill_no'           => "required|unique:fuel_consumption,bill_no",
            'supplier_id'       => "required",
            'fuel_id'           => "required",
            'payment_id'        => "required",
            'fuel_qty'          => "required",
            'amount'            => "required",
            'start_dist'        => "required",
            'end_dist'          => "required",
        ];

		$messages = [
			'required' => 'The :attribute field is required.',
            'unique'   => 'The :attribute is already taken',
		];

		$fields = [
            'vehicle_id'        => "Vehicle No",
            'filling_date'      => "Date",
            'bill_no'           => "Bill/Boucher No",
            'supplier_id'       => "Supplier",
            'fuel_id'           => "Fuel Type",
            'payment_id'        => "Payment Mode",
            'fuel_qty'          => "Quantity",
            'amount'            => "Amount",
            'start_dist'        => "Starting Distance",
            'end_dist'          => "Ending Distance",
		];

		$validator = Validator::make($inputs, $rules, $messages, $fields);

        // if validation fails
        if($validator->fails()) {
            return response()->json(["status" => "failed","message" => "Please fill all fields!!", "errors" => $validator->errors()]);
        }
		else
		{

			 $insertArray          =   array(
                'vehicle_id'       =>  $request->vehicle_id,
                'filling_date'     =>  $request->filling_date,
                'bill_no'          =>  $request->bill_no,
                'supplier_id'      =>  $request->supplier_id,
                'fuel_id'          =>  $request->fuel_id,
                'payment_id'       =>  $request->payment_id,
                'fuel_qty'         =>  $request->fuel_qty,
                'amount'           =>  $request->amount,
                'start_dist'       =>  $request->start_dist,
                'end_dist'         =>  $request->end_dist,

			);

			$consumption = FuelConsumption::create($insertArray);

				if(!is_null($consumption)) {

					return response()->json(["status" =>'successed', "success" => true, "message" => "Fuel Consumption record created successfully","data" => $consumption]);

				}
				else {
					return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! failed to create."]);
				}

		}

    }

    public function edit($id)
    {
         $fuelConsumptionInfo = FuelConsumption::where('id',$id)->get();
         $recordExist = $fuelConsumptionInfo[0]->id??0;


         if(!$recordExist){
              return response()->json(["status" => "failed", "message" => "Whoops! failed to edit, Fuel consumption does not exist!!","errors" =>'']);
         }
         else {

             $fuel_consumption_data = FuelConsumption::leftJoin('vehicles as vc', 'fuel_consumption.vehicle_id', '=', 'vc.id')
                                    ->leftJoin('supplier_master as sm', 'fuel_consumption.supplier_id', '=', 'sm.id')
                                    ->leftJoin('payment_modes as pm', 'fuel_consumption.payment_id', '=', 'pm.id')
                                    ->leftJoin('fuel_types as ft', 'fuel_consumption.fuel_id', '=', 'ft.id')
                                    ->where('fuel_consumption.id',$id)
                                    ->get();

             $vehicles = Vehicle::all();
             $suppliers = SupplierMaster::all();
             $fuels = FuelType::all();
             $payment = PaymentMode::all();

             $data_arr=array('vehicle_data'=>$vehicles, 'fuel_data'=>$fuels, 'supplier_data'=>$suppliers, 'payment_data'=>$payment, 'fuel_consumption_data'=>$fuel_consumption_data);

             return response()->json(["status" =>'successed', "success" => true, "message" => "Fuel Consumption record edited successfully","data" => $data_arr]);
         }

    }


    public function update(Request $request, $id)
    {
        $inputs = $request->all();

        $info = FuelConsumption::where('id', $id)->get();

        if (count($info) > 0) {

            $rules = [
                'vehicle_id'        => "required",
                'filling_date'      => "required",
                'bill_no'           => "required",
                'supplier_id'       => "required",
                'fuel_id'           => "required",
                'payment_id'        => "required",
                'fuel_qty'          => "required",
                'amount'            => "required",
                'start_dist'        => "required",
                'end_dist'          => "required",
            ];

            $fields = [
                'vehicle_id'        => "Vehicle No",
                'filling_date'      => "Date",
                'bill_no'           => "Bill/Boucher No",
                'supplier_id'       => "Supplier",
                'fuel_id'           => "Fuel Type",
                'payment_id'        => "Payment Mode",
                'fuel_qty'          => "Quantity",
                'amount'            => "Amount",
                'start_dist'        => "Starting Distance",
                'end_dist'          => "Ending Distance",
            ];

            $messages = [
                'required' => 'The :attribute field is required.',
                'unique'   => 'The :attribute is already taken',
            ];

            $validator = Validator::make($inputs, $rules, $messages, $fields);

            if ($validator->fails()) {
                $errors = $validator->errors();
                $response_arr = array("status" => "failed", "message" => "Please fill required fields!!", "errors" => $errors);
            } else {
                $update_arr = array(
                    'vehicle_id'       =>  $request->vehicle_id,
                    'filling_date'     =>  $request->filling_date,
                    'bill_no'          =>  $request->bill_no,
                    'supplier_id'      =>  $request->supplier_id,
                    'fuel_id'          =>  $request->fuel_id,
                    'payment_id'       =>  $request->payment_id,
                    'fuel_qty'         =>  $request->fuel_qty,
                    'amount'           =>  $request->amount,
                    'start_dist'       =>  $request->start_dist,
                    'end_dist'         =>  $request->end_dist,
                );

                $update = FuelConsumption::where('id', $id)->update($update_arr);

                if ($update) {
                    $message = "Fuel Consumption record updated successfully";
                    $response_arr = array("status" => 'successed', "success" => true, "errors" => [], "message" => $message, "data" => $id);
                } else {
                    $message = "Could not update!!Record already exists";
                    $response_arr = array("status" => 'failed', "success" => false, "errors" => [], "message" => $message, "data" => []);
                }
            }
            //
        } else {
            $response_arr = array("status" => "failed", "success" => false, "message" => "Whoops! no record found!!", "errors" => '', "data" => []);
        }

        return response()->json($response_arr);
    }


    public function delete($id)
    {
        $delete = FuelConsumption::where('id',$id)->delete();
        if ($delete) {
            return ['status' => True, 'message' => 'Fuel Consumption Deleted'];
        } else {
            return ['status' => False, 'message' => 'Fuel Consumption not Deleted'];
        }

    }
}
