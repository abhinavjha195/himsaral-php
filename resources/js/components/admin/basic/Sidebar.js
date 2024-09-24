import React, { Component } from 'react';

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
          userType: localStorage.getItem("login_user")
        };
    }

  render() {
    const { userType } = this.state;
	  let path_name = window.location.pathname;

		if(path_name.match(/^\/class_list/) || path_name.match(/^\/class_add/) || path_name.match(/^\/class_edit/))
		{
			var main_menu ='admission';
			var sub_menu ='admission_master';
			var tree_menu ='class';
			var leaf_menu ='';
		}
		else if(path_name.match(/^\/course_list/) || path_name.match(/^\/course_add/) || path_name.match(/^\/course_edit/))
		{
			var main_menu ='admission';
			var sub_menu ='admission_master';
			var tree_menu ='course';
			var leaf_menu ='';
		}
		else if(path_name.match(/^\/section_list/) || path_name.match(/^\/section_add/) || path_name.match(/^\/section_edit/))
		{
			var main_menu ='admission';
			var sub_menu ='admission_master';
			var tree_menu ='section';
			var leaf_menu ='';
		}
		else if(path_name.match(/^\/subject_list/) || path_name.match(/^\/subject_add/) || path_name.match(/^\/subject_edit/))
		{
			var main_menu ='admission';
			var sub_menu ='admission_master';
			var tree_menu ='subject_master';
			var leaf_menu ='subject';
		}
		else if(path_name.match(/^\/class_wise_subject_list/) || path_name.match(/^\/class_wise_subject_create/) || path_name.match(/^\/class_wise_subject_edit/))
		{
			var main_menu ='admission';
			var sub_menu ='admission_master';
			var tree_menu ='subject_master';
			var leaf_menu ='classwise';
		}
		else if(path_name.match(/^\/registration_fee/) || path_name.match(/^\/registration_fee_add/) || path_name.match(/^\/registration_fee_edit/))
		{
			var main_menu ='admission';
			var sub_menu ='admission_master';
			var tree_menu ='student_registration';
			var leaf_menu ='registration_fee';
		}
		else if(path_name.match(/^\/registration_list/) || path_name.match(/^\/registration_create/) || path_name.match(/^\/registration_edit/) || path_name.match(/^\/student_registered/))
		{
			var main_menu ='admission';
			var sub_menu ='admission_master';
			var tree_menu ='student_registration';
			var leaf_menu ='registration_entry';
		}
		else if(path_name.match(/^\/student_list/) || path_name.match(/^\/student_add/) || path_name.match(/^\/student_edit/))
		{
			var main_menu ='admission';
			var sub_menu ='admission_master';
			var tree_menu ='student_master';
			var leaf_menu ='';
		}
		else if(path_name.match(/^\/feecat_list/) || path_name.match(/^\/feecat_add/) || path_name.match(/^\/feecat_edit/))
		{
			var main_menu ='fee';
			var sub_menu ='fee_master';
			var tree_menu ='feecat';
			var leaf_menu ='';
		}
		else if(path_name.match(/^\/fee_amount_list/) || path_name.match(/^\/fee_amount_add/) || path_name.match(/^\/fee_amount_edit/))
		{
			var main_menu ='fee';
			var sub_menu ='fee_master';
			var tree_menu ='feeamount';
			var leaf_menu ='';
		}
		else if(path_name.match(/^\/payment_mode_list/) || path_name.match(/^\/payment_mode_add/) || path_name.match(/^\/payment_mode_edit/))
		{
			var main_menu ='fee';
			var sub_menu ='fee_master'; 
			var tree_menu ='paymode';
			var leaf_menu ='';
		}
		else if(path_name.match(/^\/station_list/) || path_name.match(/^\/station_add/) || path_name.match(/^\/station_view/) || path_name.match(/^\/station_edit/))
		{
			var main_menu ='transport';
			var sub_menu ='transport_master';
			var tree_menu ='station';
			var leaf_menu ='';
		}
		else if(path_name.match(/^\/route_list/) || path_name.match(/^\/route_add/) || path_name.match(/^\/route_view/) || path_name.match(/^\/route_edit/))
		{
			var main_menu ='transport';
			var sub_menu ='transport_master';
			var tree_menu ='route';
			var leaf_menu ='';
		}
		else if(path_name.match(/^\/vehicle_list/) || path_name.match(/^\/vehicle_add/) || path_name.match(/^\/vehicle_edit/) )
		{
			var main_menu ='transport';
			var sub_menu ='transport_master';
			var tree_menu ='vehicle';
			var leaf_menu ='';
		}
		else if(path_name.match(/^\/supplier_list/) || path_name.match(/^\/supplier_add/) || path_name.match(/^\/supplier_edit/) )
		{
			var main_menu ='transport';
			var sub_menu ='transport_master';
			var tree_menu ='supplier';
			var leaf_menu ='';
		}
		else if(path_name.match(/^\/maintenance_list/) || path_name.match(/^\/maintenance_add/) || path_name.match(/^\/maintenance_edit/) )
		{
			var main_menu ='transport';
			var sub_menu ='transport_master';
			var tree_menu ='maintenance';
			var leaf_menu ='';
		}
		else if(path_name.match(/^\/vehicle_maintenance_list/) || path_name.match(/^\/vehicle_maintenance_add/) || path_name.match(/^\/vehicle_maintenance_edit/) )
		{
			var main_menu ='transport';
			var sub_menu ='vehicle_transaction';
			var tree_menu ='vehicle_entry';
			var leaf_menu ='';
		}
		else if(path_name.match(/^\/fuel_consumption_list/) || path_name.match(/^\/fuel_consumption_add/) || path_name.match(/^\/fuel_consumption_edit/) )
		{
			var main_menu ='transport';
			var sub_menu ='vehicle_transaction';
			var tree_menu ='fuel_entry';
			var leaf_menu ='';
		}
		else if(path_name.match(/^\/exam_list/) || path_name.match(/^\/exam_add/) || path_name.match(/^\/exam_edit/) )
		{
			var main_menu ='exam';
			var sub_menu ='exam_master';
			var tree_menu ='examin';
			var leaf_menu ='';
		}
		else if(path_name.match(/^\/exam_date_sheet/) || path_name.match(/^\/exam_date_sheet_add/) || path_name.match(/^\/exam_date_sheet_edit/) )
		{
			var main_menu ='exam';
			var sub_menu ='exam_master';
			var tree_menu ='examsheet';
			var leaf_menu ='';
		}
		else if(path_name.match(/^\/grade_list/) || path_name.match(/^\/grade_add/) || path_name.match(/^\/grade_edit/) )
		{
			var main_menu ='exam';
			var sub_menu ='exam_master';
			var tree_menu ='grade';
			var leaf_menu ='';
		}
		else if(path_name.match(/^\/department_list/) || path_name.match(/^\/department_add/) || path_name.match(/^\/department_edit/) )
		{
			var main_menu ='employee';
			var sub_menu ='employee_master';
			var tree_menu ='department';
			var leaf_menu ='';
		}
		else if(path_name.match(/^\/designation_list/) || path_name.match(/^\/designation_add/) || path_name.match(/^\/designation_edit/) )
		{
			var main_menu ='employee';
			var sub_menu ='employee_master';
			var tree_menu ='designation';
			var leaf_menu ='';
		}
		else if(path_name.match(/^\/qualification_list/) || path_name.match(/^\/qualification_add/) || path_name.match(/^\/qualification_edit/) )
		{
			var main_menu ='employee';
			var sub_menu ='employee_master';
			var tree_menu ='qualification';
			var leaf_menu ='';
		}
		else if(path_name.match(/^\/employee_list/) || path_name.match(/^\/employee_add/) || path_name.match(/^\/employee_edit/) )
		{
			var main_menu ='employee';
			var sub_menu ='employee_transaction';
			var tree_menu ='employer';
			var leaf_menu ='';
		}
		else if(path_name.match(/^\/notice_list/) || path_name.match(/^\/notice_add/) || path_name.match(/^\/notice_edit/) )
		{
			var main_menu ='notification';
			var sub_menu ='notify_transaction';
			var tree_menu ='notice';
			var leaf_menu ='';
		}
		else if(path_name.match(/^\/holiday_list/) || path_name.match(/^\/add_holiday/) || path_name.match(/^\/holiday_edit/) )
		{
			var main_menu ='holiday';
			var sub_menu ='holiday_transaction';
			var tree_menu ='leave';
			var leaf_menu ='';
		}
		else if(path_name.match(/^\/slc_list/) || path_name.match(/^\/slc_add/) || path_name.match(/^\/slc_edit/))
		{
			var main_menu ='admission';
			var sub_menu ='admission_transaction';
			var tree_menu ='slc';
			var leaf_menu ='';
		}
		else if(path_name.match(/^\/cc_list/) || path_name.match(/^\/cc_add/) || path_name.match(/^\/cc_edit/))
		{
			var main_menu ='admission';
			var sub_menu ='admission_transaction';
			var tree_menu ='cc';
			var leaf_menu ='';
		}
		else if(path_name.match(/^\/bc_list/) || path_name.match(/^\/bc_add/) || path_name.match(/^\/bc_edit/))
		{
			var main_menu ='admission';
			var sub_menu ='admission_transaction';
			var tree_menu ='bc';
			var leaf_menu ='';
		}
		else if(path_name.match(/^\/student_promote/))
		{
			var main_menu ='admission';
			var sub_menu ='admission_transaction';
			var tree_menu ='promotion';
			var leaf_menu ='';
		}
		else if(path_name.match(/^\/assign_class_teacher_list/) || path_name.match(/^\/assign_class_to_teacher/) || path_name.match(/^\/assign_class_to_teacher_edit/))
		{
			var main_menu ='employee';
			var sub_menu ='employee_transaction';
			var tree_menu ='class_teacher';
			var leaf_menu ='';
		}
		else if(path_name.match(/^\/assign_subject_teacher_list/) || path_name.match(/^\/assign_subject_to_teacher/) || path_name.match(/^\/assign_subject_to_teacher_edit/))
		{
			var main_menu ='employee';
			var sub_menu ='employee_transaction';
			var tree_menu ='subject_teacher';
			var leaf_menu ='';
		}
		else if(path_name.match(/^\/assign_home_work/) || path_name.match(/^\/view_home_work/))
		{
			var main_menu ='homework';
			var sub_menu ='';
			var tree_menu ='';
			var leaf_menu ='';
		}
		else if(path_name.match(/^\/student_attendance_entry/))
		{
			var main_menu ='student_attendance';
			var sub_menu ='attendance_transaction';
			var tree_menu ='multiple_attendance';
			var leaf_menu ='';
		}
		else if(path_name.match(/^\/account_master/))
		{
			var main_menu ='account';
			var sub_menu ='account_master';
			var tree_menu ='';
			var leaf_menu ='';
		}
		else if(path_name.match(/^\/income_list/) || path_name.match(/^\/income_add/) || path_name.match(/^\/income_edit/))
		{
			var main_menu ='account';
			var sub_menu ='account_transaction';
			var tree_menu ='income_master';
			var leaf_menu ='';
		}
		else
		{
			var main_menu ='';
			var sub_menu ='';
			var tree_menu ='';
			var leaf_menu ='';
		}


    return (
        <div className="quixnav">
        <div className="quixnav-scroll">
          <ul className="metismenu" id="menu">
            <li><a href={`/dashboard`}><i className="icon icon-single-04" /><span className="nav-text">Dashboard</span></a></li>
            {userType === 'parent' && (
                <>
                    <li><a href={`/child-details`}><i className="fa fa-child" /><span className="nav-text">Child Profile</span></a></li>
                    <li className={(`${main_menu}`=='feePayment')?'mm-active':''}><a className="has-arrow" aria-expanded={(`${main_menu}`=='feePayment')?'true':'false'}><i className="fa fa-money" /><span className="nav-text">Fee Payment</span></a>
                        <ul aria-expanded="false">
                            <li><a href={`/fee-payment`}> Pay Fee Online</a></li>
                            <li><a href={`/fee-history`}> Fee Payment History</a></li>
                        </ul>
                    </li>
                    <li><a href={`/homework`}><i className="fa fa-book" /><span className="nav-text"> Home Work</span></a></li>
                    <li><a href={`/attendance-report`}><i className="fa fa-hand-paper-o" /><span className="nav-text">Attendance Report</span></a></li>
                    <li><a href={`/transport-details`}><i className="fa fa-bus" /><span className="nav-text">Transportation Details</span></a></li>
                    <li className={(`${main_menu}`=='marks')?'mm-active':''}><a className="has-arrow" aria-expanded={(`${main_menu}`=='marks')?'true':'false'}><i className="fa fa-bell" /><span className="nav-text">Marks Analysis</span></a>
                        <ul aria-expanded="false">
                            <li><a href={`/NurseryReportCard`}> Marks Report Customized</a></li>
                            <li><a href={`/MarksDetail`}> Marks Report</a></li>
                        </ul>
                    </li>
                    <li className={(`${main_menu}`=='schooNotification')?'mm-active':''}><a className="has-arrow" aria-expanded={(`${main_menu}`=='schooNotification')?'true':'false'}><i className="fa fa-bell" /><span className="nav-text">School Notifications</span></a>
                        <ul aria-expanded="false">
                            <li><a href={`/PTMDetail`}> Parent-Teacher Meeting</a></li>
                            <li><a href={`/NoticeParent`}> Notice Board</a></li>
                        </ul>
                    </li>
                    <li><a href={`/holiday-calender`}><i className="fa fa-calendar" /><span className="nav-text">Holiday Calender</span></a></li>
                    <li><a href={`/subject-teacher`}><i className="fa fa-user" /><span className="nav-text">Subject Teachers</span></a></li>
                </>
            )}
            {userType === 'user' && (
              <>
            <li><a className="has-arrow"  aria-expanded="false"><i className="icon icon-layout-25" /><span className="nav-text">Utility</span></a>
              <ul aria-expanded="false">
                <li><a className="has-arrow"  aria-expanded="false"><i className="fa fa-envelope" />Sms Activation</a>
                  <ul aria-expanded="false">
                    <li><a href="#">Sms Activation</a></li>
                    <li><a href="#">Student Import</a></li>
                  </ul>
                </li>
                <li><a className="has-arrow"  aria-expanded="false"><i className="fa fa-user-plus" />User Creation</a>
                  <ul aria-expanded="false">
                    <li><a href="./create-user.html">User Master</a></li>
                  </ul>
                </li>
                <li><a className="has-arrow"  aria-expanded="false"><i className="fa fa-cogs" />Setting</a>
                  <ul aria-expanded="false">
                    <li><a href="#">General Setting</a></li>
                    <li><a href="#">Result Setting</a></li>
                  </ul>
                </li>
                <li><a className="has-arrow"  aria-expanded="false"><i className="fa fa-key" />Change Password</a>
                  <ul aria-expanded="false">
                    <li><a href={`/change_password`}>Change Password</a></li>
                  </ul>
                </li>
                <li><a href={`/login`}><i className="fa fa-user" />Re-Login</a></li>
              </ul>
            </li>
            <li className={(`${main_menu}`=='admission')?'mm-active':''}><a className="has-arrow" aria-expanded={(`${main_menu}`=='admission')?'true':'false'}><i className="fa fa-users" /><span className="nav-text">Admission</span></a>
			<ul aria-expanded="false">
                <li className={(`${sub_menu}`=='admission_master')?'mm-active':''}><a className="has-arrow" aria-expanded={(`${sub_menu}`=='admission_master')?'true':'false'}><i className="fa fa-files-o" /> Master</a>
                  <ul className={(`${sub_menu}`=='admission_master')?'mm-collapse mm-show':'mm-collapse'} aria-expanded="false">
                    <li className={(`${tree_menu}`=='course')?'mm-active':''}><a href={`/course_list`} className={(`${tree_menu}`=='course')?'mm-active':''} aria-expanded={(`${tree_menu}`=='course')?'true':'false'}>Course Master</a></li>
					<li className={(`${tree_menu}`=='class')?'mm-active':''}><a href={`/class_list`} className={(`${tree_menu}`=='class')?'mm-active':''} aria-expanded={(`${tree_menu}`=='class')?'true':'false'}>Class Master</a></li>
                    <li className={(`${tree_menu}`=='section')?'mm-active':''}><a href={`/section_list`} className={(`${tree_menu}`=='section')?'mm-active':''} aria-expanded={(`${tree_menu}`=='section')?'true':'false'}>Section Master</a></li>
                    <li className={(`${tree_menu}`=='subject_master')?'mm-active':''}><a className="has-arrow" aria-expanded={(`${tree_menu}`=='subject_master')?'true':'false'}>Subject Master</a>
                      <ul className={(`${tree_menu}`=='subject_master')?'mm-collapse mm-show':'mm-collapse'} aria-expanded="false">
                        <li className={(`${leaf_menu}`=='subject')?'mm-active':''}><a href={`/subject_list`} className={(`${leaf_menu}`=='subject')?'mm-active':''} aria-expanded={(`${leaf_menu}`=='subject')?'true':'false'}>Subjects</a></li>
                        <li className={(`${leaf_menu}`=='classwise')?'mm-active':''}><a href={`/class_wise_subject_list`} className={(`${leaf_menu}`=='classwise')?'mm-active':''}  aria-expanded={(`${leaf_menu}`=='classwise')?'true':'false'}>Assign Class-wise Subjects</a></li>
                      </ul>
                    </li>
                    <li className={(`${tree_menu}`=='student_registration')?'mm-active':''}><a className="has-arrow" aria-expanded={(`${tree_menu}`=='student_registration')?'true':'false'}>Student Registration</a>
                      <ul className={(`${tree_menu}`=='student_registration')?'mm-collapse mm-show':'mm-collapse'} aria-expanded="false">
                        <li className={(`${leaf_menu}`=='registration_fee')?'mm-active':''}><a href={`/registration_fee`} className={(`${leaf_menu}`=='registration_fee')?'mm-active':''}  aria-expanded={(`${leaf_menu}`=='registration_fee')?'true':'false'}>{'Registration Fee'}</a></li>
                        <li className={(`${leaf_menu}`=='registration_entry')?'mm-active':''}><a href={`/registration_list`} className={(`${leaf_menu}`=='registration_entry')?'mm-active':''}  aria-expanded={(`${leaf_menu}`=='registration_entry')?'true':'false'}>{'Registration Entry'}</a></li>
                      </ul>
                    </li>
					<li className={(`${tree_menu}`=='student_master')?'mm-active':''}><a href={`/student_list`} className={(`${tree_menu}`=='student_master')?'mm-active':''}  aria-expanded={(`${tree_menu}`=='student_master')?'true':'false'}>{'Student Master'}</a></li>
                  </ul>
                </li>
				<li className={(`${sub_menu}`=='admission_transaction')?'mm-active':''}><a className="has-arrow" aria-expanded={(`${sub_menu}`=='admission_transaction')?'true':'false'}><i className="title fa fa-gavel" /> Transaction</a>
                  <ul aria-expanded="false">
					<li className={(`${tree_menu}`=='slc' || `${tree_menu}`=='cc' || `${tree_menu}`=='bc')?'mm-active':''}><a className="has-arrow" aria-expanded={(`${tree_menu}`=='slc' || `${tree_menu}`=='cc' || `${tree_menu}`=='bc')?'true':'false'}>Certificates</a>
                      <ul className={(`${tree_menu}`=='slc' || `${tree_menu}`=='cc' || `${tree_menu}`=='bc')?'mm-collapse mm-show':'mm-collapse'} aria-expanded="false">
                        <li className={(`${tree_menu}`=='slc')?'mm-active':''}><a href={`/slc_list`} className={(`${tree_menu}`=='slc')?'mm-active':''} aria-expanded={(`${tree_menu}`=='slc')?'true':'false'}>Transfer/SLC Cert.</a></li>
                        <li className={(`${tree_menu}`=='cc')?'mm-active':''}><a href={`/cc_list`} className={(`${tree_menu}`=='cc')?'mm-active':''} aria-expanded={(`${tree_menu}`=='cc')?'true':'false'}>Character Certificate</a></li>
                        <li className={(`${tree_menu}`=='bc')?'mm-active':''}><a href={`/bc_list`} className={(`${tree_menu}`=='bc')?'mm-active':''} aria-expanded={(`${tree_menu}`=='bc')?'true':'false'}>Birth Certificate</a></li>
					  </ul>
                    </li>
                    <li className={(`${tree_menu}`=='promotion')?'mm-active':''}><a href={`/student_promote`} className={(`${tree_menu}`=='promotion')?'mm-active':''}  aria-expanded={(`${tree_menu}`=='promotion')?'true':'false'}>{'Promote Students'}</a>
					</li>
                  </ul>
                </li>
                <li><a href={`/search_student`}><i className="fa fa-search" /> Students Search</a></li>
                <li><a className="has-arrow"  aria-expanded="false"><i className="fa fa-dot-circle-o" /> Reports</a>
                  <ul aria-expanded="false">
                    <li><a href={`/class_wise_strength`}>Class Wise Strength</a></li>
                    <li><a href={`/total_registration`}>Total Registration</a></li>
                    <li><a href={`/registered_student_list`}>Student Admitted Through Registration</a></li>
                    <li><a href="#">List of Confirm Students</a></li>
                    <li><a href="#">List of Refunded Fee</a></li>
                    <li><a href="#">List of Total registration Fee</a></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li><a className="has-arrow"  aria-expanded="false"><i className="fa fa-id-card" /><span className="nav-text">Student ID Card</span></a>
              <ul aria-expanded="false">
				<li><a href={`/print_id_card`}><i className="fa fa-print" aria-hidden="true" />{'Print ID Card'}</a></li>
              </ul>
            </li>
             <li className={(`${main_menu}`=='fee')?'mm-active':''}><a className="has-arrow" aria-expanded={(`${main_menu}`=='fee')?'true':'false'}><i className="fa fa-money" /><span className="nav-text">Fee</span></a>
              <ul aria-expanded="false">
                <li className={(`${sub_menu}`=='fee_master')?'mm-active':''}><a className="has-arrow" aria-expanded={(`${sub_menu}`=='fee_master')?'true':'false'}><i className="fa fa-files-o" /> Master</a>
                  <ul aria-expanded="false">
					<li className={(`${tree_menu}`=='feecat')?'mm-active':''}><a href={`/feecat_list`} className={(`${tree_menu}`=='feecat')?'mm-active':''} aria-expanded={(`${tree_menu}`=='feecat')?'true':'false'}>{'Fee Category'}</a></li>
                    <li><a href={`/feeslot`}>{'Fee Slot'}</a></li>
                    <li className={(`${tree_menu}`=='feeamount')?'mm-active':''}><a href={`/fee_amount_list`} className={(`${tree_menu}`=='feeamount')?'mm-active':''} aria-expanded={(`${tree_menu}`=='feeamount')?'true':'false'}>{'Fee Amount'}</a></li>
                    <li><a href={`/fine_setting`}>{'Fine Settings'}</a></li>
					<li><a href={`/fee_concession`}>{'Fee Concession'}</a></li>
                    <li><a href={`/fee_individual`}>Fee Amount Individual</a></li>
					<li className={(`${tree_menu}`=='paymode')?'mm-active':''}><a href={`/payment_mode_list`} className={(`${tree_menu}`=='paymode')?'mm-active':''} aria-expanded={(`${tree_menu}`=='paymode')?'true':'false'}>{'Payment Mode'}</a></li>
                  </ul>
                </li>
                <li><a className="has-arrow"  aria-expanded="false"><i className="fa fa-gavel" /> Transaction</a>
                  <ul aria-expanded="false">
					<li><a href={`/feecollection`}>{'Fee Collection'}</a></li>
                  </ul>
                </li>
                <li><a href="#"><i className="fa fa-search" /> Student Search</a></li>
                <li><a className="has-arrow"  aria-expanded="false"><i className="fa fa-dot-circle-o" /> Reports</a>
                  <ul aria-expanded="false">
                    <li><a className="has-arrow"  aria-expanded="false">Fee Collection</a>
                      <ul aria-expanded="false">
                        <li><a href="#">Date Wise</a></li>
                        <li><a href="#">Month Wise</a></li>
                        <li><a href="#">Receipt Wise</a></li>
                        <li><a href="#">Deleted Receipts</a></li>
                      </ul>
                    </li>
                    <li><a href="#">Print Receipt</a></li>
                    <li><a href="#">Pending Fee List</a></li>
                    <li><a href="#">Pending Fee Multiple Months</a></li>
                    <li><a href="#">Pending Fee Category Wise</a></li>
                    <li><a href="#">Total Fee Month Wise</a></li>
                    <li><a href="#">Fee Concession Report</a></li>
                    <li><a href="#">Individual Fee Concession Report</a></li>
                    <li><a href="#">Fee Chart</a></li>
                    <li><a href="#">Fee Amount To Collect</a></li>
                    <li><a href="#">Yearly Fee Report</a></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li className={(`${main_menu}`=='transport')?'mm-active':''}><a className="has-arrow" aria-expanded={(`${main_menu}`=='transport')?'true':'false'}><i className="fa fa-bus" /><span className="nav-text">Transport</span></a>
              <ul aria-expanded="false">
                <li className={(`${sub_menu}`=='transport_master')?'mm-active':''}><a className="has-arrow" aria-expanded={(`${sub_menu}`=='transport_master')?'true':'false'}><i className="fa fa-files-o" /> Master</a>
                  <ul className={(`${sub_menu}`=='transport_master')?'mm-collapse mm-show':'mm-collapse'} aria-expanded="false">
					<li className={(`${tree_menu}`=='station')?'mm-active':''}><a href={`/station_list`} className={(`${tree_menu}`=='station')?'mm-active':''} aria-expanded={(`${tree_menu}`=='station')?'true':'false'}>Station Master</a></li>
					<li className={(`${tree_menu}`=='route')?'mm-active':''}><a href={`/route_list`} className={(`${tree_menu}`=='route')?'mm-active':''} aria-expanded={(`${tree_menu}`=='route')?'true':'false'}>Route Master</a></li>
					<li className={(`${tree_menu}`=='vehicle')?'mm-active':''}><a href={`/vehicle_list`} className={(`${tree_menu}`=='vehicle')?'mm-active':''} aria-expanded={(`${tree_menu}`=='vehicle')?'true':'false'}>Vehicle Master</a></li>
                    <li className={(`${tree_menu}`=='supplier')?'mm-active':''}><a href={`/supplier_list`} className={(`${tree_menu}`=='supplier')?'mm-active':''} aria-expanded={(`${tree_menu}`=='supplier')?'true':'false'}>Supplier Master</a></li>
                    <li className={(`${tree_menu}`=='maintenance')?'mm-active':''}><a href={`/maintenance_list`} className={(`${tree_menu}`=='maintenance')?'mm-active':''} aria-expanded={(`${tree_menu}`=='maintenance')?'true':'false'}>Maintenance Type Master</a></li>
                  </ul>
                </li>
                <li className={(`${sub_menu}`=='vehicle_transaction')?'mm-active':''}><a className="has-arrow" aria-expanded={(`${sub_menu}`=='vehicle_transaction')?'true':'false'}><i className="fa fa-gavel" /> Transaction</a>
                  <ul className={(`${sub_menu}`=='vehicle_transaction')?'mm-collapse mm-show':'mm-collapse'} aria-expanded="false">
                    <li className={(`${tree_menu}`=='vehicle_entry')?'mm-active':''}><a href={`/vehicle_maintenance_list`} className={(`${tree_menu}`=='vehicle_entry')?'mm-active':''} aria-expanded={(`${tree_menu}`=='vehicle_entry')?'true':'false'}>Vehicle Maintenance Entry</a></li>
                    <li className={(`${tree_menu}`=='fuel_entry')?'mm-active':''}><a href={`/fuel_consumption_list`} className={(`${tree_menu}`=='fuel_entry')?'mm-active':''} aria-expanded={(`${tree_menu}`=='fuel_entry')?'true':'false'}>Fuel Consumption Entry</a></li>
                  </ul>
                </li>
                <li><a className="has-arrow"  aria-expanded="false"><i className="fa fa-dot-circle-o" /> Reports</a>
                  <ul aria-expanded="false">
                    <li><a href={`/routewise_student_list`}>RouteWise Student List</a></li>
                    <li><a href={`/stationwise_student_list`}>StationWise Student List</a></li>
                    <li><a href={`/vehicle_maintenance_report`}>Vehicle Maintenance Report</a></li>
                    <li><a href={`/fuel_consumption_report`}>Fuel Consumption Report</a></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li className={(`${main_menu}`=='exam')?'mm-active':''}><a className="has-arrow" aria-expanded={(`${main_menu}`=='exam')?'true':'false'}><i className="fa fa-graduation-cap" /><span className="nav-text">Marks Analysis</span></a>
              <ul aria-expanded="false">
                <li className={(`${sub_menu}`=='exam_master')?'mm-active':''}><a className="has-arrow" aria-expanded={(`${sub_menu}`=='exam_master')?'true':'false'}><i className="fa fa-files-o" />Master</a>
                  <ul className={(`${sub_menu}`=='exam_master')?'mm-collapse mm-show':'mm-collapse'} aria-expanded="false">
					<li className={(`${tree_menu}`=='examin')?'mm-active':''}><a href={`/exam_list`} className={(`${tree_menu}`=='examin')?'mm-active':''} aria-expanded={(`${tree_menu}`=='examin')?'true':'false'}>Exam Creation</a></li>
					<li className={(`${tree_menu}`=='examsheet')?'mm-active':''}><a href={`/exam_date_sheet`} className={(`${tree_menu}`=='examsheet')?'mm-active':''} aria-expanded={(`${tree_menu}`=='examsheet')?'true':'false'}>Exam Date Sheet Entry</a></li>
					{/***}<li><a href="#">Exam Date Sheet Entry Customized</a></li> ****/}
                    <li className={(`${tree_menu}`=='grade')?'mm-active':''}><a href={`/grade_list`} className={(`${tree_menu}`=='grade')?'mm-active':''} aria-expanded={(`${tree_menu}`=='grade')?'true':'false'}>Grades Creation</a></li>
                  </ul>
                </li>
                <li><a className="has-arrow"  aria-expanded="false"><i className="fa fa-gavel" />Transaction</a>
                  <ul aria-expanded="false">
                    <li><a href={`/assign_subject_wise_marks`}>Subject Wise Marks Entry</a></li>
					{/****<li><a href="#">Subject Wise Marks Entry Customized</a></li>****/}
                  </ul>
                </li>
                <li><a href="#"><i className="title fa fa-search" />Student Search</a></li>
                <li><a className="has-arrow"  aria-expanded="false"><i className="fa fa-edit" />Reports</a>
                  <ul aria-expanded="false">
                    <li><a href={`/question-report`}>Exam Date Sheet</a></li>
                    <li><a href={`regular-marks-report`}>Marks Report - Individual</a></li>
                    {/* <li><a href={`/marks-report-customized`}>Marks Report Customized</a></li> */}
                    <li><a href={`/rank-list`}>Rank List Preparation</a></li>
                    <li><a href={`/marks-list-consolidated`}>Marks Report - Consolidated</a></li>
                    <li><a href={`/compiled-sheet`}>Compiled Sheet</a></li>
                  </ul>
                </li>
              </ul>
            </li>
			<li className={(`${main_menu}`=='homework')?'mm-active':''}><a className="has-arrow" aria-expanded={(`${main_menu}`=='homework')?'true':'false'}><i className="fa fa-book" /><span className="nav-text">Home Work</span></a>
              <ul aria-expanded="false">
                <li><a href={`/assign_home_work`}><i className="fa fa-edit" aria-hidden="true" /> Assign Home Work</a></li>
                <li><a href={`/view_home_work`}><i className="fa fa-eye" aria-hidden="true" /> View Home Work</a></li>
              </ul>
            </li>
            <li className={(`${main_menu}`=='student_attendance')?'mm-active':''}><a className="has-arrow" aria-expanded={(`${main_menu}`=='student_attendance')?'true':'false'}><i className="fa fa-hand-paper-o" /><span className="nav-text">Attendance</span></a>
              <ul aria-expanded="false">
                <li className={(`${sub_menu}`=='attendance_transaction')?'mm-active':''}><a className="has-arrow" aria-expanded={(`${sub_menu}`=='attendance_transaction')?'true':'false'}><i className="fa fa-gavel" />Transaction</a>
                  <ul aria-expanded="false">
                    <li className={(`${tree_menu}`=='multiple_attendance')?'mm-active':''}><a href={`/student_attendance_entry`} className={(`${tree_menu}`=='multiple_attendance')?'mm-active':''} aria-expanded={(`${tree_menu}`=='multiple_attendance')?'true':'false'}>Multiple Attendance Entry</a></li>
                    <li><a href="#">Daily Attendance Report</a></li>
                    <li><a href={`/student_attendance_modify`}>Modify Attendance Register</a></li>
                  </ul>
                </li>
                <li><a href="#"><i className="title fa fa-search" />Student Search</a></li>
                <li><a className="has-arrow"  aria-expanded="false"><i className="fa fa-edit" />Reports</a>
                  <ul aria-expanded="false">
                    <li><a href="#">Full Attendance Report</a></li>
                    <li><a href="#">Attendance Calender</a></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li><a className="has-arrow"  aria-expanded="false"><i className="fa fa-envelope-open" /><span className="nav-text">SMS</span></a>
              <ul aria-expanded="false">
                <li><a className="has-arrow"  aria-expanded="false"><i className="fa fa-gavel" />Transaction</a>
                  <ul aria-expanded="false">
                    <li><a href="#">SMS Notice</a></li>
                    <li><a href="#">SMS To Absenties</a></li>
                    <li><a href="#">Fee Pending SMS</a></li>
                    <li><a href="#">Bithdays</a></li>
                    <li><a href="#">SMS Report</a></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li className={(`${main_menu}`=='employee')?'mm-active':''}><a className="has-arrow" aria-expanded={(`${main_menu}`=='employee')?'true':'false'}><i className="fa fa-user" /><span className="nav-text">Employee</span></a>
              <ul aria-expanded="false">
                <li className={(`${sub_menu}`=='employee_master')?'mm-active':''}><a className="has-arrow" aria-expanded={(`${sub_menu}`=='employee_master')?'true':'false'}><i className="fa fa-files-o" />Master</a>
                   <ul className={(`${sub_menu}`=='employee_master')?'mm-collapse mm-show':'mm-collapse'} aria-expanded="false">
					<li className={(`${tree_menu}`=='department')?'mm-active':''}><a href={`/department_list`} className={(`${tree_menu}`=='department')?'mm-active':''} aria-expanded={(`${tree_menu}`=='department')?'true':'false'}>Department Master</a></li>
					<li className={(`${tree_menu}`=='designation')?'mm-active':''}><a href={`/designation_list`} className={(`${tree_menu}`=='designation')?'mm-active':''} aria-expanded={(`${tree_menu}`=='designation')?'true':'false'}>Designation Master</a></li>
					<li className={(`${tree_menu}`=='qualification')?'mm-active':''}><a href={`/qualification_list`} className={(`${tree_menu}`=='qualification')?'mm-active':''} aria-expanded={(`${tree_menu}`=='qualification')?'true':'false'}>Qualification Master</a></li>
                  </ul>
                </li>
                <li className={(`${sub_menu}`=='employee_transaction')?'mm-active':''}><a className="has-arrow" aria-expanded={(`${sub_menu}`=='employee_transaction')?'true':'false'}><i className="fa fa-gavel" />Transaction</a>
                  <ul className={(`${sub_menu}`=='employee_transaction')?'mm-collapse mm-show':'mm-collapse'} aria-expanded="false">
					<li className={(`${tree_menu}`=='employer')?'mm-active':''}><a href={`/employee_list`} className={(`${tree_menu}`=='employer')?'mm-active':''} aria-expanded={(`${tree_menu}`=='employer')?'true':'false'}>Employee Master</a></li>
					<li className={(`${tree_menu}`=='class_teacher')?'mm-active':''}><a href={`/assign_class_teacher_list`} className={(`${tree_menu}`=='class_teacher')?'mm-active':''} aria-expanded={(`${tree_menu}`=='class_teacher')?'true':'false'}>Assign Class(s) to Teachers</a></li>
					<li className={(`${tree_menu}`=='subject_teacher')?'mm-active':''}><a href={`/assign_subject_teacher_list`} className={(`${tree_menu}`=='subject_teacher')?'mm-active':''} aria-expanded={(`${tree_menu}`=='subject_teacher')?'true':'false'}>Assign Subject(s) to Teachers</a></li>
                    <li><a href={`/experience_certificate`}>Experience Certificate</a></li>
                    <li><a href={`/left_employee`}>Left Employee Entry</a></li>
                  </ul>
                </li>
                <li><a href={`/search_employee`}><i className="title fa fa-search" />Employee Search</a></li>
                <li><a className="has-arrow" aria-expanded="false"><i className="fa fa-edit" />Reports</a>
                  <ul aria-expanded="false">
                    <li><a href="#">Employee's Report</a></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li><a className="has-arrow"  aria-expanded="false"><i className="fa fa-hand-paper-o" /><span className="nav-text">Employee Attendance</span></a>
              <ul aria-expanded="false">
                <li><a className="has-arrow"  aria-expanded="false"><i className="fa fa-gavel" />Transaction</a>
                  <ul aria-expanded="false">
                    <li><a href={`/employee_attendance_entry`}>Attendance Entry</a></li>
                    <li><a href={`/employee_attendance_modify`}>Modify Attendance</a></li>
                  </ul>
                </li>
                <li><a href="#"><i className="title fa fa-search" />Employee Search</a></li>
                <li><a className="has-arrow"  aria-expanded="false"><i className="fa fa-edit" />Reports</a>
                  <ul aria-expanded="false">
                    <li><a href="#">Attendance Report</a></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li><a className="has-arrow"  aria-expanded="false"><i className="fa fa-money" /><span className="nav-text">Payroll</span></a>
              <ul aria-expanded="false">
                <li><a className="has-arrow"  aria-expanded="false"><i className="fa fa-files-o" />Master</a>
                  <ul aria-expanded="false">
                    <li><a href="#">Salary Description</a></li>
                    <li><a href="#">PF Master</a></li>
                    <li><a href="#">Salary Description</a></li>
                    <li><a href="#">Salary Amount</a></li>
                    <li><a href="#">Salary Amount Individual</a></li>
                  </ul>
                </li>
                <li><a className="has-arrow"  aria-expanded="false"><i className="fa fa-gavel" />Transaction</a>
                  <ul aria-expanded="false">
                    <li><a href="#">Process Attendance For Salary</a></li>
                    <li><a href="#">Advance Salary</a></li>
                    <li><a href="#">Salary Transaction</a></li>
                  </ul>
                </li>
                <li><a className="has-arrow"  aria-expanded="false"><i className="fa fa-edit" />Reports</a>
                  <ul aria-expanded="false">
                    <li><a href="#">Processed Attendance Report</a></li>
                    <li><a href="#">Consolidated Salary Report</a></li>
                  </ul>
                </li>
              </ul>
            </li>

            <li className={(`${main_menu}`=='account')?'mm-active':''}><a className="has-arrow" aria-expanded={(`${main_menu}`=='account')?'true':'false'}><i className="fa fa-calculator" /><span className="nav-text">Account</span></a>
              <ul aria-expanded="false">
                <li className={(`${sub_menu}`=='account_master')?'mm-active':''}><a className="has-arrow" aria-expanded={(`${sub_menu}`=='account_master')?'true':'false'}><i className="fa fa-files-o" />Master</a>
                  <ul aria-expanded="false">
                    <li><a href={`/account_master`}>Account Master</a></li>
                  </ul>
                </li>
				<li className={(`${sub_menu}`=='account_transaction')?'mm-active':''}><a className="has-arrow" aria-expanded={(`${sub_menu}`=='account_transaction')?'true':'false'}><i className="title fa fa-gavel" /> Transaction</a>
                  <ul aria-expanded="false">
					<li className={(`${tree_menu}`=='income_master')?'mm-active':''}><a href={`/income_master`} className={(`${tree_menu}`=='income_master')?'mm-active':''} aria-expanded={(`${tree_menu}`=='income_master')?'true':'false'}>School Income</a></li>
                    <li><a href="#">School Expenses</a></li>
                    <li><a href="#">Account Details</a></li>
                  </ul>
                </li>
                <li><a className="has-arrow"  aria-expanded="false"><i className="fa fa-edit" />Reports</a>
                  <ul aria-expanded="false">
                    <li><a href="#">Income Report</a></li>
                    <li><a href="#">Expense Report</a></li>
                    <li><a href="#">Cash Book</a></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li><a className="has-arrow"  aria-expanded="false"><i className="fa fa-pencil" /><span className="nav-text">Inventory</span></a>
              <ul aria-expanded="false">
                <li><a className="has-arrow"  aria-expanded="false"><i className="fa fa-files-o" />Master</a>
                  <ul aria-expanded="false">
                    <li><a href="#">Ledger Entry</a></li>
                    <li><a href="#">Unit Entry</a></li>
                    <li><a href="#">Items Entry</a></li>
                    <li><a href="#">Supplier's Entry</a></li>
                  </ul>
                </li>
                <li><a className="has-arrow"  aria-expanded="false"><i className="fa fa-gavel" />Transaction</a>
                  <ul aria-expanded="false">
                    <li><a href="#">Indent Register Entry</a></li>
                    <li><a href="#">P.O Entry</a></li>
                    <li><a href="#">Approved P.O</a></li>
                    <li><a href="#">GRN Entry</a></li>
                    <li><a href="#">Return Request</a></li>
                    <li><a href="#">Return Invoice</a></li>
                  </ul>
                </li>
                <li><a className="has-arrow"  aria-expanded="false"><i className="fa fa-edit" />Reports</a>
                  <ul aria-expanded="false">
                    <li><a href="#">All P.O's</a></li>
                    <li><a href="#">Indent Status Report</a></li>
                    <li><a href="#">Stock Report</a></li>
                    <li><a href="#">Pending Bills</a></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li><a className="has-arrow"  aria-expanded="false"><i className="fa fa-building-o" /><span className="nav-text">Hostel</span></a>
              <ul aria-expanded="false">
                <li><a className="has-arrow"  aria-expanded="false"><i className="fa fa-files-o" />Master</a>
                  <ul aria-expanded="false">
                    <li><a href="#">Hostel Detail</a></li>
                    <li><a href="#">Floor Detail</a></li>
                    <li><a href="#">Room Detail</a></li>
                  </ul>
                </li>
                <li><a className="has-arrow"  aria-expanded="false"><i className="fa fa-gavel" />Transaction</a>
                  <ul aria-expanded="false">
                    <li><a href="#">Room Allotment</a></li>
                    <li><a href="#">School Income</a></li>
                  </ul>
                </li>
                <li><a className="has-arrow"  aria-expanded="false"><i className="fa fa-edit" />Reports</a>
                  <ul aria-expanded="false">
                    <li><a href="#">Hostel Detail Report</a></li>
                    <li><a href="#">Room Allotment Report</a></li>
                    <li><a href="#">Income Report</a></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li className={(`${main_menu}`=='notification')?'mm-active':''}><a className="has-arrow" aria-expanded={(`${main_menu}`=='notification')?'true':'false'}><i className="fa fa-bell" /><span className="nav-text">Notification</span></a>
              <ul aria-expanded="false">
                <li className={(`${sub_menu}`=='notify_transaction')?'mm-active':''}><a className="has-arrow" aria-expanded={(`${sub_menu}`=='notify_transaction')?'true':'false'}><i className="fa fa-gavel" />Transaction</a>
                  <ul className={(`${sub_menu}`=='notify_transaction')?'mm-collapse mm-show':'mm-collapse'} aria-expanded="false">
                    <li><a href="#">Parent-Teacher Meeting</a></li>
                    <li className={(`${tree_menu}`=='notice')?'mm-active':''}><a href={`/notice_list`} className={(`${tree_menu}`=='notice')?'mm-active':''} aria-expanded={(`${tree_menu}`=='notice')?'true':'false'}>Notice Board</a></li>
                    <li><a href="#">Time Table</a></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li className={(`${main_menu}`=='holiday')?'mm-active':''}><a className="has-arrow" aria-expanded={(`${main_menu}`=='holiday')?'true':'false'}><i className="fa fa-calendar" /><span className="nav-text">Holiday Calender</span></a>
              <ul aria-expanded="false">
                <li className={(`${sub_menu}`=='holiday_transaction')?'mm-active':''}><a className="has-arrow" aria-expanded={(`${sub_menu}`=='holiday_transaction')?'true':'false'}><i className="fa fa-gavel" />Transaction</a>
                  <ul className={(`${sub_menu}`=='holiday_transaction')?'mm-collapse mm-show':'mm-collapse'} aria-expanded="false">
                    <li className={(`${tree_menu}`=='leave')?'mm-active':''}><a href={`/holiday_list`} className={(`${tree_menu}`=='leave')?'mm-active':''} aria-expanded={(`${tree_menu}`=='leave')?'true':'false'}>Create Holiday</a></li>
                  </ul>
                </li>
              </ul>
            </li>
            </>
            )}
            <li><a className="has-arrow"  aria-expanded="false"><i className="fa fa-envelope" /><span className="nav-text">Mail Communication</span></a>
              <ul aria-expanded="false">
                <li><a href="./email-compose.html">Compose</a></li>
                <li><a href="./email-inbox.html">Inbox</a></li>
                <li><a href="./email-read.html">Sent</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
export default Sidebar;
