import React, { Component } from "react";
import TimePicker from 'react-time-picker';
import axios from 'axios';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import { Link } from 'react-router-dom';
import ServerTable from 'react-strap-table';
import Script from "@gumgum/react-script-tag";

import Copyright from "../basic/Copyright";

import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";
import Log, { colors } from "laravel-mix/src/Log";

axios.defaults.baseURL = 'http://127.0.0.1:8000/api';

const base_url = location.protocol + '//' + location.host + '/';
axios.defaults.baseURL = base_url + 'api';

class NoticeAdd extends Component {

    constructor(props) {
        super(props)
        this.state = {
            formMessage: '',
            errors: [],
            selectedFile: null,
            show: "",
            showError: false,
            showSuccess: false,
        }
        this.hasErrorFor = this.hasErrorFor.bind(this)
        this.renderErrorFor = this.renderErrorFor.bind(this)
        this.handleCreate = this.handleCreate.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.input = React.createRef();
    }
    
    handleFileChange(e) {
        // console.log(e.target.files[0]);
        this.setState({
            selectedFile: e.target.files[0]
        })
    }
    
    handleCreate(e) {
        e.preventDefault();
        const { date, title, from_time, to_time, notice, link1, link2, link3, link4 } = e.target
        
        const formData = new FormData();
        formData.append('date', date.value);
        formData.append('title', title.value);
        formData.append('from_time', from_time.value);
        formData.append('to_time', to_time.value);
        formData.append('notice', notice.value);
        formData.append('file_name', this.state.selectedFile);
        formData.append('link1', link1.value);
        formData.append('link2', link2.value);
        formData.append('link3', link3.value);
        formData.append('link4', link4.value);
 for (var pair of formData.entries()) {
            console.log(pair[1]); 
        }
        axios.post(`${base_url}api`+'/notice/create', formData)		
            .then(response => {
                console.log(response.data);
                if (response.data.status === 'failed') {
                    this.setState({
                        formMessage: response.data.message,
                        errors: response.data.errors
                    })
                    history.push('/')

                }
                else {
                    this.setState({
                        formMessage: response.data.message,
                        errors: []
                    })
                    window.location.href = base_url+"notice_list";		

                }
            })
            .catch(error => {
                console.log(error.message);
            })
    }

    hasErrorFor(field) {
        return !!this.state.errors[field]
    }
    renderErrorFor(field) {
        if (this.hasErrorFor(field)) {
            if(field=='file_name')		
            {
                return ( <p className='invalid' style={{color: "red"}}> <strong>{this.state.errors[field][0]}</strong> </p> )		
            }
            else
            {
                return ( <span className='invalid-feedback'> <strong>{this.state.errors[field][0]}</strong> </span> )	
            }
              
        }
    }


    componentDidMount() {

    }



    render() {
        const { value } = this.props;
        const date = new Date();
        var day = ('0' + date.getDate()).slice(-2);
        var month = ('0' + (date.getMonth() + 1)).slice(-2);
        var year = date.getFullYear();
        var current_date = year + '-' + month + '-' + day;

        var current_time = date.getHours()+':'+date.getMinutes();
      
        console.log(current_time);


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
                                        <h4>Add New Notice</h4>
                                    </div>
                                </div>
                                <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                                    <ol className="breadcrumb">
                                        <li><a href={`/notice_list`} className="btn bg-blue-soft text-blue"><i className="fa fa-angle-double-left"></i> Back to Notice List</a></li>
                                    </ol>
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
                                                <form onSubmit={this.handleCreate}>
                                                    <div className="form-row">

                                                        <div className="form-group col-md-6">
                                                            <label>Date</label>
                                                            <input type="date" className={`form-control input-daterange-timepicker ${this.hasErrorFor('date') ? 'is-invalid' : ''}`} 
                                                                name="date" defaultValue={current_date} ref={this.input} />
                                                            {this.renderErrorFor('date')}
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label>Title</label>
                                                            <input type="text" className={`form-control input-daterange-timepicker ${this.hasErrorFor('title') ? 'is-invalid' : ''}`} 
                                                                name="title" ref={this.input} />
                                                            {this.renderErrorFor('title')}
                                                        </div>
                                                        <div className="form-group col-md-6" >
                                                            <label>Time From</label>
                                                            <input type="time" className={`form-control input-daterange-timepicker ${this.hasErrorFor('from_time') ? 'is-invalid' : ''}`} 
                                                                name="from_time" defaultValue={current_time} ref={this.input} />
                                                            {this.renderErrorFor('from_time')}
                                                        </div>
                                                        
                                                        <div className="form-group col-md-6">
                                                            <label>Enter Notice </label>
                                                            <textarea  className={`form-control ${this.hasErrorFor('notice') ? 'is-invalid' : ''}`} rows={3} cols={20} name="notice" ref={this.input}>
                                                            </textarea>
                                                            {this.renderErrorFor('notice')}
                                                        </div>
                                                        
                                                        <div className="form-group col-md-6" style={{marginTop:"-45px"}}>
                                                            <label>Time To</label>
                                                            <input type="time" className={`form-control input-daterange-timepicker ${this.hasErrorFor('to_time') ? 'is-invalid' : ''}`} 
                                                                name="to_time" defaultValue={current_time} ref={this.input} />
                                                            {this.renderErrorFor('to_time')}
                                                        </div>
                                                        
                                                        <div className="form-group col-md-12" >
                                                            <label>Add File</label>
                                                            <input type="file"  className={`form-control input-daterange-timepicker col-md-6 ${this.hasErrorFor('file_name') ? 'is-invalid' : ''}`}
                                                                name="file_name"  ref={this.input} onChange={this.handleFileChange} />
                                                            {this.renderErrorFor('file_name')}
                                                        </div>
                                                        <div className="form-group col-md-6" >
                                                            <label>Link1</label>
                                                            <input type="text"  className={`form-control input-daterange-timepicker ${this.hasErrorFor('link1') ? 'is-invalid' : ''}`}
                                                                name="link1"  ref={this.input} />
                                                            {this.renderErrorFor('link1')}
                                                        </div>
                                                        <div className="form-group col-md-6" >
                                                            <label>Link2</label>
                                                            <input type="text"  className={`form-control input-daterange-timepicker ${this.hasErrorFor('link2') ? 'is-invalid' : ''}`}
                                                                name="link2"  ref={this.input} />
                                                            {this.renderErrorFor('link2')}
                                                        </div>
                                                        <div className="form-group col-md-6" >
                                                            <label>Link3</label>
                                                            <input type="text"  className={`form-control input-daterange-timepicker ${this.hasErrorFor('link3') ? 'is-invalid' : ''}`}
                                                                name="link3"  ref={this.input} />
                                                            {this.renderErrorFor('link3')}
                                                        </div>
                                                        <div className="form-group col-md-6" >
                                                            <label>Link4</label>
                                                            <input type="text"  className={`form-control input-daterange-timepicker ${this.hasErrorFor('link4') ? 'is-invalid' : ''}`}
                                                                name="link4"  ref={this.input} />
                                                            {this.renderErrorFor('link4')}
                                                        </div>

                                                        <div className="col-md-12 ">
                                                        <button type="submit" className="btn btn-primary pull-right" id="Save" title="Save" >Save</button>

                                                    </div>
                                                        <label className="label">{this.state.formMessage}</label>
                                                      
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <Copyright />


                </div>

            </>

        );

    }

}

export default NoticeAdd;	