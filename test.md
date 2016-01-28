&emsp;&emsp;最早Git是在Linux上开发的，很长一段时间内，Git也只能在Linux和Unix系统上跑。不过，慢慢地有人把它移植到了Windows上。现在，Git可以在Linux、Unix、Mac和Windows这几大平台上正常运行了。
&emsp;&emsp;在**Linux**上安装Git
&emsp;&emsp;首先，你可以试着输入git，看看系统有没有安装Git：
    git
&emsp;&emsp;像上面的命令，有很多Linux会友好地告诉你Git没有安装，还会告诉你如何安装Git。
&emsp;&emsp;如果你碰巧用Debian或Ubuntu Linux，通过一条```sudo apt-get install git```就可以直接完成Git的安装，非常简单。如果想查看是否安装成功，通过```git --version```。
&emsp;&emsp;如果是其他Linux版本，可以直接通过源码安装。先从Git官网下载源码，然后解压，依次输入：
    ./config
    make
    udo make install
这几个命令安装就好了。
&emsp;&emsp;安装完成后，还需要最后一步设置，在命令行输入：
    git config --global user.name "zfpx"
    git config --global user.email "zfpx@126.com"
&emsp;&emsp;因为Git是分布式版本控制系统，所以每个机器都必须自报家门：你的名字和Email地址。
&emsp;&emsp;注意```git config```命令的```--global```参数，用了这个参数，表示你这台机器上所有的Git仓库都会使用这个配置，当然也可以对某个仓库指定不同的用户名和Email地址。在此课程中，我们配置的环境中Git已安装好，我们课程提供也是在Linux系统中命令进行操作。