<style lang="scss" scoped>
.c {
    height: 100%;

    .m {
        display: flex;
        width: 100%;
        height: 100%;
        background: rgb(255, 255, 255);

        .m1 {
            margin: auto;
            width: 800px;

            ::v-deep .ivu-upload .ivu-upload-drag {
                border: none;
            }
        }
    }

    .n {
        width: 100%;
        height: 100%;

        .n1 {
            display: flex;
            justify-content: space-between;

            ::v-deep .ivu-upload {
                border: none;
                height: 32px;
            }
        }

        .n2 {
            margin-top: 10px;

            .ivu-scroll-wrapper {
                ::v-deep .ivu-scroll-container {
                    height: 280px !important;
                    // overflow-x: hidden;
                    // overflow-y: hidden;
                }
            }

            ::v-deep .el-alert__content {
                text-align: left;
                float: left;
            }

            ::v-deep .el-alert {
                border-radius: 0;
            }

            ::v-deep .ivu-progress {
                width: 50% !important;
                //width:400px;
            }

            ::v-deep .ivu-list-item {
                padding: 14px 0;
            }

            .file-item {
                display: flex;
                text-align: left;
            }

            .file-item:hover {
                background-color: rgb(238 238 238 / 31%);
            }

            .circle {
                width: 100px;
                height: 100px;
                border: 5px dashed #19be6b;
                border-radius: 50%;
                text-align: center;

                .text {
                    font-size: 16px;
                    font-weight: bold;
                    margin-top: 30px;
                }
            }

            .result {
                font-size: 14px;
                text-align: center;
                margin-top: 10px;
            }
        }
    }
}
</style>

