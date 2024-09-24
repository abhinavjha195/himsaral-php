<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DesignationMaster extends Model
{
    use HasFactory;
    protected $table = "designation_master";
    public $timestamps = false;
    protected $fillable = ['designationId', 'designationName', 'departmentId'];
}
