import React, { Component } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';

import Script from "@gumgum/react-script-tag";

import Copyright from "../basic/Copyright";

import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";  

const base_url = location.protocol + '//' + location.host + '/';   

class StationwiseStudentList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            formMessage: '',
			isLoading:true,	    
            errors: [],
            stationData: [],
            studentData: []
        }
        this.hasErrorFor = this.hasErrorFor.bind(this)
        this.renderErrorFor = this.renderErrorFor.bind(this)
        this.changeStudents = this.changeStudents.bind(this);
        this.handlePrint = this.handlePrint.bind(this);
        this.input = React.createRef();
    }

    changeStudents(e) {

        console.log(e.target.value);
        this.setState({
            station_id: e.target.value
        });

        const id = e.target.value;

        if (id > 0) {
            axios.get(`${base_url}api/stationwisestudent/getStudents/${id}`).then(response => {
                console.log(response.data);
                this.setState({
                    studentData: response.data.data ? response.data.data : []
                });
            })
                .catch(error => {
                    console.log(error.message);
                })
        }
        else {
            this.setState({
                studentData: []
            });
        }

    }

    handlePrint = (event,param) => {
        const type = event.currentTarget.id;
        console.log(type);
        axios.get(`${base_url}api/stationwisestudent/getPrints/${param}`).then(response => {	
            console.log(response);
            if (response.data.status === 'successed')
            {
                 var receipt =(typeof(response.data.data)!='object')?response.data.data:'';
                 if(receipt !='')
                 {
                    let a = document.createElement("a");
                    let url = base_url+'print'+'/'+'stationwise_student'+'/'+receipt;
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

    hasErrorFor(field) {
        return !!this.state.errors[field]
    }
    renderErrorFor(field) {
        if (this.hasErrorFor(field)) {
            return (<span className='invalid-feedback'> <strong>{this.state.errors[field][0]}</strong> </span>)
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

		
        axios.get(`${base_url}api/station/getStations`).then(response => {	
            console.log(response.data);
            this.setState({
                stationData: response.data.data ? response.data.data : [],
            });
        })
            .catch(error => {
                console.log(error.message);
            });


    }

    render() {
		
		const isLoad = this.state.isLoading;    			

if (isLoad) {  

// return null; 		
			 		
}  

        const { stationData } = this.state;
        const { studentData } = this.state;

        let stationList = stationData.length > 0
            && stationData.map((item, i) => {
                return (
                    <option key={i} value={item.stationId}>{item.stationName}</option>
                )
            }, this);
        console.log(studentData.map(user => user.stationId)[0]);

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
		HeaderPart start
	************************************/}


                <div id="main-wrapper">

                    <HeaderPart />


                    {/***********************************
	  HeaderPart end
	************************************/}






                    {/***********************************
		Main wrapper start
	************************************/}






                    {/***********************************
				Content body start
			************************************/}

                    <div className="content-body">
                        <div className="container-fluid">
                            <div className="row page-titles mx-0">
                                <div className="col-sm-6 p-md-0">
                                    <div className="welcome-text">
                                        <h4>Stationwise Student List</h4>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-xl-12 col-xxl-12">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="basic-form form-own">
                                                <form onSubmit={this.handleCreateNewItem}>
                                                    <div className="form-row">
                                                        <div className="form-group col-sm-3">
                                                            <label>Select Station</label>
                                                            <select className={`form-control ${this.hasErrorFor('station_id') ? 'is-invalid' : ''}`} id="station_id" name="station_id" value={(this.state.station_id) ? this.state.station_id : ''} onChange={this.changeStudents}>
                                                                <option value="" defaultValue={'DEFAULT'}>Select Station</option>
                                                                {stationList}
                                                            </select>
                                                            {this.renderErrorFor('station_id')}
                                                        </div>
                                                        {
                                                            (studentData.length > 0) ? (
                                                                <div className="form-group col-md-12 mrb-0 my-4">
                                                                    <div className="print-id-card-table">
                                                                        <div className="table-responsive">
                                                                            <table className="table table-bordered table-hover table-condensed">
                                                                                <thead>
                                                                                    <tr>
                                                                                        <th>#</th>
                                                                                        <th>Admission No.</th>
                                                                                        <th>Student Name</th>
                                                                                        <th>Course</th>
                                                                                        <th>Class</th>
                                                                                        <th>Father Name</th>
                                                                                        <th>Father Mobile No.</th>
                                                                                        <th>Station</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                    {studentData.map((item, key) => (
                                                                                        <tr key={key}>
                                                                                            <td>{key + 1}</td>
                                                                                            <td>{item.admission_no}</td>
                                                                                            <td>{item.student_name}</td>
                                                                                            <td>{item.courseName}</td>
                                                                                            <td>{item.className}</td>
                                                                                            <td>{item.father_name}</td>
                                                                                            <td>{item.f_mobile}</td>
                                                                                            <td>{item.stationName}</td>
                                                                                        </tr>
                                                                                    ))}
                                                                                </tbody>
                                                                            </table>
                                                                            <div className="profile-tab-btn text-left">
                                                                                <input type="button" className="btn btn-primary btn-sm mx-1" onClick={(e) => this.handlePrint(e,`${studentData.map(user => user.stationId)[0]}`)} value="Print Student List" />
                                                                            </div>

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ) :<div className="form-group col-sm-11 alert alert-danger mx-3" style={{ color: "brown" }}>No Record found</div>
                                                        }
                                                    </div>
                                                </form>
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

export default StationwiseStudentList;
