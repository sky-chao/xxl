(function(){
	var Map=window.Map=function(){
		this.scroe=0;
		this.QRcode=[[],[],[],[],[],[],[],[]];
		// this.QRcode=[
		// 	[0,1,2,3,4,1,1,1],
		// 	[0,1,2,3,4,5,1,5],
		// 	[0,1,2,3,2,5,2,1],
		// 	[0,5,2,4,4,5,1,4],
		// 	[2,1,2,3,4,4,1,1],
		// 	[0,1,2,5,3,5,1,2],
		// 	[0,3,2,3,4,5,3,1],
		// 	[0,1,2,2,4,2,1,1]
		// ];
		for(var r=0;r<8;r++){
			for(var c=0;c<8;c++){
				this.QRcode[r][c]=_.random(0,5);
			}
		}
		
		this.needToBoz=[[],[],[],[],[],[],[],[]];
		this.downrowAmount=[[],[],[],[],[],[],[],[]];
		this.createBlocksByQR();
		
	}
	Map.prototype.createBlocksByQR=function(){
		this.blocks=[[],[],[],[],[],[],[],[]];
		for(var r=0;r<8;r++){
			for(var c=0;c<8;c++){
				this.blocks[r][c]=new Block(r,c,this.QRcode[r][c]);
				
			}
		}
	}
	//渲染地图就是渲染自己所有的砖头类
	Map.prototype.render=function(){
		for(var r=0;r<8;r++){
			for(var c=0;c<8;c++){

				this.blocks[r][c].update();
				this.blocks[r][c].render();

				// g.ctx.fillText(this.QRcode[r][c],c*10,30+r*10);
				// if(this.needToBoz[r][c]){
				// 	g.ctx.fillText(this.needToBoz[r][c],100+c*10,30+r*10);
				// }else{
				// 	g.ctx.fillText("♦",100+c*10,30+r*10);
				// }
				// if(this.downrowAmount[r][c]){
				// g.ctx.fillText(this.downrowAmount[r][c],200+c*10,30+r*10);
				// }
			}
		}
	}
	//检测爆炸 行。列》3个以上的就可以消除
	Map.prototype.check=function(){
		var result=false;
		//循环8行
		for(var r=0;r<8;r++){
			var i=0;
			var j=1;
			while(i<8){
				if(this.QRcode[r][i]==this.QRcode[r][j]){
					j++;
				}else{
					if(j-i>=3){
						for(var m=i;m<j;m++){
							this.needToBoz[r][m]="X";
							this.blocks[r][m].Boz();
							this.scroe++;
							result=true;
						}
					}
					i=j;
					j++;
				}
			}
		}
		//循环8列
		for(c=0;c<8;c++){
			var i=0;
			var j=1;
			while(i<8){
				if(j<8&&this.QRcode[i][c]==this.QRcode[j][c]){
					j++;
				}else{
					if(j-i>=3){
						for(var m=i;m<j;m++){
							this.needToBoz[m][c]="X";
							this.blocks[m][c].Boz();
							this.scroe++;
							result=true;
						}
					}
					i=j;
					j++;
				}
			}
		}
		return result;
	}
	//打印每check后存在元素下落的行数
	Map.prototype.dropDown=function(){
		
		//提出一个矩阵表示每个元素下落多少行
		for(var r=0;r<7;r++){
			for(var c=0;c<8;c++){
				if(this.needToBoz[r][c]!="X"){
					var amount=0;
					for(var m=r+1;m<8;m++){
						if(this.needToBoz[m][c] =="X"){
							amount++;
						}
					}

				}
				//每一个未消掉的lock下落的增量
				this.downrowAmount[r][c]=amount;
				//让每一个未消掉的block下落增量的路程
				this.blocks[r][c].moveTo(r+amount,c);

			}
		}
		for(var r=0;r<8;r++){
			for(var c=0;c<8;c++){
				this.QRcode[r][c]="*";
			}
		}
		//从blocks阵，反推QR阵；
		for(var r=0;r<8;r++){
			for(var c=0;c<8;c++){
				var theblock=this.blocks[r][c];
				if(!this.blocks[r][c].hide){
					this.QRcode[theblock.row][theblock.col]=theblock.color;

				}
			}
		}
	}
	Map.prototype.supplement=function(){
		//先归整一下；
		this.createBlocksByQR();
		//遍历一下QRcodez矩阵，如果是“*”，就new一个，放在-5行，然后移动到遍历的那个地方去；
		for(var r=0;r<8;r++){
			for(var c=0;c<8;c++){
				if(this.QRcode[r][c]=="*"){
					var color=_.random(0,5);
					this.blocks[r][c]=new Block(-5,c,color);
					this.blocks[r][c].moveTo(r,c);
					this.QRcode[r][c]=color;
				}
				this.needToBoz[r][c]=undefined;
				this.downrowAmount[r][c]=undefined;
			}
		}
		
	}
	//测试把row1,col1和row2,col2两个元素交换位置，能不能进行消行；
	//如果可以，返回true，并执行动画,否则返回false
	Map.prototype.test=function(row1,col1,row2,col2){
		//备份当前QRcode阵
		var oldQRcode=[[],[],[],[],[],[],[],[]];
		for(var i=0;i<8;i++){
			for(var j=0;j<8;j++){
				oldQRcode[i][j]=this.QRcode[i][j];
			}
		}

		
		var c=this.QRcode[row1][col1];
		this.QRcode[row1][col1]=this.QRcode[row2][col2];
		this.QRcode[row2][col2]=c;
		this.createBlocksByQR();
		if(this.check()){
			return true;
		}else{
			this.QRcode=oldQRcode;
			this.blocks[row1][col1].moveTo(row2,col2,6);
			this.blocks[row2][col2].moveTo(row1,col1,6);
			return false;
		}
	}

})();   