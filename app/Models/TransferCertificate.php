<?php
 
namespace App\Models;  
use Illuminate\Database\Eloquent\Model;				
 
class TransferCertificate extends Model  		
{
	 protected $table = 'slc_certificates';	 
	 
	 protected $fillable = ['student_id','school_code','session_id','tc_no','fee_month','fee_year','concession','working_days','working_present','ncc_conduct','application_date','issue_date','reason','remark','fail_attempt','general_conduct','qualified','last_exam','game'];  	 
	
}
