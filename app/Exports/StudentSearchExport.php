<?php

namespace App\Exports;

use App\Models\StudentMaster;			
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithCustomStartCell;  
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;   
use \Maatwebsite\Excel\Sheet;				
use Illuminate\Support\Facades\DB;       
	
class StudentSearchExport implements FromCollection, WithHeadings, WithCustomStartCell, WithEvents
{  
	
    /**
    * @return \Illuminate\Support\Collection
    */

	protected $class_id;
	protected $course_id;		
	protected $section_id;   
	protected $station_id;			
	protected $student_name;		
	protected $father_name;    
	protected $mother_name;
	protected $admission_no;		
	protected $roll_no; 
	protected $adhar_no;
	protected $gender;		
	protected $caste;   
	protected $transport;		
	protected $sibling;		
	protected $start_date;  
	protected $end_date;  
	protected $search;
	protected $field;   	

	public function __construct($class_id,$course_id,$section_id,$station_id,$student_name,$father_name,$mother_name,$admission_no,$roll_no,$adhar_no,$gender,$caste,$transport,$sibling,$start_date,$end_date,$search,$field)
    {
        $this->class_id = $class_id;		
        $this->course_id = $course_id;  		
        $this->section_id = $section_id;  		
		$this->station_id = $station_id;		
        $this->student_name = $student_name;  		
        $this->father_name = $father_name;	
		$this->mother_name = $mother_name;		
        $this->admission_no = $admission_no;  				
        $this->roll_no = $roll_no;  
		$this->adhar_no = $adhar_no;		
        $this->gender = $gender;  		
        $this->caste = $caste;  
		$this->transport = $transport;		
        $this->sibling = $sibling;  		
        $this->start_date = $start_date;  
		$this->end_date = $end_date; 
		$this->search = $search;    
		$this->field = $field;  	
    }
	
