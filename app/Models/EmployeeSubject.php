<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class EmployeeSubject extends Model
{
	protected $table = 'emp_subjects';
	public $timestamps = false;
    protected $fillable = ['emp_id','cs_id','sub_id'];
}
