<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>Character Certificate Format 3</title>		

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
									<span style="font-size:20px;font-weight:bold;">{{$cc[0]->school_name}}{{($cc[0]->about=='')?'':'( '.$cc[0]->about.')'}}</span><br />   
									Address:{{$cc[0]->school_address}}<br />		
									Contact: {{$cc[0]->school_contact}}<br />
									Email:{{$cc[0]->school_email}}     
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
									<span style="font-size:15px;font-weight:bold;">Character Certificate</span>	
								</td>  
							</tr>
						</table>
					</td>
				</tr> 		
				<tr>
					<td colspan="2">
						<table cellpadding="10" cellspacing="25"> 			
							<tr>		
							  <td>
							  <p>Sr. No: {{$cc[0]->serial_no}}</p>	
							   <p>This is to be certified that......{{ucwords($cc[0]->student_name)}}.......</p> 
							   <p>Son/daughter of Sh......{{ucwords($cc[0]->father_name)}}......</p>			
							   <p>Mother's Name SMT....{{ucwords($cc[0]->mother_name)}}..... has/had been a regular student of....{{ucwords($cc[0]->className)}}.... Class of this
instituion during the session {{$cc[0]->session_st}} to {{$cc[0]->session_ed}}</p>   
							   <p>He/she appeared in.....{{ucwords($cc[0]->classLast)}}.....Examination of {{$cc[0]->exam_board}} held in....{{ucwords($cc[0]->em_month)}}/{{$cc[0]->exam_year}} ....under the roll No....{{$cc[0]->roll_no}} ....The result is still awaited/Passesd/permotted as per government
order securing....{{floatval($cc[0]->secured_marks)}}/{{floatval($cc[0]->total_marks)}}....marks /failed/Compartment.</p><p>His/her date of birth according to school record is....{{date('d-m-Y',strtotime($cc[0]->dob))}} ....The {{$dob}}.....
</p> 
							   <p>This institution has no objection of candidate seek further admission in any school/instituion.</p>	
							   <p>He/she has been a student of good moral character during his/her study period i wish him/her
every success in life.</p>				
							  </td>  	  		  				  
							</tr> 							
						</table>			
					</td>
				</tr>
				<tr>		
					<td colspan="2">
						<table cellpadding="10" cellspacing="25" style="margin-top:75px;margin-bottom:200px;">   
							<tr>
								<td style="width:32%;"> 		
									Sign. of Incharge
								</td> 		
								<td style="width:25%;"> 		
									Checked by
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