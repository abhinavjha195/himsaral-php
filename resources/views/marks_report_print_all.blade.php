
@foreach ($data as $da)
<!DOCTYPE html>
<html>

<head>
    <title>Regular Marks Report Card</title>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Student Report Card</title>
    <style>
        table {
            margin: 12px 0;
        }

        table td {
            padding: 5px;
            color: black
        }

        h1 {
            margin: 10px;
        }

        h4 {
            margin: 8px;
        }

        p {
            margin: 4px;
            font-size: 15px;
        }

        .col-md-3 {
            right: 50;
            width: 260px;
            top: 925
        }

        table {
            border-collapse: collapse;
        }

        .topleft {
            position: absolute;
            top: -2%;
            left: 2%;
        }

        .noborder,
        .noborder tr,
        .noborder th,
        .noborder td {
            border: none;
        }

        .totalss {
            width: 75%;
            height: 15%
        }

        .lefttext {
            position: absolute;
            left: 401px;
        }

        .txtalgn {
            position: absolute;
            left: 527px;
        }

        .admno {
            position: absolute;
            left: 8%;
        }

        .scadm {
            position: absolute;
            left: 25%
        }

        .stdname {
            position: relative;
            left: 99px;
        }

        .showstd {
            position: relative;
            left: 107px;
        }

        .prncpal {
            position: relative;
            left: 120px;
            top: 19px;
        }

        .prprdby {
            position: relative;
            left: -120px;
            top: 19px;
        }

        .chkdby {
            position: relative;
            top: 19px;
        }

        .clsname {
            position: relative;
            left: 185px;
            top: -12px;
        }

        .noborder td {
            border: none;
        }

        .removeborder tr {
            border-right: none;
            border-bottom: 1px solid #000
        }

        .print-area {
            max-width: 580px;
            margin: auto;
            /* margin-top: 10px; */
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
            width: 580px;
        }

        .title {
            text-align: center;
            margin: 20px 0;
            font-weight: bold;
            font-size: 18px;
            padding: 10px 0;
        }

        .student-details,
        .marks-table,
        .additional-subjects,
        .total-marks,
        .remark,
        .footer {
            width: 100%;
            margin-bottom: 20px;
        }

        .student-details td {
            padding: 5px;
        }

        .marks-table,
        .additional-subjects,
        .total-marks {
            border-collapse: collapse;
        }

        .marks-table th,
        .marks-table td,
        .additional-subjects th,
        .additional-subjects td,
        .total-marks th,
        .total-marks td {
            border: 1px solid #000;
            padding: 8px;
            text-align: center;
        }

        .remark {
            padding: 10px 0 2px 0;
        }

        .remark textarea {
            width: 100%;
            height: 60px;
            border: 1px solid #000;
            resize: none;
        }

        .footer td {
            text-align: center;
            font-weight: bold;
            padding-top: 20px;
        }
    </style>
</head>

<body>
    <div class="print-area">
  
    <table class="noborder" style="margin-left:auto;margin-right:auto;width:580px;position: relative;">
            <tr>
                <td>
                    <?php
                    $imagePath = public_path('images/logo-text.png');
                    $imageData = base64_encode(file_get_contents($imagePath));
                    $src = 'data:'.mime_content_type($imagePath).';base64,'.$imageData;
                    ?>

                    <img src="{{ $src }}" width="120" class="topleft"/>
                </td>
                <td colspan="3">
                    <p style="text-align:center;position:relative;top:-40px;"><b><span style="font-size:18px;"> {{$school[0]->school_name}} &nbsp;{{($school[0]->about=='')?'':'('.$school[0]->about.')'}}</span></b><br /><br /><span style="font-size:12px;">{{$school[0]->school_name}}, {{$school[0]->school_address}} </span><br /><span style="font-size:12px;">Phone No: {{$school[0]->school_contact}}</span><br /> <span style="font-size: 12px;">Email: {{$school[0]->school_email}}</span></p>
                    <p></p>
                    <p></p>
                    <p style="text-align:center;position:relative;top:-40px;font-size:12px;">Website:
                    {{$school[0]->server_address}}</p>
                </td>
            </tr>
        </table> 
        <hr color="black">
        

          <table class="student-details noborder">
            <tr>
                <td><strong>Admission No:</strong> {{$da['admission_no']}}</td>
                <td><strong>DOB:</strong> {{ date('d-m-Y', strtotime($da['dob'])) }}</td>
            </tr>
            <tr>
                <td><strong>Roll No:</strong>  {{$da['roll_no']}}</td>
                <td><strong>Father Name:</strong>  {{$da['father_name']}}</td>
            </tr>
            <tr>
                <td><strong>Student Name:</strong> {{$da['student_name']}}</td>
                <td><strong>Mother Name:</strong> {{$da['mother_name']}}</td>
            </tr>
        </table>

     

        <table class="marks-table">
            <thead>
                <tr>
                    <th>Subject</th>
                    <th>Internal</th>
                    <th>PA</th>
                    <th>Theory</th>
                    <th>Total</th>
                    
                </tr>
            </thead>
            <tbody>
            @php
    $totalMarksObtained = 0;
    $max_marks = 0;
    $percentage=0;
