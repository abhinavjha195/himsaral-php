<?php
 
namespace App\Models;  
use Illuminate\Database\Eloquent\Model;		
 
class FeeAmtDesc extends Model		
{	
    protected $table = 'feeamtdesc'; 		        			    			
    protected $fillable = ['FeeAmtId','FeeCatId','FeeAmount'];  
	public $timestamps = false;	    	 		  
}