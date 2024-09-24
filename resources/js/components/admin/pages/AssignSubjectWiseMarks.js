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

class AssignSubjectWiseMarks extends Component {

  constructor(props) {
	  super(props)
	  this.state = {
		  showError: false,
		  showSuccess: false,
		  showTable: false,
		  isLoading:true,
		  subMsg:'',
		  exam_id:'',
		  course_id:'',
		  class_id:'',
		  section_id:'',
		  max_mark:'',
		  messgae:'',
		  courseList:[],
		  classList:[],
		  sectionList:[],
		  subjectList:[],
		  studentList:[],
		  subjectRow:[],
		  examList:[],
		  subjectarr:[],
		  subjectlst:[],
		  theoryarr:[],
		  theorylst:[],
		  palst:[],
		  theoryalert:[],
		  assesalert:[],
		  intalert:[],
		  internalst:[],
		  assessmentarr:[],
		  internalarr:[],
		  obtarr:[],
          obtst:[],
          obtalert:[],
		  datearr:[],
		  datelst:[],
		  attendancearr:[],
		  attendancelst:[],
		  marklst:[],
		  errors:[],
	  }

	  this.handleChange = this.handleChange.bind(this);
	  this.handleAttendance = this.handleAttendance.bind(this);
	  this.handleCourse = this.handleCourse.bind(this);
	  this.handleExam = this.handleExam.bind(this);
	  this.handleSection = this.handleSection.bind(this);
	  this.handleClass = this.handleClass.bind(this);
	  this.handleSubject = this.handleSubject.bind(this);
	  this.handleDate = this.handleDate.bind(this);
	  this.handleTheory = this.handleTheory.bind(this);
	  this.handleAssessment = this.handleAssessment.bind(this);
	  this.handleInternal = this.handleInternal.bind(this);
	  this.handleMarkObtained = this.handleMarkObtained.bind(this);
	  this.formSubmit = this.formSubmit.bind(this);
	  this.hasErrorFor = this.hasErrorFor.bind(this);
	  this.renderErrorFor = this.renderErrorFor.bind(this);
	  this.serverTable = React.createRef();

}

handleChange(event){
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });
}

handleAttendance(event){
    event.preventDefault();
	const attn_id = event.target.id;
	const attn_value = event.target.value;
	const attendarr ={};

	let attendances=this.state.attendancearr;

	for(var key in attendances)
	{
		attendarr[key]=attendances[key];
	}

	attendarr[attn_id]=attn_value;
    this.setState({ attendancearr:attendarr });
	this.refreshTable();
}


handleExam(event) {

	const inpt=event.target.name;
	const id = event.target.value;

   if(id !='')
   {
		axios.get(`${base_url}api`+`/examdatesheet/getcourse/${id}`).then(response => {
			this.setState({
				courseList: response.data.data ? response.data.data :[],
				classList:[],
				sectionList:[],
				subjectList:[],
				studentList:[],
				[inpt]: id,
				course_id:'',
				class_id:'',
				section_id:'',
				subject_id:'',
			});
		})
		.catch(error => {
		    console.log(error.message);
		})
   }
   else
   {
	   this.setState({
			courseList:[],
			classList:[],
			sectionList:[],
			subjectList:[],
			studentList:[],
			[inpt]: id,
			course_id:'',
			class_id:'',
			section_id:'',
			subject_id:'',
		});
   }

}

