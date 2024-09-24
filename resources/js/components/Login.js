import React, { Component } from 'react';
import axios from 'axios';

const base_url=location.protocol+'//'+location.host+'/';

class Login extends Component {

    constructor() {
        super();
        this.state = {
          showError:false,
          messgae:'',
		  remember:'',
		  errors:[]
        };

		this.formSubmit = this.formSubmit.bind(this);
		this.hasErrorFor = this.hasErrorFor.bind(this);
	    this.renderErrorFor = this.renderErrorFor.bind(this);
		this.input = React.createRef();
      }

handleChange(event){
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });
}

formSubmit(event){
	event.preventDefault();
	const { user_name,user_pass } = event.target;

	const data = {
		name: user_name.value,
		password: user_pass.value,
	}

	axios.post(`${base_url}api/signin`,data)
	.then(response => {
	console.log(response);

	if (response.data.status === 'successed')
	{
		const loginData=response.data.data?response.data.data:[];
        const loginUserType = response.data.login_user;
		if (typeof(loginData) != "undefined")
		{
			this.setState({ showError:false,message:response.data.message});
			localStorage.setItem("login_token",loginData.api_token);
			localStorage.setItem("isLoggedIn","true");
            localStorage.setItem("login_user", loginUserType);
			window.location.href = base_url+"dashboard";

            // if (loginUserType === 'parent') {
            //     window.location.href = `${base_url}parents/dashboard`; // Parent dashboard
            // } else {
            //     window.location.href = `${base_url}dashboard`; // User dashboard
            // }
		}
	}
	else
	{
		localStorage.clear();
        this.setState({ showError:true,message:response.data.message,errors:response.data.errors});
	}

	})
	.catch(err => {
		 console.log(err.response.data);
	})


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

render() {

    return (
<>
       <div id="preloader">
			<div className="sk-three-bounce">
				<div className="sk-child sk-bounce1"></div>
				<div className="sk-child sk-bounce2"></div>
				<div className="sk-child sk-bounce3"></div>
			</div>
	   </div>

{/******************** 	Preloader end	**********************/}

<div id="main-wrapper" className="h-100">
	<div className="authincation login-screen h-100">

		<div className="himsaral-logo">
		 <a href="https://www.htlogics.com/" target="_blank"><img src={base_url+"images/logo-text.png"}/></a>
		</div>

		<div className="container h-100">
			<div className="row justify-content-center h-100 align-items-center">
				<div className="col-md-8 left">
				  <figure>
					<img src={base_url+"images/school-dummy.jpg"} alt=""/>
					<figcaption>
					  <h2>HTL International School Mohali <span>SAS Nagar Mohali, Punjab</span></h2>
					</figcaption>
				  </figure>
				</div>

				<div className="col-md-4 right">
					<div className="authincation-content">
						<div className="row no-gutters">
							<div className="col-xl-12">
								<div className="auth-form">

									<div className="login-logo text-center mrb-35">
									<img src={base_url+"images/school-logo.png"}/></div>

									<h4 className="mb-4">Sign-in your account</h4>

									<form onSubmit={this.formSubmit}>
										{this.state.showError ?
										 <div className="alert alert-danger" style={{color:"brown"}}>
											<strong>{this.state.message}</strong>
										  </div>
										 : null}
										<div className="form-group">
											<label><strong>User Name</strong></label>
											<input type="text" name="user_name" className={`form-control ${this.hasErrorFor('name') ? 'is-invalid' : ''}`} ref={this.input}/>
											{this.renderErrorFor('name')}
										</div>
										<div className="form-group">
											<label><strong>Password</strong></label>
											<input type="password" name="user_pass" className={`form-control ${this.hasErrorFor('password') ? 'is-invalid' : ''}`} ref={this.input}/>
											{this.renderErrorFor('password')}
										</div>
										<div className="form-row d-flex justify-content-between mt-2">
											<div className="form-group">
												<div className="form-check ml-2">
													<input className="form-check-input" type="checkbox" name="remember" value="1" ref={this.input}/>
													<label className="form-check-label" htmlFor="basic_checkbox_1">Remember me</label>
												</div>
											</div>
											<div className="form-group">
												<a href="#">Forgot Password?</a>
											</div>
										</div>
										<div className="text-center">
											<button type="submit" className="btn btn-primary btn-block">Sign me in</button>
										</div>
									</form>
									<div className="new-account mt-3">
										<p><a className="text-primary" href={`/new_registration`}>New Registration?</a></p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

			</div>
		</div>

	</div>
</div>
</>
	   );
  }
}

export default Login;
