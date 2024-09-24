<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

use App\Models\DepartmentMaster;
use App\Models\DesignationMaster;
use App\Models\Employee;
use Illuminate\Support\Facades\DB;


class DesignationController extends Controller
{


    public function index(Request $request)
	{
        $search = $request->search;
        $limit = $request->limit;
        $page = $request->page;
        $order = $request->order;
        $order_by = $request->orderBy;

        $offset = ($page - 1) * $limit;

        $query1 = DesignationMaster::leftJoin('department_master', 'designation_master.departmentId', '=', 'department_master.departmentId')
        ->select(DB::raw('count(*) as row_count'));
        if ($search != '') {
            $query1->where('departmentName', 'like', '%' . $search . '%')
            ->orWhere('designationName', 'like', '%' . $search . '%');
        }

        $records = $query1->get();

        $query2 = DesignationMaster::leftJoin('department_master', 'designation_master.departmentId', '=', 'department_master.departmentId')
            ->select('designation_master.*', 'department_master.departmentName')
            ->offset($offset)->limit($limit);
        if ($search != '') {
            $query2->where('departmentName', 'like', '%' . $search . '%')
            ->orWhere('designationName', 'like', '%' . $search . '%');
        }
        if ($order_by != '') {
            $query2->orderBy($order_by, $order);
        }

        $designations = $query2->get();

        if (count($designations) > 0) {
            $response_arr = array('data' => $designations, 'total' => $records[0]->row_count);
            return response()->json(["status" => "successed", "success" => true, "data" => $response_arr]);
        } else {
            $response_arr = array('data' => [], 'total' => 0);
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found", "data" => $response_arr]);
        }
    }

    public function getDepartment() {

        $departments = DepartmentMaster::all();
        if(count($departments) > 0) {
            return response()->json(["status" => "successed", "success" => true, "count" => count($departments), "data" => $departments]);
        }
        else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found"]);
        }
    }
    public function create(Request $request) {

		$inputs=$request->all();

		$rules=[
            "departmentId"        =>      "required",
			'title' 		   => 	   "required|max:255",
        ];

		$messages = [
			'required' => 'The :attribute field is required.',
		];

		$fields = [
			'departmentId' => 'Department Name',
			'title' => 'Title',
		];

		$validator = Validator::make($inputs, $rules, $messages, $fields);

        // if validation fails
        if($validator->fails()) {
            return response()->json(["status" => "failed","message" => "Please fill all fields!!", "errors" => $validator->errors()]);
        }
		else
		{
			 $departmentId                =       $request->departmentId;

			 $insertArray              =       array(
				"departmentId"            =>      $request->departmentId,
				"designationName"           =>      $request->title,
			);

			$designation = DesignationMaster::create($insertArray);

				if(!is_null($designation)) {

					return response()->json(["status" =>'successed', "success" => true, "message" => "designation record created successfully","data" => $designation]);

				}
				else {
					return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! failed to create."]);
				}

		}

    }

    public function edit($id)
   {
		$designationInfo = DesignationMaster::where('designationId',$id)->get();
		$recordExist = $designationInfo[0]->designationId??0;

		$department_string = '';

		if(!$recordExist){
			 return response()->json(["status" => "failed", "message" => "Whoops! failed to edit, designation does not exist!!","errors" =>'']);
		}
		else {

			$designation_data = DesignationMaster::leftJoin('department_master', 'designation_master.departmentId', '=', 'department_master.departmentId')
					->select('designation_master.*', 'department_master.departmentName')
					->select('designation_master.*', 'department_master.departmentName')
					->where('designation_master.designationId',$id)
					->get();

			$departments = DepartmentMaster::all();

			$data_arr=array('department_data'=>$departments,'designation_data'=>$designation_data);

			return response()->json(["status" =>'successed', "success" => true, "message" => "Department record edited successfully","data" => $data_arr]);
		}

   }

   public function update(Request $request, $id)
   {
	    $inputs=$request->all();

		$designationInfo = DesignationMaster::where('designationId',$id)->get();
		$designationTitle = $designationInfo[0]->designationName??'';
		$designationId = 0;

		if($designationTitle !=$request->title)
		{
			$conditionArr              =       array(
				"departmentId"            =>      $request->department_id,
				"designationName"           =>      $request->title
			);

			$designationInfo = DesignationMaster::where($conditionArr)->get();
			$designationId =  $designationInfo[0]->designationId??0;

		}

        // validate inputs
        $validator = Validator::make($inputs,
            [
                "department_id"        =>      "required",
                "title"            =>      "required",
            ]
        );

        // if validation fails
        if($validator->fails()) {
            return response()->json(["status" => "failed","message" => "Please fill all fields!!", "errors" => $validator->errors()]);
        }
		else if($designationId >0)
		{
			 return response()->json(["status" => "failed","message" => "Designation already exist!!", "errors" => '']);
		}
		else
		{
			$updateArray              =       array(
				"departmentId"            =>      $request->department_id,
				"designationName"           =>      $request->title,

			);

			DesignationMaster::where('designationId',$id)->update($updateArray);

			return response()->json(["status" =>'successed', "success" => true, "message" => "Designation record edited successfully","data" => '']);

		}
   }


    public function delete($id)
    {
		$checkExist=Employee::select(DB::raw('count(*) as row_count'))->where('desig_id',$id)->get();

		if($checkExist[0]->row_count>0)
		{
			return response()->json(["status" => "failed","success" => false,"message" => "Whoops! failed to delete, designation having employees!!","errors" =>'',"data" => []]);
		}
		else
		{
			$delete = DesignationMaster::where('designationId', '=', $id)->delete();
			if ($delete) {
				return response()->json(["status" =>'successed', "success" => true, "message" => "designation deleted successfully","data" => []]);
			} else {
				return response()->json(["status" => "failed","success" => false,"message" => "could not deleted!!","errors" =>'',"data" => []]);
			}

		}


    }

}
