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
            <span>会员有效期：{{ member.vipExpiration }}</span>
          </div>
        </template>
        <template #thumb>
          <van-image round width="80" height="80" :src="member.avater" />
        </template>
      </van-card>
    </div>
    <div v-show="!showVip" class="buyVip">
      <div style="padding: 0px 10px;">
        <div>
          <div style="text-align: left; padding: 10px 0px 10px 10px;">会员升级</div>
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
          会员有效期至：
          <span style="color: orangered">
            {{ currProduce.vipExpiration }}
          </span>
        </div>
      </div>
      <div class="fixed-top">
        <van-button color="red" block style="border-radius: 5px ;"><span style="color: white">立即以 {{ currProduce.price }} 元开通</span></van-button>
      </div>
    </div>
    <div v-show="showVip" class="my">
      <p>修仙界</p>
      <p>每周二、四晚上10点准时更新</p>
      <div class="">
        <van-button color="red" block style="border-radius: 5px ;" @click="showBuyVip">立即解锁”修仙界“会员资格</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import crudMy from '@/api/app/my'

export default {
  name: 'MyPage',
  components: {},
  props: {},
  data() {
    return {
      showVip: true,
      currProduce: {
        id: 1,
        desc: '6个月',
        price: (29000 / 100),
        average: (490 / 100),
        vipExpiration: '2025.01.01 23:59:59'
      },
      member: {
        id: 1,
        avater: 'https://img01.yzcdn.cn/vant/cat.jpeg',
        nickName: 'HardCoer',
        vipExpiration: '2025.01.01 23:59:59'
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
  },
  created() {
  },
  mounted() {
    this.$store.state.path = this.$route.path
    console.log(this.$store.state.path)
  },
  methods: {
    selectOne(data) {
      this.currProduce = this.produces[data]
    },
    showBuyVip() {
      this.showVip = !this.showVip
    },
    getInfo() {
      crudMy.info(this.id).then(res => {
        this.article = res
      }).catch(() => { })
    }
  }
}
</script>

<style scoped>

.my {
  padding: 0px 30px;
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
