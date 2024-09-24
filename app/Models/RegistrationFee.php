<?php
 
namespace App\Models;  
use Illuminate\Database\Eloquent\Model;  
 
class RegistrationFee extends Model		
{
	 protected $table = 'registration_fees';  
     protected $fillable = ['course_id','amount'];   					
}