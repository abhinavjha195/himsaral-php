<?php

namespace App\Rules; 

use Illuminate\Contracts\Validation\Rule;	
use Illuminate\Support\Facades\DB;   	

class uniqueRollNo implements Rule
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */
	 
	private $course_id = null;   
	private $class_id = null;  
	private $section_id = null;   
	
	 
    public function __construct($course_id,$class_id,$section_id)	
    {
        $this->course_id = $course_id;     
		$this->class_id = $class_id;       
		$this->section_id = $section_id;  
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
       // return strtoupper($value) === $value;   
	   
	    if($this->section_id !='')			
		{
			$record = DB::table('student_master')  
             ->select(DB::raw('count(*) as rec_count'))   
             ->where('course_id',$this->course_id)
			 ->where('class_id',$this->class_id)                 
			 ->where('section_id',$this->section_id)    
			 ->where('roll_no',$value)      
             ->get();    
		}
		else 
		{
			$record = DB::table('student_master')  
             ->select(DB::raw('count(*) as rec_count'))   
             ->where('course_id',$this->course_id)
			 ->where('class_id',$this->class_id) 
			 ->where('roll_no',$value)      	
             ->get();    
		}
		
		if($record[0]->rec_count>0)
		{
			return false; 	
		}
		else
		{
			return true;   
		}
		 
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    { 			 
        return 'The :attribute must be unique.';   			  
    }
}
