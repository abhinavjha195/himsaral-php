import React, { Component } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';

import Script from "@gumgum/react-script-tag";

import Copyright from "../basic/Copyright";

import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";
import { message } from "laravel-mix/src/Log";

const base_url=location.protocol+'//'+location.host+'/';


class FeeCatView extends Component {

  constructor (props) {
	  super(props)
	  this.state = {
		isLoading:true,
		fee_id:0,
		title:'',
		fee_type:'',
		applicable:'',
		printable:0,
		changeable:0,
		feeData:[],
        errors: {},
        message:'',
        showError: false,
        showSuccess: false,
	  }
	  this.handleChange = this.handleChange.bind(this);
	  this.handleUpdate	 = this.handleUpdate.bind(this);
	  this.input = React.createRef();
  }
  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
        [name]: value,
        errors: { ...this.state.errors, [name]: '' } // Clear the specific field error
    });
	//   this.setState({ [event.target.name]: event.target.value });
  }
   handleUpdate (event) {
	  event.preventDefault();
      this.setState({ showError: false, showSuccess: false, errors: {} });

	  const { fee_id,title,fee_type,applicable,changeable,printable} = event.target;

		const urlString = window.location.href;
		const url = new URL(urlString);
		const lastSegment = url.pathname.split('/').pop();
		const id = lastSegment;

	  const data = {
			title: title.value,
			fee_type: fee_type.value,
			applicable: applicable.value,
			changeable: changeable.value,
			printable: printable.value
		}

	 axios.post(`${base_url}api`+`/feecat/update/${id}`,data).then(response => {

		if (response.data.status === 'successed') {
			this.setState({ showError: false, showSuccess: true, message: response.data.message});
			setTimeout(() => {
                window.location.href = base_url+"feecat_list";
            }, 2000);
		}
		else
		{
		   this.setState({ showError: true, showSuccess: false, message: response.data.message, errors: response.data.errors || {} });
		}
    })
    .catch(error => {
	   console.log(error.message);
    })

   }
   componentDidMount() {
	const urlString = window.location.href;
    const url = new URL(urlString);
    const lastSegment = url.pathname.split('/').pop();
	const id = lastSegment;

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


	axios.get(`${base_url}api`+`/feecat/edit/${id}`).then(response => {
	this.setState({
			feeData:response.data.data?response.data.data:[]
		});
	})
	.catch(error => {
	   console.log(error.message);
    })

}
   render () {

const isLoad = this.state.isLoading;

if (isLoad) {

//return null;

}

	let fee_id=(this.state.fee_id)?this.state.fee_id:(this.state.feeData.length>0)?this.state.feeData[0].fee_id :0;
	let fee_title=(this.state.title)?this.state.title:(this.state.feeData.length>0)?this.state.feeData[0].name:'';
	let fee_type=(this.state.fee_type)?this.state.fee_type:(this.state.feeData.length>0)?this.state.feeData[0].fee_type:'';
    let applicable=(this.state.applicable)?this.state.applicable:(this.state.feeData.length>0)?this.state.feeData[0].applicable:'';
    let printable=(this.state.printable)?this.state.printable:(this.state.feeData.length>0)?this.state.feeData[0].printable:false;
    let changeable=(this.state.changeable)?this.state.changeable:(this.state.feeData.length>0)?this.state.feeData[0].changeable:false;

	/* if(this.state.feeData.length>0)
	console.log('f='+this.state.fee_type);   */

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
                                        <h4>Edit Fee Category</h4>
                                    </div>
                                </div>
                                <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                                    <ol className="breadcrumb">
                                        <li><a href="/feecat_list" className="btn bg-blue-soft text-blue"><i className="fa fa-angle-double-left" /> Back to Fee Category List</a></li>
                                    </ol>
                                </div>
                            </div>
                            {/* row */}
                            <div className="row">
                                <div className="col-xl-12 col-xxl-12">
                                    <div className="card">

                                        <div className="card-body">
                                            <div className="basic-form form-own">
                                                <form onSubmit={this.handleUpdate}>
													<div className="form-row">

														 <div className="form-group col-md-6">
															<label>Fee Category</label>
															<input type="text" name="title" className="form-control"  placeholder="Enter Category Title" value={fee_title} ref={this.input} onChange={(event)=>this.handleChange(event)}/>
                                                            { this.state.errors.title && (
                                                                <div className="text-danger">{this.state.errors.title[0]}</div>
                                                            )}
														 </div>

														 <div className="form-group col-md-6">
															<label>Fee Type</label>
															<div className="form-row">
															  <div className="form-group col-md-3">
																<div className="form-check">
																  <input className="form-check-input" type="radio" name="fee_type" value="tution" checked={(fee_type=="tution")?true:false} ref={this.input} onChange={(event)=>this.handleChange(event)}/>
																  <label className="form-check-label">Tution</label>
																</div>
															  </div>

															  <div className="form-group col-md-3">
																<div className="form-check">
																  <input className="form-check-input" type="radio" name="fee_type" value="fine" checked={(fee_type=="fine")?true:false} ref={this.input} onChange={(event)=>this.handleChange(event)}/>
																  <label className="form-check-label">Fine</label>
																</div>
															  </div>

															  <div className="form-group col-md-3">
																<div className="form-check">
																  <input className="form-check-input" type="radio" name="fee_type" value="transport" checked={(fee_type=="transport")?true:false} ref={this.input} onChange={(event)=>this.handleChange(event)}/>
																  <label className="form-check-label">Transport</label>
																</div>
															  </div>

															  <div className="form-group col-md-3">
																<div className="form-check">
																  <input className="form-check-input" type="radio" name="fee_type" value="other" checked={(fee_type=="other")?true:false} ref={this.input} onChange={(event)=>this.handleChange(event)}/>
																  <label className="form-check-label">Others</label>
																</div>
															  </div>

															</div>
                                                            { this.state.errors.fee_type && (
                                                                <div className="text-danger">{this.state.errors.fee_type[0]}</div>
                                                            )}
														  </div>


													</div>{/*/ form-row */}

													<div className="form-row">

														<div className="form-group col-md-6">
															<label>Applicable</label>
															<div className="form-row">
															  <div className="form-group col-md-3">
																<div className="form-check">
																  <input className="form-check-input" type="radio" name="applicable" value="all" checked={applicable=="all"?true:false} ref={this.input} onChange={(event)=>this.handleChange(event)}/>
																  <label className="form-check-label">All</label>
																</div>
															  </div>

															  <div className="form-group col-md-3">
																<div className="form-check">
																  <input className="form-check-input" type="radio" name="applicable" value="old" checked={applicable=="old"?true:false} ref={this.input} onChange={(event)=>this.handleChange(event)}/>
																  <label className="form-check-label">Old</label>
																</div>
															  </div>

															  <div className="form-group col-md-3">
																<div className="form-check">
																  <input className="form-check-input" type="radio" name="applicable" value="new" checked={applicable=="new"?true:false} ref={this.input} onChange={(event)=>this.handleChange(event)}/>
																  <label className="form-check-label">New</label>
																</div>
															  </div>

															</div>
                                                            { this.state.errors.applicable && (
                                                                <div className="text-danger">{this.state.errors.applicable[0]}</div>
                                                            )}
														  </div>

														  <div className="form-group col-md-3">
															<label>Printable</label>
															<div className="form-row">
															  <div className="form-group col-md-3">
																<div className="form-check">
																  <input className="form-check-input" type="radio" name="printable" value="1" checked={printable=="1"?true:false} ref={this.input} onChange={(event)=>this.handleChange(event)}/>
																  <label className="form-check-label">Yes</label>
																</div>
															  </div>

															  <div className="form-group col-md-3">
																<div className="form-check">
																  <input className="form-check-input" type="radio" name="printable" value="0" checked={printable=="0"?true:false} ref={this.input} onChange={(event)=>this.handleChange(event)}/>
																  <label className="form-check-label">No</label>
																</div>
															  </div>

															</div>
                                                            { this.state.errors.printable && (
                                                                <div className="text-danger">{this.state.errors.printable[0]}</div>
                                                            )}
														  </div>

														  <div className="form-group col-md-3">
															<label>Changeable</label>
															<div className="form-row">
															  <div className="form-group col-md-3">
																<div className="form-check">
																  <input className="form-check-input" type="radio" name="changeable" value="1" checked={changeable=="1"?true:false} ref={this.input} onChange={(event)=>this.handleChange(event)}/>
																  <label className="form-check-label">Yes</label>
																</div>
															  </div>

															  <div className="form-group col-md-3">
																<div className="form-check">
																  <input className="form-check-input" type="radio" name="changeable" value="0" checked={changeable=="0"?true:false} ref={this.input} onChange={(event)=>this.handleChange(event)}/>
																  <label className="form-check-label">No</label>
																</div>
															  </div>

															</div>
                                                            { this.state.errors.changeable && (
                                                                <div className="text-danger">{this.state.errors.changeable[0]}</div>
                                                            )}
														  </div>

													</div>{/*/ form-row */}

													<div className="form-row">
														<div className="form-group col-sm-6">
															<input type="submit" className="btn btn-primary" value="Submit" />
														</div>
													</div>{/*/ form-row */}

													<div className="text-center">

														{this.state.showError ? <div className="error">{this.state.message}</div> : null}

														{this.state.showSuccess ? <div className="success">{this.state.message}</div> : null}

													</div>
												</form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>{/*/ row */}
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
export default FeeCatView;
