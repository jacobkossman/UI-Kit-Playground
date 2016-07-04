$(document).ready(function(){

    $("button").on("click", function(){
        $.UIkit.notify("Test", {timeout: 0});
    });

});