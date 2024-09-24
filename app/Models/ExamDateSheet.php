<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class ExamDateSheet extends Model
{
    protected $table = 'exam_date_sheet';
    protected $fillable = ['course_id','class_id','section_id','exam_id','max_mark'];
}
