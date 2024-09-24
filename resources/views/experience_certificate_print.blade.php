{{-- <!DOCTYPE html>
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
@foreach($employee AS $emp)
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
@endforeach
    </div>
</div>



</body>
</html> --}}
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Certificate</title>
	<style>
    body {
      letter-spacing: 0.4px;
      word-spacing: 1.5px
    }
    p {
      font-size: 16px;
    }
		.container-fluid{
			width: 700px;
			height: 1000px;
			border: 1px solid black;
		}
    .container .header {
      border-bottom: 1px solid black
    }
    .container  h1,h2, h3, h4, h5{
      text-align: center;
      margin: 5px 0;
    }
    .header p {
      text-align: center;
      margin: 5px 0;
    }
    .main {
      width: 94%;
      margin: auto;
    }
	</style>
</head>
<body>
  <?php 
    $dt = Carbon\Carbon::now();
    $current_date = $dt->format('d-m-Y');
    ?>
  @foreach($employee AS $emp)
	<div class="container-fluid">
		<div class="container">
			<div class="header">
        <h2>{{$school[0]->school_name}} {{($school[0]->about=='')?'':'('.$school[0]->about.')'}}</h2>
				<p>{{$school[0]->school_address}}</p>
				<p style="margin-bottom: 20px;">Contact no:-7676000097</p>
				<p>Website:-htlogicsdemoschool.com</p>
				<p>E-Mail:-himsaral.97@gmail.com</p>
			</div>

			<div class="main">
				<h4 style="margin-top: 10px">EXPERIENCE LETTER</h4>
				<p>Date:- {{$current_date}}</p>
				<h5>TO WHOM SO-EVER IT MAY CONCERN</h5>
				<p>
					This to certify that Mr/Ms/Mrs <b style="text-transform:capitalize">{{$emp->emp_name}}</b> been an employee of this Co/Org/Est/ from
          <b>{{$emp->doj}}</b> to <b>{{$current_date}}</b> as a <b>{{$emp->designationName}}</b> in <b>{{$emp->departmentName}}</b>. 
        </p>
      <p>
        During this period we have observed him/her as professional and discharged his work of his position
        very efficiently and conscientiously. His/Her Character and conduct during this period has been
        exemplary.
      </p>
      <p style="margin-bottom: 20px;"><b>We wish him/her every success in his/her future.</b></p>
      <p>
        Signature<br>
        (Name of Personnel/HRD Manager)<br>
        (Company Seal)
        Him Saral (a Product of H T Logics Pvt. Ltd.)<br>
        SCO 88-D CITY HEART
      </p>
			</div>
		</div>
	</div>
  @endforeach
</body>
</html>