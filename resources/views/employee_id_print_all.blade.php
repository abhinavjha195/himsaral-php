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
      width: 50%;
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
	@php $check=0; @endphp
@foreach($employee AS $emp)
@php $check++; @endphp

@if($check%3 == 0)
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
        <td colspan="8" rowspan="5"><img src="{{ ($emp->employee_image=='')?'':public_path('uploads/employee_image/'.$emp->employee_image)}}" alt='logo' style="width:25%;max-width:60px;"><br/><h3>{{$emp->emp_name}}</h3></td>
        <td>DOJ:</td>
        <td>{{$emp->doj}}</td>
    </tr>
    <tr>
        <td>Emp No: </td>
        <td>{{$emp->emp_no}}</td>
    </tr>
    <tr>
        <td>Mobile: </td>
        <td>{{$emp->mobile}}</td>
    </tr>
    <tr>
        <td>Email: </td>
        <td>{{$emp->email}}</td>
    </tr>
    <tr>
        <td>Department: </td>
        <td>{{$emp->departmentName}}</td>
    </tr>
    <tr>
        <th align="center" colspan="10" style="background-color:#87CEFA">Address: {{$emp->permanent_address}}</th>
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
				<td colspan="8" rowspan="5"><img src="{{ ($emp->employee_image=='')?'':public_path('uploads/employee_image/'.$emp->employee_image)}}" alt='logo' style="width:25%;max-width:60px;"><br/><h3>{{$emp->emp_name}}</h3></td>
				<td>DOJ:</td>
				<td>{{$emp->doj}}</td>
			  </tr>
			  <tr>
				<td>Emp No: </td>
				 <td>{{$emp->emp_no}}</td>
			  </tr>
			  <tr>
				<td>Mobile: </td>
				<td>{{$emp->mobile}}</td>
			  </tr>
			  <tr>
				<td>Email: </td>
				<td>{{$emp->email}}</td>
			  </tr>
			  <tr>
				<td>Department: </td>
                <td>{{$emp->departmentName}}</td>
			  </tr>
			  <tr>
				<th align="center" colspan="10" style="background-color:#87CEFA">Address: {{$emp->permanent_address}}</th>
			  </tr>
			</table>
		</div>

@endif
@endforeach
    </div>
</div>



</body>
</html>
