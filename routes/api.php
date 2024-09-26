<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\ClassController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\ClassWiseSubjectController;
use App\Http\Controllers\StationController;
use App\Http\Controllers\RouteController;
use App\Http\Controllers\FeeCategoryController;
use App\Http\Controllers\FeeSlotController;
use App\Http\Controllers\FeeCollectionController;
use App\Http\Controllers\FeeAmountController;
use App\Http\Controllers\FeeIndividualController;
use App\Http\Controllers\FineSettingController;
use App\Http\Controllers\FeeConcessionController;
use App\Http\Controllers\PaymentModeController;
use App\Http\Controllers\StudentMasterController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\PrintIdController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\DesignationController;
use App\Http\Controllers\QualificationController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\GradeController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\MaintenanceController;
use App\Http\Controllers\VehicleMaintenanceTransactionController;
use App\Http\Controllers\FuelConsumptionController;
use App\Http\Controllers\ExamDateSheetController;
use App\Http\Controllers\RoutewiseStudentListController;
use App\Http\Controllers\StationwiseStudentsController;
use App\Http\Controllers\VehicleMaintenanceReportController;
use App\Http\Controllers\FuelConsumptionReportController;
use App\Http\Controllers\StudentRegisterController;
use App\Http\Controllers\RegistrationFeeController;
use App\Http\Controllers\ChangePasswordController;
use App\Http\Controllers\ClassWiseStrengthController;
use App\Http\Controllers\RegisteredStudentListController;
use App\Http\Controllers\ExperienceCertificateController;
use App\Http\Controllers\StudentSearchController;
use App\Http\Controllers\HolidayController;
use App\Http\Controllers\NoticeController;
use App\Http\Controllers\TransferCertificateController;
use App\Http\Controllers\CharacterCertificateController;
use App\Http\Controllers\BirthCertificateController;
use App\Http\Controllers\StudentPromotionController;
use App\Http\Controllers\TeacherClassController;
use App\Http\Controllers\TeacherSubjectController;
use App\Http\Controllers\HomeWorkController;
use App\Http\Controllers\StudentAttendanceController;
use App\Http\Controllers\EmployeeAttendanceController;
use App\Http\Controllers\EmployeeSearchController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\IncomeController;
use App\Http\Controllers\MarkReportController;


// parent master
use App\Http\Controllers\ParentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/* Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});  */

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post("add_course_process",[CourseController::class,'add_course_process']);
Route::delete("delete_course_process/{id}",[CourseController::class,'delete_course_process']);
Route::post("add_section_process",[SectionController::class,'add_section_process']);
Route::post("edit_section_process",[SectionController::class,'edit_section_process']);
Route::delete("delete_section_process/{id}",[SectionController::class,'delete_section_process']);
Route::get("course_list",[CourseController::class,'course_list']);
Route::get("section_list",[SectionController::class,'section_list']);
Route::get("subject_list",[SubjectController::class,'subject_list']);
Route::post("edit_subject_process",[SubjectController::class,'edit_subject_process']);
Route::delete("delete_subject_process/{id}",[SubjectController::class,'delete_subject_process']);
Route::get("subject_by_id/{id}",[SubjectController::class,'subject_by_id']);
Route::get("subject/listsome/{key}",[SubjectController::class,'listSome']);
Route::get("section_by_id/{id}",[SectionController::class,'section_by_id']);
Route::get('/class/index', [ClassController::class, 'index']);
Route::post('/class/create', [ClassController::class, 'create']);
Route::get('/class/edit/{id}', [ClassController::class, 'edit']);
Route::post('/class/update/{id}', [ClassController::class, 'update']);
Route::delete('/class/delete/{id}', [ClassController::class, 'delete']);
Route::get('/class/getcourses', [ClassController::class, 'getCourses']);
Route::get('/class/getnextcourse', [ClassController::class, 'getNextCourse']);
Route::get('/class/getclassbycourse/{id}', [ClassController::class, 'getClassByCourse']);
Route::get('/class/getnextclassbycourse/{id}', [ClassController::class, 'getNextClassByCourse']);
Route::get('/class/getsectionbyclassandcourse/{id1}/{id2}', [ClassController::class, 'getSectionByClassAndCourse']);
Route::get('/class/getnextsectionbyclassandcourse/{id1}/{id2}', [ClassController::class, 'getNextSectionByClassAndCourse']);
Route::get('/class/getsectionsubjectbyclass/{id1}/{id2}/{id3?}', [ClassController::class, 'getSectionSubjectByClass']);
Route::get('/class/getclasses', [ClassController::class, 'getClasses']);
Route::get('/class/getsubjects', [ClassController::class, 'getSubjects']);
Route::get("class_list_by_id/{id}",[ClassController::class,'class_list_by_id']);
Route::post("add_subject_process",[SubjectController::class,'add_subject_process']);
Route::post("update_course_process",[CourseController::class,'update_course_process']);
Route::get("course_list_id/{id}",[CourseController::class,'course_list_id']);

