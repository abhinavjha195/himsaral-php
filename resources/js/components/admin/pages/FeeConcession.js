import React, { Component } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';

import Script from "@gumgum/react-script-tag";

import Copyright from "../basic/Copyright";

import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url=location.protocol+'//'+location.host+'/';


class FeeConcession extends Component {

  constructor (props) {
  super(props)
  this.state = {
	showError: false,
	showSuccess: false,
	isLoading:true,
	messgae: '',
	tab:'',
	concessionData:[],
	concession_type:'',
	concession_type2:'',
	concession_amount:0,
	concession_amount2:0
  }
	   this.handleCreate = this.handleCreate.bind(this);
	   this.handleChange = this.handleChange.bind(this);
	   this.handleTab = this.handleTab.bind(this);
	   this.handleNav = this.handleNav.bind(this);
   }
   handleChange = (event) => {
		const re = /^[0-9.\b]+$/;
		var inp = event.target.value;
		const arr=inp.split('.');

		if(re.test(inp) && (arr.length<=2))
		{
			this.setState({ [event.target.name]:event.target.value });
		}
  }
  handleNav = (event,param) => {
	   this.setState({ tab:'',concession_type:'',concession_type2:'',concession_amount:0,concession_amount2:0,showError:false,showSuccess:false });
  }
  handleTab = (event,param) => {
	   this.setState({ [event.target.name]: event.target.value });
	   this.setState({tab:param});
  }
   handleCreate (event) {
   event.preventDefault();

  const { concession,concession_type,concession_amount,concession_type2,concession_amount2 } = event.target;

let concesion=concession.value;

let type=(concession_type)?concession_type.value:'';
let type2=(concession_type2)?concession_type2.value:'';
let amount=(concession_amount)?concession_amount.value:0;
let amount2=(concession_amount2)?concession_amount2.value:0;

const data = {
	concession:concession.value,
	type:type,
	type2:type2,
	amount:amount,
	amount2:amount2
}

console.log(data);

	axios.post(`${base_url}api`+'/feeconcession/add',data)
    .then(response => {

		if (response.data.status === 'successed')
		{
			this.setState({ showError: false, showSuccess: true, message: response.data.message});
			this.getData();
		}
		else
		{
			this.setState({ showError: true, showSuccess: false, message: response.data.message});
		}
    })
    .catch(error => {
	   console.log(error.message);
    })

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


	this.getData();

}
getData(){

	axios.get(`${base_url}api`+`/feeconcession/index`).then(response => {

	this.setState({
			concessionData:response.data.data?response.data.data:[]
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

	const concessions=(this.state.concessionData.length>0)?this.state.concessionData:[];
	let tab1_type='';
	let tab2_type='';
	let tab3_type='';
	let tab1_type2='';
	let tab2_type2='';

	let tab1_amount=0;
	let tab2_amount=0;
	let tab3_amount=0;
	let tab1_amount2=0;
	let tab2_amount2=0;



	for(var key in concessions)
	{
		if(concessions[key].ConcessionName=='sibling')
		{
			tab1_type=concessions[key].ConcessionType;
			tab1_type2=concessions[key].ConcessionType2;
			tab1_amount=concessions[key].ConcessionAMount;
			tab1_amount2=concessions[key].ConcessionAMount2;
		}
		if(concessions[key].ConcessionName=='staff')
		{
			tab2_type=concessions[key].ConcessionType;
			tab2_type2=concessions[key].ConcessionType2;
			tab2_amount=concessions[key].ConcessionAMount;
			tab2_amount2=concessions[key].ConcessionAMount2;
		}
		if(concessions[key].ConcessionName=='management')
		{
			tab3_type=concessions[key].ConcessionType;
			tab3_amount=concessions[key].ConcessionAMount;
		}

	}

	// console.log(tab1_type);

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
									<h4>Fee Concession</h4>
								</div>
							</div>
						</div>
						{/*****-- row --***/}

						<div className="row">
						  <div className="col-xl-12 col-lg-12 col-md-12">
							<div className="profile-tab">
							  <div className="custom-tab-1">
								<ul className="nav nav-tabs">
								  <li className="nav-item"><a onClick={(e) => this.handleNav(e,'sibling')} href="#personal-details" data-toggle="tab" className="nav-link active show">Sibling's Concession</a></li>
								  <li className="nav-item"><a onClick={(e) => this.handleNav(e,'staff')} href="#employement-details" data-toggle="tab" className="nav-link">Staff Concession</a></li>
								  <li className="nav-item"><a onClick={(e) => this.handleNav(e,'management')} href="#academics-details" data-toggle="tab" className="nav-link">Management concession</a></li>
								</ul>

								<div className="tab-content">
								  <div id="personal-details" className="tab-pane fade active show">
									<div className="pt-3">
									  <div className="settings-form">
										<div className="row">

										  <div className="col-xl-12 col-lg-12 col-md-12">
											<div className="card">
											  <div className="card-body">
												<div className="basic-form form-own">
												  <form onSubmit={this.handleCreate}>

													<div className="form-row">
													<input type="hidden" name="concession" defaultValue="sibling"/>
													  <div className="form-group col-md-6">
														<label>Concession Type</label>
														<div className="form-check settings-form-radio">
														  <input className="form-check-input" type="radio" name="concession_type" value="fixed" checked={((this.state.concession_type=='fixed') && (this.state.tab=='sibling'))?true:(tab1_type=='fixed')?true:false} onChange={(e) => this.handleTab(e,'sibling')}/>
														  <label className="form-check-label">Fixed</label>

														  <input className="form-check-input" type="radio" name="concession_type" value="percentage"  checked={((this.state.concession_type=='percentage') && (this.state.tab=='sibling'))?true:(tab1_type=='percentage')?true:false} onChange={(e) => this.handleTab(e,'sibling')}/>
														  <label className="form-check-label">Percentage</label>
														</div>
													  </div>

													  <div className="form-group col-md-6">
														<label>2nd child Concession Amount</label>
														<input type="text" name="concession_amount" value={this.state.concession_amount?this.state.concession_amount:tab1_amount} className="form-control" placeholder="" onChange={this.handleChange}/>
													  </div>

													  <div className="form-group col-md-6">
														<label>Concession Type</label>
														<div className="form-check settings-form-radio">
														  <input className="form-check-input" type="radio" name="concession_type2" value="fixed" checked={((this.state.concession_type2=='fixed') && (this.state.tab=='sibling'))?true:(tab1_type2=='fixed')?true:false} onChange={(e) => this.handleTab(e,'sibling')}/>
														  <label className="form-check-label">Fixed</label>

														  <input className="form-check-input" type="radio" name="concession_type2" value="percentage"  checked={((this.state.concession_type2=='percentage') && (this.state.tab=='sibling'))?true:(tab1_type2=='percentage')?true:false} onChange={(e) => this.handleTab(e,'sibling')}/>
														  <label className="form-check-label">Percentage</label>
														</div>
													  </div>

													  <div className="form-group col-md-6">
														<label>3rd child Concession Amount</label>
														<input type="text" name="concession_amount2" value={this.state.concession_amount2?this.state.concession_amount2:tab1_amount2} className="form-control" placeholder="" onChange={this.handleChange}/>
													  </div>
													  <div className="form-group col-md-6">
														  <div className="profile-tab-btn text-left">
															<input type="submit" className="btn btn-primary" value="Save"/>
														  </div>
													  </div>
													</div>{/*****-- form-row --***/}
                                                    <div className="text-center">
														{this.state.showError ? <div className="error">{this.state.message}</div> : null}
														{this.state.showSuccess ? <div className="success">{this.state.message}</div> : null}
													</div>
												  </form>
												</div>
											  </div>{/*****-- card-body --***/}
											</div>{/*****-- card --***/}
										  </div>{/*****--col-8 --***/}
										</div>{/*****-- row --***/}
									  </div>{/*****--settings-form --***/}
									</div>
								  </div>{/*****--tab-pane --***/}

								  <div id="employement-details" className="tab-pane fade">
									<div className="pt-3">
									  <div className="settings-form">
										<div className="row">
										  <div className="col-xl-12 col-lg-12 col-md-12">
											<div className="card">
											  <div className="card-body">
												<div className="basic-form form-own">
												  <form onSubmit={this.handleCreate}>

													<div className="form-row">
													<input type="hidden" name="concession" defaultValue="staff"/>
													  <div className="form-group col-md-6">
														<label>Concession Type</label>
														<div className="form-check settings-form-radio">
														  <input className="form-check-input" type="radio" name="concession_type" value="fixed" checked={((this.state.concession_type=='fixed') && (this.state.tab=='staff'))?true:(tab2_type=='fixed')?true:false} onChange={(e) => this.handleTab(e,'staff')}/>
														  <label className="form-check-label">Fixed</label>

														  <input className="form-check-input" type="radio" name="concession_type" value="percentage" checked={((this.state.concession_type=='percentage') && (this.state.tab=='staff'))?true:(tab2_type=='percentage')?true:false} onChange={(e) => this.handleTab(e,'staff')}/>
														  <label className="form-check-label">Percentage</label>
														</div>
													  </div>

													  <div className="form-group col-md-6">
														<label>1st child Concession Amount</label>
														<input type="text" name="concession_amount" className="form-control" value={this.state.concession_amount?this.state.concession_amount:tab2_amount} placeholder="" onChange={this.handleChange}/>
													  </div>

													  <div className="form-group col-md-6">
														<label>Concession Type</label>
														<div className="form-check settings-form-radio">
														  <input className="form-check-input" type="radio" checked={false} name="concession_type2" value="fixed" checked={((this.state.concession_type2=='fixed') && (this.state.tab=='staff'))?true:(tab2_type2=='fixed')?true:false} onChange={(e) => this.handleTab(e,'staff')}/>
														  <label className="form-check-label">Fixed</label>

														  <input className="form-check-input" type="radio" checked={true} name="concession_type2" value="percentage" checked={((this.state.concession_type2=='percentage') && (this.state.tab=='staff'))?true:(tab2_type2=='percentage')?true:false} onChange={(e) => this.handleTab(e,'staff')}/>
														  <label className="form-check-label">Percentage</label>
														</div>
													  </div>

													  <div className="form-group col-md-6">
														<label>2nd child Concession Amount</label>
														<input type="text" name="concession_amount2" className="form-control" value={this.state.concession_amount2?this.state.concession_amount2:tab2_amount2}  placeholder="" onChange={this.handleChange}/>
													  </div>
													  <div className="form-group col-md-6">
														  <div className="profile-tab-btn text-left">
															<input type="submit" className="btn btn-primary" value="Save"/>
														  </div>
													  </div>
													</div>
                                                    <div className="text-center">
														{this.state.showError ? <div className="error">{this.state.message}</div> : null}
														{this.state.showSuccess ? <div className="success">{this.state.message}</div> : null}
													</div>
												  </form>
												</div>
											  </div>{/*****-- card-body --***/}
											</div>{/*****-- card --***/}
										  </div>{/*****-- col-8 --***/}
										</div>{/*****--row --***/}
									  </div>{/*****-- settings-form --***/}
									</div>
								  </div>{/*****-- tab-pane --***/}

								  <div id="academics-details" className="tab-pane fade">
									<div className="pt-3">
									  <div className="settings-form">
										<div className="row">
										  <div className="col-md-12">
											<div className="card">
											  <div className="card-body">
												<div className="basic-form form-own">
												  <form onSubmit={this.handleCreate}>
													<div className="form-row">
													<input type="hidden" name="concession" defaultValue="management"/>
													  <div className="form-group col-md-6">
														<label>Concession Type</label>
														<div className="form-check settings-form-radio">
														  <input className="form-check-input" type="radio" name="concession_type" value="fixed" checked={((this.state.concession_type=='fixed') && (this.state.tab=='management'))?true:(tab3_type=='fixed')?true:false} onChange={(e) => this.handleTab(e,'management')}/>
														  <label className="form-check-label">Fixed</label>

														  <input className="form-check-input" type="radio" name="concession_type" value="percentage" checked={((this.state.concession_type=='percentage') && (this.state.tab=='management'))?true:(tab3_type=='percentage')?true:false} onChange={(e) => this.handleTab(e,'management')}/>
														  <label className="form-check-label">Percentage</label>
														</div>
													  </div>

													  <div className="form-group col-md-6">
														<label>Concession Amount</label>
														<input type="text" name="concession_amount" value={this.state.concession_amount?this.state.concession_amount:tab3_amount} className="form-control" placeholder="" onChange={this.handleChange}/>
													  </div>
													  <div className="form-group col-md-6">
														  <div className="profile-tab-btn text-left">
															<input type="submit" className="btn btn-primary" value="Save"/>
														  </div>
													  </div>
													</div>
                                                    <div className="text-center">
														{this.state.showError ? <div className="error">{this.state.message}</div> : null}
														{this.state.showSuccess ? <div className="success">{this.state.message}</div> : null}
													</div>
												  </form>
												</div>
											  </div>{/*****-- card-body --***/}
											</div>{/*****-- card --***/}
										  </div>{/*****-- col-8 --***/}
										</div>{/*****-- row --***/}
									  </div>{/*****-- settings-form --***/}
									</div>
								  </div>{/*****--tab-pane --***/}



								</div>{/*****-- tab-content --***/}
							  </div>{/*****-- custom-tab-1 --***/}
							</div>{/*****-- profile-tab --***/}
						  </div>
						</div> {/***-- row --***/}

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

export default FeeConcession;
