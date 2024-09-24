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
use Illuminate\Support\Facades\DB;


class DepartmentController extends Controller
{

    public function index(Request $request)
	{
        $search = $request->search;
        $limit = $request->limit;
        $page = $request->page;
        $order = $request->order;
        $order_by = $request->orderBy;

        $offset = ($page - 1) * $limit;

        $query1 = DepartmentMaster::select(DB::raw('count(*) as row_count'));
        if ($search != '') {
            $query1->where('departmentName', 'like', '%' . $search . '%');
        }

        $records = $query1->get();

        $query2 = DepartmentMaster::select('department_master.*')
            ->offset($offset)->limit($limit);
        if ($search != '') {
            $query2->where('departmentName', 'like', '%' . $search . '%');
        }
        if ($order_by != '') {
            $query2->orderBy($order_by, $order);
        }

        $departments = $query2->get();

        if (count($departments) > 0) {
            $response_arr = array('data' => $departments, 'total' => $records[0]->row_count);
            return response()->json(["status" => "successed", "success" => true, "data" => $response_arr]);
        } else {
            $response_arr = array('data' => [], 'total' => 0);
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found", "data" => $response_arr]);
        }
    }

    public function create(Request $request)
    {

        $inputs = $request->all();

        $rules = [
            'title' => "required|unique:department_master,departmentName|max:20|min:5",
        ];

        $messages = [
            'required' => 'The :attribute field is required.',
        ];

        $fields = [
            'title' => 'Title',
        ];

        $validator = Validator::make($inputs, $rules, $messages, $fields);

        // if validation fails
        if ($validator->fails()) {
            return response()->json(["status" => "failed", "message" => "Please fill all fields!!", "errors" => $validator->errors()]);
        } else {
            $insertArray = array(
                "departmentName" => $request->title,

            );

            $department = DepartmentMaster::create($insertArray);

            if (!is_null($department)) {

                return response()->json(["status" => 'successed', "success" => true, "message" => "Department record created successfully", "data" => $department]);

            } else {
                return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! failed to create."]);
            }

        }

    }


    public function edit($id)
    {
        $departmentInfo = DepartmentMaster::where('departmentId', $id)->get();
        $recordExist = $departmentInfo[0]->departmentId ?? 0;

        if (!$recordExist) {
            return response()->json(["status" => "failed", "message" => "Whoops! failed to edit, department does not exist!!", "errors" => '']);
        } else {
            return response()->json(["status" => 'successed', "success" => true, "message" => "department record found successfully", "data" => $departmentInfo]);
        }

    }


    public function update(Request $request, $id)
    {
        $inputs = $request->all();

        $departmentInfo = DepartmentMaster::where('departmentId', $id)->get();
        $departmentTitle = $departmentInfo[0]->departmentName ?? '';
        $departmentId = 0;

        if ($departmentTitle != $request->title) {
            $conditionArr = array(
                "departmentName" => $request->title
            );

            $departmentInfo = DepartmentMaster::where($conditionArr)->get();
            $departmentId = $departmentInfo[0]->departmentId ?? 0;

        }

        // validate inputs
        $validator = Validator::make(
            $inputs,
            [
                "title" => "required"
            ]
        );

        // if validation fails
        if ($validator->fails()) {
            return response()->json(["status" => "failed", "message" => "Please fill all fields!!", "errors" => $validator->errors()]);
        } else if ($departmentId > 0) {
            return response()->json(["status" => "failed", "message" => "Department already exist!!", "errors" => '']);
        } else {
            $updateArray = array(
                "departmentName" => $request->title

            );

            DepartmentMaster::where('departmentId', $id)->update($updateArray);

            return response()->json(["status" => 'successed', "success" => true, "message" => "Department record edited successfully", "data" => '']);

        }
    }

    public function delete($id)
    {
		$checkExist=DesignationMaster::select(DB::raw('count(*) as row_count'))->where('departmentId',$id)->get();

		if($checkExist[0]->row_count>0)
		{
			return response()->json(["status" => "failed","success" => false,"message" => "Whoops! failed to delete, department having designations!!","errors" =>'',"data" => []]);
		}
		else
		{
			$delete = DepartmentMaster::where('departmentId', '=', $id)->delete();
			if ($delete) {
				return response()->json(["status" =>'successed', "success" => true, "message" => "department deleted successfully","data" => []]);
			} else {
				return response()->json(["status" => "failed","success" => false,"message" => "could not deleted!!","errors" =>'',"data" => []]);
			}

		}



    }



}
