<style lang="scss" scoped>
.c {
    height: 100%;
    text-align: left;
}
</style>

<template>
<div class="c">
    <el-form ref="form" :model="setting" label-width="80px">

        <el-form-item label="PDF语言">
            <el-checkbox-group v-model="setting.language">
                <el-checkbox label="中文" name="中文"></el-checkbox>
                <el-checkbox label="English" name="English"></el-checkbox>
            </el-checkbox-group>
        </el-form-item>

        <el-form-item label="CPU数量">
            <el-input-number size="mini" v-model="setting.jobs" :min="1" :max="64" label="CPU数量"></el-input-number>
        </el-form-item>

        <el-form-item label="输出格式">
            <el-select size="mini" v-model="setting.output_type" placeholder="请选择">
                <el-option label="PDF" value="PDF"></el-option>
                <el-option label="PDF/A" value="PDF/A"></el-option>
            </el-select>
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
                language: ['中文', 'English'],
                jobs: 1,
                output_type:'PDF'
            }
        };
    },
    metaInfo() {
        return {
            title: "参数设置"
        };
    },
    mounted() {
        //var that = this;

    },
    destroyed() {

    },
    methods: {

    },
};
</script>
