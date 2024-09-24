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

class SlcList extends Component {

   constructor(props) {
  super(props)
  this.state = {
	isLoading:true,
  }
	this.handlePrint = this.handlePrint.bind(this);
	this.handleExport = this.handleExport.bind(this);
	this.serverTable = React.createRef();
 }

handlePrint(id) {

	axios.get(`${base_url}api`+`/slc/print/${id}`).then(response => {
		console.log(response.data);
		if (response.data.status === 'successed')
		{
			 var receipt =(typeof(response.data.data)!='object')?response.data.data:'';
			 if(receipt !='')
			 {
				let a = document.createElement("a");
				let url = base_url+'certificates/tc/'+receipt;
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
handleExport(){

	const query=(this.state.params.search)?this.state.params.search:'';

	axios.get(`${base_url}api`+`/slc/export?search=${query}`).then(response => {
			console.log(response);
		if (response.data.status === 'successed')
		{
			var link =(typeof(response.data.data)!='object')?response.data.data:'';
			if(link !='')
			{
				window.open(`${base_url}api`+"/slc/downloadexcel/"+link,'_blank');
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

    const url = base_url+'api/slc/index';
	const columns=['tc_no','admission_no','student_name','father_name','f_mobile','className','action'];
	let _this = this;

	const options = {
		perPage: 10,		
		headings: {tc_no:'SLC No.',admission_no:'Admission No.',student_name:'Student Name',father_name:'Father Name',f_mobile:'Father Mobile',className:'Class Name',action:'Action'},
		sortable: ['student_name','className'],
		requestParametersNames: {query:'search',direction:'order'},
		responseAdapter: function (resp_data)
		{
			console.log(resp_data.data);
			_this.setState({ params: resp_data.data.query?resp_data.data.query:[] });
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
                            <h4>SLC Master</h4>
                        </div>
                    </div>
                    <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                        <ol className="breadcrumb breadcrumb-btn">
                            <li>
							 <a href={`/slc_add`} className="btn bg-blue-soft text-blue">
							 <i className="fa fa-user-plus"></i> Add New Transfer / SLC Certificate
							 </a>
							 </li>

                        </ol>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <div className="card">

                            <div className="card-body create-user-table">
								<div className="row">
									<div className="col-12 text-right">
										<button type="button" className="btn btn-sm btn-info" style={{marginTop:'30px'}} onClick={() => this.handleExport()}>Export to Excel <i className="fa fa-file-excel-o" aria-hidden="true"></i></button>
									</div>
								</div>
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
														  <><a href={`/slc_edit/${row.id}`} className='btn' data-toggle="tooltip" title="Edit"><i className="fa fa-edit" aria-hidden="true"></i>
														  </a><button className="btn" data-toggle="tooltip" title="Print" onClick={() => _this.handlePrint(`${row.id}`)}>
														  <i className="fa fa-print" aria-hidden="true"></i></button></>
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

export default SlcList;
