<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use App\Exports\FuelConsumptionExport;
use App\Models\FuelConsumption;


use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

class FuelConsumptionReportController extends Controller
{
    public function __construct()
    {
    }


    public function getConsumptionReport($id, $date)
    {
        $arr = explode(',', $date);

        $data = FuelConsumption::leftJoin('vehicles as vc', 'fuel_consumption.vehicle_id', '=', 'vc.id')
            ->leftJoin('supplier_master as sm', 'fuel_consumption.supplier_id', '=', 'sm.id')
            ->leftJoin('payment_modes as pm', 'fuel_consumption.payment_id', '=', 'pm.id')
            ->leftJoin('fuel_types as ft', 'fuel_consumption.fuel_id', '=', 'ft.id')
            ->select('fuel_consumption.*', 'vc.registration_no', 'sm.supplier_name', 'pm.pay_mode', 'ft.type')
            ->where('fuel_consumption.vehicle_id', $id)
            ->whereBetween('fuel_consumption.filling_date', [$arr])
            ->get();


        if (count($data) > 0) {
            return response()->json(["status" => "successed", "success" => true, "data" => $data]);
        } else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found", "data" => $data]);
        }
    }

    public function getExcel(Request $request)
    {
        $id=$request->vechile_id;
        $arr = explode(',',$request->date);


        $data = FuelConsumption::leftJoin('vehicles as vc', 'fuel_consumption.vehicle_id', '=', 'vc.id')
            ->leftJoin('supplier_master as sm', 'fuel_consumption.supplier_id', '=', 'sm.id')
            ->leftJoin('payment_modes as pm', 'fuel_consumption.payment_id', '=', 'pm.id')
            ->leftJoin('fuel_types as ft', 'fuel_consumption.fuel_id', '=', 'ft.id')
            ->select('fuel_consumption.*', 'vc.registration_no', 'sm.supplier_name', 'pm.pay_mode', 'ft.type')
            ->where('fuel_consumption.vehicle_id', $id)
            ->whereBetween('fuel_consumption.filling_date', [$arr])
            ->get();

            ob_end_clean();
            ob_start();
            $name = $id.'.xlsx';
            $name = 'export_' . now()->format('Y-m-d') . '.xlsx';
            return Excel::download(new FuelConsumptionExport($data), $name);
    }
}