    public function collection()
    { 
		$result=$sibling_arr=array();	
		
		if($this->sibling !='no')   
		{  			
			$first = DB::table('student_master as sm1')  
					->leftJoin('student_master as sm2','sm1.sibling_admission_no','=','sm2.admission_no')	
					->select('sm1.id as sibling_id')	
					->where('sm1.sibling_admission_no','!=','');   

			$siblings = DB::table('student_master as sm2')
						->leftJoin('student_master as sm1','sm2.admission_no','=','sm1.sibling_admission_no')	
						->select('sm2.id as sibling_id')	
						->where('sm1.sibling_admission_no','!=','')		   
						->union($first)
						->get();	

			foreach($siblings AS $sibling)			
			{
				array_push($sibling_arr,$sibling->sibling_id);  
			}
						
		}	
		
		$query = StudentMaster::leftJoin('class_master as cs','student_master.class_id','=','cs.classId')
						->leftJoin('course_master as cm', 'student_master.course_id', '=', 'cm.courseId') 
						->leftJoin('section_master as se','student_master.section_id','=','se.sectionId')  	  	
						->leftJoin('station_master as sm','student_master.station_id','=','sm.stationId')
						->selectRaw("student_master.*,cm.courseName,cs.className,ifnull(se.sectionName,'') as sectionName,ifnull(sm.stationName,'') as stationName");  						

		if($this->student_name !='')		
		{
			$query->where('student_master.student_name', 'like', '%'.$this->student_name.'%');   				
		}					
		
		if($this->father_name !='')		
		{
			$query->where('student_master.father_name', 'like', '%'.$this->father_name.'%');   				
		}

		if($this->mother_name !='')		
		{
			$query->where('student_master.mother_name', 'like', '%'.$this->mother_name.'%');   						
		}	
		
		if($this->roll_no !='')		
		{
			$query->where('student_master.roll_no', 'like', '%'.$this->roll_no.'%');   						
		}
		
		if($this->adhar_no !='')		
		{
			$query->where('student_master.aadhar_no', 'like', '%'.$this->adhar_no.'%');   						
		}
		
		if($this->admission_no !='')		
		{
			$query->where('student_master.admission_no', 'like', '%'.$this->admission_no.'%');   						
		}

		if($this->course_id !='')
		{
			$query->where('student_master.course_id',$this->course_id);	
		}
		
		if($this->class_id !='')
		{
			$query->where('student_master.class_id',$this->class_id);	
		}

		if($this->section_id !='')
		{
			$query->where('student_master.section_id',$this->section_id);	
		}
		
		if($this->station_id !='')
		{
			$query->where('student_master.station_id',$this->station_id);	
		}	
		
		if($this->gender !='')
		{
			$query->where('student_master.gender',$this->gender);			
		}
		
		if($this->caste !='')
		{
			$query->where('student_master.caste',$this->caste);	  
		}
		
		if($this->start_date !='' && $this->end_date !='')   
		{			
			$query->where('student_master.dob', '>=', $this->start_date);                                 
			$query->where('student_master.dob', '<=', $this->end_date);   			
		}
		
		if($this->transport !='no')   
		{
			$query->where('student_master.transportation',$this->transport);	
		}
		
		if($this->sibling !='no' && count($sibling_arr)>0)   
		{			
			$query->whereIn('student_master.id',$sibling_arr);		
		}
		
		if($this->search !='')	
		{ 
			$key=$this->search;
			$query->where(function($q) use ($key) {
				 $q->where('student_master.student_name', 'like', '%'.$key.'%')
				   ->orWhere('cs.className', 'like', '%'.$key.'%')		   	
				   ->orWhere('cm.courseName', 'like', '%'.$key.'%')
				   ->orWhere('se.sectionName', 'like', '%'.$key.'%');     
			 });   
		}
		
		$records = $query->groupBy('student_master.id')->orderBy('student_master.id','asc')->get();   
		$headings = json_decode($this->field);	  
		
		foreach($records as $record){
			
			$head_arr=array();	  
			
			if(in_array('admission_no',$headings))	
			{
				$head_arr['admission_no']=$record->admission_no;    
			}
			
			if(in_array('student_name',$headings))	
			{
				$head_arr['student_name']=$record->student_name;    
			}
			
			if(in_array('father_name',$headings))	
			{
				$head_arr['father_name']=$record->father_name;    
			}
			
			if(in_array('f_mobile',$headings))	
			{
				$head_arr['f_mobile']=$record->f_mobile;    
			}
			
			if(in_array('courseName',$headings))	
			{
				$head_arr['courseName']=$record->courseName;    
			}
			
			if(in_array('className',$headings))	
			{
				$head_arr['className']=$record->className;    
			}		

			if(in_array('mother_name',$headings))	
			{
				$head_arr['mother_name']=$record->mother_name;    
			}	

			if(in_array('registration_no',$headings))	
			{
				$head_arr['registration_no']=$record->registration_no;    
			}	

			if(in_array('sectionName',$headings))	
			{
				$head_arr['sectionName']=$record->sectionName;    
			}		
			
			if(in_array('dob',$headings))	
			{
				$head_arr['dob']=date('d-M-Y',strtotime($record->dob));    
			}	
			
			if(in_array('gender',$headings))	
			{
				$head_arr['gender']=$record->gender;    
			}	
			
			if(in_array('mobile',$headings))	
			{
				$head_arr['mobile']=$record->mobile;    
			}	
			
			if(in_array('email',$headings))	
			{
				$head_arr['email']=$record->email;    
			}	
			
			if(in_array('aadhar_no',$headings))	
			{
				$head_arr['aadhar_no']=$record->aadhar_no;    
			}	
			
			if(in_array('mode_of_admission',$headings))	
			{
				$head_arr['mode_of_admission']=$record->mode_of_admission;    
			}	
			
			if(in_array('permanent_address',$headings))	
			{
				$head_arr['permanent_address']=$record->permanent_address;    
			}	
			
			if(in_array('temporary_address',$headings))	
			{
				$head_arr['temporary_address']=$record->temporary_address;    
			}	
			
			if(in_array('roll_no',$headings))	
			{
				$head_arr['roll_no']=$record->roll_no;    
			}	
			
			if(in_array('caste',$headings))	
			{
				$head_arr['caste']=$record->caste;    
			}	
			
			if(in_array('stationName',$headings))	
			{
				$head_arr['stationName']=$record->stationName;    
			}	
			
			if(in_array('f_occupation',$headings))	
			{
				$head_arr['f_occupation']=$record->f_occupation;    
			}	
			
			if(in_array('admission_date',$headings))	
			{
				$head_arr['admission_date']=date('d-M-Y',strtotime($record->admission_date));    
			}	
			
			if(count($head_arr)>0)
			{
				$result[] = $head_arr;  		
			}  			
		 
		}

		return collect($result);						
						
    }
	
