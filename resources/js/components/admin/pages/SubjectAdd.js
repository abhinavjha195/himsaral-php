import React, { Component } from "react";


import Script from "@gumgum/react-script-tag";

import Copyright from "../basic/Copyright";

import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url=location.protocol+'//'+location.host+'/';


class SubjectAdd extends Component {
  constructor() {
    super();
    this.state = {
      showError: false,
      showSuccess:false,
	  isLoading:true,
      messgae:'',
      subjectName:'',
      status:1,
      shortCode:'',
      remark:''
    };
    this.formSubmit = this.formSubmit.bind(this);
    this.handleChangeEvent = this.handleChangeEvent.bind(this);


  }
  handleChangeEvent(event){
    event.preventDefault();
    console.log("gdtyy");
    console.log(event.target);


      this.setState({ [event.target.name]: event.target.value });




    }



  formSubmit(event){
    event.preventDefault();

    if(this.state.subjectName == ''){
      this.setState({ showError: true, message:"Subject Name can't be empty" });
    }


   else{


    axios.post(`${base_url}api`+`/add_subject_process`, {

        subjectName:this.state.subjectName,
        remark:this.state.remark,
        shortCode:this.state.shortCode

      })
    .then(res => {
     console.log(res.data);
     if(res.data.status == true){
        this.setState({ showError: false,showSuccess:true,message:res.data.message});
       window.location.href = base_url+"subject_list";
     }

     if(res.data.status == false){
        this.setState({ showError: true,showSuccess:false,message:res.data.message});
     }
    })

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
                  <h4>Add Subject</h4>
                </div>
              </div>
              <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                <ol className="breadcrumb">
                  <li><a href="/subject_list" className="btn bg-blue-soft text-blue"><i className="fa fa-angle-double-left" /> Back to Subject List</a></li>
                </ol>
              </div>
            </div>
            {/* row */}
            <div className="row">
              <div className="col-xl-12 col-xxl-12">
                <div className="card">
                  {/*div class="card-header"><h4 class="card-title">All Class List</h4></div*/}
                  <div className="card-body">
                    <div className="basic-form form-own">
                      <form onSubmit={this.formSubmit}>
                        <div className="form-row">

                          <div className="form-group col-md-6">
                            <label>Subject Name</label>
                                <input type="text" className="form-control" name="subjectName" value={this.state.subjectName} onChange={this.handleChangeEvent} />
                          </div>

                          <div className="form-group col-md-6">
                            <label>Remark</label>
                                <input type="text" className="form-control" name="remark" value={this.state.remark} onChange={this.handleChangeEvent} />
                          </div>

                          <div className="form-group col-md-6">
                            <label>Short Code</label>
                                <input type="text" className="form-control" name="shortCode" value={this.state.shortCode} onChange={this.handleChangeEvent} />
                          </div>

                        </div>{/*/ form-row */}
                        <input type="submit" className="btn btn-primary" defaultValue="Submit" />

                        <div className="text-center">

                                                   {this.state.showError ?  <div className="error">{this.state.message}</div> : null }

                                                   {this.state.showSuccess ?  <div className="success">{this.state.message}</div> : null }

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

export default SubjectAdd;
