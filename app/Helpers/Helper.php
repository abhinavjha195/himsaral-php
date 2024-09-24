<?php  
namespace App\Helpers;  

class Helper{
    public static function getString($str) 
    {
        return strtoupper($str);   	   			
    }
	
	public static function amountInWords($number)     
	{ 
		$decimal = round($number - ($no = floor($number)), 2) * 100;
			$hundred = null;
			$digits_length = strlen($no);
			$i = 0;
			$str = array();
			$words = array(0 => '', 1 => 'one', 2 => 'two',
				3 => 'three', 4 => 'four', 5 => 'five', 6 => 'six',
				7 => 'seven', 8 => 'eight', 9 => 'nine',
				10 => 'ten', 11 => 'eleven', 12 => 'twelve',
				13 => 'thirteen', 14 => 'fourteen', 15 => 'fifteen',
				16 => 'sixteen', 17 => 'seventeen', 18 => 'eighteen',
				19 => 'nineteen', 20 => 'twenty', 30 => 'thirty',
				40 => 'forty', 50 => 'fifty', 60 => 'sixty',
				70 => 'seventy', 80 => 'eighty', 90 => 'ninety');
			$digits = array('', 'hundred','thousand','lakh', 'crore');
			while( $i < $digits_length ) {
				$divider = ($i == 2) ? 10 : 100;   
				$number = floor($no % $divider);
				$no = floor($no / $divider);
				$i += $divider == 10 ? 1 : 2;
				if ($number) {
					$plural = (($counter = count($str)) && $number > 9) ? 's' : null;
					$hundred = ($counter == 1 && $str[0]) ? ' and ' : null;
					$str [] = ($number < 21) ? $words[$number].' '. $digits[$counter]. $plural.' '.$hundred:$words[floor($number / 10) * 10].' '.$words[$number % 10]. ' '.$digits[$counter].$plural.' '.$hundred;
				} else $str[] = null;
			}
			$Rupees = implode('', array_reverse($str));
			$paise = ($decimal > 0) ? "." . ($words[$decimal / 10] . " " . $words[$decimal % 10]) . ' Paise' : '';
			return ($Rupees ? $Rupees . 'Rupees ' : '') . $paise;
	} 
	
	public static function setDimension($dim)	  
    {
		if($dim>400)
		{
			$new_dim =400;
		}
		else
		{
			$new_dim = $dim;
		}
		
        return $new_dim;		
    }
	
	public static function getFiscalYear($month)			
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
	
	
	public static function numberTowords($num)
	{  
		$ones = array(
		0 =>"ZERO", 
		1 => "ONE", 
		2 => "TWO", 
		3 => "THREE", 
		4 => "FOUR", 
		5 => "FIVE", 
		6 => "SIX", 
		7 => "SEVEN", 
		8 => "EIGHT", 
		9 => "NINE",
		10 => "TEN", 
		11 => "ELEVEN", 
		12 => "TWELVE", 
		13 => "THIRTEEN", 
		14 => "FOURTEEN", 
		15 => "FIFTEEN", 
		16 => "SIXTEEN", 
		17 => "SEVENTEEN", 
		18 => "EIGHTEEN", 
		19 => "NINETEEN",
		"014" => "FOURTEEN" 
		); 
		$tens = array( 
		0 => "ZERO",
		1 => "TEN",
		2 => "TWENTY", 
		3 => "THIRTY", 
		4 => "FORTY", 
		5 => "FIFTY", 
		6 => "SIXTY", 
		7 => "SEVENTY", 
		8 => "EIGHTY", 
		9 => "NINETY" 
		); 
		$hundreds = array( 
		"HUNDRED", 
		"THOUSAND",
		"MILLION", 
		"BILLION", 
		"TRILLION",
		"QUARDRILLION" 
		); /* limit t quadrillion */
		$num = number_format($num,2,".",",");
		$num_arr = explode(".",$num); 
		$wholenum = $num_arr[0]; 
		$decnum = $num_arr[1]; 
		$whole_arr = array_reverse(explode(",",$wholenum)); 
		krsort($whole_arr,1); 
		$rettxt = ""; 
		foreach($whole_arr as $key => $i){
			
		while(substr($i,0,1)=="0")
				$i=substr($i,1,5);
		if($i < 20){ 
		/* echo "getting:".$i; */
		$rettxt .= array_key_exists($i,$ones)?$ones[$i]:''; 		
		}elseif($i < 100){ 
		if(substr($i,0,1)!="0")  $rettxt .= $tens[substr($i,0,1)]; 
		if(substr($i,1,1)!="0") $rettxt .= " ".$ones[substr($i,1,1)]; 
		}else{ 
		if(substr($i,0,1)!="0") $rettxt .= $ones[substr($i,0,1)]." ".$hundreds[0]; 
		if(substr($i,1,1)!="0")$rettxt .= " ".$tens[substr($i,1,1)]; 
		if(substr($i,2,1)!="0")$rettxt .= " ".$ones[substr($i,2,1)]; 
		} 
		if($key > 0){ 
		$rettxt .= " ".$hundreds[$key]." "; 
		} 
		} 
		if($decnum > 0){ 
		$rettxt .= " and "; 
		if($decnum < 20){ 
		$rettxt .= $ones[$decnum]; 
		}elseif($decnum < 100){ 
		$rettxt .= $tens[substr($decnum,0,1)]; 
		$rettxt .= " ".$ones[substr($decnum,1,1)]; 
		} 
		} 
		return $rettxt; 
	} 
	
}