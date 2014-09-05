MobileImgViewer
===============
A smooth picture viewer library for mobile web development, which has the same experience with native APPs.           

一个流畅的图片查看库，用于移动web开发。其拥有与本地应用相同的体验。

###Demo 栗子

[Demo](http://littendomo.sinaapp.com/mobileImgviewer/example.html)

![Demo](http://littendomo.sinaapp.com/mobileImgviewer/demo.gif)      

###Usage 使用

####1、Basic 基础

```js
/* @param ctn {Dom} a Dom that contains imgs               
 */

new MobileImgViewer({
	ctn: document.getElementById('ctn')
});
```

####2、Advanced 进阶

```js
/* @param ctn {Dom} a Dom that contains imgs               
 * @param backBtn {String} wordings on the back button
 * @param menu {Array} menus on the upper right corner
 * @param menu>btn {String} the text on the menu buttons
 * @param menu>callback {Function} callback of the menu buttons
 */

new MobileImgViewer({
	ctn: document.getElementById('ctn'),
	backBtn: "查看图片",
	menu: [{
		btn: "btn1",
		callback: function(event){
			alert("you touch btn1");
		}
	},{
		btn: "btn2",
		callback: function(event){
			alert("you touch btn2");
		}
	},{
		btn: "btn3",
		callback: function(event){
			lert("you touch btn3");
		}
	}]
});
```