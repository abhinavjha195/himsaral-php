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

class TotalRegistration extends Component {		
	
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
	this.handleCourse = this.handleCourse.bind(this);		
	this.handleClass = this.handleClass.bind(this);      
	this.handleAmount = this.handleAmount.bind(this);     	
	this.handleExport = this.handleExport.bind(this);      	
	this.serverTable = React.createRef();   
 }      

handleCourse(e) {		
	
	const inp = e.target.name;  
	const id = e.target.value; 

	const class_id=this.state.class_id;	
	const amnt=this.state.amount;
   
   if(id >0)
   {
	   axios.get(`${base_url}api`+`/class/getclassbycourse/${id}`).then(response => {    		
			this.setState({  			 					  
				classData: response.data.data ? response.data.data :[],		
				app_url: base_url+`api/registration/index?course_id=${id}&class_id=${class_id}&amount=${amnt}`,	
				[inp]:id	
			}); 
		})
		.catch(error => {  	   
		   console.log(error.message); 	   
		})    
   }
   else
   {
		this.setState({   
			classData:[],
			[inp]:id,		
			app_url:''				
		}); 
   }   
		
}  
handleClass(e) {	
	
	const inp = e.target.name;   
	const id = e.target.value;  
	
	const course_id=this.state.course_id;	
	const amnt=this.state.amount;	
   
   if(id >0)
   {
		this.setState({  			 					  
			[inp]:id,  
			app_url: base_url+`api/registration/index?class_id=${id}&course_id=${course_id}&amount=${amnt}`,		
		}); 
   }
   else
   {
		this.setState({   
			[inp]:id,		
			app_url:''				
		}); 
   }   
		
}  
handleAmount(e) {		
	
	const inp = e.target.value;  	
    const re = /^[0-9.\b]+$/;     				
	const arr=(inp.length>0)?inp.split('.'):[];		

	const course_id=this.state.course_id;			
	const class_id=this.state.class_id;			
	
	if(re.test(inp) && (arr.length<=2))		
	{ 
		this.setState({   
			amount:inp,		
			app_url: base_url+`api/registration/index?amount=${inp}&course_id=${course_id}&class_id=${class_id}`,			
		});    
	}   	
		
}   
	
handleExport(){  			

	const classid=(this.state.params.class_id)?this.state.params.class_id:'';    
	const courseid=(this.state.params.course_id)?this.state.params.course_id:'';		
	const fee=(this.state.params.amount)?this.state.params.amount:'';	
	const query=(this.state.params.search)?this.state.params.search:'';		 	
	 	
	axios.get(`${base_url}api`+`/registration/export?class_id=${classid}&course_id=${courseid}&amount=${fee}&search=${query}`).then(response => {   
			console.log(response);	   	  	
		if (response.data.status === 'successed')   
		{   			
			var link =(typeof(response.data.data)!='object')?response.data.data:'';     		 		
			if(link !='')
			{
				window.open(`${base_url}api`+"/registration/downloadexcel/"+link,'_blank'); 					
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
	
	const url = base_url+'api/registration/index';	
	const columns = ['registration_no','registration_date','student_name','father_name','mobile','courseName','className','fee','stationName'];	 

	const divStyle = {
		overflowY: 'hidden',		
		overflowX: 'hidden'			
	};	
	
	let _this = this;						
	
	const options = {  
    perPage: 10,  
    headings: {registration_no:'Registration Id',registration_date:'Registration Date',student_name:'Student Name',father_name:'Father Name',mobile:'Mobile No',courseName:'Course',className:'Class',fee:'Amount',stationName:'Station'}, 			
    sortable: ['courseName','student_name', 'registration_no', 'registration_date', 'father_name', 'mobile', 'className', 'fee', 'stationName'],  		
    columnsWidth: {registration_no:'75px',registration_date:'75px',student_name:'80px',father_name:'75px',mobile:'75px',courseName:'75px',className:'70px',fee:'75px',stationName:'70px'},  
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
					<h4>Total Registration</h4>		
				</div>
			</div>
		</div>   

		<div className="row">
			<div className="col-12">
				<div className="card">
					<div className="card-body">		
						<div className="table-responsive" style={divStyle}>		
							<div className="form-group row">
								<div className="col-2">
								  <label htmlFor="sel1">Course Name</label>
								  <select className="form-control" name="course_id" onChange={this.handleCourse} value={(this.state.course_id)?this.state.course_id:''}>
									  <option value="">--Select--</option>		
									  {this.state.courseData.map( (item, key) => {     
										return (
									  <option key={key} value={item.courseId}>{item.courseName}</option>   
									  )
									})}
								  </select> 
								</div>
								<div className="col-2"> 		
								  <label htmlFor="sel1">Class Name</label>
								  <select className="form-control" name="class_id" onChange={this.handleClass} value={(this.state.class_id)?this.state.class_id:''}>		
								  <option value="">--Select--</option>
									  {this.state.classData.map( (item, key) => {		
										return (
									  <option key={key} value={item.classId}>{item.className}</option>
									  )     
									})}
									</select>		
								</div>
								<div className="col-6">		
								  <label htmlFor="sel1">Load the List of Students who have paid Registration Amount</label>
								  <input className="form-control" name="amount" onChange={this.handleAmount} defaultValue={(this.state.amount)?this.state.amount:''}/>			
								</div>
								<div className="col-2">
									<label htmlFor="sel1"></label>	
									<button type="button" className="btn btn-sm btn-info" style={{marginTop:'30px'}} onClick={() => this.handleExport()}>Export to Excel <i className="fa fa-file-excel-o" aria-hidden="true"></i></button>		
								</div>		
							</div>									
							<ServerTable ref={_this.serverTable} columns={columns} url={_this.state.app_url?_this.state.app_url:url} options={options} bordered condensed hover striped>		
							{  
								function (row,column) 		
								{  
									switch (column) {   
										case 'registration_date':
											return (  
												  _this.formatDate(row.registration_date) 				
											  );  														
										default:  
											return (row[column]);  						
									}  
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
export default TotalRegistration;  		