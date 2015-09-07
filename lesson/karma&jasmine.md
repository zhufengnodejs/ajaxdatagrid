#一、Karma的介绍
Karma是一个基于Node.js的JavaScript测试执行过程管理工具（Test Runner）。该工具可用于测试所有主流Web浏览器，也可集成到CI（Continuous integration）工具，也可和其他代码编辑器一起使用。这个测试工具的一个强大特性就是，它可以监控(Watch)文件的变化，然后自行执行，通过console.log显示测试结果。
http://karma-runner.github.io/0.13/intro/installation.html

#二、Jasmine
Jasmine是单元测试框架，本单将介绍用Karma让Jasmine测试自动化完成。Jasmine的介绍，请参考文章：jasmine行为驱动,测试先行

#三、istanbul
是一个单元测试代码覆盖率检查工具，可以很直观地告诉我们，单元测试对代码的控制程度。

#四、 Karma的安装
> mkdir karma
> cd karma
> npm install karma --save-dev
> npm install karma-jasmine karma-chrome-launcher --save-dev
> pm install -g karma-cli
> karma start

#五、 Karma + Jasmine配置
##5.1 初始化karma配置文件karma.conf.js
> karma init my.conf.js
> karma start my.conf.js
> karma start my.conf.js --log-level debug --single-run
##5.2 安装集成包karma-jasmine
npm install karma-jasmine

# 六、 自动化单元测试

