<?php
 
namespace App\Models;  
use Illuminate\Database\Eloquent\Model;		
 
class FeeTransDesc extends Model		
{	
    protected $table = 'feetransdesc';           			
    protected $fillable = ['FeeTransId','FeeCatId','FeeCatDesc','FeeMonth','FeeYear','FeeAmt','CurrentMonthFee'];
	public $timestamps = false;	    			    
}

