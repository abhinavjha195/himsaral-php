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

class ViewHomeWork extends Component {

  constructor (props) {
  super(props)
  this.state = {
	isLoading:true,
	showError:false,
	showSuccess:false,
	showErr1:false,
	showErr2:false,
	showErr:false,
	show_result:false,
	txtMsg1:'',
	txtMsg2:'',
	school_id:'',
	course_id:'',
	class_id:'',
	section_id:'',
	subject_id:'',
	assign_date:'',
	app_url:'',
	courseData:[],
	classData:[],
	sectionData:[],
	subjectData:[],
	errors: [],
  }

   this.handleChange = this.handleChange.bind(this);
   this.handleCourse = this.handleCourse.bind(this);
   this.handleClass = this.handleClass.bind(this);
   this.handleSection = this.handleSection.bind(this);
   this.handleSubject = this.handleSubject.bind(this);
   this.handleDelete = this.handleDelete.bind(this);
   this.loadDetail = this.loadDetail.bind(this);
   this.serverTable = React.createRef();
   this.input = React.createRef();

}

handleChange(event){
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });
}

handleCourse(e) {
	e.preventDefault();
	const inp = e.target.name;
	const id = e.target.value;

   if(id >0)
   {
	   axios.get(`${base_url}api`+`/class/getclassbycourse/${id}`).then(response => {
			this.setState({
				[inp]:id,
				class_id:'',
				section_id:'',
				sectionData:[],
				subjectData:[],
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

		});
   }

}

handleClass(e){
	e.preventDefault();
	const inp = e.target.name;
	const id = e.target.value;
	const courseid = this.state.course_id;

	if(id !='')
	{
		axios.get(`${base_url}api`+`/class/getsectionbyclassandcourse/${id}/${courseid}`).then(response => {
			this.setState({
				[inp]:id,
				section_id:'',
				subjectData:[],
				sectionData: response.data.data ? response.data.data :[],
			});
		})
		.catch(error => {
		   console.log(error.message);
		})

	}
	else
	{
		this.setState({ class_id:'',section_id:'',sectionData:[],subjectData:[] });
	}
}

handleSection(e){
	e.preventDefault();
	const inp = e.target.name;
	const id = e.target.value;

	const courseid = this.state.course_id;
	const classid = this.state.class_id;

	if(id !='')
	{
		axios.get(`${base_url}api`+`/homework/getsubjectlist/${courseid}/${classid}/${id}`).then(response => {
		console.log(response);
		this.setState({
				[inp]:id,
				subjectData:response.data.data?response.data.data:[],
			});
		})
		.catch(error => {
		   console.log(error.message);
		})
	}
	else
	{
		this.setState({ section_id:'',subjectData:[] });
	}
}


handleDelete(id,e) {
        // remove from local state

	e.preventDefault();

	Swal.fire({
		title: 'Are you sure?',
		text: "You won't be able to revert this!",
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Yes, delete it!'
	}).then((result) => {
	if (result.value) {		//
		axios.delete(`${base_url}api`+`/homework/delete/${id}`)
		  .then((response) => {

			if(response.data.status=='successed')
			{
				Swal.fire({
					icon:"success",
					text:response.data.message
				});

				this.refreshTable();
			}
			else
			{
				Swal.fire({
					icon:"error",
					text:response.data.message
				});
			}

		  })
		  .catch((error) => {
			Swal.fire({
				text:error.message,
				icon:"error"
			})
		  });
		//
		}
	});

}

loadDetail(e){
	e.preventDefault();

	const courseid = this.state.course_id?this.state.course_id:'';
	const classid = this.state.class_id?this.state.class_id:'';
	const sectionid = this.state.section_id?this.state.section_id:'';
	const subjectid = this.state.subject_id?this.state.subject_id:'';
	const assigndate = this.state.assign_date?this.state.assign_date:'';
	const schoolid = this.state.school_id?this.state.school_id:'';

	if(courseid=='')
	{
		this.setState({showErr1:true,showErr2:false,txtMsg1:'Please select course!!',txtMsg2:'',app_url:'',show_result:false});
	}
	else if(classid=='')
	{
		this.setState({showErr1:false,showErr2:true,txtMsg2:'Please select class!!',txtMsg1:'',app_url:'',show_result:false});
	}
	else
	{
		const url = `${base_url}api`+`/homework/assignment?class_id=${classid}&school_id=${schoolid}&assign_date=${assigndate}&section_id=${sectionid}&subject_id=${subjectid}`;
		this.setState({
			showErr1:false,
			showErr2:false,
			show_result:true,
			txtMsg1:'',
			txtMsg2:'',
			app_url:url
		});

	}

}

handleSubject(e) {
	e.preventDefault();
	const inp = e.target.name;
	const id = e.target.value;

   if(id >0)
   {
		this.setState({
			[inp]:id,
		});
   }
   else
   {
		this.setState({
			subject_id:id,
		});
   }

}

refreshTable() {
	this.serverTable.current.refreshData();
}

titleCase = (str) => {
	str = str.toLowerCase();
	return str.charAt(0).toUpperCase()+str.slice(1);
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

	let _this = this;
	const columns = ['courseName','className','section_name','subject_name','description','attachment','action'];

	const options = {
    perPage:10,
    headings: {courseName:'Course',className:'Class',section_name:'Section',subject_name:'Subject',description:'Homework',attachment:'Attachment'},
    sortable: ['subject_name','description'],
    requestParametersNames: {query:'search',direction:'order'},
    responseAdapter: function (resp_data)
	{
		console.log("respData",resp_data);
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
					<h4>View Home Work</h4>
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

					<form>
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

							<div className="form-row">
							  <div className="form-group col-md-2">
								<label>Date</label>
								<input type="date" className={`form-control input-daterange-timepicker`} name="assign_date" value={(this.state.assign_date)?this.state.assign_date:''} onChange={this.handleChange} placeholder="dd/mm/yy" />

							  </div>

							  <div className="form-group col-md-2">
								<label>Course</label>
								<select className={`form-control`} name="course_id" onChange={this.handleCourse} value={(this.state.course_id)?this.state.course_id:''}>
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
								<select className={`form-control`} name="class_id" onChange={this.handleClass} value={(this.state.class_id)?this.state.class_id:''}>
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
								<select className={`form-control`} name="section_id" onChange={this.handleSection} value={(this.state.section_id)?this.state.section_id:''}>
								<option value="">--Select--</option>
								{
								  this.state.sectionData.map( (item, key) => {
									return (
								  <option key={key} value={item.sectionId}>{item.sectionName}</option>
								  )
								})
								}
								</select>

							  </div>

							  <div className="form-group col-md-2">
								<label>Subject</label>
								<select className={`form-control`} name="subject_id" onChange={this.handleChange} value={(this.state.subject_id)?this.state.subject_id:''}>
								<option value="">--Select--</option>
								{
								  this.state.subjectData.map( (item, key) => {
									return (
								  <option key={key} value={item.subjectId}>{item.subjectName}</option>
								  )
								})
								}
								</select>

							  </div>

							  <div className="form-group col-md-2">
								<label>&nbsp; &nbsp; &nbsp;</label><br/>
								<input type="submit" className="btn btn-primary" value="View Details" onClick={(event) => this.loadDetail(event)}/>
							  </div>
							</div>{/******<!--/ form-row -->*******/}

						{
						this.state.show_result?(
						<div className="table-responsive">
							<ServerTable ref={_this.serverTable} columns={columns} url={_this.state.app_url?_this.state.app_url:''} options={options} bordered condensed striped>
								{
									function (row,column)
									{
										switch (column) {
											case 'action':
												return (<button className="btn" onClick={(event) => _this.handleDelete(`${row.id}`,event)}>
												  <i className="fa fa-trash" aria-hidden="true"></i></button>);
                                            case 'attachment':
                                                return (
                                                    row[column] ?
                                                    <button
                                                        className="btn"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            const attachmentUrl = base_url + 'uploads/home_work/' + row[column];
                                                            window.open(attachmentUrl, '_blank');
                                                        }}
                                                    >
                                                        <i className="fa fa-eye" aria-hidden="true"></i>
                                                    </button> : ''
                                                );
											default:
												return (_this.titleCase(row[column]));
										}
									}
								}
								</ServerTable>
						</div>
						)
						:''
						}

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

export default ViewHomeWork;
