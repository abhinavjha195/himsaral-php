<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

use App\Models\QualificationMaster;
use App\Models\Employee;
use Illuminate\Support\Facades\DB;


class QualificationController extends Controller
{
    public function index(Request $request)
	{
        $search = $request->search;
        $limit = $request->limit;
        $page = $request->page;
        $order = $request->order;
        $order_by = $request->orderBy;

        $offset = ($page - 1) * $limit;

        $query1 = QualificationMaster::select(DB::raw('count(*) as row_count'));
        if ($search != '') {
            $query1->where('qualificationName', 'like', '%' . $search . '%');
        }

        $records = $query1->get();

        $query2 = QualificationMaster::select('qualification_master.*')
            ->offset($offset)->limit($limit);
        if ($search != '') {
            $query2->where('qualificationName', 'like', '%' . $search . '%');
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
            'title' => "required|unique:qualification_master,qualificationName|max:20",
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
                "qualificationName" => $request->title,

            );

            $qualification = QualificationMaster::create($insertArray);

            if (!is_null($qualification)) {

                return response()->json(["status" => 'successed', "success" => true, "message" => "Qualification record created successfully", "data" => $qualification]);

            } else {
                return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! failed to create."]);
            }

        }

    }


    public function edit($id)
    {
        $qualificationInfo = QualificationMaster::where('qualificationId', $id)->get();
        $recordExist = $qualificationInfo[0]->qualificationId ?? 0;

        if (!$recordExist) {
            return response()->json(["status" => "failed", "message" => "Whoops! failed to edit, Qualification does not exist!!", "errors" => '']);
        } else {
            return response()->json(["status" => 'successed', "success" => true, "message" => "Qualification record found successfully", "data" => $qualificationInfo]);
        }

    }


    public function update(Request $request, $id)
    {
        $inputs = $request->all();

        $qualificationInfo = QualificationMaster::where('qualificationId', $id)->get();
        $qualificationTitle = $qualificationInfo[0]->qualificationName ?? '';
        $qualificationId = 0;

        if ($qualificationTitle != $request->title) {
            $conditionArr = array(
                "qualificationName" => $request->title
            );

            $qualificationInfo = QualificationMaster::where($conditionArr)->get();
            $qualificationId = $qualificationInfo[0]->qualificationId ?? 0;

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
        } else if ($qualificationId > 0) {
            return response()->json(["status" => "failed", "message" => "Qualification already exist!!", "errors" => '']);
        } else {
            $updateArray = array(
                "qualificationName" => $request->title

            );

            QualificationMaster::where('qualificationId', $id)->update($updateArray);

            return response()->json(["status" => 'successed', "success" => true, "message" => "Qualification record edited successfully", "data" => '']);

        }
    }

    public function delete($id)
    {
		$checkExist=Employee::select(DB::raw('count(*) as row_count'))->where('qualify_id',$id)->get();

		if($checkExist[0]->row_count>0)
		{
			return response()->json(["status" => "failed","success" => false,"message" => "Whoops! failed to delete, qualification having employees!!","errors" =>'',"data" => []]);
		}
		else
		{
			$delete = QualificationMaster::where('qualificationId', '=', $id)->delete();
			if ($delete) {
				return response()->json(["status" =>'successed', "success" => true, "message" => "qualification deleted successfully","data" => []]);
			} else {
				return response()->json(["status" => "failed","success" => false,"message" => "could not deleted!!","errors" =>'',"data" => []]);
			}

		}

    }



}
