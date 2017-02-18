var fourier_list = [];

/**
 * create canvas to INPUT strokes
 */
var app_input = function(p){
	var THR_LENGTH = 20;
	var spline;
	var char_stroke = [];
	var new_stroke;

	p.setup = function(){
		p.createCanvas(300, 300);
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
			var list2 = spline.getSpline( this, list, 100 );
			char_stroke[last].p_list = list2;
		}
	}

	p.keyPressed = function(){
		if( p.keyCode == p.DOWN_ARROW ){
		}
	}
	/*
	p.sayHello = function(){
		console.log("helooooooooo");
	}
	*/
	p.sendFourierSeries = function(){
		for(let i = 0; i < char_stroke.length; i++){
			var f = new Fourier( char_stroke[i].p_list.length );
			var list = char_stroke[i].p_list;
			f.expandFourierSeries(list, 10);
			fourier_list.push(f);
			f.restorePoints();
		}
	}
}

/**
 * create canvas to OUTPUT strokes
 */
var app_output = function(p){
	var W = 300;

	var char_stroke = [];

	p.setup = function(){
		p.createCanvas(W * 2, W * 2);
		p.strokeWeight(2.5);
	}

	p.draw = function(){
		p.background(204, 255, 204);
		p.noStroke();

		p.fill(204, 255, 255);
		p.rect(0, W, W, W);

		p.fill(255, );
		p.rect(W, 0, W, W);

		p.fill(204);
		p.rect(W, W, W, W);
		p.stroke(0);

		//console.log( char_stroke.length);
		if( char_stroke.length == 0 ) return;

		for(let si = 0; si < char_stroke.length ; si++){
			var list = char_stroke[si].p_list;
			for( let pi = 0; pi < list.length; pi++){
				p.point( list[pi].x, list[pi].y );
			}
		}
	}

	p.createStrokes = function(){
		for(let i = 0; i < fourier_list.length; i++){
			var f = fourier_list[i];
			var s = new Stroke();
			s.p_list = f.restorePoints();
			char_stroke.push(s);
		}
	}
}

function Point( x, y ){
	this.x = x;
	this.y = y;
}

function Stroke(){
	this.p_list = [];
}

var canvas_input  = new p5(  app_input,  "canvas_input" );
var canvas_output = new p5( app_output, "canvas_output" );