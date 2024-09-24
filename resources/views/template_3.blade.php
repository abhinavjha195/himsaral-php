<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
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
.id-card {    		
      float: left;
      width: 30%;	 
      padding: 5px;		 	        
      margin: 5px;
      height: 20%;	
} 	
.page-break {
	margin-top: 300px;		
}
table, th {
  border: 1px solid black;
  border-collapse: collapse;
}	
@media screen and (max-width: 600px) {
  .card {
	 width: 100%;
  }
}

@page { size: auto; size: A4 portrait;margin: 75px 10px 75px 25px; }   	
</style>
</head>
<body>

<div class="container">		
    <div class="row">
	@php $check=0; @endphp
@foreach($students AS $student)	  
@php $check++; @endphp			

@if($check%4 == 0)    
<div class="page-break"></div>  
@php 
$check=1;			 
@endphp  	  
        <div class="id-card">
			<table>
			  <tr>
				<th align="left" colspan="10" style="background-color:#87CEFA"><img src="{{empty($school[0]->school_logo)?'':public_path('uploads/school_image/'.$school[0]->school_logo)}}" alt='logo' style="width:15%;max-width:25px;">		
				<h5 style="text-align: center;">{{$school[0]->school_name}} {{($school[0]->about=='')?'':'('.$school[0]->about.')'}}<br/>{{$school[0]->school_address}}</h5></th>     
			  </tr>
			  <tr>
				<td colspan="8" rowspan="8"><img src="{{ ($student->student_image=='')?'':public_path('uploads/student_image/'.$student->student_image)}}" alt='logo' style="width:40%;max-width:250px;"><br/>{{$student->student_name}}</td>		
				<td>Father Name:</td>
				<td>{{$student->father_name}}</td>
			  </tr>
			  <tr>
				<td>Roll No.</td>
				 <td>{{$student->roll_no}}</td>  
			  </tr>
			  <tr>
				<td>Admission No.</td>
				<td>{{$student->admission_no}}</td>  
			  </tr> 
			  <tr>
				<td>Class</td>
				<td>{{$student->className}}</td>
			  </tr>  
			   <tr>
				<td>Contact No.</td>
				 <td>{{$student->mobile}}</td>
			  </tr>   
			   <tr>
				<td>DOB</td>
				<td>{{$student->dob}}</td>
			  </tr>
				<tr>
				<td>Pick Up Point</td>
				<td>{{($student->stationName=='')?'N/A':$student->stationName}}</td>   
			  </tr>
				 <tr>
				<td>Route No.</td>
				<td>{{($student->routeNo=='')?'N/A':$student->routeNo}}</td>    
			  </tr>
			  <tr>
				<th align="left" colspan="10" style="background-color:#87CEFA">Address:</th>
			  </tr>
			</table>
        </div>
@else 		
        <div class="id-card">		
           
			<table>
			  <tr>
				<th align="left" colspan="10" style="background-color:#87CEFA"><img src="{{empty($school[0]->school_logo)?'':public_path('uploads/school_image/'.$school[0]->school_logo)}}" alt='logo' style="width:15%;max-width:25px;">
				<h5 style="text-align: center;">{{$school[0]->school_name}} {{($school[0]->about=='')?'':'('.$school[0]->about.')'}}<br/>{{$school[0]->school_address}}</h5></th>  
			  </tr>
			  <tr>
				<td colspan="8" rowspan="8"><img src="{{ ($student->student_image=='')?'':public_path('uploads/student_image/'.$student->student_image)}}" alt='Logo' style="width:40%;max-width:250px;"><br/>{{$student->student_name}}</td>		
				<td>Father Name:</td>
				<td>{{$student->father_name}}</td>	
			  </tr>
			  <tr>
				<td>Admission No.</td>
				<td>{{$student->admission_no}}</td>  
			  </tr> 
			  <tr>
				<td>Roll No.</td>
				<td>{{$student->roll_no}}</td>
			  </tr>
			  <tr>
				<td>Class</td>
				<td>{{$student->className}}</td>	
			  </tr>  
			   <tr>
				<td>Contact No.</td>
				 <td>{{$student->mobile}}</td>  
			  </tr>   
			   <tr>
				<td>DOB</td>
				<td>{{$student->dob}}</td>  
			  </tr>
				<tr>
				<td>Pick Up Point</td>
				<td>{{($student->stationName=='')?'N/A':$student->stationName}}</td>     	
			  </tr>
				 <tr>
				<td>Route No.</td>
				<td>{{($student->routeNo=='')?'N/A':$student->routeNo}}</td>  
			  </tr>
			  <tr>
				<th align="left" colspan="10" style="background-color:#87CEFA">Address:</th>   
			  </tr>
			</table>
		</div>   
        
@endif  		
@endforeach			  		
    </div>
</div>

<!----
<div class="cardContainer">

@php $check=0 @endphp
@for($i=0;$i<28;$i++)	
@php $check++ @endphp

@if( $check % 4 == 0 ) 
    <div class="page-break"></div>
    @php $check=0 @endphp  	
	<div class="card" style="background-color:rgb(153, 29, 224);">
	<h2>First card</h2>
	<p>Some {{$i}} text</p>		
	</div>	
@else
	 <div class="card" style="background-color:rgb(153, 29, 224);">
	<h2>First card</h2>
	<p>Some {{$i}} text</p>
	</div>
@endif
@endfor			

</div>----->   

</body>
</html>