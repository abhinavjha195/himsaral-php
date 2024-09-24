import React, { Component } from "react";   
import Script from "@gumgum/react-script-tag";  
import Copyright from "../basic/Copyright";  
import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url=location.protocol+'//'+location.host+'/';			 

class ClassWiseSubjectList extends Component {
  constructor() {
    super();
    this.state = {
      showError: false,
      showSuccess:false,
	  isLoading:true,			
      messgae:'',
      remark:'',
      courseName:'',
	  classwiseData:[],		      
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

    axios.get(`${base_url}api`+`/class_wise_subject`)  
    .then(res => {  	 
     if(res.data.status == true){  	
		this.setState({classwiseData:res.data.data});  		            
     }      
    
    })  
    
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
                <h4>Class Wise Subjects List</h4>
              </div>
            </div>
            <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
              <ol className="breadcrumb breadcrumb-btn">
                <li><a href={'class_wise_subject_create'} className="btn bg-blue-soft text-blue"><i className="fa fa-user-plus"></i> Add Class Wise Subjects</a></li>		
              </ol>
            </div>
          </div>
          {/* row */}
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Color Indicator &nbsp; &nbsp; &nbsp; <span className="btn bg-red-soft text-red" /> <small className="text-red">Compulsory Subject</small> <span className="btn bg-green-soft text-green" /> <small className="text-green">Elective Subject</small> <span className="btn bg-purple-soft text-purple" /> <small className="text-purple">Additional Subject</small></h4>
                </div>
                <div className="card-body create-user-table">
                  <div className="table-responsive">
                    <table className="table table-bordered table-striped verticle-middle table-responsive-sm" id="example34">
                      <thead>
                        <tr>
                          <th scope="col">Course Name</th>
                          <th scope="col">Class Name</th>
                          <th scope="col">Section Name</th>
                          <th scope="col">Subject List</th>
                          <th scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                      {this.state.classwiseData.map( (item, key) => {	
					  const sub_arr = item.sub_list.split(',');
					  const com_arr = item.com_list.split(',');
					  const elec_arr = item.elec_list.split(',');  
					  const ado_arr = item.ado_list.split(',');	 
					  var lvl="";			
					  var levels = [];  	
					  
					  for(var i=0;i<sub_arr.length;i++)
					  {   
						  if(com_arr[i]==true) 
						  {
							  lvl='red';
						  }
						  else if(elec_arr[i]==true) 
						  {
							  lvl='green';
						  }
						  else if(ado_arr[i]==true) 
						  {
							  lvl='purple';		
						  }
						  else
						  {
							  lvl='';		
						  }  
						  
						  levels.push(<span key={i} className={'badge bg-'+lvl+'-soft text-'+lvl}>{sub_arr[i]}</span>);   
					  }  							
					  
                   return (
                        <tr key={item.id}>    
                          <td>{item.courseName}</td>
                          <td>{item.className}</td>
                          <td>{item.sectionName}</td>			
                          <td>		
                          	  {levels}   		
                          </td>
                          <td><a className="btn" href={`/class_wise_subject_edit/${item.id}`}><i className="fa fa-edit" aria-hidden="true" /></a>
                            <a className="btn" href={`/api/class_wise_subject_delete/${item.id}`}><i className="fa fa-trash" aria-hidden="true" /></a></td>
                        </tr>
                       )
                    })}
                      </tbody>
                    </table>
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

export default ClassWiseSubjectList;		