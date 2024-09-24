<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

use App\Models\ClasswiseSubject;
use App\Models\SubjectMaster;
use App\Models\ClasswiseDesc;
use App\Models\Classic;
use App\Models\SectionMaster;

class ClassWiseSubjectController extends Controller
{
	public function __construct()
    {
       DB::statement("SET SQL_MODE=''");
    }

    public function add_class_wise_sub_process(Request $request)
	{
		$inputs = $request->all();

		$course_id=$request->course_id;
        $class_id=$request->class_id;
		$sections=$request->section_arr;
		$subjects=$request->subject_arr;
		$ranks=$request->rank_arr;
		$electives=$request->elective_arr;
		$aditionals=$request->aditional_arr;
		$priorities=$request->priority_arr;

		$chk=0;

		if(count($sections)>0)
		{
			$checkExist=ClasswiseSubject::where('courseId',$course_id)
                ->where('classId',$class_id)
				->whereIn('sectionId',$sections)
                ->get();
		}
		else{
			$checkExist=ClasswiseSubject::where('courseId',$course_id)
                ->where('classId',$class_id)
                ->get();
		}

			$rules=[
				'class_id' => 'required',
				'course_id' => 'required',
			];

			$fields = [
				'class_id' => 'Class Name',
				'course_id' => 'Course Name',
			];

			$messages = [
				'required' => 'The :attribute field is required.',
			];

		$validator = Validator::make($inputs,$rules,$messages,$fields);

        if ($validator->fails()) {
			$errors=$validator->errors();
			$response_arr=array("status"=>"failed","message"=>"Please fill required fields!!","errors"=>$errors);
        }
		else if(count($checkExist)>0)
		{
			$response_arr=array("status"=>"failed","message"=>"Section already added!!","errors"=>[]);
		}
		else if(count($subjects)==0)
		{
			$response_arr=array("status"=>"failed","message"=>"Please select then add subjects!!","errors"=>[]);
		}
		else
		{
			if(count($sections)>0)
			{
				foreach($sections AS $sec)
				{
					$insert_arr=array(
						'courseId'=>$course_id,
						'classId'=>$class_id,
						'sectionId'=>$sec,
						'SessionId'=>0,
						'SchoolCode'=>''
					);

					$insert=ClasswiseSubject::create($insert_arr);
					$insert_id=$insert->id;

					if($insert_id)
					{
						foreach($subjects AS $sub)
						{
							$chk = 0;
							if(in_array($sub,$ranks) || in_array($sub,$electives) || in_array($sub,$aditionals))
							{
								$chk++;
							}

							if($chk)
							{
								$desc_arr[]=array(
									'csId'=>$insert_id,
									'subjectId'=>$sub,
									'compulsary'=>in_array($sub,$ranks)?1:0,
									'elective'=>in_array($sub,$electives)?1:0,
									'addition'=>in_array($sub,$aditionals)?1:0,
									'priority'=>array_key_exists($sub,$priorities)?$priorities[$sub]:0,
								);
							}
							else
							{
								$desc_arr[]=array(
									'csId'=>$insert_id,
									'subjectId'=>$sub,
									'compulsary'=>1,
									'elective'=>0,
									'addition'=>0,
									'priority'=>array_key_exists($sub,$priorities)?$priorities[$sub]:0,
								);
							}
						}

					}

				}

				$desc=ClasswiseDesc::insert($desc_arr);
				if($desc)
				{
					$message="Classwise subject created successfully.";
					$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data" =>$desc);
				}
				else
				{
					$message="could not created!!";
					$response_arr=array("status"=>'failed',"success"=>false,"message"=>$message,"errors"=>[],"data"=>[]);
				}

			}
			else
			{
				$insert_arr=array(
					'courseId'=>$course_id,
					'classId'=>$class_id,
					'sectionId'=>0,
					'SessionId'=>0,
					'SchoolCode'=>''
				);

				$insert=ClasswiseSubject::create($insert_arr);

				if($insert->id)
				{
					foreach($subjects AS $sub)
					{
						$chk = 0;
						if(in_array($sub,$ranks) || in_array($sub,$electives) || in_array($sub,$aditionals))
						{
							$chk++;
						}

						if($chk)
						{
							$desc_arr[]=array(
								'csId'=>$insert->id,
								'subjectId'=>$sub,
								'compulsary'=>in_array($sub,$ranks)?1:0,
								'elective'=>in_array($sub,$electives)?1:0,
								'addition'=>in_array($sub,$aditionals)?1:0,
								'priority'=>array_key_exists($sub,$priorities)?$priorities[$sub]:0,
							);
						}
						else
						{
							$desc_arr[]=array(
								'csId'=>$insert->id,
								'subjectId'=>$sub,
								'compulsary'=>1,
								'elective'=>0,
								'addition'=>0,
								'priority'=>array_key_exists($sub,$priorities)?$priorities[$sub]:0,
							);
						}
					}

					$desc=ClasswiseDesc::insert($desc_arr);
					if($desc)
					{
						$message="Classwise subject created successfully.";
						$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data" =>$desc);
					}
					else
					{
						$message="could not created!!";
						$response_arr=array("status"=>'failed',"success"=>false,"message"=>$message,"errors"=>[],"data"=>[]);
					}
				}
				else
				{
					$message="could not created!!";
					$response_arr=array("status"=>'failed',"success"=>false,"message"=>$message,"errors"=>[],"data"=>[]);
				}

			}

		}

		return response()->json($response_arr);

    }

