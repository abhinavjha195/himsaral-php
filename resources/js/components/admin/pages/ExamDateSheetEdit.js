import React, { Component } from "react";
import axios from 'axios'; 
import { Link } from 'react-router-dom';  
import Swal from 'sweetalert2';		    

import Script from "@gumgum/react-script-tag";

import Copyright from "../basic/Copyright";

import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";    			

const base_url=location.protocol+'//'+location.host+'/';   			

class ExamDateSheetEdit extends Component {		
	
  constructor(props) {
	  super(props)
	  this.state = { 		  		  
		  showError: false,
		  showSuccess: false,
		  isLoading:true,		
		  subMsg:'',				
		  course_id:'',			
		  class_id:'',	
		  section_id:'',
		  max_mark:'',			
		  messgae:'', 
		  courseList:[],
		  classList:[],	
		  sectionList:[],		
		  subjectList:[],	
		  subjectRow:[],	
		  examList:[],	
		  sheetData:[],		
		  subjectarr:[],	
		  subjectlst:[],
		  theoryarr:[],
		  theorylst:[],	
		  palst:[],
		  internalst:[],			
		  assessmentarr:[],		 		  
		  internalarr:[], 		  	
		  datearr:[], 
		  datelst:[],			
		  errors:[]  
	  }
	  
	  this.handleChange = this.handleChange.bind(this);  
	  this.handleCourse = this.handleCourse.bind(this);    	
	  this.handleSection = this.handleSection.bind(this);    	
	  this.handleClass = this.handleClass.bind(this);     
	  this.handleSubject = this.handleSubject.bind(this);  
	  this.handleAllSubject = this.handleAllSubject.bind(this);  	
	  this.handleAdd = this.handleAdd.bind(this);    
	  this.handleMark = this.handleMark.bind(this);   
	  this.handleDate = this.handleDate.bind(this);    
	  this.handleTheory = this.handleTheory.bind(this);   
	  this.handleAssessment = this.handleAssessment.bind(this);     
	  this.handleInternal = this.handleInternal.bind(this);     
	  this.formSubmit = this.formSubmit.bind(this);    
	  this.hasErrorFor = this.hasErrorFor.bind(this);	
	  this.renderErrorFor = this.renderErrorFor.bind(this);   	
	  this.input = React.createRef();    		
} 
handleChange(event){		
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });   
}
        
handleCourse(event) {	

	const inpt=event.target.name;  	
	const id = event.target.value;  	
   
   if(id !='')		
   {
		axios.get(`${base_url}api`+`/class/getclassbycourse/${id}`).then(response => {    			
			this.setState({  			 					  
				classList: response.data.data ? response.data.data :[],		
				sectionList:[],	
				subjectList:[],		
				[inpt]: id   	  	
			}); 
		})
		.catch(error => {  	   
		    console.log(error.message); 	
		})    
   }
   else
   {
	   this.setState({   
			classList:[],
			sectionList:[],			
			subjectList:[],	   
			[inpt]: id,
			class_id:'',			
			section_id:'',		
		}); 
   }   
	
}  	
handleClass(event){
	const inpt=event.target.name;   
	const id = event.target.value;  		

	const courseid =(this.state.course_id)?this.state.course_id:(this.state.sheetData.length>0)?this.state.sheetData[0].course_id:0; 	  	
	
	if(id >0 && courseid>0)		
	{	
			axios.get(`${base_url}api`+`/class/getsectionsubjectbyclass/${courseid}/${id}`).then(response => {    
				this.setState({  			
					[inpt]:id,    	
					sectionList:response.data.data.sections?response.data.data.sections:[],
					subjectList:response.data.data.subjects?response.data.data.subjects:[],   	
				}); 
			})
			.catch(error => {  	   
			   console.log(error.message); 			
			})    	
		
	}
	else
	{
		this.setState({ [inpt]:id,section_id:'',sectionList:[],subjectList:[] });				
	}
}	

