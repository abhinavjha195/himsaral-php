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


class EmployeeList extends Component {

   constructor(props) {
  super(props)
  this.state = {
	isLoading:true,
	employees: [],
	ids: []
  }
	this.handleDelete = this.handleDelete.bind(this);
    this.handlePrint = this.handlePrint.bind(this);
    this.handlePrintAll = this.handlePrintAll.bind(this);
	this.serverTable = React.createRef();
 }
 handleDelete(id) {
        // remove from local state

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
			axios.delete(`${base_url}api`+`/employee/delete/${id}`)
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
    handlePrint(id) {
        axios.get(`${base_url}api/employee/getPrints/${id}`).then(response => {
            console.log(response);
            if (response.data.status === 'successed')
            {
                 var receipt =(typeof(response.data.data)!='object')?response.data.data:'';
                 if(receipt !='')
                 {
                    let a = document.createElement("a");
                    let url = base_url+'print'+'/'+'employee_id'+'/'+receipt;
                    a.target='_blank';
                    a.href = url;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                 }
                this.setState({showErr:false,delmessage:response.data.message,errors:response.data.errors});
            }
            else
            {
                this.setState({showErr:true,delmessage:response.data.message,errors:response.data.errors});
            }
        })
        .catch(error => {
           //console.log(error.message);
            console.log(error.response.data);
        })
    }
	handlePrintAll() {
		let idArr = this.state.ids;
		let arr = idArr.map(el=>el.id);
		console.log(arr);
		let list= JSON.stringify(arr);
		axios.get(`${base_url}api/employee/getPrintAll/${list}`).then(response => {
            console.log(response);
            if (response.data.status === 'successed')
            {
                 var receipt =(typeof(response.data.data)!='object')?response.data.data:'';
                 if(receipt !='')
                 {
                    let a = document.createElement("a");
                    let url = base_url+'print'+'/'+'employee_id'+'/'+receipt;
                    a.target='_blank';
                    a.href = url;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                 }
                this.setState({showErr:false,delmessage:response.data.message,errors:response.data.errors});
            }
            else
            {
                this.setState({showErr:true,delmessage:response.data.message,errors:response.data.errors});
            }
        })
        .catch(error => {
           //console.log(error.message);
            console.log(error.response.data);
        })
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


    axios.get(`${base_url}api`+`/employee/getId`).then(response => {
		console.log(response.data.data)
		this.setState({
			ids: response.data.data ? response.data.data : []
			});
		})
	.catch(error => {
	   console.log(error.message);
    })
 }
refreshTable() {
	this.serverTable.current.refreshData();
}

 getData(){

	axios.get(`${base_url}api`+'/employee/index').then(response => {
		this.setState({
				employees: response.data.data ? response.data.data : [],
			});
		})
	.catch(error => {
	   console.log(error.message);
    })


 }
 convertToDate(dateString) {
	var dateObject = new Date(dateString);
	let dat=dateString.toString();
	let arr = dat.split("-");
    let dt = arr[2]+'-'+arr[1]+'-'+arr[0];
	return dt;
}

  render() {

const isLoad = this.state.isLoading;

if (isLoad) {

//return null;

}

	const employeeArr = this.state.employees?this.state.employees:[];
	// const idArr = this.state.ids?this.state.ids: [];


	const url = base_url+'api/employee/index';
	const columns = ['emp_name','emp_no','login_id','doj','gender','mobile','email','action'];
	/* const options = {
	   headings: {id: '#', created_at: 'Created At'},
	   sortable: ['emp_name', 'email']
	};  */

	let _this = this;

	const options = {
    perPage: 10,
    headings: {emp_name:'Employee Name',emp_no:'Emp No.',login_id:'Emp ID',doj:'Date of Joining',mobile:'Mobile No.',email:'Email ID',action:'Actions'},
    sortable: ['emp_name','email','mobile'],
    columnsWidth: {emp_name:30,email:30,login_id:50},
    columnsAlign: {login_id:'center',emp_name:'center'},
    requestParametersNames: {query:'search',direction:'order'},
    responseAdapter: function (resp_data)
	{
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
      <div>

             {/********************
               Preloader Start
               *********************/}

    <Preloader />

{/********************
Preloader end
*********************/}

 {/***********************************
    HeaderPart start
************************************/}

<HeaderPart />


 {/***********************************
  HaderPart end
************************************/}

   {/***********************************
    Main wrapper start
************************************/}

	 {/************************************
		Content body start
	**************************************/}
	<div className="content-body">
		<div className="container-fluid">
			<div className="row page-titles mx-0">
				<div className="col-sm-6 p-md-0">
					<div className="welcome-text">
						<h4>Employee's List</h4>
					</div>
				</div>
				<div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
					<ol className="breadcrumb breadcrumb-btn">
						<li><a href={`/employee_add`} className="btn bg-blue-soft text-blue"><i className="fa fa-user-plus"></i> Add New Employee</a></li>
					</ol>
				</div>
			</div>
			 {/******* row ***/}


			<div className="row">
				<div className="col-12">
					<div className="card">
						{/*****<div className="card-header"><h4 className="card-title">Basic Datatable</h4></div>****/}

						<div className="card-body create-user-table">
							<div className="table-responsive">
								<ServerTable ref={this.serverTable} columns={columns} url={url} options={options} bordered striped>
								{
									function (row, column)
									{
										switch (column) {
											case 'doj':
												return (<span className="name-span">{_this.convertToDate(row.doj)}</span>);
											case 'emp_name':
												return (<span className="name-span"><img className="user-profile" src={(row.emp_image=='')?base_url+"images/student.jpg":base_url+"uploads/employee_image/"+row.emp_image}/>{row.emp_name}</span>);
											case 'action':
												return (
													  <span><a href={`/employee_edit/${row.id}`} className='btn' data-toggle="tooltip" title="Edit"><i className="fa fa-edit" aria-hidden="true"></i></a>
                                                      <button className="btn" onClick={() => _this.handleDelete(`${row.id}`)}><i className="fa fa-trash" aria-hidden="true"></i></button>
													  <button className="btn" data-toggle="tooltip" onClick={() => _this.handlePrint(`${row.id}`)} title="Print Id Card"><i className="fa fa-print" aria-hidden="true"></i></button></span>
												  );
											default:
												return (row[column]);
										}
									}
								}
								</ServerTable>
								<div className="profile-tab-btn text-right">
									<input type="button" className="btn btn-primary btn-sm" onClick={this.handlePrintAll} value="Print All Id Cards" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	{/***********************************
		Content body end
	*************************************/}


    {/***********************************
        Main wrapper end
    ************************************/}
       </div>
    );
  }
}

export default EmployeeList;
