import React, { Component } from "react";
import axios from 'axios';  
import { Link } from 'react-router-dom';      

import Script from "@gumgum/react-script-tag";

import Copyright from "../basic/Copyright";

import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url=location.protocol+'//'+location.host+'/';			


class FeeCatView extends Component {
  
  constructor (props) {
	  super(props)
	  this.state = {  	 
	    isLoading:true,	   
		feeData:[]  
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

	   
	axios.get(`${base_url}api/feecat/edit/${id}`).then(response => {    	
	this.setState({  			 			
			feeData:response.data.data?response.data.data:[]					  				
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

	var title=(this.state.feeData.length>0)?this.state.feeData[0].name:''; 	
	var feetype=(this.state.feeData.length>0)?this.state.feeData[0].fee_type:''; 	
    var applicable=(this.state.feeData.length>0)?this.state.feeData[0].applicable:''; 
    var printable=(this.state.feeData.length>0)?this.state.feeData[0].printable:false; 
    var changeable=(this.state.feeData.length>0)?this.state.feeData[0].changeable:false;   	 
   
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
                                        <h4>View Fee Category</h4>		
                                    </div>
                                </div>
                                <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                                    <ol className="breadcrumb">
                                        <li><a href="/feecat_list" className="btn bg-blue-soft text-blue"><i className="fa fa-angle-double-left" /> Back to Fee Category List</a></li>
                                    </ol>
                                </div>
                            </div>
                            {/* row */}
                            <div className="row">
                                <div className="col-xl-12 col-xxl-12">
                                    <div className="card">

                                        <div className="card-body">
                                            <div className="basic-form form-own">
                                                <form onSubmit={this.formSubmit}>
                                                    <div className="form-row">
                                                        <div className="form-group col-sm-6">
                                                            <label>Fee Category</label>
                                                            <input type="text" className="form-control" name="title" defaultValue={title} readOnly/>

                                                        </div>  
                                                        <div className="form-group col-sm-6">
                                                            <label>Fee Type</label>
                                                            <div className="form-check fee-form-radio">
															
																<label className="radio-inline">
																<input type="radio" name="fee_type" value="tution" checked={feetype=="tution"?true:false} readOnly/>		
                                                                <label className="form-check-label"/>Tution</label>
																<label className="radio-inline"><input type="radio" name="fee_type" value="fine" checked={feetype=="fine"?true:false} readOnly/>Fine</label>
																<label className="radio-inline"><input type="radio" name="fee_type" value="transport" checked={feetype=="transport"?true:false} readOnly/>Transport</label>		
																<label className="radio-inline"><input type="radio" name="fee_type" value="other" checked={feetype=="other"?true:false} readOnly/>Others</label>      
															
															
                                                                {/* <input className="form-check-input" type="radio" name="fee_type" value="Tution" checked={this.state.fee_type === 'Tution'} onChange={this.handleChangeEvent} />
                                                                <label className="form-check-label">Tution</label>

                                                                <input className="form-check-input" type="radio" name="fee_type" value="Fine" checked={this.state.fee_type === 'Fine'} onChange={this.handleChangeEvent} />
                                                                <label className="form-check-label">Fine</label>

                                                                <input className="form-check-input" type="radio" name="fee_type" value="Transport" checked={this.state.fee_type === 'Transport'} onChange={this.handleChangeEvent} />
                                                                <label className="form-check-label">Transport</label>

                                                                <input className="form-check-input" type="radio" name="fee_type" value="Others" checked={this.state.fee_type === 'Others'} onChange={this.handleChangeEvent} />
																<label className="form-check-label">Others</label>*/}
																
                                                            </div>
                                                        </div>

                                                    </div>{/*/ form-row */}

                                                    <div className="form-row"> 
                                            
                                                        <div className="form-group col-sm-4">
                                                            <label>Applicable</label>
                                                            <div className="form-check fee-form-radio">
															
															<label className="radio-inline"><input type="radio" name="applicable" value="all" checked={applicable=="all"?true:false} readOnly/>All</label>
															<label className="radio-inline"><input type="radio" name="applicable" value="old" checked={applicable=="old"?true:false} readOnly/>Old</label>	
															<label className="radio-inline"><input type="radio" name="applicable" value="new" checked={applicable=="new"?true:false} readOnly/>New</label>    		
																			
															{/*<input className="form-check-input" type="radio" name="Applicable" value="All" checked={this.state.fee_type === 'All'} onChange={this.handleChangeEvent} />
                                                                <label className="form-check-label">All</label>

                                                                <input className="form-check-input" type="radio" name="Applicable" value="Old" checked={this.state.fee_type === 'Old'} onChange={this.handleChangeEvent} />
                                                                <label className="form-check-label">Old</label>

                                                                <input className="form-check-input" type="radio" name="Applicable" value="New" checked={this.state.fee_type === 'New'} onChange={this.handleChangeEvent} />
																<label className="form-check-label">New</label>*/}
                                                            </div>
                                                        </div>

                                                        <div className="form-group col-sm-4">
                                                            <label>Printable</label>
                                                            <div className="form-check settings-form-radio"> 																
																  <input className="form-check-input" type="radio" name="printable" value="1" checked={printable=="1"?true:false} readOnly/>		
																  <label className="form-check-label">Yes</label> 
																  
																  <input className="form-check-input" type="radio" name="printable" value="0" checked={printable=="0"?true:false} readOnly/>	
																  <label className="form-check-label">No</label>  

                                                            </div>
                                                        </div>

                                                        <div className="form-group col-sm-4">
                                                            <label>Changeable</label>
                                                            <div className="form-check settings-form-radio">
                                                                <input className="form-check-input" type="radio" name="changeable" value="1" checked={changeable=="1"?true:false} readOnly/>
                                                                <label className="form-check-label">Yes</label>

                                                                <input className="form-check-input" type="radio" name="changeable" value="0" checked={changeable=="0"?true:false} readOnly/>	  
                                                                <label className="form-check-label">No</label>
                                                            </div>
                                                        </div>
					
                                                    </div>{/*/ form-row */}

                                                    <div className="form-row">
                                                        <div className="form-group col-sm-6">
                                                            <input type="submit" className="btn btn-primary" value="Submit" />
                                                        </div>
                                                    </div>{/*/ form-row */}	 
                                                    
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>{/*/ row */}
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
export default FeeCatView;      