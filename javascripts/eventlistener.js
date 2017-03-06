var setColorEnable = function(){
    $("#sendButton").prop("disabled", null);
    $("#sendButton").css("background-color", "#e8822a");
}

var setColorDisable = function(){
    $("#sendButton").prop("disabled", "true");
    $("#sendButton").css("background-color", "#888888");
}

$(function() {
    $("#sendButton").on("click", function() {
        canvas_input.sendStrokes();
        canvas_output.updateFourier();
        setColorDisable();
    });

    $("#deleteButton").on("click", function() {
        canvas_input.deleteLastStroke();
    });
});
