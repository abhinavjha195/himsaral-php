<?php
 
namespace App\Models;  
use Illuminate\Database\Eloquent\Model;		
 
class FeeAmtSingle extends Model		
{	
    protected $table = 'feeamtsingle';       			    			
    protected $fillable = ['AdmissionNo','FeeCatId','FeeAmount','SessionId','SchoolId'];  
	public $timestamps = false;	    	
}