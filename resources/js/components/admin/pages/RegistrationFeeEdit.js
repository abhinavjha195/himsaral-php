import React, { Component } from "react";
import axios from 'axios';  
import { Link } from 'react-router-dom';      	

import Script from "@gumgum/react-script-tag";

import Copyright from "../basic/Copyright";

import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url=location.protocol+'//'+location.host+'/';	


class RegistrationFeeAdd extends Component {		
  
  constructor (props) {
  super(props)
  this.state = {  	
	isLoading:true,
	showError: false,
	showSuccess: false, 	
	message:'',	
	course_id:'',
	amount:'',		
	courseData:[],	
	feeData:[],				
    errors: []  
  }
	   this.handleSubmit = this.handleSubmit.bind(this);	
	   this.handleChange = this.handleChange.bind(this);       	
	   this.hasErrorFor = this.hasErrorFor.bind(this);
	   this.renderErrorFor = this.renderErrorFor.bind(this);
	   this.input = React.createRef();  
   }
   handleChange(event){
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });   
}
   handleSubmit (event) {
  event.preventDefault();     
    const urlString = window.location.href;
    const url = new URL(urlString);   
    const lastSegment = url.pathname.split('/').pop();	
	const id = lastSegment;   

	let courseid=this.state.course_id?this.state.course_id:(this.state.feeData.length>0)?this.state.feeData[0].course_id:0;
	let amount=this.state.amount?this.state.amount:(this.state.feeData.length>0)?this.state.feeData[0].amount:0;	
  
  const data = {
	course_id: courseid,      
	fee_amount: amount  
  }	  
  
  axios.post(`${base_url}api/registrationfee/update/${id}`,data)			
    .then(response => {  		 		   
		console.log(response.data);   
		if (response.data.status === 'successed')   
		{		
			this.setState({ showError:false,showSuccess:true,message:response.data.message,errors:response.data.errors});	 
			window.location.href = base_url+'registration_fee';	
		}
		else
		{
			this.setState({ showError: true, showSuccess: false, message: response.data.message,errors:response.data.errors});	 			   
		}
    })
    .catch(error => {  	   
	   console.log(error.message); 	
	   console.log(error.response.data);	
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
	const urlString = window.location.href;
    const url = new URL(urlString);   
    const lastSegment = url.pathname.split('/').pop();	
	const id = lastSegment;  	
	
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

	axios.get(`${base_url}`+'api/class/getcourses').then(response => {  
	//console.log(response.data);	
	this.setState({  			
			courseData: response.data.data ? response.data.data : [],			
		});
	})
	.catch(error => {  	   
	   console.log(error.message); 	
    })    	
	
	axios.get(`${base_url}api/registrationfee/edit/${id}`).then(response => {  
	console.log(response.data);	
	this.setState({  			
			feeData: response.data.data ? response.data.data : [],					
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

let courseid=this.state.course_id?this.state.course_id:(this.state.feeData.length>0)?this.state.feeData[0].course_id:0;
let f_amount=this.state.amount?this.state.amount:(this.state.feeData.length>0)?this.state.feeData[0].amount:0;
		
   
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
								<h4>Registration Fee</h4>		
							</div>
						</div>
						<div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
							<ol className="breadcrumb">
								<li><a href={`/registration_fee`} className="btn bg-blue-soft text-blue">
								 <i className="fa fa-angle-double-left"></i> Back to Registration Fee List	
								 </a></li>  								 
							</ol>
						</div>
					</div> 		
					
					<div className="row">
					  <div className="col-xl-12 col-xxl-12">
						<div className="card">
						  
						  <div className="card-body">
							  
							<div className="basic-form form-own">
							  <form onSubmit={this.handleSubmit}> 		
							  {this.state.showError ?   
								  <div className="alert alert-danger" style={{color:"brown"}}>  
									<strong>{this.state.message}</strong>       	  					   
								  </div>
								 : null}   
								{this.state.showSuccess ?   
								  <div className="alert alert-success" style={{color:"green"}}>    
									{this.state.message}    
								  </div>
								 : null}	
								<div className="form-row"> 								
								  <div className="form-group col-md-6">		
									<label>Course Name</label>
									<select className={`form-control ${this.hasErrorFor('course_id') ? 'is-invalid' : ''}`} name="course_id" value={courseid} onChange={this.handleChange}>		
									  <option value="0">Select Course</option>		
									  {this.state.courseData.map( (item, key) => {     
											return (
												<option key={key} value={item.courseId}>{item.courseName}</option>   
										  )
										})}	
									</select>
									{this.renderErrorFor('course_id')}  		
								  </div>
								  
								  <div className="form-group col-md-6">		
									<label>Amount</label>		
									<input type="number" step="0.01" className={`form-control ${this.hasErrorFor('fee_amount') ? 'is-invalid' : ''}`} name="amount" placeholder="Enter amount" onChange={this.handleChange} value={f_amount} />		
									{this.renderErrorFor('fee_amount')} 		
								  </div>
								  
								</div>
								
								<div className="text-right btn-submit-right">
								  <input type="submit" className="btn btn-primary" value="Save"/>		
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

export default RegistrationFeeAdd;  