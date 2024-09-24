<?php
 
namespace App\Models;  
use Illuminate\Database\Eloquent\Model;				
 
class BirthCertificate extends Model  		
{
	 protected $table = 'birth_certificates';	 	 		
	 protected $fillable = ['student_id','session_id','school_code','issue_count','bc_no','remark','issue_date'];  	   	
}