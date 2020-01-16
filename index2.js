(function() {

    var oSettings = document.getElementById('settings'),
        oAlert = $('.wrap').eq(0),
        adAlert = document.getElementsByClassName('wrap')[1],
        flag = getCookie('supportFlag') || 'false',
        randomNumber = Math.floor(Math.random() * 50),
        close = $('.alert-close');

    var oCollection = document.getElementById('collection');

    (function() {
        var len = Number(getCookie('urlLength'));
        for (var i = 1; i < len + 1; i++) {
            var link = getCookie('collectionUrl' + i);
            oCollection.appendChild(
                createDom("div", {
                    class: "collection-box",
                    style: 'background-image:url(' + link + '/favicon.ico)',
                    hrefUrl: link
                }, [{
                    tag: "i",
                    props: {
                        class: "collection-close",
                        urlnum: i,
                        text: "x"
                    }
                }])
            );
        }
    }());


    function retAlertDom(ele) {
        var ele = ele.parentElement;
        if (ele.getAttribute('class') == 'wrap') {
            return ele;
        } else {
            var temp = retAlertDom(ele);
        }
        return temp;
    }

    function createDom(tag, props, child) {
        var ele = document.createElement(tag);
        var child = child || [];
        for (var prop in props) {
            if (prop == 'text') {
                ele.innerHTML = props[prop];
                continue;
            }
            ele.setAttribute(prop, props[prop]);
        }
        for (var i = 0; i < child.length; i++) {
            ele.appendChild(
                createDom(child[i].tag, child[i].props, child[i].child)
            );
        }
        return ele;
    }
    var arr = [];
    oCollection.onclick = function(e) {
        // 兼容
        var e = e || window.event;
        // 点击目标
        var target = e.target || e.srcElement;
        // 收藏的子元素们
        var son = this.getElementsByTagName('div');
        // 如果点击目标是自己，返回
        if (target == this) return;
        // 如果点击的是关闭
        if (target.getAttribute('urlnum')) {
            /**
             * 删除Cookie
             */
            for (var i = 0; i < Number(getCookie('urlLength')); i++) {
                delCookie('collectionUrl' + (i+1));
            }
            /**
             * 获取被点击的序号，然后根据序号删除元素
             * 重新排列元素的序号，重新排列Cookie链接的序号,还有length 
             */
            var sign = target.getAttribute('urlnum');
            son[sign-1].remove();
            /**设置链接们的个数 */
            setCookie('urlLength',Number(getCookie('urlLength'))-1,1);
            arr.splice(sign-1,1);
            /**
             * 重排DOM里的序号
             */
            for(var i = 0; i < son.length; i++) {
                var iTag = son[i].getElementsByTagName('i')[0];
                iTag.setAttribute('urlnum',i+1);
            }
            /**
             * 重排Cookie里的序号
             */
            for (var i = 0; i < son.length; i++) {
                arr.push(son[i].getAttribute('hrefUrl'));
                setCookie('collectionUrl'+(i+1),arr[i],1);   
            }

        } else {
            // 点击不是关闭，跳转
            var link = target.getAttribute('hrefUrl');
            window.location.href = link;
        }
    }
    /**
     * [showHideSetting description]
     * 展示隐藏的设置
     */
    function showHideSetting() {
        // 展示储存
        var temp = '';
        // 做对比的字符串
        var str = '83657585826574737765776573';
        // 计时器
        var timer;
        
        var maxUrl = 5;
        return function(e) {
            var num = getCookie('urlLength') || 0;
            clearTimeout(timer);
            var e = e || window.event;
            temp += '' + e.which;
            /**
             * 插入设置窗口
             */
            if (temp === str) {
                document.body.appendChild(
                    createDom("div", {
                        class: "wrap"
                    }, [{
                            tag: "div",
                            props: {
                                class: "alert"
                            },
                            child: [{
                                tag: "div",
                                props: {
                                    class: "alert-head"
                                },
                                child: [{
                                    tag: "div",
                                    props: {
                                        class: "alert-close",
                                        id: "removeself"
                                    }
                                }]
                            }, {
                                tag: "div",
                                props: {
                                    class: "alert-body"
                                },
                                child: [{
                                    tag: "div",
                                    props: {
                                        class: "container clearfix"
                                    },
                                    child: [{
                                        tag: "p",
                                        props: {
                                            style: "font-size: 25px; font-weight: bold; padding: 1px; margin: 0;",
                                            text: "高级设置"
                                        }
                                    }, {
                                        tag: "p",
                                        props: {
                                            style: "margin: 0",
                                            text: "这是正在测试的设置，由于人比较懒，所以就弄到了这里，这里可以设置一些链接，但是清除了Cookie后就会消失。添加的链接必须要带http或者https.否则会失效"
                                        }
                                    }, {
                                        tag: "a",
                                        props: {
                                            id: "add-btn",
                                            href: "javascript:;",
                                            text: "添加"
                                        }
                                    }, {
                                        tag: "input",
                                        props: {
                                            id: "add-input",
                                            type: "text"
                                        }
                                    }]
                                }]
                            }]
                        }

                    ])
                )
                temp = '';
                var hideSettingClose = document.getElementById('removeself');
                hideSettingClose.onclick = function() {
                    retAlertDom(this).remove();
                }
                var addBtn = document.getElementById('add-btn');
                var addInput = document.getElementById('add-input');

                addBtn.onclick = function() {
                    if (num > maxUrl - 1) return;
                    Number(num++);
                    setCookie('urlLength',''+num,31);
                    oCollection.appendChild(
                        createDom("div", {
                            class: "collection-box",
                            style: 'background-image:url(' + addInput.value + '/favicon.ico)',
                            hrefUrl: addInput.value
                        }, [{
                            tag: "i",
                            props: {
                                class: "collection-close",
                                urlnum: num,
                                text: "x"
                            }
                        }])
                    );
                    
                    setCookie('collectionUrl' + num, addInput.value, 31);
                    setCookie('urlLength', num, 31);
                }
            }
            /**
             * 如果两秒内没有任何的操作，自动把temp清空
             */
            timer = setTimeout(function() {
                temp = ''
            }, 2000);
        }
    }

    if (randomNumber < 5) {
        adAlert.style.display = 'block';
    }
    if (flag == 'true') {
        $('.support-btn').removeClass('init').removeClass('left').addClass('right').addClass('init2');
        $('.support-btn').css('background', 'rgb(52, 209, 24)');
    } else {
        $('.support-btn').removeClass('init2').removeClass('right').addClass('left').addClass('init');
        $('.support-btn').css('background', '#fff');
    }

    close.click(function() {
        retAlertDom(this).style.display = 'none';
    })

    oSettings.onclick = function() {

        oAlert.css('display', 'block');

        var sb = $('.support-btn'),
            jssb = document.getElementsByClassName('support-btn')[0]; // jq 中的click 有点击两下的问题

        jssb.onclick = function() {
            sb.removeClass('init').removeClass('init2')

            if (flag == 'false') {
                // 向右移动
                sb.removeClass('init').removeClass('left').addClass('right').addClass('init2');
                sb.css('background', 'rgb(52, 209, 24)');
                flag = 'true';
                setCookie('supportFlag', flag, 62);
            } else if (flag == 'true') {
                // 向左移动
                sb.removeClass('init2').removeClass('right').addClass('left').addClass('init');
                sb.css('background', '#fff');
                flag = 'false';
                setCookie('supportFlag', flag, 62);
            }
        }

        sb.removeClass('right').removeClass('left');
    }

    var demo = showHideSetting();
    document.onkeydown = function(e) {
        var e = e || window.event;
        if ($(e.target).closest(".search-text").length == 0) {
            demo(e);
        }
    };
})();