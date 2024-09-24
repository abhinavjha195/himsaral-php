import React, { Component } from "react";
import axios from 'axios';
import Script from "@gumgum/react-script-tag";
import Copyright from "../basic/Copyright";
import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url=location.protocol+'//'+location.host+'/';

class CompiledSheet extends Component {
  constructor() {
    super();
    this.state = {
		showError: false,
		showSuccess:false,
        showExam: false,
		showTable: false,
		isLoading:true,
        isSpinner:false,
        courseList:[],
        courseList2:[],
        classList:[],
        classList2:[],
        sectionList:[],
        sectionList2:[],
        exam_id:'',
        exam_id2:'',
        course_id:'',
        course_id2:'',
        class_id:'',
        section_id:'',
        section_id2:'',
        student_id: '',
		messgae:'',
		tab_id:'compiledSheet',
		errors:[],
		examList:[],
        examList2:[],
        selectedExams: [],
        finals: '',
        grade_by: '',
        studentList:[],
        studentList2:[],
        subjectList2:[],
        gradeList:[],
    };
	this.handleChange = this.handleChange.bind(this);
	this.handleTab = this.handleTab.bind(this);
    this.handleCourse = this.handleCourse.bind(this);
    this.handleCourse2 = this.handleCourse2.bind(this);
    this.handleClass = this.handleClass.bind(this);
     this.handleClass2 = this.handleClass2.bind(this);
    this.handleSection = this.handleSection.bind(this);
    this.handleSection2 = this.handleSection2.bind(this);
	this.handleExamChange = this.handleExamChange.bind(this);
    this.handleExamChange2 = this.handleExamChange2.bind(this);
    this.handleGradeChange = this.handleGradeChange.bind(this);
    this.handleFinalChange = this.handleFinalChange.bind(this);
    this.loadStudent = this.loadStudent.bind(this);
    this.loadStudent2 = this.loadStudent2.bind(this);
    //
     this.handlePrint2 = this.handlePrint2.bind(this);

    // this.formSubmit = this.formSubmit.bind(this);
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
		});
   }

}



handlePrint2 = (event) => {
	
    // console.log("print type remarks",studRemarks)
    this.setState({ isSpinner2: true }, () => {
        const url = `${base_url}api/markreport/printstudentall/`;

        axios.get(url, {
            params: { // Pass any additional parameters here
                // remarks: studRemarks,
                // sheet_id: sheetid,
                exam_id: this.state.exam_id2,
                course_id: this.state.course_id2,
                class_id: this.state.class_id2,
                section_id: this.state.section_id2,
               
            }
        }).then(response => {
            if (response.data.status === 'successed')
            {
                // // console.log("student pdf",response)
                // var receipt =(typeof(response.data.data)!='object')?response.data.data:'';
                // if(receipt !='')
                // {
                //     let a = document.createElement("a");
                //     let url = base_url+'marks_report'+'/all_marks/'+receipt;
                //     a.target='_blank';
                //     a.href = url;
                //     document.body.appendChild(a);
                //     a.click();
                //     document.body.removeChild(a);
                // }
                // this.setState({showErr:false,isSpinner2:false});

                // console.log('abc');
            }
            else
            {
                // this.setState({showErr:true,delmessage:response.data.message,errors:response.data.errors,isSpinner2:false});
                console.log('abcd');
            }
        })
        .catch(error => {
        //console.log(error.message);
            console.log(error.response.data);
        })
    });
}



handleCourse2(event) {

	const inpt=event.target.name;
	const id = event.target.value;
	const exam_id = this.state.exam_id2;

   if(id !='')
   {
		axios.get(`${base_url}api`+`/examdatesheet/getclass/${exam_id}/${id}`).then(response => {
			this.setState({
				classList2: response.data.data ? response.data.data :[],

               
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
			classList2:[],
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
				});
			})
			.catch(error => {
			   console.log(error.message);
			})

	}
	else
	{
		this.setState({ [inpt]:id,section_id:'',sectionList:[],subjectList:[],studentList:[], examList:[]});
	}
}





