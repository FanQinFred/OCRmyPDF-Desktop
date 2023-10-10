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
            .ivu-scroll-wrapper{
                ::v-deep .ivu-scroll-container{
                    height:400px !important;
                    // overflow-x: hidden;
                    // overflow-y: hidden;
                }
            }

            ::v-deep .el-alert__content{
                text-align: left;
                float: left;
            }
            ::v-deep .el-alert{
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
                            <el-button @click="openPDF(ocrfile.file.path)" type="text" style="border:none;" size="small" icon="el-icon-document">查看</el-button>
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

            <Scroll>
                <el-alert
                v-for="(log, index) in logs"
                :key="index"
                :title="log.message"
                :type="log.logType"
                :closable="false"
                :show-icon="false"
                :center="false"
                :effect="log.logEffect"
                ></el-alert>
            </Scroll>
           
        </div>
    </div>
</div>
</template>

<script>
import {
    // submit_ocr_task,
    query_file_status,
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
            fileMaxId: 0,
            fileList: [],
            taskInterval: null,
            taskIntervalWorking: false,
            busy: false,
            statusInterval: null,
            loading:null,
            logs: [],
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
                                    that.sendFileToOCR(ocrfile);
                                }
                            }
                        })
                    }
                }
            }, 1000)
        }
        ipcRenderer.on('docker-cmd-stdout', (event, message) => {
            console.log('stdout message: ' + message);
            let log = {};
            log.message = (new Date()).toLocaleString() + " " + message;
            log.logType = "info";
            log.logEffect = "light";
            this.logs.unshift(log);
        })
        ipcRenderer.on('docker-cmd-stderr', (event, message) => {
            console.log('stderr message: ' + message);
            let log = {};
            log.message = (new Date()).toLocaleString() + " " + message;
            log.logType = "error";
            log.logEffect = "light";
            this.logs.unshift(log);
        })
        ipcRenderer.on('docker-cmd-close', (event, message) => {
            console.log('close message: ' + message);
            let log = {};
            if(message=="1"||message==1){
                log.message = (new Date()).toLocaleString() + " " + "Error::Exit code is "+message+", Please see bottom log for detail."
                log.logType = "error";
            }else{
                log.message = (new Date()).toLocaleString() + " " + "Succesfully::Exit code is "+message+"."
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
            console.log(that);
            this.busy = true;
            ocrfile.status = 1;
            ocrfile.desciption_progress = "扫描内容中";
            this.logs=[];
          
            // 1.将文件复制到工作目录
            console.log("ocrfile: %o",ocrfile);
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
        statusListener(id, ocrfile) {
            var that = this;
            let requestData = {
                "uid": id
            }
            if (that.checkFileExsits(that.$global.fileList, ocrfile.file)) {
                query_file_status(requestData).then(qft => {
                    if (qft.status == "0") { //正在处理
                        if (qft.sc == "1") {
                            let sp = qft.sc_progress.replace("%", "");
                            ocrfile.progress = parseInt(parseInt(sp) / 2);
                            ocrfile.desciption_progress = "扫描内容中";
                        } else if (qft.ocr == "1") {
                            let op = qft.ocr_progress.replace("%", "");
                            if (op == 0) {
                                if (parseInt(ocrfile.progress) <= 50) {
                                    ocrfile.progress = 50;
                                }
                                ocrfile.progress = parseInt(ocrfile.progress + 1);
                            } else {
                                ocrfile.progress = parseInt(parseInt(op) / 2 + 50);
                            }
                            ocrfile.desciption_progress = "识别文字中";
                        }
                    } else if (qft.status == "1") { //处理完成
                        ocrfile.progress = 100;
                        this.busy = false;
                        ocrfile.status = 2;
                        clearPromiseInterval(that.statusInterval);
                        return;
                    } else { //没有查询到该任务
                        ocrfile.progress = -1;
                        this.busy = false;
                        ocrfile.status = parseInt(qft.status) + 1;
                        clearPromiseInterval(that.statusInterval);
                        return;
                    }
                });
            }
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
            that.fileList.forEach(ocrfile => {
                if (ocrfile.status == 1) {
                    let requestData = {
                        "uid": ocrfile.uid
                    }
                    stop_file_ocr(requestData);
                }
            })
            that.$global.fileList.splice(0);
            clearPromiseInterval(that.statusInterval);
            return;
        },
        // 2023/10/10 添加恶意APK的相关函数
        copyAPKFileToScanDirectory(apkFilePath){
            ipcRenderer.sendSync('copyAPKFileToScanDirectory', apkFilePath);
        }, 
        extractAPKFeature(){
            ipcRenderer.sendSync('extractAPKFeature');
        },
        judgeAPKWithMachineLearning(){
            ipcRenderer.sendSync('judgeAPKWithMachineLearning');
        }
    },
};
</script>