handleSection(event){   
	const inpt=event.target.name;    		
	const id = event.target.value;  
	
	const courseid = this.state.course_id?this.state.course_id:(this.state.sheetData.length>0)?this.state.sheetData[0].course_id:0; 	 	  
	const classid=this.state.class_id?this.state.class_id:(this.state.sheetData.length>0)?this.state.sheetData[0].class_id:0; 	   
	
	if(id !='')
	{	
		axios.get(`${base_url}api`+`/class/getsectionsubjectbyclass/${courseid}/${classid}/${id}`).then(response => {
		this.setState({  			
				[inpt]:id,    	
				sectionList:response.data.data.sections?response.data.data.sections:[],	
				subjectList:response.data.data.subjects?response.data.data.subjects:[],     	
			});
		})
		.catch(error => {  	   
		   console.log(error.message); 	 						
		})      
		
	}
	else
	{
		this.setState({ [inpt]:id,subjectList:[] });	  
	}
}  	
handleSubject(event){		
	
	let opt = event.target.name; 				
	let check = event.target.checked;  
    let check_val = event.target.value;  		
	let checks=this.state.subjectarr;   
	let subjects=this.state.subjectlst;    	
	
	let idarr = [];  
	let idset = []; 
	let setarr = [];			
	let unique_arr = [];   	
	
	for(var key in subjects) 		
	{ 
		if(subjects[key] !== null && subjects[key].name=='subject[]')   
		{  
			idset.push(parseInt(subjects[key].value));	
		}					
	}  
	
	if(check)
	{
		for(var key in checks) 
		{ 	
			idarr.push(parseInt(checks[key]));	
		}  
		if(!idarr.includes(parseInt(check_val)))	
		{			
			idarr.push(parseInt(check_val));  		
		}
	}
	else
	{
		for (var key in checks) 
		{
			if(checks[key] !=check_val && checks[key] !=0)		
			{
				idarr.push(parseInt(checks[key]));	    
			}
			
		}	
	}
	
	unique_arr=this.removeDuplicates(idarr); 
	setarr=this.removeDuplicates(idset); 
	
	if(unique_arr.length==parseInt(setarr.length))		
	{
		unique_arr.push(0);		
	} 	
	
	this.setState({subjectarr:unique_arr}); 	  

}	

handleAllSubject(event){		
	
	let opt = event.target.name; 				
	let check = event.target.checked;  
    let check_val = event.target.value;  				
	let checks=this.state.subjectlst;          
	
	let idarr = [];  
	let unique_arr = [];   
	
	if(check)
	{
		for(var key in checks) 		
		{ 
			if(checks[key] !== null && checks[key].name=='subject[]')   
			{  
				idarr.push(parseInt(checks[key].value));	
			}					
		}  
		if(!idarr.includes(0))	
		{			
			idarr.push(0);  		
		}
	}	
	
	unique_arr=this.removeDuplicates(idarr); 	
	
	this.setState({subjectarr:unique_arr}); 			  

}
handleAdd(event){		
    event.preventDefault();
	let checks=this.state.subjectarr;   		

	let idarr = [];  			
	let unique_arr = []; 	

	for(var key in checks) 
	{ 	
		idarr.push(parseInt(checks[key]));	
	}    

    unique_arr=this.removeDuplicates(idarr);   

    if(unique_arr.length>0)		
	{
		const list = unique_arr.toString();		
		axios.get(`${base_url}api`+`/subject/listsome/${list}`).then(response => {     		
			this.setState({ 
				subMsg:'',		
				subjectRow:response.data.data?response.data.data:[],   	
			}); 
		})
		.catch(error => {  	   
		   console.log(error.message); 	
		})    	
	}
	else
	{
		this.setState({  
			subMsg:'Please select some subjects!!',	  
			subjectRow:[],   	
		}); 
	}
	
}

handleMark(event){		
    event.preventDefault();
	
	let inp_name = event.target.name; 				 	
    let inp_value = event.target.value; 
	
	var regex = /[^0-9]/g;   		
	if(!regex.test(inp_value))
	{
		let theories=this.state.theorylst;   		
		const markarr ={};	  	
		
		for(var key in theories) 
		{  			 
			if(theories[key] !== null)
			{
				if(theories[key].name=='theory_mark[]')      
				{
					markarr[theories[key].id]=(isNaN(parseInt(inp_value)))?'':parseInt(inp_value);    
				}
			}
		}   	
		
		this.setState({ max_mark:inp_value,theoryarr:markarr,assessmentarr:[],internalarr:[],datearr:[] });   		
	}  	 
	
} 