Route::post("add_student_process",[StudentController::class,'add_student_process']);

Route::post("add_class_wise_sub_process",[ClassWiseSubjectController::class,'add_class_wise_sub_process']);
Route::post("edit_class_wise_sub_process/{id}",[ClassWiseSubjectController::class,'edit_class_wise_sub_process']);
Route::get("section_list_by_course_class/{course_id}/{class_id}",[SectionController::class,'section_list_by_course_class']);
Route::get("section_class_list_by_course/{key}",[SectionController::class,'section_class_list_by_course']);
Route::get("feecat_list",[FeeCategoryController::class,'feecat_list']);
Route::post("update_feecat_process",[FeeCategoryController::class,'update_feecat_process']);
Route::get("feecat_list_id/{id}",[FeeCategoryController::class,'feecat_list_id']);
Route::delete("delete_feecat/{courseId}",[FeeCategoryController::class,'delete_feecat']);
Route::get('/station/index',[StationController::class,'index']);
Route::post('/station/create',[StationController::class,'create']);
Route::get('/station/edit/{id}', [StationController::class, 'edit']);
Route::post('/station/update/{id}', [StationController::class, 'update']);
Route::delete('/station/delete/{id}', [StationController::class, 'delete']);
Route::get('/route/index',[RouteController::class,'index']);
Route::post('/route/create',[RouteController::class,'create']);
Route::get('/route/edit/{id}', [RouteController::class, 'edit']);
Route::post('/route/update/{id}', [RouteController::class, 'update']);
Route::delete('/route/delete/{id}', [RouteController::class, 'delete']);
Route::get('/route/getstations', [RouteController::class, 'getStations']);

Route::get("class_wise_subject",[ClassWiseSubjectController::class,'class_wise_subject_list']);
Route::get("class_wise_subject_desc",[ClassWiseSubjectController::class,'class_wise_subject_desc']);
Route::get("class_wise_sub_list_id/{id}",[ClassWiseSubjectController::class,'class_wise_sub_list_id']);
Route::get("class_wise_sub_desc_id/{id}",[ClassWiseSubjectController::class,'class_wise_sub_desc_id']);

Route::get("feecat/index",[FeeCategoryController::class,'index']);
Route::post('feecat/create',[FeeCategoryController::class,'create']);
Route::get('/feecat/edit/{id}',[FeeCategoryController::class,'edit']);
Route::post('/feecat/update/{id}', [FeeCategoryController::class, 'update']);
Route::delete('/feecat/delete/{id}', [FeeCategoryController::class, 'delete']);
Route::get("feecat/listall",[FeeCategoryController::class,'listAll']);
Route::get('/feeslot/index',[FeeSlotController::class,'index']);
Route::post('/feeslot/create',[FeeSlotController::class,'create']);
Route::get('/feeamount/index',[FeeAmountController::class,'index']);
Route::post('/feeamount/create',[FeeAmountController::class,'create']);
Route::get('/feeamount/edit/{id}',[FeeAmountController::class,'edit']);
Route::post('/feeamount/update/{id}', [FeeAmountController::class, 'update']);
Route::delete('/feeamount/delete/{id}', [FeeAmountController::class, 'delete']);
Route::get('/feeindividual/getdetail/{key1}/{key2}',[FeeIndividualController::class,'getDetail']);
Route::post('feeindividual/create',[FeeIndividualController::class,'create']);
Route::get('/finesetting/index',[FineSettingController::class,'index']);
Route::post('/finesetting/add',[FineSettingController::class,'add']);
Route::get('/feeconcession/index',[FeeConcessionController::class,'index']);
Route::post('/feeconcession/add',[FeeConcessionController::class,'add']);
Route::get('/paymentmode/index',[PaymentModeController::class,'index']);
Route::post('/paymentmode/add',[PaymentModeController::class,'add']);
Route::get('/paymentmode/edit/{id}',[PaymentModeController::class,'edit']);
Route::post('/paymentmode/update/{id}', [PaymentModeController::class, 'update']);
Route::delete('/paymentmode/delete/{id}', [PaymentModeController::class, 'delete']);
Route::get('/studentmaster/index',[StudentMasterController::class,'index']);
Route::post('/studentmaster/add',[StudentMasterController::class,'add']);

