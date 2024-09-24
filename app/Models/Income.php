<?php
 
namespace App\Models;  
use Illuminate\Database\Eloquent\Model;				
 
class Income extends Model		
{        			    			
    protected $fillable = ['type_id','mode_id','school_id','session_id','total_amount','invoice_amount','transection_purpose','receive_from','party_name','sender_address','invoice_no','party_address','cheque_no','voucher_no','attachment','voucher_date','invoice_date'];     			  			
}