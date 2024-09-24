<?php
 
namespace App\Models;  
use Illuminate\Database\Eloquent\Model;		
 
class Vehicle extends Model	   	
{	       			
    protected $fillable = ['registration_no','route_id','capacity','insurance_amount','insurance_date','insurance_due','insurance_paid','tax_amount','tax_date','tax_due','tax_paid','passing_date','passing_paid','renewal_date','renewal_paid','description'];     	 		
}