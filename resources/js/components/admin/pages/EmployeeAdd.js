import React, { Component } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

import Script from "@gumgum/react-script-tag";
import Copyright from "../basic/Copyright";
import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url=location.protocol+'//'+location.host+'/';

class EmployeeAdd extends Component {

  constructor(props) {
	  super(props)
	  this.state = {
		  fileError:false,
		  showError: false,
		  showSuccess: false,
		  isLoading:true,
		  imgSrc:'',
		  messgae:'',
		  fileMessgae:'',
		  employee_name:'',
		  dob:'',
		  caste:'',
		  religion:'',
		  marital_status:'',
		  mobile:'',
		  email:'',
		  father_name:'',
		  mother_name:'',
		  f_mobile:'',
		  employee_code:'',
		  login_id:'',
		  designation_id:'',
		  doj:'',
		  department:'',
		  account_no:'',
		  bank_name:'',
		  branch_name:'',
		  pan_no:'',
		  ifsc_code:'',
		  annual_income:'',
		  salary_grade:'',
		  grade_cbse:'',
		  leaves_allow:'',
		  adhar_no:'',
		  permanent_address:'',
		  temporary_address:'',
		  insert_id:'',
		  academic:'',
		  qualification:'',
		  state_id:'',
		  passing_year:'',
		  tab_id:'personal-details',
		  errors:[],
		  departments:[],
		  designations:[],
		  qualifications:[],
		  statelist:[],
          school_id:'',
	  }
	  this.formSubmit = this.formSubmit.bind(this);
	  this.handleChange = this.handleChange.bind(this);
	  this.handleDepartment = this.handleDepartment.bind(this);
	  this.handleTab = this.handleTab.bind(this);
	  this.handleFilePreview = this.handleFilePreview.bind(this);
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
handleDepartment(event){
    event.preventDefault();
	const id=event.target.value;

	if(id !='')
	{
		this.setState({ [event.target.name]: event.target.value });

		axios.get(`${base_url}api`+`/employee/getdesignations/${id}`).then(response => {
			this.setState({
				designation_id:'',
				designations: response.data.data ? response.data.data :[],
			});
		})
		.catch(error => {
		   console.log(error.message);
		})
	}
	else
	{
		this.setState({ [event.target.name]: event.target.value,designation_id:'',designations:[] });
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
hasErrorFor (field) {
  return !!this.state.errors[field]
}
renderErrorFor (field) {
  if (this.hasErrorFor(field))
  {
	  if(field=='employee_image')
	  {
			return (<span style={{color:"#FF1616"}}> <strong>{this.state.errors[field][0]}</strong></span>);
	  }
	  else
	  {
			return (<span className='invalid-feedback'> <strong>{this.state.errors[field][0]}</strong></span>);
	  }

  }
}
formSubmit(event){
	event.preventDefault();
	const { gender,nationality,percentage,university,institution,designation,salary,reason,start,end,job } = event.target;
	let emp_gender=(gender)?gender.value:'';
	let emp_nationality=(nationality)?nationality.value:'';

	let name =(this.state.employee_name)?this.state.employee_name:'';
	let emp_dob =(this.state.dob)?this.state.dob:'';
	let emp_caste =(this.state.caste)?this.state.caste:'';
	let emp_religion =(this.state.religion)?this.state.religion:'';
	let emp_marital =(this.state.marital_status)?this.state.marital_status:'';
	let emp_mobile =(this.state.mobile)?this.state.mobile:'';
	let emp_email =(this.state.email)?this.state.email:'';
	let f_name =(this.state.father_name)?this.state.father_name:'';
	let m_name =(this.state.mother_name)?this.state.mother_name:'';
	let f_phone =(this.state.f_mobile)?this.state.f_mobile:'';
	let emp_permanent =(this.state.permanent_address)?this.state.permanent_address:'';
	let emp_temporary =(this.state.temporary_address)?this.state.temporary_address:'';

	let emp_code =(this.state.employee_code)?this.state.employee_code:'';
	let emp_login =(this.state.login_id)?this.state.login_id:'';
	let emp_doj =(this.state.doj)?this.state.doj:'';
	let emp_department =(this.state.department)?this.state.department:'';
	let emp_designation =(this.state.designation_id)?this.state.designation_id:'';
	let emp_account =(this.state.account_no)?this.state.account_no:'';
	let emp_bank =(this.state.bank_name)?this.state.bank_name:'';
	let emp_branch =(this.state.branch_name)?this.state.branch_name:'';
	let emp_pan =(this.state.pan_no)?this.state.pan_no:'';
	let emp_ifsc =(this.state.ifsc_code)?this.state.ifsc_code:'';
	let emp_income =(this.state.annual_income)?this.state.annual_income:'';
	let emp_salary =(this.state.salary_grade)?this.state.salary_grade:'';
	let emp_grade =(this.state.grade_cbse)?this.state.grade_cbse:'';
	let emp_leaves =(this.state.leaves_allow)?this.state.leaves_allow:'';
	let emp_adhar =(this.state.adhar_no)?this.state.adhar_no:'';

	let emp_academic =(this.state.academic)?this.state.academic:'';
	let emp_qualify =(this.state.qualification)?this.state.qualification:'';
	let emp_state =(this.state.state_id)?this.state.state_id:'';
	let emp_passing =(this.state.passing_year)?this.state.passing_year:'';
	let emp_percentage=(percentage)?percentage.value:'';
	let emp_universe=(university)?university.value:'';

	let emp_institution=(institution)?institution.value:'';
	let emp_desig=(designation)?designation.value:'';
	let emp_sal=(salary)?salary.value:'';
	let emp_reason=(reason)?reason.value:'';
	let emp_job=(job)?job.value:'';
	let emp_start=(start)?start.value:'';
	let emp_end=(end)?end.value:'';
    
	let fd = new FormData();

	fd.append("employee_name",name);
	fd.append("dob",emp_dob);
	fd.append("caste",emp_caste);
	fd.append("gender",emp_gender);
	fd.append("nationality",emp_nationality);
	fd.append("religion",emp_religion);
	fd.append("marital_status",emp_marital);
	fd.append("mobile",emp_mobile);
	fd.append("email",emp_email);
	fd.append("father_name",f_name);
	fd.append("mother_name",m_name);
	fd.append("f_mobile",f_phone);
	fd.append("permanent_address",emp_permanent);
	fd.append("temporary_address",emp_temporary);
	fd.append("employee_code",emp_code);
	fd.append("login_id",emp_login);
	fd.append("designation_id",emp_designation);
	fd.append("doj",emp_doj);
	fd.append("department",emp_department);
	fd.append("account_no",emp_account);
	fd.append("bank_name",emp_bank);
	fd.append("branch_name",emp_branch);
	fd.append("pan_no",emp_pan);
	fd.append("ifsc_code",emp_ifsc);
	fd.append("annual_income",emp_income);
	fd.append("salary_grade",emp_salary);
	fd.append("grade_cbse",emp_grade);
	fd.append("leaves_allow",emp_leaves);
	fd.append("adhar_no",emp_adhar);
	fd.append("academic",emp_academic);
	fd.append("qualification",emp_qualify);
	fd.append("state_id",emp_state);
	fd.append("passing_year",emp_passing);
	fd.append("percentage",emp_percentage);
	fd.append("university",emp_universe);
	fd.append("institution",emp_institution);
	fd.append("designation",emp_desig);
	fd.append("salary",emp_sal);
	fd.append("reason",emp_reason);
	fd.append("job",emp_job);
	fd.append("start",emp_start);
	fd.append("end",emp_end);
	fd.append("tab",this.state.tab_id);
	fd.append("insert_id",this.state.insert_id);
	fd.append("employee_image",this.state.emp_image);
	fd.append("schoolId",this.state.school_id);


		axios.post(`${base_url}api`+'/employee/add',fd)
			.then(response => {
				console.log(response.data);
				if (response.data.status === 'successed')
				{
					this.setState({ showError:false,showSuccess:true,message:response.data.message,insert_id:response.data.data,errors:response.data.errors});
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


	axios.get(`${base_url}api`+'/employee/getdepartments').then(response => {
		this.setState({
				departments: response.data.data ? response.data.data : [],
			});
		})
	.catch(error => {
	   console.log(error.message);
    })

	axios.get(`${base_url}api`+'/employee/getqualifications').then(response => {
		this.setState({
				qualifications: response.data.data?response.data.data:[],
			});
		})
	.catch(error => {
	   console.log(error.message);
    })

	axios.get(`${base_url}api`+'/studentmaster/getstates').then(response => {
	this.setState({
			statelist: response.data.data ? response.data.data : [],
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

	var path = location.protocol + '//' + location.host + '/';
	const d = new Date();
	let current_year = d.getFullYear();

	var years = [];
	for (var i=1950;i<=current_year;i++)
	{
		years.push(i);
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

	{/**********************************
		Content body start
	**************************************/}
	<div className="content-body">
		<div className="container-fluid">
			<div className="row page-titles mx-0">
				<div className="col-sm-6 p-md-0">
					<div className="welcome-text">
						<h4>Add Employee</h4>
					</div>
				</div>
				<div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
					<ol className="breadcrumb">
						<li><a href={`/employee_list`} className="btn bg-blue-soft text-blue"><i className="fa fa-angle-double-left"></i> Back to Admitted Employee List</a></li>
					</ol>
				</div>
			</div>
			 {/***** row ****/}

			<div className="row">
			  <div className="col-xl-12 col-lg-12 col-md-12">
				<div className="profile-tab">
				  <div className="custom-tab-1">
					<ul className="nav nav-tabs">
					  <li className="nav-item"><a href="#personal-details" data-toggle="tab" onClick={(e) => this.handleTab(e,'personal-details')} className="nav-link active show">Personal Details</a></li>
					  <li className="nav-item"><a href="#employement-details" data-toggle="tab" onClick={(e) => this.handleTab(e,'employement-details')} className="nav-link">Employement Details</a></li>
					  <li className="nav-item"><a href="#academics-details" data-toggle="tab" onClick={(e) => this.handleTab(e,'academics-details')} className="nav-link">Academics Details</a></li>
					  <li className="nav-item"><a href="#previous-experience" data-toggle="tab" onClick={(e) => this.handleTab(e,'previous-experience')} className="nav-link">Previous Experience</a></li>
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
									<img className="img-account-profile rounded-circle mb-2 img-thumbnail" src={(this.state.imgSrc)?this.state.imgSrc:'./images/male.jpg'} alt=""/>
									<div className="small font-italic text-muted mb-4">JPG or PNG not larger than 100 KB</div>
									<div className="upload-grid">
									  <img src="./images/upload-icon.png" alt=""/>
									  <input type="file" id="upload" name="emp_image" className="btn btn-primary" placeholder="Upload new image" onChange={this.handleFilePreview}/>
									  <label htmlFor="forDesign">Upload an image</label>
									</div>
								  </div>
								  {this.state.fileError?
								  <div className="alert alert-danger" style={{color:"brown"}}>
									<strong>{this.state.fileMessgae}</strong>
								  </div>
								 : null}
								{this.renderErrorFor('employee_image')}
								</div>{/***** card ****/}

							  </div>{/***** col-4 ****/}

							  <div className="col-xl-8 col-lg-8 col-md-8">
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
											<label>Employee Name<span className="text-danger">*</span></label>
											<input type="text" name="employee_name" className={`form-control ${this.hasErrorFor('employee_name') ? 'is-invalid' : ''}`} placeholder="" value={(this.state.employee_name)?this.state.employee_name:''} onChange={this.handleChange}/>
											{this.renderErrorFor('employee_name')}
										  </div>

										  <div className="form-group col-md-6">
											<label>Date of Birth<span className="text-danger">*</span></label>
											<div className="example">
											  <input type="date" className={`form-control input-daterange-timepicker ${this.hasErrorFor('dob') ? 'is-invalid' : ''}`} name="dob" value={(this.state.dob)?this.state.dob:''} onChange={this.handleChange}/>
											  {this.renderErrorFor('dob')}
											</div>
										  </div>

										  <div className="form-group col-md-6">
											<label>Gender</label>
											<div className="form-check settings-form-radio">
											  <input className="form-check-input" type="radio" name="gender" value="male" ref={this.input} defaultChecked/>
											  <label className="form-check-label">Male</label>

											  <input className="form-check-input" type="radio" name="gender" value="female" ref={this.input}/>
											  <label className="form-check-label">Female</label>
											</div>
										  </div>

										  <div className="form-group col-md-6">
											<label>Nationality</label>
											<div className="form-check settings-form-radio">
											  <input className="form-check-input" type="radio" name="nationality" value="indian" ref={this.input} defaultChecked/>
											  <label className="form-check-label">Indian</label>

											  <input className="form-check-input" type="radio" name="nationality" value="non-indian" ref={this.input}/>
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
											<label>Mobile No.<span className="text-danger">*</span></label>
											<input type="number" className={`form-control ${this.hasErrorFor('mobile') ? 'is-invalid' : ''}`} placeholder="" value={(this.state.mobile)?this.state.mobile:''} name="mobile" onChange={this.handleChange} />
										  {this.renderErrorFor('mobile')}
										  </div>

										  <div className="form-group col-md-6">
											<label>Email ID<span className="text-danger">*</span></label>
											<input type="text" className={`form-control ${this.hasErrorFor('email') ? 'is-invalid' : ''}`} placeholder="" value={(this.state.email)?this.state.email:''} name="email" onChange={this.handleChange} />
										  {this.renderErrorFor('email')}
										  </div>

										  <div className="form-group col-md-6">
											<label>Father Name/Spouse Name<span className="text-danger">*</span></label>
											<input type="text" className={`form-control ${this.hasErrorFor('father_name') ? 'is-invalid' : ''}`} placeholder="" name="father_name" value={(this.state.father_name)?this.state.father_name:''} onChange={this.handleChange} />
										  {this.renderErrorFor('father_name')}
										  </div>

										  <div className="form-group col-md-6">
											<label>Mother Name<span className="text-danger">*</span></label>
											<input type="text" className={`form-control ${this.hasErrorFor('mother_name') ? 'is-invalid' : ''}`} placeholder="" name="mother_name" value={(this.state.mother_name)?this.state.mother_name:''} onChange={this.handleChange} />
										  {this.renderErrorFor('mother_name')}
										  </div>

										  <div className="form-group col-md-6">
											<label>Parents Mobile No</label>
											<input type="number" className={`form-control ${this.hasErrorFor('f_mobile') ? 'is-invalid' : ''}`} placeholder="" name="f_mobile" value={(this.state.f_mobile)?this.state.f_mobile:''} onChange={this.handleChange} />
										  {this.renderErrorFor('f_mobile')}
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

										</div>{/***** form-row ****/}
										<div className="profile-tab-btn text-right">
											  <input type="submit" className="btn btn-primary btn-sm mx-1" value="Save Details" />
											  <input type="button" className="btn btn-primary btn-sm mx-1" value="Cancel" />
										</div>
									  </form>
									</div>
								  </div>{/***** card-body ****/}
								</div>{/***** card ****/}
							  </div>{/***** col-8 ****/}
							</div>{/***** row ****/}
						  </div>{/***** settings-form ****/}
						</div>
					  </div>{/***** tab-pane ****/}

					  <div id="employement-details" className="tab-pane fade">
						<div className="pt-3">
						  <div className="settings-form">
							<div className="row">
							  <div className="col-xl-12 col-lg-12 col-md-12">
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
										  <div className="form-group col-md-4">
											<label>Employee Code<span className="text-danger">*</span></label>
											<input type="text" name="employee_code" className={`form-control ${this.hasErrorFor('employee_code') ? 'is-invalid' : ''}`} placeholder="" value={(this.state.employee_code)?this.state.employee_code:''} onChange={this.handleChange}/>
											{this.renderErrorFor('employee_code')}
										  </div>

										  <div className="form-group col-md-4">
											<label>Employee Login Id<span className="text-danger">*</span></label>
											<input type="text" name="login_id" className={`form-control ${this.hasErrorFor('login_id') ? 'is-invalid' : ''}`} placeholder="" value={(this.state.login_id)?this.state.login_id:''} onChange={this.handleChange}/>
											{this.renderErrorFor('login_id')}
										  </div>

										  <div className="form-group col-md-4">
											<label>Date of Joining<span className="text-danger">*</span></label>
											 <input type="date" className={`form-control input-daterange-timepicker ${this.hasErrorFor('doj') ? 'is-invalid' : ''}`} name="doj" value={(this.state.doj)?this.state.doj:''} onChange={this.handleChange}/>
											{this.renderErrorFor('doj')}
										  </div>

										  <div className="form-group col-md-4">
											<label>Department<span className="text-danger">*</span></label>
											<select className={`form-control ${this.hasErrorFor('department') ? 'is-invalid' : ''}`} name="department" value={(this.state.department)?this.state.department:''} onChange={this.handleDepartment}>
											  <option value="">--Select--</option>
											  {this.state.departments.map( (item, key) => {
												return (
											  <option key={key} value={item.departmentId}>{item.departmentName}</option>
											  )
											})}
											</select>
											{this.renderErrorFor('department')}
										  </div>

										  <div className="form-group col-md-4">
											<label>Designation<span className="text-danger">*</span></label>
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

										  <div className="form-group col-md-4">
											<label>Account No.</label>
											<input type="text" className={`form-control ${this.hasErrorFor('account_no') ? 'is-invalid' : ''}`} placeholder="" value={(this.state.account_no)?this.state.account_no:''} name="account_no" onChange={this.handleChange} />
											{this.renderErrorFor('account_no')}
										  </div>

										  <div className="form-group col-md-4">
											<label>Bank Name</label>
											<input type="text" className={`form-control ${this.hasErrorFor('bank_name') ? 'is-invalid' : ''}`} placeholder="" value={(this.state.bank_name)?this.state.bank_name:''} name="bank_name" onChange={this.handleChange} />
											{this.renderErrorFor('bank_name')}
										  </div>

										  <div className="form-group col-md-4">
											<label>Branch Name</label>
											<input type="text" className={`form-control ${this.hasErrorFor('branch_name') ? 'is-invalid' : ''}`} placeholder="" value={(this.state.branch_name)?this.state.branch_name:''} name="branch_name" onChange={this.handleChange} />
											{this.renderErrorFor('branch_name')}
										  </div>

										  <div className="form-group col-md-4">
											<label>PAN No.</label>
											<input type="text" className={`form-control ${this.hasErrorFor('pan_no') ? 'is-invalid' : ''}`} placeholder="" value={(this.state.pan_no)?this.state.pan_no:''} name="pan_no" onChange={this.handleChange} />
											{this.renderErrorFor('pan_no')}
										  </div>

										  <div className="form-group col-md-4">
											<label>IFSC Code</label>
											<input type="text" className={`form-control ${this.hasErrorFor('ifsc_code') ? 'is-invalid' : ''}`} placeholder="" value={(this.state.ifsc_code)?this.state.ifsc_code:''} name="ifsc_code" onChange={this.handleChange} />
											{this.renderErrorFor('ifsc_code')}
										  </div>

										  <div className="form-group col-md-4">
											<label>Annual Income</label>
											<input type="text" className={`form-control ${this.hasErrorFor('annual_income') ? 'is-invalid' : ''}`} placeholder="" value={(this.state.annual_income)?this.state.annual_income:''} name="annual_income" onChange={this.handleChange} />
											{this.renderErrorFor('annual_income')}
										  </div>

										  <div className="form-group col-md-4">
											<label>Salary Grade</label>
											<input type="text" className={`form-control ${this.hasErrorFor('salary_grade') ? 'is-invalid' : ''}`} placeholder="" value={(this.state.salary_grade)?this.state.salary_grade:''} name="salary_grade" onChange={this.handleChange} />
											{this.renderErrorFor('salary_grade')}
										  </div>

										  <div className="form-group col-md-4">
											<label>Salary Grade CBSE</label>
											<input type="text" className={`form-control ${this.hasErrorFor('grade_cbse') ? 'is-invalid' : ''}`} placeholder="" value={(this.state.grade_cbse)?this.state.grade_cbse:''} name="grade_cbse" onChange={this.handleChange} />
											{this.renderErrorFor('grade_cbse')}
										  </div>

										  <div className="form-group col-md-4">
											<label>Leaves Permitted</label>
											<input type="text" className={`form-control ${this.hasErrorFor('leaves_allow') ? 'is-invalid' : ''}`} placeholder="" value={(this.state.leaves_allow)?this.state.leaves_allow:''} name="leaves_allow" onChange={this.handleChange} />
											{this.renderErrorFor('leaves_allow')}
										  </div>

										  <div className="form-group col-md-4">
											<label>Aadhar No.</label>
											<input type="text" className={`form-control ${this.hasErrorFor('adhar_no') ? 'is-invalid' : ''}`} placeholder="" value={(this.state.adhar_no)?this.state.adhar_no:''} name="adhar_no" onChange={this.handleChange} />
											{this.renderErrorFor('adhar_no')}
										  </div>

										</div>{/***** form-row ****/}
										<div className="profile-tab-btn text-right">
											  <input type="submit" className="btn btn-primary btn-sm mx-1" value="Save Details" />
											  <input type="button" className="btn btn-primary btn-sm mx-1" value="Cancel" />
										  </div>
									  </form>
									</div>
								  </div>{/***** card-body ****/}
								</div>{/***** card ****/}
							  </div>{/***** col-8 ****/}
							</div>{/***** row ****/}
						  </div>{/***** settings-form ****/}
						</div>
					  </div>{/***** tab-pane ****/}

					  <div id="academics-details" className="tab-pane fade">
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
											<label>Full/Part Time</label>
											<select className={`form-control ${this.hasErrorFor('academic') ? 'is-invalid' : ''}`} name="academic" value={(this.state.academic)?this.state.academic:''} onChange={this.handleChange}>
												<option value="">Select Fulltime</option>
												<option value="full">Full-Time</option>
												<option value="part">Part-Time</option>
											</select>
											{this.renderErrorFor('academic')}
										  </div>

										  <div className="form-group col-md-6">
											<label>Qualification</label>
											<select className={`form-control ${this.hasErrorFor('qualification') ? 'is-invalid' : ''}`} name="qualification" value={(this.state.qualification)?this.state.qualification:''} onChange={this.handleChange}>
											<option value="">--Select--</option>
											{this.state.qualifications.map( (item, key) => {
												return (
											  <option key={key} value={item.qualificationId}>{item.qualificationName}</option>
											  )
											})}
											</select>
											{this.renderErrorFor('qualification')}
										  </div>

										  <div className="form-group col-md-6">
											<label>University/Board</label>
											<input type="text" name="university" className={`form-control ${this.hasErrorFor('university') ? 'is-invalid' : ''}`} placeholder="" ref={this.input}/>
											{this.renderErrorFor('university')}
										  </div>

										  <div className="form-group col-md-6">
											<label>State</label>
											<select className={`form-control ${this.hasErrorFor('state_id') ? 'is-invalid' : ''}`} name="state_id" value={(this.state.state_id)?this.state.state_id:''} onChange={this.handleChange}>
											<option value="">Select State</option>
											{this.state.statelist.map( (item, key) => {
												return (
											  <option key={key} value={item.id}>{item.name}</option>
											  )
											})}
											</select>
											{this.renderErrorFor('state_id')}
										  </div>

										  <div className="form-group col-md-6">
											<label>Passing Year</label>
											<select className={`form-control ${this.hasErrorFor('passing_year') ? 'is-invalid' : ''}`} name="passing_year" value={(this.state.passing_year)?this.state.passing_year:''} onChange={this.handleChange}>
											<option value="">Select Year</option>
											{years.map((item,key) => (
												<option key={key} value={item}>{item}</option>
											))}
											</select>
											{this.renderErrorFor('passing_year')}
										  </div>

										  <div className="form-group col-md-6">
											<label>Percentage</label>
											<input type="text" name="percentage" className={`form-control ${this.hasErrorFor('percentage') ? 'is-invalid' : ''}`} placeholder="" ref={this.input}/>
											{this.renderErrorFor('percentage')}
										  </div>

										</div>{/***** form-row ****/}
										<div className="profile-tab-btn text-right">
											  <input type="submit" className="btn btn-primary btn-sm mx-1" value="Save Details" />
											  <input type="button" className="btn btn-primary btn-sm mx-1" value="Cancel" />
										  </div>
									  </form>
									</div>
								  </div>{/***** card-body ****/}
								</div>{/***** card ****/}
							  </div>{/***** col-8 ****/}
							</div>{/***** row ****/}
						  </div>{/***** settings-form ****/}
						</div>
					  </div>{/***** tab-pane ****/}

					  <div id="previous-experience" className="tab-pane fade">
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
											<label>Company/Institute Name</label>
											<input type="text" name="institution" className={`form-control ${this.hasErrorFor('institution') ? 'is-invalid' : ''}`} placeholder="" ref={this.input}/>
											{this.renderErrorFor('institution')}
										  </div>

										  <div className="form-group col-md-6">
											<label>From</label>
											<input type="date" name="start" className={`form-control ${this.hasErrorFor('start') ? 'is-invalid' : ''}`} placeholder="" ref={this.input}/>
											{this.renderErrorFor('start')}
										  </div>

										  <div className="form-group col-md-6">
											<label>To</label>
											<input type="date" name="end" className={`form-control ${this.hasErrorFor('end') ? 'is-invalid' : ''}`} placeholder="" ref={this.input}/>
											{this.renderErrorFor('end')}
										  </div>

										  <div className="form-group col-md-6">
											<label>Job Nature</label>
											<input type="text" name="job" className={`form-control ${this.hasErrorFor('job') ? 'is-invalid' : ''}`} placeholder="" ref={this.input}/>
											{this.renderErrorFor('job')}
										  </div>

										  <div className="form-group col-md-6">
											<label>Designation</label>
											<input type="text" name="designation" className={`form-control ${this.hasErrorFor('designation') ? 'is-invalid' : ''}`} placeholder="" ref={this.input}/>
											{this.renderErrorFor('designation')}
										  </div>

										  <div className="form-group col-md-6">
											<label>Salary Withdrawn</label>
											<input type="number" name="salary" className={`form-control ${this.hasErrorFor('salary') ? 'is-invalid' : ''}`} placeholder="" ref={this.input}/>
											{this.renderErrorFor('salary')}
										  </div>

										  <div className="form-group col-md-12">
											<label>Leaving Reason</label>
											<textarea name="reason" className={`form-control ${this.hasErrorFor('reason') ? 'is-invalid' : ''}`} rows="7" ref={this.input}></textarea>
											{this.renderErrorFor('reason')}
										  </div>

										</div> {/***** form-row ****/}
										<div className="profile-tab-btn text-right">
										  <input type="submit" className="btn btn-primary btn-sm mx-1" value="Save Details" />
										  <input type="button" className="btn btn-primary btn-sm mx-1" value="Cancel" />
										</div>
									  </form>
									</div>
								  </div> {/***** card-body ****/}
								</div> {/***** card ****/}
							  </div> {/***** col-8 ****/}
							</div> {/***** row ****/}
						  </div> {/***** settings-form ****/}
						</div>
					  </div> {/***** tab-pane ****/}

					</div> {/***** tab-content ****/}
				  </div> {/***** custom-tab-1 ****/}
				</div> {/***** profile-tab ****/}
			  </div>
			</div> {/***** row ****/}

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

export default EmployeeAdd;
