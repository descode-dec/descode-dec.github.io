var searchTool = getCookie('defaultTools'),
	oText = document.getElementsByTagName('input')[0],
	oList = document.getElementsByClassName('word-list')[0],
	oSearchBox = document.getElementsByClassName('search-box')[0],
	word = '',
	oToolsList = document.getElementsByClassName('list')[0],
	flag1 = false,
	oLis = oToolsList.getElementsByTagName('li'),
	ele;

// 实时请求联想词, input的样式
oText.oninput = function () {
	if(oText.value == "" || oText.value == " ") {
		$('.word-list').html('');
		$('.word-list').css('display', 'none');
		oSearchBox.style.borderRadius = '40px';
		return;
	}
	requestData();
	word = oText.value;
}

// 把请求到的联想词写入页面
function keydata(keys) {

	var len = 5;
	var oLi = '';

	if(keys.s.length == 0) {
		oList.innerHTML = "" ;
		$('.word-list').css('display', 'none');
		oSearchBox.style.borderRadius = '40px';
		return;
	}

	if(keys.s.length < 5) len = keys.s.length;

	for(var i = 0; i < len; i++ ) {
		oLi += '<li>' + keys.s[i] + '</li>';
	}
	oList.innerHTML = oLi;
	$('.word-list').css('display', 'block');
	oSearchBox.style.borderRadius = '25px 25px 0 0';
}

var temp = -1;
// 联想词上下选择
oText.onkeydown = function (e) {
	var li = oList.getElementsByTagName('li');
	var len = li.length;
	for(var i = 0; i < len; i ++) {
		li[i].className = '';
	}	
	if(e.which == 40) {
		if(temp == li.length - 1) {
			temp = 0;
		}else{
			temp++;
		}
		li[temp].className = 'selected';
		e.preventDefault();
		oText.value = li[temp].innerHTML;
	}
	if(e.which == 38) {
		if( temp > 0 && temp < len) {
			temp--;
		}else if(temp == 0) {
			// console.log(len);
			temp = len - 1;
		}else{
			return;
		}
		li[temp].className = 'selected';
		e.preventDefault();
		oText.value = li[temp].innerHTML;
	}
	word = oText.value;
}

// 请求关联词数据
function requestData() {
	if(searchTool == 'baidu') {
		$.ajax({
			url : "https://suggestion.baidu.com/su",
			type : "get",
			dataType : "jsonp",
			jsonp : "jsoncallback",
			async : false,
			timeout : 5000,
			data : {
				"wd" : oText.value,
				"cb" : 'keydata'
			},
			success : function (json) {},
			error : function (xhr) {return;}
		});
	}else return;
}


function changeTool(len,flag,ele) {
	var flag = flag || false;
	var ele = ele || whatToolDom(searchTool);
	if(flag) {
		var tools = ele.getAttribute('tools');
		for(var i = 0; i < len; i++) {
			oLis[i].className = 'iconfont';
		}
		ele.className = 'iconfont using';
		setCookie('defaultTools',tools, 31);
		searchTool = tools;
		oToolsList.style.boxShadow = '';
		flag1 = false;
		console.log('tools = ' + tools, 'searchTool = ' + searchTool);
	}else{
		for(var i = 0; i < len; i++) {
			oLis[i].className = 'iconfont using';
			oToolsList.style.boxShadow = '5px 5px 10px #999';
		}
		flag1 = true;
	}
}

// 切换默认搜索工具
oToolsList.onclick = function () {
	var	len = oLis.length;
	changeTool(len, flag1, ele);
	// console.log('zhi'xin'a' + flag1);
}

// 监听li
for(var i = 0; i < oLis.length; i ++) {
	oLis[i].onclick = function () {
		ele = this;
		// console.log('I love Sakurajima mai!!!');
	}
}

// 设置cookie
function setCookie(cname,cvalue,exdays){
	var d = new Date();
	d.setTime(d.getTime()+(exdays*24*60*60*1000));
	var expires = "expires="+d.toGMTString();
	document.cookie = cname+"="+cvalue+"; "+expires;
}
// 获取cookie
function getCookie(cname){
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) {
		var c = ca[i].trim();
		if (c.indexOf(name)==0) { return c.substring(name.length,c.length); }
	}
	return "";
}

var searchWord = function (q) {
	var link;
	if(searchTool == 'baidu'){
		link = 'https://www.baidu.com/s?wd=' + q;	
	}else if(searchTool == 'google') {
		link = 'https://www.google.com/search?q=' + q;
	}else if(searchTool == 'bing'){
		link = 'https://cn.bing.com/search?q=' + q;
	}else{
		alert('这是一个bug');
	}
	window.location.href = link;
}

document.onkeydown = function (e) {
	var e = e || window.event;
	if(e.which == 13) {
		searchWord(word);
	}
}
$("html").click(function (e) {
	var element = whatToolDom(searchTool);
    if($(e.target).closest(".list").length == 0){
		changeTool(oLis.length, true, element);
    }
});

function whatToolDom(searchTool) {
	var searchTool = searchTool || 'baidu';
	for(var j = 0; j < oLis.length; j++) {
		if(searchTool == oLis[j].getAttribute('tools')) {
			var element = oLis[j];
		}
	}
	return element;
}

changeTool(oLis.length, true, whatToolDom(searchTool));