@endphp
            @foreach ($da['subjects'] as $subject) <!-- Loop through subjects -->
                     
            @php
            $intenal_mark=0;
            $assesment_mark=0;
            $sub_mark=0;
            @endphp
                            <tr>
                                <td>{{ $subject['subjectName'] }}</td>
                                @if($by_internal == '')
                                <td>{{ $subject['internal'] }}</td>


                                @else

@php
$intenal_mark = ($subject['internal']/$subject['max_mark'])*$by_internal;
@endphp
<td>{{$intenal_mark}}</td>

@endif


@if($by_assesment == '')
                                <td>{{ $subject['assessment'] }}</td>


                                @else

@php
$assesment_mark = ($subject['assessment']/$subject['max_mark'])*$by_assesment;
@endphp
<td>{{$assesment_mark}}</td>

@endif



                               
                                @if($by_theory == '')
                                <td>{{ $subject['theory'] }}</td>
                               @else

                               @php
        $sub_mark = ($subject['marks_obtained']/$subject['max_mark'])*$by_theory;
        @endphp
                               <td>{{$sub_mark}}</td>

                               @endif


                               @if($by_theory == '')
                               <td>{{ $subject['marks_obtained'] }}</td>
                               @else

                               @php
        $sub_mark = ($subject['marks_obtained']/$subject['max_mark'])*$by_theory;
        @endphp
                               <td>{{$sub_mark}}</td>

                               @endif



                                
                                
                            </tr>
                           


                            @if($by_theory == '' && $by_internal=='' && $by_assesment == '')
                            @php
                            $totalMarksObtained += $subject['marks_obtained'];
        $max_marks += $subject['max_mark'];
        @endphp

        @else
      
        @php
        $totalMarksObtained += $sub_mark+$intenal_mark+$assesment_mark;

$max_marks += $subject['max_mark'];
@endphp
        @endif
        @php
    $percentage = ($max_marks > 0) ? ($totalMarksObtained / $max_marks) * 100 : 0;
    @endphp
                    @endforeach
              
            </tbody>
        </table>


        <table class="marks-table">
            <tr>
                <td><strong>Total:</strong></td><td> {{$max_marks }}</td>
                </tr>
                <tr>
                <td><strong>Marks Obtained:</strong> </td><td>{{ $totalMarksObtained }}</td>
              
                </tr>
                <tr>
                <td><strong>Percentage:</strong> </td><td>{{ number_format($percentage, 2) }}%</td>
            </tr>
           
        </table>



        

       
        <table class="noborder" style="margin-left:auto;margin-right:auto;width:100%; height: auto; border:1px solid;">
            <tbody>
                <tr >
                    <td style="text-align:left;font-size:15px;"> <strong>Remark:</strong></td>
                </tr>
            </tbody>
        </table>
        <br/><br/>
        <table class="footer">
            <tr>
                <td>Class Incharge</td>
                <td>Co-ordinator</td>
                <td>Principal</td>
            </tr>
        </table>

       
    </div>
</body>

</html>

        @endforeach
          <!-- Add page break here -->
  <!-- <div style="page-break-after: always;"></div> -->