$(function(){
	$("#sendButton").on("click", function(){
		canvas_input.sendFourierSeries();
		canvas_output.updateFourier();
	});
});

$(function(){
    $("#deleteButton").on("click", function(){
        canvas_input.deleteLastStroke();
    });
});