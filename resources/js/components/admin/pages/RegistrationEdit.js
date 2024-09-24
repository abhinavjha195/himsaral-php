import React, { Component } from "react";	
import axios from 'axios'; 	
import Script from "@gumgum/react-script-tag";  
import Copyright from "../basic/Copyright";  
import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url=location.protocol+'//'+location.host+'/';			

class RegistrationEdit extends Component {		
  constructor (props) {
	super(props);	    
    this.state = {
		showError: false,
		fileError:false,  
		fileError1:false,  
		fileError2:false,  
		showSuccess:false,
		isLoading:true,	
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
		feeData:[],		
		stationData:[],			
		districtData:[],			
		districtList:[],    		   
		studentData:[], 
		suggestions:[],   		   
		errors:[],	   	
		student_image:'',   		
		father_image:'',  
		mother_image:'',    			
		child_no:'',   		
		tab_id:'personal_detail',      
		station_id:'',   		
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
		selectedGender:'',			
		selectedNation:'', 
		selectedParent:'',			
		show:false,   	 		
    };
	
    this.formSubmit = this.formSubmit.bind(this); 
	this.handleChange = this.handleChange.bind(this);      	
	this.handleSelection = this.handleSelection.bind(this);      	   	 
	this.handleParent = this.handleParent.bind(this);       	
	this.handleAdmission = this.handleAdmission.bind(this);  
	this.setAdmission = this.setAdmission.bind(this);      	
	  
	this.handleFileUpload1 = this.handleFileUpload1.bind(this);      
	this.handleFileUpload2 = this.handleFileUpload2.bind(this);     
	this.handleFilePreview = this.handleFilePreview.bind(this);        
    this.changeDistrict = this.changeDistrict.bind(this);	
	this.changeCourse = this.changeCourse.bind(this);    
	this.handleFee = this.handleFee.bind(this);          	
	this.handleTab = this.handleTab.bind(this);     
	 
	this.handleNation = this.handleNation.bind(this);     	
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
handleParent(event) {
	this.setState({ selectedParent : event.target.value }); 	  		
}    
  
handleFee(e) {			
				
		const id = e.target.value; 
		const course = e.target.name;   			
	   
	   if(id >0)
	   {
		   axios.get(`${base_url}api`+`/registration/getclassfee/${id}`).then(response => {   
			const feeArr=response.data.data?response.data.data:[];	
			
			this.setState({
					[course]:id, 	
					feeData: feeArr,
					registration_fee:(feeArr.length>0)?feeArr[0].amount:0.0      	
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
				feeData:[],
				classData:[],
				registration_fee:0.0      	
			}); 
	   }   
		
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

handleSelection(event) {
	this.setState({ selectedGender : event.target.value }); 	   		
} 
handleNation(event) {
	this.setState({ selectedNation : event.target.value }); 				   		
}           


  
 
        
changeCourse(e) {			
				
		this.setState({
			 [event.target.name]: event.target.value   					
		});	
		
		const id = e.target.value;  	
	   
	   if(id >0)
	   {
		   axios.get(`${base_url}api`+`/class/getclassbycourse/${id}`).then(response => {    		
				this.setState({  			 					  
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
					classData:[]	   
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

hasErrorFor (field) {
	  return !!this.state.errors[field]					
   }
   renderErrorFor (field) {
	  if (this.hasErrorFor(field)) {		
		return ( <span className='invalid-feedback'> <strong>{this.state.errors[field][0]}</strong> </span> )
	  }
   }        

  formSubmit(event){
    event.preventDefault();    
	
	const urlString = window.location.href;
    const url = new URL(urlString);   
    const lastSegment = url.pathname.split('/').pop();	
	const id = lastSegment;  	

const { student_name,dob,gender,nationality,caste,religion,marital_status,mobile,email,blood_group,aadhar_no,permanent_address,
temporary_address,state_id,district_id,pincode,account_no,ifsc,branch_address,father_name,mother_name,f_occupation,f_income,
f_designation,f_mobile,f_email,residence_no,admission_date,admission_no,course_id,class_id,section_id,roll_no,registration_no,
registration_date,interview_date,registration_fee,station_id,parent_type,sibling_admission_no,sibling_no } = event.target;   

	let s_name=(student_name)?student_name.value:'';  	
	let s_dob=(dob)?dob.value:''; 
	let s_gender=(gender)?gender.value:'';  	
	let s_nationality=(nationality)?nationality.value:'';     
	let s_caste=(caste)?caste.value:'';  	
	let s_religion=(religion)?religion.value:''; 
	let s_marital_status=(marital_status)?marital_status.value:'';  	
	let s_mobile=(mobile)?mobile.value:''; 
	let s_email=(email)?email.value:''; 
	let s_blood_group=(blood_group)?blood_group.value:'';  	
	let s_aadhar_no=(aadhar_no)?aadhar_no.value:'';     
	let s_permanent_address=(permanent_address)?permanent_address.value:'';  	
	let s_temporary_address=(temporary_address)?temporary_address.value:'';    
	let s_state_id=(state_id)?state_id.value:'';  	
	let s_district_id=(district_id)?district_id.value:''; 
	let s_pincode=(pincode)?pincode.value:'';  	
	let s_account_no=(account_no)?account_no.value:''; 
	let s_ifsc=(ifsc)?ifsc.value:'';  	
	let s_branch_address=(branch_address)?branch_address.value:'';     
	let s_father_name=(father_name)?father_name.value:'';  
	
	let s_mother_name=(mother_name)?mother_name.value:''; 
	let s_f_occupation=(f_occupation)?f_occupation.value:'';    	
	let s_f_income=(f_income)?f_income.value:''; 
	let s_f_designation=(f_designation)?f_designation.value:''; 
	let s_f_mobile=(f_mobile)?f_mobile.value:'';  	
	let s_f_email=(f_email)?f_email.value:'';     
	let s_residence_no=(residence_no)?residence_no.value:'';  	
	let s_admission_date=(admission_date)?admission_date.value:'';    
	let s_admission_no=(admission_no)?admission_no.value:'';  	
	let s_course_id=(course_id)?course_id.value:'';    	
	let s_class_id=(class_id)?class_id.value:'';  	
	let s_section_id=(section_id)?section_id.value:''; 
	let s_roll_no=(roll_no)?roll_no.value:'';  	
	let s_registration_no=(registration_no)?registration_no.value:'';	
	let s_registration_date=(registration_date)?registration_date.value:'';		
	let s_doi=(interview_date)?interview_date.value:'';  	  	
	let s_station_id=(station_id)?station_id.value:'';    
	let s_registration_fee=(registration_fee)?registration_fee.value:'';  	   
	let s_parent_type=(parent_type)?parent_type.value:'';    
	let s_sibling_admission_no=(sibling_admission_no)?sibling_admission_no.value:'';    
	let s_sibling_no=(sibling_no)?sibling_no.value:'';     
	
    let fd = new FormData()
    
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
	fd.append("father_name",s_father_name);	 
	fd.append("mother_name",s_mother_name);	
	fd.append("f_occupation",s_f_occupation);	  
	fd.append("f_income",s_f_income);	
	fd.append("f_designation",s_f_designation);	 
	fd.append("f_mobile",s_f_mobile);	 
	fd.append("f_email",s_f_email);	
	fd.append("residence_no",s_residence_no);	  
	fd.append("admission_date",s_admission_date);		
	fd.append("regis_date",s_registration_date); 	
	fd.append("doi",s_doi);	   	
	fd.append("admission_no",s_admission_no);	 
	fd.append("course_id",s_course_id);	
	fd.append("class_id",s_class_id);	  
	fd.append("regis_fee",s_registration_fee);				
	fd.append("roll_no",s_roll_no);	 
	fd.append("regis_no",s_registration_no);	 			
	fd.append("station_id",s_station_id);	 
	fd.append("tab",this.state.tab_id);	 
	
	fd.append("student_image",this.state.student_image);  		
	fd.append("father_image",this.state.father_image);  
	fd.append("mother_image",this.state.mother_image);        
	
	fd.append("parent_type",s_parent_type);	  
	fd.append("sibling_admission_no",s_sibling_admission_no);	  		
	fd.append("sibling_no",s_sibling_no);	 	
	
	axios.post(`${base_url}api`+`/registration/update/${id}`,fd).then(response => { 	      
		console.log(response.data);   		
		if (response.data.status === 'successed')   
		{		
			this.setState({ showError:false,showSuccess:true,message:response.data.message,errors:response.data.errors});	   
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

	   
	axios.get(`${base_url}api`+`/registration/edit/${id}`).then(response => {     
	 console.log(response.data); 	 
	const studentArr=response.data.data.data?response.data.data.data:[]; 	
	
	this.setState({  			 			
			studentData:studentArr,  
			registration_fee:(studentArr.length>0)?studentArr[0].fee:0.0,  	
			districtData:response.data.data.districts?response.data.data.districts:[],          	 
			classData:response.data.data.classess?response.data.data.classess:[],          			    	
		});
	})
	.catch(err => {  	   
	   console.log(err.message); 	
	   console.log(err.response.data);  	
	   	
    })    

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
	  
	const studentArr=(this.state.studentData.length>0)?this.state.studentData:[];    	
	const stateArr = (this.state.stateData.length>0)?this.state.stateData:[];  
	const districtArr = (this.state.districtData.length>0)?this.state.districtData:[];  
	const classArr = (this.state.classData.length>0)?this.state.classData:[];     		
	
	let s_name=(this.state.student_name)?this.state.student_name:(this.state.studentData.length>0)?studentArr[0].student_name:'';  
	let s_image=(this.state.imgSrc)?this.state.imgSrc:(this.state.studentData.length>0)?base_url+'uploads/student_image/'+studentArr[0].student_image:base_url+'images/student.jpg';  

	let s_dob=(this.state.dob)?this.state.dob:(this.state.studentData.length>0)?studentArr[0].dob:'0000-00-00';    	
	let s_gender=(this.state.selectedGender)?this.state.selectedGender:(this.state.studentData.length>0)?studentArr[0].gender:'';    	         
	let s_nationality=(this.state.selectedNation)?this.state.selectedNation:(this.state.studentData.length>0)?studentArr[0].nationality:'';   
	let s_caste=(this.state.caste)?this.state.caste:(this.state.studentData.length>0)?studentArr[0].caste:'';       
	let s_religion=(this.state.religion)?this.state.religion:(this.state.studentData.length>0)?studentArr[0].religion:'';     
	let s_marital=(this.state.marital_status)?this.state.marital_status:(this.state.studentData.length>0)?studentArr[0].marital_status:'';   
	
	let s_mobile=(this.state.mobile)?this.state.mobile:(this.state.studentData.length>0)?studentArr[0].mobile:'';   
	let s_email=(this.state.email)?this.state.email:(this.state.studentData.length>0)?studentArr[0].email:'';     
	let s_group=(this.state.blood_group)?this.state.blood_group:(this.state.studentData.length>0)?studentArr[0].blood_group:'';     

	let s_aadhar=(this.state.aadhar_no)?this.state.aadhar_no:(this.state.studentData.length>0)?studentArr[0].aadhar_no:'';
	let s_permanent=(this.state.permanent_address)?this.state.permanent_address:(this.state.studentData.length>0)?studentArr[0].permanent_address:'';    
	let s_temporary=(this.state.temporary_address)?this.state.temporary_address:(this.state.studentData.length>0)?studentArr[0].temporary_address:'';  
	let s_state=(this.state.state_id)?this.state.state_id:(this.state.studentData.length>0)?studentArr[0].state_id:'';  
	let s_district=(this.state.district_id)?this.state.district_id:(this.state.studentData.length>0)?studentArr[0].district_id:'';  		

	let s_pincode=(this.state.pincode)?this.state.pincode:(this.state.studentData.length>0)?studentArr[0].pincode:'';    	
	let s_account=(this.state.account_no)?this.state.account_no:(this.state.studentData.length>0)?studentArr[0].account_no:''; 
	let s_ifsc=(this.state.ifsc)?this.state.ifsc:(this.state.studentData.length>0)?studentArr[0].ifsc_no:'';   
	let s_branch=(this.state.branch_address)?this.state.branch_address:(this.state.studentData.length>0)?studentArr[0].branch_address:''; 
	
	let s_parent_type=(this.state.selectedParent)?this.state.selectedParent:(this.state.studentData.length>0)?studentArr[0].parent_type:'';   
	let s_sibling_admission_no=(this.state.sibling_admission_no)?this.state.sibling_admission_no:(this.state.studentData.length>0)?studentArr[0].sibling_admission_no:'';   
	let s_sibling_no=(this.state.sibling_no)?this.state.sibling_no:(this.state.studentData.length>0)?studentArr[0].sibling_no:''; 
	let s_father_name=(this.state.father_name)?this.state.father_name:(this.state.studentData.length>0)?studentArr[0].father_name:'';     
	let s_mother_name=(this.state.mother_name)?this.state.mother_name:(this.state.studentData.length>0)?studentArr[0].mother_name:'';  
	let f_occupation=(this.state.f_occupation)?this.state.f_occupation:(this.state.studentData.length>0)?studentArr[0].f_occupation:'';  
	let f_income=(this.state.f_income)?this.state.f_income:(this.state.studentData.length>0)?studentArr[0].f_income:'';   
	let f_designation=(this.state.f_designation)?this.state.f_designation:(this.state.studentData.length>0)?studentArr[0].f_designation:'';
	let f_mobile=(this.state.f_mobile)?this.state.f_mobile:(this.state.studentData.length>0)?studentArr[0].f_mobile:'';  
	let f_email=(this.state.f_email)?this.state.f_email:(this.state.studentData.length>0)?studentArr[0].f_email:'';  
	let f_residence_no=(this.state.residence_no)?this.state.residence_no:(this.state.studentData.length>0)?studentArr[0].residence_no:'';   

	let f_image=(this.state.imgSrc1)?this.state.imgSrc1:(this.state.studentData.length>0)?base_url+'uploads/father_image/'+studentArr[0].father_image:base_url+'images/male.jpg';     

	let m_image=(this.state.imgSrc2)?this.state.imgSrc2:(this.state.studentData.length>0)?base_url+'uploads/mother_image/'+studentArr[0].mother_image:base_url+'images/female.jpg';  		

	let s_admission_date=(this.state.admission_date)?this.state.admission_date:(this.state.studentData.length>0)?studentArr[0].admission_date:'';  
	let s_admission_no=(this.state.admission_no)?this.state.admission_no:(this.state.studentData.length>0)?studentArr[0].admission_no:'';   				
	
	let s_course_id=(this.state.course_id)?this.state.course_id:(this.state.studentData.length>0)?studentArr[0].course_id:'';  
	let s_class_id=(this.state.class_id)?this.state.class_id:(this.state.studentData.length>0)?studentArr[0].class_id:'';    
	
	let s_roll_no=(this.state.roll_no)?this.state.roll_no:(this.state.studentData.length>0)?studentArr[0].roll_no:'';    
	let s_registration_no=(this.state.registration_no)?this.state.registration_no:(this.state.studentData.length>0)?studentArr[0].registration_no:'';     
	
	
	let s_station_id=(this.state.station_id)?this.state.station_id:(this.state.studentData.length>0)?studentArr[0].station_id:'';    	  
	
	let regis_date=(this.state.studentData.length>0)?this.state.studentData[0].registration_date:'';  		
	let doi=(this.state.studentData.length>0)?this.state.studentData[0].interview_date:'';    

	let regis_fee=(this.state.feeData.length>0)?this.state.feeData[0].amount:0.0;       

	const options = [];						

	if(this.state.feeData.length>0)  
	{ 		
		let id_arr=this.state.feeData[0].id_list.split(',');	  
		let name_arr=this.state.feeData[0].name_list.split(',');	
		for (let i=0;i<id_arr.length;i++) {	
			options.push(<option key={id_arr[i]} value={id_arr[i]}>{name_arr[i]}</option>)
		}	
	} 
	else 
	{ 		
		classArr.forEach((item,i) => { 		 
			options.push(<option key={i} value={item.classId}>{item.className}</option>);   				  
		});  	 
	}		
	
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
                <h4>Edit Registered Student</h4>			
              </div>
            </div>
            <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
              <ol className="breadcrumb">                 
				<li><a href={`/registration_list`} className="btn bg-blue-soft text-blue">
				 <i className="fa fa-angle-double-left"></i> Back to Registration List</a>
				</li>  	  
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
                                  <img className="img-account-profile rounded-circle mb-2 img-thumbnail" src={s_image} alt="" />     
                                  <div className="small font-italic text-muted mb-4">JPG or PNG not larger than 100 KB</div>
                                  <div className="upload-grid">     
                                    <img src={`${base_url}images/upload-icon.png`} alt="" />   
                                    <input type="file" id="upload" name="student_image" className="btn btn-primary" placeholder="Upload new image" onChange={this.handleFilePreview} />  
                                    <label htmlFor="forDesign">Upload new image</label>   
								  </div>
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
                                          <input type="text" className={`form-control ${this.hasErrorFor('student_name') ? 'is-invalid' : ''}`} name="student_name" value={s_name} onChange={this.handleChange}/>
										  {this.renderErrorFor('student_name')}        	
                                        </div>  
                                        <div className="form-group col-md-6">		
                                          <label>Date of Birth</label>
                                          <div className="example">    
                                            <input type="date" className={`form-control input-daterange-timepicker ${this.hasErrorFor('dob') ? 'is-invalid' : ''}`} name="dob" value="10/10/2022 2:00 PM" value={s_dob} onChange={this.handleChange} />  
											{this.renderErrorFor('dob')}    
                                          </div>			
                                        </div>
                                        <div className="form-group col-md-6">
                                          <label>Gender</label>
                                          <div className="form-check settings-form-radio">  
                                            <input className="form-check-input" type="radio" name="gender" checked={s_gender==='male'} value="male" onChange={this.handleSelection}/>    
                                            <label className="form-check-label">Male</label>  
                                            <input className="form-check-input" type="radio" name="gender" checked={s_gender==='female'} value="female" onChange={this.handleSelection}/>  		   
                                            <label className="form-check-label">Female</label>  		
                                          </div>		
                                        </div>
                                        <div className="form-group col-md-6">
                                          <label>Nationality</label>
                                          <div className="form-check settings-form-radio">
                                            <input className="form-check-input" type="radio" name="nationality" value="indian" checked={s_nationality==='indian'} onChange={this.handleNation}/>       
                                            <label className="form-check-label">Indian</label>
                                            <input className="form-check-input" type="radio" name="nationality" value="non-indian" checked={s_nationality==='non-indian'} onChange={this.handleNation}/>
											<label className="form-check-label">Non-Indian</label>   
                                          </div>
                                        </div>
                                        <div className="form-group col-md-6">	
                                          <label>Caste</label>
                                          <select className={`form-control ${this.hasErrorFor('caste') ? 'is-invalid' : ''}`} name="caste" value={s_caste} onChange={this.handleChange}>   
											  <option value="0">--Select--</option>  
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
                                          <select className={`form-control ${this.hasErrorFor('religion') ? 'is-invalid' : ''}`} name="religion" value={s_religion} onChange={this.handleChange}>			
											  <option value="0">--Select--</option>			  
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
                                          <select className={`form-control ${this.hasErrorFor('marital_status') ? 'is-invalid' : ''}`} name="marital_status" value={s_marital} onChange={this.handleChange}>			
											  <option value="0">--Select--</option>    
											  <option value="un-married">Un-Married</option>  
											  <option value="married">Married</option>
										  </select>
										  {this.renderErrorFor('marital_status')}             	      
                                        </div>
                                        <div className="form-group col-md-6">		
                                          <label>Mobile No.</label>
                                          <input type="number" className={`form-control ${this.hasErrorFor('mobile') ? 'is-invalid' : ''}`} placeholder="" value={s_mobile} name="mobile" onChange={this.handleChange} />
										  {this.renderErrorFor('mobile')}        	
                                        </div>
                                        <div className="form-group col-md-4">
                                          <label>Email</label>
                                          <input type="text" className={`form-control ${this.hasErrorFor('email') ? 'is-invalid' : ''}`} placeholder="" value={s_email} name="email" onChange={this.handleChange} /> 
										  {this.renderErrorFor('email')}      	
                                        </div>
                                        <div className="form-group col-md-4">
                                          <label>Blood Group</label>
                                          <input type="text" className={`form-control ${this.hasErrorFor('blood_group') ? 'is-invalid' : ''}`} placeholder="" value={s_group} name="blood_group" onChange={this.handleChange} />   
										  {this.renderErrorFor('blood_group')}  
                                        </div>
                                        <div className="form-group col-md-4">
                                          <label>Aadhar No.</label>
                                          <input type="text" className={`form-control ${this.hasErrorFor('aadhar_no') ? 'is-invalid' : ''}`} placeholder="" value={s_aadhar} name="aadhar_no" onChange={this.handleChange} /> 
										  {this.renderErrorFor('aadhar_no')}   	
                                        </div>		
                                        <div className="form-group col-md-6">
                                          <label>Permanent Address</label>
                                          <textarea className={`form-control ${this.hasErrorFor('permanent_address') ? 'is-invalid' : ''}`}  placeholder="" value={s_permanent} name="permanent_address" onChange={this.handleChange} />	
										  {this.renderErrorFor('permanent_address')}   
                                        </div>
                                        <div className="form-group col-md-6">
                                          <label>Temporary Address</label>
                                          <textarea className={`form-control ${this.hasErrorFor('temporary_address') ? 'is-invalid' : ''}`} placeholder="" value={s_temporary} name="temporary_address" onChange={this.handleChange} /> 
										  {this.renderErrorFor('temporary_address')}        	  	  	
                                        </div>
                                        <div className="form-group col-md-6">
                                          <label>State</label>
                                          <select className={`form-control ${this.hasErrorFor('state_id') ? 'is-invalid' : ''}`} name="state_id" value={s_state} onChange={this.changeDistrict}>    
										  <option value="0">--Select--</option>  
										  {stateList}  
										  </select>
										  {this.renderErrorFor('state_id')}      
                                        </div>
                                        <div className="form-group col-md-6">
                                          <label>District</label>
                                          <select className={`form-control ${this.hasErrorFor('district_id') ? 'is-invalid' : ''}`} name="district_id" value={s_district} onChange={this.handleChange}>
											<option value="0">--Select--</option>	
											{districtList} 					
										  </select>
										  {this.renderErrorFor('district_id')}    
                                        </div>
                                        <div className="form-group col-md-4">
                                          <label>Pincode</label>
                                          <input className={`form-control ${this.hasErrorFor('pincode') ? 'is-invalid' : ''}`} type="number" value={s_pincode} name="pincode" onChange={this.handleChange} />{this.renderErrorFor('pincode')}     		
                                        </div>
                                        <div className="form-group col-md-4">     
                                          <label>Account No.</label>
                                          <input className={`form-control ${this.hasErrorFor('account_no') ? 'is-invalid' : ''}`} type="text" value={s_account} name="account_no" onChange={this.handleChange} />	
										  {this.renderErrorFor('account_no')}       	
                                        </div>  
                                        <div className="form-group col-md-4">
                                          <label>IFSC Code</label>
                                          <input className={`form-control ${this.hasErrorFor('ifsc') ? 'is-invalid' : ''}`}  type="text" value={s_ifsc} name="ifsc" onChange={this.handleChange}  />  
										  {this.renderErrorFor('ifsc')}      	
                                        </div>
                                        <div className="form-group col-md-12">
                                          <label>Branch Address</label>
                                          <textarea className={`form-control ${this.hasErrorFor('branch_address') ? 'is-invalid' : ''}`} placeholder="" value={s_branch} name="branch_address" onChange={this.handleChange} /> 
										  {this.renderErrorFor('branch_address')}      	
                                        </div>  		
                                      </div>{/*/ form-row */}
									   <div className="profile-tab-btn text-right"> 										  
										<input type="submit" className="btn btn-primary btn-sm mx-1" value="Save Details" />		
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
								  <img className="img-account-profile rounded-circle mb-2 img-thumbnail" src={f_image} alt="" />   
                                  <div className="small font-italic text-muted mb-4">JPG or PNG not larger than 100 KB</div>
                                  <div className="upload-grid">                                     
									<img src={`${base_url}images/upload-icon.png`} alt="" />   
                                    <input type="file" id="upload" name="father_image" className="btn btn-primary" placeholder="Upload new image" onChange={this.handleFileUpload1}/>  
                                    <label htmlFor="forDesign">Upload new image</label>
                                  </div>
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
								  <img className="img-account-profile rounded-circle mb-2 img-thumbnail" src={m_image} alt="" />   
                                  <div className="small font-italic text-muted mb-4">JPG or PNG not larger than 100 KB</div>
                                  <div className="upload-grid">                                      
									<img src={`${base_url}images/upload-icon.png`} alt="" /> 	
                                    <input type="file" id="upload" name="mother_image" className="btn btn-primary" placeholder="Upload new image" onChange={this.handleFileUpload2}/>		
                                    <label htmlFor="forDesign">Upload new image</label>
                                  </div>
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
                                            <input className="form-check-input" type="radio" name="parent_type" value="new"  checked={s_parent_type === "new"}  
											  onChange={this.handleParent}							
											/>     
											<label className="form-check-label">New Parent</label>    
										    <input className="form-check-input" type="radio" name="parent_type" value="old"  checked={s_parent_type === "old"}     
											  onChange={this.handleParent}   
											/> <label className="form-check-label">Existing Parent</label>         
                                          </div>		  
                                        </div>
										{
										(s_parent_type=='old')?(    
										<div className="form-group col-md-6">
                                          <label>Sibling Admission No.</label>
                                          <input type="text" className={`form-control ${this.hasErrorFor('sibling_admission_no') ? 'is-invalid' : ''}`} name="sibling_admission_no" value={s_sibling_admission_no} onChange={this.handleAdmission}/> 
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
										(s_parent_type=='old')?(  										
                                        <div className="form-group col-md-6">
                                          <label>Select Child</label>  
                                          <select className={`form-control ${this.hasErrorFor('sibling_no') ? 'is-invalid' : ''}`} name="sibling_no" value={s_sibling_no} onChange={this.handleChange}>		
											  <option value="0">--Select--</option>    
											  <option value="1">1st Child</option>			
											  <option value="2">2nd Child</option>
										  </select>
										   {this.renderErrorFor('sibling_no')}   
                                        </div>)    
										: "" 
										}  					  
                                        <div className="form-group col-md-12">
                                          <label>Father Name</label>
                                          <input type="text" className={`form-control ${this.hasErrorFor('father_name') ? 'is-invalid' : ''}`} placeholder="" name="father_name" value={s_father_name} onChange={this.handleChange} />
										  {this.renderErrorFor('father_name')}     
                                        </div>		
                                        <div className="form-group col-md-12">
                                          <label>Mother Name</label>
                                          <input type="text" className={`form-control ${this.hasErrorFor('mother_name') ? 'is-invalid' : ''}`} placeholder="" name="mother_name" value={s_mother_name} onChange={this.handleChange} />	
										   {this.renderErrorFor('mother_name')}   	
                                        </div>
                                        <div className="form-group col-md-12">		
                                          <label>Father's Occupation</label>
                                          <input type="text" className={`form-control ${this.hasErrorFor('f_occupation') ? 'is-invalid' : ''}`} placeholder="" name="f_occupation" value={f_occupation} onChange={this.handleChange} />
										  {this.renderErrorFor('f_occupation')}     	
                                        </div>
                                        <div className="form-group col-md-12"> 
                                          <label>Father's Annual Income</label>
                                          <input type="text" className={`form-control ${this.hasErrorFor('f_income') ? 'is-invalid' : ''}`} placeholder="" name="f_income" value={f_income} onChange={this.handleChange} /> 
										  {this.renderErrorFor('f_income')}    	
                                        </div>		
                                        <div className="form-group col-md-12">		
                                          <label>Designation</label>
                                          <input type="text" className={`form-control ${this.hasErrorFor('f_designation') ? 'is-invalid' : ''}`} placeholder="" name="f_designation" value={f_designation} onChange={this.handleChange} />  
										  {this.renderErrorFor('f_designation')}    
                                        </div>
                                        <div className="form-group col-md-12">
                                          <label>Mobile No (For SMS)</label>
                                          <input type="number" className={`form-control ${this.hasErrorFor('f_mobile') ? 'is-invalid' : ''}`} placeholder="" name="f_mobile" value={f_mobile} onChange={this.handleChange} />
										   {this.renderErrorFor('f_mobile')}  
                                        </div>  
                                        <div className="form-group col-md-12">
                                          <label>E-Mail ID</label>
                                          <input type="text" className={`form-control ${this.hasErrorFor('f_email') ? 'is-invalid' : ''}`} placeholder="" name="f_email" value={f_email} onChange={this.handleChange} />
										  {this.renderErrorFor('f_email')}   
                                        </div>  
                                        <div className="form-group col-md-12">
                                          <label>Phone(Office/Res.)</label>
                                          <input type="number" className={`form-control ${this.hasErrorFor('residence_no') ? 'is-invalid' : ''}`} name="residence_no" value={f_residence_no} onChange={this.handleChange} />
										  {this.renderErrorFor('residence_no')}      	
                                        </div>
                                      </div>{/*/ form-row */}   
									  <div className="profile-tab-btn text-right"> 										    
										  <input type="submit" className="btn btn-primary btn-sm mx-1" value="Save Details" />		
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
										 <input type="date" className={`form-control input-daterange-timepicker ${this.hasErrorFor('regis_date') ? 'is-invalid' : ''}`} name="registration_date" value={this.state.registration_date?this.state.registration_date:regis_date} onChange={this.handleChange} ref={this.input}/>  			
										{this.renderErrorFor('regis_date')} 	
									  </div>									  
									  <div className="form-group col-md-6">		
										<label>Registration No.</label>		
										<input type="text" className={`form-control ${this.hasErrorFor('regis_no') ? 'is-invalid' : ''}`} name="registration_no" ref={this.input} value={s_registration_no} readOnly/>		
										{this.renderErrorFor('regis_no')} 								
									  </div>
									  <div className="form-group col-md-4">		
										  <label>Course Name</label>
											<select className={`form-control ${this.hasErrorFor('course_id') ? 'is-invalid' : ''}`} name="course_id" value={s_course_id} onChange={this.handleFee}> 		
											  <option value="0">Select Course</option>    		
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
											<select className={`form-control ${this.hasErrorFor('class_id') ? 'is-invalid' : ''}`} name="class_id" value={s_class_id} onChange={this.handleChange}> 
											  <option value="0">Select Class</option>		
											    {options}	   			
											</select>
											{this.renderErrorFor('class_id')}  	
										</div>
										<div className="form-group col-md-4">		
										<label>Registration Fee (In Rs.)</label>		
										<input type="number" step="0.01" className={`form-control ${this.hasErrorFor('regis_fee') ? 'is-invalid' : ''}`} name="registration_fee" value={this.state.registration_fee?this.state.registration_fee:regis_fee} onChange={this.handleChange} ref={this.input} />  
										{this.renderErrorFor('regis_fee')} 											
										</div>		
										<div className="form-group col-md-6">		
										<label>Date of Interview</label>		
										 <input type="date" className={`form-control input-daterange-timepicker ${this.hasErrorFor('doi')?'is-invalid':''}`} name="interview_date" value={this.state.interview_date?this.state.interview_date:doi} onChange={this.handleChange} ref={this.input}/>  			
										{this.renderErrorFor('doi')} 			
										</div> 										
										<div className="form-group col-md-6">		
										  <label>If School Bus Required.Then Select Station</label>		
											<select className={`form-control ${this.hasErrorFor('station_id') ? 'is-invalid' : ''}`} name="station_id" value={this.state.station_id?this.state.station_id:s_station_id} onChange={this.handleChange}>    
											  <option value="0">Select Station</option>		
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
</>		
    );
  }
}  
export default RegistrationEdit;   