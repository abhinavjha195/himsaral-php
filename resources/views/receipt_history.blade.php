<!DOCTYPE html>
<html>
<head>
<style>
table{margin: 12px 0;}table td{padding: 5px; color: black} h1{margin: 10px;} h4{margin: 8px;} p{margin: 4px; font-size: 15px;} .col-md-3{right: 50; width: 260px; top:925}table{border-collapse: collapse;}table, td, th{border:1px solid black;height:45px;} .topleft {position: absolute;top: 5px;left: 30px;padding-top:20px;} .noborder, .noborder tr, .noborder th, .noborder td {border: none;} .totalss{width: 75%; height: 15%} .lefttext{position: absolute;left: 401px;} .txtalgn{position: absolute;left: 527px;} .admno{position: absolute;left:8%;} .scadm{position:absolute;left:25%} .stdname{position:relative;left:99px;} .showstd{position:relative;left:107px;} .prncpal{position:relative;left:120px;top:19px;} .prprdby{position:relative;left:-120px;top:19px;} .chkdby{position:relative;top:19px;} .clsname{position: relative;left:185px;top:-12px;}.noborder td{border:none;} .removeborder tr{border-right: none;border-bottom: 1px solid #000}     
</style>
</head>

<body style="border:2px solid #000;">		
<img src="{{ asset('images/'.$school[0]->school_logo)}}" height="80" width="80" class="topleft hidden"> 
            <h2 class="hidden" style="text-align:center;">{{$school[0]->school_name}} {{($school[0]->about=='')?'':'('.$school[0]->about.')'}}</h2>
            <h4 class="hidden" style="text-align:center;position:relative;top:-6px;">{{$school[0]->school_address}}</h4>
            <p class="hidden" style="text-align:center;"><b> Website: {{$school[0]->server_address}} &nbsp; Email:- {{$school[0]->school_email}} </b></p><hr color="black"> <p></p>
        <div style="border-bottom:2px solid #000;" class="hidden">
            <table class="noborder hidden">
                <tbody>
                        <tr>
                            <td style="font-weight:bold" class="admno">Admission No</td>		
                            <td style="text-align:left;" class="clsname">{{$receipt[0]->admission_no}}</td>
                            <td style="font-weight:bold" class="lefttext">Student Name</td>
                            <td style="text-align:left;" class="txtalgn">{{$receipt[0]->student_name}}</td>
                        </tr>
                        <tr>
                            <td style="font-weight:bold" class="admno">Class Name</td>
                            <td style="text-align:left;" class="clsname">{{$receipt[0]->className}}</td>
                            <td style="font-weight:bold" class="lefttext">Section</td>
                            <td style="text-align:left;" class="txtalgn">A</td>
                        </tr>
                        <tr>
                            <td style="font-weight:bold" class="admno">Father Name</td>
                            <td style="text-align:left;" class="clsname">{{$receipt[0]->father_name}}</td>
                            <td style="font-weight:bold" class="lefttext">Mother Name</td>  
                            <td style="text-align:left;" class="txtalgn">{{$receipt[0]->mother_name}}</td>
                        </tr>
                </tbody>
            </table>
        </div>
        <table class="table table-bordered table-striped" style="margin-left:auto;margin-right:auto;width:670px;" id="totalMe">
            <thead>
                <tr>
                    <th class="cls">Reciept No.</th>
                    <th class="cls" style="position:relative;width:83px;">Fee Date</th>
                    <th class="cls">Fee Month</th>
                    <th class="cls">Description</th>
                    <th class="cls">Total Amount</th>
                    <th class="cls">Paid Amount</th>
                    <th class="cls">Balance Amount</th>
                </tr>
            </thead>
            <tbody>
			@foreach($receipt as $rc)   				 		
                <tr>
                    <td>
					{{$rc->ReceiptNo}}  
                    </td>
                    <td>                         
						{{date('d-m-Y',strtotime($rc->FeeDate))}}  
                    </td>
                    <td>
                        {{preg_replace("/[^a-zA-Z]+/","",$rc->FeeMonth)}}  		
                    </td>
                    <td>
                        {{$rc->cat_name}}  	  
                    </td>
                    <td style="text-align:right;" id="gettotal">{{$rc->cat_fee}}</td>	
                    <td style="text-align:right;" class="addfee">
                        {{$rc->paid_fee}}  	
                    </td>
                    <td style="text-align:right;" class="addfee">
                        {{$rc->pending_fee}}  
                    </td>  
                </tr>  				  
			@endforeach  	
            </tbody>
        </table>

    
        <div class="divClass3 form-group" style="overflow: hidden">
            <div class="form-group">
                <div class="row">
                    <div class="col-md-9">
                        <table class="table table-striped table-bordered table-hover table-checkable order-column full-width sholist removeborder" style="margin-left:auto;margin-right:auto;width:670px;">
                            <tbody> 
                                <tr>
                                    <td style="text-align:left;">Note: 
                                    </td>
                                </tr>
                                <tr>
                                <td style="text-align:left;">1.Fee Once Paid Not Refundable.</td></tr>
                                <tr>
                                    <td style="text-align:left;">2.This is Computer Generated Print. Hence No Signature Required.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </body>		
</html> 