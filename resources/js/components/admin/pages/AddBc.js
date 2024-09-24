import React, { Component } from "react";
import axios from 'axios';  
import { Link } from 'react-router-dom';      
		
import Script from "@gumgum/react-script-tag";  
import Copyright from "../basic/Copyright";
import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url=location.protocol+'//'+location.host+'/';	

class AddBc extends Component {		
  
  constructor (props) {
  super(props)
  this.state = {  	
	isLoading:true,
	load_err:false,
	showError:false,  
	showSuccess:false,	
	admission_no:'',
	issue_no:'',			
	issue_date:'',	
	remark:'',  	 
	load_msg:'',			
	message:'',		   		
	studentData:[],	  
	suggestions:[],			
    errors: []  
  }
	   this.handleCreate = this.handleCreate.bind(this);	
	   this.handleAdmission = this.handleAdmission.bind(this);    
	   this.setAdmission = this.setAdmission.bind(this);      	
	   this.loadDetail = this.loadDetail.bind(this); 
	   this.handleChange = this.handleChange.bind(this);        		
	   this.handleIssue = this.handleIssue.bind(this);   		
	   this.hasErrorFor = this.hasErrorFor.bind(this);
	   this.renderErrorFor = this.renderErrorFor.bind(this);
	   this.input = React.createRef();  
   }
   
handleCreate (event) {
  event.preventDefault();
  const { student_name,father_name,mother_name,dob,class_present,address,issue_no,issue_date,remark } = event.target;  
  const s_id=(this.state.studentData.length >0)?this.state.studentData[0].id:0;  	   
  
  const data = {
	id:s_id,  
	name: student_name.value,  
    f_name: father_name.value,		
	m_name: mother_name.value,       
	dob: dob.value,  
    issue_date: issue_date.value,		 	
	present_class: class_present.value,		
	address:address.value,       	
	issue_no:issue_no.value,
	remark:remark.value,  	 
  }	    
    
  axios.post(`${base_url}`+'api/bc/create',data).then(response => {  				
		console.log(response);		
		if (response.data.status === 'successed')      
		{		
			this.setState({ showError:false,showSuccess:true,message:response.data.message,errors:response.data.errors});	
			var receipt =response.data.data.print_id?response.data.data.print_id:'';    				 
			if(receipt !='')  
			{
				let a = document.createElement("a"); 
				let url = base_url+'certificates/bc/'+receipt; 					
				a.target='_blank';   				
				a.href = url;
				document.body.appendChild(a);					
				a.click();
				document.body.removeChild(a);   			
			}  	
			window.location.href = base_url+"bc_list";	  							
		}
		else
		{
		   this.setState({ showError: true, showSuccess:false,message:response.data.message,errors:response.data.errors});	  
		}		
    })
    .catch(error => {  	   
	   console.log(error.message); 	
	   console.log(error.response.data);		
    }) 
    
   }
   
handleAdmission(event){		
    event.preventDefault(); 
	const search = event.target.value; 	
    this.setState({ [event.target.name]: event.target.value });     
	
	 if (search.length > 0) {
        // make api call				
			axios.get(`${base_url}api`+`/bc/getsuggest/${search}`).then(response => {
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
	  load_err:false,
	  showError: false, 	
	  message:'',    	
	  suggestions: []   	
	}); 	 	
	
} 

loadDetail(event){		
    event.preventDefault(); 
	  
	const search=this.state.admission_no?this.state.admission_no:'';	
	
	 if (search.length > 0) {
        			
			axios.get(`${base_url}api`+`/bc/getdetail/${search}`).then(response => {
				console.log(response.data);  		
				
				if(response.data.status=='successed')		
				{
					this.setState({   
						studentData:response.data.data?response.data.data:[],
						load_err:false,
						showError: false, 
						load_msg:'',
						message:response.data.message,    	
					}); 
				}
				else
				{
					this.setState({   
						studentData:[],
						load_err:false,
						showError: true,  
						load_msg:'',
						message:response.data.message, 	
					}); 
				}   
				
			})
			.catch(error => {  	   
			   console.log(error.message); 	
			})   
      } 
	  else {
			this.setState({
				studentData:[],			
				load_err:true,
				load_msg:'Admission number is empty!!'			
			});
      } 	 
}  

handleChange(event){		
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });   
}

