import React, { Component } from "react";
import axios from 'axios';  
import { Link } from 'react-router-dom';      

import Script from "@gumgum/react-script-tag";

import Copyright from "../basic/Copyright";

import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url=location.protocol+'//'+location.host+'/';	


class PaymentModeEdit extends Component {      
  
  constructor (props) {
  super(props)
  this.state = {  		
	showError: false,		
	showSuccess: false,		
	isLoading:true,	
	messgae: '',
	pay_mode:'',
	pay_type:'',	
	payData:[]              
  }
	   this.handleUpdate = this.handleUpdate.bind(this);   		
	   this.handleChange = this.handleChange.bind(this);	
   }
   handleChange = (event) => {
		this.setState({ [event.target.name]:event.target.value });    		  	
  }
   handleUpdate (event) {
   event.preventDefault();   
  		
  const { pay_id,pay_mode,pay_type } = event.target;      

	const data = {   		  
		pay_mode:pay_mode.value,		
		pay_type:pay_type.value           
	}  

	axios.post(`${base_url}api`+`/paymentmode/update/${pay_id.value}`,data).then(response => {   	  
		if (response.data.status === 'successed')     	
		{		
			this.setState({ showError: false, showSuccess: true, message: response.data.message});  	 			  
			window.location.href=`${base_url}`+'payment_mode_list';	
		}
		else
		{
			this.setState({ showError: true, showSuccess: false, message: response.data.message});	 			   
		}
    })
    .catch(error => {  	   
	   console.log(error.message); 	 
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
	
	axios.get(`${base_url}api`+`/paymentmode/edit/${id}`).then(response => {   
	 	
	this.setState({  			 			 			
			payData:response.data.data?response.data.data:[]   	
		});
	})
	.catch(error => {  	   
	   console.log(error.message); 									
    });		     
	
}
   
   render () {	   
   
const isLoad = this.state.isLoading;    			

if (isLoad) {  

//return null;  		
			 		
}
	
	let payid=(this.state.payData.length>0)?this.state.payData[0].id:'';  
	let paymode=(this.state.payData.length>0)?this.state.payData[0].pay_mode:'';   
	let paytype=(this.state.pay_type)?this.state.pay_type:(this.state.payData.length>0)?this.state.payData[0].pay_type:'';    
   
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
								<h4>Edit Payment Mode</h4>  
							</div>
						</div>
						<div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
							<ol className="breadcrumb">  								 
								<li><a href={`/payment_mode_list`} className="btn bg-blue-soft text-blue">
								 <i className="fa fa-angle-double-left"></i> Back to Payment Mode List
								 </a></li>     	
							</ol>
						</div>
					</div>
					{/***<!-- row -->***/}
					
					<div className="row">
					  <div className="col-xl-12 col-xxl-12">
						<div className="card">  						  
						  <div className="card-body">   							
							<div className="basic-form form-own">
							  <form onSubmit={this.handleUpdate}>
								<div className="text-center">      
									{this.state.showError ? <div className="error">{this.state.message}</div> : null}
									{this.state.showSuccess ? <div className="success">{this.state.message}</div> : null} 
								</div>  
								<div className="form-row">
								<input type="hidden" name="pay_id" value={payid}/>  
								  <div className="form-group col-md-6">
									<label>Payment Mode</label>		
									<input type="text" name="pay_mode" value={this.state.pay_mode?this.state.pay_mode:paymode} className="form-control" placeholder="Enter Payment Mode" onChange={this.handleChange}/>  
								  </div>  
								  
								  <div className="form-group col-md-6">
									<label>Payment Type</label>
									<div className="form-row">
									  <div className="form-group col-md-3">  
										<div className="form-check">
										  <input className="form-check-input" type="radio" name="pay_type" value="cash" checked={(paytype=='cash')?true:false} onChange={this.handleChange}/>  
										  <label className="form-check-label">Cash</label>
										</div>
									  </div>
									  
									  <div className="form-group col-md-3">
										<div className="form-check">
										  <input className="form-check-input" type="radio" name="pay_type" value="draft/cheque" checked={(paytype=='draft/cheque')?true:false} onChange={this.handleChange}/>  
										  <label className="form-check-label">Draft/Cheque</label>
										</div>
									  </div>
									  
									  <div className="form-group col-md-3">
										<div className="form-check">
										  <input className="form-check-input" type="radio" name="pay_type" value="online" checked={(paytype=='online')?true:false} onChange={this.handleChange}/>  
										  <label className="form-check-label">Online</label>	
										</div>
									  </div>
									  
									  <div className="form-group col-md-3">
										<div className="form-check">
										  <input className="form-check-input" type="radio" name="pay_type" value="other" checked={(paytype=='other')?true:false} onChange={this.handleChange}/>		
										  <label className="form-check-label">Others</label>  
										</div>  
									  </div>
									  
									</div>
								  </div>
								</div>{/***<!--/ form-row -->***/}  
								
								<div className="text-left btn-submit-left">   
								  <input type="submit" className="btn btn-primary" value="Save"/>
								</div>
								
							  </form>
							</div>
							
						  </div>
						</div>
					  </div>  
					</div>{/***<!--/ row -->***/}		
					
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

export default PaymentModeEdit;  		  