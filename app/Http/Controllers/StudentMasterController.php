<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use App\Models\StudentMaster;
use App\Models\ClasswiseSubject;
use App\Models\TransferCertificate;
use App\Models\ParentLogin;
use App\Models\SectionMaster;
use App\Models\SessionMaster;
use App\Models\SubjectMaster;
use App\Models\RouteMaster;
use App\Models\District;
use App\Models\Classic;
use App\Models\Vehicle;
use App\Models\State;
use App\Models\School;
use App\Rules\uniqueRollNo;
use Helper;
use Image;
use PDF;
use DB;

class StudentMasterController extends Controller
{
	public function __construct()
    {
        DB::statement("SET SQL_MODE=''");
    }

    public function index(Request $request)
	{
		$search = empty($request->search)?'':$request->search;
		$limit = empty($request->limit)?0:$request->limit;
		$page = empty($request->page)?0:$request->page;
		$order = empty($request->order)?'':$request->order;
		$order_by = empty($request->orderBy)?'':$request->orderBy;
		$offset = ($page-1)*$limit;

		$query = StudentMaster::leftJoin('course_master as cm','student_master.course_id','=','cm.courseId')
		->leftJoin('class_master as cl','student_master.class_id','=','cl.classId')
		->leftjoin("subject_master as sm",DB::raw('FIND_IN_SET(sm.subjectId,student_master.compulsary_set)'),">",DB::raw("'0'"))
		->leftjoin("subject_master as sm1",DB::raw('FIND_IN_SET(sm1.subjectId,student_master.elective_set)'),">",DB::raw("'0'"))
		->leftjoin("subject_master as sm2",DB::raw('FIND_IN_SET(sm2.subjectId,student_master.additional_set)'),">",DB::raw("'0'"))
		->selectRaw("count(DISTINCT student_master.id) as row_count");

		if($search !='')
		{
			$query->where(function($q) use ($search) {
				 $q->where('student_master.student_name', 'like', '%'.$search.'%')
				   ->orWhere('student_master.admission_no', 'like', '%'.$search.'%')
				   ->orWhere('cm.courseName', 'like', '%'.$search.'%');
			});
		}

		$query->where('student_master.status',1);
		$records = $query->get();

		$student_query = StudentMaster::leftJoin('course_master as cm','student_master.course_id','=','cm.courseId')
		->leftJoin('class_master as cl','student_master.class_id','=','cl.classId')
		->leftjoin("subject_master as sm",DB::raw('FIND_IN_SET(sm.subjectId,student_master.compulsary_set)'),">",DB::raw("'0'"))
		->leftjoin("subject_master as sm1",DB::raw('FIND_IN_SET(sm1.subjectId,student_master.elective_set)'),">",DB::raw("'0'"))
		->leftjoin("subject_master as sm2",DB::raw('FIND_IN_SET(sm2.subjectId,student_master.additional_set)'),">",DB::raw("'0'"))
		->selectRaw("student_master.id,student_master.student_name,student_master.father_name,DATE_FORMAT(student_master.dob,'%d-%m-%Y') as date_of_birth,student_master.admission_no,student_master.gender,cm.courseName,cl.className,group_concat(distinct sm.subjectName SEPARATOR',') AS compulsary_subjects,group_concat(distinct sm1.subjectName SEPARATOR',') AS elective_subjects,group_concat(distinct sm2.subjectName SEPARATOR',') AS additional_subjects");

		if($search !='')
		{
			$student_query->where(function($q) use ($search) {
				 $q->where('student_master.student_name', 'like', '%'.$search.'%')
				   ->orWhere('student_master.admission_no', 'like', '%'.$search.'%')
				   ->orWhere('cm.courseName', 'like', '%'.$search.'%');
			});
		}
		if($order_by !='')
		{
			$student_query->orderBy($order_by,$order);
		}

		$student_query->where('student_master.status',1);
		$students = $student_query->groupBy('student_master.id')->offset($offset)->limit($limit)->get();

		if(count($students)>0) {
			$response_arr = array('data'=>$students,'total'=>$records[0]->row_count);
            return response()->json(["status" => "successed", "success" => true,"data" => $response_arr]);
		}
		else {
			$response_arr = array('data'=>[],'total'=>0);
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found","data" => $response_arr]);
		}

    }

