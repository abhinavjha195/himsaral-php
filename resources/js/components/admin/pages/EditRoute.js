import React, { Component } from "react";
import axios from 'axios';  
import { Link } from 'react-router-dom';      

import Script from "@gumgum/react-script-tag";

import Copyright from "../basic/Copyright";

import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url=location.protocol+'//'+location.host+'/';			
	

class EditRoute extends Component {
  
  constructor (props) {
	  super(props)
	  this.state = { 
		message:'',	
		stations:[],		
		sections:'',
		selectlist:'',  	
		routeno:'',		
		show_1: false,  	
		show_2: false, 	
		isLoading:true,				
		routeData:[],
		stationData:[],
		errors: []   	
	  }	
		this.handleAdd = this.handleAdd.bind(this);	
		this.handleDropdown = this.handleDropdown.bind(this);	
		this.handleChange = this.handleChange.bind(this);    	
		this.handleUpdate = this.handleUpdate.bind(this);		
		this.hasErrorFor = this.hasErrorFor.bind(this);
		this.renderErrorFor = this.renderErrorFor.bind(this);		
		this.input = React.createRef();  	
  } 
  handleChange = (event) => { 	   		
	   this.setState({ [event.target.name]: event.target.value });  				
  }
  handleDropdown = (event) => {
  var options = event.target.options;		
  var values = [];  
  for (var i = 0, l = options.length; i < l; i++) {
    if (options[i].selected) {
      values.push(options[i].value);		
    }
  }
  //console.log(values);   
  //this.props.someCallback(value);
  this.setState({stations:values});  
}
  handleUpdate (event) {
	  event.preventDefault();   
	  const {id,route_no} = event.target;	   	
	
	  setTimeout(() => {       
      this.setState({
			 show_1:false,  		
			 show_2:false
		   })	
		},3000);    	
	  
	  const data = {  
		routeno: route_no.value,  
		stations: this.state.selectlist   		
	  }					
  
     axios.post(`${base_url}api`+`/route/update/${id.value}`,data).then(response => {   
		
		if (response.data.status === 'successed') {   		
			this.setState({
			 show_1:true,  
			 show_2:false,    	
			 message: response.data.message,   
			 errors: []   		
		   }) 		
		   
		   window.location.href = base_url+"route_list";	  
		}
		else
		{
		   this.setState({
			 show_1:false,  
			 show_2:true,       
			 message: response.data.message,     		
			 errors: response.data.errors   			  			
		   }) 		   
		}
    })
    .catch(error => {  	   
	   console.log(error.message); 	 	   
    })
    
   }	
  handleAdd () { 		
			
		const selected = [];
		const texted = []; 
		for(let option of this.select.options){
		  if(option.selected)
		  {	
			  selected.push(option.value);		  
			  texted.push(option.text);		
		  }
		}
		this.setState({selectlist: selected}); 		
		this.setState({sections: texted});   		
			
	}
   hasErrorFor (field) {
	  return !!this.state.errors[field]		
   }
   renderErrorFor (field) {
	  if (this.hasErrorFor(field)) {
		return ( <span className='invalid-feedback'> <strong>{this.state.errors[field][0]}</strong> </span> )
	  }
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
	
	   
	axios.get(`${base_url}api`+`/route/edit/${id}`).then(response => {  
		
	this.setState({  			 			
			routeData:response.data.data.route_data?response.data.data.route_data:[],					  				
			stationData:response.data.data.station_data?response.data.data.station_data:[],		
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
       
   let stationRows = (this.state.stationData.length>0)?this.state.stationData:[];  
   let stationRow = (this.state.routeData.length>0)?this.state.routeData[0].stations:'';  
   
   let routeno=(this.state.routeData.length>0)?this.state.routeData[0].routeNo:'';   
   
   var stationArr = stationRow.split(',');
   const stations_1 = [];		
   const stations_2 = [];	
   
   for (const element of stationArr) 
   {
	  const station_arr = element.split(':'); 	 	  
	  stations_1.push(station_arr[0].trim());   	     
	  stations_2.push(parseInt(station_arr[1]));       
   }    	
   
   let stationList = stationRows.length > 0	
		&& stationRows.map((item,i) => {		
			return ( 		
					<option key={i} value={item.stationId}>{item.stationName}</option>    
				)  		
		},this);  
   
   let stationDiv=stations_1.map((item, i) =>   
		(  			
		  <li key={i} className="list-group-item"> 	
            {item}  		   
          </li>   
        )) 
		
   let sectionRows = this.state.sections; 
   let sectionList = sectionRows.length > 0	
		&& sectionRows.map((item,i) => {
			
		return ( 		
				<li key={i} className="list-group-item"> 	
				{item}  		   
				</li>    
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
								<h4>Edit Route</h4>		
							</div>
						</div>
						<div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
							<ol className="breadcrumb">  								
								<li><a href={`/route_list`} className="btn bg-blue-soft text-blue">
								 <i className="fa fa-angle-double-left"></i> Back to Route List
								 </a></li> 		
							</ol>
						</div>
					</div> 		
					
					<div className="row">
					  <div className="col-xl-12 col-xxl-12">
						<div className="card">
						  
						  <div className="card-body">
						  
								{
								this.state.show_1 ?(	
							   <div className="alert alert-success">									
									<strong>Success! </strong>{this.state.message}	  
							   </div>) 							   
							   : ''		
							   }
							   {
								this.state.show_2 ?(		
							   <div className="alert alert-danger">									
									<strong>Danger! </strong>{this.state.message}		
							   </div>)
							    : ''		
							   }	
							     
							<div className="basic-form form-own">
							  <form onSubmit={this.handleUpdate}>   		
								<div className="form-row">		
									<input type="hidden" name="id" value={(this.state.routeData.length>0)?this.state.routeData[0].routeId:0} ref={this.input} onChange={(event)=>this.handleChange(event)}/>	
								  <div className="form-group col-md-6">		
									<label>Route Name</label>	 
									<input type="text" className={`form-control ${this.hasErrorFor('routeno') ? 'is-invalid' : ''}`} id="route_no" name="route_no" value={(this.state.route_no)?this.state.route_no:routeno} ref={this.input} onChange={(event)=>this.handleChange(event)} placeholder="Enter Route No."/> 	    		
									{this.renderErrorFor('routeno')}    									 
								  </div>
								  
								  <div className="form-group col-md-6">		
									<label>Select Stations</label>  											
									<select name="stations[]" multiple={true} className={`form-control ${this.hasErrorFor('stations') ? 'is-invalid' : ''}`} onChange={this.handleDropdown} value={(this.state.stations.length>0)?this.state.stations:stations_2} ref={node => this.select = node}>   
										{stationList}	
									</select>		`
									{this.renderErrorFor('stations')}   		
								  </div>
								  
								</div>
								
								<div className="form-group col-md-12 text-right">  
									<input type="button" className="btn btn-primary" onClick={this.handleAdd} value="Add"/>	
								</div>	  
								{
								this.state.sections.length>0?(
								<div className="form-group col-md-6">  									
									<ul className="list-group text-left">			
									  {sectionList}	  
									</ul> 																	
								</div>)	 																		
								:<div className="form-group col-md-6">  									
									<ul className="list-group text-left">			
									  {stationDiv}	  
									</ul> 																	
								</div>	  		
							    }
								<div className="text-left btn-submit-left">	
								  <input type="submit" className="btn btn-primary" value="Save Route"/>
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
export default EditRoute;    