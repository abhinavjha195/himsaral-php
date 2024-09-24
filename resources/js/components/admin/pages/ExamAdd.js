import React, { Component } from "react";
import axios from 'axios'; 
import { Link } from 'react-router-dom';  
import Swal from 'sweetalert2';		    

import Script from "@gumgum/react-script-tag";

import Copyright from "../basic/Copyright";

import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";    			

const base_url=location.protocol+'//'+location.host+'/';   
			

class ExamAdd extends Component {		
	
  constructor(props) {
	  super(props)
	  this.state = { 		  		  
		  showError: false,
		  showSuccess: false,
		  isLoading:true,		
		  messgae:'',  		 		
		  errors:[]  
	  }
	  this.formSubmit = this.formSubmit.bind(this);    
	  this.hasErrorFor = this.hasErrorFor.bind(this);	
	  this.renderErrorFor = this.renderErrorFor.bind(this);   	
	  this.input = React.createRef();    		
} 
hasErrorFor (field) {
  return !!this.state.errors[field]					
}
renderErrorFor (field) {
  if (this.hasErrorFor(field)) 
  {
	  return (<span className='invalid-feedback'> <strong>{this.state.errors[field][0]}</strong></span>);  		
  }
} 
formSubmit(event){
	event.preventDefault();  
	const { exam_name,exam_type } = event.target;   		
	
	const data = {
		name: exam_name.value,			
		type: exam_type.value  
	}	  
	
	axios.post(`${base_url}api`+'/exam/add',data)			
		.then(response => {   
		console.log(response.data);   
		if (response.data.status === 'successed')   
		{		
			this.setState({ showError:false,showSuccess:true,message:response.data.message,errors:response.data.errors});	
			window.location.href = base_url+"exam_list";	  	
		}
		else
		{
			this.setState({ showError: true, showSuccess: false, message: response.data.message,errors:response.data.errors});	 			   
		}
	})
	.catch(err => {  	   
	   console.log(err.message); 	
	   console.log(err.response.data);  		
	})    	
	
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
					<h4>Create New Exam</h4>
				</div>
			</div>
			<div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
				<ol className="breadcrumb">
					<li><a href={`/exam_list`} className="btn bg-blue-soft text-blue"><i className="fa fa-angle-double-left"></i> Back to Exam List</a></li>		
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
						<label>Exam Name</label>  						
						<input type="text" name="exam_name" className={`form-control ${this.hasErrorFor('name')? 'is-invalid':''}`} placeholder="Enter your first name" ref={this.input} />  
						{this.renderErrorFor('name')}    		
					  </div>
					  
					  <div className="form-group col-md-6">		
						<label>Exam Type</label>
						<div className="form-row">
						  <div className="form-group col-md-4">
							<div className="form-check"> 							  
							  <input className="form-check-input" type="radio" name="exam_type" value="default" ref={this.input} defaultChecked/>	  
							  <label className="form-check-label">Default</label>
							</div>
						  </div>
						  
						  <div className="form-group col-md-4">
							<div className="form-check"> 							  
							  <input className="form-check-input" type="radio" name="exam_type" value="internal" ref={this.input} />	
							  <label className="form-check-label">Internal</label>
							</div>
						  </div>
						  
						  <div className="form-group col-md-4">
							<div className="form-check">
							  <input className="form-check-input" type="radio" name="exam_type" value="final" ref={this.input} />
							  <label className="form-check-label">Final</label>  
							</div>
						  </div>
						</div>
					  </div>
					</div> {/******* form-row ******/}  
					
					<div className="text-right btn-submit-right">
					  <input type="submit" className="btn btn-primary" value="Save Exam"/>		
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

export default ExamAdd;  