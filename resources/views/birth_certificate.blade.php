<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>Birth Certificate</title>		

		<style>
			.invoice-box {
				width: 100%;    
				margin: 0px 0px 0px 0px;    		
				padding: 2px;  								 
				font-size: 14px;		
				line-height: 24px;
				font-family: 'Helvetica', Helvetica, Arial, sans-serif;  
				color: #555;
			}

			.invoice-box table {
				width: 100%;  
				line-height: inherit;
				text-align: left;
			}

			.invoice-box table td {
				padding: 0px;  
				vertical-align: top;
			}

			.invoice-box table tr td:nth-child(2) {
				text-align: right;
			}

			.invoice-box table tr.top table td {
				padding-bottom: 2px;	
			}	

			@media only screen and (max-width: 600px) {
				.invoice-box table tr.top table td {
					width: 100%;
					display: block;
					text-align: center;
				}
				
			}  			
			
			tr.separated td {  				
				border-bottom: 1px solid black;   
			} 
			
			table.slip{   
                border: 1px solid black;
				margin-top:25px;  					
            } 			
			
			@page { margin: 45px 55px 5px 55px; }     
		</style>
	</head> 
@inject('helper','App\Helpers\Helper')   
@php 
$birth_date = date('Y-m-d',strtotime($cc[0]->dob));     
$new_birth_date = explode('-',$birth_date);		
$year = $new_birth_date[0];
$month = $new_birth_date[1];
$day  = $new_birth_date[2];
$birth_day=$helper->numberTowords($day);   
$birth_year=$helper->numberTowords($year);  
$monthNum = $month;  
$dateObj = DateTime::createFromFormat('!m', $monthNum); 
$monthName = strtoupper($dateObj->format('F'));    
$dob=$monthName.' '.$birth_day.' '.$birth_year;		

$issue_date = date('Y-m-d',strtotime($cc[0]->issue_date));     
$new_issue_date = explode('-',$issue_date);		
$year = $new_issue_date[0];
$month = $new_issue_date[1];
$day  = $new_issue_date[2];
$issue_day=$helper->numberTowords($day);   
$issue_year=$helper->numberTowords($year);  
$monthNum = $month;  
$dateObj = DateTime::createFromFormat('!m', $monthNum); 
$monthName = strtoupper($dateObj->format('F'));    
$issued_at=$monthName.' '.$issue_day.' '.$issue_year;	

@endphp    	
	<body>
		<div class="invoice-box">
			<table class="slip" cellpadding="0" cellspacing="0">   
				<tr class="top">
					<td colspan="2">
						<table cellpadding="0" cellspacing="0"> 				
							<tr>
								<td style="width:17%;">    
									<img src="{{ public_path('uploads/school_image/'.$cc[0]->school_logo)}}" style="width:75%; max-width:250px;" />	
								</td>

								<td style="text-align:center;">      
									<span style="font-size:20px;font-weight:bold;">{{$cc[0]->school_name}}&nbsp;{{($cc[0]->about=='')?'':'('.$cc[0]->about.')'}}</span><br/>   
									{{$cc[0]->school_address}}<br/>		
									Contact No.:- {{$cc[0]->school_contact}}<br/>
									<span style="font-size:14px;"><b>Website:-</b>{{$cc[0]->server_address}}</span><br/>       
									<span style="font-size:14px;"><b>E-mail:-</b>{{$cc[0]->school_email}}</span>    			 
								</td>  
								
								<td style="width:14%;">    
									&nbsp;&nbsp;  
								</td>
								
							</tr>  												
						</table>
					</td>
				</tr>  	
				<tr class="separated">  		
					<td colspan="2"></td>	 				 
				</tr>
				<tr>		
					<td colspan="2">		
						<table cellpadding="0" cellspacing="0"> 
							<tr>
								<td style="text-align:center;"> 
									<span style="font-size:15px;font-weight:bold;">Birth Certificate</span>	
								</td>  
							</tr>
						</table>		
					</td>
				</tr> 
				<tr>		  
					<td colspan="2">		
						<table cellpadding="10" cellspacing="15">   
							<tr>
								<td>
									<b>Admission No:</b> {{$cc[0]->admission_no}}   
								</td>

								<td> 																				
									<b>BC No:</b> {{$cc[0]->bc_no}}     
								</td>
							</tr>
						</table>
					</td>
				</tr>	
				<tr>
					<td colspan="2">
						<table cellpadding="2" cellspacing="15"> 			
							<tr>
								<td> 
									<b>Name Of Student :</b> {{ucwords($cc[0]->student_name)}}
								</td>  
							</tr>		
							<tr>
								<td> 
									<b>Father Name :</b> {{ucwords($cc[0]->father_name)}}  
								</td>  
							</tr>	
							<tr>
								<td> 
									<b>Mother Name :</b> {{ucwords($cc[0]->mother_name)}}
								</td>  
							</tr>		
							<tr>
								<td> 
									<b>Address :</b> {{ucwords($cc[0]->permanent_address)}}  
								</td>  
							</tr>
							<tr>
								<td> 
									<b>Class Name :</b> {{ucwords($cc[0]->className)}}
								</td>  
							</tr>		
							<tr>
								<td> 
									<b>Date Of Birth :</b> {{date('d-m-Y',strtotime($cc[0]->dob))}} ({{$dob}}) 
								</td>  
							</tr>	
							<tr>
								<td> 
									<b>Last Issued Date :</b> {{date('d-m-Y',strtotime($cc[0]->issue_date))}} ({{$issued_at}}) 
								</td>  
							</tr>		
							<tr>
								<td> 
									<b>Remarks :</b> {{ucwords($cc[0]->remark)}}  
								</td>  
							</tr>	
							<tr>
								<td> 
									<b>Certified that all the informations are true according to the school record.</b> 
								</td>  
							</tr>		
						</table>			
					</td>
				</tr>
				<tr>		
					<td colspan="2">
						<table cellpadding="10" cellspacing="15" style="margin-top:25px;margin-bottom:300px;">   
							<tr> 										
								<td style="text-align:right;font-weight:bold;">  							
									Principal Sign And Seal  
								</td>		
							</tr>
						</table>
					</td>
				</tr>	
			</table>
			
		</div>
	</body>
</html>