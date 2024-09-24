<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use App\Models\DepartmentMaster;
use App\Models\DesignationMaster;
use App\Models\QualificationMaster;
use App\Models\LeftEmployee;
use App\Models\EmployeeSubject;
use App\Models\Employee;
use App\Models\School;
use App\Models\SessionMaster;

use PDF;
use Image;
use Helper;


class EmployeeController extends Controller
{
	public function index(Request $request)
	{
		$inputs=$request->all();

		$search = $request->search;
		$limit = $request->limit;
		$page = $request->page;
		$order = $request->order;
		$order_by = $request->orderBy;

		$offset = ($page-1)*$limit;

		$query1 = Employee::select(DB::raw('count(*) as row_count'))->where('status',1);
		if($search !='')
		{
			$query1->where('emp_name', 'like', '%'.$search.'%')
				   ->orWhere('email', 'like', '%'.$search.'%');
		}

		$records = $query1->get();

		$query2 = Employee::where('status',1)->offset($offset)->limit($limit);
		if($search !='')
		{
			$query2->where('emp_name', 'like', '%'.$search.'%')
				   ->orWhere('email', 'like', '%'.$search.'%');
		}
		if($order_by !='')
		{
			$query2->orderBy($order_by,$order);
		}

		$employees = $query2->get();

        if(count($employees) > 0)
		{
			$response_arr = array('data'=>$employees,'total'=>$records[0]->row_count,'input'=>$inputs);
            return response()->json(["status" => "successed", "success" => true,"data" => $response_arr]);
        }
        else {
			$response_arr = array('data'=>[],'total'=>0);
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found","data" => $response_arr]);
        }

    }

