<?php
 
namespace App\Models;
 
use Illuminate\Database\Eloquent\Model;
 
class SectionMaster extends Model		
{	
    protected $table = 'section_master';      
	public $timestamps = false;		
    protected $fillable = ['sectionId','courseId','classId','sectionName','status','Remark'];  	    			
	
}