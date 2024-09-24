<!DOCTYPE html>
<html>
<head>
	<title>Receipt example</title>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	  
<style type="text/css">

body{
    font-size:10px;    
	line-height:12px;	
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
  height: 40px;
}

tr {  
  height: 20px; 	  
}
.ticket {
    width: 250px;	
    max-width: 255px;		
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
<div class="ticket">    		
        <table cellpadding="0" cellspacing="0" style="margin-top:-25px;margin-left:-20px;">		
            <table style="border:0;width:100%;">					
            <tr><td colspan="2" align="center"><b>{{$school[0]->school_name}}&nbsp;{{($school[0]->about=='')?'':'('.$school[0]->about.')'}}</b></td></tr>	             
            <tr><td colspan="2" align="center">{{$school[0]->school_address}}</td></tr>  
			<tr><td colspan="2" align="center"><b>Website:</b> {{$school[0]->server_address}}</td></tr> 
			<tr><td colspan="2" align="center"><b>Email:</b> {{$school[0]->school_email}}</td></tr> 	
			<tr><td colspan="2"><hr style="border: 1px solid black;"></td></tr>	
			<tr>		
				<td colspan="2">
					<table>
						<tbody>
							 <tr>
								<td></td>
								<td></td>  
								<td align="right">Receipt No.: {{implode('/',array_unique($receipt_arr))}}</td>  
							</tr>
							<tr>								
								<td align="left">Adminssion No.: {{$receipt[0]->admission_no}}</td>
								<td></td>  	
								<td align="right">Date: {{date('d-m-Y'),strtotime($school[0]->FeeDate)}}</td>    
							</tr>
							<tr>
								<td align="left">Student Name: {{$receipt[0]->student_name}}</td> 	 
								<td></td>  
								<td align="right">Class: {{$receipt[0]->className}}</td>  
							</tr>
							<tr> 								
								<td align="left">Father Name: {{$receipt[0]->father_name}}</td> 
								<td></td>		
								<td align="right">Fee Month(s): {{implode(',',array_unique($month_arr))}}</td>		
							</tr>  		 							
						</tbody>
					</table>   
					
				</td>
			</tr>	
            
            <tr>		
				<td colspan="2">
				
				<table id="feeTable">    
					  <tr>  
						<th style="width: 140px;">Description</th>		
						<th style="width: 100px;" align="center">Amount</th>  
					  </tr>
					  @foreach($receipt as $rc) 
					  <tr>
						<td style="width: 140px;">{{$rc->cat_name}}</td>
						<td style="width: 100px;" align="right">{{$rc->cat_fee}}</td>		
					  </tr>
					  @endforeach  						 
					  <tr>
						<td style="width: 140px;"><b>Total Amount</b></td>
						<td style="width: 100px;" align="right"><b>{{number_format((float)array_sum($fee_arr),2,'.','')}}</b></td>		
					  </tr>
					  <tr>
						<td style="width: 140px;"><b>Paid Amount</b></td>		
						<td style="width: 100px;" align="right"><b>{{number_format((float)array_sum($paid_arr),2,'.','')}}</b></td>		
					  </tr>
					  <tr>
						<td style="width: 140px;"><b>Balance</b></td>  
						<td style="width: 100px;" align="right"><b>{{number_format((float)array_sum($balance_arr),2,'.','')}}</b></td>	  	
					  </tr>
					  <tr>    						  
						<td colspan="2" style="width: 100px;" align="right">{{ ucwords($helper->amountInWords(array_sum($paid_arr))) }} Only</td>			
					  </tr>		
				</table>    					 						
				</td>  				
			</tr>
            </table>
			<tr>	
			<p style="margin-top:52px;">Note: 1.Fee Once Paid Not Refundable.<br/> 		
			2.This is Computer Generated Print. Hence No Signature Required.</p>  
			</tr>		
        </table>
		<!-- end invoice print -->
				
</div>			

</body>
</html>  