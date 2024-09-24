import React, { Component } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';

import Script from "@gumgum/react-script-tag";

import Copyright from "../../basic/Copyright";

import Preloader from "../../basic/Preloader";
import HeaderPart from "../../layout/HeaderPart";

const base_url=location.protocol+'//'+location.host+'/';

class ChildProfile extends Component {

constructor (props) {
  super(props)
  this.state = {
	isChecked:false,
    showError: false,
	showSuccess: false,
	load_err:false,
	isLoading:true,
	admission_no:'',
	school_id:'',
	load_msg:'',
	courseData: [],
	classData: [],
	categoryData:[],
	chkarr:[],
	idarr:[],
	feecats:[],
	suggestions:[],
	feeData:[],
    studentData:[],
	amntArr:[],
  }
	   this.handleAdmission = this.handleAdmission.bind(this);
	   this.setAdmission = this.setAdmission.bind(this);
	   this.loadDetail = this.loadDetail.bind(this);
	   this.handleCreate = this.handleCreate.bind(this);
	   this.handleCategory = this.handleCategory.bind(this);
   }


handleAdmission(event){
    event.preventDefault();
	const search = event.target.value;
    this.setState({ [event.target.name]: event.target.value });

	 if (search.length > 0) {
        // make api call
			axios.get(`${base_url}api`+`/studentmaster/getsuggestion/${search}`).then(response => {
				console.log(response.data);
				this.setState({
					suggestions:response.data.data?response.data.data:[]
				});
			})
			.catch(error => {
			   console.log(error.message);
			})
      }
	  else {
			this.setState({
			  suggestions: []
			});
      }
}

setAdmission(event){
	event.preventDefault();
	const admission_no = event.target.id;

	this.setState({
	  admission_no:admission_no,
	  load_msg:'',
	  load_err:false,
	  showError: false,
	  message:'',
	  suggestions: []
	});

}

loadDetail(event){
    event.preventDefault();
	const school_id=this.state.school_id?this.state.school_id:'';
	const search=this.state.admission_no?this.state.admission_no:'';

	 if (search.length > 0) {

			axios.get(`${base_url}api`+`/feeindividual/getdetail/${search}/${school_id}`).then(response => {
				console.log(response);
				if(response.data.status=='successed')
				{
					this.setState({
						feeData:response.data.data?response.data.data.fee_data:[],
						studentData:response.data.data?response.data.data.student_data:[],
						amntArr:[],
						load_err:false,
						showError: false,
						showSuccess: false,
						load_msg:'',
						message:response.data.message,
					});
				}
				else
				{
					this.setState({
						feeData:[],
						studentData:[],
						amntArr:[],
						load_err:false,
						showError: true,
						showSuccess: false,
						load_msg:'',
						message:response.data.message,
					});
				}

			})
			.catch(error => {
			   console.log(error.message);
			})
      }
	  else {
			this.setState({
				feeData:[],
				studentData:[],
				amntArr:[],
				load_err:true,
				showError: false,
				showSuccess: false,
				load_msg:'Admission number is empty!!'
			});
      }
}

