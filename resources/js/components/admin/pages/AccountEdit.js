import React, { Component } from "react";
import axios from 'axios'; 
import { Link } from 'react-router-dom';   
import Script from "@gumgum/react-script-tag";	
import Copyright from "../basic/Copyright";	
import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";        

const base_url=location.protocol+'//'+location.host+'/';	 	

class AccountEdit extends Component {   
	
constructor (props) {		
  super(props)
  this.state = { 	 	  	 	
    showError: false,		
	showSuccess: false,	 	
	isLoading:true,  		
	message:'',
	type_id:'',
	description:'',
	income_expense:'',	
	remark:'',  	
	typeData:[],
	accountData:[],			
	errors:[],		
  }	  	    	   		
	   this.handleUpdate = this.handleUpdate.bind(this);    
	   this.handleChange = this.handleChange.bind(this);          	
	   this.hasErrorFor = this.hasErrorFor.bind(this);	
	   this.renderErrorFor = this.renderErrorFor.bind(this);  
	   this.input = React.createRef();  	
   }
  
handleUpdate (event) {
  event.preventDefault();
  const { type_id,description,income_expense,remark } = event.target;    

  const urlString = window.location.href;
  const url = new URL(urlString);   
  const lastSegment = url.pathname.split('/').pop();	
  const id = lastSegment;      	
  
  const data = {  		
	type_id: type_id.value,
	description: description.value, 
	income_expense: income_expense.value,						
	remark: remark.value, 	
  }	 
  
  axios.post(`${base_url}api/account/update/${id}`,data).then(response => {  	       
		console.log(response);		
		if (response.data.status === 'successed')   			
		{		
			this.setState({ showError: false, showSuccess: true, message: response.data.message,errors: response.data.errors });   						
			window.location.href=base_url+'account_master';     
		}
		else
		{
			this.setState({ showError: true, showSuccess: false, message: response.data.message,errors: response.data.errors });	 			   
		}
    })
    .catch(err => {  	   
	   console.log(err.message);  
	   console.log(err.response.data);	 						
    })
    
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
			const login_data=response.data.data?response.data.data:[]; 	
			if (typeof(login_data) != "undefined")
			{ 	
				const schoolid=login_data.school_id;    		
				this.setState({ school_id:schoolid });      					  				
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
	
	axios.get(`${base_url}api`+'/account/gettypes').then(response => {    		
		this.setState({  			
			typeData: response.data.data?response.data.data:[],					
		});
	})
	.catch(error => {  	   
	   console.log(error.message); 	
    })  

	axios.get(`${base_url}api`+`/account/edit/${id}`).then(response => {   
	this.setState({  			 			
			accountData:response.data.data?response.data.data:[]							  				
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

const acc_type=(this.state.accountData.length >0)?this.state.accountData[0].type_id:'';   
const acc_desc=(this.state.accountData.length >0)?this.state.accountData[0].description:'';     
const acc_incm=(this.state.accountData.length >0)?this.state.accountData[0].name:'';    
const acc_rmk=(this.state.accountData.length >0)?this.state.accountData[0].remark:'';       		
	  
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
					<h4>Account Master</h4>						
				</div>
			</div>
			<div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
              <ol className="breadcrumb">                 
				<li><a href={`/account_master`} className="btn bg-blue-soft text-blue"><i className="fa fa-angle-double-left"></i> Back to Account Master</a></li>	  
              </ol>		
            </div>	
		</div>
		{/**********<!-- row **********/}
		
		<div className="row">
		  <div className="col-xl-12 col-xxl-12">
			<div className="card">
			  {/******!--div className="card-header"><h4 className="card-title">Create New Exam</h4></div--***/}
			  <div className="card-body"> 				
				<div className="basic-form form-own">
				
					<form onSubmit={this.handleUpdate}>
						{this.state.showSuccess?   
						 <div className="alert alert-success" style={{color:"green"}}>    
							{this.state.message}    
						  </div>
						 : null} 
						{this.state.showError?   
						 <div className="alert alert-danger" style={{color:"brown"}}>  
							<strong>{this.state.message}</strong>       	  					   
						  </div>			
						 : null}     
					<div className="form-row">
					
					  <div className="form-group col-sm-6">
						<label>Specify Type</label>
						<select name="type_id" className={`form-control ${this.hasErrorFor('type_id') ? 'is-invalid' : ''}`} value={(this.state.type_id)?this.state.type_id:acc_type} onChange={this.handleChange} ref={this.input}>		
						  <option value="0">--Select--</option>		
						  {this.state.typeData.map( (item, key) => {     
								return (
								<option key={key} value={item.id}>{item.name}</option>   		
							  )
							})}
						</select>
						{this.renderErrorFor('type_id')}   	
					  </div>
					  
					  <div className="form-group col-sm-6">  
						<label>Description</label>
						<input type="text" name="description" className={`form-control`} value={(this.state.description)?this.state.description:acc_desc} onChange={this.handleChange} ref={this.input} placeholder=""/>
					  </div>  

					  <div className="form-group col-sm-6">
						<label>Name Of Income/Expense</label>  
						<input type="text" name="income_expense" className={`form-control ${this.hasErrorFor('income_expense') ? 'is-invalid' : ''}`} value={(this.state.income_expense)?this.state.income_expense:acc_incm} onChange={this.handleChange} ref={this.input} placeholder=""/>	
						{this.renderErrorFor('income_expense')}  						
					  </div>
					  
					  <div className="form-group col-sm-6">
						<label>Remarks</label>
						<input type="text" name="remark" className={`form-control`} value={(this.state.remark)?this.state.remark:acc_rmk} onChange={this.handleChange} ref={this.input} placeholder=""/>		
					  </div>   
					  
					</div>{/**********<!--/ form-row ******-***/}  
					<div className="submit-btn form-own text-right">
					  <input type="submit" value="Save" className="btn btn-primary"/>
					</div>		
					</form>			
					
				</div>  				
				
			  </div>
			  
			</div>
		  </div>  
		</div>{/***********<!--/ row *******/}   		
		
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

export default AccountEdit;	   	