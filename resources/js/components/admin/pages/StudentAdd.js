import React, { Component } from "react";	
import axios from 'axios'; 	
import Script from "@gumgum/react-script-tag";  
import Copyright from "../basic/Copyright";  
import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url=location.protocol+'//'+location.host+'/';		

class StudentAdd extends Component {
  constructor() {
    super();
    this.state = {
		showError: false,
		fileError:false,  
		fileError1:false,  
		fileError2:false,  
		showSuccess:false,
		isLoading:true,	 
		show_sibl:false,		
		show_trans:false, 
		show_root:false, 	
		show_vehicle:false, 
		show_cons:false,
		show_staff:false,     	
		fileMessgae:'',
		fileMessgae1:'',	
		fileMessgae2:'',
		imgSrc:'',
		imgSrc1:'',
		imgSrc2:'',  			
		student_img:'',
		father_img:'',
		mother_img:'',  	
		messgae:'',
		school_id:'',  
		gender:'male',	
		nationality:'indian',	
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
		insert_id2:'',   
		selectedParent :'new',
		selectedTransport:'no',
		selectedConcession:'no',		
		selectedStaff:'no',	 		
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
		errors:[],	
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
	this.changeClass = this.changeClass.bind(this);     
	this.changeSection = this.changeSection.bind(this);    
	this.handleTab = this.handleTab.bind(this);     
	this.handleCompulsary = this.handleCompulsary.bind(this);   	
	this.handleElective = this.handleElective.bind(this);   
	this.handleAdditional = this.handleAdditional.bind(this);   	
	this.handleTransaction = this.handleTransaction.bind(this);      	 
	this.handleFare = this.handleFare.bind(this);  
	this.handleRadio = this.handleRadio.bind(this);   
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
handleRadio(event) {
	const inpt=event.target.name;  		
	this.setState({ [inpt]:event.target.value }); 				   		
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
		this.setState({ selectedParent : event.target.value,show_sibl:true }); 	    
	}
	else
	{
		this.setState({ selectedParent : event.target.value,show_sibl:false });       
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
					course_first:id,
					classData: response.data.data ? response.data.data :[],
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
				classData:[]	   
			}); 
	   }   
		
	}  

