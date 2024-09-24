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

class AssignTeacherSubjectEdit extends Component {

   constructor(props) {
  super(props)
  this.state = {
		isLoading:true,
		showError:false,
		showSuccess:false,
		emp_no:'',
		emp_name:'',
		email:'',
		mobile:'',
		classwiseData:[],
        courseClassData: [],
        sectionData: [],
		subjectArr:[],
		teacherData:[],
		errors: [],
        readOnly:true,
        clLoading: true,
  }

	this.handleUpdate = this.handleUpdate.bind(this);
	this.handleChange = this.handleChange.bind(this);
	this.handleSubject = this.handleSubject.bind(this);
	this.handleSubjectChange = this.handleSubjectChange.bind(this);
	this.hasErrorFor = this.hasErrorFor.bind(this);
	this.renderErrorFor = this.renderErrorFor.bind(this);
	this.input = React.createRef();
 }


handleUpdate (event) {
  event.preventDefault();
  const { emp_name,emp_no,email,doj,mobile } = event.target;

  const urlString = window.location.href;
  const url = new URL(urlString);
  const lastSegment = url.pathname.split('/').pop();
  const id = lastSegment;

  const subject_arr=this.state.subjectArr;

  const data = {
	employee_name: emp_name.value,
	employee_no: emp_no.value,
	date_join: doj.value,
	email: email.value,
	mobile: mobile.value,
	sub_set:subject_arr,
  }

  axios.post(`${base_url}api/teachersubject/update/${id}`,data).then(response => {
		console.log(response);
		if (response.data.status === 'successed')
		{
			this.setState({ showError:false,showSuccess:true,message:response.data.message,errors:response.data.errors});
			window.location.href = base_url+"assign_subject_teacher_list";
		}
		else
		{
		   this.setState({ showError: true, showSuccess:false,message:response.data.message,errors:response.data.errors});
		}
    })
    .catch(error => {
	   console.log(error.message);
	   console.log(error.response.data);
    })

   }

handleChange(event){
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });
}

handleSubject(event){

	let opt = event.target.name;
	let check = event.target.checked;
	let check_id = event.target.id;
    let check_val = event.target.value;
	let checks=this.state.subjectArr;

	var idarr = {};

	if(check)
	{
		for(var key in checks)
		{
			if(key==check_id)
			{
				const lvl=checks[check_id];
				let txt = check_val+','+lvl;
				const arr = txt.split(",");
				let uniq = [];

				for(var i=0;i<arr.length;i++){
					if(!uniq.includes(arr[i]))
					{
						uniq.push(arr[i]);
					}
				}
				idarr[check_id] = uniq.toString();
			}
			else
			{
				idarr[key]=checks[key];
			}

		}

		if(!checks.hasOwnProperty(check_id))
		{
			idarr[check_id]=check_val.trim();
		}

	}
	else
	{
		for(var key in checks)
		{
			if(key==check_id)
			{
				const arr = checks[check_id].split(",");
				let uniq = [];

				for(var i=0;i<arr.length;i++)
				{
					if(!uniq.includes(arr[i]) && check_val!=arr[i])
					{
						uniq.push(arr[i]);
					}
				}

				if(uniq.length>0)
				{
					idarr[check_id] = uniq.toString();
				}
			}
			else
			{
				idarr[key]=checks[key];
			}
		}
	}

	this.setState({ subjectArr:idarr });
}

