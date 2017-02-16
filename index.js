var s;

function Point( x, y ){
	this.x = x;
	this.y = y;
}

function Stroke(){
	this.p_list = [];
}


function setup(){
	createCanvas(500, 400);
	s = new Stroke();
	console.log( s );
}


function draw(){
	ellipse(100, 100, 100, 100);
	rect(300, 300, 50, 50);
	/*
	for( var i = 0 ; i < s.p_list.length ; i ++ ){
		point( s.p_list[i].x, s.p_list[i].y );
	}
	*/
}


function mouseDragged(){
	s.p_list.push( new Point(mouseX, mouseY ) );
	console.log( new Point( mouseX, mouseY ) );
}