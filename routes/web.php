<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/login', function () {
    return view('login');
})->name('login');

Route::get('/users', function () {
    return view('users');
});

Route::get('/change_password', function () {
    return view('change_password');
});

Route::get('/section_add', function () {
    return view('section_add');
});

Route::get('/section_edit/{id}', function () {
    return view('section_edit');
});

Route::get('/course_list', function () {
    return view('course_list');
});

Route::get('/course_add', function () {
    return view('course_add');
});

Route::get('/course_edit/{id}', function () {
    return view('course_edit');
});

Route::get('/course_delete/{id}', function () {
    return view('course_delete');
});

Route::get('/class_list', function () {
    return view('class_list');
});

Route::get('/class_add', function () {
    return view('add_class');
});

Route::get('/class_edit/{id}', function () {
    return view('edit_class');
});

Route::get('/section_list', function () {
    return view('section_list');
});

Route::get('/dashboard', function () {
    return view('dashboard');
});

Route::get('/subject_add', function () {
    return view('subject_add');
});

Route::get('/subject_edit/{id}', function () {
    return view('subject_edit');
});

Route::get('/subject_list', function () {
    return view('subject_list');
});

Route::get('/class_wise_subject_create', function () {
    return view('class_wise_subject_create');
});

Route::get('/class_wise_subject_add', function () {
    return view('class_wise_subject_add');
});

Route::get('/class_wise_subject_edit/{id}', function () {
    return view('class_wise_subject_edit');
});

Route::get('/station_list', function () {
    return view('station_list');
});

Route::get('/station_add', function () {
    return view('add_station');
});

Route::get('/station_view/{id}', function () {
    return view('view_station');
});

Route::get('/station_edit/{id}', function () {
    return view('edit_station');
});

Route::get('/route_list', function () {
    return view('route_list');
});

Route::get('/route_add', function () {
    return view('add_route');
});

Route::get('/route_edit/{id}', function () {
    return view('edit_route');
});

Route::get('/route_view/{id}', function () {
    return view('view_route');
});

Route::get('/feecat_view/{id}', function () {
    return view('feecat_view');
});

Route::get('/feecat_list', function () {
    return view('feecat_list');
});

Route::get('/feecat_add', function () {
    return view('feecat_add');
});

Route::get('/feecat_edit/{id}', function () {
    return view('feecat_edit');
});

Route::get('/feecat_delete/{id}', function () {
    return view('feecat_delete');
});

Route::get('/class_wise_subject_list', function () {
    return view('class_wise_subject_list');
});

Route::get('/feeslot', function () {
    return view('fee_slot');
});

Route::get('/fee_amount', function () {
    return view('fee_amount');
});

Route::get('/fee_amount_list', function () {
    return view('fee_amount_list');
});

Route::get('/fee_amount_add', function () {
    return view('fee_amount_add');
});
Route::get('/fee_amount_edit/{id}', function () {
    return view('fee_amount_edit');
});

Route::get('/fine_setting', function () {
    return view('fine_setting');
});
Route::get('/fee_concession', function () {
    return view('fee_concession');
});

Route::get('/payment_mode_list', function () {
    return view('payment_mode_list');
});

Route::get('/payment_mode_add', function () {
    return view('add_payment_mode');
});
Route::get('/payment_mode_edit/{id}', function () {
    return view('edit_payment_mode');
});

Route::get('/student_list', function () {
    return view('student_list');
});

Route::get('/student_add', function () {
    return view('add_student');
});

Route::get('/student_edit/{id}', function () {
    return view('edit_student');
});
Route::get('/vehicle_list', function () {
    return view('vehicle_list');
});

Route::get('/vehicle_add', function () {
    return view('add_vehicle');
});
Route::get('/vehicle_edit/{id}', function () {
    return view('edit_vehicle');
});

Route::get('/feecollection', function () {
    return view('fee_collection');
});

Route::get('/print_id_card', function () {
    return view('print_id_list');
});
Route::get('/employee_list', function () {
    return view('employee_list');
});

