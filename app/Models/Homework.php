<?php
 
namespace App\Models;  
use Illuminate\Database\Eloquent\Model;   	 		   	
 
class Homework extends Model
{ 
	protected $table = 'homeworks';						
    protected $fillable = ['class_id','section_id','subject_id','description','attachment','assign_date','school_id','session_id'];  			  	  	
}