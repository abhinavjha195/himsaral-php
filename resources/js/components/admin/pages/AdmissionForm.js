import React, { Component } from "react";
import axios from 'axios';  
import { Link } from 'react-router-dom';      
		
import Script from "@gumgum/react-script-tag";  
import Copyright from "../basic/Copyright";
import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url=location.protocol+'//'+location.host+'/';	

class AdmissionForm extends Component {
  
  constructor (props) {
  super(props)
  this.state = {  	
	isLoading:true,
	print_alert:false,    	
	load_err:false,		
	admission_no:'', 		  
	load_msg:'',			
	print_msg:'', 
	school_id:'',			
	studentData:[],	  
	suggestions:[],			
    errors: []  
  }
	   	
	   this.handleAdmission = this.handleAdmission.bind(this);    
	   this.setAdmission = this.setAdmission.bind(this);      	
	   this.printForm = this.printForm.bind(this); 
	   this.handleChange = this.handleChange.bind(this);        			   		
	   this.hasErrorFor = this.hasErrorFor.bind(this);
	   this.renderErrorFor = this.renderErrorFor.bind(this);
	   this.input = React.createRef();  
}    
   
handleAdmission(event){		
    event.preventDefault(); 
	const search = event.target.value; 	
    this.setState({ [event.target.name]: event.target.value });     
	
	 if (search.length > 0) {
        // make api call				
			axios.get(`${base_url}api`+`/cc/getsuggest/${search}`).then(response => {
				console.log(response.data);    	
				this.setState({   
					suggestions:response.data.data?response.data.data:[]			   			
				}); 
			})
			.catch(error => {  	   
			   console.log(error.message); 				
			})   
      } 
	  else {
			this.setState({
			  suggestions: []			
			});
      } 	
} 

setAdmission(event){   	  			
	event.preventDefault();   
	const admission_no = event.target.id; 	  		

	this.setState({
	  admission_no:admission_no,
	  load_msg:'',	
	  print_msg:'',  
	  load_err:false,  	  
	  print_alert:false, 	 	   	
	  suggestions: []   	
	}); 	 	
	
} 

printForm(event){		
    event.preventDefault(); 
	  
	const search=this.state.admission_no?this.state.admission_no:'';			
	const school=this.state.school_id?this.state.school_id:'';   			
	
	 if (search.length > 0) {
        			
			axios.get(`${base_url}api`+`/studentmaster/print/${search}/${school}`).then(response => {
				console.log(response.data);  		
				
				if(response.data.status=='successed')		
				{
					var receipt =(typeof(response.data.data)!='object')?response.data.data:''; 			 
					if(receipt !='')  			
					{
						let a = document.createElement("a"); 
						let url = base_url+'admissions/'+receipt; 									
						a.target='_blank';   
						a.href = url;
						document.body.appendChild(a);		  			
						a.click();
						document.body.removeChild(a);   			
					}  	
					this.setState({    						
						load_err:false, 						
						print_alert:true,
						print_msg:response.data.message,		
						load_msg:'' 						    	
					}); 
				}
				else
				{
					this.setState({    						
						load_err:true, 						
						print_alert:false,
						print_msg:'', 	
						load_msg:response.data.message    							
					}); 
				}   
				
			})
			.catch(error => {  	   
			   console.log(error.message); 	
			})   
      } 
	  else {
			this.setState({  				
				load_err:true,
				print_alert:false,   
				load_msg:'Admission number is empty!!',
				print_msg:''	
			});
      } 	 
}  

handleChange(event){		
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });   		
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
			
		if (response.data.status === 'successed')     
		{
			const login_data=response.data.data?response.data.data:[]; 	
			if (typeof(login_data) != "undefined")
			{ 	
				this.setState({ school_id:login_data.school_id });   	
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
   
    const urlString = window.location.href;
	const url = new URL(urlString);   
	var admin_no = url.searchParams.get("id");		
   
    this.setState({
	  admission_no:(admin_no==null)?'':admin_no    
	}); 	
}   
   
render () {	 

const isLoad = this.state.isLoading;    					

if (isLoad) {  

//return null;  		
			 		
}  

const style1 = {
  position: "absolute",
  border: "1px solid #d4d4d4",  
  zIndex: "99",  
};  

const style2 = {
  padding: "10px",			
  cursor: "pointer",
  color:"#000",			
  fontFamily: "New Times Roman",  		
  fontSize:"15px",	    			
  backgroundColor: "#fff", 
  borderBottom: "1px solid #d4d4d4", 
  width:"470px",  	
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
								<h4>Admission Form</h4>		
							</div>
						</div> 						
					</div> 		
					
					<div className="row">
					  <div className="col-xl-12 col-xxl-12">
						<div className="card">
						  
						  <div className="card-body">
							<h6 className="card-title">By Entering Admission Number, You Can Withdraw Your Form</h6>  
							<div className="basic-form form-own"> 
							  <form className="form-inline">	
								  <div className="form-group">			
									<label htmlFor="admission_no">Admission Number&nbsp;&nbsp;</label>  
									<input type="text" className={`form-control ${this.hasErrorFor('admission_no') ? 'is-invalid' : ''}`} name="admission_no" size="40" placeholder="Enter admission number" value={(this.state.admission_no)?this.state.admission_no:''} onChange={this.handleAdmission}/>	
								  </div>
								  <div style={style1}>   			
									{
									  this.state.suggestions.map((item, index) => (  
										<div id={item.admission_no} key={item.id} style={style2} onClick={this.setAdmission}>{item.admission_no}-{item.student_name}-{item.className}-{item.father_name}</div>  		   		  
									  ))   		
									} 
								  </div>	
								  {
									this.state.load_err?(	
								  <div className="form-group">
									<label htmlFor="loaderror"><span style={{color:"red",fontSize:'14px'}}>&nbsp;{this.state.load_msg}&nbsp;</span></label>		   									
								  </div>) 							   
								   :<div className='form-group'>&nbsp;&nbsp;</div>			
								   }  

								  <div className="form-group">
									<div className="col-sm-offset-2 col-sm-4">
									   <button type="button" className="btn btn-primary btn-sm" onClick={this.printForm}>Generate
									   </button>  
									</div>  
								  </div>  								  
								   {
									this.state.print_alert?(	
								  <div className="form-group">
									<label htmlFor="loadsuccess"><span style={{color:"green",fontSize:'14px'}}>&nbsp;{this.state.print_msg}&nbsp;</span></label>		   									
								  </div>) 							   
								   :<div className='form-group'>&nbsp;&nbsp;</div>		  	
								   }  	
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
export default AdmissionForm;    