Route::get('/employee_add', function () {
    return view('add_employee');
});

Route::get('/employee_edit/{id}', function () {
    return view('edit_employee');
});

Route::get('/department_add', function () {
    return view('department_add');
});

Route::get('/department_list', function () {
    return view('department_list');
});

Route::get('/department_edit/{id}', function () {
    return view('department_edit');
});

Route::get('/designation_add', function () {
    return view('designation_add');
});

Route::get('/designation_list', function () {
    return view('designation_list');
});

Route::get('/designation_edit/{id}', function () {
    return view('designation_edit');
});

Route::get('/qualification_list', function () {
    return view('qualification_list');
});

Route::get('/qualification_edit/{id}', function () {
    return view('qualification_edit');
});

Route::get('/qualification_add', function () {
    return view('qualification_add');
});

Route::get('/exam_list', function () {
    return view('exam_list');
});

Route::get('/exam_add', function () {
    return view('add_exam');
});

Route::get('/exam_edit/{id}', function () {
    return view('edit_exam');
});

Route::get('/exam_date_sheet', function () {
    return view('exam_sheet');
});

Route::get('/question-report', function () {
    return view('question_report');
});

Route::get('/regular-marks-report', function () {
    return view('RegularMarksReport');
});

Route::get('/marks-report-customized', function () {
    return view('MarksReportCustom');
});

Route::get('/marks-list-consolidated', function () {
    return view('marks_list_consolidated');
});
Route::get('/compiled-sheet', function () {
    return view('compiled_sheet');
});

Route::get('/rank-list', function () {
    return view('rank_list');
});

Route::get('/grade_add', function () {
    return view('grade_add');
});

Route::get('/grade_list', function () {
    return view('grade_list');
});

Route::get('/grade_edit/{id}', function () {
    return view('grade_edit');
});

Route::get('/supplier_list', function () {
    return view('supplier_list');
});

Route::get('/supplier_add', function () {
    return view('supplier_add');
});

Route::get('/supplier_edit/{id}', function () {
    return view('supplier_edit');
});

Route::get('/maintenance_list', function () {
    return view('maintenance_list');
});

Route::get('/maintenance_add', function () {
    return view('maintenance_add');
});

Route::get('/maintenance_edit/{id}', function () {
    return view('maintenance_edit');
});

Route::get('/exam_date_sheet_add', function () {
    return view('add_exam_date_sheet');
});

Route::get('/exam_date_sheet_edit/{id}', function () {
    return view('edit_exam_date_sheet');
});

Route::get('/vehicle_maintenance_list', function () {
    return view('vehicle_maintenance_list');
});

Route::get('/vehicle_maintenance_add', function () {
    return view('vehicle_maintenance_add');
});

Route::get('/vehicle_maintenance_edit/{id}', function () {
    return view('vehicle_maintenance_edit');
});

Route::get('/fuel_consumption_list', function () {
    return view('fuel_consumption_list');
});

Route::get('/fuel_consumption_add', function () {
    return view('fuel_consumption_add');
});

Route::get('/fuel_consumption_edit/{id}', function () {
    return view('fuel_consumption_edit');
});

Route::get('/assign_subject_wise_marks', function () {
    return view('subject_wise_marks_assign');
});

Route::get('/routewise_student_list', function () {
    return view('routewise_student_list');
});

Route::get('/stationwise_student_list', function () {
    return view('stationwise_student_list');
});

Route::get('/vehicle_maintenance_report', function () {
    return view('vehicle_maintenance_report');
});

Route::get('/fuel_consumption_report', function () {
    return view('fuel_consumption_report');
});

Route::get('/registration_fee', function () {
    return view('fee_registration');
});

Route::get('/registration_fee_add', function () {
    return view('add_registration_fee');
});

Route::get('/registration_fee_edit/{id}', function () {
    return view('edit_registration_fee');
});

Route::get('/new_registration', function () {
    return view('registration_new');
});

Route::get('/registration_list', function () {
    return view('registration_list');
});

