import React, { Component } from "react";
import axios from 'axios';  
import { Link } from 'react-router-dom';    

import Script from "@gumgum/react-script-tag";

import Copyright from "../basic/Copyright";  
import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url=location.protocol+'//'+location.host+'/';		

class RegistrationAdd extends Component {
  constructor (props) {
	super(props);		
    this.state = {
		showError: false,
		fileError:false,  
		fileError1:false,  
		fileError2:false,  
		showSuccess:false,
		fileMessgae:'',
		fileMessgae1:'',	
		fileMessgae2:'',
		imgSrc:'',
		imgSrc1:'',
		imgSrc2:'',   
		messgae:'',
		stateData:[],
		courseData:[],  
		classData:[], 
		studentclassData:[],   	
		sectionData:[],   
		stationData:[],	
		routeData:[],    	
		compulsaryData:[],     
		electiveData:[],   
		additionalData:[],  
		districtData:[],
		vehicleData:[],		
		compulsaries:[],
		electives:[],
		additionals:[], 
		suggestions:[],   
		registerData:[],
		feeData:[],			
		errors:[],					 			
		student_image:'',   		
		father_image:'',  
		mother_image:'',    			
		child_no:'',   
		totalfare:'',
		transconcession_amount:'',
		busfare:'',
		bus_no:'',
		route_id:'',
		tab_id:'personal_detail',      
		station_id:'',
		class_first:'',
		course_first:'',
		board_roll_no:'',   
		registration_no:'',
		roll_no:'',
		section_id:'',
		class_id:'',
		course_id:'',
		admission_no:'',
		admission_date:'',
		residence_no:'',
		f_email:'',
		f_mobile:'',
		f_designation:'',
		f_income:'',
		f_occupation:'',
		mother_name:'',
		father_name:'',
		branch_address:'',
		ifsc:'',
		account_no:'',
		pincode:'',
		district_id:'',
		state_id:'',
		temporary_address:'',
		permanent_address:'',
		aadhar_no:'',
		blood_group:'',
		email:'',
		mobile:'',
		marital_status:'',
		religion:'',  
		caste:'',
		dob:'',
		student_name:'',
		insert_id:'', 		
		selectedParent :'new',
		selectedTransport:'no',
		selectedConcession:'no',
		selectedStaff:'no',	
		show:false,
		show_trans:false, 
		show_root:false, 	
		show_vehicle:false, 
		show_cons:false,
		show_staff:false,  
    };
    this.formSubmit = this.formSubmit.bind(this); 
	this.handleChange = this.handleChange.bind(this);      	
	this.onValueChange = this.onValueChange.bind(this);      	
	this.handleTransport = this.handleTransport.bind(this);       
	this.handleConcession = this.handleConcession.bind(this);           
	this.handleStaff = this.handleStaff.bind(this);       	
	this.handleAdmission = this.handleAdmission.bind(this);      
	this.setAdmission = this.setAdmission.bind(this);          
	this.changeStation = this.changeStation.bind(this);     
	this.changeRoute = this.changeRoute.bind(this);     	
	this.handleFileUpload1 = this.handleFileUpload1.bind(this);      
	this.handleFileUpload2 = this.handleFileUpload2.bind(this);     
	this.handleFilePreview = this.handleFilePreview.bind(this);        
    this.changeDistrict = this.changeDistrict.bind(this);
	this.changeCourse = this.changeCourse.bind(this);    
	this.changeStudentCourse = this.changeStudentCourse.bind(this);   
    this.handleFee = this.handleFee.bind(this);     	
	this.changeClass = this.changeClass.bind(this);     
	this.changeSection = this.changeSection.bind(this);    
	this.handleTab = this.handleTab.bind(this);     
	this.handleCompulsary = this.handleCompulsary.bind(this);   	
	this.handleElective = this.handleElective.bind(this);   
	this.handleAdditional = this.handleAdditional.bind(this);   	
	this.handleTransaction = this.handleTransaction.bind(this);      	 
	this.handleFare = this.handleFare.bind(this);  
	this.hasErrorFor = this.hasErrorFor.bind(this);	
	this.renderErrorFor = this.renderErrorFor.bind(this);   	
	this.input = React.createRef();    	
  
  }	
  
handleChange(event){		
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });   
}
handleTab = (event,param) => {   	  			
   this.setState({tab_id:param,showError:false,showSuccess:false});  						
}  
handleAdmission(event){		
    event.preventDefault(); 
	const search = event.target.value; 	
    this.setState({ [event.target.name]: event.target.value });   
	
	 if (search.length > 0) {
        // make api call				
			axios.get(`${base_url}api`+`/studentmaster/getsuggestion/${search}`).then(response => {
				console.log(response.data);    	
				this.setState({   
					suggestions: response.data.data ? response.data.data :[]	   			
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
	const admission_no = event.target.id; 	
	const f_name = event.currentTarget.attributes['data-f'].value;    	
	const m_name = event.currentTarget.attributes['data-m'].value; 	 
	const f_job = event.currentTarget.attributes['data-o'].value;   
	const f_salary = event.currentTarget.attributes['data-i'].value;  
	const f_title = event.currentTarget.attributes['data-d'].value; 
	const f_cell = event.currentTarget.attributes['data-mo'].value; 
	const f_mail = event.currentTarget.attributes['data-e'].value;    
	const f_residence = event.currentTarget.attributes['data-r'].value;     	
	
	console.log(f_name);  	    
	this.setState({
	  sibling_admission_no:admission_no,
	  father_name:f_name,    
	  mother_name:m_name,
	  f_occupation:f_job,   
	  f_income:f_salary,
	  f_designation:f_title,		
	  f_mobile:f_cell,
	  f_email:f_mail,
	  residence_no:f_residence,     				
	  suggestions: []   	
	}); 
}  
handleFileUpload1(e) {    
    const validImageTypes = ['image/jpeg','image/png'];     
	
	if (e.target.files && e.target.files.length > 0) 
	{
		const fileType = e.target.files[0].type;      
		if (validImageTypes.includes(fileType)) 
		{
			this.setState({ [event.target.name]:event.target.files[0],imgSrc1:URL.createObjectURL(event.target.files[0]),fileError1:false,fileMessgae1:"" });	     
		}        
		else {  			
			this.setState({fileError1:true,fileMessgae1:"only jpeg or png images accepted",imgSrc1:""});   	
		}       				
    }   
} 
   
handleFileUpload2(e) {    
    const validImageTypes = ['image/jpeg','image/png'];     
	
	if (e.target.files && e.target.files.length > 0) 
	{
		const fileType = e.target.files[0].type;      
		if (validImageTypes.includes(fileType)) 
		{
			this.setState({ [event.target.name]:event.target.files[0],imgSrc2:URL.createObjectURL(event.target.files[0]),fileError2:false,fileMessgae2:"" });	   
		}        
		else {  			 
			this.setState({fileError2:true,fileMessgae2:"only jpeg or png images accepted",imgSrc2:""});   
		}       				
    }   
} 
handleFilePreview(e) 
{
	const validImageTypes = ['image/jpeg','image/png'];     
	
	if (e.target.files && e.target.files.length > 0) 
	{
		const fileType = e.target.files[0].type;      
		if (validImageTypes.includes(fileType)) 
		{
			this.setState({ [event.target.name]:event.target.files[0],imgSrc:URL.createObjectURL(event.target.files[0]),fileError:false,fileMessgae:"" });	 
		}        
		else {
			this.setState({fileError:true,fileMessgae:"only jpeg or png images accepted",imgSrc:""});   
		}       				
    }
	
}
onValueChange(event) {
	
	if(event.target.value=='old')
	{ 		
		this.setState({ selectedParent : event.target.value,show:true }); 	    
	}
	else
	{
		this.setState({ selectedParent : event.target.value,show:false });       
	}   
	
  }    

handleTransport(event) {
	
	if(event.target.value=='yes')    
	{ 		
		this.setState({ selectedTransport : event.target.value,show_trans:true,show_root:false,show_vehicle:false }); 	    
	}
	else   
	{
		this.setState({ selectedTransport : event.target.value,show_trans:false,show_root:false,show_vehicle:false });           
	}   
	
  }
handleConcession(event) {
	
	if(event.target.value=='yes')    
	{ 		
		this.setState({ selectedConcession : event.target.value,show_cons:true}); 				    
	}
	else   
	{
		this.setState({ selectedConcession : event.target.value,show_cons:false,busfare:0,transconcession_amount:0,totalfare:0 });        
	}   
	
  }  
handleStaff(event) {
	
	if(event.target.value=='yes')    
	{ 		
		this.setState({ selectedStaff : event.target.value,show_staff:true});   	    
	}
	else   
	{
		this.setState({ selectedStaff : event.target.value,show_staff:false });           
	}   
	
  }    
handleFare(event){
    event.preventDefault();
    const re = /^[0-9.\b]+$/;     
	var inp = event.target.value;      			
	const arr=inp.split('.');	
	var c_amount=(this.state.transconcession_amount)?parseFloat(this.state.transconcession_amount):0;  
	var f_amount=0;    	  				   
	
	if(re.test(inp) && (arr.length<=2))		
	{
		f_amount=parseFloat(inp)-parseFloat(c_amount);  
		this.setState({ [event.target.name]:inp,totalfare:f_amount,transconcession_amount:c_amount });  										    
	}	
} 
 
handleTransaction(event){
    event.preventDefault();
    const re = /^[0-9.\b]+$/;     
	var inp = event.target.value;      			
	const arr=inp.split('.');	
	var c_amount=(this.state.busfare)?parseFloat(this.state.busfare):0;     
	var f_amount=0;     	 
	
	if(re.test(inp) && (arr.length<=2))		
	{
		f_amount=parseFloat(c_amount)-parseFloat(inp);  
		this.setState({ [event.target.name]:inp,totalfare:f_amount,busfare:c_amount });  										    
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
				[inp]:id,   	
				classData:[]	   
			}); 
	   }   
		
	}  

changeClass(e){   
	const id = e.target.value;  
	const courseid = this.state.course_id; 	  
	
	if(id !='')
	{		
		this.setState({ class_id:id}); 
		
		axios.get(`${base_url}api`+`/class/getsectionbyclassandcourse/${id}/${courseid}`).then(response => {    	
			console.log(response); 		
				this.setState({  			  						
					sectionData: response.data.data ? response.data.data :[]	 
				}); 
			})
			.catch(error => {  	   
			   console.log(error.message); 	
			})     

		
		axios.get(`${base_url}api`+`/studentmaster/getclasswisesubjects/${courseid}/${id}`).then(response => {    
  		
		this.setState({  			
				compulsaryData: response.data.data.compulsary ? response.data.data.compulsary : [],	
				electiveData: response.data.data.elective ? response.data.data.elective : [],	
				additionalData: response.data.data.additional ? response.data.data.additional : []   	  
			});
		})
		.catch(error => {  	   
		   console.log(error.message); 	  		   
		})      
		
	}
	else
	{
		this.setState({ sectionData:[] });		  
	}
}  	

changeSection(e){   
	const id = e.target.value;  
	const courseid = this.state.course_id; 	  
	const classid=this.state.class_id;   
	
	if(id !='')
	{		
		this.setState({ section_id:id});    
		
		axios.get(`${base_url}api`+`/studentmaster/getclasswisesubjects/${courseid}/${classid}/${id}`).then(response => {
  		
		this.setState({  			
				compulsaryData: response.data.data.compulsary ? response.data.data.compulsary : [],	
				electiveData: response.data.data.elective ? response.data.data.elective : [],	
				additionalData: response.data.data.additional ? response.data.data.additional : []  		 	  
			});
		})
		.catch(error => {  	   
		   console.log(error.message); 	
		   console.log(error.response.data);    		
		})      
		
	}
	else
	{
		this.setState({ sectionData:[] });		  
	}
}  				
    
changeStudentCourse(e) {		
		
		const inp = e.target.name;  
		const id = e.target.value;  			
	   
	   if(id >0)
	   {
		   axios.get(`${base_url}api`+`/class/getclassbycourse/${id}`).then(response => {    		
				this.setState({ 
					[inp]:id,   
					studentclassData: response.data.data ? response.data.data :[]	   
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
					studentclassData:[]	   
				}); 
	   }   
		
	}  
changeStation(e) {			
		this.setState({
			 [e.target.name]: e.target.value   					
		});	
		
		const id=e.target.value;    				

	   if(id >0)    
	   {
		   const fare = e.target.selectedOptions[0].getAttribute('data-set');  	  
		   
		   axios.get(`${base_url}api`+`/studentmaster/getroutes/${id}`).then(response => {    		
				this.setState({  			 					  
					routeData: response.data.data ? response.data.data :[],
					busfare:fare,
					transconcession_amount:0, 
					totalfare:fare,   	
					show_root:true,
					show_vehicle:false 	
				}); 
			})
			.catch(error => {  	   
			   console.log(error.message); 	   
			})    
	   }
	   else
	   {
		   this.setState({   
					routeData:[],  
					show_root:false,
					show_vehicle:false 	   	
				}); 
	   }   
		
	}  
changeDistrict(e){
    
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

changeRoute(e) {	  
		
	   const id = e.target.value;  	
	   
	   if(id >0)
	   {
		   this.setState({		
				 [event.target.name]: event.target.value,show_vehicle:true   					
			});	
		   
		   axios.get(`${base_url}api`+`/studentmaster/getvehicles/${id}`).then(response => {   					 
				this.setState({   
					vehicleData: response.data.data ? response.data.data :[]	 
				}); 
			})
			.catch(error => {  	   
			   console.log(error.message); 	
			})      			
		   
	   }
	   else
	   {
		   this.setState({
			 [event.target.name]: event.target.value,show_vehicle:false   					  
		});	
	   }   
		
	}    
  handleCompulsary(event) {
	const target = event.target;		
	var value = target.value;
	let checks=this.state.compulsaries; 
	const idarr =[]; 
	
	if(target.checked)
	{
		for (var key in checks) 
		{
			idarr.push(checks[key]);  		
		}	
		idarr.push(value);  
		
	}else{
		for (var key in checks) 
		{
			if(value !=checks[key])
			{
				idarr.push(checks[key]);  	
			}  				
		}	
	}     
	
	this.setState({   
		compulsaries:idarr   	 
	}); 
	
}
handleElective(event) {
	const target = event.target;		
	var value = target.value;
	let checks=this.state.electives;   
	const idarr =[]; 
	
	if(target.checked)
	{
		for (var key in checks) 
		{
			idarr.push(checks[key]);  		
		}	
		idarr.push(value);  
		
	}else{
		for (var key in checks) 
		{
			if(value !=checks[key])
			{
				idarr.push(checks[key]);  	
			}  				
		}	
	}     
	
	this.setState({   
		electives:idarr   	 
	});   
	
}
handleAdditional(event) {   
	const target = event.target;		
	var value = target.value;
	let checks=this.state.additionals; 
	const idarr =[]; 
	
	if(target.checked)
	{
		for (var key in checks) 
		{
			idarr.push(checks[key]);  		
		}	
		idarr.push(value);  
		
	}else{
		for (var key in checks) 
		{
			if(value !=checks[key])
			{
				idarr.push(checks[key]);  	
			}  				
		}	
	}     
	
	this.setState({   
		additionals:idarr   	   
	});  	
	
} 

     
handleFee(e) {			
				
		const id = e.target.value; 
		const course = e.target.name;   			
	   
	   if(id >0)
	   {
		   axios.get(`${base_url}api`+`/registration/getclassfee/${id}`).then(response => {    		
				this.setState({
					[course]:id, 	
					feeData: response.data.data ? response.data.data :[]	 
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
					feeData:[]	   
				}); 
	   }   
		
}  
   

hasErrorFor (field) {
	  return !!this.state.errors[field]					
   }
   renderErrorFor (field) {
	  if (this.hasErrorFor(field)) {
		  if(field=='student_image' || field=='father_image' || field=='mother_image')		
		  {
			  return ( <p className='invalid' style={{color: "red"}}> <strong>{this.state.errors[field][0]}</strong> </p> )		
		  }
		  else
		  {
			  return ( <span className='invalid-feedback'> <strong>{this.state.errors[field][0]}</strong> </span> )	
		  }
			
	  }
   }  	 

  formSubmit(event){
    event.preventDefault();    
	
	const savebutton=window.event.submitter.name;     
	var tab_id=(this.state.tab_id)?(this.state.tab_id):''; 
	var insert_id=(this.state.insert_id)?(this.state.insert_id):'';   
	
	const { registration_date,registration_no,registration_fee,interview_date,gender,nationality,dob } = event.target;   

	let s_name=(this.state.student_name)?this.state.student_name:'';  	  				
	let s_dob=(dob)?dob.value:'';       	
	let s_gender=(gender)?gender.value:'';  	
	let s_nationality=(nationality)?nationality.value:'';     
	let s_caste=(this.state.caste)?this.state.caste:'';  	
	let s_religion=(this.state.religion)?this.state.religion:''; 
	let s_marital_status=(this.state.marital_status)?this.state.marital_status:'';  	
	let s_mobile=(this.state.mobile)?this.state.mobile:''; 
	let s_email=(this.state.email)?this.state.email:''; 
	let s_blood_group=(this.state.blood_group)?this.state.blood_group:'';  	
	let s_aadhar_no=(this.state.aadhar_no)?this.state.aadhar_no:'';     
	let s_permanent_address=(this.state.permanent_address)?this.state.permanent_address:'';  	
	let s_temporary_address=(this.state.temporary_address)?this.state.temporary_address:'';    
	let s_state_id=(this.state.state_id)?this.state.state_id:'';  	
	let s_district_id=(this.state.district_id)?this.state.district_id:''; 
	let s_pincode=(this.state.pincode)?this.state.pincode:'';  	
	let s_account_no=(this.state.account_no)?this.state.account_no:''; 		
	let s_ifsc=(this.state.ifsc)?this.state.ifsc:'';  	
	let s_branch_address=(this.state.branch_address)?this.state.branch_address:''; 
	let s_parent_type=(this.state.selectedParent)?this.state.selectedParent:'';    
	let s_sibling_admission_no=(this.state.sibling_admission_no)?this.state.sibling_admission_no:'';    
	let s_sibling_no=(this.state.sibling_no)?this.state.sibling_no:''; 		
	
	let s_father_name=(this.state.father_name)?this.state.father_name:'';   		
	let s_mother_name=(this.state.mother_name)?this.state.mother_name:''; 
	let s_f_occupation=(this.state.f_occupation)?this.state.f_occupation:'';    	
	let s_f_income=(this.state.f_income)?this.state.f_income:''; 
	let s_f_designation=(this.state.f_designation)?this.state.f_designation:''; 	
	let s_f_mobile=(this.state.f_mobile)?this.state.f_mobile:'';  	
	let s_f_email=(this.state.f_email)?this.state.f_email:'';     
	let s_residence_no=(this.state.residence_no)?this.state.residence_no:'';  
	let s_course_id=(this.state.course_id)?this.state.course_id:'';    	
	let s_class_id=(this.state.class_id)?this.state.class_id:'';  
	let s_station_id=(this.state.station_id)?this.state.station_id:'';   
	let s_regis_date=(registration_date)?registration_date.value:'';    	
	let s_regis_no=(registration_no)?registration_no.value:'';      
	let s_regis_fee=(registration_fee)?registration_fee.value:'';    	  
	let s_doi=(interview_date)?interview_date.value:'';     
	
	let fd = new FormData();			
	
	fd.append("student_name",s_name);	 
	fd.append("dob",s_dob);	
	fd.append("gender",s_gender);	  
	fd.append("nationality",s_nationality);	
	fd.append("caste",s_caste);	 
	fd.append("religion",s_religion);	 
	fd.append("marital_status",s_marital_status);	
	fd.append("mobile",s_mobile);	  
	fd.append("email",s_email);	
	fd.append("blood_group",s_blood_group);	 
	fd.append("aadhar_no",s_aadhar_no);	 
	fd.append("permanent_address",s_permanent_address);	
	fd.append("temporary_address",s_temporary_address);	  
	fd.append("state_id",s_state_id);	
	fd.append("district_id",s_district_id);	 
	fd.append("pincode",s_pincode);	   
	fd.append("account_no",s_account_no);	
	fd.append("ifsc",s_ifsc);	  
	fd.append("branch_address",s_branch_address);		
	fd.append("parent_type",s_parent_type);	  
	fd.append("sibling_admission_no",s_sibling_admission_no);	  		
	fd.append("sibling_no",s_sibling_no);  
	fd.append("father_name",s_father_name);	 		
	fd.append("mother_name",s_mother_name);	
	fd.append("f_occupation",s_f_occupation);	  
	fd.append("f_income",s_f_income);	
	fd.append("f_designation",s_f_designation);	 		
	fd.append("f_mobile",s_f_mobile);	 
	fd.append("f_email",s_f_email);	
	fd.append("residence_no",s_residence_no);	 
	fd.append("course_id",s_course_id);	
	fd.append("class_id",s_class_id);		
	fd.append("station_id",s_station_id);	  
	fd.append("regis_date",s_regis_date);	
	fd.append("regis_no",s_regis_no);	    		
	fd.append("regis_fee",s_regis_fee);	  		
	fd.append("doi",s_doi);	  
	fd.append("action",savebutton);	
	fd.append("insert_id",this.state.insert_id);			  
	fd.append("tab",this.state.tab_id);	 		
	fd.append("student_image",this.state.student_image);  						
	fd.append("father_image",this.state.father_image);  
	fd.append("mother_image",this.state.mother_image);     
	
	axios.post(`${base_url}`+'api/registration/add',fd)	  	
	.then(response => {   
		console.log(response.data);   					
		if (response.data.status === 'successed')   
		{		
			this.setState({ showError:false,showSuccess:true,message:response.data.message,insert_id:response.data.data.insert_id,errors:response.data.errors});
			var receipt =response.data.data.print_id?response.data.data.print_id:'';    				 
			if(receipt !='')  
			{
				let a = document.createElement("a"); 
				let url = base_url+'registrations/'+receipt; 																
				a.target='_blank';   		
				a.href = url;
				document.body.appendChild(a);					
				a.click();
				document.body.removeChild(a);   			
			}  			
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

    axios.get(`${base_url}api`+'/studentmaster/getstates').then(response => {     		
	this.setState({  			
			stateData: response.data.data ? response.data.data : [],	
		});
	})
	.catch(error => {  	   
	   console.log(error.message); 	
    })   

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
	
	axios.get(`${base_url}api`+'/registration/getregistration').then(response => {   		
	this.setState({  			
			registerData: response.data.data ? response.data.data : [],	
		});
	})
	.catch(err => {  	   
	   console.log(err.message); 					   	   
    })    
    
  }
  render() {
	  
	const stateArr = (this.state.stateData.length>0)?this.state.stateData:[];  
	const districtArr = (this.state.districtData.length>0)?this.state.districtData:[];    
	const vehicleArr = (this.state.vehicleData.length>0)?this.state.vehicleData:[];		
	
	const stateList = stateArr.map((item, index) => {  
		  return (
				<option key={index} value={item.id}>{item.name}</option>   		
		  );  
	});
	
	const districtList = districtArr.map((item, index) => {  
		  return (
				<option key={index} value={item.id}>{item.name}</option>   		
		  );  
	});   
	
	const vehicleList = vehicleArr.map((item, index) => {  
		  return (
				<option key={index} value={item.route_id}>{item.registration_no}</option>      		
		  );  
	});    	

	let currDate = new Date();			
	let regis_date = currDate.toISOString().substring(0,10);		
	let doi = currDate.toISOString().substring(0,10);	
	let date_birth = currDate.toISOString().substring(0,10);		
	
	let regis_no=(this.state.registerData.length>0)?this.state.registerData[0].regis_no:'';		
	let id_arr=(this.state.feeData.length>0)?this.state.feeData[0].id_list.split(','):[];	  
	let name_arr=(this.state.feeData.length>0)?this.state.feeData[0].name_list.split(','):[];	
	let regis_fee=(this.state.feeData.length>0)?this.state.feeData[0].amount:'';	

	const options = [];			

	for (let i=0;i<id_arr.length;i++) {	
		options.push(<option key={id_arr[i]} value={id_arr[i]}>{name_arr[i]}</option>)
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
	  width:"325px",  	
    };     	
    
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
                <h4>Register New Student</h4>	   
              </div>
            </div>
            <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
              <ol className="breadcrumb">    		             
				<li><a href={`/registration_list`} className="btn bg-blue-soft text-blue">
				 <i className="fa fa-angle-double-left"></i> Back to Registration List	
				 </a></li> 		
              </ol>			
            </div>          
          </div>
          {/* row */}
          <div className="row">
            <div className="col-xl-12 col-lg-12 col-md-12">
              <div className="profile-tab">
                <div className="custom-tab-1">
                  <ul className="nav nav-tabs">
                    <li className="nav-item"><a href="#personal-details" onClick={(e) => this.handleTab(e,'personal_detail')} data-toggle="tab" className="nav-link active show">Personal Details</a></li>	
                    <li className="nav-item"><a href="#parents-details" onClick={(e) => this.handleTab(e,'parents_detail')}  data-toggle="tab" className="nav-link">Parents Details</a></li>
                    <li className="nav-item"><a href="#registration-details" onClick={(e) => this.handleTab(e,'registration_detail')} data-toggle="tab" className="nav-link">Registration Details</a></li>
   				  </ul>					
                  <div className="tab-content">			
                    <div id="personal-details" className="tab-pane fade active show">
                      <div className="pt-3">
                        <div className="settings-form">
                          <div className="row">
                            <div className="col-xl-4 col-lg-4 col-md-4">
                              <div className="card">
                                <div className="card-header"><h4 className="card-title">Upload Student Photo</h4></div>
                                <div className="card-body text-center account-profile">
                                  <img className="img-account-profile rounded-circle mb-2 img-thumbnail" src={(this.state.imgSrc)?this.state.imgSrc:base_url+'images/student.jpg'} alt="" />     
                                  <div className="small font-italic text-muted mb-4">JPG or PNG not larger than 100 KB</div>
                                  <div className="upload-grid">  
                                    <img src={base_url+"images/upload-icon.png"} alt="" />
                                    <input type="file" id="upload" ref="file" name="student_image" className="btn btn-primary" placeholder="Upload new image" onChange={this.handleFilePreview} />  
                                    <label htmlFor="forDesign">Upload new image</label>  
								  </div>
								  {this.renderErrorFor('student_image')}  	    
                                </div>
								{this.state.fileError?     
								 <div className="alert alert-danger" style={{color:"brown"}}>  
									<strong>{this.state.fileMessgae}</strong>       	  					   
								  </div>
								 : null}   
                              </div>{/*/ card */}
                            </div>{/*/ col-4 */}
                            <div className="col-xl-8 col-lg-8 col-md-8">
                              <div className="card">
                                <div className="card-body">
                                  <div className="basic-form form-own">
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
                                        <div className="form-group col-md-6">
                                          <label>Student Name</label>
                                          <input type="text" className={`form-control ${this.hasErrorFor('student_name') ? 'is-invalid' : ''}`} name="student_name" value={(this.state.student_name)?this.state.student_name:''} onChange={this.handleChange} />		
										  {this.renderErrorFor('student_name')}     
                                        </div>  
                                        <div className="form-group col-md-6">		
                                          <label>Date of Birth</label>
                                          <div className="example">  
                                            <input type="date" className={`form-control input-daterange-timepicker ${this.hasErrorFor('dob') ? 'is-invalid' : ''}`} name="dob" value={(this.state.dob)?this.state.dob:date_birth} onChange={this.handleChange} ref={this.input}/>  
											{this.renderErrorFor('dob')}       
                                          </div>
                                        </div>
                                        <div className="form-group col-md-6">
                                          <label>Gender</label>
                                          <div className="form-check settings-form-radio">  
                                            <input className="form-check-input" type="radio" name="gender" value="male" ref={this.input} defaultChecked/> 
                                            <label className="form-check-label">Male</label>  
                                            <input className="form-check-input" type="radio" name="gender" value="female" ref={this.input} />  		
                                            <label className="form-check-label">Female</label>  
                                          </div>
                                        </div>
                                        <div className="form-group col-md-6">
                                          <label>Nationality</label>
                                          <div className="form-check settings-form-radio">
                                            <input className="form-check-input" type="radio" name="nationality" value="indian" ref={this.input} defaultChecked />
                                            <label className="form-check-label">Indian</label>
                                            <input className="form-check-input" type="radio" name="nationality" value="non-indian" ref={this.input}  />  
                                            <label className="form-check-label">Non-Indian</label>
                                          </div>
                                        </div>
                                        <div className="form-group col-md-6">
                                          <label>Caste</label>
                                          <select className={`form-control ${this.hasErrorFor('caste') ? 'is-invalid' : ''}`} name="caste" value={(this.state.caste)?this.state.caste:''} onChange={this.handleChange}>   
											  <option value="">--Select--</option>  
											  <option value="general">General</option>  
											  <option value="obc">OBC</option>		
											  <option value="sc">SC</option>
											  <option value="st">ST</option>
											  <option value="other">Other</option>  
										  </select>
										  {this.renderErrorFor('caste')}           	  
                                        </div>
                                        <div className="form-group col-md-6">
                                          <label>Religion</label>
                                          <select className={`form-control ${this.hasErrorFor('religion') ? 'is-invalid' : ''}`} name="religion" value={(this.state.religion)?this.state.religion:''} onChange={this.handleChange}>
											  <option value="">--Select--</option>			  
											  <option value="hindu">Hindu</option>
											  <option value="muslim">Muslim</option>  
											  <option value="sikh">Sikh</option>	
											  <option value="christian">Christian</option> 
											  <option value="jain">Jain</option> 
											  <option value="buddh">Buddh</option>    
										  </select>
										  {this.renderErrorFor('religion')}           	  
                                        </div>
                                        <div className="form-group col-md-6">
                                          <label>Maritial Status</label>
                                          <select className={`form-control ${this.hasErrorFor('marital_status') ? 'is-invalid' : ''}`} name="marital_status" value={(this.state.marital_status)?this.state.marital_status:''} onChange={this.handleChange}>
											  <option value="">--Select--</option>    
											  <option value="un-married">Un-Married</option>  
											  <option value="married">Married</option>
										  </select>
										  {this.renderErrorFor('marital_status')}             	   
                                        </div>
                                        <div className="form-group col-md-6">		
                                          <label>Mobile No.</label>
                                          <input type="number" className={`form-control ${this.hasErrorFor('mobile') ? 'is-invalid' : ''}`} placeholder="" value={(this.state.mobile)?this.state.mobile:''} name="mobile" onChange={this.handleChange} />
										  {this.renderErrorFor('mobile')}      
                                        </div>
                                        <div className="form-group col-md-4">
                                          <label>Email</label>
                                          <input type="text" className={`form-control ${this.hasErrorFor('email') ? 'is-invalid' : ''}`} placeholder="" value={(this.state.email)?this.state.email:''} name="email" onChange={this.handleChange} />
										  {this.renderErrorFor('email')}          
                                        </div>
                                        <div className="form-group col-md-4">
                                          <label>Blood Group</label>
                                          <input type="text" className={`form-control ${this.hasErrorFor('blood_group') ? 'is-invalid' : ''}`} placeholder="" value={(this.state.blood_group)?this.state.blood_group:''} name="blood_group" onChange={this.handleChange} />
										  {this.renderErrorFor('blood_group')}   
                                        </div>
                                        <div className="form-group col-md-4">
                                          <label>Aadhar No.</label>
                                          <input type="text" className={`form-control ${this.hasErrorFor('aadhar_no') ? 'is-invalid' : ''}`} placeholder="" value={(this.state.aadhar_no)?this.state.aadhar_no:''} name="aadhar_no" onChange={this.handleChange} />
										   {this.renderErrorFor('aadhar_no')}     
                                        </div>		
                                        <div className="form-group col-md-6">
                                          <label>Permanent Address</label>
                                          <textarea className={`form-control ${this.hasErrorFor('permanent_address') ? 'is-invalid' : ''}`}  placeholder="" value={(this.state.permanent_address)?this.state.permanent_address:''} name="permanent_address" onChange={this.handleChange} />	
										  {this.renderErrorFor('permanent_address')}       
                                        </div>
                                        <div className="form-group col-md-6">
                                          <label>Temporary Address</label>
                                          <textarea className={`form-control ${this.hasErrorFor('temporary_address') ? 'is-invalid' : ''}`} placeholder="" value={(this.state.temporary_address)?this.state.temporary_address:''} name="temporary_address" onChange={this.handleChange} />
										  {this.renderErrorFor('temporary_address')}        	  	
                                        </div>
                                        <div className="form-group col-md-6">
                                          <label>State</label>
                                          <select className={`form-control ${this.hasErrorFor('state_id') ? 'is-invalid' : ''}`} name="state_id" value={(this.state.state_id)?this.state.state_id:''} onChange={this.changeDistrict}>  
										  <option value="">--Select--</option>  
										  {stateList}  
										  </select>
										  {this.renderErrorFor('state_id')}    
                                        </div>
                                        <div className="form-group col-md-6">
                                          <label>District</label>
                                          <select className={`form-control ${this.hasErrorFor('district_id') ? 'is-invalid' : ''}`} name="district_id" value={(this.state.district_id)?this.state.district_id:''} onChange={this.handleChange}>
											<option value="">--Select--</option>	
											{districtList}						
										  </select>
										  {this.renderErrorFor('district_id')}       
                                        </div>
                                        <div className="form-group col-md-4">
                                          <label>Pincode</label>
                                          <input className={`form-control ${this.hasErrorFor('pincode') ? 'is-invalid' : ''}`} type="number" value={(this.state.pincode)?this.state.pincode:''} name="pincode" onChange={this.handleChange} />
										  {this.renderErrorFor('pincode')}     
                                        </div>
                                        <div className="form-group col-md-4">     
                                          <label>Account No.</label>
                                          <input className={`form-control ${this.hasErrorFor('account_no') ? 'is-invalid' : ''}`} type="text" value={(this.state.account_no)?this.state.account_no:''} name="account_no" onChange={this.handleChange} />
										  {this.renderErrorFor('account_no')}     
                                        </div>  
                                        <div className="form-group col-md-4">
                                          <label>IFSC Code</label>
                                          <input className={`form-control ${this.hasErrorFor('ifsc') ? 'is-invalid' : ''}`} type="text" value={(this.state.ifsc)?this.state.ifsc:''} name="ifsc" onChange={this.handleChange}  />
										  {this.renderErrorFor('ifsc')}     
                                        </div>
                                        <div className="form-group col-md-12">
                                          <label>Branch Address</label>
                                          <textarea className={`form-control ${this.hasErrorFor('branch_address') ? 'is-invalid' : ''}`} placeholder="" value={(this.state.branch_address)?this.state.branch_address:''} name="branch_address" onChange={this.handleChange} />
										  {this.renderErrorFor('branch_address')}        
                                        </div>  		
                                      </div>{/*/ form-row */}
									   <div className="profile-tab-btn text-right">
											<input type="submit" name="saveonly" className="btn btn-primary btn-sm mx-1" value="Save"/>		
											<input type="submit" name="saveprint" className="btn btn-primary btn-sm mx-1" value="Save & Print"/>	   
									  </div>    		 	
                                    </form>
                                  </div>
                                </div>{/*/ card-body */}
                              </div>{/*/ card */}
                            </div>{/*/ col-8 */}
                          </div>{/*/ row */}
                        </div>{/*/ settings-form */}
                      </div>
                    </div>{/*/ tab-pane */}
                    <div id="parents-details" className="tab-pane fade">
                      <div className="pt-3">
                        <div className="settings-form">
                          <div className="row">
                            <div className="col-xl-4 col-lg-4 col-md-4">
                              <div className="card">
                                <div className="card-header"><h4 className="card-title">Upload Father Image</h4></div>
                                <div className="card-body text-center account-profile">                                    
								  <img className="img-account-profile rounded-circle mb-2 img-thumbnail" src={(this.state.imgSrc1)?this.state.imgSrc1:base_url+'images/male.jpg'} alt="" />   
                                  <div className="small font-italic text-muted mb-4">JPG or PNG not larger than 100 KB</div>
                                  <div className="upload-grid">
                                    <img src={base_url+"images/upload-icon.png"} alt="" />		
                                    <input type="file" id="upload" name="father_image" className="btn btn-primary" placeholder="Upload new image" onChange={this.handleFileUpload1}/>  
                                    <label htmlFor="forDesign">Upload new image</label>
                                  </div>
								  {this.renderErrorFor('father_image')}    
                                </div>  
								{this.state.fileError1?     
								 <div className="alert alert-danger" style={{color:"brown"}}>  
									<strong>{this.state.fileMessgae1}</strong>       	  					   
								  </div>		
								 : null}   
                              </div>{/*/ card */}
                              <div className="card">
                                <div className="card-header"><h4 className="card-title">Upload Mother Image</h4></div>
                                <div className="card-body text-center account-profile">                                   
								  <img className="img-account-profile rounded-circle mb-2 img-thumbnail" src={(this.state.imgSrc2)?this.state.imgSrc2:base_url+'images/female.jpg'} alt="" />   
                                  <div className="small font-italic text-muted mb-4">JPG or PNG not larger than 100 KB</div>
                                  <div className="upload-grid">
                                    <img src={base_url+"images/upload-icon.png"} alt="" />   
                                    <input type="file" id="upload" name="mother_image" className="btn btn-primary" placeholder="Upload new image" onChange={this.handleFileUpload2}/>		
                                    <label htmlFor="forDesign">Upload new image</label>
                                  </div>
								  {this.renderErrorFor('mother_image')}     
                                </div>
								{this.state.fileError2?     
								 <div className="alert alert-danger" style={{color:"brown"}}>  
									<strong>{this.state.fileMessgae2}</strong>       	  					     
								  </div>		
								 : null}   
                              </div>{/*/ card */}
                            </div>{/*/ col-4 */}
                            <div className="col-xl-8 col-lg-8 col-md-8">
                              <div className="card">
                                <div className="card-body">
                                  <div className="basic-form form-own">
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
										<div className="form-group col-md-12">   
                                          <label>Parent Type</label>    
                                          <div className="form-check settings-form-radio">     
                                            <input className="form-check-input" type="radio" name="parent_type" value="new"  checked={this.state.selectedParent === "new"}  
											  onChange={this.onValueChange}		
											/>     
											<label className="form-check-label">New Parent</label>    
										    <input className="form-check-input" type="radio" name="parent_type" value="old"  checked={this.state.selectedParent === "old"}     
											  onChange={this.onValueChange}   
											/> <label className="form-check-label">Existing Parent</label>         
                                          </div>		  
                                        </div>
										{
										this.state.show ?(    
										<div className="form-group col-md-6">
                                          <label>Sibling Admission No.</label>
                                          <input type="text" className={`form-control ${this.hasErrorFor('sibling_admission_no') ? 'is-invalid' : ''}`} name="sibling_admission_no" value={(this.state.sibling_admission_no)?this.state.sibling_admission_no:''} onChange={this.handleAdmission}/>
										  <div style={style1}>   
											{
											  this.state.suggestions.map((item, index) => (  
												<div id={item.admission_no} data-f={item.father_name} data-m={item.mother_name} data-o={item.f_occupation} data-i={item.f_income} data-d={item.f_designation} data-mo={item.f_mobile} data-e={item.f_email} data-r={item.residence_no} key={item.id} style={style2} onClick={this.setAdmission}>{item.admission_no}-{item.student_name}-{item.className}-{item.father_name}</div>  		   		  
											  ))   		
											} 
										  </div> 	
										  {this.renderErrorFor('sibling_admission_no')}        	
                                        </div>)
										: "" 
										}   
										{
										this.state.show ?(  										
                                        <div className="form-group col-md-6">
                                          <label>Select Child</label>  
                                          <select className={`form-control ${this.hasErrorFor('sibling_no') ? 'is-invalid' : ''}`} name="sibling_no" value={(this.state.sibling_no)?this.state.sibling_no:''} onChange={this.handleChange}>
											  <option value="">--Select--</option>      
											  <option value="1">1st Child</option>			
											  <option value="2">2nd Child</option>
										  </select>
										  {this.renderErrorFor('sibling_no')}    
                                        </div>)    
										: "" 
										}
					  
                                        <div className="form-group col-md-12">
                                          <label>Father Name</label>
                                          <input type="text" className={`form-control ${this.hasErrorFor('father_name') ? 'is-invalid' : ''}`} placeholder="" name="father_name" value={(this.state.father_name)?this.state.father_name:''} onChange={this.handleChange} />
										  {this.renderErrorFor('father_name')}      
                                        </div>		
                                        <div className="form-group col-md-12">
                                          <label>Mother Name</label>
                                          <input type="text" className={`form-control ${this.hasErrorFor('mother_name') ? 'is-invalid' : ''}`} placeholder="" name="mother_name" value={(this.state.mother_name)?this.state.mother_name:''} onChange={this.handleChange} />
										  {this.renderErrorFor('mother_name')}      
                                        </div>
                                        <div className="form-group col-md-12">		
                                          <label>Father's Occupation</label>
                                          <input type="text" className={`form-control ${this.hasErrorFor('f_occupation') ? 'is-invalid' : ''}`} placeholder="" name="f_occupation" value={(this.state.f_occupation)?this.state.f_occupation:''} onChange={this.handleChange} />
										  {this.renderErrorFor('f_occupation')}      
                                        </div>
                                        <div className="form-group col-md-12"> 
                                          <label>Father's Annual Income</label>
                                          <input type="number" className={`form-control ${this.hasErrorFor('f_income') ? 'is-invalid' : ''}`} placeholder="" name="f_income" value={(this.state.f_income)?this.state.f_income:''} onChange={this.handleChange} /> 
										  {this.renderErrorFor('f_income')}      	
                                        </div>		
                                        <div className="form-group col-md-12">		
                                          <label>Designation</label>
                                          <input type="text" className={`form-control ${this.hasErrorFor('f_designation') ? 'is-invalid' : ''}`} placeholder="" name="f_designation" value={(this.state.f_designation)?this.state.f_designation:''} onChange={this.handleChange} />  
										  {this.renderErrorFor('f_designation')}        
                                        </div>
                                        <div className="form-group col-md-12">
                                          <label>Mobile No (For SMS)</label>
                                          <input type="number" className={`form-control ${this.hasErrorFor('f_mobile') ? 'is-invalid' : ''}`} placeholder="" name="f_mobile" value={(this.state.f_mobile)?this.state.f_mobile:''} onChange={this.handleChange} />
										  {this.renderErrorFor('f_mobile')}    
                                        </div>
                                        <div className="form-group col-md-12">
                                          <label>E-Mail ID</label>
                                          <input type="text" className={`form-control ${this.hasErrorFor('f_email') ? 'is-invalid' : ''}`} placeholder="" name="f_email" value={(this.state.f_email)?this.state.f_email:''} onChange={this.handleChange} />
										  {this.renderErrorFor('f_email')}         
                                        </div>
                                        <div className="form-group col-md-12">
                                          <label>Phone(Office/Res.)</label>
                                          <input type="number" className={`form-control ${this.hasErrorFor('residence_no') ? 'is-invalid' : ''}`} name="residence_no" value={(this.state.residence_no)?this.state.residence_no:''} onChange={this.handleChange}  />
										  {this.renderErrorFor('residence_no')}     
                                        </div>
                                      </div>{/*/ form-row */}   
									  <div className="profile-tab-btn text-right">
										   <input type="submit" name="saveonly" className="btn btn-primary btn-sm mx-1" value="Save"/>		
											<input type="submit" name="saveprint" className="btn btn-primary btn-sm mx-1" value="Save & Print"/>	   
									  </div>     
                                    </form>
                                  </div>
                                </div>{/*/ card-body */}
                              </div>{/*/ card */}
                            </div>{/*/ col-8 */}
                          </div>{/*/ row */}
                        </div>{/*/ settings-form */}
                      </div>
                    </div>{/*/ tab-pane */}
                    <div id="registration-details" className="tab-pane fade">
                      <div className="pt-3">
                        <div className="settings-form">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="card">
                                <div className="card-body">
                                  <div className="basic-form form-own">
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
										<label>Date of Registration</label>		
										 <input type="date" className={`form-control input-daterange-timepicker ${this.hasErrorFor('regis_date') ? 'is-invalid' : ''}`} name="registration_date" value={this.state.registration_date?this.state.registration_date:regis_date} onChange={this.handleChange} ref={this.input} />  
										{this.renderErrorFor('regis_date')} 	
									  </div>									  
									  <div className="form-group col-md-6">		
										<label>Registration No.</label>		
										<input type="text" className={`form-control ${this.hasErrorFor('regis_no') ? 'is-invalid' : ''}`} name="registration_no" ref={this.input} value={regis_no}  readOnly/>		
										{this.renderErrorFor('regis_no')} 						
									  </div>
									  <div className="form-group col-md-4">		
										  <label>Course Name</label>
											<select className={`form-control ${this.hasErrorFor('course_id') ? 'is-invalid' : ''}`} name="course_id" value={this.state.course_id?this.state.course_id:''} onChange={this.handleFee} ref={this.input}> 		
											  <option value="">Select Course</option>		
											  {this.state.courseData.map( (item, key) => {     
													return (
														<option key={key} value={item.courseId}>{item.courseName}</option>   
												  )
												})}	
											</select>
											{this.renderErrorFor('course_id')}  	
									   </div>
										<div className="form-group col-md-4">		
										  <label>Class Name</label>		
											<select className={`form-control ${this.hasErrorFor('class_id') ? 'is-invalid' : ''}`} name="class_id" value={this.state.class_id?this.state.class_id:''} onChange={this.handleChange}> 
											  <option value="">Select Class</option>		
											  {options}					
											</select>
											{this.renderErrorFor('class_id')}  	
										</div>
										<div className="form-group col-md-4">		
										<label>Registration Fee (In Rs.)</label>		
										<input type="number" step="0.01" className={`form-control ${this.hasErrorFor('regis_fee') ? 'is-invalid' : ''}`} name="registration_fee" value={this.state.registration_fee?this.state.registration_fee:regis_fee} onChange={this.handleChange} ref={this.input}/>  
										{this.renderErrorFor('regis_fee')} 							
										</div>		
										<div className="form-group col-md-6">		
										<label>Date of Interview</label>		
										 <input type="date" className={`form-control input-daterange-timepicker ${this.hasErrorFor('doi') ? 'is-invalid' : ''}`} name="interview_date" value={this.state.interview_date?this.state.interview_date:doi} onChange={this.handleChange} ref={this.input}/>  
										{this.renderErrorFor('doi')} 			
										</div> 										
										<div className="form-group col-md-6">		
										  <label>If School Bus Required.Then Select Station</label>		
											<select className={`form-control ${this.hasErrorFor('station_id') ? 'is-invalid' : ''}`} name="station_id" value={this.state.station_id?this.state.station_id:''} onChange={this.handleChange}> 
											  <option value="">Select Station</option>		
											  {this.state.stationData.map( (item, key) => {   		  
													return (
													<option key={key} value={item.stationId}>{item.stationName}</option>   
												  )
												})}	
											</select>
											{this.renderErrorFor('station_id')}  							
										</div>	 									  
									</div>									
									<div className="profile-tab-btn text-right">
									   <input type="submit" name="saveonly" className="btn btn-primary btn-sm mx-1" value="Save"/>		
										<input type="submit" name="saveprint" className="btn btn-primary btn-sm mx-1" value="Save & Print"/>	  
    							    </div> 		
									</form>
                                  </div>
                                </div>{/*/ card-body */}
                              </div>{/*/ card */}
                            </div>{/*/ col-8 */}
                          </div>{/*/ row */}
                        </div>{/*/ settings-form */}
                      </div>
                    </div>{/*/ tab-pane */} 		                    
                    {/*/ tab-content */}		
                  </div>{/*/ tab-content */}
                </div>{/*/ custom-tab-1 */}
              </div>{/*/ profile-tab */}
            </div>
          </div>{/*/ row */}
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
export default RegistrationAdd;   