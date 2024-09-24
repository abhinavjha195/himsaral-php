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

class IncomeList extends Component {

   constructor(props) {
  super(props)
  this.state = {
	isLoading:true,		
  }
	this.handleDelete = this.handleDelete.bind(this);
    this.handlePrint = this.handlePrint.bind(this); 		    
	this.serverTable = React.createRef();
 }
 handleDelete(id) {
        // remove from local state

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
			axios.delete(`${base_url}api`+`/income/delete/${id}`)
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
			  .catch((error) => {
				Swal.fire({
					text:error.message,
					icon:"error"
				})
			  });
			//
			}
		});

    }
    handlePrint(id) {
        axios.get(`${base_url}api/income/print/${id}`).then(response => {		            
            if (response.data.status === 'successed')  
            {
                 var receipt =(typeof(response.data.data)!='object')?response.data.data:'';
                 if(receipt !='')
                 {
                    let a = document.createElement("a");		
                    let url = base_url+'incomes'+'/'+'/'+receipt;			
                    a.target='_blank';
                    a.href = url;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                 }
                this.setState({showErr:false,delmessage:response.data.message,errors:response.data.errors});
            }
            else
            {
                this.setState({showErr:true,delmessage:response.data.message,errors:response.data.errors});
            }
        })
        .catch(error => {
           //console.log(error.message);
            console.log(error.response.data);
        })
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
	
}
 
 
refreshTable() {
	this.serverTable.current.refreshData();
}

convertToDate(dateString) {
	var dateObj = new Date(dateString);
	let dat=dateString.toString(); 	
	var month = dateObj.toLocaleString('default', { month: 'long' });
	let arr = dat.split("-");
    let dt = arr[2]+'-'+month+'-'+arr[0];  		
	return dt;
}

render() {		
	  
const isLoad = this.state.isLoading;    			

if (isLoad) {  

//return null;  		
			 		
}     
	const schoolid = this.state.school_id?this.state.school_id:0;		
	const url = base_url+`api/income/index?school_id=${schoolid}`;   			
	const columns = ['voucher_no','voucher_date','receive_from','pay_mode','total_amount','action'];
	
	let _this = this;	

	const options = {
    perPage: 10,  
    headings: {voucher_no:'Voucher No.',voucher_date:'Date',receive_from:'Name',pay_mode:'Payment Mode',total_amount:'Amount',action:'Actions'},
    sortable: ['voucher_no','receive_from','pay_mode','total_amount'],    
    //columnsWidth: {emp_name:30,email:30,login_id:50},
    //columnsAlign: {login_id:'center',emp_name:'center'},
    requestParametersNames: {query:'search',direction:'order'},      
    responseAdapter: function (resp_data)
	{	
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

<HeaderPart />


 {/***********************************
  HaderPart end
************************************/}

   {/***********************************
    Main wrapper start
************************************/}

	 {/************************************
		Content body start
	**************************************/}
	<div className="content-body">
		<div className="container-fluid">
			<div className="row page-titles mx-0">
				<div className="col-sm-6 p-md-0">
					<div className="welcome-text">
						<h4>School Income</h4>		
					</div>
				</div>
				<div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
					<ol className="breadcrumb breadcrumb-btn">
						<li><a href={`/income_add`} className="btn bg-blue-soft text-blue"><i className="fa fa-user-plus"></i> Add New Income</a></li>	
					</ol>
				</div>
			</div>
			 {/******* row ***/}


			<div className="row">
				<div className="col-12">
					<div className="card">
						{/*****<div className="card-header"><h4 className="card-title">Basic Datatable</h4></div>****/}

						<div className="card-body create-user-table">
							<div className="table-responsive">
								<ServerTable ref={_this.serverTable} columns={columns} url={url} options={options} bordered condensed striped> 		
								{
									function (row, column)
									{
										switch (column) {
											case 'voucher_date':
												return (<span className="name-span">{_this.convertToDate(row.voucher_date)}</span>);
											case 'action':		
												return (
													  <span><a href={`/income_edit/${row.id}`} className='btn' data-toggle="tooltip" title="Edit"><i className="fa fa-edit" aria-hidden="true"></i></a>
                                                      <button className="btn" onClick={() => _this.handleDelete(`${row.id}`)}><i className="fa fa-trash" aria-hidden="true"></i></button>
													  <a href={(row.attachment=='')?base_url+'images/no-image.jpg':base_url+'uploads/income_image/'+row.attachment} className="btn" data-toggle="tooltip" title="Attachment" download><i className="fa fa-download" aria-hidden="true"></i></a>
													  <button className="btn" data-toggle="tooltip" onClick={() => _this.handlePrint(`${row.id}`)} title="Print"><i className="fa fa-print" aria-hidden="true"></i></button>
													  </span>				
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


    {/***********************************
        Main wrapper end
    ************************************/}			
       </div>
    );
  }
}

export default IncomeList;		 		