Route::get('/studentmaster/getstates',[StudentMasterController::class,'getStates']);
Route::get('/studentmaster/getclasswisesubjects/{id1?}/{id2?}/{id3?}',[StudentMasterController::class,'getClassWiseSubjects']);
Route::get('/studentmaster/getdistrict/{id}',[StudentMasterController::class,'getDistrict']);
Route::get("class_wise_subject_delete/{id}",[ClassWiseSubjectController::class,'class_wise_sub_delete']);
Route::get('/studentmaster/getroutes/{id}',[StudentMasterController::class,'getRoutes']);
Route::get('/studentmaster/getvehicles/{id}',[StudentMasterController::class,'getVehicles']);
Route::get('/studentmaster/getsuggestion/{key}',[StudentMasterController::class,'getSuggestion']);
Route::get('/studentmaster/getstudent/{key}',[StudentMasterController::class,'getStudent']);
Route::get('/studentmaster/getrollno/{id1}/{id2}',[StudentMasterController::class,'getRollNo']);
Route::get('/studentmaster/edit/{id}',[StudentMasterController::class,'edit']);
Route::get('/studentmaster/print/{id1}/{id2}',[StudentMasterController::class,'printAdmission']);
Route::post('/studentmaster/update/{id}', [StudentMasterController::class,'update']);
Route::delete('/studentmaster/delete/{id}', [StudentMasterController::class,'delete']);
Route::get('/vehicle/index',[VehicleController::class,'index']);
Route::get('/vehicle/getallroutes',[VehicleController::class,'getAllRoutes']);
Route::post('/vehicle/add',[VehicleController::class,'add']);
Route::get('/vehicle/edit/{id}',[VehicleController::class,'edit']);
Route::post('/vehicle/update/{id}', [VehicleController::class,'update']);
Route::delete('/vehicle/delete/{id}', [VehicleController::class,'delete']);
Route::get('/feecollection/index',[FeeCollectionController::class,'index']);
Route::get('/feecollection/getfeedetails/{key}',[FeeCollectionController::class,'getFeeDetails']);
Route::get('/feecollection/getpreviousfee/{key}',[FeeCollectionController::class,'getPreviousFee']);
Route::post('/feecollection/create',[FeeCollectionController::class,'create']);
Route::delete('/feecollection/delete/{id}', [FeeCollectionController::class,'delete']);
Route::get('/feecollection/printreceipt/{id1}/{id2}',[FeeCollectionController::class,'printReceipt']);
Route::get('/feecollection/getfeetransaction/{key}',[FeeCollectionController::class,'getFeeTransaction']);
Route::get('/feecollection/getinvoice/{key}',[FeeCollectionController::class,'getInvoice']);
Route::get('/printid/getstudentlist/{key1}/{key2?}',[PrintIdController::class,'getStudentList']);
Route::get('/printid/getlayouts/{key}',[PrintIdController::class,'getLayouts']);
Route::get('/printid/getprints/{key1}/{key2}',[PrintIdController::class,'getPrints']);
Route::get('/printid/getpreview/{key}',[PrintIdController::class,'getPreview']);
Route::get('/employee/index',[EmployeeController::class,'index']);
Route::post('/employee/add',[EmployeeController::class,'add']);
Route::get('/employee/getdepartments',[EmployeeController::class,'getDepartments']);
Route::get('/employee/getqualifications',[EmployeeController::class,'getQualifications']);
Route::get('/employee/getdesignations/{key}',[EmployeeController::class,'getDesignations']);
Route::get('/employee/edit/{id}',[EmployeeController::class,'edit']);
Route::get('/employee/getPrints/{id}',[EmployeeController::class,'getPrints']);
Route::get('/employee/getId',[EmployeeController::class,'getId']);
Route::get('/employee/getPrintAll/{id}',[EmployeeController::class,'getPrintAll']);
Route::post('/employee/update/{id}', [EmployeeController::class,'update']);
Route::delete('/employee/delete/{id}',[EmployeeController::class,'delete']);
Route::post('/employee/loadEmployee',[EmployeeController::class,'loadEmployee']);
Route::post('/employee/leftEmployee/',[EmployeeController::class,'leftEmployee']);

