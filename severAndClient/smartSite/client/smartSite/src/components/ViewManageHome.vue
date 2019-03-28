<template>
    <div class="container" >
        <ul class="items">
            <li class="item">
                <div class="item-contanier">
                    <img src="../assets/DP.png" alt="" width="292" >
                    <span class="item-itle dp">大屏</span>
                </div>
            </li>

            <li class="item">
                <div class="item-contanier">
                    <img src="../assets/TV.png" alt="" width="292" >
                    <span class="item-itle tv">电视</span>
                </div>
            </li>

            <li class="item" @dblclick="jumpTo('/home/viewManage/bidding')">
                <div class="item-contanier">
                    <img src="../assets/ZTB.png" alt="" w
idth="292" >
                    <span class="item-itle ztb">招投标</span>
                </div>
            </li>

            <li class="item" @dblclick="jumpTo('/home/viewManage/integratedMachine')">
                <div class="item-contanier">
                    <img src="../assets/YTJ.png" alt="" width="292" >
                    <span class="item-itle ytj">一体机</span>
                </div>
            </li>

            <li class="item">
                <div class="item-contanier">
                    <img src="../assets/BJ.png" alt="" width="292" >
                    <span class="item-itle bj">保洁室</span>
                </div>
            </li>

            <li class="item">
                <div class="item-contanier">
                    <img src="../assets/LED.png" alt="" width="292" >
                    <span class="item-itle led">LED</span>
                </div>
            </li>



        </ul>
    </div>
</template>

<script>
    export default {
        name: 'view-mange-home',
        components: {},
        mounted () {
            this.init()
        },
        data () {
            return {}
        },
        methods: {
            init () {
            },
            jumpTo(url){
                this.$router.push(url);
            }
        }
    }
</script>

<style scoped>
    .container {
        padding: 10px 20px;
        height: 100%;
        position: relative;
    }
    .items{
        width: 100%;
        font-size: 0;
        letter-spacing: -4px;
        text-align: left;
    }
    .item{
        display: inline-block;
        width: 316px;
        height:410px;
        margin-top: 10px;
        padding: 0 8px;
    }
    .item-contanier{
        cursor: pointer;
        width: 100%;
        height: 100%;
        background-color: transparent;
        border-radius: 4px;
        text-align: center;
        line-height: 410px;
        position: relative;
    }
    .item-contanier>img{
      box-shadow: 0 0 3px 3px rgba(125,125,125,0.2) ;
    }
    img.add{
        box-shadow:none !important;
    }
    /*默认居中*/
    .item-itle{
        font-size: 30px;
        line-height: 30px;
        letter-spacing: normal;
        position: absolute;
        color: #ffffff;
        display: inline-block;
        width: 292px;
        top: 238px;
        left: 3px;
        text-align: center;
    }
    /*微调*/
    .dp{
        top: 238px;
        left: 2px;
    }
    .tv{
        top: 238px;
        left: 12px;
    }
    .ytj{
        top: 238px;
        left: 11px;
    }
    .bj{
        top: 238px;
        left: 3px;
    }
    .led{
        top: 238px;
        left: 12px;
    }
    .ztb{
        top: 238px;
        left: 5px;
    }
</style>
