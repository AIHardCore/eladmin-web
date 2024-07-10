<template>
  <el-form ref="form" :model="form" :rules="rules" style="margin-top: 6px;" size="small" label-width="100px">
    <el-form-item label="appID" prop="appId" label-width="200px">
      <el-input v-model="form.appId" style="width: 40%" />
      <span style="color: #C0C0C0;margin-left: 10px;">应用APPID</span>
    </el-form-item>
    <el-form-item label="商户号" prop="mchId" label-width="200px">
      <el-input v-model="form.mchId" style="width: 40%;" />
      <span style="color: #C0C0C0;margin-left: 10px;">商户号</span>
    </el-form-item>
    <el-form-item label="appSecret" prop="appSecret" label-width="200px">
      <el-input v-model="form.appSecret" type="password" style="width: 40%;" />
      <span style="color: #C0C0C0;margin-left: 10px;">公众号appSecret</span>
    </el-form-item>
    <el-form-item label="APIv3密钥" prop="apiV3Key" label-width="200px">
      <el-input v-model="form.apiV3Key" type="password" style="width: 40%;" />
      <span style="color: #C0C0C0;margin-left: 10px;">APIv3密钥</span>
    </el-form-item>
    <el-form-item label="商户证书序列号" prop="merchantSerialNumber" label-width="200px">
      <el-input v-model="form.merchantSerialNumber" type="password" style="width: 40%;" />
      <span style="color: #C0C0C0;margin-left: 10px;">商户证书序列号</span>
    </el-form-item>
    <el-form-item label="商户API私钥路径" prop="privateKeyPath" label-width="200px">
      <el-input v-model="form.privateKeyPath" style="width: 40%;" />
      <span style="color: #C0C0C0;margin-left: 10px;">商户API私钥路径</span>
    </el-form-item>
    <el-form-item label="支付地址" prop="payUrl" label-width="200px">
      <el-input v-model="form.payUrl" style="width: 40%;">
        <template slot="prepend">{{ wxPayBaseUrl }}</template>
      </el-input>
      <span style="color: #C0C0C0;margin-left: 10px;">微信生成订单的地址</span>
    </el-form-item>
    <el-form-item label="支付回调通知地址" prop="notifyUrl" label-width="200px">
      <el-input v-model="form.notifyUrl" style="width: 40%;">
        <template slot="prepend">{{ baseApi }}/</template>
      </el-input>
      <span style="color: #C0C0C0;margin-left: 10px;">支付回调通知地址</span>
    </el-form-item>
    <el-form-item label="code回调地址" prop="redirectUri" label-width="200px">
      <el-input v-model="form.redirectUri" style="width: 70%;">
        <template slot="prepend">{{ baseApi }}/</template>
      </el-input>
      <span style="color: #C0C0C0;margin-left: 10px;">获取用户code的回调地址</span>
    </el-form-item>
    <el-form-item label="用户code的地址" prop="redirectUri" label-width="200px">
      <el-input v-model="form.codeUrl" style="width: 70%;">
        <template slot="prepend">https://open.weixin.qq.com/connect/qrconnect?</template>
      </el-input>
      <span style="color: #C0C0C0;margin-left: 10px;">获取用户code的地址</span>
    </el-form-item>
    <el-form-item label="获取access_token的地址" prop="accessTokenUrl" label-width="200px">
      <el-input v-model="form.accessTokenUrl" style="width: 70%;">
        <template slot="prepend">{{ wxBaseUrl }}sns/oauth2/access_token?</template>
      </el-input>
      <span style="color: #C0C0C0;margin-left: 10px;">获取access_token的地址</span>
    </el-form-item>
    <el-form-item label="刷新access_token的地址" prop="refreshAccessTokenUrl" label-width="200px">
      <el-input v-model="form.refreshAccessTokenUrl" style="width: 70%;">
        <template slot="prepend">{{ wxBaseUrl }}sns/oauth2/refresh_token?</template>
      </el-input>
      <span style="color: #C0C0C0;margin-left: 10px;">刷新access_token的地址</span>
    </el-form-item>
    <el-form-item label="获取用户信息的地址" prop="userinfoUrl" label-width="200px">
      <el-input v-model="form.userInfoUrl" style="width: 70%;">
        <template slot="prepend">{{ wxBaseUrl }}sns/userinfo?</template>
      </el-input>
      <span style="color: #C0C0C0;margin-left: 10px;">获取用户信息的地址</span>
    </el-form-item>
    <el-form-item label="">
      <el-button :loading="loading" size="medium" type="primary" @click="doSubmit">保存配置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { get, update } from '@/api/tools/wxpay'
