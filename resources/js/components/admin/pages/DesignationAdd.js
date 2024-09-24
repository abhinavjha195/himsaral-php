import React, { Component } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';

import Script from "@gumgum/react-script-tag";

import Copyright from "../basic/Copyright";

import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url=location.protocol+'//'+location.host+'/';

class DesignationAdd extends Component {

    constructor(props) {
        super(props)
        this.state = {
			isLoading:true,
            departmentId: '',
            title: '',
            formMessage: '',
            errors: [],
            departmentData: [],
            showError: false,
		    showSuccess: false,
        }
        this.handleCreateNewItem = this.handleCreateNewItem.bind(this)
        this.hasErrorFor = this.hasErrorFor.bind(this)
        this.renderErrorFor = this.renderErrorFor.bind(this)
        this.input = React.createRef();
    }

    handleCreateNewItem(event) {
        event.preventDefault();
        const { departmentId, title } = event.target


        const { history } = this.props
        const data = {
            departmentId: departmentId.value,
            title: title.value,
        }


        axios.post(`${base_url}api`+'/designation/create', data)
            .then(response => {
                console.log(response.data);
                if (response.data.status === 'failed') {
                    // redirect to the homepage
                    this.setState({
                        // formMessage: response.data.message,
                        showError:true,
                        showSuccess:false,
                        message: response.data.message,
                        errors: response.data.errors
                     })

                }
                else {
                    this.setState({
                        // formMessage: response.data.message,
                        message: response.data.message,
                        showError:false,
                        showSuccess:true,
                        errors: []
                    })
                    window.location.href = base_url+"designation_list";

                }
            })
            .catch(error => {
                console.log(error.message);
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


        axios.get(`${base_url}api`+'/designation/getdepartment').then(response => {
            console.log(response.data);
            this.setState({
                departmentData: response.data.data ? response.data.data : [],
            });
        })
            .catch(error => {
                console.log(error.message);
            })
    }

    render() {

const isLoad = this.state.isLoading;

if (isLoad) {

//return null;

}

        const { departmentData } = this.state;

        let departmentList = departmentData.length > 0
            && departmentData.map((item, i) => {
                // console.log(item.departmentId);
                return (
                    <option key={i} value={item.departmentId}>{item.departmentName}</option>
                )
            }, this);

        return (
            <div>



                {/********************
				   Preloader Start
				   *********************/}

                <Preloader />

                {/********************
	Preloader end
	*********************/}


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






                    {/***********************************
				Content body start
			************************************/}

                    <div className="content-body">
                        <div className="container-fluid">
                            <div className="row page-titles mx-0">
                                <div className="col-sm-6 p-md-0">
                                    <div className="welcome-text">
                                        <h4>Add Designation</h4>
                                    </div>
                                </div>
                                <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                                    <ol className="breadcrumb">
                                        <li><a href={`/designation_list`} className="btn bg-blue-soft text-blue"><i className="fa fa-angle-double-left"></i> Back to Designation List</a></li>
                                    </ol>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-xl-12 col-xxl-12">
                                    <div className="card">

                                        <div className="card-body">

                                            <div className="basic-form form-own">
                                                <form onSubmit={this.handleCreateNewItem}>
                                                    <div className="form-row">
                                                        <div className="form-group col-md-6">
                                                            <label>Department Name</label>
                                                            <select className={`form-control ${this.hasErrorFor('departmentId') ? 'is-invalid' : ''}`} id="departmentId" name="departmentId" ref={this.input}>
                                                                <option value="" defaultValue={'DEFAULT'}>Select Department</option>
                                                                {departmentList}
                                                            </select>
                                                            {this.renderErrorFor('departmentId')}
                                                        </div>

                                                        <div className="form-group col-md-6">
                                                            <label>Designation name</label>
                                                            <input type='text' className={`form-control ${this.hasErrorFor('title') ? 'is-invalid' : ''}`} name='title'
                                                                ref={this.input} placeholder="Enter designation name" />{this.renderErrorFor('title')}
                                                        </div>
                                                        <div className="form-group col-md-12">
                                                        <input type="submit" className="btn btn-primary mr-2" value="Add Designation" />
                                                        </div>
                                                        <div className="form-group col-md-12">
                                                            {this.state.showError ?
                                                                <div className="alert alert-danger" style={{color:"brown"}}>
                                                                    <strong>{this.state.message}</strong>
                                                                </div>
                                                                : null}
                                                                {this.state.showSuccess ?
                                                                <div className="alert alert-success" style={{color:"green"}}>
                                                                    {this.state.message}
                                                                </div>
                                                            : null}
                                                        </div>
                                                    </div>

                                                    {/* <label className="label">{this.state.formMessage}</label> */}

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
            </div>
        );

    }

}

export default DesignationAdd;
