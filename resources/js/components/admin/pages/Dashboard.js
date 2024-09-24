import React, { Component } from "react";


import Script from "@gumgum/react-script-tag";

import Copyright from "../basic/Copyright";

import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url=location.protocol+'//'+location.host+'/';

class Dashboard extends Component {

	 constructor() {
        super();
        this.state = {
          isLoading:true,
          userType: localStorage.getItem("login_user")
        };

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
	.catch(err => {
	   console.log(err.message);
	    console.log(err.response.data);
	})

	setInterval(() => {

	axios.get(`${base_url}api/setauth?api_token=${token}`).then(response => {
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
	.catch(err => {
	   console.log(err.message);
	    console.log(err.response.data);
	})

}, 30000);

	if(!isAuthenticated)
	{
		window.location.href = base_url+"login";
	}

}

render() {
    const { userType } = this.state;
    const isLoad = this.state.isLoading;

    if (isLoad) {

    //	return null;

    }

        return (
            <div>
                <Preloader />

                <div id="main-wrapper">

				    <HeaderPart />

                    <div className="content-body">

                        <div className="container-fluid">
                            {userType === 'user' && (
                                <>
                                <div className="row">
                                            <div className="col-xl-4 mb-4 home-box">

                                                <a className="card lift h-100" href="#!">
                                                    <div className="card-body d-flex justify-content-center flex-column">
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <div className="me-3">
                                                                <i className="fa fa-users feather mb-3 text-primary"></i>
                                                                <h5>Total <br/>Students</h5>
                                                                <div className="small home-title">250</div>
                                                            </div>
                                                            <img src={base_url+"images/img-01.jpg"} alt="..." style={{"width": "10rem"}}/>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>
                                            <div className="col-xl-4 mb-4 home-box">

                                                <a className="card lift box-area h-100" href="#!">
                                                    <div className="card-body d-flex justify-content-center flex-column">
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <div className="me-3">
                                                                <i className="fa fa-rupee feather mb-3 text-secondary"></i>
                                                                <h5>Today's <br/>Fee Collection</h5>
                                                                <div className="small home-title">Rs. 125797.00</div>
                                                            </div>
                                                            <img src={base_url+"images/img-02.jpg"} alt="..." style={{"width": "10rem"}}/>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>
                                            <div className="col-xl-4 mb-4 home-box">

                                                <a className="card lift h-100" href="#!">
                                                    <div className="card-body d-flex justify-content-center flex-column">
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <div className="me-3">
                                                                <i className="fa fa-calendar fa-calendar-days feather text-green mb-3 text-green"></i>
                                                                <h5>Today's <br/>Absentees</h5>
                                                                <div className="small home-title">12</div>
                                                            </div>
                                                            <img src={base_url+"images/img-03.jpg"} alt="..." style={{"width": "10rem"}}/>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>
                                </div>
                                </>
                            )}
                            {userType === 'parent' && (
                                <>
                                <div className="row">
                                    <div className="col-xl-3 mb-4 home-box">
                                        <a className="card lift h-100" href={`/child-details`}>
                                            <div className="card-body d-flex justify-content-center flex-column">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="me-3">
                                                        <i className="fa fa-child feather mb-3 text-primary"></i>
                                                        <h5>Your Child</h5>
                                                        <div className="small home-title">1</div>
                                                    </div>
                                                    <img src={base_url+"images/img-01.jpg"} alt="..." style={{"width": "9rem"}}/>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                    <div className="col-xl-3 mb-4 home-box">
                                        <a className="card lift h-100" href={`/fee-payment`}>
                                            <div className="card-body d-flex justify-content-center flex-column">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="me-3">
                                                        <i className="fa fa-credit-card feather mb-3 text-primary"></i>
                                                        <h5>Online Fee Payment</h5>
                                                        {/* <div className="small home-title">1</div> */}
                                                    </div>
                                                    <img src={base_url+"images/img-02.jpg"} alt="..." style={{"width": "9rem"}}/>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                    <div className="col-xl-3 mb-4 home-box">
                                        <a className="card lift h-100" href={`/fee-history`}>
                                            <div className="card-body d-flex justify-content-center flex-column">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="me-3">
                                                        <i className="fa fa-money feather mb-3 text-primary"></i>
                                                        <h5> Fee Report</h5>
                                                        {/* <div className="small home-title">1</div> */}
                                                    </div>
                                                    <img src={base_url+"images/img-03.jpg"} alt="..." style={{"width": "9rem"}}/>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                    <div className="col-xl-3 mb-4 home-box">
                                        <a className="card lift h-100" href={`/homework`}>
                                            <div className="card-body d-flex justify-content-center flex-column">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="me-3">
                                                        <i className="fa fa-book feather mb-3 text-primary"></i>
                                                        <h5> Home Work</h5>
                                                        {/* <div className="small home-title">1</div> */}
                                                    </div>
                                                    <img src={base_url+"images/img-01.jpg"} alt="..." style={{"width": "9rem"}}/>
                                                </div>
                                            </div>
                                        </a>
                                    </div>


                                </div>
                                </>
                            )}

                            <div className="row">
                            {userType === 'user' && (
                                <div className="col-xl-6 col-lg-8">
                                    <div className="card">
                                        <div className="card-header">
                                            <h4 className="card-title">Class Wise Strength [41]</h4>
                                        </div>
                                        <div className="card-body Chart-body">
                                            <div className="row">
                                                <div className="col-xl-12 col-lg-8">
                                                    <canvas id="barChart" style={{"height": "230px"}}></canvas>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                                <div className="col-xl-6 col-lg-4">
                                    <div className="card">
                                        <div className="card-body text-center">
                                            <div id="calendar" className="app-fullcalendar"></div>
                                        </div>
                                    </div>
                                </div>
                                {userType === 'parent' && (
                                    <div className="col-xl-6 col-lg-4">
                                        <div className="card card-box">
                                            <div className="card-header mb-0">
                                                <h4 className="mb-0">School Notice Board</h4>
                                            </div>
                                            <hr/>
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="noti-information">
                                                        <div className="slimScrollDiv" style={{"position": "relative", "overflow": "hidden", "width": "auto"}}>
                                                            <div className="notification-list not-list small-slimscroll-style"
                                                                style={{"overflow": "hidden", "width": "auto"}}>
                                                                <a href="#" className="single-mail">
                                                                    <span className="icon bg-primary">
                                                                        <i className="fa fa-bell"></i>
                                                                    </span>
                                                                    <p><span className="text-purple">spd</span></p>
                                                                    <p><span className="text-purple">/Syllabus/_StudentImages_time
                                                                            tableSVMANNI1bcea63b-f697-489a-b9aa-5a1353f2aec4.pdf</span></p>
                                                                </a><a href={base_url+"DownLoad/8246"}>Download</a> <span className="notificationtime">
                                                                    <small>Today</small>
                                                                </span>

                                                                <a href="#" className="single-mail">
                                                                    <span className="icon bg-primary">
                                                                        <i className="fa fa-bell"></i>
                                                                    </span>
                                                                    <p><span className="text-purple">09099909</span></p>
                                                                    <p><span className="text-purple">/Syllabus/_StudentImages_time
                                                                            tableSVMANNIb03615ad-34bf-4c55-bf12-3cbd950a05e5.pdf</span></p>
                                                                </a><a href={base_url+"DownLoad/8245"}>Download</a> <span className="notificationtime">
                                                                    <small>Today</small>
                                                                </span>

                                                                <a href="#" className="single-mail">
                                                                    <span className="icon bg-primary">
                                                                        <i className="fa fa-bell"></i>
                                                                    </span>
                                                                    <p><span className="text-purple">09876</span></p>
                                                                    <p><span className="text-purple">/Syllabus/_StudentImages_time
                                                                            tableSVMANNIc473ed9e-c2f7-4bef-b578-698963c68659.pdf</span></p>
                                                                </a><a href={base_url+"DownLoad/8244"}>Download</a> <span className="notificationtime">
                                                                    <small>Today</small>
                                                                </span>

                                                                <a href="#" className="single-mail">
                                                                    <span className="icon bg-primary">
                                                                        <i className="fa fa-bell"></i>
                                                                    </span>
                                                                    <p><span className="text-purple">qwerty</span></p>
                                                                    <p><span className="text-purple">/Syllabus/Test Schedule
                                                                            20247c5df4e8-a97d-492d-9662-6df384e46573.pdf</span></p>
                                                                </a><a href={base_url+"DownLoad/8242"}>Download</a> <span className="notificationtime">
                                                                    <small>Today</small>
                                                                </span>

                                                                <a href="#" className="single-mail">
                                                                    <span className="icon bg-primary">
                                                                        <i className="fa fa-bell"></i>
                                                                    </span>
                                                                    <p><span className="text-purple">werwer</span></p>
                                                                    <p><span className="text-purple">/Syllabus/_StudentImages_time
                                                                            tableSVMANNI4876cce4-0b2b-4ce6-bb42-4cb41c395cd0.pdf</span></p>
                                                                </a><a href={base_url+"DownLoad/8240"}>Download</a> <span className="notificationtime">
                                                                    <small>Today</small>
                                                                </span>

                                                                <a href="#" className="single-mail">
                                                                    <span className="icon bg-primary">
                                                                        <i className="fa fa-bell"></i>
                                                                    </span>
                                                                    <p><span className="text-purple">werwer</span></p>
                                                                    <p><span
                                                                            className="text-purple">/Syllabus/Untitled10eaab59-0a27-40ee-9b38-2c12b6832bc9.png</span>
                                                                    </p>
                                                                </a><a href={base_url+"DownLoad/8239"}>Download</a> <span className="notificationtime">
                                                                    <small>Today</small>
                                                                </span>
                                                            </div>
                                                            <div className="slimScrollBar"
                                                                style={{"background": "rgb(158, 165, 171)", "width": "5px", "position": "absolute", "top": "0px", "opacity": "0.4", "display": "none", "borderRadius": "7px", "zIndex": "99", "right": "1px", "height": "2636.61px"}}>
                                                            </div>
                                                            <div className="slimScrollRail"
                                                                style={{"width": "5px", "height": "100%", "position": "absolute", "top": "0px", "display": "none", "borderRadius": "7px", "background": "rgb(51, 51, 51)", "opacity": "0.2", "zIndex": "90", "right": "1px"}}>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {userType === 'user' && (
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="card">
                                        <div className="card-header">
                                            <h4 className="card-title">Vehicle Insurance Reminder</h4>
                                        </div>
                                        <div className="card-body card-body-padd">
                                            <div className="table-responsive">
                                                <table className="table table-bordered table-striped verticle-middle">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">Vehicle Reg. No.</th>
                                                            <th scope="col">Insurance Due Date</th>
                                                            <th scope="col">Amount</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>PB12Z4745</td>
                                                            <td><span className="badge badge-primary">04-02-2021</span></td>
                                                            <td>5,000</td>
                                                        </tr>
                                                        <tr>
                                                            <td>PB12Z4745</td>
                                                            <td><span className="badge badge-success">04-02-2021</span></td>
                                                            <td>5,000</td>
                                                        </tr>
                                                        <tr>
                                                            <td>PB12Z4745</td>
                                                            <td><span className="badge badge-danger">04-02-2021</span></td>
                                                            <td>5,000</td>
                                                        </tr>
                                                        <tr>
                                                            <td>PB12Z4745</td>
                                                            <td><span className="badge badge-primary">04-02-2021</span></td>
                                                            <td>5,000</td>
                                                        </tr>
                                                        <tr>
                                                            <td>PB12Z4745</td>
                                                            <td><span className="badge badge-success">04-02-2021</span></td>
                                                            <td>5,000</td>
                                                        </tr>
                                                        <tr>
                                                            <td>PB12Z4745</td>
                                                            <td><span className="badge badge-danger">04-02-2021</span></td>
                                                            <td>5,000</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-6">
                                    <div className="card">
                                        <div className="card-header">
                                            <h4 className="card-title">Vehicle Tax Reminder</h4>
                                        </div>
                                        <div className="card-body card-body-padd">
                                            <div className="table-responsive">
                                                <table className="table table-bordered table-striped verticle-middle">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">Vehicle Reg. No.</th>
                                                            <th scope="col">Tax Due Date</th>
                                                            <th scope="col">Amount</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>PB12Z4745</td>
                                                            <td><span className="badge badge-primary">04-02-2021</span></td>
                                                            <td>5,000</td>
                                                        </tr>
                                                        <tr>
                                                            <td>PB12Z4745</td>
                                                            <td><span className="badge badge-success">04-02-2021</span></td>
                                                            <td>5,000</td>
                                                        </tr>
                                                        <tr>
                                                            <td>PB12Z4745</td>
                                                            <td><span className="badge badge-danger">04-02-2021</span></td>
                                                            <td>5,000</td>
                                                        </tr>
                                                        <tr>
                                                            <td>PB12Z4745</td>
                                                            <td><span className="badge badge-primary">04-02-2021</span></td>
                                                            <td>5,000</td>
                                                        </tr>
                                                        <tr>
                                                            <td>PB12Z4745</td>
                                                            <td><span className="badge badge-success">04-02-2021</span></td>
                                                            <td>5,000</td>
                                                        </tr>
                                                        <tr>
                                                            <td>PB12Z4745</td>
                                                            <td><span className="badge badge-danger">04-02-2021</span></td>
                                                            <td>5,000</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div className="col-lg-6">
                                    <div className="card">
                                        <div className="card-header">
                                            <h4 className="card-title">Vehicle Passing Reminder</h4>
                                        </div>
                                        <div className="card-body card-body-padd">
                                            <div className="table-responsive">
                                                <table className="table table-bordered table-striped verticle-middle">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">Vehicle Reg. No.</th>
                                                            <th scope="col">Vehicle Passing Date</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>PB12Z4745</td>
                                                            <td>04-02-2021</td>
                                                        </tr>
                                                        <tr>
                                                            <td>PB12Z4745</td>
                                                            <td>04-02-2021</td>
                                                        </tr>
                                                        <tr>
                                                            <td>PB12Z4745</td>
                                                            <td>04-02-2021</td>
                                                        </tr>
                                                        <tr>
                                                            <td>PB12Z4745</td>
                                                            <td>04-02-2021</td>
                                                        </tr>
                                                        <tr>
                                                            <td>PB12Z4745</td>
                                                            <td>04-02-2021</td>
                                                        </tr>
                                                        <tr>
                                                            <td>PB12Z4745</td>
                                                            <td>04-02-2021</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div className="col-lg-6">
                                    <div className="card">
                                        <div className="card-header">
                                            <h4 className="card-title">Vehicle Permit Renewal Reminder</h4>
                                        </div>
                                        <div className="card-body card-body-padd">
                                            <div className="table-responsive">
                                                <table className="table table-bordered table-striped verticle-middle">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">Vehicle Reg. No.</th>
                                                            <th scope="col">Vehicle Permit Renewal Date</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>PB12Z4745</td>
                                                            <td>04-02-2021</td>
                                                        </tr>
                                                        <tr>
                                                            <td>PB12Z4745</td>
                                                            <td>04-02-2021</td>
                                                        </tr>
                                                        <tr>
                                                            <td>PB12Z4745</td>
                                                            <td>04-02-2021</td>
                                                        </tr>
                                                        <tr>
                                                            <td>PB12Z4745</td>
                                                            <td>04-02-2021</td>
                                                        </tr>
                                                        <tr>
                                                            <td>PB12Z4745</td>
                                                            <td>04-02-2021</td>
                                                        </tr>
                                                        <tr>
                                                            <td>PB12Z4745</td>
                                                            <td>04-02-2021</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            )}

                        </div>
                    </div>

                    <Copyright />
                </div>

            </div>
        );
    }
}

export default Dashboard;
