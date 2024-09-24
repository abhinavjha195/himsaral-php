<?php
 
namespace App\Models;
 
use Illuminate\Database\Eloquent\Model;
 
class Course extends Model
{	
    protected $table = 'course_master';      		
	public $timestamps = false;		
    protected $fillable = ['courseId','school_id','session_id','courseName','status','Remark'];  	    	
	
}