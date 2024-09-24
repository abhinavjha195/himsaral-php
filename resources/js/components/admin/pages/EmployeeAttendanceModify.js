import React, { Component } from "react";
import axios from 'axios'; 
import { Link } from 'react-router-dom';       

import Script from "@gumgum/react-script-tag";	
import Copyright from "../basic/Copyright";	
import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";    			

const base_url=location.protocol+'//'+location.host+'/';   						

class EmployeeAttendanceModify extends Component {		
	
  constructor(props) {
	  super(props)
	  this.state = { 		  		  
		  showError: false,
		  showSuccess: false,			
		  showErr:false,	  
		  showErr1:false,	 	
		  showErr2:false,		 
		  isLoading:true,
		  month_id:'',	
		  year_id:'',	
		  department_id:'', 
		  designation_id:'',   	
		  school_id:'', 
		  txtMsg1:'', 	
		  txtMsg2:'',   
		  cells:'',  
		  yearData:[],
		  typeList:[],
		  departments:[],			
		  designations:[],		
		  attendanceData:[],
		  attendancelst:[],		
		  attendancearr:[],	
		  errors:[]  
	  }
	  
	  this.handleChange = this.handleChange.bind(this);  
	  this.handleDepartment = this.handleDepartment.bind(this);                
	  this.loadDetail = this.loadDetail.bind(this);   
	  this.handleUpdate = this.handleUpdate.bind(this);     	
	  this.handleAttendance = this.handleAttendance.bind(this);    
	  this.hasErrorFor = this.hasErrorFor.bind(this);	
	  this.renderErrorFor = this.renderErrorFor.bind(this);   	
	  this.input = React.createRef();    		
} 

handleChange(event){		
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });   		
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

