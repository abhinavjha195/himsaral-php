import React, { Component } from "react";
import axios from 'axios';  
import { Link } from 'react-router-dom';      

import Script from "@gumgum/react-script-tag";

import Copyright from "../basic/Copyright";

import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url=location.protocol+'//'+location.host+'/';	


class AddStation extends Component {
  
  constructor (props) {
  super(props)
  this.state = {  	
	isLoading:true,		 
	message:'',		
	show_1: false,  	
	show_2: false,  	
    errors: []  
  }
	   this.handleCreate = this.handleCreate.bind(this)		
	   this.hasErrorFor = this.hasErrorFor.bind(this)
	   this.renderErrorFor = this.renderErrorFor.bind(this)
	   this.input = React.createRef();  
   }
   
   handleCreate (event) {
  event.preventDefault();
  const { name,distance,bus_fare } = event.target;
  setTimeout(() => {       
      this.setState({
			 show_1:false,  		
			 show_2:false
		   })	
    },3000);  
  
  
  const data = {
	title: name.value,  
    distance: distance.value,		
	bus_fare: bus_fare.value  
  }	  
  
  axios.post(`${base_url}`+'api/station/create', data)		
    .then(response => {  		 		   
		if (response.data.status === 'successed') {		
		
		   this.setState({
			 show_1:true,  
			 show_2:false,    
			 message: response.data.message,     									
			 errors: response.data.errors    			
		   })

			window.location.href = base_url+"station_list";	  	
		
		}
		else
		{
		   this.setState({
			 show_1:false,  
			 show_2:true,   
			 message: response.data.message,     						
			 errors: response.data.errors   		
		   })
		   
		}
    })
    .catch(error => {  	   
	   console.log(error.message); 	
    })
    
   }
   hasErrorFor (field) {
	  return !!this.state.errors[field]		
   }
   renderErrorFor (field) {
	  if (this.hasErrorFor(field)) {
		return ( <span className='invalid-feedback'> <strong>{this.state.errors[field][0]}</strong> </span> )
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
   
render () {	 

const isLoad = this.state.isLoading;    			

if (isLoad) {  

//return null;  		
			 		
}  
   
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

			  {/***********************************
				Content body start
			************************************/}
			  <div className="content-body">
				<div className="container-fluid">	
					<div className="row page-titles mx-0">
						<div className="col-sm-6 p-md-0">
							<div className="welcome-text">
								<h4>Create New Station</h4>		
							</div>
						</div>
						<div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
							<ol className="breadcrumb">
								<li><a href={`/station_list`} className="btn bg-blue-soft text-blue">
								 <i className="fa fa-angle-double-left"></i> Back to Station List
								 </a></li>  								 
							</ol>
						</div>
					</div> 		
					
					<div className="row">
					  <div className="col-xl-12 col-xxl-12">
						<div className="card">
						  
						  <div className="card-body">
							   {
								this.state.show_1 ?(	
							   <div className="alert alert-success">									
									<strong>Success! </strong>{this.state.message}	
							   </div>) 							   
							   : ''		
							   }
							   {
								this.state.show_2 ?(		
							   <div className="alert alert-danger">									
									<strong>Danger! </strong>{this.state.message}		
							   </div>)
							    : ''		
							   }	
  
							<div className="basic-form form-own">
							  <form onSubmit={this.handleCreate}> 		
								<div className="form-row">
								
								  <div className="form-group col-md-4">		
									<label>Station Name</label>	
									<input type="text" className={`form-control ${this.hasErrorFor('title') ? 'is-invalid' : ''}`} id="name" name="name" ref={this.input} placeholder="Enter station name"/>
									{this.renderErrorFor('title')} 
								  </div>
								  
								  <div className="form-group col-md-4">
									<label>Distance (Kms.)</label>		
									<input type="number" step="0.01" className={`form-control ${this.hasErrorFor('distance') ? 'is-invalid' : ''}`} id="distance" name="distance" ref={this.input} placeholder="Enter distance"/>
									{this.renderErrorFor('distance')} 
								  </div>
								  
								  <div className="form-group col-md-4">
									<label>Bus Fare</label>		
									<input type="number" step="0.01" className={`form-control ${this.hasErrorFor('bus_fare') ? 'is-invalid' : ''}`} id="bus_fare" name="bus_fare" ref={this.input} placeholder="Enter bus fare"/>	
									{this.renderErrorFor('bus_fare')} 	
								  </div>
								  
								</div>
								
								<div className="text-right btn-submit-right">
								  <input type="submit" className="btn btn-primary" value="Save Station"/>
								</div>
								
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

export default AddStation;  