// 11 sep- 12:17pm

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

class MarksListConsolidated extends Component {

  constructor(props) {
	  super(props)
	  this.state = {
          showErr:false,
	      delmessage: '',
          showError: false,
		  showSuccess: false,
		  showExam: false,
		  showTable: false,
		  isLoading:true,
		  subMsg:'',
		  exam_id:'',
		  course_id:'',
		  class_id:'',
		  section_id:'',
          sheet_id:'',
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
          studRemarks:[],
		  errors:{},
          isSpinner:false,
          isSpinner2:false,
          remarks:'',selectedExams: [], grade_by: '',
          finals: '', // Either 'percent', 'total', or empty
          showFinal: false // Flag to show/hide the final column
	  }

	  this.handleChange = this.handleChange.bind(this);
	  this.handleCourse = this.handleCourse.bind(this);
	  this.handleSection = this.handleSection.bind(this);
	  this.handleClass = this.handleClass.bind(this);
	  this.handleStudent = this.handleStudent.bind(this);
	  this.handleExamChange = this.handleExamChange.bind(this);
	  this.handleGradeChange = this.handleGradeChange.bind(this);
	  this.handleFinalChange = this.handleFinalChange.bind(this);
	  this.formSubmit = this.formSubmit.bind(this);
      this.loadStudent = this.loadStudent.bind(this);
      this.handlePrint = this.handlePrint.bind(this);
	  this.hasErrorFor = this.hasErrorFor.bind(this);
	  this.renderErrorFor = this.renderErrorFor.bind(this);
	  this.serverTable = React.createRef();

}

handleChange(event){
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });
}

