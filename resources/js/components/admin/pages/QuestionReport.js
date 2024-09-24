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
import * as XLSX from 'xlsx';

class QuestionReport extends Component {

   constructor(props) {
    super(props)
    this.state = {
            isLoading:true,
            showError:false,
            showSuccess:false,
            exam_id:'',
            course_id:'',
            class_id:'',
            section_id:'',
            max_mark:'',
            message:'',
            examList:[],
            teacherData:[],
            courseData:[],
            coursearr:[],
            courselst:[],
            corearr:[],
            classarr:[],
            sectionarr:[],
            sectionlst:[],
            sectionData:[],
            errors: [], loadData: [],
            readOnly: true,
            isSpinner: false,
            isSpinner2: false,
            showTable: false,
    }
    this.handleExam = this.handleExam.bind(this);
	this.handleCourse = this.handleCourse.bind(this);
	this.handleCourseRow = this.handleCourseRow.bind(this);
	this.checkAllCourse = this.checkAllCourse.bind(this);
    this.handleSection = this.handleSection.bind(this);
	this.checkAllSection = this.checkAllSection.bind(this);
	this.loadDetails = this.loadDetails.bind(this);
	this.handleChange = this.handleChange.bind(this);
    this.exportToExcel = this.exportToExcel.bind(this);
	this.hasErrorFor = this.hasErrorFor.bind(this);
	this.renderErrorFor = this.renderErrorFor.bind(this);
	this.input = React.createRef();
 }

handleExam(event) {
    const inpt = event.target.name;
    const id = event.target.value;

    if (id !== this.state.exam_id) {
        if (id !== "") {
            // Clear existing data before fetching new data
            this.setState({
                courseData: [],
                coursearr: [],
                class_id: "",
                section_id: "",
                sectionData: [],
                showTable: false,
                [inpt]: id,
                showError: false,
                message: "",
                showSuccess: false
            }, () => {
                axios
                    .get(`${base_url}api/examdatesheet/getcourse/${id}`)
                    .then((response) => {
                        const courseData = response.data.data ? response.data.data : [];

                        // Check if the courseData array is empty
                        if (courseData.length === 0) {
                            this.setState({
                                courseData: [],
                                showError: true,
                                message: "No courses found for the selected exam.",
                                showSuccess: false
                            });
                        } else {
                            this.setState({
                                courseData: courseData,
                                showError: false,
                                message: "",
                                showSuccess: false
                            });
                        }
                    })
                    .catch((error) => {
                        // console.log(error.message);
                        this.setState({
                            showError: true,
                            message: "An error occurred while fetching courses.",
                            showSuccess: false
                        });
                    });
            });
        } else {
            // Reset state when no exam is selected
            this.setState({
                courseData: [],
                coursearr: [],
                class_id: "",
                section_id: "",
                sectionData: [],
                showTable: false,
                [inpt]: id,
                showError: false,
                message: "",
                showSuccess: false
            });
        }
    }
}

loadDetails(e) {
    e.preventDefault();
    const exam_id = this.state.exam_id;
    const selectedCourses = this.state.coursearr; // Assuming `coursearr` contains selected course IDs
    const selectedClass=this.state.corearr;
    const selectedSections=this.state.sectionarr;

        let class_arr=[];
        let section_arr=[];

        for(var key in selectedClass) {
          let arr=selectedClass[key].split(",");
          for(var i=0;i<arr.length;i++) {
            if(!class_arr.includes(parseInt(arr[i]))) {
                class_arr.push(parseInt(arr[i]));
            }
          }
        }

        for(var key in selectedSections) {
          let arr=selectedSections[key].split(",");
            for(var i=0;i<arr.length;i++) {
              if(!section_arr.includes(parseInt(arr[i]))) {
                section_arr.push(parseInt(arr[i]));
              }
            }
        }

    if (exam_id.length > 0 && selectedCourses.length > 0) { // Check if at least one course ID is selected
        this.setState({ isSpinner: true }, () => {
            axios.get(`${base_url}api/examdatesheet/fetch_exam_datesheet/${exam_id}`, {
                params: {
                    course_ids: selectedCourses,
                    class_id: class_arr,
                    section_id: section_arr
                }
            }).then(response => {
                if (response.data.status == 'successed') {
                    this.setState({
                        showError: false,
                        showSuccess: false,
                        isSpinner: false,
                        showTable: true,
                        message: response.data.message,
                        loadData: response.data.data ? response.data.data : [],
                    });
                } else {
                    this.setState({
                        showError: true,
                        showSuccess: false,
                        message: response.data.message,
                        errors: response.data.errors || {},
                        isSpinner: false,
                        showTable: false
                    });
                }
            })
            .catch(err => {
                this.setState({
                    isSpinner: false,
                    showError: true,
                    showSuccess: false,
                    message: 'Failed to load exam date sheet. Please try again.',
                    loadData: []
                });
            });
        });
    } else {
        this.setState({
            showError: true,
            showSuccess: false,
            message: 'Please fill required fields!!',
            isSpinner: false,
            loadData: []
        });
    }
}

handleCourse(event){

	let opt = event.target.name;
	let check = event.target.checked;
    let check_val = event.target.value;
	let checks=this.state.coursearr;
	let lists = this.state.courselst;
	const exam_id = this.state.exam_id;
	const id = event.target.value;

	const idset =[];
	let unique = [];
	let idarr = [];

	var chk_arr=[];

	for(var key in lists)
	{
		if(lists[key] !== null)
		{
			if(lists[key].name=='course_id')
			{
				chk_arr.push(parseInt(lists[key].value));
			}
		}
	}

	let chkinp=this.removeDuplicates(chk_arr);

	if(check)
	{
		for(var key in checks)
		{
			idset.push(parseInt(checks[key]));
		}
		if(!idset.includes(parseInt(check_val)))
		{
			idset.push(parseInt(check_val));
		}
	}
	else
	{
		for (var key in checks)
		{
			if(checks[key] !=check_val && checks[key] !=0)
			{
				idset.push(parseInt(checks[key]));
			}

		}
	}

	let unique_arr=this.removeDuplicates(idset);

	idarr = unique_arr.filter(function(item) {
		return item !== 0
	});

	if(idarr.length==parseInt((chkinp.length)-1))
	{
		unique_arr.push(0);
	}

	if(unique_arr.length >0)
	{
		var list=idarr.toString();
		axios.get(`${base_url}api`+`/section_class_list_by_course/${list}`).then(response => {
            // console.log("section_class_list_by_course",list);
			this.setState({
				coursearr:unique_arr,
				sectionData: response.data.data?response.data.data:[],
			});


		})
		.catch(err => {
			 console.log(err.response.data);
		})

	}
	else
	{
		this.setState({coursearr:unique_arr,sectionData:[]});
	}

}

exportToExcel() {
    const { loadData, exam_id, examList } = this.state;
    const exam = examList.find((item) => item.id === parseInt(exam_id)) || {};

    if (loadData.length === 0) {
      return;
    }

    // Prepare headers
    const headers = ['Course Name', 'Class Name', 'Section Name', 'Subject', 'Date'];

    // Format data to match table display
    const formattedData = loadData.map(item => {
      const dateObj = new Date(item.exam_date);
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      const day = dateObj.getDate().toString().padStart(2, '0');
      const month = monthNames[dateObj.getMonth()];
      const year = dateObj.getFullYear();

      const formattedDate = `${day}-${month}-${year}`;

      return {
        'Course Name': item.courseName,
        'Class Name': item.className,
        'Section Name': item.sectionName,
        'Subject': item.subjectName,
        'Date': formattedDate
      };
    });

    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Create worksheet data with title, headers, and data
    const wsData = XLSX.utils.json_to_sheet(formattedData, { header: headers });

    // Add title row manually
    const titleRow = [`Details of Exam: ${exam.name || 'N/A'}`];

    // Create an empty row for spacing
    const emptyRow = [];

    // Create worksheet with title, empty row, headers, and data
    const ws = XLSX.utils.aoa_to_sheet([
      titleRow, // Title row
      emptyRow, // Empty row
      headers,  // Headers
      ...formattedData.map(item => [
        item['Course Name'],
        item['Class Name'],
        item['Section Name'],
        item['Subject'],
        item['Date']
      ])
    ]);

    // Append the sheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Exam Datesheet');

    // Write the file
    XLSX.writeFile(wb, 'exam_datesheet.xlsx');
}

checkAllCourse(event) {

	let opt = event.target.name;
	let check = event.target.checked;
    let check_val = event.target.value;
	let lists = this.state.courselst;

	let idset=[];
	let unique_arr=[];
	let idarr=[];

	if(check)
	{
		for(var key in lists)
		{
			if(lists[key] !== null)
			{
				if(lists[key].name=='course_id')
				{
					idset.push(parseInt(lists[key].value));
				}
			}
		}

		unique_arr=this.removeDuplicates(idset);
		idarr = unique_arr.filter(function(item) {
			return item !== 0
		});

	}

	if(unique_arr.length >0)
	{
		var list=idarr.toString();
		axios.get(`${base_url}api`+`/section_class_list_by_course/${list}`).then(response => {
			this.setState({
				coursearr:unique_arr,
				sectionData: response.data.data?response.data.data:[],
			});
		})
		.catch(err => {
			 console.log(err.response.data);
		})

	}
	else
	{
		this.setState({coursearr:unique_arr,corearr:[],sectionarr:[],sectionData:[]});
	}

}

handleSection(event) {
    const { checked, id: sectionId, value: sectionValue } = event.target;
    let { sectionarr, corearr, classarr, sectionlst } = this.state;

    sectionarr = { ...sectionarr }; // Copy of sectionarr to avoid direct mutation
    corearr = { ...corearr }; // Copy of corearr to avoid direct mutation

    if (checked) {
        // Add the section to the corresponding course in sectionarr
        if (!sectionarr[sectionId]) {
            sectionarr[sectionId] = sectionValue;
        } else {
            sectionarr[sectionId] = [
                ...new Set(sectionarr[sectionId].split(',').concat(sectionValue))
            ].join(',');
        }

        // Update corearr based on the new section selection
        classarr.forEach(item => {
            if (item && item.name === "course[]" && item.value === sectionId) { // Null check for item
                const courseSections = sectionlst
                    .filter(sec => sec && sec.name === "section[]" && sec.value === item.value) // Null check for sec
                    .map(sec => sec.id);

                const allSectionsChecked = courseSections.every(id =>
                    (sectionarr[id] || '').split(',').includes(sectionValue)
                );

                if (allSectionsChecked) {
                    corearr[item.id] = corearr[item.id]
                        ? [...new Set((corearr[item.id] + ',' + sectionId).split(','))].join(',')
                        : sectionId;
                }
            }
        });
    } else {
        // Remove the section from the corresponding course in sectionarr
        if (sectionarr[sectionId]) {
            sectionarr[sectionId] = sectionarr[sectionId]
                .split(',')
                .filter(val => val !== sectionValue)
                .join(',');

            if (!sectionarr[sectionId]) {
                delete sectionarr[sectionId];
            }
        }

        // Uncheck the course if any section is unchecked
        classarr.forEach(item => {
            if (item && item.name === "course[]" && item.value === sectionId) { // Null check for item
                const courseSections = sectionlst
                    .filter(sec => sec && sec.name === "section[]" && sec.value === item.value) // Null check for sec
                    .map(sec => sec.id);

                const anySectionChecked = courseSections.some(id =>
                    (sectionarr[id] || '').split(',').includes(sectionValue)
                );

                if (!anySectionChecked) {
                    delete corearr[item.id];
                }
            }
        });
    }

    // Set the new state
    this.setState({
        sectionarr,
        corearr
    });
}
handleCourseRow(event) {
    const { name, checked, id: checkId, value: checkVal } = event.target;
    const { corearr, sectionarr, sectionlst } = this.state;

    let updatedCoreArr = { ...corearr };
    let updatedSectionArr = { ...sectionarr };
    let updatedSectionLst = { ...sectionlst };

    if (checked) {
        // Handle when checkbox is checked
        if (updatedCoreArr[checkId]) {
            updatedCoreArr[checkId] = [
                ...new Set((updatedCoreArr[checkId] + ',' + checkVal).split(','))
            ].join(',');
        } else {
            updatedCoreArr[checkId] = checkVal;
        }

        // Update sectionarr based on sectionlst
        for (let key in updatedSectionLst) {
            if (updatedSectionLst[key] && updatedSectionLst[key].name === 'section[]' && updatedSectionLst[key].id === checkVal) {
                if (updatedSectionArr[checkVal]) {
                    updatedSectionArr[checkVal] = [
                        ...new Set((updatedSectionArr[checkVal] + ',' + updatedSectionLst[key].value).split(','))
                    ].join(',');
                } else {
                    updatedSectionArr[checkVal] = updatedSectionLst[key].value;
                }
            }
        }
    } else {
        // Handle when checkbox is unchecked
        if (updatedCoreArr[checkId]) {
            let valuesArray = updatedCoreArr[checkId].split(',');
            let filteredValues = valuesArray.filter(val => val !== checkVal);
            if (filteredValues.length > 0) {
                updatedCoreArr[checkId] = filteredValues.join(',');
            } else {
                delete updatedCoreArr[checkId];
            }
        }

        // Clean up sectionarr
        for (let key in updatedSectionArr) {
            if (key === checkVal) {
                delete updatedSectionArr[key];
            }
        }
    }

    this.setState({
        corearr: updatedCoreArr,
        sectionarr: updatedSectionArr,
    });
}

checkAllSection(event) {

	let opt = event.target.name;
	let check = event.target.checked;
    let check_val = event.target.value;
	let checks1=this.state.classarr;
	let checks2=this.state.sectionlst;

	const idset =[];
	let unique = [];
	var idarr = {};
	var idarr1 = {};
	var idarr2 = {};
	var count = 0;

	if(check)
	{
		idarr1[0]='';
		for(var key in checks1)
		{
			if(checks1[key] !== null && checks1[key].name=='course[]' && checks1[key].id !='')
			{
				if(idarr1.hasOwnProperty(checks1[key].id))
				{
					const lvl=idarr1[checks1[key].id];
					let txt = checks1[key].value+','+lvl;
					const arr = txt.split(",");
					let uniq = [];

					for(var i=0;i<arr.length;i++){
						if(!uniq.includes(arr[i]))
						{
							uniq.push(arr[i]);
						}
					}

					idarr1[checks1[key].id] = uniq.toString();
				}
				else
				{
					idarr1[checks1[key].id]=checks1[key].value;
				}
			}
		}

		for(var key in checks2)
		{
			if(checks2[key] !== null && checks2[key].name=='section[]')
			{
				if(idarr2.hasOwnProperty(checks2[key].id))
				{
					const lvl=idarr2[checks2[key].id];
					let txt = checks2[key].value+','+lvl;
					const arr = txt.split(",");
					let uniq = [];

					for(var i=0;i<arr.length;i++){
						if(!uniq.includes(arr[i]))
						{
							uniq.push(arr[i]);
						}
					}

					idarr2[checks2[key].id] = uniq.toString();
				}
				else
				{
					idarr2[checks2[key].id]=checks2[key].value;
				}
			}
		}
	}

	for (key in idarr1)
	{
		if(key>0)
		{
			count++;
			idarr[key]=idarr1[key];
		}
	}

	if(count>0)
	{
		this.setState({
			corearr:idarr1,
			sectionarr:idarr2,
		});
	}
	else
	{
		this.setState({ corearr:[],sectionarr:[] });
	}

}

handleChange(event){
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });
}

