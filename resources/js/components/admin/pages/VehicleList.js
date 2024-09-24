import React, { Component } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import ServerTable from "react-strap-table";

import Script from "@gumgum/react-script-tag";

import Copyright from "../basic/Copyright";

import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url = location.protocol + '//' + location.host + '/';  

class VehicleList extends Component {

    constructor(props) {
        super(props)
        this.state = {
			isLoading:true,	
            items: []
        }
        this.handleDelete = this.handleDelete.bind(this);
        this.serverTable = React.createRef();
    }
    handleDelete(id) {
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
                axios.delete(base_url+`api/vehicle/delete/${id}`)	
                    .then((response) => {

                        if (response.data.status == 'successed') {
                            Swal.fire({
                                icon: "success",
                                text: response.data.message
                            });

                            this.refreshTable();
                        }
                        else {
                            Swal.fire({
                                icon: "error",
                                text: response.data.message
                            });
                        }

                    })
                    .catch((error) => {
                        Swal.fire({
                            text: error.message,
                            icon: "error"
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

        const url = base_url+'api/vehicle/index';	
        const columns = ['registration_no', 'description', 'capacity', 'routeNo', 'action'];

        let _this = this;

        const options = {
            perPage: 10,
            headings: { registration_no: 'Vehicle Reg.No', description: 'Vehicle Description', capacity: "Seating capacity", routeNo: "Route No", action: 'Actions' },
            sortable: ['registration_no', 'description', 'capacity', 'routeNo'],
            requestParametersNames: { query: 'search', direction: 'order' },
            responseAdapter: function (resp_data) {
                console.log(resp_data);
                return { data: resp_data.data.data ? resp_data.data.data : [], total: resp_data.data.total }
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
                                        <h4>Vehicle List</h4>
                                    </div>
                                </div>
                                <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                                    <ol className="breadcrumb breadcrumb-btn">
                                        <li>
                                            <a href={`/vehicle_add`} className="btn bg-blue-soft text-blue">
                                                <i className="fa fa-user-plus">Add New Vehicle</i>
                                            </a>
                                        </li>
                                    </ol>
                                </div>
                            </div>

                            {/* <div className="row">
                    <div className="col-12">
                        <div className="card">

                            <div className="card-body create-user-table">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped verticle-middle table-responsive-sm" id="example" className="display">
                                        <thead>
                                            <tr>
                                                <th scope="col">Vehicle Reg.No</th>
                                                <th scope="col">Vehicle Description</th>
												<th scope="col">Seating Capacity</th>
												<th scope="col">Route No.</th>
												<th scope="col">Actions</th>
                                            </tr>
                                        </thead>
                                          <tbody>{itemLists}</tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}

                            <div className="row">
                                <div className="col-12">
                                    <div className="card">
                                        <div className="card-body create-user-table">
                                            <div className="table-responsive">
                                                <ServerTable ref={this.serverTable} columns={columns} url={url} options={options} bordered hover>
                                                    {
                                                        function (row, column) {
                                                            switch (column) {
                                                                case 'action':
                                                                    return (
                                                                        <span>
                                                                            <a href={`/vehicle_edit/${row.id}`} className='btn' data-toggle="tooltip" title="Edit">
                                                                                <i className="fa fa-edit" aria-hidden="true"></i></a>
                                                                            <button className="btn" onClick={() => _this.handleDelete(`${row.id}`)}>
                                                                                <i className="fa fa-trash" aria-hidden="true"></i></button>
                                                                        </span>
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
            </div>
        );
    }
}

export default VehicleList;
