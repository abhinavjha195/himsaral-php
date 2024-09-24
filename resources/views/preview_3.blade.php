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
      width: 100%;	 
      padding: 5px;		 	        
      margin: 5px;
      height: 20%;	
} 	
.page-break {
	margin-top: 270px;		
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
</style>
</head>
<body> 
<div class="container">		
    <div class="row">   	
        <div class="id-card" style="width:100%;">		               
			<table>	
			  <tr>
				<th align="left" colspan="10"><img src="{{ asset('images/logo.png')}}" alt='logo' style="width:15%;max-width:25px;">		
				<h5 style="text-align: center;">{{$school[0]->school_name}} {{($school[0]->about=='')?'':'('.$school[0]->about.')'}}<br/>{{$school[0]->school_address}}</h5></th>  
			  </tr>
			  <tr>
				<td colspan="8" rowspan="8"><img src="{{ asset('images/profile.jpg')}}" alt='Logo' style="width:40%;max-width:250px;"><br/>----------</td>		
				<td>Father Name:</td>
				<td>----------</td>	
			  </tr>
			  <tr>
				<td>Admission No.</td>
				<td>----------</td>  
			  </tr> 
			  <tr>
				<td>Roll No.</td>
				<td>----------</td>
			  </tr>
			  <tr>
				<td>Class</td>
				<td>----------</td>	
			  </tr>  
			   <tr>
				<td>Contact No.</td>
				 <td>----------</td>  
			  </tr>   
			   <tr>
				<td>DOB</td>
				<td>----------</td>  
			  </tr>
				<tr>
				<td>Pick Up Point</td>
				<td>----------</td>     	
			  </tr>
				 <tr>
				<td>Route No.</td>
				<td>----------</td>  
			  </tr>
			  <tr>
				<th align="left" colspan="10">Address:</th>   
			  </tr>
			</table>
		</div>          
    </div>
</div>   
</body>
</html>