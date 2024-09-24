<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

use App\Models\User;
use App\Models\School;
use App\Models\ParentLogin;
use Carbon\Carbon;
use Image;

class DashboardController extends Controller
{
    /**
     * Handle an authentication attempt.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

	public function __construct()
    {
		// $this->middleware('auth:api')->only(['checkAuth','setAuth']);
    }

	public function index()
	{

	}

    public function checkAuth(Request $request)
    {
        $token = $request->api_token;
        $user = User::where('api_token', $token)->first();

        // Check token in parent_login table if not found in users
        if (!$user) {
            $user = ParentLogin::where('api_token', $token)->first();
            $isParent = true;
        } else {
            $isParent = false;
        }

        if ($user) {
            $now = Carbon::now();
            $expiry = Carbon::parse($user->expires_at);

            if ($now >= $expiry) {
                $response_arr = [
                    "status" => "failed",
                    "success" => false,
                    "message" => "Token expired, user logged-out!!",
                    "errors" => [],
                    "data" => []
                ];
            } else {
                // Extend the token expiry
                $user->expires_at = Carbon::now()->addMinutes(3);
                $saved = $isParent ? ParentLogin::where('id', $user->id)->update(['expires_at' => $user->expires_at]) : $user->save();

                if ($saved) {
                    $response_arr = [
                        "status" => "successed",
                        "success" => true,
                        "message" => "Token matched, user logged-in.",
                        "errors" => [],
                        "data" => $user
                    ];
                } else {
                    $response_arr = [
                        "status" => "failed",
                        "success" => false,
                        "message" => "Token could not be updated!!",
                        "errors" => [],
                        "data" => []
                    ];
                }
            }
        } else {
            $response_arr = [
                "status" => "failed",
                "success" => false,
                "message" => "Unauthenticated user!!",
                "errors" => [],
                "data" => []
            ];
        }
        // dd($response_arr);
        return response()->json($response_arr);
    }


    public function setAuth(Request $request)
    {
        $token = $request->api_token;

        $user = User::where('api_token', $token)->first();

        if (!$user) {
            $user = ParentLogin::where('api_token', $token)->first();
            $isParent = true;
        } else {
            $isParent = false;
        }

        if ($user) {
            $user->expires_at = Carbon::now()->addMinutes(2);
            $saved = $isParent ? ParentLogin::where('id', $user->id)->update(['expires_at' => $user->expires_at]) : $user->save();

            if ($saved) {
                return response()->json([
                    "status" => "successed",
                    "success" => true,
                    "message" => "Token re-generated successfully.",
                    "errors" => [],
                    "data" => $user
                ]);
            }
        }

        return response()->json([
            "status" => "failed",
            "success" => false,
            "message" => "Unauthenticated user!!",
            "errors" => [],
            "data" => []
        ]);
    }


	// public function checkAuth(Request $request)
	// {
	// 		$token = $request->api_token;

	// 		// $user =  Auth::guard('web')->user();

	// 		$info =  User::where('api_token',$token)->get();

	// 		if(count($info)>0)
	// 		{
	// 			$to = Carbon::createFromFormat('Y-m-d H:i:s',Carbon::now());
	// 			$from = Carbon::createFromFormat('Y-m-d H:i:s',$info[0]->expires_at);

	// 			if (date("Y-m-d H:i:s",strtotime($to)) >= date("Y-m-d H:i:s",strtotime($from)))
	// 			{
	// 				$response_arr=array("status"=>"failed","success"=>false,"message"=>"Token not re-generated, user logged-out!!","errors"=>[],"data"=>[]);
	// 			} else {
	// 				$user_id=$info[0]->id;
	// 				$user = User::find($user_id);
	// 				$user->expires_at = Carbon::now()->addMinutes(3);

	// 				 if($user->save())
	// 				 {
	// 					$response_arr=array("status"=>"successed","success"=>true,"message"=>"Token matched, user logged-in.","errors"=>[],"data"=>$user);
	// 				 }
	// 				 else
	// 				 {
	// 					 $response_arr=array("status"=>"failed","success"=>false,"message"=>"token could not generated.!!","errors"=>[],"data"=>[]);
	// 				 }

	// 			}

	// 		}
	// 		else
	// 		{
	// 			$response_arr=array("status"=>"failed","success"=>false,"message"=>"Unauthenticated user!!","errors"=>[],"data"=>[]);
	// 		}

	// 	return response()->json($response_arr);

	// }

	// public function setAuth(Request $request)
	// {
	// 	$token = $request->api_token;

	// 		$info =  User::where('api_token',$token)->get();

	// 		if(count($info)>0)
	// 		{
	// 			$user_id=$info[0]->id;
	// 			$user = User::find($user_id);
	// 			$user->expires_at = Carbon::now()->addMinutes(2);

	// 			 if($user->save())
	// 			 {
	// 				$response_arr=array("status"=>"successed","success"=>true,"message"=>"Token re-generated susccessfullly.","errors"=>[],"data"=>$user);
	// 			 }
	// 			 else
	// 			 {
	// 				 $response_arr=array("status"=>"failed","message"=>"token could not generated.!!","errors"=>[],"data"=>[]);
	// 			 }
	// 		}
	// 		else
	// 		{
	// 			$response_arr=array("status"=>"failed","success"=>false,"message"=>"Unauthenticated user!!","errors"=>[],"data"=>[]);
	// 		}

	// 	return response()->json($response_arr);

	// }

   public function changePassword(Request $request,$token)
   {
      $inputs = $request->all();
	  $oPassword = empty($request->old_password)?'':$request->old_password;
	  $nPassword = empty($request->password)?'':$request->password;

	  $info = User::where('api_token',$token)->get();
	  $dbPass = (count($info)>0)?$info[0]->password:'';

	  $chk=Hash::check($oPassword,$dbPass);

      $rules = [
         'password'  =>  'required|min:4|confirmed',
		 'password_confirmation'  =>  'required|min:4',
		 'old_password' => 'required',
      ];

      $messages = [
         'required' => 'The :attribute field is required.',
      ];

      $fields = [
         'old_password' => 'Old Password',
         'password' => 'New Password',
         'password_confirmation' => 'Confirm Password',
      ];

      $validator = Validator::make($inputs, $rules, $messages, $fields);

      // if validation fails
      if ($validator->fails()) {
         return response()->json(["status" => "failed", "message" => "Please fill all fields!!", "errors" => $validator->errors()]);
      }
	  else if(count($info)==0)
	  {
		   return response()->json(["status" => "failed", "message" => "Please login first!!", "errors" =>[] ]);
	  }
	  else if(!$chk)
	  {
		  return response()->json(["status" => "failed", "message" => "Old password is not correct!!", "errors" =>[] ]);
	  }
	  else
	  {
		  // hashed password
		   $hPassword = Hash::make($nPassword);

		   $update_arr =array(
				"password"=>$hPassword
		   );

		   $update = User::where('id',$info[0]->id)->update($update_arr);
		   if($update)
		   {
			   return response()->json(["status" => 'successed', "success" => true, "message" => "Password changed successfully", "data" => $update,"errors" =>[] ]);
		   }
		   else
		   {
				return response()->json(["status" => "failed", "message" => "password could not changed!!","data"=>[], "errors" =>[] ]);
		   }

      }

   }

   public function getProfile($id)
   {
	    $info=School::where('id',$id)->get();
	    if(count($info)>0)
		{
			$response_arr=array("status"=>"successed","success"=>true,"message"=>"School details found.","data"=>$info);
		}
		else
		{
			$response_arr=array("status"=>"failed","success"=>false,"message"=>"details not found!!","data"=>[]);
		}

		return response()->json($response_arr);
   }
   public function editProfile(Request $request,$id)
   {
	   $inputs=$request->all();
	   $image_name = empty($request->icon_image)?'':$request->icon_image;
	   $logo_name= empty($request->logo_image)?'':$request->logo_image;

	   $image_rule=$logo_rule="";
	   $info = School::where('id',$id)->get();

	   if(count($info)>0)
	   {
		    if($request->file('icon_image')!=null)
			{
				$image_rule = 'required|image|mimes:jpeg,png,jpg|max:5120';
			}

			if($request->file('logo_image')!=null)
			{
				$logo_rule = 'required|image|mimes:jpeg,png,jpg|max:5120';
			}

			$rules=[
				'icon_image' => $image_rule,
				'logo_image' => $logo_rule,
				'name' => 'required',
				'address' => 'required',
				'session_st' => 'required|date',
				'session_ed' => 'required|date',
				'state' => 'required',
				'district'=>'required',
				'about' => 'required',
				'remark' => 'required',
				'email' =>  'required|email',
				'principal' => 'required',
				'affiliation' => 'required',
				'contact' => 'required',
				'fax' => 'required',
			];

			$fields = [
				'icon_image' => 'School/College Photo',
				'logo_image' => 'School/College Logo',
				'name' => 'School/College Name',
				'address' => 'School/College Address',
				'session_st' => 'Session From',
				'session_ed' => 'Session To',
				'state' => 'State',
				'district' => 'District',
				'about' => 'About School',
				'remark' => 'Remarks',
				'email' => 'School/College Email',
				'principal' => 'Principal Name',
				'affiliation' => 'School/College Affiliation',
				'contact' => 'School/College Contact',
				'fax' => 'Fax No.',
			];

			$messages = array('required'=>'The :attribute field is required.');

			$validator = Validator::make($inputs,$rules,$messages,$fields);

			if ($validator->fails()) {
				$errors=$validator->errors();
				$response_arr=array("status"=>"failed","success"=>false,"message"=>"Please fill required fields!!","errors"=>$errors);
			}
			else
			{
				if($request->hasFile('icon_image'))
				{
					$image = $request->file('icon_image');
					$imageDimensions = getimagesize($image);

					$width = $imageDimensions[0];
					$height = $imageDimensions[1];

					$new_width = $this->setDimension($width);
					$new_height = $this->setDimension($height);

					$image_name = time().rand(3, 9).'.'.$image->getClientOriginalExtension();
					$destinationPath1 = public_path('/uploads/school_image/');
					$imgFile = Image::make($image->getRealPath());

					$imgFile->resize($new_height,$new_width,function($constraint){
						$constraint->aspectRatio();
					})->save($destinationPath1.'/'.$image_name);

				}

				if($request->hasFile('logo_image'))
				{
					$image = $request->file('logo_image');
					$imageDimensions = getimagesize($image);

					$width = $imageDimensions[0];
					$height = $imageDimensions[1];

					$new_width = $this->setDimension($width);
					$new_height = $this->setDimension($height);

					$logo_name = time().rand(3, 9).'.'.$image->getClientOriginalExtension();
					$destinationPath1 = public_path('/uploads/school_image/');
					$imgFile = Image::make($image->getRealPath());

					$imgFile->resize($new_height,$new_width,function($constraint){
						$constraint->aspectRatio();
					})->save($destinationPath1.'/'.$logo_name);

				}

				$update_arr=array(
					'school_name'=>$request->name,
					'school_address' =>$request->address,
					'CurrentSessionFrom' =>$request->session_st,
					'CurrentSessionTo' => $request->session_ed,
					'state_id' =>$request->state,
					'district_id'=>$request->district,
					'about' =>$request->about,
					'remark' =>$request->remark,
					'school_email' =>$request->email,
					'principal_name' =>$request->principal,
					'school_affiliation' =>$request->affiliation,
					'school_contact' =>$request->contact,
					'faxno' =>$request->fax,
					'school_photo' => ($image_name=='')?$info[0]->school_photo:$image_name,
					'school_logo' => ($logo_name=='')?$info[0]->school_logo:$logo_name,
				);

				$update=School::where('id',$id)->update($update_arr);

				if($update)
				{
					$message="Details updated successfully";
					$response_arr=array("status"=>'successed',"success"=>true,"errors"=>[],"message"=>$message,"data" =>$update);
				}
				else
				{
					$message="could not update!!";
					$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);
				}
			}

	   }
	   else
	   {
			$message="Whoops! failed to update!!";
			$response_arr=array("status"=>'failed',"success"=>false,"errors"=>[],"message"=>$message,"data"=>[]);
	   }

	   return response()->json($response_arr);

   }

   public function setDimension($dim)
	{
		if($dim>400)
		{
			$new_dim =400;
		}
		else
		{
			$new_dim = $dim;
		}
		return $new_dim;
	}

}
