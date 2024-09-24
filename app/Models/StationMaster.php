<?php
 
namespace App\Models;  
use Illuminate\Database\Eloquent\Model;		
 
class StationMaster extends Model		
{	
    protected $table = 'station_master';         	
    protected $fillable = ['stationId','stationName','distance','busFare'];  	    			
	
}