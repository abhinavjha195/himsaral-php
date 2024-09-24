<?php
 
namespace App\Models;
 
use Illuminate\Database\Eloquent\Model;
 
class Classic extends Model
{
	
    protected $table = 'class_master';    
	public $timestamps = false;		
    protected $fillable = ['classId','courseId','school_id','session_id','className','status','Remark'];  	  	
	
}