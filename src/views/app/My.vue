<template>
  <div class="my-container" style="background: #EDEDED;">
    <div>
      <van-card style="background: black;">
        <template #title>
          <div style="text-align: left; font-size: 15px; padding: 20px 0px 5px 0px; color: white;">
            <span>{{ member.nickName }}</span>
          </div>
        </template>
        <template #desc>
          <div style="text-align: left; color: white;">
            <span>身份有效期：<span :class="{line_through : !member.type}">{{ member.vipExpiration }}</span></span>
          </div>
        </template>
        <template #thumb>
          <van-image round width="80" height="80" :src="member.headImgUrl" />
        </template>
        <template #tags>
          <div style="text-align: left; padding: 5px 0px 0px 0px; color: white;">
            <span>手机号：{{ member.phone? member.phone : '未设置' }}</span>
          </div>
        </template>
      </van-card>
    </div>
    <div>
      <van-collapse v-model="activeNames">
        <van-collapse-item title="编辑个人信息" name="1">
          <el-form ref="member" :model="member" :rules="rules">
            <el-form-item
              label="手机号"
              prop="phone"
              :rules="[
                { type: 'number', message: '手机号必须为数字值'},
                { validator: validatePhone, trigger: 'change' }
              ]"
            >
              <el-input
                v-model.number="member.phone"
                size="small"
                maxlength="11"
                placeholder="手机号"
                autocomplete="off"
                @blur="submitForm('member')"
              >
                <el-button slot="append" icon="el-icon-check" @click="submitForm('member')" />
              </el-input>
            </el-form-item>
          </el-form>
        </van-collapse-item>
      </van-collapse>
    </div>
    <div v-show="showProduce" class="buyVip">
      <div style="padding: 0px 10px;">
        <div>
          <div style="text-align: left; padding: 10px 0px 10px 10px;">身份升级后正式进入修真界，可浏览所有内容</div>
          <div class="produces">
            <van-row gutter="3">
              <van-col v-for="(item,index) of produces" :key="item.id" :span="24 / produces.length">
                <ul>
                  <li :class="{ produce_action : currProduce.id === item.id, produce : currProduce.id !== item.id }" @click="selectOne(index)">
                    <div class="howlong">{{ item.name }}</div>
                    <div class="price">￥{{ (item.priceOfYuan) }}元</div>
                  </li>
                </ul>
              </van-col>
            </van-row>
          </div>
        </div>
        <div class="produce_desc">
          身份有效期至：
          <span style="color: orangered">
            {{ currProduce.vipExpiration }}
          </span>
        </div>
      </div>
      <div class="fixed-bottom">
        <van-button v-show="!paying && !paid" color="red" block style="border-radius: 5px ;" @click="buyVip">
          <span style="color: white">立即以 {{ currProduce.priceOfYuan }} 元开通</span>
        </van-button>
        <van-button v-show="paying && !paid" color="red" block style="border-radius: 5px ;" @click="buyVip">
          <span style="color: white">支付中...</span>
        </van-button>
        <van-button v-show="!paying && paid" color="red" block style="border-radius: 5px ;" @click="buyVip">
          <span style="color: white">支付成功</span>
        </van-button>
      </div>
    </div>
    <div v-show="showDesc && !member.type" class="my">
      <p>修真界</p>
      <p>每周五准时更新</p>
      <div v-show="toBuyVip" class="">
        <van-button color="red" block style="border-radius: 5px ;" @click="showBuyVip">立即进入”修真界“</van-button>
      </div>
    </div>
    <div v-show="member.type" class="vipDesc">
      <p>您已进入修真界！</p>
      <p>可任意浏览所有内容！</p>
      <p>每周五更新深度、稀缺内容，不见不散！</p>
    </div>
    <van-dialog v-model="showDialog" title="提示" message="支付完成，请稍等..." :before-close="beforeClose" />
  </div>
</template>

<script>
import crudMy from '@/api/app/my'
import crudOrder from '@/api/app/order'
import wx from 'weixin-js-sdk'
import avatar from '@/assets/images/avatar.png'
import crudProduct from '@/api/app/produce'
import { validatePhone } from '@/utils/validate'

