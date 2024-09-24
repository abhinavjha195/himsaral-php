<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DepartmentMaster extends Model
{
    use HasFactory;
    protected $table = "department_master";
    public $timestamps = false;
    protected $fillable = ['departmentId', 'departmentName'];
}
