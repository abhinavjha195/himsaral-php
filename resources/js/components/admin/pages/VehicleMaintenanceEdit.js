import React, { Component } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';

import Script from "@gumgum/react-script-tag";

import Copyright from "../basic/Copyright";

import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url=location.protocol+'//'+location.host+'/';	

class VehicleMaintenanceEdit extends Component {

    constructor(props) {
        super(props)
        this.state = {
            maintenance_id: '',
            maintenance_date: '',
            vehicle_id: '',
            description: '',
            bill_no: '',
            expenses: '',
            formMessage: '',
			isLoading:true,	
            errors: [],
            vehicleData: [],
            maintenanceData: [],
            vehicle_maintainData: []
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleUpdateItem = this.handleUpdateItem.bind(this)
        this.hasErrorFor = this.hasErrorFor.bind(this)
        this.renderErrorFor = this.renderErrorFor.bind(this)
        this.input = React.createRef();
    }
    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }
    handleUpdateItem(event) {
        event.preventDefault();

        const urlString = window.location.href;
        const url = new URL(urlString);
        const lastSegment = url.pathname.split('/').pop();
        const id = lastSegment;
        const { maintenance_date, maintenance_id, vehicle_id, description, bill_no, expenses  } = event.target

        const { history } = this.props
        const data = {
            maintenance_date: maintenance_date.value,
            maintenance_id: maintenance_id.value,
            vehicle_id: vehicle_id.value,
            description: description.value,
            bill_no: bill_no.value,
            expenses: expenses.value,
        }


        axios.post(`${base_url}api`+`/vehiclemaintenance/update/${id}`, data).then(response => {
            console.log(response.data);
            if (response.data.status === 'failed') {
                // redirect to the homepage
                this.setState({
                    formMessage: response.data.message,
                    errors: response.data.errors
                })                  

            }
            else {
                this.setState({
                    formMessage: response.data.message,
                    errors: []
                })
                window.location.href = base_url+"vehicle_maintenance_list";	

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
        const urlString = window.location.href;
        const url = new URL(urlString);
        const lastSegment = url.pathname.split('/').pop();
        const id = lastSegment;
		
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


        axios.get(`${base_url}api`+`/vehiclemaintenance/edit/${id}`).then(response => {
            console.log(response.data);
            this.setState({
                vehicleData: response.data.data.vehicle_data ? response.data.data.vehicle_data : [],
                maintenanceData: response.data.data.maintenance_data ? response.data.data.maintenance_data : [],
                vehicle_maintainData: response.data.data.vehicle_maintain_data ? response.data.data.vehicle_maintain_data : [],

            });
        })
            .catch(error => {
                console.log(error.message);
            })
    }

    render() {
		
const isLoad = this.state.isLoading;    			

if (isLoad) {  

//return null;  		
			 		
}

        let vehicleRows = this.state.vehicleData;
        let maintenanceRows = this.state.maintenanceData;
        let vehicle_maintainRow = this.state.vehicle_maintainData;

        let maintenance_id = '';
        let vehicle_id = '';
        let maintenance_date = '';
        let description = '';
        let bill_no = '';
        let expenses = '';

        vehicle_maintainRow.length > 0
            && vehicle_maintainRow.map((item, i) => {

                maintenance_id = item.maintenance_id;
                vehicle_id = item.vehicle_id;
                maintenance_date = item.maintenance_date;
                description = item.description;
                bill_no = item.bill_no;
                expenses = item.expenses;

            }, this);



        let vehicleList = vehicleRows.length > 0
            && vehicleRows.map((item, i) => {

                return (
                    <option key={i} value={item.id}>{item.registration_no}</option>
                )

            }, this);

        let maintenanceList = maintenanceRows.length > 0
            && maintenanceRows.map((item, i) => {

                return (
                    <option key={i} value={item.maintenance_id}>{item.maintenance_type}</option>
                )

            }, this);

        return (
            <>	



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
                                        <h4>Edit Vehicle Maintenance</h4>
                                    </div>
                                </div>
                                <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                                    <ol className="breadcrumb">		
                                        <li><a href={`/vehicle_maintenance_list`} className="btn bg-blue-soft text-blue"><i className="fa fa-angle-double-left"></i> Back to List</a></li>
                                    </ol>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-xl-12 col-xxl-12">
                                    <div className="card">

                                        <div className="card-body">

                                            <div className="basic-form form-own">
                                                <form onSubmit={this.handleUpdateItem}>
                                                    <div className="form-row">

                                                        <div className="form-group col-md-6">
                                                            <label>Maintenance Date</label>
                                                            <input type='text' className={`form-control ${this.hasErrorFor('maintenance_date') ? 'is-invalid' : ''}`} name='maintenance_date'
                                                                ref={this.input} defaultValue={maintenance_date}  />{this.renderErrorFor('maintenance_date')}
                                                        </div>

                                                        <div className="form-group col-md-6">
                                                            <label>Maintenance Type</label>
                                                            <select className={`form-control ${this.hasErrorFor('maintenance_id') ? 'is-invalid' : ''}`}  name="maintenance_id" value={this.state.maintenance_id ? this.state.maintenance_id : maintenance_id} ref={this.input} onChange={(event) => this.handleChange(event)}>
                                                                <option value="">Select Type</option>
                                                                {maintenanceList}
                                                            </select>
                                                            {this.renderErrorFor('maintenance_id')}
                                                        </div>

                                                        <div className="form-group col-md-6">
                                                            <label>Vehicle Reg No.</label>
                                                            <select className={`form-control ${this.hasErrorFor('vehicle_id') ? 'is-invalid' : ''}`} name="vehicle_id" value={this.state.vehicle_id ? this.state.vehicle_id : vehicle_id} ref={this.input} onChange={(event) => this.handleChange(event)}>
                                                                <option value="">Select Type</option>
                                                                {vehicleList}
                                                            </select>
                                                            {this.renderErrorFor('maintenance_id')}
                                                        </div>

                                                        <div className="form-group col-md-6">
                                                            <label>Maintenance Desc</label>
                                                            <input type='text' className={`form-control ${this.hasErrorFor('description') ? 'is-invalid' : ''}`} name='description'
                                                                ref={this.input} defaultValue={description}  />{this.renderErrorFor('description')}
                                                        </div>

                                                        <div className="form-group col-md-6">
                                                            <label>Bill No.</label>
                                                            <input type='text' className={`form-control ${this.hasErrorFor('bill_no') ? 'is-invalid' : ''}`} name='bill_no'
                                                                ref={this.input} defaultValue={bill_no}  />{this.renderErrorFor('bill_no')}
                                                        </div>

                                                        <div className="form-group col-md-6">
                                                            <label>Total Expenses(in Rs.)</label>
                                                            <input type='text' className={`form-control ${this.hasErrorFor('expenses') ? 'is-invalid' : ''}`} name='expenses'
                                                                ref={this.input} defaultValue={expenses}  />{this.renderErrorFor('expenses')}
                                                        </div>

                                                    </div>
                                                    <input type="submit" className="btn btn-primary" value="Save Changes" />
                                                    <label className="label">{this.state.formMessage}</label>

                                                </form>
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
            </>		
        );

    }

}

export default VehicleMaintenanceEdit;
