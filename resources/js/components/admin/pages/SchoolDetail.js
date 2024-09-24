import React, { Component } from "react";
import axios from 'axios';  
import { Link } from 'react-router-dom';      
		
import Script from "@gumgum/react-script-tag";  
import Copyright from "../basic/Copyright";
import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url=location.protocol+'//'+location.host+'/';	

class SchoolDetail extends Component {  
  
  constructor (props) {
  super(props)
  this.state = {  	
	isLoading:true, 	
	school_id:'',	  	
	schoolData:[],	
  }
	    
}  

titleCase(str) {   
   var splitStr = str.toLowerCase().split(' ');
   for (var i = 0; i < splitStr.length; i++) {
       // You do not need to check if i is larger than splitStr length, as your for does that for you
       // Assign it back to the array
       splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
   }
   // Directly return the joined string
   return splitStr.join(' '); 
}    
	
componentDidMount() {  
	const isAuthenticated = localStorage.getItem("isLoggedIn");	
	const token = localStorage.getItem("login_token");	
	
	axios.get(`${base_url}api/checkauth?api_token=${token}`).then(response => {		
			
		if (response.data.status === 'successed')     
		{
			const login_data=response.data.data?response.data.data:[]; 	
			if (typeof(login_data) != "undefined")
			{ 	
				const school=login_data.school_id;  					  
				axios.get(`${base_url}api`+`/profile/${school}`).then(response => {   					
					this.setState({   
						schoolData:response.data.data?response.data.data:[]		        	   			
					}); 
				})
				.catch(error => {  	   
				   console.log(error.message); 				
				})
			}   
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

	axios.get(`${base_url}api`+'/studentmaster/getstates').then(response => {     		
	this.setState({  			
			statelist: response.data.data ? response.data.data : [],	
		});
	})
	.catch(error => {  	   
	   console.log(error.message); 	
    })  		
   
}   
   
render () {	 

const isLoad = this.state.isLoading;    
let _this = this;		  					

if (isLoad) {  

//return null;  		
			 		
} 

const schoolArr=(this.state.schoolData.length>0)?this.state.schoolData:[];   
   
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
								<h4>School Detail</h4>		  
							</div>
						</div> 						
					</div> 		
					
					<div className="row">
					  <div className="col-xl-12 col-xxl-12">
						<div className="card"> 						  
						  <div className="card-body">							
							<div className="table-responsive">
								<table className="table table-bordered table-striped verticle-middle table-responsive-sm">
									<thead>
										<tr>
											<th scope="col">School/College Name</th>
											<th scope="col">Address</th>
											<th scope="col">Principal Name</th>
											<th scope="col">Contact</th>
											<th scope="col">Action</th>  
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>{(schoolArr.length>0)?_this.titleCase(schoolArr[0].school_name):''}{(schoolArr.length>0 && schoolArr[0].about !='')?" ("+_this.titleCase(schoolArr[0].about)+")":''}</td>  
											<td>{(schoolArr.length>0)?_this.titleCase(schoolArr[0].school_address):''}</td>  		
											<td>{(schoolArr.length>0)?_this.titleCase(schoolArr[0].principal_name):''}</td>    
											<td>{(schoolArr.length>0)?_this.titleCase(schoolArr[0].school_contact):''}</td>
											<td><a href={`/profile_edit/${(schoolArr.length>0)?schoolArr[0].id:''}`} className='btn' data-toggle="tooltip" title="Edit"><i className="fa fa-edit" aria-hidden="true"></i></a></td>    
										</tr>  										
									</tbody>
								</table>
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
export default SchoolDetail;    