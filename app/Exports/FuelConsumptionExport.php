<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class FuelConsumptionExport implements FromCollection,WithHeadings
{
    protected $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function collection()
    {
        return $this->data;
    }
    public function headings(): array
    {
        return [
            'Vehicle No',
            'Bill No',
            'Qty',
            'Amount',
            'Starting Km',
            'Ending Km',
            'Fuel Type',
            'Payment'
        ];
    }
}
