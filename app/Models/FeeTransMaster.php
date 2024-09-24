<?php
 
namespace App\Models;  
use Illuminate\Database\Eloquent\Model;		
 
class FeeTransMaster extends Model		
{	
    protected $table = 'feetransmaster';         			
    protected $fillable = ['SchoolCode','SessionId','AdmissionNo','CourseId','ClassId','SectionId','StudentName','FeeMonth','FeeYear','FeeDate','FeeAmount','BalanceAmount','BalStatus','Extra','Sno','PaymentMode','BankName','BranchAddress','Attachment','DraftChequeTransactionId','payer','Addedby','ReceiptNo','SystemDate','PaymentType'];  	    			
	public $timestamps = false;	    			    
}