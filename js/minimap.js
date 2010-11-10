/* 
 * Cardinal Quest
 * http://www.tametick.com/cq/
 *
 * Copyright (C) 2010, Ido Yehieli
 * Released under the GPL License:
 * http://www.gnu.org/licenses/gpl.txt
 */
 
 
 function Minimap(params) {

	this.mapW = this.mapH = 36;
	this.tileW = this.tileH = 5;
	this.colors = {
		wall: "#A2A2A2",
		floor: "#816250",
		door: "#9F6847",
		creature: "#ff0000",
		item: "#ffffff",
		wallDark: "#737373",
		floorDark: "#503C31",
		doorDark: "#705238"
	};

	this.canvasElement = $("#minimap").get()[0];
	this.ctx = this.canvasElement.getContext("2d");

	this.confg = function(params) {
		var self = this;
		if ( typeof params === "object" ) {
			$.each(params, function(key, val) {
				self[key] = val;
			});
		}
	}

	this.setMapSize = function(width, height) {
		this.mapW = width;
		this.mapH = height;
		this.tileW = (this.canvasElement.width / this.mapW);
		this.tileH = (this.canvasElement.height / this.mapH);
	}

	this.clear = function() {
		this.ctx.save();
		this.ctx.fillStyle = "rgb(0,0,0)";
		this.ctx.fillRect(0, 0, this.canvasElement.width, this.canvasElement.height);
		this.ctx.restore();
	}

	this.draw = function(map) {
		var left = player.vars.x - player.vars.fovRadius - 1;
		var right = player.vars.x + player.vars.fovRadius + 1;
		var top = player.vars.y - player.vars.fovRadius - 1;
		var bottom = player.vars.y + player.vars.fovRadius + 1;
		if ( left < 0 ) left = 0;
		if ( top < 0 ) top = 0;
		if ( right > (map.width - 1) ) right = map.width - 1;
		if ( bottom > (map.height - 1) ) bottom = map.height - 1;
		for ( var x = left; x <= right; x++ ) {
			for ( var y = top; y <= bottom; y++ ) {
				if ( player.vars.x == x && player.vars.y == y ) {
					this.ctx.fillStyle = "rgb("+player.vars.color[0]+","+player.vars.color[1]+","+player.vars.color[2]+")";
					this.ctx.fillRect( (this.tileW*x), (this.tileH*y), this.tileW, this.tileH );
				} else if ( map.tiles[[x,y]].seen > 0 && map.vars.itemMap[[x,y]].length > 0 ) {
					this.ctx.fillStyle = this.colors.item;
					this.ctx.fillRect( (this.tileW*x), (this.tileH*y), this.tileW, this.tileH );
				} else if ( map.tiles[[x,y]].seen == 2 ) {
					if ( map.tiles[[x,y]].seen > 0 && typeof map.vars.creatureMap[[x,y]] == "object" && map.vars.creatureMap[[x,y]] !== null ) {
						this.ctx.fillStyle = this.colors.creature;
						this.ctx.fillRect( (this.tileW*x), (this.tileH*y), this.tileW, this.tileH );
					} else { 
						switch (map.tiles[[x,y]].symbol) {
							case "#":
								this.ctx.fillStyle = this.colors.wall;
								break;
							case ".":
								this.ctx.fillStyle = this.colors.floor;
								break;
							case "+":
								this.ctx.fillStyle = this.colors.door;
								break;
							case "'":
								this.ctx.fillStyle = this.colors.floor;
								break;
							default:
								this.ctx.fillStyle = "#000";
								break;
						}
						this.ctx.fillRect( (this.tileW*x), (this.tileH*y), this.tileW, this.tileH );
					}
				} else if ( map.tiles[[x,y]].seen == 1 ) {
					switch (map.tiles[[x,y]].symbol) {
						case "#":
							this.ctx.fillStyle = this.colors.wallDark;
							break;
						case ".":
							this.ctx.fillStyle = this.colors.floorDark;
							break;
						case "+":
							this.ctx.fillStyle = this.colors.doorDark;
							break;
						case "'":
							this.ctx.fillStyle = this.colors.floorDark;
							break;
						default:
							this.ctx.fillStyle = "#000";
							break;
					}
					this.ctx.fillRect( (this.tileW*x), (this.tileH*y), this.tileW, this.tileH );
				}
			}
		}
	}

	this.drawDebug = function(map) {
		for ( var x = 0; x < map.width; x++ ) {
			for ( var y = 0; y < map.height; y++ ) {
				switch (map.tiles[[x,y]].symbol) {
					case "#":
						this.ctx.fillStyle = this.colors.wall;
						break;
					case ".":
						this.ctx.fillStyle = this.colors.floor;
						break;
					case "+":
						this.ctx.fillStyle = this.colors.door;
						break;
					case "'":
						this.ctx.fillStyle = this.colors.floor;
						break;
					default:
						this.ctx.fillStyle = "#000";
						break;
				}
				this.ctx.fillRect( (this.tileW*x), (this.tileH*y), this.tileW, this.tileH );
			}
		}
	}

	this.drawFillDebug = function(map) {
		console.log('closedList size: %i', map.closedList.length);
		this.ctx.save();
		this.ctx.fillStyle = '#ff0';
		for ( var i = 0; i < map.closedList.length; i++ ) {
			var pos = map.numToCoord(map.closedList[i]);
			this.ctx.fillRect( (this.tileW*pos[0]), (this.tileH*pos[1]), this.tileW, this.tileH );
		}
		this.ctx.restore();
	}

	this.debugRooms = function(map) {
		var self = this;
		var i = 0;
		$.each(map.rooms, function(key, val) {
			//console.log("Filling rect.. x: %i,y: %i, w: %i, h: %i", val.x0, val.y0, val.w, val.h);
			if ( i == 0 ) {
				self.ctx.fillStyle = "rgba(225,99,64,0.5)";
				self.ctx.fillRect((val.x0 * self.tileW), (val.y0 * self.tileH), (val.w*self.tileW), (val.h * self.tileH));
			}
			i++;
		});
	}

}