Route::get('/department/index', [DepartmentController::class, 'index']);
Route::post('/department/create', [DepartmentController::class, 'create']);
Route::get('/department/edit/{id}', [DepartmentController::class, 'edit']);
Route::post('/department/update/{id}', [DepartmentController::class, 'update']);
Route::delete('/department/delete/{id}', [DepartmentController::class, 'delete']);
Route::get('/designation/index', [DesignationController::class, 'index']);
Route::post('/designation/create', [DesignationController::class, 'create']);
Route::get('/designation/getdepartment', [DesignationController::class, 'getDepartment']);
Route::get('/designation/edit/{id}', [DesignationController::class, 'edit']);
Route::post('/designation/update/{id}', [DesignationController::class, 'update']);
Route::delete('/designation/delete/{id}', [DesignationController::class, 'delete']);
Route::get('/qualification/index', [QualificationController::class, 'index']);
Route::post('/qualification/create', [QualificationController::class, 'create']);
Route::get('/qualification/edit/{id}', [QualificationController::class, 'edit']);
Route::post('/qualification/update/{id}', [QualificationController::class, 'update']);
Route::delete('/qualification/delete/{id}', [QualificationController::class, 'delete']);
Route::get('/exam/index',[ExamController::class,'index']);
Route::post('/exam/add',[ExamController::class,'add']);
Route::get('/exam/edit/{id}',[ExamController::class,'edit']);
Route::post('/exam/update/{id}', [ExamController::class,'update']);
Route::delete('/exam/delete/{id}',[ExamController::class,'delete']);
Route::get('/exam/index',[ExamController::class,'index']);
Route::get('/exam/listall',[ExamController::class,'listAll']);
Route::get('/exam/list_avail',[ExamController::class,'list_avail']);
Route::post('/signin',[LoginController::class,'signIn']);
Route::get('/signout',[LoginController::class,'signOut']);
Route::get('/checkauth',[DashboardController::class,'checkAuth']);
Route::get('/setauth',[DashboardController::class,'setAuth']);

Route::get('/grade/index', [GradeController::class, 'index']);
Route::post('/grade/create', [GradeController::class, 'create']);
Route::get('/grade/edit/{id}', [GradeController::class, 'edit']);
Route::post('/grade/update/{id}', [GradeController::class, 'update']);
Route::delete('/grade/delete/{id}', [GradeController::class, 'delete']);


Route::get('/supplier/index',[SupplierController::class,'index']);
Route::post('/supplier/create', [SupplierController::class, 'create']);
Route::get('/supplier/edit/{id}', [SupplierController::class, 'edit']);
Route::post('/supplier/update/{id}', [SupplierController::class,'update']);
Route::delete('/supplier/delete/{id}', [SupplierController::class, 'delete']);


Route::get('/maintenance/index', [MaintenanceController::class, 'index']);
Route::post('/maintenance/create', [MaintenanceController::class, 'create']);
Route::get('/maintenance/edit/{id}', [MaintenanceController::class, 'edit']);
Route::post('/maintenance/update/{id}', [MaintenanceController::class, 'update']);
Route::delete('/maintenance/delete/{id}', [MaintenanceController::class, 'delete']);

