<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupplierMaster extends Model
{
    use HasFactory;

    protected $table = 'supplier_master';
	public $timestamps = false;
    protected $fillable = ['supplierId', 'location', 'supplier_name', 'area_code', 'phone1', 'phone2', 'address', 'gst', 'email', 'website'];
}
