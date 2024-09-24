import React, { Component } from "react";
import axios from 'axios';  
import { Link } from 'react-router-dom';      
		
import Script from "@gumgum/react-script-tag";  
import Copyright from "../basic/Copyright";
import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url=location.protocol+'//'+location.host+'/';		

class StudentPromotion extends Component {  
  
  constructor (props) {
  super(props)
  this.state = {  	
	isLoading:true,
	showErr1:false,  
	showErr2:false,  
	showError:false,  
	showSuccess:false,	
	txtMsg1:'',  	
	txtMsg2:'',  
	course_id:'',	  	
	class_id:'',	
	section_id:'',	 
	course_new:'',	
	class_new:'',	
	section_new:'',	 
	schoolData:[],	
	courseData:[],  
	classData:[], 
	sectionData:[],  
	courseList:[],  
	classList:[], 
	sectionList:[],  
	studentData:[],	
	promolst:[],			
	errors:[],   
  }
  
  this.handleChange = this.handleChange.bind(this);      
  this.changeCourse = this.changeCourse.bind(this);  
  this.handleCourse = this.handleCourse.bind(this);     
  this.changeClass = this.changeClass.bind(this);
  this.handleClass = this.handleClass.bind(this);  
  this.changeSection = this.changeSection.bind(this);		
  this.loadDetail = this.loadDetail.bind(this); 
  this.formSubmit = this.formSubmit.bind(this);      
  this.hasErrorFor = this.hasErrorFor.bind(this);	
  this.renderErrorFor = this.renderErrorFor.bind(this);   	
  this.input = React.createRef();    
	    
}  

handleChange(event){		
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });   		
}

