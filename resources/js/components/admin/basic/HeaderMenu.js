import React, { Component } from 'react';

const base_url=location.protocol+'//'+location.host+'/';

class HeaderMenu extends Component {
	constructor() {
    super();
	this.state = {
        userType: localStorage.getItem("login_user"),
        s_id: null,
        father_name: null,
        father_image: null
	};
	this.handleLog = this.handleLog.bind(this);
	}
    handleLog(event){
        event.preventDefault();
        const token = localStorage.getItem("login_token");

        axios.get(`${base_url}api/signout?api_token=${token}`).then(response => {
            console.log(response);
            if (response.data.status === 'successed')
            {
                localStorage.clear();
                window.location.href = base_url+"login";
                this.setState({ showError:false,showSuccess:true,message:response.data.message});
            }
            else
            {
                localStorage.clear();
                window.location.href = base_url+"login";
                this.setState({ showError:true,showSuccess:false,message:response.data.message});
            }

        })
        .catch(error => {
        console.log(error.message);
            console.log(error.response.data);
        })

    }

    componentDidMount() {
        const isAuthenticated = localStorage.getItem("isLoggedIn");
	    const token = localStorage.getItem("login_token");

        axios.get(`${base_url}api/checkauth?api_token=${token}`).then(response => {

            if (response.data.status === 'successed')
            {
                const s_id = response.data.data.s_id;
                this.setState({s_id: s_id, isLoading: false });

                axios.get(`${base_url}api/parentList/${s_id}`).then(response => {
                    if(response.data.status){
                        const fatherData = response.data.data[0];
                        // console.log("fatherData",fatherData);
                        this.setState({
                            father_name: fatherData.father_name,
                            father_image: fatherData.father_image
                        });
                    }
                })
                .catch(error => {
                    console.log(error.message);
                });
            }
            else
            {
                localStorage.clear();
                window.location.href = base_url+"login";
            }
        }).catch(error => {
            console.log(error.message);
        });
    }

  render() {
    const { userType,father_name  } = this.state;

    return (

        <div className="header">
        <div className="header-content">
          <nav className="navbar navbar-expand">
            <div className="collapse navbar-collapse justify-content-between">
              <div className="header-left">
                <div className="session-sec">
                  <form>
                    <label htmlFor="Session">Session</label>
                    <select className="form-control" data-val="true" data-val-number="The field Session must be a number." data-val-required="The Session field is required." id="Session" name="Session"><option defaultValue={5}>2020-2021</option><option defaultValue={6}>2021-2022</option><option defaultValue={7}>2022-2023</option></select>
                  </form>
                </div>

              </div>
              <ul className="navbar-nav header-right">
              {userType === 'user' && (
                <>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    <i className="mdi mdi-email-outline" />
                  </a>
                </li>

                <li className="nav-item dropdown notification_dropdown">
                  <a className="nav-link" href="#" role="button" data-toggle="dropdown">
                    <i className="mdi mdi-bell" />
                    <div className="pulse-css" />
                  </a>
                  <div className="dropdown-menu dropdown-menu-right">
                    <ul className="list-unstyled">
                      <li className="media dropdown-item">
                        <span className="success"><i className="ti-user" /></span>
                        <div className="media-body">
                          <a href="#">
                            <p><strong>Martin</strong> has added a <strong>customer</strong> Successfully
                            </p>
                          </a>
                        </div>
                        <span className="notify-time">3:20 am</span>
                      </li>
                      <li className="media dropdown-item">
                        <span className="primary"><i className="ti-shopping-cart" /></span>
                        <div className="media-body">
                          <a href="#">
                            <p><strong>Jennifer</strong> purchased Light Dashboard 2.0.</p>
                          </a>
                        </div>
                        <span className="notify-time">3:20 am</span>
                      </li>
                      <li className="media dropdown-item">
                        <span className="danger"><i className="ti-bookmark" /></span>
                        <div className="media-body">
                          <a href="#">
                            <p><strong>Robin</strong> marked a <strong>ticket</strong> as unsolved.
                            </p>
                          </a>
                        </div>
                        <span className="notify-time">3:20 am</span>
                      </li>
                      <li className="media dropdown-item">
                        <span className="primary"><i className="ti-heart" /></span>
                        <div className="media-body">
                          <a href="#">
                            <p><strong>David</strong> purchased Light Dashboard 1.0.</p>
                          </a>
                        </div>
                        <span className="notify-time">3:20 am</span>
                      </li>
                      <li className="media dropdown-item">
                        <span className="success"><i className="ti-image" /></span>
                        <div className="media-body">
                          <a href="#">
                            <p><strong> James.</strong> has added a<strong>customer</strong> Successfully
                            </p>
                          </a>
                        </div>
                        <span className="notify-time">3:20 am</span>
                      </li>
                    </ul>
                    <a className="all-notification" href="#">See all notifications <i className="ti-arrow-right" /></a>
                  </div>
                </li>
                </>
              )}
                <li className="nav-item dropdown header-profile">
                  <a className="nav-link" href="#" role="button" data-toggle="dropdown">
                    <i className="mdi mdi-account" />
                  </a>
                  <div className="dropdown-menu dropdown-menu-right">
                    <a href={`/profile`} className="dropdown-item">
                      <i className="icon-user" />
                      <span className="ml-2">Profile </span>
                    </a>
                    <a href="./email-inbox.html" className="dropdown-item">
                      <i className="icon-envelope-open" />
                      <span className="ml-2">Inbox </span>
                    </a>
                    <a href="#" className="dropdown-item">
                      <i className="icon-key" />
                      <span className="ml-2" onClick={this.handleLog}>Logout</span>
                    </a>
                  </div>
                </li>
                <li className="nav-item username-profile">
                    {userType === 'user' && (<span className="username"> HTL International School Mohali </span> )}
                    {userType === 'parent' && (<span className="username"> { father_name } </span> )}
                  <span className="username-image"><img src={`${base_url}images/male.jpg`} alt="" /></span>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    );
  }
}
export default HeaderMenu;
