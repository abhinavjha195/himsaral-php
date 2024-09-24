import React, { Component } from "react";
import axios from 'axios';  
import { Link } from 'react-router-dom';      
		
import Script from "@gumgum/react-script-tag";  
import Copyright from "../basic/Copyright";
import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url=location.protocol+'//'+location.host+'/';	

class AssignHomeWork extends Component {  
  
  constructor (props) {
  super(props)
  this.state = {  	
	isLoading:true, 
	showError:false,  
	showSuccess:false,	 
	showErr1:false,  
	showErr2:false, 
	showErr:false, 	
	txtMsg1:'',  	
	txtMsg2:'',  	 	
	school_id:'',
	course_id:'',	  	
	class_id:'',	
	section_id:'',	   
	assign_date:'',
	courseData:[],  
	classData:[], 
	sectionData:[],      	
	subjectData:[],	 	
	descriptionlst:[],			
	subarr:[],			
	alertarr:[],   
	errors: [],			    	
  }
  
   this.handleChange = this.handleChange.bind(this);  
   this.handleCourse = this.handleCourse.bind(this); 
   this.handleClass = this.handleClass.bind(this);    	
   this.handleSection = this.handleSection.bind(this);
   this.handleCreate = this.handleCreate.bind(this);	
   this.handleAttachment = this.handleAttachment.bind(this);    
   this.loadDetail = this.loadDetail.bind(this);      	  	
   this.hasErrorFor = this.hasErrorFor.bind(this);	
   this.renderErrorFor = this.renderErrorFor.bind(this);   	
   this.input = React.createRef();  
	    
}  

handleChange(event){		
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });   				
} 

loadDetail(e){	
	e.preventDefault();	
	const courseid = this.state.course_id?this.state.course_id:''; 
	const classid = this.state.class_id?this.state.class_id:''; 
	const sectionid = this.state.section_id?this.state.section_id:''; 			

	if(courseid=='')		
	{
		this.setState({showErr1:true,showErr2:false,txtMsg1:'Please select course!!',txtMsg2:'',subjectData:[]});   
	}
	else if(classid=='')
	{
		this.setState({showErr1:false,showErr2:true,txtMsg2:'Please select class!!',txtMsg1:'',subjectData:[]});     
	}
	else
	{
		axios.get(`${base_url}api`+`/homework/detail/${courseid}/${classid}/${sectionid}`).then(response => {    	
			console.log(response); 
			const subjectList=response.data.data?response.data.data:[]; 
			this.setState({  			  						
				subjectData:subjectList,     
				showErr1:false,	
				showErr2:false,	
				showErr:(subjectList.length>0)?false:true,    	
				txtMsg1:'',
				txtMsg2:'', 			
			}); 
		})
		.catch(error => {  	   
		   console.log(error.message); 	  		
		})    	
	}	
		   
}	 
     
