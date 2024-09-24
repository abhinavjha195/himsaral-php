<?php
 
namespace App\Models;  
use Illuminate\Database\Eloquent\Model;
 
class ClasswiseDesc extends Model  
{
	protected $table = 'class_wise_sub_desc';     		
    protected $fillable = ['csId','subjectId','compulsary','elective','addition','priority'];   
	public $timestamps = false;   		  	
}