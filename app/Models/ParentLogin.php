<?php
 
namespace App\Models;  
use Illuminate\Database\Eloquent\Model;  
 
class ParentLogin extends Model		
{
	 protected $table = 'parent_login';  
     protected $fillable = ['s_id','mobile_no','password'];   			
}