handleCourse(e) {		
	e.preventDefault();	  
	const inp = e.target.name;  
	const id = e.target.value;
	const filearr=(this.state.subarr.length>0)?this.state.subarr:[];  	
	
	for(var i=0;i<filearr.length;i++)
	{	
		if(typeof this.state['attachment_'+filearr[i]] !== "undefined")
		{
			this.state['attachment_'+filearr[i]]="";  		
		}  	  
	}		
   
   if(id >0)
   {
	   axios.get(`${base_url}api`+`/class/getclassbycourse/${id}`).then(response => {    		
			this.setState({  
				[inp]:id,
				class_id:'',	
				section_id:'',
				sectionData:[],		
				subjectData:[],  
				subarr:[],	
				descriptionlst:[],		
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
			classData:[],
			sectionData:[],		
			subjectData:[],  
			subarr:[],	 
			descriptionlst:[],	
		}); 
   }   
	
}   

handleClass(e){
	e.preventDefault();	  	
	const inp = e.target.name;  
	const id = e.target.value;  
	const courseid = this.state.course_id;
	const filearr=(this.state.subarr.length>0)?this.state.subarr:[];  	
	
	for(var i=0;i<filearr.length;i++)
	{	
		if(typeof this.state['attachment_'+filearr[i]] !== "undefined")
		{
			this.state['attachment_'+filearr[i]]="";  		
		}  	  
	}		
	
	if(id !='')
	{	
		axios.get(`${base_url}api`+`/class/getsectionbyclassandcourse/${id}/${courseid}`).then(response => {    			
			this.setState({
				[inp]:id,   	
				section_id:'',   			
				subjectData:[], 
			    descriptionlst:[],
				subarr:[],	  	
				sectionData: response.data.data ? response.data.data :[],    
			}); 
		})
		.catch(error => {  	   
		   console.log(error.message); 	    
		})       
		
	}
	else
	{
		this.setState({ class_id:'',section_id:'',sectionData:[],subjectData:[],subarr:[],descriptionlst:[] });				  				
	}
} 

handleSection(e){ 
	e.preventDefault();	  
	const inp = e.target.name;  
	const id = e.target.value;  
	const filearr=(this.state.subarr.length>0)?this.state.subarr:[];  	
	
	for(var i=0;i<filearr.length;i++)
	{	
		if(typeof this.state['attachment_'+filearr[i]] !== "undefined")
		{
			this.state['attachment_'+filearr[i]]="";  		
		}  	  
	}	
	
	if(id !='')
	{	
		this.setState({
			[inp]:id,
			subjectData:[],
			descriptionlst:[],		
			subarr:[],				
		}); 
	}
	else
	{
		this.setState({ section_id:'',subjectData:[],subarr:[],descriptionlst:[] });				  				
	}
}  	 

handleAttachment(ev) 
{
	ev.preventDefault();   
	const fileId=ev.target.id;	
	const validImageTypes = ['image/jpeg','image/png','application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];      			 
	const errors=this.state.alertarr; 	 	
	const err=[];   	 	
	
	if (ev.target.files && ev.target.files.length > 0) 		
	{  
		const fileType = ev.target.files[0].type;      
		
		if (validImageTypes.includes(fileType)) 
		{
			for(var i=0;i<errors.length;i++)		
			{
				if(fileId !=errors[i])
				{
					err.push(errors[i]);	
				} 					
			}	
			
			this.setState({ [ev.target.name]:ev.target.files[0],alertarr:err });   		 		  	
		}        
		else {
			
			for(var i=0;i<errors.length;i++)		
			{
				err.push(errors[i]);	    
			} 	
			
			if(!err.includes(parseInt(fileId)))
			{
				err.push(parseInt(fileId));		
			}	
			
			this.setState({ alertarr:err });    			
			
		}			       	
		
    } 	 
} 		

handleCreate(event) {
	
  event.preventDefault();      		  
  const { assign_date } = event.target;             
  const descriptionlist = this.state.descriptionlst;      	
  const idarr=[];	
  const obj={};  	
  
	for(var key in descriptionlist) 		
	{  			 
		if(descriptionlist[key] !== null)
		{  			
			if(descriptionlist[key].name.includes("description"))	
			{
				if(!idarr.includes(parseInt(descriptionlist[key].id)))
				{
					obj[parseInt(descriptionlist[key].id)]=descriptionlist[key].value;
					idarr.push(parseInt(descriptionlist[key].id));   
				} 	 				
			}				
		}
	}    	
	
	this.setState({ subarr:idarr });	
	
	let fd = new FormData();	
	fd.append("assign_date",assign_date.value);	 
	fd.append("class_id",this.state.class_id);	  	
	fd.append("section_id",this.state.section_id);	  		
	fd.append("school_id",this.state.school_id);	  	
	fd.append("subject_arr",idarr);	    
	
	for(var i=0;i<idarr.length;i++)
	{		
		if(obj.hasOwnProperty(idarr[i]))
		{
			fd.append(`descriptions[${i}]`,(obj[idarr[i]]=='')?'':obj[idarr[i]]);	   
		}	
		
		if(typeof this.state['attachment_'+idarr[i]] !== "undefined" && typeof this.state['attachment_'+idarr[i]] !='string')
		{ 			
			fd.append(`attachments[${i}]`,this.state['attachment_'+idarr[i]]);				  
		}  	 
	}
	
    axios.post(`${base_url}`+'api/homework/create',fd).then(response => {  				
		console.log(response);		  
		if (response.data.status === 'successed')  				    
		{		
			this.setState({ showError:false,showSuccess:true,message:response.data.message,errors:response.data.errors,subjectData:[]});												
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
	if(field.includes("attachments"))	
	{
		return ( <span className='error'><strong>{this.state.errors[field][0]}</strong></span> );	  
	}
	else 
	{
		return ( <span className='invalid-feedback'><strong>{this.state.errors[field][0]}</strong></span> );	
	}
	
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

	axios.get(`${base_url}api`+'/class/getcourses').then(response => {   		
	this.setState({  			
			courseData: response.data.data ? response.data.data : [],	
		});
	})
	.catch(error => {  	   
	   console.log(error.message); 			
    })  

	this.setState({ assign_date:date_assign	});		
   
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

const subjectArr=(this.state.subjectData.length>0)?this.state.subjectData:[];	

let obj_len = 0;

for (var key in this.state.errors) {
	if (this.state.errors.hasOwnProperty(key))
	{
		if(key.includes("attachments"))	
		{	  	
			obj_len++;   
		}
    }
}  

var errset = [];  

for(var i=0;i<obj_len;i++)  
{
	var search = 'attachments.'+i; 		
	if (this.state.errors.hasOwnProperty(search))
	{
		errset.push(<span style={style_txt} key={i}><strong>{this.state.errors['attachments.'+i]}</strong></span>);  
	}		
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
					<h4>Assign Home Work</h4>
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
					  <div className="assign-home-work">  
							<div className="form-row">
							  <div className="form-group col-md-2">
								<label>Select Date</label>									
								<input type="date" className={`form-control input-daterange-timepicker ${this.hasErrorFor('assign_date') ? 'is-invalid' : ''}`} name="assign_date" value={(this.state.assign_date)?this.state.assign_date:''} onChange={this.handleChange} placeholder="dd/mm/yy" />		
								{this.renderErrorFor('assign_date')}   		
							  </div>
							
							  <div className="form-group col-md-2">
								<label>Course</label>
								<select className={`form-control ${this.hasErrorFor('course_id') ? 'is-invalid' : ''}`} name="course_id" onChange={this.handleCourse} value={(this.state.course_id)?this.state.course_id:''}>		
								  <option value="">--Select--</option>
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
							  
							  <div className="form-group col-md-2">
								<label>Class</label>			
								<select className={`form-control ${this.hasErrorFor('class_id') ? 'is-invalid' : ''}`} name="class_id" onChange={this.handleClass} value={(this.state.class_id)?this.state.class_id:''}>
								<option value="">--Select--</option>  
								  {this.state.classData.map( (item,key) => {		
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
							  
							  <div className="form-group col-md-2">
								<label>Section</label>		
								<select className={`form-control valid ${this.hasErrorFor('section_id') ? 'is-invalid' : ''}`} name="section_id" onChange={this.handleSection} value={(this.state.section_id)?this.state.section_id:''}>
								<option value="">--Select--</option>   
								{
								  this.state.sectionData.map( (item, key) => {		
									return (  
								  <option key={key} value={item.sectionId}>{item.sectionName}</option>				
								  )     
								})
								}
								</select> 
								{this.renderErrorFor('section_id')} 	
							  </div>
							  
							  <div className="form-group col-md-2">
								<label>&nbsp; &nbsp; &nbsp;</label><br/> 
								<input type="submit" className="btn btn-primary" value="Load Assigned Subjects" onClick={this.loadDetail}/>
							  </div>
							</div>{/******<!--/ form-row -->*******/}
						  
						{
						this.state.subjectData.length>0?( 	
						<div className="table-responsive">
							<table className="table table-bordered table-striped verticle-middle table-responsive-sm">
								<thead>
									<tr>
										<th scope="col">Subject Name</th>
										<th scope="col">Home Work</th>
										<th scope="col">Upload File</th>
										<th scope="col">Subject Teacher</th>
									</tr>
								</thead>
								<tbody>  								
								{												
									subjectArr.map((item,i) => {
										
										const emp_arr=item.emp_list.split(',');		
										const img_arr=item.img_set.split(',');		
												
										const slot_arr = [];		
										for (var j=0;j<emp_arr.length;j++) 	   
										{			
											slot_arr.push(<label key={j}><img className="user-profile" src={(img_arr[j]=='' || img_arr[j]=='N/A' || typeof img_arr[j] == "undefined")?base_url+"images/male.jpg":base_url+"uploads/employee_image/"+img_arr[j]}/><span className="name-span">{emp_arr[j]}</span></label>);  
										} 										
									return (											
									<tr key={i}>				
										<td>{item.subjectName}</td>		
										<td><textarea className="form-control" name={'description_'+item.subjectId} id={item.subjectId} ref={node =>this.state.descriptionlst.push(node)} placeholder="Enter Home Work"></textarea></td>		
										<td>
											<input type="file" name={'attachment_'+item.subjectId} id={item.subjectId} ref={(node) => {this['attachment_'+i] = node;}} onChange={this.handleAttachment} />
											{
											this.state.alertarr.includes(item.subjectId)?(	
												<label style={{color:"red",fontSize:"15px"}}>Only jpeg or png images accepted</label>  				
												):''						
											}	
											
										</td>		
										<td>{slot_arr}</td>		  
									</tr>)		
									})		
								   }	
								</tbody>			
							</table> 
							{errset}   		
							<div className="submit-btn form-own text-right">
							  <input type="submit" value="Upload Home Work" className="btn btn-primary"/>
							</div>			
							  
						</div>	  
						)
						:''			
						}   
					  </div>{/*******<!--/ assign-home-work -->*******/} 
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
export default AssignHomeWork;    