handleSubjectChange = (e, sectionId) => {
    const { value, checked } = e.target;
    this.setState(prevState => {
        const subjectArr = { ...prevState.subjectArr };
        if (!subjectArr[sectionId]) {
            subjectArr[sectionId] = [];
        }
        if (checked) {
            if (!subjectArr[sectionId].includes(value)) {
                subjectArr[sectionId].push(value);
            }
        } else {
            subjectArr[sectionId] = subjectArr[sectionId].filter(id => id !== value);
        }
        return { subjectArr };
    });
};


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

	const urlString = window.location.href;
	const url = new URL(urlString);
	const lastSegment = url.pathname.split('/').pop();
	const id = lastSegment;

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

	axios.get(`${base_url}api`+'/class_wise_subject').then(response => {
		this.setState({
			classwiseData: response.data.data?response.data.data:[],
		});
	})
	.catch(error => {
	   console.log(error.message);
    })

    axios.get(`${base_url}api`+`/teachersubject/empList/${id}`).then(response => {
        console.log("empList",response.data)
		this.setState({
			courseClassData: response.data.data || [],
            sectionData: response.data.data?.sections || [],
            clLoading: false
		});
	})
	.catch(error => {
	   console.log(error.message);
       this.setState({
        courseClassData: [],
        clLoading: false,  // Even if error, stop loading
    });
    })

	axios.get(`${base_url}api`+`/teachersubject/edit/${id}`).then(response => {
		const teacherArr=response.data.data?response.data.data:[];
		const subjectList=(teacherArr.length>0)?teacherArr[0].sub_list.split(','):[];
		var sub_obj = {};

		for(var i=0;i<subjectList.length;i++)
		{
			if(subjectList[i] !='N/A')
			{
				const arr=subjectList[i].split(':');

				if(sub_obj.hasOwnProperty(arr[1]))
				{
					const lvl=sub_obj[arr[1]];
					let txt = arr[0]+','+lvl;
					const set = txt.split(",");
					let uniq = [];

					for(var b=0;b<set.length;b++)
					{
						if(!uniq.includes(set[b]))
						{
							uniq.push(set[b]);
						}
					}

					sub_obj[arr[1]]=uniq.toString();
				}
				else
				{
					sub_obj[arr[1]]=arr[0].toString();
				}


			}
		}

		this.setState({
			teacherData:teacherArr,
			subjectArr:sub_obj
		});
	})
	.catch(error => {
	   console.log(error.message);
	})

}

