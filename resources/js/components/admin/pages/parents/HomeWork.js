import React, { Component } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Modal, Button } from "react-bootstrap";
import Swal from 'sweetalert2';
import Script from "@gumgum/react-script-tag";
import Copyright from "../../basic/Copyright";
import Preloader from "../../basic/Preloader";
import HeaderPart from "../../layout/HeaderPart";

const base_url=location.protocol+'//'+location.host+'/';

// Utility function for debouncing
function debounce(func, delay) {
    let debounceTimer;
    return function (...args) {
        const context = this;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
}
class HomeWork extends Component {

   constructor(props) {
  super(props)
  this.state = {
	categories: [],
	months: [],
	slots: [],
	checkarr:[],
	selectarr:[],
	chkarr:[],
	slctarr:[],
	delarr:[],
	idarr:[],
	chkbox:[],
	suggestions:[],
	modes:[],
	feeData:[],
	feePaid:[],
	feeInsert:[],
	previousData:[],
	transactionData:[],
	catarr:[],
	catsarr:[],
	montharr:[],
	receipts:[],
	calcarr:[],
	columnarr:[],
	columnfee:[],
	amountarr:[],
	alertarr:[],
	errors:[],
	selectedReceipt:'auto',
	today_date:'',
	admission_no:'',
	payment_mode:'',
	pay_type:'',
	pay_mode:'',
	student_name:'',
	student_image:'',
	class_name:'',
	father_name:'',
	mother_name:'',
	mobile_no:'',
	file_lebel:'',
	pick_up:'',
	manual_receipt:'',
	fee_pending:'',
	bank_name:'',
	branch_address:'',
	draft_no:'',
	fileMessage:'',
	message: '',
	delmessage: '',
	invmessage: '',
	class_id:'',
	course_id:'',
	section_id:'',
	total_amount:0.0,
	paid_amount:0.0,
	balance:0.0,
	showModal:false,
	isLoading:true,
	showTrasactModal:false,
	showErr:false,
	showError:false,
	showSuccess:false,
	fileError:false,
    isSpinner: false,
    isSpinner2: false,
    isSpinner3: false,
  }

   this.handleCreate = this.handleCreate.bind(this);
   this.handleSelect = this.handleSelect.bind(this);
   this.handleCheck = this.handleCheck.bind(this);
   this.handleBalance = this.handleBalance.bind(this);
   this.handleChange = this.handleChange.bind(this);
   this.handleFee = this.handleFee.bind(this);
   this.handleCategory = this.handleCategory.bind(this);
   this.handleMonth = this.handleMonth.bind(this);
   this.handleRow = this.handleRow.bind(this);
   this.checkAll = this.checkAll.bind(this);
   this.chkAll = this.chkAll.bind(this);
   this.handleReceipt = this.handleReceipt.bind(this);
   this.handleAdmission = this.handleAdmission.bind(this);
   this.handleAdmissionDebounced = debounce(this.handleAdmissionDebounced.bind(this), 500);
   this.handleAttachment = this.handleAttachment.bind(this);
   this.handlePayment = this.handlePayment.bind(this);
   this.setAdmission = this.setAdmission.bind(this);
   this.previousFee = this.previousFee.bind(this);
   this.loadFee = this.loadFee.bind(this);
   this.handleButton = this.handleButton.bind(this);
   this.handleClose = this.handleClose.bind(this);
   this.handleDelete = this.handleDelete.bind(this);
   this.handleDetail = this.handleDetail.bind(this);
   this.handlePrint = this.handlePrint.bind(this);
   this.handleInvoice = this.handleInvoice.bind(this);
   this.handleTransact = this.handleTransact.bind(this);
   this.deleteSelected = this.deleteSelected.bind(this);
   this.hasErrorFor = this.hasErrorFor.bind(this);
   this.renderErrorFor = this.renderErrorFor.bind(this);
   this.input = React.createRef();

 }
handleBalance(event){
    event.preventDefault();
	var pay_amnt = event.target.value;
	var total = (this.state.total_amount)?this.state.total_amount:0.0;
	var bal = parseFloat(total)-parseFloat(pay_amnt);
	if(bal >=0)
	{
		this.setState({ [event.target.name]: event.target.value,balance:bal });
	}
}
handleChange(event){
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });
}
handlePayment(e){
    const txt = e.target.selectedOptions[0].text;
	this.setState({ [event.target.name]: event.target.value,pay_mode:txt });
}
handleFee(event){
    event.preventDefault();
	const cat_id = event.target.id;
	const color_name = event.currentTarget.attributes['color-id'].value;
	const month_name = event.currentTarget.attributes['month-id'].value;
	const month_value = event.target.value;

	const cat_arr ={}; //
	const month_arr ={};
	const next_arr ={};

	let cellarr=this.state.columnarr;

	console.log(cellarr);

	if(cellarr.hasOwnProperty(cat_id))
	{
		for(var key in cellarr)
		{
			const month_arr = {};
			if(key==cat_id)
			{
				const month_arr = {};
				for(var ky in cellarr[key])
				{
					month_arr[ky]=cellarr[key][ky];
				}
				month_arr[month_name]=month_value;
				cat_arr[key]=month_arr;
			}
			else
			{
				const month_arr = {};
				for(var ky in cellarr[key])
				{
					month_arr[ky]=cellarr[key][ky];
				}
				cat_arr[key]=month_arr;
			}

		}

	}
	else
	{
		for(var key in cellarr)
		{
			const month_arr = {};
			for (var ky in cellarr[key])
			{
				month_arr[ky]=cellarr[key][ky];
			}
			cat_arr[key]=month_arr;
		}
		const month_arr = {};
		month_arr[month_name]=month_value;
		cat_arr[cat_id]=month_arr;
	}

	if(color_name=="text-green")
	{
		const err=[];
		err.push(event.target.name);
		// alert('Unable to change the fee now as it has been already paid');
		 this.setState({alertarr:err})

		 setTimeout(() => {
		  this.setState({
				 alertarr:[],
			   })
		},3000);
	}
	else
	{
		let feearr = [];
		let columns=this.state.columnfee;
		for(var key in columns)
		{
			feearr[key]=columns[key];
		}
		feearr[event.target.name] = event.target.value;
		this.setState({columnfee:feearr,columnarr:cat_arr});
	}
}
loadFee(e){
	e.preventDefault();
    const search = 'nick24';
	let categoryRows = this.state.categories;
	const idset=[];
	idset.push(0);

	categoryRows.length > 0 && categoryRows.map((item, i) => {
		idset.push(parseInt(item.fee_id));
	},this);

	if (search.length > 0) {
        this.setState({ isSpinner: true }, () => {
		// axios.get(`${base_url}api/feecollection/getfeedetails/${search}`).then(response => {
            axios.get(`${base_url}api/feecollection/getfeedetails/nick24`).then(response => {
				console.log(response);

                const feeArr = response.data.data.fee_arr || [];
                const colorArr = response.data.data.color_arr || [];

                if (response.data.success === true && feeArr.length === 0 && colorArr.length === 0) {
                    this.setState({ isSpinner: false });
                    alert('Create Fee Slot first and then load the student details.');
                    window.location.href = `${base_url}feeslot`;
                    return;
                }

				this.setState({
					feeData: response.data.data.fee_arr?response.data.data.fee_arr :[],
					colorData: response.data.data.color_arr?response.data.data.color_arr :[],
					feePaid: response.data.data.paid_fee?response.data.data.paid_fee :[],
					feeInsert: response.data.data.month_fee?response.data.data.month_fee :[],
					showError:false,
					showCal:true,
					catarr:idset,
                    isSpinner: false
				});
		})
		.catch(err => {
			console.log(err.response?.data);
            this.setState({
                isSpinner: false,
                feeData: [],
                colorData: [],
                feePaid: [],
                feeInsert: [],
                showError: true,
                showSuccess: false,
                message: 'Failed to load fee details. Please try again.',
                catarr: []
            });
		});
    });
      }
	//   else {
	// 		this.setState({
	// 			feeData: [],
	// 			colorData:[],
	// 			feePaid: [],
	// 			feeInsert:[],
	// 			showError:true,
	// 			showSuccess:false,
	// 			message:'Please Enter Admission Number !!',
	// 			catarr:[],
    //             isSpinner: false
	// 		});
    //   }
}
previousFee(e){
	// const search = this.state.admission_no;
	const search = 'nick24';

	if (search.length > 0)
	{
		axios.get(`${base_url}api/feecollection/getpreviousfee/${search}`).then(response => {
				this.setState({
					previousData: response.data.data.receipts?response.data.data.receipts:[],
					showModal:true,
					showError:false,
					message:'',
				});
			})
			.catch(error => {
			   console.log(error.message);
			})
	}
	// else
	// {
	// 	this.setState({showError:true,showModal:false,message:'Please Enter Admission Number !!'});
	// }


}
handleClose(e){
	this.setState({ showModal:false });
}
handleButton(e){
	this.setState({ showTrasactModal:false });
}
handleDelete(id) {

	const dels = this.state.delarr;
	const idset =[];
	let unique = [];

	for(var key in dels)
	{
		if(dels[key] !== null)
		{
			if(dels[key].name=='receipt' && dels[key].checked === true && dels[key].value==id)
			{
				idset.push(parseInt(dels[key].value));
			}
		}
	}
	for(var i=0; i < idset.length; i++){
		if(unique.indexOf(idset[i]) === -1) {
			unique.push(idset[i]);
		}
	}
	if(unique.length==0)
	{
		this.setState({showErr:true,delmessage:'Please select some receipt !!'});
	}
	else
	{
		// console.log(unique);
		var list=unique.toString();

		Swal.fire({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}).then((result) => {
		if (result.value) {
			axios.delete(`${base_url}api`+`/feecollection/delete/${list}`)
			  .then((response) => {
				console.log(response);
				if(response.data.status=='successed')
				{
					Swal.fire({
						icon:"success",
						text:response.data.message
					});

					const search = this.state.admission_no;
					axios.get(`${base_url}api/feecollection/getpreviousfee/${search}`).then(response => {
					this.setState({
							previousData: response.data.data.receipts?response.data.data.receipts:[],
							delarr:[]
						});
					})
					.catch(error => {
					   console.log(error.message);
					})

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

			}
		});
		this.setState({showErr:false,delmessage:''});
	}

}
handlePrint = (event,param) => {
	const type = event.currentTarget.id;
	axios.get(`${base_url}api/feecollection/printreceipt/${param}/${type}`).then(response => {
		if (response.data.status === 'successed')
		{
			 var receipt =(typeof(response.data.data)!='object')?response.data.data:'';
			 if(receipt !='')
			 {
				let a = document.createElement("a");
				let url = base_url+'receipts/'+type+'/'+receipt;
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

handleInvoice(event) {
	event.preventDefault();
	const transactionArr=this.state.transactionData;
	const arr = [];

	transactionArr.forEach((value,key) => {
		arr.push(value.FeeTransId);
	});

	if(arr.length>0)
	{
		/*
		*/

		const list=arr.toString();

		axios.get(`${base_url}api/feecollection/getinvoice/${list}`).then(response => {

			if (response.data.status === 'successed')
			{
				this.setState({showErr:false,invmessage:''});
				const invWindow="";
				/* document.body.innerHTML=response.data.data;
				var originalContents = document.body.innerHTML; */
				// const invhtml=<div dangerouslySetInnerHTML={{__html:response.data.data}}/>;
				// console.log(originalContents);
				/* invWindow=window.open('','','width=200,height=100');
				invWindow.document.write("<p>This is 'myWindow'</p>");
				invWindow.focus();
				invWindow.print();	 */
				/* invWindow=window.open('','','width=200,height=100');
				invWindow.document.write(originalContents);
				invWindow.focus();
				invWindow.print();   */

				let newWin = window.open("about:blank", "Axios data", "width=400,height=400");
				// newWin.document.write("<p>This is 'myWindow'</p>");
				newWin.document.write(response.data.data);
				newWin.focus();
				newWin.print();
				//newWin.close();

			}
			else
			{
				this.setState({showErr:true,invmessage:response.data.message});
			}
		})
		.catch(err => {
		   // console.log(error.message);
		   console.log(err.response.data);
		})
	}
	else
	{
		this.setState({showErr:true,invmessage:'no record found!!'});
	}

}

handleDetail(event) {

	const dels = this.state.delarr;
	const idset =[];
	let unique = [];

	for(var key in dels)
	{
		if(dels[key] !== null)
		{
			if(dels[key].name=='receipt' && dels[key].checked === true && dels[key].value !=0)
			{
				idset.push(parseInt(dels[key].value));
			}
		}
	}

	for(var i=0; i < idset.length; i++){
		if(unique.indexOf(idset[i]) === -1) {
			unique.push(idset[i]);
		}
	}

	if(unique.length==0)
	{
		this.setState({showErr:true,delmessage:'Please select some receipt !!',showTrasactModal:false});
	}
	else
	{
		var list=unique.toString();
		this.setState({showErr:false,delmessage:''});
		axios.get(`${base_url}api/feecollection/getfeetransaction/${list}`).then(response => {
		this.setState({
				transactionData:response.data.data.transactions?response.data.data.transactions:[],
				showModal:false,
				showTrasactModal:true,
				delarr:[]
			});
		})
		.catch(error => {
		   console.log(error.message);
		})
	}

}
handleAttachment(e){
    e.preventDefault();
	const validImageTypes = ['image/jpeg','image/png'];

	if (e.target.files && e.target.files.length > 0)
	{
		const file_type = e.target.files[0].type;
		const file_name = e.target.files[0].name;

		if (validImageTypes.includes(file_type))
		{
			this.setState({[event.target.name]:event.target.files[0],file_lebel:file_name,fileError:false,fileMessage:"" });
		}
		else {
			this.setState({fileError:true,fileMessage:"only jpeg or png images accepted"});
		}
    }

}


handleAdmission(event){
    event.preventDefault();
    const { name, value } = event.target;
    this.setState({ [name]: value }, () => {
        this.handleAdmissionDebounced(value);
    });
}
handleAdmissionDebounced(search) {
    if (search.length > 0) {
        // Make API call
        axios.get(`${base_url}api/studentmaster/getsuggestion/${search}`)
            .then(response => {
                console.log(response.data);

                // Only show the message if there is no data
                if (response.data.success === false) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.data.message
                    }).then(() => {
                        this.setState({ admission_no: '' }); // Clear input field
                        if (this.inputRef.current) {
                            this.inputRef.current.focus();
                        }
                    });
                }

                this.setState({
                    suggestions: response.data.data ? response.data.data : [],
                    feeData: [],
                });
            })
            .catch(error => {
                console.log(error.message);
            });
    } else {
        this.setState({
            suggestions: []
        });
    }
}

setAdmission(event){
	event.preventDefault();
	const admission_no = event.target.id;
	const s_name = event.currentTarget.attributes['data-s'].value;
	const s_image = event.currentTarget.attributes['data-i'].value;
	const c_name = event.currentTarget.attributes['data-c'].value;
	const f_name = event.currentTarget.attributes['data-f'].value;
	const m_name = event.currentTarget.attributes['data-m'].value;
	const s_cell = event.currentTarget.attributes['data-mo'].value;
	const s_class = event.currentTarget.attributes['data-cl'].value;
	const s_course = event.currentTarget.attributes['data-co'].value;
	const s_section = event.currentTarget.attributes['data-se'].value;
	const p_name = (event.currentTarget.attributes['data-p'])?event.currentTarget.attributes['data-p'].value:'N/A';

	this.setState({
	  admission_no:admission_no,
	  student_name:s_name,
	  student_image:s_image,
	  class_name:c_name,
	  father_name:f_name,
	  mother_name:m_name,
	  mobile_no:s_cell,
	  pick_up:p_name,
	  class_id:s_class,
	  course_id:s_course,
	  section_id:s_section,
	  suggestions: []
	});
}
handleReceipt(event) {
	this.setState({ selectedReceipt : event.target.value });
}
handleRow = (event,arg) => {

	event.preventDefault();
	let colarr=[];
	let calcs=this.state.calcarr;

	if(calcs.includes(arg))
	{
		for(var key in calcs)
		{
			if(calcs[key] !== arg)
			{
				colarr.push(calcs[key]);
			}
		}
	}
	else
	{
		for(var key in calcs)
		{
			if(calcs[key] !== arg)
			{
				colarr.push(calcs[key]);
			}
		}

		colarr.push(arg);
	}

	this.setState({calcarr:colarr});
}
handleCategory(event) {

	let opt = event.target.name;
	let check = event.target.checked;
    let check_val = event.target.value;

	let categoryRows = this.state.categories;
	let monthRows = this.state.months;
	let feeArr = this.state.feeData;

	let paidArr = this.state.feePaid;
	let currentArr = this.state.feeInsert;
	let newArr = this.state.columnarr;

	let catArr=this.state.catarr;
	let monthArr=this.state.montharr;
	var sum =this.state.total_amount;
	var f_sum = 0.0;

	const idset =[];
	const sumArr =[];
	let unique = [];

	if(check)
	{
		categoryRows.forEach((value, key) => {
			for (const ky in monthRows)
			{
				if(newArr.hasOwnProperty(value.fee_id))
				{
					if(newArr[value.fee_id].hasOwnProperty(monthRows[ky]))
					{
						if((value.fee_id==check_val) && monthArr.includes(ky))
						{
							 var amnt = parseFloat(newArr[value.fee_id][monthRows[ky]]);
							 sumArr.push(amnt);
						}
					}
				}
				else if (feeArr.hasOwnProperty(value.fee_id))
				{
					if(feeArr[value.fee_id].hasOwnProperty(monthRows[ky]))
					{
						if((value.fee_id==check_val) && monthArr.includes(ky))
						{
							 var amnt = parseFloat(feeArr[value.fee_id][monthRows[ky]]);
							 /* var amnt2 = (paidArr[value.fee_id][monthRows[ky]]==null)?0:parseFloat(paidArr[value.fee_id][monthRows[ky]]);

							 var amnt3 = (currentArr[value.fee_id][monthRows[ky]]==null)?0:parseFloat(currentArr[value.fee_id][monthRows[ky]]);

							 var amnt1 = (amnt3>0)?amnt3:amnt; */

							 sumArr.push(amnt);

						}
					}
				}
				else
				{
					sumArr.push(0);
				}

				/* feeArr.forEach((vl, ke) => {
				   if((value.fee_id==vl.cat_id) && (vl.FeeDueMonths.split(',').indexOf(monthRows[ky])>-1)  && monthArr.includes(ky) && (value.fee_id == check_val))
				  {
					  var amnt =parseFloat(vl.amount).toFixed(2);
					  sumArr.push(amnt);
				  }

				});		 */

			}

		});

		var total = 0;
		for (var i in sumArr) {
		  total += parseFloat(sumArr[i]);
		}

		f_sum = parseFloat(sum)+parseFloat(total);

	}
	else
	{
		categoryRows.forEach((value, key) => {
			for (const ky in monthRows) {

				if(newArr.hasOwnProperty(value.fee_id))
				{
					if(newArr[value.fee_id].hasOwnProperty(monthRows[ky]))
					{
						if((value.fee_id==check_val) && monthArr.includes(ky))
						{
							 var amnt = parseFloat(newArr[value.fee_id][monthRows[ky]]);
							 sumArr.push(amnt);
						}
					}
				}
				else if (feeArr.hasOwnProperty(value.fee_id))
				{
					if(feeArr[value.fee_id].hasOwnProperty(monthRows[ky]))
					{
						if((value.fee_id==check_val) && catArr.includes(value.fee_id) && monthArr.includes(ky))
						{
							  var amnt = parseFloat(feeArr[value.fee_id][monthRows[ky]]);
							  /* var amnt2 = (paidArr[value.fee_id][monthRows[ky]]==null)?0:parseFloat(paidArr[value.fee_id][monthRows[ky]]);

							  var amnt3 = (currentArr[value.fee_id][monthRows[ky]]==null)?0:parseFloat(currentArr[value.fee_id][monthRows[ky]]);

							  var amnt1 = (amnt3>0)?amnt3:amnt;   */

							  sumArr.push(amnt);
						}
					}
				}
				else
				{
					sumArr.push(0);
				}
				/* feeArr.forEach((vl, ke) => {
				   if((value.fee_id==vl.cat_id) && (vl.FeeDueMonths.split(',').indexOf(monthRows[ky])>-1) && catArr.includes(value.fee_id) && monthArr.includes(ky) && (value.fee_id ==check_val))
				  {
					  var amnt =parseFloat(vl.amount).toFixed(2);
					  sumArr.push(amnt);
				  }

				});		 */

			}

		});

		var total = 0;
		for (var i in sumArr) {
		  total += parseFloat(sumArr[i]);
		}

		f_sum = parseFloat(sum)-parseFloat(total);

	}

	if(check)
	{
		for (var key in catArr)
		{
			if(catArr[key] !=0)
			{
				idset.push(catArr[key]);
			}
		}
		idset.push(parseInt(check_val));
	}
	else
	{
		for (var key in catArr)
		{
			if(catArr[key] !=check_val && catArr[key] !=0)
			{
				idset.push(catArr[key]);
			}

		}
	}

	for(var i=0; i < idset.length; i++){
		if(unique.indexOf(idset[i]) === -1) {
			unique.push(idset[i]);
		}
	}

	this.setState({ catarr:unique,total_amount:f_sum,paid_amount:f_sum });
}
handleTransact(event) {
	let opt = event.target.name;
	let check = event.target.checked;
    let check_val = event.target.value;
	let checks=this.state.delarr;

	const idset =[];
	let unique = [];

	var chk1=0;
	var chk2=0;

	if(check)
	{
		for(var key in checks)
		{
			if(checks[key] !== null)
			{
				if(checks[key].name=='receipt')
				{
					chk1++;
				}
				if(checks[key].checked === true) {
					chk2++;
					idset.push(parseInt(checks[key].value));
				}
			}
		}
		idset.push(parseInt(check_val));
		if(chk2==(chk1-1))
		{
			idset.push(0);
		}
	}
	else
	{
		for (var key in checks)
		{
			if(checks[key] !=null)
			{
				if((checks[key].checked === true) && (checks[key].value !=check_val) && (checks[key].value !=0))
				{
					idset.push(parseInt(checks[key].value));
				}
			}

		}
	}

	for(var i=0; i < idset.length; i++){
		if(unique.indexOf(idset[i]) === -1) {
			unique.push(idset[i]);
		}
	}

	this.setState({delarr:unique});

}
deleteSelected(event) {
	const dels = this.state.delarr;
	const idset =[];
	let unique = [];
	for(var key in dels)
	{
		if(dels[key] !== null)
		{
			if(dels[key].name=='receipt' && dels[key].checked === true && dels[key].value!=0)
			{
				idset.push(parseInt(dels[key].value));
			}
		}
	}

	for(var i=0; i < idset.length; i++){
		if(unique.indexOf(idset[i]) === -1) {
			unique.push(idset[i]);
		}
	}

	if(unique.length==0)
	{
		this.setState({showErr:true,delmessage:'Please select some receipt !!'});
	}
	else
	{
		this.setState({showErr:false,delmessage:''});
		var list=unique.toString();

		Swal.fire({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}).then((result) => {
		if (result.value) {
			axios.delete(`${base_url}api`+`/feecollection/delete/${list}`)
			  .then((response) => {

				if(response.data.status=='successed')
				{
					Swal.fire({
						icon:"success",
						text:response.data.message
					});
					const search = this.state.admission_no;
					axios.get(`${base_url}api/feecollection/getpreviousfee/${search}`).then(response => {
					this.setState({
							previousData: response.data.data.receipts?response.data.data.receipts:[],
							delarr:[]
						});
					})
					.catch(error => {
					   console.log(error.message);
					})
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

			}
		});
	}
}
handleMonth(event) {

	let opt = event.target.name;
	let check = event.target.checked;
    let check_val = event.target.value;

	let checks=this.state.montharr;
	let categoryRows = this.state.categories;
	let monthRows = this.state.months;
	let feeArr = this.state.feeData;
	let paidArr = this.state.feePaid;
    let currentArr = this.state.feeInsert;
	let catArr = this.state.catarr;
	let newArr = this.state.columnarr;

	var sum =this.state.total_amount;
	var f_sum = 0.0;

	const idset =[];
	const sumArr =[];
	let unique = [];

	if(check)
	{
		categoryRows.forEach((value, key) => {

			for (const ky in monthRows) {

				if(newArr.hasOwnProperty(value.fee_id))
				{
					if(newArr[value.fee_id].hasOwnProperty(monthRows[ky]))
					{
						if((ky==check_val) && catArr.includes(value.fee_id))
						{
							 var amnt = parseFloat(newArr[value.fee_id][monthRows[ky]]);
							 sumArr.push(amnt);
						}

					}
				}
				else if (feeArr.hasOwnProperty(value.fee_id))
				{
					if(feeArr[value.fee_id].hasOwnProperty(monthRows[ky]))
					{
						if((ky==check_val) && catArr.includes(value.fee_id))
						{
							 var amnt = parseFloat(feeArr[value.fee_id][monthRows[ky]]);
							/*  var amnt2 = (paidArr[value.fee_id][monthRows[ky]]==null)?0:parseFloat(paidArr[value.fee_id][monthRows[ky]]);

							 var amnt3 = (currentArr[value.fee_id][monthRows[ky]]==null)?0:parseFloat(currentArr[value.fee_id][monthRows[ky]]);

							 var amnt1 = (amnt3>0)?amnt3:amnt;   */

							 sumArr.push(amnt);

						}
					}
				}
				else
				{
					sumArr.push(0);
				}

				/* feeArr.forEach((vl, ke) => {
				   if((value.fee_id==vl.cat_id) && (vl.FeeDueMonths.split(',').indexOf(monthRows[ky])>-1) && (ky==check_val) && catArr.includes(value.fee_id))
				  {
					  var amnt =parseFloat(vl.amount).toFixed(2);
					  sumArr.push(amnt);
				  }

				});
				*/

			}

		});

		var total = 0;
		for (var i in sumArr) {
		  total += parseFloat(sumArr[i]);
		}

		f_sum = total+parseFloat(sum);


	}
	else
	{
		categoryRows.forEach((value, key) => {

			for (const ky in monthRows) {

				if(newArr.hasOwnProperty(value.fee_id))
				{
					// console.log(newArr[value.fee_id]);
					if(newArr[value.fee_id].hasOwnProperty(monthRows[ky]))
					{
						// console.log();
						if((ky==check_val) && catArr.includes(value.fee_id))
						{
							 var amnt = parseFloat(newArr[value.fee_id][monthRows[ky]]);
							 sumArr.push(amnt);
						}

					}
				}
				else if (feeArr.hasOwnProperty(value.fee_id))
				{
					if(feeArr[value.fee_id].hasOwnProperty(monthRows[ky]))
					{
						if((ky==check_val) && catArr.includes(value.fee_id))
						{
							 var amnt = parseFloat(feeArr[value.fee_id][monthRows[ky]]);
							/*  var amnt2 = (paidArr[value.fee_id][monthRows[ky]]==null)?0:parseFloat(paidArr[value.fee_id][monthRows[ky]]);

							 var amnt3 = (currentArr[value.fee_id][monthRows[ky]]==null)?0:parseFloat(currentArr[value.fee_id][monthRows[ky]]);

							 var amnt1 = (amnt3>0)?amnt3:amnt;    */
							 sumArr.push(amnt);

						}
					}
				}
				else
				{
					sumArr.push(0);
				}

				/* feeArr.forEach((vl, ke) => {
				   if((value.fee_id==vl.cat_id) && (vl.FeeDueMonths.split(',').indexOf(monthRows[ky])>-1) && (ky==check_val) && catArr.includes(value.fee_id))
				  {
					  var amnt =parseFloat(vl.amount).toFixed(2);
					  sumArr.push(amnt);
				  }

				});	 */

			}

		});

		var total = 0;
		for (var i in sumArr) {
		  total += parseFloat(sumArr[i]);
		}

		f_sum = parseFloat(sum)-parseFloat(total);

	}

	if(check)
	{
		for (var key in checks)
		{
			idset.push(checks[key]);
		}
		idset.push(check_val);
	}
	else
	{
		for (var key in checks)
		{
			if(checks[key] !=check_val)
			{
				idset.push(checks[key]);
			}

		}
	}

	for(var i=0; i < idset.length; i++){
		if(unique.indexOf(idset[i]) === -1) {
			unique.push(idset[i]);
		}
	}

	this.setState({ montharr:unique,total_amount:f_sum,paid_amount:f_sum });

 }
checkAll(event) {

	let opt = event.target.name;
	let check = event.target.checked;
    let check_val = event.target.value;

	let allchecks=this.state.catsarr;

	const idset =[];
	let unique = [];

	if(check)
	{
		for(var key in allchecks) {
			if(allchecks[key] !== null)
			{
				idset.push(parseInt(allchecks[key].value));
			}
		}
	}

	for(var i=0; i < idset.length; i++){
		if(unique.indexOf(idset[i]) === -1) {
			unique.push(idset[i]);
		}
	}

	this.setState({ catarr:unique });
}

chkAll(event) {

	let opt = event.target.name;
	let check = event.target.checked;
    let check_val = event.target.value;
	let allchecks=this.state.delarr;

	const idset =[];
	let unique = [];

	if(check)
	{
		for(var key in allchecks) {
			if(allchecks[key] !== null)
			{
				idset.push(parseInt(allchecks[key].value));
			}
		}
	}

	for(var i=0; i < idset.length; i++){
		if(unique.indexOf(idset[i]) === -1) {
			unique.push(idset[i]);
		}
	}

	this.setState({ delarr:unique });
}
 handleSelect = (event) => {

	let opt = event.target.name;
    let select_val = event.target.value;
	let selections=this.state.selectarr;

	const array =opt.split("_");
	let chk_id =array[1];
	let lvl = '';
	const check_arr=[];

	let checks=this.state.idarr;
	let allchecks=this.state.chkarr;

	var count=0;
	let unique = [];

	if(select_val=='monthly')
	{
		for(var key in checks)
		{
			lvl=checks[key];
			const array =lvl.split("_");
			let key_id =array[1];
			if(key_id==chk_id)
			{
				for(var key in allchecks) {
					if(allchecks[key] !== null)
					{
						let level = allchecks[key].id;
						const level_arr =level.split("_");
						let level_id =level_arr[1];
						if(level_id==chk_id)
						{
							check_arr.push(level);
						}
					}
				}

			}
			else
			{
				check_arr.push(checks[key]);
			}
		}

	}
	else if(select_val=='yearly')
	{
		for(var key in checks)
		{
			lvl=checks[key];
			const array =lvl.split("_");
			let key_id =array[1];

			if(key_id==chk_id)
			{
				for(var key in allchecks) {
					if(allchecks[key] !== null)
					{
						let level = allchecks[key].id;
						const level_arr =level.split("_");
						let level_id =level_arr[1];
						if(level_id==chk_id)
						{
							if(count<1)
							{
								check_arr.push(level);
							}
							count++;
						}
					}
				}

			}
			else
			{
				check_arr.push(checks[key]);
			}
		}
		//
	}
	else if(select_val=='others')
	{
		for(var key in checks)
		{
			lvl=checks[key];
			const array =lvl.split("_");
			let key_id =array[1];

			if(key_id !=chk_id)
			{
				check_arr.push(checks[key]);
			}

		}
	}
	else
	{
		for(var key in checks)
		{
			check_arr.push(checks[key]);
		}
	}

	for(var i=0; i < check_arr.length; i++){
		if(unique.indexOf(check_arr[i]) === -1) {
			unique.push(check_arr[i]);
		}
	}

	this.setState({ idarr:unique });
 }
 handleCheck = (event) => {

	let opt = event.target.name;
	let check = event.target.checked;
    let check_val = event.target.value;
	let check_id = event.target.id;

	let checks=this.state.idarr;

	const idset =[];
	let unique = [];

	if(check)
	{
		for (var key in checks)
		{
			idset.push(checks[key]);
		}
		idset.push(check_id);
	}
	else
	{
		for (var key in checks)
		{
			if(checks[key] !=check_id)
			{
				idset.push(checks[key]);
			}

		}
	}

	for(var i=0; i < idset.length; i++){
		if(unique.indexOf(idset[i]) === -1) {
			unique.push(idset[i]);
		}
	}

	this.setState({ idarr:unique });

 }
handleCreate (event) {
    event.preventDefault();
	const {admission_no,today_date,receipt_type,manual_receipt,total_amount,paid_amount,payment_mode,bank_name,branch_address,draft_no} = event.target;

	const buttonType=window.event.submitter.name;

	let categoryRows = this.state.categories;
	let monthRows = this.state.months;
	let feeArr = this.state.feeData;
	let paidArr = this.state.feePaid;
	let currentArr = this.state.feeInsert;
	let catArr=this.state.catarr;
	let monthArr=this.state.montharr;
	let newArr = this.state.columnarr;

	const cat_arr1 ={};
	const cat_arr2 ={};
	const set_arr1 ={};
	const set_arr2 ={};
	const s_class=this.state.class_id;
	const s_course=this.state.course_id;
	const s_section=this.state.section_id;

	categoryRows.forEach((value, key) => {
		for (const ky in monthRows) {

			if(newArr.hasOwnProperty(value.fee_id))
			{
				// console.log(newArr[value.fee_id]);
				if(newArr[value.fee_id].hasOwnProperty(monthRows[ky]))
				{

					if(catArr.includes(value.fee_id) && monthArr.includes(ky))
					{

						if(set_arr1.hasOwnProperty(ky))
						{
							const lvl=set_arr1[ky];
							let txt = value.fee_id+','+lvl;
							const array = txt.split(",");
							let unique = [];
							for(var i=0; i < array.length; i++){
								if(unique.indexOf(array[i]) === -1) {
									unique.push(array[i]);
								}
							}
							set_arr1[ky] = unique.toString();
						}
						else
						{
							set_arr1[ky] = value.fee_id;
						}

						if(cat_arr1.hasOwnProperty(value.fee_id))
						{
							const lvl=cat_arr1[value.fee_id];
							let txt = ky+','+lvl;
							const array = txt.split(",");
							let unique = [];
							for(var i=0; i < array.length; i++){
								if(unique.indexOf(array[i]) === -1) {
									unique.push(array[i]);
								}
							}
							cat_arr1[value.fee_id] = unique.toString();
						}
						else
						{
							cat_arr1[value.fee_id] = ky;
						}

						/* var amnt4 = parseFloat(newArr[value.fee_id][monthRows[ky]]);
						var amnt2 = (paidArr[value.fee_id][monthRows[ky]]==null)?0:parseFloat(paidArr[value.fee_id][monthRows[ky]]);

						var amnt3 = (currentArr[value.fee_id][monthRows[ky]]==null)?0:parseFloat(currentArr[value.fee_id][monthRows[ky]]);
						var amnt1 = (amnt3>0)?amnt3:amnt4;

						var amnt = amnt1-amnt2;	 */

						var amnt = parseFloat(newArr[value.fee_id][monthRows[ky]]);


						if(cat_arr2.hasOwnProperty(value.fee_id))
						{
							const lbl=cat_arr2[value.fee_id];
							let txt2 = amnt+','+lbl;
							const array2 = txt2.split(",");
							cat_arr2[value.fee_id]=array2.toString();
						}
						else
						{
							cat_arr2[value.fee_id]=amnt;
						}

						if(set_arr2.hasOwnProperty(ky))
						{
							const lbl=set_arr2[ky];
							let txt2 = amnt+','+lbl;
							const array2 = txt2.split(",");
							set_arr2[ky]=array2.toString();
						}
						else
						{
							set_arr2[ky]=amnt;
						}

					}

				}
			}
			else if (feeArr.hasOwnProperty(value.fee_id))
			{
				if(feeArr[value.fee_id].hasOwnProperty(monthRows[ky]))
				{
					if(catArr.includes(value.fee_id) && monthArr.includes(ky))
					{
						if(set_arr1.hasOwnProperty(ky))
						{
							const lvl=set_arr1[ky];
							let txt = value.fee_id+','+lvl;
							const array = txt.split(",");
							let unique = [];
							for(var i=0; i < array.length; i++){
								if(unique.indexOf(array[i]) === -1) {
									unique.push(array[i]);
								}
							}
							set_arr1[ky] = unique.toString();
						}
						else
						{
							set_arr1[ky] = value.fee_id;
						}

						/* if(cat_arr1.hasOwnProperty(value.fee_id))
						{
							const lvl=cat_arr1[value.fee_id];
							let txt = ky+','+lvl;
							const array = txt.split(",");
							let unique = [];
							for(var i=0; i < array.length; i++){
								if(unique.indexOf(array[i]) === -1) {
									unique.push(array[i]);
								}
							}
							cat_arr1[value.fee_id] = unique.toString();
						}
						else
						{
							cat_arr1[value.fee_id] = ky;
						}    */

						 var amnt4 = parseFloat(feeArr[value.fee_id][monthRows[ky]]);
						 /* var amnt2 = (paidArr[value.fee_id][monthRows[ky]]==null)?0:parseFloat(paidArr[value.fee_id][monthRows[ky]]);

						 var amnt3 = (currentArr[value.fee_id][monthRows[ky]]==null)?0:parseFloat(currentArr[value.fee_id][monthRows[ky]]);

						 var amnt1 = (amnt3>0)?amnt3:amnt4;
						 var amnt = amnt1-amnt2;  */

						/* if(cat_arr2.hasOwnProperty(value.fee_id))
						{
							const lbl=cat_arr2[value.fee_id];
							let txt2 = amnt4+','+lbl;
							const array2 = txt2.split(",");
							cat_arr2[value.fee_id]=array2.toString();
						}
						else
						{
							cat_arr2[value.fee_id]=amnt4;
						}	 */

						if(set_arr2.hasOwnProperty(ky))
						{
							const lbl=set_arr2[ky];
							let txt2 = amnt4+','+lbl;
							const array2 = txt2.split(",");
							set_arr2[ky]=array2.toString();
						}
						else
						{
							set_arr2[ky]=amnt4;
						}

					}
				}
			}
			else {
					set_arr1 ={};
					set_arr2 ={};
			}

		}

	});

		let admission_number=(admission_no)?admission_no.value:'';
		let transc_date=(today_date)?today_date.value:'';
		let transc_receipt=(receipt_type)?receipt_type.value:'';
		let transc_no=(manual_receipt)?manual_receipt.value:'';
		let transc_total=(total_amount)?total_amount.value:'';
		let transc_paid=(paid_amount)?paid_amount.value:'';
		let transc_mode=(payment_mode)?payment_mode.value:'';
		let transc_bank=(bank_name)?bank_name.value:'';
		let transc_branch=(branch_address)?branch_address.value:'';
		let transc_draft=(draft_no)?draft_no.value:'';

		let fd = new FormData()

		fd.append("admission_no",admission_number);
		fd.append("class_id",s_class);
		fd.append("course_id",s_course);
		fd.append("section_id",s_section);
		fd.append("fee_date",transc_date);
		fd.append("receipt_type",transc_receipt);
		fd.append("receipt_no",transc_no);
		fd.append("fee_amount",transc_total);
		fd.append("pay_amount",transc_paid);
		fd.append("pay_mode",transc_mode);
		fd.append("bank_name",transc_bank);
		fd.append("branch_address",transc_branch);
		fd.append("draft_cheque",transc_draft);
		fd.append("attachment",this.state.attachment);
		fd.append("slots",JSON.stringify(set_arr1));
		fd.append("amnts",JSON.stringify(set_arr2));
		fd.append("button_type",buttonType);

        if (buttonType === "saveonly") {
            this.setState({ isSpinner2: true });
        } else if (buttonType === "printsave") {
            this.setState({ isSpinner3: true });
        }

		axios.post(`${base_url}api`+'/feecollection/create',fd)
		.then(response => {
			console.log(response);
			if (response.data.status === 'successed')
			{
				 var receipt =(typeof(response.data.data)!='object')?response.data.data:'';
				 if(receipt !='')
				 {
					let a = document.createElement("a");
					let url = base_url+'receipts/'+receipt;
					a.target='_blank';
					a.href = url;
					document.body.appendChild(a);
					a.click();
					document.body.removeChild(a);
				 }
				this.setState({showError:false,showSuccess:true,montharr:[],total_amount:0.0,paid_amount:0.0,balance:0.0,message:response.data.message,errors:response.data.errors,isSpinner2: false,isSpinner3: false });
				this.chartData();

			}
			else
			{
			    this.setState({showError:true,showSuccess:false,message:response.data.message,errors:response.data.errors,isSpinner2: false, isSpinner3: false});
			}
		})
		.catch(error => {
		   //console.log(error.message);
		    console.log(error.response.data);
            this.setState({
                isSpinner: false, isSpinner3: false
            });
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
	this.getData();
}
getData(){

    axios.get(`${base_url}api`+'/feecollection/index').then((response) => {
		console.log(response);
        if (response.status === 200)
		{
			const categoryRows = response.data.data.categories?response.data.data.categories:[];
			const monthRows = response.data.data.months?response.data.data.months:[];
			const slotRows = response.data.data.slots?response.data.data.slots:[];
			const idset =[];
			let check_arr = [];

			for(var key in categoryRows)
			{
				var index=0;
				if(slotRows.hasOwnProperty(key))
				{
					for(var ky in monthRows)
					{
						var str = monthRows[ky];
						/* console.log('s='+str);
						str = str.replace(/ +/g, ""); */

						if((slotRows[key]['FeeCatId']==categoryRows[key].fee_id)&&(slotRows[key]['FeeDueMonths'].indexOf(str) != -1))
						{
							idset.push('month_'+categoryRows[key].fee_id+'_'+index);
						}
						index++;
					}

				}
			}

			for(var i=0; i < idset.length; i++){
				if(check_arr.indexOf(idset[i]) === -1) {
					check_arr.push(idset[i]);
				}
			}

			this.setState({
				categories: response.data.data.categories?response.data.data.categories:[],
				months: response.data.data.months?response.data.data.months:[],
				receipts: response.data.data.receipts?response.data.data.receipts:[],
				modes: response.data.data.modes?response.data.data.modes:[],
				slots: response.data.data.slots?response.data.data.slots:[],
				idarr: check_arr
			});
        }
        else {
			this.setState({
				categories: [],
				receipts: [],
				months: [],
				slots: []
			});
        }
    });
}

chartData(){
	let categoryRows = this.state.categories;
	const search = this.state.admission_no;
	const idset=[];
	idset.push(0);

	categoryRows.length > 0 && categoryRows.map((item, i) => {
		idset.push(parseInt(item.fee_id));
	},this);

    axios.get(`${base_url}api`+`/feecollection/getfeedetails/${search}`).then(response => {
	this.setState({
			feeData: response.data.data.fee_arr?response.data.data.fee_arr :[],
			colorData: response.data.data.color_arr?response.data.data.color_arr :[],
			feePaid: response.data.data.paid_fee?response.data.data.paid_fee :[],
			feeInsert: response.data.data.month_fee?response.data.data.month_fee :[],
			showError:false,
			showCal:true,
			catarr:idset
		});
	})
	.catch(err => {
		 console.log(err.response.data);
	})

}
render() {

const isLoad = this.state.isLoading;

if (isLoad) {

//return null;

}

    let categoryRows = this.state.categories;
	const monthRows = this.state.months;
	const slotRows = this.state.slots;
	const feeArr = this.state.feeData;
	const colorArr = this.state.colorData;
	const paidArr = this.state.feePaid;
	const currentArr = this.state.feeInsert;
	const previousArr = this.state.previousData;
	const transactionArr = this.state.transactionData;
	const receiptArr = this.state.receipts;

	var showCount = 0;

	for (const key in feeArr) {
		showCount++;
	}

	const modeArr = (this.state.modes.length>0)?this.state.modes:[];

	const modeList = modeArr.map((item, index) => {
		  return (
				<option key={index} value={item.id}>{item.pay_mode}</option>
		  );
	});

	var pay_opt=0;

	modeArr.forEach(function(item, key)
	{
		if(item.pay_type=='cash')
		{
			pay_opt=item.id;
		}
	});

	const idset =[];
	let check_arr = [];

	let monthList = Object.keys(monthRows).map(k => (
	  <th key={k} scope="col"><div className="form-checkbox"><input type="checkbox" className="form-check-input" value={k} checked={(this.state.montharr.includes(k))?true:false} onChange={this.handleMonth}/></div><span>{monthRows[k]}</span>
	  </th>
	));

	const date = new Date();

	var day = ('0' + date.getDate()).slice(-2);
	var month = ('0' + (date.getMonth() + 1)).slice(-2);
	var year = date.getFullYear();

    var current_date = year + '-' + month + '-' + day;

	const style = {
	  textTransform: "capitalize",
	};

	const style1 = {
      position: "absolute",
      border: "1px solid #d4d4d4",
      zIndex: "99",
    };

	const style2 = {
      padding: "10px",
      cursor: "pointer",
	  color:"#000",
	  fontFamily: "New Times Roman",
	  fontSize:"15px",
      backgroundColor: "#fff",
	  borderBottom: "1px solid #d4d4d4",
	  width:"325px",
    };

    return (

	  <div>


        <Preloader />

        <div id="main-wrapper">

        <HeaderPart />

        <div className="content-body">
            <div className="container-fluid">
                <div className="row page-titles mx-0">
                    <div className="col-sm-6 p-md-0">
                        <div className="welcome-text">
                            <h4>Home Work</h4>
                        </div>
                    </div>
                </div>


                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body create-user-table">
							<form onSubmit={this.handleCreate}>
                              <div className="fee-collection">
								<div className="text-center">
									{this.state.showError ?
									 <div className="alert alert-danger" style={{color:"brown"}}>
										<strong>{this.state.message}</strong>
									  </div>
									 : null}
									{this.state.showSuccess ?
									 <div className="alert alert-success" style={{color:"green"}}>
										{this.state.message}
									  </div>
									 : null}
								</div>

								<div className="basic-form form-own">
									<div className="form-row">
									  <div className="col-md-12 left">
									    <div className="form-row">
										  <div className="form-group col-sm-12">
										    <label> Select one of the Child to see the Home Work*</label>
											<input type="radio" className={`${this.hasErrorFor('admission_no') ? 'is-invalid' : ''}`} name="admission_no" value={(this.state.admission_no)?this.state.admission_no:''} onChange={this.handleAdmission} ref={this.input}/>
											{this.renderErrorFor('admission_no')} <span>nick24-Nikhil Sharma</span>
									      </div>
                                          <div className="form-group col-sm-6">
										    <label>Date</label>
										    <input type="date" className="form-control input-daterange-timepicker" name="today_date" value={(this.state.today_date)?this.state.today_date:current_date} onChange={this.handleChange} ref={this.input}/>
											{this.renderErrorFor('today_date')}
										  </div>
                                          <div className="form-group col-sm-2"></div>
										  <div className="form-group col-sm-4">
                                            <label>&nbsp;</label>
                                            <button type="button" className="btn btn-primary load-fee" onClick={this.loadFee} disabled={this.state.isSpinner}>Load Homework <span className="kt-spinner kt-spinner--sm kt-spinner--right kt-spinner--light" style={{ display: this.state.isSpinner ? 'inline' : 'none' }}></span></button>
										  </div>
                                            {
											    (showCount>0)?(
                                                    <div className="table-responsive form-group col-sm-12">
									                    <table className="table table-bordered table-striped verticle-middle table-responsive-sm">
                                                            <thead>
                                                                <tr className="table-custom-th">
                                                                    <th>Subject</th>
                                                                    <th>HomeWork</th>
                                                                    <th>Attachment</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td colSpan={3} className="text-center"> No records found</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                ):''
                                            }



									  </div>{/**** form-row ****/}
									  </div>{/**** left ****/}
									</div>{/******* form-row ****/}
								</div>


                              </div>{/********* fee-collection *****/}
							  </form>
                            </div>{/********* card-body ******/}
                        </div>
                    </div>
                </div>
            </div>
        </div>

         {/************************************
            Content body end
        *************************************/}


          {/***********************************
            Footer Copyright start
        ************************************/}

          <Copyright />

          {/***********************************
            Footer Copyright end
        ************************************/}

        </div>

      </div>

    );
  }
}

export default HomeWork;
