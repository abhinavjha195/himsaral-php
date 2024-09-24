<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaintenanceMaster extends Model
{
    use HasFactory;

    protected $table = 'maintenance_master';
	public $timestamps = false;
    protected $fillable = ['maintenance_id', 'maintenance_type', 'description'];
}
