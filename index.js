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
		p.fill(255, 204, 228); // fourier y
		p.rect(0, W, W, W);
		p.fill(228, 255, 255); // fourier y
		p.rect(W, 0, W, W);
		p.fill(204);
		p.rect(W, W, W, W);
		p.stroke(0);

		//console.log( char_stroke.length);
		if( char_stroke.length == 0 ) return;

		p.strokeWeight(2.5);
		for(let si = 0; si < char_stroke.length ; si++){
			var list = char_stroke[si].p_list;
			for( let pi = 0; pi < list.length; pi++){
				p.point( list[pi].x, list[pi].y );
			}
		}

		p.strokeWeight(1);
		var f = fourier_list[0];
		var k_MAX = f.m_aX.length;
		var t = 2 * Math.PI * (p.frameCount % f.len_points)/f.len_points - Math.PI;

		p.noFill();
	    p.push();
	    p.translate( f.m_aX[0]/2, p.height * 3/4 );
	    p.nextCircleX(1, f, t);
	    p.pop();
	    p.push();
	    p.translate(p.width * 3/4, f.m_aY[0]/2);
	    p.nextCircleY(1, f, t);
	    p.pop();
	}

	p.createStrokes = function(){
		for(let i = 0; i < fourier_list.length; i++){
			var f = fourier_list[i];
			var s = new Stroke();
			s.p_list = f.restorePoints();
			char_stroke.push(s);
		}
	}

	p.nextCircleY = function( _k /* 現在の次数 */, _f /* フーリエ */, _t /* 媒介変数 */ ){
		let COEF_MAX = _f.m_aY.length;
		let r_aY  = _f.m_aY[_k];
		let r_bY  = _f.m_bY[_k];

		p.strokeWeight(1);
		p.stroke(0);
		p.ellipse(0, 0, Math.abs(r_aY) * 2, Math.abs(r_aY) * 2);
		p.stroke(128, 128, 255);
		p.line(0, 0, r_aY * Math.sin(_k*_t), r_aY * Math.cos(_k*_t));	// Y方向の線: a(k) * cos(kt)
		p.push();
		p.translate( r_aY * Math.sin(_k*_t), r_aY * Math.cos(_k*_t) );	// Y方向移動: a(k) * cos(kt)
		p.ellipse(0, 0, Math.abs(r_bY) * 2, Math.abs(r_bY) * 2);
		p.line(0, 0, r_bY * Math.cos(_k*_t), r_bY * Math.sin(_k*_t));	// Y方向の線: b(k) * sin(kt)
		p.push();
		p.translate( r_bY * Math.cos(_k*_t), r_bY * Math.sin(_k*_t) );	// Y方向移動: b(k) * sin(kt)
		if( _k <= COEF_MAX ){
			p.nextCircleY( _k+1, _f, _t );
		}else{
			p.line(-W*2, 0, W*2, 0);
			p.strokeWeight(7);
			p.stroke(0, 0, 255);
			p.point(0, 0);
		}
		p.pop();
		p.pop();
	}

	p.nextCircleX = function( _k /* 現在の次数 */, _f /* フーリエ */, _t /* 媒介変数 */ ){
		let COEF_MAX = _f.m_aX.length;
		let r_aX = _f.m_aX[_k];
		let r_bX = _f.m_bX[_k];

		p.strokeWeight(1);
		p.stroke(0);
		p.ellipse(0, 0, Math.abs(r_aX) * 2, Math.abs(r_aX) * 2);
		p.stroke(255, 128, 128);
		p.line(0, 0, r_aX * Math.cos(_k*_t), r_aX * Math.sin(_k*_t));            // X方向の線: a(k) * cos(kt)
		p.push();
		p.translate( r_aX * Math.cos(_k*_t), r_aX * Math.sin(_k*_t) );       // X方向移動: a(k) * cos(kt)
		p.ellipse(0, 0, Math.abs(r_bX) * 2, Math.abs(r_bX) * 2);
		p.line(0, 0, r_bX * Math.sin(_k*_t), r_bX * Math.cos(_k*_t));        // X方向の線: b(k) * sin(kt)
		p.push();
		p.translate( r_bX * Math.sin(_k*_t), r_bX * Math.cos(_k*_t) );   // X方向移動: b(k) * sin(kt)
		if( _k <= COEF_MAX ){
			this.nextCircleX( _k+1, _f, _t );
		}else{
			p.line( 0, -W*2, 0, W*2 );
			p.strokeWeight(7);
			p.stroke(255, 0, 0);
			p.point(0, 0);
		}
		p.pop();
		p.pop();
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