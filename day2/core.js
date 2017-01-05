	/*请使用IE9+,chrome（推荐）,firefox等现代浏览器
		如发现bug,请联系imwangfu@gmail.com谢谢
	*/
	var fruits = 0;//记录消失的水果数量
	var isSelect = false;//水果选中状态
	var rank = 0;//难度
	var container = new Array();//储存所选择的图片信息
	var counter =makeCounter();//计时器
	for(var i = 0;i<2;i++){
		container[i] = new Array();
	}
	function trigger(e,x,y){//点击图片触发
		var ele=e.target;
		//如果点击空白处或原来的图片，则停止执行
		if(!box[x][y]||ele==container[1][0]){
			return 0;
		}
		if(isSelect){
			container[0].push({"x":x,"y":y});
			container[1].push(ele);
			macth();//检查是否匹配
		}else{
			isSelect = 1;
			container[0].push({"x":x,"y":y});
			container[1].push(ele);
			ele.style.cssText="border:3px solid green;animation:mymove 0.3s infinite; "; 
		}
	}
	//计时器
	function makeCounter(){
		var life  =100;
		var used =0 ;
		var stop ;
		function count(status,times){
			if(status==0){
				life=100;
			}
			if(life>0){
			document.querySelector(".life-res").style.width=life+"%";
			document.querySelector(".life-used").style.width=used+"%";
			life-=0.1;
			used = 100-life;
			stop = setTimeout(function(){count(1,times)},times);
			}else{
				 counter.stop();
				 showBg(1,"block",rank,0);
			}
		}
		return {
			start : function(status,times){
				count(status,times)
			},
			stop:function(){
				clearTimeout(stop);
			}
		}
	}
	//建立游戏界面
	function setTable(row,col,type){
		window.row =row;
		window.col =col;
		box = new Array();//建立二维数组储存图片状态
		for(var i = 0; i<row;i++){
			box[i]=new Array()
		}
		console.log(box)
		var imageShows = new Array((col-2)*(row-2)/2);//把所有图片分成一半，每次增加相同的两张，保证图片成对出现。
	    nums  = imageShows.length;
		for(var i =0, t=0, n=1;i<nums;n++,t+=2,i++){
			if(n>type){
				n = 1;
			}
			imageShows[t]=n;
			imageShows[t+1]=n
		}
		imageShows = changeOrder(imageShows);
		console.log(imageShows)
		var n = 0;
		var html = "<table><div></div>";
		for(var i= 0;i<row;i++){
			html+="<tr>";
			for(var j=0;j<col;j++){
				//如果在最外面两行和两列则设置为空值
				if(i<=0||i>=row-1||j<=0||j>=col-1){
					html+="<td>"
					box[i][j]=0;
				}else{
					box[i][j]=imageShows[n];
					html+="<td><img onclick='trigger(event,"+i+","+j+")' src=\"images/"+imageShows[n]+".png\"/>";
					n++;
				}
				html+="</td>";
			}
		}
		html+="</tr>";html+="</table>"
		document.querySelector(".game").innerHTML=html;
	}
	//判断是否成功
	function macth(){
		if(check()){//匹配成功，则设置动画，在box中标记为0，并移除container数组的值
			isSelect = false;
			img1 = container[1][0];
			img2 = container[1][1];
			img1.style.cssText="border:none;";
			img1.setAttribute("src","images/boom.png")
			img2.style.cssText="border:none;";
			img2.setAttribute("src","images/boom.png")
			setTimeout(function(){img1.style.cssText="animation:none;display:none"},300);
			setTimeout(function(){img2.style.cssText="animation:none;display:none"},300);
			for(var i =0,length=container[0].length;i<length;i++){
				box[container[0][0].x][container[0][0].y]=0;
				container[1].shift();
				container[0].shift();
			}
			fruits++;
			if(fruits>=nums){
				counter.stop();
				rank++;//难度增加
				showBg(1,"block",rank,1)//显示继续界面
			}
		}else{
			container[1][0].style.cssText="border:none;animation:none;";
			container[0].shift();
			container[1].shift();
			container[1][0].style.cssText="border:3px solid green;animation:mymove 0.3s infinite;";
		}
	}
	//检查A点是否能到达B点
	function check(){
		var A = container[0][0];
		var B = container[0][1];
		if(!sameObj(A,B)){//不是匹配的图片则终止
			return false;
		}
		X1 = A.x;Y1 = A.y;
		X2 = B.x;Y2 = B.y;
		/* 遍历所有可能的路径 */
		var path1 = getPath(X1,Y1);//得到第一条直线所以可能的点
		for(var i = 0;i<path1.length;i++){
			if(isLine(A,path1[i])){
				path2 = getPath2(A,path1[i],B);//得到第二条直线所有可能的点
				for(var j=0;j<path2.length;j++){
					if(isLine(path1[i],path2[j],B)){
						if(isLine(path2[j],B,B)){
							return true;
						}
					}
				}
			}
		}
		return false;
	}
	//判断是否为匹配元素
	function sameObj(A,B){
		if(box[A.x][A.y]==box[B.x][B.y]){
			return true;
		}
	  return false;
	}
	//判断两点之间是否能通
	function isLine(A,B,B2){
		if(A.x==B.x){//横向
			var t= 1;
			if(A.y<B.y){
				 t= -1;
			}
			var dis = Math.abs(A.y-B.y);//需要遍历的长度
			if(B==B2){//如果是最后一条直线，则不需要判断B点本身
				for(var i = 0;i<dis-1;i++){
					n = t*(i+1)
					if(box[A.x][A.y-n]){
						return false;
					}
				}
				return true;
			}
			for(var i =0;i<dis;i++){
				 n = t*(i+1)
				if(box[A.x][A.y-n]){
					return false;
				}
			}
			return true;
		}
		if(A.y==B.y){//纵向
			var t= 1;
			if(A.x<B.x){
				t =-1;
			}
			var dis = Math.abs(A.x-B.x);
		 	if(B==B2){
				for(var i = 0;i<dis-1;i++){
					n = t*(i+1)
					if(box[A.x-n][A.y]){
						return false;
					}
				}
				return true;
			}
			for(var i = 0;i<dis;i++){
				n = t*(i+1)
				if(box[A.x-n][A.y]){
					return false;
				}
			}
			return true;
		}
	}
	//获取第一条可能的路径点
	function getPath(x,y){
		//纵向
		var path = new Array()
		for(var j = 0;j<row;j++){
			path.push({"x":x,"y":j})
		}
		//横向
		for(var i =0;i<col;i++ ){
			path.push({"x":i,"y":y})
		}
		return path;
	}
	/* 获取第二条可能的路径点
	A为A点，path1为第二条路径的开始点,B为B点 
	三条路径最多两个拐角，只需要匹配与B点对应的那个点就行
	*/
	function getPath2(A,path1,B){
		var path = new Array()
		if(A.y==path1.y){
			path.push({"x":path1.x,"y":B.y})
		}
		if(A.x==path1.x){
			path.push({"x":B.x,"y":path1.y});
		}
		return path;
	}
	//打乱图片顺序
	function changeOrder(imageShows){
		var copyOrder = new Array();
		var newOrder  = new Array();
		//将图片数组赋值给新的临时数组以便进行操作
		for(var i =0;i<imageShows.length;i++){
			copyOrder[i] = imageShows[i];
		}
		//把数组按随机索引取出赋值给新数组
		for(var i =0;i<imageShows.length;i++){
			newOrder[i] = (copyOrder.splice(Math.floor(Math.random()*copyOrder.length),1))[0];
		}
		return newOrder;
	}
