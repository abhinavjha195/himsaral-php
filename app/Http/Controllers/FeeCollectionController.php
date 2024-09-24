<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

use App\Models\StudentMaster;
use App\Models\FeeCategoryMaster;
use App\Models\FeeAmtSingle;
use App\Models\FeeAmtMaster;
use App\Models\FeeTransMaster;
use App\Models\FeeTransDelete;
use App\Models\FeeConcession;
use App\Models\FeeTransDesc;
use App\Models\StationMaster;
use App\Models\FeePending;
use App\Models\FineSetting;
use App\Models\FeeSetting;
use App\Models\PaymentMode;
// use App\Models\FeeAmount;
use App\Models\FeeSlot;
use App\Models\FeeTemp;
use App\Models\School;
use App\Models\SessionMaster;
use Image;
use PDF;
use DB;
use Helper;

class FeeCollectionController extends Controller
{
	public function __construct()
    {
        DB::statement("SET SQL_MODE=''");
    }

    public function index()
	{
		$categories=FeeCategoryMaster::all();
        $fiscal=$this->calculateFiscalYear(date('m'));
		$fiscal_arr=explode(':',$fiscal);

		$months = CarbonPeriod::create($fiscal_arr[0],'1 month',$fiscal_arr[1]);

		foreach ($months as $month)
		{
			$month_arr['01-'.$month->format("m-Y")]=$month->format("MY");
		}

		$slots=FeeSlot::all();
		$modes=PaymentMode::all();

		$receipts=FeeTransDelete::leftJoin('fee_temp as ft','feetransdelete.FeeTransId','=','ft.FeeTransId')
				->select('feetransdelete.sno','feetransdelete.Admission_No','feetransdelete.FeeMonth','feetransdelete.FeeAmount')
				->where('ft.status','!=',1)
                ->get();

		$feedata=array('categories'=>$categories,'months'=>$month_arr,'slots'=>$slots,'modes'=>$modes,'receipts'=>$receipts);

        if(!empty($categories)) {
			return response()->json(["status" => 'successed',"data" => $feedata]);
		}
		else {
			return response()->json(["status" => "failed","message" => "Whoops! no record found","data" =>[]]);
		}

    }


