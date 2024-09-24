import React, { Component } from "react";
import axios from 'axios';  
import { Link } from 'react-router-dom';      
		
import Script from "@gumgum/react-script-tag";  
import Copyright from "../basic/Copyright";
import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url=location.protocol+'//'+location.host+'/';	

class SchoolProfile extends Component {  
  
  constructor (props) {
  super(props)
  this.state = {  	
	isLoading:true,
	fileError:false,
	fileHelp:true,  	
	fileErr:false,
	fileTxt:true,  
	showError:false,  
	showSuccess:false,	
	name:'',	
	session_from:'',	
	address:'',	
	session_to:'',	
	about:'',	
	email:'',	
	remark:'',	
	principal:'',	
	affiliation:'',	
	contact:'',	
	fax:'',	 	
	state_id:'',
	district_id:'',   
	fileMsg:'',  	
	imgUrl:'',	
	fileMessage:'',  	
	imgSrc:'',
	message:'',				
	schoolData:[],
	districtData:[],
	stateData:[],  	
	errors:[],  
  }
   this.handleUpdate = this.handleUpdate.bind(this);  
   this.handleFile = this.handleFile.bind(this);    
   this.handleLogo = this.handleLogo.bind(this);      
   this.handleClick = this.handleClick.bind(this);   		
   this.handleImage = this.handleImage.bind(this);     
   this.handleIcon = this.handleIcon.bind(this);   
   this.handleSymbol = this.handleSymbol.bind(this);    
   this.handleOnDrop = this.handleOnDrop.bind(this);   
   this.handleOnDive = this.handleOnDive.bind(this);   
   this.handleDragOver = this.handleDragOver.bind(this);    		
   this.handleChange = this.handleChange.bind(this);  
   this.changeState = this.changeState.bind(this);       
   this.hasErrorFor = this.hasErrorFor.bind(this);
   this.renderErrorFor = this.renderErrorFor.bind(this);
   this.input = React.createRef();  		  	    
}  


changeState(e){
    
	this.setState({
			state_id: e.target.value			
		});	
		
	   const id = e.target.value;  			
	   
	   if(id >0)
	   {
		   axios.get(`${base_url}api`+`/studentmaster/getdistrict/${id}`).then(response => {   					 
				this.setState({   
					districtData: response.data.data ? response.data.data :[]	 
				}); 
			})
			.catch(error => {  	   
			   console.log(error.message); 	
			})    
	   }
	   else
	   {
		   this.setState({   
					districtData:[]	 
				}); 
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

handleFile(ev) 
{
	ev.preventDefault();     
	const validImageTypes = ['image/jpeg','image/png'];      
	
	if (ev.target.files && ev.target.files.length > 0) 
	{
		const fileType = ev.target.files[0].type;      
		if (validImageTypes.includes(fileType)) 
		{			
			this.setState({ [ev.target.name]:ev.target.files[0],imgSrc:URL.createObjectURL(ev.target.files[0]),fileError:false,fileHelp:false,fileMessage:""});	  		   
		}        
		else {
			this.setState({fileError:true,fileHelp:true,fileMessage:"only jpeg or png images accepted",imgSrc:""});   
		}       				
    } 	
}   

handleLogo(ev) 
{
	ev.preventDefault();     
	const validImageTypes = ['image/jpeg','image/png'];      
	
	if (ev.target.files && ev.target.files.length > 0) 
	{
		const fileType = ev.target.files[0].type;      
		if (validImageTypes.includes(fileType)) 
		{			
			this.setState({ [ev.target.name]:ev.target.files[0],imgUrl:URL.createObjectURL(ev.target.files[0]),fileErr:false,fileTxt:false,fileMsg:""});	  		   
		}        
		else {
			this.setState({fileErr:true,fileTxt:true,fileMsg:"only jpeg or png images accepted",imgUrl:""});   
		}       				
    } 	
} 

handleOnDrop(ev) 
{
	ev.preventDefault();    
	const validImageTypes = ['image/jpeg','image/png'];   	
	let imageFile = ev.dataTransfer.files[0];
	const fileType = ev.dataTransfer.files[0].type;   
	const fileInput=this.fileInput.name;    
	if (validImageTypes.includes(fileType)) 
	{			
		this.setState({ [fileInput]:ev.dataTransfer.files[0],imgSrc:URL.createObjectURL(ev.dataTransfer.files[0]),fileError:false,fileHelp:false,fileMessage:"" });	  		 
	}        
	else {
		this.setState({fileError:true,fileHelp:true,fileMessage:"only jpeg or png images accepted",imgSrc:""});   
	}    
}  

handleOnDive(ev) 
{
	ev.preventDefault();    
	const validImageTypes = ['image/jpeg','image/png'];   	
	let imageFile = ev.dataTransfer.files[0];
	const fileType = ev.dataTransfer.files[0].type;   
	const fileInput=this.imageInput.name;    
	if (validImageTypes.includes(fileType)) 
	{			
		this.setState({ [fileInput]:ev.dataTransfer.files[0],imgUrl:URL.createObjectURL(ev.dataTransfer.files[0]),fileErr:false,fileTxt:false,fileMsg:"" });	  		 
	}        
	else {
		this.setState({fileErr:true,fileTxt:true,fileMsg:"only jpeg or png images accepted",imgUrl:""});   
	}    
}  
handleClick() 
{
	this.fileInput.click();      	
}  
handleImage() 
{
	this.imageInput.click();      	
} 
handleDragOver(ev) 
{
	ev.preventDefault();   
} 
handleIcon(e)
{
	e.preventDefault();  
	const fileInput=this.fileInput.name;   	
	this.setState({fileError:false,fileHelp:true,fileMessage:"",imgSrc:"",[fileInput]:""});     
}
handleSymbol(e)   
{
	e.preventDefault();  
	const fileInput=this.imageInput.name;   	
	this.setState({fileErr:false,fileTxt:true,fileMsg:"",imgUrl:"",[fileInput]:""});     
}

handleChange(event){		
    event.preventDefault();  	
    this.setState({ [event.target.name]: event.target.value });   
}
   
hasErrorFor (field) {
  return !!this.state.errors[field]		
}
renderErrorFor (field) {
  if (this.hasErrorFor(field)) 
  {	
	if(field=='icon_image' || field=='logo_image')		   	
	{
		return (<span className='error'> <strong>{this.state.errors[field][0]}</strong> </span>)  
	}
	return ( <span className='invalid-feedback'> <strong>{this.state.errors[field][0]}</strong> </span> )
  }
}  

handleUpdate(event){
	event.preventDefault();    
	const { name,session_from,address,session_to,state_id,district_id,about,email,remark,principal,affiliation,contact,fax } = event.target;  
	
	const action=window.event.submitter.name;  
	const urlString = window.location.href;    
	const url = new URL(urlString);   
	const lastSegment = url.pathname.split('/').pop();	  		
	const id = lastSegment;  
	
	const school_photo=(this.state.photo)?this.state.photo:''; 
	const school_logo=(this.state.logo)?this.state.logo:'';	  
  
	if(action=='save')
	{	
		let fd = new FormData();			
		
		fd.append("name",name.value);	 
		fd.append("address",address.value);	
		fd.append("session_st",session_from.value);	 
		fd.append("session_ed",session_to.value);	 		 
		fd.append("state",state_id.value);	 
		fd.append("district",district_id.value);	 
		fd.append("about",about.value);			
		fd.append("email",email.value);	  		
		fd.append("remark",remark.value);	 
		fd.append("principal",principal.value);	
		fd.append("affiliation",affiliation.value);	 
		fd.append("contact",contact.value);	
		fd.append("fax",fax.value);	
		
		fd.append("icon_image",school_photo);   
		fd.append("logo_image",school_logo);   

		axios.post(`${base_url}api/profile/edit/${id}`,fd)			  
			.then(response => {    				
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
	else
	{
		window.location.href = base_url+'profile';	  
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
			
		if (response.data.status === 'successed')     
		{
			const login_data=response.data.data?response.data.data:[]; 	
			if (typeof(login_data) != "undefined")
			{ 	
				this.setState({ isLoading: false });    
			}   			
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
	
	axios.get(`${base_url}api`+'/studentmaster/getstates').then(response => {     		
	this.setState({  			
			stateData: response.data.data ? response.data.data : [],	
		});
	})
	.catch(error => {  	   
	   console.log(error.message); 	
    }) 

	axios.get(`${base_url}api`+`/profile/${id}`).then(response => {
		
		const schoolArr=response.data.data?response.data.data:[];  	
		const state_id=(schoolArr.length>0)?schoolArr[0].state_id:''; 
		const sc_photo = (schoolArr.length>0)?schoolArr[0].school_photo:'';	  
		const sc_logo = (schoolArr.length>0)?schoolArr[0].school_logo:'';		

		if(state_id !='')	
		{
			axios.get(`${base_url}api`+`/studentmaster/getdistrict/${state_id}`).then(response => {   					 
				this.setState({   
					districtData: response.data.data ? response.data.data :[],
					schoolData:schoolArr,	
					imgSrc:base_url+'uploads/school_image/'+sc_photo,    	
					imgUrl:base_url+'uploads/school_image/'+sc_logo,    
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
   
render () {	 

const isLoad = this.state.isLoading;    
let _this = this;		  					

if (isLoad) {  

//return null;  		
			 		
}

const style_drag = { 
	position:'relative',
	height:'170px',       
	width:'75%',   
	border:"1px solid #d4d4d4",   	  
	float:'left', 	
	marginRight:'2px'	    
};  

const img_remove = {   
	position:'absolute',
	top:'-10px',
	right:'-11px',	
	borderRadius:'10em',
	padding:'2px 6px 3px',
	textDecoration:'none',
	border:'3px solid #fff',  
	color:'#FFF',	
	background:'#E54E4E', 	
};  

const style_div = { 
	width:'215px',    
    height:'200px',  
    border:'2px solid #fff',  
    marginRight:'2px',    	    
    float:'left',  	    
};  

const schoolArr=(this.state.schoolData.length>0)?this.state.schoolData:[]; 	  

let sc_name=(this.state.schoolData.length>0)?this.state.schoolData[0].school_name:'';	  
let sc_address=(this.state.schoolData.length>0)?this.state.schoolData[0].school_address:'';	  
let sc_state=(this.state.schoolData.length>0)?this.state.schoolData[0].state_id:'';	   
let sc_district=(this.state.schoolData.length>0)?this.state.schoolData[0].district_id:'';	
let sc_email=(this.state.schoolData.length>0)?this.state.schoolData[0].school_email:'';	
let sc_principal=(this.state.schoolData.length>0)?this.state.schoolData[0].principal_name:'';	
let sc_affiliation=(this.state.schoolData.length>0)?this.state.schoolData[0].school_affiliation:'';	
let sc_contact=(this.state.schoolData.length>0)?this.state.schoolData[0].school_contact:'';	
let sc_remark=(this.state.schoolData.length>0)?this.state.schoolData[0].remark:'';	 
let sc_fax=(this.state.schoolData.length>0)?this.state.schoolData[0].faxno:'';	
let sc_about=(this.state.schoolData.length>0)?this.state.schoolData[0].about:'';
let session_start=(this.state.schoolData.length>0)?this.state.schoolData[0].CurrentSessionFrom:'';	
let session_end=(this.state.schoolData.length>0)?this.state.schoolData[0].CurrentSessionTo:'';	    

   
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
								<h4>Edit School Detail</h4>		  
							</div>
						</div> 						
					</div> 		
					
					<div className="row">
					  <div className="col-xl-12 col-xxl-12">
						<div className="card"> 						  
						  <div className="card-body">							
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
										<label>School/College Name</label>
										<input type="text" name="name" className={`form-control ${this.hasErrorFor('name') ? 'is-invalid' : ''}`} placeholder="Enter name" value={this.state.name?this.state.name:sc_name} onChange={this.handleChange}/>  
										{this.renderErrorFor('name')}     	
									  </div> 									  
									  <div className="form-group col-md-6">  
										<label>Session From</label>  
										<input type="date" name="session_from" className={`form-control ${this.hasErrorFor('session_st') ? 'is-invalid' : ''}`} placeholder="dd/mm/yy" value={(this.state.session_from)?this.state.session_from:session_start} onChange={this.handleChange} />
										{this.renderErrorFor('session_st')}     	
									  </div>
									  
									  <div className="form-group col-md-6">   		
										<label>School/College Address</label>
										<input type="text" name="address" className={`form-control ${this.hasErrorFor('address') ? 'is-invalid' : ''}`} value={this.state.address?this.state.address:sc_address} onChange={this.handleChange} placeholder="Enter your address"/> 
										{this.renderErrorFor('address')}   
									  </div>

									  <div className="form-group col-md-6">	
										<label>Session To</label>  
										<input type="date" name="session_to" className={`form-control ${this.hasErrorFor('session_ed') ? 'is-invalid' : ''}`} value={this.state.session_to?this.state.session_to:session_end} onChange={this.handleChange} placeholder="dd/mm/yy"/>    
										{this.renderErrorFor('session_ed')}      
									  </div>	
									  
									  <div className="form-group col-md-6">  
										<label>State</label>
										<select className={`form-control ${this.hasErrorFor('state') ? 'is-invalid' : ''}`} name="state_id" value={(this.state.state_id)?this.state.state_id:sc_state} onChange={this.changeState} ref={this.input}>    
											  <option value="">--Select--</option>  
											  {this.state.stateData.map( (item, key) => {     
												return (
											  <option key={key} value={item.id}>{item.name}</option>   
											  )
											})}
										  </select> 
										  {this.renderErrorFor('state')}    
									  </div>

									  <div className="form-group col-md-6">
										<label>District</label>
										<select className={`form-control ${this.hasErrorFor('district') ? 'is-invalid' : ''}`} name="district_id" value={(this.state.district_id)?this.state.district_id:sc_district} onChange={this.handleChange} ref={this.input}>      
											  <option value="">--Select--</option>  
											  {this.state.districtData.map( (item, key) => {     
												return (
											  <option key={key} value={item.id}>{item.name}</option>   
											  )
											})}
										  </select> 
										  {this.renderErrorFor('district')}  
									  </div>	
									  
									  <div className="form-group col-md-6">    
										<label>About School</label>
										<textarea className={`form-control ${this.hasErrorFor('about') ? 'is-invalid' : ''}`} rows="2" name="about" value={this.state.about?this.state.about:sc_about} onChange={this.handleChange}></textarea>  
										{this.renderErrorFor('about')}	
									  </div>	

									  <div className="form-group col-md-6">
										<label>School/College Email</label>  
										<input type="text" name="email" className={`form-control ${this.hasErrorFor('email') ? 'is-invalid' : ''}`} value={this.state.email?this.state.email:sc_email} onChange={this.handleChange} placeholder="Enter email"/>
										{this.renderErrorFor('email')}	
									  </div>  

									  <div className="form-group col-md-6">
										<label>Remarks</label>  
										<input type="text" name="remark" className={`form-control ${this.hasErrorFor('remark') ? 'is-invalid' : ''}`} value={this.state.remark?this.state.remark:sc_remark} onChange={this.handleChange} placeholder="Enter remark"/>
										{this.renderErrorFor('remark')}	  
									  </div>
									  
									  <div className="form-group col-md-6">
										<label>Principal Name</label>  
										<input type="text" name="principal" className={`form-control ${this.hasErrorFor('principal') ? 'is-invalid' : ''}`} value={this.state.principal?this.state.principal:sc_principal} onChange={this.handleChange} placeholder="Enter principal"/>
										{this.renderErrorFor('principal')}	   	
									  </div>

									  <div className="form-group col-md-6">
										<label>School/College Affiliation</label>  
										<input type="text" name="affiliation" className={`form-control ${this.hasErrorFor('affiliation') ? 'is-invalid' : ''}`} value={this.state.affiliation?this.state.affiliation:sc_affiliation} onChange={this.handleChange} placeholder="Enter affiliation"/>	
										{this.renderErrorFor('affiliation')}	
									  </div>

									  <div className="form-group col-md-6">
										<label>School/College Contact</label>  
										<input type="text" name="contact" className={`form-control ${this.hasErrorFor('contact') ? 'is-invalid' : ''}`} value={this.state.contact?this.state.contact:sc_contact} onChange={this.handleChange} placeholder="Enter contact"/>
										{this.renderErrorFor('contact')}	
									  </div>		

									  <div className="form-group col-md-6">  
										<label>Fax No.</label>    
										<input type="text" name="fax" className={`form-control ${this.hasErrorFor('name') ? 'is-invalid' : ''}`} onChange={this.handleChange} value={this.state.fax?this.state.fax:sc_fax} placeholder="Enter fax"/>
										{this.renderErrorFor('fax')}    
									  </div>
									  <div className="form-group col-md-6">
									    <div style={style_div}>
											<p>School/College Photo</p>     
											<div style={style_drag} onDragOver={(e) => this.handleDragOver(e)} onDrop={(e) => this.handleOnDrop(e)}>      
											  {this.state.fileHelp?<p onClick={this.handleClick}>Click to select or Drag and drop image here.</p>:null}   
											  <img src={this.state.imgSrc?this.state.imgSrc:''} alt='' />  
											  <a onClick={this.handleIcon} href="#" style={img_remove}>&#215;</a>   	
											  <input type="file" name="photo" ref={(node) => {this.fileInput = node;}} onChange={this.handleFile} hidden/>    
											  {this.state.fileError?     
											  <p style={{color:"red"}}>    
												<strong>{this.state.fileMessage}</strong>       	  					   
											  </p>  
											 : null}   		 
											</div>
											{this.renderErrorFor('icon_image')}  	
										</div>

										<div style={style_div}>
											<p>School/College Logo</p>      
											<div style={style_drag} onDragOver={(e) => this.handleDragOver(e)} onDrop={(e) => this.handleOnDive(e)}>      
											  {this.state.fileTxt?<p onClick={this.handleImage}>Click to select or Drag and drop image here.</p>:null}   
											  <img src={this.state.imgUrl?this.state.imgUrl:''} alt='' />  
											  <a onClick={this.handleSymbol} href="#" style={img_remove}>&#215;</a>   	
											  <input type="file" name="logo" ref={(node) => {this.imageInput = node;}} onChange={this.handleLogo} hidden/>    
											  {this.state.fileErr?     
											  <p style={{color:"red"}}>    
												<strong>{this.state.fileMsg}</strong>          	  					   
											  </p>  
											 : null}   		 
											</div>
											{this.renderErrorFor('logo_image')}  	  	
										</div>	
									  </div>   
									  
									</div> {/*********--/ form-row --*********/}  
									<br/>		
									<div className="text-right btn-submit-right">
									  <input type="submit" name="save" className="btn btn-primary btn-sm mx-1" value="Update"/>		
									  <input type="submit" name="cancel" className="btn btn-primary btn-sm mx-1" value="Cancel"/>		
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
export default SchoolProfile;    