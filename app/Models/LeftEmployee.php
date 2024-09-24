<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeftEmployee extends Model
{
    use HasFactory;
    protected $table = 'left_employees';
	public $timestamps = false;
    protected $fillable = ['id','emp_id', 'emp_no','leaving_dt','reason'];
}