formSubmit(event){
	event.preventDefault();   
	const selections=this.state.promolst;	
	
	const courseid = this.state.course_new?this.state.course_new:''; 
	const classid = this.state.class_new?this.state.class_new:''; 
	const sectionid = this.state.section_new?this.state.section_new:'';   
	
	var idarr = {};   
	
	for(var key in selections) 		
	{  			 
		if(selections[key] !== null)
		{ 			
			if(selections[key].name=='status[]')      
			{ 
				idarr[selections[key].id]=selections[key].value;      	
			}
		}
	} 	  	
	
	 const data = {
		course_id:courseid,    
		class_id:classid, 		
		section_id:sectionid,    		    
		students:idarr,			 		
	  }	    
			
	axios.post(`${base_url}`+'api/promote/add',data).then(response => {  				
		console.log(response);	  	  
		if (response.data.status === 'successed')        
		{		
			this.setState({ showError:false,showSuccess:true,message:response.data.message,errors:response.data.errors});	
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

loadDetail(e){	
	e.preventDefault();	
	const courseid = this.state.course_id?this.state.course_id:''; 
	const classid = this.state.class_id?this.state.class_id:''; 
	const sectionid = this.state.section_id?this.state.section_id:''; 		
	
	if(courseid=='')
	{
		this.setState({showErr1:true,txtMsg1:'Please select course!!',showErr2:false,txtMsg2:''});   
	}
	else if(classid=='')
	{
		this.setState({showErr2:true,txtMsg2:'Please select class!!',showErr1:false,txtMsg1:''});     
	}
	else
	{
		axios.get(`${base_url}api`+`/promote/detail/${courseid}/${classid}/${sectionid}`).then(response => {    	
		console.log(response); 					
			this.setState({  			  						
				studentData: response.data.data ? response.data.data :[],
				showErr1:false,	
				showErr2:false,		
				txtMsg1:'',
				txtMsg2:'', 
				promolst:[],				
			}); 
		})
		.catch(error => {  	   
		   console.log(error.message); 	  
		})    	
	}
	
		 
	   
}	
     
changeCourse(e) {		

		const inp = e.target.name;  
		const id = e.target.value;  	
	   
	   if(id >0)
	   {
		   axios.get(`${base_url}api`+`/class/getclassbycourse/${id}`).then(response => {    		
				this.setState({  
					[inp]:id,
					class_id:'',	
					section_id:'',
					studentData:[],   
					classData: response.data.data ? response.data.data :[],
				}); 
			})
			.catch(error => {  	   
			   console.log(error.message); 	   
			})    
	   }
	   else
	   {
			this.setState({
				[inp]:id,
				class_id:'',	
				section_id:'',
				studentData:[],     	
				classData:[],
			}); 
	   }   
		
	}  
 
handleCourse(e) {		

		const inp = e.target.name;  
		const id = e.target.value;  	
	   
	   if(id >0)
	   {
		   axios.get(`${base_url}api`+`/class/getnextclassbycourse/${id}`).then(response => {   
				console.log(response);
				this.setState({  
					[inp]:id,
					class_new:'',	
					section_new:'',  
					classList: response.data.data ? response.data.data :[],  		
				}); 
			})
			.catch(error => {  	   
			   console.log(error.message); 	   
			})    
	   }
	   else
	   {
			this.setState({
				[inp]:id,
				class_new:'',	
				section_new:'',	  
				classList:[],
			}); 
	   }   
		
	}  
changeClass(e){   
	const inp = e.target.name;  
	const id = e.target.value;  
	const courseid = this.state.course_id; 	  
	
	if(id !='')
	{					
		axios.get(`${base_url}api`+`/class/getsectionbyclassandcourse/${id}/${courseid}`).then(response => {    			
			this.setState({
				[inp]:id,   	
				section_id:'',
				studentData:[],   
				sectionData: response.data.data ? response.data.data :[],    
			}); 
		})
		.catch(error => {  	   
		   console.log(error.message); 	    
		})     
		
	}
	else
	{
		this.setState({ class_id:'',section_id:'',sectionData:[],studentData:[] });		  				
	}
}  	


handleClass(e){   
	const inp = e.target.name;  
	const id = e.target.value;  
	const courseid = this.state.course_new; 	  		
	
	if(id !='')
	{	
		axios.get(`${base_url}api`+`/class/getnextsectionbyclassandcourse/${id}/${courseid}`).then(response => {    
				
			this.setState({
				[inp]:id,   	
				section_new:'',		
				sectionList: response.data.data ? response.data.data :[],    		
			}); 
		})
		.catch(error => {  	   
		   console.log(error.message); 	    
		})     
		
	}
	else
	{
		this.setState({ class_new:'',section_new:'',sectionList:[] });		  				
	}
}   

changeSection(e){   
	const inp = e.target.name;  
	const id = e.target.value;  
	
	if(id !='')
	{	
		this.setState({
			[inp]:id,
			studentData:[]   	 		
		}); 
	}
	else
	{
		this.setState({ section_id:'',studentData:[] });				  				
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

	axios.get(`${base_url}api`+'/class/getcourses').then(response => {   		
	this.setState({  			
			courseData: response.data.data ? response.data.data : [],	
		});
	})
	.catch(error => {  	   
	   console.log(error.message); 	
    })  	

	axios.get(`${base_url}api`+'/class/getnextcourse').then(response => {  
	console.log(response);				
	this.setState({  			
			courseList: response.data.data ? response.data.data : [],	  
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
								<h4>Student Promotion</h4>   
							</div>
						</div>
					</div>
					 {/****** row *****/}		 
					<div className="row">
						<div className="col-12">
							<div className="card">
								<div className="card-header"><h4 className="card-title">Class Wise Promotion</h4></div>  
								
								<div className="card-body create-user-table">
								  <div className="assign-home-work">
									<div className="basic-form form-own">
									  <form>
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
										
										  <div className="form-group col-md-3">
											<label>Course</label>
											<select className="form-control" name="course_id" onChange={this.changeCourse} value={(this.state.course_id)?this.state.course_id:''}>
											  <option value="">Select Course</option>
											  {this.state.courseData.map( (item, key) => {     
												return (
											  <option key={key} value={item.courseId}>{item.courseName}</option>   
											  )
											})}
										  </select> 
										  {this.state.showErr1?   
											 <span style={style_txt}>  
												<strong>{this.state.txtMsg1}</strong>       	  					   
											  </span>					
											 : null}   
										  </div>
										  
										  <div className="form-group col-md-3">  
											<label>Class</label>  
											<select className="form-control" name="class_id" onChange={this.changeClass} value={(this.state.class_id)?this.state.class_id:''}>
										  <option value="">Select Class</option>
											  {this.state.classData.map( (item, key) => {		
												return (
											  <option key={key} value={item.classId}>{item.className}</option>
											  )     
											})}
											</select>
											{this.state.showErr2?   
											 <span style={style_txt}>  
												<strong>{this.state.txtMsg2}</strong>       	  					   
											  </span>					
											 : null}   
										  </div>    										  
										  
										  <div className="form-group col-md-3">
											<label>Section</label>  
											<select className="form-control" name="section_id" onChange={this.changeSection} value={(this.state.section_id)?this.state.section_id:''}>
										  <option value="">Select Section</option>   			
										  {
											  this.state.sectionData.map( (item, key) => {		
												return (  
											  <option key={key} value={item.sectionId}>{item.sectionName}</option>
											  )     
											})
											}
											</select>  		
											
										  </div>
										  
										  <div className="form-group col-md-3">  
											<label>&nbsp; &nbsp; &nbsp;</label><br/>  
											<input type="button" className="btn btn-primary" value="Load Detail" onClick={this.loadDetail}/>    
										  </div>
										</div>{/******* form-row ******/}			
									  </form>        
									</div> 
									{
									this.state.studentData.length>0?( 	
									<div className="table-responsive">
										<table className="table table-bordered table-striped verticle-middle table-responsive-sm">
											<thead>
												<tr>
													<th scope="col">Admission No.</th>
													<th scope="col">Name</th>
													<th scope="col">Class</th>
													<th scope="col">Section</th>
													<th scope="col">Status</th>  
												</tr>
											</thead>
											<tbody>
											{this.state.studentData.map((item,key)=>{
												return (  	
												<tr key={key}>    
													<td>{item.student_name}</td>  
													<td>{item.admission_no}</td>
													<td>{item.className}</td>
													<td>{item.section_name}</td>    
													<td>
													<select className="form-control" id={item.id} key={key} name="status[]" ref={node =>this.state.promolst.push(node)}>  
													<option value="1">Promote</option>		
													<option value="0">Keep</option>    
													</select>  
													</td>  
												</tr>)  
											 })}		
											</tbody>    
										</table>												  
									</div>)
									:''			
									}   
									{
									this.state.studentData.length>0?( 		
									<div className="basic-form form-own">
									  <form onSubmit={this.formSubmit}>  										
										<div className="form-row">
										  
										  <div className="form-group col-md-4">  
											<label>Course</label>		
											<select className={`form-control ${this.hasErrorFor('course_id') ? 'is-invalid' : ''}`} name="course_new" onChange={this.handleCourse} value={(this.state.course_new)?this.state.course_new:''}>		
											  <option value="">--Select--</option>
											  {this.state.courseList.map( (item, key) => {     
												return (
											  <option key={key} value={item.courseId}>{item.courseName}</option>   
											  )
											})}
										  </select>
										  {this.renderErrorFor('course_id')}      	
										  </div>
										  
										  <div className="form-group col-md-4">  
											<label>Class</label>  
											<select className={`form-control ${this.hasErrorFor('class_id') ? 'is-invalid' : ''}`} name="class_new" onChange={this.handleClass} value={(this.state.class_new)?this.state.class_new:''}>
										  <option value="">--Select--</option>  
											  {this.state.classList.map( (item, key) => {		
												return (
											  <option key={key} value={item.classId}>{item.className}</option>
											  )     
											})}
											</select>
											{this.renderErrorFor('class_id')}     
										  </div>
										  
										  <div className="form-group col-md-4">
											<label>Section</label>  
											<select className={`form-control valid ${this.hasErrorFor('section_id') ? 'is-invalid' : ''}`} name="section_new" onChange={this.handleChange} value={(this.state.section_new)?this.state.section_new:''}>
										  <option value="">--Select--</option>   
										  {
											  this.state.sectionList.map( (item, key) => {		
												return (  
											  <option key={key} value={item.sectionId}>{item.sectionName}</option>
											  )     
											})
											}
											</select> 
											{this.renderErrorFor('section_id')} 				 	
										  </div>  										  
										  
										</div>
										<div className="submit-btn form-own text-right">
										  <input type="submit" value="Promote" className="btn btn-primary"/>
										</div>	
									  </form>
									       
									</div>)
									:''			
									}   									
								  </div>{/***** assign-home-work *****/}		   
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

export default StudentPromotion;    