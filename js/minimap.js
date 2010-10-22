function Minimap(params) {

	this.mapW = this.mapH = 36;
	this.tileW = this.tileH = 5;
	this.colors = {
		wall: "#A2A2A2",
		floor: "#816250",
		door: "#9F6847",
		wallDark: "#737373",
		floorDark: "#503C31",
		doorDark: "#705238"
	};

	this.canvasElement = $("#minimap").get()[0];
	this.ctx = this.canvasElement.getContext("2d");

	this.confg = function(params) {
		var self = this;
		if ( typeof params === "object" ) {
			$.each(params, function(key, val) { self[key] = val; });
		}
	}

	this.setMapSize = function(width, height) {
		this.mapW = width;
		this.mapH = height;
		this.tileW = (this.canvasElement.width / this.mapW);
		this.tileH = (this.canvasElement.height / this.mapH);
	}

	this.clear = function() {
		this.ctx.fillStyle = "rgb(0,0,0)";
		this.ctx.fillRect(0, 0, this.canvasElement.width, this.canvasElement.height);
	}

	this.draw = function(map) {
		for ( var x = 0; x < map.width; x++ ) {
			for ( var y = 0; y < map.height; y++ ) {
				if ( map.tiles[[x,y]].seen == 2 ) {
					switch (map.tiles[[x,y]].symbol) {
						case "#": this.ctx.fillStyle = this.colors.wall; break;
						case ".": this.ctx.fillStyle = this.colors.floor; break;
						case "+": this.ctx.fillStyle = this.colors.door; break;
						case "'": this.ctx.fillStyle = this.colors.floor; break;
						default: this.ctx.fillStyle = "#000"; break;
					}
					this.ctx.fillRect( (this.tileW*x), (this.tileH*y), this.tileW, this.tileH );
				} else if ( map.tiles[[x,y]].seen == 1 ) {
					switch (map.tiles[[x,y]].symbol) {
						case "#": this.ctx.fillStyle = this.colors.wallDark; break;
						case ".": this.ctx.fillStyle = this.colors.floorDark; break;
						case "+": this.ctx.fillStyle = this.colors.doorDark; break;
						case "'": this.ctx.fillStyle = this.colors.floorDark; break;
						default: this.ctx.fillStyle = "#000"; break;
					}
					this.ctx.fillRect( (this.tileW*x), (this.tileH*y), this.tileW, this.tileH );
				}
			}
		}
	}
}
