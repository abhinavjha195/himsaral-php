import React, { Component } from "react";
import axios from 'axios'; 
import { Link } from 'react-router-dom';   

import Script from "@gumgum/react-script-tag";

import Copyright from "../basic/Copyright";

import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url=location.protocol+'//'+location.host+'/';	


class FeeAmountCreate extends Component {   
	
constructor (props) {		
  super(props)
  this.state = { 	 
	isChecked:false, 	  	 	
    showError: false,		
	showSuccess: false,
	isLoading:true,		
	feeData: [],	
	courseData: [],
	classData: [],
    categoryData:[],
	amntArr:[],			
	feecats:[]   	  	
	
  }	   
	   this.handleChange = this.handleChange.bind(this);
	   this.handleSelect = this.handleSelect.bind(this); 
	   this.handleCategory = this.handleCategory.bind(this);    	
	   this.handleUpdate = this.handleUpdate.bind(this);	  		
   }
  
  
  handleUpdate (event) {  
  event.preventDefault();
  
	const urlString = window.location.href;
	const url = new URL(urlString);  		
		
	const lastSegment = url.pathname.split('/').pop();	
	const id = parseInt(lastSegment);      
  
  let courseid = this.state.course_id?this.state.course_id:(this.state.feeData.length>0)?parseInt(this.state.feeData[0].course_id):0;
  let classid = this.state.class_id?this.state.class_id:(this.state.feeData.length>0)?parseInt(this.state.feeData[0].class_id):0;   

  let amntarr=this.state.feecats;       
  let markarr = {};			  
  
    for(var key in amntarr) 
	{  			 
		if(amntarr[key] !== null)
		{
			if(amntarr[key].name=='category[]')      
			{
				markarr[amntarr[key].id]=(isNaN(parseInt(amntarr[key].value)))?0:parseInt(amntarr[key].value);    
			}
		}
	}   
  
  const data = {  	 	
	course_id: courseid,		
	class_id: classid,  
	cat_arr: markarr    		 	  
  }	 
  
   axios.post(`${base_url}api`+`/feeamount/update/${id}`,data).then(response => { 		
		console.log(response.data);    
		if (response.data.status === 'successed')   		
		{		
			this.setState({ showError: false, showSuccess: true, message: response.data.message});  
			window.location.href = base_url+"fee_amount_list";   	
		}
		else
		{
			this.setState({ showError: true, showSuccess: false, message: response.data.message});	 			   
		}
    })
    .catch(err => {  	   
	   console.log(err.message); 	
		 console.log(err.response.data);  
    })	
  
    
   }
   
