import React, { Component } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';

import Script from "@gumgum/react-script-tag";

import Copyright from "../basic/Copyright";

import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url=location.protocol+'//'+location.host+'/';	 

class VehicleMaintenanceAdd extends Component {

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
                maintenanceData: [],
                vehicleData: []
            }
        this.handleCreateNewItem = this.handleCreateNewItem.bind(this);
		this.handleChange = this.handleChange.bind(this);      
        this.hasErrorFor = this.hasErrorFor.bind(this);
        this.renderErrorFor = this.renderErrorFor.bind(this);
        this.input = React.createRef();
    }
	
	handleChange(event){		
		event.preventDefault();		
		this.setState({ [event.target.name]:event.target.value });   
	}

    handleCreateNewItem(event) {
        event.preventDefault();
        const { maintenance_id, maintenance_date, vehicle_id, description, bill_no, expenses } = event.target

        const { history } = this.props
        const data = {
            maintenance_id: maintenance_id.value,
            maintenance_date: maintenance_date.value,
            vehicle_id: vehicle_id.value,
            description: description.value,
            bill_no: bill_no.value,
            expenses: expenses.value,
        }


        axios.post(`${base_url}api`+'/vehiclemaintenance/create', data)		
            .then(response => {
                console.log(response.data);
                if (response.data.status === 'failed') {
                    // redirect to the homepage
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

		
        axios.get(`${base_url}api`+'/maintenance/getMaintenance').then(response => {
            console.log(response.data);
            this.setState({
                maintenanceData: response.data.data ? response.data.data : [],
            });
        })
        .catch(error => {
            console.log(error.message);
        });

        axios.get(`${base_url}api`+'/vehicle/getVehicle').then(response => {
            console.log(response.data);
            this.setState({
                    vehicleData: response.data.data ? response.data.data : [],
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

        const { maintenanceData } = this.state;
        const { vehicleData } = this.state;
		
		let currDate = new Date();			
		let main_date = currDate.toISOString().substring(0,10);  

        let maintenanceList = maintenanceData.length > 0
            && maintenanceData.map((item, i) => {
            return (
                <option key={i} value={item.maintenance_id}>{item.maintenance_type}</option>
            )
        }, this);

        let vehicleList = vehicleData.length > 0
            && vehicleData.map((item, i) => {
            return (
                <option key={i} value={item.id}>{item.registration_no}</option>
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
	  HeaderPart end
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
                                        <h4>Vehicle Maintenance Entry</h4>
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
                                                <form onSubmit={this.handleCreateNewItem}>
                                                    <div className="form-row">

                                                        <div className="form-group col-sm-6">
                                                            <label>Maintenance Date</label>
                                                            <input type="date" className={`form-control ${this.hasErrorFor('maintenance_date') ? 'is-invalid' : ''}`} name="maintenance_date"
                                                             ref={this.input} value={this.state.maintenance_date?this.state.maintenance_date:main_date} onChange={this.handleChange}/>{this.renderErrorFor('maintenance_date')}
                                                        </div>

                                                        <div className="form-group col-md-6">
                                                            <label>Maintenance Type</label>
                                                            <select className={`form-control ${this.hasErrorFor('maintenance_id') ? 'is-invalid' : ''}`} id="maintenance_id" name="maintenance_id" ref={this.input}>
                                                                <option value="" defaultValue={'DEFAULT'}>Select Type</option>
                                                                {maintenanceList}
                                                            </select>
                                                            {this.renderErrorFor('maintenance_id')}
                                                        </div>

                                                        <div className="form-group col-md-6">
                                                            <label>Vehicle Reg No.</label>
                                                            <select className={`form-control ${this.hasErrorFor('vehicle_id') ? 'is-invalid' : ''}`} id="vehicle_id" name="vehicle_id" ref={this.input}>
                                                                <option value="" defaultValue={'DEFAULT'}>Select Type</option>
                                                                {vehicleList}
                                                            </select>
                                                            {this.renderErrorFor('vehicle_id')}
                                                        </div>

                                                        <div className="form-group col-md-6">
                                                            <label>Maintenance Desc</label>
                                                            <input type='text' className={`form-control ${this.hasErrorFor('description') ? 'is-invalid' : ''}`} name='description'
                                                                ref={this.input} />{this.renderErrorFor('description')}
                                                        </div>

                                                        <div className="form-group col-md-6">
                                                            <label>Bill No.</label>
                                                            <input type='text' className={`form-control ${this.hasErrorFor('bill_no') ? 'is-invalid' : ''}`} name='bill_no'
                                                                ref={this.input} />{this.renderErrorFor('bill_no')}
                                                        </div>

                                                        <div className="form-group col-md-6">
                                                            <label>Total Expenses(in Rs.)</label>
                                                            <input type='text' className={`form-control ${this.hasErrorFor('expenses') ? 'is-invalid' : ''}`} name='expenses'
                                                                ref={this.input} />{this.renderErrorFor('expenses')}
                                                        </div>
                                                    </div>
                                                    <input type="submit" className="btn btn-primary mr-2" value="Save" />
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

export default VehicleMaintenanceAdd;