handleClass2(event){
	const inpt=event.target.name;
	const id = event.target.value;
	const course_id = this.state.course_id2;

	if(id !='')
	{
			axios.get(`${base_url}api`+`/class/getsectionbyclassandcourse/${id}/${course_id}`).then(response => {
				this.setState({
					[inpt]:id,
					sectionList2:response.data.data?response.data.data:[],
					
					
				});
			})
			.catch(error => {
			   console.log(error.message);
			})

	}
	else
	{
		this.setState({ [inpt]:id,section_id:'',sectionList2:[], examList2:[]});
	}
}











handleSection(event){
	const inpt=event.target.name;
	const id = event.target.value;
	const course_id = this.state.course_id;
	const class_id=this.state.class_id;

    const url = `${base_url}api`+`/markreport/getCompiledExam/${course_id}/${class_id}/${id}`;

	if(id !='')
	{
		axios.get(url).then(response => {
            const examList = response.data.data ? response.data.data : [];
            const selectedExams = examList.map(exam => exam.exam_id);
            const grade_by = 'grades';

		    this.setState({
				[inpt]:id,
				examList:examList,
                selectedExams: selectedExams,
                grade_by: grade_by,
				studentList:[],
                showExam:true,
			});
		})
		.catch(error => {
		   console.log(error.message);
		})

	}
	else
	{
		this.setState({ [inpt]:id,subjectList:[],studentList:[], examList:[], showExam:false, selectedExams:[], grade_by: '',});
	}
}