Route::get('/maintenance/getMaintenance', [VehicleMaintenanceTransactionController::class, 'getMaintenance']);
Route::get('/vehicle/getVehicle', [VehicleMaintenanceTransactionController::class, 'getVehicle']);
Route::get('/vehiclemaintenance/index', [VehicleMaintenanceTransactionController::class, 'index']);
Route::post('/vehiclemaintenance/create', [VehicleMaintenanceTransactionController::class, 'create']);
Route::get('/vehiclemaintenance/edit/{id}', [VehicleMaintenanceTransactionController::class, 'edit']);
Route::post('/vehiclemaintenance/update/{id}', [VehicleMaintenanceTransactionController::class, 'update']);
Route::delete('/vehiclemaintenance/delete/{id}', [VehicleMaintenanceTransactionController::class, 'delete']);

Route::get('/supplier/getSupplier', [FuelConsumptionController::class, 'getSupplier']);
Route::get('/payment/getPaymentMode', [FuelConsumptionController::class, 'getPaymentMode']);
Route::get('/fuel/getFuelType', [FuelConsumptionController::class, 'getFuelType']);
Route::get('/fuelconsumption/index', [FuelConsumptionController::class, 'index']);
Route::post('/fuelconsumption/create', [FuelConsumptionController::class, 'create']);
Route::get('/fuelconsumption/edit/{id}', [FuelConsumptionController::class, 'edit']);
Route::post('/fuelconsumption/update/{id}', [FuelConsumptionController::class, 'update']);
Route::delete('/fuelconsumption/delete/{id}', [FuelConsumptionController::class, 'delete']);

Route::get('/examdatesheet/index',[ExamDateSheetController::class,'index']);
Route::post('/examdatesheet/add',[ExamDateSheetController::class,'add']);
Route::get('/examdatesheet/edit/{id}',[ExamDateSheetController::class,'edit']); 
Route::post('/examdatesheet/update/{id}', [ExamDateSheetController::class, 'update']);
Route::delete('/examdatesheet/delete/{id}', [ExamDateSheetController::class, 'delete']);
Route::get('/examdatesheet/getcourse/{id}',[ExamDateSheetController::class,'getCourse']);
Route::get('/examdatesheet/getclass/{id1}/{id2}',[ExamDateSheetController::class,'getClass']);
Route::get('/examdatesheet/getsection/{id1}/{id2}/{id3}',[ExamDateSheetController::class,'getSection']);
Route::get('/examdatesheet/getsubject/{id1}/{id2}/{id3}/{id4}',[ExamDateSheetController::class,'getSubject']);
Route::get('/examdatesheet/getstudents/{id1}/{id2}/{id3}/{id4}',[ExamDateSheetController::class,'getStudents']);
Route::get('/examdatesheet/getmark',[ExamDateSheetController::class,'getMark']);
Route::post('/examdatesheet/addmark',[ExamDateSheetController::class,'addMark']);
Route::get('/examdatesheet/fetch_exam_datesheet/{key}',[ExamDateSheetController::class,'fetch_exam_datesheet']);
Route::get('/examdatesheet/allSubject/{id1}/{id2}/{id3}/{id4}/{id5}',[ExamDateSheetController::class,'allSubject']);
Route::get('/examdatesheet/compiledsheetMarks/{id1}/{id2}/{id3}/{id4}',[ExamDateSheetController::class,'compiledsheetMarks']);


// mark analysis reports
Route::get('/markreport/gradesAll',[MarkReportController::class,'gradesAll']);
Route::get('/markreport/get_section_student/{id1}/{id2}/{id3}',[MarkReportController::class,'get_section_student']);
Route::get('/markreport/getstudents/{id1}/{id2}/{id3}/{id4}',[MarkReportController::class,'getStudents']);
Route::get('/markreport/printstudent/{id1}',[MarkReportController::class,'printStudent']);
Route::get('/markreport/printstudentall/',[MarkReportController::class,'printStudentAll']);
Route::get('/markreport/printstudentallexam/',[MarkReportController::class,'printStudentAllExam']);
Route::get('/markreport/excelstudentallexam/',[MarkReportController::class,'ExcelStudentAllExam']);
Route::post('/markreport/updateRemark',[MarkReportController::class,'updateRemark']);
Route::get('/markreport/remarks', [MarkReportController::class, 'getRemarks']);
Route::get('/markreport/getStudBySection/{id1}/{id2}/{id3}',[MarkReportController::class,'getStudBySection']);
Route::get('/markreport/getExamByStudent/{id1}/{id2}/{id3}/{id4}',[MarkReportController::class,'getExamByStudent']);
Route::get('/markreport/getAllSubjects/{id1}/{id2}/{id3}/{id4}/{id5}',[MarkReportController::class,'getAllSubjects']);
Route::get('/markreport/consolidatedList/{id1}/{id2}/{id3}/{id4}/{id5}',[MarkReportController::class,'consolidatedList']);