handleIssue(event){
    event.preventDefault();		     
	
    const re = /^[0-9\b]+$/;     
	var inp = event.target.name;    
	var inp_val = event.target.value;      								
	
	if(re.test(inp_val))		
	{ 			
		this.setState({ [inp]:inp_val });  
	}	
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

const s_name=(this.state.studentData.length >0)?this.state.studentData[0].student_name:''; 		
const f_name=(this.state.studentData.length >0)?this.state.studentData[0].father_name:''; 	

const mh_name=(this.state.studentData.length >0)?this.state.studentData[0].mother_name:''; 	  		
const s_dob=(this.state.studentData.length >0)?this.state.studentData[0].dob:''; 	   

const s_address=(this.state.studentData.length >0)?this.state.studentData[0].permanent_address:''; 	    
const s_class=(this.state.studentData.length >0)?this.state.studentData[0].className:'';   

const issued_count=(this.state.studentData.length >0)?this.state.studentData[0].no_bc:''; 	
const issued_date=(this.state.studentData.length >0)?this.state.studentData[0].last_date:'';	   	
const s_remark=(this.state.studentData.length >0)?this.state.studentData[0].bc_remark:''; 	    	  	 
   
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
								<h4>Add Birth Certificate</h4>		
							</div>
						</div>
						<div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
							<ol className="breadcrumb">
								<li><a href={`/bc_list`} className="btn bg-blue-soft text-blue">
								 <i className="fa fa-angle-double-left"></i> Back to Birth Certificate List
								 </a></li>  								 
							</ol>
						</div>
					</div> 		
					
					<div className="row">
					  <div className="col-xl-12 col-xxl-12">
						<div className="card">
						  
						  <div className="card-body">
							   {
								this.state.show_1 ?(	
							   <div className="alert alert-success">									
									<strong>Success! </strong>{this.state.message}	
							   </div>) 							   
							   : ''		
							   }
							   {
								this.state.show_2 ?(		
							   <div className="alert alert-danger">									
									<strong>Danger! </strong>{this.state.message}		
							   </div>)
							    : ''		
							   }	
  
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
									   <button type="button" className="btn btn-primary btn-sm" onClick={this.loadDetail}>Load
									   </button>
									</div>
								  </div>
								  
							  </form>	  	
								
							  <form onSubmit={this.handleCreate}>
								{this.state.showError?   
									 <div className="alert alert-danger" style={{color:"brown"}}>  
										<strong>{this.state.message}</strong>       	  					   
									  </div>			
									 : null}   
								{this.state.showSuccess?   
								 <div className="alert alert-success" style={{color:"green"}}>    
									{this.state.message}    
								  </div>
								 : null}   	
								<div className="form-row">		
									
								  <div className="form-group col-md-6">		
										<label>Student Name</label>	
										<input type="text" className={`form-control ${this.hasErrorFor('name') ? 'is-invalid' : ''}`} name="student_name" value={s_name} ref={this.input} placeholder="Enter student name" readOnly/>		
										{this.renderErrorFor('name')} 
								  </div>	

								   <div className="form-group col-md-6">		
										<label>Date Of Birth</label>  	
										<input type="date" className={`form-control ${this.hasErrorFor('dob') ? 'is-invalid' : ''}`} name="dob" value={s_dob} ref={this.input} readOnly/>		
										{this.renderErrorFor('dob')} 
									</div>		
									
									<div className="form-group col-md-6">		
										<label>Father Name</label>	
										<input type="text" className={`form-control ${this.hasErrorFor('f_name') ? 'is-invalid' : ''}`} name="father_name" value={f_name} ref={this.input} placeholder="Enter father name" readOnly/>		
										{this.renderErrorFor('f_name')} 			
									  </div>
									  
									 <div className="form-group col-md-6">		
										<label>No. of Certificate Issued</label>	
										<input type="text" className={`form-control ${this.hasErrorFor('issue_no') ? 'is-invalid' : ''}`} name="issue_no" value={(this.state.issue_no)?this.state.issue_no:issued_count}  placeholder="Enter Issued No." ref={this.input} onChange={this.handleIssue}/>		
										{this.renderErrorFor('issue_no')} 					
									  </div> 

									   <div className="form-group col-md-6">		
											<label>Mother Name</label>	
											<input type="text" name="mother_name" className={`form-control ${this.hasErrorFor('m_name') ? 'is-invalid' : ''}`} value={mh_name} ref={this.input} placeholder="Enter mother name" readOnly/>		
											{this.renderErrorFor('m_name')} 	
										</div>   	
										
										<div className="form-group col-md-6">		  
											<label>Last Issued Date</label>    	
											<input type="date" className={`form-control ${this.hasErrorFor('issue_date') ? 'is-invalid' : ''}`} name="issue_date" value={(this.state.issue_date)?this.state.issue_date:issued_date} ref={this.input} onChange={this.handleChange}/>		
											{this.renderErrorFor('issue_date')}   
										</div> 

										<div className="form-group col-md-6">	
										  <label>Class Name</label>   
										  <input type="text" className={`form-control ${this.hasErrorFor('present_class') ? 'is-invalid' : ''}`} name="class_present" value={s_class} ref={this.input} placeholder="Class at present time" readOnly/>  
										  {this.renderErrorFor('present_class')}           	  
										</div>	
										
										<div className="form-group col-md-6">		
											<label>Remarks</label>	
											<input type="text" className={`form-control ${this.hasErrorFor('remark') ? 'is-invalid' : ''}`} name="remark" value={(this.state.remark)?this.state.remark:s_remark} placeholder="Enter remark" ref={this.input} onChange={this.handleChange}/>			
											{this.renderErrorFor('remark')} 											
										</div> 	
										  
										<div className="form-group col-md-6">		
											<label>Address</label>	
											<textarea className={`form-control ${this.hasErrorFor('address') ? 'is-invalid' : ''}`} name="address" value={s_address} rows="2" cols="2" ref={this.input} readOnly>{s_address}</textarea>	
											{this.renderErrorFor('address')}   	
										</div> 		
								  
								</div>		
								
								<div className="text-right btn-submit-right"> 								  
								  <input type="submit" className="btn btn-primary btn-sm mx-1" value="Save and Print" />
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

export default AddBc;      