	public function create(Request $request)
	{
        // ini_set('max_execution_time',240);
		$inputs=$request->all();
		$slots=json_decode($request->slots);
		$amounts=json_decode($request->amnts);
		$submit=$request->button_type;
		$image_rule=$image_name="";
		$id_arr = array();
		$count=0;

		foreach ($slots as $key => $value)
		{
			$count++;
		}

		if($request->file('attachment')!=null)
		{
			$image_rule = 'required|image|mimes:jpeg,png,jpg|max:5120';
		}

		$receipt_rule=($request->receipt_type=='manual')?'required':'';

		$rules=[
			'attachment' => $image_rule,
			'admission_no' => 'required|string|max:255',
			'pay_mode' => 'required',
			'pay_amount'=> 'required|numeric|gt:0',
			'receipt_no'=>$receipt_rule
		];

		$fields = [
			'attachment' => 'Attachment Image',
			'admission_no' => 'Admission Number',
			'pay_mode' => 'Payment Mode',
			'pay_amount' => 'Current Payment',
			'receipt_no' => 'Fee Receipt',
		];

		$messages = [
			'required' => 'The :attribute field is required.',
		];

		$validator = Validator::make($inputs, $rules, $messages, $fields);

        if ($validator->fails()) {
			$errors=$validator->errors();
			$response_arr=array("status"=>"failed","success"=>false,"message"=>"Please fill required fields!!","errors"=>$errors);
        }
		else if($count==0)
		{
			$response_arr=array("status"=>"failed","success"=>false,"message" => "Please select month/category checkboxes!!","errors" =>'');
		}
		else
		{
			if($request->hasFile('attachment'))
			{
				$image  = $request->file('attachment');
				$height = Image::make($image)->height();
				$width = Image::make($image)->width();
				$image_name = time().rand(3, 9).'.'.$image->getClientOriginalExtension();

				$destinationPath1 = public_path('/uploads/draft_image/thumbnail/');
				$imgFile = Image::make($image->getRealPath());
				$imgFile->resize($height,$width, function ($constraint) {
					$constraint->aspectRatio();
				})->save($destinationPath1.'/'.$image_name);

				$destinationPath2 = public_path('/uploads/draft_image/');
				$image->move($destinationPath2, $image_name);

			}

			$class_id=$request->class_id;
			$course_id=$request->course_id;
			$section_id=$request->section_id;
			$admission_no=$request->admission_no;
			$amount=$request->fee_amount;
			$paid=$request->pay_amount;

			$desc=$debt=0;

			$receipt_no=($request->receipt_type=='manual')?$request->receipt_no:'';

			foreach ($slots as $k=>$v)
			{
				$catarr=explode(',',$v);
				$amountarr=explode(',',$amounts->$k);

				$trans_exist=FeeTransMaster::select(DB::raw('count(*) as row_count,MAX(FeeTransId) as max_id'))
				->where('feetransmaster.ClassId',$class_id)
				->where('feetransmaster.CourseId',$course_id)
				->where('feetransmaster.SectionId',$section_id)
				->where('feetransmaster.FeeMonth',date("MY",strtotime($k)))
				->where('feetransmaster.FeeYear',date("Y",strtotime($k)))
				->where('feetransmaster.AdmissionNo',$admission_no)
				->get();

				// receipt no.
				$fee_receipt=FeeTransMaster::select(DB::raw('IFNULL(MAX(FeeTransId),0)+1 as next_id'))->get();
				$num = $fee_receipt[0]->next_id;
				$len=strlen($num);
				$place=$len+4;
				$num_padded = sprintf("%0{$place}d",$num);
				$receipt=$this->generateReceipt('S'.$num_padded);

				/* if($trans_exist[0]->row_count>0)
				{
					$record=FeeTransMaster::where('FeeTransId',$trans_exist[0]->max_id)->get();
					$trans_amount = $record[0]->BalanceAmount;
				}
				else
				{
					$trans_amount=array_sum($amountarr);
				} */

				$trans_amount=array_sum($amountarr);

					if($paid>0)
					{

						$trans_arr = array(
							'AdmissionNo'=>$admission_no,
							'ClassId'=>$class_id,
							'CourseId'=>$course_id,
							'SectionId'=>$section_id,
							'FeeAmount'=>$trans_amount,
							'FeeDate'=>$request->fee_date,
							'FeeMonth'=>date("MY",strtotime($k)),
							'FeeYear'=>date("Y",strtotime($k)),
							'BalanceAmount'=>($paid>$trans_amount)?0.0:$trans_amount-$paid,
							'ReceiptNo'=>($receipt_no=='')?$receipt:$receipt_no,
							'PaymentMode'=>$request->pay_mode,
							'BankName'=>empty($request->bank_name)?'':$request->bank_name,
							'BranchAddress'=>empty($request->branch_address)?'':$request->branch_address,
							'DraftChequeTransactionId'=>empty($request->draft_cheque)?'':$request->draft_cheque,'Attachment'=>$image_name,
						);

						if($receipt_no !='')
						{
							FeeTemp::where('sno',$receipt_no)->update(['status'=>1]);
							$receipt_no ="";
						}

						$transaction = FeeTransMaster::create($trans_arr);
						$transaction_id=($transaction->id)?$transaction->id:0;

						for ($i=0;$i<count($catarr);$i++)
						{
							$check_exist=FeeTransMaster::leftJoin('feetransdesc as fd','feetransmaster.FeeTransId','=','fd.FeeTransId')
							->leftJoin("feepending as fp",function($join){
								$join->on("feetransmaster.FeeTransId","=","fp.FeeTransId");
								$join->on("fd.FeeCatId","=","fp.FeeCatId");
							})
							->select(DB::raw('SUM(IFNULL(fd.FeeAmt,0)) as fee_sum,SUM(IFNULL(fp.PendingAmt,0)) as balance_sum'))
							->where('feetransmaster.ClassId',$class_id)
							->where('feetransmaster.CourseId',$course_id)
							->where('feetransmaster.SectionId',$section_id)
							->where('feetransmaster.FeeMonth',date("MY",strtotime($k)))
							->where('feetransmaster.FeeYear',date("Y",strtotime($k)))
							->where('feetransmaster.AdmissionNo',$admission_no)
							->where('fd.FeeCatId',$catarr[$i])
							->get();


								$fee=$amountarr[$i]-$check_exist[0]->fee_sum;
								$amnt=($paid>$amountarr[$i])?$amountarr[$i]:$paid;

								if($transaction_id && $amountarr[$i]>0)
								{
									array_push($id_arr,$transaction_id);
									$desc_arr=array(
										'FeeTransId'=>$transaction_id,
										'FeeCatId'=>$catarr[$i],
										'FeeMonth'=>date("MY",strtotime($k)),
										'FeeYear'=>date("Y",strtotime($k)),
										'FeeAmt'=>$amnt,
										'CurrentMonthFee'=>$amountarr[$i],
									);

									$desc=FeeTransDesc::create($desc_arr);

									if($amountarr[$i]>$paid)
									{
										$balance = $amountarr[$i]-$paid;

										$debt_arr=array(
											'FeeTransId'=>$transaction_id,
											'AdmNo'=>$admission_no,
											'FeeCatId'=>$catarr[$i],
											'FeeMonth'=>date("MY",strtotime($k)),
											'Feeyear'=>date("Y",strtotime($k)),
											'PendingAmt'=>$balance,
										);

										$debt=FeePending::create($debt_arr);

									}

								}

								$paid = $paid-$amnt;

						}



					//
				}

			}

			if($desc || $debt)
			{
				if($submit=='printsave')
				{
					$school=School::where('school_code','S110')->get();
					$student_receipt=StudentMaster::leftJoin('class_master as cm','student_master.class_id','=','cm.classId')
						->leftJoin('feetransmaster as ft','student_master.admission_no','=','ft.AdmissionNo')
						->leftJoin('feetransdesc as fd','ft.FeeTransId','=','fd.FeeTransId')
						->leftJoin("feepending as fp",function($join){
							$join->on("ft.FeeTransId","=","fp.FeeTransId");
							$join->on("fd.FeeCatId","=","fp.FeeCatId");
						})
						->leftJoin('fee_category_master as fc','fd.FeeCatId','=','fc.fee_id')
						->select(DB::raw("student_master.student_name,student_master.father_name,student_master.admission_no,cm.className,GROUP_CONCAT(DISTINCT ft.ReceiptNo SEPARATOR ',') as feereceipts,ft.FeeDate,GROUP_CONCAT(DISTINCT fd.FeeMonth SEPARATOR ',') as feemonths,fc.name as cat_name,sum(fd.CurrentMonthFee) as cat_fee,sum(fd.FeeAmt) as paid_fee,sum(IFNULL(fp.PendingAmt,0)) as pending_fee"))
						->where('student_master.class_id',$class_id)
						->where('student_master.course_id',$course_id)
						->where('student_master.admission_no',$admission_no)
						->whereIn('ft.FeeTransId',$id_arr)
						->groupBy('fc.fee_id')
						->orderBy('ft.FeeTransId','asc')
						->get();

					$data = array('school'=>$school,'receipt'=>$student_receipt);

					$receipt_name=time().rand(1,99).'.'.'pdf';

					$customPaper = array(0,0,340,400);
					$pdf = PDF::loadView('fee_receipt',$data)->setPaper($customPaper)->save(public_path("receipts/$receipt_name"));

					$message="Fee saved successfully, get the receipt.";
					$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data" =>$receipt_name);
				}
				else
				{
					$message="Fee saved successfully";
					$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data" =>$desc);
				}
			}
			else
			{
				$message="could not saved!!";
				$response_arr=array("status"=>'failed',"success"=>false,"message"=>$message,"errors"=>[],"data"=>'');
			}

		}

		return response()->json($response_arr);
	}

    public function calculateFiscalYear($month)
	{
		if($month > 4)
		{
			$y = date('Y');
			$pt = date('Y', strtotime('+1 year'));
			$fy = $y."-04-01".":".$pt."-03-31";
		}
		else
		{
			$y = date('Y', strtotime('-1 year'));
			$pt = date('Y');
			$fy = $y."-04-01".":".$pt."-03-31";
		}

		return $fy;

	}

