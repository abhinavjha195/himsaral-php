import React, { Component } from "react";
import axios from 'axios'; 
import { Link } from 'react-router-dom';   
import Script from "@gumgum/react-script-tag";
import Copyright from "../basic/Copyright";
import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url=location.protocol+'//'+location.host+'/';	

class ClassWiseSubjectEdit extends Component {
	
constructor (props) {
  super(props)
  this.state = { 	
	showError: false,
	showSuccess: false,  		
	subError: false,	
    isLoading:true,			
	class_id:'',
	course_id:'',  	
	message:'',		
    errors: [],
	courseData: [],
	classData: [],      	
	sectionData: [],
	subjectData: [],
	subData:[],		
	classwiseData:[],		
	sectionArr:[],
	subjectArr:[],
	rankArr:[],	
	elecArr:[],		
	adoArr:[],
	prtArr:[],			
	sectionchk:[],		
	subjectchk:[]						
  }
	   		    	   
	   this.handleCheckAll = this.handleCheckAll.bind(this);	
	   this.handleSection = this.handleSection.bind(this);	  
	   this.handleCourse = this.handleCourse.bind(this);  
	   this.handleClass = this.handleClass.bind(this);  
	   this.handleSubject = this.handleSubject.bind(this);  
	   this.formSubmit = this.formSubmit.bind(this);  
	   this.handleAdd = this.handleAdd.bind(this);		
	   this.handleRank = this.handleRank.bind(this); 		
	   this.handleElective = this.handleElective.bind(this); 
	   this.handleAdditional = this.handleAdditional.bind(this); 
	   this.handlePriority = this.handlePriority.bind(this);   
	   this.hasErrorFor = this.hasErrorFor.bind(this);
	   this.renderErrorFor = this.renderErrorFor.bind(this);		
	   this.input = React.createRef();  
   }
  handleSection = (event) => {	
		var isCheck = event.target.checked; 
		const secid = event.target.value;    
		let sectionRows = this.state.sectionArr;	
		console.log(sectionRows);		
		
		const subarr = [];		
		
		if(isCheck) 	
		{
			for(var key in sectionRows)
			{
				subarr.push(sectionRows[key]);		
			}
			if(!subarr.includes(parseInt(secid)))
			{
				subarr.push(parseInt(secid));	  	
			}  			
		}
		else
		{
			for(var key in sectionRows)
			{
				if(sectionRows[key] !=secid)
				{
					subarr.push(sectionRows[key]);		  	
				} 				
			}
		}
			
		this.setState({  								
			sectionArr:subarr   		
		}); 	
  }
  handleSubject = (event) => {	
		var isCheck = event.target.checked; 
		const subid = event.target.value;    
		let subjects = this.state.subjectArr;	
		console.log(subjects);		
		
		const subarr = [];		
		
		if(isCheck) 	
		{
			for(var key in subjects)
			{
				subarr.push(subjects[key]);		
			}
			if(!subarr.includes(parseInt(subid)))
			{
				subarr.push(parseInt(subid));	  	
			}  			
		}
		else
		{
			for(var key in subjects)
			{
				if(subjects[key] !=subid)
				{
					subarr.push(subjects[key]);		  	
				} 				
			}
		}
			
		this.setState({  								
			subjectArr:subarr   								
		}); 	
  }
  handleCheckAll = (event) => {
	  var isCheck = event.target.checked;         	  
	  let sections = this.state.sectionchk;
	  let subarr=[];				
	  
	  if(isCheck)		
	  {
			for(var key in sections)
			{					
				if(sections[key]!=null && sections[key].name=='section[]')
				{
					subarr.push(parseInt(sections[key].value));					
				} 					
			}
	  } 	  
	  
	  this.setState({  								
			sectionArr:subarr   		
	  });   
	  
  }
  handleAdd (event) {
	event.preventDefault();	  	
	
	let subjects = (this.state.subjectArr.length>0)?this.state.subjectArr:[];		
	let idarr = [];
	
	for(var key in subjects)			
	{
		if(!idarr.includes(parseInt(subjects[key])))
		{
			idarr.push(parseInt(subjects[key]));			
		} 		
	} 	
	
	if(idarr.length>0)		
	{
		const list = idarr.toString();		
		axios.get(`${base_url}api/subject/listsome/${list}`).then(response => { 
			console.log(response);		
			this.setState({  	
				subError:false,     
				subData: response.data.data?response.data.data:[]	 
			}); 
		})
		.catch(error => {  	   
		   console.log(error.message); 	
		})    
		
	}
	else
	{
		this.setState({  								
			subError:true,				
			subData:[]				
		});   
	}
  
  }
  formSubmit (event) {
  event.preventDefault();	
  
  const urlString = window.location.href;
  const url = new URL(urlString);   
  const lastSegment = url.pathname.split('/').pop();	
  const id = lastSegment; 		
  
  let courseid=this.state.course_id?this.state.course_id:(this.state.classwiseData.length>0)?this.state.classwiseData[0].courseId:'';	 
  let classid=this.state.class_id?this.state.class_id:(this.state.classwiseData.length>0)?this.state.classwiseData[0].classId:'';	
  let sectionid=(this.state.classwiseData.length>0)?this.state.classwiseData[0].sectionId:0;	
  
  const subarr=(this.state.classwiseData.length>0)?this.state.classwiseData[0].sub_list.split(','):[];	  
  const comarr=(this.state.classwiseData.length>0)?this.state.classwiseData[0].com_list.split(','):[];	    
  const elecarr=(this.state.classwiseData.length>0)?this.state.classwiseData[0].elec_list.split(','):[];  
  const adoarr=(this.state.classwiseData.length>0)?this.state.classwiseData[0].ado_list.split(','):[];  
  const prtarr=(this.state.classwiseData.length>0)?this.state.classwiseData[0].prt_list.split(','):[];	 
  
	const subjectlist=[];
	const ranklist=[];		
	const eleclist=[];		
	const adolist=[];		
	let prtlist={};	

	for(var i=0;i<subarr.length;i++)	
	{		
		subjectlist.push(parseInt(subarr[i]));	
		if(parseInt(comarr[i]))		
		{
			ranklist.push(parseInt(subarr[i]));		
		}
		if(parseInt(elecarr[i]))		
		{
			eleclist.push(parseInt(subarr[i]));		
		}
		if(parseInt(adoarr[i]))		
		{
			adolist.push(parseInt(subarr[i]));		
		}
		prtlist[parseInt(subarr[i])]=prtarr[i];					
	} 	 		  
  
  const sectionarr = [];  
  const subjectarr = [];  
  const rankarr = [];  
  const elecrr = [];  
  const adorr = []; 

  let ptarr={};	  
  
  const sections=(this.state.sectionArr.length>0)?this.state.sectionArr:[parseInt(sectionid)];			
  const subjects=(this.state.subData.length>0)?this.state.subData:subjectlist;  	
  
  const ranks = (this.state.rankArr.length>0)?this.state.rankArr:ranklist;    	
  const electives = (this.state.elecArr.length>0)?this.state.elecArr:eleclist;    	
  const extras = (this.state.adoArr.length>0)?this.state.adoArr:adolist;    
  const priorities=(this.state.prtArr.length>0)?this.state.prtArr:prtlist;    	
  
  for(var key in sections)
  {
	  if(!sectionarr.includes(parseInt(sections[key])) && sections[key] !=0)		
	  {
		 sectionarr.push(parseInt(sections[key]));		
	  }  	  	
  }
  
  for(var key in subjects)
  {
	  if(!subjectarr.includes(parseInt(subjects[key].subjectId)))		
	  {
		 subjectarr.push(parseInt(subjects[key].subjectId));	  		
	  }
  }    
  
  for(var key in ranks)
  {
	  if(!rankarr.includes(parseInt(ranks[key])))		
	  {
		 rankarr.push(parseInt(ranks[key]));	  				
	  }
  }		
  
  for(var key in electives)
  {
	  if(!elecrr.includes(parseInt(electives[key])))		
	  {
		 elecrr.push(electives[key]);	  		
	  }
  }	
  
  for(var key in extras)
  {
	  if(!adorr.includes(parseInt(extras[key])))		
	  {
		 adorr.push(parseInt(extras[key]));	  		
	  }
  }	  
  
  for(var key in priorities)
  {
	  ptarr[key]=priorities[key];		
  }  
  
  const data = {
	course_id:this.state.course_id?this.state.course_id:'',		
	class_id:this.state.class_id?this.state.class_id:'',
	section_arr:(this.state.sectionArr.length>0)?this.state.sectionArr:[],		
	subject_arr:(this.state.subjectArr.length>0)?this.state.subjectArr:[],	  
	rank_arr:(this.state.rankArr.length>0)?this.state.rankArr:[],	
	elective_arr:(this.state.elecArr.length>0)?this.state.elecArr:[],			
	aditional_arr:(this.state.adoArr.length>0)?this.state.adoArr:[],	
	priority_arr:this.state.prtArr,				
  }	    
  
  axios.post(`${base_url}api/edit_class_wise_sub_process/${id}`,data)		
    .then(response => {
		console.log(response.data);  				
		if (response.data.status==='successed') 
		{ 		
		   this.setState({ showError:false,showSuccess:true,message:response.data.message,errors:response.data.errors});
		   window.location.href=base_url+'class_wise_subject_list';			
		}		
		else		
		{
		   this.setState({showError:true,showSuccess:false,message:response.data.message,errors:response.data.errors});	 	   
		}
    })
    .catch(error => {  	   
	    console.log(error.message); 			
	    console.log(error.response.data);	
    }) 
    
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
    const lastSegment = url.pathname.split('/').pop();	
	const id = lastSegment;  
	
	axios.get(`${base_url}api/class/getcourses`).then(response => {   		
	this.setState({  			
			courseData: response.data.data ? response.data.data : []	
		});
	})
	.catch(error => {  	   
	   console.log(error.message); 	
    })  

	axios.get(`${base_url}api/class/getsubjects`).then(response => {   	
		this.setState({  								
			subjectData: response.data.data?response.data.data :[]	 
		}); 
	})
	.catch(error => {  	   
	   console.log(error.message); 	
	})    	
	
	axios.get(`${base_url}api`+`/class_wise_sub_list_id/${id}`).then(response => { 
	console.log(response);	
	
	
	const classwiseList = response.data.data.classwise?response.data.data.classwise:[];
	const courseid=(classwiseList.length>0)?classwiseList[0].courseId:'';	
	const classid=(classwiseList.length>0)?classwiseList[0].classId:'';
	const sectionid=(classwiseList.length>0)?classwiseList[0].sectionId:'';		
	const subjectarr=(classwiseList.length>0)?classwiseList[0].sub_list.split(','):[];	 
	const comarr=(classwiseList.length>0)?classwiseList[0].com_list.split(','):[];	
	const elecarr=(classwiseList.length>0)?classwiseList[0].elec_list.split(','):[];  
	const adoarr=(classwiseList.length>0)?classwiseList[0].ado_list.split(','):[];  
	const prtarr=(classwiseList.length>0)?classwiseList[0].prt_list.split(','):[];	 	
	
	const subarr=[];		
	const ranklist=[];		
	const eleclist=[];		
	const adolist=[];		
	let prtlist={};				
	
	for(var i=0;i<subjectarr.length;i++)	
	{		
		subarr.push(parseInt(subjectarr[i]));	
		if(parseInt(comarr[i]))		
		{
			ranklist.push(parseInt(subjectarr[i]));		
		}
		if(parseInt(elecarr[i]))		
		{
			eleclist.push(parseInt(subjectarr[i]));		
		}
		if(parseInt(adoarr[i]))		
		{
			adolist.push(parseInt(subjectarr[i]));		
		}
		prtlist[parseInt(subjectarr[i])]=prtarr[i];			
	} 	
	
		this.setState({  								
			classwiseData:classwiseList,	 
			classData:response.data.data.classlist?response.data.data.classlist:[],
			sectionData:response.data.data.sectionlist?response.data.data.sectionlist:[],  
			subData:response.data.data.subjectlist?response.data.data.subjectlist:[],
			sectionArr:(sectionid==true)?[parseInt(sectionid)]:[],    
			subjectArr:(subarr.length>0)?subarr:[],			
			course_id:courseid,
			class_id:classid,
			section_id:sectionid,     
			rankArr:ranklist,
			elecArr:eleclist,	
			adoArr:adolist,		
			prtArr:prtlist,		
		});  			
	})
	.catch(error => {  	   
	   console.log(error.message); 	
    })	  	
	
}
handleCourse(e) {			
				
		const id = e.target.value; 
		const course = e.target.name;   	
	   
	   if(id >0)
	   {
		   axios.get(`${base_url}api/class/getclassbycourse/${id}`).then(response => {    		
				this.setState({  			
					[course]:id,    
					class_id:'', 
					section_id:'', 
					sectionArr:[],
					classData: response.data.data ? response.data.data :[]	 
				}); 
			})
			.catch(error => {  	   
			   console.log(error.message); 	
			})    
	   }
	   else
	   {
			this.setState({  			
				[course]:id,    
				class_id:'', 
				section_id:'', 
				classData:[],
				sectionArr:[],			
			}); 
	   }
		
	}  
	
	
handleClass(e){
	const id = e.target.value; 
	const classid = e.target.name;  
	const courseid = this.state.course_id?this.state.course_id:(this.state.classwiseData.length>0)?this.state.classwiseData[0].courseId:'';	 	 	  	
	
	if(id !='')
	{		
		this.setState({ class_id:id,show: true }); 
		axios.get(`${base_url}api/class/getsectionbyclassandcourse/${id}/${courseid}`).then(response => {    	
			console.log(response); 		
				this.setState({  			
					[classid]:id,      
					section_id: '',	
					sectionArr:[],	
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
				[classid]:id,      
				section_id:'',		
				sectionData:[],
				sectionArr:[],  	
			}); 	
	}
}

handleRank(e){
		var isCheck = event.target.checked; 
		const rankid = event.target.value;    
		let ranks = this.state.rankArr;	 	
		let electives = this.state.elecArr;	  	
		let extras = this.state.adoArr;	  
		
		const rankarr = [];		
		const elecarr = [];	 	
		const adoarr = [];	  
		
		if(isCheck) 	
		{
			for(var key in ranks)
			{
				rankarr.push(ranks[key]);		
			}
			if(!rankarr.includes(parseInt(rankid)))
			{
				rankarr.push(parseInt(rankid));	  	
			}  			
		}
		else
		{
			for(var key in ranks)
			{
				if(ranks[key] !=rankid)
				{
					rankarr.push(ranks[key]);		  	
				} 				
			}
		}
		
		for(var key in electives)
		{
			if(electives[key] !=rankid)
			{
				elecarr.push(electives[key]);		  	
			} 				
		}
		
		for(var key in extras)
		{
			if(extras[key] !=rankid)
			{
				adoarr.push(extras[key]);		  	
			} 				
		}
			
		this.setState({  								
			rankArr:rankarr,
			elecArr:elecarr,
			adoArr:adoarr       	
		}); 	
}	

handleElective(e){	
	var isCheck = event.target.checked; 
	const elecid = event.target.value;    
	let electives = this.state.elecArr;			
	let ranks = this.state.rankArr;	 	   
	let extras = this.state.adoArr;	  
	
	const rankarr = []; 
	const adoarr = [];	
	const elecarr = [];			
	
	if(isCheck) 	
	{
		for(var key in electives)
		{
			elecarr.push(electives[key]);		
		}
		if(!elecarr.includes(parseInt(elecid)))
		{
			elecarr.push(parseInt(elecid));	  	
		}  			
	}
	else
	{
		for(var key in electives)
		{
			if(electives[key] !=elecid)
			{
				elecarr.push(electives[key]);		  	
			} 				
		}
	}
	
	for(var key in ranks)
	{
		if(ranks[key] !=elecid)
		{
			rankarr.push(ranks[key]);		  	
		} 				
	}

	for(var key in extras)
	{
		if(extras[key] !=elecid)
		{
			adoarr.push(extras[key]);				  	
		} 				
	}
		
	this.setState({  								
		rankArr:rankarr,
		elecArr:elecarr,
		adoArr:adoarr       	
	}); 
}	

handleAdditional(e){	
	var isCheck = event.target.checked; 
	const adoid = event.target.value;    
	let extras = this.state.adoArr;		
	let electives = this.state.elecArr;			    	
	let ranks = this.state.rankArr;	    	
	
	const adoarr = [];			
	const rankarr = []; 
	const elecarr = [];	
	
	if(isCheck) 	
	{
		for(var key in extras)
		{
			adoarr.push(extras[key]);		
		}
		if(!adoarr.includes(parseInt(adoid)))
		{
			adoarr.push(parseInt(adoid));	  	
		}  			
	}
	else
	{
		for(var key in extras)
		{
			if(extras[key] !=adoid)
			{
				adoarr.push(extras[key]);		  	
			} 				
		}
	}
	
	for(var key in ranks)
	{
		if(ranks[key] !=adoid)
		{
			rankarr.push(ranks[key]);		  	
		} 				
	}

	for(var key in electives)
	{
		if(electives[key] !=adoid)
		{
			elecarr.push(electives[key]);		  	
		} 				
	}
		
	this.setState({  								
		rankArr:rankarr,
		elecArr:elecarr,
		adoArr:adoarr       	
	}); 

}	

handlePriority(e){			
	const id = event.target.id;   
	var inp = event.target.value;     
	const re = /^[0-9\b]+$/;  	
	const prtarr = {};	  
	let priorities = this.state.prtArr;		
	
	for(var key in priorities)
	{
		prtarr[key]=priorities[key];		
	} 
	
	if(re.test(inp))		 		
	{
		prtarr[id]=inp;	  	
	}  	
		
	this.setState({  								
		prtArr:prtarr   	  							
	}); 
}	
		
render() {	

const isLoad = this.state.isLoading;    			

if (isLoad) {  

//return null;  		
			 		
}    		
	
	let courseRows = this.state.courseData; 		
	let classRows = this.state.classData; 				
	let sectionRows = this.state.sectionData;		
	let subjectRows = this.state.subjectData;		
	
	let courseList = courseRows.length > 0	
		&& courseRows.map((item, i) => {
			
		return ( 		
				<option key={item.courseId} value={item.courseId}>{item.courseName}</option>    
			)  
		
	}, this);  	
	
	let classList = classRows.length > 0	
		&& classRows.map((item, i) => {
			
		return ( 		
				<option key={item.classId} value={item.classId}>{item.className}</option>    
			)  
		
	}, this);     	 	
	  
    return (
      <div>


            
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
					<h4>Edit Class wise Subjects</h4>				
				</div>
			</div>
			<div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
				<ol className="breadcrumb">
					<li><a href={`/class_wise_subject_list`} className="btn bg-blue-soft text-blue"><i className="fa fa-angle-double-left"></i> Back to Class Wise Subjects List</a></li>		
				</ol>		
			</div>
		</div> 		
		
		<div className="row">
		  <div className="col-xl-12 col-xxl-12">
			<div className="card">
			  
			  <div className="card-body">
				
				<div className="basic-form form-own className-wise-subject">
				  <form onSubmit={this.formSubmit}> 	
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
					<div className="form-row">
					  <div className="form-group col-md-6">
						<label>Course Name</label>
						<select className={`form-control input-daterange-timepicker ${this.hasErrorFor('course_id') ? 'is-invalid' : ''}`} name="course_id" value={this.state.course_id?this.state.course_id:''}  onChange={this.handleCourse}>		
						  <option value="0">Select Course</option>						
						  {courseList}			
						</select>
						{this.renderErrorFor('course_id')}   	
					  </div>
					 
					  <div className="form-group col-md-6">
						<label>Class Name</label>		
						<select className={`form-control input-daterange-timepicker ${this.hasErrorFor('class_id') ? 'is-invalid' : ''}`} name="class_id" onChange={ this.handleClass} value={this.state.class_id?this.state.class_id:''}>		
						  <option value="0">Select Class</option>	
						  {classList}		
						</select>
						{this.renderErrorFor('class_id')}   	  
					  </div>  					  
						
					    {
						this.state.class_id?( 		
					  <div className="form-group col-md-12">
						<label>Section Name</label>		
						<div className="Schedule-section"> 					  
						<div className="form-checkbox-grid">
							{this.state.sectionData.map( (item, key) => {     
								return (
									<div className="form-check form-checkbox col-md-2" key={item.sectionId}>		
									  <input type="checkbox" name="section[]" key={item.sectionId} className="form-check-input" value={item.sectionId} checked={this.state.sectionArr.includes(parseInt(item.sectionId))} onChange={this.handleSection} ref={node =>this.state.sectionchk.push(node)}/>  		
									  <label className="form-check-label" htmlFor={"check"+item.sectionId}>{item.sectionName}</label>	
									</div>  
							  )
							})}	
						</div>  				
						{
						this.state.sectionData.length > 0 ?(
						<div className="form-checkbox-grid select-grid-bg">
							<div className="form-check form-checkbox col-md-2">		
								<input type="checkbox" name="section[]" className="form-check-input" key={0} value={0} checked={this.state.sectionArr.includes(0)} onChange={this.handleCheckAll} ref={node =>this.state.sectionchk.push(node)}/>		
								<label className="form-check-label" htmlFor={"check"+sectionRows.length}>Select All</label>
							</div>			
						</div>
						)
					    : <label className="form-check-label" htmlFor={"check"}>N/A</label>  	
						}
						</div>				
					  </div>)
					    : ''
						}  
					  
					  {
						this.state.class_id>0?(							 		
							<div className="form-group col-md-12">
							<h5>Select Subjects from the list showing below & then Click Add Button</h5>
							<div className="Schedule-subject">		
								<div className="form-checkbox-grid">		
								{this.state.subjectData.map( (item, key) => {     
									return (
										<div className="form-check form-checkbox col-md-3" key={item.subjectId}>	
										  <div className="bg-padd" key={item.subjectId}>
											<input type="checkbox" className="form-check-input" key={item.subjectId} value={item.subjectId} checked={this.state.subjectArr.includes(parseInt(item.subjectId)) } onChange={this.handleSubject} ref={node =>this.state.subjectchk.push(node)}/>
											<label className="form-check-label" htmlFor={"check"+item.subjectId}>{item.subjectName}</label>		
										  </div>
										</div>)  	 												
								})}		
								</div>
							  </div>
							</div>  						 
						)
					    : "" 
						}
						
						{			
						 (this.state.class_id) && subjectRows.length > 0 ?( 						
							<div className="form-group col-md-12 text-right">
								{this.state.subError?   
							  <div className="alert alert-danger" style={{color:"brown"}}>  
								<strong>{'Please select some subjects !!'}</strong>       	  					   
							  </div>
							 : null}
								<input type="submit" className="btn btn-primary" value="Add" onClick={this.handleAdd}/>
							</div>						 
						)
					    : "" 		
						}
						
					  {			
						this.state.subData.length > 0 ?(	
					  <div className="form-group col-md-12">
						<div className="Schedule-table">
						  <div className="table-responsive">
							<table className="table table-bordered table-striped verticle-middle table-responsive-sm">
								<thead>
									<tr>
										<th scope="col">Subject</th>
										<th scope="col">Taken For Rank</th>
										<th scope="col">Elective</th>
										<th scope="col">Additional</th>
										<th scope="col">Priority</th>
									</tr>
								</thead>
								<tbody>
									{this.state.subData.map( (item, key) => {     
									return ( 
									<tr key={item.subjectId}>		
										<td>{item.subjectName}</td>		
										<td><div className="form-check form-checkbox"><input type="checkbox" className="form-check-input" name="rank[]" value={item.subjectId} checked={this.state.rankArr.includes(parseInt(item.subjectId))} onChange={this.handleRank}/></div></td>	
										<td><div className="form-check form-checkbox"><input type="checkbox" className="form-check-input" name="elective[]" value={item.subjectId} checked={this.state.elecArr.includes(item.subjectId)} onChange={this.handleElective}/></div></td>	
										<td><div className="form-check form-checkbox"><input type="checkbox" className="form-check-input" name="additional[]" value={item.subjectId} checked={this.state.adoArr.includes(item.subjectId)} onChange={this.handleAdditional}/></div></td>		
										<td><input name="priority[]" type="text" id={item.subjectId} className="form-control" value={this.state.prtArr.hasOwnProperty(item.subjectId)?this.state.prtArr[parseInt(item.subjectId)]:''} onChange={this.handlePriority}/></td>  		
									</tr>)  	 														
									})}		 
								</tbody>
							</table>
						</div>
						</div>
					  </div>
					  )
					:"" 		
					} 
					</div>
					<input type="submit" className="btn btn-primary" value="Save"/>		
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
      </div>
    );
  }
}	
export default ClassWiseSubjectEdit;		