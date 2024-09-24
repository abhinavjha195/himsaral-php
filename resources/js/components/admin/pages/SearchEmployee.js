import React, { Component } from "react";
import axios from 'axios'; 
import { Link } from 'react-router-dom';  
import Swal from 'sweetalert2';		    
import ServerTable from 'react-strap-table';  
import Script from "@gumgum/react-script-tag";

import Copyright from "../basic/Copyright";	
import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";		

const base_url=location.protocol+'//'+location.host+'/';   				

class SearchEmployee extends Component {		
	
  constructor(props) {			
  super(props)
  this.state = {
	  emp_no:'',
	  emp_name:'',		 	  	
	  bank_name:'',    	
	  department_id:'', 
	  designation_id:'',
	  school_id:'',   	
	  app_url:'',
	  record_sum:'',	
	  params:'',		  	
	  isLoading:true,
	  show_result:false,		  
	  departments:[],			
	  designations:[],		
	  filterArr:['emp_no','emp_name'],			
	  filterlist:[],
	  arcs:[]					
  }
	
	this.handleChange = this.handleChange.bind(this);    
	this.handleDepartment = this.handleDepartment.bind(this);    	
	this.handleCheck = this.handleCheck.bind(this);      			
	this.checkAll = this.checkAll.bind(this);     
	this.searchFilter = this.searchFilter.bind(this);    
	this.handlePrint = this.handlePrint.bind(this);  	
	this.handleExport = this.handleExport.bind(this);       	
	this.serverTable = React.createRef();  
	this.input = React.createRef();   	
 }      

handleChange(event){		
    event.preventDefault();
    this.setState({ [event.target.name]:event.target.value });   
}

handleDepartment(event){		
    event.preventDefault();
	const id=event.target.value; 	  
	
	if(id !='')
	{
		this.setState({ [event.target.name]: event.target.value });   
		
		axios.get(`${base_url}api`+`/employee/getdesignations/${id}`).then(response => {  
			console.log(response);	
			this.setState({ 
				designation_id:'', 	
				designations: response.data.data ? response.data.data :[],		
				attendancelst:[],	
				attendanceinp:[]
			}); 
		})
		.catch(error => {  	   
		   console.log(error.message); 	   				
		})    
	}
	else
	{
		this.setState({ [event.target.name]: event.target.value,designation_id:'',designations:[],attendancelst:[],	
				attendanceinp:[] });   			
	}		     
}   

searchFilter(event){
    event.preventDefault(); 	 	
	
	const emp_no=this.state.emp_no?this.state.emp_no:''; 		
	const emp_name=this.state.emp_name?this.state.emp_name:''; 
	const bank_name=this.state.bank_name?this.state.bank_name:'';
	const school_id=this.state.school_id?this.state.school_id:'';    
	const department_id=this.state.department_id?this.state.department_id:'';       
	const designation_id=this.state.designation_id?this.state.designation_id:'';    		
	
	const search_url=base_url+`api/searchemployee/index?emp_no=${emp_no}&emp_name=${emp_name}&bank_name=${bank_name}&department_id=${department_id}&designation_id=${designation_id}&school_id=${school_id}`;     		
	
	this.setState({ app_url:search_url,show_result:true }); 											
	
}	

handleCheck(event) {
const target = event.target;		
var input = target.value;

const lists = this.state.filterlist;   				
const filters=this.state.filterArr;		
const filter_arr = [];   
const input_arr = [];   

for(var key in lists)
{
	if(lists[key] && lists[key].name=='filter[]' && lists[key].value!=null)
	{ 
		if(!input_arr.includes(lists[key].value))
		{
			input_arr.push(lists[key].value);	    	
		} 		
	}
}	 

if(target.checked)		
{	
	for(var key in filters)		
	{
		filter_arr.push(filters[key]);		 		
	}
	if(!filter_arr.includes(input))
	{
		filter_arr.push(input);		 		
	}  	
	
	if(filters.length==parseInt(input_arr.length-1))  
	{
		filter_arr.push('all');		
	}	
	
}
else{
		
	for(var key in filters)
	{			
		if(filters[key] !==input && filters[key] !=='all')
		{
			filter_arr.push(filters[key]);		 	
		}  				
	} 
} 	

this.setState({ filterArr:filter_arr }); 		

} 

checkAll(event) {
const target = event.target;
var input = target.value;

const lists = this.state.filterlist;   		
const filters=this.state.filterArr;		 
const filter_arr = ['emp_no','emp_name'];     	

if(target.checked)
{	
	for(var key in lists)
	{
		if(lists[key] && lists[key].name=='filter[]' && lists[key].value!=null)
		{ 
			if(!filter_arr.includes(lists[key].value))
			{
				filter_arr.push(lists[key].value);	   
			} 
		}
	}	
	
} 

this.setState({ filterArr:filter_arr }); 		     						

} 
 
handlePrint() {  		
	
	const emp_no=this.state.emp_no?this.state.emp_no:''; 		
	const emp_name=this.state.emp_name?this.state.emp_name:''; 
	const bank_name=this.state.bank_name?this.state.bank_name:'';
	const school_id=this.state.school_id?this.state.school_id:'';    
	const department_id=this.state.department_id?this.state.department_id:'';       
	const designation_id=this.state.designation_id?this.state.designation_id:'';   				
	const query=(this.state.params.search)?this.state.params.search:'';	  
	
	axios.get(`${base_url}api`+`/searchemployee/print?emp_no=${emp_no}&emp_name=${emp_name}&bank_name=${bank_name}&department_id=${department_id}&designation_id=${designation_id}&school_id=${school_id}&search=${query}`).then(response => { 
		
		console.log(response.data);		
		if (response.data.status === 'successed')   
		{				 
			 var receipt =(typeof(response.data.data)!='object')?response.data.data:'';  		
			 
			 if(typeof receipt !== "undefined") 		
			 {
				let a = document.createElement("a"); 
				let url = base_url+'empsearch/'+receipt; 							
				a.target='_blank';   
				a.href = url;
				document.body.appendChild(a);							
				a.click();
				document.body.removeChild(a);   	
			 }  					 
		}
		else
		{
			console.log(response.data.message); 							   
		}	
	})
	.catch(error => {  	   
	   console.log(error.message); 	
	   console.log(error.response.data);	
    })	  
}
	
handleExport(){  			

	const emp_no=this.state.emp_no?this.state.emp_no:''; 		
	const emp_name=this.state.emp_name?this.state.emp_name:''; 
	const bank_name=this.state.bank_name?this.state.bank_name:'';
	const school_id=this.state.school_id?this.state.school_id:'';    
	const department_id=this.state.department_id?this.state.department_id:'';       
	const designation_id=this.state.designation_id?this.state.designation_id:'';   
  	const query=(this.state.params.search)?this.state.params.search:'';	    
	
	const filters = (this.state.filterArr.length>0)?this.state.filterArr:[];     
	let filter_arr=[];  		

	filters.forEach((item,i) => { 		
		if(item !='all')
		{
			filter_arr[i]=item;						
		}  				  
	});   
	
	const columns=(this.state.filterArr.length>0)?filter_arr:[];  
	
	axios.get(`${base_url}api`+`/searchemployee/export?emp_no=${emp_no}&emp_name=${emp_name}&bank_name=${bank_name}&department_id=${department_id}&designation_id=${designation_id}&school_id=${school_id}&search=${query}&fields=${JSON.stringify(columns)}`).then(response => 
	{   			   
		console.log(response);	   	  	
		if (response.data.status === 'successed')   
		{   			
			var link =(typeof(response.data.data)!='object')?response.data.data:'';     					 		
			if(link !='')
			{
				window.open(`${base_url}api`+"/searchemployee/downloadexcel/"+link,'_blank'); 					
			}				
		}
		else
		{
			console.log(response.data.message); 							      
		}			
	})
	.catch(error => {  	   
	   console.log(error.message); 	
	   console.log(error.response.data);  				
    })   
	
}

refreshTable() {   
	this.serverTable.current.refreshData();  	
}  

componentDidMount() { 

	const isAuthenticated = localStorage.getItem("isLoggedIn");			
	const token = localStorage.getItem("login_token");					
	
	axios.get(`${base_url}api/checkauth?api_token=${token}`).then(response => {		
		console.log(response);	
		if (response.data.status === 'successed')     
		{
			const login_data=response.data.data?response.data.data:[]; 	
			if (typeof(login_data) != "undefined")
			{ 	
				const schoolid=login_data.school_id;    		
				this.setState({ school_id:schoolid });      					  				
			}   	
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

	axios.get(`${base_url}api`+'/employee/getdepartments').then(response => {  					
		this.setState({  			
				departments: response.data.data ? response.data.data : [],	
			});
		})
	.catch(error => {  	   
	   console.log(error.message); 	 	   
    }) 		
    
} 

formatDate(dateStr) 
{
	const [year, month, day] = dateStr.split('-');
    let newDate =`${day}-${month}-${year}`;				
    return newDate;		
}

render() { 	 		   

const isLoad = this.state.isLoading;    			

if (isLoad) {  

//return null;  		
			 		
}	
	const url = base_url+'api/searchemployee/index';		 											
	
	const filters = (this.state.filterArr.length>0)?this.state.filterArr:[];	     
	let filter_arr=[];   

	filters.forEach((item,i) => { 		
		if(item !='all')
		{
			filter_arr[i]=item;						
		}  				  
	});   
	
	const columns=(this.state.filterArr.length>0)?filter_arr:[];  		
	
	let _this = this;	  		
	
	const options = {  
    perPage: 10,    
    headings: {emp_no:'Employee No.',emp_name:'Employee Name',department_name:'Department Name',gender:'Gender',caste:'Caste',marital_status:'Marital Status',permanent_address:'Permanent Address',mobile:'Mobile No.',email:'Email Id',doj:'Date Of Joining',dob:'Date Of Birth',designation:'Designation',account_no:'Account No.',father_name:'Father Name',aadhar:'Aadhar No.',login_id:'Emp Login Name',leaves_permitted:'Leaves Permitted',pan:'Pan Card',annual_income:'Annual Income',ifsc:'IFSC Code',temporary_address:'Temporary Address',salary_grade:'Salary Grade',grade_cbse:'Salary Grade Cbse'}, 	  	
    sortable: ['emp_no','emp_name'],  							     					
    requestParametersNames: {query:'search',direction:'order'}, 						
    responseAdapter: function (resp_data) 		
	{	
		console.log(resp_data);									
		_this.setState({ params: resp_data.data.query?resp_data.data.query:[] });  	
		_this.setState({ record_sum: resp_data.data.total?resp_data.data.total:0 });  
        return {data:resp_data.data.data?resp_data.data.data:[],total:resp_data.data.total}  				
    },  
    texts: {  
        show: ''  		
    },
    icons: {
    sortUp: 'fa fa-sort-up',
    sortDown: 'fa fa-sort-down'
    }
};	
	
    return (   
      <> 
            
             {/********************
               Preloader Start
               *********************/} 		

    <Preloader />

{/********************
Preloader end
*********************/}	

<div id="main-wrapper">			

   {/***********************************
    Main wrapper start
************************************/}

 {/***********************************
    HeaderPart start
************************************/}  

<HeaderPart />


 {/***********************************
  HaderPart end
************************************/}	

	 {/************************************
		Content body start
	**************************************/}   
	
	<div className="content-body">
	<div className="container-fluid">
		<div className="row page-titles mx-0">
			<div className="col-sm-6 p-md-0">
				<div className="welcome-text">
					<h4>Search Employee</h4>		
				</div>
			</div>
			<div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
				{/****}<!--ol className="breadcrumb breadcrumb-btn">
					<li><a href="./student-admission-list.html" className="btn bg-blue-soft text-blue"><i className="fa fa-user-plus"></i> Search Student List</a></li>
				</ol--> *****/}
			</div>
		</div>
		{/****<!-- row -->*****/}  


		<div className="row">
			<div className="col-12">
				<div className="card">
					{/****<!--div className="card-header"><h4 className="card-title">Please Select Any One Field</h4></div-->*****/}  
					
					<div className="card-body student-search-form">
						<div className="basic-form form-own">
						  <form onSubmit={this.searchFilter}>	  
							<div className="form-row">
							  <div className="col-md-8 left mrb-30">
								<h4 className="mrb-20">Please Select Any One Field</h4>		
								
								<div className="form-row">
								  
								  <div className="form-group col-md-6">			
									<input type="text" className="form-control" name="emp_no" placeholder="Employee No." value={this.state.emp_no?this.state.emp_no:''} onChange={this.handleChange}/>   
								  </div>
								  
								  <div className="form-group col-md-6">
									<input type="text" className="form-control" name="emp_name" placeholder="Employee Name" value={this.state.emp_name?this.state.emp_name:''} onChange={this.handleChange}/>		
								  </div> 								  
								  
								  <div className="form-group col-md-6"> 	 								  
									  <select className="form-control" name="department_id" value={(this.state.department_id)?this.state.department_id:''} onChange={this.handleDepartment}> 											
										  <option value="">Select Department</option>   										  
										  {this.state.departments.map( (item, key) => {     
											return (
										  <option key={key} value={item.departmentId}>{item.departmentName}</option>  				
										  )   
										})}  											
									  </select>			
								  </div> 

								  <div className="form-group col-md-6"> 											
									<select className="form-control" name="designation_id" value={(this.state.designation_id)?this.state.designation_id:''} onChange={this.handleChange}> 											
									  <option value="">Select Designation</option>  
									  {this.state.designations.map( (item, key) => {     
										return (
									  <option key={key} value={item.designationId}>{item.designationName}</option>  				
									  )   
									})}   											
									</select>		
								  </div> 
								  
								  <div className="form-group col-md-6">    
									<input type="text" className="form-control" name="bank_name" placeholder="Bank Name" value={this.state.bank_name?this.state.bank_name:''} onChange={this.handleChange}/>		
								  </div>   

								</div>{/****<!--/ form-row -->***/}					
							  </div>{/****<!--/ left -->***/}  
							  
							  <div className="col-md-4 right mrb-30">
								<h4 className="mrb-20">Select Fields</h4>			
								<div className="search-list-checkbox">  
								
								  <div className="form-check form-checkbox">   
									<input type="checkbox" className="form-check-input" name="filter[]" value="emp_name" checked={this.state.filterArr.includes('emp_name')} onChange={this.handleCheck} ref={node =>this.state.filterlist.push(node)} />		
									<label className="form-check-label" htmlFor="check1">Employee Name</label>
								  </div>{/****<!--/ form-check -->****/}	
								  
								  <div className="form-check form-checkbox">
									<input type="checkbox" className="form-check-input" name="filter[]" value="department_name" checked={this.state.filterArr.includes('department_name')} onChange={this.handleCheck} ref={node =>this.state.filterlist.push(node)} />		
									<label className="form-check-label" htmlFor="check1">Department Name</label>	
								  </div>{/****<!--/ form-check -->*****/}	

								  <div className="form-check form-checkbox">
									<input type="checkbox" className="form-check-input" name="filter[]" value="gender" checked={this.state.filterArr.includes('gender')} onChange={this.handleCheck} ref={node =>this.state.filterlist.push(node)}/>
									<label className="form-check-label" htmlFor="check1">Gender</label>
								  </div>{/****<!--/ form-check -->****/} 

								  <div className="form-check form-checkbox">
									<input type="checkbox" className="form-check-input" name="filter[]" value="caste" checked={this.state.filterArr.includes('caste')} onChange={this.handleCheck} ref={node =>this.state.filterlist.push(node)}/>		
									<label className="form-check-label" htmlFor="check1">Caste</label>		
								  </div>{/****<!--/ form-check -->****/}

								  <div className="form-check form-checkbox">
									<input type="checkbox" className="form-check-input" name="filter[]" value="marital_status" checked={this.state.filterArr.includes('marital_status')} onChange={this.handleCheck} ref={node =>this.state.filterlist.push(node)}/>
									<label className="form-check-label" htmlFor="check1">Marital Status</label>
								  </div>{/****<!--/ form-check -->*****/}

								  <div className="form-check form-checkbox">
									<input type="checkbox" className="form-check-input" name="filter[]" value="permanent_address" checked={this.state.filterArr.includes('permanent_address')} onChange={this.handleCheck} ref={node =>this.state.filterlist.push(node)}/>
									<label className="form-check-label" htmlFor="check1">Permanent Address</label>
								  </div>{/****<!--/ form-check -->****/}  							  
								  
								  <div className="form-check form-checkbox">
									<input type="checkbox" className="form-check-input" name="filter[]" value="mobile" checked={this.state.filterArr.includes('mobile')} onChange={this.handleCheck} ref={node =>this.state.filterlist.push(node)}/>
									<label className="form-check-label" htmlFor="check1">Mobile No.</label>
								  </div>{/****<!--/ form-check -->****/}  								  
								  
								  <div className="form-check form-checkbox">
									<input type="checkbox" className="form-check-input" name="filter[]" value="email" checked={this.state.filterArr.includes('email')} onChange={this.handleCheck} ref={node =>this.state.filterlist.push(node)}/>
									<label className="form-check-label" htmlFor="check1">Email Id</label>
								  </div>{/****<!--/ form-check -->***/} 

								  <div className="form-check form-checkbox">
									<input type="checkbox" className="form-check-input" name="filter[]" value="doj" checked={this.state.filterArr.includes('doj')} onChange={this.handleCheck} ref={node =>this.state.filterlist.push(node)}/>		
									<label className="form-check-label" htmlFor="check1">Date Of Joining</label>
								  </div>{/****<!--/ form-check -->***/} 
								  
								  <div className="form-check form-checkbox">
									<input type="checkbox" className="form-check-input" name="filter[]" value="dob" checked={this.state.filterArr.includes('dob')} onChange={this.handleCheck} ref={node =>this.state.filterlist.push(node)}/>
									<label className="form-check-label" htmlFor="check1">Date Of Birth</label>
								  </div>{/****<!--/ form-check -->****/}   

								  <div className="form-check form-checkbox">
									<input type="checkbox" className="form-check-input" name="filter[]" value="designation" checked={this.state.filterArr.includes('designation')} onChange={this.handleCheck} ref={node =>this.state.filterlist.push(node)} />		
									<label className="form-check-label" htmlFor="check1">Designation</label>
								  </div>{/****<!--/ form-check -->***/}  	
								  
								  <div className="form-check form-checkbox">
									<input type="checkbox" className="form-check-input" name="filter[]" value="account_no" checked={this.state.filterArr.includes('account_no')} onChange={this.handleCheck} ref={node =>this.state.filterlist.push(node)}/>
									<label className="form-check-label" htmlFor="check1">Account No.</label>		
								  </div>{/****<!--/ form-check -->****/}

								  <div className="form-check form-checkbox">				
									<input type="checkbox" className="form-check-input" name="filter[]" value="father_name" checked={this.state.filterArr.includes('father_name')} onChange={this.handleCheck} ref={node =>this.state.filterlist.push(node)} />		
									<label className="form-check-label" htmlFor="check1">Father Name</label>		
								  </div>{/****<!--/ form-check -->***/}   								  
								  		
								  <div className="form-check form-checkbox">
									<input type="checkbox" className="form-check-input" name="filter[]" value="aadhar" checked={this.state.filterArr.includes('aadhar')} onChange={this.handleCheck} ref={node =>this.state.filterlist.push(node)}/>
									<label className="form-check-label" htmlFor="check1">Aadhar No.</label>		
								  </div>{/****<!--/ form-check -->****/}  								  
								  
								  <div className="form-check form-checkbox">			
									<input type="checkbox" className="form-check-input" name="filter[]" value="temporary_address" checked={this.state.filterArr.includes('temporary_address')} onChange={this.handleCheck} ref={node =>this.state.filterlist.push(node)}/>			
									<label className="form-check-label" htmlFor="check1">Temporary Address</label>
								  </div>{/****<!--/ form-check -->****/} 
								  
								  <div className="form-check form-checkbox">
									<input type="checkbox" className="form-check-input" name="filter[]" value="ifsc" checked={this.state.filterArr.includes('ifsc')} onChange={this.handleCheck} ref={node =>this.state.filterlist.push(node)}/>	
									<label className="form-check-label" htmlFor="check1">IFSC</label>
								  </div>{/****<!--/ form-check -->****/}  		
								  
								  <div className="form-check form-checkbox">
									<input type="checkbox" className="form-check-input" name="filter[]" value="annual_income" checked={this.state.filterArr.includes('annual_income')} onChange={this.handleCheck} ref={node =>this.state.filterlist.push(node)}/>
									<label className="form-check-label" htmlFor="check1">Annual Income</label>
								  </div>{/****<!--/ form-check -->****/}		
								  
								  <div className="form-check form-checkbox">   
									<input type="checkbox" className="form-check-input" name="filter[]" value="pan" checked={this.state.filterArr.includes('pan')} onChange={this.handleCheck} ref={node =>this.state.filterlist.push(node)}/>			
									<label className="form-check-label" htmlFor="check1">Pan Card</label>
								  </div>{/****<!--/ form-check -->****/}  								  								  
								  						  
								  <div className="form-check form-checkbox">
									<input type="checkbox" className="form-check-input" name="filter[]" value="leaves_permitted" checked={this.state.filterArr.includes('leaves_permitted')} onChange={this.handleCheck} ref={node =>this.state.filterlist.push(node)}/>
									<label className="form-check-label" htmlFor="check1">Leaves Permitted</label>
								  </div>{/****<!--/ form-check -->****/}
								  
								  <div className="form-check form-checkbox">		
									<input type="checkbox" className="form-check-input" name="filter[]" value="login_id" checked={this.state.filterArr.includes('login_id')} onChange={this.handleCheck} ref={node =>this.state.filterlist.push(node)}/>		
									<label className="form-check-label" htmlFor="check1">Emp Login Name</label> 
								  </div>			
								  
								  <div className="form-check form-checkbox">   
									<input type="checkbox" className="form-check-input" name="filter[]" value="salary_grade" checked={this.state.filterArr.includes('salary_grade')} onChange={this.handleCheck} ref={node =>this.state.filterlist.push(node)}/>			
									<label className="form-check-label" htmlFor="check1">Salary Grade</label>
								  </div>{/****<!--/ form-check -->****/}  

								  <div className="form-check form-checkbox">   
									<input type="checkbox" className="form-check-input" name="filter[]" value="grade_cbse" checked={this.state.filterArr.includes('grade_cbse')} onChange={this.handleCheck} ref={node =>this.state.filterlist.push(node)}/>			
									<label className="form-check-label" htmlFor="check1">Salary Grade Cbse</label>
								  </div>{/****<!--/ form-check -->****/} 		
								  
								  <div className="form-check form-checkbox">
									<input type="checkbox" className="form-check-input" name="filter[]" value="all" checked={this.state.filterArr.includes('all')} onChange={this.checkAll} ref={node =>this.state.filterlist.push(node)}/>					
									<label className="form-check-label" htmlFor="check1">Select All</label>		
								  </div>	
								  
								</div>  												 								
										
							  </div>{/****<!--/ right -->****/}  							  
							  		
							  <div className="col-md-12 text-left">	  
								  <div className="form-group">
									  <input type="submit" className="btn btn-primary" value="Search Details"/>		
								  </div>	 
							  </div> 			
							</div>{/****<!--/ form-row -->****/}
						  </form>
						</div>{/****<!--/ form-own -->*****/}	
						  
						{
						this.state.show_result?( 	
						<div className="create-user-table">
							<div className="table-responsive">		  								  
							<h4 className="mrb-20">Total No of Records : {_this.state.record_sum?_this.state.record_sum:0}</h4>
							  <ServerTable ref={_this.serverTable} columns={columns} url={_this.state.app_url?_this.state.app_url:url} options={options} bordered condensed hover striped>		
								{  
									function (row,column) 		
									{  
										return (row[column]);    		
									}  
								}  
								</ServerTable>  							
							</div>
						</div>			
						)
					    :''			
						}  
						{
						this.state.record_sum>0?( 	
						<div className="submit-btn form-own text-right">		 							    
							<input type="submit" name="excel" className="btn btn-primary btn-sm mx-1" onClick={this.handleExport} value="Export To Excel" />  	
							<input type="submit" name="print" className="btn btn-primary btn-sm mx-1" onClick={this.handlePrint} value="Print" />    							   			
    					</div>    
						)
					    :''			
						}  
					</div>		
				</div>
			</div>
		</div>
	</div>
</div>
	
	{/***********************************
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
export default SearchEmployee;  		