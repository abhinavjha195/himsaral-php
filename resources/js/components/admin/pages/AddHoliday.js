import React, { Component } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import ServerTable from 'react-strap-table';
import Script from "@gumgum/react-script-tag";

import Copyright from "../basic/Copyright";

import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";
import Log, { colors } from "laravel-mix/src/Log";

axios.defaults.baseURL = 'http://127.0.0.1:8000/api';

const base_url = location.protocol + '//' + location.host + '/';
axios.defaults.baseURL = base_url + 'api';

class AddHoliday extends Component {

    constructor(props) {
        super(props)
        this.state = {
            formMessage: '',
            errors: [],
            vehicleData: [],
            maintenanceData: [],
            checkedArr: [],
            maintenanceArr: [],
            report: [],
            mtList: [],
            vehicle_id: "",
            date: [],
            id: "",
            api_url: '',
            dateArr: [],
            show: "",
            showError: false,
            showSuccess: false,
        }
        this.hasErrorFor = this.hasErrorFor.bind(this)
        this.renderErrorFor = this.renderErrorFor.bind(this)
        this.handleCreate = this.handleCreate.bind(this);
        this.input = React.createRef();
    }

    handleCreate(e) {
        e.preventDefault();
        const { from_date, to_date, description } = e.target

        const data = {
            from_date: from_date.value,
            to_date: to_date.value,
            description: description.value,
        }
        console.log(data);
        axios.post(`${base_url}api`+'/holiday/create', data)		
            .then(response => {
                console.log(response.data);
                if (response.data.status === 'failed') {
                    this.setState({
                        formMessage: response.data.message,
                        errors: response.data.errors
                    })
                    history.push('/')

                }
                else {
                    this.setState({
                        formMessage: response.data.message,
                        errors: []
                    })
                    window.location.href = base_url+"holiday_list";		

                }
            })
            .catch(error => {
                console.log(error.message);
            })
    }

    hasErrorFor(field) {
        return !!this.state.errors[field]
    }
    renderErrorFor(field) {
        if (this.hasErrorFor(field)) {
            return (<span className='invalid-feedback'> <strong>{this.state.errors[field][0]}</strong> </span>)
        }
    }


    componentDidMount() {

    }



    render() {

        const date = new Date();
        var day = ('0' + date.getDate()).slice(-2);
        var month = ('0' + (date.getMonth() + 1)).slice(-2);
        var year = date.getFullYear();

        var current_date = year + '-' + month + '-' + day;


        return (
            <>		

                <Preloader />

                <div id="main-wrapper">

                    <HeaderPart />

                    <div className="content-body">
                        <div className="container-fluid">
                            <div className="row page-titles mx-0">
                                <div className="col-sm-6 p-md-0">
                                    <div className="welcome-text">
                                        <h4>Add New Holiday(s)</h4>
                                    </div>
                                </div>
                                <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                                    <ol className="breadcrumb">
                                        <li><a href={`/holiday_list`} className="btn bg-blue-soft text-blue"><i className="fa fa-angle-double-left"></i> Back to Holiday List</a></li>
                                    </ol>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-xl-12 col-xxl-12">
                                    <div className="card">
                                        <div className="card-body">
                                            {this.state.showError ?
                                                <div className="alert alert-danger" style={{ color: "brown" }}>
                                                    <strong>{this.state.message}</strong>
                                                </div>
                                                : null}
                                            <div className="basic-form form-own">
                                                <form onSubmit={this.handleCreate}>
                                                    <div className="form-row">

                                                        <div className="form-group col-md-6">
                                                            <label>Holiday Starts From</label>
                                                            <input type="date" className={`form-control input-daterange-timepicker ${this.hasErrorFor('from_date') ? 'is-invalid' : ''}`} 
                                                                name="from_date" defaultValue={(this.state.date.length > 0) ? this.state.date : current_date} ref={this.input} />
                                                            {this.renderErrorFor('from_date')}
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label>Holiday End To</label>
                                                            <input type="date"  className={`form-control input-daterange-timepicker ${this.hasErrorFor('to_date') ? 'is-invalid' : ''}`}
                                                                name="to_date" defaultValue={(this.state.date.length > 0) ? this.state.date : current_date} ref={this.input} />
                                                            {this.renderErrorFor('to_date')}
                                                        </div>
                                                        <div className="form-group col-md-12">
                                                            <label>Description Of Holiday</label>
                                                            <textarea  className={`form-control ${this.hasErrorFor('description') ? 'is-invalid' : ''}`} rows={10} cols={50} name="description" ref={this.input}>
                                                            </textarea>
                                                            {this.renderErrorFor('description')}
                                                        </div>

                                                        <input type="submit" className="btn btn-primary ml-3" value="Submit" />
                                                        <label className="label">{this.state.formMessage}</label>


                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <Copyright />


                </div>

            </>

        );

    }

}

export default AddHoliday;	