import React, { Component } from "react";  

import Script from "@gumgum/react-script-tag";

import Copyright from "../basic/Copyright";

import Preloader from "../basic/Preloader";
import HeaderPart from "../layout/HeaderPart";

class PrintIdCard extends Component {
  constructor() {
    super();
    this.state = {
      showError: false,
      showSuccess:false,
      messgae:'',
      remark:'',
      courseName:'',
      courseId:'',
      courseList:[],
      classList:[],
      courseSelect:[],
      sectionList:[],
      studentList:[],
      classSelect:[],
      sectionSelect:[],
      course_bool:[],
      class_bool:[],
      section_bool:[],
      showSec:false
     
    };
   
    this.handleChangeEvent = this.handleChangeEvent.bind(this);
    this.getClasslist = this.getClasslist.bind(this);
    this.getClasslist2 = this.getClasslist2.bind(this);
    this.handleClassSelect = this.handleClassSelect.bind(this);
   
    this.handleCourseSelect = this.handleCourseSelect.bind(this);

    this.handleSectionSelect = this.handleSectionSelect.bind(this);
  
  }


  handleSectionSelect(event){

    var index=event.target.attributes.getNamedItem('data-index').value;
    console.log(index)
    if(event.target.checked){
    var newArray = this.state.sectionSelect.slice();    
    newArray.push(parseInt(event.target.value));   
    this.setState({sectionSelect:newArray})

    var array2= [...this.state.section_bool]
    array2[index] = true;
    this.setState({ section_bool: array2 });

    }
    else{
        var newArray2 = [...this.state.sectionSelect]; // make a separate copy of the array
       
           
              newArray2.splice(index, 1);
              this.setState({sectionSelect: newArray2});

              var array2= [...this.state.section_bool]
    array2[index] = false;
    this.setState({ section_bool: array2 });
    }
    console.log(this.state.sectionSelect)

    console.log(this.state.sectionSelect.includes('2'))

  }

  handleClassSelect(event){

    var index=event.target.attributes.getNamedItem('data-index').value;
    console.log(index)
    if(event.target.checked){
    var newArray = this.state.classSelect.slice();    
    newArray.push(parseInt(event.target.value));   
    this.setState({classSelect:newArray})

    var array2= [...this.state.class_bool]
    array2[index] = true;
    this.setState({ class_bool: array2 });

    }
    else{
        var newArray2 = [...this.state.classSelect]; // make a separate copy of the array
       
           
              newArray2.splice(index, 1);
              this.setState({classSelect: newArray2});

              var array2= [...this.state.class_bool]
    array2[index] = false;
    this.setState({ class_bool: array2 });
    }
    console.log(this.state.classSelect)

    console.log(this.state.classSelect.includes('2'))

  }



  handleCourseSelect(event){
    var index=event.target.attributes.getNamedItem('data').value;
    if(event.target.checked){
    var newArray = this.state.courseSelect.slice();    
    var array2= [...this.state.course_bool]
    array2[index] = true;
    this.setState({ course_bool: array2 });
    newArray.push(parseInt(event.target.value));   
    this.setState({courseSelect:newArray})

    this.setState({showSec:true})

    }
    else{
        var newArray2 = [...this.state.courseSelect]; // make a separate copy of the array
        var array2= [...this.state.course_bool]
        array2[index] = false;
        this.setState({ course_bool: array2 });
        var index2 = this.state.courseSelect.indexOf(parseInt(event.target.value))
           
              newArray2.splice(index2, 1);
              this.setState({courseSelect: newArray2});
    }
    console.log(this.state.courseSelect)

    console.log(this.state.courseSelect.includes('2'))

  }
 

  handleChangeEvent(event){
    event.preventDefault();
    console.log("gdtyy");
   
    console.log(event.target);
    console.log(event.target.checked);
    if (event.target.name == 'courseId'){
        var array2= [...this.state.course_bool]
        var key=event.target.attributes.getNamedItem('data').value;

        if(event.target.checked){
          
            array2[key] = true;
            this.setState({ course_bool: array2 });
            this.setState({ [event.target.name]: event.target.value },this.getClasslist);
  
          }
          else{
          
            array2[key] = false;
            this.setState({ course_bool: array2 });
            this.setState({ [event.target.name]: event.target.value },this.getClasslist2);

            console.log(this.state.classList);

        

          }
          

    

    }

 

   
        
        
    else{

      this.setState({ [event.target.name]: event.target.value });
    }

    this.setState({ showSec: true });
     console.log(this.state.courseId);
    
     
    }
  
    getClasslist(event){
       // this.setState({classList: []});
        this.setState({classSelect: []});
        axios.get(`http://127.0.0.1:8000/api/class_list_by_id/${this.state.courseId}`)  
        .then(res => {  
         console.log(res.data);
         if(res.data.status == true){

            this.setState({ classList: this.state.classList.concat(res.data.data) })
           // this.setState({ classList:res.data.data});
            //window.location.href = "http://127.0.0.1:8000/users";
      
            console.log(this.state.classList);

            
         }
        
        
        })  
      }

