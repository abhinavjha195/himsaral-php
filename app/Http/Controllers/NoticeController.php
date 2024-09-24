<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\DB;
use App\Models\Notice;
use File;

class NoticeController extends Controller
{

    public function index(Request $request)
    {
        $search = $request->search;
        $limit = $request->limit;
        $page = $request->page;
        $order = $request->order;
        $order_by = $request->orderBy;

        $offset = ($page - 1) * $limit;

        $query1 = Notice::select(DB::raw('count(*) as row_count'));
        if ($search != '') {
            $query1->where('date', 'like', '%' . $search . '%')
                ->orWhere('title', 'like', '%' . $search . '%')
                ->orWhere('notice', 'like', '%' . $search . '%');
        }

        $records = $query1->get();

        $query2 = Notice::offset($offset)->limit($limit);
        if ($search != '') {
            $query2->where('date', 'like', '%' . $search . '%')
            ->orWhere('title', 'like', '%' . $search . '%')
            ->orWhere('notice', 'like', '%' . $search . '%');
        }
        if ($order_by != '') {
            $query2->orderBy($order_by, $order);
        }

        $notices = $query2->get();

        if (count($notices) > 0) {
            $response_arr = array('data' => $notices, 'total' => $records[0]->row_count);
            return response()->json(["status" => "successed", "success" => true, "data" => $response_arr]);
        } else {
            $response_arr = array('data' => [], 'total' => 0);
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found", "data" => $response_arr]);
        }
    }

    public function create(Request $request)
    {

        $inputs = $request->all();
    
        $rules = [
            'title' => "required",
            'file_name' => "required",
        ];

        $messages = [
            'required' => 'The :attribute field is required.',
        ];

        $fields = [
            'title' => 'Title',
            'file_name' => 'file'
        ];

        $validator = Validator::make($inputs, $rules, $messages, $fields);

        // if validation fails
        if ($validator->fails()) {
            return response()->json(["status" => "failed", "message" => "Please fill all fields!!", "errors" => $validator->errors()]);
        } else {

            $uploadedFile = $request->file('file_name');
            if($request->file('file_name') != null) {
                $file_name = $uploadedFile->getClientOriginalName();
                $uploadedFile->move(public_path('notice'), $file_name);
            }
            else {
                $file_name = null;
            }
            $insertArray = array(
                "date" => $request->date,
                "title" => $request->title,
                "from_time" => $request->from_time,
                "to_time" => $request->to_time,
                "notice" => $request->notice,
                "link1" => $request->link1,
                "link2" => $request->link2,
                "link3" => $request->link3,
                "link4" => $request->link4,
                'file_name' => $file_name,
            );



            $notice = Notice::create($insertArray);

            if (!is_null($notice)) {
                return response()->json(["status" => 'successed', "success" => true, "message" => "notice record created successfully", "data" => $notice]);
            } else {
                return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! failed to create."]);
            }

        }

    }
    public function edit($id)
    {
        $info = Notice::where('id', $id)->get();

        if (count($info) > 0) {
            return response()->json(["status" => 'successed', "success" => true, "message" => "Notice record found", "data" => $info]);
        } else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! no record found!!", "errors" => '', "data" => []]);
        }

    }

    public function update(Request $request, $id)
    {

        $inputs = $request->all();

        $info = Notice::where('id', $id)->get();

        if (count($info) > 0) {
            if($request->file('file_name')==null)
			{				
				$file_rule = 'required|file_name';							
			}
            else {
                $file_rule = 'required';
            }
            $rules = [
                'title' => "required",
                'file_name' => $file_rule,
            ];
    
            $messages = [
                'required' => 'The :attribute field is required.',
            ];
    
            $fields = [
                'title' => 'Title',
                'file_name' => 'file'
            ];
    
            $validator = Validator::make($inputs, $rules, $messages, $fields);
    
            // if validation fails
            if ($validator->fails()) {
                return response()->json(["status" => "failed", "message" => "Please fill all fields!!", "errors" => $validator->errors()]);
            } else {
              
                $uploadedFile = $request->file('file_name');
                if($request->file('file_name') != null) {
                    $file_name = $uploadedFile->getClientOriginalName();
                    $uploadedFile->move(public_path('notice'), $file_name);
                }
                else {
                    $file_name = null;
                }
                $updateArray = array(
                    "date" => $request->date,
                    "title" => $request->title,
                    "from_time" => $request->from_time,
                    "to_time" => $request->to_time,
                    "notice" => $request->notice,
                    "link1" => $request->link1,
                    "link2" => $request->link2,
                    "link3" => $request->link3,
                    "link4" => $request->link4,
                    'file_name' => $file_name,
                );
    
    
    
                $notice = Notice::where('id',$id)->update($updateArray);
                
                if (!is_null($notice)) {
                    return response()->json(["status" => 'successed', "success" => true, "message" => "notice record updated successfully", "data" => $updateArray]);
                } else {
                    return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! failed to update."]);
                }
    
            }
        }
        else
		{
			return response()->json(["status" => "failed","success" => false,"message" => "Whoops! no record found!!","errors" =>'',"data" =>[]]);
		}

	


    }

    public function delete($id)
    {
        $delete = Notice::where('id', $id)->delete();
        if ($delete) {
            return ['status' => True, 'message' => 'Notice Deleted'];
        } else {
            return ['status' => True, 'message' => 'Notice not Deleted'];
        }

    }
}