<?php
 
namespace App\Models;  
use Illuminate\Database\Eloquent\Model;		
 
class EmployeeAttendance extends Model		
{        			    			
    protected $fillable = ['emp_id','session_id','school_id','attend_type','attend_date'];           	    	
}

