<template>
  <div class="my-container" style="background: white;">
    <div>
      <van-card style="background: black;">
        <template #title>
          <div style="text-align: left; font-size: 15px; padding: 20px 0px 5px 0px; color: white;">
            <span>{{ member.nickName }}</span>
          </div>
        </template>
        <template #desc>
          <div style="text-align: left; color: white;">
            <span>身份有效期：{{ member.vipExpiration }}</span>
          </div>
        </template>
        <template #thumb>
          <van-image round width="80" height="80" :src="member.headImgUrl" />
        </template>
      </van-card>
    </div>
    <div v-show="showProduce" class="buyVip">
      <div style="padding: 0px 10px;">
        <div>
          <div style="text-align: left; padding: 10px 0px 10px 10px;">身份升级</div>
          <div class="produces">
            <van-row gutter="3">
              <van-col v-for="(item,index) of produces" :key="item.id" span="6">
                <ul>
                  <li :class="{ produce_action : currProduce.id === item.id, produce : currProduce.id !== item.id }" @click="selectOne(index)">
                    <div class="howlong">{{ item.desc }}</div>
                    <div class="price">￥{{ item.price }}元</div>
                    <div class="average">{{ item.average }}元/月</div>
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
      <div class="fixed-top">
        <van-button color="red" block style="border-radius: 5px ;" @click="buyVip"><span style="color: white">立即以 {{ currProduce.price }} 元开通</span></van-button>
      </div>
    </div>
    <div v-show="showDesc" class="my">
      <p>修真界</p>
      <p>每周二、四晚上10点准时更新</p>
      <div v-show="toBuyVip" class="">
        <van-button color="red" block style="border-radius: 5px ;" @click="showBuyVip">立即进入”修真界“</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import crudMy from '@/api/app/my'
import crudOrder from '@/api/app/order'
import wx from 'weixin-js-sdk'
import avatar from '@/assets/images/avatar.png'

export default {
  name: 'MyPage',
  components: {},
  props: {},
  data() {
    return {
      showDesc: true,
      showProduce: false,
      toBuyVip: false,
      currProduce: {
        id: 1,
        desc: '6个月',
        price: (29000 / 100),
        average: (490 / 100),
        vipExpiration: '2025.01.01 23:59:59'
      },
      member: {
        headImgUrl: avatar,
        nickName: '用户昵称',
        vipExpiration: '无'
      },
      produces: [
        {
          id: 1,
          desc: '6个月',
          price: (29000 / 100),
          average: (4900 / 100),
          vipExpiration: '2024.11.01 23:59:59'
        },
        {
          id: 2,
          desc: '一年',
          price: (39000 / 100),
          average: (3300 / 100),
          vipExpiration: '2025.01.01 23:59:59'
        },
        {
          id: 3,
          desc: '两年',
          price: (59000 / 100),
          average: (2400 / 100),
          vipExpiration: '2026.01.01 23:59:59'
        },
        {
          id: 4,
          desc: '三年',
          price: (79000 / 100),
          average: (2200 / 100),
          vipExpiration: '2027.01.01 23:59:59'
        }
      ]
    }
  },
  computed: {},
  watch: {
    member(val) {
      this.toBuyVip = !val.type
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    selectOne(data) {
      this.currProduce = this.produces[data]
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
    buyVip() {
      this.buyText = '支付中...'
      const data = {
        amount: 20000
      }
      crudOrder.create(data).then(res => {
        this.wxPay(res)
      }).catch(() => {
      })
    },
    wxPay(res) {
      if (res.status === 200) {
        if (res.data.code) {
          this.$message.warning(res.data.msg)
        } else {
          // 调起微信支付
          const that = this
          const { appId, nonceStr, timeStamp, paySign, signType } = res
          const prepayId = res.packageVal
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
                this.handleClose()
                that.Toast('支付成功')
                this.$message.success('支付成功')
                setTimeout(() => {
                  location.reload()
                  this.$router.go(0)
                }, 2000)
              },
              cancel: function(res) {
                that.Toast('支付取消')
                this.$message.warning('支付取消')
              },
              fail: function(res) {
                that.Toast('支付失败')
                this.$message.error('支付失败')
              }
            })
          })
        }
      } else if (res.status === 50001) {
        this.$router.push('/auth')
      } else {
        this.$message.warning(res.msg)
      }
    }
  }
}
</script>

<style scoped>

.my {
  height: 200px;
  padding: 0px 30px;
}

.buyVip {
  height: 300px;
}

.fixed-top {
  position: fixed;
  bottom: 50px;
  left: 0;
  width: 100%;
  z-index: 1000; /* 确保元素在顶层 */
}

.howlong {
}

.price {
  font-size: 20px;
  color: red;
}

.average {
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
</style>