handleSection2(event){
    const inpt=event.target.name;
	const id = event.target.value;
	const course_id = this.state.course_id2;
	const class_id=this.state.class_id2;

    const url = `${base_url}api`+`/markreport/getCompiledExam/${course_id}/${class_id}/${id}`;

	if(id !='')
	{
		axios.get(url).then(response => {
            const examList = response.data.data ? response.data.data : [];
            const selectedExams = examList.map(exam => exam.exam_id);
            const grade_by = 'grades';

		    this.setState({
				[inpt]:id,
				examList2:examList,
                selectedExams: selectedExams,
                grade_by: grade_by,
				studentList2:[],
                showExam:true,
			});
		})
		.catch(error => {
		   console.log(error.message);
		})

	}
	else
	{
		this.setState({ [inpt]:id,subjectList2:[],studentList2:[], examList2:[], showExam:false, selectedExams:[], grade_by: '',});
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





handleExamChange2(event) {

	const inpt=event.target.name;
	const id = event.target.value;

   if(id !='')
   {
		axios.get(`${base_url}api`+`/examdatesheet/getcourse/${id}`).then(response => {
			this.setState({
				courseList2: response.data.data ? response.data.data :[],
                [inpt]: id,
				
			});
		})
		.catch(error => {
		    console.log(error.message);
		})
   }
   else
   {
	   this.setState({
			courseList2:[],
            [inpt]: id,
			
		});
   }

}













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

    const { selectedExams, course_id, class_id, section_id, grade_by } = this.state;

    let errors = {};
    if (!selectedExams.length) errors.exam_id = 'The exam name field is required';
    if (!course_id) errors.course_id = 'The course name field is required';
    if (!class_id) errors.class_id = 'The class name field is required';
    if (!section_id) errors.section_id = 'The section name field is required';

    // If there are errors, set them in the state and prevent API call
    if (Object.keys(errors).length > 0) {
        this.setState({ errors, showError: true, showTable: false, message: 'Please fill out all fields.', showSuccess: false });
        return;
    }

    // Clear errors if validation passes
    this.setState({ errors: {}, showError: false });

    const examsString = selectedExams.join(',');
    const url = `${base_url}api/markreport/compliedAllStudents/${examsString}/${course_id}/${class_id}/${section_id}`;

    this.setState({ isSpinner: true }, () => {
        axios.get(url)
            .then(response => {
                if (response.data.status === 'successed') {
                    // console.log("studentList",response.data.data)
                    const showGrades = this.state.grade_by === 'grades';
                    const showFinal = this.state.finals !== '';

                    this.setState({
                        studentList: response.data.data?response.data.data:[],
                        showTable: true,
                        showError: false,
                        message: "",
                        showSuccess: false,
                        isSpinner: false,
                        showGrades: showGrades,
                        showFinal: showFinal,
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
                    message: "Oops! something went wrong. Please try again later.",
                    showSuccess: false,
                    isSpinner: false,
                    showTable: false,
                    studentList: [],
                });
            });
    });
};








loadStudent2 = (event) => {
    event.preventDefault(); // Prevent the default form submission



    const inpt=event.target.name;
	const id = event.target.value;
	


		    this.setState({
				[inpt]:id,
				
			});
		













    const { exam_id2, course_id2, class_id2, section_id2, grade_by } = this.state;

    let errors = {};
    if (!exam_id2) errors.exam_id2 = 'The exam name field is required';
    if (!course_id2) errors.course_id2 = 'The course name field is required';
    if (!class_id2) errors.class_id2 = 'The class name field is required';
    // if (!section_id2) errors.section_id2 = 'The section name field is required';

    // If there are errors, set them in the state and prevent API call
    if (Object.keys(errors).length > 0) {
        this.setState({ errors, showError: true, showTable: false, message: 'Please fill out all fields.', showSuccess: false });
        return;
    }

    // Clear errors if validation passes
    this.setState({ errors: {}, showError: false });

    // const examsString = selectedExams2.join(',');
    const url = `${base_url}api`+`/examdatesheet/compiledsheetMarks/${exam_id2}/${course_id2}/${class_id2}/${id}`;
    const url2 = `${base_url}api`+`/subject_list`;

    this.setState({ isSpinner: true }, () => {



        axios.get(url2)
        .then(response => {
            if (response.data.status === 'true') {
                // console.log("studentList",response.data.data)
                const showGrades = this.state.grade_by === 'grades';
                const showFinal = this.state.finals !== '';

                console.log('response.data.data',response.data.data);

//                     const exams = response.data.data.exams || [];
// const studentList2 = exams.length > 0 ? exams[0].studentDetails : [];


                this.setState({
                    subjectList2: response.data.data.data?response.data.data.data:[],
                   
                });
            } else {
                this.setState({
                    subjectList2: [],
                });
            }
        })
        .catch(error => {
            console.error('Error fetching student list:', error);
            this.setState({
               
                subjectList2: [],
            });
        });
















        
        axios.get(url)
            .then(response => {
                if (response.data.status === 'successed') {
                    // console.log("studentList",response.data.data)
                    const showGrades = this.state.grade_by === 'grades';
                    const showFinal = this.state.finals !== '';

                    console.log('response.data.data',response.data.data);

//                     const exams = response.data.data.exams || [];
// const studentList2 = exams.length > 0 ? exams[0].studentDetails : [];


                    this.setState({
                        studentList2: response.data.data?response.data.data:[],
                        showTable: true,
                        showError: false,
                        message: "",
                        showSuccess: false,
                        isSpinner: false,
                        showGrades: showGrades,
                        showFinal: showFinal,
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
                    message: "Oops! something went wrong. Please try again later.",
                    showSuccess: false,
                    isSpinner: false,
                    showTable: false,
                    studentList2: [],
                });
            });
    });
};


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

    axios.get(`${base_url}api`+'/class/getcourses').then(response => {
        this.setState({
                courseList: response.data.data ? response.data.data : [],
            });
        })
    .catch(error => {
        console.log(error.message);
    })


    axios.get(`${base_url}api`+'/exam/list_avail').then(response => {
        this.setState({
                examList2:response.data.data?response.data.data:[],
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

// Function to get the grade based on percentage
getGrade = (percentage) => {
    console.log(percentage,'percentage');
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
    const student_details = JSON.parse(studentList?.studentDetails || "[]");
    let overallTotalMarksObtained = 0;
    let overallTotalMaxMarks = 0;
    let overallPercentage = 0;

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
                <h4>Compiled Sheet</h4>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xl-12 col-lg-12 col-md-12">
              <div className="profile-tab">
                <div className="custom-tab-1">
                  <ul className="nav nav-tabs">
                    <li className="nav-item"><a href="#compiledSheet" onClick={(e) => this.handleTab(e,'compiledSheet')} data-toggle="tab" className="nav-link active show"> <i className="fa fa-user"></i> Marks Report - Individual Exam (Complete Class)</a></li> 
                    <li className="nav-item"><a href="#classwise-consolidated" onClick={(e) => this.handleTab(e,'classwise_consolidated')}  data-toggle="tab" className="nav-link"> <i className="fa fa-users"></i> Marks Report - Consolidated Exam (Complete Class)</a></li>
                  </ul>
                  <div className="tab-content">
                    <div id="compiledSheet" className="tab-pane fade active show">
                      <div className="pt-3">
                        <div className="settings-form">
                          <div className="row">
                            <div className="col-xl-12 col-lg-12 col-md-12">
                              <div className="card">
                                <div className="card-body">
                                  <div className="basic-form form-own">
                                    <form>
                                        <div className="form-row">
                                            {/* <h4>compiled sheet data</h4> */}
                                        </div>


									   <div className="profile-tab-btn">
                                        
  <form onSubmit={this.formSubmit}>
					<div className="form-row">
					  <div className="form-group col-md-12">
						<label>Exam Name</label>
						<select className={`form-control ${this.hasErrorFor('exam_id') ? 'is-invalid' : ''}`} name="exam_id2" onChange={this.handleExamChange2} value={this.state.exam_id2}>
						  <option value="">Select Exam</option>
						  {this.state.examList2.map( (item,key) => {
								return (
							  <option key={item.id} value={item.id}>{item.name}</option>
							  )
							})}
						</select>
						{this.renderErrorFor('exam_id')}
					  </div>
					  <div className="form-group col-md-4">
						<label>Course Name</label>
						<select className={`form-control ${this.hasErrorFor('course_id') ? 'is-invalid' : ''}`}  name="course_id2" onChange={this.handleCourse2} value={this.state.course_id2}>
						  <option value="">--Select--</option>
						  {this.state.courseList2.map( (item,key) => {
							return (
								<option key={item.courseId} value={item.courseId}>{item.courseName}</option>
							)
						  })}
						</select>
						{this.renderErrorFor('course_id')}
					  </div>
					  <div className="form-group col-md-4">
						<label>Class Name</label>
						<select className={`form-control ${this.hasErrorFor('class_id2') ? 'is-invalid' : ''}`} name="class_id2" onChange={this.handleClass2} value={this.state.class_id2}>
						  <option value="">--Select--</option>
						  {this.state.classList2.map( (item, key) => {
                                return (
                              <option key={item.classId} value={item.classId}>{item.className}</option>
                              )
                            })}
						</select>
						{this.renderErrorFor('class_id2')}
					  </div>
					  <div className="form-group col-md-4">
						<label>Section Name</label>
						<select className={`form-control ${this.hasErrorFor('section_id2') ? 'is-invalid' : ''}`} name="section_id2" onChange={this.loadStudent2} value={this.state.section_id2}>
						  <option value="">--Select--</option>
						  {this.state.sectionList2.map( (item,key) => {
                                return (
                              <option key={item.sectionId} value={item.sectionId}>{item.sectionName}</option>
                              )
                            })}
						</select>
						{this.renderErrorFor('section_id2')}
					  </div>





                      {(this.state.studentList2.length >0)?(
                        <>
                            <div className="form-group col-md-12 mt-3">
                                <div className="print-id-card-table">
                                    {/* <input type="hidden" name="sheet_id" value={firstSheetId} /> */}
                                    <div className="table-responsive">
                                    <table className="table table-bordered table-striped verticle-middle table-responsive-sm">
    <thead>
        <tr className="table-custom-th">
            <th scope="col" style={{ maxWidth: '140px' }} rowSpan={2}>Admission No.</th>
            <th scope="col" rowSpan={2}>Roll No.</th>
            <th scope="col" rowSpan={2}>Student Name</th>
            {this.state.subjectList2.map((subject, subjectKey) => (
                <th key={subjectKey} scope="col" colSpan={4}>{subject.subjectName}</th>
            ))}
            <th scope="col" rowSpan={2}>Total Marks</th>
            <th scope="col" rowSpan={2}>Grand Total</th>
            <th scope="col" rowSpan={2}>%age</th>
            <th scope="col" rowSpan={2}>Grade</th>
        </tr>
        <tr className="table-custom-th">
            {this.state.subjectList2.map((subject, subjectKey) => (
                <>
                    <th key={`${subjectKey}-th`} scope="col">th</th>
                    <th key={`${subjectKey}-int`} scope="col">int</th>
                    <th key={`${subjectKey}-pa`} scope="col">pa</th>
                    <th key={`${subjectKey}-total`} scope="col">total</th>
                </>
            ))}
        </tr>
    </thead>
    <tbody>
        {this.state.subjectList2 && this.state.subjectList2.length > 0 && this.state.studentList2 && this.state.studentList2.length > 0 ? (
            Object.values(
                this.state.studentList2.reduce((acc, item) => {
                    const key = item.student_id; // Group by student_id
                    if (!acc[key]) {
                        acc[key] = { ...item, marks_obtained: [] }; // Initialize with the first entry
                    }
                    acc[key].marks_obtained.push({
                        subjectId: item.subject_id,
                        marks: item.marks_obtained,
                        theory: item.theory,
                        internal: item.internal,
                        assessment: item.assessment,
                        max_mark:item.max_mark,
                    });
                    return acc;
                }, {})
            ).map((student, studentKey) => {
                let grandTotal = 0;
                let totalMarksObtained = 0;
                let maxTotalMarks = 0; // Assuming this is the max marks per subject

                return student && student.student_name !== '' ? (
                    <tr key={studentKey}>
                        <td>{student.admission_no}</td>
                        <td>{student.roll_no}</td>
                        <td>{student.student_name}</td>

                        {this.state.subjectList2.map((subject, subjectKey) => {
                            // Find the marks for the subject for this student
                            const subjectMark = student.marks_obtained.find(mark => mark.subjectId === subject.subjectId);
                            
                            const total = subjectMark
                                ? (subjectMark.theory || 0) + (subjectMark.internal || 0) + (subjectMark.assessment || 0)
                                : 0;
                                
                            if (subjectMark) {
                                totalMarksObtained += parseInt(subjectMark.marks, 10) || 0;
                            }
                            if (subjectMark) {
                            grandTotal += parseInt(subjectMark.max_mark, 10) || 0;
                            }
                            maxTotalMarks += 100; // Assuming 100 marks per subject as the max possible marks

                            return (
                                <>
                                    <td key={`${subjectKey}-th`}>
                                        {subjectMark ? subjectMark.theory : '-'}
                                    </td>
                                    <td key={`${subjectKey}-int`}>
                                        {subjectMark ? subjectMark.internal : '-'}
                                    </td>
                                    <td key={`${subjectKey}-pa`}>
                                        {subjectMark ? subjectMark.assessment : '-'}
                                    </td>
                                    <td key={`${subjectKey}-total`}>
                                    {subjectMark ? subjectMark.marks : '-'}
                                    </td>
                                </>
                            );
                        })}

                        <td>{totalMarksObtained}</td>
                        <td>{grandTotal}</td>
                        <td> 
                            
                       
                            {((totalMarksObtained/grandTotal) * 100).toFixed(2)}%</td>

                            <td> 
                            
                       
                            {((this.getGrade((totalMarksObtained/grandTotal * 100).toFixed(2))))}</td>
                    </tr>
                ) : null;
            })
        ) : (
            <tr>
                <td colSpan="100%">No data available</td>
            </tr>
        )}
    </tbody>
</table>

                                    </div>
                                </div>
                            </div>

                            <div className="form-group col-md-12 text-right">
                                <button type="button" className="btn btn-danger mr-2"  onClick={(e) => this.handlePrint2(e)} id="normal" disabled={this.state.isSpinner2}>Print <span className="kt-spinner kt-spinner--sm kt-spinner--right kt-spinner--light" style={{ display: this.state.isSpinner2 ? 'inline' : 'none' }}></span></button>
                                {/* <button type="submit" className="btn btn-success">Save Remark</button> */}
                            </div>
                       
                           
                          
                        </>
                        ): '' }















					  
                    


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
                                    </form>
                                  </div>
                                </div>{/*/ card-body */}
                              </div>{/*/ card */}
                            </div>{/*/ col-8 */}
                          </div>{/*/ row */}
                        </div>{/*/ settings-form */}
                      </div>
                    </div>{/*/ tab-pane */}
                    <div id="classwise-consolidated" className="tab-pane fade">
                      <div className="pt-3">
                        <div className="settings-form">
                          <div className="row">
                            <div className="col-xl-12 col-lg-12 col-md-12">
                              <div className="card">
                                <div className="card-body">
                                  <div className="basic-form form-own">
                                    <form>
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
                                            <label>Calculate % of Internal, Pa/Practical, Theory by desired amount</label>
                                            <div className="form-row">
                                                <div className="form-group col-md-4">
                                                    <input type="text" name="" placeholder="Theory"  className="form-control"/>
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <input type="text" name="" placeholder="PA/Practical" className="form-control"/>
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <input type="text" name="" placeholder="Internal" className="form-control"/>
                                                </div>
                                            </div>
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
                                                    <label>Grades</label>
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

                                        {(Object.keys(studentList).length > 0 && this.state.showTable)?(
                                        <>
                                            <div className="form-group col-md-12">
                                                <div className="print-id-card-tables">
                                                    <div className="table-responsive">
                                                        <table className="table table-striped table-bordered table-checkable verticle-middle table-responsive-sm" id="marks">
                                                            <thead>
                                                                <tr className="table-custom-th">
                                                                    <th rowSpan="2">Roll.No.</th>
                                                                    <th rowSpan="2">Name's</th>
                                                                    {studentList.exams.map((exam, index) => (
                                                                        <th key={index} colSpan={this.state.showGrades ? "3" : "2"}>{exam.exam_info.exam_name}</th>
                                                                    ))}
                                                                    {this.state.showFinal && <th>Final</th>}
                                                                </tr>
                                                                <tr className="table-custom-th">
                                                                    {studentList.exams.map((exam, index) => (
                                                                        <>
                                                                        <th>Marks Obt.</th>
                                                                        {this.state.showGrades && ( <th>Grade</th> )}
                                                                        <th>Max Marks</th>
                                                                        </>
                                                                    ))}
                                                                    {this.state.showFinal && (
                                                                        <th> {this.state.finals === 'percent' ? 'Percentage' : 'Total Marks'} </th>
                                                                    )}
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                            {studentList.exams[0]?.studentDetails.map((student, studentIndex) => {
                                                                // Initialize total marks and max marks for each student
                                                                let totalMarksObtained = 0;
                                                                let totalMaxMarks = 0;

                                                                // Iterate through all exams to sum the marks
                                                                studentList.exams.forEach((exam) => {
                                                                    const examStudent = exam.studentDetails.find(s => s.student_id === student.student_id);
                                                                    if (examStudent) {
                                                                        totalMarksObtained += examStudent.total_marks_obtained || 0;
                                                                        totalMaxMarks += examStudent.total_max_marks || 0;
                                                                    }
                                                                });

                                                                return (
                                                                    <tr key={student.student_id}>
                                                                        <td>{student.roll_no}</td>
                                                                        <td>{student.student_name}</td>

                                                                        {studentList.exams.map((exam, examIndex) => {
                                                                            const examStudent = exam.studentDetails.find(s => s.student_id === student.student_id);

                                                                            return (
                                                                                <React.Fragment key={examIndex}>
                                                                                    <td>{examStudent?.total_marks_obtained || 'N/A'}</td>
                                                                                    {this.state.showGrades && <td>{examStudent?.grade || 'N/A'}</td>}
                                                                                    <td>{examStudent?.total_max_marks || 'N/A'}</td>
                                                                                </React.Fragment>
                                                                            );
                                                                        })}

                                                                        {this.state.showFinal && (
                                                                            <td>
                                                                                {this.state.finals === 'percent' && totalMaxMarks > 0
                                                                                    ? ((totalMarksObtained / totalMaxMarks) * 100).toFixed(2) // Show percentage
                                                                                    : totalMarksObtained // Show total marks
                                                                                }
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
                                                                    // <td>{this.getGrade((overallTotalMarksObtained / overallTotalMaxMarks) * 100)}</td>
                                                                    <>hcbs</>
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

                                      </div>{/*/ form-row */}
                                    </form>
                                  </div>
                                </div>{/*/ card-body */}
                              </div>{/*/ card */}
                            </div>{/*/ col-8 */}
                          </div>{/*/ row */}
                        </div>{/*/ settings-form */}
                      </div>
                    </div>{/*/ tab-pane */}
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
export default CompiledSheet;
