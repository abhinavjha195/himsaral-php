<?php
 
namespace App\Models;  
use Illuminate\Database\Eloquent\Model;
 
class District extends Model  
{
    protected $fillable = ['name','state_id'];   		
	public $timestamps = false;   			
}