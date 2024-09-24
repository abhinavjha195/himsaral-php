<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Remarks extends Model
{
    protected $table = 'remarks';
    protected $fillable = ['sheet_id','course_id','class_id','section_id','exam_id','student_id','remarks'];
}