handleTheory(event){		
    event.preventDefault();
	
	let inp_id = event.target.id; 	
	let inp_name = event.target.name; 				 	
    let inp_value = event.target.value; 
	
	const maxmark=this.state.max_mark?this.state.max_mark:(this.state.sheetData.length>0)?this.state.sheetData[0].max_mark:0; 		
	
	let theories=this.state.theoryarr;  
	let assessments=this.state.assessmentarr;  
	let internals=this.state.internalarr;   

	let assessmentmark = 0; 
	let internalmark  = 0;   
	let inpmark = (isNaN(parseInt(inp_value)))?0:parseInt(inp_value); 		
	
	const markarr ={};	

	if(assessments.hasOwnProperty(inp_id))
	{
		assessmentmark = assessments[inp_id];   
	}  	
	
	if(internals.hasOwnProperty(inp_id))		
	{
		internalmark = internals[inp_id];   
	}   

	let sum = parseInt(assessmentmark)+parseInt(internalmark)+inpmark; 	
	
	var regex = /[^0-9]/g;   		
	if(!regex.test(inp_value) && parseInt(sum)<=parseInt(maxmark))		
	{  
		for(var key in theories) 		
		{
			markarr[key]=theories[key];		
		} 

		markarr[inp_id]=(isNaN(parseInt(inp_value)))?'':parseInt(inp_value);		
		
		this.setState({ theoryarr:markarr });   
		
	}  	 
	
}	 

handleAssessment(event){		
    event.preventDefault();
	
	let inp_id = event.target.id; 	  
	let inp_name = event.target.name; 				 	
    let inp_value = event.target.value; 
	
	let assessments=this.state.assessmentarr;  
	let theories=this.state.theorylst;    
	let internals=this.state.internalst;      
	let theorymark = 0; 
	let internalmark  = 0;     
	let inpmark = (isNaN(parseInt(inp_value)))?0:parseInt(inp_value);   

	const maxmark=this.state.max_mark?this.state.max_mark:(this.state.sheetData.length>0)?this.state.sheetData[0].max_mark:0;  
	
	const markarr ={};	 	
	const theorymarkarr ={};	

	for(var key in internals) 
	{  			 
		if(internals[key] !== null)
		{
			if(internals[key].name=='internal_mark[]')      
			{
				const i_mark = (isNaN(parseInt(internals[key].value)))?0:parseInt(internals[key].value);	 
				if(internals[key].id==inp_id)
				{
					internalmark=i_mark;	  
				}    
			}
		}
	}

	let sum = parseInt(internalmark)+inpmark;  
	
	var regex = /[^0-9]/g;   		
	if(!regex.test(inp_value) && sum<=parseInt(maxmark))		
	{  
		for(var key in assessments) 		
		{
			markarr[key]=assessments[key];		
		}   
		
		for(var key in theories) 
		{  			 
			if(theories[key] !== null)
			{
				if(theories[key].name=='theory_mark[]')      
				{	
					if(theories[key].id==inp_id)
					{
						theorymarkarr[inp_id]=maxmark-inpmark-internalmark;	 		 
					}
					else
					{
						theorymarkarr[theories[key].id]=theories[key].value;   
					}  					 					
				}
			}
		} 

		markarr[inp_id]=(isNaN(parseInt(inp_value)))?'':parseInt(inp_value);			
		
		this.setState({ assessmentarr:markarr,theoryarr:theorymarkarr });  		 				
		
	}
	
}	