<template>
<div class="c">
    <div v-if="fileList.length==0" class="m">
        <div class="m1">
            <Upload multiple type="drag" action="" :before-upload="beforeSendFileToOCR" accept=".apk">
                <div style="padding: 20px 0">
                    <img height="73" width="58" src="@/assets/images/i1.png" alt="恶意APK检测" />
                    <div style="text-align: center">
                        <Button style="display: inline-block;" icon="ios-cloud-upload-outline">添加文件</Button>
                    </div>
                </div>
            </Upload>
        </div>
    </div>
    <div v-else class="n">
        <Affix>
            <div>
                <div class="n1">
                    <Upload multiple type="drag" action="" :before-upload="beforeSendFileToOCR" accept=".apk">
                        <div style="padding:0;">
                            <div style="text-align:center;display: flex;">
                                <img style="margin-right:5px;height:30px;width:24px;" height="30" width="24" src="@/assets/images/i1.png" alt="恶意APK检测" />
                                <Button type="primary" style="display:inline-block;" icon="ios-cloud-upload-outline">添加文件</Button>
                            </div>
                        </div>
                    </Upload>
                    <Button @click="removeAllTasks" style="display:inline-block;" icon="ios-trash-outline">清空列表</Button>
                </div>
            </div>
        </Affix>
        <div class="n2">
            <List>
                <ListItem style="cursor:pointer;" class="file-item" v-for="(ocrfile,index) in fileList" :key="index">
                    <img v-show="(ocrfile.id+3)%3==0" style="margin-left:10px;margin-right:5px;height:15px;width:12px;" height="15" width="12" src="@/assets/images/i2.png" alt="恶意APK检测" />
                    <img v-show="(ocrfile.id+3)%3==1" style="margin-left:10px;margin-right:5px;height:15px;width:12px;" height="15" width="12" src="@/assets/images/i3.png" alt="恶意APK检测" />
                    <img v-show="(ocrfile.id+3)%3==2" style="margin-left:10px;margin-right:5px;height:15px;width:12px;" height="15" width="12" src="@/assets/images/i4.png" alt="恶意APK检测" />
                    <span style="color:#808695;width:150px;overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
                        {{ocrfile.file.name}}
                    </span>
                    <Progress v-show="ocrfile.status==1 || ocrfile.status==2 || ocrfile.status==0" :percent="(Number(ocrfile.progress)>100?100:Number(ocrfile.progress))" :stroke-width="5" status="active" />
                    <Progress v-show="!(ocrfile.status==1 || ocrfile.status==2 || ocrfile.status==0)" :percent="99" :stroke-width="5" status="wrong" />
                    <div style="margin-left:10px;">
                        <div v-if="ocrfile.status==1||ocrfile.status=='1'">
                            <el-button type="text" style="border:none;" size="small" icon="el-icon-loading">{{ ocrfile.desciption_progress }}</el-button>
                            <el-button @click="cancelCurrentTask(index)" type="text" style="border:none;" size="small" icon="el-icon-delete">终止</el-button>
                        </div>
                        <div v-else-if="ocrfile.status==2||ocrfile.status=='2'">
                            <el-button v-if="ocrfile.label.indexOf('BENIGN')!=-1" @click="openPDF(ocrfile.file.path)" type="text" :style="{'border':'none','color':'#2ba52b'}" size="small" icon="el-icon-document">{{ocrfile.label}}</el-button>
                            <el-button v-else @click="openPDF(ocrfile.file.path)" type="text" :style="{'border':'none','color':'red'}" size="small" icon="el-icon-document">{{ocrfile.label}}</el-button>
                            <el-button @click="openFolder(ocrfile.file.path)" type="text" style="border:none;" size="small" icon="el-icon-folder-opened">文件夹</el-button>
                            <el-button @click="cancelTask(index)" type="text" style="border:none;" size="small" icon="el-icon-delete">删除</el-button>
                        </div>
                        <div v-else-if="ocrfile.status==0||ocrfile.status=='0'">
                            <el-button type="text" style="border:none;" size="small" icon="el-icon-video-play">等待转换</el-button>
                            <el-button @click="cancelTask(index)" type="text" style="border:none;" size="small" icon="el-icon-delete">取消</el-button>
                        </div>
                        <div @click="cancelTask(index)" v-else-if="ocrfile.status==-1||ocrfile.status=='-1'">
                            <el-button type="text" style="border:none;" size="small" icon="el-icon-circle-close" status="exception">PDF存在问题</el-button>
                        </div>

                        <!-- 
                            ok = 2
                            bad_args = 3
                            input_file = 4
                            missing_dependency = 5
                            invalid_output_pdf = 6
                            file_access_error = 7
                            already_done_ocr = 8
                            child_process_error = 9
                            encrypted_pdf = 10
                            invalid_config = 11
                            pdfa_conversion_failed = 12
                            other_error = 17
                            ctrl_c = 133
                         -->
                        <div @click="cancelTask(index)" v-else-if="ocrfile.status==3||ocrfile.status=='3'">
                            <el-button type="text" style="border:none;" size="small" icon="el-icon-circle-close">参数设置错误</el-button>
                        </div>
                        <div @click="cancelTask(index)" v-else-if="ocrfile.status==4||ocrfile.status=='4'">
                            <el-button type="text" style="border:none;" size="small" icon="el-icon-circle-close">文件错误</el-button>
                        </div>
                        <div @click="cancelTask(index)" v-else-if="ocrfile.status==5||ocrfile.status=='5'">
                            <el-button type="text" style="border:none;" size="small" icon="el-icon-circle-close">安装错误</el-button>
                        </div>
                        <div @click="cancelTask(index)" v-else-if="ocrfile.status==6||ocrfile.status=='6'">
                            <el-button type="text" style="border:none;" size="small" icon="el-icon-circle-close">输出路径错误</el-button>
                        </div>
                        <div @click="cancelTask(index)" v-else-if="ocrfile.status==7||ocrfile.status=='7'">
                            <el-button type="text" style="border:none;" size="small" icon="el-icon-circle-close">文件访问错误</el-button>
                        </div>
                        <div @click="cancelTask(index)" v-else-if="ocrfile.status==8||ocrfile.status=='8'">
                            <el-button type="text" style="border:none;" size="small" icon="el-icon-circle-close">已经OCR</el-button>
                        </div>
                        <div @click="cancelTask(index)" v-else-if="ocrfile.status==9||ocrfile.status=='9'">
                            <el-button type="text" style="border:none;" size="small" icon="el-icon-circle-close">子进程错误</el-button>
                        </div>
                        <div @click="cancelTask(index)" v-else-if="ocrfile.status==10||ocrfile.status=='10'">
                            <el-button type="text" style="border:none;" size="small" icon="el-icon-circle-close">加密文档错误</el-button>
                        </div>
                        <div @click="cancelTask(index)" v-else-if="ocrfile.status==11||ocrfile.status=='11'">
                            <el-button type="text" style="border:none;" size="small" icon="el-icon-circle-close">参数错误</el-button>
                        </div>
                        <div @click="cancelTask(index)" v-else-if="ocrfile.status==12||ocrfile.status=='12'">
                            <el-button type="text" style="border:none;" size="small" icon="el-icon-circle-close">PDF/A转换错误</el-button>
                        </div>
                        <div @click="cancelTask(index)" v-else-if="ocrfile.status==17||ocrfile.status=='17'">
                            <el-button type="text" style="border:none;" size="small" icon="el-icon-circle-close">未知错误</el-button>
                        </div>
                        <div @click="cancelTask(index)" v-else-if="ocrfile.status==133||ocrfile.status=='133'">
                            <el-button type="text" style="border:none;" size="small" icon="el-icon-circle-close">强制退出</el-button>
                        </div>
                    </div>
                </ListItem>
            </List>

            <transition name="el-zoom-in-top">
            <div v-show="!busy && finishCheck && checkResult">
                <div style="display: flex;margin-left: 20px;letter-spacing: 2px;">
                    <div style="display: block;margin:auto 20px;">
                        <div class="circle" :style="{'border':checkResult=='良性'?'5px dashed #19be6b':'5px dashed red'}">
                            <div class="text">
                                <Icon :style="{'color':checkResult=='良性'?'aquamarine':'red'}" size="16" type="md-checkbox" />
                                <span :style="{'color':checkResult=='良性'?'#19be6b':'red','font-size':'16px'}">{{ checkResult }}</span>
                            </div>
                        </div>
                        <div class="result" :style="{'color':checkResult=='良性'?'':'red'}">检测结果</div>
                    </div>
                    <div style="display: block;margin:auto 20px;width:700px;margin-right: 0;">
                        <el-row style="height: 50px;">
                            <el-col style="height:100%;text-align: left;background-color: antiquewhite;" :span="24">
                                <span style="margin-left: 20px; color: cadetblue; line-height: 50px; font-size: 16px;">分析结果</span>
                            </el-col>
                        </el-row>
                        <el-row style="height: 45px;">
                            <el-col  style="line-height: 50px; font-size: 16px;height:100%;text-align: left;background-color: rgb(255, 255, 255);border: 1px solid antiquewhite;" :span="24">
                                <span style="margin-left: 20px; color: rgb(86, 90, 90); line-height: 50px; font-size: 16px;">采用</span>
                                <span style="margin: auto 4px; font-family: 'Times New Roman', Times, serif;">NeuralNetFastAI</span>
                                <span>算法分析结果: 该软件是</span>
                                <span  :style="{'color':checkResult=='良性'?'#19be6b':'red'}">{{checkResult}}</span>
                                <span style="line-height: 50px; font-size: 16px;">软件。</span>
                            </el-col>

                            <el-col  style="line-height: 50px; font-size: 12px;height:100%;text-align: left;background-color: rgb(255, 255, 255);border: 1px solid antiquewhite;" :span="24">
                                <span style="margin-left: 20px; color: rgb(143 152 152); line-height: 50px; font-size: 16px;">预测概率：</span><span style="font-family: 'Times New Roman', Times, serif;">{{resultDescription}}</span>
                            </el-col>

                        </el-row>
                    </div>
                  
                </div>
            </div>
            </transition>

            <div style="margin-top: 10px;">
                <Scroll>
                    <el-alert v-for="(log, index) in logs" :key="index" :title="log.message" :type="log.logType" :closable="false" :show-icon="false" :center="false" :effect="log.logEffect"></el-alert>
                </Scroll>

            </div>
        </div>
    </div>
