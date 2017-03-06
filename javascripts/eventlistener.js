$(function(){
	$("#sendButton").on("click", function(){
		canvas_input.sendStrokes();
		canvas_output.updateFourier();
        $(this).prop("disabled", "true");
	});
});

$(function(){
    $("#deleteButton").on("click", function(){
        canvas_input.deleteLastStroke();
    });
});