handleInternal(event){		
    event.preventDefault();
	
	let inp_id = event.target.id; 	  
	let inp_name = event.target.name; 				 	
    let inp_value = event.target.value; 
	
	let theories=this.state.theorylst;    
	let internals=this.state.internalarr;   
	let assessments=this.state.palst;   
	
	let theorymark = 0; 
	let assessmentmark  = 0;   
	let inpmark = (isNaN(parseInt(inp_value)))?0:parseInt(inp_value); 	 	
	
	const maxmark=this.state.max_mark?this.state.max_mark:(this.state.sheetData.length>0)?this.state.sheetData[0].max_mark:0; 
	const markarr ={};	 	
	const theorymarkarr ={};	 
	
	for(var key in assessments) 	
	{  			 
		if(assessments[key] !== null)
		{
			if(assessments[key].name=='pa_mark[]')      
			{
				const i_mark = (isNaN(parseInt(assessments[key].value)))?0:parseInt(assessments[key].value);	 
				if(assessments[key].id==inp_id)
				{
					assessmentmark=i_mark;	  
				}    
			}
		}
	}  		
	
	let sum = parseInt(assessmentmark)+inpmark;  		
	
	var regex = /[^0-9]/g;   		
	if(!regex.test(inp_value) && sum<=parseInt(maxmark))	
	{  
		for(var key in internals) 		
		{
			markarr[key]=internals[key];		
		} 
		
		for(var key in theories) 		
		{  			 
			if(theories[key] !== null)
			{
				if(theories[key].name=='theory_mark[]')      
				{	
					if(theories[key].id==inp_id)
					{
						theorymarkarr[inp_id]=maxmark-inpmark-assessmentmark;	 		 
					}
					else
					{
						theorymarkarr[theories[key].id]=theories[key].value;   
					}  					 					
				}
			}
		} 

		markarr[inp_id]=(isNaN(parseInt(inp_value)))?'':parseInt(inp_value);							  		
		this.setState({ internalarr:markarr,theoryarr:theorymarkarr });   		
		
	}   
	  	 
	
}	

