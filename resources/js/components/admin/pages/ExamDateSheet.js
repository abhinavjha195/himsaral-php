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


class ExamDateSheet extends Component {

   constructor(props) {
  super(props)
  this.state = {
	  isLoading:true,
  }
	this.handleDelete = this.handleDelete.bind(this);
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
			axios.delete(`${base_url}api`+`/examdatesheet/delete/${id}`)
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

	const url = base_url+'api/examdatesheet/index';

	const columns = ['name','courseName','className','sec_name','sub_list','action'];

	let _this = this;

	const options = {
    perPage: 10,
    headings: {name:'Exam Name',courseName:'Course Name',className:'Class Name',sec_name:'Section Name',sub_list:'Subject List',action:'Actions'},
    sortable: ['name','courseName'],
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

 <div id="main-wrapper">

   {/***********************************
    Main wrapper start

************************************/}
 {/***********************************
    HeaderPart start
************************************/}

<HeaderPart />

 {/***********************************
  HaderPart end
************************************/}

	 {/************************************
		Content body start
	**************************************/}

	<div className="content-body">
	<div className="container-fluid">
		<div className="row page-titles mx-0">
			<div className="col-sm-6 p-md-0">
				<div className="welcome-text">
					<h4>Exam Date Sheet List</h4>
				</div>
			</div>
			<div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
				<ol className="breadcrumb breadcrumb-btn">
					<li><a href={`/exam_date_sheet_add`} className="btn bg-blue-soft text-blue"><i className="fa fa-user-plus"></i> Create Exam Date Sheet</a></li>
				</ol>
			</div>
		</div>
		{/***** row ****/}


		<div className="row">
			<div className="col-12">
				<div className="card">
					<div className="card-header">
					  <h4 className="card-title">Color Indicator &nbsp; &nbsp; &nbsp; <span className="btn bg-red-soft text-red"></span> <small className="text-red">Compulsory Subject</small> <span className="btn bg-green-soft text-green"></span> <small className="text-green">Elective Subject</small> <span className="btn bg-purple-soft text-purple"></span> <small className="text-purple">Additional Subject*</small></h4>
					</div>

					<div className="card-body create-user-table">
						<div className="table-responsive">
							<ServerTable ref={this.serverTable} columns={columns} url={url} options={options} bordered striped>
							{
								function (row,column)
								{
									if(column=='sub_list')
									{
										const sub_arr = row.sub_list.split(",");
										const type_arr = row.sub_type.split(",");
										var tags = [];
										for(var i=0;i<sub_arr.length;i++)
										{
											let tag_class='';
											if(type_arr[i]=='Compulsory')
											{
												tag_class='badge bg-red-soft text-red';
											}
											else if(type_arr[i]=='Elective')
											{
												tag_class='badge bg-green-soft text-green';
											}
											else if(type_arr[i]=='Additional')
											{
												tag_class='badge bg-purple-soft text-purple';
											}
											else
											{
												tag_class='';
											}
											tags.push(<span className={tag_class} key={i}>{sub_arr[i]}</span>);
										}

										return tags;
									}
									else if(column=='action')
									{
										return (
												  <span><a href={`/exam_date_sheet_edit/${row.id}`} className='btn' data-toggle="tooltip" title="Edit"><i className="fa fa-edit" aria-hidden="true"></i></a><button className="btn" onClick={() => _this.handleDelete(`${row.id}`)}>
												  <i className="fa fa-trash" aria-hidden="true"></i></button></span>
											  );
									}
									else
									{
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
	*************************************/}
  </div>
    {/***********************************
        Main wrapper end
    ************************************/}
       </>
    );
  }
}
export default ExamDateSheet;
