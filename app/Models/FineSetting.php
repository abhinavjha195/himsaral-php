<?php
 
namespace App\Models;  
use Illuminate\Database\Eloquent\Model;		
 
class FineSetting extends Model		
{	
    protected $table = 'fine_settings';      		     			
    protected $fillable = ['id','DueDate','FineType','FineAmount','SchoolCode','SessionId'];		
	public $timestamps = false;	  				
}