    public function edit_class_wise_sub_process(Request $request,$id){

	   $info=ClasswiseSubject::leftJoin('course_master as cm','classwisesubject.courseId','=','cm.courseId')
        ->leftJoin('class_master as cs','classwisesubject.classId','=','cs.classId')
        ->leftJoin('section_master as sc','classwisesubject.sectionId','=','sc.sectionId')
		->leftJoin('class_wise_sub_desc as cd','classwisesubject.id','=','cd.csId')
        ->leftJoin('subject_master as sm','cd.subjectId','=','sm.subjectId')
        ->selectRaw('count(distinct classwisesubject.id) as rec_count')
        ->where('classwisesubject.id',$id)
        ->get();


		if($info[0]->rec_count>0)
		{
			 $classwise = ClasswiseSubject::leftJoin('course_master as cm','classwisesubject.courseId','=','cm.courseId')
					->leftJoin('class_master as cs','classwisesubject.classId','=','cs.classId')
					->leftJoin('section_master as sc','classwisesubject.sectionId','=','sc.sectionId')
					->leftJoin('class_wise_sub_desc as cd','classwisesubject.id','=','cd.csId')
					->leftJoin('subject_master as sm','cd.subjectId','=','sm.subjectId')
					->selectRaw("classwisesubject.courseId,classwisesubject.classId,classwisesubject.sectionId,group_concat(sm.subjectId) as sub_list,group_concat(cd.compulsary) as com_list,group_concat(cd.elective) as elec_list,group_concat(cd.addition) as ado_list,group_concat(cd.priority) as prt_list")
					->where('classwisesubject.id',$id)
					->groupBy('classwisesubject.id')
					->get();

			$inputs = $request->all();
			$course_id=$request->course_id;
			$class_id=$request->class_id;
			$sections=$request->section_arr;
			$subjects=$request->subject_arr;
			$ranks=$request->rank_arr;
			$electives=$request->elective_arr;
			$aditionals=$request->aditional_arr;
			$priorities=$request->priority_arr;

			$chk=0;
			$checkExist =array();

			if($classwise[0]->courseId !=$course_id || $classwise[0]->classId !=$class_id)
			{
				if(count($sections)>0)
				{
					$checkExist=ClasswiseSubject::where('courseId',$course_id)
					->where('classId',$class_id)
					->whereIn('sectionId',$sections)
					->get();
				}
				else{
					$checkExist=ClasswiseSubject::where('courseId',$course_id)
						->where('classId',$class_id)
						->get();
				}
			}

			$rules=[
					'class_id' => 'required|not_in:0',
					'course_id' => 'required|not_in:0',
				];

			$fields = [
					'class_id' => 'Class Name',
					'course_id' => 'Course Name',
				];

			$messages = [
					'required' => 'The :attribute field is required.',
				];

			$validator = Validator::make($inputs,$rules,$messages,$fields);

				if ($validator->fails()) {
					$errors=$validator->errors();
					$response_arr=array("status"=>"failed","message"=>"Please fill required fields!!","errors"=>$errors);
				}
				else if(count($checkExist)>0)
				{
					$response_arr=array("status"=>"failed","message"=>"Section already exist!!","errors"=>[]);
				}
				else if(count($subjects)==0)
				{
					$response_arr=array("status"=>"failed","message"=>"Please select then add subjects!!","errors"=>[]);
				}
				else
				{
					if(count($sections)>0)
					{
						foreach($sections AS $sec)
						{
							$updt_arr=array(
								'courseId'=>$course_id,
								'classId'=>$class_id,
								'sectionId'=>$sec,
								'SessionId'=>0,
								'SchoolCode'=>''
							);

							$update=ClasswiseSubject::where('id',$id)->update($updt_arr);

							foreach($subjects AS $sub)
							{
								$chk = 0;
								if(in_array($sub,$ranks) || in_array($sub,$electives) || in_array($sub,$aditionals))
								{
									$chk++;
								}

								if($chk)
								{
									$desc_arr[]=array(
										'csId'=>$id,
										'subjectId'=>$sub,
										'compulsary'=>in_array($sub,$ranks)?1:0,
										'elective'=>in_array($sub,$electives)?1:0,
										'addition'=>in_array($sub,$aditionals)?1:0,
										'priority'=>array_key_exists($sub,$priorities)?$priorities[$sub]:0,
									);
								}
								else
								{
									$desc_arr[]=array(
										'csId'=>$id,
										'subjectId'=>$sub,
										'compulsary'=>1,
										'elective'=>0,
										'addition'=>0,
										'priority'=>array_key_exists($sub,$priorities)?$priorities[$sub]:0,
									);
								}
							}

						}

						$del=ClasswiseDesc::where('csId',$id)->delete();
						if($del)
						{
							$desc=ClasswiseDesc::insert($desc_arr);
							if($desc)
							{
								$message="Classwise subject updated successfully.";
								$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data" =>$desc);
							}
							else
							{
								$message="could not created!!";
								$response_arr=array("status"=>'failed',"success"=>false,"message"=>$message,"errors"=>[],"data"=>[]);
							}
						}

					}
					else
					{
						$updt_arr=array(
							'courseId'=>$course_id,
							'classId'=>$class_id,
							'sectionId'=>0,
							'SessionId'=>0,
							'SchoolCode'=>''
						);

						$update=ClasswiseSubject::where('id',$id)->update($updt_arr);

						foreach($subjects AS $sub)
						{
							$chk = 0;
							if(in_array($sub,$ranks) || in_array($sub,$electives) || in_array($sub,$aditionals))
							{
								$chk++;
							}

							if($chk)
							{
								$desc_arr[]=array(
									'csId'=>$id,
									'subjectId'=>$sub,
									'compulsary'=>in_array($sub,$ranks)?1:0,
									'elective'=>in_array($sub,$electives)?1:0,
									'addition'=>in_array($sub,$aditionals)?1:0,
									'priority'=>array_key_exists($sub,$priorities)?$priorities[$sub]:0,
								);
							}
							else
							{
								$desc_arr[]=array(
									'csId'=>$id,
									'subjectId'=>$sub,
									'compulsary'=>1,
									'elective'=>0,
									'addition'=>0,
									'priority'=>array_key_exists($sub,$priorities)?$priorities[$sub]:0,
								);
							}
						}

						$del=ClasswiseDesc::where('csId',$id)->delete();
						if($del)
						{
							$desc=ClasswiseDesc::insert($desc_arr);
							if($desc)
							{
								$message="Classwise subject updated successfully.";
								$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data" =>$desc);
							}
							else
							{
								$message="could not updated!!";
								$response_arr=array("status"=>'failed',"success"=>false,"message"=>$message,"errors"=>[],"data"=>[]);
							}
						}

					}

				}
		}
		else
		{
			$response_arr=array("status" => "failed", "success" => false, "message" => "Whoops! no record found","data" =>[]);
        }

		return response()->json($response_arr);

    }


