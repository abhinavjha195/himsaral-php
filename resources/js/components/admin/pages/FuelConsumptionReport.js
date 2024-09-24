import React, { Component } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import ServerTable from 'react-strap-table';
import Script from "@gumgum/react-script-tag";

import Copyright from "../basic/Copyright";

import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";
import Log, { colors } from "laravel-mix/src/Log";		

const base_url = location.protocol + '//' + location.host + '/';  

class FuelConsumptionReport extends Component {

    constructor(props) {
        super(props)
        this.state = {
            formMessage: '',
            errors: [],
            vehicleData: [],
            fuelData: [],
            vehicle_id: "",
            date: [],
            id: "",
            dateArr: [],
            vehicle_no: "",
            show: "",
            showError: false,
            showSuccess: false,
			isLoading:true,				
        }
        this.hasErrorFor = this.hasErrorFor.bind(this)
        this.renderErrorFor = this.renderErrorFor.bind(this)
        this.handleChanges = this.handleChanges.bind(this)
        this.handleShow = this.handleShow.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.handleExcel = this.handleExcel.bind(this);
        this.input = React.createRef();
    }

    hasErrorFor(field) {
        return !!this.state.errors[field]
    }
    renderErrorFor(field) {
        if (this.hasErrorFor(field)) {
            return (<span className='invalid-feedback'> <strong>{this.state.errors[field][0]}</strong> </span>)
        }
    }



    handleChanges(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }


    handleDate(e) {
        let date = this.state.date;

        var idx = date.map(function (val) { return val.name }).indexOf(e.target.name);
        if (idx > -1) {
            date[idx].value = e.target.value;
        } else {
            date.push({ name: e.target.name, value: e.target.value });
        }
        this.setState({ date: date })
    }

    handleShow(e) {

        let id = this.state.vehicle_id;

        let date = this.state.date.map(function (obj) {
            return obj.value;
        }).toString();;
        let date_name;

        let current_date = new Date();
        var day = ('0' + current_date.getDate()).slice(-2);
        var month = ('0' + (current_date.getMonth() + 1)).slice(-2);
        var year = current_date.getFullYear();
        current_date = (year + '-' + month + '-' + day).toString();

        if (this.state.date.length == 2) {
            date = date;
        }
        else if (this.state.date.length == 1) {
            date_name = this.state.date.map(function (obj) {
                return obj.name;
            });
            if (date_name == 'from_date') {
                date = date + ',' + current_date;
            }
            else {
                date = current_date + ',' + date;
            }

        }
        else {
            date = current_date + "," + current_date;
        }
        if(id.length > 0) {
            axios.get(`${base_url}api/fuelconsumption/getconsumptionreport/${id}/${date}`).then(response => {
                // console.log(response.data.data.length);
                if(response.data.data.length >  0) {
                    this.setState({
                        fuelData: response.data.data ? response.data.data : [],
                        showError: false,
                        vehicle_no: response.data.data[0].registration_no,
                        message: ""
                    });
                }
                else {
                    this.setState({
                        fuelData: []
                    })
                }

            })
            .catch(error => {
                console.log(error.message);
            })
        }
        else {
            this.setState({
                showError: true,
                message: "Select Vehicle RegNo"
            })
        }

    }
    handleExcel(e) {
        let id = this.state.vehicle_id;
        console.log(this.state.vehicle_no);

        let date = this.state.date.map(function (obj) {
            return obj.value;
        }).toString();;
        let date_name;

        let current_date = new Date();
        var day = ('0' + current_date.getDate()).slice(-2);
        var month = ('0' + (current_date.getMonth() + 1)).slice(-2);
        var year = current_date.getFullYear();
        current_date = (year + '-' + month + '-' + day).toString();

        if (this.state.date.length == 2) {
            date = date;
        }
        else if (this.state.date.length == 1) {
            date_name = this.state.date.map(function (obj) {
                return obj.name;
            });
            if (date_name == 'from_date') {
                date = date + ',' + current_date;
            }
            else {
                date = current_date + ',' + date;
            }

        }
        else {
            date = current_date + "," + current_date;
        }

        axios.get(`${base_url}api/fuelconsumption/getExcel?vechile_id=${id}&date=${date}`,{responseType: 'blob'})
        .then(response => {
            // console.log(response);
                let name = this.state.vehicle_no.toLowerCase()+"("+current_date+")"+'.xlsx';
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', name);
                document.body.appendChild(link);
                link.click();
        })
        .catch(error => {
            console.log(error.message);
        })
    }