Route::get('/registration_create', function () {
    return view('add_registration');
});

Route::get('/registration_edit/{id}', function () {
    return view('edit_registration');
});

Route::get('/class_wise_strength', function () {
    return view('class_wise_strength');
});

Route::get('/student_registered', function () {
    return view('registered_students');
});

Route::get('/total_registration', function () {
    return view('total_registration');
});

Route::get('/registered_student_list', function () {
    return view('registered_student_list');
});

Route::get('/experience_certificate', function () {
    return view('experience_certificate');
});

Route::get('/search_student', function () {
    return view('student_search');
});

Route::get('/add_holiday', function () {
    return view('add_holiday');
});

Route::get('/holiday_list', function () {
    return view('holiday_list');
});

Route::get('/holiday_edit/{id}', function () {
    return view('holiday_edit');
});

Route::get('/left_employee', function () {
    return view('left_employee_entry');
});

Route::get('/notice_list', function () {
    return view('notice_list');
});

Route::get('/notice_add', function () {
    return view('notice_add');
});

Route::get('/notice_edit/{id}', function () {
    return view('notice_edit');
});

Route::get('/slc_list', function () {
    return view('transfer_slc');
});

Route::get('/slc_add', function () {
    return view('add_slc');
});

Route::get('/slc_edit/{id}', function () {
    return view('edit_slc');
});

Route::get('/cc_list', function () {
    return view('character_list');
});

Route::get('/cc_add', function () {
    return view('add_cc');
});

Route::get('/cc_edit/{id}', function () {
    return view('edit_cc');
});

Route::get('/bc_list', function () {
    return view('birth_list');
});

Route::get('/bc_add', function () {
    return view('add_bc');
});

Route::get('/admission_form', function () {
    return view('admission_print');
});

Route::get('/profile', function () {
    return view('profile');
});

Route::get('/profile_edit/{id}', function () {
    return view('edit_profile');
});

Route::get('/student_promote', function () {
    return view('promotion');
});

Route::get('/assign_class_teacher_list', function () {
    return view('teacher_class_list');
});

// Route::get('/assign_class_to_teacher', function () {
//     return view('teacher_class_assign');
// });

Route::get('/assign_class_to_teacher_edit/{id}', function () {
    return view('edit_teacher_class_assign');
});

Route::get('/assign_subject_teacher_list', function () {
    return view('teacher_subject_list');
});

// Route::get('/assign_subject_to_teacher', function () {
//     return view('teacher_subject_assign');
// });

Route::get('/assign_subject_to_teacher_edit/{id}', function () {
    return view('edit_teacher_subject_assign');
});

Route::get('/assign_home_work', function () {
    return view('home_work_assign');
});

Route::get('/view_home_work', function () {
    return view('home_work_view');
});

Route::get('/student_attendance_entry', function () {
    return view('student_attendance_view');
});

Route::get('/student_attendance_modify', function () {
    return view('modify_student_attendance');
});

Route::get('/employee_attendance_entry', function () {
    return view('employee_attendance_view');
});

Route::get('/employee_attendance_modify', function () {
    return view('modify_employee_attendance');
});

Route::get('/search_employee', function () {
    return view('employee_search');
});

Route::get('/fee_individual', function () {
    return view('individual_fee');
});

Route::get('/account_master', function () {
    return view('account_list');
});

Route::get('/account_edit/{id}', function () {
    return view('edit_account');
});

Route::get('/income_master', function () {
    return view('income_list');
});

Route::get('/income_add', function () {
    return view('add_income');
});

Route::get('/income_edit/{id}', function () {
    return view('edit_income');
});





// parents route
Route::get('/child-details', function () {
    return view('parents.child_profile');
});
Route::get('/fee-payment', function () {
    return view('parents.fee_payment');
});
Route::get('/fee-history', function () {
    return view('parents.fee_history');
});
Route::get('/homework', function () {
    return view('parents.homework');
});
Route::get('/attendance-report', function () {
    return view('parents.attendance_report');
});