    public function class_wise_subject_list(){

		 $info=ClasswiseSubject::leftJoin('course_master as cm','classwisesubject.courseId','=','cm.courseId')
				->leftJoin('class_master as cs','classwisesubject.classId','=','cs.classId')
				->leftJoin('section_master as sc','classwisesubject.sectionId','=','sc.sectionId')
				->leftJoin('class_wise_sub_desc as cd','classwisesubject.id','=','cd.csId')
				->leftJoin('subject_master as sm','cd.subjectId','=','sm.subjectId')
				->selectRaw('count(distinct classwisesubject.id) as rec_count')
				->get();

         if($info[0]->rec_count>0){

			$classwiselist = ClasswiseSubject::leftJoin('course_master as cm','classwisesubject.courseId','=','cm.courseId')
					->leftJoin('class_master as cs','classwisesubject.classId','=','cs.classId')
					->leftJoin('section_master as sc','classwisesubject.sectionId','=','sc.sectionId')
					->leftJoin('class_wise_sub_desc as cd','classwisesubject.id','=','cd.csId')
					->leftJoin('subject_master as sm','cd.subjectId','=','sm.subjectId')
					->selectRaw("classwisesubject.id,cm.courseName,cs.className,ifnull(sc.sectionName,'N/A') as sectionName,sc.sectionId as sectionId,group_concat(sm.subjectId) as sub_set,group_concat(sm.subjectName) as sub_list,group_concat(cd.compulsary) as com_list,group_concat(cd.elective) as elec_list,group_concat(cd.addition) as ado_list")
					->groupBy('classwisesubject.id')
					->orderBy('cm.courseId','asc')
					->get();

			 return ['status'=>true,'data'=>$classwiselist];
         }
         else{
             return ['status'=>false,'data'=>$data];
         }
    }


