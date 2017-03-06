$(function(){
	$("#sendButton").on("click", function(){
		canvas_input.sendStrokes();
		canvas_output.updateFourier();
        $(this).prop("disabled", "true");
        $("#sendButton").css("background-color", "#888888");
	});
});

$(function(){
    $("#deleteButton").on("click", function(){
        canvas_input.deleteLastStroke();
    });
});