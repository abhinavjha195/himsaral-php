import React, { Component } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';

import Script from "@gumgum/react-script-tag";

import Copyright from "../basic/Copyright";

import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";
import { add } from "lodash";

const base_url=location.protocol+'//'+location.host+'/';	 

class SupplierAdd extends Component {

    constructor(props) {
        super(props)
        this.state = {
            location:'',
            area_code: '',
            supplier_name: '',
            phone1: '',
            address: '',
            phone2: '',
            gst: '',
            email: '',
            website: '',
            formMessage:'',
			isLoading:true,	
            errors: []
        }
        this.handleCreateNewItem = this.handleCreateNewItem.bind(this)
        this.hasErrorFor = this.hasErrorFor.bind(this)
        this.renderErrorFor = this.renderErrorFor.bind(this)
        this.input = React.createRef();
    }

    handleCreateNewItem(event) {
        event.preventDefault();
        const { location, area_code, supplier_name, phone1, address, phone2, gst, email, website } = event.target

        const data = {
            location: location.value,
            area_code: area_code.value,
            supplier_name:supplier_name.value,
            phone1:phone1.value,
            address: address.value,
            phone2: phone2.value,
            gst: gst.value,
            email: email.value,
            website: website.value
        }


        axios.post(`${base_url}api`+'/supplier/create', data)	
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
                    window.location.href = base_url+"supplier_list";		

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
   
}   

    render() {
		
const isLoad = this.state.isLoading;    			

if (isLoad) {  

//return null;  		
			 		
}

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
                                        <h4>Add Supplier</h4>
                                    </div>
                                </div>
                                <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                                    <ol className="breadcrumb">
                                        <li><a href={`/supplier_list`} className="btn bg-blue-soft text-blue"><i className="fa fa-angle-double-left"></i> Back to List</a></li>
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
                                                            <label>Location</label>
                                                            <input type='text' className={`form-control ${this.hasErrorFor('location') ? 'is-invalid' : ''}`} name='location'
                                                                ref={this.input}  />{this.renderErrorFor('location')}
                                                        </div>

                                                        <div className="form-group col-md-6">
                                                            <label>Area Code</label>
                                                            <input type='text' className={`form-control ${this.hasErrorFor('area_code') ? 'is-invalid' : ''}`} name='area_code'
                                                                ref={this.input}  />{this.renderErrorFor('area_code')}
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label>Name</label>
                                                            <input type='text' className={`form-control ${this.hasErrorFor('supplier_name') ? 'is-invalid' : ''}`} name='supplier_name'
                                                                ref={this.input}  />{this.renderErrorFor('supplier_name')}
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label>Phone No1</label>
                                                            <input type='text' className={`form-control ${this.hasErrorFor('phone1') ? 'is-invalid' : ''}`} name='phone1'
                                                                ref={this.input}  />{this.renderErrorFor('phone1')}
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label>Address</label>
                                                            <input type='text' className={`form-control ${this.hasErrorFor('address') ? 'is-invalid' : ''}`} name='address'
                                                                ref={this.input}  />{this.renderErrorFor('address')}
                                                        </div>

                                                        <div className="form-group col-md-6">
                                                            <label>Phone No2</label>
                                                            <input type='text' className={`form-control ${this.hasErrorFor('phone2') ? 'is-invalid' : ''}`} name='phone2'
                                                                ref={this.input}  />{this.renderErrorFor('phone2')}
                                                        </div>

                                                        <div className="form-group col-md-6">
                                                            <label>GSTIN</label>
                                                            <input type='text' className={`form-control ${this.hasErrorFor('gst') ? 'is-invalid' : ''}`} name='gst'
                                                                ref={this.input}  />{this.renderErrorFor('gst')}
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label>Email</label>
                                                            <input type='text' className={`form-control ${this.hasErrorFor('email') ? 'is-invalid' : ''}`} name='email'
                                                                ref={this.input}  />{this.renderErrorFor('email')}
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label>Website</label>
                                                            <input type='text' className={`form-control ${this.hasErrorFor('website') ? 'is-invalid' : ''}`} name='website'
                                                                ref={this.input}  />{this.renderErrorFor('website')}
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

export default SupplierAdd;
