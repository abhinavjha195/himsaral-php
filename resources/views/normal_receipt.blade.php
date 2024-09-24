<!DOCTYPE html>
<html>
<head>
	<title>Receipt example</title>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	  
<style type="text/css">

body{
    font-size:12px;    
	line-height:15px;	
	font-family:'Times New Roman','Arial';		
	color:#555;		
}
td,
th,
tr,
table {      
    border-collapse: collapse;		
}
table {   
  width: 100%;  
}

th {
  height: 70px;
}

tr {  
  height: 50px; 	 
}
.ticket {
    width: 155px;
    max-width: 155px;
} 
#feeTable {
  width: 100%;
  border: 1px solid black;  	
}
#feeTable td,
#feeTable th {
  border: 1px solid black;
  height: 10px; 
} 
</style>           
</head>
<body>

@inject('helper','App\Helpers\Helper')   	
@php 
	$receipt_arr = $month_arr = $fee_arr =$paid_arr = $balance_arr =array();	 	
@endphp 
@foreach($receipt as $rc) 
	@php 
		$arr=explode(',',$rc->feereceipts);
		array_push($fee_arr,$rc->cat_fee);	
		array_push($paid_arr,$rc->paid_fee);	
		array_push($balance_arr,$rc->pending_fee);	 
	@endphp  		
	@for ($i=0;$i<count($arr);$i++)  
		@php 
			array_push($receipt_arr,$arr[$i]);  
		@endphp 
	@endfor  	
@endforeach
@foreach($receipt as $rc) 
	@php 
		$arr=explode(',',$rc->feemonths);  
	@endphp  		
	@for ($i=0;$i<count($arr);$i++)  
		@php 
			array_push($month_arr,preg_replace("/[^a-zA-Z]+/","",$arr[$i]));  
		@endphp 
	@endfor  	
@endforeach     
        <table cellpadding="0" cellspacing="0">		
            <table style="border:0;width:100%;margin-top:-15px;">		
			<td align="left"> 									  
				<img src="{{ public_path('uploads/school_image/'.$school[0]->school_logo)}}" alt='Logo' style="width:20%;max-width:50px;">  
			</td>
            <tr><td colspan="2" align="center"><b>{{$school[0]->school_name}}&nbsp;{{($school[0]->about=='')?'':'('.$school[0]->about.')'}}</b></td></tr>	             
            <tr><td colspan="2" align="center">{{$school[0]->school_address}}</td></tr>  
            <tr><td align="right"><b>Phone No:</b>{{$school[0]->school_contact}}</td><td align="left"><b>Affiliation No:</b>{{$school[0]->school_affiliation}}</td></tr>
            <tr><td align="right"><b>Website:</b> {{$school[0]->server_address}} </td><td align="left"><b>Email:</b> {{$school[0]->school_email}}</td></tr>
			<tr><td colspan="2"><hr style="border: 1px solid black;"></td></tr>	
			<tr>		
				<td colspan="2">
					<table>
						<tbody>
							<tr>
								<td align="left">S.No {{implode('/',array_unique($receipt_arr))}}</td>  
								<td align="center">Adminssion No {{$receipt[0]->admission_no}}</td>	
								<td align="right">Date {{date('d-m-Y'),strtotime($school[0]->FeeDate)}}</td>    
							</tr>
							<tr>
								<td align="left">Student Name {{$receipt[0]->student_name}}</td> 						
								<td align="center">Father Name {{$receipt[0]->father_name}}</td>  
								<td></td>  
							</tr>
							<tr>
								<td align="left">Class Name {{$receipt[0]->className}}</td>
								<td align="center">Fee Of Month {{implode(',',array_unique($month_arr))}}</td>
								<td></td>	
							</tr>  		
							
						</tbody>
					</table>   
					
				</td>
			</tr>	
            
            <tr>		
				<td colspan="2">
				
				<table id="feeTable">    
					  <tr>  
						<th style="width: 120px;">Description</th>		
						<th style="width: 120px;" align="center">Fee Paid Amount</th>  
					  </tr>
					  @foreach($receipt as $rc) 
					  <tr>
						<td style="width: 120px;">{{$rc->cat_name}}</td>
						<td style="width: 120px;" align="right">{{$rc->cat_fee}}</td>		
					  </tr>
					  @endforeach  						 
					  <tr>
						<td style="width: 120px;">Total Amount</td>
						<td style="width: 120px;" align="right">{{number_format((float)array_sum($fee_arr),2,'.','')}}</td>		
					  </tr>
					  <tr>
						<td style="width: 120px;">Amount Paid</td>
						<td style="width: 120px;" align="right">{{number_format((float)array_sum($paid_arr),2,'.','')}}</td>		
					  </tr>
					  <tr>	
						<td style="width: 120px;">Balance</td>  
						<td style="width: 120px;" align="right">{{number_format((float)array_sum($balance_arr),2,'.','')}}</td>		
					  </tr>
					  <tr>    
						<td style="width: 120px;">Paid Amount(In Words) </td>  
						<td style="width: 120px;" align="right">{{ ucwords($helper->amountInWords(array_sum($paid_arr))) }} Only</td>		
					  </tr>
				</table> 
					<p><i>Note: 1.Fee Once Paid Not Refundable.<br/> 		
					2.This is Computer Generated Print. Hence No Signature Required.</i></p>   						
				</td>
				
			</tr>
            </table>
        </table>
		<!-- end invoice print -->  

</body>
</html>  