// compiled sheet
Route::get('/markreport/getCompiledExam/{id1}/{id2}/{id3}',[MarkReportController::class,'getCompiledExam']);
Route::get('/markreport/compliedAllStudents/{id1}/{id2}/{id3}/{id4}',[MarkReportController::class,'compliedAllStudents']);





Route::get('/route/getRoutes', [RoutewiseStudentListController::class, 'getRoutes']);
Route::get('/routewisestudent/getStudents/{id}', [RoutewiseStudentListController::class, 'getStudents']);
Route::get('/routewisestudent/getPrints/{id1}',[RoutewiseStudentListController::class,'getPrints']);

Route::get('/station/getStations', [StationwiseStudentsController::class, 'getStations']);
Route::get('/stationwisestudent/getStudents/{id}', [StationwiseStudentsController::class, 'getStudents']);
Route::get('/stationwisestudent/getPrints/{id1}',[StationwiseStudentsController::class,'getPrints']);

Route::get('/maintenance/getMaintenance/{id}', [VehicleMaintenanceReportController::class, 'getMaintenance']);
Route::get('/maintenance/getmaintenancereport', [VehicleMaintenanceReportController::class, 'getMaintenanceReport']);
Route::get('/fuelconsumption/getconsumptionreport/{id}/{date}', [FuelConsumptionReportController::class, 'getConsumptionReport']);
Route::get('/fuelconsumption/getExcel', [FuelConsumptionReportController::class, 'getExcel']);

Route::get('/registrationfee/index',[RegistrationFeeController::class,'index']);
Route::post('/registrationfee/add',[RegistrationFeeController::class,'add']);
Route::get('/registrationfee/edit/{id}',[RegistrationFeeController::class,'edit']);
Route::post('/registrationfee/update/{id}', [RegistrationFeeController::class, 'update']);
Route::delete('/registrationfee/delete/{id}', [RegistrationFeeController::class, 'delete']);

Route::get('/registration/index',[StudentRegisterController::class,'index']);
Route::get('/registration/export',[StudentRegisterController::class,'export']);
Route::get('/registration/getregistration',[StudentRegisterController::class,'getRegistration']);
Route::get('/registration/getnew',[StudentRegisterController::class,'getNew']);
Route::get('/registration/getclassfee/{id}',[StudentRegisterController::class,'getClassFee']);
Route::post('/registration/add',[StudentRegisterController::class,'add']);
Route::post('/registration/create',[StudentRegisterController::class,'create']);
Route::get('/registration/edit/{id}',[StudentRegisterController::class,'edit']);
Route::get('/registration/print/{id}',[StudentRegisterController::class,'printReg']);
Route::post('/registration/update/{id}', [StudentRegisterController::class,'update']);
Route::delete('/registration/delete/{id}', [StudentRegisterController::class,'delete']);
Route::get('/registration/downloadexcel/{id}',[StudentRegisterController::class,'downloadExcel']);
Route::get('/profile/{id}',[DashboardController::class,'getProfile']);
Route::post('/changepassword/{id}',[DashboardController::class,'changePassword']);
Route::post('/profile/edit/{id}', [DashboardController::class,'editProfile']);

Route::get('/classwisestrength/index', [ClassWiseStrengthController::class,'index']);
Route::get('/registeredstudent/index',[RegisteredStudentListController::class,'index']);

Route::post('/employee/load',[ExperienceCertificateController::class,'load']);
Route::get('/employee/printcertificate/{id}',[ExperienceCertificateController::class,'printCertificate']);
Route::get('/searchstudent/index', [StudentSearchController::class,'index']);
Route::get('/searchstudent/print', [StudentSearchController::class,'printRec']);

Route::get('/searchstudent/export',[StudentSearchController::class,'exportRec']);
Route::get('/searchstudent/downloadexcel/{id}',[StudentSearchController::class,'downloadExcel']);

