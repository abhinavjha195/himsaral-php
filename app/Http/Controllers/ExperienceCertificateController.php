<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\Models\Employee;
use App\Models\School;
use Barryvdh\DomPDF\Facade\Pdf;

class ExperienceCertificateController extends Controller
{
    // public function load(Request $request)
    // {
    // 	$emp_no=$request->all();



    // 	$employees= Employee::where('emp_no',$emp_no)->get();


    //     if(count($employees) > 0)
    // 	{
    //         return response()->json(["status" => "successed", "success" => true,"data" => $employees]);
    //     }
    //     else {
    // 		$response_arr = array('data'=>[],'total'=>0);
    //         return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found","data" => $response_arr]);
    //     }

    // }
    public function load(Request $request)
    {

        $emp_no = $request->all();

        $rules = [
            'emp_no' => "required",
        ];

        $messages = [
            'required' => 'The :attribute field is required.',
        ];

        $fields = [
            'emp_no' => 'Employee No.',
        ];

        $validator = Validator::make($emp_no, $rules, $messages, $fields);

        // if validation fails
        if ($validator->fails()) {
            return response()->json(["status" => "failed", "message" => "Enter Employee No.!!", "errors" => $validator->errors()]);
        } else {

            $employees = Employee::leftjoin("designation_master as dm", 'employees.desig_id', '=', 'dm.designationId')
                ->leftjoin("department_master as dt", 'employees.dept_id', '=', 'dt.departmentId')
                ->select("employees.*", "dm.designationName", "dt.departmentName")
                ->where('emp_no', $emp_no)
                ->get();


            if (count($employees) > 0) {
                return response()->json(["status" => "successed", "success" => true, "data" => $employees]);
            } else {
                $response_arr = array('data' => [], 'total' => 0);
                return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found", "data" => $response_arr]);
            }

        }

    }
    public function printCertificate($id)			
    {

            $school=School::where('school_code','S110')->get();
			$employee=Employee::leftjoin("designation_master as dm", 'employees.desig_id', '=', 'dm.designationId')
            ->leftjoin("department_master as dt", 'employees.dept_id', '=', 'dt.departmentId')
            ->select("employees.*", "dm.designationName", "dt.departmentName")
            ->where('emp_no', $id)
            ->get();

			$data = array('school'=>$school,'employee'=>$employee);

			$receipt_name=$id.'.'.'pdf';

		    $pdf = PDF::loadView("experience_certificate_print",$data)->setPaper('A4')->save(public_path("print/experience_certificate/$receipt_name"));

			$message="Receipt generated successfully, get the receipt.";

			$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data" =>$receipt_name);

		return response()->json($response_arr);

    }
}