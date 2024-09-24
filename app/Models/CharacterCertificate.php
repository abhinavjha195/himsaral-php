<?php
 
namespace App\Models;  
use Illuminate\Database\Eloquent\Model;				
 
class CharacterCertificate extends Model  		
{
	 protected $table = 'cc_master';	 
	 
	 protected $fillable = ['student_id','session_id','school_code','last_exam','exam_month','cc_no','exam_year','exam_board','serial_no','game','general_conduct','curricular_activity','remark','secured_marks','total_marks','last_date','issue_date'];  	   
	
}