Route::post('/holiday/create',[HolidayController::class,'create']);
Route::get('/holiday/index', [HolidayController::class, 'index']);
Route::get('/holiday/edit/{id}', [HolidayController::class, 'edit']);
Route::post('/holiday/update/{id}', [HolidayController::class, 'update']);
Route::delete('/holiday/delete/{id}', [HolidayController::class, 'delete']);

Route::post('/notice/create',[NoticeController::class,'create']);
Route::get('/notice/index', [NoticeController::class, 'index']);
Route::get('/notice/edit/{id}', [NoticeController::class, 'edit']);
Route::post('/notice/update/{id}', [NoticeController::class, 'update']);
Route::delete('/notice/delete/{id}', [NoticeController::class, 'delete']);

Route::get('/slc/index', [TransferCertificateController::class,'index']);
Route::get('/slc/getsuggest/{key}',[TransferCertificateController::class,'getSuggest']);
Route::get('/slc/getdetail/{key}',[TransferCertificateController::class,'getDetail']);
Route::post('/slc/create',[TransferCertificateController::class,'add']);
Route::get('/slc/edit/{key}',[TransferCertificateController::class,'edit']);
Route::post('/slc/update/{id}', [TransferCertificateController::class,'update']);
Route::get('/slc/print/{id}',[TransferCertificateController::class,'printSlc']);
Route::get('/slc/export',[TransferCertificateController::class,'exportRec']);
Route::get('/slc/downloadexcel/{id}',[TransferCertificateController::class,'downloadExcel']);

Route::get('/cc/index', [CharacterCertificateController::class,'index']);
Route::get('/cc/getsuggest/{key}',[CharacterCertificateController::class,'getSuggest']);
Route::get('/cc/getdetail/{key}',[CharacterCertificateController::class,'getDetail']);
Route::get('/cc/edit/{key}',[CharacterCertificateController::class,'edit']);
Route::post('/cc/update/{id}', [CharacterCertificateController::class,'update']);
Route::delete('/cc/delete/{id}', [CharacterCertificateController::class,'delete']);
Route::post('/cc/create',[CharacterCertificateController::class,'add']);
Route::get('/cc/print/{id1}/{id2}',[CharacterCertificateController::class,'printFormat']);

Route::get('/bc/index', [BirthCertificateController::class,'index']);
Route::get('/bc/getsuggest/{key}',[BirthCertificateController::class,'getSuggest']);
Route::get('/bc/getdetail/{key}',[BirthCertificateController::class,'getDetail']);
Route::delete('/bc/delete/{id}', [BirthCertificateController::class,'delete']);
Route::post('/bc/create',[BirthCertificateController::class,'add']);

Route::get('/promote/detail/{id1}/{id2}/{id3?}',[StudentPromotionController::class,'getDetail']);
Route::post('/promote/add',[StudentPromotionController::class,'add']);

Route::get('/teacherclass/index', [TeacherClassController::class,'index']);
// Route::post('/teacherclass/create',[TeacherClassController::class,'add']);
Route::get('/teacherclass/edit/{key}',[TeacherClassController::class,'edit']);
Route::post('/teacherclass/update/{id}', [TeacherClassController::class,'update']);
Route::get('/teacherclass/employeeIds', [TeacherClassController::class,'employeeIds']);


Route::get('/teachersubject/index', [TeacherSubjectController::class,'index']);
Route::post('/teachersubject/create',[TeacherSubjectController::class,'add']);
Route::get('/teachersubject/edit/{key}',[TeacherSubjectController::class,'edit']);
Route::post('/teachersubject/update/{id}', [TeacherSubjectController::class,'update']);
Route::get('/teachersubject/empList/{id}', [TeacherSubjectController::class,'empList']);


Route::get('/homework/detail/{id1}/{id2}/{id3?}',[HomeWorkController::class,'getDetail']);
Route::get('/homework/getsubjectlist/{id1}/{id2}/{id3?}',[HomeWorkController::class,'getSubjectList']);
Route::get('/homework/assignment',[HomeWorkController::class,'getAssignment']);
Route::post('/homework/create',[HomeWorkController::class,'add']);
Route::delete('/homework/delete/{id}', [HomeWorkController::class,'delete']);

