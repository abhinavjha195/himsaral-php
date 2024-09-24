<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    protected $fillable = ['school_id','session_id','origin_id','emp_no','emp_name','dob','gender','caste','nationality','religion','marital_status','permanent_address','temporary_address','mobile','email','doj','dept_id','desig_id','emp_image','account_no','bank_name','ifsc','branch_name','father_name','mother_name','father_mobile','annual_income','salary_grade','grade_cbse','leaves_permitted','status','aadhar','pan','login_id','academic','qualify_id','state_id','passing_year','percentage','university','salary_withdrawn','leaving_reason','institute','job_nature','job_title','job_from','job_to','class_set','section_set'];
}