changeClass(e){   
	const id = e.target.value;  
	const courseid = this.state.course_id; 	  
	
	if(id !='')
	{		
		this.setState({ class_id:id,class_first:id}); 
		
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
				additionalData: response.data.data.additional ? response.data.data.additional : [] ,
				compulsaries:response.data.data.compulsary?response.data.data.compulsary:[]  	  
			});		
			console.log(compulsaries,'compulsaries2');
		})
		.catch(error => {  	   
		   console.log(error.message); 	  		   
		})      
		
		axios.get(`${base_url}api`+`/studentmaster/getrollno/${courseid}/${id}`).then(response => {     			
			this.setState({  								
				roll_no:response.data.data?response.data.data[0].next_id:''     	  
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
				additionalData: response.data.data.additional ? response.data.data.additional : [],
				compulsaries:response.data.data.compulsary?response.data.data.compulsary:[]	   		 	  
			});
			console.log(compulsaries,'compulsaries3');
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
	
	const urlString = window.location.href;
    const url = new URL(urlString);   
	const regis_id = url.searchParams.get("register_id");	    
	const schoolid = this.state.school_id?this.state.school_id:'';   
	var tab_id=(this.state.tab_id)?(this.state.tab_id):''; 
	var insert_id=(this.state.insert_id)?(this.state.insert_id):'';    	
	
	if((tab_id=='subject_detail' || tab_id=='miscellaneous_detail') && insert_id=='')	
	{	
		this.setState({showError:true,message:'Please first add personal details or parents details or admission details'});	 	   
		
	}
	else
	{
		this.setState({showError:false,message:''});	
		
		const action=window.event.submitter.name;  
	
		const { admission_no,leaving_certificate,compulsory_subject,elective_subject,additional_subject,transportation,transport_concession,staffchild,management_concession,applicable,parent_type,admission_date,dob } = event.target;   		

		let s_name=(this.state.student_name)?this.state.student_name:'';  			
		let s_dob=(dob)?dob.value:'';    
		let s_gender=(this.state.gender)?this.state.gender:'';  	
		let s_nationality=(this.state.nationality)?this.state.nationality:'';     
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
		let s_father_name=(this.state.father_name)?this.state.father_name:'';   		
		let s_mother_name=(this.state.mother_name)?this.state.mother_name:''; 
		let s_f_occupation=(this.state.f_occupation)?this.state.f_occupation:'';    	
		let s_f_income=(this.state.f_income)?this.state.f_income:''; 
		let s_f_designation=(this.state.f_designation)?this.state.f_designation:''; 
		let s_f_mobile=(this.state.f_mobile)?this.state.f_mobile:'';  	
		let s_f_email=(this.state.f_email)?this.state.f_email:'';     
		let s_residence_no=(this.state.residence_no)?this.state.residence_no:'';  	
		let s_admission_date=(admission_date)?admission_date.value:'';    
		let s_admission_no=(admission_no)?admission_no.value:'';  	
		let s_course_id=(this.state.course_id )?this.state.course_id :'';    	
		let s_class_id=(this.state.class_id)?this.state.class_id:'';  	
		let s_section_id=(this.state.section_id)?this.state.section_id:''; 		
		let s_roll_no=(this.state.roll_no)?this.state.roll_no:'';  	
		let s_registration_no=(this.state.registration_no)?this.state.registration_no:'';     
		let s_board_roll_no=(this.state.board_roll_no)?this.state.board_roll_no:'';    	
		let s_leaving_certificate=(leaving_certificate)?leaving_certificate.value:''; 
		let s_course_first=(this.state.course_first)?this.state.course_first:'';  	
		let s_class_first=(this.state.class_first)?this.state.class_first:''; 		
		let s_compulsory_subject=(compulsory_subject)?compulsory_subject.value:''; 
		let s_elective_subject=(elective_subject)?elective_subject.value:'';  	
		let s_additional_subject=(additional_subject)?additional_subject.value:'';     
		let s_transportation=(transportation)?transportation.value:'';  	
		let s_station_id=(this.state.station_id)?this.state.station_id:'';    
		let s_route_id=(this.state.route_id)?this.state.route_id:'';  	
		let s_bus_no=(this.state.bus_no)?this.state.bus_no:''; 
		let s_transport_concession=(transport_concession)?transport_concession.value:'';  	
		let s_busfare=(this.state.busfare)?this.state.busfare:''; 
		let s_transconcession_amount=(this.state.transconcession_amount)?this.state.transconcession_amount:'';  	
		let s_totalfare=(this.state.totalfare)?this.state.totalfare:'';     
		let s_staffchild=(staffchild)?staffchild.value:'';  	
		let s_child_no=(this.state.child_no)?this.state.child_no:''; 
		let s_management_concession=(management_concession)?management_concession.value:'';    	
		let f_applicable=(applicable)?applicable.value:'';     
		let s_parent_type=(parent_type)?parent_type.value:'';    
		let s_sibling_admission_no=(this.state.sibling_admission_no)?this.state.sibling_admission_no:'';    
		let s_sibling_no=(this.state.sibling_no)?this.state.sibling_no:'';   
		let s_image=(this.state.student_img)?this.state.student_img:''; 	
		let f_image=(this.state.father_img)?this.state.father_img:''; 	
		let m_image=(this.state.mother_img)?this.state.mother_img:''; 			

		//let com_subjects =(this.state.compulsaries.length>0)?this.state.compulsaries.toString():'';
		let com_subjects = (this.state.compulsaryData.length > 0) 
  ? this.state.compulsaryData.map(item => item.subjectId).toString() 
  : '';
		
		let elec_subjects =(this.state.electives.length>0)?this.state.electives.toString():'';	
		let adt_subjects =(this.state.additionals.length>0)?this.state.additionals.toString():'';   
		
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
		fd.append("school_id",schoolid);	
		fd.append("pincode",s_pincode);	   
		fd.append("account_no",s_account_no);	
		fd.append("ifsc",s_ifsc);	  
		fd.append("branch_address",s_branch_address);
		fd.append("father_name",s_father_name);	 
		fd.append("mother_name",s_mother_name);	
		fd.append("f_occupation",s_f_occupation);	  
		fd.append("f_income",s_f_income);	
		fd.append("f_designation",s_f_designation);	 
		fd.append("f_mobile",s_f_mobile);	 
		fd.append("f_email",s_f_email);	
		fd.append("residence_no",s_residence_no);	  
		fd.append("admission_date",s_admission_date);
		fd.append("admission_no",s_admission_no);	 
		fd.append("course_id",s_course_id);	
		fd.append("class_id",s_class_id);	  
		fd.append("section_id",s_section_id);	
		fd.append("roll_no",s_roll_no);	 
		fd.append("registration_no",s_registration_no);	   
		fd.append("board_roll_no",s_board_roll_no);	  
		fd.append("leaving_certificate",s_leaving_certificate);	  
		fd.append("course_first",s_course_first);
		fd.append("class_first",s_class_first);	 
		fd.append("compulsory_subject",s_compulsory_subject);	
		fd.append("elective_subject",s_elective_subject);	  
		fd.append("additional_subject",s_additional_subject);	
		fd.append("transportation",s_transportation);	 
		fd.append("station_id",s_station_id);	 
		fd.append("route_id",s_route_id);	
		fd.append("bus_no",s_bus_no);	  
		fd.append("transport_concession",s_transport_concession);
		fd.append("busfare",s_busfare);  	 
		fd.append("transconcession_amount",s_transconcession_amount);	
		fd.append("totalfare",s_totalfare);	  
		fd.append("staffchild",s_staffchild);	
		fd.append("child_no",s_child_no);	 
		fd.append("management_concession",s_management_concession);	 			
		fd.append("applicable",f_applicable);	
		fd.append("insert_id",this.state.insert_id);	
		fd.append("insert_id2",this.state.insert_id2);	    
		fd.append("tab",this.state.tab_id);	 
		fd.append("registration_id",regis_id);	
		fd.append("s_image",s_image);	 
		fd.append("f_image",f_image);	 
		fd.append("m_image",m_image);	 	
		
		fd.append("student_image",this.state.student_image);  		
		fd.append("father_image",this.state.father_image);  
		fd.append("mother_image",this.state.mother_image);        
		
		fd.append("parent_type",s_parent_type);	  
		fd.append("sibling_admission_no",s_sibling_admission_no);	  		
		fd.append("sibling_no",s_sibling_no);	
		
		fd.append("compulsary",com_subjects);	
		fd.append("elective",elec_subjects);	  
		fd.append("additional",adt_subjects);  	
		fd.append("button",action);	
		
		axios.post(`${base_url}api`+'/studentmaster/add',fd)			
		.then(response => {   
			console.log(response.data);   			
			
			if (response.data.status === 'successed')   
			{		
				this.setState({ showError:false,showSuccess:true,message:response.data.message,insert_id:response.data.data.insert_id,errors:response.data.errors});	 

				 var receipt =response.data.data.print_id;    				 
				 if(receipt !='')  			
				 {
					let a = document.createElement("a"); 
					let url = base_url+'admissions/'+receipt; 							
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
				
				
				if(response.data.tab == 1){
					const element = document.getElementById('per_detail');
					if (element) {
					  element.click();
					}
				}

				if(response.data.tab == 2){
					const element = document.getElementById('par_detail');
					if (element) {
					  element.click();
					}
				}

				if(response.data.tab == 3){
					const element = document.getElementById('adm_detail');
					if (element) {
					  element.click();
					}
				}

				if(response.data.tab == 4){
					const element = document.getElementById('sub_detail');
					if (element) {
					  element.click();
					}
				}

				if(response.data.tab == 5){
					const element = document.getElementById('mis_detail');
					if (element) {
					  element.click();
					}
				}
			}
		})
		.catch(err => {  	   
		   console.log(err.message); 	
		   console.log(err.response.data);  
		}) 
		
	}		
    
}
componentDidMount() { 

	const urlString = window.location.href;
    const url = new URL(urlString);   
	const regis_id = url.searchParams.get("register_id");					

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

	if(regis_id !=null)			
	{
		axios.get(`${base_url}api`+`/registration/edit/${regis_id}`).then(response => {  
			
			const registerData=(response.data.data.data.length>0)?response.data.data.data:[];	
			const stateid=(registerData.length)>0?registerData[0].state_id:'';	
			const courseid=(registerData.length)>0?registerData[0].course_id:'';	
			const classid=(registerData.length)>0?registerData[0].class_id:'';	 			
			const stationid=(registerData.length)>0?registerData[0].station_id:'';	
			const parent=(registerData.length)>0?registerData[0].parent_type:'';	 	
			
			this.setState({ 
				student_name:(registerData.length)>0?registerData[0].student_name:'',		
				dob:(registerData.length)>0?registerData[0].dob:'',  
				imgSrc:(registerData.length)>0?base_url+'uploads/student_image/'+registerData[0].student_image:'',		
				student_img:(registerData.length)>0?registerData[0].student_image:'',	
				gender:(registerData.length)>0?registerData[0].gender:'',    	
				nationality:(registerData.length)>0?registerData[0].nationality:'',    
				caste:(registerData.length)>0?registerData[0].caste:'', 
				religion:(registerData.length)>0?registerData[0].religion:'', 
				marital_status:(registerData.length)>0?registerData[0].marital_status:'', 
				mobile:(registerData.length)>0?registerData[0].mobile:'', 
				blood_group:(registerData.length)>0?registerData[0].blood_group:'', 
				aadhar_no:(registerData.length)>0?registerData[0].aadhar_no:'', 
				permanent_address:(registerData.length)>0?registerData[0].permanent_address:'', 
				temporary_address:(registerData.length)>0?registerData[0].temporary_address:'', 
				state_id:stateid, 
				district_id:(registerData.length)>0?registerData[0].district_id:'', 
				pincode:(registerData.length)>0?registerData[0].pincode:'', 
				account_no:(registerData.length)>0?registerData[0].account_no:'', 
				ifsc:(registerData.length)>0?registerData[0].ifsc_no:'', 
				branch_address:(registerData.length)>0?registerData[0].branch_address:'', 
				email:(registerData.length)>0?registerData[0].email:'',  				
				imgSrc1:(registerData.length)>0?base_url+'uploads/father_image/'+registerData[0].father_image:'',	
				imgSrc2:(registerData.length)>0?base_url+'uploads/mother_image/'+registerData[0].mother_image:'',  	
				father_img:(registerData.length)>0?registerData[0].father_image:'',	
				mother_img:(registerData.length)>0?registerData[0].mother_image:'',  			
				selectedParent:(registerData.length)>0?registerData[0].parent_type:'',  
				sibling_admission_no:(registerData.length)>0?registerData[0].sibling_admission_no:'',  
				sibling_no:(registerData.length)>0?registerData[0].sibling_no:'',  
				father_name:(registerData.length)>0?registerData[0].father_name:'',  
				mother_name:(registerData.length)>0?registerData[0].mother_name:'',  
				f_occupation:(registerData.length)>0?registerData[0].f_occupation:'',     
				f_income:(registerData.length)>0?registerData[0].f_income:'',       
				f_designation:(registerData.length)>0?registerData[0].f_designation:'',     
				f_mobile:(registerData.length)>0?registerData[0].f_mobile:'',     
				f_email:(registerData.length)>0?registerData[0].f_email:'',     
				residence_no:(registerData.length)>0?registerData[0].residence_no:'',        
				course_id:courseid,  		
				class_id:classid,  		
				station_id:stationid,  					
				registration_no:(registerData.length)>0?registerData[0].registration_no:'',   					
			}); 
			
			if(stateid)
			{
				axios.get(`${base_url}api`+`/studentmaster/getdistrict/${stateid}`).then(response => {   					 
					this.setState({   
						districtData:response.data.data?response.data.data:[],
						show_trans:true,
						selectedTransport:'yes'			
					}); 
				})
				.catch(error => {  	   
				   console.log(error.message); 	
				})    
			}
			
			if(courseid)
			{
				axios.get(`${base_url}api`+`/class/getclassbycourse/${courseid}`).then(response => {    		
					this.setState({  
						classData:response.data.data?response.data.data:[]	 
					}); 
				})
				.catch(error => {  	   
				   console.log(error.message); 	   
				})   
			}
			
			if(courseid && classid)		
			{
				axios.get(`${base_url}api`+`/class/getsectionbyclassandcourse/${classid}/${courseid}`).then(response => {  
				    this.setState({  			  						
						sectionData:response.data.data?response.data.data:[]	 
					});   
				})
				.catch(error => {  	   
				   console.log(error.message); 	
				})     
				
				axios.get(`${base_url}api`+`/studentmaster/getclasswisesubjects/${courseid}/${classid}`).then(response => {
					this.setState({  			
						compulsaryData:response.data.data.compulsary?response.data.data.compulsary:[],	
						electiveData:response.data.data.elective?response.data.data.elective:[],	
						additionalData:response.data.data.additional?response.data.data.additional:[],
						compulsaries:response.data.data.compulsary?response.data.data.compulsary:[]	  
					});		

					console.log(compulsaries,'compulsaries1');
				})
				.catch(error => {  	   
				   console.log(error.message); 	  				   
				})      
			}

			if(parent=='old')	
			{
				this.setState({  			  						
					show_sibl:true   
				});  
			}
			
		})
		.catch(error => {  	   
		   console.log(error.message); 	
		})	  	
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
    
  }
render() {		
	  
const isLoad = this.state.isLoading;    			

if (isLoad) {  

//return null;  		
			 		
}   
	  
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
				<option key={index} value={item.id}>{item.registration_no}</option>      		
		  );  
	});   
	
	const currDate = new Date();		

	var day = ('0' + currDate.getDate()).slice(-2);
	var month = ('0' + (currDate.getMonth() + 1)).slice(-2);
	var year = currDate.getFullYear();		

    let date_of_admission= year+'-'+month+'-'+day;	
	let date_of_birth= year+'-'+month+'-'+day;	   

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
                <h4>Add Student</h4> 
              </div>
            </div>
            <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
              <ol className="breadcrumb">                 
			    <li><a href={`/student_registered`} className="btn bg-blue-soft text-blue">
					<i className="fa fa-user-plus"></i> Registered Students							     
				</a></li>		
				<li>&nbsp;</li>				
				<li><a href={`/student_list`} className="btn bg-blue-soft text-blue"><i className="fa fa-angle-double-left"></i> Back to Admitted Student List</a></li>	  
              </ol>
            </div>
          </div>
          {/* row */}
          <div className="row">
            <div className="col-xl-12 col-lg-12 col-md-12">
              <div className="profile-tab">
                <div className="custom-tab-1">
                  <ul className="nav nav-tabs">
                    <li className="nav-item"><a href="#personal-details" onClick={(e) => this.handleTab(e,'personal_detail')} data-toggle="tab" className="nav-link active show" id="per_detail">Personal Details</a></li>	
                    <li className="nav-item"><a href="#parents-details" onClick={(e) => this.handleTab(e,'parents_detail')}  data-toggle="tab" className="nav-link" id="par_detail">Parents Details</a></li>
                    <li className="nav-item"><a href="#admission-details" onClick={(e) => this.handleTab(e,'admission_detail')} data-toggle="tab" className="nav-link" id="adm_detail">Admission Details</a></li>
                    <li className="nav-item"><a href="#subjects-details" onClick={(e) => this.handleTab(e,'subject_detail')} data-toggle="tab" className="nav-link" id="sub_detail">Subjects Details</a></li>
                    <li className="nav-item"><a href="#settings" onClick={(e) => this.handleTab(e,'miscellaneous_detail')} data-toggle="tab" className="nav-link" id="mis_detail">Misc. Settings</a></li>	  			
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
                                          <label>Student Name <span style={{ color: 'red',fontWeight:'600',fontSize:'large' }}> *</span> </label>
                                          <input type="text" className={`form-control ${this.hasErrorFor('student_name') ? 'is-invalid' : ''}`} name="student_name" value={(this.state.student_name)?this.state.student_name:''} onChange={this.handleChange}/>		
										  {this.renderErrorFor('student_name')}     
                                        </div>  
                                        <div className="form-group col-md-6">		
                                          <label>Date of Birth</label>
                                          <div className="example">  
                                            <input type="date" className={`form-control input-daterange-timepicker ${this.hasErrorFor('dob') ? 'is-invalid' : ''}`} name="dob" value={(this.state.dob)?this.state.dob:date_of_birth} onChange={this.handleChange} ref={this.input}/>  
											{this.renderErrorFor('dob')}         
                                          </div>
                                        </div>
                                        <div className="form-group col-md-6">
                                          <label>Gender</label>
                                          <div className="form-check settings-form-radio">  
                                            <input className="form-check-input" type="radio" name="gender" value="male" checked={this.state.gender==='male'} onChange={this.handleRadio}/> 
                                            <label className="form-check-label">Male</label>  
                                            <input className="form-check-input" type="radio" name="gender" value="female" checked={this.state.gender==='female'} onChange={this.handleRadio} />  		
                                            <label className="form-check-label">Female</label>  
                                          </div>
                                        </div>
                                        <div className="form-group col-md-6">
                                          <label>Nationality</label>
                                          <div className="form-check settings-form-radio">
                                            <input className="form-check-input" type="radio" name="nationality" value="indian" checked={this.state.nationality==='indian'} onChange={this.handleRadio} />
                                            <label className="form-check-label">Indian</label>
                                            <input className="form-check-input" type="radio" name="nationality" value="non-indian" checked={this.state.nationality==='non-indian'} onChange={this.handleRadio}  />  		
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
                                          <label>Aadhar No. <span style={{ color: 'red',fontWeight:'600',fontSize:'large' }}> *</span></label>
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
										  <input type="button" className="btn btn-primary btn-sm mx-1" value="Save & Pay" />  
										  <input type="submit" name="saveonly" className="btn btn-primary btn-sm mx-1" value="Save Details" />		
										  <input type="submit" name="saveprint" className="btn btn-primary btn-sm mx-1" value="Save & Print Admission Form" />   			
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
											  onChange={this.onValueChange}	ref={this.input}	
											/>     
											<label className="form-check-label">New Parent</label>    
										    <input className="form-check-input" type="radio" name="parent_type" value="old"  checked={this.state.selectedParent === "old"}     
											  onChange={this.onValueChange} ref={this.input}  
											/> <label className="form-check-label">Existing Parent</label>         
                                          </div>		  
                                        </div>
										{
										this.state.show_sibl ?(    
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
										this.state.show_sibl ?(  										
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
                                          <label>Father Name <span style={{ color: 'red',fontWeight:'600',fontSize:'large' }}> *</span> </label>
                                          <input type="text" className={`form-control ${this.hasErrorFor('father_name') ? 'is-invalid' : ''}`} placeholder="" name="father_name" value={(this.state.father_name)?this.state.father_name:''} onChange={this.handleChange} />
										  {this.renderErrorFor('father_name')}      
                                        </div>		
                                        <div className="form-group col-md-12">
                                          <label>Mother Name <span style={{ color: 'red',fontWeight:'600',fontSize:'large' }}> *</span> </label>
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
                                          <label>Mobile No (For SMS) <span style={{ color: 'red',fontWeight:'600',fontSize:'large' }}> *</span></label>
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
										  <input type="button" className="btn btn-primary btn-sm mx-1" value="Save & Pay" />  
										  <input type="submit" name="saveonly" className="btn btn-primary btn-sm mx-1" value="Save Details" />		
										  <input type="submit" name="saveprint"	className="btn btn-primary btn-sm mx-1" value="Save & Print Admission Form" />   
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
                    <div id="admission-details" className="tab-pane fade">
                      <div className="pt-3">
                        <div className="settings-form">
                          <div className="row">
                            <div className="col-md-12">
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
                                          <label>Date of Admission</label>		
                                          <input type="date" className={`form-control ${this.hasErrorFor('admission_date') ? 'is-invalid' : ''}`} placeholder="" name="admission_date" value={(this.state.admission_date)?this.state.admission_date:date_of_admission} onChange={this.handleChange} ref={this.input}/>  
										  {this.renderErrorFor('admission_date')}     			      	
                                        </div>
                                        <div className="form-group col-md-6">
                                          <label>Admission No. <span style={{ color: 'red',fontWeight:'600',fontSize:'large' }}> *</span></label>
                                          <input type="text" className={`form-control ${this.hasErrorFor('admission_no') ? 'is-invalid' : ''}`} placeholder="" name="admission_no" ref={this.input}/> 
										   {this.renderErrorFor('admission_no')}        	
                                        </div>
                                        <div className="form-group col-md-4">
                                          <label>Course Name <span style={{ color: 'red',fontWeight:'600',fontSize:'large' }}> *</span></label>
                                          <select className={`form-control ${this.hasErrorFor('course_id') ? 'is-invalid' : ''}`} name="course_id" onChange={this.changeCourse} value={(this.state.course_id)?this.state.course_id:''}>
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
                                          <label>Class Name <span style={{ color: 'red',fontWeight:'600',fontSize:'large' }}> *</span></label>
                                          <select className={`form-control ${this.hasErrorFor('class_id') ? 'is-invalid' : ''}`} name="class_id" onChange={this.changeClass} value={(this.state.class_id)?this.state.class_id:''}>
										  <option value="">Select Class</option>
											  {this.state.classData.map( (item, key) => {		
												return (
											  <option key={key} value={item.classId}>{item.className}</option>
											  )     
											})}
											</select>
											{this.renderErrorFor('class_id')}     
                                        </div>
                                        <div className="form-group col-md-4">
                                          <label>Section Name </label>
                                          <select className={`form-control valid ${this.hasErrorFor('section_id') ? 'is-invalid' : ''}`} name="section_id" onChange={this.changeSection} value={(this.state.section_id)?this.state.section_id:''}>
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
                                        <div className="form-group col-md-4">
                                          <label>Student Roll No.</label>
                                          <input type="text" className={`form-control ${this.hasErrorFor('roll_no') ? 'is-invalid' : ''}`} name="roll_no" value={(this.state.roll_no)?this.state.roll_no:''} onChange={this.handleChange} placeholder="" />	
										  {this.renderErrorFor('roll_no')}   
                                        </div>
                                        <div className="form-group col-md-4">		
                                          <label>Registration No.</label>
                                          <input type="text" className={`form-control ${this.hasErrorFor('registration_no') ? 'is-invalid' : ''}`} name="registration_no" value={(this.state.registration_no)?this.state.registration_no:''} onChange={this.handleChange} placeholder="" />  
										  {this.renderErrorFor('registration_no')}     
                                        </div>
                                        <div className="form-group col-md-4">
                                          <label>Board Roll No.</label>
                                          <input type="text" className={`form-control ${this.hasErrorFor('board_roll_no') ? 'is-invalid' : ''}`} name="board_roll_no" value={(this.state.board_roll_no)?this.state.board_roll_no:''} onChange={this.handleChange} placeholder="" />  
										  {this.renderErrorFor('board_roll_no')}       
                                        </div>		
                                        <div className="form-group col-md-6">
                                          <label>Whether Submitted Original School Leaving Certificate(S.L.C)</label>
                                          <div className="form-check settings-form-radio">
                                            <input className="form-check-input" type="radio" name="leaving_certificate" value="yes" ref={this.input} defaultChecked />  
                                            <label className="form-check-label">Yes</label>
                                            <input className="form-check-input" type="radio" name="leaving_certificate" value="no" ref={this.input} />   
                                            <label className="form-check-label">No</label>
                                          </div>
                                        </div>
                                        <div className="form-group col-md-6">
                                          <label>Class of Student at the time of Admission*</label>
                                          <div className="form-row">
                                            <div className="form-group col-md-6">
                                              <select className={`form-control ${this.hasErrorFor('course_first') ? 'is-invalid' : ''}`} id="course_first" name="course_first" value={(this.state.course_first)?this.state.course_first:''} onChange={this.changeStudentCourse}>   
											  <option value="">Select Course</option>
											  {this.state.courseData.map( (item, key) => {     
												return (
											  <option key={key} value={item.courseId}>{item.courseName}</option>   
											  )
											})}  											  	
											  </select>
											  {this.renderErrorFor('course_first')}     
                                            </div>
                                            <div className="form-group col-md-6">
                                              <select className={`form-control ${this.hasErrorFor('class_first') ? 'is-invalid' : ''}`}  name="class_first" value={(this.state.class_first)?this.state.class_first:''} onChange={this.handleChange}>		
											  <option value="">Select Class</option>
											  {this.state.studentclassData.map( (item, key) => {		
												return (       
											  <option key={key} value={item.classId}>{item.className}</option>
											  )     
											})}
											  </select>   
											 {this.renderErrorFor('class_first')}    				
                                            </div>
                                          </div>
                                        </div>
                                      </div>{/*/ form-row */}
									  <div className="profile-tab-btn text-right">
										  <input type="button" className="btn btn-primary btn-sm mx-1" value="Save & Pay" />  
										  <input type="submit" name="saveonly" className="btn btn-primary btn-sm mx-1" value="Save Details" />		
										  <input type="submit" name="saveprint" className="btn btn-primary btn-sm mx-1" value="Save & Print Admission Form" />   
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
                    <div id="subjects-details" className="tab-pane fade">
                      <div className="pt-3">
                        <div className="settings-form">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="card">
                                <div className="card-body">
                                  <div className="basic-form form-own subjects-checkbox">
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
                                        <div className="form-group col-md-4 sc-red">		
                                          <h4>Compulsory Subjects</h4>		
										   {this.state.compulsaryData.map( (item, key) => {		
											  return (
												<div key={key} className="form-check form-checkbox">
													<div className="bg-padd">
													  <input type="checkbox"  checked={true}  className="form-check-input" name="compulsory_subject" onChange={this.handleCompulsary} value={item.subjectId} />  			
													  <label className="form-check-label" htmlFor="check1">{item.subjectName}</label>    
													</div>
												 </div>    
											  )     
											})}		
										  
                                        </div>{/*/ form-group */}
                                        <div className="form-group col-md-4 sc-green">
                                          <h4>Elective Subjects</h4>                                            
										  {this.state.electiveData.map( (item, key) => {		
											  return (
												<div key={key} className="form-check form-checkbox">
													<div className="bg-padd">
													  <input type="checkbox" className="form-check-input" name="elective_subject" onChange={this.handleElective} value={item.subjectId}/>    
													  <label className="form-check-label" htmlFor="check1">{item.subjectName}</label>		
													</div>
												</div>    
											  )     
											})}		
                                        </div>{/*/ form-group */}
                                        <div className="form-group col-md-4 sc-purple">
                                          <h4>Additional Subjects</h4>                                            
										  {this.state.additionalData.map( (item, key) => {		
											  return (   
												<div key={key} className="form-check form-checkbox">
													<div className="bg-padd">  
													  <input type="checkbox" className="form-check-input" name="additional_subject" onChange={this.handleAdditional} value={item.subjectId}/>  
													  <label className="form-check-label" htmlFor="check1">{item.subjectName}</label>	  
													</div>
												</div>    
											  )     
											})}		
                                        </div>{/*/ form-group */}
                                      </div>{/*/ form-row */}
									  <div className="profile-tab-btn text-right">
										  <input type="button" className="btn btn-primary btn-sm mx-1" value="Save & Pay" />  
										  <input type="submit" name="saveonly" className="btn btn-primary btn-sm mx-1" value="Save Details" />		
										  <input type="submit" name="saveprint" className="btn btn-primary btn-sm mx-1" value="Save & Print Admission Form" />   
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
                    <div id="settings" className="tab-pane fade">
                      <div className="pt-3">
                        <div className="settings-form">
                          <div className="row">
                            <div className="col-md-12">
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
                                          <h5>Transportation Required</h5>
                                          <div className="form-check settings-form-radio mrb-15">
                                            <input className="form-check-input" type="radio" name="transportation" value="yes" checked={this.state.selectedTransport === "yes"} onChange={this.handleTransport} ref={this.input}/>  
                                            <label className="form-check-label">Yes</label>
                                            <input className="form-check-input" type="radio" name="transportation" value="no" checked={this.state.selectedTransport === "no"} onChange={this.handleTransport} 
											ref={this.input} />   
                                            <label className="form-check-label">No</label>
                                          </div> 

													  
										  

                                          <div className="form-row"> 
                                             {
											this.state.show_trans ?(    
												<div className="form-group col-md-4">
												  <select className={`form-control selectpicker ${this.hasErrorFor('station_id') ? 'is-invalid' : ''}`} name="station_id" value={(this.state.station_id)?this.state.station_id:''} onChange={this.changeStation}>  
												  <option value="">--Select Station--</option>    
												  {this.state.stationData.map( (item, key) => {     
														return (
													  <option key={key} data-set={item.busFare} value={item.stationId}>{item.stationName}</option>  				
													  )   
													})}  	 												  	
												  </select>
												  {this.renderErrorFor('station_id')}      
												</div>    
											):"" 
										  } 
										  {
											this.state.show_root ?(    	  
                                            <div className="form-group col-md-4">
                                              <select className={`form-control valid ${this.hasErrorFor('route_id') ? 'is-invalid' : ''}`} name="route_id" value={(this.state.route_id)?this.state.route_id:''} onChange={this.changeRoute}>		
											  <option value="">--Select Route--</option>  	
											  {this.state.routeData.map( (item, key) => {       		  
													return (
												  <option key={key} value={item.routeId}>{item.routeNo}</option>   
												  )     
												})}         
											   </select> 
											   {this.renderErrorFor('route_id')}     
                                            </div>
											):"" 
										  }
										  {
											this.state.show_vehicle ?(    	
                                            <div className="form-group col-md-4">
                                              <select className={`form-control valid ${this.hasErrorFor('bus_no') ? 'is-invalid' : ''}`} id="bus_no" name="bus_no" value={(this.state.bus_no)?this.state.bus_no:''} onChange={this.handleChange}> 
											  <option value="">--Select Bus No--</option>
												{vehicleList}					
											  </select> 
											  {this.renderErrorFor('bus_no')} 	
                                            </div>  
											):"" 
										  }   
                                          </div>{/*/ form-row */}


										  { this.state.totalfare?	
										 <>
										 <div className="form-group">
										 <div className="col-md-8">
											
										  </div>

										  <div className="col-md-4">
											<label>Bus Fare :</label>{this.state.totalfare}
										  </div>
										  </div>
										 
										 </>		: ''}	
                                        </div>
									  {
										this.state.show_trans ?(    
                                        <div className="form-group col-md-12">
                                          <h5>Transportation Concession</h5>
                                          <div className="form-check settings-form-radio mrb-15">
                                            <input className="form-check-input" type="radio" name="transport_concession" value="yes" checked={this.state.selectedConcession === "yes"} onChange={this.handleConcession} ref={this.input}/>   
                                            <label className="form-check-label">Yes</label>
                                            <input className="form-check-input" type="radio" name="transport_concession" value="no" checked={this.state.selectedConcession === "no"} onChange={this.handleConcession} ref={this.input}/>    
                                            <label className="form-check-label">No</label>	
                                          </div>
										  {
											this.state.show_cons ?(    
                                          <div className="form-row"> 
                                            <div className="form-group col-md-4">
                                              <input type="text" id="busfare" name="busfare" className={`form-control text-box single-line valid ${this.hasErrorFor('busfare') ? 'is-invalid' : ''}`} placeholder="Station Fare" value={(this.state.busfare)?this.state.busfare:''} onChange={this.handleFare} readOnly/>
											  {this.renderErrorFor('busfare')}      	  
                                            </div>{/*/ form-group */}
                                            <div className="form-group col-md-4">		
                                              <input className={`form-control text-box single-line ${this.hasErrorFor('transconcession_amount') ? 'is-invalid' : ''}`} data-val="true" data-val-number="The field TransConcessionAmount must be a number." type="text" name="transconcession_amount" placeholder="Enter Concession Amount" value={(this.state.transconcession_amount)?this.state.transconcession_amount:''} onChange={this.handleTransaction} />   
											   {this.renderErrorFor('transconcession_amount')}    	   
                                            </div>{/*/ form-group */}  
                                            <div className="form-group col-md-4">
                                              <input type="text" id="totfare" name="totalfare" className={`form-control text-box single-line ${this.hasErrorFor('totalfare') ? 'is-invalid' : ''}`} placeholder="After Concession" value={(this.state.totalfare)?this.state.totalfare:''} onChange={this.handleChange} readOnly/>
											   {this.renderErrorFor('totalfare')}      
                                            </div>{/*/ form-group */}     
                                          </div>
										  ):"" 
										  }    
                                        </div>
										):"" 
										  }      
                                        <div className="form-group col-md-12">
                                          <h5>Staff Child</h5>
                                          <div className="form-check settings-form-radio mrb-15">
                                            <input className="form-check-input" type="radio" name="staffchild" value="yes" checked={this.state.selectedStaff === "yes"} onChange={this.handleStaff} ref={this.input}/>  
                                            <label className="form-check-label">Yes</label>      
                                            <input className="form-check-input" type="radio" name="staffchild" value="no" checked={this.state.selectedStaff === "no"} onChange={this.handleStaff} ref={this.input}/>  	
                                            <label className="form-check-label">No</label>  
                                          </div>
										   {
											this.state.show_staff ?(      			
                                          <div className="form-row"> 
                                            <div className="form-group col-md-4">  
                                              <select className={`form-control valid ${this.hasErrorFor('child_no') ? 'is-invalid' : ''}`} data-val="true" data-val-number="The field Select Child must be a number." id="staffChildNo" name="child_no" aria-invalid="false" aria-describedby="staffChildNo-error" value={(this.state.child_no)?this.state.child_no:''} onChange={this.handleChange}>
											  <option value="">Select Child</option><option value={1}>1st Child</option><option value={2}>2nd Child</option>  
											  </select>
											  {this.renderErrorFor('child_no')}      
                                            </div>{/*/ form-group */}
                                          </div>)
											: ""    
											}   
                                        </div>
                                        <div className="form-group col-md-12">
                                          <h5>Management Concession</h5>
                                          <div className="form-check settings-form-radio">
                                            <input className="form-check-input" type="radio" name="management_concession" value="yes" ref={this.input} />    
                                            <label className="form-check-label">Yes</label>
                                            <input className="form-check-input" type="radio" name="management_concession" value="no" ref={this.input} defaultChecked/>        
                                            <label className="form-check-label">No</label>			
                                          </div>
                                        </div>
                                        <div className="form-group col-md-12">
                                          <h5>Applicable</h5>
                                          <div className="form-check settings-form-radio">
                                            <input className="form-check-input" type="radio" name="applicable" value="new" ref={this.input} defaultChecked/>     
                                            <label className="form-check-label">New</label>
                                            <input className="form-check-input" type="radio" name="applicable" value="old" ref={this.input}/>   
                                            <label className="form-check-label">Old</label>	   	  
                                          </div>
                                        </div>
                                      </div>{/*/ form-row */}
									  <div className="profile-tab-btn text-right">
										  <input type="button" className="btn btn-primary btn-sm mx-1" value="Save & Pay" />  
										  <input type="submit" name="saveonly" className="btn btn-primary btn-sm mx-1" value="Save Details" />		
										  <input type="submit" name="saveprint" className="btn btn-primary btn-sm mx-1" value="Save & Print Admission Form" />   
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
export default StudentAdd;   