Route::get('/attendance/getyear/',[StudentAttendanceController::class,'getYears']);
Route::get('/attendance/detail/{id1}/{id2}/{id3}/{id4?}/{id5?}/{id6?}',[StudentAttendanceController::class,'getDetail']);
Route::get('/attendance/gettypes/',[StudentAttendanceController::class,'getTypes']);
Route::get('/attendance/getsuggest/{key}',[StudentAttendanceController::class,'getSuggest']);
Route::get('/attendance/getindividual/{key}',[StudentAttendanceController::class,'getIndividual']);
Route::get('/attendance/getindividualsubject/{key}',[StudentAttendanceController::class,'getIndividualSubject']);
Route::post('/attendance/create',[StudentAttendanceController::class,'add']);
Route::get('/attendance/all/{id1}/{id2}/{id3}/{id4?}/{id5?}/{id6?}',[StudentAttendanceController::class,'getAttendance']);
Route::get('/attendance/individual/{key1}/{key2}/{key3?}',[StudentAttendanceController::class,'getIndividualAttendance']);
Route::get('/attendance/calender/{id1}/{id2}/{id3}/{id4?}/{id5?}/{id6?}',[StudentAttendanceController::class,'getCalender']);
Route::post('/attendance/edit',[StudentAttendanceController::class,'update']);
Route::post('/attendance/modify',[StudentAttendanceController::class,'updateCalender']);

Route::get('/empattendance/detail/{id1}/{id2}/{id3}/{id4?}',[EmployeeAttendanceController::class,'getDetail']);
Route::get('/empattendance/getindividual/{key1}/{key2}',[EmployeeAttendanceController::class,'getIndividual']);
Route::get('/empattendance/getsuggest/{key1}/{key2}',[EmployeeAttendanceController::class,'getSuggest']);
Route::post('/empattendance/create',[EmployeeAttendanceController::class,'add']);
Route::get('/empattendance/all/{id1}/{id2}/{id3}/{id4?}',[EmployeeAttendanceController::class,'getAttendance']);
Route::get('/empattendance/individual/{key1}/{key2}/{key3?}',[EmployeeAttendanceController::class,'getIndividualAttendance']);
Route::get('/empattendance/calender/{id1}/{id2}/{id3}/{id4?}/{id5?}',[EmployeeAttendanceController::class,'getCalender']);
Route::post('/empattendance/edit',[EmployeeAttendanceController::class,'update']);
Route::post('/empattendance/modify',[EmployeeAttendanceController::class,'updateCalender']);

Route::get('/searchemployee/index', [EmployeeSearchController::class,'index']);
Route::get('/searchemployee/export',[EmployeeSearchController::class,'exportRec']);
Route::get('/searchemployee/downloadexcel/{id}',[EmployeeSearchController::class,'downloadExcel']);
Route::get('/searchemployee/print', [EmployeeSearchController::class,'printRec']);

Route::get('/account/index', [AccountController::class,'index']);
Route::post('/account/create',[AccountController::class,'add']);
Route::get('/account/gettypes', [AccountController::class,'getTypes']);
Route::get('/account/edit/{key}',[AccountController::class,'edit']);
Route::post('/account/update/{id}', [AccountController::class,'update']);
Route::delete('/account/delete/{id}', [AccountController::class,'delete']);

Route::get('/income/index', [IncomeController::class,'index']);
Route::post('/income/create',[IncomeController::class,'add']);
Route::get('/income/getmodes',[IncomeController::class,'getModes']);
Route::get('/income/gettypes/{key}',[IncomeController::class,'getTypes']);
Route::get('/income/print/{key}', [IncomeController::class,'printInc']);


// parents route
Route::get('/parentList/{id}',[ParentController::class,'parent_single']);
Route::get('/child-details',[ParentController::class,'child_details']);
Route::get('/fee-payment',[ParentController::class,'fee_payment']);
Route::get('/fee-history',[ParentController::class,'fee_history']);
Route::get('/parents/homework',[ParentController::class,'homework']);
Route::get('/parents/attendance_report',[ParentController::class,'attendance_report']);


Route::get('/parents/getsuggestion/{key}',[ParentController::class,'getSuggestion']);

