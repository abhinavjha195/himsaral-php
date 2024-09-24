import React, { Component } from "react";
import axios from 'axios';  
import { Link } from 'react-router-dom';      
		
import Script from "@gumgum/react-script-tag";  
import Copyright from "../basic/Copyright";
import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url=location.protocol+'//'+location.host+'/';	

class AddIncome extends Component {    
  
  constructor (props) {
  super(props)
  this.state = {  	
	isLoading:true,
	fileError:false,
	fileHelp:true,  	
	fileErr:false,
	fileTxt:true,  
	showError:false,  
	showSuccess:false,	
	voucher_date:'',	
	invoice_date:'',
	school_id:'',			
	fileMsg:'',  	
	imgUrl:'',	
	fileMessage:'',  	
	imgSrc:'',
	message:'',				 	
	modeData:[],
	typeData:[],  	
	errors:[],  
  }
   this.handleCreate = this.handleCreate.bind(this);  
   this.handleFile = this.handleFile.bind(this);       
   this.handleClick = this.handleClick.bind(this);   	   
   this.handleIcon = this.handleIcon.bind(this);      
   this.handleOnDrop = this.handleOnDrop.bind(this);      
   this.handleDragOver = this.handleDragOver.bind(this);    		
   this.handleChange = this.handleChange.bind(this);           
   this.hasErrorFor = this.hasErrorFor.bind(this);
   this.renderErrorFor = this.renderErrorFor.bind(this);
   this.input = React.createRef();  		  	    
}  

titleCase(str) {   
   var splitStr = str.toLowerCase().split(' ');
   for (var i = 0; i < splitStr.length; i++) {
       // You do not need to check if i is larger than splitStr length, as your for does that for you
       // Assign it back to the array
       splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
   }
   // Directly return the joined string
   return splitStr.join(' '); 
} 

handleFile(ev) 
{
	ev.preventDefault();     
	const validImageTypes = ['image/jpeg','image/png'];      
	
	if (ev.target.files && ev.target.files.length > 0) 
	{
		const fileType = ev.target.files[0].type;      
		if (validImageTypes.includes(fileType)) 
		{			
			this.setState({ [ev.target.name]:ev.target.files[0],imgSrc:URL.createObjectURL(ev.target.files[0]),fileError:false,fileHelp:false,fileMessage:""});	  		   
		}        
		else {
			this.setState({fileError:true,fileHelp:true,fileMessage:"only jpeg or png image accepted",imgSrc:""});   
		}       				
    } 	
}   

handleOnDrop(ev) 
{
	ev.preventDefault();    
	const validImageTypes = ['image/jpeg','image/png'];   	
	let imageFile = ev.dataTransfer.files[0];
	const fileType = ev.dataTransfer.files[0].type;   
	const fileInput=this.fileInput.name;    
	if (validImageTypes.includes(fileType)) 
	{			
		this.setState({ [fileInput]:ev.dataTransfer.files[0],imgSrc:URL.createObjectURL(ev.dataTransfer.files[0]),fileError:false,fileHelp:false,fileMessage:"" });	  		 
	}        
	else {
		this.setState({fileError:true,fileHelp:true,fileMessage:"only jpeg or png images accepted",imgSrc:""});   
	}    
}   
 
handleClick(e) 
{
	const id=event.target.id;  
	if(id !='del_img')
	{
		this.fileInput.click();   
	}
}  

handleDragOver(ev) 
{
	ev.preventDefault();   
} 
handleIcon(e)
{
	e.preventDefault();  
	const fileInput=this.fileInput.name;   	
	this.setState({fileError:false,fileHelp:true,fileMessage:"",imgSrc:"",[fileInput]:""});     
}

handleChange(event){		
    event.preventDefault();  	
    this.setState({ [event.target.name]: event.target.value });   
}
   
hasErrorFor (field) {
  return !!this.state.errors[field]		
}
renderErrorFor (field) {
  if (this.hasErrorFor(field)) 
  {	
	if(field=='icon_image' || field=='logo_image')		   	
	{
		return (<span className='error'> <strong>{this.state.errors[field][0]}</strong> </span>)  
	}
	return ( <span className='invalid-feedback'> <strong>{this.state.errors[field][0]}</strong> </span> )
  }
}  

handleCreate(event){
	event.preventDefault();    
	const { voucher_no,voucher_date,type_id,total_amount,mode_id,transection_purpose,receive_from,party_name,sender_address,invoice_no,invoice_amount,invoice_date,party_address,cheque_no } = event.target;  
	
	const action=window.event.submitter.name;   	
	const attachment=(this.state.photo)?this.state.photo:'';    		
  
	let fd = new FormData();		
		
	fd.append("voucher_no",voucher_no.value);	 
	fd.append("voucher_date",voucher_date.value);	
	fd.append("type_id",type_id.value);	 
	fd.append("total_amount",total_amount.value);	 		 
	fd.append("mode_id",mode_id.value);	 
	fd.append("transection_purpose",transection_purpose.value);	 
	fd.append("receive_from",receive_from.value);			
	fd.append("party_name",party_name.value);	  		
	fd.append("sender_address",sender_address.value);	 
	fd.append("invoice_no",invoice_no.value);	
	fd.append("invoice_amount",invoice_amount.value);	 
	fd.append("invoice_date",invoice_date.value);	
	fd.append("party_address",party_address.value);					
	fd.append("cheque_no",cheque_no.value);   
	fd.append("school_id",this.state.school_id);   		     
	fd.append("attachment_image",attachment);   
	fd.append("button",action);    		

	axios.post(`${base_url}api/income/create`,fd)			  
		.then(response => {    				
		console.log(response);		  
		if (response.data.status === 'successed')      
		{		
			this.setState({ showError:false,showSuccess:true,message:response.data.message,errors:response.data.errors});		  		
			var receipt =response.data.data.print_id?response.data.data.print_id:'';    				 
			if(receipt !='')  
			{
				let a = document.createElement("a"); 
				let url = base_url+'incomes/'+receipt; 																
				a.target='_blank';   		
				a.href = url;
				document.body.appendChild(a);					
				a.click();
				document.body.removeChild(a);   			
			}  		
			window.location.href = base_url+'income_master';  
		}
		else
		{
		   this.setState({ showError: true, showSuccess:false,message:response.data.message,errors:response.data.errors});	  
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
	
	let currDate = new Date();		
	let date_today = currDate.toISOString().substring(0,10);
	let schoolid = ''; 	
	
	axios.get(`${base_url}api/checkauth?api_token=${token}`).then(response => {		
			
		if (response.data.status === 'successed')     
		{
			const login_data=response.data.data?response.data.data:[]; 	
			if (typeof(login_data) != "undefined")
			{ 	
				schoolid=login_data.school_id; 
				axios.get(`${base_url}api/income/gettypes/${schoolid}`).then(response => {    
					console.log(response);		
					this.setState({  			
						typeData: response.data.data?response.data.data:[],					
					});
				})
				.catch(error => {  	   
				   console.log(error.message); 	 				    
				}) 
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
	
	axios.get(`${base_url}`+'api/income/getmodes').then(response => {    
		console.log(response);		
		this.setState({  			
			modeData: response.data.data?response.data.data:[],					
		});
	})
	.catch(error => {  	   
	   console.log(error.message); 	
    })  
	
	this.setState({ voucher_date:date_today,invoice_date:date_today	});	  	  	
   
}   
   
render () {	 

const isLoad = this.state.isLoading;      
let _this = this;		  					

if (isLoad) {  

//return null;  		
			 		
}

const style_drag = { 
	position:'relative',
	height:'170px',       
	width:'95%',   	
	border:"1px solid #d4d4d4",		
	textAlign:'center',			
};  

const img_remove = {   
	position:'absolute',
	top:'-10px',
	right:'-11px',	
	borderRadius:'10em',
	padding:'2px 6px 3px',
	textDecoration:'none',
	border:'3px solid #fff',  
	color:'#FFF',	
	background:'#E54E4E', 	
};  

const center_img = { 
    display:'block', 		
	marginLeft:'auto',
	marginRight:'auto',  		
	width:'50%',  	    
	padding:'5px',     
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
								<h4>Add School Income</h4>		   
							</div>
						</div> 						
					</div> 		
					
					<div className="row">
					  <div className="col-xl-12 col-xxl-12">
						<div className="card"> 						  
						  <div className="card-body">							
							<div className="basic-form form-own">
								 <form onSubmit={this.handleCreate}>   		
									{this.state.showError?   
									 <div className="alert alert-danger" style={{color:"brown"}}>  
										<strong>{this.state.message}</strong>       	  					   
									  </div>			
									 : null}   
									{this.state.showSuccess?   
									 <div className="alert alert-success" style={{color:"green"}}>    
										{this.state.message}    
									  </div>
									 : null}  
									<div className="form-row"> 	
									
									  <div className="form-group col-md-6">
										<label>Voucher No</label>
										<input type="text" name="voucher_no" className={`form-control ${this.hasErrorFor('voucher_no') ? 'is-invalid' : ''}`} placeholder="Enter Voucher No." />  
										{this.renderErrorFor('voucher_no')}     	
									  </div>
 									  
									  <div className="form-group col-md-6">  
										<label>Date</label>  
										<input type="date" name="voucher_date" className={`form-control ${this.hasErrorFor('voucher_date') ? 'is-invalid' : ''}`} value={(this.state.voucher_date)?this.state.voucher_date:''} onChange={this.handleChange} placeholder="dd/mm/yy" />
										{this.renderErrorFor('voucher_date')}     	
									  </div>
									  
									  <div className="form-group col-md-6">  
										<label>Select Income Type</label>
										<select className={`form-control ${this.hasErrorFor('type_id') ? 'is-invalid' : ''}`} name="type_id">    
											  <option value="">--Select--</option>  
											  {this.state.typeData.map( (item, key) => {     
												return (
											  <option key={key} value={item.id}>{item.name}</option>   
											  )
											})}
										  </select> 
										  {this.renderErrorFor('type_id')}    
									  </div>
									  
									  <div className="form-group col-md-6">   		
										<label>Total Amount</label>
										<input type="number" name="total_amount" className={`form-control ${this.hasErrorFor('total_amount') ? 'is-invalid' : ''}`} min="1" step="0.01"/> 
										{this.renderErrorFor('total_amount')}     
									  </div>
									  
									  <div className="form-group col-md-6">
										<label>Select Payment Mode</label>
										<select className={`form-control ${this.hasErrorFor('mode_id') ? 'is-invalid' : ''}`} name="mode_id">      
											  <option value="">--Select--</option>  
											  {this.state.modeData.map( (item, key) => {     
												return (
											  <option key={key} value={item.id}>{item.pay_mode}</option>   
											  )
											})}    
										  </select> 
										  {this.renderErrorFor('mode_id')}  
									  </div>
									  
									  <div className="form-group col-md-6">
										<label>Purpose Of Transection</label>  
										<input type="text" name="transection_purpose" className={`form-control ${this.hasErrorFor('transection_purpose') ? 'is-invalid' : ''}`} placeholder="Enter transection purpose"/>
										{this.renderErrorFor('transection_purpose')}	
									  </div>
									  
									  <div className="form-group col-md-6">
										<label>Receive From</label>  
										<input type="text" name="receive_from" className={`form-control ${this.hasErrorFor('receive_from') ? 'is-invalid' : ''}`} placeholder="Enter receive from"/>
										{this.renderErrorFor('receive_from')}	  
									  </div>
									  
									  <div className="form-group col-md-6">
										<label>Bank/Party Name</label>  
										<input type="text" name="party_name" className={`form-control ${this.hasErrorFor('party_name') ? 'is-invalid' : ''}`} placeholder="Enter bank/party name"/>	
										{this.renderErrorFor('party_name')}	   	
									  </div>
									  
									  <div className="form-group col-md-6">    
										<label>Address Of Sender</label>
										<textarea className={`form-control ${this.hasErrorFor('sender_address') ? 'is-invalid' : ''}`} rows="3" name="sender_address"></textarea>    
										{this.renderErrorFor('sender_address')}  	
									  </div>  
									  
									  <div className="form-group col-md-6">
										<label>Attachment</label>     			
										<div id="file_div" style={style_drag} onDragOver={(e) => this.handleDragOver(e)} onDrop={(e) => this.handleOnDrop(e)} onClick={this.handleClick}>      
										  {this.state.fileHelp?<p style={{padding:"10px",cursor:"pointer"}} id="para_txt">Drag and drop a file here or click</p>:null}   
										  {this.state.imgSrc?<img id="icon_img" src={this.state.imgSrc?this.state.imgSrc:''} style={center_img} width="100" height="155" alt='no-image' />:null}     
										  <a id="del_img" onClick={this.handleIcon} href="#" style={img_remove}>&#215;</a>   	
										  <input type="file" name="photo" ref={(node) => {this.fileInput = node;}} onChange={this.handleFile} hidden/>    
										  {this.state.fileError?     
										  <p style={{color:"red"}}>  		  
											<strong>{this.state.fileMessage}</strong>         			  					   
										  </p>  
										 : null}		   		 
										</div>
										{this.renderErrorFor('icon_image')}  										
									  </div>  

									  <div className="form-group col-md-6">
										<label>Invoice Number</label>  
										<input type="text" name="invoice_no" className={`form-control ${this.hasErrorFor('invoice_no') ? 'is-invalid' : ''}`} placeholder="Enter invoice number"/>	  
										{this.renderErrorFor('invoice_no')}	
									  </div>

									  <div className="form-group col-md-6">
										<label>Invoice Amount</label>  
										<input type="number" name="invoice_amount" className={`form-control ${this.hasErrorFor('invoice_amount') ? 'is-invalid' : ''}`} min="1" step="0.01" placeholder="Enter invoice amount"/>	
										{this.renderErrorFor('invoice_amount')}	
									  </div>		
									  
									  <div className="form-group col-md-6">	
										<label>Dated</label>  
										<input type="date" name="invoice_date" className={`form-control ${this.hasErrorFor('invoice_date') ? 'is-invalid' : ''}`} value={(this.state.invoice_date)?this.state.invoice_date:''} onChange={this.handleChange} placeholder="dd/mm/yy"/>    
										{this.renderErrorFor('invoice_date')}    		  
									  </div>  

									  <div className="form-group col-md-6">  
										<label>Branch/Party Address</label>    
										<input type="text" name="party_address" className={`form-control ${this.hasErrorFor('party_address') ? 'is-invalid' : ''}`} placeholder="Enter party address"/>
										{this.renderErrorFor('party_address')}    
									  </div>

									  <div className="form-group col-md-6">
										<label>Cheque/IPO/Draft Number</label>  
										<input type="text" name="cheque_no" className={`form-control ${this.hasErrorFor('cheque_no') ? 'is-invalid' : ''}`} placeholder="Enter cheque number"/>
										{this.renderErrorFor('cheque_no')}	
									  </div>			
									  
									</div> {/*********--/ form-row --*********/}  
										
									<div className="text-right btn-submit-right">
									  <input type="submit" name="save" className="btn btn-primary btn-sm mx-1" value="Save"/>		
									  <input type="submit" name="saveprint" className="btn btn-primary btn-sm mx-1" value="Save & Print"/>		
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
		  </>		
		);

	}
  
}  
export default AddIncome;    		