   public function getFeeDetails($admsn_no)
   {
        /* $result=StudentMaster::leftJoin('class_master as cs','student_master.class_id','=','cs.classId')
			->select('student_master.*','cs.className')
			->where('student_master.admission_no',$admsn_no)
            ->get();  */
        $fiscal_yr=Helper::getFiscalYear(date('m'));
        $fiscal_arr=explode(':',$fiscal_yr);
        $fiscalYear=SessionMaster::where('session_start',$fiscal_arr[0])->where('session_end',$fiscal_arr[1])->get();
        $fiscal_id=(count($fiscalYear)>0)?$fiscalYear[0]->id:0;

		$result=StudentMaster::leftJoin('class_master as cs','student_master.class_id','=','cs.classId')
			->leftJoin('slc_certificates as sl','student_master.id','=','sl.student_id')
			->select('student_master.*','cs.className')
			->where('student_master.admission_no',$admsn_no)      # slc=0
			->whereNull('sl.student_id')
			->get();

        if(count($result)>0) {
			$admission_dt=$result[0]->admission_date;
			$admission_no= $result[0]->admission_no;

			$course_id= $result[0]->course_id;
			$class_id= $result[0]->class_id;

			$monthnoadm=(int)date('m',strtotime($admission_dt));
			$yearadm=date('Y',strtotime($admission_dt));

			$parent_type= $result[0]->parent_type;
			$sibling_no= $result[0]->sibling_no;
			$sibling_admno = $result[0]->sibling_admission_no;
			$staff_child= $result[0]->staffchild;
			$child_no= $result[0]->child_no;
			$management_conn= $result[0]->management_concession;
			$CheckTransPort=$result[0]->transportation;
			$transport_conn= $result[0]->transport_concession;
			$transport_connamnt= $result[0]->transconcession_amount;
			$station_id= $result[0]->station_id;
			$applicable= $result[0]->applicable;

			$current_month = date('M');
			$current_year = date('Y');

			$start = $admission_dt;
			$time = date('Y').'-'.date('m').'-01';
			$end = date("Y-m-d",strtotime("+1 month",strtotime($time)));

			$periods = CarbonPeriod::create($start,'1 month',$end);
			$time_arr=array();
			$slot_arr = array();
			$fee_arr = array();

			$fiscal=$this->calculateFiscalYear(date('m'));
			$fiscal_arr=explode(':',$fiscal);
			$months = CarbonPeriod::create($fiscal_arr[0],'1 month',$fiscal_arr[1]);

			foreach ($months as $month)
			{
				$search=$month->format("MY");
				$records=FeeSlot::whereRaw("FIND_IN_SET('$search',FeeDueMonths)")->orderBy('FeeSlotId','ASC')->get();
				foreach($records AS $record)
				{
					array_push($slot_arr,$record->FeeSlotId);
				}
			}

			$id_arr=array_unique($slot_arr);

			$fee_cats=FeeAmtMaster::leftJoin('feeamtdesc as fd','feeamtmaster.FeeAmtId', '=', 'fd.FeeAmtId')
					->leftJoin('fee_slot_master as sm','fd.FeeCatId','=','sm.FeeCatId')
					->select(DB::raw("feeamtmaster.ClassId,sm.FeeCatId,sm.SessionId,sm.SchoolCode,GROUP_CONCAT(sm.FeeDueMonths SEPARATOR ',') as fee_month"))
					->where('feeamtmaster.CourseId',$course_id)
					->where('feeamtmaster.ClassId',$class_id)
					->whereIn('sm.FeeSlotId',$id_arr)
					->groupBy('sm.FeeCatId')
					->get();

			$fee_arr=$color_arr=array();

			foreach($fee_cats AS $fc)
			{
				$CurrentMonthFee=0;
				$FeeAmount=0;
				$paidCheck=0;
				$paid_amount=0;
				$amt=0;
				$color='NA';
				$session_id='';
				$school_code='';

				$checkfee=FeeSetting::where('SchoolCode',$fc->SchoolCode)->get();
				$fee_info=FeeCategoryMaster::where('fee_id',$fc->FeeCatId)->get();

				$fee_type = (count($fee_info)>0)?$fee_info[0]->fee_type:'';
				$applicable_type = (count($fee_info)>0)?$fee_info[0]->applicable:'';

				$month_arr=explode(',',$fc->fee_month);

			//  if(true)
				if(count($checkfee)>0)	  # first block   first condition
				{
				#begin	 3rd begin

					for($i=0;$i<count($month_arr);$i++)
					{
						$monthnofee=(int)date("m",strtotime($month_arr[$i]));
						$yearnofee=date("Y",strtotime($month_arr[$i]));
						$feemonth=date("M",strtotime($month_arr[$i]));

						$amt=0;
						$color='NA';

					if(($monthnoadm>$monthnofee)&&($yearadm==$yearnofee))
					{
						$CurrentMonthFee=0;
						$FeeAmount=0;
						$paidCheck=0;
						$color='NA';
					}
					else if($yearadm>$yearnofee)
					{
						$CurrentMonthFee=0;
						$FeeAmount=0;
						$paidCheck=0;
						$color='NA';
					}
					else
					{
						#begin   4th begin

							$fee_amount=FeeAmtSingle::select(DB::raw('count(*) as fee_count'))
										->where('AdmissionNo',$admission_no)
										->where('FeeCatId',$fc->FeeCatId)
										->where('SessionId',$fiscal_id)
										->get();

							if($fee_amount[0]->fee_count >0)
							{
								$rec=FeeAmtSingle::leftJoin('fee_slot_master as fs','feeamtsingle.FeeCatId','=','fs.FeeCatId')
									->select('feeamtsingle.FeeAmount')
									->where('fs.SchoolCode',$fc->SchoolCode)
									->where('fs.SessionId',$fiscal_id)
									->where('fs.FeeCatId',$fc->FeeCatId)
									->where('feeamtsingle.AdmissionNo',$admission_no)
									->whereRaw("FIND_IN_SET('$month_arr[$i]',fs.FeeDueMonths)")
									->get();

									if(count($rec)>0)
									{
										if($rec[0]->FeeAmount>0)
										{
											$amt = $rec[0]->FeeAmount;
										}
									}
							}
							else
							{
								#begin	 5th begin
									$rec=FeeAmtMaster::leftJoin('feeamtdesc as fa','feeamtmaster.FeeAmtId','=','fa.FeeAmtId')
											->leftJoin('fee_slot_master as fs','fa.FeeCatId','=','fs.FeeCatId')
											->select('fa.FeeAmount')
											->where('fs.SchoolCode',$fc->SchoolCode)
											->where('fs.SessionId',$fc->SessionId)
											->where('fs.FeeCatId',$fc->FeeCatId)
											->where('feeamtmaster.ClassId',$fc->ClassId)
											->whereRaw("FIND_IN_SET('$month_arr[$i]',fs.FeeDueMonths)")
											->get();

									if(count($rec)>0)
									{
										if($rec[0]->FeeAmount>0)
										{
											$amt = $rec[0]->FeeAmount;
										}
									}

									if($fee_type=='tution')
									{
										#begin	 6th begin
										if($parent_type=='old' && $sibling_admno !='')
										{
											#begin	 7th begin
											$concession=FeeConcession::where('ConcessionName','sibling')
															->where('SchoolCode',$fc->SchoolCode)
															->where('SessionId',$fc->SessionId)
															->get();

											$sibling=StudentMaster::select(DB::raw('count(*) as sibling_count'))
													 ->where('admission_no',$sibling_admno)
													 ->get();

											if($sibling[0]->sibling_count==0)
											{
												$amt=$amt-0;
											}
											else if($sibling_no==1)
											{
												if($concession[0]->ConcessionType=='fixed')
												{
													$amt=$amt-$concession[0]->ConcessionAMount;
												}
												else if($concession[0]->ConcessionType=='percentage')
												{
													$percent=($concession[0]->ConcessionAMount/100)*$amt;
													$amt=$amt-$percent;
												}
												else
												{
													$amt=$amt-0;
												}
											}
											else if($sibling_no==2)
											{
												if($concession[0]->ConcessionType2=='fixed')
												{
													$amt=$amt-$concession[0]->ConcessionAMount2;
												}
												else if($concession[0]->ConcessionType2=='percentage')
												{
													$percent=($concession[0]->ConcessionAMount2/100)*$amt;
													$amt=$amt-$percent;
												}
												else
												{
													$amt=$amt-0;
												}
											}
											else
											{
												$amt=$amt-0;
											}
										#end	 7th end
										}

										if($staff_child=='yes')
										{
											#begin	 8th begin
											$concession=FeeConcession::where('ConcessionName','staff')
														->where('SchoolCode',$fc->SchoolCode)
														->where('SessionId',$fc->SessionId)
														->get();

											if($child_no==1)
											{
												if($concession[0]->ConcessionType=='fixed')
												{
													$amt=$amt-$concession[0]->ConcessionAMount;
												}
												else if($concession[0]->ConcessionType=='percentage')
												{
													$percent=($concession[0]->ConcessionAMount/100)*$amt;
													$amt=$amt-$percent;
												}
												else
												{
													$amt=$amt-0;
												}
											}
											else if($child_no==2)
											{
												if($concession[0]->ConcessionType2=='fixed')
												{
													$amt=$amt-$concession[0]->ConcessionAMount2;
												}
												else if($concession[0]->ConcessionType2=='percentage')
												{
													$percent=($concession[0]->ConcessionAMount2/100)*$amt;
													$amt=$amt-$percent;
												}
												else
												{
													$amt=$amt-0;
												}
											}
											else
											{
												$amt=$amt-0;
											}
											#end	8th end
										}

										if($management_conn=='yes')
										{
											$concession=FeeConcession::where('ConcessionName','management')
												->where('SchoolCode',$fc->SchoolCode)
												->where('SessionId',$fc->SessionId)
												->get();

											if($concession[0]->ConcessionType=='fixed')
											{
												$amt=$amt-$concession[0]->ConcessionAMount;
											}
											else if($concession[0]->ConcessionType=='percentage')
											{
												$percent=($concession[0]->ConcessionAMount/100)*$amt;
												$amt=$amt-$percent;
											}
											else
											{
												$amt=$amt-0;
											}

										}
										#end	6th end
									}
									if($applicable_type=='new')
									{
										if($applicable=='old')
										{
											$amt=0;
											$color='NA';
										}
									}
									else if($applicable_type=='old')
									{
										if($applicable=='new')
										{
											$amt=0;
											$color='NA';
										}
									}
									else
									{
										$amt=$amt-0;
									}
								#end	 	 5th end
							}

							if($fee_type=='transport')
							{
								#begin	 9th begin
								if($CheckTransPort=='yes')
								{
									#begin	 10th begin
									$slot_info=FeeSlot::select(DB::raw('count(*) as row_count'))
												->where('FeeCatId',$fc->FeeCatId)
												->where('SchoolCode',$fc->SchoolCode)
												->where('SessionId',$fc->FeeCatId)
												->whereRaw("FIND_IN_SET('$month_arr[$i]',FeeDueMonths)")
												->get();

									if($slot_info[0]->row_count>0)
									{
										$fare=StationMaster::where('stationId',$station_id)->get();
										if($transport_conn=='yes')
										{
											if(count($fare)>0)
											{
												$amt = $fare[0]->busFare-$transport_connamnt;
											}
											else
											{
												$amt = 0;
											}
										}
										else
										{
											$amt = 0;
										}
									}
									else
									{
										$amt = 0;
										$color='NA';
									}
								#end   10th end
								}
								else
								{
									$amt = 0;
									$color='NA';
								}

							#end  9th end
							}
							if($fee_type=='fine')
							{
								#begin	 11th begin
								$fine=FineSetting::where('SchoolCode',$fc->SchoolCode)
										->where('SessionId',$fc->SessionId)
										->get();

								if($fine[0]->DueDate=='')
								{
									$amt = 0;
									$color='NA';
								}
								else
								{
									#begin	 12th begin
									$dt=strtotime("01$month_arr[$i]");
									$now = time();
									$datediff = $now - $dt;
									$diff = round($datediff/(60*60*24));

									if($diff>$fine[0]->DueDate)
									{
										$fine_days_no=$diff-$fine[0]->DueDate;

										if($fine[0]->FineType=='fixed')
										{
											$amt=$fine[0]->FineAmount;
										}
										else if($fine[0]->FineType=='day basis')
										{
											$amt=$fine_days_no*$fine[0]->FineAmount;
										}
										else
										{
											$amt = 0;
										}

									}
									else
									{
										$amt = 0;
									}
								#end	 12th end
								}
							#end   11th end
							}

						$PaidAmt=FeeTransMaster::leftJoin('feetransdesc as fd','feetransmaster.FeeTransId','=','fd.FeeTransId')
									->select('fd.FeeAmt','fd.CurrentMonthFee')
									->select(DB::raw('SUM(fd.FeeAmt) as paid_amount'))
									->where('fd.FeeCatId',$fc->FeeCatId)
									->where('feetransmaster.AdmissionNo',$admission_no)
									->where('feetransmaster.SchoolCode',$fc->SchoolCode)
									->where('feetransmaster.SessionId',$fc->SessionId)
									->where('feetransmaster.FeeMonth',$feemonth)
									->where('feetransmaster.FeeYear',$yearnofee)
									->get();

						if(count($PaidAmt)>0)
						{
							$paid_amount = $PaidAmt[0]->paid_amount;
						}
						else
						{
							$paid_amount = 0.0;
						}

						if($amt<0 || is_null($amt))
						{
							$amt = 0;
							$color='NA';
						}

						$lastCurrentfee=FeeTransMaster::leftJoin('feetransdesc as fd','feetransmaster.FeeTransId','=','fd.FeeTransId')
											->select(DB::raw('fd.CurrentMonthFee'))
											->where('fd.FeeCatId',$fc->FeeCatId)
											->where('feetransmaster.AdmissionNo',$admission_no)
											->where('feetransmaster.SchoolCode',$fc->SchoolCode)
											->where('feetransmaster.SessionId',$fc->SessionId)
											->where('feetransmaster.FeeMonth',$month_arr[$i])
											->where('feetransmaster.FeeYear',$yearnofee)
											->orderBy('fd.id','desc')
											->limit(1)
											->get();

						if(count($lastCurrentfee)>0)
						{
							if($lastCurrentfee[0]->CurrentMonthFee>0)
							{
								$CurrentMonthFee=$lastCurrentfee[0]->CurrentMonthFee;
								$paidCheck=1;
								$amt=$lastCurrentfee[0]->CurrentMonthFee-$paid_amount;
							}
							else
							{
								$CurrentMonthFee=$amt;
								$paidCheck=0;
								$amt=$amt-$paid_amount;
							}
						}
						else
						{
							$CurrentMonthFee=$amt;
							$paidCheck=0;
							$amt=$amt-$paid_amount;
						}
						if($amt<0)
						{
							$amt = 0;
						}
						else
						{
							$BalAmt=FeeTransMaster::leftJoin('feepending as fp','feetransmaster.FeeTransId','=','fp.FeeTransId')
									->select(DB::raw('SUM(fp.PendingAmt) as pending_amount'))
									->where('fp.FeeCatId',$fc->FeeCatId)
									->where('feetransmaster.AdmissionNo',$admission_no)
									->where('feetransmaster.SchoolCode',$fc->SchoolCode)
									->where('feetransmaster.SessionId',$fc->SessionId)
									->where('feetransmaster.FeeMonth',$month_arr[$i])
									->where('feetransmaster.FeeYear',$yearnofee)
									->get();

							if(count($BalAmt)>0)
							{
								if($BalAmt[0]->pending_amount==0)
								{
									// $amt = 0;
								}

							}
						}

						if($amt>0 && $paid_amount>0)
						{
							$color='HALF';
						}
						else if($amt>0 && $paid_amount==0)
						{
							$color='NIL';
						}
						else if($amt==0 && $paid_amount>0)
						{
							$color='FULL';
						}
						else if($amt==0 && $paid_amount==0)
						{
							$color='NA';
						}
						else
						{
							$color='';
						}


					#end	 4th end
					}

					$fee_arr[$fc->FeeCatId][$month_arr[$i]]=$amt;
					$color_arr[$fc->FeeCatId][$month_arr[$i]]=$color;

				}
					#end	 3rd end

				}
				else	# 2nd block
				{
					$feeSingle=FeeAmtSingle::select(DB::raw('count(*) as fee_count'))
					->where('AdmissionNo',$admission_no)
					->where('FeeCatId',$fc->FeeCatId)
					->where('SessionId',$fiscal_id)
					->get();

			for($i=0;$i<count($month_arr);$i++)
			{
				$monthnofee=(int)date("m",strtotime($month_arr[$i]));
				$yearnofee=date("Y",strtotime($month_arr[$i]));
				$feemonth=date("M",strtotime($month_arr[$i]));
				$amt=0;
				$color='NA';

			if($feeSingle[0]->fee_count >0)
			{
				$rec=FeeAmtSingle::leftJoin('fee_slot_master as fs','feeamtsingle.FeeCatId','=','fs.FeeCatId')
					->select('feeamtsingle.FeeAmount')
					->where('fs.SchoolCode',$fc->SchoolCode)
					->where('fs.SessionId',$fc->SessionId)
					->where('fs.FeeCatId',$fc->FeeCatId)
					->where('feeamtsingle.AdmissionNo',$admission_no)
					->whereRaw("FIND_IN_SET('$month_arr[$i]',fs.FeeDueMonths)")
					->get();

				if(count($rec)>0)
				{
					if($rec[0]->FeeAmount>0)
					{
						$amt = $rec[0]->FeeAmount;
					}
				}
			}
			else
			{

				$rec=FeeAmtMaster::leftJoin('feeamtdesc as fa','feeamtmaster.FeeAmtId','=','fa.FeeAmtId')
					->leftJoin('fee_slot_master as fs','fa.FeeCatId','=','fs.FeeCatId')
					->select('fa.FeeAmount')
					->where('fs.SchoolCode',$fc->SchoolCode)
					->where('fs.SessionId',$fc->SessionId)
					->where('fs.FeeCatId',$fc->FeeCatId)
					->where('feeamtmaster.ClassId',$fc->ClassId)
					->whereRaw("FIND_IN_SET('$month_arr[$i]',fs.FeeDueMonths)")
					->get();

				if(count($rec)>0)
				{
					if($rec[0]->FeeAmount>0)
					{
						$amt = $rec[0]->FeeAmount;
					}
				}
				if($fee_type=='tution')
				{

					if($parent_type=='old' && $sibling_admno !='')
					{

						$concession=FeeConcession::where('ConcessionName','sibling')
									->where('SchoolCode',$fc->SchoolCode)
									->where('SessionId',$fc->SessionId)
									->get();

						$sibling=StudentMaster::select(DB::raw('count(*) as sibling_count'))
								 ->where('admission_no',$sibling_admno)
								 ->get();

						if($sibling[0]->sibling_count==0)
						{
							$amt=$amt-0;
						}
						else if($sibling_no==1)
						{
							if($concession[0]->ConcessionType=='fixed')
							{
								$amt=$amt-$concession[0]->ConcessionAMount;
							}
							else if($concession[0]->ConcessionType=='percentage')
							{
								$percent=($concession[0]->ConcessionAMount/100)*$amt;
								$amt=$amt-$percent;
							}
							else
							{
								$amt=$amt-0;
							}
						}
						else if($sibling_no==2)
						{
							if($concession[0]->ConcessionType2=='fixed')
							{
								$amt=$amt-$concession[0]->ConcessionAMount2;
							}
							else if($concession[0]->ConcessionType2=='percentage')
							{
								$percent=($concession[0]->ConcessionAMount2/100)*$amt;
								$amt=$amt-$percent;
							}
							else
							{
								$amt=$amt-0;
							}
						}
						else
						{
							$amt=$amt-0;
						}
					}

					if($staff_child=='yes')
					{

						$concession=FeeConcession::where('ConcessionName','staff')
									->where('SchoolCode',$fc->SchoolCode)
									->where('SessionId',$fc->SessionId)
									->get();

						if($child_no==1)
						{
							if($concession[0]->ConcessionType=='fixed')
							{
								$amt=$amt-$concession[0]->ConcessionAMount;
							}
							else if($concession[0]->ConcessionType=='percentage')
							{
								$percent=($concession[0]->ConcessionAMount/100)*$amt;
								$amt=$amt-$percent;
							}
							else
							{
								$amt=$amt-0;
							}
						}
						else if($child_no==2)
						{
							if($concession[0]->ConcessionType2=='fixed')
							{
								$amt=$amt-$concession[0]->ConcessionAMount2;
							}
							else if($concession[0]->ConcessionType2=='percentage')
							{
								$percent=($concession[0]->ConcessionAMount2/100)*$amt;
								$amt=$amt-$percent;
							}
							else
							{
								$amt=$amt-0;
							}
						}
						else
						{
							$amt=$amt-0;
						}

				}
					if($management_conn=='yes')
					{
						$concession=FeeConcession::where('ConcessionName','management')
						->where('SchoolCode',$fc->SchoolCode)
						->where('SessionId',$fc->SessionId)
						->get();

						if($concession[0]->ConcessionType=='fixed')
						{
							$amt=$amt-$concession[0]->ConcessionAMount;
						}
						else
						{
							$percent=($concession[0]->ConcessionAMount/100)*$amt;
							$amt=$amt-$percent;
						}

					}

				}


			}
				if($applicable_type=='new')
				{
					if($applicable=='old')
					{
						$amt=0;
						$color='NA';
					}
				}
				else if($applicable_type=='old')
				{
					if($applicable=='new')
					{
						$amt=0;
						$color='NA';
					}
				}
				else
				{
					$amt=$amt-0;
				}

			if($fee_type=='transport')
			{

				if($CheckTransPort=='yes')
				{
					$slot_info=FeeSlot::select(DB::raw('count(*) as slot_count'))
								->where('FeeCatId',$fc->FeeCatId)
								->where('SchoolCode',$fc->SchoolCode)
								->where('SessionId',$fc->SessionId)
								->whereRaw("FIND_IN_SET('$month_arr[$i]',FeeDueMonths)")
								->get();

					if($slot_info[0]->slot_count>0)
					{
						$fare=StationMaster::where('stationId',$station_id)->get();
						if($transport_conn=='yes')
						{
							if(count($fare)>0)
							{
								$amt = $fare[0]->busFare-$transport_connamnt;
							}
							else
							{
								$amt = 0;
							}
						}
						else
						{
							$amt = 0;
						}

					}
					else
					{
						$amt = 0;
						$color='NA';
					}

				}
				else
				{
					$amt = 0;
					$color='NA';
				}


			}
			if($fee_type=='fine')
			{

				$fine=FineSetting::where('SchoolCode',$fc->SchoolCode)
					->where('SessionId',$fc->SessionId)
					->get();

				if($fine[0]->DueDate=='')
				{
					$amt = 0;
					$color='NA';
				}
				else
				{

					$dt=strtotime("01$month_arr[$i]");
					$now = time();
					$datediff = $now - $dt;
					$diff = round($datediff/(60*60*24));

					if($diff>$fine[0]->DueDate)
					{
						$fine_days_no=$diff-$fine[0]->DueDate;

						if($fine[0]->FineType=='fixed')
						{
							$amt=$fine[0]->FineAmount;
						}
						else if($fine[0]->FineType=='day basis')
						{
							$amt=$fine_days_no*$fine[0]->FineAmount;
						}
						else
						{
							$amt = 0;
						}

					}
					else
					{
						$amt = 0;
					}

				}

			}

			$PaidAmt=FeeTransMaster::leftJoin('feetransdesc as fd','feetransmaster.FeeTransId','=','fd.FeeTransId')
					->select('fd.FeeAmt')
					->where('fd.FeeCatId',$fc->FeeCatId)
					->where('feetransmaster.AdmissionNo',$admission_no)
					->where('feetransmaster.SchoolCode',$fc->SchoolCode)
					->where('feetransmaster.SessionId',$fc->SessionId)
					->where('feetransmaster.FeeMonth',$month_arr[$i])
					->where('feetransmaster.FeeYear',$yearnofee)
					->orderBy('fd.id','desc')
					->limit(1)
					->get();

			if(count($PaidAmt)>0)
			{
				if($PaidAmt[0]->FeeAmt >0)
				{
					$paid_amount = $PaidAmt[0]->FeeAmt;
				}
				else
				{
					$paid_amount = 0.0;
				}
			}
			else
			{
				$paid_amount = 0.0;
			}
			if($amt<0 || is_null($amt))
			{
				$amt = 0;
				$color='NA';
			}

			$lastCurrentfee=FeeTransMaster::leftJoin('feetransdesc as fd','feetransmaster.FeeTransId','=','fd.FeeTransId')
						->select(DB::raw('fd.CurrentMonthFee'))
						->where('fd.FeeCatId',$fc->FeeCatId)
						->where('feetransmaster.AdmissionNo',$admission_no)
						->where('feetransmaster.SchoolCode',$fc->SchoolCode)
						->where('feetransmaster.SessionId',$fc->SessionId)
						->where('feetransmaster.FeeMonth',$month_arr[$i])
						->where('feetransmaster.FeeYear',$yearnofee)
						->orderBy('fd.id','desc')
						->limit(1)
						->get();

			if(count($lastCurrentfee)>0)
			{

				if($lastCurrentfee[0]->CurrentMonthFee>0)
				{
					$CurrentMonthFee=$lastCurrentfee[0]->CurrentMonthFee;
					$paidCheck=1;
					$amt=$lastCurrentfee[0]->CurrentMonthFee-$paid_amount;
				}
				else
				{
					$CurrentMonthFee=$amt;
					$paidCheck=0;
					$amt=$amt-$paid_amount;
				}
			}
			else
			{
				$CurrentMonthFee=$amt;
				$paidCheck=0;
				$amt=$amt-$paid_amount;
			}

			if($amt<0)
			{
				$amt = 0;
			}
			else
			{
				$BalAmt=FeeTransMaster::leftJoin('feepending as fp','feetransmaster.FeeTransId','=','fp.FeeTransId')
				->select(DB::raw('SUM(fp.PendingAmt) as pending_amount'))
				->where('fp.FeeCatId',$fc->FeeCatId)
				->where('feetransmaster.AdmissionNo',$admission_no)
				->where('feetransmaster.SchoolCode',$fc->SchoolCode)
				->where('feetransmaster.SessionId',$fc->SessionId)
				->where('feetransmaster.FeeMonth',$month_arr[$i])
				->where('feetransmaster.FeeYear',$yearnofee)
				->get();

				if($BalAmt[0]->pending_amount>0)
				{
					// $amt = $BalAmt[0]->pending_amount;
				}

			}

			if($amt>0 && $paid_amount>0)
			{
				$color='HALF';
			}
			else if($amt>0 && $paid_amount==0)
			{
				$color='NIL';
			}
			else if($amt==0 && $paid_amount>0)
			{
				$color='FULL';
			}
			else if($amt==0 && $paid_amount==0)
			{
				$color='NA';
			}
			else
			{
				$color='NA';
			}

			$fee_arr[$fc->FeeCatId][$month_arr[$i]]=$amt;
			$color_arr[$fc->FeeCatId][$month_arr[$i]]=$color;

			}
				}

			}

			$data=array('fee_arr'=>$fee_arr,'color_arr'=>$color_arr);
            return response()->json(["status"=>"successed","success"=>true,"data"=>$data]);

        }
        else {
            return response()->json(["status"=>"failed","success"=>false,"message"=>"Whoops! no result found"]);
        }
   }
   public function getPreviousFee($admsn_no)
   {
        $result=FeeTransMaster::select(DB::raw('count(*) as transaction_count'))
             ->where('feetransmaster.AdmissionNo',$admsn_no)
             ->get();

		if($result[0]->transaction_count >0)
		{
			$receipts=FeeTransMaster::leftJoin('feetransdesc as fd','feetransmaster.FeeTransId','=','fd.FeeTransId')->leftJoin("feepending as fp",function($join){
							$join->on("feetransmaster.FeeTransId","=","fp.FeeTransId");
							$join->on("fd.FeeCatId","=","fp.FeeCatId");
						})
						->select(DB::raw("feetransmaster.FeeTransId,feetransmaster.ReceiptNo,feetransmaster.FeeDate,feetransmaster.FeeMonth,SUM(fd.FeeAmt) as fee_sum,sum(IFNULL(fp.PendingAmt,0)) as fee_balance,fd.FeeMonth"))
						->where('feetransmaster.AdmissionNo',$admsn_no)
						->groupBy('fd.FeeTransId')
						->orderBy('feetransmaster.FeeTransId','asc')
						->get();

			$data=array('receipts'=>$receipts);
            return response()->json(["status"=>"successed","success"=>true,"data"=>$data]);
        }
        else {
            return response()->json(["status"=>"failed","success"=>false,"message"=>"Whoops! no result found","data"=>[]]);
        }

   }