	public function add(Request $request)
	{
		$inputs=$request->all();
        $school_code = $request->input('schoolId');
		$tab=$request->tab;
		$insert_id=empty($request->insert_id)?'':$request->insert_id;
		$email_rule=$image_rule=$image_name="";
		// $email_rule=$image_rule=$image_name=$school_code="";

        $fiscal_yr=Helper::getFiscalYear(date('m'));
        $fiscal_arr=explode(':',$fiscal_yr);
        $fiscalYear=SessionMaster::where('session_start',$fiscal_arr[0])->where('session_end',$fiscal_arr[1])->get();
        $session_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0;
		// $session_id=0;

		if($insert_id)
		{
			$info = Employee::where('id',$insert_id)->get();
		}

		$messages = array('required'=>'The :attribute field is required.');

		if($tab=='personal-details')
		{
			if($insert_id)
			{
				$email_rule=($request->email==$info[0]->email)?'required|max:255':'required|unique:employees|max:255';
			}
			else
			{
				$email_rule='required|unique:employees|max:255';
			}
			if($request->file('employee_image')!=null)
			{
				$image_rule = 'required|image|mimes:jpeg,png,jpg|max:5120';
			}

			$rules=[
				'employee_image' => $image_rule,
				'employee_name' => 'required',
				// 'caste' => 'required',
				'dob' => 'required',
				// 'gender' => 'required',
				// 'nationality' => 'required',
				// 'marital_status'=>'required',
				// 'religion' => 'required',
				'mobile' => 'required',
				'email' => $email_rule,
				'father_name' => 'required',
				'mother_name' => 'required',
				// 'permanent_address' => 'required',
			];

			$fields = [
				'employee_image' => 'Employee Image',
				'employee_name' => 'Employee Name',
				'dob' => 'Date of Birth',
				'gender' => 'Gender',
				'nationality' => 'Nationality',
				'marital_status' => 'Maritial Status',
				'caste' => 'Caste',
				'religion' => 'Religion',
				'mobile' => 'Mobile No.',
				'email' => 'Email',
				'permanent_address' => 'Permanent Address',
				'father_name' => 'Father Name',
				'mother_name' => 'Mother Name'
			];

		}
		else if($tab=='employement-details')
		{
			$rules=[
				'employee_code' => 'required',
				'login_id' => 'required',
				'designation_id' => 'required',
				'doj' => 'required',
				'department' => 'required',
				// 'account_no'=>'required',
				// 'bank_name' => 'required',
				// 'branch_name' => 'required',
				// 'pan_no' => 'required',
				// 'ifsc_code' => 'required',
				// 'annual_income' => 'required',
				// 'salary_grade' => 'required',
				// 'leaves_allow' => 'required',
				// 'adhar_no' => 'required',
			];

			$fields = [
				'employee_code' => 'Employee Code',
				'login_id' => 'Employee Login Id',
				'designation_id' => 'Designation',
				'doj' => 'Date of Joining',
				'department' => 'Department',
				'account_no'=>'Account No',
				'bank_name' => 'Bank Name',
				'branch_name' => 'Branch Name',
				'pan_no' => 'PAN No',
				'ifsc_code' => 'IFSC Code',
				'annual_income' => 'Annual Income',
				'salary_grade' => 'Salary Grade',
				'leaves_allow' => 'Leaves Permitted',
				'adhar_no' => 'Aadhar No',
			];
		}
		else if($tab=='academics-details')
		{
			$rules=[
				// 'academic' => 'required',
				// 'qualification' => 'required',
				// 'state_id' => 'required',
				// 'passing_year' => 'required',
				// 'percentage' => 'required',
				// 'university'=>'required',
			];

			$fields = [
				'academic' => 'Full/Part Time',
				'qualification' => 'Qualification',
				'state_id' => 'State',
				'passing_year' => 'Passing Year',
				'percentage' => 'Percentage',
				'university'=>'University/Board',
			];
		}
		else if($tab=='previous-experience')
		{
			$rules=[
				// 'institution' => 'required',
				// 'designation' => 'required',
				// 'salary' => 'required',
				// 'reason' => 'required',
				// 'job' => 'required',
				// 'start'=>'required',
				// 'end'=>'required',
			];

			$fields = [
				'institution' => 'Company/Institute Name',
				'designation' => 'Designation',
				'salary' => 'Salary Withdrawn',
				'reason' => 'Leaving Reason',
				'job' => 'Job Nature',
				'start'=>'From',
				'end'=>'To',
			];
		}
		else
		{
			$rules=$fields=array();
		}

		$validator = Validator::make($inputs, $rules, $messages, $fields);

        if ($validator->fails()) {
			$errors=$validator->errors();
			$response_arr=array("status"=>"failed","success"=>false,"message"=>"Please fill required fields!!","errors"=>$errors);
        }
		else
		{
			if($request->hasFile('employee_image'))
			{
				$image      = $request->file('employee_image');
				$imageDimensions = getimagesize($image);

				$width = $imageDimensions[0];
				$height = $imageDimensions[1];

				$new_width = $this->setDimension($width);
				$new_height = $this->setDimension($height);

				$image_name = time().rand(3, 9).'.'.$image->getClientOriginalExtension();

				$destinationPath1 = public_path('/uploads/employee_image/thumbnail/');

				$imgFile = Image::make($image->getRealPath());
				$imgFile->resize($new_height,$new_width,function($constraint){
					$constraint->aspectRatio();
				})->save($destinationPath1.'/'.$image_name);

				$destinationPath2 = public_path('/uploads/employee_image/');
				$image->move($destinationPath2, $image_name);
			}

			if($insert_id)
			{
				if($tab=='personal-details')
				{
					$update_arr=array(
						'school_id'=>$school_code,
						'session_id'=>$session_id,
						'emp_no'=>empty($request->employee_code)?'':$request->employee_code,
						'emp_name'=>empty($request->employee_name)?'':$request->employee_name,
						'dob'=>empty($request->dob)?'1900-01-01':$request->dob,
						'gender'=>empty($request->gender)?'':$request->gender,
						'caste'=>empty($request->caste)?'':$request->caste,
						'nationality'=>empty($request->nationality)?'':$request->nationality,
						'religion'=>empty($request->religion)?'':$request->religion,
						'marital_status'=>empty($request->marital_status)?'':$request->marital_status,
						'permanent_address'=>empty($request->permanent_address)?'':$request->permanent_address,
						'temporary_address'=>empty($request->temporary_address)?'':$request->temporary_address,
						'mobile'=>empty($request->mobile)?'':$request->mobile,
						'email'=>empty($request->email)?'':$request->email,
						'father_name'=>empty($request->father_name)?'':$request->father_name,
						'father_mobile'=>empty($request->f_mobile)?'':$request->f_mobile,
						'mother_name'=>empty($request->mother_name)?'':$request->mother_name,
						'emp_image'=>($image_name=='')?$info[0]->emp_image:$image_name,
					);
				}
				else if($tab=='employement-details')
				{
					$update_arr=array(
						'emp_no'=>empty($request->employee_code)?'':$request->employee_code,
						'login_id'=>empty($request->login_id)?'':$request->login_id,
						'doj'=>empty($request->doj)?'1900-01-01':$request->doj,
						'dept_id'=>empty($request->department)?0:$request->department,
						'desig_id'=>empty($request->designation_id)?0:$request->designation_id,
						'account_no'=>empty($request->account_no)?'':$request->account_no,
						'bank_name'=>empty($request->bank_name)?'':$request->bank_name,
						'branch_name'=>empty($request->branch_name)?'':$request->branch_name,
						'pan'=>empty($request->pan_no)?'':$request->pan_no,
						'ifsc'=>empty($request->ifsc_code)?'':$request->ifsc_code,
						'annual_income'=>empty($request->annual_income)?0.0:$request->annual_income,
						'salary_grade'=>empty($request->salary_grade)?0.0:$request->salary_grade,
						'grade_cbse'=>empty($request->grade_cbse)?0.0:$request->grade_cbse,
						'leaves_permitted'=>empty($request->leaves_allow)?0:$request->leaves_allow,
						'aadhar'=>empty($request->adhar_no)?'':$request->adhar_no,
					);
				}
				else if($tab=='academics-details')
				{
					$update_arr=array(
						'academic'=>empty($request->academic)?'':$request->academic,
						'state_id'=>empty($request->state_id)?0:$request->state_id,
						'qualify_id'=>empty($request->qualification)?0:$request->qualification,
						'passing_year'=>empty($request->passing_year)?'':$request->passing_year,
						'percentage'=>empty($request->percentage)?0.0:$request->percentage,
						'university'=>empty($request->university)?'':$request->university,
					);
				}
				else if($tab=='previous-experience')
				{
					$update_arr=array(
						'salary_withdrawn'=>empty($request->salary)?'':$request->salary,
						'leaving_reason'=>empty($request->reason)?'':$request->reason,
						'institute'=>empty($request->institution)?'':$request->institution,
						'job_nature'=>empty($request->job)?'':$request->job,
						'job_title'=>empty($request->designation)?'':$request->designation,
						'job_from'=>empty($request->start)?'1900-01-01':$request->start,
						'job_to'=>empty($request->end)?'1900-01-01':$request->end,
					);
				}
				else
				{
					$update_arr=array();
				}

				$update=Employee::where('id',$insert_id)->update($update_arr);

				if($update)
				{
					$message="Details updated successfully";
					$response_arr=array("status"=>'successed',"success"=>true,"errors"=>[],"message"=>$message,"data" =>$insert_id);
				}
				else
				{
					$message="could not saved!!";
					$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);
				}
			}
			else
			{
				if($tab=='personal-details')
				{
					$insert_arr=array(
						'emp_name'=>empty($request->employee_name)?'':$request->employee_name,
						'dob'=>empty($request->dob)?'1900-01-01':$request->dob,
						'gender'=>empty($request->gender)?'':$request->gender,
						'caste'=>empty($request->caste)?'':$request->caste,
						'nationality'=>empty($request->nationality)?'':$request->nationality,
						'religion'=>empty($request->religion)?'':$request->religion,
						'marital_status'=>empty($request->marital_status)?'':$request->marital_status,
						'permanent_address'=>empty($request->permanent_address)?'':$request->permanent_address,
						'temporary_address'=>empty($request->temporary_address)?'':$request->temporary_address,
						'mobile'=>empty($request->mobile)?'':$request->mobile,
						'email'=>empty($request->email)?'':$request->email,
						'father_name'=>empty($request->father_name)?'':$request->father_name,
						'father_mobile'=>empty($request->f_mobile)?'':$request->f_mobile,
						'mother_name'=>empty($request->mother_name)?'':$request->mother_name,
						'status'=>empty($request->status)?1:$request->status,
						'emp_no'=>empty($request->employee_code)?'':$request->employee_code,
						'login_id'=>empty($request->login_id)?'':$request->login_id,
						'doj'=>empty($request->doj)?'1900-01-01':$request->doj,
						'dept_id'=>empty($request->department)?0:$request->department,
						'desig_id'=>empty($request->designation_id)?0:$request->designation_id,
						'account_no'=>empty($request->account_no)?'':$request->account_no,
						'bank_name'=>empty($request->bank_name)?'':$request->bank_name,
						'branch_name'=>empty($request->branch_name)?'':$request->branch_name,
						'pan'=>empty($request->pan_no)?'':$request->pan_no,
						'ifsc'=>empty($request->ifsc_code)?'':$request->ifsc_code,
						'annual_income'=>empty($request->annual_income)?0.0:$request->annual_income,
						'salary_grade'=>empty($request->salary_grade)?0.0:$request->salary_grade,
						'grade_cbse'=>empty($request->grade_cbse)?0.0:$request->grade_cbse,
						'leaves_permitted'=>empty($request->leaves_allow)?0:$request->leaves_allow,
						'aadhar'=>empty($request->adhar_no)?'':$request->adhar_no,
						'academic'=>empty($request->academic)?'':$request->academic,
						'state_id'=>empty($request->state_id)?0:$request->state_id,
						'qualify_id'=>empty($request->qualification)?0:$request->qualification,
						'passing_year'=>empty($request->passing_year)?'':$request->passing_year,
						'percentage'=>empty($request->percentage)?0.0:$request->percentage,
						'university'=>empty($request->university)?'':$request->university,
						'salary_withdrawn'=>empty($request->salary)?0.0:$request->salary,
						'leaving_reason'=>empty($request->reason)?'':$request->reason,
						'institute'=>empty($request->institution)?'':$request->institution,
						'job_nature'=>empty($request->job)?'':$request->job,
						'job_title'=>empty($request->designation)?'':$request->designation,
						'job_from'=>empty($request->start)?'1900-01-01':$request->start,
						'job_to'=>empty($request->end)?'1900-01-01':$request->end,
						'school_id'=>$school_code,
						'emp_image'=>$image_name,
						'session_id'=>$session_id,
					);

				}
				else if($tab=='employement-details')
				{
					$insert_arr=array(
						'emp_name'=>empty($request->employee_name)?'':$request->employee_name,
						'dob'=>empty($request->dob)?'1900-01-01':$request->dob,
						'gender'=>empty($request->gender)?'':$request->gender,
						'caste'=>empty($request->caste)?'':$request->caste,
						'nationality'=>empty($request->nationality)?'':$request->nationality,
						'religion'=>empty($request->religion)?'':$request->religion,
						'marital_status'=>empty($request->marital_status)?'':$request->marital_status,
						'permanent_address'=>empty($request->permanent_address)?'':$request->permanent_address,
						'temporary_address'=>empty($request->temporary_address)?'':$request->temporary_address,
						'mobile'=>empty($request->mobile)?'':$request->mobile,
						'email'=>empty($request->email)?'':$request->email,
						'father_name'=>empty($request->father_name)?'':$request->father_name,
						'father_mobile'=>empty($request->f_mobile)?'':$request->f_mobile,
						'mother_name'=>empty($request->mother_name)?'':$request->mother_name,
						'status'=>empty($request->status)?1:$request->status,
						'emp_no'=>empty($request->employee_code)?'':$request->employee_code,
						'login_id'=>empty($request->login_id)?'':$request->login_id,
						'doj'=>empty($request->doj)?'1900-01-01':$request->doj,
						'dept_id'=>empty($request->department)?0:$request->department,
						'desig_id'=>empty($request->designation_id)?0:$request->designation_id,
						'account_no'=>empty($request->account_no)?'':$request->account_no,
						'bank_name'=>empty($request->bank_name)?'':$request->bank_name,
						'branch_name'=>empty($request->branch_name)?'':$request->branch_name,
						'pan'=>empty($request->pan_no)?'':$request->pan_no,
						'ifsc'=>empty($request->ifsc_code)?'':$request->ifsc_code,
						'annual_income'=>empty($request->annual_income)?0.0:$request->annual_income,
						'salary_grade'=>empty($request->salary_grade)?0.0:$request->salary_grade,
						'grade_cbse'=>empty($request->grade_cbse)?0.0:$request->grade_cbse,
						'leaves_permitted'=>empty($request->leaves_allow)?0:$request->leaves_allow,
						'aadhar'=>empty($request->adhar_no)?'':$request->adhar_no,
						'academic'=>empty($request->academic)?'':$request->academic,
						'state_id'=>empty($request->state_id)?0:$request->state_id,
						'qualify_id'=>empty($request->qualification)?0:$request->qualification,
						'passing_year'=>empty($request->passing_year)?'':$request->passing_year,
						'percentage'=>empty($request->percentage)?0.0:$request->percentage,
						'university'=>empty($request->university)?'':$request->university,
						'salary_withdrawn'=>empty($request->salary)?0.0:$request->salary,
						'leaving_reason'=>empty($request->reason)?'':$request->reason,
						'institute'=>empty($request->institution)?'':$request->institution,
						'job_nature'=>empty($request->job)?'':$request->job,
						'job_title'=>empty($request->designation)?'':$request->designation,
						'job_from'=>empty($request->start)?'1900-01-01':$request->start,
						'job_to'=>empty($request->end)?'1900-01-01':$request->end,
						'school_id'=>$school_code,
						'emp_image'=>$image_name,
						'session_id'=>$session_id,
					);
				}
				else if($tab=='academics-details')
				{
					$insert_arr=array(
						'emp_name'=>empty($request->employee_name)?'':$request->employee_name,
						'dob'=>empty($request->dob)?'1900-01-01':$request->dob,
						'gender'=>empty($request->gender)?'':$request->gender,
						'caste'=>empty($request->caste)?'':$request->caste,
						'nationality'=>empty($request->nationality)?'':$request->nationality,
						'religion'=>empty($request->religion)?'':$request->religion,
						'marital_status'=>empty($request->marital_status)?'':$request->marital_status,
						'permanent_address'=>empty($request->permanent_address)?'':$request->permanent_address,
						'temporary_address'=>empty($request->temporary_address)?'':$request->temporary_address,
						'mobile'=>empty($request->mobile)?'':$request->mobile,
						'email'=>empty($request->email)?'':$request->email,
						'father_name'=>empty($request->father_name)?'':$request->father_name,
						'father_mobile'=>empty($request->f_mobile)?'':$request->f_mobile,
						'mother_name'=>empty($request->mother_name)?'':$request->mother_name,
						'status'=>empty($request->status)?1:$request->status,
						'emp_no'=>empty($request->employee_code)?'':$request->employee_code,
						'login_id'=>empty($request->login_id)?'':$request->login_id,
						'doj'=>empty($request->doj)?'1900-01-01':$request->doj,
						'dept_id'=>empty($request->department)?0:$request->department,
						'desig_id'=>empty($request->designation_id)?0:$request->designation_id,
						'account_no'=>empty($request->account_no)?'':$request->account_no,
						'bank_name'=>empty($request->bank_name)?'':$request->bank_name,
						'branch_name'=>empty($request->branch_name)?'':$request->branch_name,
						'pan'=>empty($request->pan_no)?'':$request->pan_no,
						'ifsc'=>empty($request->ifsc_code)?'':$request->ifsc_code,
						'annual_income'=>empty($request->annual_income)?0.0:$request->annual_income,
						'salary_grade'=>empty($request->salary_grade)?0.0:$request->salary_grade,
						'grade_cbse'=>empty($request->grade_cbse)?0.0:$request->grade_cbse,
						'leaves_permitted'=>empty($request->leaves_allow)?0:$request->leaves_allow,
						'aadhar'=>empty($request->adhar_no)?'':$request->adhar_no,
						'academic'=>empty($request->academic)?'':$request->academic,
						'state_id'=>empty($request->state_id)?0:$request->state_id,
						'qualify_id'=>empty($request->qualification)?0:$request->qualification,
						'passing_year'=>empty($request->passing_year)?'':$request->passing_year,
						'percentage'=>empty($request->percentage)?0.0:$request->percentage,
						'university'=>empty($request->university)?'':$request->university,
						'salary_withdrawn'=>empty($request->salary)?0.0:$request->salary,
						'leaving_reason'=>empty($request->reason)?'':$request->reason,
						'institute'=>empty($request->institution)?'':$request->institution,
						'job_nature'=>empty($request->job)?'':$request->job,
						'job_title'=>empty($request->designation)?'':$request->designation,
						'job_from'=>empty($request->start)?'1900-01-01':$request->start,
						'job_to'=>empty($request->end)?'1900-01-01':$request->end,
						'school_id'=>$school_code,
						'emp_image'=>$image_name,
						'session_id'=>$session_id,
					);
				}
				else if($tab=='previous-experience')
				{
					$insert_arr=array(
						'emp_name'=>empty($request->employee_name)?'':$request->employee_name,
						'dob'=>empty($request->dob)?'1900-01-01':$request->dob,
						'gender'=>empty($request->gender)?'':$request->gender,
						'caste'=>empty($request->caste)?'':$request->caste,
						'nationality'=>empty($request->nationality)?'':$request->nationality,
						'religion'=>empty($request->religion)?'':$request->religion,
						'marital_status'=>empty($request->marital_status)?'':$request->marital_status,
						'permanent_address'=>empty($request->permanent_address)?'':$request->permanent_address,
						'temporary_address'=>empty($request->temporary_address)?'':$request->temporary_address,
						'mobile'=>empty($request->mobile)?'':$request->mobile,
						'email'=>empty($request->email)?'':$request->email,
						'father_name'=>empty($request->father_name)?'':$request->father_name,
						'father_mobile'=>empty($request->f_mobile)?'':$request->f_mobile,
						'mother_name'=>empty($request->mother_name)?'':$request->mother_name,
						'status'=>empty($request->status)?1:$request->status,
						'emp_no'=>empty($request->employee_code)?'':$request->employee_code,
						'login_id'=>empty($request->login_id)?'':$request->login_id,
						'doj'=>empty($request->doj)?'1900-01-01':$request->doj,
						'dept_id'=>empty($request->department)?0:$request->department,
						'desig_id'=>empty($request->designation_id)?0:$request->designation_id,
						'account_no'=>empty($request->account_no)?'':$request->account_no,
						'bank_name'=>empty($request->bank_name)?'':$request->bank_name,
						'branch_name'=>empty($request->branch_name)?'':$request->branch_name,
						'pan'=>empty($request->pan_no)?'':$request->pan_no,
						'ifsc'=>empty($request->ifsc_code)?'':$request->ifsc_code,
						'annual_income'=>empty($request->annual_income)?0.0:$request->annual_income,
						'salary_grade'=>empty($request->salary_grade)?0.0:$request->salary_grade,
						'grade_cbse'=>empty($request->grade_cbse)?0.0:$request->grade_cbse,
						'leaves_permitted'=>empty($request->leaves_allow)?0:$request->leaves_allow,
						'aadhar'=>empty($request->adhar_no)?'':$request->adhar_no,
						'academic'=>empty($request->academic)?'':$request->academic,
						'state_id'=>empty($request->state_id)?0:$request->state_id,
						'qualify_id'=>empty($request->qualification)?0:$request->qualification,
						'passing_year'=>empty($request->passing_year)?'':$request->passing_year,
						'percentage'=>empty($request->percentage)?0.0:$request->percentage,
						'university'=>empty($request->university)?'':$request->university,
						'salary_withdrawn'=>empty($request->salary)?0.0:$request->salary,
						'leaving_reason'=>empty($request->reason)?'':$request->reason,
						'institute'=>empty($request->institution)?'':$request->institution,
						'job_nature'=>empty($request->job)?'':$request->job,
						'job_title'=>empty($request->designation)?'':$request->designation,
						'job_from'=>empty($request->start)?'1900-01-01':$request->start,
						'job_to'=>empty($request->end)?'1900-01-01':$request->end,
						'school_id'=>$school_code,
						'emp_image'=>$image_name,
						'session_id'=>$session_id,
					);
				}
				else
				{
					$insert_arr=array();
				}

				$employee = Employee::create($insert_arr);
				$insert_id = $employee->id;

				if($insert_id)
				{
					$message="Details saved successfully";
					$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>"","data" =>$insert_id);
				}
				else
				{
					$message="could not saved!!";
					$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);
				}
				//
			}

		}

		return response()->json($response_arr);

	}

	public function setDimension($dim)
	{
		if($dim>400)
		{
			$new_dim =400;
		}
		else
		{
			$new_dim = $dim;
		}

		/* if($dim>5000)
		{
			$new_dim = $dim - ($dim*95)/100;
		}
		else if($dim>4000)
		{
			$new_dim = $dim - ($dim*90)/100;
		}
		else if($dim>3000)
		{
			$new_dim = $dim - ($dim*85)/100;
		}
		else if($dim>2000)
		{
			$new_dim = $dim - ($dim*80)/100;
		}
		else if($dim>1000)
		{
			$new_dim = $dim - ($dim*75)/100;
		}
		else if($dim>500)
		{
			$new_dim = $dim - ($dim*70)/100;
		}
		else if($dim>250)
		{
			$new_dim = $dim - ($dim*50)/100;
		}
		else
		{
			$new_dim = $dim;
		}

		if($new_dim>1000)
		{
			$new_dim = $new_dim - ($new_dim*60)/100;
		}
		else if($new_dim>900)
		{
			$new_dim = $new_dim - ($new_dim*55)/100;
		}
		else if($new_dim>800)
		{
			$new_dim = $new_dim - ($new_dim*50)/100;
		}
		else if($new_dim>700)
		{
			$new_dim = $new_dim - ($new_dim*45)/100;
		}
		else if($new_dim>600)
		{
			$new_dim = $new_dim - ($new_dim*40)/100;
		}
		else if($new_dim>500)
		{
			$new_dim = $new_dim - ($new_dim*35)/100;
		}
		else if($new_dim>400)
		{
			$new_dim = $new_dim - ($new_dim*30)/100;
		}
		else if($new_dim>300)
		{
			$new_dim = $new_dim - ($new_dim*25)/100;
		}
		else
		{
			$new_dim = $new_dim;
		} */

		return $new_dim;
	}
	public function getDepartments() {

        $departments = DepartmentMaster::all();
        if(count($departments) > 0) {
            return response()->json(["status" => "successed", "success" => true,"data" => $departments]);
        }
        else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found"]);
        }
    }
	public function getDesignations($id) {

        $designations = DesignationMaster::where('departmentId',$id)->get();
        if(count($designations) > 0) {
            return response()->json(["status" => "successed", "success" => true,"data" => $designations]);
        }
        else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found"]);
        }
    }
	public function getQualifications() {

        $qualifications = QualificationMaster::all();
        if(count($qualifications) > 0) {
            return response()->json(["status" => "successed", "success" => true,"data" => $qualifications]);
        }
        else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found"]);
        }
    }
   public function edit($id)
   {
		$info = Employee::where('id',$id)->get();

		if(count($info)>0)
		{
			return response()->json(["status" =>'successed', "success" => true, "message" => "employee record found","data" => $info]);
		}
		else
		{
			return response()->json(["status" => "failed","success" => false,"message" => "Whoops! no record found!!","errors" =>'',"data" =>[]]);
		}
   }
   public function update(Request $request,$id)
   {
		$inputs=$request->all();
		$tab=$request->tab;
		$email_rule=$image_rule=$image_name=$school_code="";
		$info = Employee::where('id',$id)->get();

		if(count($info)>0)
		{
			$messages = array('required'=>'The :attribute field is required.');

			if($tab=='personal-details')
			{
				$email_rule=($request->email==$info[0]->email)?'required|max:255':'required|unique:employees|max:255';
				if($request->file('employee_image')!=null)
				{
					$image_rule = 'required|image|mimes:jpeg,png,jpg|max:5120';
				}

				$rules=[
					'employee_image' => $image_rule,
					'employee_name' => 'required',
					// 'caste' => 'required|not_in:0',
					'dob' => 'required|date',
					// 'gender' => 'required',
					// 'nationality' => 'required',
					// 'marital_status'=>'required|not_in:0',
					// 'religion' => 'required|not_in:0',
					'mobile' => 'required',
					'email' => $email_rule,
					'father_name' => 'required',
					'mother_name' => 'required',
					// 'permanent_address' => 'required',
				];

				$fields = [
					'employee_image' => 'Employee Image',
					'employee_name' => 'Employee Name',
					'dob' => 'Date of Birth',
					'gender' => 'Gender',
					'nationality' => 'Nationality',
					'marital_status' => 'Maritial Status',
					'caste' => 'Caste',
					'religion' => 'Religion',
					'mobile' => 'Mobile No.',
					'email' => 'Email',
					'permanent_address' => 'Permanent Address',
					'father_name' => 'Father Name',
					'mother_name' => 'Mother Name'
				];

			}
			else if($tab=='employement-details')
			{
				$rules=[
					'employee_code' => 'required',
					'login_id' => 'required',
					'designation_id' => 'required|not_in:0',
					'doj' => 'required',
					'department' => 'required|not_in:0',
					// 'account_no'=>'required',
					// 'bank_name' => 'required',
					// 'branch_name' => 'required',
					// 'pan_no' => 'required',
					// 'ifsc_code' => 'required',
					// 'annual_income' => 'required',
					// 'salary_grade' => 'required',
					// 'leaves_allow' => 'required',
					// 'adhar_no' => 'required',
				];

				$fields = [
					'employee_code' => 'Employee Code',
					'login_id' => 'Employee Login Id',
					'designation_id' => 'Designation',
					'doj' => 'Date of Joining',
					'department' => 'Department',
					'account_no'=>'Account No',
					'bank_name' => 'Bank Name',
					'branch_name' => 'Branch Name',
					'pan_no' => 'PAN No',
					'ifsc_code' => 'IFSC Code',
					'annual_income' => 'Annual Income',
					'salary_grade' => 'Salary Grade',
					'leaves_allow' => 'Leaves Permitted',
					'adhar_no' => 'Aadhar No',
				];
			}
			else if($tab=='academics-details')
			{
				$rules=[
					// 'academic' => 'required|not_in:0',
					// 'qualification' => 'required|not_in:0',
					// 'state_id' => 'required|not_in:0',
					// 'passing_year' => 'required|not_in:0',
					// 'percentage' => 'required',
					// 'university'=>'required',
				];

				$fields = [
					'academic' => 'Full/Part Time',
					'qualification' => 'Qualification',
					'state_id' => 'State',
					'passing_year' => 'Passing Year',
					'percentage' => 'Percentage',
					'university'=>'University/Board',
				];
			}
			else if($tab=='previous-experience')
			{
				$rules=[
					// 'institution' => 'required',
					// 'designation' => 'required',
					// 'salary' => 'required',
					// 'reason' => 'required',
					// 'job' => 'required',
					// 'start'=>'required',
					// 'end'=>'required',
				];

				$fields = [
					'institution' => 'Company/Institute Name',
					'designation' => 'Designation',
					'salary' => 'Salary Withdrawn',
					'reason' => 'Leaving Reason',
					'job' => 'Job Nature',
					'start'=>'From',
					'end'=>'To',
				];
			}
			else
			{
				$rules=$fields=array();
			}

			$validator = Validator::make($inputs, $rules, $messages, $fields);

			if ($validator->fails()) {
				$errors=$validator->errors();
				$response_arr=array("status"=>"failed","success"=>false,"message"=>"Please fill required fields!!","errors"=>$errors);
			}
			else
			{
				if($request->hasFile('employee_image'))
				{
					$image      = $request->file('employee_image');
					$imageDimensions = getimagesize($image);

					$width = $imageDimensions[0];
					$height = $imageDimensions[1];

					$new_width = $this->setDimension($width);
					$new_height = $this->setDimension($height);

					$image_name = time().rand(3, 9).'.'.$image->getClientOriginalExtension();

					$destinationPath1 = public_path('/uploads/employee_image/thumbnail/');

					$imgFile = Image::make($image->getRealPath());
					$imgFile->resize($new_height,$new_width,function($constraint){
						$constraint->aspectRatio();
					})->save($destinationPath1.'/'.$image_name);

					$destinationPath2 = public_path('/uploads/employee_image/');
					$image->move($destinationPath2, $image_name);
				}

				if($tab=='personal-details')
				{
					$update_arr=array(
						'emp_name'=>empty($request->employee_name)?$info[0]->emp_name:$request->employee_name,
						'dob'=>empty($request->dob)?$info[0]->dob:$request->dob,
						'gender'=>empty($request->gender)?$info[0]->gender:$request->gender,
						'caste'=>empty($request->caste)?$info[0]->caste:$request->caste,
						'nationality'=>empty($request->nationality)?$info[0]->nationality:$request->nationality,
						'religion'=>empty($request->religion)?$info[0]->religion:$request->religion,
						'marital_status'=>empty($request->marital_status)?$info[0]->marital_status:$request->marital_status,
						'permanent_address'=>empty($request->permanent_address)?$info[0]->permanent_address:$request->permanent_address,
						'temporary_address'=>empty($request->temporary_address)?$info[0]->temporary_address:$request->temporary_address,
						'mobile'=>empty($request->mobile)?$info[0]->mobile:$request->mobile,
						'email'=>empty($request->email)?$info[0]->email:$request->email,
						'father_name'=>empty($request->father_name)?$info[0]->father_name:$request->father_name,
						'father_mobile'=>empty($request->f_mobile)?$info[0]->father_mobile:$request->f_mobile,
						'mother_name'=>empty($request->mother_name)?$info[0]->mother_name:$request->mother_name,
						'emp_image'=>($image_name=='')?$info[0]->emp_image:$image_name,
					);
				}
				else if($tab=='employement-details')
				{
					$update_arr=array(
						'emp_no'=>empty($request->employee_code)?$info[0]->emp_no:$request->employee_code,
						'login_id'=>empty($request->login_id)?$info[0]->login_id:$request->login_id,
						'doj'=>empty($request->doj)?$info[0]->doj:$request->doj,
						'dept_id'=>empty($request->department)?$info[0]->dept_id:$request->department,
						'desig_id'=>empty($request->designation_id)?$info[0]->desig_id:$request->designation_id,
						'account_no'=>empty($request->account_no)?$info[0]->account_no:$request->account_no,
						'bank_name'=>empty($request->bank_name)?$info[0]->bank_name:$request->bank_name,
						'branch_name'=>empty($request->branch_name)?$info[0]->branch_name:$request->branch_name,
						'pan'=>empty($request->pan_no)?$info[0]->pan:$request->pan_no,
						'ifsc'=>empty($request->ifsc_code)?$info[0]->ifsc:$request->ifsc_code,
						'annual_income'=>empty($request->annual_income)?$info[0]->annual_income:$request->annual_income,
						'salary_grade'=>empty($request->salary_grade)?$info[0]->salary_grade:$request->salary_grade,
						'grade_cbse'=>empty($request->grade_cbse)?$info[0]->grade_cbse:$request->grade_cbse,
						'leaves_permitted'=>empty($request->leaves_allow)?$info[0]->leaves_permitted:$request->leaves_allow,
						'aadhar'=>empty($request->adhar_no)?$info[0]->aadhar:$request->adhar_no,
					);
				}
				else if($tab=='academics-details')
				{
					$update_arr=array(
						'academic'=>empty($request->academic)?$info[0]->academic:$request->academic,
						'state_id'=>empty($request->state_id)?$info[0]->state_id:$request->state_id,
						'qualify_id'=>empty($request->qualification)?$info[0]->qualify_id:$request->qualification,'passing_year'=>empty($request->passing_year)?$info[0]->passing_year:$request->passing_year,
						'percentage'=>empty($request->percentage)?$info[0]->percentage:$request->percentage,
						'university'=>empty($request->university)?$info[0]->university:$request->university,
					);
				}
				else if($tab=='previous-experience')
				{
					$update_arr=array(
						'salary_withdrawn'=>empty($request->salary)?'':$request->salary,
						'leaving_reason'=>empty($request->reason)?'':$request->reason,
						'institute'=>empty($request->institution)?'':$request->institution,
						'job_nature'=>empty($request->job)?'':$request->job,
						'job_title'=>empty($request->designation)?'':$request->designation,
						'job_from'=>empty($request->start)?'1900-01-01':$request->start,
						'job_to'=>empty($request->end)?'1900-01-01':$request->end,
					);
				}
				else
				{
					$update_arr=array();
				}

				$update=Employee::where('id',$id)->update($update_arr);

				if($update)
				{
					$message="Employee record updated successfully";
					$response_arr=array("status"=>'successed',"success"=>true,"errors"=>[],"message"=>$message,"data" =>$id);
				}
				else
				{
					$message="could not update!!";
					$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);
				}

			}

		}
		else
		{
			$message="Whoops! failed to update!!";
			$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);
		}

		return response()->json($response_arr);

   }
	public function delete($id)
    {
		$info = Employee::where('id',$id)->get();

        if(count($info)>0)
		{
			$del=Employee::where('id',$id)->delete();
			if($del)
			{
				EmployeeSubject::where('emp_id',$id)->delete();
				return response()->json(["status" =>'successed', "success" => true, "message" => "employee record deleted successfully","data" => '']);
			}
			else
			{
				return response()->json(["status" =>'failed', "success" => false, "message" => "could not deleted !!","data" => []]);
			}
		}
		else
		{
			return response()->json(["status" => "failed","success" => false,"message" => "Whoops! failed to delete,!!","errors" =>'']);
		}

    }
	public function getId() {
		$ids = Employee::select("employees.id")
		->get();
		if($ids)
			{
				return response()->json(["status" =>'successed', "success" => true, "message" => "Ids fetched successfullly","data" => $ids]);
			}
			else
			{
				return response()->json(["status" =>'failed', "success" => false, "message" => "could not found","data" => []]);
			}
	}
    public function getPrints($id)
    {

            $school=School::where('school_code','S110')->get();
			$employee=Employee::leftJoin('department_master as dm', 'dm.departmentId', '=', 'employees.dept_id')
            ->where('employees.id',$id)
            ->get();

			$data = array('school'=>$school,'employee'=>$employee);

			$receipt_name=time().rand(1,99).'.'.'pdf';

		    $pdf = PDF::loadView("employee_id_print",$data)->setPaper('A4')->save(public_path("print/employee_id/$receipt_name"));

			$message="Receipt generated successfully, get the receipt.";

			$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data" =>$receipt_name);

		return response()->json($response_arr);

    }
    public function getPrintAll($id)
    {

            $school=School::where('school_code','S110')->get();
			$employee=Employee::leftJoin('department_master as dm', 'dm.departmentId', '=', 'employees.dept_id')
            ->whereIn('employees.id',[1, 2, 3, 4, 5])
            ->get();

			$data = array('school'=>$school,'employee'=>$employee);

			$receipt_name=time().rand(1,99).'.'.'pdf';

		    $pdf = PDF::loadView("employee_id_print_all",$data)->setPaper('A4')->save(public_path("print/employee_id/$receipt_name"));

			$message="Receipt generated successfully, get the receipt.";

			$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data" =>$receipt_name);

		return response()->json($response_arr);

    }

	public function loadEmployee(Request $request)
    {

        $emp_no = $request->all();

        $rules = [
            'emp_no' => "required",
        ];

        $messages = [
            'required' => 'The Employee No. field is required.',
        ];

        $fields = [
            'emp_no' => 'Employee No.',
        ];

        $validator = Validator::make($emp_no, $rules, $messages, $fields);

        // if validation fails
        if ($validator->fails()) {
            return response()->json(["status" => "failed", "errors" => $validator->errors()]);
        } else {

            $employees = Employee::where('emp_no', $emp_no )
			->where('status', 1)
			->get();


            if (count($employees)) {
                return response()->json(["status" => "successed", "success" => true, "data" => $employees]);
            } else {
                return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found", "data" => [], "errors"=>"" ]);
            }

        }

    }

	public function leftEmployee(Request $request)
	{
        $input = $request->all();

        $rules = [
			'emp_id' => "unique:left_employees,emp_id",
			'emp_no' => "unique:left_employees,emp_no",
            'reason' => "required",
        ];

        $messages = [
            'required' => 'The :attribute field is required.',
			'unique' => 'The Employee already left',
        ];

        $fields = [
			'emp_id' => "Employee Id",
			'emp_no' => "Employee No.",
            'reason' => 'Reason',
        ];

        $validator = Validator::make($input, $rules, $messages, $fields);

        // if validation fails
        if ($validator->fails()) {
            return response()->json(["status" => "failed", "errors" => $validator->errors()]);
        } else {

			$emp_no = $request->emp_no;
			$insertArr      =     array(
				"emp_id"=>$request->emp_id,
				"emp_no" =>$request->emp_no,
				"leaving_dt"       =>      $request->leaving_dt,
				"reason"           =>      $request->reason,
			);
            $employee = Employee::where('emp_no', $emp_no)->first();


            if ($employee) {
				$employee->status = 0;
            	$employee->save();
        		LeftEmployee::create($insertArr);
				return response()->json(["status" => "successed","message"=>"Employee data updated successfully!!", "success" => true]);
            }

        }

    }

}
