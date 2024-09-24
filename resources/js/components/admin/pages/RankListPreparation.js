import React, { Component } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Script from "@gumgum/react-script-tag";
import Copyright from "../basic/Copyright";
import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";
import { message } from "laravel-mix/src/Log";
import * as XLSX from 'xlsx';
const base_url=location.protocol+'//'+location.host+'/';

class RankListPreparation extends Component {

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
		  gradeList:[],
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
          isSpinner: false,
          isSpinner2: false,
	  }

	    this.handleChange = this.handleChange.bind(this);
	    this.handleCourse = this.handleCourse.bind(this);
	    this.handleExam = this.handleExam.bind(this);
	    this.handleClass = this.handleClass.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.loadStudent = this.loadStudent.bind(this);
        this.exportToExcel = this.exportToExcel.bind(this);
	    this.hasErrorFor = this.hasErrorFor.bind(this);
	    this.renderErrorFor = this.renderErrorFor.bind(this);

}

handleChange(event){
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });
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
			axios.get(`${base_url}api`+`/markreport/get_section_student/${exam_id}/${course_id}/${id}`).then(response => {
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

loadStudent = (event) => {
    event.preventDefault(); // Prevent the default form submission

    const { exam_id, course_id, class_id, section_id } = this.state; // Destructure the state
    let errors = {};

    if (!exam_id) errors.exam_id = 'The exam name field is required';
    if (!course_id) errors.course_id = 'The course name field is required';
    if (!class_id) errors.class_id = 'The class name field is required';
    if (!section_id) errors.section_id = 'The section name field is required';

    // If there are errors, set them in the state and prevent API call
    if (Object.keys(errors).length > 0) {
        this.setState({ errors, showError: true, showTable: false, message: 'Please fill out all fields.', showSuccess: false});
        return;
    }

    // Clear errors if validation passes
    this.setState({ errors: {}, showError: false });

    const url = `${base_url}api/markreport/getstudents/${exam_id}/${course_id}/${class_id}/${section_id}`;

    // Fetch student list data from the API
    this.setState({ isSpinner: true }, () => {
        axios.get(url).then(response => {
            console.log("student records",response.data.data)
            if (response.data.status === 'successed') {
                this.setState({
                    studentList: response.data.data?response.data.data :[],
                    showTable: true,
                    showError: false,
                    // showSuccess: true,
                    // message: 'Student list fetched successfully!',
                    isSpinner: false
                });
            } else {
                this.setState({
                    showError: true,
                    showSuccess: false,
                    message: response.data.message,
                    isSpinner: false,
                    showTable: false,
                });
            }
        })
        .catch(error => {
            console.error('Error fetching student list:', error);
            this.setState({
                showError: true,
                showSuccess: false,
                isSpinner: false,
                showTable: false,
                message: 'An error occurred while fetching the student list.',
            });
        });
    });
};

exportToExcel = () => {
    const { studentList, exam_id, course_id, class_id, section_id, examList, courseList, classList, sectionList } = this.state;
    const exam = examList.find((item) => item.id === parseInt(exam_id)) || {};
    const course = courseList.find((item) => item.courseId === parseInt(course_id)) || {};
    const classItem = classList.find((item) => item.classId === parseInt(class_id)) || {};
    const section = sectionList.find((item) => item.sectionId === parseInt(section_id)) || {};

    if (studentList.length === 0) {
        alert("No data available for export.");
        return;
    }

    // Prepare data for Excel
    const worksheetData = [];

    // Add exam details in the center
    worksheetData.push([
        `Exam: ${exam.name || 'N/A'}`,
        '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''
    ]);

    // Add course, class, and section details in the center
    worksheetData.push([
        `Course: ${course.courseName || 'N/A'}`,
        '',
        `Class: ${classItem.className || 'N/A'}`,
        '',
        `Section: ${section.sectionName || 'N/A'}`,
        '', '', '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '', '', '', '', '', '', ''
    ]);

    // Add header row
    const headers = [
        "Adm No.",
        "Name",
        "Roll No.",
        "M.M",
        ...this.getAllSubjects().map(subject => subject.subjectName),
        "Total",
        "%age",
        "Rank",
        "Grade"
    ];
    worksheetData.push(headers);

    // Add student data
    this.state.studentList.forEach(item => {
        const percent = (item.total_marks_obtained / item.total_max_marks) * 100;
        const percentage = Math.floor(percent);
        const grade = this.getGrade(percentage);
        const subjects = JSON.parse(item.subject_details);

        // Calculate rank
        const sortedStudentList = [...this.state.studentList].sort((a, b) => b.total_marks_obtained - a.total_marks_obtained);
        const rank = sortedStudentList.findIndex(student => student.admission_no === item.admission_no) + 1;

        // Map student data to row
        const row = [
            item.admission_no,
            item.student_name,
            item.roll_no,
            item.total_max_marks,
            ...this.getAllSubjects().map(subject => {
                const studentSubject = subjects.find(sub => sub.subjectId === subject.subjectId);
                return studentSubject ? studentSubject.marksObtained : 'N/A';
            }),
            item.total_marks_obtained,
            percent.toFixed(2),
            rank,
            grade
        ];

        worksheetData.push(row);
    });

    // Create a new workbook and add the worksheet
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Rank List Preparation");


    // Save the workbook
    XLSX.writeFile(wb, 'rank_list.xlsx');
};

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
renderErrorFor(field) {
    if (this.state.errors[field]) {
        return (
            <span className="invalid-feedback">
                <strong>{this.state.errors[field]}</strong>
            </span>
        );
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

	axios.get(`${base_url}api`+'/exam/list_avail').then(response => {
	this.setState({
			examList:response.data.data?response.data.data:[],
		});
	})
	.catch(error => {
	   console.log(error.message);
    })

    axios.get(`${base_url}api`+'/markreport/gradesAll').then(response => {
        // console.log("grades is ",response.data.data)
        this.setState({
            gradeList:response.data.data?response.data.data:[],
        });
    })
    .catch(error => {
        console.log(error.message);
    })

}
getGrade = (percentage) => {
    const { gradeList } = this.state;
    for (let grade of gradeList) {
        if (percentage >= grade.marksAbove && percentage <= grade.marksLess) {
            return grade.grade;
        }
    }
    return '-'; // Default if no grade is found
};

getAllSubjects() {
    // Collect all subjects across students
    const allSubjects = [];

    this.state.studentList.forEach(student => {
        console.log(student.subject_details);
        const subjects = JSON.parse(student.subject_details);
        subjects.forEach(subject => {
            if (!allSubjects.some(sub => sub.subjectId === subject.subjectId)) {
                allSubjects.push(subject);
            }
        });
    }); 

    // Sort subjects by subjectId
    allSubjects.sort((a, b) => a.subjectId - b.subjectId);

    return allSubjects;
}

// Helper functions
memoizedSubjects = () => {
    return this.getAllSubjects();  // Use useMemo if it's a functional component
}

memoizedStudentList = () => {
    const sortedList = this.state.studentList.sort((a, b) => b.total_marks_obtained - a.total_marks_obtained);
    return sortedList.map((item, index) => {
        return {
            ...item,
            rank: index + 1
        };
    });
}

calculateRank = (student) => {
    return this.memoizedStudentList().findIndex(item => item.admission_no === student.admission_no) + 1;
}
render() {


const isLoad = this.state.isLoading;

if (isLoad) {

//return null;

}

    return (
      <>

    <Preloader />

<div id="main-wrapper">

<HeaderPart />

	<div className="content-body">
	<div className="container-fluid">
		<div className="row page-titles mx-0">
			<div className="col-sm-6 p-md-0">
				<div className="welcome-text">
					<h4>Rank List Preparation</h4>
				</div>
			</div>
			<div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">

			</div>
		</div>
		{/**** row ***/}

		<div className="row">
		  <div className="col-xl-12 col-xxl-12">
			<div className="card">
			  <div className="card-body">
				<div className="basic-form form-own Create-Exam-Date">
				  <form>
					<div className="form-row">
					  <div className="form-group col-md-12">
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
						<select className={`form-control ${this.hasErrorFor('section_id') ? 'is-invalid' : ''}`} name="section_id" onChange={this.handleChange} value={this.state.section_id}>
						  <option value="">--Select--</option>
						  {this.state.sectionList.map( (item,key) => {
                                return (
                              <option key={item.sectionId} value={item.sectionId}>{item.sectionName}</option>
                              )
                            })}
						</select>
						{this.renderErrorFor('section_id')}
					  </div>

                        <div className="form-group col-md-12">
                            <div className="form-check settings-form-radio">
                                <input className="form-check-input" type="radio" name="list" value="rankWise" ref={this.input} defaultChecked/>
                                <label className="form-check-label">Rank-Wise List </label>
                                <input className="form-check-input" type="radio" name="list" value="rollNo" ref={this.input} />
                                <label className="form-check-label">Roll No-Wise List</label>
                            </div>
						</div>

                        <div className="form-group col-md-12">
                            <button type="button" className="btn btn-primary load-fee btn-sm" onClick={this.loadStudent} disabled={this.state.isSpinner}>Click Here to Prepare Rank List<span className="kt-spinner kt-spinner--sm kt-spinner--right kt-spinner--light" style={{ display: this.state.isSpinner ? 'inline' : 'none' }}></span></button>
                        </div>


                        {(this.state.studentList.length >0 && this.state.showTable)?(
                            <>
                            <div className="form-group col-md-12 mt-3">
                                <div className="print-id-card-table">
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-striped verticle-middle table-responsive-sm">
                                            <thead>
                                                <tr className="table-custom-th">
                                                    <th scope="col" style={{maxWidth:'140px'}}>Adm No.</th>
                                                    <th scope="col">Name</th>
                                                    <th scope="col">Roll No.</th>
                                                    <th scope="col">M.M</th>
													{/* {this.getAllSubjects().map((subject, index) => (
														<th scope="col" key={index}>{subject.subjectName}</th>
													))} */}
                                                    {this.memoizedSubjects().map((subject, index) => (
                                                        <th scope="col" key={index}>{subject.subjectName}</th>
                                                    ))}
                                                    <th scope="col">Total</th>
                                                    <th scope="col">%age</th>
                                                    <th scope="col">Rank</th>
                                                    <th scope="col">Grade</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {/* {this.state.studentList.map( (item,key) => {
                                                const percent = (item.total_marks_obtained / item.total_max_marks) * 100;
												const percentage = Math.floor(percent);
                                                const grade = this.getGrade(percentage);
												const subjects = JSON.parse(item.subject_details);

                                                // Calculate the rank based on total_marks_obtained
                                                const sortedStudentList = [...this.state.studentList].sort((a, b) => b.total_marks_obtained - a.total_marks_obtained);
                                                const rank = sortedStudentList.findIndex(student => student.admission_no === item.admission_no) + 1;

                                            return (
                                                <tr key={key}>
                                                    <td>{item.admission_no}</td>
                                                    <td>{item.student_name}</td>
                                                    <td>{item.roll_no}</td>
                                                    <td>{item.total_max_marks}</td>
													{this.getAllSubjects().map((subject, index) => {
														const studentSubject = subjects.find(sub => sub.subjectId === subject.subjectId);
														return (
															<td key={index}>
																{studentSubject ? studentSubject.marksObtained : 'N/A'}
															</td>
														);
													})}
                                                    <td>{item.total_marks_obtained}</td>
                                                    <td>{percent.toFixed(2)}</td>
                                                    <td>{rank}</td>
                                                    <td>{grade}</td>
                                                </tr>
                                                )
                                            })} */}
                                            {this.memoizedStudentList().map((item, key) => {
                                                const percent = (item.total_marks_obtained / item.total_max_marks) * 100;
                                                const percentage = Math.floor(percent);
                                                const grade = this.getGrade(percentage);
                                                const subjects = JSON.parse(item.subject_details);
                                                const rank = this.calculateRank(item);

                                                return (
                                                    <tr key={key}>
                                                        <td>{item.admission_no}</td>
                                                        <td>{item.student_name}</td>
                                                        <td>{item.roll_no}</td>
                                                        <td>{item.total_max_marks}</td>
                                                        {this.memoizedSubjects().map((subject, index) => {
                                                            const studentSubject = subjects.find(sub => sub.subjectId === subject.subjectId);
                                                            return (
                                                                <td key={index}>
                                                                    {studentSubject ? studentSubject.marksObtained : 'N/A'}
                                                                </td>
                                                            );
                                                        })}
                                                        <td>{item.total_marks_obtained}</td>
                                                        <td>{percent.toFixed(2)}</td>
                                                        <td>{rank}</td>
                                                        <td>{grade}</td>
                                                    </tr>
                                                )
                                            })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12 mb-3">
                                <div className="submit-btn form-own">
                                    <button type="button" className="btn btn-primary" disabled={this.state.isSpinner2} onClick={this.exportToExcel}> Export to Excel <span className="kt-spinner kt-spinner--sm kt-spinner--right kt-spinner--light" style={{ display: this.state.isSpinner2 ? 'inline' : 'none' }}></span></button>
                                </div>
                            </div>
                            </>
                        ): '' }
                        <div className="form-group col-md-12">
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
                        </div>
                    </div>{/******* form-row ****/}
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

export default RankListPreparation;
