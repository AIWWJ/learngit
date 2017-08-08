//3.通用函数
function g(selector){
	var method=selector.substr(0,1)=='.'?'getElementsByClassName':'getElementById';
	return document[method](selector.substr(1));
}
// 随机生成一个值0-20  random([min,max])
function random(rang){
	var max=Math.max(rang[0],rang[1]),
		  min=Math.min(rang[0],rang[1]);
	var diff=max-min;
	var num=Math.floor(Math.random()*diff+min);
	// console.log(num);
	return num;
}
// 4.获取所有的海报
var data=data;
console.log(data.length);
function addPhotos(){	
	var template=g("#content").innerHTML;		
	var html=[];
	var nav=[];

	for(i in data){
		var _html=template
					.replace('{{index}}',i)
					.replace('{{img}}',data[i].img)
					.replace('{{caption}}',data[i].caption)
					.replace('{{desc}}',data[i].desc)
		html.push(_html);
		nav.push('<span id="nav-'+i+'" onclick="turn(g(\'#photo-'+i+'\'))" class="i">&nbsp;</span>');
	}
	html.push('<div class="nav">'+nav.join('')+'</div>');
	g("#wrap").innerHTML=html.join('');
	rsort(random([0,data.length]));	
}
addPhotos();

//6.计算左右分区的范围  {left:{x:[min,max],y:[]},right:{}}
function range(){
	var range={left:{x:[],y:[]},right:{x:[],y:[]}};
	var wrap={
		w:g('#wrap').clientWidth,
		h:g('#wrap').clientHeight
	};
	var photo={
		w:g('.photo')[0].clientWidth,
		h:g('.photo')[0].clientHeight
	}	
	range.wrap=wrap;
	range.photo=photo;
//range.left.x=[0-photo.w,wrap.w/2-photo.w/2];
//range.left.y=[0-photo.h,wrap.h];
	range.left.x=[0-photo.w/9,wrap.w/3-photo.w/2];
	range.left.y=[0-photo.h/2,wrap.h];
//range.right.x=[wrap.w/2+photo.w/2,wrap.w+photo.w];
	range.right.x=[(wrap.w*3)/5+photo.w,(wrap.w*8)/9];
	range.right.y=range.left.y;

	return range;
}

//5.排序海报
function rsort(n){ 
	var _photo=g('.photo'),
		  photos=[];
	for(var s=0;s<_photo.length;s++){
		_photo[s].className=_photo[s].className.replace(/\s*photo-center\s*/,' ');
		_photo[s].className=_photo[s].className.replace(/\s*photo-front\s*/,' ');
		_photo[s].className=_photo[s].className.replace(/\s*photo-back\s*/,' ');
		
		_photo[s].className+=' photo-front';

		_photo[s].style.left='';
		_photo[s].style.top='';
		_photo[s].style['transform']=_photo[s].style['-webkit-transform']='rotate(360deg)  scale(1.3)';

		photos.push(_photo[s]);
	}

	var photo_center = g('#photo-'+n);
	photo_center.className += ' photo-center ';
	photo_center=photos.splice(n,1)[0];

	//把海报分成左右区域两部分
	var photos_left=photos.splice(0,Math.ceil(photos.length/2));

	var photos_right=photos;
	var ranges=range();

	for(s in photos_left){
		var photo=photos_left[s];
		photo.style.left=random(ranges.left.x)+'px';
		photo.style.top=random(ranges.left.y)+'px';

		photo.style['transform']=photo.style['-webkit-transform']='rotate('+random([-90,90])+'deg) scale(1)';
	}
	for(s in photos_right){
		var photo=photos_right[s];
		photo.style.left=random(ranges.right.x)+'px';
		photo.style.top=random(ranges.right.y)+'px';	

		photo.style['transform']=photo.style['-webkit-transform']='rotate('+random([-90,90])+'deg) scale(1)';	
	}
	// 控制按钮处理
	var navs=g('.i');
	for(var s=0;s<navs.length;s++){
		navs[s].className=navs[s].className.replace(/\s*i-current\s*/,' ');
		navs[s].className=navs[s].className.replace(/\s*i-back\s*/,' ');
	}
	g('#nav-'+n).className+=' i-current';
	console.log(photos.length);
}

//1. 翻面控制
function turn (element){
	var cls=element.className;
	var n=element.id.split('-')[1];

	if(!/photo-center/.test(cls)){
		return rsort(n);
	}


	if(/photo-front/.test(cls)){
		cls=cls.replace(/photo-front/,'photo-back');
		g('#nav-'+n).className+=' i-back';
	}else{
		cls=cls.replace(/photo-back/,'photo-front');
		g('#nav-'+n).className=g('#nav-'+n).className.replace(/\s*i-back\s*/,' ');
	}
	return element.className=cls;
}