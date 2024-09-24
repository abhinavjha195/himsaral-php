<?php
 
namespace App\Models;  
use Illuminate\Database\Eloquent\Model;		
 
class FeeConcession extends Model		
{	
    protected $table = 'feeconcession';       			    			
    protected $fillable = ['ConcessionName','ConcessionType','ConcessionAMount','ConcessionType2','ConcessionAMount2','SchoolCode','SessionId'];  
	public $timestamps = false;	    	
}