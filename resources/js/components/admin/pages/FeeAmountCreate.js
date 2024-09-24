import React, { Component} from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import Script from "@gumgum/react-script-tag";
import Copyright from "../basic/Copyright";
import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url=location.protocol+'//'+location.host+'/';

class FeeAmountCreate extends Component {

    constructor (props) {
        super(props)
        this.state = {
            isChecked:false,
            showError: false,
            showSuccess: false,
            isLoading:true,
            courseData: [],
            classData: [],
            categoryData:[],
            chkarr:[],
            idarr:[],
            feecats:[]
        }

	   this.handleCheck = this.handleCheck.bind(this);
	   this.handleCreate = this.handleCreate.bind(this);
	   this.handleChange = this.handleChange.bind(this);
	   this.handleCategory = this.handleCategory.bind(this);
	   this.handleCheckAll = this.handleCheckAll.bind(this);
    }
    handleCheckAll = (event) => {
        var check = event.target.checked;
        var chk_name = event.target.name;
        var chk_value = event.target.value;

        const checks = this.state.idarr;
        const allchecks = this.state.chkarr;
        const check_arr = [];
        let unique = [];

        check_arr.push(chk_name);

        for(var key in allchecks) {
            if(allchecks[key] !== null)
            {
                check_arr.push(allchecks[key].name);
            }
        }
        check_arr.forEach((c) => {
            if (!unique.includes(c)) {
                unique.push(c);
            }
        });

        if(chk_value=='all')
        {
            if(check)
            {
                this.setState({
                    idarr: unique
                });
            }
            else
            {
                this.setState({
                    idarr: []
                });
            }
        }

    }
    handleCheck = (event) => {
            var check = event.target.checked;
            var chk_name = event.target.name;
            const checks = this.state.idarr;
            const check_arr = [];

            if(check)
            {
                for(var i=0;i<checks.length;i++)
                {
                    check_arr.push(checks[i]);
                }

                if(!check_arr.includes(chk_name))
                {
                    check_arr.push(chk_name);
                }
            }
            else
            {
                for(const key in checks)
                {
                    if(checks[key]!==chk_name)
                    {
                        check_arr.push(checks[key]);
                    }
                }
            }

            let unique = [];

            check_arr.forEach((c) => {
                if (!unique.includes(c)) {
                    unique.push(c);
                }
            });

            unique = unique.filter(function(item) {
                return item !== 'check_all'
            });

            this.setState({
                idarr: unique
            });
    }

    handleCreate (event) {
    event.preventDefault();
    const { course_id } = event.target;

    const allchecks = this.state.chkarr;
    let categories=this.state.feecats;
    const class_arr = [];
    let unique_arr = [];
    var catarr={};

        for(var key in categories)
        {
            if(categories[key] !== null)
            {
                if(categories[key].name=='category[]')
                {
                    catarr[categories[key].id]=categories[key].value;
                }
            }
        }

    for(var key in allchecks) {
        if(allchecks[key] !== null)
        {
            if(allchecks[key].checked)
            {
                class_arr.push(allchecks[key].value);
            }
        }
    }

    for(const key in class_arr)
    {
        if (!unique_arr.includes(class_arr[key])) {
            unique_arr.push(class_arr[key]);
        }
    }

    unique_arr = unique_arr.filter(function(item) {
            return item !== 'all'
    });

    const data = {
        course_id: course_id.value,
        fee_cats: catarr,
        class_set:unique_arr
    }

    axios.post(`${base_url}api`+'/feeamount/create',data)
        .then(response => {

            if (response.data.status === 'successed')
            {
                this.setState({ showError: false, showSuccess: true, message: response.data.message});
                window.location.href = base_url+"fee_amount_list";
            }
            else
            {
                this.setState({ showError: true, showSuccess: false, message: response.data.message});
            }
        })
        .catch(err => {
        console.log(err.message);
        console.log(err.response.data);
        })

    }