handleDate(event){		
    event.preventDefault();	
	
	let datelist=this.state.datelst;   
	const dateset = [];				
	
	for(var key in datelist)  
	{  			 
		if(datelist[key] !== null)
		{
			if(datelist[key].name=='mark_date[]')      
			{
				dateset[datelist[key].id]=datelist[key].value;     
			}
		}
	}   	
	
	this.setState({ datearr:dateset });  
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
removeDuplicates(arr) {
	let unique = [];
	for(var i=0;i<arr.length;i++){ 
		if(unique.indexOf(arr[i]) === -1) { 
			unique.push(parseInt(arr[i])); 	
		} 
	}
	return unique;
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

	   
	axios.get(`${base_url}api`+`/examdatesheet/edit/${id}`).then(response => {  
		console.log(response);		
		const sheet_list = response.data.data.sheet_data?response.data.data.sheet_data:[];		
		let courseid =(sheet_list.length>0)?sheet_list[0].course_id:0; 	   	
		let classid =(sheet_list.length>0)?sheet_list[0].class_id:0; 	
		let sectionid =(sheet_list.length>0)?sheet_list[0].section_id:0;     
		let sublist=(sheet_list.length>0)?sheet_list[0].sub_list:''; 	  
		
		const subjects=(sheet_list.length>0)?sheet_list[0].sub_list.split(','):[]; 
		let subarr=[];
		
		const theories=(sheet_list.length>0)?sheet_list[0].theory_list.split(','):[];    
		const assessments=(sheet_list.length>0)?sheet_list[0].assessment_list.split(','):[];    
		const internals=(sheet_list.length>0)?sheet_list[0].internal_list.split(','):[];  	
		const schedules=(sheet_list.length>0)?sheet_list[0].date_list.split(','):[];    
		
		const theorymark ={};	
		const assessmentmark ={}; 
		const internalmark ={};  
		const schedulearr ={};	    
		
		for(var i=0;i<subjects.length;i++)
		{
			theorymark[subjects[i]]=parseInt(theories[i]);   			
			assessmentmark[subjects[i]]=parseInt(assessments[i]);     			
			internalmark[subjects[i]]=parseInt(internals[i]);   
			schedulearr[subjects[i]]=schedules[i];   	    
			subarr.push(parseInt(subjects[i]));			
		}  		
		
		this.setState({   				
			sheetData:sheet_list,
			courseList:response.data.data.course_data?response.data.data.course_data:[],		
			examList:response.data.data.exam_data?response.data.data.exam_data:[],
			subjectarr:subarr,
			theoryarr:theorymark,
			assessmentarr:assessmentmark, 	
			internalarr:internalmark, 
			datearr:schedulearr			
		});
		
		if(courseid >0)
		{
			axios.get(`${base_url}api`+`/class/getclassbycourse/${courseid}`).then(response => {    			
				this.setState({  			 					  
					classList: response.data.data ? response.data.data :[]		
				}); 
			})
			.catch(error => {  	   
				console.log(error.message); 	
			})    
		}
		
		if(courseid>0 && classid>0)		
		{
			axios.get(`${base_url}api`+`/class/getsectionsubjectbyclass/${courseid}/${classid}`).then(response => {    
				this.setState({  	
					sectionList:response.data.data.sections?response.data.data.sections:[]		   	
				}); 
			})
			.catch(error => {  	   
			   console.log(error.message); 	
			})

			axios.get(`${base_url}api`+`/class/getsectionsubjectbyclass/${courseid}/${classid}/${sectionid}`).then(response =>
			{
				this.setState({  								
					subjectList:response.data.data.subjects?response.data.data.subjects:[],     	
				});
			})
			.catch(error => {  	   
			   console.log(error.message); 	 						
			})    
			
		}

		if(sublist !='')	
		{
			axios.get(`${base_url}api`+`/subject/listsome/${sublist}`).then(response => {     		
				this.setState({ 
					subjectRow:response.data.data?response.data.data:[],   	
				}); 
			})
			.catch(error => {  	   
			   console.log(error.message); 	
			})    
		}
		
	})
	.catch(error => {  	   
	   console.log(error.message); 				
    })  
    
}
formSubmit(event){
	event.preventDefault();  
	
	const urlString = window.location.href;			
    const url = new URL(urlString);   				
    const lastSegment = url.pathname.split('/').pop();	
	const id = lastSegment;  
	
	let courseid=(this.state.course_id)?this.state.course_id:(this.state.sheetData.length>0)?this.state.sheetData[0].course_id:0; 
	let classid=(this.state.class_id)?this.state.class_id:(this.state.sheetData.length>0)?this.state.sheetData[0].class_id:0; 	
	let sectionid=(this.state.section_id)?this.state.section_id:(this.state.sheetData.length>0)?this.state.sheetData[0].section_id:0; 		
		
	let examid =(this.state.exam_id)?this.state.exam_id:(this.state.sheetData.length>0)?this.state.sheetData[0].exam_id:0; 	 
	
	const maxmark=this.state.max_mark?this.state.max_mark:(this.state.sheetData.length>0)?this.state.sheetData[0].max_mark:0; 
	
	const subjectRows = this.state.subjectRow;
	let theories=this.state.theorylst; 
	let assessments=this.state.assessmentarr;   
	let internals=this.state.internalarr;    
	let datelist=this.state.datearr;   	
	
	var theoryarr={};  
	var assessmentarr={}; 
	var internalarr={};    
	var datearr={};  
	const subjectarr=[];		
	
	for(var key in theories) 		
	{  			 
		if(theories[key] !== null)
		{ 			
			if(theories[key].name=='theory_mark[]')      
			{	 
				theoryarr[theories[key].id]=theories[key].value;   				 					
			}
		}
	} 
	
	for(var key in assessments) 		
	{
		assessmentarr[key]=assessments[key];		
	} 

	for(var key in internals) 		
	{
		internalarr[key]=internals[key];		
	} 	
	
	for(var key in datelist) 		
	{
		datearr[key]=datelist[key];		
	} 	
	
	subjectRows.forEach((item,key) => 
	{  
		subjectarr.push(item.subjectId);  
	});   

	const data = {
		course_id:courseid, 
		class_id:classid, 
		section_id:sectionid,  		
		exam_id: examid,			
		max_mark: maxmark,
		subjects:subjectarr,
		theories:theoryarr,		
		assessments:assessmentarr,
		internals:internalarr,  
		dateset:datearr,  
	}	
	
	axios.post(`${base_url}api`+`/examdatesheet/update/${id}`,data).then(response => {   	  			
		console.log(response.data);   		
		if (response.data.status === 'successed')   
		{		
			this.setState({ showError:false,showSuccess:true,message:response.data.message,errors:response.data.errors});
			window.location.href=base_url+'exam_date_sheet';			
		}
		else
		{
			this.setState({ showError: true, showSuccess: false, message: response.data.message,errors:response.data.errors});	 			   
		}
	})
	.catch(err => {  	   
	   console.log(err.message); 	
	   console.log(err.response.data);	   
	})    
	
} 
render() { 	 

const isLoad = this.state.isLoading;    			

if (isLoad) {  

//return null;  		
			 		
}    

	let courseid =(this.state.sheetData.length>0)?this.state.sheetData[0].course_id:0; 	
	let classid =(this.state.sheetData.length>0)?this.state.sheetData[0].class_id:0; 	
	let sectionid =(this.state.sheetData.length>0)?this.state.sheetData[0].section_id:0; 	
	let examid =(this.state.sheetData.length>0)?this.state.sheetData[0].exam_id:0; 	 
	let maxmark =(this.state.sheetData.length>0)?this.state.sheetData[0].max_mark:0; 	
	
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
					<h4>Edit Exam Date Sheet</h4>		
				</div>
			</div>
			<div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
				<ol className="breadcrumb">
					<li><a href={`/exam_date_sheet`} className="btn bg-blue-soft text-blue"><i className="fa fa-angle-double-left"></i> Back to Exam Date Sheet List</a></li>	
				</ol>
			</div>
		</div>
		{/**** row ***/} 		
		
		<div className="row">
		  <div className="col-xl-12 col-xxl-12">
			<div className="card">
			  {/****<div className="card-header"><h4 className="card-title">All className List</h4></div>***/} 
			  <div className="card-body">		
				
				<div className="basic-form form-own Create-Exam-Date">
				  <form onSubmit={this.formSubmit}>
					<div className="text-center">
						{this.state.showError ?   
						 <div className="alert alert-danger" style={{color:"brown"}}>  
							<strong>{this.state.message}</strong>       	  					   
						  </div>
						 : null}   
						{this.state.showSuccess ?   
						 <div className="alert alert-success" style={{color:"green"}}>    
							{this.state.message}    
						  </div>
						 : null}   		 
					</div>  
					<div className="form-row">
					  <div className="form-group col-md-4">
						<label>Course Name</label>
						<select className={`form-control ${this.hasErrorFor('course_id') ? 'is-invalid' : ''}`}  name="course_id" onChange={this.handleCourse} value={this.state.course_id?this.state.course_id:courseid}>		
						  <option value="0">--Select--</option>		
						  {this.state.courseList.map( (item,key) => {		
							return ( 								
								<option key={item.courseId} value={item.courseId}>{item.courseName}</option>	
							)    
						  })}   
						</select>
						{this.renderErrorFor('course_id')}      
					  </div>
					  
					  <div className="form-group col-md-4">
						<label>Class Name</label>		
						<select className={`form-control ${this.hasErrorFor('class_id') ? 'is-invalid' : ''}`} name="class_id" onChange={this.handleClass} value={this.state.class_id?this.state.class_id:classid}>	
						  <option value="0">--Select--</option>		
						  {this.state.classList.map( (item, key) => {
                                return (
                              <option key={item.classId} value={item.classId}>{item.className}</option>		
                              )
                            })}
						</select>
						{this.renderErrorFor('class_id')}       
					  </div>
					  
					  <div className="form-group col-md-4 mrb-30">		
						<label>Section Name</label>
						<select className={`form-control ${this.hasErrorFor('section_id') ? 'is-invalid' : ''}`} name="section_id" onChange={this.handleSection} value={this.state.section_id?this.state.section_id:sectionid}>				
						  <option value="0">--Select--</option>					
						  {this.state.sectionList.map( (item,key) => {	
                                return (
                              <option key={item.sectionId} value={item.sectionId}>{item.sectionName}</option>			
                              )
                            })}
						</select>
						{this.renderErrorFor('section_id')}    
					  </div>
					  
					  <div className="form-group col-md-6">
						<label>Exam Name</label>
						<select className={`form-control ${this.hasErrorFor('exam_id') ? 'is-invalid' : ''}`} name="exam_id" onChange={this.handleChange} value={this.state.exam_id?this.state.exam_id:examid}>		
						  <option value="0">Select Exam</option>		
						  {this.state.examList.map( (item,key) => {
								return (
							  <option key={item.id} value={item.id}>{item.name}</option>			
							  )
							})}			
						</select>
						{this.renderErrorFor('exam_id')} 		
					  </div>
					  
					  <div className="form-group col-md-6"> </div>
					  {
						(this.state.subjectList.length>0)?(  							  
					  <div className="form-group col-md-12">
						<h5>Select Subjects from the list showing below & then Click Add Button</h5>
						{/*****<label>Select Subjects from the list showing below && then Click Add Button </label>***/}  
					  <div className="Schedule-subject">
						<div className="form-checkbox-grid">
						{this.state.subjectList.map( (item,key) => {
						return (
							<div key={item.subjectId} className="form-check form-checkbox col-md-3">		
							  <div className="bg-padd">
								<input type="checkbox" name="subject[]" className="form-check-input" value={item.subjectId}  checked={(this.state.subjectarr.includes(parseInt(item.subjectId)))?true:false} onChange={this.handleSubject} ref={node =>this.state.subjectlst.push(node)}/>	
								<label className="form-check-label" htmlFor="check1">{item.subjectName}</label>		
							  </div>
							</div>)		
						})}		
						</div>
					  </div>
						<div className="form-checkbox-grid select-grid-bg">
							<div className="form-check form-checkbox col-md-2">
							  <input type="checkbox" name="subject[]" className="form-check-input" value="0" checked={(this.state.subjectarr.includes(0))?true:false} onChange={this.handleAllSubject}/>
							  <label className="form-check-label" htmlFor="check3">Select All</label>			
							</div>		
						</div>
					  </div>)
					    : ''
						}  
					  {
						(this.state.subjectList.length>0)?( 
					  <div className="form-group col-md-12 text-right">	 
						{
						  (this.state.subMsg.length>0)?(<div className="alert alert-danger" style={{color:"brown",textAlign:"center"}}>{this.state.subMsg}</div>):null  		
						  } 
						<input type="submit" className="btn btn-primary" onClick={this.handleAdd} value="Add"/>		
					  </div>)
						: ''
					}  
					  {
						(this.state.subjectRow.length>0)?( 
					  <div className="form-group col-md-6 Maximum-Marks-label">
						<label>Enter Maximum Marks</label>
						<input type="text" name="maxmark" className={`form-control text-box single-line ${this.hasErrorFor('max_mark') ? 'is-invalid' : ''}`} value={this.state.max_mark?this.state.max_mark:maxmark} onChange={this.handleMark}/>	
						{this.renderErrorFor('max_mark')}  			
					  </div>)		
						: ''
					}  
					  
					  <div className="form-group col-md-6"></div>		
					  {
						(this.state.subjectRow.length>0)?( 
					  <div className="form-group col-md-12">		
						<div className="Schedule-table">
						  <div className="table-responsive">
							<table className="table table-bordered table-striped verticle-middle table-responsive-sm">
								<thead>
									<tr>
										<th scope="col">Subject Name</th>
										<th scope="col">Theory Marks</th>
										<th scope="col">PA Marks</th>
										<th scope="col">Internal Marks</th>
										<th scope="col">Exam Date</th>
									</tr>
								</thead>
								<tbody>
								{this.state.subjectRow.map((item,key) => {   
								return ( 
									<tr key={item.subjectId}>	
										<td>{item.subjectName}</td>		
										<td><input name="theory_mark[]" type="text" id={item.subjectId} aria-invalid="false" className="form-control" value={(this.state.theoryarr.hasOwnProperty(item.subjectId))?this.state.theoryarr[item.subjectId]:''} onChange={this.handleTheory} ref={node =>this.state.theorylst.push(node)}/></td>						
										<td><input name="pa_mark[]" type="text" id={item.subjectId} aria-invalid="false" className="form-control" value={(this.state.assessmentarr.hasOwnProperty(item.subjectId))?this.state.assessmentarr[item.subjectId]:''} onChange={this.handleAssessment} ref={node =>this.state.palst.push(node)}/></td>		
										<td><input name="internal_mark[]" type="text" id={item.subjectId} aria-invalid="false" className="form-control" value={(this.state.internalarr.hasOwnProperty(item.subjectId))?this.state.internalarr[item.subjectId]:''} onChange={this.handleInternal} ref={node =>this.state.internalst.push(node)}/></td>  	
										<td><input type="date" className="form-control input-daterange-timepicker" name="mark_date[]" id={item.subjectId} value={(this.state.datearr.hasOwnProperty(item.subjectId))?this.state.datearr[item.subjectId]:''} onChange={this.handleDate} ref={node =>this.state.datelst.push(node)}/></td>  						
									</tr>)		
								})}	 
								</tbody>
							</table>
						</div>
						</div>
					  </div>)		
						: ''
					}  
					</div>
					{/******* form-row ****/}    
					<input type="submit" className="btn btn-primary" value="Update"/>		
				  </form>
				</div>
				
			  </div>
			</div>
		  </div>  
		</div>{/******* row *****/}  
		
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

export default ExamDateSheetEdit;  