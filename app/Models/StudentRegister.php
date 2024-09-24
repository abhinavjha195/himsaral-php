<?php
 
namespace App\Models;  
use Illuminate\Database\Eloquent\Model;				
 
class StudentRegister extends Model  		
{
	 protected $table = 'student_registration';	 			 	    											        			
	 protected $fillable = ['student_name','mobile','father_name','mother_name','registration_no','caste','religion','email','blood_group','aadhar_no','pincode','account_no','ifsc_no','sibling_no','sibling_admission_no','f_occupation','f_designation','f_mobile','f_email','residence_no','student_image','father_image','mother_image','permanent_address','temporary_address','branch_address','dob','interview_date','registration_date','station_id','course_id','class_id','session_id','school_code','state_id','district_id','fee','f_income','gender','nationality','marital_status','parent_type'];  	 
	
}
