# 运行环境

- Windows10或Windows11。

# 安装环境

## 安装Docker

Docker Desktop 是 Docker 在 Windows 10 和 macOS 操作系统上的官方安装方式，这个方法依然属于先在虚拟机中安装 Linux 然后再安装 Docker 的方法。

Docker Desktop 官方下载地址： [https://docs.docker.com/desktop/install/windows-install/](https://docs.docker.com/desktop/install/windows-install/)

**注意：**此方法仅适用于 Windows10 或 Windows11 操作系统专业版、企业版、教育版和部分家庭版！

### 安装 Hyper-V

Hyper-V 是微软开发的虚拟机，类似于 VMWare 或 VirtualBox，仅适用于 Windows 10。这是 Docker Desktop for Windows 所使用的虚拟机。

但是，这个虚拟机一旦启用，QEMU、VirtualBox 或 VMWare Workstation 15 及以下版本将无法使用！如果你必须在电脑上使用其他虚拟机（例如开发 Android 应用必须使用的模拟器），请不要使用 Hyper-V！

### 开启 Hyper-V

![](https://www.runoob.com/wp-content/uploads/2017/12/1513668234-4363-20171206211136409-1609350099.png)

程序和功能

![](https://www.runoob.com/wp-content/uploads/2017/12/1513668234-4368-20171206211345066-1430601107.png)

启用或关闭Windows功能

![](https://www.runoob.com/wp-content/uploads/2017/12/1513668234-9748-20171206211435534-1499766232.png)

选中Hyper-V

![](https://www.runoob.com/wp-content/uploads/2017/12/1513668234-6433-20171206211858191-1177002365.png)

也可以通过命令来启用 Hyper-V ，请右键开始菜单并以管理员身份运行 PowerShell，执行以下命令：

`Enable\-WindowsOptionalFeature \-Online \-FeatureName Microsoft\-Hyper\-V \-All`

### 安装 Docker Desktop for Windows

点击 [Get started with Docker Desktop](https://hub.docker.com/?overlay=onboarding)，并下载 Windows 的版本，如果你还没有登录，会要求注册登录：

![](https://www.runoob.com/wp-content/uploads/2016/05/5AEB69DA-6912-4B08-BE79-293FBE659894.png)

### 运行安装文件

双击下载的 Docker for Windows Installer 安装文件，一路 Next，点击 Finish 完成安装。

![](https://www.runoob.com/wp-content/uploads/2017/12/1513669129-6146-20171206214940331-1428569749.png)

![](https://www.runoob.com/wp-content/uploads/2017/12/1513668903-9668-20171206220321613-1349447293.png)

安装完成后，Docker 会自动启动。通知栏上会出现个小鲸鱼的图标![](https://www.runoob.com/wp-content/uploads/2017/12/1513582421-4552-whale-x-win.png)，这表示 Docker 正在运行。

桌边也会出现三个图标，如下图所示：

我们可以在命令行执行 docker version 来查看版本号，docker run hello-world 来载入测试镜像测试。

如果没启动，你可以在 Windows 搜索 Docker 来启动：

![](https://www.runoob.com/wp-content/uploads/2017/12/1513585082-6751-docker-app-search.png)

启动后，也可以在通知栏上看到小鲸鱼图标：

![](https://www.runoob.com/wp-content/uploads/2017/12/1513585123-3777-whale-taskbar-circle.png)

> 如果启动中遇到因 WSL 2 导致地错误，请安装 [WSL 2](https://docs.microsoft.com/zh-cn/windows/wsl/install-win10)。

安装之后，可以打开 PowerShell 并运行以下命令检测是否运行成功：

`docker run hello\-world`

在成功运行之后应该会出现以下信息：

![](https://www.runoob.com/wp-content/uploads/2016/05/EmkOezweLQVIwA1T__original.png)

* * *

## 使用Docker安装AndroPyTool


Docker容器是为了提供一个快速可靠的AndroPyTool版本而构建的。要在Docker中使用AndroPyTool，你只需要:

- 安装Docker。如果你还没有这样做，请按照上一节Docker安装教程操作。 

- 从Docker hub中拉出容器:
    ```sh
    $ docker pull alexmyg/andropytool
    ```

## 下载安装恶意APK检测客户端

- 下载或拷贝EXE安装包到目标电脑。
  
- 以管理员身份运行安装包，后续会自动进行安装。
  
- 安装完成后打开软件，自动启动环境检测。
  
- <img src="https://caj2pdf-public.gz.bcebos.com/img/apk/%E4%B8%BB%E7%95%8C%E9%9D%A2.png" style="border-radius:5px;border:5px solid #ddd;" width="80%">

* * *
### 环境常见问题
- Docker中AndroPyTool未安装或Docker未运行。
- Docker未安装或未添加到环境变量。

## 选择待检测的APK文件并进行检测

- 检测过程界面示例
<p align="left"><img src="https://caj2pdf-public.gz.bcebos.com/img/apk/%E8%BD%AC%E6%8D%A2%E8%BF%87%E7%A8%8B.png" style="border-radius:5px;border:5px solid #ddd;" width="80%"></p>

- 检测进度为20%示例
<p align="left"><img src="https://caj2pdf-public.gz.bcebos.com/img/apk/%E8%BD%AC%E6%8D%A2%E8%BF%87%E7%A8%8B20%E8%BF%9B%E5%BA%A6.png" style="border-radius:5px;border:5px solid #ddd;" width="80%"></p>

- 检测结果示例
<p align="left"><img src="https://caj2pdf-public.gz.bcebos.com/img/apk/%E8%BD%AC%E6%8D%A2%E7%BB%93%E6%9E%9C%E5%B1%95%E7%A4%BA.png" style="border-radius:5px;border:5px solid #ddd;" width="80%"></p>


- 检测结果日志
<p align="left"><img src="https://caj2pdf-public.gz.bcebos.com/img/apk/%E6%A0%87%E6%B3%A8%E8%A7%A3%E9%87%8A%E8%BD%AC%E6%8D%A2%E6%97%A5%E5%BF%97.png" style="border-radius:5px;border:5px solid #ddd;" width="80%"></p>

- 检测结果预测概率
<p align="left"><img src="https://caj2pdf-public.gz.bcebos.com/img/apk/%E6%A0%87%E6%B3%A8%E8%A7%A3%E9%87%8A%E8%BD%AC%E6%8D%A2%E6%A6%82%E7%8E%87.png" style="border-radius:5px;border:5px solid #ddd;" width="80%"></p>

- 检测结果判别类别
<p align="left"><img src="https://caj2pdf-public.gz.bcebos.com/img/apk/%E6%A0%87%E6%B3%A8%E8%A7%A3%E9%87%8A%E8%BD%AC%E6%8D%A2%E7%BB%93%E6%9E%9C.png" style="border-radius:5px;border:5px solid #ddd;" width="80%"></p>