var fourier_list = [];

/**
 * create canvas to INPUT strokes
 */
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
			var list2 = spline.getSpline( this, list, 100 );
			char_stroke[last].p_list = list2;
		}
	}

	// TODO: ボタンを押したら fourier_listに保存されるようにする
	p.keyPressed = function(){
		if( p.keyCode == p.DOWN_ARROW ){
			for(let i = 0; i < char_stroke.length; i++){
				var f = new Fourier( char_stroke[i].p_list.length );
				var list = char_stroke[i].p_list;
				f.expandFourierSeries(list, 10);
				fourier_list.push(f);
				f.restorePoints();
			}
		}
	}
}

/**
 * create canvas to OUTPUT strokes
 */
var app_output = function(p){
	p.setup = function(){
		p.createCanvas(300, 300);
	}

	p.draw = function(){
		p.background(204, 255, 204);
		if(){

		}
	}
}

/**
 *
 */
function Point( x, y ){
	this.x = x;
	this.y = y;
}


function Stroke(){
	this.p_list = [];
}

new p5(  app_input,  "canvas_input" );
new p5( app_output, "canvas_output" );