   public function delete($set)
   {
	   $arr=explode(',',$set);
	   $receipts=FeeTransMaster::whereIn('FeeTransId',$arr)->get();

		if(count($receipts)>0)
		{
			foreach($receipts AS $receipt)
			{
				$fee_data[]=array(
					'sno'=>$receipt->ReceiptNo,
					'FeeTransId'=>$receipt->FeeTransId,
					'Admission_No'=>$receipt->AdmissionNo,
					'FeeMonth'=>$receipt->FeeMonth,
					'FeeYear'=>$receipt->FeeYear,
					'FeeDate'=>$receipt->FeeDate,
					'FeeAmount'=>$receipt->FeeAmount,
					'BalAmt'=>$receipt->BalanceAmount,
				);

				$temp_data[]=array(
					'sno'=>$receipt->ReceiptNo,
					'FeeTransId'=>$receipt->FeeTransId,
					'Admission_No'=>$receipt->AdmissionNo,
				);
			}

			$q="DELETE feetransmaster.*,feetransdesc.*,feepending.* FROM feetransmaster LEFT JOIN feetransdesc ON feetransmaster.FeeTransId=feetransdesc.FeeTransId LEFT JOIN feepending ON feetransmaster.FeeTransId=feepending.FeeTransId WHERE feetransmaster.FeeTransId IN ($set)";

			$del=DB::delete($q);

			if($del)
			{
				$trans=FeeTransDelete::insert($fee_data);
				$temp=FeeTemp::insert($temp_data);

				if($trans && $temp)
				{
					return response()->json(["status" =>'successed', "success" => true,"errors"=>[], "message" => "Fee record deleted successfully, temporary receipt generated.","data" =>[]]);
				}
				else
				{
					return response()->json(["status" =>'successed', "success" => true,"errors"=>[], "message" => "Fee record deleted successfully","data" =>[]]);
				}

			}
			else
			{
				return response()->json(["status" => "failed","success" => false,"errors"=>[],"message" => "Whoops! failed to delete,!!","errors" =>'']);
			}

		}
		else
		{
			return response()->json(["status" => "failed","success" => false,"message" => "Whoops! no record found !!","errors" =>'']);
		}

    }

