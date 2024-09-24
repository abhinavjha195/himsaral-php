import React, { Component } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';

import Script from "@gumgum/react-script-tag";

import Copyright from "../basic/Copyright";

import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url=location.protocol+'//'+location.host+'/';


class FineSetting extends Component {

constructor (props) {
  super(props)
  this.state = {
	isChecked:false,
    showError: false,
	showSuccess: false,
	isLoading:true,
	fine_type:'',
	due_upto:'',
	fine_amount:'',
	setData:[]
  }

	   this.handleSave = this.handleSave.bind(this);
	   this.handleInput = this.handleInput.bind(this);
	   this.handleChange = this.handleChange.bind(this);
   }

  handleSave (event) {
  event.preventDefault();
  const { fine_type,due_upto,fine_amount } = event.target;

  const data = {
	FineType: fine_type.value,
	DueDate: due_upto.value,
	FineAmount: fine_amount.value
  }

  console.log(data);

  axios.post(`${base_url}api`+'/finesetting/add',data)
    .then(response => {
		console.log(response.data);
		if (response.data.status === 'successed')
		{
			this.setState({ showError: false, showSuccess: true, message: response.data.message});
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
    handleInput(event) {
		let inp_name=event.target.name;

		if(inp_name=='due_upto')
		{
			const re = /^[0-9\b]+$/;
			var inp = event.target.value;

			if(re.test(inp))
			{
				this.setState({ [event.target.name]:event.target.value });
			}

		}
		else
		{
			const re = /^[0-9.\b]+$/;
			var inp = event.target.value;
			const arr=inp.split('.');

			if(re.test(inp) && (arr.length<=2))
			{
				this.setState({ [event.target.name]:event.target.value });
			}
		}

	}
  handleChange(event) {
		this.setState({ [event.target.name]: event.target.value });
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


	axios.get(`${base_url}api`+'/finesetting/index').then(response => {
	this.setState({
			setData: response.data.data ? response.data.data : [],
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

    let fine_type=(this.state.setData.length>0)?this.state.setData[0].FineType:'';
	let due_upto=(this.state.setData.length>0)?this.state.setData[0].DueDate:0;
	let fine_amount=(this.state.setData.length>0)?this.state.setData[0].FineAmount:0;

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
					<h4>Fine Settings</h4>
				</div>
			</div>
		</div>

		<div className="row">
		  <div className="col-xl-12 col-xxl-12">
			<div className="card">

			  <div className="card-body">

				<div className="basic-form form-own">
				  <form onSubmit={this.handleSave}>

					<div className="form-row">

					  <div className="form-group col-md-6">
						<label>Fine Type</label>
						<div className="form-row">

						  <div className="form-group col-md-4">
							<div className="form-check">
							  <input className="form-check-input" type="radio" name="fine_type" value="day basis" onChange={this.handleChange} checked={(this.state.fine_type=='day basis')?true:(fine_type=='day basis')?true:false} />
							  <label className="form-check-label">Day Basis</label>
							</div>
						  </div>

						  <div className="form-group col-md-4">
							<div className="form-check">
							  <input className="form-check-input" type="radio" name="fine_type" value="fixed" onChange={this.handleChange} checked={(this.state.fine_type=='fixed')?true:(fine_type=='fixed')?true:false}/>
							  <label className="form-check-label">Fixed</label>
							</div>
						  </div>

						</div>
					  </div>

					  <div className="form-group col-md-3">
						<label>Fee Due Date Upto</label>
						<input type="text" className="form-control" name="due_upto" value={(this.state.due_upto)?this.state.due_upto:due_upto} placeholder="Enter due date" onChange={this.handleInput}/>
					  </div>

					  <div className="form-group col-md-3">
						<label>Fine Amount</label>
						<input type="text" className="form-control" name="fine_amount" value={(this.state.fine_amount)?this.state.fine_amount:fine_amount} placeholder="Enter fine amount" onChange={this.handleInput}/>
					  </div>

					</div>

					<div className="text-right btn-submit-right">
					  <input type="submit" className="btn btn-primary" value="Save"/>
					</div>

                    <div className="text-center">
						{this.state.showError ? <div className="error">{this.state.message}</div> : null}
						{this.state.showSuccess ? <div className="success">{this.state.message}</div> : null}
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
      </div>
    );
  }
}

export default FineSetting;
