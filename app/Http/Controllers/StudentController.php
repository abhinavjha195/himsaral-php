<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use App\Models\Htl_user;
use DB;
use Illuminate\Http\Request;


class StudentController extends Controller
{
    
    public function add_student_process(Request $req){

       $validator= $this->validate($req, [ 'studentName' => 'required|min:2' ]);
        if ($validator->fails())
    {
        return response()->json(['errors'=>$validator->errors()->all(),'status_code'=>422]);
         }
       
        $studentName=$req->input('studentName');
        $email=$req->input('email');
        $bloodGroup=$req->input('bloodGroup');
        $mobile=$req->input('mobile');
        $aadhar=$req->input('aadhar');
        $perm_addr=$req->input('perm_addr');
        $temp_addr=$req->input('temp_addr');
        $pincode=$req->input('pincode');
        $accountNo=$req->input('accountNo');
        $ifsc=$req->input('ifsc');
        $branch_addr=$req->input('branch_addr');

       
        // echo $userId;
        // echo $password;
        $values = array('studentName' => ucfirst($studentName),'s_email'=>$email,'s_mobile'=>$mobile);
        

       
     
       // echo count($data);

        if( DB::table('student_master')->insert($values)){
            return ['status'=>True, 'message'=>'Student Added'];
        }
        else{
            return ['status'=>False, 'message'=>'Student Not Added'];
        }
       // echo "<br>";
        
    }



    public function course_list(){
        $data=array();
        $data= DB::table('course_master')
         ->select('*')
         ->get();
 
        
      
        // echo count($data);
 
         if(count($data) > 0){
             return ['status'=>True, 'data'=> $data];
         }
         else{
             return ['status'=>False, 'data'=>$data];
         }
    }

    public function course_list_id($id){
        $data=array();
        $data= DB::table('course_master')
         ->where('courseId',$id)
         ->get();
 
        // dd($data);
      
        // echo count($data);
 
         if(count($data) > 0){
             return ['status'=>True, 'data'=> $data];
         }
         else{
             return ['status'=>False, 'data'=>$data];
         }
    }


    public function update_course_process(Request $req){
       
        $courseName =   $req->input('courseName');
        $remark     =   $req->input('remark');
        $id         =   $req->input('id');

        // dd($req);
        $values = array('Remark' => $remark, 'courseName'=> ucfirst($courseName));
     
        if( DB::table('course_master')->where('courseId','=',$id)->update($values)){
            return ['status'=>True, 'message'=>'Course Updated'];
        }
        else{
            return ['status'=>False, 'message'=>'Course Not Updated'];
        }
        
    }

    public function delete_course($courseId){
        $delete = DB::table('course_master')->where('courseId','=',$courseId)->delete();
        if($delete){
            return ['status'=>True, 'message'=>'Course Deleted'];
        }else{
            return ['status'=>True, 'message'=>'Course not Deleted'];
        }

    }
}