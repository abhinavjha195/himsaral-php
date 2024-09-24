<!DOCTYPE html>			
<html>
<head>
<style>
@page{
	margin-top: 70px; /* create space for header */
	margin-bottom: 20px; /* create space for footer */	
}
table{margin: 12px 0;}table td{padding: 5px; color: black} table{border-collapse: collapse;} table th{border:1px solid black;height:45px;} .topleft {position: relative;top: -50px;left: -25px;padding-top:30px;} .noborder, .noborder tr, .noborder th, .noborder td {border: none;} .noborder td{border:none;} .removeborder tr{border-right: none;border-bottom: 1px solid #000} p{margin: 4px; font-size: 15px;}   

.print-area {
	max-width: 580px;	
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
  width:638px;				
} 

.stutble td {
	border: 1px solid grey; 
}
</style>		
</head>
@php 
	$page=$slr=$start=$end=0; 
	$slot=23;			
@endphp 
@if(count($search_result)>0)	
	@foreach($search_result as $sr)	
		@php 
			$slr++; 
		@endphp 
		@if ($slr%$slot==0)  
			@php 
				$page++;  
			@endphp 
		@endif  
	@endforeach
@endif 	
<body>
@if(count($search_result)>0)   
	@for ($i = 0; $i <= $page; $i++) 	
		@php 			 
			$start=$slot*$i;  
			$end=$start+$slot;    
		@endphp 
	<div class="print-area"> 			
		<table class="noborder" style="margin-left:auto;margin-right:auto;width:580px;">			
			<tr>
				<td>
					<img src="{{empty($school[0]->school_logo)?'':public_path('uploads/school_image/'.$school[0]->school_logo)}}" height="80" width="80" class="topleft">     
				</td> 
				<td colspan="3"> 	
					<p style="text-align:center;position:relative;top:-40px;"><b><span style="font-size:17px;">{{empty($school[0]->school_name)?'':$school[0]->school_name}} {{($school[0]->about=='')?'':'('.$school[0]->about.')'}}</span></b><br/><span style="font-size:12px;">{{empty($school[0]->school_address)?'':$school[0]->school_address}}</span><br/><span style="font-size:12px;">Contact No.: {{empty($school[0]->school_contact)?'':$school[0]->school_contact}}</span></p>  			 
					<p></p>			
					<p style="text-align:center;position:relative;top:-40px;font-size:12px;"><b>Website: </b>{{empty($school[0]->server_address)?'':$school[0]->server_address}}<br/><b>Email:- </b>{{empty($school[0]->school_email)?'':$school[0]->school_email}}</p>	   
				</td>			
			</tr>
		</table> 				
		<hr color="black">  
		@if ( $i == 0 ) 
        <p style="text-align:center;font-size:15px;"><b>School Student List</b></p>	@endif  	 		
		<table class="" style="margin-left:auto;margin-right:auto;width:580px;border:1px solid;">		 			
			<tbody>
				@if ( $i == 0 )  
				<tr>					
					<th>Admission No.</th>	
					<th>Name</th>	  	  
					<th>Father Name</th>	
					<th>Mother Name</th>	
					<th>Course</th>	
					<th>Class</th>	
					<th>Section</th>	  
					<th>Roll No.</th>	  
				</tr>
				@endif  	
				@if(count($search_result)>0)	 					
					@for ($k=$start;$k<$end;$k++)
						@if($k<count($search_result))	
					<tr class="stutble">		
						<td>{{ $search_result[$k]->admission_no }}</td>	
						<td>{{ $search_result[$k]->student_name }}</td>  
						<td>{{ $search_result[$k]->father_name }}</td>	
						<td>{{ $search_result[$k]->mother_name }}</td>	
						<td>{{ $search_result[$k]->courseName }}</td>	
						<td>{{ $search_result[$k]->className }}</td>
						<td>{{ $search_result[$k]->sectionName }}</td>	
						<td>{{ $search_result[$k]->roll_no }}</td>   		
					</tr>@endif   
					@endfor
				@endif 				
			</tbody>
		</table>  		
	  </div>  
	  @endfor
@endif 			
    </body>		
</html> 		