<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>School Income</title>		

		<style>
			.invoice-box {
				width: 100%;    
				margin: 0px 0px 0px 0px;    		
				padding: 2px;  								 
				font-size: 14px;		
				line-height: 20px;		
				font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
				color: #555;
			} 
			
			.invoice-box table {
				width: 100%;  
				line-height: inherit;
				text-align: left;
			}

			.invoice-box table td {
				padding: 2px;  
				vertical-align: top;
			}

			.invoice-box table tr td:nth-child(2) {
				text-align: right;
			}

			.invoice-box table tr.top table td {
				padding-bottom: 2px;	
			}

			.invoice-box table tr.top table td.title {
				font-size: 45px;  				
				color: #333;
			}	

			.invoice-box table tr.heading td {
				background: #eee;
				border-bottom: 1px solid #ddd;
				font-weight: bold;
			}

			.invoice-box table tr.details td {
				padding-bottom: 2px;		
			}

			.invoice-box table tr.item td {
				border-bottom: 1px solid #eee;		
			}

			.invoice-box table tr.item.last td {
				border-bottom: none;
			}

			.invoice-box table tr.total td:nth-child(2) {
				border-top: 2px solid #eee;
				font-weight: bold;
			}  		
			
			table.rcetbl {
			  border: 1px solid black;
			  text-align:center;  	
			} 

			table.invtbl, table.invtbl td {
				border: 1px solid black;  
				border-collapse: collapse;
				width: 100%;  
				padding: 5px; 
			}

			@media only screen and (max-width: 600px) {
				.invoice-box table tr.top table td {
					width: 100%;
					display: block;
					text-align: center;
				}   
				
			}

			/** RTL **/
			.invoice-box.rtl {
				direction: rtl;
				font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
			}

			.invoice-box.rtl table {
				text-align: right;
			}

			.invoice-box.rtl table tr td:nth-child(2) {
				text-align: left;
			}
			
			tr.separated td {  				
				border-bottom: 1px solid black;		
			} 			
			
			@page { margin: 15px 25px 15px 25px; }     
		</style>
	</head>  			
	<body>
		<div class="invoice-box">
			<table cellpadding="0" cellspacing="0">
				<tr>		
					<td colspan="2">
						<table cellpadding="0" cellspacing="0"> 		
							<tr>
								<td style="width:17%;">    
									<img src="{{ public_path('uploads/school_image/'.$income[0]->school_logo)}}" style="width:75%; max-width:250px;" />	
								</td>

								<td style="text-align:center;">      
									{{$income[0]->school_name}} {{($income[0]->about=='')?'':'('.$income[0]->about.')'}}<br />   
									{{$income[0]->school_address}}<br />											
									{{$income[0]->school_email}}     
								</td>  
								
								<td style="width:14%;">    
									&nbsp;&nbsp;  
								</td>
								
							</tr>  							
							<tr>		
								<td colspan="3">		
									<table cellpadding="0" cellspacing="0" class="rcetbl"> 
										<tr>
											<td> 
												Reciept Voucher  	
											</td>  
										</tr>
									</table>	
								</td>
							</tr>  							
						</table>
					</td>
				</tr>
				<tr>		  
					<td colspan="2">		  
						<table cellpadding="2" cellspacing="2">   
							<tr>
								<td>
									Voucher No: {{$income[0]->voucher_no}}   
								</td> 
								<td>  
									Date: {{date('d-m-Y',strtotime($income[0]->voucher_date))}}  
								</td>
							</tr>
						</table>  
					</td>
				</tr>	
				<tr>
					<td colspan="2">
						<table class="invtbl" cellpadding="0" cellspacing="0"> 			
							<tr>
								<td>ACCOUNT HEAD</td>
								<td>{{$income[0]->title}}</td>		
							</tr>
							<tr>
								<td>PAYMENT MADE TO</td>
								<td>{{$income[0]->receive_from}}</td>	  
							</tr>
							<tr>
								<td>INVOICE NO</td>   
								<td>{{$income[0]->invoice_no}}</td>		
							</tr>
							<tr>
								<td>INVOICE AMOUNT</td>
								<td>{{number_format((float)$income[0]->invoice_amount,2,'.','')}}</td>  
							</tr>
							<tr>
								<td>PARTICULARS OF ITEMS/SERVICES</td>
								<td>{{$income[0]->transection_purpose}}</td>
							</tr>
							<tr>
								<td>AMOUNT PASSED FOR PAYMENT</td>   
								<td>{{number_format((float)$income[0]->total_amount,2,'.','')}}</td>	  	
							</tr>
							<tr>
								<td>MODE OF PAYMENT</td>   
								<td>{{$income[0]->pay_mode}}</td>	  	
							</tr>
							<tr>
								<td>DETAILS OF PAYMENT</td>
								<td>cheque/online Payment No:{{$income[0]->cheque_no}}<br/> Bank:{{$income[0]->party_name}}</td>  
							</tr>
							<tr>
								<td>Cheque/Invoice Date</td>     
								<td>{{date('d-m-Y',strtotime($income[0]->invoice_date))}}</td>	  	
							</tr>
						</table>			
					</td>
				</tr>
				<tr>		
					<td colspan="2">
						<table cellpadding="2" cellspacing="2" style="margin-top:75px;">   
							<tr>
								<td style="text-align:left;"> 		
									PREPARED BY:
								</td>
								<td style="text-align:center;">  									
									APPROVED BY:     
								</td>	
								<td style="text-align:right;">  											
									RECEIVED BY:       
								</td>
							</tr>
						</table>
					</td>
				</tr>	
			</table>
			
		</div>
	</body>
</html>