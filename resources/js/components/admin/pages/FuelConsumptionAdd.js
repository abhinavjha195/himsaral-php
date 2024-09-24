import React, { Component } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';

import Script from "@gumgum/react-script-tag";

import Copyright from "../basic/Copyright";

import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url=location.protocol+'//'+location.host+'/';	

class FuelConsumptionAdd extends Component {

    constructor(props) {
        super(props)
            this.state = {
                vehicle_id: '',
                filling_date: '',
                bill_no: '',
                supplier_id: '',
                fuel_id: '',
                payment_id: '',
                fuel_qty: '',
                amount: '',
                start_dist: '',
                end_dist: '',
                formMessage: '',
                errors: [],
                vehicleData: [],
                supplierData: [],
                fuelData: [],
                paymentData: [],
				isLoading:true,	    
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
        const { vehicle_id, filling_date, bill_no, supplier_id, fuel_id, payment_id, fuel_qty, amount, start_dist, end_dist } = event.target

        const { history } = this.props
        const data = {
            vehicle_id: vehicle_id.value,
            filling_date: filling_date.value,
            bill_no: bill_no.value,
            supplier_id: supplier_id.value,
            fuel_id: fuel_id.value,
            payment_id: payment_id.value,
            fuel_qty: fuel_qty.value,
            amount: amount.value,
            start_dist: start_dist.value,
            end_dist: end_dist.value,
        }


        axios.post(`${base_url}api`+'/fuelconsumption/create', data)
            .then(response => {
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
                   
				   window.location.href = base_url+"fuel_consumption_list";	  

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

		
        axios.get(`${base_url}api`+'/supplier/getSupplier').then(response => {
            console.log(response.data);
            this.setState({
                supplierData: response.data.data ? response.data.data : [],
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
        });

        axios.get(`${base_url}api`+'/payment/getPaymentMode').then(response => {
            console.log(response.data);
            this.setState({
                    paymentData: response.data.data ? response.data.data : [],
            });
        })
        .catch(error => {
            console.log(error.message);
        });

        axios.get(`${base_url}api`+'/fuel/getFuelType').then(response => {
            console.log(response.data);
            this.setState({
                    fuelData: response.data.data ? response.data.data : [],
            });
        })
        .catch(error => {
            console.log(error.message);
        });
    }

    render() {
		
				
const isLoad = this.state.isLoading;    			

if (isLoad) {  

//return null;  		
			 		
}    
		let currDate = new Date();	   
		let fill_date = currDate.toISOString().substring(0,10);     

        const { supplierData } = this.state;
        const { vehicleData } = this.state;
        const { paymentData } = this.state;
        const { fuelData } = this.state;

        let supplierList = supplierData.length > 0
            && supplierData.map((item, i) => {
            return (
                <option key={i} value={item.id}>{item.supplier_name}</option>
            )
        }, this);

        let vehicleList = vehicleData.length > 0
            && vehicleData.map((item, i) => {
            return (
                <option key={i} value={item.id}>{item.registration_no}</option>
            )
        }, this);

        let paymentList = paymentData.length > 0
            && paymentData.map((item, i) => {
            return (
                <option key={i} value={item.id}>{item.pay_mode}</option>
            )
        }, this);

        let fuelList = fuelData.length > 0
            && fuelData.map((item, i) => {
            return (
                <option key={i} value={item.id}>{item.type}</option>
            )
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
                                        <h4>Fuel Consumption Entry</h4>
                                    </div>
                                </div>
                                <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                                    <ol className="breadcrumb">
                                        <li><a href={`/fuel_consumption_list`} className="btn bg-blue-soft text-blue"><i className="fa fa-angle-double-left"></i> Back to List</a></li>
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

                                                        <div className="form-group col-md-6">
                                                            <label>Vehicle Reg No.</label>
                                                            <select className={`form-control ${this.hasErrorFor('vehicle_id') ? 'is-invalid' : ''}`} id="vehicle_id" name="vehicle_id" ref={this.input}>
                                                                <option value="" defaultValue={'DEFAULT'}>Select Type</option>
                                                                {vehicleList}
                                                            </select>
                                                            {this.renderErrorFor('vehicle_id')}
                                                        </div>

                                                        <div className="form-group col-sm-6">
                                                            <label>Filling Date</label>
                                                            <input type="date" className={`form-control ${this.hasErrorFor('filling_date') ? 'is-invalid' : ''}`} name="filling_date"
                                                             ref={this.input} value={this.state.filling_date?this.state.filling_date:fill_date} onChange={this.handleChange}/>{this.renderErrorFor('filling_date')}		
                                                        </div>

                                                        <div className="form-group col-md-6">
                                                            <label>Bill/Boucher No</label>
                                                            <input type='text' className={`form-control ${this.hasErrorFor('bill_no') ? 'is-invalid' : ''}`} name='bill_no'
                                                                ref={this.input} />{this.renderErrorFor('bill_no')}
                                                        </div>

                                                        <div className="form-group col-md-6">
                                                            <label>Supplier</label>
                                                            <select className={`form-control ${this.hasErrorFor('supplier_id') ? 'is-invalid' : ''}`}  name="supplier_id" ref={this.input}>
                                                                <option value="" defaultValue={'DEFAULT'}>Select Type</option>
                                                                {supplierList}
                                                            </select>
                                                            {this.renderErrorFor('supplier_id')}
                                                        </div>

                                                        <div className="form-group col-md-6">
                                                            <label>Fuel Type</label>
                                                            <select className={`form-control ${this.hasErrorFor('fuel_id') ? 'is-invalid' : ''}`}  name="fuel_id" ref={this.input}>
                                                                <option value="" defaultValue={'DEFAULT'}>Select Type</option>
                                                                {fuelList}
                                                            </select>
                                                            {this.renderErrorFor('fuel_id')}
                                                        </div>

                                                        <div className="form-group col-md-6">
                                                            <label>Payment Mode</label>
                                                            <select className={`form-control ${this.hasErrorFor('payment_id') ? 'is-invalid' : ''}`}  name="payment_id" ref={this.input}>
                                                                <option value="" defaultValue={'DEFAULT'}>Select Type</option>
                                                                {paymentList}
                                                            </select>
                                                            {this.renderErrorFor('payment_id')}
                                                        </div>

                                                        <div className="form-group col-md-6">
                                                            <label>Fuel Qty(in Ltrs)</label>
                                                            <input type='text' className={`form-control ${this.hasErrorFor('fuel_qty') ? 'is-invalid' : ''}`} name='fuel_qty'
                                                                ref={this.input} />{this.renderErrorFor('fuel_qty')}
                                                        </div>

                                                        <div className="form-group col-md-6">
                                                            <label>Amount</label>
                                                            <input type='text' className={`form-control ${this.hasErrorFor('amount') ? 'is-invalid' : ''}`} name='amount'
                                                                ref={this.input} />{this.renderErrorFor('amount')}
                                                        </div>

                                                        <div className="form-group col-md-6">
                                                            <label>Starting Kms</label>
                                                            <input type='text' className={`form-control ${this.hasErrorFor('start_dist') ? 'is-invalid' : ''}`} name='start_dist'
                                                                ref={this.input} />{this.renderErrorFor('start_dist')}
                                                        </div>

                                                        <div className="form-group col-md-6">
                                                            <label>Ending Kms</label>
                                                            <input type='text' className={`form-control ${this.hasErrorFor('end_dist') ? 'is-invalid' : ''}`} name='end_dist'
                                                                ref={this.input} />{this.renderErrorFor('end_dist')}
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
            </div>
        );

    }

}

export default FuelConsumptionAdd;
