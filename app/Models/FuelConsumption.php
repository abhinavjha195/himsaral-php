<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FuelConsumption extends Model
{
    use HasFactory;

    protected $table = 'fuel_consumption';
	public $timestamps = false;
    protected $fillable = ['id', 'vehicle_id', 'filling_date', 'bill_no' ,'supplier_id', 'fuel_id', 'payment_id', 'fuel_qty', 'amount', 'start_dist', 'end_dist'];
}
