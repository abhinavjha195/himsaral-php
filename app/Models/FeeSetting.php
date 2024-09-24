<?php
 
namespace App\Models;  
use Illuminate\Database\Eloquent\Model;		
 
class FeeSetting extends Model		
{	
    protected $table = 'feesetting';      		     			
    protected $fillable = ['Delete_fee','Enabled_fee','Multi_receipt','receipttype','receiptpreview','DateofAdmFee','FeeParent','FeeDate','SchoolCode','Result'];		  
	public $timestamps = false;	     				
}