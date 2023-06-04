<style lang="scss" scoped>
.index {
    .pc {
        .container {
            -webkit-box-align: start;
            -ms-flex-align: start;
            align-items: flex-start;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            margin: 0px auto;
            padding: 0;
            position: relative;
            width: 100%;
            background: transparent;

            .e {
                min-height: 100vh;
                text-align: left;
            }
        }
    }
}
</style>

<template>
<div class="index">

    <div class="pc">
        <div class="container">
            <el-container>
                <el-aside width="180px">
                    <el-menu router unique-opened default-active="/task" class="e">
                        <el-menu-item index="/task">
                            <i class="el-icon-document"></i>
                            <span slot="title">PDF文字识别</span>
                        </el-menu-item>
                        <el-menu-item index="/setting">
                            <i class="el-icon-set-up"></i>
                            <span slot="title">参数设置</span>
                        </el-menu-item>
                        <el-menu-item index="/sponsor">
                            <i class="el-icon-coffee-cup"></i>
                            <span slot="title">打个赏吧</span>
                        </el-menu-item>
                    </el-menu>
                </el-aside>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </div>
    </div>
</div>
</template>

<script>
const ipcRenderer = window.require('electron').ipcRenderer;
export default {
    name: "OCR",
    components: {

    },
    data() {
        return {

        };
    },
    metaInfo() {
        return {
            title: "凡凡PDF文字识别"
        };
    },
    mounted() {
        let checked = window.sessionStorage.getItem("checkEvironment");
        if (checked == null || checked == undefined) {
            this.loading = this.$loading({
                lock: true,
                text: '正在加载环境',
                spinner: 'el-icon-loading',
                background: 'rgb(255 255 255)'
            });
            this.checkEvironment();
            ipcRenderer.on('checkEvironment', (event, message) => {
                console.log('message: ' + message);
                window.sessionStorage.setItem("checkEvironment", true);
                this.loading.close();
            })
        }
    },
    destroyed() {

    },
    methods: {
        checkEvironment() {
            ipcRenderer.send('checkEvironment', {});
        }
    },
};
</script>
