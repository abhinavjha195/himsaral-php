<?php
namespace App\Exports;

use App\Models\ExamDateSheet;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class AllExamMarkReportExport implements FromCollection, WithHeadings, WithMapping
{
    protected $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function collection()
    {
        // Your query logic here
        $data = ExamDateSheet::leftJoin('exam_date_sheet_marks as ed', 'exam_date_sheet.id', '=', 'ed.sheet_id')
            ->leftJoin('subject_master as sm', 'ed.subject_id', '=', 'sm.subjectId')
            ->leftJoin('student_master as st', 'ed.student_id', '=', 'st.id')
            ->whereIn('exam_date_sheet.exam_id', $this->request->exam_id)
            ->where('exam_date_sheet.course_id', $this->request->course_id)
            ->where('exam_date_sheet.class_id', $this->request->class_id)
            ->where('exam_date_sheet.section_id', $this->request->section_id)
            ->select(
                'st.id as student_id',
                'st.student_name',
                'sm.subjectName',
                'sm.subjectId',
                'ed.marks_obtained',
                'exam_date_sheet.max_mark',
                'st.mother_name',
                'st.father_name',
                'st.dob',
                'st.admission_no',
                'st.roll_no',
                'ed.theory',
                'ed.assessment',
                'ed.internal',
                'exam_date_sheet.exam_id'
            )
            ->orderBy('st.id', 'asc')
            ->get();

        // Grouping data as before
        $groupedData = $data->groupBy('student_id')->map(function ($group) {
            return [
                'student_id' => $group->first()->student_id,
                'student_name' => $group->first()->student_name,
                'mother_name' => $group->first()->mother_name,
                'father_name' => $group->first()->father_name,
                'dob' => $group->first()->dob,
                'admission_no' => $group->first()->admission_no,
                'roll_no' => $group->first()->roll_no,
                'subjects' => $group->map(function ($item) {
                    return [
                        'subjectId' => $item->subjectId,
                        'subjectName' => $item->subjectName,
                        'marks_obtained' => $item->marks_obtained,
                        'theory' => $item->theory,
                        'assessment' => $item->assessment,
                        'internal' => $item->internal,
                        'max_mark' => $item->max_mark,
                        'exam_id' => $item->exam_id
                    ];
                })
            ];
        })->values();

        return collect($groupedData); // Return a collection
    }

    public function headings(): array
    {
        return [
            'Student ID', 
            'Student Name', 
            'Mother Name', 
            'Father Name', 
            'Date of Birth', 
            'Admission No', 
            'Roll No', 
            'Subject ID', 
            'Subject Name', 
            'Marks Obtained', 
            'Theory', 
            'Assessment', 
            'Internal', 
            'Max Mark', 
            'Exam ID'
        ];
    }

    public function map($row): array
    {
        return [
            $row['student_id'],
            $row['student_name'],
            $row['mother_name'],
            $row['father_name'],
            $row['dob'],
            $row['admission_no'],
            $row['roll_no'],
            // Map subject details
            $row['subjects']->pluck('subjectId')->implode(', '),
            $row['subjects']->pluck('subjectName')->implode(', '),
            $row['subjects']->pluck('marks_obtained')->implode(', '),
            $row['subjects']->pluck('theory')->implode(', '),
            $row['subjects']->pluck('assessment')->implode(', '),
            $row['subjects']->pluck('internal')->implode(', '),
            $row['subjects']->pluck('max_mark')->implode(', '),
            $row['subjects']->pluck('exam_id')->implode(', '),
        ];
    }
}
