<template>
    <div id='login'>
        <div class='login_content'>
            <div class='login_title'>场地智能管理系统</div>
            <div class='login_form'>
                <el-row>
                    <el-col :span='22' :offset='1'>

                        <el-form :model="loginForm" :rules='loginRules' ref='loginForm'>

                            <el-form-item prop='userName'>
                                <el-input v-model="loginForm.userName" placeholder="用户名" autofocus>
                                </el-input>
                            </el-form-item>

                            <el-form-item prop='password'>
                                <el-input v-model="loginForm.password" type='password' placeholder="密码"
                                          @keyup.enter.native="handleLoginClick">
                                </el-input>
                            </el-form-item>

                            <el-form-item>
                                <el-button type="primary" class='login_btn' @click='handleLoginClick'>登录</el-button>
                            </el-form-item>

                            <el-form-item class="forgetPassword">
                                <u @click="forgetPassword">忘记密码？</u>
                            </el-form-item>

                        </el-form>
                    </el-col>

                </el-row>

            </div>
        </div>
        <p class=" footer">成都市龙泉公共资源交易服务中心</p>
    </div>
</template>
<script>
    export default {
        name: 'Login',
        mounted () {
            this.init();
        },
        data () {
            return {
                loginForm: {
                    userName: '', // 默认用户名
                    password: '' // 默认密码
                },
                // 登陆验证规则
                loginRules: {
                    userName: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            init(){//如果已经登录，跳转到首页
              let userName=sessionStorage.getItem('userName');
              if(userName){
                  this.$message({type:'success',message:'你已经登录过了'});
                  this.$router.push('/home');
              }
            },
            async handleLoginClick () {
                let _this = this

                this.request({
                    url: 'user/login',
                    data: {
                        ..._this.loginForm
                    }
                }, (res) => {
                    console.log(res)
                    sessionStorage.setItem('userName', res.userName)
                    sessionStorage.setItem('userId', res.uid)
                    sessionStorage.setItem('role', res.role)
                    console.log(  sessionStorage.getItem('jurisdiction'))
                    //设置权限
                    sessionStorage.setItem('web', res.jurisdiction.web)
                    sessionStorage.setItem('cdLibrary', res.jurisdiction.cdLibrary)
                    sessionStorage.setItem('res', res.jurisdiction.res)
                    sessionStorage.setItem('expert', res.jurisdiction.expert)
                    sessionStorage.setItem('out', res.jurisdiction.out)
                    sessionStorage.setItem('view', res.jurisdiction.view)
                    sessionStorage.setItem('jurisdiction', res.jurisdiction.jurisdiction)

                    _this.$router.push('/home')
                    // let curTime = new Date().getTime()
                    // sessionStorage.setItem("userInfo", JSON.stringify({ userName: _this.loginForm.userName ,time: curTime })); // 存储用户信息
                    //
                    // if (sessionStorage.getItem("toUrl") !== null) {
                    //   this.$router.push(sessionStorage.getItem("toUrl")) // 跳转到期望进入的网页
                    // } else {
                    //   this.$router.push('/text')
                    // }
                })
            },
            forgetPassword(){
                this.$message({type:'warning',message:'请联系系统管理员！18380461355'})
            }
        }
    }

</script>

<style scoped>
    .footer{
        position: absolute;
        width: 100%;
        bottom: 20px;
        text-align: center;
        color: #fff;
    }
    #login {
        width: 100%;
        height: 100%;
        position: absolute;
        background: url(../assets/login.png) no-repeat ;
        background-size: 100% 100%;
        background-color: #2b343c;
    }

    .login_content {
        width: 400px;
        height: 430px;
        position: absolute;
        background-color: #f3f3fb;
        top: 240px;
        right: 240px;
        border-radius: 10px;
    }

    .login_title {
        font-size: 30px;
        font-weight: bold;
        text-align: center;
        margin: 55px auto;
        color: #2c64af;
    }

    /*.login_form {*/
        /*padding-top: 20px;*/
        /*border: 8px solid #5c5c5c;*/
        /*border-radius: 10px;*/
        /*background: #f5f5f5;*/
    /*}*/

    .login_btn {
        width: 300px;
    }

    .el-form{
        margin: 0 auto;
        width:300px !important;
    }

    .forgetPassword{
        cursor: pointer;
        color: #878a91;
    }

</style>
