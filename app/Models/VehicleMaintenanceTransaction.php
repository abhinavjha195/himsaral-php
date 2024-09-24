<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VehicleMaintenanceTransaction extends Model
{
    use HasFactory;

    protected $table = 'vehicle_maintenance_transaction';
	public $timestamps = false;
    protected $fillable = ['id', 'maintenance_date', 'maintenance_id', 'vehicle_id', 'description', 'bill_no', 'expenses'];

}
