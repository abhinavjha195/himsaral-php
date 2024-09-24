<?php
 
namespace App\Models;  
use Illuminate\Database\Eloquent\Model;			
 
class FeeTemp extends Model		
{	
    protected $table = 'fee_temp';           			
    protected $fillable = ['sno','status','FeeTransId','SessionId','SchoolCode','Admission_No'];	
	public $timestamps = false;	  		
}