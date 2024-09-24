import React, { Component } from "react";  
import Script from "@gumgum/react-script-tag";  
import Copyright from "../basic/Copyright"; 
import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

const base_url=location.protocol+'//'+location.host+'/';			


class PrintIdCard extends Component {
  constructor() {
    super();
    this.state = {
      showError: false,
      showSuccess:false,
	  isLoading:true,	
      messgae:'',
      remark:'',
      courseName:'',
      courseId:'',
	  print_div:'',
	  preview_div:'',	  				
	  laymsg:'',  	
	  coursearr:[],  
	  courselst:[],	
	  sectionlst:[],			
	  corearr:[],  
	  classarr:[],  
	  sectionarr:[], 	
      courseList:[],
      classList:[],
      courseSelect:[],
      sectionList:[],
      studentList:[],
	  studentreg:[],
	  layarr:[],  
	  studentlst:[],		
      classSelect:[],
      sectionSelect:[],		
      class_bool:[],
      section_bool:[],
	  sectionData:[],			
	  studentData:[],  	
	  layoutData:[],	 	  		
      showSec:false, 
      layerr:false 
    };
   
    this.handleTemplate = this.handleTemplate.bind(this);		          
    this.checkAllCourse = this.checkAllCourse.bind(this);  
    this.handleCourseCheck = this.handleCourseCheck.bind(this);		 		     
	this.handleSection = this.handleSection.bind(this);	
	this.checkAllSection = this.checkAllSection.bind(this);  	
	this.handleCourseRow = this.handleCourseRow.bind(this);	  		
	this.handleStudent = this.handleStudent.bind(this);	  
	this.handleRefresh = this.handleRefresh.bind(this);	  
	this.handleLayout = this.handleLayout.bind(this);	 	 
	this.handlePrint = this.handlePrint.bind(this);	 	
	this.handleAllStudent = this.handleAllStudent.bind(this);	  
	
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
		this.setState({coursearr:unique_arr,print_div:false,corearr:[],sectionarr:[],studentreg:[],sectionData:[],studentData:[]});    		
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
		let list1= JSON.stringify(idarr); 
		let list2= JSON.stringify(idarr2);    
		
		axios.get(`${base_url}api`+`/printid/getstudentlist/${list1}/${list2}`)    
		 .then(response => { 			
			const studentarr=response.data.data?response.data.data:[];	
			this.setState({
				corearr:idarr1,		
				sectionarr:idarr2,  
				studentData: studentarr,
				print_div:(studentarr.length>0)?false:true, 	
			});   	
		})
		.catch(err => {  	   
			 console.log(err.response.data);						
		}) 
	}
	else
	{		
		this.setState({studentreg:[],corearr:[],sectionarr:[],studentData:[],print_div:false});    	
	}		
	
}    

handleCourseCheck(event){		
	
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
		let list1= JSON.stringify(idarr); 
		let list2= JSON.stringify(checks2); 
		
		axios.get(`${base_url}api`+`/printid/getstudentlist/${list1}/${list2}`)    
         .then(response => { 			
			const studentarr=response.data.data?response.data.data:[];	
			this.setState({
				corearr:idarr,
				sectionarr:chkarr,    
				studentData: studentarr,
				print_div:(studentarr.length>0)?false:true, 	
			});   	
		})
		.catch(err => {  	   
			 console.log(err.response.data);				
		})    
	}
	else
	{
		this.setState({print_div:false,corearr:idarr,sectionarr:chkarr,studentData:[]});     
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
		let list1= JSON.stringify(chkarr); 
		let list2= JSON.stringify(idarr);  
		
		axios.get(`${base_url}api`+`/printid/getstudentlist/${list1}/${list2}`)    
		 .then(response => { 			
			const studentarr=response.data.data?response.data.data:[];	
			this.setState({
				corearr:chkarr,		
				sectionarr:idarr,  
				studentData: studentarr,
				print_div:(studentarr.length>0)?false:true, 	
			});   	  
			
		})
		.catch(err => {  	   
			 console.log(err.response.data);						
		}) 
	}
	else
	{		
		this.setState({studentreg:[],corearr:[],sectionarr:[],studentData:[],print_div:false});    	
	}	  		

}    
  