      getClasslist2(event){
         // this.setState({classList: []});
         this.setState({classSelect: []});
         axios.get(`http://127.0.0.1:8000/api/class_list_by_id/${this.state.courseId}`)  
         .then(res => {  
          console.log(res.data);
          if(res.data.status == true){
 
             this.setState({ remark: this.state.status })
            // this.setState({ classList:res.data.data});
             //window.location.href = "http://127.0.0.1:8000/users";
       
             console.log(this.state.classList);
 
             
          }
         
         
         })  
       
      }

  componentDidMount() {
 
   

    axios.get(`http://127.0.0.1:8000/api/course_list`)  
    .then(res => {  
     console.log(res.data);
     if(res.data.status == true){
        this.setState({ courseList:res.data.data});
        //window.location.href = "http://127.0.0.1:8000/users";

        console.log(this.state.courseList);

        for (let i = 0; i < res.data.data.length; i++) {
            this.state.course_bool[i] = false;
        } 
     }
    
    
    })  


    axios.get(`http://127.0.0.1:8000/api/class_list`)  
    .then(res => {  
     console.log(res.data);
     if(res.data.status == true){
        this.setState({ classList:res.data.data});
        //window.location.href = "http://127.0.0.1:8000/users";

        console.log(this.state.courseList);

        for (let i = 0; i < res.data.data.length; i++) {
            this.state.class_bool[i] = true;
            this.state.classSelect[i] = res.data.data[i].classId;
          
            
        } 
     }
    
   
    })  


    axios.get(`http://127.0.0.1:8000/api/section_list`)  
    .then(res => {  
     console.log(res.data);
     if(res.data.status == true){
        this.setState({ sectionList:res.data.data});
        //window.location.href = "http://127.0.0.1:8000/users";

        console.log(this.state.courseList);
        for (let i = 0; i < res.data.data.length; i++) {
            this.state.section_bool[i] = true;
            this.state.sectionSelect[i] = res.data.data[i].sectionId;
        } 
     }
    
     console.log('after');
    console.log(this.state.classSelect)
    })  



    axios.get(`http://127.0.0.1:8000/api/student_list`)  
    .then(res => {  
     console.log(res.data);
     if(res.data.status == true){
        this.setState({ studentList:res.data.data});
        //window.location.href = "http://127.0.0.1:8000/users";

        console.log(this.state.courseList);
     }
    
    
    })  

    
}
  render() {
    
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
                {/*li><a href="./class-wise-subjects-list.html" class="btn bg-blue-soft text-blue"><i class="fa fa-angle-double-left"></i> Back to Class Wise Subjects List</a></li*/}
              </ol>
            </div>
          </div>
          {/* row */}
          <div className="row">
            <div className="col-xl-12 col-xxl-12">
              <div className="card">
                {/*div class="card-header"><h4 class="card-title">All Class List</h4></div*/}
                <div className="card-body">
                  <div className="basic-form form-own print-id-card">
                    <form>
                      <div className="form-row">							  
                        <div className="form-group col-md-12">
                          <h5>Select Course Name</h5>
                          {/*label>Select Subjects from the list showing below && then Click Add Button </label*/}
                          <div className="print-couse-list">
                            <div className="form-checkbox-grid">
                            {this.state.courseList.map( (item, key) => {
                                return (
                              <div className="form-check form-checkbox col-md-3">
                                <div className="bg-padd">
                                  <input type="checkbox" className="form-check-input" id="check1" name="courseId" value={item.courseId} checked={this.state.course_bool[key]} data={[key]} onClick={this.handleCourseSelect}/>
                                  <label className="form-check-label" htmlFor="check1"> {item.courseName}</label>
                                </div>
                              </div>

)
})}
                             
                             
                            </div>
                          </div>{/* print-couse-list */}
                        </div>

                       { this.state.showSec  ?
                        <div className="form-group col-md-12">
                          <div className="print-id-card-table">
                            <div className="table-responsive">
                              <table className="table table-bordered table-striped verticle-middle table-responsive-sm">
                                <thead>
                                  <tr>
                                    <th scope="col"><div className="form-checkbox"><input type="checkbox" className="form-check-input" id="check1" defaultValue /></div></th>
                                    <th scope="col">Course Name</th>
                                    <th scope="col">Class Name</th>
                                    <th scope="col">Section Name</th>
                                  </tr>
                                </thead>
                                <tbody>

                                {this.state.classList.map( (item, key) => {
                                return (

                                    this.state.courseSelect.includes(item.courseId)  ?
                                  <tr>
                                    <td>
                                      <div className="form-checkbox"><input type="checkbox" className="form-check-input" id="check1" checked={this.state.class_bool[key]} value={item.courseId} onClick={this.handleClassSelect}  data-index={key}/></div>
                                    </td>
                                    <td>Pre - Primary</td>
                                    <td>{item.className}</td>
                                    <td>
                                    {this.state.sectionList.map( (item2, key2) => {
                                         return (
                                            item.classId == item2.classId ?        
                                      <div className="form-check form-checkbox"><input type="checkbox" className="form-check-input" checked={this.state.section_bool[key2]} id="check1" value={item2.sectionId} data-index={key2} onClick={this.handleSectionSelect} /><label className="form-check-label" htmlFor="check1">{item2.sectionName}</label></div>
                                     :null
                                      )
                                })}
                                      </td>
                                  </tr>
                                  :null
                                  )
                                })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>

                        :null }

{ this.state.showSec  ?
                        <div className="form-group col-md-12 mrb-0">
                          <h5>ID Card Layout Style</h5>
                        </div>

                        :null }

{ this.state.showSec  ?

                        <div className="form-group col-md-7">
                          <div className="portrait-box mrb-20">
                            <div className="form-check form-checkbox">
                              <input type="radio" className="form-check-input" id="check1" defaultValue />
                              <label className="form-check-label" htmlFor="check1">Portrait</label>
                            </div>
                            <div className="form-group">
                              <select className="form-control" id="classid" name="classid" onchange="FillSections()"><option value>Select Template</option><option value>Template 1</option><option value>Template 2</option><option value>Template 3</option></select>
                            </div>
                          </div>
                          <div className="portrait-box">
                            <div className="form-check form-checkbox">
                              <input type="radio" className="form-check-input" id="check1" defaultValue />
                              <label className="form-check-label" htmlFor="check1">Landscape</label>
                            </div>
                            <div className="form-group">
                              <select className="form-control" id="classid" name="classid" onchange="FillSections()"><option value>Select Template</option><option value>Template 4</option><option value>Template 5</option></select>
                            </div>
                          </div>
                        </div>
                        :null }

{ this.state.showSec  ?
                        <div className="form-group col-md-3">
                          <div id="id-card">
                            <figure><img src="./images/id-card-dummy.jpg" alt="" /></figure>
                          </div>
                        </div>
                        :null }
                        { this.state.showSec  ?
                        <div className="form-group col-md-2"> </div>

                        :null }


                        { this.state.showSec  ?
                        <div className="form-group col-md-12 mrb-0">
                          <div className="print-id-card-table">
                            <div className="table-responsive">
                           { this.state.courseSelect.length > 0  ?
                              <table className="table table-bordered table-striped verticle-middle table-responsive-sm">
                                <thead>
                                  <tr>
                                    <th scope="col"><div className="form-checkbox"><input type="checkbox" className="form-check-input" id="check1" defaultValue /></div></th>
                                    <th scope="col">Student Name</th>
                                    <th scope="col">Adm. No.</th>
                                    <th scope="col">Date of Birth</th>
                                    <th scope="col">Class</th>
                                    <th scope="col">Gender</th>
                                    <th scope="col">Father Name</th>
                                    <th scope="col">Mother Name</th>
                                    <th scope="col">Mobile No</th>
                                  </tr>
                                </thead>
                                <tbody>
                                {this.state.studentList.map( (item, key) => {
                                return (
                                    
                                    this.state.courseSelect.includes(item.course_id)  ?

                                    this.state.classSelect.includes(item.class_id)  ?

                                    this.state.sectionSelect.includes(item.section_id)  ?
                                  <tr>
                                    <td>
                                      <div className="form-checkbox"><input type="checkbox" className="form-check-input" id="check1" defaultValue /></div>
                                    </td>
                                    <td className="sorting_1"><img className="user-profile" src="./images/student.jpg" /> <span className="name-span">{item.student_name}</span></td>
                                    <td>{item.admission_no}</td>
                                    <td>{item.dob}</td>
                                    <td>{item.classId}</td>
                                    <td>{item.gender}</td>
                                    <td>{item.father_name}</td>
                                    <td>{item.mother_name}</td>
                                    <td>{item.mobile}</td>
                                  </tr>
                                  : null

                                  : null

                                  : null
                                  )
                                })}
                                </tbody>
                              </table>
                              : null }
                            </div>
                          </div>
                        </div>

                        :null }
                      </div>{/*/ form-row */}
                      { this.state.showSec  ?
                     <div>
                    
                     <input type="submit" className="btn btn-primary" value="Refresh Students List" /> &nbsp;
                      <input type="submit" className="btn btn-primary" value="Print Student Id Card" />
                    

                     </div>
                      :null }
                      </form>
                  </div>
                </div>
              </div>
            </div>  
          </div>{/*/ row */}
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