import React, { Component } from "react";
import axios from 'axios'; 
import { Link } from 'react-router-dom';  
import Swal from 'sweetalert2';		    
import ServerTable from 'react-strap-table';  
import Script from "@gumgum/react-script-tag";

import Copyright from "../basic/Copyright";	
import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";		

const base_url=location.protocol+'//'+location.host+'/';   				

class SearchStudent extends Component {		
	
  constructor(props) {			
  super(props)
  this.state = {
	  admission_no:'',
	  student_name:'',		
	  father_name:'',		
	  mother_name:'',		
	  roll_no:'',  
	  adhar_no:'',		  
	  gender:'',
	  caste:'',		
	  course_id:'',
      class_id:'', 
	  section_id:'',
	  station_id:'',	
	  start_date:'',
	  end_date:'',	
	  app_url:'',
	  record_sum:'',	
	  params:'',		  	
	  isLoading:true,
	  show_result:false,	
	  courseData:[],
	  classData:[],
	  sectionData:[],	
	  stationData:[],	
	  filterArr:['father_name','f_mobile','courseName','className'],			
	  filterlist:[],
	  arcs:[]					
  }
	
	this.handleChange = this.handleChange.bind(this);      			
	this.handleCourse = this.handleCourse.bind(this);		
	this.handleClass = this.handleClass.bind(this);      
	this.handleCheck = this.handleCheck.bind(this);      			
	this.checkAll = this.checkAll.bind(this);     
	this.searchFilter = this.searchFilter.bind(this);    
	this.handlePrint = this.handlePrint.bind(this);  	
	this.handleExport = this.handleExport.bind(this);       	
	this.serverTable = React.createRef();  
	this.input = React.createRef();   	
 }      

handleChange(event){		
    event.preventDefault();
    this.setState({ [event.target.name]:event.target.value });   
}

handleCourse(e) {		
	
	const inp = e.target.name;  
	const id = e.target.value;    	
   
   if(id >0)
   {
	   axios.get(`${base_url}api`+`/class/getclassbycourse/${id}`).then(response => {    		
			this.setState({  			 					  
				classData: response.data.data ? response.data.data :[],							
				[inp]:id,
				class_id:'' 	
			}); 
		})
		.catch(error => {  	   
		   console.log(error.message); 	   
		})    
   }
   else
   {
		this.setState({   
			classData:[],
			[inp]:id,
			class_id:''    	
		}); 
   }   
		
}  
handleClass(e) {	
	const id = e.target.value; 
	const inp = e.target.name;   
	const courseid = this.state.course_id; 	 	  
	
	if(id !='')
	{		
		this.setState({ class_id:id,show: true }); 
		axios.get(`${base_url}api/class/getsectionbyclassandcourse/${id}/${courseid}`).then(response => {    	
			console.log(response); 		
				this.setState({  			
					[inp]:id,      
					section_id: '',		
					sectionData: response.data.data ? response.data.data :[]	 
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
				section_id:'',		
				sectionData:[]	 
			}); 	
	}
		
}

searchFilter(event){
    event.preventDefault(); 		
	const { availing,sibling } = event.target;   	
	
	const transport_availing=(availing.checked)?'yes':'no';  			   
	const sibling_student=(sibling.checked)?'yes':'no';  
	
	const enroll_no=this.state.admission_no?this.state.admission_no:''; 		
	const s_name=this.state.student_name?this.state.student_name:'';    
	const f_name=this.state.father_name?this.state.father_name:'';    
	const m_name=this.state.mother_name?this.state.mother_name:'';      
	const rollno=this.state.roll_no?this.state.roll_no:'';      
	const adharno=this.state.adhar_no?this.state.adhar_no:'';     
	const courseid=this.state.course_id?this.state.course_id:'';       
	const classid=this.state.class_id?this.state.class_id:'';    
	const sectionid=this.state.section_id?this.state.section_id:'';      
	const stationid=this.state.station_id?this.state.station_id:'';    
	const gender=this.state.gender?this.state.gender:'';        	
	const caste=this.state.caste?this.state.caste:'';        
	const start=this.state.start_date?this.state.start_date:'';     
	const end=this.state.end_date?this.state.end_date:'';    
	
	const search_url=base_url+`api/searchstudent/index?student_name=${s_name}&father_name=${f_name}&admission_no=${enroll_no}&mother_name=${m_name}&roll_no=${rollno}&adhar_no=${adharno}&course_id=${courseid}&class_id=${classid}&section_id=${sectionid}&gender=${gender}&caste=${caste}&station_id=${stationid}&transport=${transport_availing}&sibling=${sibling_student}&start_date=${start}&end_date=${end}`;   		
	
	this.setState({ app_url:search_url,show_result:true }); 							
	
}	

handleCheck(event) {
const target = event.target;		
var input = target.value;

const lists = this.state.filterlist;   				
const filters=this.state.filterArr;		
const filter_arr = [];   
const input_arr = [];   

for(var key in lists)
{
	if(lists[key] && lists[key].name=='filter[]' && lists[key].value!=null)
	{ 
		if(!input_arr.includes(lists[key].value))
		{
			input_arr.push(lists[key].value);	    	
		} 		
	}
}	 

if(target.checked)		
{	
	for(var key in filters)		
	{
		filter_arr.push(filters[key]);		 		
	}
	if(!filter_arr.includes(input))
	{
		filter_arr.push(input);		 		
	}  	
	
	if(filters.length==parseInt(input_arr.length-1))  
	{
		filter_arr.push('all');		
	}	
	
}
else{
		
	for(var key in filters)
	{			
		if(filters[key] !==input && filters[key] !=='all')
		{
			filter_arr.push(filters[key]);		 	
		}  				
	} 
} 	

this.setState({ filterArr:filter_arr }); 		

}


checkAll(event) {
const target = event.target;
var input = target.value;

const lists = this.state.filterlist;   		
const filters=this.state.filterArr;		 
const filter_arr = ['father_name','f_mobile','courseName','className'];     	

if(target.checked)
{	
	for(var key in lists)
	{
		if(lists[key] && lists[key].name=='filter[]' && lists[key].value!=null)
		{ 
			if(!filter_arr.includes(lists[key].value))
			{
				filter_arr.push(lists[key].value);	   
			} 
		}
	}	
	
} 

this.setState({ filterArr:filter_arr }); 		     						

} 
 
handlePrint() {  	

	var transport_availing="";
	var sibling_student=""; 
	var start=this.state.start_date?this.state.start_date:'';
	var end=this.state.end_date?this.state.end_date:'';    
	
	for (var key in this.state.arcs)  
	{
		if(this.state.arcs[key] !=null)
		{
			if(this.state.arcs[key].type=='checkbox')
			{					
				if(this.state.arcs[key].name=='availing')
				{
					transport_availing=(this.state.arcs[key].checked)?'yes':'no';   
				}
				if(this.state.arcs[key].name=='sibling')
				{
					sibling_student=(this.state.arcs[key].checked)?'yes':'no';   
				}  						
			} 	 
		}		
	}  		
	
	const enroll_no=this.state.admission_no?this.state.admission_no:''; 		
	const s_name=this.state.student_name?this.state.student_name:'';    
	const f_name=this.state.father_name?this.state.father_name:'';    
	const m_name=this.state.mother_name?this.state.mother_name:'';      
	const rollno=this.state.roll_no?this.state.roll_no:'';      
	const adharno=this.state.adhar_no?this.state.adhar_no:'';     
	const courseid=this.state.course_id?this.state.course_id:'';       
	const classid=this.state.class_id?this.state.class_id:'';    
	const sectionid=this.state.section_id?this.state.section_id:'';      
	const stationid=this.state.station_id?this.state.station_id:'';    
	const gender=this.state.gender?this.state.gender:'';        	
	const caste=this.state.caste?this.state.caste:'';  
	const query=(this.state.params.search)?this.state.params.search:'';	   	
	
	axios.get(`${base_url}api`+`/searchstudent/print?student_name=${s_name}&father_name=${f_name}&admission_no=${enroll_no}&mother_name=${m_name}&roll_no=${rollno}&adhar_no=${adharno}&course_id=${courseid}&class_id=${classid}&section_id=${sectionid}&gender=${gender}&caste=${caste}&station_id=${stationid}&transport=${transport_availing}&sibling=${sibling_student}&start_date=${start}&end_date=${end}&search=${query}`).then(response => {  
		console.log(response.data);		
		if (response.data.status === 'successed')   
		{				 
			 var receipt =(typeof(response.data.data)!='object')?response.data.data:'';  		
			 
			 if(typeof receipt !== "undefined") 		
			 {
				let a = document.createElement("a"); 
				let url = base_url+'studentsearch/'+receipt; 							
				a.target='_blank';   
				a.href = url;
				document.body.appendChild(a);							
				a.click();
				document.body.removeChild(a);   	
			 }  					 
		}
		else
		{
			console.log(response.data.message); 							   
		}	
	})
	.catch(error => {  	   
	   console.log(error.message); 	
	   console.log(error.response.data);	
    })	  
}	
handleExport(){  			

	var transport_availing="";
	var sibling_student=""; 
	var start=this.state.start_date?this.state.start_date:'';
	var end=this.state.end_date?this.state.end_date:'';    
	
	for (var key in this.state.arcs)  
	{
		if(this.state.arcs[key] !=null)
		{
			if(this.state.arcs[key].type=='checkbox')
			{					
				if(this.state.arcs[key].name=='availing')
				{
					transport_availing=(this.state.arcs[key].checked)?'yes':'no';   
				}
				if(this.state.arcs[key].name=='sibling')
				{
					sibling_student=(this.state.arcs[key].checked)?'yes':'no';   
				}  						
			} 			 			
		}		
	}  		
	
	const enroll_no=this.state.admission_no?this.state.admission_no:''; 		
	const s_name=this.state.student_name?this.state.student_name:'';    
	const f_name=this.state.father_name?this.state.father_name:'';    
	const m_name=this.state.mother_name?this.state.mother_name:'';      
	const rollno=this.state.roll_no?this.state.roll_no:'';      
	const adharno=this.state.adhar_no?this.state.adhar_no:'';     
	const courseid=this.state.course_id?this.state.course_id:'';       
	const classid=this.state.class_id?this.state.class_id:'';    
	const sectionid=this.state.section_id?this.state.section_id:'';      
	const stationid=this.state.station_id?this.state.station_id:'';    
	const gender=this.state.gender?this.state.gender:'';        	
	const caste=this.state.caste?this.state.caste:'';  
	const query=(this.state.params.search)?this.state.params.search:'';	   	
	
	
	const filters = (this.state.filterArr.length>0)?this.state.filterArr:[];     
	let filter_arr=[];   		
	
	filter_arr[0]='admission_no'; 
	filter_arr[1]='student_name'; 	

	filters.forEach((item,i) => { 		
		if(item !='all')
		{
			filter_arr[parseInt(i+2)]=item;						
		}  				  
	});   
	
	const columns=(this.state.filterArr.length>0)?filter_arr:[];  	
	
	axios.get(`${base_url}api`+`/searchstudent/export?student_name=${s_name}&father_name=${f_name}&admission_no=${enroll_no}&mother_name=${m_name}&roll_no=${rollno}&adhar_no=${adharno}&course_id=${courseid}&class_id=${classid}&section_id=${sectionid}&gender=${gender}&caste=${caste}&station_id=${stationid}&transport=${transport_availing}&sibling=${sibling_student}&start_date=${start}&end_date=${end}&search=${query}&fields=${JSON.stringify(columns)}`).then(response => 
	{   			   
		console.log(response);	   	  	
		if (response.data.status === 'successed')   
		{   			
			var link =(typeof(response.data.data)!='object')?response.data.data:'';     					 		
			if(link !='')
			{
				window.open(`${base_url}api`+"/searchstudent/downloadexcel/"+link,'_blank'); 					
			}				
		}
		else
		{
			console.log(response.data.message); 							      
		}			
	})
	.catch(error => {  	   
	   console.log(error.message); 	
	   console.log(error.response.data);  		
    })   
	
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

	axios.get(`${base_url}api`+'/class/getcourses').then(response => {   		
	this.setState({  			
			courseData: response.data.data ? response.data.data : [],	
		});
	})
	.catch(error => {  	   
	   console.log(error.message); 	
    })   
	
	axios.get(`${base_url}api`+'/route/getstations').then(response => {   		
	this.setState({  			
			stationData: response.data.data ? response.data.data : [],	
		});
	})
	.catch(err => {  	   
	   console.log(err.message); 	   	   
    })    
    
} 
formatDate(dateStr) 
{
	const [year, month, day] = dateStr.split('-');
    let newDate =`${day}-${month}-${year}`;				
    return newDate;		
}
render() { 	 		   

const isLoad = this.state.isLoading;    			

if (isLoad) {  

//return null;  		
			 		
}	
	const url = base_url+'api/searchstudent/index';		 											
	
	const filters = (this.state.filterArr.length>0)?this.state.filterArr:[];	     
	let filter_arr=[];   	
	
	filter_arr[0]='action';		
	filter_arr[1]='admission_no'; 
	filter_arr[2]='student_name'; 	

	filters.forEach((item,i) => { 		
		if(item !='all')
		{
			filter_arr[parseInt(i+3)]=item;						
		}  				  
	});   
	
	const columns=(this.state.filterArr.length>0)?filter_arr:[];  		
	
	let _this = this;		  				
	
	const options = {  
    perPage: 10,    
    headings: {action:'Actions',admission_no:'Admission No',student_name:'Name',father_name:'Father Name',mother_name:'Mother Name',courseName:'Course',className:'Class',sectionName:'Section',registration_no:'Registration NO',stationName:'Station',dob:'Date of Birth',gender:'Gender',mobile:'Student Mobile No',f_mobile:'Father Mobile No',email:'Student Email',aadhar_no:'Aadhar No',mode_of_admission:'Mode of Admission',permanent_address:'Permanent Address',temporary_address:'Temporary Address',roll_no:'Student Roll No',caste:'Caste',f_occupation:"Father's Occupation",admission_date:'Date of Admission'}, 		
    sortable: ['courseName','student_name'],  					
    columnsWidth: {registration_no:'75px',registration_date:'75px',student_name:'80px',father_name:'75px',mobile:'75px',courseName:'75px',className:'70px',student_name:'75px',stationName:'70px',action:'150px'},  
    columnsAlign: {courseName:'center',student_name:'center',action:'center'},  					
    requestParametersNames: {query:'search',direction:'order'}, 		
    responseAdapter: function (resp_data) 
	{	
		console.log(resp_data);									
		_this.setState({ params: resp_data.data.query?resp_data.data.query:[] });  	
		_this.setState({ record_sum: resp_data.data.total?resp_data.data.total:0 });  
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

	 {/************************************
		Content body start
	**************************************/}   
	
	<div className="content-body">
	<div className="container-fluid">
		<div className="row page-titles mx-0">
			<div className="col-sm-6 p-md-0">
				<div className="welcome-text">
					<h4>Search Student List</h4>
				</div>
			</div>
			<div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
				{/****}<!--ol className="breadcrumb breadcrumb-btn">
					<li><a href="./student-admission-list.html" className="btn bg-blue-soft text-blue"><i className="fa fa-user-plus"></i> Search Student List</a></li>
				</ol--> *****/}
			</div>
		</div>
		{/****<!-- row -->*****/}  


		<div className="row">
			<div className="col-12">
				<div className="card">
					{/****<!--div className="card-header"><h4 className="card-title">Please Select Any One Field</h4></div-->*****/}  
					
					<div className="card-body student-search-form">
						<div className="basic-form form-own">
						  <form onSubmit={this.searchFilter}>	  
							<div className="form-row">
							  <div className="col-md-8 left mrb-30">
								<h4 className="mrb-20">Please Select Any One Field</h4>		
								
								<div className="form-row">
								  
								  <div className="form-group col-md-4">			
									<input type="text" className="form-control" name="admission_no" placeholder="Admission No" value={this.state.admission_no?this.state.admission_no:''} onChange={this.handleChange}/>   
								  </div>
								  
								  <div className="form-group col-md-4">
									<input type="text" className="form-control" name="student_name" placeholder="Student Name" value={this.state.student_name?this.state.student_name:''} onChange={this.handleChange}/>		
								  </div>
								  
								  <div className="form-group col-md-4">
									<input type="text" className="form-control" name="father_name" placeholder="Father Name" value={this.state.father_name?this.state.father_name:''} onChange={this.handleChange}/>		
								  </div>
								  
								  <div className="form-group col-md-4">
									<input type="text" className="form-control" name="mother_name" placeholder="Mother Name" value={this.state.mother_name?this.state.mother_name:''} onChange={this.handleChange}/>
								  </div>
								  
								  <div className="form-group col-md-4">
									<input type="number" className="form-control" name="roll_no" placeholder="Roll No" value={this.state.roll_no?this.state.roll_no:''} onChange={this.handleChange}/>		
								  </div>
								  
								  <div className="form-group col-md-4">
									<input type="text" className="form-control" name="adhar_no" placeholder="Aadhar No" value={this.state.adhar_no?this.state.adhar_no:''} onChange={this.handleChange}/>		
								  </div>
								  
								  <div className="form-group col-md-4">
									<select className="form-control" name="course_id" onChange={this.handleCourse} value={(this.state.course_id)?this.state.course_id:''}>
									  <option value="">Select Course</option>		
									  {this.state.courseData.map( (item, key) => {     
										return (
									  <option key={key} value={item.courseId}>{item.courseName}</option>   
									  )
									})}
									</select> 
								  </div>
								  
								  <div className="form-group col-md-4">
									<select className="form-control" name="class_id" onChange={this.handleClass} value={(this.state.class_id)?this.state.class_id:''}>		
									<option value="">Select Class</option>   
									  {this.state.classData.map( (item, key) => {		
										return (
									  <option key={key} value={item.classId}>{item.className}</option>		
									  )     
									})}
									</select>			
								  </div>
								  
								  <div className="form-group col-md-4">	
									<select className="form-control" name="section_id" value={(this.state.section_id)?this.state.section_id:''} onChange={this.handleChange}>				
									<option value="">Select Section</option>		
									  {this.state.sectionData.map( (item, key) => {		
										return (
									  <option key={key} value={item.sectionId}>{item.sectionName}</option>	
									  )     
									})}
									</select>			
								  </div>
								  
								  <div className="form-group col-md-4">
									<select className="form-control" name="gender" value={(this.state.gender)?this.state.gender:''} onChange={this.handleChange}>
										<option value="">Select Gender</option>		
										<option value="male">Male</option>		
										<option value="female">Female</option>	
									</select>		
								  </div>
								  
								  <div className="form-group col-md-4">
									
									<select className="form-control" name="caste" value={(this.state.caste)?this.state.caste:''} onChange={this.handleChange}>   
									  <option value="">Select Caste</option>  
									  <option value="general">General</option>  
									  <option value="obc">OBC</option>		
									  <option value="sc">SC</option>
									  <option value="st">ST</option>
									  <option value="other">Other</option>  
								    </select>    
							
								  </div>
								  
								  <div className="form-group col-md-4">
									<select className="form-control" name="station_id" value={(this.state.station_id)?this.state.station_id:''} onChange={this.handleChange}>    
   								    <option value="">--Select Station--</option>    
								    {this.state.stationData.map( (item, key) => {     
										return (
									  <option key={key} value={item.stationId}>{item.stationName}</option>  				
									  )   
									})}  	 												  	
								  </select>		
								  </div>
								  
								  <div className="form-group mrb-0 col-md-12">
									<label>List of Students whose Date of Birth Lies Between</label>
								  </div>
								  
								  <div className="form-group col-md-6">
									<div className="example">
									  <input type="date" className="form-control input-daterange-timepicker" name="start_date" placeholder="Start Date" value={(this.state.start_date)?this.state.start_date:''} onChange={this.handleChange} />  	   	
									</div>
								  </div>
								  
								  <div className="form-group col-md-6">		
									<div className="example">
									  <input type="date" className="form-control input-daterange-timepicker" name="end_date" value="End Date" placeholder="End Date" value={(this.state.end_date)?this.state.end_date:''} onChange={this.handleChange} />    
									</div>		
								  </div>
								  
								  <div className="form-group col-md-6"> 		 
									<div className="form-check form-checkbox">		
									
									  <input type="checkbox" className="form-check-input" name="availing" ref={node =>this.state.arcs.push(node)}/>		
									  <label className="form-check-label" htmlFor="check1"> List of Student availing Transport Facilty</label>		
									</div>{/****<!--/ form-check -->****/} 		
								  </div>
								  
								  <div className="form-group col-md-6">
									<div className="form-check form-checkbox">		
									  <input type="checkbox" className="form-check-input" name="sibling" ref={node =>this.state.arcs.push(node)}/>			
									  <label className="form-check-label" htmlFor="check1"> Sibling Student's List</label>
									</div>{/****<!--/ form-check -->****/}		
								  </div>
							  
								</div>{/****<!--/ form-row -->***/}			
							  </div>{/****<!--/ left -->***/}  
							  
							  <div className="col-md-4 right mrb-30">
								<h4 className="mrb-20">Select Fields</h4>			
								<div className="search-list-checkbox">  
								
								  <div className="form-check form-checkbox">				
									<input type="checkbox" className="form-check-input" name="filter[]" value="father_name" checked={this.state.filterArr.includes('father_name')} onChange={this.handleCheck} ref={node =>this.state.filterlist.push(node)} disabled/>		
									<label className="form-check-label" htmlFor="check1">Father Name</label>		
								  </div>{/****<!--/ form-check -->***/}
								  
								  <div className="form-check form-checkbox">
									<input type="checkbox" className="form-check-input" name="filter[]" value="mother_name" checked={this.state.filterArr.includes('mother_name')} onChange={this.handleCheck} ref={node =>this.state.filterlist.push(node)}/>	
									<label className="form-check-label" htmlFor="check1">Mother Name</label>
								  </div>{/****<!--/ form-check -->****/}  
								  
								  <div className="form-check form-checkbox">
									<input type="checkbox" className="form-check-input" name="filter[]" value="courseName" checked={this.state.filterArr.includes('courseName')} onChange={this.handleCheck} ref={node =>this.state.filterlist.push(node)} disabled/>		
									<label className="form-check-label" htmlFor="check1">Course</label>
								  </div>{/****<!--/ form-check -->****/}
								  
								  <div className="form-check form-checkbox">
									<input type="checkbox" className="form-check-input" name="filter[]" value="className" checked={this.state.filterArr.includes('className')} onChange={this.handleCheck} ref={node =>this.state.filterlist.push(node)} disabled/>		
									<label className="form-check-label" htmlFor="check1">Class</label>	
								  </div>{/****<!--/ form-check -->*****/}
								  
								  <div className="form-check form-checkbox">
									<input type="checkbox" className="form-check-input" name="filter[]" value="registration_no" checked={this.state.filterArr.includes('registration_no')} onChange={this.handleCheck} ref={node =>this.state.filterlist.push(node)}/>
									<label className="form-check-label" htmlFor="check1">Registration No</label>
								  </div>{/****<!--/ form-check -->****/}
								  
								  <div className="form-check form-checkbox">
									<input type="checkbox" className="form-check-input" name="filter[]" value="sectionName" checked={this.state.filterArr.includes('sectionName')} onChange={this.handleCheck} ref={node =>this.state.filterlist.push(node)}/>		
									<label className="form-check-label" htmlFor="check1">Section</label>		
								  </div>{/****<!--/ form-check -->****/}
								  
								  <div className="form-check form-checkbox">
									<input type="checkbox" className="form-check-input" name="filter[]" value="dob" checked={this.state.filterArr.includes('dob')} onChange={this.handleCheck} ref={node =>this.state.filterlist.push(node)}/>
									<label className="form-check-label" htmlFor="check1">Date of Birth</label>
								  </div>{/****<!--/ form-check -->****/} 
								  
								  <div className="form-check form-checkbox">
									<input type="checkbox" className="form-check-input" name="filter[]" value="gender" checked={this.state.filterArr.includes('gender')} onChange={this.handleCheck} ref={node =>this.state.filterlist.push(node)}/>
									<label className="form-check-label" htmlFor="check1">Gender</label>
								  </div>{/****<!--/ form-check -->*****/}
								  
								  <div className="form-check form-checkbox">
									<input type="checkbox" className="form-check-input" name="filter[]" value="mobile" checked={this.state.filterArr.includes('mobile')} onChange={this.handleCheck} ref={node =>this.state.filterlist.push(node)}/>
									<label className="form-check-label" htmlFor="check1">Student Mobile No</label>
								  </div>{/****<!--/ form-check -->****/}
								  
								  <div className="form-check form-checkbox">
									<input type="checkbox" className="form-check-input" name="filter[]" value="f_mobile" checked={this.state.filterArr.includes('f_mobile')} onChange={this.handleCheck} ref={node =>this.state.filterlist.push(node)} disabled/>		
									<label className="form-check-label" htmlFor="check1">Father Mobile No</label>
								  </div>{/****<!--/ form-check -->***/}
								  
								  <div className="form-check form-checkbox">
									<input type="checkbox" className="form-check-input" name="filter[]" value="email" checked={this.state.filterArr.includes('email')} onChange={this.handleCheck} ref={node =>this.state.filterlist.push(node)}/>
									<label className="form-check-label" htmlFor="check1">Student Email</label>
								  </div>{/****<!--/ form-check -->***/}
								  
								  <div className="form-check form-checkbox">
									<input type="checkbox" className="form-check-input" name="filter[]" value="aadhar_no" checked={this.state.filterArr.includes('aadhar_no')} onChange={this.handleCheck} ref={node =>this.state.filterlist.push(node)}/>
									<label className="form-check-label" htmlFor="check1">Aadhar No</label>		
								  </div>{/****<!--/ form-check -->****/}			
								  
								  <div className="form-check form-checkbox">
									<input type="checkbox" className="form-check-input" name="filter[]" value="mode_of_admission" checked={this.state.filterArr.includes('mode_of_admission')} onChange={this.handleCheck} ref={node =>this.state.filterlist.push(node)}/>
									<label className="form-check-label" htmlFor="check1">Mode of Admission</label>
								  </div>{/****<!--/ form-check -->****/}		
								  
								  <div className="form-check form-checkbox">
									<input type="checkbox" className="form-check-input" name="filter[]" value="permanent_address" checked={this.state.filterArr.includes('permanent_address')} onChange={this.handleCheck} ref={node =>this.state.filterlist.push(node)}/>
									<label className="form-check-label" htmlFor="check1">Permanent Address</label>
								  </div>{/****<!--/ form-check -->****/}
								  
								  <div className="form-check form-checkbox">			
									<input type="checkbox" className="form-check-input" name="filter[]" value="temporary_address" checked={this.state.filterArr.includes('temporary_address')} onChange={this.handleCheck} ref={node =>this.state.filterlist.push(node)}/>			
									<label className="form-check-label" htmlFor="check1">Temporary Address</label>
								  </div>{/****<!--/ form-check -->****/}		
								  
								  <div className="form-check form-checkbox">
									<input type="checkbox" className="form-check-input" name="filter[]" value="roll_no" checked={this.state.filterArr.includes('roll_no')} onChange={this.handleCheck} ref={node =>this.state.filterlist.push(node)}/>
									<label className="form-check-label" htmlFor="check1">Student Roll No</label>
								  </div>{/****<!--/ form-check -->****/}
								  
								  <div className="form-check form-checkbox">   
									<input type="checkbox" className="form-check-input" name="filter[]" value="caste" checked={this.state.filterArr.includes('caste')} onChange={this.handleCheck} ref={node =>this.state.filterlist.push(node)}/>			
									<label className="form-check-label" htmlFor="check1">Caste</label>
								  </div>{/****<!--/ form-check -->****/}
								  
								  <div className="form-check form-checkbox">
									<input type="checkbox" className="form-check-input" name="filter[]" value="stationName" checked={this.state.filterArr.includes('stationName')} onChange={this.handleCheck} ref={node =>this.state.filterlist.push(node)}/>		
									<label className="form-check-label" htmlFor="check1">Station</label>
								  </div>{/****<!--/ form-check -->***/} 								  
								  						  
								  <div className="form-check form-checkbox">
									<input type="checkbox" className="form-check-input" name="filter[]" value="f_occupation" checked={this.state.filterArr.includes('f_occupation')} onChange={this.handleCheck} ref={node =>this.state.filterlist.push(node)}/>
									<label className="form-check-label" htmlFor="check1">Father's Occupation</label>
								  </div>{/****<!--/ form-check -->****/}
								  
								  <div className="form-check form-checkbox">		
									<input type="checkbox" className="form-check-input" name="filter[]" value="admission_date" checked={this.state.filterArr.includes('admission_date')} onChange={this.handleCheck} ref={node =>this.state.filterlist.push(node)}/>		
									<label className="form-check-label" htmlFor="check1">Date of Admission</label>
								  </div>			
								  
								   <div className="form-check form-checkbox">
									<input type="checkbox" className="form-check-input" name="filter[]" value="all" checked={this.state.filterArr.includes('all')} onChange={this.checkAll} ref={node =>this.state.filterlist.push(node)}/>					
									<label className="form-check-label" htmlFor="check1">Select All</label>		
								  </div>			
								  
								</div>
								
								<div className="form-group"></div>					
								
								<div className="form-group">
								  <input type="submit" className="btn btn-primary" value="Search Details"/>		
								</div>{/****<!--/ -->****/}
							  </div>{/****<!--/ right -->****/}
							  
							</div>{/****<!--/ form-row -->****/}
						  </form>
						</div>{/****<!--/ form-own -->*****/}	
						  
						{
						this.state.show_result?( 	
						<div className="create-user-table">
							<div className="table-responsive">		  								  
							<h4 className="mrb-20">Total No of Records : {_this.state.record_sum?_this.state.record_sum:0}</h4>
							  <ServerTable ref={_this.serverTable} columns={columns} url={_this.state.app_url?_this.state.app_url:url} options={options} bordered condensed hover striped>		
								{  
									function (row,column) 		
									{  
										switch (column) {   
											case 'action':  		
												return (  
													  <>	
													  <a href={`/student_edit/${row.id}`} className='btn' data-toggle="tooltip" title="Go Student Details" target="_blank"><i className="fa fa-eye" aria-hidden="true"></i></a>  
													  <a href={`/slc_add?id=${row.admission_no}`} className='btn' data-toggle="tooltip" title="Go to SLC" target="_blank"><i className="fa fa-info-circle" aria-hidden="true"></i></a>
													  <a href={`/cc_add?id=${row.admission_no}`} className='btn' data-toggle="tooltip" title="Go to Character Certificate" target="_blank"><i className="fa fa-info-circle" aria-hidden="true"></i></a>  
													  <a href={`/bc_add?id=${row.admission_no}`} className='btn' data-toggle="tooltip" title="Go to Birth Certificate" target="_blank"><i className="fa fa-info-circle" aria-hidden="true"></i></a>		
													  <a href={`/admission_form?id=${row.admission_no}`} className='btn' data-toggle="tooltip" title="Print Admission Form" target="_blank"><i className="fa fa-info-circle" aria-hidden="true"></i></a>
													  </>	  	
												  );  																
											default:  
												return (row[column]);  								
										}  
									}  
								}  
								</ServerTable>  							
							</div>
						</div>			
						)
					    :''			
						}  
						{
						this.state.record_sum>0?( 	
						<div className="submit-btn form-own text-right">		 							    
							  <input type="submit" name="print" className="btn btn-primary btn-sm mx-1" onClick={this.handlePrint} value="Print" />    
							  <input type="submit" name="excel" className="btn btn-primary btn-sm mx-1" onClick={this.handleExport} value="Export To Excel" />   			
    					</div>    
						)
					    :''			
						}  
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
	
	{/***********************************
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
export default SearchStudent;  		