	public function headings():array{     

		$headings = json_decode($this->field);	
		$head_arr=array();			
		
		foreach($headings AS $head)
		{
			if($head=='admission_no')
			{
				$level='Admission No.';
			}
			else if($head=='student_name')
			{
				$level='Name';  
			}
			else if($head=='father_name')
			{
				$level='Father Name';  
			}
			else if($head=='f_mobile')
			{
				$level="Father's Mobile No";  
			}
			else if($head=='courseName')
			{
				$level='Course';		
			}
			else if($head=='className')
			{
				$level='Class';		
			}
			else if($head=='mother_name')
			{
				$level='Mother Name';		
			}
			else if($head=='registration_no')
			{
				$level='Registration No.';		
			}
			else if($head=='sectionName')
			{
				$level='Section Name';  
			}
			else if($head=='dob')
			{
				$level='Date of Birth';  
			}
			else if($head=='gender')
			{
				$level='Gender';		
			}
			else if($head=='mobile')
			{
				$level="Student's Mobile No";		
			}
			else if($head=='email')
			{
				$level='Student Email';  
			}
			else if($head=='aadhar_no')
			{
				$level='Aadhar No.';  
			}
			else if($head=='mode_of_admission')
			{
				$level='Mode of Admission';		
			}
			else if($head=='permanent_address')
			{
				$level='Permanent Address';		
			}
			else if($head=='temporary_address')
			{
				$level='Temporary Address';  
			}
			else if($head=='roll_no')
			{
				$level='Roll No.';  
			}
			else if($head=='caste')
			{
				$level='Caste';		
			}
			else if($head=='stationName')
			{
				$level='Station Name';		
			}
			else if($head=='f_occupation')
			{
				$level="Father's Occupation";    
			}
			else if($head=='admission_date')
			{
				$level='Date of Admission';  
			}
			else
			{
				$level='';    		
			}
			
			if($level !='')
			{
				array_push($head_arr,$level);   
			}
			
		}
		
		return $head_arr;	
    } 
	
	public function startCell(): string
    {
        return 'A2';		
    }
	
	public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event)      
			{  
				 /** @var Sheet $sheet */
				 
                $sheet = $event->sheet;

                $sheet->mergeCells('A1:H1');  
                $sheet->setCellValue('A1', "School Students List : Dated :-".date('d-m-Y'));	
                
                $styleArray = [
                    'alignment' => [
                        'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                    ],
                ];
                
                $cellRange = 'A1:V1';  
                $event->sheet->getDelegate()->getStyle($cellRange)->applyFromArray($styleArray);
				
				$event->sheet->getDelegate()->getStyle($cellRange)->getFont()->setSize(14)->setBold(true)->getColor()->setRGB('ff0000'); 						
			
                $event->sheet->getDelegate()->getStyle('A2:V2')->getFont()->setBold(true); 	  
				$event->sheet->getDelegate()->getRowDimension('1')->setRowHeight(20);  						
                $event->sheet->getDelegate()->getColumnDimension('A')->setWidth(15);
				$event->sheet->getDelegate()->getColumnDimension('B')->setWidth(17);     	
				$event->sheet->getDelegate()->getColumnDimension('C')->setWidth(17);     	
				$event->sheet->getDelegate()->getColumnDimension('D')->setWidth(17);     	
				$event->sheet->getDelegate()->getColumnDimension('E')->setWidth(14);     	  
				$event->sheet->getDelegate()->getColumnDimension('F')->setWidth(20);  

				$event->sheet->getDelegate()->getColumnDimension('G')->setWidth(17);     	
				$event->sheet->getDelegate()->getColumnDimension('H')->setWidth(17);     	
				$event->sheet->getDelegate()->getColumnDimension('I')->setWidth(17);     	
				
				$event->sheet->getDelegate()->getColumnDimension('J')->setWidth(17);     	
				$event->sheet->getDelegate()->getColumnDimension('K')->setWidth(17);     	
				$event->sheet->getDelegate()->getColumnDimension('L')->setWidth(17);     	
				
				$event->sheet->getDelegate()->getColumnDimension('M')->setWidth(17);     	
				$event->sheet->getDelegate()->getColumnDimension('N')->setWidth(17);     	
				$event->sheet->getDelegate()->getColumnDimension('O')->setWidth(17);     	
				
				$event->sheet->getDelegate()->getColumnDimension('P')->setWidth(17);     	
				$event->sheet->getDelegate()->getColumnDimension('Q')->setWidth(17);     	
				$event->sheet->getDelegate()->getColumnDimension('R')->setWidth(17);     	
				
				$event->sheet->getDelegate()->getColumnDimension('S')->setWidth(17);     	
				$event->sheet->getDelegate()->getColumnDimension('T')->setWidth(17);     	
				$event->sheet->getDelegate()->getColumnDimension('U')->setWidth(17);    
				$event->sheet->getDelegate()->getColumnDimension('V')->setWidth(17);   
				  	  
            },
        ];
    }
	
}
