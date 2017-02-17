var char_stroke = []; // Strokeのリスト
var new_stroke;

var THR_LENGTH = 20;
var spline;

function Point( x, y ){
	this.x = x;
	this.y = y;
}


function Stroke(){
	this.p_list = [];
}

// *************************

function setup(){
	createCanvas(500, 400);
	strokeWeight(2);

	new_stroke = [];
	spline = new Spline();
}


function draw(){
	background(255, 255, 255);

	for( var si = 0 ; si < char_stroke.length ; si ++ ){
		var s = char_stroke[si];
		for( var pi = 0 ; pi < s.p_list.length ; pi ++ ){
			point( s.p_list[pi].x, s.p_list[pi].y );
		}
	}
}


function mousePressed(){
	char_stroke.push( new Stroke() );
}


function mouseDragged(){
	var last = char_stroke.length-1;
	char_stroke[last].p_list.push( new Point( mouseX, mouseY ) );
}


function mouseReleased(){
	var last = char_stroke.length-1;
	var len_last = char_stroke[last].p_list.length;

	if( len_last < THR_LENGTH ){
		char_stroke.pop();
	}else{
		var list = char_stroke[last].p_list;
		var list2 = spline.getSpline( list, 2 );
		char_stroke[last].p_list = list2;
	}
}