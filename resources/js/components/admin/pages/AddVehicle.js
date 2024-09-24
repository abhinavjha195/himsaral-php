import React, { Component } from "react";  
import axios from 'axios'; 
import { Link } from 'react-router-dom';  
import Swal from 'sweetalert2';	   

import Script from "@gumgum/react-script-tag"; 		
import Copyright from "../basic/Copyright"; 
import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url=location.protocol+'//'+location.host+'/';	


class AddVehicle extends Component {    
    constructor() {
        super();
        this.state = {
            showError: false,		
            showSuccess: false,
			capacity:'',
			insurance_amount:'',
			tax_amount:'',      	
			insurance_date:'',
			insurance_due:'',		
			passing_date:'',		
			renewal_date:'',		
			tax_date:'',
			tax_due:'',   
            messgae: '',
			isLoading:true,			
			routeData:[],   
			errors: [] 		
        };
        this.formSubmit = this.formSubmit.bind(this);		
		this.handleChange = this.handleChange.bind(this);        
		this.handleAmount = this.handleAmount.bind(this);   
		this.handleNumeric = this.handleNumeric.bind(this);       
        this.hasErrorFor = this.hasErrorFor.bind(this);	
	    this.renderErrorFor = this.renderErrorFor.bind(this);   
		this.input = React.createRef();    
    }
    handleAmount(event) {  
        event.preventDefault();		
        const re = /^[0-9.\b]+$/;  
		var inp = event.target.value;      			
		const arr=inp.split('.');	
		
		if(re.test(inp) && (arr.length<=2))		
		{
			this.setState({ [event.target.name]:event.target.value });  							    
		}		     
    }
	handleChange(event){		
		event.preventDefault();		
		this.setState({ [event.target.name]:event.target.value });   
	}	
	handleNumeric(event) {  
        event.preventDefault();		
        const re = /^[0-9\b]+$/;  
		var inp = event.target.value;   		
		if(re.test(inp))		    
		{
			this.setState({ [event.target.name]:event.target.value });  							    
		}		     
    }  	
    formSubmit(event) {
        event.preventDefault();		
		this.setState({showError:false,message:''});    
		
		const { registration_no,route_id,capacity,insurance_amount,insurance_date,insurance_due,insurance_paid,tax_amount,tax_date,tax_due,tax_paid,passing_date,passing_paid,renewal_date,renewal_paid,description } = event.target;  

		const data = {
			registration_no: registration_no.value,			
			route_id: route_id.value,
			capacity: capacity.value,			
			insurance_amount: insurance_amount.value,    			
			insurance_date: insurance_date.value,   
			insurance_due: insurance_due.value,
			insurance_paid: insurance_paid.value,   
			tax_amount: tax_amount.value,
			tax_date: tax_date.value,   
			tax_due: tax_due.value,  
			tax_paid: tax_paid.value,
			passing_date: passing_date.value,
			passing_paid: passing_paid.value,
			renewal_date: renewal_date.value,
			renewal_paid: renewal_paid.value,
			description: description.value,  	  
		}	   
		
		axios.post(`${base_url}`+'api/vehicle/add',data)        	  
		.then(response => {  
			
			if (response.data.status === 'successed')   
			{		
				this.setState({ showError:false,showSuccess:true,message:response.data.message,errors:response.data.errors   		});	 
				window.location.href = base_url+"vehicle_list";         	  
			}
			else
			{
				this.setState({ showError:true,showSuccess:false,message:response.data.message,errors:response.data.errors });	 			   
			}	
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
	
	axios.get(`${base_url}`+'api/vehicle/getallroutes').then(response => {   	  			
	this.setState({  			
			routeData: response.data.data ? response.data.data : [],	
		});
	})
	.catch(err => {  	   
	   console.log(err.message); 	   	   
    })    
}		
	
render() {
	
	const isLoad = this.state.isLoading;    			

if (isLoad) {  

//return null;  	 		
			 		
}  
	
	let currDate = new Date();			
	let insurance_dt = currDate.toISOString().substring(0,10); 		
	let insurance_dw = currDate.toISOString().substring(0,10); 		
	let passing_dt = currDate.toISOString().substring(0,10); 		
	let renewal_dt = currDate.toISOString().substring(0,10); 		  
	let tax_dt = currDate.toISOString().substring(0,10); 		
	let tax_dw = currDate.toISOString().substring(0,10); 		
	
	const routeArr = (this.state.routeData.length>0)?this.state.routeData:[];  
	const routeList = routeArr.map((item, index) => {  
		  return (
				<option key={index} value={item.routeId}>{item.routeNo}</option>   		
		  );  
	});	

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
                                        <h4>Add Vehicle</h4>
                                    </div>
                                </div>
                                <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                                    <ol className="breadcrumb">
                                        <li><a href="/vehicle_list" className="btn bg-blue-soft text-blue"><i className="fa fa-angle-double-left"></i> Back to Vehicle List</a></li>		
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
													<div className="text-center">
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
													</div>  
                                                    <div className="form-row">  
														  <div className="form-group col-sm-4">			
															<label>Vehicle Reg. No.</label>
															<input type="text" name="registration_no" className={`form-control ${this.hasErrorFor('registration_no') ? 'is-invalid' : ''}`} placeholder="" ref={this.input}/>    
															{this.renderErrorFor('registration_no')}        
														  </div>
														  
														  <div className="form-group col-sm-4">
															<label>Select Route No.</label>
															 <select className={`form-control ${this.hasErrorFor('route_id') ? 'is-invalid' : ''}`} name="route_id" ref={this.input}>     
															  <option value="">--Select Route--</option>
															  {routeList}  			
															 </select>
															 {this.renderErrorFor('route_id')}           	
														  </div>
														  
														  <div className="form-group col-sm-4 mrb-30">
															<label>Seating Capacity</label>   
															<input type="text" name="capacity" className={`form-control ${this.hasErrorFor('capacity') ? 'is-invalid' : ''}`} placeholder="" value={this.state.capacity?this.state.capacity:''} onChange={this.handleNumeric}/>  
															{this.renderErrorFor('capacity')}         
														  </div> 
                                                        
                                                    </div>{/*/ form-row */}
													<div className="form-row">  
														  <div className="form-group col-sm-3">			
															<label>Insurance Amount</label>
															<input type="text" name="insurance_amount" className={`form-control ${this.hasErrorFor('insurance_amount') ? 'is-invalid' : ''}`}  placeholder="" value={this.state.insurance_amount?this.state.insurance_amount:''} onChange={this.handleAmount}/>
															{this.renderErrorFor('insurance_amount')}      
														  </div>
														  
														  <div className="form-group col-sm-3">			
															<label>Insurance Date</label>
															<input type="date" name="insurance_date" className={`form-control ${this.hasErrorFor('insurance_date') ? 'is-invalid' : ''}`}placeholder="" ref={this.input} value={this.state.insurance_date?this.state.insurance_date:insurance_dt} onChange={this.handleChange}/>  
															{this.renderErrorFor('insurance_date')}        
														  </div>  
														  
														  <div className="form-group col-sm-3">   
															<label>Insurance Due Date</label>   
															<input type="date" name="insurance_due" className={`form-control ${this.hasErrorFor('insurance_due') ? 'is-invalid' : ''}`} placeholder="" ref={this.input} value={this.state.insurance_due?this.state.insurance_due:insurance_dw} onChange={this.handleChange}/>  
															{this.renderErrorFor('insurance_due')}         
														  </div> 
														  <div className="form-group col-sm-3">
															<label>Paid</label>  
															<div className="form-row">
															  <div className="form-group col-sm-3">   
																<div className="form-check">
																  <input className="form-check-input" type="radio" name="insurance_paid" value="yes" ref={this.input}/>  
																  <label className="form-check-label">Yes</label>
																</div>  
															  </div>
															  
															  <div className="form-group col-sm-3">    
																<div className="form-check">  
																  <input className="form-check-input" type="radio" name="insurance_paid" value="no" ref={this.input} defaultChecked/>  
																  <label className="form-check-label">No</label>  
																</div>		
															  </div>  
															  
															</div>
														  </div>
                                                        
                                                    </div>{/*/ form-row */}
													<div className="form-row">  
														  <div className="form-group col-sm-3">			
															<label>Tax Amount</label>
															<input type="text" name="tax_amount" className={`form-control ${this.hasErrorFor('tax_amount') ? 'is-invalid' : ''}`}  placeholder="" value={this.state.tax_amount?this.state.tax_amount:''} onChange={this.handleAmount}/>  
															{this.renderErrorFor('tax_amount')}       	
														  </div>
														  
														  <div className="form-group col-sm-3">			
															<label>Tax Date</label>
															<input type="date" name="tax_date" className={`form-control ${this.hasErrorFor('tax_date') ? 'is-invalid' : ''}`} placeholder="" ref={this.input} value={this.state.tax_date?this.state.tax_date:passing_dt} onChange={this.handleChange}/>
															{this.renderErrorFor('tax_date')}   
														  </div>  
														  
														  <div className="form-group col-sm-3">   		
															<label>Tax Due Date</label>   
															<input type="date" name="tax_due" className={`form-control ${this.hasErrorFor('tax_due') ? 'is-invalid' : ''}`}placeholder="" ref={this.input} value={this.state.tax_due?this.state.tax_due:renewal_dt} onChange={this.handleChange}/>	
															{this.renderErrorFor('tax_due')}   
														  </div> 
														  <div className="form-group col-sm-3">
															<label>Paid</label>  
															<div className="form-row">
															  <div className="form-group col-sm-3">   
																<div className="form-check">
																  <input className="form-check-input" type="radio" name="tax_paid" value="yes" ref={this.input}/>  
																  <label className="form-check-label">Yes</label>
																</div>  
															  </div>
															  
															  <div className="form-group col-sm-3">  
																<div className="form-check">
																  <input className="form-check-input" type="radio" name="tax_paid" value="no" ref={this.input} defaultChecked/>  
																  <label className="form-check-label">No</label>  
																</div>	  	
															  </div>  
															  
															</div>
														  </div>
                                                        
                                                    </div>{/*/ form-row */}
													<div className="form-row">     
														  <div className="form-group col-sm-3">   
															<label>Vehicle Passing Date</label>   
															<input type="date" name="passing_date" className={`form-control ${this.hasErrorFor('passing_date') ? 'is-invalid' : ''}`} placeholder="" ref={this.input} value={this.state.passing_date?this.state.passing_date:tax_dt} onChange={this.handleChange}/>    
															{this.renderErrorFor('passing_date')}    
														  </div> 
														  <div className="form-group col-sm-3">
															<label>Paid</label>  
															<div className="form-row">
															  <div className="form-group col-sm-3">   
																<div className="form-check">
																  <input className="form-check-input" type="radio" name="passing_paid" value="yes" ref={this.input}/>  
																  <label className="form-check-label">Yes</label>
																</div>  
															  </div>
															  
															  <div className="form-group col-sm-3">  
																<div className="form-check">
																  <input className="form-check-input" type="radio" name="passing_paid" value="no" ref={this.input} defaultChecked/>  
																  <label className="form-check-label">No</label>  
																</div>		
															  </div>  
															  
															</div>
														  </div>
														   <div className="form-group col-sm-3">   
															<label>Vehicle Permit Renewal Date</label>   
															<input type="date" name="renewal_date" className={`form-control ${this.hasErrorFor('renewal_date')? 'is-invalid' : ''}`} placeholder="" ref={this.input} value={this.state.renewal_date?this.state.renewal_date:tax_dw} onChange={this.handleChange}/>  
															{this.renderErrorFor('renewal_date')}    	
														  </div> 
														  <div className="form-group col-sm-3">
															<label>Paid</label>  
															<div className="form-row">
															  <div className="form-group col-sm-3">   
																<div className="form-check">
																  <input className="form-check-input" type="radio" name="renewal_paid" value="yes" ref={this.input}/>  
																  <label className="form-check-label">Yes</label>
																</div>  
															  </div>  
															  
															  <div className="form-group col-sm-3">  
																<div className="form-check">
																  <input className="form-check-input" type="radio" name="renewal_paid" value="no" ref={this.input} defaultChecked/>  
																  <label className="form-check-label">No</label>  
																</div>	  	
															  </div>  
															  
															</div>
														  </div>
                                                        
                                                    </div>{/*/ form-row */}   
                                                    <div className="form-row">                                                
                                                        <div className="form-group col-md-6">
															<label>Vehicle Description</label>     
															 <textarea name="description" className="form-control" rows="3" ref={this.input}></textarea>  								      
														</div>  					
                                                    </div>{/*/ form-row */}

                                                    <div className="form-row">
                                                        <div className="form-group col-sm-6">
                                                            <input type="submit" className="btn btn-primary" value="Submit" />
                                                        </div>
                                                    </div>   
													
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

          {/***********************************
            Footer Copyright start
        ************************************/}

                    <Copyright />

                    {/***********************************
  Footer Copyright end
************************************/}  </div>
                {/***********************************
Main wrapper end
************************************/}
            </div>
        );
    }
} 
export default AddVehicle;	