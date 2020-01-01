(function() {
    
    var oSettings = document.getElementById('settings'),
        oAlert = $('.wrap').eq(0),
        adAlert = document.getElementsByClassName('wrap')[1],
        flag = getCookie('supportFlag') || 'false',
        sClose = document.getElementById('sClose'),
        randomNumber = Math.floor(Math.random()*50),
        close = $('.alert-close');

    if (randomNumber < 5) {
        adAlert.style.display = 'block';
    }
    if (flag == 'true') {
        $('.support-btn').removeClass('init').removeClass('left').addClass('right').addClass('init2');
        $('.support-btn').css('background', 'rgb(52, 209, 24)');
    }else{
        $('.support-btn').removeClass('init2').removeClass('right').addClass('left').addClass('init');
        $('.support-btn').css('background', '#fff');
    }

    sClose.onclick = function() {
        adAlert.style.display = 'none';
    }
    oSettings.onclick = function() {

        oAlert.css('display', 'block');

        var sb = $('.support-btn'),
            jssb = document.getElementsByClassName('support-btn')[0];   // jq 中的click 有点击两下的问题

        close.click(function() {
            oAlert.css('display', 'none');
        });

        jssb.onclick = function() {
            sb.removeClass('init').removeClass('init2')

            if (flag == 'false') {
                // 向右移动
                sb.removeClass('init').removeClass('left').addClass('right').addClass('init2');
                sb.css('background','rgb(52, 209, 24)');
                flag = 'true';
                setCookie('supportFlag',flag,62);
            }else if(flag == 'true') {
                // 向左移动
                sb.removeClass('init2').removeClass('right').addClass('left').addClass('init');
                sb.css('background', '#fff');
                flag = 'false';
                setCookie('supportFlag',flag,62);
            }
        }

        sb.removeClass('right').removeClass('left');
    }

})();
