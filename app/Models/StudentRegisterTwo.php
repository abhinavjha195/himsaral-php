<?php
 
namespace App\Models;  
use Illuminate\Database\Eloquent\Model;
 
class StudentRegisterTwo extends Model  		
{
    protected $table = 'student_registrations2';   			        			
    protected $fillable = ['compulsary_set','elective_set','additional_set','transportation','station_id','route_id','bus_no','transport_concession','busfare','transconcession_amount','totalfare','staffchild','child_no','management_concession','applicable'];  	   
	public $timestamps = false;	   	
}