   handleSelect(event) {  	
		 
		 var id = event.target.value;  			
	   
		   if(id >0)
		   {
			   axios.get(`${base_url}api`+`/class/getclassbycourse/${id}`).then(response => { 
				console.log(response.data.data);			
					this.setState({     
						classData: response.data.data ? response.data.data :[]     
					}); 
				})
				.catch(error => {  	   
				   console.log(error.message); 	
				})    
			   
		   }
		   else
		   {
			   this.setState({   
					classData: []			
				}); 
		   }

		this.setState({ [event.target.name]: event.target.value });     	
		 
	}    
   handleCategory(event){		
    event.preventDefault();
	
	const cat_id = event.target.id;   
	const cat_val = event.target.value; 
	
	let amnt_arr=this.state.amntArr;    
	
	let ca_arr = {};
	
	for(var key in amnt_arr) 
	{  
		ca_arr[key]=amnt_arr[key];	  
	} 
	
	ca_arr[cat_id]=cat_val;  
	
    this.setState({ amntArr:ca_arr });   				
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

	
	const urlString = window.location.href;
    const url = new URL(urlString);  		
		
    const lastSegment = url.pathname.split('/').pop();	
	const id = lastSegment;    
	   
	axios.get(`${base_url}api`+`/feeamount/edit/${id}`).then(response => {    
	
	this.setState({  			 			
			feeData:response.data.data.fee_data?response.data.data.fee_data:[],
			courseData:response.data.data.course_data?response.data.data.course_data:[],
			classData:response.data.data.class_data?response.data.data.class_data:[],
			categoryData:response.data.data.category_data?response.data.data.category_data:[] 	
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
	
	let courseRows = this.state.courseData; 		
	let classRows = this.state.classData;    	
	const feeRow = this.state.feeData; 
	
	let feecourse_id = (this.state.feeData.length>0)?this.state.feeData[0].course_id:0; 	
	let feeclass_id = (this.state.feeData.length>0)?this.state.feeData[0].class_id:0; 
	
	const catArr = (this.state.feeData.length>0)?this.state.feeData[0].cat_list.split(','):[];  
	const amountArr = (this.state.feeData.length>0)?this.state.feeData[0].amount_list.split(','):[];     	
	
	let amount_arr = {};  	
	
	for(var i=0;i<catArr.length;i++)
	{		
		amount_arr[parseInt(catArr[i])]=parseInt(amountArr[i]);  		
	}				
	
	let courseList = courseRows.length > 0	
		&& courseRows.map((item, i) => {
			
		return ( 		
				<option key={i} value={item.courseId}>{item.courseName}</option>    
			)  
		
	}, this);  	  
	
	let classList = classRows.length > 0	
		&& classRows.map((item, i) => {		
			
		return ( 		
				<option key={i} value={item.classId}>{item.className}</option>    
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
					<h4>Edit Fee Amount</h4>				
				</div>
			</div>
			<div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
				<ol className="breadcrumb">
					<li><a href={`/fee_amount_list`} className="btn bg-blue-soft text-blue"><i className="fa fa-angle-double-left"></i> Back to Fee Amount List</a></li>					
				</ol>
			</div>
		</div> 		
		
		<div className="row">
		  <div className="col-xl-12 col-xxl-12">
			<div className="card">
			  
			  <div className="card-body">
				
				<div className="basic-form form-own className-wise-subject">
				  <form onSubmit={this.handleUpdate}>   
					<div className="text-center">      
						{this.state.showError ? <div className="error">{this.state.message}</div> : null}
						{this.state.showSuccess ? <div className="success">{this.state.message}</div> : null} 
					</div>	
					<div className="form-row">  
									
					  <div className="form-group col-md-6">	
						<label>Course Name</label>
						<select className="form-control" id="course_id" name="course_id" value={this.state.course_id?this.state.course_id:feecourse_id} onChange={this.handleSelect}>		
						  <option value="0">Select Course</option>		  				
						  {courseList}			  
						</select>  
					  </div>  	
					  <div className="form-group col-md-6">	
						<label>Class Name</label>
						<select className="form-control" id="class_id" name="class_id" value={this.state.class_id?this.state.class_id:feeclass_id} onChange={this.handleChange}>		
						  <option value="0">Select Class</option>						
						  {classList}					  
						</select>   
					  </div>   
					  
					  <div className="form-group col-md-12">	
						<label>Category wise Fee Amount Description</label>    						
					  </div>  
					{
					(this.state.categoryData.length >0)?( 	 
					  <div className="form-group col-md-12">		
						<div className="Schedule-table">
						  <div className="table-responsive">
							<table className="table table-bordered table-striped verticle-middle table-responsive-sm">
								<thead>
									<tr className="table-custom-th">
										<th scope="col">Fee Category</th>   										
										<th scope="col">Fee Amount</th>   
									</tr>
								</thead>
								<tbody>
									{this.state.categoryData.map( (item,key) => {	
                                        const isSpecialFeeId = item.fee_id === 3 || item.fee_id === 4;
									return (  
									<tr key={item.fee_id} className={`${isSpecialFeeId ? 'special-category' : ''}`}>
										<td>{item.name}</td>  										
										<td>
											<input type="number" id={item.fee_id} name="category[]" value={(this.state.amntArr.hasOwnProperty(item.fee_id))?this.state.amntArr[item.fee_id]:(amount_arr.hasOwnProperty(item.fee_id))?amount_arr[item.fee_id]:0} ref={node =>this.state.feecats.push(node)} className="form-control" step="0.1"  onChange={this.handleCategory} disabled={isSpecialFeeId} title={`${isSpecialFeeId ? 'System Alert: Editing Not Available' : ''}`}/>	   		
										</td>   		
									</tr>  
									)    
								})}   
								</tbody>
							</table>
						</div>
						</div>
					  </div>
					  ):null 									  
					}    
					</div>
					<input type="submit" className="btn btn-primary" value="Save"/>
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

export default FeeAmountCreate;	   	