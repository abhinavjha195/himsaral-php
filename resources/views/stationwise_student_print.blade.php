<!DOCTYPE html>
<html>
<head>
	<title>Stationwise Students</title>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">

<style type="text/css">

body{
    font-size:10px;
	line-height:12px;
	font-family:'Times New Roman','Arial';
	color:#555;
}
td,
th,
tr,
table {
    border-collapse: collapse;
}
table {
  width: 100%;
}

th {
  height: 40px;
}

tr {
  height: 20px;
}
.ticket {
    width: 100%;
}
#feeTable {
  width: 100%;
  border: 1px solid blue;
  padding-top: 20px
}
#feeTable td,
#feeTable th {
  border: 1px solid black;
  height: 10px;
}
</style>
</head>
<body>
@inject('helper','App\Helpers\Helper')

<div class="ticket">
        <table cellpadding="0" cellspacing="0" style="margin-top:-25px;margin-left:-20px;">
            <table style="border:0;width:100%;">
            <tr><td colspan="2" align="center"><b>{{$school[0]->school_name}}&nbsp;{{($school[0]->about=='')?'':'('.$school[0]->about.')'}}</b></td></tr>
            <tr><td colspan="2" align="center">{{$school[0]->school_address}}</td></tr>
			<tr><td colspan="2" align="center"><b>Website:</b> {{$school[0]->server_address}}</td></tr>
			<tr><td colspan="2" align="center"><b>Email:</b> {{$school[0]->school_email}}</td></tr>
			<tr><td colspan="2"><hr style="border: 1px solid black;"></td></tr>
            <tr>
				<td colspan="2">

				<table id="feeTable">
					  <tr>
						<th style="width: 20px;">#</th>
						<th style="width: 50px;" align="center">Admission No</th>
						<th style="width: 70px;" align="center">Student Name</th>
						<th style="width: 40px;" align="center">Course</th>
						<th style="width: 40px;" align="center">Class</th>
						<th style="width: 70px;" align="center">Father's Name</th>
						<th style="width: 50px;" align="center">Father's Phone No</th>
						<th style="width: 40px;" align="center">Station</th>
					  </tr>
					  @foreach($receipt as $key=>$rc)
					  <tr>
						<td style="width: 20px;" align="center">{{$key+1}}</td>
						<td style="width: 50px;" align="center">{{$rc->admission_no}}</td>
						<td style="width: 70px;" align="center">{{$rc->student_name}}</td>
						<td style="width: 40px;" align="center">{{$rc->courseName}}</td>
						<td style="width: 40px;" align="center">{{$rc->className}}</td>
						<td style="width: 70px;" align="center">{{$rc->father_name}}</td>
						<td style="width: 50px;" align="center">{{$rc->f_mobile}}</td>
						<td style="width: 40px;" align="center">{{$rc->stationName}}</td>
					  </tr>
					  @endforeach
				</table>
				</td>
			</tr>
            </table>
			<tr>
			</tr>
        </table>
		<!-- end invoice print -->

</div>

</body>
</html>
