import React, { Component } from "react";
import axios from 'axios';  
import { Link } from 'react-router-dom';      
		
import Script from "@gumgum/react-script-tag";  
import Copyright from "../basic/Copyright";
import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url=location.protocol+'//'+location.host+'/';	

class EmployeeAttendanceEntry extends Component {  
  
  constructor (props) {
  super(props)
  this.state = {  	
	isLoading:true, 
	showError:false,  
	showSuccess:false,	 	
	showErr:false, 	
	showErr1:false,   	
	showErr2:false, 
	txtMsg1:'',  	
	txtMsg2:'',  	
	school_id:'',  	
	department_id:'', 
	designation_id:'',     
	attendance_day:'',				
	attendance_date:'',			
	employee_no:'',  	
	mode:'all',		
	typeList:[],			
	employeeData:[], 
	attendancelst:[],
	attendanceinp:[],		
	attendancearr:[],
	attendancerow:[],		
	suggestions:[],		 	
	employeeList:[],	
	departments:[],			
	designations:[],	
	errors: [],			    	
  }
  
   this.handleCreate = this.handleCreate.bind(this);   
   this.handleChange = this.handleChange.bind(this);  
   this.handleDepartment = this.handleDepartment.bind(this);         
   this.handleDesignation = this.handleDesignation.bind(this);   
   this.handleRadio = this.handleRadio.bind(this); 		
   this.handleAttendance = this.handleAttendance.bind(this);    	
   this.updateAttendance = this.updateAttendance.bind(this);    
   this.loadDetail = this.loadDetail.bind(this);      
   this.loadAttendance = this.loadAttendance.bind(this); 	
   this.handleAdmission = this.handleAdmission.bind(this);    
   this.setAdmission = this.setAdmission.bind(this);    
   this.hasErrorFor = this.hasErrorFor.bind(this);	
   this.renderErrorFor = this.renderErrorFor.bind(this);   	
   this.input = React.createRef();  	
	    
}  

handleChange(event){		
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });   				
} 

handleRadio(event) {
	const inpt=event.target.name;  
	let currDate = new Date();		
	let date_assign = currDate.toISOString().substring(0,10);		
	
	this.setState({ 
		[inpt]:event.target.value,  		
		employee_no:'',				
		attendance_date:date_assign,		
		attendance_day:date_assign,		
		employeeData:[],
		suggestions:[],  		
		employeeList:[],  
		attendancelst:[],		
		attendancearr:[],	
		attendanceinp:[],
		attendancerow:[],  			
	}); 				   		
	
}  
  
