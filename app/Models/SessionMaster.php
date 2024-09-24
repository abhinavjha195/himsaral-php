<?php
 
namespace App\Models;  
use Illuminate\Database\Eloquent\Model;
 
class SessionMaster extends Model		
{	
    protected $table = 'session_master';       	
    protected $fillable = ['session_start','session_end'];  	    			
	public $timestamps = false;		 	
}