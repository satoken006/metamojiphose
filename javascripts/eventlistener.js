$(function(){
	$("#sendButton").on("click", function(){
		//canvas_input.sayHello();
		canvas_input.sendFourierSeries();
		canvas_output.createStrokes();
	});
});