	// public function generateReceipt($sequence)
	// {
	// 	$check1=FeeTransMaster::select(DB::raw('count(*) as check_count'))
    //          ->where('ReceiptNo',$sequence)
    //          ->get();


	// 	$check2=FeeTemp::select(DB::raw('count(*) as check_exist'))
    //          ->where('sno',$sequence)
	// 		 ->where('status','!=',1)
    //          ->get();

	// 	if($check1[0]->check_count >0 || $check2[0]->check_exist >0)
	// 	{
	// 		$fee_receipt=FeeTransMaster::select(DB::raw('IFNULL(MAX(FeeTransId),0)+1 as next_id'))->get();
	// 		$num = $fee_receipt[0]->next_id+1;
	// 		$len=strlen($num);
	// 		$place=$len+4;
	// 		$num_padded = sprintf("%0{$place}d",$num);
	// 		$receipt='S'.$num_padded;

	// 		$result1=FeeTransMaster::select(DB::raw('count(*) as chk_count'))
    //          ->where('ReceiptNo',$receipt)
    //          ->get();

	// 		 $result2=FeeTemp::select(DB::raw('count(*) as chk_ext'))
    //          ->where('sno',$receipt)
	// 		 ->where('status','!=',1)
    //          ->get();

	// 		if($result1[0]->chk_count >0 || $result2[0]->chk_ext >0)
	// 		{
	// 			$this->generateReceipt($receipt);
	// 		}
	// 		else
	// 		{
	// 			return $receipt;
	// 		}
	// 	}
	// 	else
	// 	{
	// 		return $sequence;
	// 	}