export default {
  name: 'MyPage',
  components: {},
  data() {
    return {
      validatePhone: validatePhone,
      activeNames: ['0'],
      showDialog: false,
      phoneReadonly: true,
      showDesc: true,
      showProduce: false,
      toBuyVip: false,
      paying: false,
      paid: false,
      currProduce: {},
      member: {
        headImgUrl: avatar,
        nickName: '用户昵称',
        vipExpiration: '无'
      },
      produces: []
    }
  },
  computed: {
  },
  watch: {
    member(val) {
      this.toBuyVip = !val.type
    }
  },
  mounted() {
    this.getAllProduce()
  },
  created() {
    this.getInfo()
  },
  methods: {
    selectOne(data) {
      this.currProduce = this.produces[data]
      // 获取当前时间
      const currentDate = new Date()
      // 将时间加上时间长度
      if (this.currProduce.timeUnit === 0) {
        currentDate.setMonth(currentDate.getMonth() + this.currProduce.timeLength)
      } else {
        currentDate.setFullYear(currentDate.getFullYear() + this.currProduce.timeLength)
      }
      this.produces[data]['vipExpiration'] = this.formatDate(currentDate)
      this.paying = false
      this.paid = false
    },
    formatDate(date) {
      const year = date.getFullYear()
      const month = this.padZero(date.getMonth() + 1) // 月份是从0开始的
      const day = this.padZero(date.getDate())
      const hours = this.padZero(date.getHours())
      const minutes = this.padZero(date.getMinutes())
      const seconds = this.padZero(date.getSeconds())

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },
    padZero(num) {
      return num < 10 ? '0' + num : num
    },
    showBuyVip() {
      this.showDesc = !this.showDesc
      this.showProduce = !this.showDesc
    },
    getInfo() {
      crudMy.info().then(res => {
        this.member = res
      }).catch(() => {
      })
    },
    getAllProduce() {
      const data = {
        enabled: true,
        size: 9999,
        sort: ['sort,asc', 'id,desc']
      }
      crudProduct.all(data).then(res => {
        this.produces = res.content
        this.currProduce = this.produces[0]
        this.selectOne(0)
      }).catch(() => {})
    },
    buyVip() {
      this.paying = true
      const data = {
        amount: this.currProduce.price
      }
      crudOrder.create(data).then(res => {
        this.wxPay(res)
      }).catch(() => {
        this.paying = false
      })
    },
    handSuccess() {
      this.showDialog = true
    },
    beforeClose(action, done) {
      if (action === 'confirm') {
        setTimeout(() => {
          done()
          this.$router.go(0)
        }, 1000)
      } else {
        done()
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          crudMy.save(this.member).then(res => {
            this.phoneReadonly = true
            this.$toast('已保存')
          }).catch(() => {})
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    wxPay(res) {
      // 调起微信支付
      const { appId, nonceStr, timeStamp, paySign, signType } = res
      const prepayId = res.packageVal
      const that = this
      wx.config({
        debug: false, // 测试阶段可用 true 打包返回给后台用 false
        appId: appId,
        timestamp: timeStamp,
        nonceStr: nonceStr,
        signature: paySign,
        jsApiList: ['chooseWXPay']
      })
      wx.ready(function() {
        wx.chooseWXPay({
          appId: appId,
          timestamp: timeStamp, // 时间戳
          nonceStr: nonceStr, // 随机字符串
          package: prepayId, // 统一支付接口返回的prepay_id参数值
          signType: signType, //  签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
          paySign: paySign, // 支付签名
          success: function(res) {
            // 在函数内不能之间操作外部数据，需要调用外部函数处理
            that.handSuccess()
            that.$toast.success('支付成功')
          },
          cancel: function(res) {
            that.$toast('支付取消')
          },
          fail: function(res) {
            that.$toast.fail('支付失败')
          },
          complete: function(res) {
            that.paying = false
            // 接口调用完成时执行的回调函数，无论成功或失败都会执行
            if (res.errMsg === 'chooseWXPay:ok') {
              // 【支付成功】：支付成功提示页面，点击完成按钮之后
            } else if (res.errMsg === 'chooseWXPay:cancel') {
              // 【支付取消】
            } else {
              that.$toast('未知错误')
            }
            /**
             * iOS和Android支付成功点击“完成”后都会进入success和complete函数，都返回'chooseWXPay:ok'
             * （也有人说Android支付成功不进入success函数，）
             * 原因是【iOS和Android返回数据不同。支付成功后Android返回 {"errMsg":"getBrandWCPayRequest:ok"}，iOS返回{"err_Info":"success","errMsg":"chooseWXPay:ok"}，故Android找不到success方法，导致失败】
             * */
          }
        })
      })
    }
  }
}
</script>

<style scoped>

.my-container {
  min-height: 100vh; /* 设置最小高度为视口的100% */
  overflow-y: auto; /* 如果内容超出屏幕，可以滚动查看 */
}

.my {
  height: 200px;
  padding: 0px 30px;
}

.buyVip {
  height: 300px;
}

.fixed-bottom {
  position: fixed;
  bottom: 80px;
  left: 0;
  width: 100%;
  z-index: 1000; /* 确保元素在顶层 */
}

.howlong {
  font-size: 12px;
}

.price {
  font-size: 18px;
  font-weight: 600;
  color: red;
}

.average {
  font-size: 12px;
}

.produce {
  border: 3px solid #cccccc;
  line-height: 50px;
}

.produces {
  text-align: center;
  padding-bottom: 10px;
}

.produces li {
  border-radius: 10px;
}

.produce_action {
  border: 3px solid red;
  background: bisque;
  line-height: 50px;
}

.produce_desc {
  text-align: left;
  border: 1px solid #cccccc;
  padding: 10px 0px 10px 10px;
  background-color: #f0f0eb;
}

.line_through {
  text-decoration:line-through;
}

.vipDesc p {
  text-align: center;
}

.my_label label{
  font-weight: 800;
}
</style>
