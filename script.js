(function(){var s = document.createElement("script");s.setAttribute("src","template.js");document.head.appendChild(s);})()
function start(){
	U.empty();
	U.bcolor = "grey";
	U.color = "white";
	U.camera.setGrid(true,50,50,"grey");
	U.w = 1000;
	U.h = 1000;
	U.container.stretchfit(U);
	U.add(new Snake());
	
	//U.add(makeShortcut(new UI.DBox(0,0,800,800),"Board"));
	//Board.camera.centerZero();
	//Board.bcolor = "grey";
	/*U.add(new UI.Button(10,10,50,50));
	U.add(new (function(){
		this.keydown = function(k){
			if (k.name=="esc"){
				if (slotTaken(galaxy.slot))
					deleteSlot(galaxy.slot);
				start();
			}
		}
	})());*/
}
function Snake(){
	function Seg(x,y){
		this.x = x;
		this.y = y;
		this.eq = function(o){
			return o.x==this.x&&o.y==this.y;
		}
	}
	this.init = function(){
		this.delay = .1;
		this.cur = 0;
		this.dir = this.dir2 = 0;
		this.coms = "";
		this.segs = [];
		this.e = true;
		this.p = false;
		this.c = true;
		for (var i = 0; i < 1; i++)
			this.segs.push(new Seg(this.container.w/2/50,this.container.h/2/50-i));
		this.spawnfood();
		this.started = false;
	}
	this.update = function(d){
		if (!this.started)
			return;
		this.cur+=d;
		if (this.cur > this.delay){
			this.cur = 0;
			//if (!this.collide())
			if (!this.p)
				this.move();
			//if (this.collide())
			//	this.die();
			this.checkeat();
		}
	}
	this.keydown = function(k){
		if ("WASD".indexOf(k.name)!=-1)
			this.started = true;
		if (this.coms == "")
			this.coms = k.name;
		else this.coms = this.coms.charAt(0)+k.name;
		if (this.p && "WASD".indexOf(k.name)!=-1){
			this.coms = k.name;
			this.move();
		}
		if (k.name == "E")
			this.e = !this.e;
		if (k.name == "P")
			this.p = !this.p;
		if (k.name == "C")
			this.c = !this.c;
	}
	this.grow = function(l){
		for (var i = 0; i < (l || 1); i++)
			this.segs.splice(0,0,this.segs[0]);
	}
	this.collide = function(h){
		if (K.Keys.space.down)
			return false;
		if (h.x<0||h.x>=20||
			h.y<0||h.y>=20)
			return true;
		for (var i = 0; i < this.segs.length-1; i++)
			if (h.eq(this.segs[i]))
				return true;
		return false;
	}
	this.spawnfood = function(){
		var overlap = false;
		do{
			overlap = false;
			this.food = new Seg(Math.round(Math.random()*19),Math.round(Math.random()*19));
			for (var i = 0; i < this.segs.length; i++)
				if (this.segs[i].eq(this.food))
					overlap = true;
		}while(overlap);
	}
	this.checkeat = function(){
		if (head().eq(this.food)){
			if (this.e)
				this.grow();
			this.spawnfood();
		}
	}
	this.die = function(){
		//alert("You died.\nScore: "+this.segs.length);
		start();
	}
	var head = function(){
		return this.segs[this.segs.length-1];
	}.bind(this);
	this.move = function(){
		//if (Math.abs(this.dir2-this.dir)%2!=0)
			
		var b = this.dir2;
		switch(this.coms.substring(0,1)){
			case "W":	this.dir2 = 0;	break;
			case "A":	this.dir2 = 1;	break;
			case "S":	this.dir2 = 2;	break;
			case "D":	this.dir2 = 3;	break;
		}
		if (Math.abs(this.dir2-this.dir)%2==0 && this.segs.length > 1)
			this.dir2 = b;
		 this.coms = this.coms.substring(1);
			this.dir = this.dir2;
		var h = head();
		var nexthead;
		switch(this.dir){
			case 0:		nexthead = new Seg(h.x,h.y-1);	break;
			case 1:		nexthead = new Seg(h.x-1,h.y);	break;
			case 2:		nexthead = new Seg(h.x,h.y+1);	break;
			case 3:		nexthead = new Seg(h.x+1,h.y);	break;
		}
		//if (!this.collide()){
			if (!this.c&&this.collide(nexthead))
				return;
			this.segs.push(nexthead);
		//if (this.collide())
		//	this.segs.remove(nexthead);
		//else
		//if (!this.collide())
			var tail = this.segs.splice(0,1);
		if (this.collide(head())){
			//this.segs = beforeSegs;
			if (this.c)
				this.die();
			//else {
			//	this.segs.splice(0,0,tail);
			//	this.segs.splice(this.segs.length-1,1);
			//}
		}
		//}
	}
	this.render = function(g){
		g.font = "Arial 20px";
		for (var i = 0; i < this.segs.length; i++){
			var x = this.segs[i].x,
				y = this.segs[i].y;
			g.fillStyle = "black";
			g.fillRect(x*50,y*50,50,50);
		}
		for (var i = 0; i < 0*this.segs.length; i++){
			var x = this.segs[i].x,
				y = this.segs[i].y;
			g.fillStyle = "red";
			g.fillText(i,x*50+25,y*50+25);
		}
		g.fillStyle = "red";
		g.fillRect(this.food.x*50,this.food.y*50,50,50);
	}
}