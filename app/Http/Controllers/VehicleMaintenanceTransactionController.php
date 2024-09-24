<?php
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

use App\Models\VehicleMaintenanceTransaction;
use App\Models\MaintenanceMaster;
use App\Models\Vehicle;
use Illuminate\Support\Facades\DB;

class VehicleMaintenanceTransactionController extends Controller
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

        $query1 = VehicleMaintenanceTransaction::leftJoin('vehicles as vc', 'vehicle_maintenance_transaction.vehicle_id', '=', 'vc.id')
                ->leftJoin('maintenance_master as mt', 'vehicle_maintenance_transaction.maintenance_id', '=', 'mt.maintenance_id')
                ->select(DB::raw('count(*) as row_count'));

        if ($search != '') {
            $query1->where('maintenance_date', 'like', '%'.$search.'%')
                    ->orwhere('expenses', 'like', '%'.$search.'%')
                    ->orwhere('maintenance_type', 'like', '%'.$search.'%')
                    ->orwhere('bill_no', 'like', '%'.$search.'%')
                    ->orWhere('registration_no', 'like', '%'.$search.'%');
        }

        $records = $query1->get();

        $query2 = VehicleMaintenanceTransaction::leftJoin('vehicles as vc', 'vehicle_maintenance_transaction.vehicle_id', '=', 'vc.id')
                ->leftJoin('maintenance_master as mt', 'vehicle_maintenance_transaction.maintenance_id', '=', 'mt.maintenance_id')
                ->select('vehicle_maintenance_transaction.*','vc.registration_no', 'mt.maintenance_type')
                ->offset($offset)->limit($limit);

        if ($search != '') {
            $query2->where('maintenance_date', 'like', '%'.$search.'%')
            ->orwhere('expenses', 'like', '%'.$search.'%')
            ->orwhere('maintenance_type', 'like', '%'.$search.'%')
            ->orwhere('bill_no', 'like', '%'.$search.'%')
            ->orWhere('registration_no', 'like', '%'.$search.'%');
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


    public function getMaintenance() {

        $maintenances = MaintenanceMaster::all();
        if(count($maintenances) > 0) {
            return response()->json(["status" => "successed", "success" => true, "count" => count($maintenances), "data" => $maintenances]);
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


    public function create(Request $request) {

		$inputs=$request->all();

		$rules=[
            'maintenance_date'  => "required",
            'maintenance_id'    => "required",
            'vehicle_id'        => "required",
            'description'       => "required",
            'bill_no'           => "required",
            'expenses'          => "required"
        ];

		$messages = [
			'required' => 'The :attribute field is required.',
		];

		$fields = [
            'maintenance_date'  => "Date",
            'maintenance_id'    => "Maintenance Type",
            'vehicle_id'        => "Vehicle No",
            'description'       => "Description",
            'bill_no'           => "Bill No",
            'expenses'          => "Expenses",
		];

		$validator = Validator::make($inputs, $rules, $messages, $fields);

        // if validation fails
        if($validator->fails()) {
            return response()->json(["status" => "failed","message" => "Please fill all fields!!", "errors" => $validator->errors()]);
        }
		else
		{

			 $insertArray              =       array(
                'maintenance_date'     =>      $request->maintenance_date,
                'maintenance_id'       =>      $request->maintenance_id,
                'vehicle_id'           =>      $request->vehicle_id,
                'description'          =>      $request->description,
                'bill_no'              =>      $request->bill_no,
                'expenses'             =>      $request->expenses,
			);

			$maintenances = VehicleMaintenanceTransaction::create($insertArray);

				if(!is_null($maintenances)) {

					return response()->json(["status" =>'successed', "success" => true, "message" => "Vehicle maintenances record created successfully","data" => $maintenances]);

				}
				else {
					return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! failed to create."]);
				}

		}

    }

    public function edit($id)
    {
         $vehicleMaintainInfo = VehicleMaintenanceTransaction::where('id',$id)->get();
         $recordExist = $vehicleMaintainInfo[0]->id??0;


         if(!$recordExist){
              return response()->json(["status" => "failed", "message" => "Whoops! failed to edit, vehicle maintenance does not exist!!","errors" =>'']);
         }
         else {

             $vehicle_maintain_data  = VehicleMaintenanceTransaction::leftJoin('vehicles as vc', 'vehicle_maintenance_transaction.vehicle_id', '=', 'vc.id')
                                ->leftJoin('maintenance_master as mt', 'vehicle_maintenance_transaction.maintenance_id', '=', 'mt.maintenance_id')
                                ->select('vehicle_maintenance_transaction.*','vc.registration_no', 'vc.id', 'mt.maintenance_type', 'mt.maintenance_id')
                                ->where('vehicle_maintenance_transaction.id',$id)
                                ->get();

             $vehicles = Vehicle::all();
             $maintenances = MaintenanceMaster::all();

             $data_arr=array('vehicle_data'=>$vehicles,'maintenance_data'=>$maintenances, 'vehicle_maintain_data'=>$vehicle_maintain_data);

             return response()->json(["status" =>'successed', "success" => true, "message" => "Vehicle maintenance record edited successfully","data" => $data_arr]);
         }

    }


    public function update(Request $request, $id)
    {
        $inputs = $request->all();

        $info = VehicleMaintenanceTransaction::where('id', $id)->get();

        if (count($info) > 0) {

            $rules = [
                'maintenance_date'  => "required",
                'maintenance_id'    => "required",
                'vehicle_id'        => "required",
                'description'       => "required",
                'bill_no'           => "required",
                'expenses'          => "required"
            ];

            $fields = [
                'maintenance_date'  => "Date",
                'maintenance_id'    => "Maintenance Type",
                'vehicle_id'        => "Vehicle No",
                'description'       => "Description",
                'bill_no'           => "Bill No",
                'expenses'          => "Expenses",
            ];

            $messages = [
                'required'  => 'The :attribute field is required.',
            ];

            $validator = Validator::make($inputs, $rules, $messages, $fields);

            if ($validator->fails()) {
                $errors = $validator->errors();
                $response_arr = array("status" => "failed", "message" => "Please fill required fields!!", "errors" => $errors);
            } else {
                $update_arr = array(
                    'maintenance_date'     =>      $request->maintenance_date,
                    'maintenance_id'       =>      $request->maintenance_id,
                    'vehicle_id'           =>      $request->vehicle_id,
                    'description'          =>      $request->description,
                    'bill_no'              =>      $request->bill_no,
                    'expenses'             =>      $request->expenses,
                );

                $update = VehicleMaintenanceTransaction::where('id', $id)->update($update_arr);

                if ($update) {
                    $message = "Vehicle maintenance record updated successfully";
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
        $delete = VehicleMaintenanceTransaction::where('id',$id)->delete();
        if ($delete) {
            return ['status' => True, 'message' => 'Vehicle maintenance Deleted'];
        } else {
            return ['status' => False, 'message' => 'Vehcile maintenance not Deleted'];
        }

    }
}
