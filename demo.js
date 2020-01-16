Search.prototype = {
	init: function() {
		// 设置搜索工具
		this.searchTool = getCookie('defaultTool');
		// 搜索框
		this.oText = document.getElementsByTagName('input')[0];
		// 建议词列表
		this.oList = document.getElementsByClassName('word-list')[0];
		// 包含选择搜索工具和搜索框的盒子
		this.oSearchBox = document.getElementsByClassName('search-box')[0];
		// 搜索词, 针对键盘操作
		this.word = '';
		// 鼠标选中的词， 针对鼠标操作
		this.selectWord = '';
		// 搜索工具列表
		this.oToolsList = document.getElementsByClassName('list')[0];
		// 搜索工具默认开关变量
		this.flag1 = false;
		// 搜索工具列表的子元素们
		this.oLis = this.oToolsList.getElementsByTagName('li');
		// 临时储存选择的默认工具DOM对象
		this.ele = undefined;
		// 建议词中正在选中的元素位置。比如第一个建议词，temp == 0
		this.temp = -1;
		// 储存this
		var that = this;

		/**
		 * 给每个代表搜索工具的DOM绑定click事件
		 */
		for(var i = 0; i < this.oLis.length; i++) {
			this.oLis[i].onclick = function() {
				// 点击事件中，this会指向监听的被点击DOM
				that.ele = this;
			}
		}
		this.oText.oninput = function() {
			// 匹配输入内容是否是 空
			var reg = /^\s+$/g;
			/**
			 * 如果搜索框内容为 空，隐藏建议词裂变，并返回
			 */
			if (that.oText.value == "" || reg.test(that.oText.value)) {
				that.hideWordList();
				return;
			}
			// 请求建议词数据
			that.requestData();
			// 搜索词变成搜索框的内容
			that.word = that.oText.value;
			// 当搜索框输入时，阻止建议词的mouseover事件
			that.oList.onmouseover = null;
		}
		/**
		 * 上下选择建议词
		 */
		this.oText.addEventListener('keydown',function(e) {
			console.log("i love shiina mashiro")
			// 兼容
			var e = e || window.event,
			// 建议词列表的子元素们
				li = that.oList.getElementsByTagName('li');
				len = li.length;

			// 把元素的class都去掉
			for (var i = 0; i < len; i ++) {
				li[i].className = '';
			}
			// arrowDown绑定事件
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
			// arrowUp 绑定事件
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
			// 待搜索词变成搜索框的内容
			that.word = that.oText.value;
		});
		/**
		 * 鼠标移动时，绑定建议词mouseover事件
		 */
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
		this.oText.onkeydown = function(e) {
			var e = e || window.event;
			if (e.which == 13) {
				that.searchWord(that.word);
				that.hideWordList();
			}
		}
		/**
		 * 当选择搜索工具展开时，点击页面，自动收起
		 */
		$("html").click(function(e) {
			// 本来都是关闭的，直接return
			if (that.flag1 == false) {
				return;
			}

			var ele = that.whatToolDom(that.searchTool);
			if ($(e.target).closest(".list").length == 0) {
				that.changeTool(that.oLis.length, true, ele);
			}
		});
		this.changeTool(this.oLis.length, true, this.whatToolDom(this.searchTool));
	},
	/**
	 * 隐藏建议词列表
	 */
	hideWordList : function() {
		this.oList.innerHTML = "";
		this.oList.style.display = 'none';
		this.oSearchBox.style.borderRadius = '40px';
		return;
	},
	/**
	 * 清除建议词列表样式
	 * @param {object} list - DOM对象, 通常为建议词列表的子元素们
	 */
	clearListStyle : function(list) {
		if (list) {
			var len = list.length;
			for (var i = 0; i < len; i++) {
				list[i].className = '';
			}
		}
	},
	/**
	 * 设置建议词样式
	 * @param {object} list - DOM对象，通常为建议词列表的子元素们
	 * @param {number} num - 索引值
	 */
	changeListStyle : function(list, num) {
		this.clearListStyle(list);
		if (list[num]) {
			list[num].className = 'selected';
		}
	},
	/**
	 * 请求建议词数据
	 */
	requestData : function() {
		var that = this;
		if (that.searchTool === 'baidu') {
			$.ajax({
				url : "https://suggestion.baidu.com/su?wd=" + that.oText.value,
				type : "get",
				dataType : "jsonp",
				jsonp : "jsoncallback",
				async : false,
				timeout : 5000,
			})
		}else{
			// 似乎谷歌和必应的建议词都不支持jsonp,所以只能用百度的了
			$.ajax({
				url: "https://www.baidu.com/su?ie=utf-8&wd=wd=" + that.oText.value,
				type: "get",
				dataType: "jsonp",
				async: false,
				timeout: 2000,
			})
		}
	},
	/**
	 * 改变默认搜索工具
	 * @param {number} len - 搜索工具的列表长度　通常为３
	 * @param {boolean} flag - 搜索工具列表的开关变量，通常为变量flag1
	 * @param {object} ele - DOM对象，搜索工具列表的子元素之一
	 */
	changeTool : function(len, flag, ele) {
		var flag = flag || false,
			ele = ele || this.whatToolDom(searchTool),
			len = len || this.oLis.length;
		if (flag) {
			// 要关闭
			// 每个搜索工具列表的子元素都有一个属性-tools,他用来识别是哪个工具
			var tools = ele.getAttribute('tools');
			for (var i = 0; i < len; i++) {
				this.oLis[i].className = 'iconfont';
			}
			ele.className = 'iconfont using';
			setCookie('defaultTool', tools, 31);
			this.searchTool = tools;
			this.oToolsList.style.boxShadow = '';
			this.flag1 = false;
		}else{
			// 要展开
			for (var i = 0; i < len; i++ ) {
				this.oLis[i].className = 'iconfont using';
				this.oToolsList.style.boxShadow = '5px 5px 10px #999';
			}
			this.flag1 = true;
		}
	},
	/**
	 * 进行搜索
	 * @param {string} q - 搜索词
	 */
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
	/**
	 * 判断是哪个搜索工具DOM
	 * @param {string} searchTool
	 * @param {object} list
	 */
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
	/**
	 * 请求数据之后服务器调用的函数，用来写入建议词
	 */
	keydata : function(keys) {
		/**
		 * 如果删除搜索框的内容太快
		 * 服务器会在搜索框清除完后调用该函数
		 * 所以会导致搜索框是空的，但是底下还有建议词
		 * 判断现在搜索框里是否有内容，如果没有直接返回
		 */
		if (this.oText.value.length == 0) {
			return;
		}

		var len = keys.s.length,
			oLi = '';
		// 无建议词
		if (len == 0) {
			this.oList.innerHTML = "";
			this.oList.style.display = 'none';
			this.oSearchBox.style.borderRadius = '40px';
			return;
		}
		// 限制长度
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
// 实例化Search
var searchObj = new Search();
var baidu = {
	sug: function(key) {
		searchObj.keydata(key);
	}
}
// 最后再喊一遍我爱樱岛麻衣
console.log("%cda i su ki Sakurajima Mai --2019/12/31", "background-image: linear-gradient(to right, red, blue);color: #fff");
