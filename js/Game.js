(function(){
	var Game=window.Game=function(){
		this.canvas=document.getElementById("mycanvas");
		this.ctx=this.canvas.getContext("2d");
		this.f=0;
		this.state="check";
		this.R={
			"bg":"images/bg.png",
			"icons":"images/icons.png",
			"bomb":"images/bomb.png",
			"text_game_over":"images/text_game_over.png"
		};
		var imagesAmount = _.size(this.R);
		this.RObj={};
		var amount=0;
		var self=this;
		//是否触发拖拽；
		this.istuozhuai=false;
		for(var k in this.R){
			this.RObj[k]=new Image();
			this.RObj[k].src=this.R[k];
			this.RObj[k].onload=function(){
				amount++;
				self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
				self.ctx.fillText("正在加载图片资源"+amount+"/"+imagesAmount,15,15);
				if(amount==imagesAmount){
					self.start();
				}
			}

		}
		Game.prototype.bindEvent=function(){
			var self=this;
			g.canvas.onmousedown=function(event){
				//鼠标按下的位置
				var x=event.offsetX;
				var y=event.offsetY;
				self.col1=parseInt(x/40);
				self.row1=parseInt((y-180)/40);
				g.canvas.onmousemove=function(event){
					event.preventDefault();
					if(self.state!="Equilibrium_state"){
						return ;
					}
					//鼠标移动的位置
					var x=event.offsetX;
					var y=event.offsetY;
					self.col2=parseInt(x/40);
					self.row2=parseInt((y-180)/40);
					g.map.createBlocksByQR();
				
					if(self.col2!=self.col1||self.row2!=self.row1){
						//删除自己的监听防止再次触发；
						self.canvas.onmousemove=null;
						self.map.blocks[self.row1][self.col1].moveTo(self.row2,self.col2,6);
						self.map.blocks[self.row2][self.col2].moveTo(self.row1,self.col1,6);
						//检测是否能消除
						// g.map.test(row,col,row2,col2);
						//改变标记；
						self.istuozhuai=true;
						self.starttuozhuai=self.f;
						
					}
				}
			}
			g.canvas.onmouseup=function(){
						self.canvas.onmousemove=null;
			}
		}
		Game.prototype.start=function(){
			// var self=this;
			// this.b=new Block(7,7,2);
			this.map=new Map();
			this.bindEvent();
			this.timer=setInterval(function(){
				g.mainloop();
			}, 20)

		}
		Game.prototype.mainloop=function(){
			this.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
			this.f++;
			this.ctx.drawImage(this.RObj["bg"], 0, 0,this.canvas.width, this.canvas.height);
			this.ctx.textAlign = "left";
			this.ctx.fillText(this.f, 15, 15);
			this.ctx.fillText("得分:"+g.map.scroe, 230, 15);
			this.ctx.fillText(this.state, 50, 15);
			
			if(this.f>5000){
				clearInterval(this.timer);
				this.ctx.drawImage(this.RObj["text_game_over"], 0, 0, 204, 54, (this.canvas.width-204)/2, (this.canvas.height-54)/2-90,204, 54);

				this.ctx.font="20px 黑体"
				this.ctx.fillText("得分:"+g.map.scroe,  (this.canvas.width-50)/2, (this.canvas.height-50)/2-100);
			}
			// this.b.render();
			this.map.render();
			if(this.state=="check"){

				if(this.map.check()){
					
					this.startBoz=this.f;
					this.state="checkAnimate";
				}else{
					this.state="Equilibrium_state";
				}
				
			}else if(this.state=="checkAnimate"&&this.f>this.startBoz+30){
				this.state="dropAnimate";
				this.map.dropDown();
				this.startDropdown=this.f;
			}else if(this.state=="dropAnimate"&&this.f>this.startDropdown+30){
				this.state="Supplement_new";
				this.map.supplement();
				this.startSupplement=this.f;
			}else if(this.state=="Supplement_new"&&this.f>this.startSupplement+30){
				this.state="check";
				this.map.check();
			}else if(this.state=="Equilibrium_state"){
				if(this.istuozhuai&&this.f==this.starttuozhuai+6){
					if(this.map.test(this.row1,this.col1,this.row2,this.col2)){
						this.state="check";
						this.istuozhuai=false;
					}
				}
			}

		}
		
		

	}
	
})();

