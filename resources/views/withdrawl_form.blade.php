<!DOCTYPE html>			
<html>
<head>
<style>
table{margin: 12px 0;}table td{padding: 5px; color: black} h1{margin: 10px;} h4{margin: 8px;} p{margin: 4px; font-size: 15px;} .col-md-3{right: 50; width: 260px; top:925}table{border-collapse: collapse;}table, td, th{border:1px solid black;height:45px;} .topleft {position: absolute;top: 7px;left: 40px;padding-top:10px;} .noborder, .noborder tr, .noborder th, .noborder td {border: none;} .totalss{width: 75%; height: 15%} .lefttext{position: absolute;left: 401px;} .txtalgn{position: absolute;left: 527px;} .admno{position: absolute;left:8%;} .scadm{position:absolute;left:25%} .stdname{position:relative;left:99px;} .showstd{position:relative;left:107px;} .prncpal{position:relative;left:120px;top:19px;} .prprdby{position:relative;left:-120px;top:19px;} .chkdby{position:relative;top:19px;} .clsname{position: relative;left:185px;top:-12px;}.noborder td{border:none;} .removeborder tr{border-right: none;border-bottom: 1px solid #000}	

.print-area {
	max-width: 650px;	
	margin: auto;
	margin-top: 10px;		
	padding: 30px;
	font-size: 13px; 				
	font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; 				
	border: 1px solid black;  					
	color: #000;
}     

hr { 
  display: block;
  margin-top: -50px;	
  margin-bottom: 0.5em;
  margin-left: -30px;		
  margin-right: auto;
  border-style: inset;
  border-width: 1px;   
  width:708px;				
} 

@page { margin: 45px 5px 25px 20px; }      
</style>		
</head>

<body>				
	<div class="print-area"> 	
		<table class="noborder" style="margin-left:auto;margin-right:auto;width:650px;">		
			<tr>
				<td>
					<img src="{{empty($school[0]->school_logo)?'':public_path('uploads/school_image/'.$school[0]->school_logo)}}" height="80" width="80" class="topleft">     
				</td> 
				<td colspan="3"> 	
					<p style="text-align:center;position:relative;top:-40px;"><b><span style="font-size:17px;">{{empty($school[0]->school_name)?'':$school[0]->school_name}} {{($school[0]->about=='')?'':'('.$school[0]->about.')'}}</span></b><br/><span style="font-size:12px;">{{empty($school[0]->school_address)?'':$school[0]->school_address}}</span><br/><span style="font-size:12px;">Phone No.: {{empty($school[0]->school_contact)?'':$school[0]->school_contact}}</span><br/><span style="font-size:12px;">Email: {{empty($school[0]->school_email)?'':$school[0]->school_email}}</span></p>  			 						
				</td>			
			</tr>
		</table> 				
		<hr color="black">  		  
        <p style="text-align:center;font-size:15px;"><b>Admission Form</b></p>					
		<table class="noborder" style="margin-left:auto;margin-right:auto;width:650px;border:1px solid;">		
			
			<tbody>
				<tr>
					<td style="text-align:center">
						Admission No:- {{empty($student[0]->admission_no)?'':$student[0]->admission_no}}  		
					</td> 
					<td style="text-align:center"> 						
						Class:- {{empty($student[0]->className)?'':$student[0]->className}}  	
					</td>
					<td style="text-align:center">
						Date:-  {{(empty($student[0]->admission_date) || $student[0]->admission_date=='0000-00-00')?'':date('d-m-Y',strtotime($student[0]->admission_date))}} 		 	
					</td>   
				</tr>					
				<tr>
					<td style="text-align:center">	
						<img src="{{empty($student[0]->student_image)?public_path('images/no-img.png'):public_path('uploads/student_image/'.$student[0]->student_image)}}" style="border:1px solid;" height="100" width="100" />
					</td>  
					<td style="text-align:center">		
						<img src="{{empty($student[0]->father_image)?public_path('images/no-img.png'):public_path('uploads/father_image/'.$student[0]->father_image)}}" style="border:1px solid;" height="100" width="100" />
					</td>
					<td style="text-align:center">		
						<img src="{{empty($student[0]->mother_image)?public_path('images/no-img.png'):public_path('uploads/mother_image/'.$student[0]->mother_image)}}" style="border:1px solid;" height="100" width="100" />			
					</td>			
				</tr>	
				<tr>
					<td colspan="3" style="text-align:center">We {{empty($student[0]->father_name)?'':$student[0]->father_name}} and {{empty($student[0]->mother_name)?'':$student[0]->mother_name}} desire to have our son/daughter/ward
 whose particulars are given below admitted as a day scholar in your School :</td>  					
				</tr>  
			</tbody>
		</table> 
		<p style="text-align:left;font-size:15px;"><b>Personal Details:-</b></p>
		<table class="noborder" style="margin-left:auto;margin-right:auto;width:650px;border:1px solid;">		
			
			<tbody>  												
				<tr>
					<td><label for="name">Name</label><br/>	
					<input type="text" style="height:2%;width:90%;" value="{{empty($student[0]->student_name)?'':$student[0]->student_name}}" /></td>		
					<td><label for="name">Date Of Birth</label><br/><input type="text" style="height:2%;width:92%;" value="{{(empty($student[0]->dob) || $student[0]->dob=='0000-00-00')?'':date('d-m-Y',strtotime($student[0]->dob))}}" /></td>
					<td><label for="name">Gender</label><br/><input type="text" style="height:2%;width:90%;" value="{{empty($student[0]->gender)?'':$student[0]->gender}}"/></td>
					<td><label for="name">Caste</label><br/><input type="text" style="height:2%;width:92%;" value="{{empty($student[0]->caste)?'':$student[0]->caste}}"/></td>    
   			    </tr>
				<tr>
					<td><label for="name">Nationality</label><br/>		
					<input type="text" style="height:2%;width:90%;" value="{{empty($student[0]->nationality)?'':$student[0]->nationality}}"/></td>				
					<td><label for="name">Religion</label><br/><input type="text" style="height:2%;width:92%;" value="{{empty($student[0]->religion)?'':$student[0]->religion}}"/></td>
					<td><label for="name">Marital Status </label><br/><input type="text" style="height:2%;width:90%;" value="{{empty($student[0]->marital_status)?'':$student[0]->marital_status}}"/></td>
					<td><label for="name">Blood Group</label><br/><input type="text" style="height:2%;width:92%;" value="{{empty($student[0]->blood_group)?'':$student[0]->blood_group}}"/></td>    
   			    </tr>
				<tr>
					<td><label for="name">E-mail Id</label><br/>
					<input type="text" style="height:2%;width:90%;" value="{{empty($student[0]->email)?'':$student[0]->email}}"//></td>		
					<td><label for="name">Mobile No.</label><br/><input type="text" style="height:2%;width:92%;" value="{{empty($student[0]->mobile)?'':$student[0]->mobile}}"/></td>
					<td><label for="name">Phone Code</label><br/><input type="text" style="height:2%;width:90%;" /></td>
					<td><label for="name">Phone No.</label><br/><input type="text" style="height:2%;width:92%;" /></td>    
   			    </tr>		
				<tr>
					<td colspan="2"><label for="name">Permanent Address</label><br/>		
					<textarea name="textarea" rows="2" cols="2">
						{{empty($student[0]->permanent_address)?'':$student[0]->permanent_address}}  
					</textarea>				
					</td>		
					<td colspan="2"><label for="name">Temporary Address</label><br/><textarea name="textarea" rows="2" cols="2">		
						{{empty($student[0]->temporary_address)?'':$student[0]->temporary_address}}    		
					</textarea>	
					</td>  					
   			    </tr>
				<tr>
					<td><label for="name">Bank Account No.</label><br/>
					<input type="text" style="height:2%;width:90%;" value="{{empty($student[0]->account_no)?'':$student[0]->account_no}}"/></td>				
					<td><label for="name">IFSC Code</label><br/><input type="text" style="height:2%;width:92%;" value="{{empty($student[0]->ifsc_no)?'':$student[0]->ifsc_no}}"/></td>
					<td colspan="2"><label for="name">Branch Address</label><br/><textarea name="textarea" rows="2" cols="2">		
					{{empty($student[0]->branch_address)?'':$student[0]->branch_address}}    	
					</textarea>			
					</td>  					
   			    </tr>
				<tr> 	
					<td colspan="2"><label for="name">Adhar Card No.(if any)</label><br/><textarea name="textarea" rows="2" cols="2">		
					{{empty($student[0]->aadhar_no)?'':$student[0]->aadhar_no}}      	
					</textarea>	
					</td> 
					<td colspan="2"></td>  					 
   			    </tr>  				
			</tbody>
		</table> 	
		<p style="text-align:left;font-size:15px;"><b>Admission Details:-</b></p>		
		<table class="noborder" style="margin-left:auto;margin-right:auto;width:650px;border:1px solid;">		 			
			<tbody>  																
				<tr>
					<td><label for="name">Admission Date</label><br/>
					<input type="text" style="height:2%;width:90%;" value="{{(empty($student[0]->admission_date) || $student[0]->admission_date=='0000-00-00')?'':date('d-m-Y',strtotime($student[0]->admission_date))}}"/></td>				
					<td><label for="name">Admission No.</label><br/><input type="text" style="height:2%;width:92%;" value="{{empty($student[0]->admission_no)?'':$student[0]->admission_no}}"/></td>
					<td><label for="name">Registration No. </label><br/><input type="text" style="height:2%;width:90%;" value="{{empty($student[0]->registration_no)?'':$student[0]->registration_no}}"/></td>
					<td><label for="name">Student Roll No</label><br/><input type="text" style="height:2%;width:92%;" value="{{empty($student[0]->roll_no)?'':$student[0]->roll_no}}"/></td>    
				</tr>   
				<tr>
					<td><label for="name">Course Name</label><br/>
					<input type="text" style="height:2%;width:90%;" value="{{empty($student[0]->courseName)?'':$student[0]->courseName}}"/></td>				
					<td><label for="name">Class Name</label><br/><input type="text" style="height:2%;width:92%;" value="{{empty($student[0]->className)?'':$student[0]->className}}"/></td>		
					<td><label for="name">Hostel Facility</label><br/><input type="text" style="height:2%;width:90%;" /></td>
					<td></td>    		
				</tr>   
			</tbody>
		</table>
		
	  </div>
	  <br/>			
	  <div class="print-area" style="height:970px;"> 			
		<p style="text-align:left;font-size:15px;"><b>Parent's Details:-</b></p>		
		<table class="noborder" style="margin-left:auto;margin-right:auto;width:650px;border:1px solid;">					
			<tbody>  												
				<tr>
					<td><label for="name">Father Name</label><br/>	
					<input type="text" style="height:2%;width:90%;" value="{{empty($student[0]->father_name)?'':$student[0]->father_name}}"/></td>		
					<td><label for="name">Mother Name</label><br/><input type="text" style="height:2%;width:92%;" value="{{empty($student[0]->mother_name)?'':$student[0]->mother_name}}"/></td>
					<td><label for="name">Father's Occupation</label><br/><input type="text" style="height:2%;width:90%;" value="{{empty($student[0]->f_occupation)?'':$student[0]->f_occupation}}"/></td>
					<td><label for="name">Father's Designation</label><br/><input type="text" style="height:2%;width:92%;" value="{{empty($student[0]->f_designation)?'':$student[0]->f_designation}}"/></td>    
   			    </tr>
				<tr>
					<td><label for="name">Father Annual Income</label><br/>
					<input type="text" style="height:2%;width:100%;" value="{{empty($student[0]->f_income)?'':$student[0]->f_income}}"/></td>				
					<td><label for="name">Father's Mob.No.</label><br/><input type="text" style="height:2%;width:100%;" value="{{empty($student[0]->f_mobile)?'':$student[0]->f_mobile}}"/></td>
					<td colspan="2"><label for="name">Father's E-mail Id</label><br/><input type="text" style="height:2%;width:96%;" value="{{empty($student[0]->f_email)?'':$student[0]->f_email}}"/></td>  					 					  
   			    </tr>
				<tr>
					<td><label for="name">Name Of Sibling</label><br/>		
					<input type="text" style="height:2%;width:100%;" value="{{empty($student[0]->sibling_admission_number)?'':(empty($student[0]->sibling_name)?'':$student[0]->sibling_name)}}"/></td>		
					<td><label for="name">Sibling's Admission No</label><br/><input type="text" style="height:2%;width:100%;" value="{{empty($student[0]->sibling_admission_number)?'':$student[0]->sibling_admission_number}}"/></td>
					<td></td>	
					<td></td>    
   			    </tr>						
			</tbody>
		</table> 	
		<p style="text-align:left;font-size:15px;"><b>Signatures:-</b></p>		
		<table class="noborder" style="margin-left:auto;margin-right:auto;width:650px;border:1px solid;">		 			
			<tbody>  						
				<tr>
					<td colspan="3"> I hereby certify that the information given in the admission form is complete and accurate. I understand and agree this misrepresentation or omission of facts will justify the denial of
 admission, the cancellation of admission or expulsion. I have read and do hereby consent to
 the term and conditions enclosed with the registration form.</td>		
				</tr>   
				<tr>
					<td><b>Signature of Mother / Guardian</b></td>  
					<td></td>		
					<td><b>Signature of Father / Guardian</b></td>  
				</tr>
			</tbody>
		</table>
		<table class="table noborder" style="margin-left:auto;margin-right:auto;width:650px;">
			<tbody> 
				<tr>
					<td style="text-align:right;"><b>Signature of Principal</b></td>		
				</tr>                                  
			</tbody>			
		</table>
	  </div>		
    </body>		
</html> 