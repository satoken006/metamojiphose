$(function(){
	$("#sendButton").on("click", function(){
		canvas_input.sendStrokes();
		canvas_output.updateFourier();
	});
});

$(function(){
    $("#deleteButton").on("click", function(){
        canvas_input.deleteLastStroke();
    });
});