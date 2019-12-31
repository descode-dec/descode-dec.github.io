Search.prototype = {
	init: function() {
		this.searchTool = getCookie('defaultTool');
		this.oText = document.getElementsByTagName('input')[0];
		this.oList = document.getElementsByClassName('word-list')[0];
		this.oSearchBox = document.getElementsByClassName('search-box')[0];
		this.word = '';
		this.selectWord = '';
		this.oToolsList = document.getElementsByClassName('list')[0];
		this.flag1 = false;
		this.oLis = this.oToolsList.getElementsByTagName('li');
		this.ele = undefined;
		this.selectElement = undefined;
		this.temp = -1;
		this.name = 'desc';
		var that = this;
		for(var i = 0; i < this.oLis.length; i++) {
			var that = this;
			this.oLis[i].onclick = function() {
				that.ele = this;
			}
		}
		this.oText.oninput = function() {
			var reg = /^\s+$/g;
			if (that.oText.value == "" || reg.test(that.oText.value)) {
				that.hideWordList();
				return;
			}
			that.requestData();
			that.word = that.oText.value;
			that.oList.onmouseover = null;
		}
		this.oText.onkeydown = function(e) {
			var e = e || window.event,
				li = that.oList.getElementsByTagName('li');
				len = li.length;
			for (var i = 0; i < len; i ++) {
				li[i].className = '';
			}
			if (e.which == 40) {
				if (that.temp == li.length - 1) {
					that.temp = 0;
				}else{
					that.temp++;
				}
				li[that.temp].className = 'selected';
				e.preventDefault();
				that.oText.value = li[that.temp].innerHTML;
			}
			if (e.which == 38) {
				if (that.temp > 0 && that.temp < len) {
					that.temp--;
				}else if (that.temp == 0 || temp == -1) {
					that.temp = len - 1;
				}else{
					return;
				}
				li[that.temp].className = 'selected';
				e.preventDefault();
				that.oText.value = li[that.temp].innerHTML;
			}
			that.word = that.oText.value;
		}
		document.onmousemove = function() {
			that.oList.onmouseover = function(e) {
				var e = e || window.event,
					target = e.target || e.srcElement,
					li = that.oList.getElementsByTagName('li'),
					len = li.length;
				for (var i = 0; i < len; i++) {
					if (li[i] === target) {
						that.temp = i;
					}
				}
				that.changeListStyle(li, that.temp);
				that.selectWord = target.innerText;
			}
		}
		this.oList.onmouseout = function(e) {
			var e = e || window.event,
				target = e.target || e.srcElement;
			if (target === that.oList) return;
			target.className = '';
			that.temp = -1;
		}
		this.oList.onclick = function() {
			that.searchWord(that.selectWord);
			that.hideWordList();
		}
		this.oToolsList.onclick = function() {
			var len = that.oLis.length;
			that.changeTool(len, that.flag1, that.ele);
		}
		document.onkeydown = function(e) {
			var e = e || window.event;
			if (e.which == 13) {
				that.searchWord(that.word);
				that.hideWordList();
			}
		}
		$("html").click(function(e) {
			var ele = that.whatToolDom(that.searchTool);
			if ($(e.target).closest(".list").length == 0) {
				that.changeTool(that.oLis.length, true, ele);
			}
		});
		this.changeTool(this.oLis.length, true, this.whatToolDom(this.searchTool));
	},
	hideWordList : function() {
		this.oList.innerHTML = "";
		this.oList.style.display = 'none';
		this.oSearchBox.style.borderRadius = '40px';
		return;
	},
	clearListStyle : function(list) {
		if (list) {
			var len = list.length;
			for (var i = 0; i < len; i++) {
				list[i].className = '';
			}
		}
	},
	changeListStyle : function(list, num) {
		this.clearListStyle(list);
		if (list[num]) {
			list[num].className = 'selected';
		}
	},
	requestData : function() {
		var that = this,
			keydata = 'searchObj.keydata';
		// console.log(that.keydata);
		if (that.searchTool === 'baidu') {
			$.ajax({
				url : "https://suggestion.baidu.com/su",
				type : "get",
				dataType : "jsonp",
				jsonp : "jsoncallback",
				async : false,
				timeout : 5000,
				data : {
					"wd" : that.oText.value,
					"cb" : keydata
				},
				success : function(json) {},
				error : function(xhr) {return}
			})
		}else{
			$.ajax({
				url: "https://www.baidu.com/su?ie=utf-8&wd=wd=" + that.oText.value,
				type: "get",
				dataType: "jsonp",
				async: false,
				timeout: 2000,
			})
		}
	},
	changeTool : function(len, flag, ele) {
		var flag = flag || false,
			ele = ele || this.whatToolDom(searchTool),
			len = len || this.oLis.length;
		if (flag) {
			var tools = ele.getAttribute('tools');
			for (var i = 0; i < len; i++) {
				this.oLis[i].className = 'iconfont';
			}
			ele.className = 'iconfont using';
			setCookie('defaultTools', tools, 31);
			this.searchTool = tools;
			this.oToolsList.style.boxShadow = '';
			this.flag1 = false;
		}else{
			for (var i = 0; i < len; i++ ) {
				this.oLis[i].className = 'iconfont using';
				this.oToolsList.style.boxShadow = '5px 5px 10px #999';
			}
			this.flag1 = true;
		}
	},
	searchWord : function(q) {
		var link,
			reg = /^\s+$/;
		if (reg.test(q)) return;
		if (this.searchTool == 'baidu') {
			link = 'https://www.baidu.com/s?wd=' + q;
		}else if (this.searchTool == 'google') {
			link = 'https://www.google.com/search?q=' + q;
		}else if (this.searchTool == 'bing') {
			link = 'https://cn.bing.com/search?q=' + q;
		}else{
			alert('页面发生了预计中不会发生的错误！错误代码: 01');
			return;
		}
		window.location.href = link;
	},
	whatToolDom : function(searchTool, list) {
		var searchTool = searchTool || 'baidu',
			list = list || this.oLis;
			len = list.length;
		for (var j = 0; j < len; j++) {
			if(searchTool == list[j].getAttribute('tools')) {
				var element = list[j];
			}
		}
		return element;
	},
	keydata : function(keys) {
		var len = keys.s.length,
			oLi = '';
		if (len == 0) {
			this.oList.innerHTML = "";
			this.oList.style.display = 'none';
			this.oSearchBox.style.borderRadius = '40px';
			return;
		}
		if (len > 5) {
			len = 5;
		}
		for (var i = 0; i < len; i++) {
			if (!keys.s[i]) {
				return;
			}
			oLi += '<li>' + keys.s[i] + '</li>';
		}
		this.oList.innerHTML = oLi;
		this.oList.style.display = 'block';
		this.oSearchBox.style.borderRadius = '25px 25px 0 0';
	}
}
function Search() {
	this.init();
}
var searchObj = new Search();
var baidu = {
	sug: function(key) {
		searchObj.keydata(key);
	}
}
console.log("%cI love Sakurajima Mai --2019/12/31 21：46：42", "background-image: linear-gradient(to right, red, blue);color: #fff");