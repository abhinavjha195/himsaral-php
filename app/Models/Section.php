<?php
 
namespace App\Models;
 
use Illuminate\Database\Eloquent\Model;
 
class Section extends Model  
{ 	
    protected $table = 'section_master';      		
	public $timestamps = false;		
    protected $fillable = ['courseId','classId','school_id','session_id','sectionName','status','Remark'];  			  		
}