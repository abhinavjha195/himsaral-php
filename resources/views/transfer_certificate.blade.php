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
            }
			
			u.dotted {    
				border-bottom: 2px dotted #000;		
				text-decoration: none;		
			}		
			
			@page { margin: 5px 25px 5px 25px; }     
		</style>
	</head>  
@inject('helper','App\Helpers\Helper')   
@php 
$birth_date = date('Y-m-d',strtotime($slc[0]->dob));   
$new_birth_date = explode('-', $birth_date);
$year = $new_birth_date[0];
$month = $new_birth_date[1];
$day  = $new_birth_date[2];
$birth_day=$helper->numberTowords($day);   
$birth_year=$helper->numberTowords($year);  
$monthNum = $month;  
$dateObj = DateTime::createFromFormat('!m', $monthNum); 
$monthName = strtoupper($dateObj->format('F'));    
$dob=$monthName.' '.$birth_day.' '.$birth_year;		
@endphp    
	<body>
		<div class="invoice-box">
			<table cellpadding="0" cellspacing="0">
				<tr class="top">
					<td colspan="2">
						<table cellpadding="0" cellspacing="0"> 		
							<tr>
								<td style="width:17%;">    
									<img src="{{ public_path('uploads/school_image/'.$school[0]->school_logo)}}" style="width:75%; max-width:250px;" />	
								</td>

								<td style="text-align:center;">      
									<span style="font-size:20px;font-weight:bold;">{{$school[0]->school_name}}&nbsp;{{($school[0]->about=='')?'':'('.$school[0]->about.')'}}</span><br />   
									Address:{{$school[0]->school_address}}<br />		
									Contact: {{$school[0]->school_contact}}&nbsp;Email:{{$school[0]->school_email}}<br />
									School Affiliation CBSE   
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
												<span style="font-size:15px;font-weight:bold;">Transfer Certificate</span>	
											</td>  
										</tr>
									</table>
								</td>
							</tr>
							<tr>		  
								<td colspan="3">		
									<table cellpadding="0" cellspacing="0">   
										<tr>
											<td>
												Slc No: {{$slc[0]->tc_no}}   
											</td>

											<td>
												Date: {{date('d-m-Y')}}<br/> 												
												Admission No: {{$slc[0]->admission_no}}  
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
						<table class="slip" cellpadding="5" cellspacing="5"> 	
							<tr>
								<td> 
									<sup>Student Name:</sup><sup style="padding-left:275px;">{{ucwords($slc[0]->student_name)}}</sup>  
									<hr style="height:1px; width: 88%; margin:0	 auto;line-height:2px;border:none;border-top:2px dotted #000;margin-left:12%;">   
								</td>  
							</tr>		
							<tr>
								<td> 
									<sup>Father Guardian Name:</sup><sup style="padding-left:224px;">{{ucwords($slc[0]->father_name)}}</sup>  
									<hr style="height:1px; width: 81%; margin:0	 auto;line-height:2px;border:none;border-top:2px dotted #000;margin-left:19%;">    
								</td>  
							</tr>	
							<tr>
								<td> 
									<sup>Mother Name:</sup><sup style="padding-left:278px;">{{ucwords($slc[0]->mother_name)}}</sup>  
									<hr style="height:1px; width: 89%; margin:0	 auto;line-height:2px;border:none;border-top:2px dotted #000;margin-left:11%;"> 
								</td>  
							</tr>		
							<tr>
								<td> 
									<sup>Nationality:</sup><sup style="padding-left:297px;">{{ucwords($slc[0]->nationality)}}</sup>    
									<hr style="height:1px; width: 92%; margin:0 auto;line-height:2px;border:none;border-top:2px dotted #000;margin-left:8%;">   
								</td>  
							</tr>
							<tr>	
								<td>  									
									<sup>Category:</sup><sup style="padding-left:304px;">{{ucwords($slc[0]->caste)}}</sup>      
									<hr style="height:1px; width: 92%; margin:0 auto;line-height:2px;border:none;border-top:2px dotted #000;margin-left:8%;">  
								</td>  
							</tr>		
							<tr>
								<td> 
									<sup>Date of Birth:</sup>
									<sup style="padding-left:175px;">{{date('d-m-Y',strtotime($slc[0]->dob))}}({{$dob}})</sup>      
									<hr style="height:1px; width: 92%; margin:0 auto;line-height:2px;border:none;border-top:2px dotted #000;margin-left:8%;">    
								</td>  
							</tr>
							<tr>	
								<td> 
									<sup>Date and Class of Admission to this School:</sup><sup style="padding-left:95px;">{{date('d-m-Y',strtotime($slc[0]->admission_date))}}/{{ucwords($slc[0]->className)}}</sup>      
									<hr style="height:1px;width:65%; margin:0 auto;line-height:2px;border:none;border-top:2px dotted #000;margin-left:35%;">    
								</td>  
							</tr>		
							<tr>
								<td> 
									<sup>School/Board Last Exam Given:</sup>
									<sup style="padding-left:75px;">{{$school[0]->school_name}}&nbsp;{{($school[0]->about=='')?'':'('.$school[0]->about.')'}}</sup>      
									<hr style="height:1px; width:74%; margin:0 auto;line-height:2px;border:none;border-top:2px dotted #000;margin-left:26%;">    
								</td>  
							</tr>
							<tr>
								<td> 
									<sup>Subject:</sup><hr style="height:1px; width:72 %; margin:0 auto;line-height:2px;border:none;border-top:2px dotted #000;margin-left:6%;"> 
								</td>  
							</tr>				
							<tr>
								<td> 
									<sup>Last Exam:</sup>	
									<sup style="padding-left:290px;">{{ucwords($slc[0]->classLast)}}</sup>      
									<hr style="height:1px; width: 92%; margin:0 auto;line-height:2px;border:none;border-top:2px dotted #000;margin-left:8%;"> 
								</td>  
							</tr>
							<tr>
								<td> 
									<sup>If failed (Mention Attempts):</sup>		
									<sup style="padding-left:195px;">{{ucwords($slc[0]->fail_attempt)}}</sup>      
									<hr style="height:1px; width:78%; margin:0 auto;line-height:2px;border:none;border-top:2px dotted #000;margin-left:22%;"> 	
								</td>    
							</tr>		
							<tr>
								<td> 
									<sup>If Qualified for Promotion(Mention Class):</sup>
									<sup style="padding-left:112px;">{{ucwords($slc[0]->qualify)}}</sup>      
									<hr style="height:1px; width: 67%; margin:0 auto;line-height:2px;border:none;border-top:2px dotted #000;margin-left:33%;"> 		
								</td>  
							</tr>
							<tr>
								<td> 
									<sup>Month and Year(Upto School dues are Paid):</sup>
									<sup style="padding-left:90px;">{{$slc[0]->f_month}}/{{$slc[0]->fee_year}}	</sup>      
									<hr style="height:1px; width: 64%; margin:0 auto;line-height:2px;border:none;border-top:2px dotted #000;margin-left:36%;"> 	
								</td>  
							</tr>		
							<tr>
								<td> 
									<sup>Fee Concession(If Any Mention Nature):</sup>  
									<sup style="padding-left:120px;">{{ucwords($slc[0]->concession)}}</sup>      
									<hr style="height:1px; width:68%; margin:0 auto;line-height:2px;border:none;border-top:2px dotted #000;margin-left:32%;"> 	
								</td>  
							</tr>  
							<tr>
								<td> 
									<sup>Total Working Days:</sup>  
									<sup style="padding-left:238px;">{{$slc[0]->working_days}}</sup>      
									<hr style="height:1px; width:84%; margin:0 auto;line-height:2px;border:none;border-top:2px dotted #000;margin-left:16%;"> 
								</td>  
							</tr>		
							<tr>
								<td> 
									<sup>Working Days Present:</sup>
									<sup style="padding-left:225px;">{{$slc[0]->working_present}} </sup>      
									<hr style="height:1px; width: 82%; margin:0 auto;line-height:2px;border:none;border-top:2px dotted #000;margin-left:18%;">   
								</td>  
							</tr>
							<tr>
								<td> 
									<sup>NCC Cadet/Guide/Scout Girl:</sup>		
									<sup style="padding-left:185px;">{{ucwords($slc[0]->ncc_conduct)}}</sup>      
									<hr style="height:1px; width: 77%; margin:0 auto;line-height:2px;border:none;border-top:2px dotted #000;margin-left:23%;"> 
								</td>  
							</tr>		
							<tr>
								<td> 
									<sup>Game Played(If Any):</sup>		
									<sup style="padding-left:232px;">{{ucwords($slc[0]->game)}}</sup>      
									<hr style="height:1px; width: 83%; margin:0 auto;line-height:2px;border:none;border-top:2px dotted #000;margin-left:17%;"> 
								</td>  
							</tr>
							<tr>
								<td> 
									<sup>General Through Conduct:</sup>									
									<sup style="padding-left:200px;">{{ucwords($slc[0]->general_conduct)}}</sup>      
									<hr style="height:1px; width: 79%; margin:0 auto;line-height:2px;border:none;border-top:2px dotted #000;margin-left:21%;"> 
								</td>  
							</tr>		
							<tr>
								<td> 
									<sup>Date of Application for SLC:</sup>  
									<sup style="padding-left:194px;">{{date('d-m-Y',strtotime($slc[0]->application_date))}}</sup>      
									<hr style="height:1px; width:78%; margin:0 auto;line-height:2px;border:none;border-top:2px dotted #000;margin-left:22%;">    	
								</td>  
							</tr>	
							<tr>
								<td> 
									<sup>Issued Date of SLC:</sup><sup style="padding-left:244px;">{{date('d-m-Y',strtotime($slc[0]->issue_date))}}</sup>      
									<hr style="height:1px; width: 84%; margin:0 auto;line-height:2px;border:none;border-top:2px dotted #000;margin-left:16%;">    	    
								</td>  
							</tr>		
							<tr>
								<td> 
									<sup>Reason for Leaving School:</sup>     
									<sup style="padding-left:195px;">{{ucwords($slc[0]->reason)}}</sup>      
									<hr style="height:1px; width: 78%; margin:0 auto;line-height:2px;border:none;border-top:2px dotted #000;margin-left:22%;"> 	
								</td>  
							</tr>			
							<tr>
								<td> 
									<sup>Remarks:</sup>		
									<sup style="padding-left:302px;">{{ucwords($slc[0]->remark)}}</sup>      
									<hr style="height:1px; width: 93%; margin:0 auto;line-height:2px;border:none;border-top:2px dotted #000;margin-left:7%;"> 	
								</td>  
							</tr>	
						</table>				
					</td>
				</tr>
				<tr>		
					<td colspan="2">
						<table cellpadding="2" cellspacing="2" style="margin-top:10px;">   
							<tr>
								<td style="width:25%;"> 
									Class Incharge.......
								</td>
								<td style="width:35%;">      
									Checked by..........   
								</td>
								<td style="text-align:right;">  							
									Principal   
								</td>
							</tr>
						</table>
					</td>
				</tr>	
			</table>
			
		</div>
	</body>
</html>