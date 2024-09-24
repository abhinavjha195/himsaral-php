import React, { Component } from "react";
import axios from 'axios';  
import { Link } from 'react-router-dom';      

import Script from "@gumgum/react-script-tag";

import Copyright from "../basic/Copyright";

import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url=location.protocol+'//'+location.host+'/';	


class EditStation extends Component {
  
  constructor (props) {
  super(props)
  this.state = {  		
	message:'',	
	id:0,		
	title:'',  
	distance:0,
	busfare:0,	
	show_1: false,  	
	show_2: false,
	isLoading:true,			
	stationData:[],  	
    errors: []  
  }	   
	   this.handleChange = this.handleChange.bind(this);   		
	   this.handleUpdate = this.handleUpdate.bind(this);		
	   this.hasErrorFor = this.hasErrorFor.bind(this);
	   this.renderErrorFor = this.renderErrorFor.bind(this);		
	   this.input = React.createRef();  
   }  
   
   handleChange = (event) => { 	   
	   this.setState({ [event.target.name]: event.target.value });  				
  }
   handleUpdate (event) {
	  event.preventDefault();   
	  const { id,title,distance,busfare} = event.target;	
	
	  setTimeout(() => {       
      this.setState({
			 show_1:false,  		
			 show_2:false
		   })	
    },3000);    	
	  
	  const data = { 		
		title: title.value,  
		distance: distance.value,
		busfare: busfare.value			
	  }  	
  
  axios.post(`${base_url}api`+`/station/update/${id.value}`,data).then(response => { 
		
		if (response.data.status === 'successed') {   		
			this.setState({
			 show_1:true,  
			 show_2:false,    	
			 message: response.data.message,   
			 errors: []   		
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

	   
	axios.get(`${base_url}api`+`/station/edit/${id}`).then(response => {    	
	this.setState({  			 			
			stationData:response.data.data?response.data.data:[]					  				
		});
	})
	.catch(error => {  	   
	   console.log(error.message); 			
    })  
	
}
   render () {	
   
const isLoad = this.state.isLoading;    			

if (isLoad) {  

//return null;  		
			 		
}    		
   
    let name=(this.state.stationData.length>0)?this.state.stationData[0].stationName:'';   
	let distant=(this.state.stationData.length>0)?this.state.stationData[0].distance:0;   
	let rent=(this.state.stationData.length>0)?this.state.stationData[0].busFare:0;  
   
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
								<h4>Edit Station</h4>		
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
							  <form onSubmit={this.handleUpdate}>       		
								<div className="form-row">
								<input type="hidden" name="id" value={(this.state.stationData.length>0)?this.state.stationData[0].stationId :0} ref={this.input} onChange={(event)=>this.handleChange(event)}/>	
								  <div className="form-group col-md-4">		
									<label>Station Name</label>	
									<input type="text" className={`form-control ${this.hasErrorFor('title') ? 'is-invalid' : ''}`} id="title" name="title" value={(this.state.title)?this.state.title:name} ref={this.input} onChange={(event)=>this.handleChange(event)} placeholder="Enter station name"/>	    
									{this.renderErrorFor('title')}   
								  </div>
								  
								  <div className="form-group col-md-4">
									<label>Distance (Kms.)</label>		
									<input type="number" step="0.01" className={`form-control ${this.hasErrorFor('distance') ? 'is-invalid' : ''}`} id="distance" name="distance" value={(this.state.distance)?this.state.distance:distant} onChange={(event)=>this.handleChange(event)} ref={this.input} placeholder="Enter distance"/>
									{this.renderErrorFor('distance')} 		
								  </div>
								  
								  <div className="form-group col-md-4">
									<label>Bus Fare</label>		
									<input type="number" step="0.01" className={`form-control ${this.hasErrorFor('busfare') ? 'is-invalid' : ''}`} id="busfare" name="busfare" value={(this.state.busfare)?this.state.busfare:rent} onChange={(event)=>this.handleChange(event)} placeholder="Enter bus fare"/>	
									{this.renderErrorFor('busfare')} 	
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
		  </div>
		);

	}
  
}

export default EditStation;  