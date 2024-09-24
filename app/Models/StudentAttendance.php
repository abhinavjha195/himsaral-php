<?php
 
namespace App\Models;  
use Illuminate\Database\Eloquent\Model;		
 
class StudentAttendance extends Model		
{        			    			
    protected $fillable = ['subject_id','student_id','session_id','school_id','attend_type','attend_date'];         	    	
}

