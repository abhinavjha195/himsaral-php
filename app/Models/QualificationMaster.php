<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QualificationMaster extends Model
{
    use HasFactory;
    protected $table = "qualification_master";
    public $timestamps = false;
    protected $fillable = ['qualificationId', 'qualificationName'];
}
