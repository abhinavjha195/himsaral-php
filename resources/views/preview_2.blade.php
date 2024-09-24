<!DOCTYPE html>
<html>
<head>
	<meta name="viewport" content="width=device-width, initial-scale=1" />   
    <meta charset="UTF-8">    
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
table {		
  border: 1px solid black;    
}	
.tablerow1
{
	background-color:#CCFF00;  
}  
.tablerow2
{
	background-color:#FFFFFF;  
}		 
</style>   		
</head>  
<body>		
  <div id="printmatter">     
<table width="325" border="0" cellpadding="1" cellspacing="1" class="text" align="center" bgcolor="FFFFFF">   
    <tbody><tr> 
	<td height="5" align="center" class="tablerow2" width="35"><img src="{{ asset('images/logo.png')}}" width="55" height="32"></td>	
     <td height="5" colspan="2" align="center" class="tablerow2">        
        <font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="2" color="#000000"><b>{{$school[0]->school_name}} </b></font><br>
        <font size="1" face="Trebuchet MS, Arial, Helvetica, sans-serif" color="#000000"><b>{{($school[0]->about=='')?'':'('.$school[0]->about.')'}}</b></font><br>
        <font size="1" color="#000000" face="Trebuchet MS, Arial, Helvetica, sans-serif"><b>{{$school[0]->school_address}} </b> </font></td>
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
	   <td width="35" align="center" rowspan="8"><img src="{{ asset('images/profile.jpg')}}" width="70" height="95" border="1"></td>
           <td width="75" height="5">		
               <font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">&nbsp; <b>Father Name</b></font>
        </td>
           <td><font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">: ..........................</font></td>
           
    </tr>
            <tr class="text">
              <td height="5">
                <font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">&nbsp; <b>Admission No.</b></font>
            </td>
              <td><font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">: ..........................</font></td>
            </tr>
       <tr class="text">
         <td height="5"><font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">&nbsp; <b>Roll No.</b></font></td>
         <td><font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">: ..........................</font></td>
       </tr>
        <tr class="text"> 
            <td height="5">
                <font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">&nbsp; <b>Class</b></font>
            </td>
            <td><font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">: ..........................</font></td>
    </tr>
   
       <tr class="text"> 
            <td height="5"> 
                <font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">&nbsp; <b>Contact No.</b></font>
            </td>
            <td><font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">: ..........................</font></td>
    </tr>
       <tr class="text">
         <td height="5"><font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">&nbsp; <b>Date of Birth</b></font></td>
         <td><font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">: ..........................</font></td>
       </tr>
       <tr class="text"> 
            <td height="5">
                <font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">&nbsp; <b>Pick Up Point</b></font>
            </td>
            <td><font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">: ..........................</font></td>
    </tr> 
	<tr class="text"> 
            <td height="5">
                <font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">&nbsp; <b>Route No.</b></font>
            </td>
            <td width="70"><font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">: ..........................</font></td>
    </tr> 
	<tr class="bordered">	
        <td colspan="3" valign="top"></td>		 
    </tr>		
    <tr class="text"> 
            <td height="5" colspan="3" valign="top">
                <p><font face="Trebuchet MS, Arial, Helvetica, sans-serif" size="1">&nbsp; <b>Address</b> : .............................................................</font></p>
        </td>		
    </tr> 		  
   
    </tbody>		
	</table>		
   	
</div>
</body>
</html>