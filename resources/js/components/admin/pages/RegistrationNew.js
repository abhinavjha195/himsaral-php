import React, { Component } from "react";
import axios from 'axios'; 
import { Link } from 'react-router-dom';  	    
import ServerTable from 'react-strap-table';    
import Script from "@gumgum/react-script-tag"; 
import Copyright from "../basic/Copyright"; 
import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url=location.protocol+'//'+location.host+'/';    

class RegistrationNew extends Component {
	
  constructor(props) {
  super(props)
  this.state = {
		isLoading:true,		
  }	
	this.serverTable = React.createRef();    
 }

 refreshTable() {   
	this.serverTable.current.refreshData();  	
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
  
    const url = base_url+'api/registration/getnew';	 				
	const columns=['student_name','father_name','mobile','email','courseName','fee','action'];			  	
	let _this = this;		  
	
	const options = {  
		perPage: 10,  
		headings: {student_name:'Student Name',father_name:'Father Name',mobile:'Mobile No',email:'Email',courseName:'Course',fee:'Amount',action:'Action'}, 		
		sortable: ['student_name','courseName'],  					
		requestParametersNames: {query:'search',direction:'order'}, 		
		responseAdapter: function (resp_data) 
		{ 
			console.log(resp_data.data);		
			return {data:resp_data.data.data?resp_data.data.data:[],total:resp_data.data.total}  				
		},  
		texts: {  
			show: ''  		
		},
		icons: {
			sortUp: 'fa fa-sort-up',
			sortDown: 'fa fa-sort-down'
		}   
		
	};              
	
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
                            <h4>New Registrations</h4>	  	
                        </div>
                    </div>	                    
                </div>                
                <div className="row">
                    <div className="col-12">
                        <div className="card">     
                            <div className="card-body create-user-table">									
                                <div className="table-responsive">
                                    <ServerTable ref={this.serverTable} columns={columns} url={url} options={options} bordered hover>	
									{  
										function (row,column) 
										{  
											if(column=='action') 		
											{   
												return (  
														  <a href={`/student_add?register_id=${row.id}`} className='btn' data-toggle="tooltip" title="Add Student"><i className="fa fa-plus" aria-hidden="true"></i></a>		
													  );  	  
											}
											else
											{
												return (row[column]);  	
											}	
										}  
									}  
									</ServerTable> 	
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

export default RegistrationNew;  		