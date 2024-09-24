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

class CcList extends Component {

   constructor(props) {
  super(props)
  this.state = {
	isLoading:true,
  }
    this.handleDelete = this.handleDelete.bind(this);
	this.handlePrint = this.handlePrint.bind(this);
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
		axios.delete(`${base_url}api`+`/cc/delete/${id}`)
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
handlePrint(id,format) {

	axios.get(`${base_url}api`+`/cc/print/${id}/${format}`).then(response => {
		console.log(response.data);
		if (response.data.status === 'successed')
		{
			 var receipt =(typeof(response.data.data)!='object')?response.data.data:'';
			 if(receipt !='')
			 {
				let a = document.createElement("a");
				let url = base_url+'certificates/cc/'+receipt;
				a.target='_blank';
				a.href = url;
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
			 }
		}
		else
		{
			console.log(response.data.message);
		}
	})
	.catch(error => {
	   console.log(error.message);
	   console.log(error.response.data);
    })
}

refreshTable() {
	this.serverTable.current.refreshData();
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

}

render() {

const isLoad = this.state.isLoading;

if (isLoad) {

//return null;

}

    const url = base_url+'api/cc/index';
	const columns=['cc_no','admission_no','student_name','school_name','className','action'];
	let _this = this;

	const options = {
		perPage: 10,	
		headings: {cc_no:'CC No.',admission_no:'Admission No.',student_name:'Student Name',school_name:'School Name',className:'Class Name',action:'Action'},
		sortable: ['cc_no','admission_no','student_name','className'],
		requestParametersNames: {query:'search',direction:'order'},
		responseAdapter: function (resp_data)
		{
			console.log(resp_data);
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

          {/***********************************
            Content body start
        ************************************/}

		  <div className="content-body">
            <div className="container-fluid">
                <div className="row page-titles mx-0">
                    <div className="col-sm-6 p-md-0">
                        <div className="welcome-text">
                            <h4>Character Certificate Master</h4>
                        </div>
                    </div>
                    <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                        <ol className="breadcrumb breadcrumb-btn">
                            <li>
							 <a href={`/cc_add`} className="btn bg-blue-soft text-blue">
							 <i className="fa fa-user-plus"></i> Add New Character Certificate
							 </a>
							 </li>

                        </ol>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body create-user-table">
                                <div className="table-responsive">
                                    <ServerTable ref={_this.serverTable} columns={columns} url={_this.state.app_url?_this.state.app_url:url} options={options} bordered condensed striped>
									{
										function (row,column)
										{
											switch (column) {
												case 'registration_date':
													return (
														  _this.formatDate(row.registration_date)
													  );
												case 'action':
													return (
														  <><a href={`/cc_edit/${row.id}`} className='btn' data-toggle="tooltip" title="Edit"><i className="fa fa-edit" aria-hidden="true"></i></a><button className="btn" data-toggle="tooltip" title="Format 1" onClick={() => _this.handlePrint(`${row.id}`,'format_1')}>
														  <i className="fa fa-print" aria-hidden="true"></i></button>
														  <button className="btn" data-toggle="tooltip" title="Format 2" onClick={() => _this.handlePrint(`${row.id}`,'format_2')}>
														  <i className="fa fa-print" aria-hidden="true"></i></button>
														  <button className="btn" data-toggle="tooltip" title="Format 3" onClick={() => _this.handlePrint(`${row.id}`,'format_3')}>
														  <i className="fa fa-print" aria-hidden="true"></i></button>
														  <button className="btn" title="Delete" onClick={() => _this.handleDelete(`${row.id}`)}><i className="fa fa-trash" aria-hidden="true"></i></button>
														  </>
													);
												default:
													return (row[column]);
											}
										}
									}
									</ServerTable>
                                </div>
                            </div>
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

export default CcList;