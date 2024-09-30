<?php
 
namespace App\Models;  
use Illuminate\Database\Eloquent\Model;
 
class ExamDateSheetDesc extends Model  		
{
    protected $table = 'exam_date_sheet_desc';   	    											        			
    protected $fillable = ['row_id','sub_id','theory','assessment','internal','exam_date','exam_idd'];  	
	public $timestamps = false;		  			
}
