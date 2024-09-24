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

class TeacherClassList extends Component {

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

        //axios.get(`/class/delete/${id}`);
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
				  .catch((err) => {

					Swal.fire({
						text:err.message,
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

convertToDate(dateString) {
	var dateObject = new Date(dateString);
	let dat=dateString.toString();
	let arr = dat.split("-");
    let dt = arr[2]+'-'+arr[1]+'-'+arr[0];
	return dt;
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

    const url = base_url+'api/teacherclass/index';
	const columns=['emp_no','emp_name','course_list','class_list','section_list','action'];
	let _this = this;

	const options = {
		perPage: 10,
		headings: {emp_no:'Employee No.',emp_name:'Employee Name',course_list:'Course Name',class_list:'Class Name',section_list:'Section Name',action:'Action'},
		sortable: ['emp_no','emp_name'],
		requestParametersNames: {query:'search',direction:'order'},
		responseAdapter: function (resp_data)
		{
			console.log(resp_data.data);
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
					<h4>List of Assigned Classes to Teachers</h4>
				</div>
			</div>
			{/* <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
				<ol className="breadcrumb breadcrumb-btn">
					<li><a href={`/assign_class_to_teacher`} className="btn bg-blue-soft text-blue"><i className="fa fa-user-plus"></i> Assign New Class to Teachers</a></li>
				</ol>
			</div> */}
		</div>

		<div className="row">
			<div className="col-12">
				<div className="card">
					{/****<!--div className="card-header"><h4 className="card-title">Fee Collection Amount</h4></div--->****/}

					<div className="card-body create-user-table">
						<div className="fee-collection">
							<div className="basic-form form-own email-form">
								<div className="form-row">
								  <div className="form-group col-md-12 mrb-0">
									<div className="assign-className-table">
									  <div className="table-responsive">
											<ServerTable ref={this.serverTable} columns={columns} url={url} options={options} bordered striped>
											{
												function (row, column)
												{
                                                    if(column == 'section_list'){
                                                        const sections = row.section_list.split(',').map(item => {
                                                            const [sectionName, classId] = item.split(':');
                                                            return { sectionName, classId };
                                                          });

                                                          const groupedSections = sections.reduce((acc, section) => {
                                                            if (!acc[section.classId]) {
                                                              acc[section.classId] = [];
                                                            }
                                                            acc[section.classId].push(section.sectionName);
                                                            return acc;
                                                          }, {});

                                                          // Filter out groups where all section names are 'N/A'
                                                          const filteredGroups = Object.keys(groupedSections).reduce((acc, classId) => {
                                                            const validSections = groupedSections[classId].filter(name => name !== 'N/A');
                                                            if (validSections.length > 0) {
                                                              acc[classId] = validSections;
                                                            }
                                                            return acc;
                                                          }, {});

                                                          // Check if there are any valid groups, otherwise show 'N/A'
                                                          if (Object.keys(filteredGroups).length === 0) {
                                                            return (
                                                              <span>
                                                                N/A
                                                              </span>
                                                            );
                                                          }

                                                          return (
                                                            <>
                                                              {Object.keys(filteredGroups).map(classId => (
                                                                <span className="badge bg-purple-soft text-purple" key={classId}>
                                                                  {filteredGroups[classId].map((sectionName, index) => (
                                                                    <label className="form-check form-check-inline" key={`${classId}-${sectionName}-${index}`}>
                                                                      <input className="form-check-input" type="checkbox" id={`${classId}-${sectionName}-${index}`} />
                                                                      {sectionName}
                                                                    </label>
                                                                  ))}
                                                                </span>
                                                              ))}
                                                            </>
                                                          );
                                                    }
													// if(column=='section_list')
													// {
														// const arr=row.section_list.split(',');
														// var indents = [];
														// for(var i=0;i<arr.length;i++)
														// {
														// 	if(arr[i]=='N/A')
														// 	{
														// 		indents.push(<label className="form-check-label" htmlFor={i} key={arr[i]}>{arr[i]}</label>);
														// 	}
														// 	else
														// 	{
														// 		indents.push(<div className="form-check form-check-inline" key={arr[i]}>
														// 		<input className="form-check-input" type="checkbox"/><label className="form-check-label" htmlFor={i} key={arr[i]}>{arr[i]}</label>
														// 		</div>);
														// 	}
														// }
														// return (
														//    <>
														// 	{indents}
														//    </>
														// );
													// }
													else if(column=='action')
													{
														return (
															  <><a href={`/assign_class_to_teacher_edit/${row.id}`} className='btn' data-toggle="tooltip" title="Edit">
															  <i className="fa fa-edit" aria-hidden="true"></i></a>
															  {/* <button className="btn" onClick={() => _this.handleDelete(`${row.id}`)}><i className="fa fa-trash" aria-hidden="true">
															  </i></button> */}
                                                              </>
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
						       </div>{/****<!--/ form-row -->****/}
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

export default TeacherClassList;
