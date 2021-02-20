/**
 * 解决hbuilder打包app之后点击手机返回键直接退出app的
 */
document.addEventListener('plusready', function () {
	var first = null;
	
	// 返回操作
  	plus.key.addEventListener('backbutton', function () {
  	var webview = plus.webview.currentWebview();
    webview.canBack(function (e) {
      var url = window.location.href;
	  if (url.endsWith("#/resetpwd")) {
		  return;
	  } else if (e.canBack && !url.endsWith("#/home") && !url.endsWith("#/tel") && !url.endsWith("#/message") && !url.endsWith("#/my") && !url.endsWith("#/login") && !url.endsWith("#/")) {
        webview.back();
      } else {
        // webview.close() //hide,quit
        // plus.runtime.quit()
        // 首页返回键处理
        // 处理逻辑：2秒内，连续两次按返回键，则退出应用；
        // 首次按键，提示‘再按一次退出应用’
        if (!first) {
          first = new Date().getTime();
          plus.nativeUI.toast('再按一次退出应用');
          setTimeout(function () {
            first = null;
          }, 2000)
        } else {
          if (new Date().getTime() - first < 1500) {
            plus.runtime.quit();
          }
        }
      }
    });
  })
});