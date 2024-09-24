<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\ParentLogin;
use Carbon\Carbon;

class LoginController extends Controller
{
    /**
     * Handle an authentication attempt.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

	public function __construct()
    {
       // $this->middleware('auth:api', ['except' => ['Login']]);
    }

    public function signIn(Request $request)
    {
        $inputs = $request->all();

        $rules = [
            'name' => 'required|max:255',
            'password' => 'required|max:255'
        ];

        $fields = [
            'name' => 'name',
            'password' => 'password'
        ];

        $messages = [
            'required' => 'The :attribute field is required.',
        ];

        $validator = Validator::make($inputs, $rules, $messages, $fields);

        if ($validator->fails()) {
            $errors = $validator->errors();
            $response_arr = array(
                "status" => "failed",
                "message" => "Please fill required fields!!",
                "errors" => $errors,
                "data" => []
            );
        } else {
            $credentials = array(
                'name' => $request->name,
                'password' => $request->password
            );

            // Original authentication against users table
            if (Auth::attempt($credentials)) {
                $user = Auth::guard('web')->user();
                $token = Str::random(80);
                $user->api_token = $token;
                $user->expires_at = Carbon::now()->addMinutes(2);

                if ($user->save()) {
                    $response_arr = array(
                        "status" => "successed",
                        "success" => true,
                        "message" => "Logged-in successfully.",
                        "errors" => [],
                        "data" => $user,
                        "login_user" => "user"
                    );
                } else {
                    $response_arr = array(
                        "status" => "failed",
                        "message" => "Token could not be generated!!",
                        "errors" => [],
                        "data" => []
                    );
                }
            } else {
                // New authentication against parent_login table
                $parentUser = ParentLogin::where('mobile_no', $request->name)->first();

                if ($parentUser && Hash::check($request->password, $parentUser->password)) {

                    $token2 = Str::random(80);
                    $parentUser->api_token = $token2;
                    $parentUser->expires_at = Carbon::now()->addMinutes(2);

                    if ($parentUser->save()) {

                        $response_arr = array(
                            "status" => "successed",
                            "success" => true,
                            "message" => "Parent Logged-in successfully.",
                            "errors" => [],
                            "data" => $parentUser,
                            "login_user" => "parent"
                        );
                    }else{
                        $response_arr = array(
                            "status" => "failed",
                            "message" => "Token could not be generated!!",
                            "errors" => [],
                            "data" => []
                        );
                    }
                } else {
                    $response_arr = array(
                        "status" => "failed",
                        "message" => "The provided credentials do not match our records!!",
                        "errors" => [],
                        "data" => []
                    );
                }
            }
        }
        // dd($response_arr);
        return response()->json($response_arr);

    }

    public function signOut(Request $request)
    {
        $token = $request->api_token;

        // Check token in users table
        $user = User::where('api_token', $token)->first();

        // Check token in parent_login table if not found in users
        if (!$user) {
            $parentUser = ParentLogin::where('api_token', $token)->first();
            if ($parentUser) {
                // Convert array to object for uniform handling
                $user = (object) $parentUser;
                $isParent = true;
            } else {
                $isParent = false;
            }
        } else {
            $isParent = false;
        }

        if ($user) {
            // Clear the token and update expiry
            $user->api_token = "";
            $user->expires_at = Carbon::now()->toDateTimeString();

            // Save the updated data
            $saved = !$isParent
                ? $user->save()
                : ParentLogin::where('mobile_no', $user->mobile_no)
                    ->update(['api_token' => '', 'expires_at' => $user->expires_at]);

            if ($saved) {
                $response_arr = array(
                    "status" => "successed",
                    "success" => true,
                    "message" => "Token cleared, user logged out successfully.",
                    "errors" => [],
                    "data" => $user
                );
            } else {
                $response_arr = array(
                    "status" => "failed",
                    "success" => false,
                    "message" => "Token could not be cleared!!",
                    "errors" => [],
                    "data" => []
                );
            }
        } else {
            $response_arr = array(
                "status" => "failed",
                "success" => false,
                "message" => "Unauthenticated user!!",
                "errors" => [],
                "data" => []
            );
        }

        return response()->json($response_arr);
    }


    // public function signIn(Request $request)
    // {
	// 	$inputs=$request->all();

	// 	$rules=[
	// 			'name' => 'required|max:255',
	// 			'password' => 'required|max:255'
	// 		];

	// 		$fields = [
	// 			'name' => 'name',
	// 			'password' => 'password'
	// 		];

	// 		$messages = [
	// 			'required' => 'The :attribute field is required.',
	// 		];

	// 	$validator = Validator::make($inputs, $rules, $messages, $fields);

	// 	//$pass=Hash::make("himsaral");

	// 	if ($validator->fails()) {
	// 		$errors=$validator->errors();
	// 		$response_arr=array("status"=>"failed","message"=>"Please fill required fields!!","errors"=>$errors,"data"=>[]);
    //     }
	// 	else
	// 	{
	// 		$credentials = array(
	// 			'name' => $request->name,
	// 			'password' => $request->password
	// 		);

	// 		if (Auth::attempt($credentials))
	// 		{
	// 			//$user = Auth::user();

	// 			// $user = Auth::guard('api')->user();

	// 			$user =  Auth::guard('web')->user();

	// 			// $request->session()->regenerate();

	// 			 $token = Str::random(80);

	// 			 $user->api_token = $token;
	// 			 $user->expires_at = Carbon::now()->addMinutes(2);

	// 			 if($user->save())
	// 			 {
	// 				$response_arr=array("status"=>"successed","success"=>true,"message"=>"Logged-in successfully.","errors"=>[],"data"=>$user);
	// 			 }
	// 			 else
	// 			 {
	// 				 $response_arr=array("status"=>"failed","message"=>"token could not generated.!!","errors"=>[],"data"=>[]);
	// 			 }

	// 		}
	// 		else
	// 		{
	// 			$response_arr=array("status"=>"failed","message"=>"The provided credentials do not match our records.!!","errors"=>[],"data"=>[]);
	// 		}

	// 	}

	// 	return response()->json($response_arr);

    // }

	// public function signOut(Request $request)
	// {

	// 		$token = $request->api_token;
	// 		$info =  User::where('api_token',$token)->get();

	// 		if(count($info)>0)
	// 		{
	// 			$user_id=$info[0]->id;
	// 			$user = User::find($user_id);

	// 			$user->api_token = "";
	// 			$user->expires_at =Carbon::now()->toDateTimeString();

	// 			if($user->save())
	// 			{
	// 				$response_arr=array("status"=>"successed","success"=>true,"message"=>"Token cleared, user logged out susccessfully.","errors"=>[],"data"=>$user);
	// 			}
	// 			else
	// 			{
	// 				 $response_arr=array("status"=>"failed","success"=>false,"message"=>"token could not cleared.!!","errors"=>[],"data"=>[]);
	// 			}

	// 		}
	// 		else
	// 		{
	// 			$response_arr=array("status"=>"failed","success"=>false,"message"=>"Unauthenticated user!!","errors"=>[],"data"=>[]);
	// 		}

	// 	return response()->json($response_arr);

	// }
}
