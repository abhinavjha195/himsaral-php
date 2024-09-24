import React, { Component } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

import Script from "@gumgum/react-script-tag";

import Copyright from "../basic/Copyright";

import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url=location.protocol+'//'+location.host+'/';	

class MaintenanceEdit extends Component {

  constructor(props) {
	  super(props)
	  this.state = {
		  showError: false,
		  showSuccess: false,
		  isLoading:true,	  
		  maintenance_type:'',
		  description:'',
		  messgae:'',
		  errors:[],
		  maintenances:[]
	  }
	  this.formSubmit = this.formSubmit.bind(this);
	  this.handleChange = this.handleChange.bind(this);
	  this.hasErrorFor = this.hasErrorFor.bind(this);
	  this.renderErrorFor = this.renderErrorFor.bind(this);
	  this.input = React.createRef();
}
handleChange(event){
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });
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

	const urlString = window.location.href;
    const url = new URL(urlString);
    const lastSegment = url.pathname.split('/').pop();
	const id = lastSegment;

	let maintenance_type =(this.state.maintenance_type)?this.state.maintenance_type:(this.state.maintenances.length>0)?this.state.maintenances[0].maintenance_type:'';
	let description =(this.state.description)?this.state.description:(this.state.maintenances.length>0)?this.state.maintenances[0].description:'';

	const data = {
		maintenance_type: maintenance_type,
		description: description,
	}

	axios.post(`${base_url}api`+`/maintenance/update/${id}`,data).then(response => {
		console.log(response.data);
		if (response.data.status === 'successed')	
		{
			this.setState({ showError:false,showSuccess:true,message:response.data.message,errors:response.data.errors});
            window.location.href = base_url+"maintenance_list";
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


	axios.get(`${base_url}api`+`/maintenance/edit/${id}`).then(response => {
        console.log(response);

		this.setState({
			maintenances:response.data.data?response.data.data:[],
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

	let maintenance_type =(this.state.maintenance_type)?this.state.maintenance_type:(this.state.maintenances.length>0)?this.state.maintenances[0].maintenance_type:'';
	let description =(this.state.description)?this.state.description:(this.state.maintenances.length>0)?this.state.maintenances[0].description:'';

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
					<h4>Update Maintenance</h4>
				</div>
			</div>
			<div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
				<ol className="breadcrumb">
					<li><a href={`/maintenance_list`} className="btn bg-blue-soft text-blue"><i className="fa fa-angle-double-left"></i> Back to Maintenance List</a></li>
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
						<label>Maintenance Type</label>
						<input type="text" name="maintenance_type" className={`form-control ${this.hasErrorFor('maintenance_type')? 'is-invalid':''}`}  defaultValue={maintenance_type} onChange={this.handleChange} />
						{this.renderErrorFor('maintenance_type')}
					  </div>
					  <div className="form-group col-md-6">
						<label>Description</label>
						<input type="text" name="description" className={`form-control ${this.hasErrorFor('description')? 'is-invalid':''}`}  defaultValue={description} onChange={this.handleChange} />
						{this.renderErrorFor('description')}
					  </div>

					</div> {/******* form-row ******/}

					<div className="text-right btn-submit-right">
					  <input type="submit" className="btn btn-primary" value="Update Maintenance"/>
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

export default MaintenanceEdit;
