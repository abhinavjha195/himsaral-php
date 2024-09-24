<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

use App\Models\FeeCategoryMaster;
use App\Models\FeeSlot;
use DB;

class FeeSlotController extends Controller
{
	public function __construct()
    {
        DB::statement("SET SQL_MODE=''");
    }

    public function index()
	{
		$categories=FeeCategoryMaster::orderBy('fee_id','ASC')->get();
        $fiscal=$this->calculateFiscalYear(date('m'));
		$fiscal_arr=explode(':',$fiscal);
		$months = CarbonPeriod::create($fiscal_arr[0],'1 month',$fiscal_arr[1]);
		$slot_arr = array();

		foreach ($months as $month)
		{
			$place=$month->format("MY");
			$month_arr['01-'.$month->format("m-Y")]=$month->format("M Y");
			$records=FeeSlot::whereRaw("FIND_IN_SET('$place',FeeDueMonths)")->get();
			foreach($records AS $record)
			{
				array_push($slot_arr,$record->FeeSlotId);
			}
		}

		$slots=FeeSlot::whereIn('FeeSlotId',array_unique($slot_arr))->orderBy('FeeSlotId','ASC')->get();
		$feedata=array('categories'=>$categories,'months'=>$month_arr,'slots'=>$slots);

        if(!empty($categories)) {
			return response()->json(["status" => 'successed',"data" => $feedata]);
		}
		else {
			return response()->json(["status" => "failed","message" => "Whoops! no record found","data" =>[]]);
		}

    }

	public function create(Request $request)
	{
		$inputs=$request->all();
		$months=$request->months;
		$types_arr=$request->types;

		if(count($months)==0)
		{
			return response()->json(["status" => "failed", "message" => "Please select atleast one checkbox!!","errors" =>'']);
		}
		else
		{
			foreach($months AS $key=>$value)
			{
				$slot_arr=explode('_',$key);
				$slot_id=$slot_arr[1];
				$type_id='feetype_'.$slot_id;
				$descp=(array_key_exists($type_id,$types_arr))?$types_arr[$type_id]:'';
				$record=FeeSlot::select(DB::raw('count(*) as record_count'))
					 ->where('FeeCatId',$slot_id)
					 ->get();
				$month_string=$year_string="";
				if($record[0]->record_count>0)
				{
					$timearr=explode(',',$value);
					for ($i=0;$i<count($timearr);$i++)
					{
						if($i==count($timearr)-1)
						{
							$month_string .=date("MY",strtotime($timearr[$i]));
							$year_string .=date("Y",strtotime($timearr[$i]));
						}
						else
						{
							$month_string .=date("MY",strtotime($timearr[$i])).',';
							$year_string .=date("Y",strtotime($timearr[$i])).',';
						}
					}
					$data_arr = array(
						'FeeDueMonths'=>$month_string,
						'FeeYear'=>$year_string,
						'FeeSlotDesc'=>$descp
					);

				   $slot = FeeSlot::where('FeeCatId',$slot_id)->update($data_arr);
				}
				else
				{
					$timearr=explode(',',$value);
					for ($i=0;$i<count($timearr);$i++)
					{
						if($i==count($timearr)-1)
						{
							$month_string .=date("MY",strtotime($timearr[$i]));
							$year_string .=date("Y",strtotime($timearr[$i]));
						}
						else
						{
							$month_string .=date("MY",strtotime($timearr[$i])).',';
							$year_string .=date("Y",strtotime($timearr[$i])).',';
						}
					}

					$data_arr = array(
						'FeeCatId'=>$slot_id,
						'FeeDueMonths'=>$month_string,
						'FeeYear'=>$year_string,
						'FeeSlotDesc'=>$descp
					);

					$slot = FeeSlot::create($data_arr);
				}
			}
			return response()->json(["status" =>'successed', "success" => true, "message" => "Fee Slot created successfully","data" =>$slot]);
		}


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

}