render() {
    const { courseClassData } = this.state;
const isLoad = this.state.isLoading;

if (isLoad) {

//return null;

}

const teacherArr=(this.state.teacherData.length>0)?this.state.teacherData:[];

let em_name=(this.state.teacherData.length>0)?this.state.teacherData[0].emp_name:'';
let em_no=(this.state.teacherData.length>0)?this.state.teacherData[0].emp_no:'';
let em_mobile=(this.state.teacherData.length>0)?this.state.teacherData[0].mobile:'';
let em_email=(this.state.teacherData.length>0)?this.state.teacherData[0].email:'';
let em_doj=(this.state.teacherData.length>0)?this.state.teacherData[0].doj:'';

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
					<h4>Edit Assign Subjects to Teacher</h4>
				</div>
			</div>
			<div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
				<ol className="breadcrumb breadcrumb-btn">
					<li><a href={`/assign_subject_teacher_list`} className="btn bg-blue-soft text-blue"><i className="fa fa-angle-double-left"></i> Back to List of Assigned Subjects to Teachers</a></li>
				</ol>
			</div>
		</div>
		{/****<!-- row -->****/}

		<div className="row">
			<div className="col-12">
				<div className="card">
					{/****<!--div className="card-header"><h4 className="card-title">Fee Collection Amount</h4></div-->****/}
					<div className="card-body create-user-table">
					  <div className="fee-collection">
					<div className="basic-form form-own email-form">
						  <form onSubmit={this.handleUpdate}>
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
							<div className="form-row">

							  <div className="form-group col-sm-6">
								<label>Enter Employee No.</label>
								<input type="text" className={`form-control ${this.hasErrorFor('employee_no') ? 'is-invalid' : ''}`} name="emp_no"
								placeholder="" value={this.state.emp_no?this.state.emp_no:em_no} onChange={this.handleChange} readOnly={this.state.readOnly} title="Editing not available"/>
								{this.renderErrorFor('employee_no')}
							  </div>

							  <div className="form-group col-sm-6">
								<label>Date of Joining</label>
								<input type="date" className={`form-control ${this.hasErrorFor('date_join') ? 'is-invalid' : ''}`} name="doj"
								value={(this.state.doj)?this.state.doj:em_doj} onChange={this.handleChange} placeholder="dd/mm/yy" readOnly={this.state.readOnly} title="Editing not available"/>
								{this.renderErrorFor('date_join')}
							  </div>

							  <div className="form-group col-sm-4">
								<label>Employee Name</label>
								<input type="text" className={`form-control ${this.hasErrorFor('employee_name') ? 'is-invalid' : ''}`} name="emp_name"
								placeholder="" value={this.state.emp_name?this.state.emp_name:em_name} onChange={this.handleChange} readOnly={this.state.readOnly} title="Editing not available"/>
								{this.renderErrorFor('employee_name')}
							  </div>

							  <div className="form-group col-sm-4">
								<label>Mobile No</label>
								<input type="text" className={`form-control ${this.hasErrorFor('mobile') ? 'is-invalid' : ''}`} name="mobile"
								placeholder="" value={this.state.mobile?this.state.mobile:em_mobile} onChange={this.handleChange} readOnly={this.state.readOnly} title="Editing not available"/>
								{this.renderErrorFor('mobile')}
							  </div>

							  <div className="form-group col-sm-4 mrb-30">
								<label>Email ID</label>
								<input type="text" className={`form-control ${this.hasErrorFor('email') ? 'is-invalid' : ''}`} name="email"
								placeholder="" value={this.state.email?this.state.email:em_email} onChange={this.handleChange} readOnly={this.state.readOnly} title="Editing not available"/>
								{this.renderErrorFor('email')}
							  </div>

							  <div className="form-group col-md-12">
                              {this.state.clLoading ? (
                                <div className="form-group mrb-0">
                                    <h5>Loading...</h5>
                                </div>
                                ) :courseClassData.length === 0 ? (
                                <div className="form-group mrb-0">
                                    <h5 className="alert alert-danger">First assign the class to teacher and then choose subject.</h5>
                                </div>
                                ) : (
                                  <>
                                  <div className="assign-subjects-table">
                                        <div className="form-group mrb-0">
                                            <h5>Check the Subject Names on Respective Class Details to Assign</h5>
                                        </div>
                                        <div className="table-responsive">
                                            <table className="table table-bordered table-striped verticle-middle table-responsive-sm">
                                                <thead>
                                                    <tr className="table-custom-th">
                                                    <th scope="col">Course Name</th>
                                                    <th scope="col">Class Name</th>
                                                    <th scope="col">Section Name</th>
                                                    <th scope="col">Subject List</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {this.state.classwiseData.map( (item, key) => {
                                                    const sectionDataFiltered = this.state.sectionData.filter(section => section.sectionId === item.sectionId);
                                                    // console.log(sectionDataFiltered);
                                                    if (sectionDataFiltered.length > 0) {
                                                        const id_arr = item.sub_set.split(',');
                                                        const sub_arr = item.sub_list.split(',');
                                                        const com_arr = item.com_list.split(',');
                                                        const elec_arr = item.elec_list.split(',');
                                                        const ado_arr = item.ado_list.split(',');
                                                        var lvl="";
                                                        var levels = [];

                                                        for(var i=0;i<sub_arr.length;i++)
                                                        {
                                                            if(com_arr[i]==true)
                                                            {
                                                                lvl='red';
                                                            }
                                                            else if(elec_arr[i]==true)
                                                            {
                                                                lvl='green';
                                                            }
                                                            else if(ado_arr[i]==true)
                                                            {
                                                                lvl='purple';
                                                            }
                                                            else
                                                            {
                                                                lvl='';
                                                            }

                                                            levels.push(<span key={i} className={'badge bg-'+lvl+'-soft text-'+lvl}>
                                                            <div className="form-check form-checkbox" key={i}>
                                                            <input type="checkbox" name="subjects[]" id={item.id} key={i} className="form-check-input"
                                                            checked={(this.state.subjectArr.hasOwnProperty(item.id) && (this.state.subjectArr[item.id].match(new RegExp("(?:^|,)"+id_arr[i]+"(?:,|$)"))))?true:false}
                                                            value={id_arr[i]} onChange={this.handleSubject}/>
                                                            </div>{sub_arr[i]}</span>);
                                                        }

                                                        return (
                                                            <tr key={item.id}>
                                                            <td>{item.courseName}</td>
                                                            <td>{item.className}</td>
                                                            <td>{item.sectionName}</td>
                                                            <td>
                                                                {levels}
                                                            </td>
                                                            </tr>
                                                        )}else {
                                                            return null;
                                                        }
                                                })}
                                                </tbody>
                                                {/* <tbody>
                                                    {this.state.sectionData.map((section, index) => (
                                                        <tr key={section.sectionId}>
                                                            <td>{section.courseName}</td>
                                                            <td>{section.className}</td>
                                                            <td>{section.sectionName}</td>
                                                            <td>
                                                                {section.classwiselist && section.classwiselist.length > 0 ? (
                                                                    section.classwiselist.map((classwiseItem, idx) => {
                                                                        // Split subjectIds, subjectNames, compulsory, elective, additional
                                                                        const subjectIds = classwiseItem.subjectIds.split(',');
                                                                        const subjectNames = classwiseItem.subjectNames.split(',');
                                                                        const compulsory = classwiseItem.compulsory.split(',');
                                                                        const elective = classwiseItem.elective.split(',');
                                                                        const additional = classwiseItem.additional.split(',');

                                                                        // Create a list of subjects with their types
                                                                        return subjectIds.map((subjectId, subIndex) => {
                                                                            const subjectName = subjectNames[subIndex];
                                                                            const isCompulsory = compulsory[subIndex] === '1';
                                                                            const isElective = elective[subIndex] === '1';
                                                                            const isAdditional = additional[subIndex] === '1';

                                                                            // Determine the badge color
                                                                            let badgeColor = '';
                                                                            if (isCompulsory) badgeColor = 'badge bg-red-soft text-red';
                                                                            else if (isElective) badgeColor = 'badge bg-green-soft text-green';
                                                                            else if (isAdditional) badgeColor = 'badge bg-purple-soft text-purple';

                                                                            return (
                                                                                <span key={`${subjectId}-${subIndex}`} className={badgeColor} style={{ marginRight: '5px', display: 'inline-block' }}>
                                                                                    <div className="form-check form-checkbox" style={{ display: 'inline-block', marginRight: '5px' }}>
                                                                                        <input type="checkbox" name="subjects[]" id={section.classId} className="form-check-input" value={subjectId} checked={this.state.subjectArr.hasOwnProperty(section.sectionId) && this.state.subjectArr[section.sectionId].includes(subjectId)}
                                                                                        onChange={(e) => this.handleSubjectChange(e, section.sectionId)
                                                                                        } />
                                                                                    </div>
                                                                                    {subjectName}
                                                                                </span>
                                                                            );
                                                                        });
                                                                    })
                                                                ) : (
                                                                    "No subjects available"
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody> */}
                                            </table>
                                        </div>
                                    </div>
                                    {/* <div className="assign-subjects-table">
                                        <div className="form-group mrb-0">
                                            <h5>Check the Subject Names on Respective Class Details to Assign</h5>
                                        </div>
                                        <div className="table-responsive">
                                            <table className="table table-bordered table-striped verticle-middle table-responsive-sm">
                                            <thead>
                                                <tr>
                                                <th scope="col">Course Name</th>
                                                <th scope="col">Class Name</th>
                                                <th scope="col">Section Name</th>
                                                <th scope="col">Subject List</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {this.state.classwiseData.map( (item, key) => {
                                            const id_arr = item.sub_set.split(',');
                                            const sub_arr = item.sub_list.split(',');
                                            const com_arr = item.com_list.split(',');
                                            const elec_arr = item.elec_list.split(',');
                                            const ado_arr = item.ado_list.split(',');
                                            var lvl="";
                                            var levels = [];

                                            for(var i=0;i<sub_arr.length;i++)
                                            {
                                                if(com_arr[i]==true)
                                                {
                                                    lvl='red';
                                                }
                                                else if(elec_arr[i]==true)
                                                {
                                                    lvl='green';
                                                }
                                                else if(ado_arr[i]==true)
                                                {
                                                    lvl='purple';
                                                }
                                                else
                                                {
                                                    lvl='';
                                                }

                                                levels.push(<span key={i} className={'badge bg-'+lvl+'-soft text-'+lvl}>
                                                <div className="form-check form-checkbox" key={i}>
                                                <input type="checkbox" name="subjects[]" id={item.id} key={i} className="form-check-input"
                                                checked={(this.state.subjectArr.hasOwnProperty(item.id) && (this.state.subjectArr[item.id].match(new RegExp("(?:^|,)"+id_arr[i]+"(?:,|$)"))))?true:false}
                                                value={id_arr[i]} onChange={this.handleSubject}/>
                                                </div>{sub_arr[i]}</span>);
                                            }

                                        return (
                                                <tr key={item.id}>
                                                <td>{item.courseName}</td>
                                                <td>{item.className}</td>
                                                <td>{item.sectionName}</td>
                                                <td>
                                                    {levels}
                                                </td>
                                                </tr>
                                            )
                                            })}
                                            </tbody>
                                            </table>
                                        </div>
                                    </div> */}
                                  </>
                                )}
						       </div>

							   <div className="col-sm-12">
                               {courseClassData.length === 0 ? (
                                <></>
                               ):(
								<div className="submit-btn form-own text-right btn-submit-right">
								  <input type="submit" value="Save" className="btn btn-primary"/>
								</div>
                               )}
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

export default AssignTeacherSubjectEdit;