handleStudent(event){		 			
	
	let opt = event.target.name; 				
	let check = event.target.checked;  
    let check_val = event.target.value;  		
	let checks=this.state.studentreg;   
	let regs=this.state.studentlst;   
    
	const idarr =[];  	
	const idset =[];   
	let unique_arr = [];  
	
	for(var key in regs)   
	{  			 
		if(regs[key] !== null)
		{
			if(regs[key].name=='student[]')      
			{
				idset.push(parseInt(regs[key].value));  
			}
		}
	} 
	
	if(check)
	{
		for(var key in checks) 
		{  			 
			idarr.push(checks[key]);   
		}  

		idarr.push(check_val);   	 		
	} 
	else
	{
		for(var key in checks) 
		{  			
			if(checks[key] !=check_val && checks[key] >0)     
			{			 					
				idarr.push(checks[key]);   							
			}
		}   		
	}				
	
	unique_arr=this.removeDuplicates(idarr);   

	if(unique_arr.length==parseInt((idarr.length)-1))	  
	{
		unique_arr.push(0);		
	}  
	 	 
	this.setState({studentreg:unique_arr}); 	  	  		

  }
  
  
handleAllStudent(event){		 			
	
	let opt = event.target.name; 				
	let check = event.target.checked;  
    let check_val = event.target.value;  		
	let checks=this.state.studentlst;   
    
	const idarr =[];  	
	let unique_arr = [];  
	
	if(check)
	{
		for(var key in checks) 
		{  			 
			if(checks[key] !== null)
			{
				if(checks[key].name=='student[]')      
				{
					idarr.push(parseInt(checks[key].value));  
				}
			}
		}  

		idarr.push(parseInt(check_val));   	 		
	} 

	unique_arr=this.removeDuplicates(idarr);  	 
	this.setState({studentreg:unique_arr});   	  	  		

  }
  
handleRefresh(event){	
	this.setState({
		studentreg:[]   	 
	}); 
} 

handlePrint(event){	
	let layouts=this.state.layarr; 
	let checks=this.state.studentreg;    	
	const lay1=(this.state.portmode)?this.state.portmode:'';	
	const lay2=(this.state.scapemode)?this.state.scapemode:''; 		
	
	const layarc =[];   
	const idarr =[]; 
	const temparr ={};		
	
	for(var key in layouts) 
	{  			 
		layarc.push(layouts[key]);   
	} 
	
	for(var key in checks) 
	{
		if(checks[key]!=0)	
		{
			idarr.push(checks[key]);   	
		}  		
	} 
	
	var err=0; 	

	for(var i=0;i<layarc.length;i++)	
	{
		if(layarc[i]=='portrait' && lay1!='')   
		{
			temparr['portrait']=lay1; 
		}
		else if(layarc[i]=='landscape' && lay2!='')   
		{
			temparr['landscape']=lay2; 
		}
		else
		{
			err++;    
		}
	}
	
	if(idarr.length==0)
	{
		this.setState({layerr:true,laymsg:"Please select student!!"}); 	
	}
	else if(layarc.length==0)		
	{
		this.setState({layerr:true,laymsg:"Please select a layout!!"}); 	
	}
	else if(err>0)
	{
		this.setState({layerr:true,laymsg:"Please select a template!!"}); 	
	}
	else
	{		
		let list1= JSON.stringify(temparr); 
		let list2= JSON.stringify(idarr);   
		
		axios.get(`${base_url}api`+`/printid/getprints/${list1}/${list2}`)    
         .then(response => { 			
			console.log(response);	
			 var receipt =(typeof(response.data.data)!='object')?response.data.data:'';    				 
			 if(receipt !='')  
			 {
				let a = document.createElement("a"); 
				let url = base_url+'idcards/'+layarc.toString()+'/'+receipt;   		
				a.target='_blank';   
				a.href = url;
				document.body.appendChild(a);					
				a.click();
				document.body.removeChild(a);   	
			 }  	
			
			// const studentarr=response.data.data?response.data.data:[];	
			this.setState({
				layerr:false,
				laymsg:""
			}); 		
		})
		.catch(err => {  	   
			 console.log(err.response.data);				
		})    
		
	}  	
	
}      

handleLayout(event){	
	let opt = event.target.name; 				
	let check = event.target.checked;  
    let check_val = event.target.value;  		
	let checks=this.state.layarr;     
    
	const idarr =[];  	
	const idset =[];   
	let unique_arr = [];    
	
	idarr.push(check_val);   
	
	if(idarr.length>0)
	{
		var list=idarr.toString();     
		axios.get(`${base_url}api`+`/printid/getlayouts/${list}`).then(response => { 
				this.setState({ 							
					layoutData: response.data.data?response.data.data:[],			
					layarr:idarr  
				});   
			
		})
		.catch(err => {  	   
			 console.log(err.response.data);		
		})  
	}
	else
	{
		this.setState({layarr:idarr}); 		   	
	}
	
} 