    handleChange(event) {

		this.setState({
			course_id: event.target.value
		});

		var id = event.target.value;

	   if(id >0)
	   {
		   axios.get(`${base_url}api`+`/class/getclassbycourse/${id}`).then(response => {
				this.setState({
					classData: response.data.data ? response.data.data :[],
					idarr: []
				});
			})
			.catch(error => {
			   console.log(error.message);
			})

	   }
	   else
	   {
		   this.setState({
				classData: [],
				idarr: []
			});
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


        axios.get(`${base_url}api`+'/class/getcourses').then(response => {
            this.setState({
                courseData: response.data.data ? response.data.data : [],
            });
        })
        .catch(error => {
        console.log(error.message);
        })

        axios.get(`${base_url}api`+'/feecat/listall').then(response => {
            this.setState({
                categoryData:response.data.data?response.data.data:[],
            });
        })
        .catch(error => {
        console.log(error.message);
        })

    }


    handleCategory(event){
        event.preventDefault();
        this.setState({ [event.target.name]: event.target.value });
    }

    render() {

        const isLoad = this.state.isLoading;

        if (isLoad) {

        //return null;

        }

        let courseRows = this.state.courseData;
        let classRows = this.state.classData;

        let courseList = courseRows.length > 0
            && courseRows.map((item, i) => {

            return (
                    <option key={i} value={item.courseId}>{item.courseName}</option>
                )

        }, this);

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
                        <h4>Add Fee Amount</h4>
                    </div>
                </div>
                <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                    <ol className="breadcrumb">
                        <li><a href={`/fee_amount_list`} className="btn bg-blue-soft text-blue"><i className="fa fa-angle-double-left"></i> Back to Fee Amount List</a></li>
                    </ol>
                </div>
            </div>

            <div className="row">
            <div className="col-xl-12 col-xxl-12">
                <div className="card">

                <div className="card-body">

                    <div className="basic-form form-own className-wise-subject">
                    <form onSubmit={this.handleCreate}>

                        <div className="form-row">
                        <div className="form-group col-md-6">
                            <label>Course Name</label>
                            <select className="form-control" id="course_id" name="course_id" value={this.state.course_id}  onChange={this.handleChange}>
                            <option value="">Select Course</option>
                            {courseList}
                            </select>
                        </div>
                        {
                            classRows.length > 0 ?(
                        <div className="form-group col-md-12 mrb-0">
                            <div className="print-id-card-table">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped verticle-middle table-responsive-sm">
                                        <thead>
                                            <tr>
                                                <th scope="col"><div className="form-checkbox"> <input type="checkbox" className="form-check-input" name={'check_all'} value={'all'} onChange={this.handleCheckAll} checked={(this.state.idarr.includes('check_all'))?true:false}/> &nbsp; Select All </div></th>
                                                <th scope="col">Class Name</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            classRows.map((item,i)=>(
                                            <tr key={i}>
                                                <td>
                                                <div className="form-checkbox">
                                                    <input type="checkbox" className="form-check-input" name={'check_'+item.classId} onChange={this.handleCheck} checked={(this.state.idarr.includes('check_'+item.classId))?true:false} ref={node =>this.state.chkarr.push(node)} value={item.classId}/>
                                                </div>
                                                </td>
                                                <td>{item.className}</td>
                                            </tr>
                                            )
                                            )
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        )
                            :''
                            }

                        <div className="form-group col-md-12">
                            <label>Category wise Fee Amount Description</label>
                        </div>

                        {
                            (this.state.categoryData.length >0)?(
                        <div className="form-group col-md-12">
                            <div className="Schedule-table">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped verticle-middle table-responsive-sm">
                                    <thead>
                                        <tr className="table-custom-th">
                                            <th scope="col">Fee Category</th>
                                            <th scope="col">Fee Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.categoryData.map((item, key) => {
                                        const isSpecialFeeId = item.fee_id === 3 || item.fee_id === 4;
                                        return (
                                            <tr key={item.fee_id} className={`${isSpecialFeeId ? 'special-category' : ''}`}>
                                                <td>{item.name}</td>
                                                <td>
                                                    <input type="number" id={item.fee_id} name="category[]" className="form-control category_input" step="0.1" onChange={this.handleCategory} ref={node =>this.state.feecats.push(node)} disabled={isSpecialFeeId} title={`${isSpecialFeeId ? 'System Alert: Editing Not Available' : ''}`}/>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                                </table>
                            </div>
                            </div>
                        </div>
                        ):null
                        }
                        </div>
                        <div>
                            <input type="submit" className="btn btn-primary" value="Submit"/>
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

export default FeeAmountCreate;
