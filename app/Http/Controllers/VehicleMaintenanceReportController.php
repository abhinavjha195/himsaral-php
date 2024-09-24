<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;

use App\Http\Controllers\Controller;

use App\Models\Vehicle; 
use App\Models\MaintenanceMaster;
use App\Models\VehicleMaintenanceTransaction;		

use Illuminate\Support\Facades\DB;

class VehicleMaintenanceReportController extends Controller
{
    //
    public function __construct()
    {
		 DB::statement("SET SQL_MODE=''");     
    }

    public function getMaintenance($id)
    {
        $type = VehicleMaintenanceTransaction::leftJoin('vehicles as vc', 'vehicle_maintenance_transaction.vehicle_id', '=', 'vc.id')
        ->leftJoin('maintenance_master as mt', 'vehicle_maintenance_transaction.maintenance_id', '=', 'mt.maintenance_id')
        ->select(
                'vehicle_maintenance_transaction.*',
                'mt.maintenance_type',
            )
        ->where('vehicle_maintenance_transaction.vehicle_id', $id)
        ->groupBy('maintenance_id')
        ->get();

        if(count($type) > 0) {
            return response()->json(["status" => "successed", "success" => true, "count" => count($type), "data" => $type]);
        }
        else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found"]);
        }
    }



    public function getMaintenanceReport(Request $request)
    {
        $id=$request->vechile_id;
        $arr = explode(',',$request->filter);
        $arr2 = explode(',', $request->range);

        //  return response()->json(["status" => "successed", "success" => true, "data" => $request->all()]);

        $search = $request->search;
		$limit = $request->limit;
		$page = $request->page;
		$order = $request->order;
		$order_by = $request->orderBy;
		$offset = ($page-1)*$limit;

        $query1 = VehicleMaintenanceTransaction::leftJoin('vehicles as vc', 'vehicle_maintenance_transaction.vehicle_id', '=', 'vc.id')
        ->leftJoin('maintenance_master as mt', 'vehicle_maintenance_transaction.maintenance_id', '=', 'mt.maintenance_id')
        ->where('vehicle_maintenance_transaction.vehicle_id', $id)
        ->whereIn('vehicle_maintenance_transaction.maintenance_id',$arr)
        ->whereBetween('vehicle_maintenance_transaction.maintenance_date', [$arr2])
        ->select(DB::raw('count(*) as row_count'));

        if ($search != '') {
            $query1->where('maintenance_date', 'like', '%'.$search.'%')
                    ->orwhere('bill_no', 'like', '%'.$search.'%')
                    ->orwhere('mt.maintenance_type', 'like', '%'.$search.'%')
                    ->orwhere('vc.registration_no', 'like', '%'.$search.'%')
                    ->orwhere('vehicle_maintenance_transaction.description', 'like', '%'.$search.'%')
                    ->orwhere('expenses', 'like', '%'.$search.'%');

        }

        $records = $query1->get();

        $query2 =VehicleMaintenanceTransaction::leftJoin('vehicles as vc', 'vehicle_maintenance_transaction.vehicle_id', '=', 'vc.id')
        ->leftJoin('maintenance_master as mt', 'vehicle_maintenance_transaction.maintenance_id', '=', 'mt.maintenance_id')
        ->select(
            'vehicle_maintenance_transaction.*',
            'vc.registration_no',
            'mt.maintenance_type',
            'mt.description'
        )
        ->where('vehicle_maintenance_transaction.vehicle_id', $id)
        ->whereIn('vehicle_maintenance_transaction.maintenance_id',$arr)
        ->whereBetween('vehicle_maintenance_transaction.maintenance_date', [$arr2])
        ->offset($offset)->limit($limit);

        if ($search != '') {
            $query2->where('maintenance_date', 'like', '%'.$search.'%')
            ->orwhere('bill_no', 'like', '%'.$search.'%')
            ->orwhere('mt.maintenance_type', 'like', '%'.$search.'%')
            ->orwhere('vc.registration_no', 'like', '%'.$search.'%')
            ->orwhere('vehicle_maintenance_transaction.description', 'like', '%'.$search.'%')
            ->orwhere('expenses', 'like', '%'.$search.'%');
        }

        if ($order_by != '') {
            $query2->orderBy($order_by, $order);
        }

        $data = $query2->get();

        if (count($data) > 0) {
            $response_arr = array('data' => $data, 'total' => $records[0]->row_count);
            return response()->json(["status" => "successed", "success" => true, "data" => $response_arr, "msg"=>$limit, "offset"=>$offset]);
        } else {
            $response_arr = array('data' => [], 'total' => 0);
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found", "data" => $response_arr]);
        }


    }
}
