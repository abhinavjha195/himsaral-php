<?php

namespace App\Http\Controllers;		
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;  
use Illuminate\Support\Facades\Hash;   
use Illuminate\Http\Request;    
use App\Models\StudentMaster; 
use App\Models\ClasswiseSubject; 
use App\Models\ParentLogin; 
use App\Models\SectionMaster;       
use App\Models\SubjectMaster;   
use App\Models\RouteMaster;          
use App\Models\District;      
use App\Models\Classic;   
use App\Models\Vehicle;	     
use App\Models\State; 
use Helper; 
use Image;         
use Illuminate\Support\Facades\DB;

class ClassWiseStrengthController extends Controller
{
   public function __construct()
    {
        DB::statement("SET SQL_MODE=''");
    }
	
	public function index(Request $request) 		
	{
		$search = $request->search;
        $limit = $request->limit;
        $page = $request->page;
        $order = $request->order;
        $order_by = $request->orderBy;

        $offset = ($page - 1) * $limit;
		
        $query = StudentMaster::join('class_master', 'student_master.class_id', '=', 'class_master.classId')
			->join('course_master', 'student_master.course_id', '=', 'course_master.courseId')
			->join('section_master', 'student_master.section_id', '=', 'section_master.sectionId')
			->select(
				'class_master.className',
				'course_master.courseName',
				'section_master.sectionName',
				DB::raw('COUNT(*) as totalStudents'),
				DB::raw('SUM(CASE WHEN LOWER(student_master.gender) = "male" THEN 1 ELSE 0 END) as maleCount'),
				DB::raw('SUM(CASE WHEN LOWER(student_master.gender) = "female" THEN 1 ELSE 0 END) as femaleCount')
			)
			->groupBy('class_master.className', 'course_master.courseName', 'section_master.sectionName')
			->offset($offset)->limit($limit);
			
		if ($search != '') {
			$query->where('courseName', 'like', '%' . $search . '%')
			->orWhere('className', 'like', '%' . $search . '%')
			->orWhere('sectionName', 'like', '%' . $search . '%')
			->orWhere('section_master.status', 'like', '%' . $search . '%');
		}
		if ($order_by != '') {
			$query->orderBy($order_by, $order);
		}
		
		$students = $query->get();
		if (count($students) > 0) {
			$response_arr = array('data' => $students, 'total' => $students[0]->totalStudents);
			return response()->json(["status" => "successed", "success" => true, "data" => $response_arr]);
        } else {
            $response_arr = array('data' => [], 'total' => 0);
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found", "data" => $response_arr]);
        }
       
	}
}