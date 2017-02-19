$(function(){
	$("#sendButton").on("click", function(){
		canvas_input.sendFourierSeries();
		canvas_output.createStrokes();
	});
});