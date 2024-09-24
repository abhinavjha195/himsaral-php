<?php
 
namespace App\Models;  
use Illuminate\Database\Eloquent\Model;		
 
class FeeAmtMaster extends Model		
{	
    protected $table = 'feeamtmaster';         			    			
    protected $fillable = ['SchoolCode','SessionId','CourseId','ClassId'];  
	public $timestamps = false;	    	   
}