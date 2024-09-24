<?php

namespace App\Exports;

use App\Models\Employee;			
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithCustomStartCell;  
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;   
use \Maatwebsite\Excel\Sheet;				
use Illuminate\Support\Facades\DB;       
	
class EmployeeSearchExport implements FromCollection, WithHeadings, WithCustomStartCell, WithEvents
{   	
    /**
    * @return \Illuminate\Support\Collection		
    */

	protected $emp_no;
	protected $emp_name;		
	protected $bank_name;   
	protected $school_id;			
	protected $department_id;		
	protected $designation_id;    
	protected $search;
	protected $field;   	

	public function __construct($emp_no,$emp_name,$bank_name,$school_id,$department_id,$designation_id,$fiscal_id,$search,$field)
    {
        $this->emp_no = $emp_no;		
        $this->emp_name = $emp_name;  		
        $this->bank_name = $bank_name;  		
		$this->school_id = $school_id;		
        $this->department_id = $department_id;  		
        $this->designation_id = $designation_id;			 			
		$this->fiscal_id = $fiscal_id; 
		$this->search = $search;    
		$this->field = $field;  
    }
	
    public function collection()
    { 
		$result=array();	
		
		$query = Employee::leftJoin('department_master as dm','employees.dept_id','=','dm.departmentId') 					
				->leftJoin('designation_master as ds','employees.desig_id','=','ds.designationId')	 					 				
				->selectRaw("employees.*,ifnull(dm.departmentName,'') as department_name,ifnull(ds.designationName,'') as designation")		   				
				->where('employees.school_id',$this->school_id)   
				->where('employees.session_id',$this->fiscal_id);   	
				
		if($this->emp_name !='')		
		{
			$query->where('employees.emp_name', 'like', '%'.$this->emp_name.'%');   				
		}
		
		if($this->emp_no !='')		
		{
			$query->where('employees.emp_no', 'like', '%'.$this->emp_no.'%');   						
		}
		
		if($this->bank_name !='')		
		{
			$query->where('employees.bank_name', 'like', '%'.$this->bank_name.'%');   						
		}
		
		if($this->department_id !='')
		{
			$query->where('employees.dept_id',$this->department_id);	
		}
		
		if($this->designation_id !='')
		{
			$query->where('employees.desig_id',$this->designation_id);	
		}
		
		if($this->search !='')	
		{ 
			$key=$this->search;  
			$query->where(function($q) use ($key) {
				 $q->where('employees.emp_name', 'like', '%'.$key.'%')
				   ->orWhere('employees.emp_no', 'like', '%'.$key.'%')		   	
				   ->orWhere('employees.mobile', 'like', '%'.$key.'%')
				   ->orWhere('employees.mobile', 'like', '%'.$key.'%')  
				   ->orWhere('dm.departmentName', 'like', '%'.$key.'%')		 
				   ->orWhere('ds.designationName', 'like', '%'.$key.'%');	 		 	
			 });   
		} 		
		
		$records = $query->orderBy('employees.id','asc')->get();   
		$headings = json_decode($this->field);	  
		
		foreach($records as $record){
			
			$head_arr=array();	  
			
			if(in_array('emp_no',$headings))	
			{
				$head_arr['Employee No.']=$record->emp_no;    			
			}
			
			if(in_array('emp_name',$headings))	
			{
				$head_arr['Employee Name']=$record->emp_name;    
			}
			
			if(in_array('department_name',$headings))	
			{
				$head_arr['Department Name']=$record->department_name;    
			}
			
			if(in_array('gender',$headings))	
			{
				$head_arr['Gender']=$record->gender;    
			}
			
			if(in_array('caste',$headings))	
			{
				$head_arr['Caste']=$record->caste;    
			}
			
			if(in_array('marital_status',$headings))	
			{
				$head_arr['Marital Status']=$record->marital_status;    
			}		

			if(in_array('permanent_address',$headings))	
			{
				$head_arr['Permanent Address']=$record->permanent_address;    
			}	

			if(in_array('mobile',$headings))	
			{
				$head_arr['Mobile No.']=$record->mobile;    
			}	

			if(in_array('email',$headings))	
			{
				$head_arr['Email ID']=$record->email;    
			}		
			
			if(in_array('doj',$headings))	
			{
				$head_arr['Date Of Joining']=date('d-M-Y',strtotime($record->doj));    
			}

			if(in_array('dob',$headings))	
			{
				$head_arr['Date Of Birth']=date('d-M-Y',strtotime($record->dob));    
			}	  	
			
			if(in_array('designation',$headings))	
			{
				$head_arr['Designation']=$record->designation;    
			}	
			
			if(in_array('account_no',$headings))	
			{
				$head_arr['Account No.']=$record->account_no;    
			}	
			
			if(in_array('father_name',$headings))	
			{
				$head_arr['Father Name']=$record->father_name;    
			}	
			
			if(in_array('aadhar',$headings))	
			{
				$head_arr['Aadhar No.']=$record->aadhar;    
			}	
			
			if(in_array('temporary_address',$headings))	
			{
				$head_arr['Temporary Address']=$record->temporary_address;    
			}	
			
			if(in_array('ifsc',$headings))	
			{
				$head_arr['IFSC']=$record->ifsc;    
			}	
			
			if(in_array('annual_income',$headings))	
			{
				$head_arr['Annual Income']=$record->annual_income;	    
			}	
			
			if(in_array('pan',$headings))	
			{
				$head_arr['Pan Card']=$record->pan;    
			}	
			
			if(in_array('leaves_permitted',$headings))	
			{
				$head_arr['Leaves Permitted']=$record->leaves_permitted;    
			}	
			
			if(in_array('login_id',$headings))	
			{
				$head_arr['Emp Login name']=$record->login_id;    
			}	
			
			if(in_array('salary_grade',$headings))	
			{
				$head_arr['Salary Grade']=$record->salary_grade;    
			}	
			
			if(in_array('grade_cbse',$headings))	
			{
				$head_arr['Salary Grade Cbse']=$record->grade_cbse;    
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
			if($head=='emp_no')
			{
				$level='Employee No.';	
			}
			else if($head=='emp_name')
			{
				$level='Employee Name';  
			}
			else if($head=='department_name')
			{
				$level='Department Name';  
			}
			else if($head=='gender')
			{
				$level="Gender";  
			}
			else if($head=='caste')
			{
				$level='Caste';		
			}
			else if($head=='marital_status')
			{
				$level='Marital Status';		
			}
			else if($head=='permanent_address')
			{
				$level='Permanent Address';		
			}
			else if($head=='mobile')
			{
				$level='Mobile No.';		
			}
			else if($head=='email')
			{
				$level='Email Id';  
			}
			else if($head=='doj')
			{
				$level='Date Of Joining';  
			}
			else if($head=='dob')
			{
				$level='Date Of Birth';		
			}
			else if($head=='designation')
			{
				$level="Designation";		
			}
			else if($head=='account_no')
			{
				$level='Account No.';  
			}
			else if($head=='father_name')
			{
				$level='Father Name';  
			}
			else if($head=='aadhar')
			{
				$level='Aadhar No.';		
			}
			else if($head=='temporary_address')
			{
				$level='Temporary Address';  
			}
			else if($head=='ifsc')
			{
				$level='IFSC';		
			} 			
			else if($head=='annual_income')
			{
				$level='Annual Income';  
			}
			else if($head=='pan')
			{
				$level='Pan Card';		
			}
			else if($head=='leaves_permitted')
			{
				$level='Leaves Permitted';		
			}
			else if($head=='login_id')
			{
				$level="Emp Login name";    
			}
			else if($head=='salary_grade')
			{
				$level='Salary Grade';  
			}
			else if($head=='grade_cbse')
			{
				$level="Salary Grade Cbse";    
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
                $sheet->setCellValue('A1', "School Employee List : Dated :-".date('d-m-Y'));	
                
                $styleArray = [
                    'alignment' => [
                        'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                    ],
                ];
                
                $cellRange = 'A1:W1';  
                $event->sheet->getDelegate()->getStyle($cellRange)->applyFromArray($styleArray);
				
				$event->sheet->getDelegate()->getStyle($cellRange)->getFont()->setSize(14)->setBold(true)->getColor()->setRGB('ff0000'); 						
			
                $event->sheet->getDelegate()->getStyle('A2:W2')->getFont()->setBold(true); 	  
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
				$event->sheet->getDelegate()->getColumnDimension('W')->setWidth(17);   		
				  	  
            },
        ];
    }
	
}				
