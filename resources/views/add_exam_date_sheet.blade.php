<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Create Exam Date Sheet</title>   		

        @include('header');
      
        <body class="antialiased">
            <div id="root">
            
            </div>
    
            <script src="{{ asset('js/app.js')}}"></script>
    
    @include('footer');
    </body>
</html>   