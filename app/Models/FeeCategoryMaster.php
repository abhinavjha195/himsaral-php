<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class FeeCategoryMaster extends Model
{
    protected $table = 'fee_category_master';
    protected $fillable = ['fee_id','name','fee_type','applicable','printable','changeable'];

    public function setNameAttribute($value){
        $this->attributes['name'] = ucwords(strtolower($value));
    }
}
