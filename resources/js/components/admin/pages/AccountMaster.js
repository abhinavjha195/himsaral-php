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

class AccountMaster extends Component {   
	
constructor (props) {		
  super(props)
  this.state = { 	 	  	 	
    showError: false,		
	showSuccess: false,	 	
	isLoading:true,  	
	school_id:'',			
	message:'',
	app_url:'',	  	
	typeData:[],
	errors:[],		
  }	  	    	   		
	   this.handleCreate = this.handleCreate.bind(this);    
	   this.handleDelete = this.handleDelete.bind(this);   
	   this.hasErrorFor = this.hasErrorFor.bind(this);	
	   this.renderErrorFor = this.renderErrorFor.bind(this);  
	   this.serverTable = React.createRef();      
   }
  
handleCreate (event) {
  event.preventDefault();
  const { type_id,description,income_expense,remark } = event.target;    
  
  const data = {  		
	type_id: type_id.value,
	description: description.value, 
	income_expense: income_expense.value,						
	remark: remark.value, 
	school_id:this.state.school_id,			
  }	 
  
  axios.post(`${base_url}api`+'/account/create',data)	
    .then(response => {  
		console.log(response);		
		if (response.data.status === 'successed')   	
		{		
			this.setState({ showError: false, showSuccess: true, message: response.data.message,errors: response.data.errors });   			
			event.target.reset();  		
			this.refreshTable();  
		}
		else
		{
			this.setState({ showError: true, showSuccess: false, message: response.data.message,errors: response.data.errors });	 			   
		}
    })
    .catch(err => {  	   
	   console.log(err.message);  
	   console.log(err.response.data);	 	
    })
    
}   

hasErrorFor (field) {  		
  return !!this.state.errors[field]					
}

renderErrorFor (field) {
  if (this.hasErrorFor(field)) {
	return ( <span className='invalid-feedback'> <strong>{this.state.errors[field][0]}</strong> </span> )		
  }
}		

handleDelete(id) {		
	 
	Swal.fire({
		title: 'Are you sure?',
		text: "You won't be able to revert this!",
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Yes, delete it!'
	}).then((result) => {
	if (result.value) {		//
			axios.delete(`${base_url}api`+`/account/delete/${id}`)
			  .then((response) => {

				if(response.data.status=='successed')
				{
					Swal.fire({
						icon:"success",
						text:response.data.message			
					});
					this.refreshTable();
				}
				else
				{
					Swal.fire({
						icon:"error",
						text:response.data.message
					});
				}

			  })
			  .catch((err) => {

				Swal.fire({
					text:err.message,		
					icon:"error"
				})
			  });
			//
			}
		});

}

refreshTable() {
	this.serverTable.current.refreshData();		
} 

titleCase = (str) => {
	str = str.toLowerCase();   
	return str.charAt(0).toUpperCase()+str.slice(1);		
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
	
	axios.get(`${base_url}api`+'/account/gettypes').then(response => {    		
		this.setState({  			
			typeData: response.data.data?response.data.data:[],					
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

	let _this = this;	
	const url = base_url+'api/account/index';  	 						
	const columns = ['title','name','description','remark','action'];	  	
	
	const options = {  
    perPage:10,  
    headings: {title:'Type',name:'Name',description:'Description',remark:'Remarks'}, 		
    sortable: ['title','name'],   	
    requestParametersNames: {query:'search',direction:'order'}, 	  					
    responseAdapter: function (resp_data) 
	{ 
		console.log(resp_data);			
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
					<h4>Account Master</h4>						
				</div>
			</div>  			
		</div>
		{/**********<!-- row **********/}
		
		<div className="row">
		  <div className="col-xl-12 col-xxl-12">
			<div className="card">
			  {/******!--div className="card-header"><h4 className="card-title">Create New Exam</h4></div--***/}
			  <div className="card-body"> 				
				<div className="basic-form form-own">
				
					<form onSubmit={this.handleCreate}>
						{this.state.showSuccess?   
						 <div className="alert alert-success" style={{color:"green"}}>    
							{this.state.message}    
						  </div>
						 : null} 
						{this.state.showError?   
						 <div className="alert alert-danger" style={{color:"brown"}}>  
							<strong>{this.state.message}</strong>       	  					   
						  </div>			
						 : null}     
					<div className="form-row">
					
					  <div className="form-group col-sm-6">
						<label>Specify Type</label>
						<select name="type_id" className={`form-control ${this.hasErrorFor('type_id') ? 'is-invalid' : ''}`}>		
						  <option value="">--Select--</option>		
						  {this.state.typeData.map( (item, key) => {     
								return (
								<option key={key} value={item.id}>{item.name}</option>   
							  )
							})}
						</select>
						{this.renderErrorFor('type_id')}   	
					  </div>
					  
					  <div className="form-group col-sm-6">  
						<label>Description</label>
						<input type="text" name="description" className={`form-control`} placeholder=""/>
					  </div>  

					  <div className="form-group col-sm-6">
						<label>Name Of Income/Expense</label>  
						<input type="text" name="income_expense" className={`form-control ${this.hasErrorFor('income_expense') ? 'is-invalid' : ''}`} placeholder=""/>	
						{this.renderErrorFor('income_expense')}  						
					  </div>
					  
					  <div className="form-group col-sm-6">
						<label>Remarks</label>
						<input type="text" name="remark" className={`form-control`} placeholder=""/>		
					  </div>   
					  
					</div>{/**********<!--/ form-row ******-***/}  
					<div className="submit-btn form-own text-right">
					  <input type="submit" value="Save" className="btn btn-primary"/>
					</div>		
					</form>
					
				</div>
				
				<div className="table-responsive">		 
					<ServerTable ref={_this.serverTable} columns={columns} url={url} options={options} bordered condensed hover striped>		
					{  
						function (row,column) 		
						{  
							switch (column) {   
								case 'action':  		
									return (
										  <span><a href={`/account_edit/${row.id}`} className='btn' data-toggle="tooltip" title="Edit"><i className="fa fa-edit" aria-hidden="true"></i></a>
										  <button className="btn" onClick={(event) => _this.handleDelete(`${row.id}`,event)}>   
										  <i className="fa fa-trash" aria-hidden="true"></i></button></span>
										  );  
								default:  
									return (_this.titleCase(row[column])); 						 										
							}  
						}  
					}  
					</ServerTable>		  		
				</div>
				
			  </div>
			  
			</div>
		  </div>  
		</div>{/***********<!--/ row *******/}   		
		
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
      </>		
    );
  }
}

export default AccountMaster;	   	