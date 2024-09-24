<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;


use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

use App\Models\SupplierMaster;
use Illuminate\Support\Facades\DB;


class SupplierController extends Controller
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

        $query1 = SupplierMaster::select(DB::raw('count(*) as row_count'));
        if ($search != '') {
            $query1->where('location', 'like', '%' . $search . '%')
                ->orWhere('supplier_name', 'like', '%' . $search . '%')
                ->orWhere('gst', 'like', '%' . $search . '%');
        }

        $records = $query1->get();

        $query2 = SupplierMaster::offset($offset)->limit($limit);
        if ($search != '') {
            $query2->where('location', 'like', '%' . $search . '%')
                ->orWhere('supplier_name', 'like', '%' . $search . '%')
                ->orWhere('gst', 'like', '%' . $search . '%');
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


    public function create(Request $request)
    {

        $inputs = $request->all();

        $rules = [
            'email'     => "required|unique:supplier_master,email",
            'supplier_name'     => "required|max:50",
            'gst'       => "required|unique:supplier_master,gst",
            'phone1'    => "required|unique:supplier_master,phone1",
            'phone2'    => "nullable|unique:tableName,phone2",
            'location'  => "required",
            'area_code' => "required",
            'address'   => "required"
        ];

        $messages = [
            'required'  => 'The :attribute field is required.',
            'unique'    => 'THe :attribute field is already taken'
        ];

        $fields = [
            'email'     => 'Email',
            'supplier_name'     => 'Name',
            'gst'       => 'GST',
            'phone1'    => 'Phone',
            'phone2'    => 'Phone',
            'location'  => 'Location',
            'area_code' => 'Area Code',
            'address'   => 'Address'
        ];

        $validator = Validator::make($inputs, $rules, $messages, $fields);

        // if validation fails
        if ($validator->fails()) {
            return response()->json(["status" => "failed", "message" => "Please fill all fields!!", "errors" => $validator->errors()]);
        } else {
            $insertArray = array(
                "email" => $request->email,
                "gst" => $request->gst,
                "supplier_name" => $request->supplier_name,
                "phone1" => $request->phone1,
                "phone2" => $request->phone2,
                "location" => $request->location,
                "area_code" => $request->area_code,
                "address" => $request->address,
                "website" => $request->website,
            );

            $supplier = SupplierMaster::create($insertArray);

            if (!is_null($supplier)) {

                return response()->json(["status" => 'successed', "success" => true, "message" => "Supplier record created successfully", "data" => $supplier]);
            } else {
                return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! failed to create."]);
            }
        }
    }

    public function edit($id)
    {
        $info = SupplierMaster::where('id', $id)->get();

        if (count($info) > 0) {
            return response()->json(["status" => 'successed', "success" => true, "message" => "supplier record found", "data" => $info]);
        } else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found!!", "errors" => '', "data" => []]);
        }
    }


    public function update(Request $request, $id)
    {
        $inputs = $request->all();

        $info = SupplierMaster::where('id', $id)->get();
        $check = 0;

        if (count($info) > 0) {

            $rules = [
                'email'             => "required",
                'supplier_name'     => "required|max:50",
                'gst'               => "required",
                'phone1'            => "required",
                'location'          => "required",
                'area_code'         => "required",
                'address'           => "required"
            ];

            $fields = [
                'email'             => 'Email',
                'supplier_name'     => 'Name',
                'gst'               => 'GST',
                'phone1'            => 'Phone',
                'location'          => 'Location',
                'area_code'         => 'Area Code',
                'address'           => 'Address'
            ];

            $messages = [
                'required'  => 'The :attribute field is required.',
                'unique'    => 'THe :attribute field is already taken'
            ];

            $validator = Validator::make($inputs, $rules, $messages, $fields);

            if ($validator->fails()) {
                $errors = $validator->errors();
                $response_arr = array("status" => "failed", "message" => "Please fill required fields!!", "errors" => $errors);
            } else {
                $update_arr = array(
                    "email" => $request->email,
                    "gst" => $request->gst,
                    "supplier_name" => $request->supplier_name,
                    "phone1" => $request->phone1,
                    "phone2" => $request->phone2,
                    "location" => $request->location,
                    "area_code" => $request->area_code,
                    "address" => $request->address,
                    "website" => $request->website,
                );

                $update = SupplierMaster::where('id', $id)->update($update_arr);

                if ($update) {
                    $message = "supplier record updated successfully";
                    $response_arr = array("status" => 'successed', "success" => true, "errors" => [], "message" => $message, "data" => $id);
                } else {
                    $message = "could not update!!Record already exists";
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
        $delete = SupplierMaster::where('id', $id)->delete();
        if ($delete) {
            return ['status' => True, 'message' => 'Supplier Deleted'];
        } else {
            return ['status' => True, 'message' => 'Supplier not Deleted'];
        }
    }
}
