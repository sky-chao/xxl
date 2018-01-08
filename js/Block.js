(function(){
	var Block=window.Block=function(row,col,color){
		this.row=row;
		this.col=col;
		this.color=color;
		this.x=this.col*40;
		this.y=180+this.row*40;
		this.f=0;
		this.f1=0;
		this.isBoz=false;
		//自己是否处于运动状态
		this.isAnimate = false;
	

	}
	Block.prototype.update=function(){
		this.f++;
		if(this.isAnimate&&this.f<=this.endf){
			this.x+=this.dx;
			this.y+=this.dy;
		}
		if(this.isBoz&&this.f%3==0){
			this.f1++;
			if(this.f1>9){
			this.hide=true;
			}
		}
		
	}
	Block.prototype.render=function(){
		var qiepianx=(this.color%3) * 76;
		var qiepiany=(this.color<3)? 0 :76;
		if(this.hide){
			return;
		}
		//检测g.map.check();如果》3个连续的就是要爆炸，就会进入else();执行爆炸；
		if(!this.isBoz){
			g.ctx.drawImage(g.RObj["icons"], qiepianx, qiepiany,76, 76, this.x,this.y, 40, 40);
		}else if(this.isBoz){
			g.ctx.drawImage(g.RObj["bomb"], this.f1 %8*200, 0,200, 200, this.x,this.y, 40, 40);
		}
	}
	Block.prototype.Boz=function(){
		this.isBoz=true;
		// this.f1=0;
		this.endf = this.f+20;
	}
	Block.prototype.moveTo=function(row,col,frame){
		var frame=frame||20;
		this.isAnimate=true;
		this.dx=(col-this.col)*40/frame;
		this.dy=(row-this.row)*40/frame;
		this.endf=this.f+frame;
		this.row=row;
		this.col=col;
	}
})();