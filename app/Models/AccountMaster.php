<?php
 
namespace App\Models;  
use Illuminate\Database\Eloquent\Model;		
 
class AccountMaster extends Model		
{        			    			
    protected $fillable = ['name','description','remark','type_id','session_id','school_id'];     		
	protected $table = 'account_master';      			
}