  handleCreate (event) {
  event.preventDefault();
  const { admission_no } = event.target;
  const school_id=this.state.school_id?this.state.school_id:'';
  let categories=this.state.feecats;

  var catarr={};

	for(var key in categories)
	{
		if(categories[key] !== null)
		{
			if(categories[key].name=='category[]')
			{
				catarr[categories[key].id]=categories[key].value;
			}
		}
	}

  const data = {
	admission_no: admission_no.value,
	school_id:school_id,
	fee_cats: catarr,
  }

  axios.post(`${base_url}api`+'/feeindividual/create',data)
    .then(response => {
		console.log(response);
		if (response.data.status === 'successed')
		{
			this.setState({ showError: false, showSuccess: true, message: response.data.message});
		}
		else
		{
			this.setState({ showError: true, showSuccess: false, message: response.data.message});
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


	axios.get(`${base_url}api`+'/class/getcourses').then(response => {
	this.setState({
			courseData: response.data.data ? response.data.data : [],
		});
	})
	.catch(error => {
	   console.log(error.message);
    })

	axios.get(`${base_url}api`+'/feecat/listall').then(response => {
		this.setState({
			categoryData:response.data.data?response.data.data:[],
		});
	})
	.catch(error => {
	   console.log(error.message);
    })

}

handleCategory(event){
    event.preventDefault();

	const cat_id = event.target.id;
	const cat_val = event.target.value;

	let amnt_arr=this.state.amntArr;

	let ca_arr = {};

	for(var key in amnt_arr)
	{
		ca_arr[key]=amnt_arr[key];
	}

	ca_arr[cat_id]=cat_val;

    this.setState({ amntArr:ca_arr });
}

render() {

const isLoad = this.state.isLoading;

if (isLoad) {

//return null;

}

const style1 = {
  position: "absolute",
  border: "1px solid #d4d4d4",
  zIndex: "99",
};

const style2 = {
  padding: "10px",
  cursor: "pointer",
  color:"#000",
  fontFamily: "New Times Roman",
  fontSize:"15px",
  backgroundColor: "#fff",
  borderBottom: "1px solid #d4d4d4",
  width:"300px",
};

const style_txt = {
  display: "block",
  width: "100%",
  marginTop: "0.25rem",
  fontSize: "80%",
  color: "#FF1616",
};

const attendarr ={};

const feeArr = (this.state.feeData.length>0)?this.state.feeData:[];
const amount_arr= {};

feeArr.forEach(item =>
{
	amount_arr[item.FeeCatId]=item.FeeAmount;
});

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
					<h4>Children Details</h4>
				</div>
			</div>
		</div>

		<div className="row">
		  <div className="col-xl-12 col-xxl-12">
			<div className="card">
			  <div className="card-body">
				<form onSubmit={this.handleCreate}>

				<div className="basic-form form-own">

					<div className="form-row">

					  <div className="form-group col-md-6">
						<label>Select one of the RadioButtons to see the Details*</label> <br/>
						<input type="radio" name="stud_reg_no" value="nick24"/> <span>nick24-Nikhil Sharma</span>
					  </div>

					  <div className="form-group col-md-6">
						<label>&nbsp;&nbsp;</label><br/>
						<input type="button" className="btn btn-primary" value="Load Detail" onClick={this.loadDetail}/>
					  </div>


					</div>{/**********<!--/ form-row ******-***/}

				</div>
				{/* {
				this.state.studentData.length>0?(
				<> */}
				<div className="table-responsive">
				  <table className="table table-bordered verticle-middle table-responsive-sm">
					<tbody>
                      <tr>
						<th colSpan="6" className="table-custom-th">Student Personal Details</th>
					  </tr>
					  <tr>
						<th>Name</th>
						<td>{this.state.studentData.length>0?this.state.studentData[0].student_name:'Nikhil Sharma'}</td>
						<th>Date of Birth</th>
						<td>{this.state.studentData.length>0?this.state.studentData[0].father_name:'21-June-2000'}</td>
						<th>Gender</th>
						<td>{this.state.studentData.length>0?this.state.studentData[0].courseName:'Male'}</td>
					  </tr>
                      <tr>
						<th>Caste</th>
						<td>General</td>
						<th>Nationality</th>
						<td>Indian</td>
						<th>Religion</th>
						<td></td>
					  </tr>
                      <tr>
						<th>Maritial Status</th>
						<td>Un-married</td>
						<th>Mobile Number</th>
						<td></td>
						<th>Email</th>
						<td></td>
					  </tr>
                      <tr>
						<th>Blood Group</th>
						<td></td>
						<th>Telephone Code</th>
						<td></td>
						<th>Telephone Number</th>
						<td></td>
					  </tr>
                      <tr>
						<th colSpan="6" className="table-custom-th">Student Class Details</th>
					  </tr>
                      <tr>
						<th>Class Name</th>
                        <td>1st</td>
                        <th>Course Name</th>
                        <td>Primary</td>
                        <th>Date of Admission</th>
                        <td>21-June-2024</td>
					  </tr>
                      <tr>
                        <th>Registration Number</th>
                        <td></td>
                        <th>Roll Number</th>
                        <td></td>
                        <th>Board Roll No</th>
                        <td></td>
                      </tr>
                      <tr>
                        <th>Board Registration Number</th>
                        <td colspan="5"></td>
                      </tr>
                      <tr>
						<th colSpan="6" className="table-custom-th">Student Parent's Details</th>
					  </tr>
                      <tr>
                        <th>Father Name</th>
                        <td></td>
                        <th>Mother Name</th>
                        <td></td>
                        <th>Father Ocupation</th>
                        <td></td>
                      </tr>
                      <tr>
                        <th>Father Designation</th>
                        <td></td>
                        <th>Father Income</th>
                        <td></td>
                        <th>Parents Mobile Number (sms)</th>
                        <td></td>
                      </tr>
                      <tr>
                        <th>Parents Email</th>
                        <td colspan="5"></td>
                      </tr>
                      <tr>
						<th colSpan="6" className="table-custom-th">Student Address Details</th>
					  </tr>
                      <tr>
                        <th>Permanent Address</th>
                        <td></td>
                        <th>State</th>
                        <td></td>
                        <th>District</th>
                        <td></td>
                      </tr>
                      <tr>
                        <th>Pincode</th>
                        <td></td>
                        <th>Temporary Address</th>
                        <td></td>
                        <th>Aadhar No.</th>
                        <td></td>
                      </tr>
                      <tr>
						<th colSpan="6" className="table-custom-th">Student Bank Details</th>
					  </tr>
                      <tr>
                        <th>Account No.</th>
                        <td></td>
                        <th>IFSC Code</th>
                        <td></td>
                        <th>Branch Address</th>
                        <td></td>
                      </tr>
					</tbody>
				  </table>
				 </div>
				  {/* </>
					)
					:''
					} */}
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
				</form>
			  </div>

			</div>
		  </div>
		</div>{/***********<!--/ row *******/}

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

export default ChildProfile;
