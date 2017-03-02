var fourier_chars = [];
var DEG_MAX = 10;
let W = 200;

/**
 * create canvas to INPUT strokes
 */
var app_input = function(p){
	var THR_LENGTH = 10;
	var spline;
	var char_stroke = [];
	var new_stroke;

	p.setup = function(){
		p.createCanvas(W, W);
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
		if( fourier_chars.length > 0 ){
			if( fourier_chars[0].length != char_stroke.length ) return;
		}

		let last = fourier_chars.length-1;
		var fourier_list = [];
		for(let i = 0; i < char_stroke.length; i++){
			var f = new Fourier( char_stroke[i].p_list.length );
			var list = char_stroke[i].p_list;
			f.expandFourierSeries(list, DEG_MAX);
			fourier_list.push(f);
			f.restorePoints();
		}
		fourier_chars.push( fourier_list );
		char_stroke = [];
	}
}

var app_output = function(p){
	let SECTION = 200;
	var animeFrameCount = 0;
	var char_stroke = [];
	var fourier_char1 = [];
	var fourier_char2 = [];
	var i1, i2;
	var _ratio = 0;

	p.setup = function(){
		p.createCanvas(W * 2, W * 2);
		p.strokeWeight(2.5);
	}

	p.draw = function(){
		//console.log(p.frameCount);
		p.colorMode(p.RGB, 255);
		p.background(255);
		p.noStroke();
		p.fill(228);
		p.rect(0, W, W, W);
		p.fill(228);
		p.rect(W, 0, W, W);
		p.fill(204);
		p.rect(W, W, W, W);
		p.stroke(0);

		/**
		 * determine Fourier series to visualize in output frame
		 */
		var fourier_charW = [];
		var charW = [];
		console.log( "animeFrameCount: " + animeFrameCount);

		switch(fourier_chars.length){
			case 0:
				return;
				//break;

			case 1:
				for(let si = 0; si < fourier_char1.length; si++){
					let fourier1 = fourier_char1[si];
					fourier_charW.push( fourier1 );
					var strokeW = new Stroke();
					strokeW.p_list = fourier1.restorePoints();
					charW.push( strokeW );
				}
				break;

			default:
				animeFrameCount++;

				if( animeFrameCount % SECTION == 0 ){
					replaceChars();
				}

				for(let si = 0; si < fourier_char1.length; si++){
					let fourier1 = fourier_char1[si];
					let fourier2 = fourier_char2[si];
					let len_pointsW = parseInt(fourier1.len_points * (1-_ratio) + fourier2.len_points * _ratio);
					var fourierW = new Fourier( len_pointsW );

					for(let k = 0; k < fourier1.m_aX.length; k++){
					    let w_aX = fourier1.m_aX[k] * (1-_ratio) + fourier2.m_aX[k] * _ratio;
					    let w_aY = fourier1.m_aY[k] * (1-_ratio) + fourier2.m_aY[k] * _ratio;
					    let w_bX = fourier1.m_bX[k] * (1-_ratio) + fourier2.m_bX[k] * _ratio;
					    let w_bY = fourier1.m_bY[k] * (1-_ratio) + fourier2.m_bY[k] * _ratio;
					    fourierW.m_aX[k] = w_aX;
					    fourierW.m_aY[k] = w_aY;
					    fourierW.m_bX[k] = w_bX;
					    fourierW.m_bY[k] = w_bY;
					}
					fourier_charW.push( fourierW );

					var strokeW = new Stroke();
					strokeW.p_list = fourierW.restorePoints();
					charW.push( strokeW );
				}

				_ratio += parseFloat(1) / SECTION;
				break;
		}

		/**
		* draw strokes and circular motions
		*/
		p.strokeWeight(1);
		p.colorMode(p.HSB, 100);
		p.noFill();
		for(let i = 0; i < fourier_charW.length; i++){
			p.strokeWeight(2.5);
			var col = parseFloat(i * 100) / fourier_charW.length;
			p.stroke(col, 100, 100);
			let list = charW[i].p_list;
			for(let pi = 0; pi < list.length; pi++){
				p.point( list[pi].x, list[pi].y );
			}

			var f = fourier_charW[i];
			//var t = 2 * Math.PI * (p.frameCount % f.len_points)/f.len_points - Math.PI;
			var t = 2 * Math.PI * (p.frameCount % SECTION)/SECTION - Math.PI;

			p.push();
			p.translate( f.m_aX[0]/2, p.height * 3/4 );
			p.nextCircleX(1, f, t);
			p.pop();
			p.push();
			p.translate( p.width * 3/4, f.m_aY[0]/2 );
			p.nextCircleY(1, f, t);
			p.pop();
		}
		
	}

	p.updateFourier = function(){
		switch( fourier_chars.length ){
			case 1:
				i1 = 0;
				fourier_char1 = fourier_chars[i1];
				break;
			case 2:
				i2 = 1;
				fourier_char2 = fourier_chars[i2];
				break;
		}
	}

	/**
	 * draw X degrees of Fourier series as circular motions
	 */
	p.nextWheelX = function( _k /* 現在の次数 */, _f /* フーリエ */, _t /* 媒介変数 */ ){
		let COEF_MAX = _f.m_aX.length;
		let r_aX = _f.m_aX[_k];
		let r_bX = _f.m_bX[_k];

		p.strokeWeight(1);
		//p.stroke(0);
		p.ellipse(0, 0, Math.abs(r_aX) * 2, Math.abs(r_aX) * 2);
		//p.stroke(255, 128, 128);
		p.line(0, 0, r_aX * Math.cos(_k*_t), r_aX * Math.sin(_k*_t));	// X方向の線: a(k) * cos(kt)
		p.push();
		p.translate( r_aX * Math.cos(_k*_t), r_aX * Math.sin(_k*_t) );	// X方向移動: a(k) * cos(kt)
		p.ellipse(0, 0, Math.abs(r_bX) * 2, Math.abs(r_bX) * 2);
		p.line(0, 0, r_bX * Math.sin(_k*_t), r_bX * Math.cos(_k*_t));	// X方向の線: b(k) * sin(kt)
		p.push();
		p.translate( r_bX * Math.sin(_k*_t), r_bX * Math.cos(_k*_t) );	// X方向移動: b(k) * sin(kt)
		if( _k <= COEF_MAX ){
			this.nextCircleX( _k+1, _f, _t );
		}else{
			p.line( 0, -W*2, 0, W*2 );
			p.strokeWeight(7);
			//p.stroke(255, 0, 0);
			p.point(0, 0);
		}
		p.pop();
		p.pop();
	}

	/**
	 * draw Y degrees of Fourier series as circular motions
	 */
	p.nextWheelY = function( _k /* 現在の次数 */, _f /* フーリエ */, _t /* 媒介変数 */ ){
		let COEF_MAX = _f.m_aY.length;
		let r_aY = _f.m_aY[_k];
		let r_bY = _f.m_bY[_k];

		p.strokeWeight(1);
		//p.stroke(0);
		p.ellipse(0, 0, Math.abs(r_aY) * 2, Math.abs(r_aY) * 2);
		//p.stroke(128, 128, 255);
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
			//p.stroke(0, 0, 255);
			p.point(0, 0);
		}
		p.pop();
		p.pop();
	}

	/**
	 * A weighted character is made of these characters
	 */
	this.replaceChars = function(){
		// fourier_chars, i1, i2 を使って，対象となるFourierを選ぶ
		let LEN_CHARS = fourier_chars.length;
		i1 = i2;
		i2 = (i2+1) % LEN_CHARS;
		//console.log("i1: "+ i1 +", i2: "+ i2);
		fourier_char1 = fourier_chars[i1];
		fourier_char2 = fourier_chars[i2];
		_ratio = 0;
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