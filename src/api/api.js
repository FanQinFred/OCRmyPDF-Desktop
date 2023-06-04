import request from '@/utils/request' // 引入封装的request.js文件

let base_url = "http://localhost:59821";

// 提交PDF OCR 任务
export function submit_ocr_task(data) {
    return request({
        url: base_url + `/ocrpdf/`,
        method: 'post',
        data
    })
}

// 查询文件转换状态
export function query_file_status(data) {
    return request({
        url: base_url + `/status/`,
        method: 'post',
        data
    })
}

// 停止文件转换
export function stop_file_ocr(data) {
    return request({
        url: base_url + `/stop/`,
        method: 'post',
        data
    })
}