import React, { Component } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';

import Script from "@gumgum/react-script-tag";

import Copyright from "../basic/Copyright";

import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url=location.protocol+'//'+location.host+'/';

class ChangePassword extends Component {

    constructor(props) {
        super(props)
        this.state = {
            oPassword:'',
            nPassword:'',
            cPassword: '',
            password: '',
			message:'',	
            showError: false,
			showSuccess: false, 		
			isLoading:true,		
            errors: []
        }
        this.handleChange = this.handleChange.bind(this);
        this.hasErrorFor = this.hasErrorFor.bind(this);
        this.renderErrorFor = this.renderErrorFor.bind(this);
        this.input = React.createRef();		
    }

    handleChange(event) {
        event.preventDefault(); 		
		
        const { oPassword, nPassword, cPassword } = event.target;		         
		
		const token = localStorage.getItem("login_token");	   

        const data = {
            old_password: oPassword.value,		
            password: nPassword.value,
            password_confirmation: cPassword.value,					
        }   
		
        axios.post(`${base_url}api`+`/changepassword/${token}`,data)						
            .then(response => {
                console.log(response.data);		
                if (response.data.status === 'successed') {			
                    this.setState({ 
						showError:false,			
						showSuccess:true,
						message:response.data.message,					
						errors:response.data.errors
					});	 			   
                }
                else {
                    this.setState({ 
						showError:true,
						showSuccess:false,
						message:response.data.message,
						errors:response.data.errors
					});	 	                     
                }
            })
            .catch(error => {
                console.log(error.message);
				console.log(error.response.data);	
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
                                        <h4>GENERATE NEW PASSWORD</h4>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-xl-12 col-xxl-12">
                                    <div className="card">

                                        <div className="card-body">

                                            <div className="basic-form form-own">
                                                <form onSubmit={this.handleChange}>
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
                                                            <label>Old Password</label>
                                                            <input type='password' className={`form-control ${this.hasErrorFor('old_password') ? 'is-invalid' : ''}`} name='oPassword'
                                                                ref={this.input}  />{this.renderErrorFor('old_password')}
                                                        </div>
                                                        <div className="form-group col-md-6">			
                                                            <label>New Password</label>
                                                            <input type='password' className={`form-control ${this.hasErrorFor('password') ? 'is-invalid' : ''}`} name='nPassword'
                                                                ref={this.input} securetextentry="true" />{this.renderErrorFor('password')}		
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label>Confirm Password</label>
                                                            <input type='password' className={`form-control ${this.hasErrorFor('password_confirmation') ? 'is-invalid' : ''}`} name='cPassword'
                                                                ref={this.input} />{this.renderErrorFor('password_confirmation')}		
                                                        </div>
                                                    </div>
                                                    <input type="submit" className="btn btn-primary mr-2" value="Save" />                                                      
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
export default ChangePassword;  