	// }


    public function generateReceipt($sequence)
    {
        $existsInFeeTransMaster = FeeTransMaster::where('ReceiptNo', $sequence)->exists();
        $existsInFeeTemp = FeeTemp::where('sno', $sequence)->where('status', '!=', 1)->exists();

        if ($existsInFeeTransMaster || $existsInFeeTemp) {
            $nextId = FeeTransMaster::max('FeeTransId') + 1;
            $numPadded = sprintf("S%09d", $nextId);

            // Loop to ensure the newly generated receipt number is unique
            while (FeeTransMaster::where('ReceiptNo', $numPadded)->exists() ||
                FeeTemp::where('sno', $numPadded)->where('status', '!=', 1)->exists()) {
                $nextId++;
                $numPadded = sprintf("S%09d", $nextId);
            }

            return $numPadded;
        } else {
            return $sequence;
        }
    }


	public function printReceipt($id,$mode)
    {
		$tansaction=FeeTransMaster::where('FeeTransId',$id)->get();

		if(count($tansaction)>0)
		{
			$school=School::where('school_code','S110')->get();
			$student_receipt=StudentMaster::leftJoin('class_master as cm','student_master.class_id','=','cm.classId')
				->leftJoin('feetransmaster as ft','student_master.admission_no','=','ft.AdmissionNo')
				->leftJoin('feetransdesc as fd','ft.FeeTransId','=','fd.FeeTransId')
				->leftJoin("feepending as fp",function($join){
					$join->on("ft.FeeTransId","=","fp.FeeTransId");
					$join->on("fd.FeeCatId","=","fp.FeeCatId");
				})
				->leftJoin('fee_category_master as fc','fd.FeeCatId','=','fc.fee_id')
				->select(DB::raw("student_master.student_name,student_master.father_name,student_master.admission_no,cm.className,GROUP_CONCAT(ft.ReceiptNo SEPARATOR ',') as feereceipts,GROUP_CONCAT(DISTINCT ft.FeeDate SEPARATOR ',') as feedates,GROUP_CONCAT(fd.FeeMonth SEPARATOR ',') as feemonths,fc.name as cat_name,sum(fd.CurrentMonthFee) as cat_fee,sum(fd.FeeAmt) as paid_fee,sum(IFNULL(fp.PendingAmt,0)) as pending_fee"))
				->where('ft.FeeTransId',$id)
				->groupBy('fc.fee_id')
				->orderBy('ft.FeeTransId','asc')
				->get();

			$data = array('school'=>$school,'receipt'=>$student_receipt);

			$receipt_name=time().rand(1,99).'.'.'pdf';
			if($mode=='normal')
			{
				$customPaper = array(0,0,340,400);
			}
			else if($mode=='thermal')
			{
				$customPaper = array(0,0,216,300);
			}
			else
			{
				$customPaper = array(0,0,0,0);
			}

			/* $pdf = PDF::loadView("{$mode}_receipt",$data)->setPaper("A4","portrait")->save(public_path("receipts/$mode/$receipt_name"));	   */

		    $pdf = PDF::loadView("{$mode}_receipt",$data)->setPaper($customPaper)->save(public_path("receipts/$mode/$receipt_name"));

			$message="$mode Receipt generated successfully, get the receipt.";

			$response_arr=array("status"=>'successed',"success"=>true,"message"=>$message,"errors"=>[],"data" =>$receipt_name);
		}
		else
		{
			return response()->json(["status" => "failed","success" => false,"message" => "Whoops! no record found !!","errors" =>'',"data" =>[]]);
		}

		return response()->json($response_arr);

    }

