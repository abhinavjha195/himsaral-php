import React, { Component } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';

import Script from "@gumgum/react-script-tag";

import Copyright from "../basic/Copyright";

import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url=location.protocol+'//'+location.host+'/';	

class FuelConsumptionEdit extends Component {

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
			isLoading:true,	
            errors: [],
            vehicleData: [],
            paymentData: [],
            fuelData: [],
            supplierData: [],
            fuel_consumptionData: []
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
        const { vehicle_id, filling_date, bill_no, supplier_id, fuel_id, payment_id, fuel_qty, amount, start_dist, end_dist } = event.target;

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


        axios.post(`${base_url}api`+`/fuelconsumption/update/${id}`, data).then(response => {
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


        axios.get(`${base_url}api`+`/fuelconsumption/edit/${id}`).then(response => {
            console.log(response.data);
            this.setState({
                vehicleData: response.data.data.vehicle_data ? response.data.data.vehicle_data : [],
                paymentData: response.data.data.payment_data ? response.data.data.payment_data : [],
                fuelData: response.data.data.fuel_data ? response.data.data.fuel_data : [],
                supplierData: response.data.data.supplier_data ? response.data.data.supplier_data : [],
                fuel_consumptionData: response.data.data.fuel_consumption_data ? response.data.data.fuel_consumption_data : [],

            });
            // console.log(response.data.data.supplier_data);
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
        let paymentRow = this.state.paymentData;
        let fuelRow = this.state.fuelData;
        let supplierRow = this.state.supplierData;
        let fuel_consumptionRow = this.state.fuel_consumptionData;
        // console.log(this.state.supplierData);
        // console.log(supplierRow);

        let vehicle_id = '';
        let filling_date = '';
        let bill_no = '';
        let supplier_id = '';
        let fuel_id = '';
        let payment_id = '';
        let fuel_qty = '';
        let amount = '';
        let start_dist = '';
        let end_dist = '';

        fuel_consumptionRow.length > 0
            && fuel_consumptionRow.map((item, i) => {

                vehicle_id = item.vehicle_id;
                filling_date = item.filling_date;
                bill_no = item.bill_no;
                supplier_id = item.supplier_id;
                fuel_id = item.fuel_id;
                payment_id = item.payment_id;
                fuel_qty = item.fuel_qty;
                amount = item.amount;
                start_dist = item.start_dist;
                end_dist = item.end_dist;
            }, this);



        let vehicleList = vehicleRows.length > 0
            && vehicleRows.map((item, i) => {

                return (
                    <option key={i} value={item.id}>{item.registration_no}</option>
                )

            }, this);

        let paymentList = paymentRow.length > 0
            && paymentRow.map((item, i) => {

                return (
                    <option key={i} value={item.id}>{item.pay_mode}</option>
                )

            }, this);

        let fuelList = fuelRow.length > 0
            && fuelRow.map((item, i) => {

                return (
                    <option key={i} value={item.id}>{item.type}</option>
                )

            }, this);

        let supplierList = supplierRow.length > 0
            && supplierRow.map((item, i) => {

            return (
                <option key={i} value={item.id}>{item.supplier_name}</option>
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





                {/***********************************
		HeaderPart start
	************************************/}


                <div id="main-wrapper">

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
                                        <h4>Edit Fuel Consumption</h4>
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
                                                <form onSubmit={this.handleUpdateItem}>
                                                    <div className="form-row">

                                                        <div className="form-group col-md-6">
                                                            <label>Vehicle Reg No.</label>
                                                            <select className={`form-control ${this.hasErrorFor('vehicle_id') ? 'is-invalid' : ''}`} name="vehicle_id" value={this.state.vehicle_id ? this.state.vehicle_id : vehicle_id} ref={this.input} onChange={(event) => this.handleChange(event)}>
                                                                <option value="">Select Type</option>
                                                                {vehicleList}
                                                            </select>
                                                            {this.renderErrorFor('payment_id')}
                                                        </div>

                                                        <div className="form-group col-sm-6">
                                                            <label>Filling Date</label>
                                                            <input type="date" className={`form-control ${this.hasErrorFor('filling_date') ? 'is-invalid' : ''}`} name="filling_date"
                                                             ref={this.input} defaultValue={filling_date} />{this.renderErrorFor('filling_date')}
                                                        </div>

                                                        <div className="form-group col-md-6">
                                                            <label>Bill/Boucher No</label>
                                                            <input type='text' className={`form-control ${this.hasErrorFor('bill_no') ? 'is-invalid' : ''}`} name='bill_no'
                                                                ref={this.input} defaultValue={bill_no}  />{this.renderErrorFor('bill_no')}
                                                        </div>

                                                        <div className="form-group col-md-6">
                                                            <label>Supplier</label>
                                                            <select className={`form-control ${this.hasErrorFor('supplier_id') ? 'is-invalid' : ''}`}  name="supplier_id" value={this.state.supplier_id ? this.state.supplier_id : supplier_id} ref={this.input} onChange={(event) => this.handleChange(event)}>
                                                                <option value="" defaultValue={'DEFAULT'}>Select Type</option>
                                                                {supplierList}
                                                            </select>
                                                            {this.renderErrorFor('supplier_id')}
                                                        </div>

                                                        <div className="form-group col-md-6">
                                                            <label>Fuel Type</label>
                                                            <select className={`form-control ${this.hasErrorFor('fuel_id') ? 'is-invalid' : ''}`}  name="fuel_id"  value={this.state.fuel_id ? this.state.fuel_id : fuel_id} ref={this.input} onChange={(event) => this.handleChange(event)}>
                                                                <option value="" defaultValue={'DEFAULT'}>Select Type</option>
                                                                {fuelList}
                                                            </select>
                                                            {this.renderErrorFor('fuel_id')}
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label>Payment Mode</label>
                                                            <select className={`form-control ${this.hasErrorFor('payment_id') ? 'is-invalid' : ''}`}  name="payment_id" value={this.state.payment_id ? this.state.payment_id : payment_id} ref={this.input} onChange={(event) => this.handleChange(event)}>
                                                                <option value="">Select Type</option>
                                                                {paymentList}
                                                            </select>
                                                            {this.renderErrorFor('payment_id')}
                                                        </div>

                                                        <div className="form-group col-md-6">
                                                            <label>Fuel Qty(in Ltrs)</label>
                                                            <input type='text' className={`form-control ${this.hasErrorFor('fuel_qty') ? 'is-invalid' : ''}`} name='fuel_qty'
                                                                ref={this.input} defaultValue={fuel_qty} />{this.renderErrorFor('fuel_qty')}
                                                        </div>

                                                        <div className="form-group col-md-6">
                                                            <label>Amount</label>
                                                            <input type='text' className={`form-control ${this.hasErrorFor('amount') ? 'is-invalid' : ''}`} name='amount'
                                                                ref={this.input} defaultValue={amount} />{this.renderErrorFor('amount')}
                                                        </div>

                                                        <div className="form-group col-md-6">
                                                            <label>Starting Kms</label>
                                                            <input type='text' className={`form-control ${this.hasErrorFor('start_dist') ? 'is-invalid' : ''}`} name='start_dist'
                                                                ref={this.input} defaultValue={start_dist} />{this.renderErrorFor('start_dist')}
                                                        </div>

                                                        <div className="form-group col-md-6">
                                                            <label>Ending Kms</label>
                                                            <input type='text' className={`form-control ${this.hasErrorFor('end_dist') ? 'is-invalid' : ''}`} name='end_dist'
                                                                ref={this.input} defaultValue={end_dist} />{this.renderErrorFor('end_dist')}
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
            </div>
        );

    }

}

export default FuelConsumptionEdit;
