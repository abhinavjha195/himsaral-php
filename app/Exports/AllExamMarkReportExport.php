<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class AllExamMarkReportExport implements FromCollection, WithStyles
{
    protected $data;
    protected $exams;
    protected $grades;
    protected $grade_by;
    protected $caption;

    public function __construct($data, $exams, $grades, $grade_by)
    {
        $this->data = $data;
        $this->exams = $exams;
        $this->grades = $grades;
        $this->grade_by = $grade_by;
       // Add caption as a new property
    }

    // Return all data (including caption and header row) in the collection
    public function collection()
    {
        $excel_data = [];

        // Add caption as the first row (spanning across columns)
        $excel_data[] = ['Excel Data of Exam Result'];

        // Add headers as the second row
        $headings = ['Admission No', 'Student Name', 'Roll No', 'Father Name', 'Mother Name'];
        foreach ($this->exams as $exam) {
            $headings[] = $exam->name . ' Marks';
            $headings[] = $exam->name . ' Max Marks';
        }
        $excel_data[] = $headings;

        // Add each student's data and marks for each exam
        foreach ($this->data as $row) {
            if (!empty($row['student_name'])) {
                $row_data = [
                    $row['admission_no'],
                    $row['student_name'],
                    $row['roll_no'],
                    $row['father_name'],
                    $row['mother_name'],
                ];

                foreach ($this->exams as $exam) {
                    $totalMarksObtained = 0;
                    $max_marks = 0;

                    foreach ($row['subjects'] as $subject) {
                        if ($exam['id'] == $subject['exam_id']) {
                            $totalMarksObtained += $subject['marks_obtained'];
                            $max_marks += $subject['max_mark'];
                        }
                    }

                    // Add marks obtained and max marks
                    $row_data[] = $totalMarksObtained;
                    $row_data[] = $max_marks;
                }

                $excel_data[] = $row_data;
            }
        }

        return collect($excel_data);
    }

       // Apply styling to the Excel sheet
       public function styles(Worksheet $sheet)
       {
           $lastColumn = count($this->exams) * 2 + 5; // Calculate the last column based on the number of exams and fixed columns
   
           // Merge the first row for the caption across all columns
           $sheet->mergeCells("A1:{$this->getExcelColumn($lastColumn)}1");
   
           return [
               // Style the caption row
               1 => [
                   'font' => [
                       'bold' => true,
                       'size' => 18,
                       'color' => ['argb' => 'FF000000'], // Text color (black)
                   ],
                   'alignment' => [
                       'horizontal' => Alignment::HORIZONTAL_CENTER, // Center align text
                       'vertical' => Alignment::VERTICAL_CENTER, // Vertically center the caption
                   ],
               ],
   
               // Style the headers row (second row)
               2 => [
                   'font' => [
                       'bold' => true,
                       'size' => 14,
                       'color' => ['argb' => 'FF000000'], // Text color (black)
                   ],
                   'fill' => [
                       'fillType' => Fill::FILL_SOLID,
                       'color' => ['argb' => 'FFD3D3D3'], // Background color (light gray)
                   ],
                   'alignment' => [
                       'horizontal' => Alignment::HORIZONTAL_CENTER, // Center align text
                   ],
                   'borders' => [
                       'allBorders' => [
                           'borderStyle' => Border::BORDER_THIN, // Thin border for the header
                           'color' => ['argb' => 'FF000000'], // Border color (black)
                       ],
                   ],
               ],
           ];
       }
   
       // Helper method to calculate the Excel column letter from a column index
       private function getExcelColumn($index)
       {
           $letters = '';
           while ($index > 0) {
               $index--;
               $letters = chr(65 + ($index % 26)) . $letters;
               $index = (int)($index / 26);
           }
           return $letters;
       }
}
