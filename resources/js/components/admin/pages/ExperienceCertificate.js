import React, { Component } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';

import Script from "@gumgum/react-script-tag";

import Copyright from "../basic/Copyright";

import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url = location.protocol + '//' + location.host + '/';

class ExperienceCertificate extends Component {

    constructor(props) {
        super(props)
        this.state = {
            emp_no: '',
            empData: [],
            errors: [],
            formMessage: ""
        }
        this.handleLoad = this.handleLoad.bind(this);
        this.handlePrint = this.handlePrint.bind(this);
        this.input = React.createRef();
    }

    handleLoad(event) {
        event.preventDefault();
        const { emp_no } = event.target

        const data = {
            emp_no: emp_no.value,
        }
        console.log(data);

        axios.post(`${base_url}api`+`/employee/load`, data)
            .then(response => {
                console.log(response.data);
                if (response.data.status === 'failed') {
                    this.setState({
                        formMessage: response.data.message,
                        empData: [],
                        errors: response.data.errors
                    });
                }
                else {
                    this.setState({
                        formMessage: response.data.message,
                        empData: response.data.data,
                        errors: [],
                        emp_no: emp_no.value
                    });
                }
            })
            .catch(error => {
                console.log(error.message);
            })
    }
    handlePrint(emp_no) {
        axios.get(`${base_url}api/employee/printcertificate/${emp_no}`).then(response => {		
            console.log(response);
            if (response.data.status === 'successed')
            {
                 var receipt =(typeof(response.data.data)!='object')?response.data.data:'';			
                 if(receipt !='')
                 {
                    let a = document.createElement("a");
                    let url = base_url+'print'+'/'+'experience_certificate'+'/'+receipt;
                    a.target='_blank';
                    a.href = url;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                 }
                this.setState({showErr:false,delmessage:response.data.message,errors:response.data.errors});
            }
            else
            {
                this.setState({showErr:true,delmessage:response.data.message,errors:response.data.errors});
            }
        })
        .catch(error => {
           //console.log(error.message);
            console.log(error.response.data);
        })
    }

    formatDate(dateStr) {
        const [year, month, day] = dateStr.split('-');
        let newDate = `${day}-${month}-${year}`;
        return newDate;
    }
    render() {

        let empData = this.state.empData;
        console.log(this.state.emp_no);
        let name, doj, father_name, designation, dob, department, address = "";
        empData.length > 0
            && empData.map((item, i) => {
                name = item.emp_name;
                doj = item.doj;
                dob = item.dob;
                father_name = item.father_name;
                designation = item.designationName;
                department = item.departmentName;
                address = item.permanent_address;

            }, this);
        return (
            <div>



                {/********************
				   Preloader Start
				   *********************/}

                <Preloader />

                {/********************
	Preloader end
	*********************/}

                <div id="main-wrapper">



                    {/***********************************
		HeaderPart start
	************************************/}




                    <HeaderPart />


                    {/***********************************
	  HaderPart end
	************************************/}






                    {/***********************************
		Main wrapper start
	************************************/}






                    {/***********************************
				Content body start
			************************************/}

                    <div className="content-body">
                        <div className="container-fluid">
                            <div className="row page-titles mx-0">
                                <div className="col-sm-6 p-md-0">
                                    <div className="welcome-text">
                                        <h4>Experience Letter</h4>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-xl-12 col-xxl-12">
                                    <div className="card">

                                        <div className="card-body">

                                            <div className="basic-form form-own">
                                                <form onSubmit={this.handleLoad}>
                                                    <div className="form-row">
                                                        <div className="form-group col-sm-2 mt-2">
                                                            <h5 style={{ fontWeight: "bold" }}>Employee No. </h5>
                                                        </div>
                                                        <div className="form-group col-sm-3">

                                                            <input type='text' className={`form-control`} name='emp_no'
                                                                ref={this.input} />
                                                        </div>
                                                        <div className="form-group col-sm-1">
                                                            <input type="submit" className="btn btn-primary" value="Load" />
                                                        </div>
                                                    </div>
                                                    <h5 className="mt-3" style={{ color: "darkred" }}>{this.state.formMessage}</h5>


                                                </form>
                                                {
                                                    (empData.length > 0) ? (
                                                        <div className="form-row">
                                                            <div className="form-group col-md-6">
                                                                <label>Employee Name</label>
                                                                <input type='text' className={`form-control`} defaultValue={name} />
                                                            </div>
                                                            <div className="form-group col-md-6">
                                                                <label>Joining Date</label>
                                                                <input type='text' className={`form-control`} defaultValue={this.formatDate(doj)} />
                                                            </div>
                                                            <div className="form-group col-md-6">
                                                                <label>Father Name</label>
                                                                <input type='text' className={`form-control`} defaultValue={father_name} />
                                                            </div>
                                                            <div className="form-group col-md-6">
                                                                <label>Designation</label>
                                                                <input type='text' className={`form-control`} defaultValue={designation} />
                                                            </div>
                                                            <div className="form-group col-md-6">
                                                                <label>Date of Birth</label>
                                                                <input type='text' className={`form-control`} defaultValue={this.formatDate(dob)} />
                                                            </div>
                                                            <div className="form-group col-md-6">
                                                                <label>Department</label>
                                                                <input type='text' className={`form-control`} defaultValue={department} />
                                                            </div>
                                                            <div className="form-group col-md-6">
                                                                <label>Address</label>
                                                                <input type='text' className={`form-control`} defaultValue={address} />
                                                            </div>
                                                            <div className="form-group col-md-6 mt-4">

                                                                <input type="button" className="btn btn-primary mt-1 float-right" onClick={() => this.handlePrint(`${this.state.emp_no}`)} value="Print" />
                                                            </div>

                                                        </div>
                                                    ) : ""
                                                }
                                            </div>

                                        </div>


                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/***********************************
				Content body end
			************************************/}





                    {/***********************************
				Footer Copyright start
			************************************/}

                    <Copyright />

                    {/***********************************
				Footer Copyright end
			************************************/}




                </div>
                {/***********************************
			Main wrapper end
		************************************/}
            </div>
        );

    }

}

export default ExperienceCertificate;
