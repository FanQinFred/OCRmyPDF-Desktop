<style lang="scss" scoped>
.c {
    height: 100%;
    text-align: left;
}
</style>

<template>
<div class="c">
    <el-form ref="form" :model="setting" label-width="90px">

        <el-form-item label="特征提取">
            <el-checkbox-group @change="changeCheckbox"  v-model="setting.featureType">
                <el-checkbox label="静态特征" name="静态特征"></el-checkbox>
                <el-checkbox label="动态特征" name="动态特征"></el-checkbox>
            </el-checkbox-group>
        </el-form-item>

        <el-form-item label="Docker路径">
            <el-input @change="changeCheckbox"  v-model="setting.modelPath" placeholder="请选择路径" size="small" style="max-width:300px;">
                <i slot="prefix" class="el-input__icon el-icon-s-platform"></i>
            </el-input>        
        </el-form-item>

        <el-form-item label="模型文件">
            <el-input @change="changeCheckbox"  v-model="setting.dockerPath" placeholder="请选择路径" size="small" style="max-width:300px;">
                <i slot="prefix" class="el-input__icon el-icon-s-opportunity"></i>
            </el-input>
        </el-form-item>

    </el-form>
</div>
</template>

<script>
import {

} from "@/api/api.js";

import {

} from "@/utils/other.js";

export default {
    name: "Setting",
    components: {

    },
    data() {
        return {
            setting: {
                featureType: ['静态特征'],
                modelPath: null,
                dockerPath:null
            }
        };
    },
    metaInfo() {
        return {
            title: "参数设置"
        };
    },
    mounted() {
        var that = this;
        const setting = JSON.parse(localStorage.getItem("setting"));
        if(setting!=null && setting!=undefined) that.setting = setting;
    },
    destroyed() {

    },
    methods: {
        changeCheckbox(){
            console.log(JSON.stringify(this.setting));
            localStorage.setItem("setting",JSON.stringify(this.setting));
        }
    },
};
</script>
