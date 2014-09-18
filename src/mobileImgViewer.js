(function(root, factory) {
    if(typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        root['MobileImgViewer'] = factory();
    }
}(this, function() {
    var _isShow = false;
    //构造函数
    function MobileImgViewer(opts) {
        //构造函数需要的参数
        this.wrap = opts.dom;
        this.ctn = opts.ctn;
        this.backBtn = opts.backBtn || "";
        this.menu = opts.menu || [];
        //构造四步
        this.init();
        this.combine();
        this.renderDOM();
        this.bindDOM();
    }

    //menu相关
    var Menu = {
        show: function() {
            var $menu = document.getElementsByClassName("viewer-menu")[0];
            $menu.className = "viewer-menu";
        },
        hide: function() {
            var $menu = document.getElementsByClassName("viewer-menu")[0];
            $menu.className = "viewer-menu hide";
        }
    }
    //第一步 -- 初始化
    MobileImgViewer.prototype.init = function() {
        //设定窗口比率
        this.radio = document.body.scrollHeight / document.body.scrollWidth;
        //设定一页的宽度
        this.scaleW = document.body.scrollWidth;
        //设定初始的索引值
        this.idx = 0;
    };
    //第一步 -- 组合
    MobileImgViewer.prototype.combine = function() {
        var self = this;
        var list = [];
        var targetArr = self.ctn.getElementsByClassName("swipe-target");
        for(var i = 0, len = targetArr.length; i < len; i++) {
            list.push({
                dom: targetArr[i],
                img: targetArr[i].src,
                title: targetArr[i].title,
                width: targetArr[i].width,
                height: targetArr[i].height
            });

            //闭包绑定
            (function(i) {
                targetArr[i].onclick = function() {
                    self.show(list[i], i);
                }
            })(i);
        }
        self.list = list;
    }
    //第三步 -- 根据数据渲染DOM
    MobileImgViewer.prototype.renderDOM = function() {
        var data = this.list;
        var len = data.length;
        //生成节点
        var backWording = this.backBtn.toString() || "";
        var $viewer = document.createElement("div");
        $viewer.id = "viewer";
        $viewer.className = "hide";
        $viewer.innerHTML = '<div id="viewer-box">\
			<div class="viewer-head">\
				<div class="viewer-back"><i><</i><span class="viewer-back-wording">' + backWording + '</span><span class="viewer-count">[1/6]</span></div>\
				<div class="viewer-more">...</div>\
			</div>\
		</div>';

        //主要图片节点
        document.getElementsByTagName("body")[0].appendChild($viewer);
        var wrap = document.getElementById("viewer-box");
        this.wrap = wrap;
        this.outer = document.createElement('ul');
        this.outer.className = "viewer-list";

        for(var i = 0; i < len; i++) {
            var li = document.createElement('li');
            var item = data[i];
            li.style.width = document.body.scrollWidth + 'px';
            li.style.height = (document.body.scrollHeight - 45) + 'px';
            li.style.webkitTransform = 'translate3d(' + i * this.scaleW + 'px, 0, 0)';
            if(item) {
                //根据窗口的比例与图片的比例来确定
                //图片是根据宽度来等比缩放还是根据高度来等比缩放
                if(item['height'] / item['width'] > this.radio) {
                    li.innerHTML = '<img height="' + document.body.scrollHeight + '" src="' + item['img'] + '">';
                } else {
                    li.innerHTML = '<img width="' + document.body.scrollWidth + '" src="' + item['img'] + '">';
                }
            }
            this.outer.appendChild(li);
        }

        //菜单节点
        if(this.menu.length != 0) {
            var $menu = document.createElement('ul');
            $menu.className = "viewer-menu hide";
            for(var i = 0, len = this.menu.length; i < len; i++) {
                (function(n, menu) {
                    var em = menu[n];
                    var $li = document.createElement('li');
                    $li.textContent = em["btn"];
                    $li.addEventListener("touchend", function(e) {
                        console.log(e);
                        em["callback"](e);
                        $menu.className = "viewer-menu hide";
                    });
                    $menu.appendChild($li);
                })(i, this.menu);
            }
            wrap.appendChild($menu);
        }
        //UL的宽度和画布宽度一致
        this.outer.style.width = this.scaleW + 'px';
        //console.log(wrap.getElementsByClassName("viewer-head")[0]);
        wrap.style.height = document.body.scrollHeight + 'px';
        wrap.appendChild(this.outer);
    };

    MobileImgViewer.prototype.show = function(target, idx) {
        var self = this;
        document.getElementById("viewer").className = "";
        setTimeout(function() {
            self.wrap.className = "anm-swipe";
        }, 0);
        _isShow = true;

        //隐藏不必要的节点
        var lis = self.outer.getElementsByTagName('li');
        for(var i = 0; i < lis.length; i++) {
            if(i == idx) {
                lis[i].className = "";
            } else {
                lis[i].className = "hide";
            }
        }

        self.goIndex(idx);
        self.setIndex(idx);
    }

    MobileImgViewer.prototype.hide = function() {
        var self = this;
        document.getElementById("viewer-box").className = "";
        _isShow = false;

        //隐藏不必要的节点
        var lis = self.outer.getElementsByTagName('li');
        for(var i = 0; i < lis.length; i++) {
            if(i == self.idx) {
                lis[i].className = "";
            } else {
                lis[i].className = "hide";
            }
        }
    }

    //改变图片张数文字
    MobileImgViewer.prototype.setIndex = function(n) {
        var self = this;
        self.wrap.getElementsByClassName("viewer-count")[0].innerHTML = "[" + (n + 1) + "/" + self.list.length + "]"
    }

    //设置展示的图片，有动画
    MobileImgViewer.prototype.goIndex = function(n) {
        var idx = this.idx;
        var lis = this.outer.getElementsByTagName('li');
        var len = this.list.length;
        var cidx;

        //如果传数字 2,3 之类可以使得直接滑动到该索引
        if(typeof n == 'number') {
            cidx = n;
            //如果是传字符则为索引的变化
        } else if(typeof n == 'string') {
            cidx = idx + n * 1;
        }

        //当索引右超出
        if(cidx > len - 1) {
            cidx = len - 1;
            //当索引左超出
        } else if(cidx < 0) {
            cidx = 0;
        }

        //保留当前索引值
        this.idx = cidx;


        //改变过渡的方式，从无动画变为有动画
        lis[cidx].style.webkitTransition = '-webkit-transform 0.2s ease-out';
        lis[cidx - 1] && (lis[cidx - 1].style.webkitTransition = '-webkit-transform 0.2s ease-out');
        lis[cidx + 1] && (lis[cidx + 1].style.webkitTransition = '-webkit-transform 0.2s ease-out');

        //改变动画后所应该的位移值
        lis[cidx].style.webkitTransform = 'translate3d(0, 0, 0)';
        lis[cidx - 1] && (lis[cidx - 1].style.webkitTransform = 'translate3d(-' + this.scaleW + 'px, 0, 0)');
        lis[cidx + 1] && (lis[cidx + 1].style.webkitTransform = 'translate3d(' + this.scaleW + 'px, 0, 0)');

    };

    //第四步 -- 绑定 DOM 事件
    MobileImgViewer.prototype.bindDOM = function() {
        var self = this;
        var scaleW = self.scaleW;
        var outer = self.outer;
        var len = self.list.length;

        //手指按下的处理事件
        var startHandler = function(evt) {

            //记录刚刚开始按下的时间
            self.startTime = new Date() * 1;

            //记录手指按下的坐标
            self.startX = evt.touches[0].pageX;

            //清除偏移量
            self.offsetX = 0;

            //事件对象
            var target = evt.target;
            while(target.nodeName != 'LI' && target.nodeName != 'BODY') {
                target = target.parentNode;
            }
            self.target = target;

            //隐藏不必要的节点，但要开始展示左右节点
            var lis = self.outer.getElementsByTagName('li');
            var cidx = self.idx;
            for(var i = 0; i < lis.length; i++) {
                if(i == cidx - 1 || i == cidx || i == cidx + 1) {
                    lis[i].className = "";
                } else {
                    lis[i].className = "hide";
                }
            }

            //隐藏菜单
            Menu.hide();
        };

        //手指移动的处理事件
        var moveHandler = function(evt) {
            //兼容chrome android，阻止浏览器默认行为
            evt.preventDefault();

            //计算手指的偏移量
            self.offsetX = evt.targetTouches[0].pageX - self.startX;

            var lis = outer.getElementsByTagName('li');
            //起始索引
            var i = self.idx - 1;
            //结束索引
            var m = i + 3;

            //最小化改变DOM属性
            for(i; i < m; i++) {
                lis[i] && (lis[i].style.webkitTransition = '-webkit-transform 0s ease-out');
                lis[i] && (lis[i].style.webkitTransform = 'translate3d(' + ((i - self.idx) * self.scaleW + self.offsetX) + 'px, 0, 0)');
            }
        };

        //手指抬起的处理事件
        var endHandler = function(evt) {
            evt.preventDefault();

            //边界就翻页值
            var boundary = scaleW / 6;

            //手指抬起的时间值
            var endTime = new Date() * 1;

            //所有列表项
            var lis = outer.getElementsByTagName('li');

            //当手指移动时间超过300ms 的时候，按位移算
            if(endTime - self.startTime > 300) {
                if(self.offsetX >= boundary) {
                    self.goIndex('-1');
                } else if(self.offsetX < 0 && self.offsetX < -boundary) {
                    self.goIndex('+1');
                } else {
                    self.goIndex('0');
                }
            } else {
                //优化
                //快速移动也能使得翻页
                if(self.offsetX > 50) {
                    self.goIndex('-1');
                } else if(self.offsetX < -50) {
                    self.goIndex('+1');
                } else {
                    self.hide();
                    self.goIndex('0');
                }
            }

            self.setIndex(self.idx);
        };

        //绑定事件
        outer.addEventListener('touchstart', startHandler);
        outer.addEventListener('touchmove', moveHandler);
        outer.addEventListener('touchend', endHandler);

        //滑动隐藏
        document.getElementById("viewer-box").addEventListener("webkitTransitionEnd", function() {

            if(_isShow == false) {
                document.getElementById("viewer").className = "hide";
                _isShow = true;
            } else {
                //console.log(self.idx);
            }

        }, false);

        //点击隐藏
        self.wrap.getElementsByClassName("viewer-back")[0].addEventListener("touchend", function() {
            self.hide();
            Menu.hide();
        }, false);

        //menu按钮点击
        self.wrap.getElementsByClassName("viewer-more")[0].addEventListener("touchend", function() {
            var $menu = self.wrap.getElementsByClassName("viewer-menu")[0];
            if($menu.className.indexOf("hide") >= 0) {
                Menu.show();
            } else {
                Menu.hide();
            }
            //viewer-menu
        }, false);
    };

    return MobileImgViewer;
}))