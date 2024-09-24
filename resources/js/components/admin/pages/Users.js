import React, { Component } from "react";


import Script from "@gumgum/react-script-tag";

import Copyright from "../basic/Copyright";

import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url=location.protocol+'//'+location.host+'/';	 

class Users extends Component {
	constructor(props) {
  super(props)
  this.state = {
		isLoading:true,	
  }
	
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
                    <h4>User List</h4>
                  </div> 
                </div>
                <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                  <ol className="breadcrumb breadcrumb-btn">
                    <li>
                      <a
                        href="./add-user.html"
                        className="btn bg-blue-soft text-blue"
                      >
                        <i className="fa fa-user-plus" /> Add New User
                      </a>
                    </li>
                  </ol>
                </div>
              </div>
              {/* row */}
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    {/*div class="card-header"><h4 class="card-title">Basic Datatable</h4></div*/}
                    <div className="card-body create-user-table">
                      <div className="table-responsive">
                        <table
                          className="table table-bordered table-striped verticle-middle table-responsive-sm"
                          id="example"
                        >
                          <thead>
                            <tr>
                              <th scope="col">User</th>
                              <th scope="col">Email</th>
                              <th scope="col">Role</th>
                              <th scope="col">Modules</th>
                              <th scope="col">Join Date</th>
                              <th scope="col">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <img
                                  className="user-profile"
                                  src={base_url+"images/male.jpg"}	
                                />{" "}
                                <span className="name-span">Airi Satou</span>
                              </td>
                              <td>asatou@email.com</td>
                              <td>Registered</td>
                              <td>
                                <span className="badge bg-blue-soft text-blue">
                                  Admission
                                </span>
                                <span className="badge bg-red-soft text-red">
                                  Fee
                                </span>
                                <span className="badge bg-purple-soft text-purple">
                                  Employee
                                </span>
                              </td>
                              <td>20-01-2022</td>
                              <td>
                                <a className="btn" href="./edit-user.html">
                                  <i
                                    className="fa fa-edit"
                                    aria-hidden="true"
                                  />
                                </a>
                                <a className="btn" href="#">
                                  <i
                                    className="fa fa-trash"
                                    aria-hidden="true"
                                  />
                                </a>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <img
                                  className="user-profile"
                                  src={base_url+"images/female.jpg"}			
                                />{" "}
                                <span className="name-span">Airi Satou</span>
                              </td>
                              <td>asatou@email.com</td>
                              <td>Registered</td>
                              <td>
                                <span className="badge bg-green-soft text-green">
                                  Transport
                                </span>
                                <span className="badge bg-blue-soft text-blue">
                                  Mark Analysis
                                </span>
                                <span className="badge bg-red-soft text-red">
                                  Payroll
                                </span>
                                <span className="badge bg-purple-soft text-purple">
                                  Admission
                                </span>
                                <span className="badge bg-yellow-soft text-yellow">
                                  Fee
                                </span>
                              </td>
                              <td>20-01-2022</td>
                              <td>
                                <a className="btn" href="./edit-user.html">
                                  <i
                                    className="fa fa-edit"
                                    aria-hidden="true"
                                  />
                                </a>
                                <a className="btn" href="#">
                                  <i
                                    className="fa fa-trash"
                                    aria-hidden="true"
                                  />
                                </a>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <img
                                  className="user-profile"
                                  src={base_url+"images/male.jpg"}	
                                />{" "}
                                <span className="name-span">Airi Satou</span>
                              </td>
                              <td>asatou@email.com</td>
                              <td>Registered</td>
                              <td>
                                <span className="badge bg-red-soft text-red">
                                  Mark Analysis
                                </span>
                              </td>
                              <td>20-01-2022</td>
                              <td>
                                <a className="btn" href="./edit-user.html">
                                  <i
                                    className="fa fa-edit"
                                    aria-hidden="true"
                                  />
                                </a>
                                <a className="btn" href="#">
                                  <i
                                    className="fa fa-trash"
                                    aria-hidden="true"
                                  />
                                </a>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <img
                                  className="user-profile"
                                  src={base_url+"images/female.jpg"}		
                                />{" "}
                                <span className="name-span">Bradley Greer</span>
                              </td>
                              <td>asatou@email.com</td>
                              <td>Registered</td>
                              <td>
                                <span className="badge bg-green-soft text-green">
                                  Mark Analysis
                                </span>
                                <span className="badge bg-blue-soft text-blue">
                                  Employee
                                </span>
                              </td>
                              <td>20-01-2022</td>
                              <td>
                                <a className="btn" href="./edit-user.html">
                                  <i
                                    className="fa fa-edit"
                                    aria-hidden="true"
                                  />
                                </a>
                                <a className="btn" href="#">
                                  <i
                                    className="fa fa-trash"
                                    aria-hidden="true"
                                  />
                                </a>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <img
                                  className="user-profile"
                                  src={base_url+"images/male.jpg"}	
                                />{" "}
                                <span className="name-span">
                                  Brenden Wagner
                                </span>
                              </td>
                              <td>asatou@email.com</td>
                              <td>Registered</td>
                              <td>
                                <span className="badge bg-blue-soft text-blue">
                                  Transport
                                </span>
                                <span className="badge bg-red-soft text-red">
                                  Mark Analysis
                                </span>
                                <span className="badge bg-purple-soft text-purple">
                                  Employee
                                </span>
                              </td>
                              <td>20-01-2022</td>
                              <td>
                                <a className="btn" href="./edit-user.html">
                                  <i
                                    className="fa fa-edit"
                                    aria-hidden="true"
                                  />
                                </a>
                                <a className="btn" href="#">
                                  <i
                                    className="fa fa-trash"
                                    aria-hidden="true"
                                  />
                                </a>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <img
                                  className="user-profile"
                                  src={base_url+"images/female.jpg"}	
                                />{" "}
                                <span className="name-span">
                                  Brielle Williamson
                                </span>
                              </td>
                              <td>asatou@email.com</td>
                              <td>Registered</td>
                              <td>
                                <span className="badge bg-blue-soft text-blue">
                                  Admission
                                </span>
                                <span className="badge bg-red-soft text-red">
                                  Fee
                                </span>
                                <span className="badge bg-purple-soft text-purple">
                                  Employee
                                </span>
                              </td>
                              <td>20-01-2022</td>
                              <td>
                                <a className="btn" href="./edit-user.html">
                                  <i
                                    className="fa fa-edit"
                                    aria-hidden="true"
                                  />
                                </a>
                                <a className="btn" href="#">
                                  <i
                                    className="fa fa-trash"
                                    aria-hidden="true"
                                  />
                                </a>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <img
                                  className="user-profile"
                                  src={base_url+"images/male.jpg"}		
                                />{" "}
                                <span className="name-span">Bruno Nash</span>
                              </td>
                              <td>asatou@email.com</td>
                              <td>Registered</td>
                              <td>
                                <span className="badge bg-green-soft text-green">
                                  Transport
                                </span>
                                <span className="badge bg-blue-soft text-blue">
                                  Mark Analysis
                                </span>
                                <span className="badge bg-red-soft text-red">
                                  Payroll
                                </span>
                                <span className="badge bg-purple-soft text-purple">
                                  Admission
                                </span>
                                <span className="badge bg-yellow-soft text-yellow">
                                  Fee
                                </span>
                              </td>
                              <td>20-01-2022</td>
                              <td>
                                <a className="btn" href="./edit-user.html">
                                  <i
                                    className="fa fa-edit"
                                    aria-hidden="true"
                                  />
                                </a>
                                <a className="btn" href="#">
                                  <i
                                    className="fa fa-trash"
                                    aria-hidden="true"
                                  />
                                </a>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <img
                                  className="user-profile"
                                  src={base_url+"images/female.jpg"}	
                                />{" "}
                                <span className="name-span">Caesar Vance</span>
                              </td>
                              <td>asatou@email.com</td>
                              <td>Registered</td>
                              <td>
                                <span className="badge bg-red-soft text-red">
                                  Mark Analysis
                                </span>
                              </td>
                              <td>20-01-2022</td>
                              <td>
                                <a className="btn" href="./edit-user.html">
                                  <i
                                    className="fa fa-edit"
                                    aria-hidden="true"
                                  />
                                </a>
                                <a className="btn" href="#">
                                  <i
                                    className="fa fa-trash"
                                    aria-hidden="true"
                                  />
                                </a>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <img
                                  className="user-profile"
                                  src={base_url+"images/male.jpg"}	
                                />{" "}
                                <span className="name-span">Cara Stevens</span>
                              </td>
                              <td>asatou@email.com</td>
                              <td>Registered</td>
                              <td>
                                <span className="badge bg-green-soft text-green">
                                  Mark Analysis
                                </span>
                                <span className="badge bg-blue-soft text-blue">
                                  Employee
                                </span>
                              </td>
                              <td>20-01-2022</td>
                              <td>
                                <a className="btn" href="./edit-user.html">
                                  <i
                                    className="fa fa-edit"
                                    aria-hidden="true"
                                  />
                                </a>
                                <a className="btn" href="#">
                                  <i
                                    className="fa fa-trash"
                                    aria-hidden="true"
                                  />
                                </a>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <img
                                  className="user-profile"
                                  src={base_url+"images/female.jpg"}		
                                />{" "}
                                <span className="name-span">Cedric Kelly</span>
                              </td>
                              <td>asatou@email.com</td>
                              <td>Registered</td>
                              <td>
                                <span className="badge bg-blue-soft text-blue">
                                  Transport
                                </span>
                                <span className="badge bg-red-soft text-red">
                                  Mark Analysis
                                </span>
                                <span className="badge bg-purple-soft text-purple">
                                  Employee
                                </span>
                              </td>
                              <td>20-01-2022</td>
                              <td>
                                <a className="btn" href="./edit-user.html">
                                  <i
                                    className="fa fa-edit"
                                    aria-hidden="true"
                                  />
                                </a>
                                <a className="btn" href="#">
                                  <i
                                    className="fa fa-trash"
                                    aria-hidden="true"
                                  />
                                </a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
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

export default Users;