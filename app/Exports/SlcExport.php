<?php

namespace App\Exports;

use App\Models\TransferCertificate;	
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;		       	

class SlcExport implements FromCollection, WithHeadings, WithEvents  
{
    /**
    * @return \Illuminate\Support\Collection
    */

	protected $search; 

	public function __construct($search)
    {        
		$this->search = $search;				   
    }
	
    public function collection()
    { 
		$key   = $this->search;	  		
		
		$query = TransferCertificate::leftJoin('student_master as sm','slc_certificates.student_id','=','sm.id')
						->leftJoin('tb_school as ts','slc_certificates.school_code', '=', 'ts.id') 	 
						->leftJoin('class_master as cm','sm.class_id','=','cm.classId')
						->leftJoin('class_master as cs','slc_certificates.last_exam','=','cs.classId')	    
						->leftJoin('class_master as cd','slc_certificates.qualified','=','cd.classId')		
						->selectRaw("slc_certificates.tc_no,slc_certificates.fee_year,slc_certificates.concession,slc_certificates.working_days,slc_certificates.working_present,slc_certificates.ncc_conduct,slc_certificates.application_date,slc_certificates.issue_date,slc_certificates.reason,slc_certificates.remark,MONTHNAME(STR_TO_DATE(slc_certificates.fee_month, '%m')) as tc_month,sm.student_name,sm.father_name,sm.admission_no,ts.school_name,ts.about,cm.className,cs.className as classLast,cd.className as qualify");  	 				  							
		if($key !='')	
		{  
			$query->where(function($q) use ($key) {
				 $q->where('slc_certificates.tc_no', 'like', '%'.$key.'%') 
				   ->orWhere('sm.admission_no', 'like', '%'.$key.'%')   	   	
				   ->orWhere('sm.student_name', 'like', '%'.$key.'%')
				   ->orWhere('cm.className', 'like', '%'.$key.'%');		   	
			 });   
		}
		
		$records = $query->groupBy('slc_certificates.id')->orderBy('slc_certificates.id','asc')->get();  
		
		$result = array();		
		
		foreach($records as $record){
		   $result[] = array(
			  'tc_no' => $record->tc_no,	
			  'admission_no.' => $record->admission_no,  
			  'student_name' => ucwords($record->student_name),
			  'school_name' => ucwords($record->school_name).' ('.ucwords($record->about).')', 
			  'class' => ucwords($record->className),		
			  'month' => $record->tc_month,	
			  'year' => $record->fee_year, 	 
			  'concession' => ucwords($record->concession),    
			  'working_days' => $record->working_days,  
			  'working_present' => $record->working_present,		
			  'ncc' => ucwords($record->ncc_conduct), 
			  'apply_date' => date('d/m/Y',strtotime($record->application_date)),		  
			  'issue_date' => date('d/m/Y',strtotime($record->issue_date)),		  
			  'reason' => ucwords($record->reason),		
			  'remark' => ucwords($record->remark),	
			  'failed' => ucwords($record->classLast), 	
			  'qualify' => ucwords($record->qualify),  					     
		   );
		}

		return collect($result);	
		   
		   
		return collect($result);						
						
    }
	
	public function headings():array{
        
		return[
            'SLC No.',
            'Admission No.',		
            'Student Name',
            'School Name',		
            'Class Name',
            'Month', 
			'Year',
            'Concession', 	
			'Working Days',		
            'Working Present Days',		
            'Ncc Conduct',	
            'Date Of Application', 
			'Issued Date',
            'Reason', 	
			'Remark', 
			'Failed Type',
            'Qualified',   
        ];
				
    } 
	
	public function registerEvents(): array
    {
        return [
            AfterSheet::class    => function(AfterSheet $event) 		
			{    
                $event->sheet->getDelegate()->getStyle('A1:Q1')->getFont()->setBold(true); 		
				$event->sheet->getDelegate()->getRowDimension('1')->setRowHeight(20);  						
                $event->sheet->getDelegate()->getColumnDimension('A')->setWidth(15);
				$event->sheet->getDelegate()->getColumnDimension('B')->setWidth(17);     	
				$event->sheet->getDelegate()->getColumnDimension('C')->setWidth(17);     	
				$event->sheet->getDelegate()->getColumnDimension('D')->setWidth(17);     	
				$event->sheet->getDelegate()->getColumnDimension('E')->setWidth(14);     	  
				$event->sheet->getDelegate()->getColumnDimension('F')->setWidth(14);     	  
				$event->sheet->getDelegate()->getColumnDimension('G')->setWidth(14);     	  
				$event->sheet->getDelegate()->getColumnDimension('H')->setWidth(14);     	
				$event->sheet->getDelegate()->getColumnDimension('I')->setWidth(15);
				$event->sheet->getDelegate()->getColumnDimension('J')->setWidth(17);     	
				$event->sheet->getDelegate()->getColumnDimension('K')->setWidth(17);     	
				$event->sheet->getDelegate()->getColumnDimension('L')->setWidth(17);     	
				$event->sheet->getDelegate()->getColumnDimension('M')->setWidth(14);     	  
				$event->sheet->getDelegate()->getColumnDimension('N')->setWidth(14);     	  
				$event->sheet->getDelegate()->getColumnDimension('O')->setWidth(14);     	  
				$event->sheet->getDelegate()->getColumnDimension('P')->setWidth(14);     
				$event->sheet->getDelegate()->getColumnDimension('Q')->setWidth(14);     
				
            },
        ];
    }
	
}