   public function getFeeTransaction($set)
   {
		$arr = explode(',',$set);
        $result=FeeTransMaster::select(DB::raw('count(*) as transaction_count'))
				->whereIn('FeeTransId',$arr)
				->get();

		if($result[0]->transaction_count >0)
		{
			$transactions=FeeTransMaster::leftJoin('feetransdesc as fd','feetransmaster.FeeTransId','=','fd.FeeTransId')->leftJoin("feepending as fp",function($join){
						$join->on("feetransmaster.FeeTransId","=","fp.FeeTransId");
						$join->on("fd.FeeCatId","=","fp.FeeCatId");
					})
					->leftJoin('fee_category_master as fc','fd.FeeCatId','=','fc.fee_id')
					->select(DB::raw("feetransmaster.FeeTransId,feetransmaster.ReceiptNo,feetransmaster.FeeDate,feetransmaster.FeeMonth,fd.FeeMonth,fc.name as cat_name,sum(fd.CurrentMonthFee) as cat_fee,sum(fd.FeeAmt) as paid_fee,sum(IFNULL(fp.PendingAmt,0)) as pending_fee"))
					->whereIn('feetransmaster.FeeTransId',$arr)
					->groupBy('fd.FeeMonth')
					->groupBy('fc.fee_id')
					->orderBy('feetransmaster.FeeTransId','asc')
					->get();

			$data=array('transactions'=>$transactions);

            return response()->json(["status"=>"successed","success"=>true,"data"=>$data]);
        }
        else {
            return response()->json(["status"=>"failed","success"=>false,"message"=>"Whoops! no result found","data"=>[]]);
        }

   }

