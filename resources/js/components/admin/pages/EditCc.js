import React, { Component } from "react";
import axios from 'axios';  
import { Link } from 'react-router-dom';      
		
import Script from "@gumgum/react-script-tag";  
import Copyright from "../basic/Copyright";
import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url=location.protocol+'//'+location.host+'/';	

class EditCc extends Component {
  
  constructor (props) {
  super(props)
  this.state = {  	
	isLoading:true,
	load_err:false,
	showError:false,  
	showSuccess:false,	
	admission_no:'',
	serial_no:'',		
	exam_month:'',
	exam_year:'',
	concession:'',
	ncc_cadet:'',
	qualify_promote:'',
	fail_attempt:'',		
	last_exam:'', 	
	game:'', 
	curricular_activity:'',	
	issue_date:'',
	working_days:'',
	reason:'',
	days_present:'',
	remark:'',  
	secured_marks:0,  	
	total_marks:0,   
	load_msg:'',			
	message:'',		   	
	classData:[],
	certificateData:[],	  
	suggestions:[],			
    errors: []  
  }
	   this.handleUpdate = this.handleUpdate.bind(this);	 
	   this.handleChange = this.handleChange.bind(this);        		
	   this.handleScore = this.handleScore.bind(this);   		
	   this.hasErrorFor = this.hasErrorFor.bind(this);
	   this.renderErrorFor = this.renderErrorFor.bind(this);
	   this.input = React.createRef();  
   }
   
handleUpdate (event) {
  event.preventDefault();
  const { student_name,serial_no,father_name,exam_year,mother_name,game,address,general_conduct,admission_date,curricular_activity,class_present,remark,dob,secured_marks,last_exam,total_marks,exam_month,last_date,exam_board,issue_date } = event.target;  
  
  const urlString = window.location.href;    
  const url = new URL(urlString);   
  const lastSegment = url.pathname.split('/').pop();	  		
  const id = lastSegment;        		
  
  const data = { 	
	name: student_name.value,  
    f_name: father_name.value,		
	m_name: mother_name.value,       
	dob: dob.value,  
    admission_date: admission_date.value,		 	
	present_class: class_present.value,
	address:address.value,      
	curricular_activity:curricular_activity.value,    
	secured_marks:secured_marks.value,  
	total_marks:total_marks.value,  
	last_date:last_date.value,  
	exam_board:exam_board.value,  
	serial_no:serial_no.value,  
	exam_month:exam_month.value,	
	exam_year:exam_year.value,  	  
	general_conduct:general_conduct.value,  
	last_exam:last_exam.value,      	
	game:game.value,		
	issue_date:issue_date.value,		 	   
	remark:remark.value, 				   	
  }	    
    
  axios.post(`${base_url}api/cc/update/${id}`,data).then(response => {  	  			
		console.log(response);					
		if (response.data.status === 'successed')      
		{		
			this.setState({ showError:false,showSuccess:true,message:response.data.message,errors:response.data.errors});				
			window.location.href = base_url+"cc_list";	 		 								
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

handleChange(event){		
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });   
}

handleScore(event){
    event.preventDefault();		     
	
    const re = /^[0-9.\b]+$/;     
	var inp = event.target.name;    
	var inp_val = event.target.value;      			
	const arr=inp.split('.');	
	
	if(re.test(inp_val) && (arr.length<=2))		
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

	axios.get(`${base_url}api`+`/cc/edit/${id}`).then(response => {
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
const s_address=(this.state.certificateData.length >0)?this.state.certificateData[0].permanent_address:''; 	   
const s_admission_date=(this.state.certificateData.length >0)?this.state.certificateData[0].admission_date:'';  
const s_serial=(this.state.certificateData.length >0)?this.state.certificateData[0].serial_no:''; 	
const em_year=(this.state.certificateData.length >0)?this.state.certificateData[0].exam_year:''; 
const s_game=(this.state.certificateData.length >0)?this.state.certificateData[0].game:''; 
const s_conduct=(this.state.certificateData.length >0)?this.state.certificateData[0].general_conduct:''; 
const s_curricular=(this.state.certificateData.length >0)?this.state.certificateData[0].curricular_activity:''; 
const admission_class=(this.state.certificateData.length >0)?this.state.certificateData[0].className:''; 
const s_remark=(this.state.certificateData.length >0)?this.state.certificateData[0].remark:''; 
const secured_score=(this.state.certificateData.length >0)?this.state.certificateData[0].secured_marks:''; 
const exam_last=(this.state.certificateData.length >0)?this.state.certificateData[0].last_exam:''; 
const total_score=(this.state.certificateData.length >0)?this.state.certificateData[0].total_marks:'';   
const month_exam=(this.state.certificateData.length >0)?this.state.certificateData[0].exam_month:'';   
const last_day=(this.state.certificateData.length >0)?this.state.certificateData[0].last_date:'';   
const board_exam=(this.state.certificateData.length >0)?this.state.certificateData[0].exam_board:'';  
const issue_dt=(this.state.certificateData.length >0)?this.state.certificateData[0].issue_date:'';  	  	
   
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
								<h4>Edit Character Certificate</h4>				
							</div>
						</div>
						<div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
							<ol className="breadcrumb">
								<li><a href={`/cc_list`} className="btn bg-blue-soft text-blue">
								 <i className="fa fa-angle-double-left"></i> Back to Character Certificate List
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
									<label>Sr.No.</label>	
									<input type="text" className={`form-control ${this.hasErrorFor('serial_no') ? 'is-invalid' : ''}`} name="serial_no" value={(this.state.serial_no)?this.state.serial_no:s_serial}  placeholder="Enter Serial No." ref={this.input} onChange={this.handleChange}/>		
									{this.renderErrorFor('serial_no')} 					
								  </div>   							  
								  
								   <div className="form-group col-md-6">		
									<label>Father Name</label>	
									<input type="text" className={`form-control ${this.hasErrorFor('f_name') ? 'is-invalid' : ''}`} name="father_name" value={f_name} ref={this.input} placeholder="Enter father name" readOnly/>		
									{this.renderErrorFor('f_name')} 			
								  </div>
								  
								  <div className="form-group col-md-6">
									  <label>Exam Year</label>		
									  <select className={`form-control ${this.hasErrorFor('exam_year') ? 'is-invalid' : ''}`} name="exam_year" value={(this.state.exam_year)?this.state.exam_year:em_year} ref={this.input} onChange={this.handleChange}>   
										  <option value="0">--Select--</option>  
										  {yearList.map((key, index) => (
											<option value={key} key={index}>		  
											  {key}
											</option>     				
										  ))}
									  </select>
									  {this.renderErrorFor('exam_year')}           	  
									</div>
									
									<div className="form-group col-md-6">		
										<label>Mother Name</label>	
										<input type="text" name="mother_name" className={`form-control ${this.hasErrorFor('m_name') ? 'is-invalid' : ''}`} value={mh_name} ref={this.input} placeholder="Enter mother name" readOnly/>		
										{this.renderErrorFor('m_name')} 	
									</div>   
									
									<div className="form-group col-md-6">		
										<label>Game Name</label>	
										<input type="text" className={`form-control ${this.hasErrorFor('game') ? 'is-invalid' : ''}`} name="game" value={(this.state.game)?this.state.game:s_game} placeholder="Enter game" ref={this.input} onChange={this.handleChange}/>		
										{this.renderErrorFor('game')} 	
									</div> 

									<div className="form-group col-md-6">		
										<label>Address</label>	
										<textarea className={`form-control ${this.hasErrorFor('address') ? 'is-invalid' : ''}`} name="address" value={s_address} rows="2" cols="2" ref={this.input} readOnly>{s_address}</textarea>	
										{this.renderErrorFor('address')}   	
									</div> 
									
									<div className="form-group col-md-6">		
									  <label>General Throughout Conduct</label>   
									  <select className={`form-control ${this.hasErrorFor('general_conduct') ? 'is-invalid' : ''}`} name="general_conduct" value={(this.state.general_conduct)?this.state.general_conduct:s_conduct} ref={this.input} onChange={this.handleChange}>		
										  <option value="0">--Select--</option>			  
										  <option value="satisfactory">Satisfactory</option>		
										  <option value="good">Good</option>  
										  <option value="very good">Very Good</option>
										  <option value="excellent">Excellent</option>    	  
									  </select>   
									  {this.renderErrorFor('general_conduct')}           	  
									</div>
									
									<div className="form-group col-md-6">		
										<label>Admission Date</label>  	
										<input type="date" className={`form-control ${this.hasErrorFor('admission_date') ? 'is-invalid' : ''}`} name="admission_date" value={s_admission_date} ref={this.input}  readOnly/>	
										{this.renderErrorFor('admission_date')} 			
									</div>	
									
									<div className="form-group col-md-6">
									  <label>Co-Curricular Activities</label>   
									  <select className={`form-control ${this.hasErrorFor('curricular_activity') ? 'is-invalid' : ''}`} name="curricular_activity" value={(this.state.curricular_activity)?this.state.curricular_activity:s_curricular} ref={this.input} onChange={this.handleChange}>		
										  <option value="0">--Select--</option>			  
										  <option value="participate">Participated</option>
										  <option value="not participate">Not Participated</option>    
										  <option value="twice">Twice</option>
										  <option value="other">Other</option>    	  
									  </select>
									  {this.renderErrorFor('curricular_activity')}              	  
									</div>	

									<div className="form-group col-md-6">	
									  <label>Class Name</label>   
									  <input type="text" className={`form-control ${this.hasErrorFor('present_class') ? 'is-invalid' : ''}`} name="class_present" value={admission_class} ref={this.input} placeholder="Class name" readOnly/>  
									  {this.renderErrorFor('present_class')}           	  
									</div>	
									
									<div className="form-group col-md-6">		
										<label>Remarks</label>	
										<input type="text" className={`form-control ${this.hasErrorFor('remark') ? 'is-invalid' : ''}`} name="remark" value={(this.state.remark)?this.state.remark:s_remark} placeholder="Enter remark" ref={this.input} onChange={this.handleChange}/>			
										{this.renderErrorFor('remark')} 											
									</div> 		

									<div className="form-group col-md-6">		
										<label>Date Of Birth</label>  	
										<input type="date" className={`form-control ${this.hasErrorFor('dob') ? 'is-invalid' : ''}`} name="dob" value={s_dob} ref={this.input} readOnly/>		
										{this.renderErrorFor('dob')} 
									</div>	
									
									<div className="form-group col-md-6">		
										<label>Secured Marks</label>	
										<input type="text" className={`form-control ${this.hasErrorFor('secured_marks') ? 'is-invalid' : ''}`} name="secured_marks" value={(this.state.secured_marks)?this.state.secured_marks:secured_score} placeholder="Enter secured marks" ref={this.input} onChange={this.handleScore}/>
										{this.renderErrorFor('secured_marks')} 		
									</div>  		
									
									<div className="form-group col-md-6">
									  <label>Last Exam</label>   
									  <select className={`form-control ${this.hasErrorFor('last_exam') ? 'is-invalid' : ''}`} name="last_exam" value={(this.state.last_exam)?this.state.last_exam:exam_last} ref={this.input} onChange={this.handleChange}>		
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
										<label>Total Marks</label>	
										<input type="text" className={`form-control ${this.hasErrorFor('total_marks') ? 'is-invalid' : ''}`} name="total_marks" value={(this.state.total_marks)?this.state.total_marks:total_score} placeholder="Enter total marks" ref={this.input} onChange={this.handleScore}/>
										{this.renderErrorFor('total_marks')} 		  	
									</div>  
									
									<div className="form-group col-md-6">
										  <label>Exam Month</label>
										  <select className={`form-control ${this.hasErrorFor('exam_month') ? 'is-invalid' : ''}`} name="exam_month" value={(this.state.exam_month)?this.state.exam_month:month_exam} ref={this.input} onChange={this.handleChange}>   
											  <option value="0">--Select--</option>  
											  {monthList.map((key, index) => (
												<option value={index+1} key={index}>		
												  {key}
												</option>     			
											  ))}
										  </select>		
										  {this.renderErrorFor('exam_month')}           	  
									  </div>  
									  
									  <div className="form-group col-md-6">		  
										<label>Last Date In School</label>    	
										<input type="date" className={`form-control ${this.hasErrorFor('last_date') ? 'is-invalid' : ''}`} ref={this.input} name="last_date" value={(this.state.last_date)?this.state.last_date:last_day} onChange={this.handleChange}/>		
										{this.renderErrorFor('last_date')} 
									  </div>   
									  
									  <div className="form-group col-md-6">		
										<label>Examination Board</label>	
										<input type="text" className={`form-control ${this.hasErrorFor('exam_board') ? 'is-invalid' : ''}`} name="exam_board" value={(this.state.exam_board)?this.state.exam_board:board_exam} placeholder="Enter examination board" ref={this.input} onChange={this.handleChange}/>		
										{this.renderErrorFor('exam_board')} 	
									  </div>    
									  
									  <div className="form-group col-md-6">		
											<label>Issued Date</label>  	
											<input type="date" className={`form-control ${this.hasErrorFor('issue_date') ? 'is-invalid' : ''}`} name="issue_date" value={(this.state.issue_date)?this.state.issue_date:issue_dt} ref={this.input} onChange={this.handleChange}/>		
											{this.renderErrorFor('issue_date')}   
										</div>	 				
								  
								</div>		
								
								<div className="text-right btn-submit-right">
								  <input type="submit" name="saveonly" className="btn btn-primary btn-sm mx-1" value="Update" />    
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

export default EditCc;  