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

class RegularMarksReport extends Component {

  constructor(props) {
	  super(props)
	  this.state = {
          showErr:false,
	      delmessage: '',
          showError: false,
		  showSuccess: false,
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
		  attendancearr:[],
		  attendancelst:[],
		  marklst:[],
		  errors:{},
          isSpinner:false,
          isSpinner2:false,
          remarks:''
	  }

	  this.handleChange = this.handleChange.bind(this);
	  this.handleAttendance = this.handleAttendance.bind(this);
	  this.handleCourse = this.handleCourse.bind(this);
	  this.handleExam = this.handleExam.bind(this);
	  this.handleSection = this.handleSection.bind(this);
	  this.handleClass = this.handleClass.bind(this);
	  this.handleSubject = this.handleSubject.bind(this);
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

    const url = `${base_url}api`+`/examdatesheet/getstudents/${exam_id}/${course_id}/${class_id}/${id}`;

	if(id !='')
	{
		axios.get(url).then(response => {
		this.setState({
				[inpt]:id,
				subjectList:response.data.data?response.data.data:[],
				studentList:[],
				subject_id:'',
                // showTable:true,
			});
		})
		.catch(error => {
		   console.log(error.message);
		})

	}
	else
	{
		this.setState({ [inpt]:id,subject_id:'',subjectList:[],studentList:[],
            // showTable:false
        });
	}
}
handleSubject(event){

	const inpt=event.target.name;
	const id = event.target.value;

	let exam_id=(this.state.exam_id)?this.state.exam_id:'';
	let course_id=(this.state.course_id)?this.state.course_id:'';
	let class_id=(this.state.class_id)?this.state.class_id:'';
	let section_id=(this.state.section_id)?this.state.section_id:'';

	const url = `${base_url}api`+`/examdatesheet/allSubject/${exam_id}/${course_id}/${class_id}/${section_id}/${id}`;

    if(id !='')
        {
            axios.get(url).then(response => {
                // console.log("student resp is", response.data.data)
            this.setState({
                    [inpt]:id,
                    studentList:response.data.data?response.data.data:[],
                    showTable:true,
                    showError: false,
                    message: "",
                    showSuccess: false
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
            this.setState({ [inpt]:id,studentList:[],showTable:false,showError: false, message: "", showSuccess: false });
        }
}

loadStudent = (event) => {
    event.preventDefault(); // Prevent the default form submission

    const { exam_id, course_id, class_id, section_id, subject_id } = this.state; // Destructure the state
    let errors = {};

    // Validate required fields
    if (!exam_id) errors.exam_id = 'The exam name field is required';
    if (!course_id) errors.course_id = 'The course name field is required';
    if (!class_id) errors.class_id = 'The class name field is required';
    if (!section_id) errors.section_id = 'The section name field is required';
    if (!subject_id) errors.subject_id = 'The student name field is required';

    // If there are errors, set them in the state and prevent API call
    if (Object.keys(errors).length > 0) {
        this.setState({ errors, showError: true, showTable: false, message: 'Please fill out all fields.', showSuccess: false });
        return;
    }

    // Clear errors if validation passes
    this.setState({ errors: {}, showError: false });

    const url = `${base_url}api/examdatesheet/allSubject/${exam_id}/${course_id}/${class_id}/${section_id}/${subject_id}`;

    // Fetch student list data from the API
    this.setState({ isSpinner: true }, () => {
        axios.get(url)
            .then(response => {
                if (response.data.status === 'successed') {
                    const studentList = response.data.data || [];
                    this.setState({
                        studentList,
                        showTable: true,
                        showError: false,
                        message: "",
                        showSuccess: false,
                        isSpinner: false
                    });

                    // Now fetch remarks based on the IDs
                    if (studentList.length > 0) {
                        const sheet_id = studentList[0].sheet_id;
                        this.loadRemarks(sheet_id, exam_id, course_id, class_id, section_id, subject_id);
                    }
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
loadRemarks = (sheet_id, exam_id, course_id, class_id, section_id, subject_id) => {
    const remarksUrl = `${base_url}api/markreport/remarks?sheet_id=${sheet_id}&exam_id=${exam_id}&course_id=${course_id}&class_id=${class_id}&section_id=${section_id}&subject_id=${subject_id}`;

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
    const { studRemarks,sheet_id,exam_id,course_id,class_id,section_id,subject_id } = this.state;
    let examid = this.state.exam_id || '';
    let courseid = this.state.course_id || '';
    let classid = this.state.class_id || '';
    let sectionid = this.state.section_id || '';
    let subjectid = this.state.subject_id || '';
    let sheetid = this.state.studentList.length > 0 ? this.state.studentList[0].sheet_id : '';
    // console.log("print type remarks",studRemarks)
    this.setState({ isSpinner2: true }, () => {
        const url = `${base_url}api/markreport/printstudent/${param}`;

        axios.get(url, {
            params: { // Pass any additional parameters here
                // remarks: studRemarks,
                sheet_id: sheetid,
                exam_id: examid,
                course_id: courseid,
                class_id: classid,
                section_id: sectionid,
                student_id: subjectid
            }
        }).then(response => {
            if (response.data.status === 'successed')
            {
                // console.log("student pdf",response)
                var receipt =(typeof(response.data.data)!='object')?response.data.data:'';
                if(receipt !='')
                {
                    let a = document.createElement("a");
                    let url = base_url+'marks_report'+'/regular/'+receipt;
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
    let subjectid = this.state.subject_id || '';
    let sheetid = this.state.studentList.length > 0 ? this.state.studentList[0].sheet_id : '';

    const data = {
		exam_id: examid,
		course_id:courseid,
		class_id:classid,
		section_id:sectionid,
		subject_id: subjectid,
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
    return 'N/A'; // Default if no grade is found
};

render() {


const isLoad = this.state.isLoading;

if (isLoad) {

//return null;

}

    const { studentList } = this.state;

    // Calculate total maximum marks and total marks obtained
    const totalMaxMarks = studentList.reduce((acc, item) => acc + parseFloat(item.max_mark), 0);
    const totalMarksObtained = studentList.reduce((acc, item) => acc + parseFloat(item.marks_obtained), 0);

    const firstSheetId = this.state.studentList.length > 0 ? this.state.studentList[0].sheet_id : '';

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
					<h4>Marks Report</h4>
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
						<select className={`form-control ${this.hasErrorFor('subject_id') ? 'is-invalid' : ''}`} name="subject_id" onChange={this.handleChange} value={this.state.subject_id}>
						  <option value="">Select Student</option>
						  {this.state.subjectList.map( (item,key) => {
								return (
							  <option key={item.id} value={item.id}>{item.student_name}</option>
							  )
							})}
						</select>
						{this.renderErrorFor('subject_id')}
					  </div>
                        <div className="form-group col-md-6">
							<label>Calculate by</label>
							<input type="number" step="0.01" className={`form-control ${this.hasErrorFor('calculate_by') ? 'is-invalid' : ''}`} name="calculate_by" ref={this.input}/>
							{this.renderErrorFor('calculate_by')}
						</div>
                        <div className="form-group col-md-12">
                            <button type="button" className="btn btn-primary load-fee btn-sm" onClick={this.loadStudent} disabled={this.state.isSpinner}>Show Details<span className="kt-spinner kt-spinner--sm kt-spinner--right kt-spinner--light" style={{ display: this.state.isSpinner ? 'inline' : 'none' }}></span></button>
                        </div>


                        {(this.state.studentList.length >0 && this.state.showTable)?(
                        <>
                            <div className="form-group col-md-12 mt-3">
                                <div className="print-id-card-table">
                                    <input type="hidden" name="sheet_id" value={firstSheetId} />
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-striped verticle-middle table-responsive-sm">
                                            <thead>
                                                <tr className="table-custom-th">
                                                    <th scope="col" style={{maxWidth:'140px'}}>Subject Name</th>
                                                    <th scope="col">Max Marks</th>
                                                    <th scope="col">Marks Obtained</th>
                                                    <th scope="col">Grade</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {this.state.studentList.map((item,key) => {
                                                const percentage = (item.marks_obtained / item.max_mark) * 100;
                                                const grade = this.getGrade(percentage);
                                            return (
                                                <tr key={key}>
                                                    <td>{item.subjectName}</td>
                                                    <td>{item.max_mark}</td>
                                                    <td>{item.marks_obtained}</td>
                                                    <td>{grade}</td>
                                                </tr>
                                                )
                                            })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group col-md-12 mt-3">
                                <div className="print-id-card-table">
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-striped verticle-middle table-responsive-sm">
                                            <thead>
                                                <tr>
                                                    <th scope="col" style={{maxWidth:'140px'}}>Total Maximum Marks</th>
                                                    <th scope="col">Total Marks Obtained</th>
                                                    <th scope="col">Overall Grade</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{totalMaxMarks.toFixed(2)}</td>
                                                    <td>{totalMarksObtained.toFixed(2)}</td>
                                                    {/* <td>{overallGrade}</td> */}
                                                    <td>{this.getGrade((totalMarksObtained / totalMaxMarks) * 100)}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group col-md-12">
                                <label>Remarks</label>
                                <input type="text" className={`form-control ${this.hasErrorFor('remarks') ? 'is-invalid' : ''}`} name="remarks" ref={this.input} placeholder="Remark" value={this.state.studRemarks} onChange={(e) => this.setState({ studRemarks: e.target.value })}/>
                                {this.renderErrorFor('remarks')}
					        </div>
                            <div className="form-group col-md-12 text-right">
                                <button type="button" className="btn btn-danger mr-2"  onClick={(e) => this.handlePrint(e,`${this.state.subject_id}`)} id="normal" disabled={this.state.isSpinner2}>Print <span className="kt-spinner kt-spinner--sm kt-spinner--right kt-spinner--light" style={{ display: this.state.isSpinner2 ? 'inline' : 'none' }}></span></button>
                                <button type="submit" className="btn btn-success">Save Remark</button>
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

export default RegularMarksReport;
