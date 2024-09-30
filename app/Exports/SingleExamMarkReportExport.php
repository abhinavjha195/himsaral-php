<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;

class SingleExamMarkReportExport implements FromCollection, WithStyles
{
    protected $students;
    protected $school;

    public function __construct($students, $school)
    {
        $this->students = $students;
        $this->school = $school;
    }

    public function collection()
    {
        // Start data array
        $data = [];

        // Add an empty row for the logo (you can adjust the number of empty rows as needed)
        $data[] = ['', '', '', '', '', '', '', '', '', '', '', '', ''];

        // Define school details
        $schoolName = $this->school[0]->school_name;
        $schoolAbout = $this->school[0]->about ?? '';
        $schoolAddress = $this->school[0]->school_address;
        $schoolContact = $this->school[0]->school_contact;
        $schoolEmail = $this->school[0]->school_email;
        $schoolWebsite = $this->school[0]->server_address;

        // Add school details
        $data[] = [
            "$schoolName " . ($schoolAbout ? "($schoolAbout)" : ''),
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
        ];
        $data[] = [
            "$schoolAddress",
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
        ];
        $data[] = [
            "Phone No: $schoolContact",
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
        ];
        $data[] = [
            "Email: $schoolEmail",
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
        ];
        $data[] = [
            "Website: $schoolWebsite",
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
        ];

        // Define headings as the next row
        $data[] = [
            'Admission No',
            'DOB',
            'Roll No',
            'Father Name',
            'Student Name',
            'Mother Name',
            'Subject',
            'Internal',
            'Assessment',
            'Theory',
            'Marks Obtained',
            'Max Marks',
            'Percentage',
        ];

        // Populate data from students
        $temp_roll_n='';
        foreach ($this->students as $student) {
            foreach ($student['subjects'] as $subject) {


               
                if($student['roll_no'] != $temp_roll_n){
                $data[] = [
                    $student['admission_no'],
                    date('d-m-Y', strtotime($student['dob'])),
                    $student['roll_no'],
                    $student['father_name'],
                    $student['student_name'],
                    $student['mother_name'],
                    $subject['subjectName'],
                    $subject['internal'],
                    $subject['assessment'],
                    $subject['theory'],
                    $subject['marks_obtained'],
                    $subject['max_mark'],
                    $this->calculatePercentage($subject['marks_obtained'], $subject['max_mark']),
                ];

            }

            else{


                $data[] = [
                      '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    $subject['subjectName'],
                    $subject['internal'],
                    $subject['assessment'],
                    $subject['theory'],
                    $subject['marks_obtained'],
                    $subject['max_mark'],
                    $this->calculatePercentage($subject['marks_obtained'], $subject['max_mark']),
                ];
            }

       
        $temp_roll_n=$student['roll_no'];

            }
         
        }

        return collect($data);
    }

    public function styles(Worksheet $sheet)
    {
        // Apply styles like borders, font size, etc.
        return [
            // Style for the logo area (empty row for logo)
            1 => [
                'height' => 60, // Adjust as needed
            ],
            2 => [
                'font' => ['size' => 14, 'bold' => true],
                'alignment' => [
                    'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                ],
            ],
            3 => [
                'font' => ['size' => 12],
                'alignment' => [
                    'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                ],
            ],
            4 => [
                'font' => ['size' => 12],
                'alignment' => [
                    'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                ],
            ],
            5 => [
                'font' => ['size' => 12],
                'alignment' => [
                    'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                ],
            ],
            6 => [
                'font' => ['size' => 12],
                'alignment' => [
                    'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                ],
            ],
            7 => [
                'font' => ['bold' => true],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'color' => [
                        'argb' => 'FFCCCCCC', // Use a hex code for light grey
                    ],
                ],
                'alignment' => [
                    'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                ],
            ],
            'A' => ['font' => ['size' => 12]], // Font size for column A
            'B' => ['font' => ['size' => 12]], // Font size for column B
            // Add more styling as needed
        ];
    }

    private function calculatePercentage($marksObtained, $maxMarks)
    {
        if ($maxMarks > 0) {
            return number_format(($marksObtained / $maxMarks) * 100, 2) . '%';
        }
        return '0%';
    }

    public function startRow(): int
    {
        return 2; // Data starts from row 2
    }

    public function insertLogo(Worksheet $sheet)
    {
        $imagePath = public_path('images/logo-text.png');
        if (file_exists($imagePath)) {
            $drawing = new Drawing();
            $drawing->setName('School Logo');
            $drawing->setDescription('School Logo');
            $drawing->setPath($imagePath);
            $drawing->setHeight(60); // Adjust the height as needed
            $drawing->setCoordinates('A1'); // Adjust coordinates based on your layout
            $drawing->setWorksheet($sheet);
        }
    }
}