handleUpdate(event) { 	
  event.preventDefault();   
  
  const { month_id,year_id } = event.target; 		 
  const schoolid=this.state.school_id?this.state.school_id:'';     		
  const data={
	  'month_id':month_id.value,		
	  'year_id':year_id.value,			
	  'school_id':schoolid,	  			
	  'attendances':this.state.attendancearr,   				
  };  

	axios.post(`${base_url}`+'api/empattendance/modify',data).then(response => {  		  		
		console.log(response);				  
		if (response.data.status === 'successed')  			    
		{		
			this.setState({ showError:false,showSuccess:true,message:response.data.message,errors:response.data.errors});												
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

handleAttendance(event){		
    event.preventDefault();
	
	const attn_id = event.target.id;   	 	
	const attn_value = event.target.value;  
	const day_id = event.target.getAttribute("data-id");    
	
	const attendarr ={};	
	let attendances=this.state.attendancearr;  
	
	for(var key in attendances) 		
	{
		attendarr[key]=attendances[key];		
	} 
	
	if(attendances.hasOwnProperty(attn_id))
	{ 		
		let arc=attendances[attn_id].split(',');  
		let lvl="";		
		for(var i=0;i<arc.length;i++) 
		{
			let arr=arc[i].split(':');
			if(day_id !=parseInt(arr[0]))	
			{
				lvl +=arc[i]+',';   					
			}			
		} 		
		attendarr[attn_id]=lvl+day_id+':'+attn_value;	 					
	}
	else
	{
		attendarr[attn_id]=day_id+':'+attn_value;	   		 
	} 		
				 
    this.setState({ attendancearr:attendarr });   		
	
}

loadDetail(e){	
	e.preventDefault();				
	const monthid = this.state.month_id?this.state.month_id:''; 
	const yearid = this.state.year_id?this.state.year_id:'';  
	const schoolid=this.state.school_id?this.state.school_id:'';   	  	
	const departid=this.state.department_id?this.state.department_id:'';  	
	const desigid=this.state.designation_id?this.state.designation_id:''; 

	if(monthid=='')		
	{
		this.setState({showErr1:true,showErr2:false,txtMsg2:'',txtMsg1:'Please select month!!',attendanceData:[],cells:0});   
	} 	
	else if(yearid=='')		
	{
		this.setState({showErr1:false,showErr2:true,txtMsg1:'',txtMsg2:'Please select year!!',attendanceData:[],cells:0});   		
	} 
	else
	{
		axios.get(`${base_url}api`+`/empattendance/calender/${monthid}/${yearid}/${schoolid}/${departid}/${desigid}`).then(response => {    	
			console.log(response); 				
			const attendances=response.data.data?response.data.data.records:[];     	
			const calc=response.data.data?response.data.data.days:0;   		
			let attendarr ={};  		
			
			attendances.forEach((item) => {
				
				let day_arr=item.attend_days.split(',');  
				let type_arr=item.attend_types.split(',');    
				
				for (let i=0;i<day_arr.length;i++) { 
					// console.log(type_arr[i]);  
					let lvl="";	 	
					if(attendarr.hasOwnProperty(item.id))
					{ 
						lvl=attendarr[item.id]; 
						attendarr[item.id]=lvl+','+day_arr[i]+':'+type_arr[i];  	 							
					}
					else
					{
						attendarr[item.id]=day_arr[i]+':'+type_arr[i];  	
					}
				}
			});  
			
			this.setState({  			  						
				attendanceData:attendances,
				attendancearr:attendarr,  			
				cells:calc,  	
				showErr1:false,	 	
				showErr2:false,		
				showErr:(attendances.length>0)?false:true,    				  									
				txtMsg1:'', 	
				txtMsg2:'', 	
			}); 
		})
		.catch(error => {  	   
		   console.log(error.message); 	  		
		})    	
	}	 	
	
		   
}	  	 	
				
hasErrorFor (field) {
  return !!this.state.errors[field]					
}
renderErrorFor (field) {
  if (this.hasErrorFor(field)) 
  {
	  return (<span className='invalid-feedback'> <strong>{this.state.errors[field][0]}</strong></span>);  		
  }
} 

componentDidMount() {	

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
	
	axios.get(`${base_url}api`+'/attendance/getyear').then(response => {  
	this.setState({  			
			yearData:response.data.data?response.data.data:[],	
		});
	})
	.catch(error => {  	   
	   console.log(error.message); 			
    })  

	axios.get(`${base_url}api`+'/employee/getdepartments').then(response => {  					
		this.setState({  			
				departments: response.data.data ? response.data.data : [],	
			});
		})
	.catch(error => {  	   
	   console.log(error.message); 	 			   
    }) 		
	
	axios.get(`${base_url}api`+'/attendance/gettypes').then(response => {   		
	this.setState({  			
			typeList:response.data.data?response.data.data:[],    		
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

	const style_txt = {  
	  display: "block", 
	  width: "100%",
	  marginTop: "0.25rem",  			
	  fontSize: "80%",
	  color: "#FF1616",	
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
 <div id="main-wrapper">
 
   {/***********************************
    Main wrapper start
************************************/}

 {/***********************************
    HeaderPart start
************************************/}  

<HeaderPart />


 {/***********************************
  HaderPart end
************************************/}	


	{/**********************************		
		Content body start
	**************************************/}   
	
	<div className="content-body">
		<div className="container-fluid">
			<div className="row page-titles mx-0">
				<div className="col-sm-6 p-md-0">
					<div className="welcome-text">
						<h4>Modify Attendance Register</h4>				
					</div>
				</div>  					
			</div>
			{/********<!-- row -->******/}  	
			
			<div className="row">
			  <div className="col-xl-12 col-xxl-12">
				<div className="card">
				  
				  <div className="card-body">
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
					<div className="basic-form form-own">
					  
						<div className="form-row">
						
						  <div className="form-group col-md-3">		
							<label>Month</label>
							<select className={`form-control ${this.hasErrorFor('month_id') ? 'is-invalid' : ''}`} name="month_id" value={(this.state.month_id)?this.state.month_id:''} onChange={this.handleChange}>		
								<option value="">Select Month</option>
								<option value='01'>Janaury</option>		
								<option value='02'>February</option>
								<option value='03'>March</option>
								<option value='04'>April</option>
								<option value='05'>May</option>
								<option value='06'>June</option>
								<option value='07'>July</option>
								<option value='08'>August</option>		
								<option value='09'>September</option>		
								<option value='10'>October</option>			
								<option value='11'>November</option>
								<option value='12'>December</option>
							</select>
							{this.renderErrorFor('month_id')}      
							{this.state.showErr1?   
							 <span style={style_txt}>  
								<strong>{this.state.txtMsg1}</strong>       	  					   
							  </span>					
							 : null}    
						  </div>

						  <div className="form-group col-md-3">
							<label>Year</label>
							<select className={`form-control ${this.hasErrorFor('year_id') ? 'is-invalid' : ''}`} name="year_id" value={(this.state.year_id)?this.state.year_id:''} onChange={this.handleChange}> 
								<option value="">Select Year</option>
								{this.state.yearData.map( (item, key) => {     
									return (
									<option key={key} value={item.year_list}>{item.year_list}</option>   	
								  )
								})}		
							</select>
							{this.renderErrorFor('year_id')}    
							{this.state.showErr2?   
							 <span style={style_txt}>  
								<strong>{this.state.txtMsg2}</strong>       	  					   
							  </span>					
							 : null}    
						  </div>
						  
						  <div className="form-group col-md-3">
							<label>Department</label>
							<select className={`form-control ${this.hasErrorFor('department_id') ? 'is-invalid' : ''}`} name="department_id" value={(this.state.department_id)?this.state.department_id:''} onChange={this.handleDepartment}> 																		   
							  <option value="">All</option>  
							  {this.state.departments.map( (item, key) => {     
								return (
							  <option key={key} value={item.departmentId}>{item.departmentName}</option>  				
							  )   
							})}  											
							</select>
							{this.renderErrorFor('department_id')}  		
						  </div>
						  
						  <div className="form-group col-md-3">			
							<label>Designation</label>			
							<select className={`form-control ${this.hasErrorFor('designation_id') ? 'is-invalid' : ''}`} name="designation_id" value={(this.state.designation_id)?this.state.designation_id:''} onChange={this.handleChange}> 											
							  <option value="">--Select--</option>  
							  {this.state.designations.map( (item, key) => {     
								return (
							  <option key={key} value={item.designationId}>{item.designationName}</option>  				
							  )   
							})}   											
							</select>		
							{this.renderErrorFor('designation_id')} 											
						  </div>  		

						 <div className="form-group col-md-2">		
							<label>&nbsp; &nbsp; &nbsp;</label>		
							<input type="button" className="btn btn-primary" value="Load Attendance Detail" onClick={this.loadDetail}/>
						 </div>	
						  
						</div>{/******<!--/ form-row -->******/}  			
					  
					</div>
					{
						this.state.attendanceData.length>0?(  
					<div className="table-responsive">   
						<table className="table table-bordered table-striped verticle-middle table-responsive-sm">
							<thead>
								<tr>
									<th>Employee No.</th>
									<th>Name</th>		
									{(() => {
										let row = [];
										for(var i=1;i<=this.state.cells;i++)
										{   	 
										  row.push(<th key={i}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'D'+i}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>);   
										}
										return row;    		
									})()}
								</tr>
							</thead>
							<tbody>
							{
							  this.state.attendanceData.map( (item,key) => {		
								return (  
								<tr key={key}>    
									<td className="col-1">{item.emp_no}</td>		
									<td className="col-1">{item.emp_name}</td>				
									{(() => {
										let row = [];
										let day_arr=[];  
										let type_arr=[];  		
										
										for (const da of item.attend_days.split(',')) {
										  day_arr.push(parseInt(da));    
										}	
										
										for (const ta of item.attend_types.split(',')) {
										  type_arr.push(parseInt(ta));    
										}
											  
										for(var i=1;i<=this.state.cells;i++)   
										{
											let cel_val = 0;  	 												

											if(this.state.attendancearr.hasOwnProperty(item.id))
											{ 												
												let txt_arr = this.state.attendancearr[item.id].split(',');  
												for (let j=0;j<txt_arr.length;j++) 
												{ 
													let lvl_arr=txt_arr[j].split(':');  
													if(i==lvl_arr[0])
													{
														cel_val=lvl_arr[1]; 					
													}																
												}  
											}
											else
											{
												if(day_arr.includes(i))
												{
													let indx = day_arr.indexOf(i);  				
													cel_val=type_arr[indx];  						
												}
											}  
											
											row.push(<td key={i}><select className={`form-control`} name="attendance[]" id={item.id} data-id={i} onChange={this.handleAttendance} ref={node =>this.state.attendancelst.push(node)} value={(cel_val>0)?cel_val:''}> 
											<option value="">Select</option>   			
											{
											  this.state.typeList.map((item,key) => {		
													return (  
												  <option key={key} value={item.id}>{item.name}</option>						  						
												  )     
												})
												}  
											</select></td>);   			
										}
										return row;  
									})()}
								</tr> )     
								})		
								} 		 			
							</tbody>
						</table>	
						
					</div>	
					)
						:''			
						}
					{
					this.state.attendanceData.length>0?(  	
					<div className="submit-btn form-own text-right">
					  <input type="submit" value="Modify" className="btn btn-primary" />  		
					</div>)		
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
			</div>{/*****<!--/ row -->******/}    
			
		</div>
	</div>		
	
	 {/*****************************
		Content body end
	*************************************/}  
</div>    

    {/***********************************
        Main wrapper end
    ************************************/}					
       </>  
    );
  }
}

export default EmployeeAttendanceModify;  	   