<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Grade extends Model
{
    use HasFactory;

    protected $table = 'grades';
	public $timestamps = false;
    protected $fillable = ['gradeId','marksAbove','marksLess','grade'];

    // public function getGradeAttribute($grade) {
    //     return $grade+" Mr";
    // }
}
