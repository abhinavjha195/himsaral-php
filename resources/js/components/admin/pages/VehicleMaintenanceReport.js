import React, { Component } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import ServerTable from 'react-strap-table';
import Script from "@gumgum/react-script-tag";

import Copyright from "../basic/Copyright";

import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";
import Log, { colors } from "laravel-mix/src/Log";  

const base_url = location.protocol + '//' + location.host + '/';  

class VehicleMaintenanceReport extends Component {

    constructor(props) {
        super(props)
        this.state = {
            formMessage: '',
            errors: [],
            vehicleData: [],
            maintenanceData: [],
            checkedArr: [],
            maintenanceArr: [],
            report: [],
            mtList: [],
            vehicle_id: "",
            date: [],
            id: "",
            api_url: '',
            dateArr: [],
            show: "",
            showError: false,
            showSuccess: false,
			isLoading:true,	
        }
        this.hasErrorFor = this.hasErrorFor.bind(this)
        this.renderErrorFor = this.renderErrorFor.bind(this)
        this.handleChanges = this.handleChanges.bind(this)
        this.handleShow = this.handleShow.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.input = React.createRef();
    }

    hasErrorFor(field) {
        return !!this.state.errors[field]
    }
    renderErrorFor(field) {
        if (this.hasErrorFor(field)) {
            return (<span className='invalid-feedback'> <strong>{this.state.errors[field][0]}</strong> </span>)
        }
    }


    handleChanges(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
        const id = e.target.value;
        if (id.length > 0) {
            axios.get(`${base_url}api/maintenance/getMaintenance/${id}`).then(response => {	
                // console.log(response.data);
                this.setState({
                    maintenanceData: response.data.data ? response.data.data : []
                });
            })
                .catch(error => {
                    console.log(error.message);
                })
        }
        else {
            this.setState({
                maintenanceData: []
            });
        }

    }

    handleCheck(e) {
        let check = e.target.checked;
        let check_val = e.target.value;
        let checks = this.state.maintenanceArr;
        let lists = this.state.mtList;

        const idset = [];
        let idarr = [];

        var chk_arr = [];

        for (var key in lists) {
            if (lists[key] !== null) {
                if (lists[key].name == 'maintenance_id') {
                    chk_arr.push(parseInt(lists[key].value));
                }
            }
        }

        let chkinp = this.removeDuplicates(chk_arr);

        if (check) {
            for (var key in checks) {
                idset.push(parseInt(checks[key]));
            }
            if (!idset.includes(parseInt(check_val))) {
                idset.push(parseInt(check_val));
            }
        }
        else {
            for (var key in checks) {
                if (checks[key] != check_val && checks[key] != 0) {
                    idset.push(parseInt(checks[key]));
                }

            }
        }

        let unique_arr = this.removeDuplicates(idset);

        idarr = unique_arr.filter(function (item) {
            return item !== 0
        });

        console.log(unique_arr);
        if (unique_arr.length > 0) {
            var list = idarr.toString();
            this.setState({
                maintenanceArr: unique_arr,
            })
        }
        else {
            this.setState({ maintenanceArr: unique_arr });
        }

    }

    removeDuplicates(arr) {
        let unique = [];
        for (var i = 0; i < arr.length; i++) {
            if (unique.indexOf(arr[i]) === -1) {
                unique.push(parseInt(arr[i]));
            }
        }
        return unique;
    }


    handleDate(e) {
        let date = this.state.date;

        var idx = date.map(function (val) { return val.name }).indexOf(e.target.name);
        if (idx > -1) {
            date[idx].value = e.target.value;
        } else {
            date.push({ name: e.target.name, value: e.target.value });
        }
        this.setState({ date: date })
    }

