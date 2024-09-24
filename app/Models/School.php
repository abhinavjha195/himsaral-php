<?php
 
namespace App\Models;  
use Illuminate\Database\Eloquent\Model;		
 
class School extends Model		
{	
    protected $table = 'tbl_school';       			    			
    protected $fillable = ['school_code','school_name','school_address','state_id','district_id','school_email','principal_name','cstno','cstdate','tinno','tindate','faxno','school_session','sankul_code','school_affiliation','school_contact','remark','school_background','school_logo','school_courses','is_sankul','medhavi_sankul','CurrentSessionFrom','CurrentSessionTo','school_photo','server_address','about','status','cluster','MerchantKey','MerchantSalt'];  
	public $timestamps = false;	      	
}