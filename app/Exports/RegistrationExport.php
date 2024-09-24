<?php

namespace App\Exports;

use App\Models\StudentRegister;	
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;			

class RegistrationExport implements FromCollection, WithHeadings, WithEvents  
{
    /**
    * @return \Illuminate\Support\Collection
    */

	protected $class_id;
	protected $course_id;		
	protected $search;
	protected $amount;    

	public function __construct($class_id,$course_id,$amount,$search)
    {
        $this->class_id = $class_id;		
        $this->course_id = $course_id;  		
        $this->amount = $amount;  
		$this->search = $search;		   
    }
	
    public function collection()
    {
        //return StudentRegister::all();
		/* $records = StudentRegister::leftJoin('class_master as cs','student_registration.class_id','=','cs.classId')
						->leftJoin('course_master as cm', 'student_registration.course_id', '=', 'cm.courseId') 		
						->leftJoin('station_master as sm','student_registration.station_id','=','sm.stationId')
						->selectRaw("student_registration.student_name,student_registration.father_name,student_registration.registration_date,student_registration.registration_no,student_registration.fee,cm.courseName,cs.className,ifnull(sm.stationName,'') as stationName")		
						->get(); */	
						
		$classid = $this->class_id;
		$courseid = $this->course_id; 
		$amount = $this->amount;
		$search	= $this->search;	  		
		
		$student_query = StudentRegister::leftJoin('class_master as cs','student_registration.class_id','=','cs.classId')
						->leftJoin('course_master as cm', 'student_registration.course_id', '=', 'cm.courseId') 		
						->leftJoin('station_master as sm','student_registration.station_id','=','sm.stationId')
						->selectRaw("student_registration.student_name,student_registration.father_name,student_registration.registration_date,student_registration.registration_no,student_registration.fee,cm.courseName,cs.className,ifnull(sm.stationName,'') as stationName");	  						  	

		if($courseid !='')	
		{
			$student_query->where('student_registration.course_id',$courseid);	
		}
		
		if($classid !='')		
		{
			$student_query->where('student_registration.class_id',$classid);		
		}
		
		if($this->amount !='')
		{
			$student_query->where('student_registration.fee',$amount);	
		}					
		
		if($search !='')	
		{  
			$student_query->where(function($q) use ($search) {
				 $q->where('student_registration.student_name', 'like', '%'.$search.'%')
				   ->orWhere('cs.className', 'like', '%'.$search.'%')		   	
				   ->orWhere('cm.courseName', 'like', '%'.$search.'%')
				   ->orWhere('sm.stationName', 'like', '%'.$search.'%');		
			 });   
		}   		
		
		$records = $student_query->groupBy('student_registration.id')->get();    
		$result = array();		
		
		foreach($records as $record){
		   $result[] = array(
			  'registration_no' => $record->registration_no,		
			  'registration_date' => date('d/m/Y',strtotime($record->registration_date)),				
			  'student_name' => $record->student_name,
			  'father_name' => $record->father_name,
			  'course' => $record->courseName,
			  'class' => $record->className,		
			  'amount' => $record->fee,	
			  'station' => $record->stationName,  
		   );
		}

		return collect($result);						
						
    }
	
	public function headings():array{
        
		return[
            'Registration Id',
            'Registration Date',		
            'Student Name',
            'Father Name',		
            'Course',
            'Class', 
			'Amount',
            'Station', 		
        ];
				
    } 
	
	public function registerEvents(): array
    {
        return [
            AfterSheet::class    => function(AfterSheet $event) 
			{    
                $event->sheet->getDelegate()->getStyle('A1:H1')->getFont()->setBold(true); 
				$event->sheet->getDelegate()->getRowDimension('1')->setRowHeight(20);  						
                $event->sheet->getDelegate()->getColumnDimension('A')->setWidth(15);
				$event->sheet->getDelegate()->getColumnDimension('B')->setWidth(17);     	
				$event->sheet->getDelegate()->getColumnDimension('C')->setWidth(17);     	
				$event->sheet->getDelegate()->getColumnDimension('D')->setWidth(17);     	
				$event->sheet->getDelegate()->getColumnDimension('E')->setWidth(14);     	  
				$event->sheet->getDelegate()->getColumnDimension('F')->setWidth(14);     	  
				$event->sheet->getDelegate()->getColumnDimension('G')->setWidth(14);     	  
				$event->sheet->getDelegate()->getColumnDimension('H')->setWidth(14);     	  
            },
        ];
    }
	
}