hasErrorFor (field) {
  return !!this.state.errors[field]
}
renderErrorFor (field) {
  if (this.hasErrorFor(field)) {
	return ( <span className='invalid-feedback'> <strong>{this.state.errors[field][0]}</strong> </span> )
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

	const urlString = window.location.href;
	const url = new URL(urlString);
	const lastSegment = url.pathname.split('/').pop();
	const id = lastSegment;

	axios.get(`${base_url}api/checkauth?api_token=${token}`).then(response => {
		// console.log(response);
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
		// console.log(response);
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
    }).catch(error => {
        console.log(error.message);
    })

}

render() {
    const { readOnly } = this.state;
    const isLoad = this.state.isLoading;

    if (isLoad) {

    //return null;

    }

    // console.log(this.state.corearr);
    // console.log('*');
    // console.log(this.state.sectionarr);

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
					<h4>Class-Wise Exam Date Sheet</h4>
				</div>
			</div>
		</div>
		{/****<!-- row -->****/}

		<div className="row">
			<div className="col-12">
				<div className="card">
					<div className="card-body create-user-table">
					  <div className="fee-collection">
						<div className="basic-form form-own email-form">
						    <form>
							<div className="form-row">
                                <div className="form-group col-md-12">
                                    <label>Exam Name</label>
                                    <select className={`form-control ${this.hasErrorFor('exam_id') ? 'is-invalid' : ''}`} name="exam_id" value={this.state.exam_id} onChange={this.handleExam}>
                                    <option value="">Select Exam</option>
                                    {this.state.examList.map( (item,key) => {
                                            return (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                        )
                                        })}
                                    </select>
                                    {this.renderErrorFor('exam_id')}
                                </div>
                                {this.state.exam_id && this.state.courseData.length > 0 &&
								<div className="form-group col-md-12">
								  <div className="form-group mrb-0">
									<label>Course Name</label>
								  </div>

								  <div className="Schedule-subject">
									<div className="form-checkbox-grid">
									{this.state.courseData.map( (item,key) => {
									return (
										<div key={key} className="form-check form-checkbox col-md-4">
                                            <div className="bg-padd">
                                                <input type="checkbox" className="form-check-input" name="course_id" value={item.courseId} checked={(this.state.coursearr.includes(parseInt(item.courseId)))?true:false} onChange={this.handleCourse} ref={node =>this.state.courselst.push(node)}/>
                                                <label className="form-check-label" htmlFor="check1">{item.courseName}</label>
                                            </div>
										</div>
										)
										})}
									</div>
							 </div>
							    </div>
                                }

                                {
                                (this.state.sectionData.length >0)?(
                                    <div className="form-group col-md-12 mrb-0">
                                        <div className="print-id-card-table">
                                        <div className="table-responsive">
                                            <table className="table table-bordered table-striped verticle-middle table-responsive-sm">
                                                <thead>
                                                    <tr>
                                                        <th scope="col"><div className="form-checkbox"><input type="checkbox" className="form-check-input" name="course[]" checked={(this.state.corearr.hasOwnProperty(0))?true:false} value="0" onChange={this.checkAllSection} /></div></th>
                                                        <th scope="col">Course Name</th>
                                                        <th scope="col">Class Name</th>
                                                        <th scope="col">Section Name</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {
                                                this.state.sectionData.map((item,key) => {
                                                    const section_arr1 = item.section_ids.split(",");
                                                    const section_arr2 = item.section_names.split(",");
                                                    const arc=item.courseId+item.class_id;

                                                    let cons = [];
                                                    for (let i=0;i<section_arr1.length;i++)
                                                    {
                                                        if(section_arr2[i]!="")
                                                        {
                                                            cons.push(<div key={i} className="form-check form-checkbox"><input type="checkbox" className="form-check-input" checked={(this.state.sectionarr.hasOwnProperty(item.class_id) && (this.state.sectionarr[item.class_id].match(new RegExp("(?:^|,)"+section_arr1[i]+"(?:,|$)"))))?true:false} id={item.class_id} name="section[]" value={section_arr1[i]} onChange={this.handleSection} ref={node =>this.state.sectionlst.push(node)}/><label className="form-check-label" htmlFor="check1">{section_arr2[i]}</label></div>);

                                                        }
                                                        else
                                                        {
                                                            cons.push(<div key={i} className="form-check form-checkbox"><label className="form-check-label" htmlFor="check1">{'N/A'}</label></div>);
                                                        }

                                                    }

                                                    return (
                                                        <tr key={key}>
                                                        <td>
                                                        <div className="form-checkbox"><input type="checkbox" className="form-check-input" name="course[]" checked={(this.state.corearr.hasOwnProperty(item.courseId) && (this.state.corearr[item.courseId].match(new RegExp("(?:^|,)"+item.class_id+"(?:,|$)"))))?true:false} id={item.courseId} value={item.class_id} onChange={this.handleCourseRow} ref={node =>this.state.classarr.push(node)}/>
                                                        </div>
                                                        </td>
                                                        <td>{item.courseName}</td>
                                                        <td>{item.class_name}</td>
                                                        <td>
                                                        {cons}
                                                        </td>
                                                    </tr>
                                                    )

                                                    })
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                        </div>
                                    </div>):null
                                }

                                <div className="col-sm-12 mb-3">
                                    <div className="submit-btn form-own">
                                        <button type="button" className="btn btn-primary load-fee" onClick={this.loadDetails} disabled={this.state.isSpinner}> View <span className="kt-spinner kt-spinner--sm kt-spinner--right kt-spinner--light" style={{ display: this.state.isSpinner ? 'inline' : 'none' }}></span></button>
                                    </div>
                                </div>

                                {this.state.showTable ?(
                                    <>
                                    <div className="form-group col-md-12 mrb-0 mt-3">
                                        <div className="print-id-card-table">
                                        <div className="table-responsive">
                                            <table className="table table-bordered table-striped verticle-middle table-responsive-sm">
                                                <thead>
                                                    <tr>
                                                        <th scope="col" style={{maxWidth:'150px'}}>Course Name</th>
                                                        <th scope="col">Class Name</th>
                                                        <th scope="col">Section Name</th>
                                                        <th scope="col">Subject</th>
                                                        <th scope="col">Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {
                                                    this.state.loadData.length > 0 ? (
                                                        this.state.loadData.map((item, key) => {

                                                            const dateObj = new Date(item.exam_date);
                                                            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

                                                            const day = dateObj.getDate().toString().padStart(2, '0');
                                                            const month = monthNames[dateObj.getMonth()];
                                                            const year = dateObj.getFullYear();

                                                            const formattedDate = `${day}-${month}-${year}`;

                                                            return (
                                                                <tr key={key}>
                                                                    <td>{item.courseName}</td>
                                                                    <td>{item.className}</td>
                                                                    <td>{item.sectionName}</td>
                                                                    <td>{item.subjectName}</td>
                                                                    <td>{formattedDate}</td>
                                                                </tr>
                                                            );
                                                        })
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="5" className="text-center">No records found</td>
                                                        </tr>
                                                    )
                                                }
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
                                ):null }

                                <div className="col-sm-12">
                                    {this.state.showError?
                                        <div className="alert alert-danger" style={{color:"brown"}}>
                                            <strong>{this.state.message}</strong>
                                        </div>
                                        : null}
                                        {this.state.showSuccess?
                                        <div className="alert alert-success" style={{color:"green"}}>
                                            {this.state.message}
                                        </div>
                                    : null}
                                </div>

						</div>{/****<!--/ form-row -->****/}
					        </form>
					    </div>

					  </div>{/****<!--/ fee-collection -->****/}
					</div>{/****<!--/ card-body -->****/}
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

export default QuestionReport;
