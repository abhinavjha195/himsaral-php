import React, { Component } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

import Script from "@gumgum/react-script-tag";

import Copyright from "../basic/Copyright";

import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url=location.protocol+'//'+location.host+'/';


class HolidayEdit extends Component {

  constructor(props) {
	  super(props)
	  this.state = {
		  showError: false,
		  showSuccess: false,
		  from_date:'',
		  to_date:'',
          description:'',
		  message:'',
		  errors:[],
		  holidays:[]
	  }
	  this.formSubmit = this.formSubmit.bind(this);
	  this.handleChange = this.handleChange.bind(this);
	  this.hasErrorFor = this.hasErrorFor.bind(this);
	  this.renderErrorFor = this.renderErrorFor.bind(this);
	  this.input = React.createRef();
}
handleChange(event){
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });
}

hasErrorFor (field) {
  return !!this.state.errors[field]
}
renderErrorFor (field) {
  if (this.hasErrorFor(field))
  {
	  return (<span className='invalid-feedback'> <strong>{this.state.errors[field][0]}</strong></span>);
  }
}
formSubmit(event){
	event.preventDefault();

	const urlString = window.location.href;
    const url = new URL(urlString);
    const lastSegment = url.pathname.split('/').pop();
	const id = lastSegment;

	let from_date =(this.state.from_date)?this.state.from_date:(this.state.holidays.length>0)?this.state.holidays[0].from_date:'';
	let to_date =(this.state.to_date)?this.state.to_date:(this.state.holidays.length>0)?this.state.holidays[0].to_date:'';
	let description =(this.state.description)?this.state.description:(this.state.holidays.length>0)?this.state.holidays[0].description:'';

	const data = {
		from_date: from_date,
		to_date: to_date,
		description: description
	}

	axios.post(`${base_url}api`+`/holiday/update/${id}`,data).then(response => {
		console.log(response.data);
		if (response.data.status === 'successed')		
		{
			this.setState({ showError:false,showSuccess:true,message:response.data.message,errors:response.data.errors});
            window.location.href = base_url+"holiday_list";
		}
		else
		{
			this.setState({ showError: true, showSuccess: false, message: response.data.message,errors:response.data.errors});
		}

	})
	.catch(err => {
	   console.log(err.message);
	   console.log(err.response.data);
	})

}

componentDidMount() {

	const urlString = window.location.href;
    const url = new URL(urlString);
    const lastSegment = url.pathname.split('/').pop();
	const id = lastSegment;

	axios.get(`${base_url}api`+`/holiday/edit/${id}`).then(response => {
        console.log(response);

		this.setState({
			holidays:response.data.data?response.data.data:[],
		});
	})
	.catch(error => {
	   console.log(error.message);
    })

}
render() {

	let from_date =(this.state.from_date)?this.state.from_date:(this.state.holidays.length>0)?this.state.holidays[0].from_date:'';
	let to_date =(this.state.to_date)?this.state.to_date:(this.state.holidays.length>0)?this.state.holidays[0].to_date:'';
	let description =(this.state.description)?this.state.description:(this.state.holidays.length>0)?this.state.holidays[0].description:'';

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

	{/**********************************
		Content body start
	**************************************/}
	<div className="content-body">
	<div className="container-fluid">
		<div className="row page-titles mx-0">
			<div className="col-sm-6 p-md-0">
				<div className="welcome-text">
					<h4>Update Holiday</h4>
				</div>
			</div>
			<div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
				<ol className="breadcrumb">
					<li><a href={`/holiday_list`} className="btn bg-blue-soft text-blue"><i className="fa fa-angle-double-left"></i> Back to Holiday List</a></li>
				</ol>
			</div>
		</div>
		{/******** row ****/}

		<div className="row">
		  <div className="col-xl-12 col-xxl-12">
			<div className="card">
			  {/********<div className="card-header"><h4 className="card-title">Create New Exam</h4></div>********/}
			  <div className="card-body">

				<div className="basic-form form-own">
				  <form onSubmit={this.formSubmit}>
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
					<div className="form-row">
                        <div className="form-group col-md-6">
                            <label>Holiday Starts From</label>
                            <input type="date" className={`form-control input-daterange-timepicker ${this.hasErrorFor('from_date') ? 'is-invalid' : ''}`} 
                                name="from_date" defaultValue={from_date} onChange={this.handleChange} ref={this.input} />
                            {this.renderErrorFor('from_date')}
                        </div>
                        <div className="form-group col-md-6">
                            <label>Holiday End To</label>
                            <input type="date"  className={`form-control input-daterange-timepicker ${this.hasErrorFor('to_date') ? 'is-invalid' : ''}`}
                                name="to_date" defaultValue={to_date} onChange={this.handleChange} ref={this.input} />
                            {this.renderErrorFor('to_date')}
                        </div>
                        <div className="form-group col-md-12">
                            <label>Description Of Holiday</label>
                            <textarea  className={`form-control ${this.hasErrorFor('description') ? 'is-invalid' : ''}`} rows={10} cols={50} name="description"
                                defaultValue={description} onChange={this.handleChange} ref={this.input}>
                            </textarea>
                            {this.renderErrorFor('description')}
                        </div>

					</div> {/******* form-row ******/}

					<div className="text-right btn-submit-right">
					  <input type="submit" className="btn btn-primary" value="Update Holiday"/>
					</div>

				  </form>
				</div>

			  </div>
			</div>
		  </div>
		</div>{/****** row ******/}

	</div>
</div>
	 {/*****************************
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

export default HolidayEdit;
