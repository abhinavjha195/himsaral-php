<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

use App\Models\StudentRegisterTwo;
use App\Models\RouteMaster;
use App\Models\Vehicle;
use Illuminate\Support\Facades\DB;

class VehicleController extends Controller
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

        $query1 = Vehicle::leftJoin('route_master as rm', 'vehicles.route_id', '=', 'rm.routeId')
        ->select(DB::raw('count(*) as row_count'));
        if ($search != '') {
            $query1->where('registration_no', 'like', '%' . $search . '%')
                ->orWhere('description', 'like', '%' . $search . '%')
                ->orWhere('capacity', 'like', '%' . $search . '%')
                ->orWhere( 'routeNo', 'like', '%' . $search . '%');
        }

        $records = $query1->get();

        $query2 =Vehicle::leftJoin('route_master as rm', 'vehicles.route_id', '=', 'rm.routeId')
        	->select('vehicles.id','vehicles.registration_no','vehicles.description','vehicles.capacity','rm.routeNo')
            ->offset($offset)->limit($limit);
        if ($search != '') {
            $query2->where('registration_no', 'like', '%' . $search . '%')
            ->orWhere('description', 'like', '%' . $search . '%')
            ->orWhere('capacity', 'like', '%' . $search . '%')
            ->orWhere( 'routeNo', 'like', '%' . $search . '%');
        }
        if ($order_by != '') {
            $query2->orderBy($order_by, $order);
        }

        $vehicles = $query2->get();

        if (count($vehicles) > 0) {
            $response_arr = array('data' => $vehicles, 'total' => $records[0]->row_count);
            return response()->json(["status" => "successed", "success" => true, "data" => $response_arr]);
        } else {
            $response_arr = array('data' => [], 'total' => 0);
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found", "data" => $response_arr]);
        }
    }

    public function add(Request $request)
	{
		$inputs=$request->all();

		$rules=[
				'registration_no' => 'required|unique:vehicles|max:255',
				'route_id' => 'required',
				'capacity' => 'required',
				'insurance_amount' => 'required',
				'insurance_date' => 'required',
				'insurance_due' => 'required',
				'insurance_paid' => 'required',
				'tax_amount' => 'required',
				'tax_date' => 'required',
				'tax_due' => 'required',
				'tax_paid' => 'required',
				'passing_date' => 'required',
				'passing_paid' => 'required',
				'renewal_date' => 'required',
				'renewal_paid' => 'required'
			];

			$fields = [
				'registration_no' => 'Vehicle Reg. No.',
				'route_id' => 'Select Route No.',
				'capacity' => 'Seating Capacity',
				'insurance_amount' => 'Insurance Amount',
				'insurance_date' => 'Insurance Date',
				'insurance_due' => 'Insurance Due Date',
				'insurance_paid' => 'Insurance Paid',
				'tax_amount' => 'Tax Amount',
				'tax_date' => 'Tax Date',
				'tax_due' => 'Tax Due Date',
				'tax_paid' => 'Tax Paid',
				'passing_date' => 'Vehicle Passing Date',
				'passing_paid' => 'Vehicle Passing Paid',
				'renewal_date' => 'Vehicle Permit Renewal Date',
				'renewal_paid' => 'Vehicle Permit Renewal Paid'
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
				'registration_no' => $request->registration_no,
				'route_id' => $request->route_id,
				'capacity' => $request->capacity,
				'insurance_amount' => $request->insurance_amount,
				'insurance_date' => date('Y-m-d',strtotime($request->insurance_date)),
				'insurance_due' => date('Y-m-d',strtotime($request->insurance_due)),
				'insurance_paid' => $request->insurance_paid,
				'tax_amount' => $request->tax_amount,
				'tax_date' => date('Y-m-d',strtotime($request->tax_date)),
				'tax_due' => date('Y-m-d',strtotime($request->tax_due)),
				'tax_paid' => $request->tax_paid,
				'passing_date' => date('Y-m-d',strtotime($request->passing_date)),
				'passing_paid' => $request->passing_paid,
				'renewal_date' =>  date('Y-m-d',strtotime($request->renewal_date)),
				'renewal_paid' => $request->renewal_paid,
				'description' => empty($request->description)?'':$request->description,
			);

			$vehicle = Vehicle::create($insert_arr);

			if($vehicle->id)
			{
				$message="Vehicle created successfully";
				$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data" =>$vehicle);
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
		$info = Vehicle::leftJoin('route_master as rm', 'vehicles.route_id', '=', 'rm.routeId')
		->select('vehicles.*','rm.routeNo')
		->where('vehicles.id',$id)
        ->get();

		if(count($info)>0) {
			return response()->json(["status" => 'successed', "success" => true, "data" => $info]);
		}
		else {
			return response()->json(["status" => "failed", "message" => "Whoops! failed to view, vehicle does not exist!!","data" =>[]]);
		}

   }

   public function update(Request $request, $id)
   {
	    $inputs=$request->all();

		$info = Vehicle::where('id',$id)->get();
		$regs_no = (count($info)>0)?$info[0]->registration_no:'';

		if($regs_no !=$request->registration_no)
		{
			$registration_rule='required|unique:vehicles|max:255';
		}
		else
		{
			$registration_rule='required|max:255';
		}

		$rules=[
				'registration_no' => $registration_rule,
				'route_id' => 'required',
				'capacity' => 'required',
				'insurance_amount' => 'required',
				'insurance_date' => 'required',
				'insurance_due' => 'required',
				'insurance_paid' => 'required',
				'tax_amount' => 'required',
				'tax_date' => 'required',
				'tax_due' => 'required',
				'tax_paid' => 'required',
				'passing_date' => 'required',
				'passing_paid' => 'required',
				'renewal_date' => 'required',
				'renewal_paid' => 'required'
			];

			$fields = [
				'registration_no' => 'Vehicle Reg. No.',
				'route_id' => 'Select Route No.',
				'capacity' => 'Seating Capacity',
				'insurance_amount' => 'Insurance Amount',
				'insurance_date' => 'Insurance Date',
				'insurance_due' => 'Insurance Due Date',
				'insurance_paid' => 'Insurance Paid',
				'tax_amount' => 'Tax Amount',
				'tax_date' => 'Tax Date',
				'tax_due' => 'Tax Due Date',
				'tax_paid' => 'Tax Paid',
				'passing_date' => 'Vehicle Passing Date',
				'passing_paid' => 'Vehicle Passing Paid',
				'renewal_date' => 'Vehicle Permit Renewal Date',
				'renewal_paid' => 'Vehicle Permit Renewal Paid'
			];

			$messages = [
				'required' => 'The :attribute field is required.',
			];

		$validator = Validator::make($inputs, $rules, $messages, $fields);

        // if validation fails
        if($validator->fails()) {

			$errors=$validator->errors();
			$response_arr=array("status"=>"failed","message"=>"Please fill required fields!!","errors"=>$errors);
        }
		else
		{
			$update_arr = array(
				'registration_no' => $request->registration_no,
				'route_id' => $request->route_id,
				'capacity' => $request->capacity,
				'insurance_amount' => $request->insurance_amount,
				'insurance_date' => date('Y-m-d',strtotime($request->insurance_date)),
				'insurance_due' => date('Y-m-d',strtotime($request->insurance_due)),
				'insurance_paid' => $request->insurance_paid,
				'tax_amount' => $request->tax_amount,
				'tax_date' => date('Y-m-d',strtotime($request->tax_date)),
				'tax_due' => date('Y-m-d',strtotime($request->tax_due)),
				'tax_paid' => $request->tax_paid,
				'passing_date' => date('Y-m-d',strtotime($request->passing_date)),
				'passing_paid' => $request->passing_paid,
				'renewal_date' =>  date('Y-m-d',strtotime($request->renewal_date)),
				'renewal_paid' => $request->renewal_paid,
				'description' => empty($request->description)?'':$request->description,
			);

			$updated=Vehicle::where('id',$id)->update($update_arr);

			if($updated)
			{
				$response_arr=array("status" =>'successed', "success" => true, "message" => "Vehicle record edited successfully","data" =>$updated,"errors"=>[]);
			}
			else
			{
				$response_arr=array("status" =>'failed', "success" => false, "message" => "could not edited!!","data" =>[],"errors"=>[]);
			}
		}

		return response()->json($response_arr);
   }
   public function delete($id)
   {
		$info = Vehicle::where('id',$id)->get();

        if(count($info)>0)
		{
			$transports = StudentRegisterTwo::select(DB::raw('count(*) as record_count'))
             ->where("bus_no",$id)
             ->get();

			if($transports[0]->record_count>0)
			{
				return response()->json(["status" => "failed","success" => false,"message" => "Whoops! failed to delete, students having this vehicle!!","errors" =>[],"data" => []]);
			}
			else
			{
				$del=Vehicle::where('id',$id)->delete();
				if($del)
				{
					return response()->json(["status" =>'successed', "success" => true, "message" => "vehicle record deleted successfully","data" => []]);
				}
				else
				{
					return response()->json(["status" =>'successed', "success" => true, "message" => "could not deleted !!","data" => []]);
				}

			}

		}
		else
		{
			return response()->json(["status" => "failed","success" => false,"message" => "Whoops! failed to delete,!!","errors" =>'']);
		}

    }

	public function getAllRoutes() {

        $routes = RouteMaster::all();
        if(count($routes) > 0) {
            return response()->json(["status" => "successed", "success" => true,"data" => $routes]);
        }
        else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found"]);
        }
    }

}
