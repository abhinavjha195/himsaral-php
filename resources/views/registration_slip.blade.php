<!DOCTYPE html>
<html>
<head>
<style>
table{margin: 12px 0;}table td{padding: 5px; color: black} h1{margin: 10px;} h4{margin: 8px;} p{margin: 4px; font-size: 15px;} .col-md-3{right: 50; width: 260px; top:925}table{border-collapse: collapse;}table, td, th{border:1px solid black;height:45px;} .topleft {position: absolute;top: 5px;left: 30px;padding-top:20px;} .noborder, .noborder tr, .noborder th, .noborder td {border: none;} .totalss{width: 75%; height: 15%} .lefttext{position: absolute;left: 401px;} .txtalgn{position: absolute;left: 527px;} .admno{position: absolute;left:8%;} .scadm{position:absolute;left:25%} .stdname{position:relative;left:99px;} .showstd{position:relative;left:107px;} .prncpal{position:relative;left:120px;top:19px;} .prprdby{position:relative;left:-120px;top:19px;} .chkdby{position:relative;top:19px;} .clsname{position: relative;left:185px;top:-12px;}.noborder td{border:none;} .removeborder tr{border-right: none;border-bottom: 1px solid #000}     
</style>
</head>		

<body style="border:2px solid #000;">		  
<img src="{{empty($school[0]->school_logo)?'':public_path('uploads/school_image/'.$school[0]->school_logo)}}" height="80" width="80" class="topleft hidden"> 
            <h4 class="hidden" style="text-align:center;">{{empty($school[0]->school_name)?'':$school[0]->school_name}} {{($school[0]->about=='')?'':'('.$school[0]->about.')'}}</h4>		
            <h5 class="hidden" style="text-align:center;position:relative;top:-6px;">{{$school[0]->school_address}}</h5>
			<p class="hidden" style="text-align:center;">Phone No.: {{$school[0]->school_contact}}</p>		
            <p class="hidden" style="text-align:center;">Website: {{$school[0]->server_address}} &nbsp; Email:- {{$school[0]->school_email}}</p>
			<p></p>			
			<hr color="black">
        
		<div class="divClass3 form-group" style="overflow: hidden">
            <div class="form-group">
                <div class="row">
                    <div class="col-md-8">
                        <table class="noborder" cellpadding="0" cellspacing="0" style="margin-left:auto;margin-right:auto;width:670px;">		
                            <tbody> 		
                                <tr>
                                    <td colspan="2" style="text-align:center;"><b>Registration Slip</b></td>		
                                </tr>  
								<tr>
                                    <td style="text-align:left;"><b>Reg. No. :- </b>		
									{{empty($registration[0]->registration_no)?'':$registration[0]->registration_no}}  
									</td>		
									<td style="text-align:center;"><b>Reg. Date :- </b>
									{{(empty($registration[0]->registration_date) || $registration[0]->registration_date=='0000-00-00')?'':date('d-m-Y',strtotime($registration[0]->registration_date))}}		
									</td>  
                                </tr>	
                            </tbody>			
                        </table>
                    </div>
                </div>
            </div>
        </div>
		<div class="divClass3 form-group" style="overflow: hidden">
            <div class="form-group">
                <div class="row">
                    <div class="col-md-6">		
						<table class="table table-bordered table-striped" style="margin-left:auto;margin-right:auto;width:600px;">		
							
							<tbody>
					 								
								<tr>
									<th class="cls" style="position:relative;width:50px;">1.</th>		
									<th class="cls" style="position:relative;width:250px;">Name Of Child:</th>
									<td class="cls" style="text-align:center;">{{empty($registration[0]->student_name)?'':$registration[0]->student_name}} </td>		
								</tr> 	
								<tr>
									<th class="cls" style="position:relative;width:50px;">2.</th>		
									<th class="cls" style="position:relative;width:250px;">Name of Parent/Gaurdian:</th>
									<td class="cls" style="text-align:center;">{{empty($registration[0]->father_name)?'':$registration[0]->father_name}}</td>		
								</tr> 
								<tr>
									<th class="cls" style="position:relative;width:50px;">3.</th>		
									<th class="cls" style="position:relative;width:250px;">Date of Birth:</th>
									<td class="cls" style="text-align:center;">{{(empty($registration[0]->dob) || $registration[0]->dob=='0000-00-00')?'':date('d-m-Y',strtotime($registration[0]->dob))}}	</td>		
								</tr> 
								<tr>
									<th class="cls" style="position:relative;width:50px;">4.</th>		
									<th class="cls" style="position:relative;width:250px;">Contact No:</th>
									<td class="cls" style="text-align:center;">{{empty($registration[0]->mobile)?'':$registration[0]->mobile}}</td>					
								</tr> 	
								<tr>
									<th class="cls" style="position:relative;width:50px;">5.</th>		
									<th class="cls" style="position:relative;width:250px;">Class for which Admission is sought:</th>	
									<td class="cls" style="text-align:center;">{{empty($registration[0]->className)?'':$registration[0]->className}}</td>		
								</tr> 	
								<tr>
									<th class="cls" style="position:relative;width:50px;">6.</th>		
									<th class="cls" style="position:relative;width:250px;">Date of Interview:</th>
									<td class="cls" style="text-align:center;">{{(empty($registration[0]->interview_date) || $registration[0]->interview_date=='0000-00-00')?'':date('d-m-Y',strtotime($registration[0]->interview_date))}}	
									</td>		
								</tr> 
								<tr>
									<th class="cls" style="position:relative;width:50px;">7.</th>		
									<th class="cls" style="position:relative;width:250px;">Registration Fee (Rs):</th>
									<td class="cls" style="text-align:center;">{{empty($registration[0]->fee)?'':$registration[0]->fee}}</td>		
								</tr> 
								<tr>
									<th class="cls" style="position:relative;width:50px;">8.</th>		
									<th class="cls" style="position:relative;width:250px;">If School Bus Required, then
									choice of station to Board:</th>	
									<td class="cls" style="text-align:center;">{{empty($registration[0]->stationName)?'':$registration[0]->stationName}}</td>					
								</tr> 	
								
							</tbody>
						</table>  
					</div>
                </div>
            </div>
        </div>     
        <div class="divClass3 form-group" style="overflow: hidden">		
            <div class="form-group">
                <div class="row">
                    <div class="col-md-6">
                        <table class="table table-striped table-bordered table-hover table-checkable order-column full-width sholist noborder" style="margin-left:auto;margin-right:auto;width:550px;">
                            <tbody> 
                                <tr>
                                    <td style="text-align:right;"><b>Account Manager</b></td>		
                                </tr>                                  
                            </tbody>			
                        </table>
                    </div>
                </div>
            </div>
        </div>
		
    </body>		
</html> 