<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

use App\Models\User;
use Illuminate\Support\Facades\DB;


class ChangePasswordController extends Controller
{

   public function change(Request $request)
   {

      $inputs = $request->all();

      $rules = [
         "oPassword"          =>      "required",
         'nPassword'        =>     "required|max:255",
         'cPassword'        =>     "required|max:255",
      ];

      $messages = [
         'required' => 'The :attribute field is required.',
      ];

      $fields = [
         'oPassword' => 'Old Password',
         'nPassword' => 'New Password',
         'cPassword' => 'Confirm Password',
      ];

      $validator = Validator::make($inputs, $rules, $messages, $fields);

      // if validation fails
      if ($validator->fails()) {
         return response()->json(["status" => "failed", "message" => "Please fill all fields!!", "errors" => $validator->errors()]);
      } else {
         $hashedPassword = $request->password;;
         $oPassword   = $request->oPassword;

         if (Hash::check($oPassword, $hashedPassword)) {
            $npassword  = $request->nPassword;
            $cpassword  = $request->cPassword;
            $pass = Hash::make($npassword);
            if ($npassword === $cpassword) {
               $updateArray              =       array(
                  "password"           =>      $pass,
               );
               $data = User::where('password',$hashedPassword)->update($updateArray);
               return response()->json(["status" => 'successed', "success" => true, "message" => "Password updated successfully", "data" => $data]);
            } else {
               return response()->json(["status" => "failed", "success" => false, "message" => "Password Doesn't Match With New password", "errors" => []]);
            }
         } else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Your Old Password Doesn't Match in Current Password,Please Enter Correct Old Password", "errors" => []]);
         }


      }
   }
}
