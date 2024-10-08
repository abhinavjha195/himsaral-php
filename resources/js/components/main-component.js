import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Registration from './Registration';
import Users from './admin/pages/Users';
import ChangePassword from './admin/pages/ChangePassword';
import ClassList from './admin/pages/ClassList';
import AddClass from "./admin/pages/AddClass";
import EditClass from "./admin/pages/EditClass";
import SectionAdd from './admin/pages/SectionAdd';
import SectionEdit from './admin/pages/SectionEdit';
import SubjectAdd from './admin/pages/SubjectAdd';
import SubjectEdit from './admin/pages/SubjectEdit';
import CourseList from './admin/pages/CourseList';
import CourseAdd from './admin/pages/CourseAdd';
import SubjectList from './admin/pages/SubjectList';
import CourseEdit from './admin/pages/CourseEdit';
import SectionList from './admin/pages/SectionList';
import Dashboard from './admin/pages/Dashboard';
import ClassWiseSubjectAdd from './admin/pages/ClassWiseSubjectAdd';
import ClassWiseSubjectEdit from './admin/pages/ClassWiseSubjectEdit';
import ClassWiseSubjectCreate from './admin/pages/ClassWiseSubjectCreate';
import StationList from './admin/pages/StationList';
import AddStation from "./admin/pages/AddStation";
import EditStation from './admin/pages/EditStation';
import ViewStation from './admin/pages/ViewStation';
import RouteList from './admin/pages/RouteList';
import AddRoute from "./admin/pages/AddRoute";
import EditRoute from "./admin/pages/EditRoute";
import ViewRoute from "./admin/pages/ViewRoute";
import FeeCatList from './admin/pages/FeeCatList';
import FeeCatAdd from './admin/pages/FeeCatAdd';
import FeeCatView from './admin/pages/FeeCatView';
import FeeCatEdit from './admin/pages/FeeCatEdit';
import Feeslot from './admin/pages/Feeslot';
import FeeAmountList from "./admin/pages/FeeAmountList";
import FeeAmountCreate from "./admin/pages/FeeAmountCreate";
import FeeAmountIndividual from "./admin/pages/FeeAmountIndividual";
import FeeAmountEdit from "./admin/pages/FeeAmountEdit";
import FineSetting from './admin/pages/FineSetting';
import FeeConcession from './admin/pages/FeeConcession';
import PaymentModeList from './admin/pages/PaymentModeList';
import PaymentModeCreate from "./admin/pages/PaymentModeCreate";
import PaymentModeEdit from "./admin/pages/PaymentModeEdit";
import ClassWiseSubjectList from './admin/pages/ClassWiseSubjectList';
import StudentList from './admin/pages/StudentList';
import StudentAdd from './admin/pages/StudentAdd';
import StudentEdit from './admin/pages/StudentEdit';
import VehicleList from './admin/pages/VehicleList';
import AddVehicle from './admin/pages/AddVehicle';
import EditVehicle from "./admin/pages/EditVehicle";
import FeeCollection from './admin/pages/FeeCollection';
import PrintIdCard from './admin/pages/PrintIdCard';
import EmployeeList from './admin/pages/EmployeeList';
import EmployeeAdd from './admin/pages/EmployeeAdd';
import EmployeeEdit from './admin/pages/EmployeeEdit';
import DepartmentList from './admin/pages/DepartmentList';
import DepartmentAdd from './admin/pages/DepartmentAdd';
import DepartmentEdit from './admin/pages/DepartmentEdit';
import DesignationList from './admin/pages/DesignationList';
import DesignationAdd from './admin/pages/DesignationAdd';
import DesignationEdit from './admin/pages/DesignationEdit';
import QualificationList from './admin/pages/QualificationList';
import QualificationAdd from './admin/pages/QualificationAdd';
import QualificationEdit from './admin/pages/QualificationEdit';
import ExamList from './admin/pages/ExamList';
import ExamAdd from './admin/pages/ExamAdd';
import ExamEdit from './admin/pages/ExamEdit';
import ExamDateSheet from './admin/pages/ExamDateSheet';
import ExamDateSheetAdd from './admin/pages/ExamDateSheetAdd';
import ExamDateSheetEdit from './admin/pages/ExamDateSheetEdit';
import GradeList from './admin/pages/GradeList';
import GradeAdd from './admin/pages/GradeAdd';
import GradeEdit from './admin/pages/GradeEdit';
import SupplierAdd from './admin/pages/SupplierAdd';
import SupplierList from './admin/pages/SupplierList';
import SupplierEdit from './admin/pages/SupplierEdit';
import MaintenanceList from './admin/pages/MaintenanceList';
import MaintenanceAdd from './admin/pages/MaintenanceAdd';
import MaintenanceEdit from './admin/pages/MaintenanceEdit';
import VehicleMaintenanceAdd from './admin/pages/VehicleMaintenanceAdd';
import VehicleMaintenanceList from './admin/pages/VehicleMaintenanceList';
import VehicleMaintenanceEdit from './admin/pages/VehicleMaintenanceEdit';
import FuelConsumptionAdd from './admin/pages/FuelConsumptionAdd';
import FuelConsumptionList from './admin/pages/FuelConsumptionList';
import FuelConsumptionEdit from './admin/pages/FuelConsumptionEdit';
import RoutewiseStudentList from './admin/pages/RoutewiseStudentList';
import StationwiseStudentList from './admin/pages/StationwiseStudentList';
import AssignSubjectWiseMarks from './admin/pages/AssignSubjectWiseMarks';
import VehicleMaintenanceReport from './admin/pages/VehicleMaintenanceReport';
import FuelConsumptionReport from './admin/pages/FuelConsumptionReport';
import RegistrationFee from './admin/pages/RegistrationFee';
import RegistrationFeeAdd from './admin/pages/RegistrationFeeAdd';
import RegistrationFeeEdit from './admin/pages/RegistrationFeeEdit';
import RegistrationList from './admin/pages/RegistrationList';
import RegistrationAdd from './admin/pages/RegistrationAdd';
import RegistrationEdit from './admin/pages/RegistrationEdit';
import ClassWiseStrength from './admin/pages/ClassWiseStrength';
import RegisteredStudentList from './admin/pages/RegisteredStudentList';
import TotalRegistration from './admin/pages/TotalRegistration';
import RegistrationNew from './admin/pages/RegistrationNew';
import ExperienceCertificate from './admin/pages/ExperienceCertificate';
import SearchStudent from './admin/pages/SearchStudent';
import AddHoliday from './admin/pages/AddHoliday';
import HolidayList from './admin/pages/HolidayList';
import HolidayEdit from './admin/pages/HolidayEdit';
import LeftEmployeeEntry from './admin/pages/LeftEmployeeEntry';
import NoticeAdd from './admin/pages/NoticeAdd';
import NoticeList from './admin/pages/NoticeList';
import NoticeEdit from './admin/pages/NoticeEdit';
import SlcList from './admin/pages/SlcList';
import AddSlc from "./admin/pages/AddSlc";
import EditSlc from "./admin/pages/EditSlc";
import CcList from './admin/pages/CcList';
import AddCc from "./admin/pages/AddCc";
import EditCc from "./admin/pages/EditCc";
import BcList from './admin/pages/BcList';
import AddBc from "./admin/pages/AddBc";
import AdmissionForm from "./admin/pages/AdmissionForm";
import SchoolDetail from "./admin/pages/SchoolDetail";
import SchoolProfile from "./admin/pages/SchoolProfile";
import StudentPromotion from "./admin/pages/StudentPromotion";
import TeacherClassList from "./admin/pages/TeacherClassList";
import AssignTeacherClass from "./admin/pages/AssignTeacherClass";
import AssignTeacherClassEdit from "./admin/pages/AssignTeacherClassEdit";
import SubjectTeacherList from "./admin/pages/SubjectTeacherList";
import AssignTeacherSubject from "./admin/pages/AssignTeacherSubject";
import AssignTeacherSubjectEdit from "./admin/pages/AssignTeacherSubjectEdit";
import AssignHomeWork from "./admin/pages/AssignHomeWork";
import ViewHomeWork from "./admin/pages/ViewHomeWork";
import StudentAttendanceEntry from "./admin/pages/StudentAttendanceEntry";
import StudentAttendanceModify from "./admin/pages/StudentAttendanceModify";
import EmployeeAttendanceEntry from "./admin/pages/EmployeeAttendanceEntry";
import EmployeeAttendanceModify from "./admin/pages/EmployeeAttendanceModify";
import SearchEmployee from './admin/pages/SearchEmployee';
import AccountMaster from './admin/pages/AccountMaster';
import AccountEdit from './admin/pages/AccountEdit';
import IncomeList from './admin/pages/IncomeList';
import AddIncome from './admin/pages/AddIncome';
import RegularMarksReport from './admin/pages/RegularMarksReport';
import MarksReportCustom from './admin/pages/MarksReportCustom';
import RankListPreparation from './admin/pages/RankListPreparation';
import MarksListConsolidated from './admin/pages/MarksListConsolidated';
import CompiledSheet from './admin/pages/CompiledSheet';
import GeneralSetting from './admin/pages/GeneralSetting'; 
import ResultSetting from './admin/pages/ResultSetting';

