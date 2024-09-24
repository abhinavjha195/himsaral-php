<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Consolidated Mark List</title>
    <!-- Bootstrap CSS -->
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
        }
        .containerr{border: 1px solid #ddd;}

        .header {
            margin-bottom: 20px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 15px;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .header img {
            width: 100px;
            margin: 20px;
        }

        .header h1 {
            font-size: 26px;
            color: #d9534f;
            margin: 0;
            padding-top: 10px;
        }

        .header p {
            font-size: 14px;
            margin: 0;
            color: #000;
        }

        .header p span {
            color: #d9534f;
            font-weight: bold;
        }

        h4,
        h3 {
            font-weight: bold;
            color: #333;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        th {
            background-color: #0275d8;
            /* Dark blue for table headers */
            color: white;
            border: 1px solid #ddd;
        }

        td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: center;
        }

        td:nth-child(odd) {
            background-color: #f2f2f2;
            /* Light gray for alternating rows */
        }

        .scholastic-total,
        .co-scholastic-section {
            text-align: center;
        }

        .footer {
            margin-top: 50px;
            text-align: center;
        }

        .footer div {
            width: 33.3%;
            display: inline-block;
            vertical-align: top;
            margin: 0 10px;
        }

        /* Color the "Scholastic Total" section */
        .scholastic-total table,
        .co-scholastic-section table {
            background-color: #f7f7f7;
        }

        /* Custom styles for the bottom footer section */
        .footer div strong {
            display: block;
            padding: 10px 0;
            background-color: #5cb85c;
            /* Green background */
            color: white;
        }
    </style>
</head>

<body>

    <div class="container">
        <div class="row">
            <div class="col-sm-12">
                <div class="header">
                    <div class="box-left">
                        <img src="https://via.placeholder.com/100" alt="School Logo">
                    </div>
                    <div class="box-right">
                        <h1>S.I.S Public School</h1>
                        <p>Sant Isher Singh, nurturing excellence<br>Affiliated to C.B.S.E. (1630176)</p>
                        <p><span>Website: https://sisps.co.in </span> &nbsp; <span>Email: santhisersinghpublicschool7@gmail.com</span></p>
                    </div>
                </div>

                <h3 class="text-center">Final Report</h3>
                <h4 class="text-center">Class 10th</h4>

                <!-- Report Title -->

                <div class="row mx-4 my-4">
                    <div class="col-md-6">
                        <span><strong>Admission No:</strong> 3610 <br></span>
                        <span><strong>Father's Name:</strong> SHER SINGH<br></span>
                    </div>
                    <div class="col-md-6 text-right">
                        <span><strong>Student Name:</strong> ISHA <br></span>
                        <span><strong>Mother's Name:</strong> LAXMI DEVI<br></span>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th rowspan="2">Subject</th>
                            <th colspan="2">PA I - 2022-23</th>
                            <th colspan="2">PA II - 2022-23</th>
                            <th rowspan="2">Half Yearly Examination 2022-23</th>
                            <th colspan="2">Pre-Board I - 2022-23</th>
                            <th colspan="2">Pre-Board II - 2022-23</th>
                            <th rowspan="2">Final</th>
                        </tr>
                        <tr>
                            <th>Marks Obt.</th>
                            <th>Max Marks</th>
                            <th>Marks Obt.</th>
                            <th>Max Marks</th>
                            <th>Marks Obt.</th>
                            <th>Max Marks</th>
                            <th>Marks Obt.</th>
                            <th>Max Marks</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>English</td>
                            <td>16.00</td>
                            <td>20.00</td>
                            <td>12.50</td>
                            <td>20.00</td>
                            <td>68.00</td>
                            <td>60.00</td>
                            <td>80.00</td>
                            <td>40.00</td>
                            <td>80.00</td>
                            <td>62.26</td>
                        </tr>
                        <tr>
                            <td>Mathematics</td>
                            <td>8.00</td>
                            <td>20.00</td>
                            <td>10.00</td>
                            <td>20.00</td>
                            <td>58.00</td>
                            <td>115.00</td>
                            <td>80.00</td>
                            <td>35.87</td>
                            <td>100.00</td>
                            <td>69.52</td>
                        </tr>
                        <!-- Add more rows as needed -->
                    </tbody>
                </table>

                <div class="scholastic-total">
                    <h4>Scholastic Total</h4>
                    <table>
                        <tr>
                            <th>Total Marks Obtained</th>
                            <th>Total Maximum Marks</th>
                            <th>Percentage</th>
                        </tr>
                        <tr>
                            <td>356.41</td>
                            <td>600.00</td>
                            <td>59.40%</td>
                        </tr>
                    </table>
                </div>

                <!-- <div class="co-scholastic-section">
                    <h4>Co-Scholastics:</h4>
                    <table>
                        <thead>
                            <tr>
                                <th rowspan="2">Subject</th>
                                <th colspan="2">PA I - 2022-23</th>
                                <th rowspan="2">Half Yearly Examination 2022-23</th>
                                <th colspan="2">Pre-Board I - 2022-23</th>
                                <th rowspan="2">Final</th>
                            </tr>
                            <tr>
                                <th>Grade</th>
                                <th>Grade</th>
                                <th>Grade</th>
                                <th>Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Computer Education</td>
                                <td>C1</td>
                                <td>A1</td>
                                <td>B1</td>
                                <td></td>
                                <td></td>
                                <td>C1</td>
                            </tr>
                        </tbody>
                    </table>
                </div> -->

                <div class="footer">
                    <div>
                        <strong>Class Incharge</strong>
                    </div>
                    <div>
                        <strong>Co-ordinator</strong>
                    </div>
                    <div>
                        <strong>Principal</strong>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS and dependencies -->
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.2/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>

</html>
