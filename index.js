var char = []; // Strokeのリスト
var new_stroke;

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
	strokeWeight(3);
}


function draw(){
	//ellipse(100, 100, 100, 100);
	//rect(300, 300, 50, 50);
	
	for( var si = 0 ; si < char.length ; si ++ ){
		for( var pi = 0 ; pi < char[si].p_list.length ; pi ++ ){
			point( char[si].p_list[pi].x, char[si].p_list[pi].y );
		}
	}
	
}


function mousePressed(){
	new_stroke = new Stroke();
}


function mouseDragged(){
	new_stroke.push( new Point( mouseX, mouseY ) );
	console.log( new Point( mouseX, mouseY ) );
}


function mouseReleased(){
	char.push( new_stroke );
}