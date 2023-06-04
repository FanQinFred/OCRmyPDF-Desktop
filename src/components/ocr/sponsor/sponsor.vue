<style lang="scss" scoped>
.c {
    height: 100%;
    text-align: left;
}
</style>

<template>
<div class="c">
    <div style="height:12%;">
        <RadioGroup v-model="payType" type="button">
            <Radio label="微信">
                <svg style="vertical-align: middle;" t="1685536466106" class="icon" viewBox="0 0 1170 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3644" width="16" height="16">
                    <path d="M331.429 263.429q0-23.429-14.286-37.715t-37.714-14.285q-24.572 0-43.429 14.571t-18.857 37.429q0 22.285 18.857 36.857t43.429 14.571q23.428 0 37.714-14t14.286-37.428zM756 553.143q0-16-14.571-28.572T704 512q-15.429 0-28.286 12.857t-12.857 28.286q0 16 12.857 28.857T704 594.857q22.857 0 37.429-12.571T756 553.143zM621.143 263.429q0-23.429-14-37.715t-37.429-14.285q-24.571 0-43.428 14.571t-18.857 37.429q0 22.285 18.857 36.857t43.428 14.571q23.429 0 37.429-14t14-37.428zM984 553.143q0-16-14.857-28.572T932 512q-15.429 0-28.286 12.857t-12.857 28.286q0 16 12.857 28.857T932 594.857q22.286 0 37.143-12.571T984 553.143zM832 326.286Q814.286 324 792 324q-96.571 0-177.714 44T486.57 487.143 440 651.429q0 44.571 13.143 86.857-20 1.714-38.857 1.714-14.857 0-28.572-0.857t-31.428-3.714-25.429-4-31.143-6-28.571-6L124.57 792l41.143-124.571Q0 551.429 0 387.429q0-96.572 55.714-177.715T206.571 82t207.715-46.571q100.571 0 190 37.714T754 177.429t78 148.857z m338.286 320.571q0 66.857-39.143 127.714t-106 110.572l31.428 103.428-113.714-62.285q-85.714 21.143-124.571 21.143-96.572 0-177.715-40.286T512.857 797.714t-46.571-150.857T512.857 496t127.714-109.429 177.715-40.285q92 0 173.143 40.285t130 109.715 48.857 150.571z" fill="#0e932e" p-id="3645"></path>
                </svg>
                <span style="vertical-align: middle; font-size: 13px; margin-left: 3px;">微信</span>
            </Radio>
            <Radio label="支付宝">
                <svg style="vertical-align: middle;" t="1685536513566" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5654" width="16" height="16">
                    <path d="M1023.795 853.64v6.348a163.807 163.807 0 0 1-163.807 163.807h-696.18A163.807 163.807 0 0 1 0 859.988v-696.18A163.807 163.807 0 0 1 163.807 0h696.181a163.807 163.807 0 0 1 163.807 163.807V853.64z" fill="#009FE9" p-id="5655"></path>
                    <path d="M844.836 648.267c-40.952-14.333-95.623-34.809-156.846-57.128a949.058 949.058 0 0 0 90.094-222.573H573.325V307.14h245.711v-43.41l-245.71 2.458V143.33H472.173c-18.223 0-21.704 20.476-21.704 20.476v102.38H204.759v40.952h245.71v61.427H245.712v40.952h409.518a805.522 805.522 0 0 1-64.909 148.246c-128.384-42.795-266.186-77.604-354.233-55.08a213.564 213.564 0 0 0-112.003 63.27c-95.418 116.917-26.21 294.034 175.274 294.034 119.989 0 236.087-67.366 325.771-177.73 134.322 65.932 398.666 176.297 398.666 176.297V701.3s-32.352-4.095-178.96-53.033z m-563.702 144.97c-158.893 0-204.759-124.699-126.336-194.112a191.86 191.86 0 0 1 90.913-46.276c93.575-10.238 189.811 35.629 293.624 86.614-74.941 94.598-166.674 153.774-258.2 153.774z" fill="#FFFFFF" p-id="5656"></path>
                </svg>
                <span style="vertical-align: middle; font-size: 13px; margin-left: 3px;">支付宝</span>
            </Radio>
        </RadioGroup>
        <div style="display:inline-block;margin-left: 15px;vertical-align: middle;letter-spacing: 1px;">我们承诺<span style="color:red;">永久免费</span>, 赞助是我们<span style="color:red;">唯一</span>的收入来源 !!!</div>
    </div>
    <div style="height:88%;">
        <div>
            <div style="display:flex;width:90%;max-width:627px;">
                <div style="border-radius:10px;text-align: center;cursor:pointer;box-shadow: 0px 4px 14px 0px rgb(0 0 0 / 28%);width:323px;height:300px;overflow: hidden;">
                    <img style="
                        height: 300px;
                        
                        object-fit: cover;
                        background-color: transparent;
                        image-rendering: -webkit-optimize-contrast;
                        " src="@/assets/images/a.jpg" alt="1元" />
                </div>
                <div style="border-radius:10px;margin-left:30px;text-align: center;cursor:pointer;box-shadow: 0px 4px 14px 0px rgb(0 0 0 / 28%);width:323px;height:300px;overflow: hidden;">
                    <img style="
                        height: 300px;
                       
                        overflow: hidden;
                        object-fit: cover;
                        background-color: transparent;
                        image-rendering: -webkit-optimize-contrast;
                        " src="@/assets/images/w.jpg" alt="1元" />
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: "Sponsor",
    components: {

    },
    data() {
        return {
            payType: '微信'
        };
    },
    metaInfo() {
        return {
            title: "打个赏吧"
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
