<?php
 
namespace App\Models;
 
use Illuminate\Database\Eloquent\Model;
 
class SubjectMaster extends Model		
{	
    protected $table = 'subject_master';      
	public $timestamps = false;		
    protected $fillable = ['subjectId','subjectName','status','remark'];  	    			
	
}