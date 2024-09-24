<?php
 
namespace App\Models;  
use Illuminate\Database\Eloquent\Model;		
 
class PaymentMode extends Model		
{	
    protected $table = 'payment_modes'; 		      			    			
    protected $fillable = ['pay_mode','pay_type'];   			
	   	
}