handleAdmission(event){		
    event.preventDefault(); 
	const search = event.target.value; 	
	const schoolid=this.state.school_id?this.state.school_id:'';    
    this.setState({ [event.target.name]: event.target.value });     
	
	 if (search.length > 0) {
        // make api call				
			axios.get(`${base_url}api`+`/empattendance/getsuggest/${schoolid}/${search}`).then(response => {
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
	const emp_no = event.target.id; 	

	this.setState({
	  employee_no:emp_no,	  			
	  load_msg:'',	
	  load_err:false,
	  showError: false, 	
	  message:'',    	
	  suggestions: []   	
	}); 	  
	
} 

handleCreate(event) { 	
  event.preventDefault();      		  
  const { attendance_date,attendance_day } = event.target; 		
  const schoolid=this.state.school_id?this.state.school_id:'';   	
  const attendfor=this.state.mode;	
  const button=window.event.submitter.name;   
  
  let data={};  
  const obj={};    

	if(button=='save')			
	{
		const attendancelist = this.state.attendancelst;      			
		
		for(var key in attendancelist) 		
		{  			 
			if(attendancelist[key] !== null)
			{
				if(attendancelist[key].name=='attendance[]')	
				{
					obj[parseInt(attendancelist[key].id)]=attendancelist[key].value;  		   				
				}		
			}
		} 
		
		if(attendfor=='all')		
		{
			  data = {
				attend_date:attendance_date.value,  
				school_id:schoolid,
				emp_arr:obj,	
			  }
		}
		else
		{
			  data = {
				attend_date:attendance_day.value,   		
				school_id:schoolid,
				emp_arr:obj,   	
			  }
		} 	
		
		axios.post(`${base_url}`+'api/empattendance/create',data).then(response => {  				
			console.log(response);				  
			if (response.data.status === 'successed')  			    
			{		
				this.setState({ showError:false,showSuccess:true,message:response.data.message,errors:response.data.errors,employeeData:[]});												
			}
			else
			{
			   this.setState({ showError:true,showSuccess:false,message:response.data.message,errors:response.data.errors});	  
			}		
		})
		.catch(error => {  	   
		   console.log(error.message); 	
		   console.log(error.response.data);		
		}) 
	}
	else
	{
		const attendancelist = this.state.attendanceinp;   
		
		for(var key in attendancelist) 		
		{  			 
			if(attendancelist[key] !== null)
			{				
				if(attendancelist[key].name=='attendance_new[]')	
				{
					obj[parseInt(attendancelist[key].id)]=attendancelist[key].value;  		   				
				}		
			}
		} 
		
		if(attendfor=='all')		
		{
			  data = {
				attend_date:attendance_date.value,  
				school_id:schoolid,
				emp_arr:obj,	
			  }
		}
		else
		{
			  data = {
				attend_date:attendance_day.value,   	
				school_id:schoolid,
				emp_arr:obj,   	
			  }
		}
		
		axios.post(`${base_url}`+'api/empattendance/edit',data).then(response => {  				
			console.log(response);				  
			if (response.data.status === 'successed')  		  	    
			{		
				this.setState({ showError:false,showSuccess:true,message:response.data.message,errors:response.data.errors,employeeList:[]});												
			}
			else
			{
			   this.setState({ showError:true,showSuccess:false,message:response.data.message,errors:response.data.errors});	  
			}		
		})
		.catch(error => {  	   
		   console.log(error.message); 	
		   console.log(error.response.data);								
		}) 
	}
    
}   

handleAttendance(event){		
    event.preventDefault();
	const attn_id = event.target.id;  
	const attn_value = event.target.value;  
	const attendarr ={};	
	
	let attendances=this.state.attendancearr;  
	
	for(var key in attendances) 		
	{
		attendarr[key]=attendances[key];		
	} 
	
	attendarr[attn_id]=attn_value;	  	
    this.setState({ attendancearr:attendarr });   
	
}

updateAttendance(event){		
    event.preventDefault();
	const attn_id = event.target.id;  
	const attn_value = event.target.value;  
	const attendarr ={};	
	
	let attendances=this.state.attendancerow;  
	
	for(var key in attendances) 		
	{
		attendarr[key]=attendances[key];		
	} 
	
	attendarr[attn_id]=attn_value;	  	
    this.setState({ attendancerow:attendarr });   		
	
}	

handleDesignation(event){		
    event.preventDefault();
    this.setState({ [event.target.name]:event.target.value,attendancelst:[],attendanceinp:[] });   				
} 

handleDepartment(event){		
    event.preventDefault();
	const id=event.target.value; 	  
	
	if(id !='')
	{
		this.setState({ [event.target.name]: event.target.value });   
		
		axios.get(`${base_url}api`+`/employee/getdesignations/${id}`).then(response => {  
			console.log(response);	
			this.setState({ 
				designation_id:'', 	
				designations: response.data.data ? response.data.data :[],		
				attendancelst:[],	
				attendanceinp:[]
			}); 
		})
		.catch(error => {  	   
		   console.log(error.message); 	   				
		})    
	}
	else
	{
		this.setState({ [event.target.name]: event.target.value,designation_id:'',designations:[],attendancelst:[],	
				attendanceinp:[] });   			
	}		     
}   

loadDetail(e){	
	e.preventDefault();		
	const attendate = this.state.attendance_date?this.state.attendance_date:''; 
	const schoolid = this.state.school_id?this.state.school_id:''; 	 	
	const empno=this.state.employee_no?this.state.employee_no:'';  
	const depart=this.state.department_id?this.state.department_id:'';  
	const desig=this.state.designation_id?this.state.designation_id:'';  
	const attendfor=this.state.mode;	 	

	if(attendfor=='all')	
	{
		if(depart=='')		
		{
			this.setState({showErr1:true,txtMsg1:'Please select department!!',employeeData:[],employeeList:[]});   
		} 	
		else
		{
			axios.get(`${base_url}api`+`/empattendance/detail/${schoolid}/${depart}/${attendate}/${desig}`).then(response => {    	
				console.log(response); 		
				const employees=response.data.data?response.data.data:[];     				  
				this.setState({  			  						
					employeeData:employees, 
					employeeList:[],  	
					attendanceinp:[],   	
					attendancerow:[],  
					attendancelst:[],  
					showErr1:false,	 				
					showErr:(employees.length>0)?false:true,        				 									
					txtMsg1:'', 						
				}); 
			})
			.catch(error => {  	   
			   console.log(error.message); 	  		
			})    	
		}	 		
	}
	else
	{
		if(empno=='')		
		{
			this.setState({showErr2:true,txtMsg2:'Please enter employee name/no.!!',employeeData:[],employeeList:[]});   
		} 	
		else
		{
			axios.get(`${base_url}api`+`/empattendance/getindividual/${schoolid}/${empno}`).then(response => {
				console.log(response); 		   
				const employees=response.data.data?response.data.data:[];     		  
				this.setState({  			  						
					employeeData:employees, 
					employeeList:[], 
					attendanceinp:[],   	
					attendancerow:[],  
					attendancelst:[],     	
					showErr1:false,	 
					showErr2:false,		
					showErr:(employees.length>0)?false:true,    						  							
					txtMsg1:'', 
					txtMsg2:'',			
				}); 
			})
			.catch(error => {  	   
			   console.log(error.message); 			  		
			})    	
		}	
		
	}		
		   
}	  	 

loadAttendance(e){	
	e.preventDefault();		
	const attendate = this.state.attendance_date?this.state.attendance_date:''; 
	const attenday = this.state.attendance_day?this.state.attendance_day:''; 
	const schoolid = this.state.school_id?this.state.school_id:''; 	 	
	const empno=this.state.employee_no?this.state.employee_no:'';  
	const depart=this.state.department_id?this.state.department_id:'';  
	const desig=this.state.designation_id?this.state.designation_id:'';  
	const attendfor=this.state.mode;	 	 	  				

	if(attendfor=='all')	
	{
		if(depart=='')		
		{
			this.setState({showErr1:true,txtMsg1:'Please select department!!',employeeList:[],employeeData:[]});   		
		} 	
		else
		{ 			
			axios.get(`${base_url}api`+`/empattendance/all/${schoolid}/${depart}/${attendate}/${desig}`).then(response => { 
				console.log(response); 						
				const employees=response.data.data?response.data.data:[];   
				const attendarr ={};		

				employees.forEach((item,key) => 
				{  					 
					attendarr[item.id]=item.attend_type;  
				});  
				
				this.setState({  			  						
					employeeList:employees,
					attendancerow:attendarr,  					
					attendanceinp:[],   
					attendancelst:[],		
					attendancearr:[],  	  
					employeeData:[],  
					showErr1:false,	 				
					showErr:(employees.length>0)?false:true,    		  							
					txtMsg1:'', 						
				}); 
			})
			.catch(error => {  	   
			   console.log(error.message); 	  		
			})    	
		}	 		
	}
	else
	{
		if(empno=='')	
		{
			this.setState({showErr2:true,txtMsg2:'Please enter employee name/no.!!',employeeList:[],employeeData:[]});   
		} 	
		else
		{
			axios.get(`${base_url}api`+`/empattendance/individual/${empno}/${attenday}/${schoolid}`).then(response => {
				console.log(response); 				   
				const employees=response.data.data?response.data.data:[];			

				const attendarr ={};		

				employees.forEach((item,key) => 
				{  					 
					attendarr[item.id]=item.attend_type;  				
				});  
				
				this.setState({  			  						
					employeeList:employees,  									  	
					attendancerow:attendarr,    			
					attendanceinp:[],   
					attendancelst:[],		
					attendancearr:[],  	 					
					employeeData:[], 	  
					showErr1:false,	 
					showErr2:false,		
					showErr:(employees.length>0)?false:true,   		   							
					txtMsg1:'', 
					txtMsg2:'',			
				}); 
			})
			.catch(error => {  	   
			   console.log(error.message); 	  		
			})    	
		}	
		
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

hasErrorFor (field) {
  return !!this.state.errors[field]		
}

renderErrorFor (field) {
  if (this.hasErrorFor(field)) {
	return ( <span className='invalid-feedback'> <strong>{this.state.errors[field][0]}</strong></span> )
  }
}   
	
componentDidMount() {  
	const isAuthenticated = localStorage.getItem("isLoggedIn");	
	const token = localStorage.getItem("login_token");	
	
	let currDate = new Date();		
	let date_assign = currDate.toISOString().substring(0,10);	
	
	axios.get(`${base_url}api/checkauth?api_token=${token}`).then(response => {		
			
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
	
	axios.get(`${base_url}api`+'/attendance/gettypes').then(response => {   		
	this.setState({  			
			typeList:response.data.data?response.data.data:[],    		
		});
	})
	.catch(error => {  	   
	   console.log(error.message); 			
    })

	this.setState({ attendance_date:date_assign,attendance_day:date_assign });     

	axios.get(`${base_url}api`+'/employee/getdepartments').then(response => {  					
		this.setState({  			
				departments: response.data.data ? response.data.data : [],	
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
  width:"220px",  	
};     

const style_txt = {  
  display: "block", 
  width: "100%",
  marginTop: "0.25rem",  		
  fontSize: "80%",
  color: "#FF1616",	
};   

let optlist = []; 	

for (const property in this.state.subjectList) {   
  optlist.push(<option key={property} value={property}>{this.state.subjectList[property]}</option>);  	
} 	  	  	
   
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
					<h4>Attendance Entry</h4>		
				</div>
			</div>
		</div>
		{/******<!-- row -->*****/}   

		<div className="row">
			<div className="col-12">
				<div className="card">
					{/******<!--div className="card-header"><h4 className="card-title">Basic Datatable</h4></div-->*****/}
					
					<div className="card-body create-user-table">
					<div className="basic-form form-own">
						
					<form onSubmit={this.handleCreate}>
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
								<div className="form-group col-md-12">  		
									<label>Attendance For</label>
									<div className="form-row">
									
									  <div className="form-group col-md-3">	
										<div className="form-check">
										  <input className="form-check-input" type="radio" name="mode" value="all" checked={this.state.mode==='all'} onChange={this.handleRadio}/>
										  <label className="form-check-label">All Employee</label>
										</div> 
									  </div>
									  
									  <div className="form-group col-md-3">			
										<div className="form-check">
										  <input className="form-check-input" type="radio" name="mode" value="individual" checked={this.state.mode==='individual'} onChange={this.handleRadio}/>
										  <label className="form-check-label">Individual Employee</label>	
										</div>
									  </div> 	  
									  
									</div>		
								</div>
							</div>
							{
								(this.state.mode=='all')?(   
							<div className="form-row">
							
							  <div className="form-group col-md-3">			
								<label>Attendance Date</label>									
								<input type="date" className={`form-control input-daterange-timepicker ${this.hasErrorFor('attend_date') ? 'is-invalid' : ''}`} name="attendance_date" value={(this.state.attendance_date)?this.state.attendance_date:''} onChange={this.handleChange} placeholder="dd/mm/yy" />		
								{this.renderErrorFor('attend_date')}    
							  </div>
							
							  <div className="form-group col-md-3">
								<label>Department</label>
								<select className={`form-control ${this.hasErrorFor('department_id') ? 'is-invalid' : ''}`} name="department_id" value={(this.state.department_id)?this.state.department_id:''} onChange={this.handleDepartment}> 											
								  <option value="">--Select--</option>  
								  <option value="all">All</option>  
								  {this.state.departments.map( (item, key) => {     
									return (
								  <option key={key} value={item.departmentId}>{item.departmentName}</option>  				
								  )   
								})}  											
								</select>
								{this.renderErrorFor('department_id')}  
							   {this.state.showErr1?   
								 <span style={style_txt}>  
									<strong>{this.state.txtMsg1}</strong>    				   	  					   
								  </span>					
								 : null}    
							  </div>
							  
							  <div className="form-group col-md-3">			
								<label>Designation</label>			
								<select className={`form-control ${this.hasErrorFor('designation_id') ? 'is-invalid' : ''}`} name="designation_id" value={(this.state.designation_id)?this.state.designation_id:''} onChange={this.handleDesignation}> 											
								  <option value="">--Select--</option>  
								  {this.state.designations.map( (item, key) => {     
									return (
								  <option key={key} value={item.designationId}>{item.designationName}</option>  				
								  )   
								})}   											
								</select>		
								{this.renderErrorFor('designation_id')} 									
							  </div>  					  
							  
							</div>):"" 				
							}   
							{
								(this.state.mode=='individual')?(   
							<div className="form-row">
							  <div className="form-group col-md-3">		
								<label>Attendance Date</label>
								<input type="date" className={`form-control input-daterange-timepicker ${this.hasErrorFor('attend_date') ? 'is-invalid' : ''}`} name="attendance_day" value={(this.state.attendance_day)?this.state.attendance_day:''} onChange={this.handleChange} placeholder="dd/mm/yy" />
								{this.renderErrorFor('attend_date')}  		
							  </div> 	
							  <div className="form-group col-md-3">		
								<label>Enter Name/No.</label>		
								<input type="text" className="form-control" name="employee_no" value={(this.state.employee_no)?this.state.employee_no:''} onChange={this.handleAdmission} placeholder="Enter Employee Name/No."/>
								{this.state.showErr2?   
								 <span style={style_txt}>  
									<strong>{this.state.txtMsg2}</strong>       	  					   
								  </span>					
								 : null}
									<div style={style1}>   			
									{
									  this.state.suggestions.map((item, index) => (  
										<div id={item.emp_no} key={item.id} style={style2} onClick={this.setAdmission}>{item.emp_name}-{item.emp_no}</div>  		   		  
									  ))   		
									} 
								  </div>   		
							  </div>
							  
							</div>):"" 							
							}     
							
							<div className="form-row">		
								<div className="col-md-12 text-right">		
									<input type="button" value="Load Attendance Detail" className="btn btn-primary btn-sm mx-1" onClick={this.loadDetail}/>
									<input type="button" value="Modify Attendance Detail" className="btn btn-primary btn-sm mx-1" onClick={this.loadAttendance} />  
								</div>
							</div>	
						  
						{
						this.state.employeeData.length>0?(
						<>			
						<div className="table-responsive"> 							
							<table className="table table-bordered table-striped verticle-middle table-responsive-sm">
								<thead>
									<tr>
										<th scope="col">S. No.</th>
										<th scope="col">Emp No.</th>
										<th scope="col">Name</th>   
										<th scope="col">Department</th>
										<th scope="col">Designation</th>    
										<th scope="col">Attendance</th> 
									</tr>
								</thead>
								<tbody>
									{
									  this.state.employeeData.map( (item, key) => {		
										return (  
									  <tr key={key}>
										<td>{++key}</td>  
										<td>{item.emp_no}</td>
										<td>{item.emp_name}</td>		
										<td>{item.departmentName}</td>
										<td>{item.designationName}</td>  
										<td>
											<select className={`form-control`} name="attendance[]" id={item.id} onChange={this.handleAttendance} ref={node =>this.state.attendancelst.push(node)} value={(this.state.attendancearr.hasOwnProperty(item.id))?this.state.attendancearr[item.id]:''}> 
												<option value="">--Select--</option>   
												{
												  this.state.typeList.map((item,key) => {		
													return (  
												  <option key={key} value={item.id}>{item.name}</option>	  						
												  )     
												})
												}  
											</select> 			
										</td> 
									  </tr>				
									  )     
									})
									} 									
								</tbody>
							</table>  
						</div>
						<div className="submit-btn form-own text-right">		
						  <input type="submit" name="save" value="Save" className="btn btn-primary"/>  
						</div>
						</>	
						)
						:''			
						}   
						
						{
						this.state.employeeList.length>0?(
						<>			
						<div className="table-responsive"> 							
							<table className="table table-bordered table-striped verticle-middle table-responsive-sm">
								<thead>
									<tr>
										<th scope="col">S. No.</th>
										<th scope="col">Emp No.</th>   	
										<th scope="col">Name</th> 										  
										<th scope="col">Department</th> 
										<th scope="col">Designation</th>   
										<th scope="col">Marked attendance</th> 		
										<th scope="col">New attendance</th> 	  
									</tr>
								</thead>
								<tbody>
									{
									  this.state.employeeList.map( (item, key) => {		
										return (  
									  <tr key={key}>
										<td>{++key}</td>  
										<td>{item.emp_no}</td>
										<td>{item.emp_name}</td>		
										<td>{item.departmentName}</td>
										<td>{item.designationName}</td>  
										<td>{item.name}</td>		
										<td>
											<select className={`form-control`} name="attendance_new[]" id={item.id} onChange={this.updateAttendance} ref={node =>this.state.attendanceinp.push(node)} value={(this.state.attendancerow.hasOwnProperty(item.id))?this.state.attendancerow[item.id]:''}> 
												<option value="">--Select--</option>   
												{
												  this.state.typeList.map((item,key) => {		
													return (  
												  <option key={key} value={item.id}>{item.name}</option>	  						
												  )     
												})
												}  
											</select> 							
										</td> 
									  </tr>				
									  )     
									})
									} 									
								</tbody>
							</table>  
						</div>
						<div className="submit-btn form-own text-right">
						  <input type="submit" name="update" value="Update" className="btn btn-primary"/> 				 
						</div>		
						</>	
						)
						:''			
						}   
					  
					  {this.state.showErr?   
						 <div className="alert alert-danger" style={{color:"brown"}}>  
							<strong>No data found!!</strong>       	  					   
						  </div>						
						 : null}  
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

export default EmployeeAttendanceEntry;    