    public function class_wise_subject_desc(){
        $data=array();
        $data= DB::table('class_wise_sub_desc')
        ->join('subject_master', 'class_wise_sub_desc.subjectId', '=', 'subject_master.subjectId')
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


    public function class_wise_sub_list_id($id){

		$info=ClasswiseSubject::leftJoin('course_master as cm','classwisesubject.courseId','=','cm.courseId')
        ->leftJoin('class_master as cs','classwisesubject.classId','=','cs.classId')
        ->leftJoin('section_master as sc','classwisesubject.sectionId','=','sc.sectionId')
		->leftJoin('class_wise_sub_desc as cd','classwisesubject.id','=','cd.csId')
        ->leftJoin('subject_master as sm','cd.subjectId','=','sm.subjectId')
        ->selectRaw('count(distinct classwisesubject.id) as rec_count')
        ->where('classwisesubject.id',$id)
        ->get();

		if($info[0]->rec_count>0)
		{
			 $classwise = ClasswiseSubject::leftJoin('course_master as cm','classwisesubject.courseId','=','cm.courseId')
					->leftJoin('class_master as cs','classwisesubject.classId','=','cs.classId')
					->leftJoin('section_master as sc','classwisesubject.sectionId','=','sc.sectionId')
					->leftJoin('class_wise_sub_desc as cd','classwisesubject.id','=','cd.csId')
					->leftJoin('subject_master as sm','cd.subjectId','=','sm.subjectId')
					->selectRaw("classwisesubject.courseId,classwisesubject.classId,ifnull(classwisesubject.sectionId,0) as sectionId,group_concat(sm.subjectId) as sub_list,group_concat(cd.compulsary) as com_list,group_concat(cd.elective) as elec_list,group_concat(cd.addition) as ado_list,group_concat(cd.priority) as prt_list")
					->where('classwisesubject.id',$id)
					->groupBy('classwisesubject.id')
					->get();

			 $classes=Classic::where('courseId',$classwise[0]->courseId)->get();
			 $sections = SectionMaster::where('classId',$classwise[0]->classId)
						->where('courseId',$classwise[0]->courseId)
						->where('sectionId',$classwise[0]->sectionId)
						->get();

			 $subjects=SubjectMaster::whereIn('subjectId',explode(',',$classwise[0]->sub_list))->where('status',1)->get();
			 $data=array('classlist'=>$classes,'classwise'=>$classwise,'sectionlist'=>$sections,'subjectlist'=>$subjects);
			 $response_arr=array("status"=>'successed',"success"=>true,"message"=>"","errors"=>[],"data" =>$data);
		}
		else
		{
			$response_arr=array("status" => "failed", "success" => false, "message" => "Whoops! no record found","data" =>[]);
        }

		return response()->json($response_arr);
    }



    public function class_wise_sub_desc_id($id){
        $data=array();
        $data= DB::table('class_wise_sub_desc')
        ->join('subject_master', 'class_wise_sub_desc.subjectId', '=', 'subject_master.subjectId')
         ->select('*')
         ->where('class_wise_sub_desc.csId',$id)
         ->get();



        // echo count($data);

         if(count($data) > 0){
             return ['status'=>True, 'data'=> $data];
         }
         else{
             return ['status'=>False, 'data'=>$data];
         }
    }




    public function class_wise_sub_delete($id){

        DB::table('classWiseSubject')->where('id', $id)->delete();

        return redirect('/class_wise_subject_list');

    }


}
