<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" /> 
<style> 
tr.bordered {
    border-bottom: 1px solid #000;		
}    

.text{font-family:Arial, Helvetica, sans-serif; font-size:10px;color:#000000; }	
td,
th,
tr,
table {      
    border-collapse: collapse;		
}
.tablerow1
{
	background-color:#FFD700;  
}  
.id-card {    		
      float: left;
      width: 30%;	 
      padding: 5px;		 	        
      margin: 5px;
      height: 20%;	
} 	
.page-break {
	margin-top:325px;		
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
@page { size: auto; size: A4 portrait;margin: 50px 20px 50px 25px; }   			
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
			  
<table width="125" border="0" cellpadding="2" cellspacing="2" class="text" align="center" bgcolor="FFFFFF">
  
    <tbody>    
	<tr> 
	 <td height="5" width="25"><img src="{{empty($school[0]->school_logo)?'':public_path('uploads/school_image/'.$school[0]->school_logo)}}" width="25" height="42"><br></td>   	
     <td height="5" colspan="2" align="center">		        
         <font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="2" color="#000000">{{$school[0]->school_name}} </font><br>
        <font size="1" face="Trebuchet MS, Arial, Helvetica, sans-serif" color="#000000">{{($school[0]->about=='')?'':'('.$school[0]->about.')'}}</font> <br>  
        <font size="1" color="#000000" face="Trebuchet MS, Arial, Helvetica, sans-serif">{{$school[0]->school_address}}</font>	  	  			
	</td> 	
   </tr> 
   <tr class="bordered"> 
        <td colspan="3" valign="top"></td>		
   </tr>	
   <tr> 
     <td height="5" colspan="3" align="center" class="tablerow1">              
                <font face="Trebuchet MS, Arial, Helvetica, sans-serif" color="#000000" size="1"><b>Session : 2022-23 </b></font><br>
      <font face="Georgia, Times New Roman, Times, serif" color="#000000" size="1"><b>IDENTITY CARD</b></font></td>
   </tr>   
   <tr class="bordered tablerow1">  
        <td colspan="3" valign="top"></td>
   </tr>
   <tr class="text">     
	   <td width="25" rowspan="8"><img src="{{ ($student->student_image=='')?'':public_path('uploads/student_image/'.$student->student_image)}}" width="45" height="70" border="1"><br/>{{$student->student_name}}</td>
        <td width="60" height="5">	  
               <font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">&nbsp;<b>Father Name</b></font>
        </td>
        <td><font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">: {{$student->father_name}}</font></td>
           
    </tr>		
            <tr>
              <td height="5">
                <font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">&nbsp;<b>Admission No.</b></font>
            </td>
              <td><font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">: {{$student->admission_no}}<b> 
                                 </b></font></td>
            </tr>
       <tr class="text">
         <td height="5"><font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">&nbsp;<b>Roll No.</b></font></td>
         <td><font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">: {{$student->roll_no}}</font></td>
       </tr>
        <tr class="text"> 
            <td height="5">
                <font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">&nbsp;<b>Class</b></font>
            </td>
            <td><font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">: {{$student->className}}<b></b></font></td>
    </tr>
   
       <tr class="text"> 
            <td height="5">
                <font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">&nbsp;<b>Contact No.</b></font>
            </td>
            <td><font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">: {{$student->mobile}}</font></td>
    </tr>
       <tr class="text">
         <td height="5"><font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">&nbsp;<b>Date of Birth</b></font></td>
         <td><font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">: {{$student->dob}}</font></td>
       </tr>
	   
	    <tr class="text"> 
            <td height="5">
                <font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">&nbsp;<b>Pick Up Point</b></font>
            </td>
            <td><font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">: {{($student->stationName=='')?'N/A':$student->stationName}}</font></td>
    </tr>
	   
       <tr class="text"> 
            <td height="5">  
                <font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">&nbsp;<b>Route No.</b>
</font>
            </td>
            <td width="60"><font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">: {{($student->routeNo=='')?'N/A':$student->routeNo}}</font></td>
    </tr>
	<tr class="bordered">
        <td colspan="3" valign="top"></td>		 
    </tr>	
    <tr class="text"> 
        <td height="5" colspan="3" valign="top">		
                <p><font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">&nbsp;<b>Address</b> : {{$student->permanent_address}} </font></p>
        </td>  
    </tr>      
    </tbody>		
	</table>
        </div>
@else 		
        <div class="id-card">		
           
<table width="125" border="0" cellpadding="2" cellspacing="2" class="text" align="center" bgcolor="FFFFFF">
  
    <tbody>    
	<tr> 
	 <td height="5" width="25"><img src="{{empty($school[0]->school_logo)?'':public_path('uploads/school_image/'.$school[0]->school_logo)}}" width="25" height="42"><br></td>   	
     <td height="5" colspan="2" align="center">		        
         <font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="2" color="#000000">{{$school[0]->school_name}} </font><br>
        <font size="1" face="Trebuchet MS, Arial, Helvetica, sans-serif" color="#000000">{{($school[0]->about=='')?'':'('.$school[0]->about.')'}}</font> <br>  
        <font size="1" color="#000000" face="Trebuchet MS, Arial, Helvetica, sans-serif">{{$school[0]->school_address}}</font>	  	  			
	</td> 	
   </tr> 
   <tr class="bordered"> 
        <td colspan="3" valign="top"></td>		
   </tr>	
   <tr> 
     <td height="5" colspan="3" align="center" class="tablerow1">              
                <font face="Trebuchet MS, Arial, Helvetica, sans-serif" color="#000000" size="1"><b>Session : 2022-23 </b></font><br>
      <font face="Georgia, Times New Roman, Times, serif" color="#000000" size="1"><b>IDENTITY CARD</b></font></td>
   </tr>   
   <tr class="bordered tablerow1">  
        <td colspan="3" valign="top"></td>
   </tr>
   <tr class="text">     
	   <td width="25" rowspan="8"><img src="{{ ($student->student_image=='')?'':public_path('uploads/student_image/'.$student->student_image)}}" width="45" height="70" border="1"><br/>{{$student->student_name}}</td>
        <td width="60" height="5">	  
               <font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">&nbsp;<b>Father Name</b></font>
        </td>
        <td><font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">: {{$student->father_name}}</font></td>
           
    </tr>		
            <tr>
              <td height="5">
                <font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">&nbsp;<b>Admission No.</b></font>
            </td>
              <td><font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">: {{$student->admission_no}}<b> 
                                 </b></font></td>
            </tr>
       <tr class="text">
         <td height="5"><font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">&nbsp;<b>Roll No.</b></font></td>
         <td><font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">: {{$student->roll_no}}</font></td>
       </tr>
        <tr class="text"> 
            <td height="5">
                <font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">&nbsp;<b>Class</b></font>
            </td>
            <td><font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">: {{$student->className}}<b></b></font></td>
    </tr>
   
       <tr class="text"> 
            <td height="5">
                <font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">&nbsp;<b>Contact No.</b></font>
            </td>
            <td><font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">: {{$student->mobile}}</font></td>
    </tr>
       <tr class="text">
         <td height="5"><font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">&nbsp;<b>Date of Birth</b></font></td>
         <td><font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">: {{$student->dob}}</font></td>
       </tr>
	   
	    <tr class="text"> 
            <td height="5">
                <font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">&nbsp;<b>Pick Up Point</b></font>
            </td>
            <td><font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">: {{($student->stationName=='')?'N/A':$student->stationName}}</font></td>
    </tr>
	   
       <tr class="text"> 
            <td height="5">  
                <font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">&nbsp;<b>Route No.</b>
</font>
            </td>
            <td width="60"><font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">: {{($student->routeNo=='')?'N/A':$student->routeNo}}</font></td>
    </tr>
	<tr class="bordered">
        <td colspan="3" valign="top"></td>		 
    </tr>	
    <tr class="text"> 
        <td height="5" colspan="3" valign="top">		
                <p><font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">&nbsp;<b>Address</b> : {{$student->permanent_address}} </font></p>
        </td>  
    </tr>      
    </tbody>		
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