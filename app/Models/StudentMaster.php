<?php
 
namespace App\Models;  
use Illuminate\Database\Eloquent\Model;		
 
class StudentMaster extends Model  		
{
    protected $table = 'student_master';   	    											        			
    protected $fillable = ['state_id','district_id','course_id','class_id','section_id','course_first','class_first','station_id','route_id','bus_no','child_no','session_id','registration_id','status','added_by','mode_of_admission','f_income','busfare','transconcession_amount','totalfare','amount_paid','marital_status','gender','nationality','parent_type','leaving_certificate','transportation','transport_concession','staffchild','management_concession','applicable','student_name','ifsc_no','account_no','father_name','mother_name','caste','religion','mobile','email','blood_group','aadhar_no','pincode','student_image','father_image','mother_image','f_occupation','f_designation','f_mobile','f_email','residence_no','sibling_no','sibling_admission_no','admission_no','roll_no','registration_no','board_roll_no','school_id','school_adm_no','permanent_address','temporary_address','branch_address','compulsary_set','elective_set','additional_set','dob','admission_date'];  	  		
}
