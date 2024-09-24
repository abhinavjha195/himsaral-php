<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>A simple, clean, and responsive HTML invoice template</title>

		<style>
			.invoice-box {
				width: 100%;    
				margin: 0px 0px 0px 0px;    		
				padding: 2px;  								 
				font-size: 15px;		
				line-height: 24px;
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
			
			table.slip{   
                border: 1px solid black;
				margin-top:25px;  
            }
			
			u.dotted {    
				border-bottom: 2px dotted #000;		
				text-decoration: none;		
			}		
			
			@page { margin: 5px 25px 5px 25px; }     
		</style>
	</head>  			
	<body>
		<div class="invoice-box">
			<table cellpadding="0" cellspacing="0">
				<tr class="top">
					<td colspan="2">
						<table cellpadding="0" cellspacing="0"> 		
							<tr>
								<td style="width:17%;">    
									<img src="{{ public_path('uploads/school_image/'.$cc[0]->school_logo)}}" style="width:75%; max-width:250px;" />	
								</td>

								<td style="text-align:center;">      
									<span style="font-size:20px;font-weight:bold;">{{$cc[0]->school_name}}{{($cc[0]->about=='')?'':'( '.$cc[0]->about.')'}}</span><br />   
									Address:{{$cc[0]->school_address}}<br />		
									Contact: {{$cc[0]->school_contact}}<br />
									Email:{{$cc[0]->school_email}}     
								</td>  
								
								<td style="width:14%;">    
									&nbsp;&nbsp;  
								</td>
								
							</tr>  
							
							<tr class="separated">  
								<td colspan="3"></td>	 		 
							</tr>
							<tr>		
								<td colspan="3">		
									<table cellpadding="0" cellspacing="0"> 
										<tr>
											<td style="text-align:center;"> 
												<span style="font-size:15px;font-weight:bold;">Character Certificate</span>	
											</td>  
										</tr>
									</table>
								</td>
							</tr>
							<tr>		  
								<td colspan="3">		
									<table cellpadding="5" cellspacing="5">   
										<tr>
											<td>
												Admission No: {{$cc[0]->admission_no}}   
											</td>

											<td>
												Date: {{date('d-m-Y')}}<br/> 												
												CC No: {{$cc[0]->cc_no}}  
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
						<table class="slip" cellpadding="0" cellspacing="10"> 			
							<tr>
							  <td>
							   <p>This is to be certified that {{ucwords($cc[0]->student_name)}} Son/daughter of {{ucwords($cc[0]->father_name)}} studied from {{date('d-m-Y',strtotime($cc[0]->admission_date))}} To {{date('d-m-Y',strtotime($cc[0]->last_date))}} in
								{{ucwords($cc[0]->className)}} Class.</p> 
							   <p>He / She has passed/ appeared / failed in {{ucwords($cc[0]->classLast)}} class annual standard examination conducted by {{$cc[0]->exam_board}} in {{ucwords($cc[0]->em_month)}}/{{$cc[0]->exam_year}}  
								under Roll No {{$cc[0]->roll_no}} and secured {{floatval($cc[0]->secured_marks)}} out of {{floatval($cc[0]->total_marks)}}.</p>			
							  </td>  							  
							</tr>
							<tr>
							  <td>His/Her Date of Birth as per Admission Register is: {{date('d-m-Y',strtotime($cc[0]->dob))}}  
							   <ul style="list-style-type:none;margin-left:-35px;">		
								<li>1) Co-Curricular Activities : {{ucwords($cc[0]->curricular_activity)}}</li>
								<li>2) Games Played : {{ucwords($cc[0]->game)}}</li>	
								<li>3) General Conduct throughout : {{ucwords($cc[0]->general_conduct)}}</li>		
							   </ul>	
							  </td> 							  
							</tr>
							<tr>
								<td> He / She bears a good Moral Character.</td>	  			
							</tr>
						</table>			
					</td>
				</tr>
				<tr>		
					<td colspan="2">
						<table cellpadding="2" cellspacing="2" style="margin-top:10px;">   
							<tr>
								<td style="width:45%;"> 		
									Sign. of Incharge
								</td> 								
								<td style="text-align:right;">  							
									Principal Sign & Seal     
								</td>
							</tr>
						</table>
					</td>
				</tr>	
			</table>
			
		</div>
	</body>
</html>