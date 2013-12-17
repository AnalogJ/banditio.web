var body = document.getElementsByTagName('body')[0];
var bandit_notifier = document.createElement('div');
bandit_notifier.innerHTML = '<img src="http://jsfiddle.net/img/logo.png" onmouseover="togglePos(this);" onclick="togglePos(this);" style="float: right;z-index: 9999999; position: fixed;right: 0;top: 0px;background-color: rgba(0, 0, 0, 0.4);padding: 10px 10px;"/>';
body.appendChild(bandit_notifier);

function togglePos(ele){
    if(ele.style.left=='0px'){
        ele.style.right='0px';
        ele.style.left='inherit';
    }
    else{
        ele.style.left='0px';
        ele.style.right='inherit';
    }

}