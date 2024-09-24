<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notice extends Model
{
    use HasFactory;
    protected $table = 'notice';
	public $timestamps = false;
    protected $fillable = ['id', 'title', 'date', 'from_time','to_time','notice', 'file_name', 'link1', 'link2', 'link3', 'link4'];
}