    componentDidMount() {
		
	const isAuthenticated = localStorage.getItem("isLoggedIn");	
	const token = localStorage.getItem("login_token");	  
	
	axios.get(`${base_url}api/checkauth?api_token=${token}`).then(response => {		
		console.log(response);	
		if (response.data.status === 'successed')     
		{				
			this.setState({ isLoading: false });    
		}
		else
		{
			localStorage.clear();				
			window.location.href = base_url+"login";    			   
		}	 
				
	})
	.catch(error => {  	   
	   console.log(error.message); 	
	})   
	
	setInterval(() => {
  
	axios.get(`${base_url}api/setauth?api_token=${token}`).then(response => {	
		console.log(response);	
		if (response.data.status !== 'successed')     
		{  				
			localStorage.clear();				
			window.location.href = base_url+"login";    	
		}
		else
		{
			this.setState({ isLoading: false });    		   
		}	 
				
	})
	.catch(error => {  	   
	   console.log(error.message); 	
	})   
  
}, 30000);	 
	
	if(!isAuthenticated)
	{
		window.location.href = base_url+"login"; 					
	} 	 	

		
        axios.get(`${base_url}api`+'/vehicle/getVehicle').then(response => {		
            // console.log(response.data);
            this.setState({
                vehicleData: response.data.data ? response.data.data : [],
            });
        })
            .catch(error => {
                console.log(error.message);
            });
    }

    refreshTable() {
        this.serverTable.current.refreshData();
    }

    render() {
		
const isLoad = this.state.isLoading;    			

if (isLoad) {  

//return null;  		
			 		
}    

        const { vehicleData } = this.state;
        const { fuelData } = this.state;
        let fuel_sum = fuelData.reduce((accumulator, object) => {
            return accumulator + object.fuel_qty;
          }, 0);
        let fuel_amt = fuelData.reduce((accumulator, object) => {
            return accumulator + object.amount;
          }, 0);

        let vehicleList = vehicleData.length > 0
            && vehicleData.map((item, i) => {
                return (
                    <option key={i} value={item.id}>{item.registration_no}</option>
                )
            }, this);
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
                                        <h4>Routewise Student List</h4>
                                    </div>
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
                                                <form >
                                                    <div className="form-row">
                                                        <div className="form-group col-md-4">
                                                            <label>Vehicle Reg No.</label>
                                                            <select className={`form-control ${this.hasErrorFor('vehicle_id') ? 'is-invalid' : ''}`} id="vehicle_id"
                                                                name="vehicle_id" ref={this.input} onChange={this.handleChanges}>
                                                                <option value="" defaultValue={'DEFAULT'}>Select RegNo</option>
                                                                {vehicleList}
                                                            </select>
                                                            {this.renderErrorFor('vehicle_id')}
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label>From Date</label>
                                                            <input type="date" className="form-control input-daterange-timepicker" name="from_date"
                                                                defaultValue={(this.state.date.length > 0) ? this.state.date : current_date}
                                                                onChange={this.handleDate} ref={this.input} />
                                                            {this.renderErrorFor('from_date')}
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label>To Date</label>
                                                            <input type="date" className="form-control input-daterange-timepicker" name="to_date"
                                                                defaultValue={(this.state.date.length > 0) ? this.state.date : current_date}
                                                                onChange={this.handleDate} ref={this.input} />
                                                            {this.renderErrorFor('to_date')}
                                                        </div>

                                                        <div className="form-group col-sm-6">
                                                            <input type="button" className="btn btn-primary btn-sm " onClick={this.handleShow} value="Show" />
                                                        </div>

                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {
                                (fuelData.length > 0) ? (
                                    <div className="form-group col-md-12 mrb-0 my-4">
                                        <div className="print-id-card-table">
                                            <div className="table-responsive">
                                                <table className="table table-bordered table-hover table-condensed">
                                                    <thead>
                                                        <tr>
                                                            <th>Filling Date</th>
                                                            <th>Bill No</th>
                                                            <th>Qty</th>
                                                            <th>Amount</th>
                                                            <th>Starting Km</th>
                                                            <th>Ending Km</th>
                                                            <th>Fuel Type</th>
                                                            <th>Payment</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {fuelData.map((item, key) => (
                                                            <tr key={key}>
                                                                <td>{item.filling_date}</td>
                                                                <td>{item.bill_no}</td>
                                                                <td>{item.fuel_qty}</td>
                                                                <td>{item.amount}</td>
                                                                <td>{item.start_dist}</td>
                                                                <td>{item.end_dist}</td>
                                                                <td>{item.type}</td>
                                                                <td>{item.pay_mode}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                    <tbody>
                                                    <tr>
                                                        <th>Total (in Rs.)</th>
                                                        <th></th>
                                                        <th>{fuel_sum.toFixed(2)}</th>
                                                        <th>{fuel_amt.toFixed(2)}</th>
                                                        <th></th>
                                                        <th></th>
                                                        <th></th>
                                                        <th></th>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                                <div className="profile-tab-btn text-left">
                                                    <input type="button" className="btn btn-primary btn-sm mx-1" onClick={this.handleExcel} value="Export" />
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                ) : <h5 className="ml-3 mt-3" style={{ color: "darkred" }}>No record found</h5>
                            }

                        </div>
                    </div>

                    <Copyright />


                </div>

            </>		

        );

    }

}

export default FuelConsumptionReport;