handleCourse(event) {

	const inpt=event.target.name;
	const id = event.target.value;

   if(id !='')
   {
		axios.get(`${base_url}api`+`/class/getclassbycourse/${id}`).then(response => {
			this.setState({
				classList: response.data.data ? response.data.data :[],
				sectionList:[],
				subjectList:[],
				studentList:[],
                examList:[],
				[inpt]: id,
				class_id:'',
				section_id:'',
				student_id:'',
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
            examList:[],
			[inpt]: id,
			class_id:'',
			section_id:'',
			student_id:'',
		});
   }

}
handleClass(event){
	const inpt=event.target.name;
	const id = event.target.value;
	const course_id = this.state.course_id;

	if(id !='')
	{
			axios.get(`${base_url}api`+`/class/getsectionbyclassandcourse/${id}/${course_id}`).then(response => {
				this.setState({
					[inpt]:id,
					sectionList:response.data.data?response.data.data:[],
					subjectList:[],
					studentList:[],
                    examList:[],
					section_id:'',
					student_id:'',
				});
			})
			.catch(error => {
			   console.log(error.message);
			})

	}
	else
	{
		this.setState({ [inpt]:id,section_id:'',student_id:'',sectionList:[],subjectList:[],studentList:[], examList:[]});
	}
}

handleSection(event){
	const inpt=event.target.name;
	const id = event.target.value;
	const course_id = this.state.course_id;
	const class_id=this.state.class_id;

    const url = `${base_url}api`+`/markreport/getStudBySection/${course_id}/${class_id}/${id}`;

	if(id !='')
	{
		axios.get(url).then(response => {
		this.setState({
				[inpt]:id,
				subjectList:response.data.data?response.data.data:[],
				studentList:[],
                examList:[],
				student_id:'',
                // showTable:true,
			});
		})
		.catch(error => {
		   console.log(error.message);
		})

	}
	else
	{
		this.setState({ [inpt]:id,student_id:'',subjectList:[],studentList:[], examList:[],

            // showTable:false
        });
	}
}
handleStudent(event){

	const inpt=event.target.name;
	const id = event.target.value;
	let course_id=(this.state.course_id)?this.state.course_id:'';
	let class_id=(this.state.class_id)?this.state.class_id:'';
	let section_id=(this.state.section_id)?this.state.section_id:'';

	const url = `${base_url}api`+`/markreport/getExamByStudent/${course_id}/${class_id}/${section_id}/${id}`;

    if(id !='')
        {
            axios.get(url).then(response => {
                // console.log("student resp is", response.data.data)
                const examList = response.data.data ? response.data.data : [];
                const selectedExams = examList.map(exam => exam.exam_id);
                const grade_by = 'grades';

                this.setState({
                    [inpt]:id,
                    examList:examList,
                    selectedExams: selectedExams,
                    grade_by: grade_by,
                    showExam:true,
                    showError: false,
                    message: "",
                    showSuccess: false,
                    studentList:[]
                });
            })
            .catch(error => {
               console.log(error.message);
                this.setState({
                    showError: true,
                    message: "An error occurred while fetching data.",
                    showSuccess: false
                });
            })

        }
        else
        {
            this.setState({ [inpt]:id,examList:[],selectedExams:[], grade_by: '', showExam:false,showError: false, message: "", showSuccess: false, studentList:[] });
        }
}
handleExamChange = (event, exam_id) => {
    const { selectedExams } = this.state;
    const isChecked = event.target.checked;

    if (isChecked) {
      // Add the exam_id if checked
      this.setState({
        selectedExams: [...selectedExams, exam_id],
      }, () => console.log('Exams selected:', this.state.selectedExams));
    } else {
      // Remove the exam_id if unchecked
      this.setState({
        selectedExams: selectedExams.filter((id) => id !== exam_id),
      }, () => console.log('Exams selected:', this.state.selectedExams));
    }
};

handleGradeChange = (event) => {
    const isChecked = event.target.checked;
    this.setState({
        grade_by: isChecked ? 'grades' : 'no_grades'
    }, () => console.log('Grade By:', this.state.grade_by));
};

handleFinalChange = (event) => {
    this.setState({
        finals: event.target.value, // Set the selected value ('percent' or 'total')
    });
}
loadStudent = (event) => {
    event.preventDefault(); // Prevent the default form submission

    const { selectedExams, course_id, class_id, section_id, student_id, grade_by } = this.state;
    // console.log("Selected exam IDs:", selectedExams);
    // console.log("Course ID:", course_id, "Class ID:", class_id, "Section ID:", section_id, "Student ID:", student_id, "Grade: ",grade_by);

    let errors = {};
    if (!selectedExams.length) errors.exam_id = 'The exam name field is required';
    if (!course_id) errors.course_id = 'The course name field is required';
    if (!class_id) errors.class_id = 'The class name field is required';
    if (!section_id) errors.section_id = 'The section name field is required';
    if (!student_id) errors.student_id = 'The student name field is required';

    // If there are errors, set them in the state and prevent API call
    if (Object.keys(errors).length > 0) {
        this.setState({ errors, showError: true, showTable: false, message: 'Please fill out all fields.', showSuccess: false });
        return;
    }

    // Clear errors if validation passes
    this.setState({ errors: {}, showError: false });

    const examsString = selectedExams.join(',');
    const url = `${base_url}api/markreport/getAllSubjects/${examsString}/${course_id}/${class_id}/${section_id}/${student_id}`;

    // Fetch student list data from the API
    this.setState({ isSpinner: true }, () => {
        axios.get(url)
            .then(response => {
                if (response.data.status === 'successed') {
                    // console.log("studentList",response.data.data)
                    const showGrades = this.state.grade_by === 'grades';
                    const showFinal = this.state.finals !== '';

                    this.setState({
                        studentList: response.data.data || [],
                        showTable: true,
                        showError: false,
                        message: "",
                        showSuccess: false,
                        isSpinner: false,
                        showGrades: showGrades,
                        showFinal: showFinal,
                    });

                    // // Now fetch remarks based on the IDs
                    // if (studentList.length > 0) {
                    //     const sheet_id = studentList[0].sheet_id;
                    //     this.loadRemarks(sheet_id, exam_id, course_id, class_id, section_id, student_id);
                    // }
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
                    message: "Oops! something went wrong. Please try again later.",
                    showSuccess: false,
                    isSpinner: false,
                    showTable: false,
                    studentList: [],
                });
            });
    });
};

// New method to load remarks
loadRemarks = (sheet_id, exam_id, course_id, class_id, section_id, student_id) => {
    const remarksUrl = `${base_url}api/markreport/remarks?sheet_id=${sheet_id}&exam_id=${exam_id}&course_id=${course_id}&class_id=${class_id}&section_id=${section_id}&student_id=${student_id}`;

    axios.get(remarksUrl)
        .then(response => {
            const remarksData = response.data.data || [];
            const remark = remarksData.length > 0 ? remarksData[0].remarks : '';
            console.log("remarks is",remark)

            this.setState({
                studRemarks: remark,
            });
        })
        .catch(error => {
            console.log('Error fetching remarks:', error.message);
        });
};

handlePrint = (event,param) => {
	const type = event.currentTarget.id;
    const { selectedExams, course_id, class_id, section_id, student_id, grade_by,finals } = this.state;
    // console.log("grades",grade_by , "&finals: ",finals)

    const examsString = selectedExams.join(',');
    const url = `${base_url}api/markreport/consolidatedList/${examsString}/${course_id}/${class_id}/${section_id}/${student_id}`;

    this.setState({ isSpinner2: true }, () => {

        axios.get(url, {
            params: {
                grades: grade_by,
                finals: finals
            }
        }).then(response => {
            if (response.data.status === 'successed')
            {
                console.log("student consolidted pdf",response)
                var receipt =(typeof(response.data.data)!='object')?response.data.data:'';
                if(receipt !='')
                {
                    let a = document.createElement("a");
                    let url = base_url+'marks_report'+'/consolidated/'+receipt;
                    a.target='_blank';
                    a.href = url;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                }
                this.setState({showErr:false,delmessage:response.data.message,errors:response.data.errors,isSpinner2:false});
            }
            else
            {
                this.setState({showErr:true,delmessage:response.data.message,errors:response.data.errors,isSpinner2:false});
            }
        })
        .catch(error => {
        //console.log(error.message);
            console.log(error.response.data);
        })
    });
}

formSubmit(e) {
    e.preventDefault();
    const { remarks } = e.target

    let examid = this.state.exam_id || '';
    let courseid = this.state.course_id || '';
    let classid = this.state.class_id || '';
    let sectionid = this.state.section_id || '';
    let subjectid = this.state.student_id || '';
    let sheetid = this.state.studentList.length > 0 ? this.state.studentList[0].sheet_id : '';

    const data = {
		exam_id: examid,
		course_id:courseid,
		class_id:classid,
		section_id:sectionid,
		student_id: subjectid,
		sheet_id: sheetid,
        remarks:remarks.value
	}
    console.log("remark",data);
    // console.log("formData",formData);



    axios.post(`${base_url}api/markreport/updateRemark`, data)
    .then(response => {
        if (response.data.status === 'successed') {
            this.setState({
                showError: false,
                showSuccess: true,
                message: response.data.message,
                errors: {}, // Clear errors on success
            });
        } else {
            this.setState({
                showError: true,
                showSuccess: false,
                message: response.data.message,
                errors: response.data.errors || {}, // Use an empty object if no errors are returned
            });
        }
    })
    .catch(err => {
        console.log(err.message);
        console.log(err.response.data);
        this.setState({
            errors: err.response?.data?.errors || {}, // Handle any potential errors here
        });
    });


}
hasErrorFor = (field) => {
    return this.state.errors && !!this.state.errors[field];
};

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

    axios.get(`${base_url}api`+'/markreport/gradesAll').then(response => {
        this.setState({
            gradeList:response.data.data?response.data.data:[],
        });
    })
    .catch(error => {
        console.log(error.message);
    })

    axios.get(`${base_url}api`+'/class/getcourses').then(response => {
        this.setState({
                courseList: response.data.data ? response.data.data : [],
            });
        })
    .catch(error => {
        console.log(error.message);
    })

}