	public function add_old(Request $request)
	{
		$inputs=$request->all();
		$tab=$request->tab;
		$action=$request->button;
		$school_id=$request->school_id;
		$insert_id=empty($request->insert_id)?'':$request->insert_id;
		$registration_id=empty($request->registration_id)?'':$request->registration_id;
		$image_name = empty($request->s_image)?'':$request->s_image;
		$image_name1= empty($request->f_image)?'':$request->f_image;
		$image_name2= empty($request->m_image)?'':$request->m_image;
		$image_rule = $image_rule1= $image_rule2=$email_rule="";

		if($insert_id)
		{
			$info = StudentMaster::where('id',$insert_id)->get();
		}

		if($tab=='personal_detail')
		{
			if($insert_id)
			{
				$email_rule=($request->email==$info[0]->email)?'required|max:255':'required|unique:student_master|max:255';
			}
			else
			{
				$email_rule='required|unique:student_master|max:255';
			}

			if($request->file('student_image')!=null)
			{
				$image_rule = 'required|image|mimes:jpeg,png,jpg|max:5120';
			}

			$rules=[
				'student_image' => $image_rule,
				'student_name' => 'required',
				'dob' => 'required',
				'gender' => 'required',
				'nationality' => 'required',
				// 'marital_status'=>'required',
				// 'account_no' => 'required',
				// 'ifsc' => 'required',
				// 'branch_address' => 'required',
				// 'caste' => 'required',
				// 'religion' => 'required',
				// 'mobile' => 'required',
				// 'email' => $email_rule,
				// 'blood_group' => 'required',
				'aadhar_no' => 'required',
				// 'permanent_address' => 'required',
				// 'state_id' => 'required',
				// 'district_id' => 'required',
				// 'pincode' => 'required'
			];

			$fields = [
				'student_image' => 'Student Image',
				'student_name' => 'Student Name',
				'dob' => 'Date of Birth',
				'gender' => 'Gender',
				'nationality' => 'Nationality',
				'marital_status' => 'Maritial Status',
				'account_no' => 'Account No.',
				'ifsc' => 'IFSC Code',
				'branch_address' => 'Branch Address',
				'caste' => 'Caste',
				'religion' => 'Religion',
				'mobile' => 'Mobile No.',
				'email' => 'Email',
				'blood_group' => 'Blood Group',
				'aadhar_no' => 'Aadhar No.',
				'permanent_address' => 'Permanent Address',
				'state_id' => 'State',
				'district_id' => 'District',
				'pincode' => 'Pincode'
			];

			$messages = [
				'required' => 'The :attribute field is required.',
			];
		}
		else if($tab=='parents_detail')
		{
			$parent_type=empty($request->parent_type)?'':$request->parent_type;
			$parent_rule=($parent_type=='new')?'':'required';

			if($request->file('father_image')!=null)
			{
				$image_rule1 = 'required|image|mimes:jpeg,png,jpg|max:5120';
			}

			if($request->file('mother_image')!=null)
			{
				$image_rule2 = 'required|image|mimes:jpeg,png,jpg|max:5120';
			}

			if($insert_id)
			{
				$mobile_rule=($request->f_mobile==$info[0]->f_mobile)?'required|max:25':'required|unique:student_master|max:25';
			}
			else
			{
				$mobile_rule='required|unique:student_master|max:25';
			}

			$rules=[
				'parent_type' => 'required',
				'sibling_admission_no' => $parent_rule,
				'sibling_no' => $parent_rule,
				'father_image' => $image_rule1,
				'mother_image' => $image_rule2,
				'father_name' => 'required',
				'mother_name' => 'required',
				// 'f_occupation' => 'required',
				// 'f_income' => 'required',
				// 'f_designation' => 'required',
				'f_mobile' => $mobile_rule,
				// 'f_email' => 'required',
				'images.*' => 'required|image|mimes:jpeg,png,jpg|max:2048'
			];

			$messages = [
				'required' => 'The :attribute field is required.',
			];

			$fields = [
				'parent_type' => 'Parent Type',
				'sibling_admission_no' => 'Sibling Admission No.',
				'sibling_no' => 'Sibling Child',
				'father_image' => 'Father Image',
				'mother_image' => 'Mother Image',
				'father_name' => 'Father Name',
				'mother_name' => 'Mother Name',
				'f_occupation' => "Father's Occupation",
				'f_income' => "Father's Annual Income",
				'f_designation' => 'Designation',
				'f_mobile' => 'Mobile No (For SMS)',
				'f_email' => 'E-Mail ID',
			];
		}
		else if($tab=='admission_detail')
		{
			$course_id=empty($request->course_id)?'':$request->course_id;
			$class_id=empty($request->class_id)?'':$request->class_id;
			$section_id=empty($request->section_id)?'':$request->section_id;

			if($insert_id)
			{
				$admsn_rule=($request->admission_no==$info[0]->admission_no)?'required|max:255':'required|unique:student_master|max:255';

				$roll_rule=($request->roll_no==$info[0]->roll_no)?['required']:['required', new uniqueRollNo($course_id,$class_id,$section_id)];
			}
			else
			{
				$admsn_rule='required|unique:student_master|max:255';
				$roll_rule=['required', new uniqueRollNo($course_id,$class_id,$section_id)];
			}

			$rules=[
				'admission_date' => 'required',
				'admission_no' => $admsn_rule,
				'course_id' => 'required',
				'class_id' => 'required',
				'section_id' => 'required',
				// 'roll_no' => 'required',
				'roll_no' => $roll_rule,
				'registration_no' => 'required',
				'board_roll_no' => 'required',
				'leaving_certificate' => 'required',
				'course_first' => 'required',
				'class_first' => 'required'
			];

			$fields = [
				'admission_date' => 'Date of Admission',
				'admission_no' => 'Admission No.',
				'course_id' => 'Course Name',
				'class_id' => 'Class Name',
				'section_id' => 'Section Name',
				'roll_no' => 'Student Roll No.',
				'registration_no' => 'Registration No.',
				'board_roll_no' => 'Board Roll No.',
				'leaving_certificate' => 'School Leaving Certificate',
				'course_first' => 'Course At the time of Admission',
				'class_first' => 'Class At the time of Admission'
			];

			$messages = [
				'required' => 'The :attribute field is required.',
			];
		}
		else if($tab=='subject_detail')
		{
			$rules=[
				'compulsary' => ''
			];

			$messages = [
				'required' => 'The :attribute field is required.',
			];

			$fields = [
				'compulsary' => 'Compulsory Subjects'
			];

		}
		else if($tab=='miscellaneous_detail')
		{
			$transportation=empty($request->transportation)?'':$request->transportation;
			$concession=empty($request->transport_concession)?'':$request->transport_concession;
			$staff=empty($request->staffchild)?'':$request->staffchild;

			$station_rule=($transportation=='no')?'':'required';
			$route_rule=($transportation=='no')?'':'required';
			$vehicle_rule=($transportation=='no')?'':'required';
			$concession_rule=($transportation=='yes')?'required':'';
			$fare_rule=($concession=='yes')?'required':'';
			$trans_rule=($concession=='yes')?'required':'';
			$total_rule=($concession=='yes')?'required':'';
			$staff_rule=($staff=='no')?'':'required';

			$rules=[
				'transportation' => 'required',
				'station_id'=>$station_rule,
				'route_id'=>$route_rule,
				'bus_no'=>$vehicle_rule,
				'busfare'=>$fare_rule,
				'transconcession_amount'=>$trans_rule,
				'totalfare'=>$total_rule,
				'transport_concession' => $concession_rule,
				'staffchild' => 'required',
				'child_no'=>$staff_rule,
				'management_concession' => 'required',
				'applicable' => 'required'
			];

			$fields = [
				'transportation' => 'Transportation',
				'station_id' => 'Station',
				'route_id' => 'Route',
				'bus_no' => 'Bus No.',
				'transport_concession' => 'Transportation Concession',
				'staffchild' => 'Staff Child',
				'child_no' => 'Staff No.',
				'management_concession' => 'Management Concession',
				'applicable' => 'Applicable',
				'busfare' => 'Station Fare',
				'transconcession_amount' => 'Concession Amount',
				'totalfare' => 'After Concession Amount'
			];

			$messages = [
				'required' => 'The :attribute field is required.',
			];
		}
		else
		{
			$rules=[
				'images' => 'required',
				'images.*' => 'required|image|mimes:jpeg,png,jpg|max:2048'
			];

			$messages = [
				'required' => 'The :attribute field is required.',
			];

			$fields = [
				'images' => 'Student Photo Image'
			];
		}

		$validator = Validator::make($inputs, $rules, $messages, $fields);

        if ($validator->fails()) {
			$errors=$validator->errors();
			$response_arr=array("status"=>"failed","success"=>false,"message"=>"Please fill required fields!!","errors"=>$errors);
        }
		else
		{
			$school=School::where('id',$school_id)->get();
			$fiscal_yr=Helper::getFiscalYear(date('m'));
			$fiscal_arr=explode(':',$fiscal_yr);
			$fiscalYear=SessionMaster::where('session_start',$fiscal_arr[0])->where('session_end',$fiscal_arr[1])->get();
			$fiscal_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0;

			if($request->hasFile('student_image'))
			{
				$image  = $request->file('student_image');

				/* $height = Image::make($image)->height();
				$width = Image::make($image)->width();    */

				$imageDimensions = getimagesize($image);

				$width = $imageDimensions[0];
				$height = $imageDimensions[1];

				$new_height = Helper::setDimension($height);
				$new_width = Helper::setDimension($width);

				$image_name = time().rand(3, 9).'.'.$image->getClientOriginalExtension();
				$imgFile = Image::make($image->getRealPath());

				$destinationPath1 = public_path().'/uploads/student_image/';
				$destinationPath2 = public_path().'/uploads/student_image/thumbnail/';

				$image->move($destinationPath1,$image_name);

				$imgFile->resize($new_height,$new_width, function ($constraint) {
					$constraint->aspectRatio();
				})->save($destinationPath2.$image_name);

			}

			if($request->hasFile('father_image'))
			{
				$f_image  = $request->file('father_image');
				$imgFile = Image::make($f_image->getRealPath());
				$imageDimensions = getimagesize($f_image);

				$width = $imageDimensions[0];
				$height = $imageDimensions[1];

				$new_height = Helper::setDimension($height);
				$new_width = Helper::setDimension($width);

				$image_name1 = time().rand(3, 9).'.'.$f_image->getClientOriginalExtension();

				$destinationPath1 = public_path().'/uploads/father_image/';
				$destinationPath2 = public_path().'/uploads/father_image/thumbnail/';

				$f_image->move($destinationPath1,$image_name1);

				$imgFile->resize($new_height,$new_width, function ($constraint) {
					$constraint->aspectRatio();
				})->save($destinationPath2.$image_name1);

			}
			if($request->hasFile('mother_image'))
			{
				$m_image = $request->file('mother_image');
				$imgFile = Image::make($m_image->getRealPath());
				$imageDimensions = getimagesize($m_image);

				$width = $imageDimensions[0];
				$height = $imageDimensions[1];

				$new_height = Helper::setDimension($height);
				$new_width = Helper::setDimension($width);

				$image_name2 = time().rand(3, 9).'.'.$m_image->getClientOriginalExtension();

				$destinationPath1 = public_path().'/uploads/mother_image/';
				$destinationPath2 = public_path().'/uploads/mother_image/thumbnail/';

				$m_image->move($destinationPath1,$image_name2);

				$imgFile->resize($new_height,$new_width, function ($constraint) {
					$constraint->aspectRatio();
				})->save($destinationPath2.$image_name2);

			}

			if($tab=='personal_detail')
			{
				if($insert_id)
				{
					$update_arr=array(
						'student_name'=>$request->student_name,
						'dob'=>$request->dob,
						'gender'=>$request->gender,
						'nationality'=>$request->nationality,
						'caste'=>$request->caste,
						'religion'=>$request->religion,
						'mobile'=>$request->mobile,
						'email'=>$request->email,
						'blood_group'=>$request->blood_group,
						'aadhar_no'=>$request->aadhar_no,
						'permanent_address'=>$request->permanent_address,
						'temporary_address'=>($request->temporary_address)?$request->temporary_address:'',
						'branch_address'=>($request->branch_address)?$request->branch_address:'',
						'state_id'=>$request->state_id,
						'district_id'=>$request->district_id,
						'pincode'=>$request->pincode,
						'student_image'=>($image_name=='')?$info[0]->student_image:$image_name,
						'account_no'=>empty($request->account_no)?'':$request->account_no,
						'ifsc_no'=>empty($request->ifsc)?'':$request->ifsc,
						'marital_status'=>empty($request->marital_status)?'':$request->marital_status,
					);

					$update=StudentMaster::where('id',$insert_id)->update($update_arr);
					$data_arr['insert_id']=$insert_id;
					if($action=='saveprint')
					{
						$school=School::where('id',$school_id)->get();
						$registration = StudentMaster::leftJoin('student_master as sm','student_master.sibling_admission_no','=','sm.admission_no')
								->leftJoin('course_master as cm','student_master.course_id','=','cm.courseId')
								->leftJoin('class_master as cl','student_master.class_id','=','cl.classId')
								->selectRaw("student_master.*,ifnull(sm.student_name,'N/A') AS sibling_name,ifnull(sm.admission_no,'N/A') AS sibling_admission_number,cm.courseName,cl.className")
								->where('student_master.id',$insert_id)
								->get();

						$page_data = array('school'=>$school,'student'=>$registration);
						$slip_name=time().rand(1,99).'.'.'pdf';
						$data_arr['print_id']=$slip_name;
						$pdf = PDF::loadView("admission_form",$page_data)->save(public_path("admissions/$slip_name"));

						$message="student details saved, admission form generated.";

					}
					else
					{
						$message="student details updated successfully";
						$data_arr['print_id']="";
					}
					if($update)
					{
						$response_arr=array("status"=>'successed',"success"=>true,"errors"=>[],"message"=>$message,"data" =>$data_arr);
					}
					else
					{
						$message="could not saved!!";
						$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);
					}

				}
				else
				{
					$insert_arr=array(
						'student_name'=>$request->student_name,
						'dob'=>$request->dob,
						'gender'=>$request->gender,
						'nationality'=>$request->nationality,
						'caste'=>$request->caste,
						'religion'=>$request->religion,
						'mobile'=>$request->mobile,
						'email'=>$request->email,
						'blood_group'=>$request->blood_group,
						'aadhar_no'=>$request->aadhar_no,
						'permanent_address'=>$request->permanent_address,
						'temporary_address'=>empty($request->temporary_address)?'':$request->temporary_address,
						'branch_address'=>empty($request->branch_address)?'':$request->branch_address,
						'account_no'=>empty($request->account_no)?'':$request->account_no,
						'ifsc_no'=>empty($request->ifsc)?'':$request->ifsc,
						'marital_status'=>empty($request->marital_status)?'':$request->marital_status,
						'state_id'=>$request->state_id,
						'district_id'=>$request->district_id,
						'registration_id'=>$request->registration_id,
						'pincode'=>$request->pincode,
						'student_image'=>$image_name,
						'status'=>1,
						'session_id' => $fiscal_id,
						'school_id'=> $school_id,
					);

					$register = StudentMaster::create($insert_arr);

					if($register->id)
					{
						$data_arr['insert_id']=$register->id;
						if($action=='saveprint')
						{
							$school=School::where('id',$school_id)->get();
							$registration = StudentMaster::leftJoin('student_master as sm','student_master.sibling_admission_no','=','sm.admission_no')
									->leftJoin('course_master as cm','student_master.course_id','=','cm.courseId')
									->leftJoin('class_master as cl','student_master.class_id','=','cl.classId')
									->selectRaw("student_master.*,ifnull(sm.student_name,'N/A') AS sibling_name,ifnull(sm.admission_no,'N/A') AS sibling_admission_number,cm.courseName,cl.className")
									->where('student_master.id',$register->id)
									->get();

							$page_data = array('school'=>$school,'student'=>$registration);
							$slip_name=time().rand(1,99).'.'.'pdf';
							$pdf = PDF::loadView("admission_form",$page_data)->save(public_path("admissions/$slip_name"));
							$data_arr['print_id']=$slip_name;
							$message="student details saved, admission form generated.";
						}
						else
						{
							$data_arr['print_id']="";
							$message="student details saved successfully";
						}
						$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data" =>$data_arr);
					}
					else
					{
						$message="could not saved!!";
						$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);
					}

				}
			}
			else if($tab=='parents_detail')
			{
				if($insert_id)
				{
					$parent_type=empty($request->parent_type)?$info[0]->parent_type:$request->parent_type;
					$sibling_admission_no = ($parent_type=='new')?"":((empty($request->sibling_admission_no))?"":$request->sibling_admission_no);
					$sibling_no = ($parent_type=='new')?"":((empty($request->sibling_no))?"":$request->sibling_no);

					$update_arr=array(
						'parent_type'=>$parent_type,
						'sibling_admission_no'=>$sibling_admission_no,
						'sibling_no'=>$sibling_no,
						'father_name'=>empty($request->father_name)?$info[0]->father_name:$request->father_name,
						'mother_name'=>empty($request->mother_name)?$info[0]->mother_name:$request->mother_name,
						'f_occupation'=>empty($request->f_occupation)?'':$request->f_occupation,
						'f_income'=>empty($request->f_income)?'':$request->f_income,
						'f_designation'=>empty($request->f_designation)?'':$request->f_designation,
						'f_mobile'=>empty($request->f_mobile)?'':$request->f_mobile,
						'f_email'=>empty($request->f_email)?'':$request->f_email,
						'residence_no'=>empty($request->residence_no)?'':$request->residence_no,
						'father_image'=>($image_name1=='')?$info[0]->father_image:$image_name1,
						'mother_image'=>($image_name2=='')?$info[0]->mother_image:$image_name2
					);

					$update=StudentMaster::where('id',$insert_id)->update($update_arr);
					$data_arr['insert_id']=$insert_id;

					if($update)
					{
						$checkCredit = ParentLogin::selectRaw('count(*) as row_count')
									 ->where('s_id',$insert_id)
									 ->get();

						if($checkCredit[0]->row_count>0)
						{
							$parent_credential=array(
								'mobile_no'=>$request->f_mobile,
								// 'password' => Hash::make($request->mobile_no)
                                'password' => Hash::make('htl@0097')

							);

							$credential=ParentLogin::where('s_id',$insert_id)->update($parent_credential);
						}
						else
						{
							$parent_credential=array(
								's_id'=>$insert_id,
								'mobile_no'=>$request->f_mobile,
								// 'password' => Hash::make($request->mobile_no)
                                'password' => Hash::make('htl@0097')
							);

							ParentLogin::create($parent_credential);
						}
						if($action=='saveprint')
						{
							$school=School::where('id',$school_id)->get();
							$registration = StudentMaster::leftJoin('student_master as sm','student_master.sibling_admission_no','=','sm.admission_no')
									->leftJoin('course_master as cm','student_master.course_id','=','cm.courseId')
									->leftJoin('class_master as cl','student_master.class_id','=','cl.classId')
									->selectRaw("student_master.*,ifnull(sm.student_name,'N/A') AS sibling_name,ifnull(sm.admission_no,'N/A') AS sibling_admission_number,cm.courseName,cl.className")
									->where('student_master.id',$insert_id)
									->get();

							$page_data = array('school'=>$school,'student'=>$registration);
							$slip_name=time().rand(1,99).'.'.'pdf';
							$pdf = PDF::loadView("admission_form",$page_data)->save(public_path("admissions/$slip_name"));
							$data_arr['print_id']=$slip_name;
							$message="student details updated, admission form generated.";
						}
						else
						{
							$data_arr['print_id']="";
							$message="student details updated successfully";
						}
						$response_arr=array("status"=>'successed',"success"=>true,"errors"=>[],"message"=>$message,"data" =>$data_arr);
					}
					else
					{
						$message="could not saved!!";
						$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);
					}
					//
				}
				else
				{
					$parent_type=empty($request->parent_type)?'':$request->parent_type;
					$sibling_admission_no = ($parent_type=='new')?"":((empty($request->sibling_admission_no))?"":$request->sibling_admission_no);
					$sibling_no = ($parent_type=='new')?"":((empty($request->sibling_no))?"":$request->sibling_no);

					$insert_arr=array(
						'parent_type'=>$parent_type,
						'sibling_admission_no'=>$sibling_admission_no,
						'sibling_no'=>$sibling_no,
						'father_name'=>empty($request->father_name)?'':$request->father_name,
						'mother_name'=>empty($request->mother_name)?'':$request->mother_name,
						'f_occupation'=>empty($request->f_occupation)?'':$request->f_occupation,
						'f_income'=>empty($request->f_income)?0:$request->f_income,
						'f_designation'=>empty($request->f_designation)?'':$request->f_designation,
						'f_mobile'=>empty($request->f_mobile)?'':$request->f_mobile,
						'f_email'=>empty($request->f_email)?'':$request->f_email,
						'residence_no'=>empty($request->residence_no)?'':$request->residence_no,
						'father_image'=>$image_name1,
						'mother_image'=>$image_name2,
						'registration_id'=>$request->registration_id,
						'session_id' => $fiscal_id,
						'school_id'=> $school_id,
						'status'=>1
					);

					$register = StudentMaster::create($insert_arr);

					if($register->id)
					{
						$data_arr['insert_id']=$register->id;

						$parent_credential=array(
							's_id'=>$register->id,
							'mobile_no'=>$request->f_mobile,
							// 'password' => Hash::make($request->mobile_no)
                            'password' => Hash::make('htl@0097')
						);

						$credential = ParentLogin::create($parent_credential);

						if($credential->id)
						{
							$message="student details saved successfully and parent login password generated.";
						}
						else
						{
							$message="student details saved successfully";
						}

						if($action=='saveprint')
						{
							$school=School::where('id',$school_id)->get();
							$registration = StudentMaster::leftJoin('student_master as sm','student_master.sibling_admission_no','=','sm.admission_no')
									->leftJoin('course_master as cm','student_master.course_id','=','cm.courseId')
									->leftJoin('class_master as cl','student_master.class_id','=','cl.classId')
									->selectRaw("student_master.*,ifnull(sm.student_name,'N/A') AS sibling_name,ifnull(sm.admission_no,'N/A') AS sibling_admission_number,cm.courseName,cl.className")
									->where('student_master.id',$register->id)
									->get();

							$page_data = array('school'=>$school,'student'=>$registration);
							$slip_name=time().rand(1,99).'.'.'pdf';
							$data_arr['print_id']=$slip_name;
							$pdf = PDF::loadView("admission_form",$page_data)->save(public_path("admissions/$slip_name"));

							$message="student details saved, admission form generated.";
							$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data" =>$data_arr);
						}
						else
						{
							$data_arr['print_id']="";
							$response_arr=array("status"=>'successed',"success"=>true,"errors"=>[],"message"=>$message,"data" =>$data_arr);
						}
					}
					else
					{
						$message="could not saved!!";
						$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);
					}

				}
			}
			else if($tab=='admission_detail')
			{
				if($insert_id)
				{
					$update_arr=array(
						'admission_date'=>$request->admission_date,
						'admission_no'=>$request->admission_no,
						'course_id'=>$request->course_id,
						'class_id'=>$request->class_id,
						'section_id'=>$request->section_id,
						'roll_no'=>$request->roll_no,
						'registration_no'=>$request->registration_no,
						'board_roll_no'=>$request->board_roll_no,
						'leaving_certificate'=>$request->leaving_certificate,
						'course_first'=>$request->course_first,
						'class_first'=>$request->class_first
					);

					$update=StudentMaster::where('id',$insert_id)->update($update_arr);
					$data_arr['insert_id']=$insert_id;
					if($action=='saveprint')
					{
						$school=School::where('id',$school_id)->get();
						$registration = StudentMaster::leftJoin('student_master as sm','student_master.sibling_admission_no','=','sm.admission_no')
								->leftJoin('course_master as cm','student_master.course_id','=','cm.courseId')
								->leftJoin('class_master as cl','student_master.class_id','=','cl.classId')
								->selectRaw("student_master.*,ifnull(sm.student_name,'N/A') AS sibling_name,ifnull(sm.admission_no,'N/A') AS sibling_admission_number,cm.courseName,cl.className")
								->where('student_master.id',$insert_id)
								->get();

						$page_data = array('school'=>$school,'student'=>$registration);
						$slip_name=time().rand(1,99).'.'.'pdf';
						$pdf = PDF::loadView("admission_form",$page_data)->save(public_path("admissions/$slip_name"));
						$data_arr['print_id']=$slip_name;
						$message="student details updated, admission form generated.";
					}
					else
					{
						$data_arr['print_id']="";
						$message="student details updated successfully";
					}
					if($update)
					{
						$message="Student details updated successfully";
						$response_arr=array("status"=>'successed',"success"=>true,"errors"=>[],"message"=>$message,"data" =>$data_arr);
					}
					else
					{
						$message="could not saved!!";
						$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);
					}
					//
				}
				else
				{
					$insert_arr=array(
						'admission_date'=>$request->admission_date,
						'admission_no'=>$request->admission_no,
						'course_id'=>$request->course_id,
						'class_id'=>$request->class_id,
						'section_id'=>$request->section_id,
						'registration_id'=>$request->registration_id,
						'roll_no'=>$request->roll_no,
						'registration_no'=>$request->registration_no,
						'board_roll_no'=>$request->board_roll_no,
						'leaving_certificate'=>$request->leaving_certificate,
						'course_first'=>$request->course_first,
						'class_first'=>$request->class_first,
						'session_id' => $fiscal_id,
						'school_id'=> $school_id,
						'status'=>1
					);

					$register = StudentMaster::create($insert_arr);
					if($register->id)
					{
						$data_arr['insert_id']=$register->id;
						if($action=='saveprint')
						{
							$school=School::where('id',$school_id)->get();
							$registration = StudentMaster::leftJoin('student_master as sm','student_master.sibling_admission_no','=','sm.admission_no')
									->leftJoin('course_master as cm','student_master.course_id','=','cm.courseId')
									->leftJoin('class_master as cl','student_master.class_id','=','cl.classId')
									->selectRaw("student_master.*,ifnull(sm.student_name,'N/A') AS sibling_name,ifnull(sm.admission_no,'N/A') AS sibling_admission_number,cm.courseName,cl.className")
									->where('student_master.id',$register->id)
									->get();

							$page_data = array('school'=>$school,'student'=>$registration);
							$slip_name=time().rand(1,99).'.'.'pdf';
							$data_arr['print_id']=$slip_name;
							$pdf = PDF::loadView("admission_form",$page_data)->save(public_path("admissions/$slip_name"));

							$message="student details saved, admission form generated.";
							$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data" =>$data_arr);
						}
						else
						{
							$data_arr['print_id']="";
							$message="Student details saved successfully";
							$response_arr=array("status"=>'successed',"success"=>true,"errors"=>[],"message"=>$message,"data" =>$data_arr);
						}

					}
					else
					{
						$message="could not saved!!";
						$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);
					}

				}

			}
			else if($tab=='subject_detail')
			{
				if($insert_id)
				{
					$update_arr=array(
						'compulsary_set'=>empty($request->compulsary)?'':$request->compulsary,
						'elective_set'=>empty($request->elective)?'':$request->elective,
						'additional_set'=>empty($request->additional)?'':$request->additional
					);

					$update=StudentMaster::where('id',$insert_id)->update($update_arr);

					if($update)
					{
						$data_arr['insert_id']=$insert_id;
						if($action=='saveprint')
						{
							$school=School::where('id',$school_id)->get();
							$registration = StudentMaster::leftJoin('student_master as sm','student_master.sibling_admission_no','=','sm.admission_no')
									->leftJoin('course_master as cm','student_master.course_id','=','cm.courseId')
									->leftJoin('class_master as cl','student_master.class_id','=','cl.classId')
									->selectRaw("student_master.*,ifnull(sm.student_name,'N/A') AS sibling_name,ifnull(sm.admission_no,'N/A') AS sibling_admission_number,cm.courseName,cl.className")
									->where('student_master.id',$insert_id)
									->get();

							$page_data = array('school'=>$school,'student'=>$registration);
							$slip_name=time().rand(1,99).'.'.'pdf';
							$pdf = PDF::loadView("admission_form",$page_data)->save(public_path("admissions/$slip_name"));
							$data_arr['print_id']=$slip_name;
							$message="student details updated, admission form generated.";
						}
						else
						{
							$data_arr['print_id']="";
							$message="student details updated successfully";
						}
						$response_arr=array("status"=>'successed',"success"=>true,"errors"=>[],"message"=>$message,"data" =>$data_arr);
					}
					else
					{
						$message="could not saved!!";
						$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);
					}
				}
				else
				{
					$insert_arr=array(
						'compulsary_set'=>empty($request->compulsary)?'':$request->compulsary,
						'elective_set'=>empty($request->elective)?'':$request->elective,
						'additional_set'=>empty($request->additional)?'':$request->additional,
						'registration_id'=>$request->registration_id,
					);

					$register = StudentMaster::create($insert_arr);
					if($register->id)
					{
						$data_arr['insert_id']=$register->id;
						if($action=='saveprint')
						{
							$school=School::where('id',$school_id)->get();
							$registration = StudentMaster::leftJoin('student_master as sm','student_master.sibling_admission_no','=','sm.admission_no')
									->leftJoin('course_master as cm','student_master.course_id','=','cm.courseId')
									->leftJoin('class_master as cl','student_master.class_id','=','cl.classId')
									->selectRaw("student_master.*,ifnull(sm.student_name,'N/A') AS sibling_name,ifnull(sm.admission_no,'N/A') AS sibling_admission_number,cm.courseName,cl.className")
									->where('student_master.id',$register->id)
									->get();

							$page_data = array('school'=>$school,'student'=>$registration);
							$slip_name=time().rand(1,99).'.'.'pdf';
							$data_arr['print_id']=$slip_name;
							$pdf = PDF::loadView("admission_form",$page_data)->save(public_path("admissions/$slip_name"));

							$message="student details saved, admission form generated.";
							$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data" =>$data_arr);
						}
						else
						{
							$data_arr['print_id']="";
							$message="Student details saved successfully";
							$response_arr=array("status"=>'successed',"success"=>true,"errors"=>[],"message"=>$message,"data" =>$data_arr);
						}

					}
					else
					{
						$message="could not saved!!";
						$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);
					}
					//
				}


			}
			else if($tab=='miscellaneous_detail')
			{
				if($insert_id)
				{
					$transportation=empty($request->transportation)?$info[0]->transportation:$request->transportation;
					$transport_concession=empty($request->transport_concession)?$info[0]->transport_concession:$request->transport_concession;
					$staffchild=empty($request->staffchild)?'no':$request->staffchild;

					$station_id = ($transportation=='no')?"":((empty($request->station_id))?$info[0]->station_id:$request->station_id);
					$route_id = ($transportation=='no')?"":((empty($request->route_id))?$info[0]->route_id:$request->route_id);
					$bus_no = ($transportation=='no')?"":((empty($request->bus_no))?$info[0]->bus_no:$request->bus_no);

					$busfare = ($transportation=='no' || $transport_concession=='no')?"":((empty($request->busfare))?$info[0]->busfare:$request->busfare);

					$transconcession_amount = ($transportation=='no' || $transport_concession=='no')?"":((empty($request->transconcession_amount))?$info[0]->transconcession_amount:$request->transconcession_amount);

					$totalfare = ($transportation=='no' || $transport_concession=='no')?"":((empty($request->totalfare))?$info[0]->totalfare:$request->totalfare);

					$staffchild=empty($request->staffchild)?$info[0]->staffchild:$request->staffchild;

					$child_no = ($staffchild=='no')?"":((empty($request->child_no))?$info[0]->child_no:$request->child_no);

					$update_arr=array(
						'transportation'=>$transportation,
						'station_id'=>$station_id,
						'route_id'=>$route_id,
						'bus_no'=>$bus_no,
						'busfare'=>$busfare,
						'transconcession_amount'=>$transconcession_amount,
						'totalfare'=>$totalfare,
						'transport_concession'=>$transport_concession,
						'staffchild'=>$staffchild,
						'child_no'=>$child_no,
						'applicable'=>empty($request->applicable)?'':$request->applicable,
						'management_concession'=>empty($request->management_concession)?'':$request->management_concession,
					);

					$update=StudentMaster::where('id',$insert_id)->update($update_arr);

					if($update)
					{
						$data_arr['insert_id']=$insert_id;
						if($action=='saveprint')
						{
							$school=School::where('id',$school_id)->get();
							$registration = StudentMaster::leftJoin('student_master as sm','student_master.sibling_admission_no','=','sm.admission_no')
									->leftJoin('course_master as cm','student_master.course_id','=','cm.courseId')
									->leftJoin('class_master as cl','student_master.class_id','=','cl.classId')
									->selectRaw("student_master.*,ifnull(sm.student_name,'N/A') AS sibling_name,ifnull(sm.admission_no,'N/A') AS sibling_admission_number,cm.courseName,cl.className")
									->where('student_master.id',$insert_id)
									->get();

							$page_data = array('school'=>$school,'student'=>$registration);
							$slip_name=time().rand(1,99).'.'.'pdf';
							$pdf = PDF::loadView("admission_form",$page_data)->save(public_path("admissions/$slip_name"));
							$data_arr['print_id']=$slip_name;
							$message="student details updated, admission form generated.";
						}
						else
						{
							$data_arr['print_id']="";
							$message="student details updated successfully";
						}

						$response_arr=array("status"=>'successed',"success"=>true,"errors"=>[],"message"=>$message,"data" =>$data_arr);
					}
					else
					{
						$message="could not saved!!";
						$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);
					}
				}
				else
				{
					$transportation=empty($request->transportation)?'no':$request->transportation;
					$transport_concession=empty($request->transport_concession)?'no':$request->transport_concession;
					$staffchild=empty($request->staffchild)?'no':$request->staffchild;

					$station_id = ($transportation=='no')?"":((empty($request->station_id))?"":$request->station_id);
					$route_id = ($transportation=='no')?"":((empty($request->route_id))?"":$request->route_id);
					$bus_no = ($transportation=='no')?"":((empty($request->bus_no))?"":$request->bus_no);

					$busfare = ($transportation=='no' || $transport_concession=='no')?"":((empty($request->busfare))?"":$request->busfare);

					$transconcession_amount = ($transportation=='no' || $transport_concession=='no')?"":((empty($request->transconcession_amount))?"":$request->transconcession_amount);

					$busfare = ($transportation=='no' || $transport_concession=='no')?"":((empty($request->busfare))?"":$request->busfare);

					$totalfare = ($transportation=='no' || $transport_concession=='no')?"":((empty($request->totalfare))?"":$request->totalfare);

					$staffchild=empty($request->staffchild)?'no':$request->staffchild;

					$child_no = ($staffchild=='no')?"":((empty($request->child_no))?"":$request->child_no);

					$insert_arr=array(
						'transportation'=>$transportation,
						'station_id'=>$station_id,
						'route_id'=>$route_id,
						'registration_id'=>$request->registration_id,
						'bus_no'=>$bus_no,
						'busfare'=>$busfare,
						'transconcession_amount'=>$transconcession_amount,
						'totalfare'=>$totalfare,
						'transport_concession'=>$transport_concession,
						'staffchild'=>$staffchild,
						'child_no'=>$child_no,
						'applicable'=>empty($request->applicable)?'':$request->applicable,
						'management_concession'=>empty($request->management_concession)?'':$request->management_concession,
					);

					$register = StudentMaster::create($insert_arr);
					if($register->id)
					{
						$data_arr['insert_id']=$register->id;
						if($action=='saveprint')
						{
							$school=School::where('id',$school_id)->get();
							$registration = StudentMaster::leftJoin('student_master as sm','student_master.sibling_admission_no','=','sm.admission_no')
									->leftJoin('course_master as cm','student_master.course_id','=','cm.courseId')
									->leftJoin('class_master as cl','student_master.class_id','=','cl.classId')
									->selectRaw("student_master.*,ifnull(sm.student_name,'N/A') AS sibling_name,ifnull(sm.admission_no,'N/A') AS sibling_admission_number,cm.courseName,cl.className")
									->where('student_master.id',$register->id)
									->get();

							$page_data = array('school'=>$school,'student'=>$registration);
							$slip_name=time().rand(1,99).'.'.'pdf';
							$data_arr['print_id']=$slip_name;
							$pdf = PDF::loadView("admission_form",$page_data)->save(public_path("admissions/$slip_name"));

							$message="student details saved, admission form generated.";
							$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data" =>$data_arr);
						}
						else
						{
							$data_arr['print_id']="";
							$message="Student details saved successfully";
							$response_arr=array("status"=>'successed',"success"=>true,"errors"=>[],"message"=>$message,"data" =>$data_arr);
						}

					}
					else
					{
						$message="could not saved!!";
						$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);
					}
					//
				}

			}
			else
			{
				$message="could not saved!!";
				$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);

			}

		}

		return response()->json($response_arr);

	}

   public function delete($id)
   {
		$info = StudentMaster::where('id',$id)->get();

		if(count($info)>0)
		{
			$q='DELETE student_master.*,parent_login.* FROM student_master LEFT JOIN parent_login ON student_master.id=parent_login.s_id where student_master.id =?';
			$del=DB::delete($q,array($id));

			if($del)
			{
				return response()->json(["status" =>'successed', "success" => true,"errors"=>[], "message" => "Student record deleted successfully","data" =>[]]);
			}
			else
			{
				return response()->json(["status" => "failed","success" => false,"errors"=>[],"message" => "Whoops! failed to delete,!!","errors" =>'']);
			}

		}
		else
		{
			return response()->json(["status" => "failed","success" => false,"errors"=>[],"message" => "Whoops! payment mode does not exist!!","errors" =>'']);
		}

    }
	public function getStates()
	{
        $states = State::all();

        if(count($states)>0) {
            return response()->json(["status" => "successed", "success" => true, "data" => $states]);
        }
        else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found"]);
        }
    }
	public function getDistrict($id)
	{
        $districts = District::where('state_id',$id)->get();

        if(count($districts)>0) {
            return response()->json(["status" => "successed", "success" => true, "data" => $districts]);
        }
        else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found"]);
        }
    }
	public function getClassWiseSubjects($course_id=null,$class_id=null,$section_id=null)
	{
		$row_arr=array();
		if($section_id !='')
		{
			$classwise=ClasswiseSubject::where('courseId',$course_id)
			->where('classId',$class_id)
			->where('sectionId',$section_id)
			->get();
		}
		else
		{
			$classwise=ClasswiseSubject::where('courseId',$course_id)
			->where('classId',$class_id)
			->get();
		}

		foreach($classwise AS $cw)
		{
			array_push($row_arr,$cw->id);
		}

		if(count($row_arr)>0)
		{
			$compulsary_subjects = SubjectMaster::leftJoin('class_wise_sub_desc as cw','subject_master.subjectId','=','cw.subjectId')
					->select('subject_master.subjectId','subject_master.subjectName')
					->whereIn('cw.csId',$row_arr)
					->where('cw.compulsary',1)
					->where('subject_master.status',1)
					->groupBy('subject_master.subjectId')
					->get();

			$elective_subjects = SubjectMaster::leftJoin('class_wise_sub_desc as cw','subject_master.subjectId','=','cw.subjectId')
						->select('subject_master.subjectId','subject_master.subjectName')
						->whereIn('cw.csId',$row_arr)
						->where('cw.elective',1)
						->where('subject_master.status',1)
						->groupBy('subject_master.subjectId')
						->get();

			$additional_subjects = SubjectMaster::leftJoin('class_wise_sub_desc as cw','subject_master.subjectId','=','cw.subjectId')
						->select('subject_master.subjectId','subject_master.subjectName')
						->whereIn('cw.csId',$row_arr)
						->where('cw.addition',1)
						->where('subject_master.status',1)
						->groupBy('subject_master.subjectId')
						->get();

			$data = array(
				'compulsary'=>$compulsary_subjects,
				'elective'=>$elective_subjects,
				'additional'=>$additional_subjects
			);

			if(count($compulsary_subjects)>0 || count($elective_subjects)>0 || count($additional_subjects)>0)
			{
				return response()->json(["status" => "successed", "success" => true, "data" => $data]);
			}
			else {
				return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found","data" =>[]]);
			}
		}
		else
		{
			return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found","data" =>[]]);
		}

	}
	public function getRoutes($id)
	{
        $routes=RouteMaster::whereRaw("FIND_IN_SET($id,stationList)")->get();

        if(count($routes)>0) {
            return response()->json(["status" => "successed", "success" => true, "data" => $routes]);
        }
        else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found"]);
        }
    }
   public function edit($id)
   {
		$compulsary_subjects=$elective_subjects=$additional_subjects=$row_arr=array();

		$info = StudentMaster::leftJoin('course_master as cm','student_master.course_id','=','cm.courseId')
		->leftJoin('class_master as cl','student_master.class_id','=','cl.classId')
		->leftjoin("subject_master as sm",DB::raw('FIND_IN_SET(sm.subjectId,student_master.compulsary_set)'),">",DB::raw("'0'"))
		->leftjoin("subject_master as sm1",DB::raw('FIND_IN_SET(sm1.subjectId,student_master.elective_set)'),">",DB::raw("'0'"))
		->leftjoin("subject_master as sm2",DB::raw('FIND_IN_SET(sm2.subjectId,student_master.additional_set)'),">",DB::raw("'0'"))
		->selectRaw("count(DISTINCT student_master.id) as rec_count,student_master.*,cm.courseName,cl.className,group_concat(distinct sm.subjectName SEPARATOR',') AS compulsary_subjects,group_concat(distinct sm1.subjectName SEPARATOR',') AS elective_subjects,group_concat(distinct sm2.subjectName SEPARATOR',') AS additional_subjects")
		->where('student_master.id',$id)
		->get();

		if($info[0]->rec_count>0)
		{
			$s_state=$info[0]->state_id;
			$s_course=$info[0]->course_id;
			$s_class=$info[0]->class_id;
			$s_section=$info[0]->section_id;
			$f_course=$info[0]->course_first;
			$s_station=$info[0]->station_id;
			$s_route=$info[0]->route_id;
			$compulsary_set=$info[0]->compulsary_set;
			$elective_set=$info[0]->elective_set;
			$additional_set=$info[0]->additional_set;
			$compulsary_arr=explode(',',$info[0]->compulsary_subjects);
			$elective_arr=explode(',',$info[0]->elective_subjects);
			$additional_arr=explode(',',$info[0]->additional_subjects);

			$districts=District::where('state_id',$s_state)->get();
			$classess=Classic::where('courseId',$s_course)->get();
			$classarr=Classic::where('courseId',$f_course)->get();
			$sections=SectionMaster::where('courseId',$s_course)->where('classId',$s_class)->get();

			$routes = RouteMaster::select('routeId','routeNo')
             ->whereRaw("FIND_IN_SET($s_station,stationList)")
             ->get();

			$vehicles=Vehicle::where('route_id',$s_route)->get();

			if($s_section !='')
			{
				$classwise=ClasswiseSubject::where('courseId',$s_course)
				->where('classId',$s_class)
				->where('sectionId',$s_section)
				->get();
			}
			else
			{
				$classwise=ClasswiseSubject::where('courseId',$s_course)
				->where('classId',$s_class)
				->get();
			}

			foreach($classwise AS $cw)
			{
				array_push($row_arr,$cw->id);
			}

			if(count($row_arr)>0)
			{
				$compulsary_subjects = SubjectMaster::leftJoin('class_wise_sub_desc as cw','subject_master.subjectId','=','cw.subjectId')
						->select('subject_master.subjectId','subject_master.subjectName')
						->whereIn('cw.csId',$row_arr)
						->where('cw.compulsary',1)
						->where('subject_master.status',1)
						->groupBy('subject_master.subjectId')
						->get();

				$elective_subjects = SubjectMaster::leftJoin('class_wise_sub_desc as cw','subject_master.subjectId','=','cw.subjectId')
							->select('subject_master.subjectId','subject_master.subjectName')
							->whereIn('cw.csId',$row_arr)
							->where('cw.elective',1)
							->where('subject_master.status',1)
							->groupBy('subject_master.subjectId')
							->get();

				$additional_subjects = SubjectMaster::leftJoin('class_wise_sub_desc as cw','subject_master.subjectId','=','cw.subjectId')
							->select('subject_master.subjectId','subject_master.subjectName')
							->whereIn('cw.csId',$row_arr)
							->where('cw.addition',1)
							->where('subject_master.status',1)
							->groupBy('subject_master.subjectId')
							->get();
			}

			$data_arr=array('data'=>$info,'classess'=>$classess,'sections'=>$sections,'districts'=>$districts,'classlist'=>$classarr,'routes'=>$routes,'vehicles'=>$vehicles,'compulsaries'=>$compulsary_subjects,'electives'=>$elective_subjects,'additionals'=>$additional_subjects,'compulsary_set'=>$compulsary_set,'elective_set'=>$elective_set,'additional_set'=>$additional_set,'compulsary_arr'=>$compulsary_arr,'elective_arr'=>$elective_arr,'additional_arr'=>$additional_arr);

			return response()->json(["status" =>'successed', "success" => true, "message" => "student record found successfully","data" =>$data_arr]);
		}
		else {
			return response()->json(["status" => "failed", "message" => "Whoops! failed to edit, student does not exist!!","errors" =>'']);
		}
   }

   public function update(Request $request,$id)
   {
		$inputs=$request->all();
		$tab=$request->tab;

		$image_rule = $image_rule1= $image_rule2="";
		$image_name = $image_name1= $image_name2="";

		$info = StudentMaster::where('id',$id)->get();

		$slc=empty($request->slc_id)?'':$request->slc_id;

		if(count($info)>0)
		{
			if($tab=='personal_detail')
			{
				$email_rule=($request->email==$info[0]->email)?'required|max:255':'required|unique:student_master|max:255';

				if($request->file('student_image')!=null)
				{
					$image_rule = 'required|image|mimes:jpeg,png,jpg|max:5120';
				}

				$rules=[
					// 'student_image' => $image_rule,
					'student_name' => 'required',
					'dob' => 'required',
					'gender' => 'required',
					// 'nationality' => 'required',
					// 'marital_status' => 'required|not_in:0',
					// 'account_no' => 'required',
					// 'ifsc' => 'required',
					// 'branch_address' => 'required',
					// 'caste' => 'required|not_in:0',
					// 'religion' => 'required|not_in:0',
					// 'mobile' => 'required',
					// 'email' => $email_rule,
					// 'blood_group' => 'required',
					'aadhar_no' => 'required',
					// 'permanent_address' => 'required',
					// 'state_id' => 'required|not_in:0',
					// 'district_id' => 'required|not_in:0',
					// 'pincode' => 'required'
				];

				$fields = [
					'student_image' => 'Student Image',
					'student_name' => 'Student Name',
					'dob' => 'Date of Birth',
					'gender' => 'Gender',
					'nationality' => 'Nationality',
					'marital_status' => 'Maritial Status',
					'account_no' => 'Account No.',
					'ifsc' => 'IFSC Code',
					'branch_address' => 'Branch Address',
					'caste' => 'Caste',
					'religion' => 'Religion',
					'mobile' => 'Mobile No.',
					'email' => 'Email',
					'blood_group' => 'Blood Group',
					'aadhar_no' => 'Aadhar No.',
					'permanent_address' => 'Permanent Address',
					'state_id' => 'State',
					'district_id' => 'District',
					'pincode' => 'Pincode'
				];

				$messages = [
					'required' => 'The :attribute field is required.',
				];
			}
			else if($tab=='parents_detail')
			{
				$parent_type=empty($request->parent_type)?'':$request->parent_type;
				$parent_rule=($parent_type=='new')?'':'required|not_in:0';

				$mobile_rule=($request->f_mobile==$info[0]->f_mobile)?'required|max:25':'required|unique:student_master|max:25';

				if($request->file('father_image')!=null)
				{
					$image_rule1 = 'required|image|mimes:jpeg,png,jpg|max:5120';
				}

				if($request->file('mother_image')!=null)
				{
					$image_rule2 = 'required|image|mimes:jpeg,png,jpg|max:5120';
				}

				$rules=[
					'parent_type' => 'required',
					'sibling_admission_no' => $parent_rule,
					'sibling_no' => $parent_rule,
					// 'father_image' => $image_rule1,
					// 'mother_image' => $image_rule2,
					'father_name' => 'required',
					'mother_name' => 'required',
					// 'f_occupation' => 'required',
					// 'f_income' => 'required',
					// 'f_designation' => 'required',
					'f_mobile' => $mobile_rule,
					// 'f_email' => 'required',
					// 'images.*' => 'required|image|mimes:jpeg,png,jpg|max:2048'
				];

				$messages = [
					'required' => 'The :attribute field is required.',
				];

				$fields = [
					'parent_type' => 'Parent Type',
					'sibling_admission_no' => 'Sibling Admission No.',
					'sibling_no' => 'Sibling Child',
					'father_image' => 'Father Image',
					'mother_image' => 'Mother Image',
					'father_name' => 'Father Name',
					'mother_name' => 'Mother Name',
					'f_occupation' => "Father's Occupation",
					'f_income' => "Father's Annual Income",
					'f_designation' => 'Designation',
					'f_mobile' => 'Mobile No (For SMS)',
					'f_email' => 'E-Mail ID',
				];
			}
			else if($tab=='admission_detail')
			{
				$admsn_rule=($request->admission_no==$info[0]->admission_no)?'required|max:255':'required|unique:student_master|max:255';

				$rules=[
					// 'admission_date' => 'required',
					// 'admission_no' => $admsn_rule,
					'course_id' => 'required|not_in:0',
					'class_id' => 'required|not_in:0',
					'section_id' => 'required',
					'roll_no' => 'required',
					// 'registration_no' => 'required',
					// 'board_roll_no' => 'required',
					// 'leaving_certificate' => 'required',
					// 'course_first' => 'required|not_in:0',
					// 'class_first' => 'required|not_in:0'
				];

				$fields = [
					'admission_date' => 'Date of Admission',
					'admission_no' => 'Admission No.',
					'course_id' => 'Course Name',
					'class_id' => 'Class Name',
					'section_id' => 'Section Name',
					'roll_no' => 'Student Roll No.',
					'registration_no' => 'Registration No.',
					'board_roll_no' => 'Board Roll No.',
					'leaving_certificate' => 'School Leaving Certificate',
					'course_first' => 'Course At the time of Admission',
					'class_first' => 'Class At the time of Admission'
				];

				$messages = [
					'required' => 'The :attribute field is required.',
				];
			}
			else if($tab=='subject_detail')
			{
				$rules=[
					'compulsary' => ''
				];

				$messages = [
					'required' => 'The :attribute field is required.',
				];

				$fields = [
					'compulsary' => 'Compulsory Subjects'
				];

			}
			else if($tab=='miscellaneous_detail')
			{
				$transportation=empty($request->transportation)?'':$request->transportation;
				$concession=empty($request->transport_concession)?'':$request->transport_concession;
				$staff=empty($request->staffchild)?'':$request->staffchild;

				$station_rule=($transportation=='no')?'':'required|not_in:0';
				$route_rule=($transportation=='no')?'':'required|not_in:0';
				$vehicle_rule=($transportation=='no')?'':'required|not_in:0';
				$concession_rule=($transportation=='yes')?'required':'';
				$fare_rule=($concession=='yes')?'required':'';
				$trans_rule=($concession=='yes')?'required':'';
				$total_rule=($concession=='yes')?'required':'';
				$staff_rule=($staff=='no')?'':'required|not_in:0';

				$rules=[
					// 'transportation' => 'required',
					// 'station_id'=>$station_rule,
					// 'route_id'=>$route_rule,
					// 'bus_no'=>$vehicle_rule,
					// 'busfare'=>$fare_rule,
					// 'transconcession_amount'=>$trans_rule,
					// 'totalfare'=>$total_rule,
					// 'transport_concession' => $concession_rule,
					// 'staffchild' => 'required',
					// 'child_no'=>$staff_rule,
					// 'management_concession' => 'required',
					// 'applicable' => 'required'
				];

				$fields = [
					'transportation' => 'Transportation',
					'station_id' => 'Station',
					'route_id' => 'Route',
					'bus_no' => 'Bus No.',
					'transport_concession' => 'Transportation Concession',
					'staffchild' => 'Staff Child',
					'child_no' => 'Child No.',
					'management_concession' => 'Management Concession',
					'applicable' => 'Applicable',
					'busfare' => 'Station Fare',
					'transconcession_amount' => 'Concession Amount',
					'totalfare' => 'After Concession Amount'
				];

				$messages = [
					'required' => 'The :attribute field is required.',
				];
			}
			else
			{
				$rules=[
					'images' => 'required',
					'images.*' => 'required|image|mimes:jpeg,png,jpg|max:2048'
				];

				$messages = [
					'required' => 'The :attribute field is required.',
				];

				$fields = [
					'images' => 'Student Photo Image'
				];
			}

			$validator = Validator::make($inputs, $rules, $messages, $fields);

			if ($validator->fails()) {
				$errors=$validator->errors();
				$response_arr=array("status"=>"failed","success"=>false,"message"=>"Please fill required fields!!","errors"=>$errors);
			}
			else
			{
				if($request->hasFile('student_image'))
				{
					$image  = $request->file('student_image');
					$imageDimensions = getimagesize($image);

					$width = $imageDimensions[0];
					$height = $imageDimensions[1];

					$new_height = Helper::setDimension($height);
					$new_width = Helper::setDimension($width);

					$image_name = time().rand(3, 9).'.'.$image->getClientOriginalExtension();
					$imgFile = Image::make($image->getRealPath());

					$destinationPath1 = public_path().'/uploads/student_image/';
					$destinationPath2 = public_path().'/uploads/student_image/thumbnail/';

					$image->move($destinationPath1,$image_name);

					$imgFile->resize($new_height,$new_width, function ($constraint) {
						$constraint->aspectRatio();
					})->save($destinationPath2.$image_name);

				}

				if($request->hasFile('father_image'))
				{
					$f_image  = $request->file('father_image');
					$imgFile = Image::make($f_image->getRealPath());
					$imageDimensions = getimagesize($f_image);

					$width = $imageDimensions[0];
					$height = $imageDimensions[1];

					$new_height = Helper::setDimension($height);
					$new_width = Helper::setDimension($width);

					$image_name1 = time().rand(3, 9).'.'.$f_image->getClientOriginalExtension();

					$destinationPath1 = public_path().'/uploads/father_image/';
					$destinationPath2 = public_path().'/uploads/father_image/thumbnail/';

					$f_image->move($destinationPath1,$image_name1);

					$imgFile->resize($new_height,$new_width, function ($constraint) {
						$constraint->aspectRatio();
					})->save($destinationPath2.$image_name1);

				}
				if($request->hasFile('mother_image'))
				{
					$m_image = $request->file('mother_image');
					$imgFile = Image::make($m_image->getRealPath());
					$imageDimensions = getimagesize($m_image);

					$width = $imageDimensions[0];
					$height = $imageDimensions[1];

					$new_height = Helper::setDimension($height);
					$new_width = Helper::setDimension($width);

					$image_name2 = time().rand(3, 9).'.'.$m_image->getClientOriginalExtension();

					$destinationPath1 = public_path().'/uploads/mother_image/';
					$destinationPath2 = public_path().'/uploads/mother_image/thumbnail/';

					$m_image->move($destinationPath1,$image_name2);

					$imgFile->resize($new_height,$new_width, function ($constraint) {
						$constraint->aspectRatio();
					})->save($destinationPath2.$image_name2);

				}

				if($slc !='')
				{
					$updt_arr=array('status'=>1);
					StudentMaster::where('id',$id)->update($updt_arr);
					TransferCertificate::where('id',$slc)->delete();
				}

				if($tab=='personal_detail')
				{
					$update_arr=array(
						'student_name'=>$request->student_name,
						'dob'=>$request->dob,
						'gender'=>$request->gender,
						'nationality'=>$request->nationality,
						'caste'=>$request->caste,
						'religion'=>$request->religion,
						'mobile'=>$request->mobile,
						'email'=>$request->email,
						'blood_group'=>$request->blood_group,
						'aadhar_no'=>$request->aadhar_no,
						'permanent_address'=>$request->permanent_address,
						'temporary_address'=>($request->temporary_address)?$request->temporary_address:'',
						'branch_address'=>($request->branch_address)?$request->branch_address:'',
						'state_id'=>$request->state_id,
						'district_id'=>$request->district_id,
						'pincode'=>$request->pincode,
						'student_image'=>($image_name=='')?$info[0]->student_image:$image_name,
						'account_no'=>empty($request->account_no)?'':$request->account_no,
						'ifsc_no'=>empty($request->ifsc)?'':$request->ifsc,
						'marital_status'=>empty($request->marital_status)?'':$request->marital_status,
					);

					$update=StudentMaster::where('id',$id)->update($update_arr);

					if($update)
					{
						$message="Details updated successfully";
						$response_arr=array("status"=>'successed',"success"=>true,"errors"=>[],"message"=>$message,"data" =>$update);
					}
					else
					{
						$message="could not saved!!";
						$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);
					}
				}
				else if($tab=='parents_detail')
				{
					$parent_type=empty($request->parent_type)?$info[0]->parent_type:$request->parent_type;
					$sibling_admission_no = ($parent_type=='new')?"":((empty($request->sibling_admission_no))?"":$request->sibling_admission_no);
					$sibling_no = ($parent_type=='new')?"":((empty($request->sibling_no))?"":$request->sibling_no);

					$update_arr=array(
						'parent_type'=>$parent_type,
						'sibling_admission_no'=>$sibling_admission_no,
						'sibling_no'=>$sibling_no,
						'father_name'=>empty($request->father_name)?'':$request->father_name,
						'mother_name'=>empty($request->mother_name)?'':$request->mother_name,
						'f_occupation'=>empty($request->f_occupation)?'':$request->f_occupation,
						'f_income'=>empty($request->f_income)?'':$request->f_income,
						'f_designation'=>empty($request->f_designation)?'':$request->f_designation,
						'f_mobile'=>empty($request->f_mobile)?'':$request->f_mobile,
						'f_email'=>empty($request->f_email)?'':$request->f_email,
						'residence_no'=>empty($request->residence_no)?'':$request->residence_no,
						'father_image'=>($image_name=='')?$info[0]->father_image:$image_name1,
						'mother_image'=>($image_name2=='')?$info[0]->mother_image:$image_name2
					);

					$update=StudentMaster::where('id',$id)->update($update_arr);

					if($update)
					{
						$checkCredit = ParentLogin::selectRaw('count(*) as row_count')
									 ->where('s_id',$id)
									 ->get();

						if($checkCredit[0]->row_count>0)
						{
							$parent_credential=array(
								'mobile_no'=>$request->f_mobile,
								// 'password' => Hash::make($request->mobile_no)
                                'password' => Hash::make('htl@0097')
							);

							$credential=ParentLogin::where('s_id',$id)->update($parent_credential);
						}
						else
						{
							$parent_credential=array(
								's_id'=>$id,
								'mobile_no'=>$request->f_mobile,
								// 'password' => Hash::make($request->mobile_no)
                                'password' => Hash::make('htl@0097')
							);

							ParentLogin::create($parent_credential);
						}

						$message="Details updated successfully";
						$response_arr=array("status"=>'successed',"success"=>true,"errors"=>[],"message"=>$message,"data" =>$update);
					}
					else
					{
						$message="could not saved!!";
						$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);
					}
					//
				}
				else if($tab=='admission_detail')
				{
					$update_arr=array(
						'admission_date'=>$request->admission_date,
						'admission_no'=>$request->admission_no,
						'course_id'=>$request->course_id,
						'class_id'=>$request->class_id,
						'section_id'=>$request->section_id,
						'roll_no'=>$request->roll_no,
						'registration_no'=>$request->registration_no,
						'board_roll_no'=>$request->board_roll_no,
						'leaving_certificate'=>$request->leaving_certificate,
						'course_first'=>$request->course_first,
						'class_first'=>$request->class_first
					);

					$update=StudentMaster::where('id',$id)->update($update_arr);

					if($update)
					{
						$message="Details updated successfully";
						$response_arr=array("status"=>'successed',"success"=>true,"errors"=>[],"message"=>$message,"data" =>$update);
					}
					else
					{
						$message="could not saved!!";
						$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);
					}

				}
				else if($tab=='subject_detail')
				{
					$update_arr=array(
						'compulsary_set'=>empty($request->compulsary)?'':$request->compulsary,
						'elective_set'=>empty($request->elective)?'':$request->elective,
						'additional_set'=>empty($request->additional)?'':$request->additional
					);

					$update=StudentMaster::where('id',$id)->update($update_arr);

					if($update)
					{
						$message="Details updated successfully";
						$response_arr=array("status"=>'successed',"success"=>true,"errors"=>[],"message"=>$message,"data" =>$update);
					}
					else
					{
						$message="could not saved!!";
						$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);
					}
				}
				else if($tab=='miscellaneous_detail')
				{
					$transportation=empty($request->transportation)?$info[0]->transportation:$request->transportation;
					$transport_concession=empty($request->transport_concession)?$info[0]->transport_concession:$request->transport_concession;
					$staffchild=empty($request->staffchild)?'no':$request->staffchild;

					$station_id = ($transportation=='no')?"":((empty($request->station_id))?$info[0]->station_id:$request->station_id);
					$route_id = ($transportation=='no')?"":((empty($request->route_id))?$info[0]->route_id:$request->route_id);
					$bus_no = ($transportation=='no')?"":((empty($request->bus_no))?$info[0]->bus_no:$request->bus_no);

					$busfare = ($transportation=='no' || $transport_concession=='no')?"":((empty($request->busfare))?$info[0]->busfare:$request->busfare);

					$transconcession_amount = ($transportation=='no' || $transport_concession=='no')?"":((empty($request->transconcession_amount))?$info[0]->transconcession_amount:$request->transconcession_amount);

					$totalfare = ($transportation=='no' || $transport_concession=='no')?"":((empty($request->totalfare))?$info[0]->totalfare:$request->totalfare);

					$staffchild=empty($request->staffchild)?$info[0]->staffchild:$request->staffchild;

					$child_no = ($staffchild=='no')?"":((empty($request->child_no))?$info[0]->child_no:$request->child_no);

					$update_arr=array(
						'transportation'=>$transportation,
						'station_id'=>$station_id,
						'route_id'=>$route_id,
						'bus_no'=>$bus_no,
						'busfare'=>$busfare,
						'transconcession_amount'=>$transconcession_amount,
						'totalfare'=>$totalfare,
						'transport_concession'=>$transport_concession,
						'staffchild'=>$staffchild,
						'child_no'=>$child_no,
						'applicable'=>empty($request->applicable)?'no':$request->applicable,
						'management_concession'=>empty($request->management_concession)?'no':$request->management_concession,
					);

					$update=StudentMaster::where('id',$id)->update($update_arr);

					if($update)
					{
						$message="Details updated successfully";
						$response_arr=array("status"=>'successed',"success"=>true,"errors"=>[],"message"=>$message,"data" =>$update);
					}
					else
					{
						$message="could not edited!!";
						$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);
					}

				}
				else
				{
					$message="could not edited!!";
					$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);

				}

			}

		}
		else {
			$message="Whoops! failed to edit, student does not exist!!";
			$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);
		}

		return response()->json($response_arr);

   }

   public function getVehicles($id)
   {
        $vehicles=Vehicle::where("route_id",$id)->get();

        if(count($vehicles)>0) {
            return response()->json(["status" => "successed", "success" => true, "data" => $vehicles]);
        }
        else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found"]);
        }
   }

   public function getSuggestion($search)
   {
        $result=StudentMaster::leftJoin('class_master as cs','student_master.class_id','=','cs.classId')
			->leftJoin('station_master as sm','student_master.station_id','=','sm.stationId')
			->select('student_master.*','cs.className','sm.stationName')
			->where('cs.className','like','%'.$search.'%')
            ->orWhere('student_master.student_name','like','%'.$search.'%')
			->orWhere('student_master.father_name','like','%'.$search.'%')
			->orWhere('student_master.sibling_admission_no','like','%'.$search.'%')
            ->get();

        if(count($result)>0) {
            return response()->json(["status" => "successed", "success" => true, "data" => $result]);
        }
        else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no result found"]);
        }
   }

   public function getRollNo($course,$class)
   {
		 $fiscal_yr=Helper::getFiscalYear(date('m'));
		 $fiscal_arr=explode(':',$fiscal_yr);
		 $fiscalYear=SessionMaster::where('session_start',$fiscal_arr[0])->where('session_end',$fiscal_arr[1])->get();
		 $fiscal_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0;
		 $result=StudentMaster::where("course_id",$course)
					->where("class_id",$class)
					->where("session_id",$fiscal_id)
					->select(DB::raw('IFNULL(MAX(id),0)+1 as next_id'))
					->get();

		 return response()->json(["status" => "successed", "success" => true, "data" => $result]);
   }

   public function getStudent($key)
   {
        $result=StudentMaster::leftJoin('class_master as cs','student_master.class_id','=','cs.classId')
			->leftJoin('class_master as cm','student_master.class_first','=','cm.classId')
			->selectRaw("student_master.*,cs.className as present_class,cm.className as admission_class")
			->where("student_master.admission_no",$key)
			->get();

        if(count($result)>0) {
            return response()->json(["status" => "successed", "success" => true, "data" => $result]);
        }
        else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found"]);
        }
   }

    public function printAdmission($key,$head)
	{
		$info=StudentMaster::where("admission_no",$key)->get();
		if(count($info)>0) {
			$school=School::where('id',$head)->get();
			$registration = StudentMaster::leftJoin('student_master as sm','student_master.sibling_admission_no','=','sm.admission_no')
			->leftJoin('course_master as cm','student_master.course_id','=','cm.courseId')
			->leftJoin('class_master as cl','student_master.class_id','=','cl.classId')
			->selectRaw("student_master.*,ifnull(sm.student_name,'N/A') AS sibling_name,ifnull(sm.admission_no,'N/A') AS sibling_admission_number,cm.courseName,cl.className")
			->where('student_master.id',$info[0]->id)
			->get();

			$page_data = array('school'=>$school,'student'=>$registration);
			$slip_name=time().rand(1,99).'.'.'pdf';
			$pdf = PDF::loadView("withdrawl_form",$page_data)->save(public_path("admissions/$slip_name"));
			return response()->json(["status"=>"successed","success"=>true,"message"=>"Admission form generated","data"=> $slip_name]);
		}
		else {
			return response()->json(["status"=>"failed","success"=>false,"message"=>"Whoops! no record found"]);
		}
	}








	public function add(Request $request)
	{
		$inputs=$request->all();
		$tab=$request->tab;
		$action=$request->button;
		$school_id=$request->school_id;
		$insert_id=empty($request->insert_id)?'':$request->insert_id;
		$registration_id=empty($request->registration_id)?'':$request->registration_id;
		$image_name = empty($request->s_image)?'':$request->s_image;
		$image_name1= empty($request->f_image)?'':$request->f_image;
		$image_name2= empty($request->m_image)?'':$request->m_image;
		$image_rule = $image_rule1= $image_rule2=$email_rule="";

		if($insert_id)
		{
			$info = StudentMaster::where('id',$insert_id)->get();
		}

		//manually assign
		$tab='personal_detail';

		if($tab=='personal_detail')
		{
			if($insert_id)
			{
				$email_rule=($request->email==$info[0]->email)?'required|max:255':'required|unique:student_master|max:255';
			}
			else
			{
				$email_rule='required|unique:student_master|max:255';
			}

			if($request->file('student_image')!=null)
			{
				$image_rule = 'required|image|mimes:jpeg,png,jpg|max:5120';
			}

			$rules=[
				'student_image' => $image_rule,
				'student_name' => 'required',
				// 'dob' => 'required',
				'gender' => 'required',
				'nationality' => 'required',
				// 'marital_status'=>'required',
				// 'account_no' => 'required',
				// 'ifsc' => 'required',
				// 'branch_address' => 'required',
				// 'caste' => 'required',
				// 'religion' => 'required',
				// 'mobile' => 'required',
				// 'email' => $email_rule,
				// 'blood_group' => 'required',
				'aadhar_no' => 'required|min:12|max:12',
				// 'permanent_address' => 'required',
				// 'state_id' => 'required',
				// 'district_id' => 'required',
				// 'pincode' => 'required'
			];

			$fields = [
				'student_image' => 'Student Image',
				'student_name' => 'Student Name',
				'dob' => 'Date of Birth',
				'gender' => 'Gender',
				'nationality' => 'Nationality',
				'marital_status' => 'Maritial Status',
				'account_no' => 'Account No.',
				'ifsc' => 'IFSC Code',
				'branch_address' => 'Branch Address',
				'caste' => 'Caste',
				'religion' => 'Religion',
				'mobile' => 'Mobile No.',
				'email' => 'Email',
				'blood_group' => 'Blood Group',
				'aadhar_no' => 'Aadhar No.',
				'permanent_address' => 'Permanent Address',
				'state_id' => 'State',
				'district_id' => 'District',
				'pincode' => 'Pincode'
			];

			$messages = [
				'required' => 'The :attribute field is required.',
			];

			$validator = Validator::make($inputs, $rules, $messages, $fields);

			if ($validator->fails()) {
				$errors=$validator->errors();
				$response_arr=array("status"=>"failed","success"=>false,"message"=>"Please fill required fields!!","errors"=>$errors,"tab"=>1);
				return response()->json($response_arr);
			}
	$tab='parents_detail';
			
		}
		if($tab=='parents_detail')
		{
			$parent_type=empty($request->parent_type)?'':$request->parent_type;
			$parent_rule=($parent_type=='new')?'':'required';

			if($request->file('father_image')!=null)
			{
				$image_rule1 = 'required|image|mimes:jpeg,png,jpg|max:5120';
			}

			if($request->file('mother_image')!=null)
			{
				$image_rule2 = 'required|image|mimes:jpeg,png,jpg|max:5120';
			}

			if($insert_id)
			{
				$mobile_rule=($request->f_mobile==$info[0]->f_mobile)?'required|max:25':'required|unique:student_master|max:25';
			}
			else
			{
				$mobile_rule='required|unique:student_master|max:25';
			}

			$rules=[
				'parent_type' => 'required',
				'sibling_admission_no' => $parent_rule,
				'sibling_no' => $parent_rule,
				'father_image' => $image_rule1,
				'mother_image' => $image_rule2,
				'father_name' => 'required',
				'mother_name' => 'required',
				// 'f_occupation' => 'required',
				// 'f_income' => 'required',
				// 'f_designation' => 'required',
				'f_mobile' => $mobile_rule,
				// 'f_email' => 'required',
				'images.*' => 'required|image|mimes:jpeg,png,jpg|max:2048'
			];

			$messages = [
				'required' => 'The :attribute field is required.',
			];

			$fields = [
				'parent_type' => 'Parent Type',
				'sibling_admission_no' => 'Sibling Admission No.',
				'sibling_no' => 'Sibling Child',
				'father_image' => 'Father Image',
				'mother_image' => 'Mother Image',
				'father_name' => 'Father Name',
				'mother_name' => 'Mother Name',
				'f_occupation' => "Father's Occupation",
				'f_income' => "Father's Annual Income",
				'f_designation' => 'Designation',
				'f_mobile' => 'Mobile No (For SMS)',
				'f_email' => 'E-Mail ID',
			];
			$validator = Validator::make($inputs, $rules, $messages, $fields);

			if ($validator->fails()) {
				$errors=$validator->errors();
				$response_arr=array("status"=>"failed","success"=>false,"message"=>"Please fill required fields!!","errors"=>$errors,"tab"=>2);
				return response()->json($response_arr);
			}
			$tab='admission_detail';
		}
      if($tab=='admission_detail')
		{
			$course_id=empty($request->course_id)?'':$request->course_id;
			$class_id=empty($request->class_id)?'':$request->class_id;
			$section_id=empty($request->section_id)?'':$request->section_id;

			//echo '1';
			if($insert_id)
			{
				$admsn_rule=($request->admission_no==$info[0]->admission_no)?'required|max:255':'required|unique:student_master|max:255';

				// $roll_rule=($request->roll_no==$info[0]->roll_no)?['required']:['required', new uniqueRollNo($course_id,$class_id,$section_id)];
				//echo '3';
			}
			else
			{
				$admsn_rule='required|unique:student_master|max:255';
				//$roll_rule=['required', new uniqueRollNo($course_id,$class_id,$section_id)];
				//echo '4';
			}

			$rules=[
				//  'admission_date' => 'required',
				'admission_no' => $admsn_rule,
				'course_id' => 'required',
				'class_id' => 'required',
				// 'section_id' => 'required',
				// 'roll_no' => 'required',
				// 'roll_no' => $roll_rule,
				// 'registration_no' => 'required',
				// 'board_roll_no' => 'required',
				// 'leaving_certificate' => 'required',
				// 'course_first' => 'required',
				// 'class_first' => 'required'
			];

			$fields = [
				'admission_date' => 'Date of Admission',
				'admission_no' => 'Admission No.',
				'course_id' => 'Course Name',
				'class_id' => 'Class Name',
				'section_id' => 'Section Name',
				// 'roll_no' => 'Student Roll No.',
				// 'registration_no' => 'Registration No.',
				// 'board_roll_no' => 'Board Roll No.',
				// 'leaving_certificate' => 'School Leaving Certificate',
				// 'course_first' => 'Course At the time of Admission',
				// 'class_first' => 'Class At the time of Admission'
			];

			$messages = [
				'required' => 'The :attribute field is required.',
			];
			//echo '5';
			$validator = Validator::make($inputs, $rules, $messages, $fields);
			if ($validator->fails()) {
				$errors=$validator->errors();
				$response_arr=array("status"=>"failed","success"=>false,"message"=>"Please fill required fields!!","errors"=>$errors,"tab"=>3);
				return response()->json($response_arr);
			}
			$tab='subject_detail';
		}
		if($tab=='subject_detail')
		{
			$rules=[
				'compulsary' => ''
			];

			$messages = [
				'required' => 'The :attribute field is required.',
			];

			$fields = [
				'compulsary' => 'Compulsory Subjects'
			];
			$validator = Validator::make($inputs, $rules, $messages, $fields);
			if ($validator->fails()) {
				$errors=$validator->errors();
				$response_arr=array("status"=>"failed","success"=>false,"message"=>"Please fill required fields!!","errors"=>$errors,"tab"=>4);
				return response()->json($response_arr);
			} 

			$tab='miscellaneous_detail';

		}


		if($tab=='miscellaneous_detail')
		{
			$transportation=empty($request->transportation)?'':$request->transportation;
			$concession=empty($request->transport_concession)?'':$request->transport_concession;
			$staff=empty($request->staffchild)?'':$request->staffchild;

			$station_rule=($transportation=='no')?'':'required';
			$route_rule=($transportation=='no')?'':'required';
			$vehicle_rule=($transportation=='no')?'':'required';
			$concession_rule=($transportation=='yes')?'required':'';
			$fare_rule=($concession=='yes')?'required':'';
			$trans_rule=($concession=='yes')?'required':'';
			$total_rule=($concession=='yes')?'required':'';
			$staff_rule=($staff=='no')?'':'required';

			$rules=[
				// 'transportation' => 'required',
				'station_id'=>$station_rule,
				'route_id'=>$route_rule,
				'bus_no'=>$vehicle_rule,
				'busfare'=>$fare_rule,
				'transconcession_amount'=>$trans_rule,
				'totalfare'=>$total_rule,
				'transport_concession' => $concession_rule,
				// 'staffchild' => 'required',
				'child_no'=>$staff_rule
				// 'management_concession' => 'required',
				// 'applicable' => 'required'
			];

			$fields = [
				'transportation' => 'Transportation',
				'station_id' => 'Station',
				'route_id' => 'Route',
				'bus_no' => 'Bus No.',
				'transport_concession' => 'Transportation Concession',
				'staffchild' => 'Staff Child',
				'child_no' => 'Staff No.',
				'management_concession' => 'Management Concession',
				'applicable' => 'Applicable',
				'busfare' => 'Station Fare',
				'transconcession_amount' => 'Concession Amount',
				'totalfare' => 'After Concession Amount'
			];

			$messages = [
				'required' => 'The :attribute field is required.',
			];

			$validator = Validator::make($inputs, $rules, $messages, $fields);
			if ($validator->fails()) {
				$errors=$validator->errors();
				$response_arr=array("status"=>"failed","success"=>false,"message"=>"Please fill required fields!!","errors"=>$errors,"tab"=>5);
				return response()->json($response_arr);
			} 
		

			else
		{
			$school=School::where('id',$school_id)->get();
			$fiscal_yr=Helper::getFiscalYear(date('m'));
			$fiscal_arr=explode(':',$fiscal_yr);
			$fiscalYear=SessionMaster::where('session_start',$fiscal_arr[0])->where('session_end',$fiscal_arr[1])->get();
			$fiscal_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0;

			if($request->hasFile('student_image'))
			{
				$image  = $request->file('student_image');

				/* $height = Image::make($image)->height();
				$width = Image::make($image)->width();    */

				$imageDimensions = getimagesize($image);

				$width = $imageDimensions[0];
				$height = $imageDimensions[1];

				$new_height = Helper::setDimension($height);
				$new_width = Helper::setDimension($width);

				$image_name = time().rand(3, 9).'.'.$image->getClientOriginalExtension();
				$imgFile = Image::make($image->getRealPath());

				$destinationPath1 = public_path().'/uploads/student_image/';
				$destinationPath2 = public_path().'/uploads/student_image/thumbnail/';

				$image->move($destinationPath1,$image_name);

				$imgFile->resize($new_height,$new_width, function ($constraint) {
					$constraint->aspectRatio();
				})->save($destinationPath2.$image_name);

			}

			if($request->hasFile('father_image'))
			{
				$f_image  = $request->file('father_image');
				$imgFile = Image::make($f_image->getRealPath());
				$imageDimensions = getimagesize($f_image);

				$width = $imageDimensions[0];
				$height = $imageDimensions[1];

				$new_height = Helper::setDimension($height);
				$new_width = Helper::setDimension($width);

				$image_name1 = time().rand(3, 9).'.'.$f_image->getClientOriginalExtension();

				$destinationPath1 = public_path().'/uploads/father_image/';
				$destinationPath2 = public_path().'/uploads/father_image/thumbnail/';

				$f_image->move($destinationPath1,$image_name1);

				$imgFile->resize($new_height,$new_width, function ($constraint) {
					$constraint->aspectRatio();
				})->save($destinationPath2.$image_name1);

			}
			if($request->hasFile('mother_image'))
			{
				$m_image = $request->file('mother_image');
				$imgFile = Image::make($m_image->getRealPath());
				$imageDimensions = getimagesize($m_image);

				$width = $imageDimensions[0];
				$height = $imageDimensions[1];

				$new_height = Helper::setDimension($height);
				$new_width = Helper::setDimension($width);

				$image_name2 = time().rand(3, 9).'.'.$m_image->getClientOriginalExtension();

				$destinationPath1 = public_path().'/uploads/mother_image/';
				$destinationPath2 = public_path().'/uploads/mother_image/thumbnail/';

				$m_image->move($destinationPath1,$image_name2);

				$imgFile->resize($new_height,$new_width, function ($constraint) {
					$constraint->aspectRatio();
				})->save($destinationPath2.$image_name2);

			}

		
				if($insert_id)
				{

					$parent_type=empty($request->parent_type)?$info[0]->parent_type:$request->parent_type;
					$sibling_admission_no = ($parent_type=='new')?"":((empty($request->sibling_admission_no))?"":$request->sibling_admission_no);
					$sibling_no = ($parent_type=='new')?"":((empty($request->sibling_no))?"":$request->sibling_no);



					$transportation=empty($request->transportation)?$info[0]->transportation:$request->transportation;
					$transport_concession=empty($request->transport_concession)?$info[0]->transport_concession:$request->transport_concession;
					$staffchild=empty($request->staffchild)?'no':$request->staffchild;

					$station_id = ($transportation=='no')?"":((empty($request->station_id))?$info[0]->station_id:$request->station_id);
					$route_id = ($transportation=='no')?"":((empty($request->route_id))?$info[0]->route_id:$request->route_id);
					$bus_no = ($transportation=='no')?"":((empty($request->bus_no))?$info[0]->bus_no:$request->bus_no);

					$busfare = ($transportation=='no' || $transport_concession=='no')?"":((empty($request->busfare))?$info[0]->busfare:$request->busfare);

					$transconcession_amount = ($transportation=='no' || $transport_concession=='no')?"":((empty($request->transconcession_amount))?$info[0]->transconcession_amount:$request->transconcession_amount);

					$totalfare = ($transportation=='no' || $transport_concession=='no')?"":((empty($request->totalfare))?$info[0]->totalfare:$request->totalfare);

					$staffchild=empty($request->staffchild)?$info[0]->staffchild:$request->staffchild;

					$child_no = ($staffchild=='no')?"":((empty($request->child_no))?$info[0]->child_no:$request->child_no);


					$update_arr=array(
						'student_name'=>$request->student_name,
						'dob'=>$request->dob,
						'gender'=>$request->gender,
						'nationality'=>$request->nationality,
						'caste'=>$request->caste,
						'religion'=>$request->religion,
						'mobile'=>$request->mobile,
						'email'=>$request->email,
						'blood_group'=>$request->blood_group,
						'aadhar_no'=>$request->aadhar_no,
						'permanent_address'=>$request->permanent_address,
						'temporary_address'=>($request->temporary_address)?$request->temporary_address:'',
						'branch_address'=>($request->branch_address)?$request->branch_address:'',
						'state_id'=>$request->state_id,
						'district_id'=>$request->district_id,
						'pincode'=>$request->pincode,
						'student_image'=>($image_name=='')?$info[0]->student_image:$image_name,
						'account_no'=>empty($request->account_no)?'':$request->account_no,
						'ifsc_no'=>empty($request->ifsc)?'':$request->ifsc,
						'marital_status'=>empty($request->marital_status)?'':$request->marital_status,
						'parent_type'=>$parent_type,
						'sibling_admission_no'=>$sibling_admission_no,
						'sibling_no'=>$sibling_no,
						'father_name'=>empty($request->father_name)?$info[0]->father_name:$request->father_name,
						'mother_name'=>empty($request->mother_name)?$info[0]->mother_name:$request->mother_name,
						'f_occupation'=>empty($request->f_occupation)?'':$request->f_occupation,
						'f_income'=>empty($request->f_income)?'':$request->f_income,
						'f_designation'=>empty($request->f_designation)?'':$request->f_designation,
						'f_mobile'=>empty($request->f_mobile)?'':$request->f_mobile,
						'f_email'=>empty($request->f_email)?'':$request->f_email,
						'residence_no'=>empty($request->residence_no)?'':$request->residence_no,
						'father_image'=>($image_name1=='')?$info[0]->father_image:$image_name1,
						'mother_image'=>($image_name2=='')?$info[0]->mother_image:$image_name2,
						'admission_date'=>$request->admission_date,
						'admission_no'=>$request->admission_no,
						'course_id'=>$request->course_id,
						'class_id'=>$request->class_id,
						'section_id'=>$request->section_id,
						'roll_no'=>$request->roll_no,
						'registration_no'=>$request->registration_no,
						'board_roll_no'=>$request->board_roll_no,
						'leaving_certificate'=>$request->leaving_certificate,
						'course_first'=>$request->course_first,
						'class_first'=>$request->class_first,
						'compulsary_set'=>empty($request->compulsary)?'':$request->compulsary,
						'elective_set'=>empty($request->elective)?'':$request->elective,
						'additional_set'=>empty($request->additional)?'':$request->additional,
						'transportation'=>$transportation,
						'station_id'=>$station_id,
						'route_id'=>$route_id,
						'bus_no'=>$bus_no,
						'busfare'=>$busfare,
						'transconcession_amount'=>$transconcession_amount,
						'totalfare'=>$totalfare,
						'transport_concession'=>$transport_concession,
						'staffchild'=>$staffchild,
						'child_no'=>$child_no,
						'applicable'=>empty($request->applicable)?'':$request->applicable,
						'management_concession'=>empty($request->management_concession)?'':$request->management_concession,
					);

					$update=StudentMaster::where('id',$insert_id)->update($update_arr);
					$data_arr['insert_id']=$insert_id;

					$checkCredit = ParentLogin::selectRaw('count(*) as row_count')
					->where('s_id',$insert_id)
					->get();

	   if($checkCredit[0]->row_count>0)
	   {
		   $parent_credential=array(
			   'mobile_no'=>$request->f_mobile,
			   // 'password' => Hash::make($request->mobile_no)
			   'password' => Hash::make('htl@0097')

		   );

		   $credential=ParentLogin::where('s_id',$insert_id)->update($parent_credential);
	   }
	   else
	   {
		   $parent_credential=array(
			   's_id'=>$insert_id,
			   'mobile_no'=>$request->f_mobile,
			   // 'password' => Hash::make($request->mobile_no)
			   'password' => Hash::make('htl@0097')
		   );

		   ParentLogin::create($parent_credential);
	   }



					if($action=='saveprint')
					{
						$school=School::where('id',$school_id)->get();
						$registration = StudentMaster::leftJoin('student_master as sm','student_master.sibling_admission_no','=','sm.admission_no')
								->leftJoin('course_master as cm','student_master.course_id','=','cm.courseId')
								->leftJoin('class_master as cl','student_master.class_id','=','cl.classId')
								->selectRaw("student_master.*,ifnull(sm.student_name,'N/A') AS sibling_name,ifnull(sm.admission_no,'N/A') AS sibling_admission_number,cm.courseName,cl.className")
								->where('student_master.id',$insert_id)
								->get();

						$page_data = array('school'=>$school,'student'=>$registration);
						$slip_name=time().rand(1,99).'.'.'pdf';
						$data_arr['print_id']=$slip_name;
						$pdf = PDF::loadView("admission_form",$page_data)->save(public_path("admissions/$slip_name"));

						$message="student details saved, admission form generated.";

					}
					else
					{
						$message="student details updated successfully";
						$data_arr['print_id']="";
					}
					if($update)
					{
						$response_arr=array("status"=>'successed',"success"=>true,"errors"=>[],"message"=>$message,"data" =>$data_arr);
					}
					else
					{
						$message="could not saved!!";
						$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);
					}

				}
				else
				{

					$parent_type=empty($request->parent_type)?'':$request->parent_type;
					$sibling_admission_no = ($parent_type=='new')?"":((empty($request->sibling_admission_no))?"":$request->sibling_admission_no);
					$sibling_no = ($parent_type=='new')?"":((empty($request->sibling_no))?"":$request->sibling_no);


					$transportation=empty($request->transportation)?'no':$request->transportation;
					$transport_concession=empty($request->transport_concession)?'no':$request->transport_concession;
					$staffchild=empty($request->staffchild)?'no':$request->staffchild;

					$station_id = ($transportation=='no')?"":((empty($request->station_id))?"":$request->station_id);
					$route_id = ($transportation=='no')?"":((empty($request->route_id))?"":$request->route_id);
					$bus_no = ($transportation=='no')?"":((empty($request->bus_no))?"":$request->bus_no);

					$busfare = ($transportation=='no' || $transport_concession=='no')?"":((empty($request->busfare))?"":$request->busfare);

					$transconcession_amount = ($transportation=='no' || $transport_concession=='no')?"":((empty($request->transconcession_amount))?"":$request->transconcession_amount);

					$busfare = ($transportation=='no' || $transport_concession=='no')?"":((empty($request->busfare))?"":$request->busfare);

					$totalfare = ($transportation=='no' || $transport_concession=='no')?"":((empty($request->totalfare))?"":$request->totalfare);

					$staffchild=empty($request->staffchild)?'no':$request->staffchild;

					$child_no = ($staffchild=='no')?"":((empty($request->child_no))?"":$request->child_no);




					$insert_arr=array(
						'student_name'=>$request->student_name,
						'dob'=>$request->dob,
						'gender'=>$request->gender,
						'nationality'=>$request->nationality,
						'caste'=>$request->caste,
						'religion'=>$request->religion,
						'mobile'=>$request->mobile,
						'email'=>$request->email,
						'blood_group'=>$request->blood_group,
						'aadhar_no'=>$request->aadhar_no,
						'permanent_address'=>$request->permanent_address,
						'temporary_address'=>empty($request->temporary_address)?'':$request->temporary_address,
						'branch_address'=>empty($request->branch_address)?'':$request->branch_address,
						'account_no'=>empty($request->account_no)?'':$request->account_no,
						'ifsc_no'=>empty($request->ifsc)?'':$request->ifsc,
						'marital_status'=>empty($request->marital_status)?'':$request->marital_status,
						'state_id'=>$request->state_id,
						'district_id'=>$request->district_id,
						'registration_id'=>$request->registration_id,
						'pincode'=>$request->pincode,
						'student_image'=>$image_name,
					
						'session_id' => $fiscal_id,
						'school_id'=> $school_id,
						'parent_type'=>$parent_type,
						'sibling_admission_no'=>$sibling_admission_no,
						'sibling_no'=>$sibling_no,
						'father_name'=>empty($request->father_name)?'':$request->father_name,
						'mother_name'=>empty($request->mother_name)?'':$request->mother_name,
						'f_occupation'=>empty($request->f_occupation)?'':$request->f_occupation,
						'f_income'=>empty($request->f_income)?0:$request->f_income,
						'f_designation'=>empty($request->f_designation)?'':$request->f_designation,
						'f_mobile'=>empty($request->f_mobile)?'':$request->f_mobile,
						'f_email'=>empty($request->f_email)?'':$request->f_email,
						'residence_no'=>empty($request->residence_no)?'':$request->residence_no,
						'father_image'=>$image_name1,
						'mother_image'=>$image_name2,
						'registration_id'=>$request->registration_id,
						
						'status'=>1,
						'admission_date'=>$request->admission_date,
						'admission_no'=>$request->admission_no,
						'course_id'=>$request->course_id,
						'class_id'=>$request->class_id,
						'section_id'=>$request->section_id,
						'registration_id'=>$request->registration_id,
						'roll_no'=>$request->roll_no,
						'registration_no'=>$request->registration_no,
						'board_roll_no'=>$request->board_roll_no,
						'leaving_certificate'=>$request->leaving_certificate,
						'course_first'=>$request->course_first,
						'class_first'=>$request->class_first,
						'compulsary_set'=>empty($request->compulsary)?'':$request->compulsary,
						'elective_set'=>empty($request->elective)?'':$request->elective,
						'additional_set'=>empty($request->additional)?'':$request->additional,
						'transportation'=>$transportation,
						'station_id'=>$station_id,
						'route_id'=>$route_id,
						'registration_id'=>$request->registration_id,
						'bus_no'=>$bus_no,
						'busfare'=>$busfare,
						'transconcession_amount'=>$transconcession_amount,
						'totalfare'=>$totalfare,
						'transport_concession'=>$transport_concession,
						'staffchild'=>$staffchild,
						'child_no'=>$child_no,
						'applicable'=>empty($request->applicable)?'':$request->applicable,
						'management_concession'=>empty($request->management_concession)?'':$request->management_concession,
						
					);

					$register = StudentMaster::create($insert_arr);

					if($register->id)
					{
						$data_arr['insert_id']=$register->id;

						$parent_credential=array(
							's_id'=>$register->id,
							'mobile_no'=>$request->f_mobile,
							// 'password' => Hash::make($request->mobile_no)
                            'password' => Hash::make('htl@0097')
						);

						$credential = ParentLogin::create($parent_credential);





						if($action=='saveprint')
						{
							$school=School::where('id',$school_id)->get();
							$registration = StudentMaster::leftJoin('student_master as sm','student_master.sibling_admission_no','=','sm.admission_no')
									->leftJoin('course_master as cm','student_master.course_id','=','cm.courseId')
									->leftJoin('class_master as cl','student_master.class_id','=','cl.classId')
									->selectRaw("student_master.*,ifnull(sm.student_name,'N/A') AS sibling_name,ifnull(sm.admission_no,'N/A') AS sibling_admission_number,cm.courseName,cl.className")
									->where('student_master.id',$register->id)
									->get();

							$page_data = array('school'=>$school,'student'=>$registration);
							$slip_name=time().rand(1,99).'.'.'pdf';
							$pdf = PDF::loadView("admission_form",$page_data)->save(public_path("admissions/$slip_name"));
							$data_arr['print_id']=$slip_name;
							$message="student details saved, admission form generated.";
						}
						else
						{
							$data_arr['print_id']="";
							$message="student details saved successfully";
						}
						$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data" =>$data_arr);
					}
					else
					{
						$message="could not saved!!";
						$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);
					}

				}
			


			//$tab='miscellaneous_detail';

		}







		//  if($tab=='miscellaneous_detail')
		// {
		// 	$transportation=empty($request->transportation)?'':$request->transportation;
		// 	$concession=empty($request->transport_concession)?'':$request->transport_concession;
		// 	$staff=empty($request->staffchild)?'':$request->staffchild;

		// 	$station_rule=($transportation=='no')?'':'required';
		// 	$route_rule=($transportation=='no')?'':'required';
		// 	$vehicle_rule=($transportation=='no')?'':'required';
		// 	$concession_rule=($transportation=='yes')?'required':'';
		// 	$fare_rule=($concession=='yes')?'required':'';
		// 	$trans_rule=($concession=='yes')?'required':'';
		// 	$total_rule=($concession=='yes')?'required':'';
		// 	$staff_rule=($staff=='no')?'':'required';

		// 	$rules=[
		// 		'transportation' => 'required',
		// 		'station_id'=>$station_rule,
		// 		'route_id'=>$route_rule,
		// 		'bus_no'=>$vehicle_rule,
		// 		'busfare'=>$fare_rule,
		// 		'transconcession_amount'=>$trans_rule,
		// 		'totalfare'=>$total_rule,
		// 		'transport_concession' => $concession_rule,
		// 		'staffchild' => 'required',
		// 		'child_no'=>$staff_rule,
		// 		'management_concession' => 'required',
		// 		'applicable' => 'required'
		// 	];

		// 	$fields = [
		// 		'transportation' => 'Transportation',
		// 		'station_id' => 'Station',
		// 		'route_id' => 'Route',
		// 		'bus_no' => 'Bus No.',
		// 		'transport_concession' => 'Transportation Concession',
		// 		'staffchild' => 'Staff Child',
		// 		'child_no' => 'Staff No.',
		// 		'management_concession' => 'Management Concession',
		// 		'applicable' => 'Applicable',
		// 		'busfare' => 'Station Fare',
		// 		'transconcession_amount' => 'Concession Amount',
		// 		'totalfare' => 'After Concession Amount'
		// 	];

		// 	$messages = [
		// 		'required' => 'The :attribute field is required.',
		// 	];
		// }
		// else
		// {
		// 	$rules=[
		// 		'images' => 'required',
		// 		'images.*' => 'required|image|mimes:jpeg,png,jpg|max:2048'
		// 	];

		// 	$messages = [
		// 		'required' => 'The :attribute field is required.',
		// 	];

		// 	$fields = [
		// 		'images' => 'Student Photo Image'
		// 	];
		// }
		// $validator = Validator::make($inputs, $rules, $messages, $fields);
		// if ($validator->fails()) {
		// 	$errors=$validator->errors();
		// 	$response_arr=array("status"=>"failed","success"=>false,"message"=>"Please fill required fields!!","errors"=>$errors,"tab"=>5);
		// 	return response()->json($response_arr);
		// }
		

		
		
		// }



		

	}










	return response()->json($response_arr);





	}

}