   public function getInvoice($set)
   {
	   $arr=explode(',',$set);
	   $school=School::where('school_code','S110')->get();

	   $student_receipt=StudentMaster::leftJoin('class_master as cm','student_master.class_id','=','cm.classId')
			->leftJoin('feetransmaster as ft','student_master.admission_no','=','ft.AdmissionNo')
			->leftJoin('feetransdesc as fd','ft.FeeTransId','=','fd.FeeTransId')
			->leftJoin("feepending as fp",function($join){
				$join->on("ft.FeeTransId","=","fp.FeeTransId");
				$join->on("fd.FeeCatId","=","fp.FeeCatId");
			})
			->leftJoin('fee_category_master as fc','fd.FeeCatId','=','fc.fee_id')
			->select(DB::raw("student_master.student_name,student_master.father_name,student_master.mother_name,student_master.admission_no,cm.className,ft.ReceiptNo,ft.FeeDate,fd.FeeMonth,fc.name as cat_name,sum(fd.CurrentMonthFee) as cat_fee,sum(fd.FeeAmt) as paid_fee,sum(IFNULL(fp.PendingAmt,0)) as pending_fee"))
			->whereIn('fd.FeeTransId',array_unique($arr))
			->groupBy('fc.fee_id')
			->orderBy('ft.FeeTransId','asc')
			->get();

	   $invoice = array('school'=>$school,'receipt'=>$student_receipt);
	   $table_view = view('receipt_history',$invoice)->render();
       return response()->json(["status"=>"successed","success"=>true,"data"=>$table_view]);
   }
}