refreshTable() {
	this.serverTable.current.refreshData();
}

// Function to get the grade based on percentage
getGrade = (percentage) => {
    const { gradeList } = this.state;
    for (let grade of gradeList) {
        if (percentage >= grade.marksAbove && percentage <= grade.marksLess) {
            return grade.grade;
        }
    }
    return '-'; // Default if no grade is found
};

render() {


const isLoad = this.state.isLoading;

if (isLoad) {

//return null;

}

    const { studentList } = this.state;
    const subjectNames = JSON.parse(studentList?.subject_names || "[]");
    let overallTotalMarksObtained = 0;
    let overallTotalMaxMarks = 0;

    subjectNames.forEach((subject) => {
        const subjectDetails = studentList.exams.flatMap(exam => exam.subjectDetails).filter(detail => detail.subject_id === subject.id);

        const subjectTotalMarksObtained = subjectDetails.reduce((sum, detail) => sum + Number(detail.marks_obtained || 0), 0);
        const subjectTotalMaxMarks = subjectDetails.reduce((sum, detail) => sum + Number(detail.max_mark || 0), 0);

        overallTotalMarksObtained += subjectTotalMarksObtained;
        overallTotalMaxMarks += subjectTotalMaxMarks;
    });

    // Calculate overall final percentage
    const overallPercentage = (overallTotalMaxMarks > 0) ? (overallTotalMarksObtained / overallTotalMaxMarks) * 100 : 0;


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
					<h4>Marks List Consolidated</h4>
				</div>
			</div>
		</div>
		{/**** row ***/}

		<div className="row">
		  <div className="col-xl-12 col-xxl-12">
			<div className="card">
			  <div className="card-body">
				<div className="basic-form form-own Create-Exam-Date">
                <form onSubmit={this.formSubmit}>
					<div className="form-row">
					  <div className="form-group col-md-6">
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
					  <div className="form-group col-md-6">
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
					  <div className="form-group col-md-6">
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
					  <div className="form-group col-md-6">
						<label>Student Name</label>
						<select className={`form-control ${this.hasErrorFor('student_id') ? 'is-invalid' : ''}`} name="student_id" onChange={this.handleStudent} value={this.state.student_id}>
						  <option value="">Select Student</option>
						  {this.state.subjectList.map( (item,key) => {
								return (
							  <option key={item.id} value={item.id}>{item.student_name}</option>
							  )
							})}
						</select>
						{this.renderErrorFor('student_id')}
					  </div>

                      {(this.state.examList.length >0 && this.state.showExam)?(
                        <>
                            <div className="form-group col-md-12">
                                <label>Exams</label>
                                <div className="checkbox">
                                    {this.state.examList.map((item, index) => (
                                        <label key={item.exam_id} style={{ "marginRight" : "10px"}}>
                                            <input type="checkbox" id="exam_id" name="exam_id" value={item.exam_id} onChange={(e) => this.handleExamChange(e, item.exam_id)} checked={this.state.selectedExams.includes(item.exam_id)} />{" "} {item.exam_name}
                                        </label>
                                    ))}
                                </div>
                                {this.renderErrorFor('exam_id')}
                            </div>
                            <div className="form-group col-md-6">
                                <label>Calculate % by</label>
                                <div className="checkbox">
                                <label>
                                    <input
                                        type="checkbox"
                                        id="grade_by"
                                        name="grade_by"
                                        value="grades"
                                        checked={this.state.grade_by === 'grades'}
                                        onChange={this.handleGradeChange}
                                        style={{ "marginRight" : "4px"}}
                                    />
                                    Grades
                                </label>
                                </div>

                                {this.renderErrorFor('grade_by')}
                            </div>
                            <div className="form-group col-md-6">
                                <label>Final Result</label>
                                <div className="checkbox">
                                <label style={{ "marginRight" : "10px"}}>
                                    <input
                                        type="radio"
                                        name="finals"
                                        value="percent"
                                        onChange={this.handleFinalChange}
                                        checked={this.state.finals === 'percent'}
                                        style={{ "marginRight" : "4px"}}
                                    />
                                    Percentage
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="finals"
                                        value="total"
                                        onChange={this.handleFinalChange}
                                        checked={this.state.finals === 'total'}
                                        style={{ "marginRight" : "4px"}}
                                    />
                                    Marks Total
                                </label>
                                </div>
                            </div>
                            <div className="form-group col-md-12">
                                <button type="button" className="btn btn-primary load-fee btn-sm" onClick={this.loadStudent} disabled={this.state.isSpinner}>Show Details<span className="kt-spinner kt-spinner--sm kt-spinner--right kt-spinner--light" style={{ display: this.state.isSpinner ? 'inline' : 'none' }}></span></button>
                            </div>
                        </>
                        ): '' }

                        {(Object.keys(this.state.studentList).length > 0 && this.state.showTable)?(
                        <>
                            <div className="form-group col-md-12">
                                <div className="table-scrollable">
                                    <div id="mydivClass2" className="divClass3 form-group" style={{"overflow": "auto"}}>
                                        <div className="form-group" id="FirstList">
                                            <table className="table table-striped table-bordered table-checkable order-column full-width" id="marks">
                                                <thead>
                                                    <tr className="table-custom-th">
                                                        <th rowSpan="2">Subject Name</th>
                                                        {studentList.exams.map((exam, index) => (
                                                            <th key={index} colSpan={this.state.showGrades ? "3" : "2"} style={{"borderTop": "1px solid #D8D8D8"}}>{exam.exam_info.exam_name}</th>
                                                        ))}
                                                        {this.state.showFinal && <th>Final</th>}
                                                    </tr>
                                                    <tr className="table-custom-th">
                                                    {studentList.exams.map((exam, index) => (
                                                        <>
                                                        <th>Marks Obt.</th>
                                                        {this.state.showGrades && (
                                                            <th>Grade</th>
                                                        )}
                                                        <th>Max Marks</th>
                                                        </>
                                                    ))}
                                                    {this.state.showFinal && (
                                                        <th> {this.state.finals === 'percent' ? 'Percentage' : 'Total Marks'} </th>
                                                    )}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {subjectNames.map((subject, index) => {

                                                const subjectDetails = studentList.exams.flatMap(exam => exam.subjectDetails).filter(detail => detail.subject_id === subject.id); //Find subject details for the current subject

                                                const totalMarksObtained = subjectDetails.reduce((sum, detail) => sum + Number(detail.marks_obtained || 0), 0);
                                                const totalMaxMarks = subjectDetails.reduce((sum, detail) => sum + Number(detail.max_mark || 0), 0);
                                                const finalPercentage = (totalMaxMarks > 0) ? (totalMarksObtained / totalMaxMarks) * 100 : 0;

                                                    return (
                                                    <tr key={index} id={subject.id}>
                                                        <td id={subject.id}>{subject.name}</td>
                                                        {studentList.exams.map((exam, examIndex) => {
                                                            const detail = subjectDetails.find(d => d.exam_id === exam.exam_info.exam_id) || {};
                                                            const percentage = (detail.marks_obtained / detail.max_mark) * 100;
                                                            const grade = this.getGrade(percentage);

                                                            return (
                                                                <>
                                                                    <td>{detail.marks_obtained || '-'}</td>
                                                                    {this.state.showGrades && (
                                                                    <td>{grade}</td>
                                                                    )}
                                                                    <td>{detail.max_mark || '-'}</td>
                                                                </>
                                                            );
                                                        })}
                                                        {this.state.showFinal && (
                                                            <td>
                                                            {this.state.finals === 'percent'
                                                                ? finalPercentage.toFixed(2) + '%'
                                                                : `${totalMarksObtained} / ${totalMaxMarks}`}
                                                            </td>
                                                        )}
                                                    </tr>
                                                    );
                                                })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group col-md-12">
                                <div className="print-id-card-table">
                                    <h2>Scholastic Total</h2>
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-striped verticle-middle table-responsive-sm">
                                            <thead>
                                                <tr>
                                                    <th scope="col" style={{maxWidth:'150px'}}>Total Marks Obtained</th>
                                                    <th scope="col">Total Maximum Marks</th>
                                                    <th scope="col">Percentage</th>
                                                    {this.state.showGrades && (
                                                    <th scope="col">Overall Grade</th>
                                                    )}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{overallTotalMarksObtained}</td>
                                                    <td>{overallTotalMaxMarks}</td>
                                                    <td>{isNaN(overallPercentage) ? '-' : overallPercentage.toFixed(2)}%</td>
                                                    {this.state.showGrades && (
                                                    <td>{this.getGrade((overallTotalMarksObtained / overallTotalMaxMarks) * 100)}</td>
                                                    )}
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group col-md-12 text-right">
                                <button type="button" className="btn btn-danger mr-2"  onClick={(e) => this.handlePrint(e,`${this.state.student_id}`)} id="normal" disabled={this.state.isSpinner2}>Print <span className="kt-spinner kt-spinner--sm kt-spinner--right kt-spinner--light" style={{ display: this.state.isSpinner2 ? 'inline' : 'none' }}></span></button>
                                {/* <button type="submit" className="btn btn-success">Save Remark</button> */}
                            </div>
                        </>
                        ): null }


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
                        <div className="text-center">
                        {this.state.showErr ?
							 <div className="alert alert-danger" style={{color:"brown"}}>
								<strong>{this.state.delmessage}</strong>
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

export default MarksListConsolidated;