handleTemplate(event){	
   event.preventDefault();	  	 		         
	
   const id = event.target.value; 
   const inp = event.target.name;  	
   
   if(id >0)
   {
	   axios.get(`${base_url}api`+`/printid/getpreview/${id}`).then(response => {    
	   
		this.setState({    				
				[inp]:id,
				preview_div:response.data.data?response.data.data:''   			
			}); 
		})
		.catch(error => {  	   
		   console.log(error.message); 	
		})    
   }
   else
   {
		this.setState({   			
			[inp]:id,
			preview_div:''  	
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


    axios.get(`${base_url}api`+'/class/getcourses').then(res => 
	{  
		 this.setState({ courseList:(res.data.data.length>0)?res.data.data:[]});          
    })      
    
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
render() {
	
const isLoad = this.state.isLoading;    			

if (isLoad) {  

//return null;  		
			 		
}   	
	  
    const sectionArr=this.state.sectionData;  
	const studentArr=this.state.studentData;  
	const templateArr=this.state.layoutData;      
    
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
								<h4>Student Id Card</h4>
							</div>
						</div>
						<div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
							<ol className="breadcrumb">
								{/*****<li><a href="./className-wise-subjects-list.html" className="btn bg-blue-soft text-blue"><i className="fa fa-angle-double-left"></i> Back to className Wise Subjects List</a></li>****/}  
							</ol>
						</div>
					</div>
					   {/****** row ******/}  
					
					<div className="row">
					  <div className="col-xl-12 col-xxl-12">
						<div className="card">
						  {/*****<div className="card-header"><h4 className="card-title">All className List</h4></div>****/}    
						  <div className="card-body">
							
							<div className="basic-form form-own print-id-card">
							  <form>
								<div className="form-row">							  
								  <div className="form-group col-md-12">		
								  <div className="Schedule-section">	
									<h5>Select Course</h5>   
									<div className="form-checkbox-grid">
									{this.state.courseList.map( (item,key) => {		
									return (	
										<div key={key} className="form-check form-checkbox col-md-2">
										  <input type="checkbox" className="form-check-input" name="course_id" value={item.courseId} checked={(this.state.coursearr.includes(parseInt(item.courseId)))?true:false} onChange={this.handleCourseCheck} ref={node =>this.state.courselst.push(node)}/>
										  <label className="form-check-label" htmlFor="check1">{item.courseName}</label>
										</div>   										
										)    
										})}   
									</div>
									
									<div className="form-checkbox-grid select-grid-bg">
										<div className="form-check form-checkbox col-md-2">  
										  <input type="checkbox" className="form-check-input" name="course_id" checked={(this.state.coursearr.includes(parseInt(0)))?true:false} value="0" onChange={this.checkAllCourse} ref={node =>this.state.courselst.push(node)}/>
										  <label className="form-check-label" htmlFor="check1">Check All</label>  
										</div>
									</div>
									
								 </div>	 
								{/****** print-couse-list ******/}  
								  </div>
								 {
								 (sectionArr.length >0)?( 	
								  <div className="form-group col-md-12">
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
											sectionArr.map((item,key) => { 
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
													  <div className="form-checkbox"><input type="checkbox" className="form-check-input" name="course[]" checked={(this.state.corearr.hasOwnProperty(item.courseId) && (this.state.corearr[item.courseId].match(new RegExp("(?:^|,)"+item.class_id+"(?:,|$)"))))?true:false} id={item.courseId} value={item.class_id} onChange={this.handleCourseRow} ref={node =>this.state.classarr.push(node)}/></div>    	
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
								{
								(studentArr.length >0)?( 	
								  <div className="form-group col-md-12 mrb-0">
									<h5>ID Card Layout Style</h5>
									{
								  (this.state.layerr)?(<div className="alert alert-danger" style={{color:"brown"}}>{this.state.laymsg}</div>):null  
								  } 
								  </div>
								 ):null 									  
								}  	 
								 {
								  (studentArr.length >0)?( 
								  <div className="form-group col-md-7">
									<div className="portrait-box mrb-20">
									  <div className="form-check settings-form-radio">	
										<input type="radio" className="form-check-input" name="layout" checked={(this.state.layarr.includes('portrait'))?true:false} value="portrait" onChange={this.handleLayout} />		
										<label className="form-check-label" htmlFor="check1">Portrait</label>
									  </div>
									
									  <div className="form-group">
										<select className="form-control" name="portmode" onChange={this.handleTemplate}><option value="">Select Template</option>  
											{ templateArr.map((item,i) => {  
												if(item.mode=='portrait')			
												{
													return(
														<option key={i} value={item.id}>{item.name}</option>   		
													);	
												}												
											})} 
										</select>
									  </div>
									</div>
									
									<div className="portrait-box">
									  <div className="form-check settings-form-radio">	    
										<input type="radio" className="form-check-input" name="layout" checked={(this.state.layarr.includes('landscape'))?true:false} value="landscape" onChange={this.handleLayout} />		
										<label className="form-check-label" htmlFor="check1">Landscape</label>
									  </div>
									
									  <div className="form-group">
										<select className="form-control" name="scapemode" onChange={this.handleTemplate}><option value="">Select Template</option>		
											{ templateArr.map((item,i) => {  
												if(item.mode=='landscape')	
												{
													return(
														<option key={i} value={item.id}>{item.name}</option>   
													);	
												}												
											})} 
										</select>
									  </div>
									</div>
								  </div>
								  ):null 									  
								}
								
								{
								(studentArr.length >0)?( 
								  <div className="form-group col-md-3">
									<div id="id-card">    
									{
                                     (this.state.preview_div)?(<div dangerouslySetInnerHTML={{__html:this.state.preview_div?this.state.preview_div:''}}/>):<figure><img src={base_url+"images/id-card-dummy.jpg"} alt=""/>
									 </figure>   								 
									} 	  
									</div>	   
								  </div>
								  ):null 									  
								}  		
    							  {
								  (this.state.print_div)?(<div className="form-group col-md-12 alert alert-danger" style={{color:"brown"}}>No Record found</div>):<div className="form-group col-md-2"></div>			
								  }  				
								  {
								  (studentArr.length >0)?( 	
								  <div className="form-group col-md-12 mrb-0">
									<div className="print-id-card-table">
									  <div className="table-responsive">
										<table className="table table-bordered table-striped verticle-middle table-responsive-sm">
											<thead>
												<tr>
													<th scope="col"><div className="form-checkbox"><input type="checkbox" className="form-check-input" name="student[]" checked={(this.state.studentreg.includes(0))?true:false} value="0" onChange={this.handleAllStudent} ref={node =>this.state.studentlst.push(node)}/></div>
													</th>		
													<th scope="col">Student Name</th>
													<th scope="col">Adm. No.</th>
													<th scope="col">Date of Birth</th>
													<th scope="col">className</th>
													<th scope="col">Gender</th>
													<th scope="col">Father Name</th>
													<th scope="col">Mother Name</th>
													<th scope="col">Mobile No</th>
												</tr>
											</thead>
											<tbody>
											{studentArr.map((item,key) => (      
												<tr key={key}>     
													<td>
													  <div className="form-checkbox"><input type="checkbox" className="form-check-input" name="student[]" checked={(this.state.studentreg.includes(item.id))?true:false} value={item.id} onChange={this.handleStudent} ref={node =>this.state.studentlst.push(node)} /></div>  
													</td>  		
													<td className="sorting_1">
													<img className="user-profile" src={(item.student_image=='')?'./images/student.jpg':base_url+'uploads/student_image/'+item.student_image}/><span className="name-span">{item.student_name}</span>
													</td>		
													<td>{item.admission_no}</td> 		
													<td>{item.dob}</td>    				
													<td>{item.className}</td>
													<td>{item.gender}</td>		
													<td>{item.father_name}</td>  
													<td>{item.student_name}</td>		
													<td>{item.mobile}</td>   
												</tr>  												
												))}     	
											</tbody>
										</table>
										</div>
									  </div>
								  </div>
								  ):null 									  
								}  	
								</div> 	
								{
								(studentArr.length >0)?( 	
								<div className="profile-tab-btn text-left">	
								  <input type="button" className="btn btn-primary btn-sm mx-1" onClick={this.handleRefresh}  value="Refresh Students List" />  
								  <input type="button" className="btn btn-primary btn-sm mx-1" onClick={this.handlePrint}  value="Print Student Id Card" />					
								</div>  
								):null 									  
								}  	
							  </form>
							</div>
							
						  </div>
						</div>
					  </div>  
					</div>{/******* row *****/}   		
					
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

export default PrintIdCard;   				