    handleShow(e) {

        let id = this.state.vehicle_id;
        let type = this.state.maintenanceArr.toString();

        let date = this.state.date.map(function (obj) {
            return obj.value;
        }).toString();;
        let date_name;

        let current_date = new Date();
        var day = ('0' + current_date.getDate()).slice(-2);
        var month = ('0' + (current_date.getMonth() + 1)).slice(-2);
        var year = current_date.getFullYear();
        current_date = (year + '-' + month + '-' + day).toString();

        if (this.state.date.length == 2) {
            date = date;
        }
        else if (this.state.date.length == 1) {
            date_name = this.state.date.map(function (obj) {
                return obj.name;
            });
            if (date_name == 'from_date') {
                date = date + ',' + current_date;
            }
            else {
                date = current_date + ',' + date;
            }

        }
        else {
            date = current_date + "," + current_date;
        }

        const url = base_url+`api/maintenance/getmaintenancereport?vechile_id=${id}&filter=${type}&range=${date}`;


        this.setState({
            api_url: url,
            show: true,
            id: this.state.vehicle_id
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

		
        axios.get(`${base_url}api/vehicle/getVehicle`).then(response => {	
            // console.log(response.data);
            this.setState({
                vehicleData: response.data.data ? response.data.data : [],
            });
        })
            .catch(error => {
                console.log(error.message);
            });
    }

    refreshTable() {
        this.serverTable.current.refreshData();
    }

    render() {
		
const isLoad = this.state.isLoading;    			

if (isLoad) {  

//return null;  		
			 		
}


        const { vehicleData } = this.state;
        const { maintenanceData } = this.state;


        let vehicleList = vehicleData.length > 0
            && vehicleData.map((item, i) => {
                return (
                    <option key={i} value={item.id}>{item.registration_no}</option>
                )
            }, this);


        let maintenanceList = maintenanceData.length > 0
            && maintenanceData.map((item, i) => {
                return (
                    <tr key={i}>
                        <td style={{ border: "none" }}>
                            <input type="checkbox" className="form-check-input" name="maintenance_id" value={item.maintenance_id}
                                onChange={this.handleCheck} ref={node => this.state.mtList.push(node)}
                                style={{ width: "20px", height: "20px" }}
                            />

                        </td>
                        <td style={{ border: "none" }}>{item.maintenance_type}</td>
                    </tr>
                )
            }, this);

        const date = new Date();
        var day = ('0' + date.getDate()).slice(-2);
        var month = ('0' + (date.getMonth() + 1)).slice(-2);
        var year = date.getFullYear();

        var current_date = year + '-' + month + '-' + day;


        const columns = ['registration_no', 'maintenance_date', 'bill_no', 'expenses', 'maintenance_type','description'];
        const options = {
            perPage: 10,
            headings: { registration_no: 'Vehicle', maintenance_date: 'Date', bill_no: 'Bill No', expenses: 'Total Expenses', maintenance_type: 'Maintenance Type', description: 'Descriptions' },
            sortable: ['registration_no', 'maintenance_date', 'bill_no', 'expenses', 'maintenance_type', 'description'],
            // columnsWidth: {registration_no: 50  },
            columnsWidth: {description: '50px'},
            requestParametersNames: { query: 'search', direction: 'order' },
            responseAdapter: function (resp_data) {
                console.log(resp_data);
                return { data: resp_data.data.data ? resp_data.data.data : [], total: resp_data.data.total }
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

                <Preloader />

                <div id="main-wrapper">

                    <HeaderPart />

                    <div className="content-body">
                        <div className="container-fluid">
                            <div className="row page-titles mx-0">
                                <div className="col-sm-6 p-md-0">
                                    <div className="welcome-text">
                                        <h4>Routewise Student List</h4>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-xl-12 col-xxl-12">
                                    <div className="card">
                                        <div className="card-body">
                                            {this.state.showError ?
                                                <div className="alert alert-danger" style={{ color: "brown" }}>
                                                    <strong>{this.state.message}</strong>
                                                </div>
                                                : null}
                                            <div className="basic-form form-own">
                                                <form >
                                                    <div className="form-row">
                                                        <div className="form-group col-md-4">
                                                            <label>Vehicle Reg No.</label>
                                                            <select className={`form-control ${this.hasErrorFor('vehicle_id') ? 'is-invalid' : ''}`} id="vehicle_id"
                                                                name="vehicle_id" ref={this.input} onChange={this.handleChanges}>
                                                                <option value="" defaultValue={'DEFAULT'}>Select RegNo</option>
                                                                {vehicleList}
                                                            </select>
                                                            {this.renderErrorFor('vehicle_id')}
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label>From Date</label>
                                                            <input type="date" className="form-control input-daterange-timepicker" name="from_date"
                                                                defaultValue={(this.state.date.length > 0) ? this.state.date : current_date}
                                                                onChange={this.handleDate} ref={this.input} />
                                                            {this.renderErrorFor('from_date')}
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label>To Date</label>
                                                            <input type="date" className="form-control input-daterange-timepicker" name="to_date"
                                                                defaultValue={(this.state.date.length > 0) ? this.state.date : current_date}
                                                                onChange={this.handleDate} ref={this.input} />
                                                            {this.renderErrorFor('to_date')}
                                                        </div>

                                                        {
                                                            (maintenanceData.length > 0) ? (
                                                                <>
                                                                    <h5 className="ml-3 mt-3" style={{ color: "darkred" }}>Select Maintenance type from the list showing below</h5>
                                                                    <div className="form-group col-md-12 mrb-0 my-4">
                                                                        <div className="print-id-card-table">
                                                                            <div className="table-responsive">
                                                                                <table className="table table-hover table-condensed">
                                                                                    <tbody>
                                                                                        {maintenanceList}
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            ) : ""
                                                        }
                                                        <div className="form-group col-sm-6">
                                                            <input type="button" className="btn btn-primary btn-sm " onClick={this.handleShow} value="Show" />
                                                        </div>


                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {

                                (this.state.show) ? (
                                    (this.state.id.length > 0) ? (
                                        (this.state.maintenanceArr.length > 0) ? (
                                            <>
                                            <div className="row">
                                                <div className="col">
                                                    <div className="card">
                                                        <div className="card-body create-user-table">
                                                            <div className="table-responsive">
                                                                <ServerTable ref={this.serverTable} columns={columns} url={this.state.api_url ? this.state.api_url : base_url} options={options} bordered hover>
                                                                    {
                                                                        function (row, columns) {
                                                                            switch (columns) {
                                                                                default:
                                                                                    return (row[columns]);
                                                                            }
                                                                        }
                                                                    }
                                                                </ServerTable>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                        )   :  <div className="form-group col-sm-11 alert alert-danger mx-2" style={{ color: "brown" }}>Selct Maintenance Type</div>
                                    )  : <div className="form-group col-sm-11 alert alert-danger mx-2" style={{ color: "brown" }}>Select Vehicle</div>
                                ) : ""
                            }

                        </div>
                    </div>

                    <Copyright />


                </div>

            </>

        );

    }

}

export default VehicleMaintenanceReport;	