</div>
</template>

<script>
import {
    stop_file_ocr
} from "@/api/api.js";

import {

} from "@/utils/other.js";

import setPromiseInterval, {
    clearPromiseInterval
} from 'set-promise-interval';

const ipcRenderer = window.require('electron').ipcRenderer;
export default {
    name: "Task",
    components: {

    },
    data() {
        return {
            currentTaskIndex: 0,
            fileMaxId: 0,
            fileList: [],
            taskInterval: null,
            taskIntervalWorking: false,
            busy: false,
            statusInterval: null,
            loading: null,
            logs: [],

            checkResult:null,
            resultProb:0.65,
            finishCheck:false,
            resultDescription:null
        };
    },
    metaInfo() {
        return {
            title: "BIT910恶意APK检测系统"
        };
    },
    mounted() {
        var that = this;
        that.$Message.config({
            top: 80,
            duration: 3
        });
        that.fileList = that.$global.fileList;
        if (that.taskInterval) {
            clearPromiseInterval(that.taskInterval);
        }
        if (!that.taskIntervalWorking) {
            that.taskInterval = setPromiseInterval(async () => {
                {
                    that.taskIntervalWorking = true;
                    if (!this.busy) {
                        that.fileList.forEach(async ocrfile => {
                            if (this.busy) {
                                return false;
                            } else {
                                if (ocrfile.status == 0) {
                                    that.currentTaskIndex = ocrfile.id;
                                    that.sendFileToOCR(ocrfile);
                                }
                            }
                        })
                    }
                }
            }, 1000)
        }
        ipcRenderer.on('docker-cmd-stdout', (event, message) => {
            console.log(message);
            if (message.toLowerCase().indexOf("launching flowdroid") != -1) {
                that.fileList[that.currentTaskIndex].progress = parseInt(5);
                that.fileList[that.currentTaskIndex].desciption_progress = "Launching FlowDroid";
            } else if (message.toLowerCase().indexOf("processing flowdroid") != -1) {
                that.fileList[that.currentTaskIndex].progress = parseInt(10);
                that.fileList[that.currentTaskIndex].desciption_progress = "Processing FlowDroid";
            } else if (message.toLowerCase().indexOf("execute features") != -1) {
                that.fileList[that.currentTaskIndex].progress = parseInt(20);
                that.fileList[that.currentTaskIndex].desciption_progress = "Execute Features";
            } else if (message.toLowerCase().indexOf("predict result:") != -1) {
                const startIndex = message.lastIndexOf(":") + 1; // 获取最后一个冒号后的索引
                const result = message.substring(startIndex); // 提取从 startIndex 开始到字符串的末尾的部分
                console.log(result); // 输出 "benign"
                that.fileList[that.currentTaskIndex].label = result.toUpperCase();
                if( result.toUpperCase()=='SMSmalware'.toUpperCase()){
                    that.checkResult = '恶意';
                }else if( result.toUpperCase()=='adware'.toUpperCase()){
                    that.checkResult = '恶意';
                }
                else if( result.toUpperCase().trim()=='benign'.toUpperCase()){
                    that.checkResult = '良性';
                }
                else{
                    that.checkResult = '恶意';
                }
                that.busy = false;
                that.finishCheck = true;

                if (message.toLowerCase().indexOf("prob result:") != -1) {
                const startIndex2 = message.lastIndexOf("Prob result:") + 12; // 获取最后一个冒号后的索引
                const endIndex2 = message.lastIndexOf("Predict result:"); // 获取最后一个冒号后的索引
                const result2 = message.substring(startIndex2,endIndex2); // 提取从 startIndex 开始到字符串的末尾的部分
                console.log(result2); // 输出 "benign"
                that.resultDescription = result2;
            }
            }
            let log = {};
            log.message = (new Date()).toLocaleString() + " " + message;
            log.logType = "info";
            log.logEffect = "light";
            this.logs.unshift(log);
        })
        ipcRenderer.on('docker-cmd-stderr', (event, message) => {
            let log = {};
            log.message = (new Date()).toLocaleString() + " " + message;
            log.logType = "error";
            log.logEffect = "light";
            this.logs.unshift(log);
        })
        ipcRenderer.on('docker-cmd-close', (event, message) => {
            console.log('close message: ' + message);
            let log = {};
            if (message == "100" || message == 100) {
                log.message = (new Date()).toLocaleString() + " " + "Succesfully::Exit code is " + message + " Machine-Learning test Succesfully."
                log.logType = "success";
                that.fileList[that.currentTaskIndex].progress = parseInt(100);
                that.fileList[that.currentTaskIndex].desciption_progress = "";
                that.busy = false;
                that.finishCheck = true;
                that.fileList[that.currentTaskIndex].status = 2;
                clearPromiseInterval(that.statusInterval);
                return;
            } else if (message == "1" || message == 1) {
                log.message = (new Date()).toLocaleString() + " " + "Error::Exit code is " + message + ", Please see bottom log for detail."
                log.logType = "error";
            } else {
                log.message = (new Date()).toLocaleString() + " " + "Succesfully::Exit code is " + message + "."
                log.logType = "success";
            }
            log.logEffect = "light";
            this.logs.unshift(log);
        })
    },
    destroyed() {

    },
    methods: {
        // 当前比较的是文件名称,正确的做法是比较文件路径
        checkFileExsits(fileList, file) {
            if (fileList == null) return false;
            for (let i = 0; i < fileList.length; i++) {
                if (fileList[i].file.name != undefined && fileList[i].file.name != null && file.name != undefined && file.name != null && fileList[i].file.name == file.name) {
                    return true;
                }
            }
            return false;
        },
        sendFileToOCR(ocrfile) {
            var that = this;

            this.busy = false;
            that.logs.splice(0);
            that.finishCheck = false;
            that.checkResult=null;


            console.log(that);
            that.busy = true;
            ocrfile.status = 1;
            ocrfile.desciption_progress = "扫描内容中";
            that.logs = [];

            // 1.将文件复制到工作目录
            console.log("ocrfile: %o", ocrfile);
            that.copyAPKFileToScanDirectory(ocrfile.file.path);
            // 2.使用CMD命令执行静态APK文件分析
            that.extractAPKFeature();
            // 3.读取CMD命令的日志文件并显示
            // 4.获取APK的特征矩阵
            that.judgeAPKWithMachineLearning();
            // 5.调用机器学习进行判断是否为恶意APK或者APK类型
            // 6.显示判断结果
        },
        // 文字提示中PDF名字应该换个颜色
        beforeSendFileToOCR(file) {
            var that = this;
            let ocrfile = {};
            if (file != null && file != undefined) {
                ocrfile.status = 0;
                ocrfile.file = file;
            } else {
                ocrfile.status = -1;
            }
            if (that.checkFileExsits(that.$global.fileList, ocrfile.file)) {
                that.$Message.warning({
                    content: "APK " + ocrfile.file.name + " 已经被添加了哦"
                })
                return false;
            }
            ocrfile.id = that.fileMaxId;
            that.fileMaxId += 1;
            that.$set(ocrfile, 'progress', 0);
            that.$global.fileList.push(ocrfile);
            return false;
        },
        openPDF(file) {
            console.log(file);
            ipcRenderer.send('openFile', file);
        },
        openFolder(file) {
            ipcRenderer.send('openFolder', file);
        },
        cancelTask(index) {
            var that = this;
            that.$global.fileList.splice(index, 1);
        },
        cancelCurrentTask(index) {
            var that = this;
            this.busy = false;
            let requestData = {
                "uid": that.$global.fileList[index].uid
            }
            stop_file_ocr(requestData);
            that.$global.fileList.splice(index, 1);
        },
        removeAllTasks() {
            var that = this;
            this.busy = false;
            that.$global.fileList.splice(0);
            that.logs.splice(0);
            that.finishCheck = false;
            that.checkResult=null;
            return;
        },
        // 2023/10/10 添加恶意APK的相关函数
        copyAPKFileToScanDirectory(apkFilePath) {
            ipcRenderer.sendSync('copyAPKFileToScanDirectory', apkFilePath);
        },
        extractAPKFeature() {
            ipcRenderer.sendSync('extractAPKFeature');
        },
        judgeAPKWithMachineLearning() {
            ipcRenderer.sendSync('judgeAPKWithMachineLearning');
        }
    },
};
</script>
