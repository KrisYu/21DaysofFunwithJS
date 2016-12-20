###Day 1： Mac OSX Dock Effect

参考文章：

<http://cssstars.com/mac-os-dock-menu-css3/>

<http://www.girliemac.com/blog/2010/06/02/simulating-macos-dock-like-menu-with-css3/>

复习一下CSS

1. html本身很简单 - 列表
2. 先加dock-container： 放在页面地步，居中，给一个background，再圆角处理
3. 把list的bullet去掉，display变成in-block,隐藏span的文字，雏形就出来了
4. 给img加box-reflect效果
5. hover scale 再给prev加一个scale 
6. hover显示文字


做的是比较简单的，没有做到像第二篇文章一样把前后给scale。不过纯css已经能达到这样的效果已经很满意了。css只能支持prev，无法支持next?需要next要用js.



