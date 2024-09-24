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

class AssignTeacherClassEdit extends Component {

   constructor(props) {
  super(props)
  this.state = {
		isLoading:true,
		showError:false,
		showSuccess:false,
		emp_no:'',
		emp_name:'',
		mobile:'',
		email:'',
		doj:'',
		teacherData:[],
		courseData:[],
		coursearr:[],
		courselst:[],
		corearr:[],
	    classarr:[],
	    sectionarr:[],
		sectionlst:[],
		sectionData:[],
		errors: [],
        readOnly: true,
  }
	this.handleCourse = this.handleCourse.bind(this);
	this.handleCourseRow = this.handleCourseRow.bind(this);
	this.checkAllCourse = this.checkAllCourse.bind(this);
    this.handleSection = this.handleSection.bind(this);
	this.checkAllSection = this.checkAllSection.bind(this);
	this.handleUpdate = this.handleUpdate.bind(this);
	this.handleChange = this.handleChange.bind(this);
	this.hasErrorFor = this.hasErrorFor.bind(this);
	this.renderErrorFor = this.renderErrorFor.bind(this);
	this.input = React.createRef();
 }


handleUpdate (event) {
  event.preventDefault();
  const { emp_name,emp_no,email,doj,mobile } = event.target;

	const action=window.event.submitter.name;
	const urlString = window.location.href;
	const url = new URL(urlString);
	const lastSegment = url.pathname.split('/').pop();
	const id = lastSegment;

  const courses=this.state.corearr;
  const sections=this.state.sectionarr;

  let class_arr=[];
  let section_arr=[];

	for(var key in courses)
	{
		let arr=courses[key].split(",");
		for(var i=0;i<arr.length;i++)
		{
			if(!class_arr.includes(parseInt(arr[i])))
			{
				class_arr.push(parseInt(arr[i]));
			}
		}

	}

	for(var key in sections)
	{
		let arr=sections[key].split(",");
		for(var i=0;i<arr.length;i++)
		{
			if(!section_arr.includes(parseInt(arr[i])))
			{
				section_arr.push(parseInt(arr[i]));
			}
		}
	}

  const data = {
	employee_name: emp_name.value,
	employee_no: emp_no.value,
	date_join: doj.value,
	email: email.value,
	mobile: mobile.value,
	class_list:class_arr.toString(),
	section_list:section_arr.toString(),
  }

  axios.post(`${base_url}api/teacherclass/update/${id}`,data).then(response => {
		// console.log(response);
		if (response.data.status === 'successed')
		{
			this.setState({ showError:false,showSuccess:true,message:response.data.message,errors:response.data.errors});
			window.location.href = base_url+"assign_class_teacher_list";
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

handleCourse(event){

	let opt = event.target.name;
	let check = event.target.checked;
    let check_val = event.target.value;
	let checks=this.state.coursearr;
	let lists = this.state.courselst;

	const idset =[];
	let unique = [];
	let idarr = [];

	var chk_arr=[];

	for(var key in lists)
	{
		if(lists[key] !== null)
		{
			if(lists[key].name=='course_id')
			{
				chk_arr.push(parseInt(lists[key].value));
			}
		}
	}

	let chkinp=this.removeDuplicates(chk_arr);

	if(check)
	{
		for(var key in checks)
		{
			idset.push(parseInt(checks[key]));
		}
		if(!idset.includes(parseInt(check_val)))
		{
			idset.push(parseInt(check_val));
		}
	}
	else
	{
		for (var key in checks)
		{
			if(checks[key] !=check_val && checks[key] !=0)
			{
				idset.push(parseInt(checks[key]));
			}

		}
	}

	let unique_arr=this.removeDuplicates(idset);

	idarr = unique_arr.filter(function(item) {
		return item !== 0
	});

	if(idarr.length==parseInt((chkinp.length)-1))
	{
		unique_arr.push(0);
	}

	if(unique_arr.length >0)
	{
		var list=idarr.toString();
		axios.get(`${base_url}api`+`/section_class_list_by_course/${list}`).then(response => {

			this.setState({
				coursearr:unique_arr,
				sectionData: response.data.data?response.data.data:[],
			});


		})
		.catch(err => {
			 console.log(err.response.data);
		})

	}
	else
	{
		this.setState({coursearr:unique_arr,sectionData:[]});
	}

  }

checkAllCourse(event) {

	let opt = event.target.name;
	let check = event.target.checked;
    let check_val = event.target.value;
	let lists = this.state.courselst;

	let idset=[];
	let unique_arr=[];
	let idarr=[];

	if(check)
	{
		for(var key in lists)
		{
			if(lists[key] !== null)
			{
				if(lists[key].name=='course_id')
				{
					idset.push(parseInt(lists[key].value));
				}
			}
		}

		unique_arr=this.removeDuplicates(idset);
		idarr = unique_arr.filter(function(item) {
			return item !== 0
		});

	}

	if(unique_arr.length >0)
	{
		var list=idarr.toString();
		axios.get(`${base_url}api`+`/section_class_list_by_course/${list}`).then(response => {
			this.setState({
				coursearr:unique_arr,
				sectionData: response.data.data?response.data.data:[],
			});
		})
		.catch(err => {
			 console.log(err.response.data);
		})

	}
	else
	{
		this.setState({coursearr:unique_arr,corearr:[],sectionarr:[],sectionData:[]});
	}

}

handleSection(event){

	let opt = event.target.name;
	let check = event.target.checked;
	let check_id = event.target.id;
    let check_val = event.target.value;
	let checks=this.state.sectionarr;
	let checks1=this.state.corearr;
	let checks2=this.state.classarr;
	let checks3=this.state.sectionlst;

	const inparr=[];
	const idset =[];
	let unique = [];
	var idarr = {};
	var chkarr = {};
	var chkarc = {};
	var count = 0;

	for(var key in checks3)
	{
		if(checks3[key] !== null && checks3[key].name=="section[]" && checks3[key].id==check_id)
		{
			if(!inparr.includes(checks3[key].value))
			{
				inparr.push(checks3[key].value);
			}
		}
	}

	if(check)
	{
		for(var key in checks)
		{
			if(key==check_id)
			{
				const lvl=checks[check_id];
				let txt = check_val+','+lvl;
				const arr = txt.split(",");
				let uniq = [];

				for(var i=0;i<arr.length;i++){
					if(!uniq.includes(arr[i]))
					{
						uniq.push(arr[i]);
					}
				}

				for (key in checks2)
				{
					if(checks2[key] !== null && checks2[key].name=="course[]" && checks2[key].value==check_id)
					{
						if(uniq.length==inparr.length)
						{
							 chkarr[checks2[key].id]=checks2[key].value;
						}
					}
				}

				idarr[check_id] = uniq.toString();
			}
			else
			{
				idarr[key]=checks[key];
				for (key in checks1)
				{
					chkarr[key]=checks1[key];
				}
			}

		}

		if(!checks.hasOwnProperty(check_id))
		{
			idarr[check_id]=check_val;
			for (key in checks2)
			{
				if(checks2[key] !== null && checks2[key].name=="course[]" && checks2[key].value==check_id && inparr.length==1)
				{
					chkarr[checks2[key].id]=checks2[key].value;
				}
			}

		}

	}
	else
	{
		for(var key in checks)
		{
			if(key==check_id)
			{
				const arr = checks[check_id].split(",");
				let uniq = [];

				for(var i=0;i<arr.length;i++)
				{
					if(!uniq.includes(arr[i]) && check_val!=arr[i])
					{
						uniq.push(arr[i]);
					}
				}
				if(uniq.length>0)
				{
					idarr[check_id] = uniq.toString();
				}

			}
			else
			{
				idarr[key]=checks[key];
				for (key in checks1)
				{
					if(checks1[key]!==check_id)
					{
						chkarr[key]=checks1[key];
					}
				}

			}

		}
	}

	for (var key in idarr)
	{
		if(key>0)
		{
			count++;
		}
	}

	if(count>0)
	{
		this.setState({
			corearr:chkarr,
			sectionarr:idarr,
		});
	}
	else
	{
		this.setState({corearr:[],sectionarr:[]});
	}

}

handleCourseRow(event){

	let opt = event.target.name;
	let check = event.target.checked;
	let check_id = event.target.id;
    let check_val = event.target.value;
	let checks1=this.state.corearr;
	let checks2=this.state.sectionarr;
	let checks3=this.state.sectionlst;

	const idset1 =[];
	const idset2 =[];
	const inparr=[];
	let unique = [];
	var idarr = {};
	var chkarr = {};
	var count = 0;

	if(check)
	{
		for(var key in checks1)
		{
			if(key==check_id)
			{
				const lvl=checks1[check_id];
				let txt = check_val+','+lvl;
				const arr = txt.split(",");
				let uniq = [];

				for(var i=0;i<arr.length;i++){
					if(!uniq.includes(arr[i]))
					{
						uniq.push(arr[i]);
					}
				}

				idarr[check_id] = uniq.toString();
			}
			else
			{
				idarr[key]=checks1[key];
				for(var ky in checks3)
				{
					if(checks3[ky] !== null)
					{
						if(checks3[ky].name=='section[]' && checks3[ky].id==check_val)
						{
							if(chkarr.hasOwnProperty(checks3[ky].id))
							{
								const lvl=chkarr[checks3[ky].id];
								let txt = checks3[ky].value+','+lvl;
								const arc = txt.split(",");

								let ubiq = [];

								for(var i=0;i<arc.length;i++)
								{
									if(!ubiq.includes(arc[i]))
									{
										ubiq.push(arc[i]);
									}
								}
								if(ubiq.length>0)
								{
									chkarr[checks3[ky].id] = ubiq.toString();
								}
							}
							else
							{
								chkarr[check_val]=checks3[ky].value;
							}

						}
					}
				}

			}

			for(var key in checks2)
			{
				if(chkarr.hasOwnProperty(checks1[key]))
				{
					const lvl=chkarr[checks1[key]];
					let txt = checks2[key]+','+lvl;
					const arc = txt.split(",");

					let ubiq = [];

					for(var i=0;i<arc.length;i++)
					{
						if(!ubiq.includes(arc[i]))
						{
							ubiq.push(arc[i]);
						}
					}
					if(ubiq.length>0)
					{
						chkarr[checks1[key]] = ubiq.toString();
					}
				}
				else
				{

					chkarr[key]=checks2[key];
				}
			}

		}

		if(!checks1.hasOwnProperty(check_id))
		{
			idarr[check_id]=check_val;

			for(var key in checks3)
			{
				if(checks3[key] !== null)
				{
					if(checks3[key].name=='section[]' && checks3[key].id==check_val)
					{
						if(chkarr.hasOwnProperty(checks3[key].id))
						{
							const lvl=chkarr[checks3[key].id];
							let txt = checks3[key].value+','+lvl;
							const arc = txt.split(",");

							let ubiq = [];

							for(var i=0;i<arc.length;i++)
							{
								if(!ubiq.includes(arc[i]))
								{
									ubiq.push(arc[i]);
								}
							}
							if(ubiq.length>0)
							{
								chkarr[checks3[key].id] = ubiq.toString();
							}
						}
						else
						{
							chkarr[check_val]=checks3[key].value;
						}

					}
				}
			}

			for(var key in checks2)
			{
				if(!chkarr.hasOwnProperty(key))
				{
					chkarr[key]=checks2[key];
				}
			}

		}

	}
	else
	{
		for(var key in checks1)
		{
			if(key==check_id)
			{
				const arr = checks1[check_id].split(",");
				let uniq = [];

				for(var i=0;i<arr.length;i++)
				{
					for(var ky in checks2)
					{
						if(ky !=arr[i] && ky !=check_id )
						{
							chkarr[ky]=checks2[ky];
						}
					}

					if(!uniq.includes(arr[i]) && check_val!=arr[i])
					{
						uniq.push(arr[i]);
					}

				}

				if(uniq.length>0)
				{
					idarr[check_id] = uniq.toString();
				}
			}
			else
			{
				idarr[key]=checks1[key];
				for(var key in checks2)
				{
					if(key !=check_val)
					{
						chkarr[key]=checks2[key];
					}
				}

			}

		}

	}

	// Check if every key has its own property
	for (key in idarr)
	{
		// If the key is found, add it to the total length
		if (idarr.hasOwnProperty(key))
		{
			count++;
		}
	}

	if(count>0)
	{
		this.setState({
			corearr:idarr,
			sectionarr:chkarr,
		});
	}
	else
	{
		this.setState({corearr:[],sectionarr:[]});
	}

}

checkAllSection(event) {

	let opt = event.target.name;
	let check = event.target.checked;
    let check_val = event.target.value;
	let checks1=this.state.classarr;
	let checks2=this.state.sectionlst;

	const idset =[];
	let unique = [];
	var idarr = {};
	var idarr1 = {};
	var idarr2 = {};
	var count = 0;

	if(check)
	{
		idarr1[0]='';
		for(var key in checks1)
		{
			if(checks1[key] !== null && checks1[key].name=='course[]' && checks1[key].id !='')
			{
				if(idarr1.hasOwnProperty(checks1[key].id))
				{
					const lvl=idarr1[checks1[key].id];
					let txt = checks1[key].value+','+lvl;
					const arr = txt.split(",");
					let uniq = [];

					for(var i=0;i<arr.length;i++){
						if(!uniq.includes(arr[i]))
						{
							uniq.push(arr[i]);
						}
					}

					idarr1[checks1[key].id] = uniq.toString();
				}
				else
				{
					idarr1[checks1[key].id]=checks1[key].value;
				}
			}
		}

		for(var key in checks2)
		{
			if(checks2[key] !== null && checks2[key].name=='section[]')
			{
				if(idarr2.hasOwnProperty(checks2[key].id))
				{
					const lvl=idarr2[checks2[key].id];
					let txt = checks2[key].value+','+lvl;
					const arr = txt.split(",");
					let uniq = [];

					for(var i=0;i<arr.length;i++){
						if(!uniq.includes(arr[i]))
						{
							uniq.push(arr[i]);
						}
					}

					idarr2[checks2[key].id] = uniq.toString();
				}
				else
				{
					idarr2[checks2[key].id]=checks2[key].value;
				}
			}
		}
	}

	for (key in idarr1)
	{
		if(key>0)
		{
			count++;
			idarr[key]=idarr1[key];
		}
	}

	if(count>0)
	{
		this.setState({
			corearr:idarr1,
			sectionarr:idarr2,
		});
	}
	else
	{
		this.setState({ corearr:[],sectionarr:[] });
	}

}

handleChange(event){
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });
}

hasErrorFor (field) {
  return !!this.state.errors[field]
}
renderErrorFor (field) {
  if (this.hasErrorFor(field)) {
	return ( <span className='invalid-feedback'> <strong>{this.state.errors[field][0]}</strong> </span> )
  }
}

removeDuplicates(arr) {
	let unique = [];
	for(var i=0;i<arr.length;i++){
		if(unique.indexOf(arr[i]) === -1) {
			unique.push(parseInt(arr[i]));
		}
	}
	return unique;
}

componentDidMount() {
	const isAuthenticated = localStorage.getItem("isLoggedIn");
	const token = localStorage.getItem("login_token");

	const urlString = window.location.href;
	const url = new URL(urlString);
	const lastSegment = url.pathname.split('/').pop();
	const id = lastSegment;

	axios.get(`${base_url}api/checkauth?api_token=${token}`).then(response => {
		// console.log(response);
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
		// console.log(response);
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
			courseData: response.data.data?response.data.data:[],
		});
	})
	.catch(error => {
	   console.log(error.message);
    })

	// axios.get(`${base_url}api`+`/teacherclass/edit/${id}`).then(response => {
	// 	console.log("edit teacher class",response.data);
	// 	const teacherArr=response.data.data?response.data.data:[];
	// 	const class_set=(teacherArr.length>0)?teacherArr[0].class_list:'';
	// 	const course_set=(teacherArr.length>0)?teacherArr[0].course_list:'';
	// 	const section_set=(teacherArr.length>0)?teacherArr[0].section_list:'';
    //     // console.log("class_set",section_set);

	// 	if(course_set !='' && course_set !='N/A')
	// 	{
	// 		let class_arr=class_set.split(',');
	// 		let course_arr=course_set.split(',');
	// 		let section_arr=section_set.split(',');
	// 		let class_arc=[];
	// 		let course_arc=[];
	// 		let section_arc=[];
	// 		var course_chk = {};
	// 		var section_chk = {};

	// 		for(var i=0;i<class_arr.length;i++)
	// 		{
	// 			class_arc.push(parseInt(class_arr[i]));
	// 		}

	// 		for(var i=0;i<course_arr.length;i++)
	// 		{
	// 			course_arc.push(parseInt(course_arr[i]));
	// 		}

	// 		for(var i=0;i<section_arr.length;i++)
	// 		{
	// 			section_arc.push(parseInt(section_arr[i]));
	// 		}

	// 		axios.get(`${base_url}api`+`/section_class_list_by_course/${course_set}`).then(response => {
	// 			const sectionList=response.data.data?response.data.data:[];
	// 			sectionList.forEach((item) =>
	// 			{
	// 				if(course_arc.includes(item.courseId))
	// 				{
	// 					const sec_arr = item.section_ids.split(',');

	// 					for(var i=0;i<sec_arr.length;i++)
	// 					{
	// 						if(section_arc.includes(parseInt(sec_arr[i])))
	// 						{
	// 							if(section_chk.hasOwnProperty(item.class_id))
	// 							{
	// 								const lvl=section_chk[item.class_id];
	// 								let txt = section_chk[item.class_id]+','+lvl;
	// 								const arr = txt.split(",");
	// 								let uniq = [];

	// 								for(var i=0;i<arr.length;i++){
	// 									if(!uniq.includes(arr[i]))
	// 									{
	// 										uniq.push(arr[i]);
	// 									}
	// 								}

	// 								section_chk[item.class_id]=uniq.toString();
	// 							}
	// 							else
	// 							{
	// 								section_chk[item.class_id]=sec_arr[i].toString();
	// 							}

	// 						}

	// 					}

	// 					if(course_chk.hasOwnProperty(item.courseId))
	// 					{
	// 						const lvl=course_chk[item.courseId];
	// 						let txt = course_chk[item.courseId]+','+lvl;
	// 						const arr = txt.split(",");
	// 						let uniq = [];

	// 						for(var i=0;i<arr.length;i++){
	// 							if(!uniq.includes(arr[i]))
	// 							{
	// 								uniq.push(arr[i]);
	// 							}
	// 						}

	// 						course_chk[item.courseId]=uniq.toString();
	// 					}
	// 					else
	// 					{
	// 						if(class_arc.includes(item.class_id))
	// 						{
	// 							course_chk[item.courseId]=item.class_id.toString();
	// 						}
	// 					}

	// 				}
	// 			});

	// 			this.setState({
	// 				coursearr:course_arc,
	// 				corearr:course_chk,
	// 				sectionarr:section_chk,
	// 				sectionData:sectionList,
	// 				teacherData:teacherArr
	// 			});
	// 		})
	// 		.catch(err => {
	// 			 console.log(err.response.data);
	// 		})
	// 		//
	// 	}
	// 	else
	// 	{
	// 		this.setState({
	// 			teacherData:teacherArr
	// 		});
	// 	}
	// })
	// .catch(error => {
	//    console.log(error.message);
	// })

    axios.get(`${base_url}api/teacherclass/edit/${id}`).then(response => {
        console.log("edit teacher class", response.data);
        const teacherArr = response.data.data ? response.data.data : [];
        const class_set = (teacherArr.length > 0) ? teacherArr[0].class_list : '';
        const course_set = (teacherArr.length > 0) ? teacherArr[0].course_list : '';
        const section_set = (teacherArr.length > 0) ? teacherArr[0].section_list : '';

        if (course_set !== '' && course_set !== 'N/A') {
            const class_arr = class_set.split(',').map(Number);
            const course_arr = course_set.split(',').map(Number);
            const section_arr = section_set.split(',').map(Number);

            let course_chk = {};
            let section_chk = {};

            axios.get(`${base_url}api/section_class_list_by_course/${course_set}`).then(response => {
                const sectionList = response.data.data ? response.data.data : [];

                sectionList.forEach((item) => {
                    if (course_arr.includes(item.courseId)) {
                        const sec_arr = item.section_ids.split(',').map(Number);

                        sec_arr.forEach(sec_id => {
                            if (section_arr.includes(sec_id)) {
                                if (section_chk[item.class_id]) {
                                    section_chk[item.class_id] = Array.from(new Set([
                                        ...section_chk[item.class_id].split(',').map(Number),
                                        sec_id
                                    ])).toString();
                                } else {
                                    section_chk[item.class_id] = sec_id.toString();
                                }
                            }
                        });

                        if (course_chk[item.courseId]) {
                            course_chk[item.courseId] = Array.from(new Set([
                                ...course_chk[item.courseId].split(',').map(Number),
                                item.class_id
                            ])).toString();
                        } else {
                            if (class_arr.includes(item.class_id)) {
                                course_chk[item.courseId] = item.class_id.toString();
                            }
                        }
                    }
                });

                this.setState({
                    coursearr: course_arr,
                    corearr: course_chk,
                    sectionarr: section_chk,
                    sectionData: sectionList,
                    teacherData: teacherArr
                });
            }).catch(err => {
                console.log(err.response.data);
            });
        } else {
            this.setState({
                teacherData: teacherArr
            });
        }
    }).catch(error => {
        console.log(error.message);
    });

}

render() {
    const { readOnly } = this.state;
    const isLoad = this.state.isLoading;

    if (isLoad) {

    //return null;

    }

    console.log(this.state.corearr);
    console.log('*');
    console.log(this.state.sectionarr);

    let tch_name=(this.state.teacherData.length>0)?this.state.teacherData[0].emp_name:'';
    let tch_no=(this.state.teacherData.length>0)?this.state.teacherData[0].emp_no:'';
    let tch_email=(this.state.teacherData.length>0)?this.state.teacherData[0].email:'';
    let tch_mobile=(this.state.teacherData.length>0)?this.state.teacherData[0].mobile:'';
    let tch_doj=(this.state.teacherData.length>0)?this.state.teacherData[0].doj:'';

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
					<h4>Edit Assigned Class to Teacher</h4>
				</div>
			</div>
			<div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
				<ol className="breadcrumb breadcrumb-btn">
					<li><a href={`/assign_class_teacher_list`} className="btn bg-blue-soft text-blue"><i className="fa fa-angle-double-left"></i> Back to List of Assigned Classes to Teachers</a></li>
				</ol>
			</div>
		</div>
		{/****<!-- row -->****/}

		<div className="row">
			<div className="col-12">
				<div className="card">
					{/****<!--div className="card-header"><h4 className="card-title">Fee Collection Amount</h4></div-->****/}
					<div className="card-body create-user-table">
					  <div className="fee-collection">
						<div className="basic-form form-own email-form">
						  <form onSubmit={this.handleUpdate}>
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
							  <div className="form-group col-sm-6">
								<label>Enter Employee No.</label>
								<input type="text" className={`form-control input-daterange-timepicker ${this.hasErrorFor('employee_no') ? 'is-invalid' : ''}`} name="emp_no" value={(this.state.emp_no)?this.state.emp_no:tch_no} onChange={this.handleChange} placeholder="" readOnly={readOnly} title="Editing not available"/>
								{this.renderErrorFor('employee_no')}
							  </div>

							  <div className="form-group col-sm-6">
								<label>Date of Joining</label>
								<input type="date" className={`form-control input-daterange-timepicker ${this.hasErrorFor('date_join') ? 'is-invalid' : ''}`} name="doj" value={(this.state.doj)?this.state.doj:tch_doj} onChange={this.handleChange} placeholder="dd/mm/yy" readOnly={readOnly} title="Editing not available"/>
								{this.renderErrorFor('date_join')}
							  </div>

							  <div className="form-group col-sm-4">
								<label>Employee Name</label>
								<input type="text" className={`form-control ${this.hasErrorFor('employee_name') ? 'is-invalid' : ''}`} name="emp_name" value={(this.state.emp_name)?this.state.emp_name:tch_name} onChange={this.handleChange} placeholder="" readOnly={readOnly} title="Editing not available"/>
								{this.renderErrorFor('employee_name')}
							  </div>

							  <div className="form-group col-sm-4">
								<label>Mobile No</label>
								<input type="text" className={`form-control ${this.hasErrorFor('mobile') ? 'is-invalid' : ''}`} name="mobile" value={(this.state.mobile)?this.state.mobile:tch_mobile} onChange={this.handleChange} placeholder="" readOnly={readOnly} title="Editing not available"/>
								{this.renderErrorFor('mobile')}
							  </div>

							  <div className="form-group col-sm-4 mrb-30">
								<label>Email ID</label>
								<input type="text" className={`form-control ${this.hasErrorFor('email') ? 'is-invalid' : ''}`} name="email" value={(this.state.email)?this.state.email:tch_email} onChange={this.handleChange} placeholder="" readOnly={readOnly} title="Editing not available"/>
								{this.renderErrorFor('email')}
							  </div>

								<div className="form-group col-md-12">
								  {/***<!--label>Select Any one Option</label-->****/}

								  <div className="form-group mrb-0">
									<label>Course Name</label>
								  </div>

								  <div className="Schedule-subject">
									{/* <h5>Select Course</h5> */}
									<div className="form-checkbox-grid">
									{this.state.courseData.map( (item,key) => {
									return (
										<div key={key} className="form-check form-checkbox col-md-4">
                                            <div className="bg-padd">
                                                <input type="checkbox" className="form-check-input" name="course_id" value={item.courseId} checked={(this.state.coursearr.includes(parseInt(item.courseId)))?true:false} onChange={this.handleCourse} ref={node =>this.state.courselst.push(node)}/>
                                                <label className="form-check-label" htmlFor="check1">{item.courseName}</label>
                                            </div>
										</div>
										)
										})}
									</div>

									{/* <div className="form-checkbox-grid select-grid-bg">
										<div className="form-check form-checkbox col-md-2">
										  <input type="checkbox" className="form-check-input" name="course_id" checked={(this.state.coursearr.includes(parseInt(0)))?true:false} value="0" onChange={this.checkAllCourse} ref={node =>this.state.courselst.push(node)}/>
										  <label className="form-check-label" htmlFor="check1">Check All</label>
										</div>
									</div> */}

							 </div>
							</div>
							{/* sectiondata */}
                            {
							(this.state.sectionData.length >0)?(
                                <div className="form-group col-md-12 mrb-0">
                                    <div className="print-id-card-table">
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-striped verticle-middle table-responsive-sm">
                                            <thead>
                                                <tr>
                                                    <th scope="col"><div className="form-checkbox"><input type="checkbox" className="form-check-input" name="course[]" checked={(this.state.corearr.hasOwnProperty(0))?true:false} value="0" onChange={this.checkAllSection} /></div></th>
                                                    <th scope="col">Course Name</th>
                                                    <th scope="col">Class Name</th>
                                                    <th scope="col">Section Name</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {
                                            this.state.sectionData.map((item,key) => {
                                                const section_arr1 = item.section_ids.split(",");
                                                const section_arr2 = item.section_names.split(",");
                                                const arc=item.courseId+item.class_id;

                                                let cons = [];
                                                for (let i=0;i<section_arr1.length;i++)
                                                {
                                                    if(section_arr2[i]!="")
                                                    {
                                                        cons.push(<div key={i} className="form-check form-checkbox"><input type="checkbox" className="form-check-input" checked={(this.state.sectionarr.hasOwnProperty(item.class_id) && (this.state.sectionarr[item.class_id].match(new RegExp("(?:^|,)"+section_arr1[i]+"(?:,|$)"))))?true:false} id={item.class_id} name="section[]" value={section_arr1[i]} onChange={this.handleSection} ref={node =>this.state.sectionlst.push(node)}/><label className="form-check-label" htmlFor="check1">{section_arr2[i]}</label></div>);

                                                    }
                                                    else
                                                    {
                                                        cons.push(<div key={i} className="form-check form-checkbox"><label className="form-check-label" htmlFor="check1">{'N/A'}</label></div>);
                                                    }

                                                }

                                                return (
                                                    <tr key={key}>
                                                    <td>
                                                    <div className="form-checkbox"><input type="checkbox" className="form-check-input" name="course[]" checked={(this.state.corearr.hasOwnProperty(item.courseId) && (this.state.corearr[item.courseId].match(new RegExp("(?:^|,)"+item.class_id+"(?:,|$)"))))?true:false} id={item.courseId} value={item.class_id} onChange={this.handleCourseRow} ref={node =>this.state.classarr.push(node)}/>
                                                    </div>
                                                    </td>
                                                    <td>{item.courseName}</td>
                                                    <td>{item.class_name}</td>
                                                    <td>
                                                    {cons}
                                                    </td>
                                                </tr>
                                                )

                                                })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                    </div>
                                </div>):null
						    }

						  <div className="col-sm-12">
							<div className="submit-btn form-own">
							  <input type="submit" value="Save" className="btn btn-primary"/>
							</div>
						  </div>

						</div>{/****<!--/ form-row -->****/}
					  </form>
					</div>

					  </div>{/****<!--/ fee-collection -->****/}
					</div>{/****<!--/ card-body -->****/}
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

export default AssignTeacherClassEdit;
