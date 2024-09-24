import React, { Component } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';

import Script from "@gumgum/react-script-tag";

import Copyright from "../basic/Copyright";

import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url=location.protocol+'//'+location.host+'/';

class QualificationAdd extends Component {

    constructor(props) {
        super(props)
        this.state = {
            title: '',
			isLoading:true,
            errors: [],
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
        const { title } = event.target

        const data = {
            title: title.value,
        }

        axios.post(`${base_url}api`+'/qualification/create', data)
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
                    window.location.href = base_url+"qualification_list";

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
                                        <h4>Add Qualification</h4>
                                    </div>
                                </div>
                                <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                                    <ol className="breadcrumb">
                                        <li><a href={`/qualification_list`} className="btn bg-blue-soft text-blue"><i className="fa fa-angle-double-left"></i> Back to Qualification List</a></li>
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
                                                            <label>Qualification Name</label>
                                                            <input type='text' className={`form-control ${this.hasErrorFor('title') ? 'is-invalid' : ''}`} name='title'
                                                                ref={this.input} placeholder="Enter Qualification name" />{this.renderErrorFor('title')}
                                                        </div>
                                                        <div className="form-group col-md-12">
                                                            <input type="submit" className="btn btn-primary" value="Add Qualification" />
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
                                                    {/* <input type="submit" className="btn btn-primary mr-2" value="Add Qualification" /> */}
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

export default QualificationAdd;
