<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

use App\Models\RouteMaster;
use App\Models\StationMaster;
use Illuminate\Support\Facades\DB;

class RouteController extends Controller
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

        $query1= RouteMaster::leftJoin("station_master", DB::raw("FIND_IN_SET('station_master.stationId','route_master.stationList')"),">", DB::raw("'0'"))
        ->selectRaw("COUNT(*) as count");
        if ($search != '') {
            $query1->where('route_master.routeNo', 'like', '%' . $search . '%')
                ->orWhere('station_master.stationName', 'like', '%' . $search . '%');
        }

        $records = $query1->get();

        // $query2 = RouteMaster::leftjoin("station_master",DB::raw("FIND_IN_SET('station_master.stationId','route_master.stationList')"),">",DB::raw("'0'"))
        // 	->selectRaw("route_master.routeId,route_master.routeNo,group_concat(station_master.stationName SEPARATOR', ') AS stations")
        //     ->groupBy('route_master.routeId');
        $query2 = RouteMaster::leftjoin("station_master",DB::raw('FIND_IN_SET(station_master.stationId,route_master.stationList)'),">",DB::raw("'0'"))
		->selectRaw("route_master.routeId,route_master.routeNo,group_concat(station_master.stationName SEPARATOR', ') AS stations")
        ->groupBy('route_master.routeId');
        if ($search != '') {
            $query2->where('routeNo', 'like', '%' . $search . '%')
            ->orWhere('stationName', 'like', '%' . $search . '%');
        }
        if ($order_by != '') {
            $query2->orderBy($order_by, $order);
        }

        $routes = $query2->offset($offset)->limit($limit)->get();

        if (count($routes) > 0) {
            $response_arr = array('data' => $routes, 'total' => $records[0]->count);
            return response()->json(["status" => "successed", "success" => true, "data" => $response_arr]);
        } else {
            $response_arr = array('data' => [], 'total' => 0);
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found", "data" => $response_arr]);
        }
    }

    public function create(Request $request)
	{
		$validator = Validator::make($request->all(), [
            'routeno' => 'required|unique:route_master,routeNo|max:255',
			'stations' => 'required'
        ]);

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

			$response_arr=array("status"=>"failed","message"=>$message,"errors"=>$errors);
            return response()->json($response_arr);
        }
		else
		{
			$insert_arr = array(
				'routeNo'=>$request->routeno,
				'stationList'=>implode(',',$request->stations)
			);

			$route = RouteMaster::create($insert_arr);

			if($route->id)
			{
				$message="Route created successfully";
				$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data" =>$route);
			}
			else
			{
				$message="could not created!!";
				$response_arr=array("status"=>'failed',"success"=>false,"message"=>$message,"errors"=>[],"data"=>[]);
			}

			return response()->json($response_arr);

		}

	}

   public function edit($id)
   {
		$stations = StationMaster::all();

		$info = RouteMaster::leftjoin("station_master",DB::raw('FIND_IN_SET(station_master.stationId,route_master.stationList)'),">",DB::raw("'0'"))
		->selectRaw("route_master.routeId,route_master.routeNo,group_concat(concat(station_master.stationName,':',station_master.stationId) SEPARATOR', ') AS stations")
        ->where('route_master.routeId',$id)
		->get();

		if(!empty($info)){
			$response_arr=array('route_data'=>$info,'station_data'=>$stations);
			return response()->json(["status" => 'successed',"message" =>"","data" =>$response_arr]);
		}
		else {
			return response()->json(["status" => "failed", "message" => "Whoops! failed to view, route does not exist!!","data" =>[]]);
		}

   }

   public function update(Request $request, $id)
   {
	    $inputs=$request->all();

		$info = RouteMaster::where('routeId',$id)->get();
		$route_no = $info[0]->routeNo??'';

		if($route_no !=$request->routeno)
		{
			$route_rule='required|unique:route_master,routeNo|min:1|max:255';
		}
		else
		{
			$route_rule='required|min:1|max:255';
		}

        // validate inputs
        $validator = Validator::make($request->all(), [
            'routeno' => $route_rule,
			'stations' => 'required'
        ]);

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
			$updateArr = array(
				'routeNo'=>$request->routeno,
				'stationList'=>implode(',',$request->stations)
			);

			$updated=RouteMaster::where('routeId',$id)->update($updateArr);
			if($updated)
			{
				return response()->json(["status" =>'successed', "success" => true, "message" => "route record edited successfully","data" =>[]]);
			}
			else
			{
				return response()->json(["status" =>'failed', "success" => false, "message" => "could not edited!!","data" =>[]]);
			}

		}
   }
   public function delete($id)
   {
		$info = RouteMaster::where('routeId',$id)->get();

        if(!empty($info))
		{
			$list = $info[0]->stationList;
			$stations = StationMaster::select(DB::raw('count(*) as record_count'))
             ->whereRaw("FIND_IN_SET(stationId,$list)")
             ->get();

			if($stations[0]->record_count>0)
			{
				return response()->json(["status" => "failed","success" => false,"message" => "Whoops! failed to delete, route having stations!!","errors" =>'',"data" => []]);
			}
			else
			{
				RouteMaster::where('routeId',$id)->delete();
				return response()->json(["status" =>'successed', "success" => true, "message" => "route record deleted successfully","data" => []]);
			}

		}
		else
		{
			return response()->json(["status" => "failed","success" => false,"message" => "Whoops! failed to delete,!!","errors" =>'']);
		}

    }

	public function getStations() {

        $stations = StationMaster::all();
        if(count($stations) > 0) {
            return response()->json(["status" => "successed", "success" => true,"data" => $stations]);
        }
        else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found"]);
        }
    }

}
