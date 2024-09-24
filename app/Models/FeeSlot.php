<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class FeeSlot extends Model
{
    use HasFactory;
    protected $table = 'fee_slot_master';
    protected $fillable = ['FeeCatId','FeeSlotDesc','FeeDueMonths','FeeYear','SessionId','SchoolCode'];
	public $timestamps = false;
    protected $primaryKey = 'FeeSlotId';
}
