//5:48pm
import React, { Component } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Script from "@gumgum/react-script-tag";
import Copyright from "../basic/Copyright";
import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url=location.protocol+'//'+location.host+'/';


class Feeslot extends Component {

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
	idarr:[],
	chkbox:[],
	showError: false,
	showSuccess: false,
	isLoading:true,
	messgae: ''
  }
   this.handleCreate = this.handleCreate.bind(this);
   this.handleSelect = this.handleSelect.bind(this);
   this.handleCheck = this.handleCheck.bind(this);
   this.input = React.createRef();
 }

handleSelect = (event) => {
    const opt = event.target.name;
    const select_val = event.target.value;
    const array = opt.split("_");
    const chk_id = array[1];

    let checks = [...this.state.idarr];
    const allchecks = this.state.chkarr;

    let unique = [];

    if (select_val === 'monthly') {
        // Select all checkboxes for the category
        checks = checks.filter(id => !id.startsWith(`month_${chk_id}`)); // Clear previous selections
        for (let key in allchecks) {
            if (allchecks[key] !== null) {
                let level = allchecks[key].id;
                const level_arr = level.split("_");
                let level_id = level_arr[1];
                if (level_id === chk_id) {
                    unique.push(level);
                }
            }
        }
    } else if (select_val === 'yearly') {
        // Select only the first checkbox for the category
        checks = checks.filter(id => !id.startsWith(`month_${chk_id}`)); // Clear previous selections
        for (let key in allchecks) {
            if (allchecks[key] !== null) {
                let level = allchecks[key].id;
                const level_arr = level.split("_");
                let level_id = level_arr[1];
                if (level_id === chk_id) {
                    if (unique.length < 1) {
                        unique.push(level);
                    }
                }
            }
        }
    } else if (select_val === 'others') {
        // Clear checkboxes for the category
        checks = checks.filter(id => !id.startsWith(`month_${chk_id}`));
    }

    // Add the new unique selections
    unique.forEach(id => {
        if (!checks.includes(id)) {
            checks.push(id);
        }
    });

    this.setState({ idarr: checks });
}

 handleCheck = (event) => {

	// let opt = event.target.name;
    // let check_val = event.target.value;
	let check_id = event.target.id;
	let check = event.target.checked;

	let checks = [...this.state.idarr];

	if (check) {
        if (!checks.includes(check_id)) {
            checks.push(check_id);
        }
    } else {
        checks = checks.filter(id => id !== check_id);
    }

    this.setState({ idarr: checks });
 }
 handleCreate (event) {
    event.preventDefault();

	let checks=this.state.chkarr;
	let selects=this.state.slctarr;
	var obj = {};
	var sbj = {};
	var lvl ='';

	for(var key in selects) {
		if(selects[key] !== null)
		{
			if(selects[key].value !='')
			{
				sbj[selects[key].name]=selects[key].value;
			}
		}
	}

	for(var key in checks) {

		if(checks[key] !== null)
		{
			if(checks[key].hasOwnProperty('checked'))
			{
				if (checks[key].checked)
				{
					if(obj.hasOwnProperty(checks[key].name))
					{
						lvl=obj[checks[key].name];
						let txt = checks[key].value+','+lvl;
						const array = txt.split(",");
						let unique = [];
						for(var i=0; i < array.length; i++){
							if(unique.indexOf(array[i]) === -1) {
								unique.push(array[i]);
							}
						}
						obj[checks[key].name] = unique.toString();
					}
					else
					{
						obj[checks[key].name] = checks[key].value;
					}

				}
			}
		}
	}

	const data = {
		months:obj,
		types:sbj
	  }

	axios.post(`${base_url}api`+'/feeslot/create',data)
		.then(response => {
		console.log(response.data);
			if (response.data.status === 'successed')
			{
				this.setState({ showError: false, showSuccess: true, message: response.data.message});
			}
			else
			{
			    this.setState({ showError: true, showSuccess: false, message: response.data.message});
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


    axios.get(`${base_url}api`+'/feeslot/index').then((response) => {

        if (response.status === 200)
		{
			const categoryRows=response.data.data.categories?response.data.data.categories:[];
			const monthRows = response.data.data.months?response.data.data.months:[];
			const slotRows = response.data.data.slots?response.data.data.slots:[];

			const idset =[];
			let check_arr = [];

			for(let key in categoryRows)
			{
				let index=0;
				if(slotRows.hasOwnProperty(key))
				{
					for(let ky in monthRows)
					{
						const str = monthRows[ky].replace(/ +/g, "");

						if((slotRows[key]['FeeCatId']==categoryRows[key].fee_id)&&(slotRows[key]['FeeDueMonths'].indexOf(str) !== -1))
						{
							idset.push('month_'+categoryRows[key].fee_id+'_'+index);
						}
						index++;
					}

				}
			}

			for(let i=0; i < idset.length; i++){
				if(check_arr.indexOf(idset[i]) === -1) {
					check_arr.push(idset[i]);
				}
			}

			this.setState({
				categories: categoryRows,
                months: monthRows,
                slots: slotRows,
                idarr: check_arr
			});
        }
        else {
			this.setState({
				categories: [],
				months: [],
				slots: []
			});
        }
    });

 }

render() {
    const { isLoading, categories, months, slots, idarr } = this.state;
    const isLoad = this.state.isLoading;

    if (isLoad) {
        //return null;
    }

	const monthList = Object.keys(months).map((k) => (
        <th key={k} scope="col"><span>{months[k]}</span></th>
    ));

    this.state.chkarr = []; // Reset chkarr before re-rendering
    this.state.slctarr = []; // Reset slctarr before re-rendering


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
                                <h4>Create Fee Slot</h4>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <form onSubmit={this.handleCreate}>
                                    <div className="form-own pending-fee-table fee-chart-table">
                                        <div className="table-responsive">
                                            <table className="table table-bordered table-striped verticle-middle table-responsive-sm">
                                                <thead>
                                                    <tr>
                                                        <th scope="col"><span>Fee Category</span></th>
                                                        {monthList}
                                                        <th scope="col"><span>Fee Type</span></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {categories.map((item, i) => (
                                                        <tr key={i}>
                                                            <td><span>{item.name}</span></td>
                                                            {Object.keys(months).map((key, index) => (
                                                                <td key={key}>
                                                                    <div className="checkbox">
                                                                        <label> <input type="checkbox" id={`month_${item.fee_id}_${index}`} name={`month_${item.fee_id}`} value={key} onChange={this.handleCheck} checked={idarr.includes(`month_${item.fee_id}_${index}`)} ref={node => this.state.chkarr.push(node)} /> </label>
                                                                    </div>
                                                                </td>
                                                            ))}
                                                            <td>
                                                                <select name={`feetype_${item.fee_id}`} className="form-control fee_type_box" defaultValue={slots.hasOwnProperty(i) ? slots[i]['FeeSlotDesc'] : ''} onChange={this.handleSelect} ref={node => this.state.slctarr.push(node)}>
                                                                    <option value="others">Others</option>
                                                                    <option value="yearly">Yearly</option>
                                                                    <option value="monthly">Monthly</option>
                                                                </select>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="text-right btn-submit-right my-3">
                                        <input type="submit" className="btn btn-primary" value="Save Details"/>
                                    </div>
                                    <div className="text-center">
                                        {this.state.showError ? <div className="error">{this.state.message}</div> : null}
                                        {this.state.showSuccess ? <div className="success">{this.state.message}</div> : null}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Copyright />
        </div>
      </div>
    );
  }
}

export default Feeslot;
