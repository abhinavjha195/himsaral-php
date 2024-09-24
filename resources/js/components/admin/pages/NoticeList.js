import React, { Component } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import ServerTable from 'react-strap-table';
import Script from "@gumgum/react-script-tag";

import Copyright from "../basic/Copyright";

import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";
import Log from "laravel-mix/src/Log";

const base_url=location.protocol+'//'+location.host+'/';


class NoticeList extends Component {

   constructor(props) {
  super(props)
  this.state = {

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
			axios.delete(`${base_url}api`+`/notice/delete/${id}`)
			  .then((response) => {

				if(response.data.status==true)	
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

render() {

	const url = base_url+'api/notice/index';
	const columns = ['title','notice','file_name','link1','link2', 'link3', 'link4', 'date','action'];

	let _this = this;

	const options = {
    perPage: 10,
    headings: {title:'Title',notice:'Notice',file_name:'Attachment',action:'Actions'},
    sortable: ['title','notice', 'date'],
    columnsWidth: {title:30,notice:30,file_name:30,action:50},
    columnsAlign: {title:'center',notice:'center',file_name:'center',type:'center'},
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
					<h4>Notice List</h4>
				</div>
			</div>
			
			<div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
				<ol className="breadcrumb breadcrumb-btn">
					<li><a href={`/notice_add`} className="btn bg-blue-soft text-blue"><i className="fa fa-user-plus"></i> Create New Notice</a></li>
				</ol>
			</div>
		</div>

		<div className="row">
			<div className="col-12">
				<div className="card">
					<div className="card-body create-user-table">
						<div className="table-responsive">
							<ServerTable ref={this.serverTable} columns={columns} url={url} options={options} bordered hover>
							{
								function (row,column)
								{
									switch (column) {
                                        case "file_name":
                                            return (
                                                
                                                <a href={`/public/notice/${row[column]}`}>Attachment</a>
                                            );

                                        case "link1":
                                            return (<a href={`${row[column]}`}>Link1</a>)
                                        case "link2":
                                            return (<a href={`${row[column]}`}>Link2</a>)
                                        case "link3":
                                            return (<a href={`${row[column]}`}>Link3</a>)
                                        case "link4":
                                            return (<a href={`${row[column]}`}>Link4</a>)
										case 'action':
											return (
												  <span><a href={`/notice_edit/${row.id}`} className='btn' data-toggle="tooltip" title="Edit"><i className="fa fa-edit" aria-hidden="true"></i></a>
                                                  <button className="btn" onClick={() => _this.handleDelete(`${row.id}`)}>
												  <i className="fa fa-trash" aria-hidden="true"></i></button></span>
											  );
										default:
											return (row[column]);
									}
                                    console.log(row.id);
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
export default NoticeList;
