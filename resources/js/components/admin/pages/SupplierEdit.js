import React, { Component } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

import Script from "@gumgum/react-script-tag";

import Copyright from "../basic/Copyright";

import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url = location.protocol + '//' + location.host + '/';	


class SupplierEdit extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showError: false,
            showSuccess: false,
			isLoading:true,	
            location: '',
            area_code: '',
            supplier_name: '',
            phone1: '',
            address: '',
            phone2: '',
            gst: '',
            email: '',
            website: '',
            messgae: '',
            errors: [],
            suppliers: []
        }
        this.formSubmit = this.formSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.hasErrorFor = this.hasErrorFor.bind(this);
        this.renderErrorFor = this.renderErrorFor.bind(this);
        this.input = React.createRef();
    }
    handleChange(event) {
        event.preventDefault();
        this.setState({ [event.target.name]: event.target.value });
    }

    hasErrorFor(field) {
        return !!this.state.errors[field]
    }
    renderErrorFor(field) {
        if (this.hasErrorFor(field)) {
            return (<span className='invalid-feedback'> <strong>{this.state.errors[field][0]}</strong></span>);
        }
    }
    formSubmit(event) {
        event.preventDefault();

        const urlString = window.location.href;
        const url = new URL(urlString);
        const lastSegment = url.pathname.split('/').pop();
        const id = lastSegment;

        let location = (this.state.location) ? this.state.location : (this.state.suppliers.length > 0) ? this.state.suppliers[0].location : '';
        let area_code = (this.state.area_code) ? this.state.area_code : (this.state.suppliers.length > 0) ? this.state.suppliers[0].area_code : '';
        let supplier_name = (this.state.supplier_name) ? this.state.supplier_name : (this.state.suppliers.length > 0) ? this.state.suppliers[0].supplier_name : '';
        let phone1 = (this.state.phone1) ? this.state.phone1 : (this.state.suppliers.length > 0) ? this.state.suppliers[0].phone1 : '';
        let address = (this.state.address) ? this.state.address : (this.state.suppliers.length > 0) ? this.state.suppliers[0].address : '';
        let phone2 = (this.state.phone2) ? this.state.phone2 : (this.state.suppliers.length > 0) ? this.state.suppliers[0].phone2 : '';
        let gst = (this.state.gst) ? this.state.gst : (this.state.suppliers.length > 0) ? this.state.suppliers[0].gst : '';
        let email = (this.state.email) ? this.state.email : (this.state.suppliers.length > 0) ? this.state.suppliers[0].email : '';
        let website = (this.state.website) ? this.state.website : (this.state.suppliers.length > 0) ? this.state.suppliers[0].website : '';

        const data = {
            location: location,
            area_code: area_code,
            supplier_name: supplier_name,
            phone1: phone1,
            address: address,
            phone2: phone2,
            gst: gst,
            email: email,
            website: website
        }

        axios.post(`${base_url}api`+`/supplier/update/${id}`, data).then(response => {
            console.log(response.data);
            if (response.data.status === 'successed') {
                this.setState({ showError: false, showSuccess: true, message: response.data.message, errors: response.data.errors });
                window.location.href = base_url + "supplier_list";
            }
            else {
                this.setState({ showError: true, showSuccess: false, message: response.data.message, errors: response.data.errors });
            }
        })
            .catch(err => {
                console.log(err.message);
                console.log(err.response.data);
            })

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


        axios.get(`${base_url}api`+`/supplier/edit/${id}`).then(response => {
            console.log(response);

            this.setState({
                suppliers: response.data.data ? response.data.data : [],
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

        let location = (this.state.location) ? this.state.location : (this.state.suppliers.length > 0) ? this.state.suppliers[0].location : '';
        let area_code = (this.state.area_code) ? this.state.area_code : (this.state.suppliers.length > 0) ? this.state.suppliers[0].area_code : '';
        let supplier_name = (this.state.supplier_name) ? this.state.supplier_name : (this.state.suppliers.length > 0) ? this.state.suppliers[0].supplier_name : '';
        let phone1 = (this.state.phone1) ? this.state.phone1 : (this.state.suppliers.length > 0) ? this.state.suppliers[0].phone1 : '';
        let address = (this.state.address) ? this.state.address : (this.state.suppliers.length > 0) ? this.state.suppliers[0].address : '';
        let phone2 = (this.state.phone2) ? this.state.phone2 : (this.state.suppliers.length > 0) ? this.state.suppliers[0].phone2 : '';
        let gst = (this.state.gst) ? this.state.gst : (this.state.suppliers.length > 0) ? this.state.suppliers[0].gst : '';
        let email = (this.state.email) ? this.state.email : (this.state.suppliers.length > 0) ? this.state.suppliers[0].email : '';
        let website = (this.state.website) ? this.state.website : (this.state.suppliers.length > 0) ? this.state.suppliers[0].website : '';


        return (
            <>		

                {/********************
               Preloader Start
               *********************/}

                <Preloader />

                {/********************
Preloader end
*********************/}

   {/***********************************
Main wrapper start
************************************/}

                <div id="main-wrapper">

                {/***********************************
    HeaderPart start
************************************/}

                <HeaderPart />


                {/***********************************
  HaderPart end
************************************/}

          
                {/**********************************
		Content body start
	**************************************/}
                <div className="content-body">
                    <div className="container-fluid">
                        <div className="row page-titles mx-0">
                            <div className="col-sm-6 p-md-0">
                                <div className="welcome-text">
                                    <h4>Update Supplier</h4>
                                </div>
                            </div>
                            <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                                <ol className="breadcrumb">
                                    <li><a href={`/supplier_list`} className="btn bg-blue-soft text-blue"><i className="fa fa-angle-double-left"></i> Back to Supplier List</a></li>
                                </ol>
                            </div>
                        </div>
                        {/******** row ****/}

                        <div className="row">
                            <div className="col-xl-12 col-xxl-12">
                                <div className="card">
                                    {/********<div className="card-header"><h4 className="card-title">Create New Exam</h4></div>********/}
                                    <div className="card-body">

                                        <div className="basic-form form-own">
                                            <form onSubmit={this.formSubmit}>
                                                {this.state.showError ?
                                                    <div className="alert alert-danger" style={{ color: "brown" }}>
                                                        <strong>{this.state.message}</strong>
                                                    </div>
                                                    : null}
                                                {this.state.showSuccess ?
                                                    <div className="alert alert-success" style={{ color: "green" }}>
                                                        {this.state.message}
                                                    </div>
                                                    : null}
                                                <div className="form-row">
                                                    <div className="form-group col-md-6">
                                                        <label>Location</label>
                                                        <input type="text" name="location" className={`form-control ${this.hasErrorFor('location') ? 'is-invalid' : ''}`} defaultValue={location} onChange={this.handleChange} />
                                                        {this.renderErrorFor('location')}
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <label>Area Code</label>
                                                        <input type="text" name="area_code" className={`form-control ${this.hasErrorFor('area_code') ? 'is-invalid' : ''}`} defaultValue={area_code} onChange={this.handleChange} />
                                                        {this.renderErrorFor('area_code')}
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <label>Name</label>
                                                        <input type="text" name="supplier_name" className={`form-control ${this.hasErrorFor('supplier_name') ? 'is-invalid' : ''}`} defaultValue={supplier_name} onChange={this.handleChange} />
                                                        {this.renderErrorFor('supplier_name')}
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <label>Phone No1</label>
                                                        <input type="text" name="phone1" className={`form-control ${this.hasErrorFor('phone1') ? 'is-invalid' : ''}`} defaultValue={phone1} onChange={this.handleChange} />
                                                        {this.renderErrorFor('phone1')}
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <label>Address</label>
                                                        <input type="text" name="address" className={`form-control ${this.hasErrorFor('address') ? 'is-invalid' : ''}`} defaultValue={address} onChange={this.handleChange} />
                                                        {this.renderErrorFor('address')}
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <label>Phone No2</label>
                                                        <input type="text" name="phone2" className={`form-control ${this.hasErrorFor('phone2') ? 'is-invalid' : ''}`} defaultValue={phone2} onChange={this.handleChange} />
                                                        {this.renderErrorFor('phone2')}
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <label>GSTIN</label>
                                                        <input type="text" name="gst" className={`form-control ${this.hasErrorFor('gst') ? 'is-invalid' : ''}`} defaultValue={gst} onChange={this.handleChange} />
                                                        {this.renderErrorFor('gst')}
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <label>Email</label>
                                                        <input type="text" name="email" className={`form-control ${this.hasErrorFor('email') ? 'is-invalid' : ''}`} defaultValue={email} onChange={this.handleChange} />
                                                        {this.renderErrorFor('email')}
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <label>Website</label>
                                                        <input type="text" name="website" className={`form-control ${this.hasErrorFor('website') ? 'is-invalid' : ''}`} defaultValue={website} onChange={this.handleChange} />
                                                        {this.renderErrorFor('website')}
                                                    </div>

                                                </div> {/******* form-row ******/}

                                                <div className="text-right btn-submit-right">
                                                    <input type="submit" className="btn btn-primary" value="Update supplier" />
                                                </div>

                                            </form>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>{/****** row ******/}

                    </div>
                </div>
                {/*****************************
		Content body end
	*************************************/}

</div>
                {/***********************************
        Main wrapper end
    ************************************/}
            </>
        );
    }
}

export default SupplierEdit;
