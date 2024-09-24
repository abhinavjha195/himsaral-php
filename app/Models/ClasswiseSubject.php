<?php
 
namespace App\Models;  
use Illuminate\Database\Eloquent\Model;
 
class ClasswiseSubject extends Model  
{
	protected $table = 'classwisesubject';     
    protected $fillable = ['courseId','classId','sectionId','SessionId','SchoolCode','EmpNo','semid'];   
	public $timestamps = false;   		  	
}