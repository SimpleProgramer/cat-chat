$(function(){
    var socket;

    function imMessage(body, user, pwd,type) {

        var imMessage = {"body":body,"accounts":user,"password":pwd,"type":type,"timestamp":new Date().getTime()};
        return imMessage;
    }
    $(".myapp-login-form-submit").bind("click",function () {
        login();
    });
    function login() {
        var account = $(".account").val();
        var password = $(".password").val();
        alert(account+ ":" + password);
        var accounts  = new Array();
        accounts[0] = account;
        var immsg = imMessage("", accounts, password, 1);
        connect(immsg);//登陆发起链接
        console.log("???");
    }
    function send(immsg) {
        try {
            websocket.send(JSON.stringify(immsg));
        } catch (ex) {
            console.log(ex);
        }
    }

    function saveJson(jsonE) {
        jsonEse = {};
        jsonEse = JSON.stringify(jsonE);
        sessionStorage.socket = jsonEse;
        //  sessionStorage.removeItem('jsonEsesession');
    }

    function connect(immsg) {
        var wsurl = 'ws://127.0.0.1:8080/websocket';
        var i = 0;
        if (window.WebSocket) {
            websocket = new WebSocket(wsurl);
            //连接建立
            websocket.onopen = function (evevt) {
                console.log("Connected to WebSocket server.");
                var cache = {"sock":websocket};
                console.log(cache);
                saveJson(cache);
                send(immsg);
            }
            //收到消息
            websocket.onmessage = function (event) {
                alert("event.data" + event.data);
                console.log(event.data)
                var msg = JSON.parse(event.data); //解析收到的json消息数据
                var type = msg.type; // 消息类型
                var umsg = msg.body; //消息文本
                var uname = msg.accounts[0]; //发送人
                var code = msg.code;
                i++;
                if (code == 200) {
                    window.parent.document.getElementById("frame").src = "catchat.html";

                    localStorage.setItem("login","1");
                }

                window.location.hash = '#' + i;
            }
            //发生错误
            websocket.onerror = function (event) {
                i++;
                console.log("Connected to WebSocket server error");
                window.location.hash = '#' + i;
            }
            //连接关闭
            websocket.onclose = function (event) {
                i++;
                console.log('websocket Connection Closed. ');
                window.location.hash = '#' + i;
            }
        }
    }
})