handleCourse(event) {

	const inpt=event.target.name;
	const id = event.target.value;
	const exam_id = this.state.exam_id;

   if(id !='')
   {
		axios.get(`${base_url}api`+`/examdatesheet/getclass/${exam_id}/${id}`).then(response => {
			this.setState({
				classList: response.data.data ? response.data.data :[],
				sectionList:[],
				subjectList:[],
				studentList:[],
				[inpt]: id,
				class_id:'',
				section_id:'',
				subject_id:'',
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
			studentList:[],
			[inpt]: id,
			class_id:'',
			section_id:'',
			subject_id:'',
		});
   }

}
handleClass(event){
	const inpt=event.target.name;
	const id = event.target.value;
	const exam_id = this.state.exam_id;
	const course_id = this.state.course_id;

	if(id !='')
	{
			axios.get(`${base_url}api`+`/examdatesheet/getsection/${exam_id}/${course_id}/${id}`).then(response => {
				this.setState({
					[inpt]:id,
					sectionList:response.data.data?response.data.data:[],
					subjectList:[],
					studentList:[],
					section_id:'',
					subject_id:'',
				});
			})
			.catch(error => {
			   console.log(error.message);
			})

	}
	else
	{
		this.setState({ [inpt]:id,section_id:'',subject_id:'',sectionList:[],subjectList:[],studentList:[] });
	}
}

handleSection(event){
	const inpt=event.target.name;
	const id = event.target.value;

	const exam_id = this.state.exam_id;
	const course_id = this.state.course_id;
	const class_id=this.state.class_id;

	if(id !='')
	{
		axios.get(`${base_url}api`+`/examdatesheet/getsubject/${exam_id}/${course_id}/${class_id}/${id}`).then(response => {

		this.setState({
				[inpt]:id,
				subjectList:response.data.data?response.data.data:[],
				studentList:[],
				subject_id:'',
			});
		})
		.catch(error => {
		   console.log(error.message);
		})

	}
	else
	{
		this.setState({ [inpt]:id,subject_id:'',subjectList:[],studentList:[] });
	}
}
handleSubject(event){

	const inpt=event.target.name;
	const id = event.target.value;

	let exam_id=(this.state.exam_id)?this.state.exam_id:'';
	let course_id=(this.state.course_id)?this.state.course_id:'';
	let class_id=(this.state.class_id)?this.state.class_id:'';
	let section_id=(this.state.section_id)?this.state.section_id:'';

	const url = `${base_url}api`+`/examdatesheet/getmark?exam_id=${exam_id}&course_id=${course_id}&class_id=${class_id}&section_id=${section_id}&subject_id=${id}`;

   if(id !='')
   {
		this.setState({
			showTable:true,
			[inpt]:id,
			api_url:url
		});
   }
   else
   {
	   this.setState({
			showTable:false,
			[inpt]:id,
			api_url:'',
			marklst:[]
		});
   }

}

handleTheory(event){
    event.preventDefault();

	let inp_id = event.target.id;
	let inp_name = event.target.name;
    // let inp_value = event.target.value?event.target.value:0;
    let inp_value = event.target.value !== '' ? event.target.value : '0';
	let theories=this.state.theoryarr;

	const maxmark = event.target.getAttribute("data-id");
	const markarr ={};
	const alertarr =[];
	const re = /^[0-9.\b]+$/;
	const arr=(inp_value.length>0)?inp_value.split('.'):[];

	if(re.test(inp_value) && (arr.length<=2) && parseFloat(inp_value)<=parseFloat(maxmark))
	{
		for(var key in theories)
		{
			markarr[key]=theories[key];
		}

        if (inp_value === '0' && event.nativeEvent.inputType !== 'deleteContentForward') {
            markarr[inp_id] = event.target.value;
        } else {
            markarr[inp_id] = isNaN(parseFloat(inp_value)) ? '' : inp_value;
        }
	}
	else
	{
		for(var key in theories)
		{
			markarr[key]=theories[key];
		}
		alertarr.push(parseInt(inp_id));
	}

	this.setState({ theoryarr:markarr,theoryalert:alertarr });

}

handleAssessment(event){
    event.preventDefault();

	let inp_id = event.target.id;
	let inp_name = event.target.name;
    // let inp_value = event.target.value?event.target.value:0;
    let inp_value = event.target.value !== '' ? event.target.value : '0';
	let assessments=this.state.assessmentarr;

	const markarr ={};
	const alertarr =[];
	const maxmark = event.target.getAttribute("data-id");
	const re = /^[0-9.\b]+$/;
	const arr=(inp_value.length>0)?inp_value.split('.'):[];

	if(re.test(inp_value) && (arr.length<=2) && parseFloat(inp_value)<=parseFloat(maxmark))
	{
		for(var key in assessments)
		{
			markarr[key]=assessments[key];
		}

		// markarr[inp_id]=(isNaN(parseFloat(inp_value)))?'':inp_value;
        if (inp_value === '0' && event.nativeEvent.inputType !== 'deleteContentForward') {
            markarr[inp_id] = event.target.value;
        } else {
            markarr[inp_id] = isNaN(parseFloat(inp_value)) ? '' : inp_value;
        }
	}
	else
	{
		for(var key in assessments)
		{
			markarr[key]=assessments[key];
		}
		alertarr.push(parseInt(inp_id));
	}

	this.setState({ assessmentarr:markarr,assesalert:alertarr });

}

handleInternal(event){
    event.preventDefault();

	let inp_id = event.target.id;
	let inp_name = event.target.name;
    // let inp_value = event.target.value?event.target.value:0;
    let inp_value = event.target.value !== '' ? event.target.value : '0';
	let internals=this.state.internalarr;

	const markarr ={};
	const alertarr =[];
	const maxmark = event.target.getAttribute("data-id");
	const re = /^[0-9.\b]+$/;
	const arr=(inp_value.length>0)?inp_value.split('.'):[];

	if(re.test(inp_value) && (arr.length<=2) && parseFloat(inp_value)<=parseFloat(maxmark))
	{
		for(var key in internals)
		{
			markarr[key]=internals[key];
		}

		// markarr[inp_id]=(isNaN(parseFloat(inp_value)))?'':inp_value;
        if (inp_value === '0' && event.nativeEvent.inputType !== 'deleteContentForward') {
            markarr[inp_id] = event.target.value;
        } else {
            markarr[inp_id] = isNaN(parseFloat(inp_value)) ? '' : inp_value;
        }
	}
	else
	{
		for(var key in internals)
		{
			markarr[key]=internals[key];
		}
		alertarr.push(parseInt(inp_id));
	}

	this.setState({ internalarr:markarr,intalert:alertarr });

}

handleMarkObtained(event){
    event.preventDefault();

	let inp_id = event.target.id;
	let inp_name = event.target.name;
    // let inp_value = event.target.value?event.target.value:0;
    let inp_value = event.target.value !== '' ? event.target.value : '0';
	let obts=this.state.obtarr;

	const markarr ={};
	const alertarr =[];
	const maxmark = event.target.getAttribute("data-id");
	const re = /^[0-9.\b]+$/;
	const arr=(inp_value.length>0)?inp_value.split('.'):[];

	if(re.test(inp_value) && (arr.length<=2) && parseFloat(inp_value)<=parseFloat(maxmark))
	{
		for(var key in obts)
		{
			markarr[key]=obts[key];
		}

		// markarr[inp_id]=(isNaN(parseFloat(inp_value)))?'':inp_value;
        if (inp_value === '0' && event.nativeEvent.inputType !== 'deleteContentForward') {
            markarr[inp_id] = event.target.value;
        } else {
            markarr[inp_id] = isNaN(parseFloat(inp_value)) ? '' : inp_value;
        }
	}
	else
	{
		for(var key in obts)
		{
			markarr[key]=obts[key];
		}
		alertarr.push(parseInt(inp_id));
	}

	this.setState({ obtarr:markarr,obtalert:alertarr });

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

	axios.get(`${base_url}api`+'/exam/listall').then(response => {
	this.setState({
			examList:response.data.data?response.data.data:[],
		});
	})
	.catch(error => {
	   console.log(error.message);
    })

}
formSubmit(event){
	event.preventDefault();

	let examid=(this.state.exam_id)?this.state.exam_id:'';
	let courseid=(this.state.course_id)?this.state.course_id:'';
	let classid=(this.state.class_id)?this.state.class_id:'';
	let sectionid=(this.state.section_id)?this.state.section_id:'';
	let subjectid=(this.state.subject_id)?this.state.subject_id:'';

	let theories=this.state.theorylst;
	let assessments=this.state.palst;
	let internals=this.state.internalst;
	let attendances=this.state.attendancelst;
	let students=this.state.marklst;
	let obts=this.state.obtst;


	var theoryarr={};
	var assessmentarr={};
	var internalarr={};
	var obtarr={};
	var attendancearr={};
	let idarr =[];

	for(var key in students) {
		if(students[key] !== null) {
			if(students[key].name=='max_mark[]') {
				idarr.push(parseInt(students[key].id));
			}
		}
	}

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
		if(assessments[key] !== null)
		{
			if(assessments[key].name=='assessment_mark[]')
			{
				assessmentarr[assessments[key].id]=assessments[key].value;
			}
		}
	}

	for(var key in internals)
	{
		if(internals[key] !== null)
		{
			if(internals[key].name=='internal_mark[]')
			{
				internalarr[internals[key].id]=internals[key].value;
			}
		}
	}

    for(var key in obts)
        {
            if(obts[key] !== null)
            {
                if(obts[key].name=='marks_obtained[]')
                {
                    obtarr[obts[key].id]=obts[key].value;
                }
            }
        }

	for(var key in attendances)
	{
		if(attendances[key] !== null)
		{
			if(attendances[key].name.includes("attendance") && attendances[key].checked)
			{
				attendancearr[attendances[key].id]=attendances[key].value;
			}
		}
	}

	let unique_arr = [];
	unique_arr=this.removeDuplicates(idarr);

	const data = {
		course_id:courseid,
		class_id:classid,
		section_id:sectionid,
		subject_id: subjectid,
		exam_id: examid,
		id_arr:unique_arr,
		theories:theoryarr,
		assessments:assessmentarr,
		internals:internalarr,
		obts:obtarr,
		attendances:attendancearr,
	}

	axios.post(`${base_url}api`+'/examdatesheet/addmark',data)
		.then(response => {
		// console.log(response.data);
		if (response.data.status === 'successed')
		{
			this.setState({ showError:false,showSuccess:true,message:response.data.message,errors:response.data.errors});
            // setTimeout(() => {
            //     window.location.href = base_url+"assign_subject_wise_marks";
            // },2000);
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
refreshTable() {
	this.serverTable.current.refreshData();
}

render() {


const isLoad = this.state.isLoading;

if (isLoad) {

//return null;

}


	const columns = ['roll_no','admission_no','student_name','max_mark','theory','assessment','internal','marks_obtained','attend'];
	let _this = this;
	const options = {
    perPage: 10,
    headings: {roll_no:'Roll No.',admission_no:'Admission No.',student_name:'Student Name',max_mark:'Maximum Marks',theory:'Theory Marks',assessment:'PA Marks',internal:'Internal Marks',marks_obtained:'Marks Obtained',attend:'Attendance'},
    sortable: ['roll_no','student_name'],
	columnsWidth: {roll_no:'75px',admission_no:'100px',student_name:'150px',max_mark:'75px',theory:'75px',assessment:'75px',internal:'75px',marks_obtained:'75px',attend:'150px'},
	columnsAlign: {roll_no:'center',student_name:'center'},
    requestParametersNames: {query:'search',direction:'order'},
    responseAdapter: function (resp_data)
	{
		_this.setState({marklst:[]});
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


	{/**********************************
		Content body start
	**************************************/}

	<div className="content-body">
	<div className="container-fluid">
		<div className="row page-titles mx-0">
			<div className="col-sm-6 p-md-0">
				<div className="welcome-text">
					<h4>Enter Subject Wise Marks</h4>
				</div>
			</div>
			<div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
			{/***}<ol className="breadcrumb">
					<li><a href={`/exam_date_sheet`} className="btn bg-blue-soft text-blue"><i className="fa fa-angle-double-left"></i> Back to Exam Date Sheet List</a></li>
			</ol>***/}
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

					<div className="form-row">

					  <div className="form-group col-md-4">
						<label>Exam Name</label>
						<select className={`form-control ${this.hasErrorFor('exam_id') ? 'is-invalid' : ''}`} name="exam_id" onChange={this.handleExam} value={this.state.exam_id}>
						  <option value="">Select Exam</option>
						  {this.state.examList.map( (item,key) => {
								return (
							  <option key={item.id} value={item.id}>{item.name}</option>
							  )
							})}
						</select>
						{this.renderErrorFor('exam_id')}
					  </div>

					  <div className="form-group col-md-4">
						<label>Course Name</label>
						<select className={`form-control ${this.hasErrorFor('course_id') ? 'is-invalid' : ''}`}  name="course_id" onChange={this.handleCourse} value={this.state.course_id}>
						  <option value="">--Select--</option>
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
						<select className={`form-control ${this.hasErrorFor('class_id') ? 'is-invalid' : ''}`} name="class_id" onChange={this.handleClass} value={this.state.class_id}>
						  <option value="">--Select--</option>
						  {this.state.classList.map( (item, key) => {
                                return (
                              <option key={item.classId} value={item.classId}>{item.className}</option>
                              )
                            })}
						</select>
						{this.renderErrorFor('class_id')}
					  </div>

					  <div className="form-group col-md-4">
						<label>Section Name</label>
						<select className={`form-control ${this.hasErrorFor('section_id') ? 'is-invalid' : ''}`} name="section_id" onChange={this.handleSection} value={this.state.section_id}>
						  <option value="">--Select--</option>
						  {this.state.sectionList.map( (item,key) => {
                                return (
                              <option key={item.sectionId} value={item.sectionId}>{item.sectionName}</option>
                              )
                            })}
						</select>
						{this.renderErrorFor('section_id')}
					  </div>

					  <div className="form-group col-md-4">
						<label>Subject Name</label>
						<select className={`form-control ${this.hasErrorFor('subject_id') ? 'is-invalid' : ''}`} name="subject_id" onChange={this.handleSubject} value={this.state.subject_id}>
						  <option value="">Select Subject</option>
						  {this.state.subjectList.map( (item,key) => {
								return (
							  <option key={item.subjectId} value={item.subjectId}>{item.subjectName}</option>
							  )
							})}
						</select>
						{this.renderErrorFor('subject_id')}
					  </div>

					  <div className="form-group col-md-6"></div>
					  {
						(this.state.showTable)?(
					  <div className="form-group col-md-12">

						  <div className="table-responsive assign_subject_wise_marks">
							<ServerTable ref={_this.serverTable} columns={columns} url={_this.state.api_url?_this.state.api_url:''} options={options} bordered condensed striped>
							{
								function (row,column)
								{
									let chk_attend='';

									if(_this.state.attendancearr.hasOwnProperty(row.id))
									{
										chk_attend=_this.state.attendancearr[row.id];
									}
									else if(row.attend==0)
									{
										chk_attend='present';
									}
									else
									{
										chk_attend=row.attend;
									}

									switch (column) {
										case 'max_mark':
											return (
												  <><input name="max_mark[]" type="text" id={row.id} aria-invalid="false" className="form-control" value={row.max_mark} ref={node =>_this.state.marklst.push(node)} readOnly={true}/></>
											  );
										case 'theory':
											return (
												  <><input name="theory_mark[]" type="text" id={row.id} data-id={row.theory_max} aria-invalid="false" className="form-control" value={(_this.state.theoryarr.hasOwnProperty(row.id))?_this.state.theoryarr[row.id]:row.theory_max} onChange={_this.handleTheory} ref={node =>_this.state.theorylst.push(node)}/>
												{
													_this.state.theoryalert.includes(row.id)?(
													<span style={{color: "red"}}>Maximum marks of Theory are not more than {row.theory_max}</span>
													):''
												 }</>
											  );
										case 'assessment':
											return (
												  <><input name="assessment_mark[]" type="text" id={row.id} data-id={row.assessment_max} aria-invalid="false" className="form-control" value={(_this.state.assessmentarr.hasOwnProperty(row.id))?_this.state.assessmentarr[row.id]:row.assessment_max} onChange={_this.handleAssessment} ref={node =>_this.state.palst.push(node)}/>
													{
														_this.state.assesalert.includes(row.id)?(
														<span style={{color: "red"}}>Maximum marks of PA are not more than {row.assessment_max}</span>
														):''
													 }</>
											  );
										case 'internal':
											return (
												  <><input name="internal_mark[]" type="text" id={row.id} data-id={row.internal_max} aria-invalid="false" className="form-control" value={(_this.state.internalarr.hasOwnProperty(row.id))?_this.state.internalarr[row.id]:row.internal_max} onChange={_this.handleInternal} ref={node =>_this.state.internalst.push(node)}/>
												 {
													_this.state.intalert.includes(row.id)?(
													<span style={{color: "red"}}>Maximum marks of Internal are not more than {row.internal_max}</span>
													):''
												 }</>
											  );
                                              case 'marks_obtained':
                                                return (
                                                    <><input name="marks_obtained[]" type="text" id={row.id} data-id={row.max_mark} aria-invalid="false" className="form-control" value={(_this.state.obtarr.hasOwnProperty(row.id))?_this.state.obtarr[row.id]:row.marks_obtained} onChange={_this.handleMarkObtained} ref={node =>_this.state.obtst.push(node)}/>
												 {
													_this.state.obtalert.includes(row.id)?(
													<span style={{color: "red"}}>Marks Obtained are not more than maximum marks</span>
													):''
												 }</>
                                                );
                                                // case 'attend':
                                                //     return (
                                                //       <select
                                                //         name={"attendance_" + row.id}
                                                //         id={row.id}
                                                //         aria-invalid="false"
                                                //         className="form-control"
                                                //         value={chk_attend}
                                                //         onChange={_this.handleAttendance}
                                                //         ref={node => _this.state.attendancelst.push(node)}
                                                //       >
                                                //         <option value="present">Present</option>
                                                //         <option value="absent">Absent</option>
                                                //         <option value="leave">Leave</option>
                                                //       </select>
                                                //     );

										case 'attend':
											return (
												  <><div className="radio">
                                                    <label><input type="radio" id={row.id} name={'attendance_'+row.id} checked={chk_attend==='present'} value="present" onChange={_this.handleAttendance} ref={node =>_this.state.attendancelst.push(node)}/>P</label>

													  <label><input type="radio" id={row.id} name={'attendance_'+row.id} checked={chk_attend==='absent'} value="absent" onChange={_this.handleAttendance} ref={node =>_this.state.attendancelst.push(node)}/>A</label>

													  <label><input type="radio" id={row.id} name={'attendance_'+row.id} checked={chk_attend==='leave'} value="leave" onChange={_this.handleAttendance} ref={node =>_this.state.attendancelst.push(node)}/>L</label>
													</div></>
											  );

										default:
											return (row[column]);
									}
								}
							}
							</ServerTable>
						</div>
					  </div>)
						: ''
					}
					</div>
					{/******* form-row ****/}
					<input type="submit" className="btn btn-primary" value="Save"/>
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

export default AssignSubjectWiseMarks;
