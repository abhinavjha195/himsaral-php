import React, { Component } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';

import Script from "@gumgum/react-script-tag";

import Copyright from "../basic/Copyright";

import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url = location.protocol + '//' + location.host + '/';

class LeftEmployeeEntry extends Component {

    constructor(props) {
        super(props)
        this.state = {
            emp_no: '',
            empData: [],
            errors: [],
            formMessage: ""
        }
        this.hasErrorFor = this.hasErrorFor.bind(this)
        this.renderErrorFor = this.renderErrorFor.bind(this)
        this.handleLoad = this.handleLoad.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.input = React.createRef();
    }

    handleLoad(event) {
        event.preventDefault();
        const { emp_no } = event.target

        const data = {
            emp_no: emp_no.value,
        }
        // console.log(data);

        axios.post(`${base_url}api` + `/employee/loadEmployee`, data)
            .then(response => {
                // console.log(response.data);
                if (response.data.status === 'failed') {
                    this.setState({
                        formMessage: response.data.message,
                        empData: [],
                        errors: response.data.errors
                    });
                }
                else {
                    this.setState({
                        empData: response.data.data,
                        errors: [],
                        emp_no: emp_no.value
                    });
                }
            })
            .catch(error => {
                console.log(error.message);
            });
    }
    handleSave(event) {
        event.preventDefault();
        const { emp_id, leaving_dt, reason } = event.target

        const data = {
            emp_id: emp_id.value,
            emp_no: this.state.emp_no,
            leaving_dt: leaving_dt.value,
            reason: reason.value
        }

        axios.post(`${base_url}api` + `/employee/leftEmployee`, data)
            .then(response => {
                if (response.data.status === 'failed') {
                    this.setState({
                        errors: response.data.errors
                    });
                }
                else {
                    this.setState({
                        formMessage: response.data.message,
                    });
                   
                        window.location.href = base_url+"left_employee";	
                    	
                }
            })
            .catch(error => {
                console.log(error.message);
            });
    }
    hasErrorFor(field) {
        return !!this.state.errors[field]
    }
    renderErrorFor(field) {
        if (this.hasErrorFor(field)) {
            return (<span className='invalid-feedback'> <strong>{this.state.errors[field][0]}</strong> </span>)
        }
    }

    formatDate(dateStr) {
        const [year, month, day] = dateStr.split('-');
        let newDate = `${day}-${month}-${year}`;
        return newDate;
    }
    render() {
        const date = new Date();
        var day = ('0' + date.getDate()).slice(-2);
        var month = ('0' + (date.getMonth() + 1)).slice(-2);
        var year = date.getFullYear();

        var current_date = year + '-' + month + '-' + day;

        let empData = this.state.empData;
        // console.log(this.state.emp_no);
        let emp_id, name, doj, father_name, address = "";
        empData.length > 0
            && empData.map((item, i) => {
                emp_id = item.id;
                name = item.emp_name;
                doj = item.doj;
                father_name = item.father_name;
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

                                                            <input type='text' className={`form-control ${this.hasErrorFor('emp_no') ? 'is-invalid' : ''}`} name='emp_no'
                                                                ref={this.input} />{this.renderErrorFor('emp_no')}
                                                        </div>
                                                        <div className="form-group col-sm-1">
                                                            <input type="submit" className="btn btn-primary" value="Load" />
                                                        </div>
                                                    </div>
                                                   


                                                </form>
                                                {

                                                    (empData.length > 0) ? (
                                                        <form onSubmit={this.handleSave}>
                                                            <div className="form-row">
                                                                <div className="d-none">
                                                                    <input type='text' className={`form-control`} defaultValue={emp_id} name="emp_id" hidden />
                                                                </div>
                                                                <div className="form-group col-md-6">
                                                                    <label>Employee Name</label>
                                                                    <input type='text' className={`form-control`} defaultValue={name} name="name" disabled />
                                                                </div>
                                                                <div className="form-group col-md-6">
                                                                    <label>Joining Date</label>
                                                                    <input type='text' className={`form-control`} defaultValue={this.formatDate(doj)} />
                                                                </div>
                                                                <div className="form-group col-md-6">
                                                                    <label>Father Name</label>
                                                                    <input type='text' className={`form-control`} defaultValue={father_name} disabled />
                                                                </div>
                                                                <div className="form-group col-md-6">
                                                                    <label>Leaving Date</label>
                                                                    <input type="date" className="form-control input-daterange-timepicker" name="leaving_dt"
                                                                        defaultValue={current_date} ref={this.input} />
                                                                </div>
                                                                <div className="form-group col-md-6">
                                                                    <label>Address</label>
                                                                    <input type='text' className={`form-control`} defaultValue={address} disabled />
                                                                </div>
                                                                <div className="form-group col-md-6">
                                                                    <label>Reason For Leaving</label>
                                                                    <input type='text'className={`form-control ${this.hasErrorFor('reason') ? 'is-invalid' : ''}`} name="reason"  />
                                                                    {this.renderErrorFor('reason')}
                                                                </div>
                                                                <div className="form-group col-md-12 mt-4">
                                                                    <input type="submit" className="btn btn-primary mt-1 float-right" value="Save" />
                                                                </div>
                                                              
                                                            </div>
                                                        </form>
                                                    ) : ""
                                                }
                                                <h5 className="mt-3" style={{ color: "darkred" }}>{this.state.formMessage}</h5>
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

export default LeftEmployeeEntry;
