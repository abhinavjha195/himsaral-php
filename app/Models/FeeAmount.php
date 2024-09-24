<?php
 
namespace App\Models;  
use Illuminate\Database\Eloquent\Model;		
 
class FeeAmount extends Model		
{	
    protected $table = 'fee_amounts';           			
    protected $fillable = ['course_id','class_id','cat_id','amount'];  	 				
}