// parents route
import ChildProfile from './admin/pages/parents/ChildProfile';
import FeePayment from './admin/pages/parents/FeePayment';
import FeeHistory from './admin/pages/parents/FeeHistory';
import HomeWork from './admin/pages/parents/HomeWork';
import AttendanceReport from './admin/pages/parents/AttendanceReport';
import QuestionReport from './admin/pages/QuestionReport';

function Hello() {

  return (
<Router>
<>
<Routes>
        <Route path='/' exact component={Login}></Route>
        <Route path="login" element={<Login/>} />
		<Route path="new_registration" element={<Registration/>} />
        <Route path="users" element={<Users/>} />
		<Route path="course_list" element={<CourseList/>} />
        <Route path="course_add" element={<CourseAdd/>} />
		<Route path="/course_edit/:id" element={<CourseEdit/>} exact />
		<Route path="class_list" element={<ClassList/>} />
        <Route path="class_add"  element={<AddClass/>} />
        <Route path="class_edit/:id"  element={<EditClass/>} />
        <Route path="section_list" element={<SectionList/>} />
        <Route path="section_add" element={<SectionAdd/>} />
        <Route path="section_edit/:id" element={<SectionEdit/>} />
		<Route path="subject_add" element={<SubjectAdd/>} />
        <Route path="dashboard" element={<Dashboard/>} />
		<Route path="class_wise_subject_list" element={<ClassWiseSubjectList/>} />
		<Route path="class_wise_subject_add" element={<ClassWiseSubjectAdd/>} />
		<Route path="class_wise_subject_create" element={<ClassWiseSubjectCreate/>} />
		<Route path="class_wise_subject_edit/:id" element={<ClassWiseSubjectEdit/>} />
		<Route path="station_list" element={<StationList/>} />
		<Route path="station_add"  element={<AddStation/>} />
		<Route path="station_edit/:id"  element={<EditStation/>} />
		<Route path="station_view/:id" element={<ViewStation/>} />
		<Route path="route_list" element={<RouteList/>} />
		<Route path="route_add" element={<AddRoute/>} />
		<Route path="route_view/:id" element={<ViewRoute/>} />
		<Route path="route_edit/:id" element={<EditRoute/>} />
        <Route path="feecat_list" element={<FeeCatList/>} />
        <Route path="feecat_add" element={<FeeCatAdd/>} />
		<Route path="feecat_view/:id" element={<FeeCatView/>} />
		<Route path="/feecat_edit/:id" element={<FeeCatEdit/>} />
		<Route path="feeslot" element={<Feeslot/>} />
		<Route path="fee_amount_list" element={<FeeAmountList/>} />
		<Route path="fee_amount_add" element={<FeeAmountCreate/>} />
		<Route path="fee_amount_edit/:id" element={<FeeAmountEdit/>} />
		<Route path="fee_individual" element={<FeeAmountIndividual/>} />
		<Route path="fine_setting" element={<FineSetting/>} />
		<Route path="fee_concession" element={<FeeConcession/>} />
		<Route path="payment_mode_list" element={<PaymentModeList/>} />
	    <Route path="payment_mode_add" element={<PaymentModeCreate/>} />
		<Route path="payment_mode_edit/:id" element={<PaymentModeEdit/>} />
		<Route path="subject_list" element={<SubjectList/>} />
		<Route path="subject_edit/:id" element={<SubjectEdit/>} />
		<Route path="student_list" element={<StudentList/>} />
		<Route path="student_add/:id?" element={<StudentAdd/>} />
		<Route path="student_edit/:id" element={<StudentEdit/>} />
		<Route path="vehicle_list" element={<VehicleList/>} />
		<Route path="vehicle_add"  element={<AddVehicle/>} />
		<Route path="vehicle_edit/:id" element={<EditVehicle/>} />
		<Route path="feecollection" element={<FeeCollection/>} />
		<Route path="print_id_card" element={<PrintIdCard/>} />
		<Route path="employee_list" element={<EmployeeList/>} />
		<Route path="employee_add" element={<EmployeeAdd/>} />
		<Route path="employee_edit/:id" element={<EmployeeEdit/>} />
        <Route path="department_add" element={<DepartmentAdd/>} />
        <Route path="department_list" element={<DepartmentList/>} />
        <Route path="department_edit/:id"  element={<DepartmentEdit/>} />
        <Route path="designation_list" element={<DesignationList/>} />
        <Route path="designation_add" element={<DesignationAdd/>} />
        <Route path="designation_edit/:id"  element={<DesignationEdit/>} />
        <Route path="qualification_list" element={<QualificationList/>} />
        <Route path="qualification_add" element={<QualificationAdd/>} />
        <Route path="qualification_edit/:id"  element={<QualificationEdit/>} />
		<Route path="exam_list" element={<ExamList/>} />
		<Route path="exam_add" element={<ExamAdd/>} />
		<Route path="exam_edit/:id" element={<ExamEdit/>} />
		<Route path="exam_date_sheet" element={<ExamDateSheet/>} />
		<Route path="exam_date_sheet_add" element={<ExamDateSheetAdd/>} />
		<Route path="exam_date_sheet_edit/:id" element={<ExamDateSheetEdit/>} />
		<Route path="question-report" element={<QuestionReport/>} />
		<Route path="grade_list" element={<GradeList />} />
		<Route path="grade_add" element={<GradeAdd />} />
		<Route path="grade_edit/:id"  element={<GradeEdit/>} />
		<Route path="supplier_list" element={<SupplierList />} />
		<Route path='supplier_add' element={<SupplierAdd/>} />
		<Route path='supplier_edit/:id' element={<SupplierEdit />} />
		<Route path='maintenance_add' element={<MaintenanceAdd/>} />
		<Route path="maintenance_list" element={<MaintenanceList />} />
		<Route path='maintenance_edit/:id' element={<MaintenanceEdit />} />
		<Route path='vehicle_maintenance_list' element={<VehicleMaintenanceList/>} />
		<Route path='vehicle_maintenance_add' element={<VehicleMaintenanceAdd/>} />
		<Route path='vehicle_maintenance_edit/:id' element={<VehicleMaintenanceEdit/>} />
		<Route path='fuel_consumption_add' element={<FuelConsumptionAdd/>} />
		<Route path='fuel_consumption_list' element={<FuelConsumptionList/>} />
		<Route path='fuel_consumption_edit/:id' element={<FuelConsumptionEdit/>} />
		<Route path='routewise_student_list' element={<RoutewiseStudentList/>} />
		<Route path='stationwise_student_list' element={<StationwiseStudentList/>} />
		<Route path='assign_subject_wise_marks' element={<AssignSubjectWiseMarks/>} />
		<Route path='vehicle_maintenance_report' element={<VehicleMaintenanceReport/>} />
		<Route path='fuel_consumption_report' element={<FuelConsumptionReport/>} />
		<Route path='change_password' element={<ChangePassword/>} />
		<Route path="registration_fee" element={<RegistrationFee/>} />
		<Route path="registration_fee_add" element={<RegistrationFeeAdd/>} />
		<Route path="registration_fee_edit/:id" element={<RegistrationFeeEdit/>} />
		<Route path="registration_list" element={<RegistrationList/>} />
		<Route path="registration_create" element={<RegistrationAdd/>} />
		<Route path="registration_edit/:id" element={<RegistrationEdit/>} />
		<Route path="class_wise_strength" element={<ClassWiseStrength/>} />
		<Route path="registered_student_list" element={<RegisteredStudentList />} />
		<Route path="total_registration" element={<TotalRegistration />} />
		<Route path="student_registered" element={<RegistrationNew/>} />
		<Route path="experience_certificate" element={<ExperienceCertificate />} />
		<Route path="search_student" element={<SearchStudent/>} />
		<Route path="add_holiday" element={<AddHoliday />} />
		<Route path="holiday_list" element={<HolidayList />} />
		<Route path="holiday_edit/:id" element={<HolidayEdit />} />
		<Route path="left_employee" element={<LeftEmployeeEntry />} />
		<Route path="notice_add" element={<NoticeAdd />} />
		<Route path="notice_list" element={<NoticeList />} />
		<Route path="notice_edit/:id" element={<NoticeEdit />} />
		<Route path="slc_list" element={<SlcList/>} />
		<Route path="slc_add" element={<AddSlc/>} />
		<Route path="slc_edit/:id" element={<EditSlc/>} />
		<Route path="cc_list" element={<CcList/>} />
		<Route path="cc_add" element={<AddCc/>} />
		<Route path="cc_edit/:id" element={<EditCc/>} />
		<Route path="bc_list" element={<BcList/>} />
		<Route path="bc_add" element={<AddBc/>} />
		<Route path="admission_form" element={<AdmissionForm/>} />
		<Route path="profile" element={<SchoolDetail/>} />
		<Route path="profile_edit/:id" element={<SchoolProfile/>} />
		<Route path="student_promote" element={<StudentPromotion/>} />
		<Route path="assign_class_teacher_list" element={<TeacherClassList/>} />
		{/* <Route path="assign_class_to_teacher" element={<AssignTeacherClass/>} /> */}
		<Route path="assign_class_to_teacher_edit/:id" element={<AssignTeacherClassEdit/>} />
		<Route path="assign_subject_teacher_list" element={<SubjectTeacherList/>} />
		<Route path="assign_subject_to_teacher" element={<AssignTeacherSubject/>} />
		<Route path="assign_subject_to_teacher_edit/:id" element={<AssignTeacherSubjectEdit/>} />
		<Route path="assign_home_work" element={<AssignHomeWork/>} />
		<Route path="view_home_work" element={<ViewHomeWork/>} />
		<Route path="student_attendance_entry" element={<StudentAttendanceEntry/>} />
		<Route path="student_attendance_modify" element={<StudentAttendanceModify/>} />
		<Route path="employee_attendance_entry" element={<EmployeeAttendanceEntry/>} />
		<Route path="employee_attendance_modify" element={<EmployeeAttendanceModify/>} />
		<Route path="search_employee" element={<SearchEmployee/>} />
		<Route path="account_master" element={<AccountMaster/>} />
		<Route path="account_edit/:id" element={<AccountEdit/>} />
		<Route path="income_master" element={<IncomeList/>} />
		<Route path="income_add" element={<AddIncome/>} />
		<Route path='regular-marks-report' element={<RegularMarksReport/>} />
		<Route path='marks-report-customized' element={<MarksReportCustom/>} />
		<Route path='rank-list' element={<RankListPreparation/>} />
		<Route path='marks-list-consolidated' element={<MarksListConsolidated/>} />
		<Route path='compiled-sheet' element={<CompiledSheet/>} />

		<Route path="general_setting" element={<GeneralSetting/>} />
		<Route path="result_setting" element={<ResultSetting/>} />



        {/* parents route */}
		<Route path="child-details" element={<ChildProfile/>} />
		<Route path="fee-payment" element={<FeePayment/>} />
		<Route path="fee-history" element={<FeeHistory/>} />
		<Route path="homework" element={<HomeWork/>} />
		<Route path="attendance-report" element={<AttendanceReport/>} />




    </Routes>
</>
</Router>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Hello />);

export default Hello;
