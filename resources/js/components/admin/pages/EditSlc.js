import React, { Component } from "react";
import axios from 'axios';  
import { Link } from 'react-router-dom';      
		
import Script from "@gumgum/react-script-tag";

import Copyright from "../basic/Copyright";

import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url=location.protocol+'//'+location.host+'/';	

class EditSlc extends Component {
  
  constructor (props) {
  super(props)
  this.state = {  	
	isLoading:true, 	
	showError:false,  
	showSuccess:false,	
	admission_no:'',
	fee_month:'',
	fee_year:'',
	concession:'',
	ncc_cadet:'',
	qualify_promote:'',
	fail_attempt:'',		
	last_exam:'',
	application_date:'',
	game:'', 
	issue_date:'',
	working_days:'',
	reason:'',
	days_present:'',
	remark:'',   			
	message:'',		   	
	classData:[],
	certificateData:[],	  		
    errors: []  
  }
	   this.handleUpdate = this.handleUpdate.bind(this);		   
	   this.handleChange = this.handleChange.bind(this);        		
	   this.hasErrorFor = this.hasErrorFor.bind(this);
	   this.renderErrorFor = this.renderErrorFor.bind(this);
	   this.input = React.createRef();  
   }
   
handleUpdate (event) {
  event.preventDefault();
  const { student_name,father_name,mother_name,dob,admission_date,class_admission,class_present,nationality,fee_month,fee_year,
concession,ncc_cadet,general_conduct,category,qualify_promote,fail_attempt,last_exam,application_date,game,issue_date,
working_days,reason,days_present,remark } = event.target;    
  const savebutton=window.event.submitter.name;   	
  
  const urlString = window.location.href;
  const url = new URL(urlString);   
  const lastSegment = url.pathname.split('/').pop();	
  const id = lastSegment;   
  
  if(savebutton=='savedifferent')		
  {
	  const s_id=(this.state.certificateData.length >0)?this.state.certificateData[0].student_id:0;  	
	  window.location.href=base_url+'student_edit/'+s_id+'?slc_id='+id;   		   
  }
  else
  { 	  
	  const data = {  	 
		name: student_name.value,  
		f_name: father_name.value,		
		m_name: mother_name.value,       
		dob: dob.value,  
		admission_date: admission_date.value,		
		admission_class: class_admission.value,      
		present_class: class_present.value,
		nationality:nationality.value,  
		category:category.value,  
		fee_month:fee_month.value,  
		fee_year:fee_year.value,  
		concession:concession.value,  	
		ncc_cadet:ncc_cadet.value,  
		qualify_promote:qualify_promote.value,  
		fail_attempt:fail_attempt.value,  
		general_conduct:general_conduct.value,  
		last_exam:last_exam.value,    
		application_date:application_date.value,  	
		game:game.value,  
		issue_date:issue_date.value,  
		working_days:working_days.value,  
		reason:reason.value,  
		days_present:days_present.value,  
		remark:remark.value,  
		button:savebutton,							   	
	  }	  
		
	  axios.post(`${base_url}api/slc/update/${id}`,data).then(response => {  				
			console.log(response);		
			if (response.data.status === 'successed')      
			{		
				this.setState({ showError:false,showSuccess:true,message:response.data.message,errors:response.data.errors});	
				var receipt =response.data.data.print_id?response.data.data.print_id:'';    				 
				if(receipt !='')  
				{
					let a = document.createElement("a"); 
					let url = base_url+'certificates/tc/'+receipt; 																
					a.target='_blank';   				
					a.href = url;
					document.body.appendChild(a);					
					a.click();
					document.body.removeChild(a);   			
				}  	
				window.location.href = base_url+"slc_list";	  			
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

	const urlString = window.location.href;
    const url = new URL(urlString);   
    const lastSegment = url.pathname.split('/').pop();	
	const id = lastSegment;  
	
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
   
   axios.get(`${base_url}api`+'/class/getclasses').then(response => {   		
	this.setState({  			
			classData:response.data.data?response.data.data:[],	   
		});
	})
	.catch(err => {  	   
	   console.log(err.message); 	   	   
    })    	
	
	
	axios.get(`${base_url}api`+`/slc/edit/${id}`).then(response => {
		console.log(response.data);   		
		this.setState({   
			certificateData:response.data.data?response.data.data:[]    
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

const monthList = ['January','February','March','April','May','June','July','August','September','October','November','December'];  

const yearList = [2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025];		  	 

const s_name=(this.state.certificateData.length >0)?this.state.certificateData[0].student_name:''; 		
const f_name=(this.state.certificateData.length >0)?this.state.certificateData[0].father_name:''; 	

const mh_name=(this.state.certificateData.length >0)?this.state.certificateData[0].mother_name:''; 	  		
const s_dob=(this.state.certificateData.length >0)?this.state.certificateData[0].dob:''; 	   

const s_nation=(this.state.certificateData.length >0)?this.state.certificateData[0].nationality:''; 	   
const s_admission_date=(this.state.certificateData.length >0)?this.state.certificateData[0].admission_date:''; 	  

const s_class_first=(this.state.certificateData.length >0)?this.state.certificateData[0].admission_class:''; 	    
const s_class_present=(this.state.certificateData.length >0)?this.state.certificateData[0].present_class:''; 	

const s_cat=(this.state.certificateData.length >0)?this.state.certificateData[0].caste:'';  	
const s_sport=(this.state.certificateData.length >0)?this.state.certificateData[0].game:'';   

const day_total=(this.state.certificateData.length >0)?this.state.certificateData[0].working_days:'';   
const day_present=(this.state.certificateData.length >0)?this.state.certificateData[0].working_present:'';     

const paid_month=(this.state.certificateData.length >0)?this.state.certificateData[0].fee_month:'';    
const paid_year=(this.state.certificateData.length >0)?this.state.certificateData[0].fee_year:'';    

const concession_any=(this.state.certificateData.length >0)?this.state.certificateData[0].concession:'';   
const ncc=(this.state.certificateData.length >0)?this.state.certificateData[0].ncc_conduct:'';  	

const g_conduct=(this.state.certificateData.length >0)?this.state.certificateData[0].general_conduct:'';    
const qualified_promotion=(this.state.certificateData.length >0)?this.state.certificateData[0].qualified:''; 

const f_attempt=(this.state.certificateData.length >0)?this.state.certificateData[0].fail_attempt:'';  	
const exam_last=(this.state.certificateData.length >0)?this.state.certificateData[0].last_exam:'';  		

const apply_date=(this.state.certificateData.length >0)?this.state.certificateData[0].application_date:'';   
const gen_date=(this.state.certificateData.length >0)?this.state.certificateData[0].issue_date:'';       

const s_reason=(this.state.certificateData.length >0)?this.state.certificateData[0].reason:'';  	
const s_remark=(this.state.certificateData.length >0)?this.state.certificateData[0].remark:'';        
   
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
								<h4>Edit School Leaving/Transfer Certificate</h4>		
							</div>
						</div>
						<div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
							<ol className="breadcrumb">		
								<li><a href={`/slc_list`} className="btn bg-blue-soft text-blue">
								 <i className="fa fa-angle-double-left"></i> Back to Transfer/Slc Certificate List
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

							  <form onSubmit={this.handleUpdate}>
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
									  <label>Fee Month(Upto He/She Paid)</label>
									  <select className={`form-control ${this.hasErrorFor('fee_month') ? 'is-invalid' : ''}`} name="fee_month" value={(this.state.fee_month)?this.state.fee_month:paid_month} onChange={this.handleChange} ref={this.input}>   
										  <option value="0">--Select--</option>  
										  {monthList.map((key, index) => (
											<option value={index+1} key={index}>		
											  {key}
											</option>     			
										  ))}
									  </select>
									  {this.renderErrorFor('fee_month')}           	  
								  </div>  
								  
								  <div className="form-group col-md-6">		
									<label>Father Name</label>	
									<input type="text" className={`form-control ${this.hasErrorFor('f_name') ? 'is-invalid' : ''}`} name="father_name" value={f_name} ref={this.input} placeholder="Enter father name" readOnly/>		
									{this.renderErrorFor('f_name')} 			
								  </div>
								  
								  <div className="form-group col-md-6">
									  <label>Fee Year(Upto He/She Paid)</label>		
									  <select className={`form-control ${this.hasErrorFor('fee_year') ? 'is-invalid' : ''}`} name="fee_year" value={(this.state.fee_year)?this.state.fee_year:paid_year} onChange={this.handleChange} ref={this.input}>   
										  <option value="0">--Select--</option>  
										  {yearList.map((key, index) => (
											<option value={key} key={index}>
											  {key}
											</option>     				
										  ))}
									  </select>
									  {this.renderErrorFor('fee_year')}           	  
								  </div>

								  <div className="form-group col-md-6">		
									<label>Mother Name</label>	
									<input type="text" name="mother_name" className={`form-control ${this.hasErrorFor('m_name') ? 'is-invalid' : ''}`} value={mh_name} ref={this.input} placeholder="Enter mother name" readOnly/>		
									{this.renderErrorFor('m_name')} 	
								  </div>   

								  <div className="form-group col-md-6">
									  <label>Concession(If any)</label>   
									  <select className={`form-control ${this.hasErrorFor('concession') ? 'is-invalid' : ''}`} name="concession" value={(this.state.concession)?this.state.concession:concession_any} onChange={this.handleChange} ref={this.input}>		
										  <option value="0">--Select--</option>			  
										  <option value="none">None</option>
										  <option value="sibling">Brother/Sister</option>  
										  <option value="staff">Staff Children</option>	
										  <option value="other">Any Other</option>     
									  </select>
									  {this.renderErrorFor('concession')}           	  
									</div>	
									
									<div className="form-group col-md-6">		
										<label>Date Of Birth</label>  	
										<input type="date" className={`form-control ${this.hasErrorFor('dob') ? 'is-invalid' : ''}`} name="dob" value={s_dob} ref={this.input} readOnly/>		
										{this.renderErrorFor('dob')} 
   								    </div>
									
									<div className="form-group col-md-6">		
										<label>NCC Cadet</label>	
										<input type="text" className={`form-control ${this.hasErrorFor('ncc_cadet') ? 'is-invalid' : ''}`} name="ncc_cadet" value={(this.state.ncc_cadet)?this.state.ncc_cadet:ncc} placeholder="Enter ncc cadet" onChange={this.handleChange} ref={this.input}/>
										{this.renderErrorFor('ncc_cadet')} 
   								    </div>
									
									<div className="form-group col-md-6">
									  <label>Nationality</label>     									 
									  <input type="text" className={`form-control ${this.hasErrorFor('nationality') ? 'is-invalid' : ''}`} name="nationality" value={s_nation} ref={this.input} placeholder="Enter student nationality" onChange={this.handleChange} readOnly/>		
									  {this.renderErrorFor('nationality')}               	  
									</div>										
									
									<div className="form-group col-md-6">		
									  <label>General Conduct</label>   
									  <select className={`form-control ${this.hasErrorFor('general_conduct') ? 'is-invalid' : ''}`} name="general_conduct" value={(this.state.general_conduct)?this.state.general_conduct:g_conduct} onChange={this.handleChange} ref={this.input}>		
										  <option value="0">--Select--</option>			  
										  <option value="satisfactory">Satisfactory</option>
										  <option value="good">Good</option>  
										  <option value="very good">Very Good</option>
										  <option value="excellent">Excellent</option>    	  
									  </select>   
									  {this.renderErrorFor('general_conduct')}           	  
									</div>	
									
									<div className="form-group col-md-6">
									  <label>Category</label>     									 
									  <input type="text" className={`form-control ${this.hasErrorFor('category') ? 'is-invalid' : ''}`} name="category" value={s_cat} ref={this.input} placeholder="Student category" onChange={this.handleChange} readOnly/>		
									  {this.renderErrorFor('category')}               	  
									</div>	
									
									<div className="form-group col-md-6">		
									  <label>If Qualified For Promotion(Mention Class)</label>   
									  <select className={`form-control ${this.hasErrorFor('qualify_promote') ? 'is-invalid' : ''}`} name="qualify_promote" value={(this.state.qualify_promote)?this.state.qualify_promote:qualified_promotion} onChange={this.handleChange} ref={this.input}>
										 <option value="0">--Select--</option>		
										  {this.state.classData.map( (item, key) => {		
											return (
										  <option key={key} value={item.classId}>{item.className}</option>
										  )     
										})}
									  </select>   
									  {this.renderErrorFor('qualify_promote')}           	  
									</div>	
									
									<div className="form-group col-md-6">		
										<label>Admission Date</label>  	
										<input type="date" className={`form-control ${this.hasErrorFor('admission_date') ? 'is-invalid' : ''}`} name="admission_date" value={s_admission_date} ref={this.input}  readOnly/>	
										{this.renderErrorFor('admission_date')} 			
   								    </div>	

									<div className="form-group col-md-6">
									  <label>If Failed(No. Of Attempts)</label>   
									  <select className={`form-control ${this.hasErrorFor('fail_attempt') ? 'is-invalid' : ''}`} name="fail_attempt" value={(this.state.fail_attempt)?this.state.fail_attempt:f_attempt} onChange={this.handleChange} ref={this.input}>		
										  <option value="0">--Select--</option>			  
										  <option value="none">None</option>
										  <option value="once">Once</option>  
										  <option value="twice">Twice</option>
										  <option value="other">Other</option>    	  
									  </select>
									  {this.renderErrorFor('fail_attempt')}           	  
									</div>	

									<div className="form-group col-md-6">
									  <label>Class At Admission Time</label>   
									  <input type="text" className={`form-control ${this.hasErrorFor('admission_class') ? 'is-invalid' : ''}`} name="class_admission" value={s_class_first} ref={this.input} placeholder="Class at admission time" readOnly/>   
									  {this.renderErrorFor('admission_class')}        			   	  
									</div>	

									<div className="form-group col-md-6">
									  <label>Last Exam</label>   
									  <select className={`form-control ${this.hasErrorFor('last_exam') ? 'is-invalid' : ''}`} name="last_exam" value={(this.state.last_exam)?this.state.last_exam:exam_last} onChange={this.handleChange} ref={this.input}>		
										 <option value="0">--Select--</option>
										  {this.state.classData.map( (item, key) => {		
											return (
										  <option key={key} value={item.classId}>{item.className}</option>
										  )     
										})}
									  </select>   
									  {this.renderErrorFor('last_exam')}           	  
									</div>	

									<div className="form-group col-md-6">	
									  <label>Class Name(Present)</label>   
									  <input type="text" className={`form-control ${this.hasErrorFor('present_class') ? 'is-invalid' : ''}`} name="class_present" value={s_class_present} ref={this.input} placeholder="Class at present time" readOnly/>  
									  {this.renderErrorFor('present_class')}           	  
									</div>	

									<div className="form-group col-md-6">		
										<label>Application Date</label>  	
										<input type="date" className={`form-control ${this.hasErrorFor('application_date') ? 'is-invalid' : ''}`} name="application_date" value={(this.state.application_date)?this.state.application_date:apply_date} onChange={this.handleChange} ref={this.input}/>		
										{this.renderErrorFor('application_date')} 
   								    </div>
									
									<div className="form-group col-md-6">		
										<label>Game(If any)</label>	
										<input type="text" className={`form-control ${this.hasErrorFor('game') ? 'is-invalid' : ''}`} name="game" value={(this.state.game)?this.state.game:s_sport} placeholder="Enter game" onChange={this.handleChange} ref={this.input}/>		
										{this.renderErrorFor('game')} 	
   								    </div>    

									<div className="form-group col-md-6">		
										<label>Certificate Issued On</label>  	
										<input type="date" className={`form-control ${this.hasErrorFor('issue_date') ? 'is-invalid' : ''}`} name="issue_date" value={(this.state.issue_date)?this.state.issue_date:gen_date} onChange={this.handleChange} ref={this.input}/>		
										{this.renderErrorFor('issue_date')} 
   								    </div>	
									
									<div className="form-group col-md-6">		
										<label>Total Working Days</label>	
										<input type="text" className={`form-control ${this.hasErrorFor('working_days') ? 'is-invalid' : ''}`} name="working_days" value={(this.state.working_days)?this.state.working_days:day_total} placeholder="Enter working days" onChange={this.handleChange} ref={this.input}/>  
										{this.renderErrorFor('working_days')} 	
   								    </div> 
									
									<div className="form-group col-md-6">		
										<label>Reason</label>	
										<input type="text" className={`form-control ${this.hasErrorFor('reason') ? 'is-invalid' : ''}`} name="reason" value={(this.state.reason)?this.state.reason:s_reason} placeholder="Enter reason" onChange={this.handleChange} ref={this.input}/>
										{this.renderErrorFor('reason')} 			
   								    </div> 
									
									<div className="form-group col-md-6">		
										<label>Working Days Present</label>	
										<input type="text" className={`form-control ${this.hasErrorFor('days_present') ? 'is-invalid' : ''}`} name="days_present" value={(this.state.days_present)?this.state.days_present:day_present} placeholder="Enter working days present" onChange={this.handleChange} ref={this.input}/>
										{this.renderErrorFor('days_present')} 	
   								    </div> 
									
									<div className="form-group col-md-6">		
										<label>Remarks</label>	
										<input type="text" className={`form-control ${this.hasErrorFor('remark') ? 'is-invalid' : ''}`} name="remark" value={(this.state.remark)?this.state.remark:s_remark} placeholder="Enter remark" onChange={this.handleChange} ref={this.input}/>			
										{this.renderErrorFor('remark')} 													
   								    </div>  									
								  
								</div>		
								
								<div className="text-right btn-submit-right">
								  <input type="submit" name="saveonly" className="btn btn-primary btn-sm mx-1" value="Update" />
								  <input type="submit" name="saveidentical" className="btn btn-primary btn-sm mx-1" value="Re-admit With Same Admission No." />      
								  <input type="submit" name="savedifferent" className="btn btn-primary btn-sm mx-1" value="Re-admit With Different Admission No." />  
								  <input type="submit" name="saveprint" className="btn btn-primary btn-sm mx-1" value="Update and Print" />							  
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

export default EditSlc;  