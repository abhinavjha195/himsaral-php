import React, { Component } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';

import Script from "@gumgum/react-script-tag";

import Copyright from "../basic/Copyright";

import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url=location.protocol+'//'+location.host+'/';


class AddClass extends Component {

  constructor (props) {
  super(props)
  this.state = {
	course_id: '',
    status:'',
    title: '',
    remark: '',
	formMessage:'',
	isLoading:true,
    errors: [],
	courseData: []
  }
	   this.handleCreateNewItem = this.handleCreateNewItem.bind(this)
	   this.hasErrorFor = this.hasErrorFor.bind(this)
	   this.renderErrorFor = this.renderErrorFor.bind(this)
	   this.input = React.createRef();
   }

   handleCreateNewItem (event) {
  event.preventDefault();
  const { course_id,title,status,remark } = event.target


  const { history } = this.props
  const data = {
	course_id: course_id.value,
    title: title.value,
	status: status.value,
    remark: remark.value,
  }


  axios.post(`${base_url}`+'api/class/create',data)
    .then(response => {
		console.log(response.data);
		if (response.data.status === 'failed') {
		// redirect to the homepage
		this.setState({
		//  formMessage: response.data.message,
		 errors: response.data.errors
	   })
		history.push('/')

		}
		else
		{
		   this.setState({
			 formMessage: response.data.message,
			 errors: []
		   })
		    setTimeout(() => {
               window.location.href = base_url+"class_list";
            }, 2000);

		}
    })
    .catch(error => {
	   console.log(error.message);
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

	axios.get(`${base_url}`+'api/class/getcourses').then(response => {
	//console.log(response.data);
	this.setState({
			courseData: response.data.data ? response.data.data : [],
		});
	})
	.catch(error => {
	   console.log(error.message);
    })
}

render () {

const isLoad = this.state.isLoading;

if (isLoad) {

//return null;

}

	const { courseData } = this.state;

	let courseList = courseData.length > 0
		&& courseData.map((item, i) => {
		return (
			<option key={i} value={item.courseId}>{item.courseName}</option>
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

<div id="main-wrapper">


	 {/***********************************
		HeaderPart start
	************************************/}


	<HeaderPart />


	 {/***********************************
	  HaderPart end
	************************************/}






	   {/***********************************
		Main wrapper start
	************************************/}






			  {/***********************************
				Content body start
			************************************/}

	<div className="content-body">
		<div className="container-fluid">
			<div className="row page-titles mx-0">
				<div className="col-sm-6 p-md-0">
					<div className="welcome-text">
						<h4>Add Class</h4>
					</div>
				</div>
				<div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
					<ol className="breadcrumb">
						<li><a href={`/class_list`} className="btn bg-blue-soft text-blue"><i className="fa fa-angle-double-left"></i> Back to Class List</a></li>
					</ol>
				</div>
			</div>

			<div className="row">
			  <div className="col-xl-12 col-xxl-12">
				<div className="card">

				  <div className="card-body">

					<div className="basic-form form-own">
					  <form onSubmit={this.handleCreateNewItem}>
						<div className="form-row">
						  <div className="form-group col-md-6">
							<label>Course Name</label>
							<select className={`form-control ${this.hasErrorFor('course_id') ? 'is-invalid' : ''}`} id="courseid" name="course_id" ref={this.input}>
							  <option value="" selected>Select Course</option>
							  {courseList}
							</select>
							{this.renderErrorFor('course_id')}
						  </div>

						  <div className="form-group col-md-6">
							<label>Class name</label>
	<input type='text' className={`form-control ${this.hasErrorFor('title') ? 'is-invalid' : ''}`} name='title'
ref={this.input} placeholder="Enter class name"/>{this.renderErrorFor('title')}
						  </div>

						  <div className="form-group col-md-6">
								<label>Status</label>
								<select className={`form-control ${this.hasErrorFor('status') ? 'is-invalid' : ''}`} id="Maritial_status" name="status" ref={this.input}>
								<option value="" selected>Select Status</option>
								<option value="1">Active</option>
								<option value="0">In-Active</option>
								</select>
								{this.renderErrorFor('status')}
						  </div>

						  <div className="form-group col-md-6">
								<label>Remark</label>
								<input type="text" className={`form-control ${this.hasErrorFor('remark') ? 'is-invalid' : ''}`} name='remark' ref={this.input} placeholder=""/>
								{this.renderErrorFor('remark')}
						  </div>

						</div>
						<input type="submit" className="btn btn-primary" value="Submit"/>
						{/* <div className="text-success">{this.state.formMessage}</div>  */}

						{this.state.formMessage!='' ? 	<div className="success">{this.state.formMessage}</div>:null }

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

export default AddClass;
