<?php
 
namespace App\Models;  
use Illuminate\Database\Eloquent\Model;
 
class ExamSheetMark extends Model  		
{
    protected $table = 'exam_date_sheet_marks';   	    													        			
    protected $fillable = ['sheet_id','subject_id','student_id','attend','theory','assessment','internal'];  	  		
}
