'ui';

ui.layout(<vertical>
  <frame id="main"/>
</vertical>);

/* 创建一个 InjectableWebView 实例. */
let webView = newInjectableWebView();
/* 加载指定的 URL, "https://" 也可省略. */
webView.getSettings().setJavaScriptEnabled(true)
webView.getSettings().setAllowFileAccess(true)
webView.getSettings().setAllowContentAccess(true)
// 禁用缩放
webView.getSettings().setTextZoom(100)
webView.getSettings().setBuiltInZoomControls(false)
webView.getSettings().setSupportZoom(false)
webView.getSettings().setDisplayZoomControls(false)

webView.loadUrl('file://'+files.cwd()+'/setting.html');
/* 注入 JavaScript 脚本, 显示 alert 消息框. */

/* 附加视图对象到 id 为 main 的视图上. */
ui.main.addView(webView);