import { mapGetters } from 'vuex'
export default {
  name: 'Config',
  data() {
    return {
      loading: false,
      form: {
        appId: '',
        mchId: '',
        appSecret: '',
        apiV3Key: '',
        merchantSerialNumber: '',
        privateKeyPath: '',
        payUrl: '',
        notifyUrl: '',
        redirectUri: '',
        accessTokenUrl: '',
        refreshAccessTokenUrl: '',
        userInfoUrl: ''
      },
      rules: {
        appId: [
          { required: true, message: '请输入appID', trigger: 'blur' }
        ],
        mchId: [
          { required: true, message: '请输入商户号', trigger: 'blur' }
        ],
        appSecret: [
          { required: true, message: '请输入公众号appSecret', trigger: 'blur' }
        ],
        apiV3Key: [
          { required: true, message: '请输入APIv3密钥', trigger: 'blur' }
        ],
        merchantSerialNumber: [
          { required: true, message: '请输入商户证书序列号', trigger: 'blur' }
        ],
        privateKeyPath: [
          { required: true, message: '请输入商户API私钥路径', trigger: 'blur' }
        ],
        payUrl: [
          { required: true, message: '支付地址不能为空', trigger: 'blur' }
        ],
        notifyUrl: [
          { required: true, message: '支付回调通知地址不能为空', trigger: 'blur' }
        ],
        redirectUri: [
          { required: true, message: 'code回调地址不能为空', trigger: 'blur' }
        ],
        codeUrl: [
          { required: true, message: '用户code的地址不能为空', trigger: 'blur' }
        ],
        accessTokenUrl: [
          { required: true, message: '获取access_token的地址不能为空', trigger: 'blur' }
        ],
        refreshAccessTokenUrl: [
          { required: true, message: '刷新access_token的地址不能为空', trigger: 'blur' }
        ],
        userInfoUrl: [
          { required: true, message: '获取用户信息的地址不能为空', trigger: 'blur' }
        ]
      },
      wxBaseUrl: 'https://api.weixin.qq.com/',
      wxPayBaseUrl: 'https://api.mch.weixin.qq.com/',
      wxCodeBaseUrl: 'https://open.weixin.qq.com/connect/oauth2/authorize?'
    }
  },
  computed: {
    ...mapGetters([
      'baseApi',
      'fileUploadApi'
    ])
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      get().then(res => {
        this.form = res
        this.form.payUrl = this.form.payUrl.replace(this.wxPayBaseUrl, '')
        this.form.notifyUrl = this.form.notifyUrl.replace(this.baseApi, '')
        this.form.redirectUri = this.form.redirectUri.replace(this.baseApi, '')
        this.form.codeUrl = this.form.codeUrl.replace(this.wxCodeBaseUrl, '')
        this.form.accessTokenUrl = this.form.accessTokenUrl.replace(this.wxBaseUrl + 'sns/oauth2/access_token?', '')
        this.form.refreshAccessTokenUrl = this.form.refreshAccessTokenUrl.replace(this.wxBaseUrl + 'sns/oauth2/refresh_token?', '')
        this.form.userInfoUrl = this.form.userInfoUrl.replace(this.wxBaseUrl + 'sns/userinfo?', '')
      })
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const data = {
            appId: this.form.appId,
            mchId: this.form.mchId,
            appSecret: this.form.appSecret,
            apiV3Key: this.form.apiV3Key,
            merchantSerialNumber: this.wxPayBaseUrl + this.form.merchantSerialNumber,
            privateKeyPath: this.form.privateKeyPath,
            payUrl: this.wxPayBaseUrl + this.form.payUrl,
            notifyUrl: this.baseApi + this.form.notifyUrl,
            redirectUri: this.baseApi + this.form.redirectUri,
            codeUrl: this.wxCodeBaseUrl + this.form.codeUrl,
            accessTokenUrl: this.wxBaseUrl + 'sns/oauth2/access_token?' + this.form.accessTokenUrl,
            refreshAccessTokenUrl: this.wxBaseUrl + 'sns/oauth2/refresh_token?' + this.form.refreshAccessTokenUrl,
            userInfoUrl: this.wxBaseUrl + 'sns/userinfo?' + this.form.userInfoUrl
          }
          this.loading = true
          update(data).then(res => {
            this.$notify({
              title: '修改成功',
              type: 'success',
              duration: 2500
            })
            this.loading = false
          }).catch(err => {
            this.loading = false
            console.log(err.response.data.message)
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
