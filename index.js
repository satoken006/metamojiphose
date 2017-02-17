function Point( x, y ){
	this.x = x;
	this.y = y;
}


function Stroke(){
	this.p_list = [];
}

// ************************* 入力

var app_input = function(p){

	var char_stroke = []; // Strokeのリスト
	var new_stroke;

	var THR_LENGTH = 20;
	var spline;

	p.setup = function(){
		p.createCanvas(300, 300);
		//canvas_input.parent( "canvas_input" );
		p.strokeWeight(2.5);

		new_stroke = [];
		spline = new Spline();
	}


	p.draw = function(){
		p.background(255);

		for( var si = 0 ; si < char_stroke.length ; si ++ ){
			var s = char_stroke[si];
			for( var pi = 0 ; pi < s.p_list.length ; pi ++ ){
				p.point( s.p_list[pi].x, s.p_list[pi].y );
			}
		}
	}


	p.mousePressed = function(){
		char_stroke.push( new Stroke() );
	}


	p.mouseDragged = function(){
		var last = char_stroke.length-1;
		char_stroke[last].p_list.push( new Point( p.mouseX, p.mouseY ) );
	}


	p.mouseReleased = function(){
		var last = char_stroke.length-1;
		var len_last = char_stroke[last].p_list.length;

		if( len_last < THR_LENGTH ){
			char_stroke.pop();
		}else{
			var list = char_stroke[last].p_list;
			var list2 = spline.getSpline( list, 100 );
			char_stroke[last].p_list = list2;
		}
	}
}

new p5( app_input, "canvas_input" );