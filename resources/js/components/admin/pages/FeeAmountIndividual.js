import React, { Component } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';

import Script from "@gumgum/react-script-tag";

import Copyright from "../basic/Copyright";

import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url=location.protocol+'//'+location.host+'/';

class FeeAmountIndividual extends Component {

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
					<h4>Set Individual Fee Amount </h4>
				</div>
			</div>
			{/***********<div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
				<ol className="breadcrumb">
					<li><a href="./exam-creation.html" className="btn bg-blue-soft text-blue"><i className="fa fa-angle-double-left"></i> Back to Exam List</a></li>
				</ol>
			</div>**********/}
		</div>
		{/**********<!-- row **********/}

		<div className="row">
		  <div className="col-xl-12 col-xxl-12">
			<div className="card">
			  {/******!--div className="card-header"><h4 className="card-title">Create New Exam</h4></div--***/}
			  <div className="card-body">
				<form onSubmit={this.handleCreate}>

				<div className="basic-form form-own">

					<div className="form-row">

					  <div className="form-group col-md-4">
						<label>Admission Number</label>
						<input type="text" className="form-control" name="admission_no" placeholder="Enter admission number" value={(this.state.admission_no)?this.state.admission_no:''} onChange={this.handleAdmission}/>
						 {this.state.load_err?
						 <span style={style_txt}>
							<strong>{this.state.load_msg}</strong>
						  </span>
						 : null}
						<div style={style1}>
						{
						  this.state.suggestions.map((item,index) => (
							<div id={item.admission_no} key={item.id} style={style2} onClick={this.setAdmission}>{item.admission_no}-{item.student_name}-{item.className}-{item.father_name}</div>
						  ))
						}
					    </div>
					  </div>

					  <div className="form-group col-md-2">
						<label>&nbsp;&nbsp;</label><br/>
						<input type="button" className="btn btn-primary" value="Load" onClick={this.loadDetail}/>
					  </div>


					</div>{/**********<!--/ form-row ******-***/}

				</div>
				{
				this.state.studentData.length>0?(
				<>
				<div className="table-responsive">
				  <table className="table table-bordered verticle-middle table-responsive-sm">
					<thead>
					  <tr>
						<th colSpan="6" className="table-custom-th">Student Detail</th>
					  </tr>
					</thead>
					<tbody>
					  <tr>
						<th>Student Name</th>
						<td>{this.state.studentData.length>0?this.state.studentData[0].student_name:''}</td>
						<th>Father Name</th>
						<td>{this.state.studentData.length>0?this.state.studentData[0].father_name:''}</td>
						<th>Class</th>
						<td>{this.state.studentData.length>0?this.state.studentData[0].courseName:''} ({this.state.studentData.length>0?this.state.studentData[0].className:''})</td>
					  </tr>
					</tbody>
				  </table>
				 </div>

				 <p className="card-text"><b>Fee Amount Detail</b></p>

				 <div className="table-responsive">
					<table className="table table-bordered table-striped verticle-middle table-responsive-sm">
						<thead>
							<tr className="table-custom-th">
								<th scope="col">Fee Category</th>
								<th scope="col">Fee Amount</th>
							</tr>
						</thead>
						<tbody>
						{this.state.categoryData.map( (item,key) => {
                            const isSpecialFeeId = item.fee_id === 3 || item.fee_id === 4;
							return (
							<tr key={item.fee_id} className={`${isSpecialFeeId ? 'special-category' : ''}`}>
								<td>{item.name}</td>
								<td>
									<input type="number" id={item.fee_id} className="form-control" name="category[]" value={(this.state.amntArr.hasOwnProperty(item.fee_id))?this.state.amntArr[item.fee_id]:(amount_arr.hasOwnProperty(item.fee_id))?amount_arr[item.fee_id]:0.0} ref={node =>this.state.feecats.push(node)} step="0.1" onChange={this.handleCategory} disabled={isSpecialFeeId} title={`${isSpecialFeeId ? 'System Alert: Editing Not Available' : ''}`}/>
								</td>
							</tr>
							)
						})}
						</tbody>
					</table>
				  </div>

				  <div className="submit-btn form-own text-right">
					  <input type="submit" value="Save" className="btn btn-primary"/>
				  </div>
				  </>
					)
					:''
					}
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

export default FeeAmountIndividual;
