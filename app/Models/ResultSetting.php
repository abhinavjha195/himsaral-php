<?php
 
namespace App\Models;
 
use Illuminate\Database\Eloquent\Model;
 
class ResultSetting extends Model
{	
    protected $table = 'resultsettings';      		
	public $timestamps = false;		
    protected $fillable = ['course_id','exam_id','class_id','section_id','student_id','show_result'];  	    	
	
}