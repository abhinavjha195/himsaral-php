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

class RegisteredStudentList extends Component {		
	
   constructor(props) {
  super(props)
  this.state = {
	  course_id:'',
      class_id:'', 
	  amount:'',	
	  app_url:'',
	  params:'',			
	  courseData:[],
	  classData:[],		
  }  	
	this.serverTable = React.createRef();   
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

	axios.get(`${base_url}api`+'/class/getcourses').then(response => {   		
	this.setState({  			
			courseData: response.data.data ? response.data.data : [],	
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
	
	const url = base_url+'api/registeredstudent/index';	
	const columns = ['student_name','courseName','father_name','mobile','email','permanent_address'];	 

	const divStyle = {
		overflowY: 'hidden',		
		overflowX: 'hidden'			
	};	
	
	let _this = this;						
	
	const options = {  
    perPage: 10,  
    headings: {student_name:'Student Name',courseName:'Course',father_name:'Father Name',mobile:'Mobile No',email:"Email", permanent_address:"Address"}, 			
    sortable: ['student_name','father_name','courseName', 'mobile', 'email', 'permanent_address'],  		
    columnsWidth: {student_name:'100px',father_name:'75px',mobile:'75px',courseName:'75px'},  
    columnsAlign: {courseName:'center',student_name:'center',action:'center'},  					
    requestParametersNames: {query:'search',direction:'order'}, 		
    responseAdapter: function (resp_data) 
	{		
		_this.setState({ params: resp_data.data.query?resp_data.data.query:[] });  	
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
					<h4>Registered Student List</h4>		
				</div>
			</div>
		</div>   

		<div className="row">
			<div className="col-12">
				<div className="card">
					<div className="card-body">		
						<div className="table-responsive" style={divStyle}>		
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
export default RegisteredStudentList;  		