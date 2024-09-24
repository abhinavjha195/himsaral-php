<?php
 
namespace App\Models;  
use Illuminate\Database\Eloquent\Model;		
 
class FeePending extends Model		
{	
    protected $table = 'feepending';              			
    protected $fillable = ['FeeTransId','AdmNo','FeeCatId','FeeCatDesc','FeeMonth','Feeyear','PendingAmt'];  	    			
	public $timestamps = false;	      			    
}