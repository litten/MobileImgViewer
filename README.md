MobileImgViewer
===============
A smooth picture viewer library for mobile web development, which has the same experience with native APPs.           

一个流畅的图片查看库，用于移动web开发。其拥有与本地应用相同的体验。

###Demo 栗子

[Demo](http://littendomo.sinaapp.com/mobileImgviewer/example.html)

![Demo](http://littendomo.sinaapp.com/mobileImgviewer/demo.gif)      

###Usage 使用

```js
/* @param ctn {Dom} a Dom that contains imgs               
 * @param backBtn {String} wordings on the back button
 */

new MobileImgViewer({
	ctn: document.getElementById('ctn'),
	backBtn: "查看图片"
});
```