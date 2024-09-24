<?php
 
namespace App\Models;  
use Illuminate\Database\Eloquent\Model;			
 
class FeeTransDelete extends Model		
{	
    protected $table = 'feetransdelete';           			
    protected $fillable = ['sno','status','FeeTransId','Admission_No','FeeMonth','FeeYear','FeeDate','FeeAmount','BalAmt','requestdate','reason','status','approvedate','Remarks','SessionId','SchoolCode','SDate','Deletedby'];	
	public $timestamps = false;	  		   
}