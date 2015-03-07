/****
 * -------------------
 * Shape Classes
 * -------------------
 ****/

/****
 * Circle object to be rendered by SVG.
 * @param svgCanvas: the canvas to paint this object on
 * @param elementClass: The class of the circle object to be created, used to attach CSS.
 ****/
function circle(centerX, centerY, radius, svgCanvas, elementClass){
	this.x=centerX;
	this.y=centerY;
	this.r=radius;
	this.stroke=1;
	this.name="";
	//this contains the object (network or device) that the graphic represents.
	this.represents={};


	//whether the name of the device is visible
	this.nameVisible=false;
	
	this.element = document.createElementNS(svgNS, 'circle');
	this.element.setAttribute('data-index', uniqueDataIndex);
	this.element.setAttribute('class', elementClass);
	this.children=[];
	this.connections=[];
	
	//displays the name of the network/device
	this.displayName = document.createElementNS(svgNS, "text");
	this.displayName.setAttribute("class", 'name-text');
	this.displayName.setAttribute("font-size","14");
	this.displayName.setAttribute("text-anchor", "middle");
	this.draw();
	svgCanvas.appendChild(this.element);
	svgCanvas.appendChild(this.displayName);
}

circle.prototype.draw=function(){
	this.element.setAttribute('cx', this.x); 
	this.element.setAttribute('cy', this.y);
	this.element.setAttribute('r', this.r);
	this.element.setAttribute('stroke', this.stroke);
	
	this.displayName.setAttribute("x", this.x);
	this.displayName.setAttribute("y", this.y - this.r-2);
	if(this.nameVisible==true){
		this.displayName.textContent=this.name;
	}
	else{
		this.displayName.textContent="";
	}
	orderCanvas();
}

/****
 * Line object to be rendered by SVG.
 * @param svgCanvas: the canvas to paint this object on
 * @param elementClass: The class of the line object to be created, used to attach CSS.
 ****/
function line(x1, y1, x2, y2, svgCanvas, elementClass){
	this.x1=x1;
	this.x2=x2;
	this.y1=y1;
	this.y2=y2;
	this.stroke=4;
	
	this.element = document.createElementNS(svgNS, 'line');
	this.element.setAttribute('data-index', uniqueDataIndex);
	this.element.setAttribute('class', elementClass);
	
	this.draw();
	svgCanvas.appendChild(this.element);
}

line.prototype.draw=function(){
	this.element.setAttribute('x1', this.x1);
	this.element.setAttribute('x2', this.x2);
	this.element.setAttribute('y1', this.y1);
	this.element.setAttribute('y2', this.y2);
	this.element.setAttribute('stroke-width', this.stroke);
	orderCanvas();
}
line.prototype.update=function(x1,y1,x2,y2){
	this.x1=x1;
	this.y1=y1;
	this.x2=x2;
	this.y2=y2;
}