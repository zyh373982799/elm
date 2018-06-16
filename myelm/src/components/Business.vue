<template>
  <div class="business_box" v-if="showMe">
    <section class="business_top">
      <div class="back_arrow" @click="back_one">
        <svg>
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-left.6f6409e"></use>
        </svg>
      </div>
      <div class="blur_bg"></div>
      <div class="font_words">
        <div class="fw_top">
          <div class="fw_top_img">
            <img src="../images/shop-logo.png" alt="">
          </div>
          <div class="fw_top_word clear">
            <h3 class="ell">{{ business_info.shop_name }}</h3>
            <p class="ell"><span v-if="business_info.fengniao">蜂鸟配送</span><span v-else>商家配送</span>／{{ business_info.estimate_time }}分钟送达／配送费¥{{ business_info.send_cost }}</p>
            <p class="ell">公告：{{ business_info.notice }}</p>
          </div>
          <p class="shop_activity ell"><i class="new_user">减</i><span>{{ business_info.discount }}</span></p>
        </div>
      </div>
    </section>
    <!-- 切换按钮 -->
    <section class="change_show_type" ref="chooseType">
      <div>
        <span :class='{activity_show: changeShowType =="food"}' @click="changeShowType='food'">商品</span>
      </div>
      <div>
        <span :class='{activity_show: changeShowType =="rating"}' @click="changeShowType='rating'">评价</span>
      </div>
    </section>
    <!-- 商品 -->
    <section class="business_content" v-bind:style="{ height: computedContentHeight + 'px' }" v-show="changeShowType == 'food'">

      <ul class="business_left" ref="businessLeft">
        <li v-for="(item, index) in business_info.commodity" :key="index" @click="leftControlRightScroll(index)" :class='{active_ia:index == 0}'>
          {{ item.name }}
          <span class="left_red" v-if="reNub[item.type_accumulation]">{{ reNub[item.type_accumulation] }}</span>
        </li>
      </ul>

      <ul class="business_right" ref="ullist">
        <li v-for=" (n, index) in business_info.commodity " :key="index">

          <header class="type_title ell">
            <strong class="ell">{{ n.name }}</strong>
            <span>{{ n.description }}</span>
          </header>

          <section class="single_commodity" v-for=" (x, index) in n.foods " :key="index">
            <div class="single_l">
              <img src="../images/slider-pic/slider-pic1.jpeg" alt="">
            </div>
            <div class="single_r">
              <h4>{{ x.name }}</h4>
              <p>{{ x.tips }}</p>
              <p class="xiaolq">月售{{ x.month_sales }}份，好评率{{ x.satisfy_rate }}%</p>
              <div class="add_remove">
                <span>￥{{ x.unit_price }}</span>
                <div class="add_remove_btn">
                  <svg @click="reduce_food(x.one_food_id)" v-if="shoppingCarList[x.one_food_id]">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-add"></use>
                  </svg>
                  <!-- ???? shoppingCarList[x.one_food_id][count] 会报错count未定义 改用 '.'就好了 ????-->
                  <span class="commodity_count" v-if="shoppingCarList[x.one_food_id]">{{ shoppingCarList[x.one_food_id].count }}</span>
                  <!-- nav_click_f(x.category_id, $event)内联$event传递DOM事件与其他参数 -->
                  <svg @click="add_food(n, x, $event)">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-minus"></use>
                  </svg>
                </div>
              </div>
            </div>
          </section>

        </li>
      </ul>

    </section>
    <!-- 评价 -->
    <section class="business_rating" v-bind:style="{ height: computedContentHeight + 'px' }" v-show="changeShowType == 'rating'">
      <div class="total_evaluate clear">
        <div class="total_code">
          <h3>{{ business_info.shop_rating }}</h3>
          <p class="p1">综合评价</p>
          <p class="p2"><span v-if="business_info.high_or_low">高</span><span v-if="!business_info.high_or_low">低</span>于周边商家{{ business_info.h_l_percent }}%</p>
        </div>
        <div class="detail_code">
          <p>
            <span class="small_tit v-md">服务态度</span>
            <YellowStar :code="4.5"></YellowStar>
            <span class="orange_code  v-md">{{ business_info.service_code }}</span>
          </p>
          <p>
            <span class="small_tit v-md">菜品评价</span>
            <YellowStar :code="4.5"></YellowStar>
            <span class="orange_code  v-md">{{ business_info.foods_code }}</span>
          </p>
          <p><span class="small_tit">送达时间</span><span style="margin-left:.1rem;">{{ business_info.estimate_time }}分钟</span></p>
        </div>
      </div>
      <div class="evaluate" v-for="(item, index) in business_info.evaluate" :key="index">
        <div class="user_img">
          <img src="../images/slider-pic/slider-pic2.jpeg" alt="">
        </div>
        <div class="evaluate_con">
          <div class="evaluate_con_t flex_align">
            <p class="user_name">{{ item.username }}</p>
            <p class="user_time">{{ item.time }}</p>
          </div>
          <div class="evaluate_star">
            <YellowStar :code="item.evaluate_code"></YellowStar>
            <span class="v-md">{{ item.send_time }}分钟送达</span>
          </div>
          <p class="evaluate_con_b">
            {{ item.evaluate_details }}
          </p>
        </div>
      </div>
    </section>
    <!-- 购物车 -->
    <section class="shopping_car" v-show="changeShowType == 'food'">
      <!-- 一个带条件的class 加一个固有class -->
      <div :class="['car_icon', { noting: !allNub }]" ref="carIcon" @click="shoppingCarShow = !shoppingCarShow;alertBoxShow = false;">
        <span class="tips_after" v-if="allNub !== 0">{{ allNub }}</span>
      </div>
      <div class="car_words">
        <h4>￥{{ totalPrice }}</h4>
        <p>配送费￥{{ business_info.send_cost }}</p>
      </div>
      <a href="javascript:;" :class="['cartview', { cantpay: totalPrice < business_info.start_send }]" @click="checkout();shoppingCarShow = false">去结算</a>
    </section>

    <!-- 购物车列表 -->
    <section class="sp_lists" v-if="shoppingCarShow">

      <header>
        <span class="sp_words">购物车</span>
        <div class="clear">
          <svg>
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-remove"></use>
          </svg>
          <span @click="shoppingCarList = {};spChangeComputeAll();shoppingCarShow = false">清空</span>
        </div>
      </header>
      <ul class="sp_content">
        <li v-for="(item, index) in shoppingCarList" :key="index">
          <div class="food_name ell">
            {{ item.name }}
          </div>
          <div class="food_unit_price">
            ￥{{ item.unit_price * item.count }}
          </div>
          <div class="food_nub">
            <svg @click="reduce_food(item.one_food_id)">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-add"></use>
            </svg>
            <span class="commodity_count" >{{ item.count }}</span>
            <svg @click="add_shopping_car(item.type_accumulation, item.type_name, item.name, item.one_food_id, item.unit_price)">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-minus"></use>
            </svg>
          </div>
        </li>
      </ul>
    </section>

    <!-- 弹出层 -->
    <section class="alert_box" v-if="alertBoxShow">
      <header>支付确认</header>
      <div class="con_info">
        需支付￥{{ allTotalPrice }}
      </div>
      <footer>
        <div class="double_btn" @click="alertBoxShow = false">取消</div>
        <div class="double_btn" @click="paySuccess">支付</div>
      </footer>
    </section>
    <!-- 透明遮罩 -->
    <div class="mask" v-if="alertBoxShow || shoppingCarShow" @click="alertBoxShow = false;shoppingCarShow = false"></div>
  </div>
</template>
<script>
import YellowStar from './small_components/Yellow_star'

export default {
  name: 'business',
  data () {
    return {
      showMe: false,
      // 计算商品区域高度
      computedContentHeight: window.innerHeight - (window.innerWidth / 10 * 4.2),
      // 控制显示食物还是显示评价
      changeShowType: 'food',
      // 购物车列表
      shoppingCarList: {},
      // 大类数量
      reNub: {},
      // 购物车总数
      allNub: 0,
      // 商品总价格
      totalPrice: 0,
      // 最终价格（加运费）
      allTotalPrice: 0,
      // 是否弹出支付窗口
      alertBoxShow: false,
      // 是否弹出购物车
      shoppingCarShow: false
    }
  },
  mounted () {
    this.$store.dispatch('setLoading', true)
    // 模拟加载
    var time = Math.floor(Math.random() * 2000)
    console.log('模拟加载用时' + time)
    setTimeout(() => {
      this.$store.dispatch('setLoading', false)
      this.showMe = true
    }, time)
    // 窗口大小改变，改变商品列高度
    window.addEventListener('resize', this.watchHei, false)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.watchHei, false)
  },
  computed: {
    isLogin () {
      return this.$store.getters.getLogin
    },
    // 通过id找到store中对应店铺信息
    business_info () {
      return this.$store.getters.getFalseBussinessInfo[this.$route.params.id]
    }
  },
  watch: { // 注意！！！！   watch对于对象来说deep=true也只能监控对象原有属性，新增加的无效！！！！
    // 监听showMe变化，在DOM更新后执行nextTick
    showMe: function (value) { // value就是showMe
      if (value) {
        this.$nextTick(() => {
          this.init()
        })
      }
    }
  },
  components: {
    YellowStar
  },
  methods: {
    back_one () {
      this.$router.go(-1)
    },
    // 初始化
    init () {
      this.rightControlLeftClass()
      // 给购物车添加animationend事件，动画结束后去掉有animation的class
      this.$refs.carIcon.addEventListener('animationend', () => {
        this.$refs.carIcon.classList.remove('tantantan')
      }, false)
    },
    // 右列表控制左列表样式
    rightControlLeftClass () {
      // 左目录列表
      var leftUl = this.$refs.businessLeft
      // 左目录的所有li
      var leftLI = leftUl.getElementsByTagName('li')
      // 右商品列表
      var rightUl = this.$refs.ullist
      var ti = rightUl.querySelectorAll('.type_title')
      // 定义当前滚动到的index值
      var asIndex = 0
      // ↓ BUG（魅族自带浏览器 + UC无效果scroll不执行，安卓端chrome火狐正常 IOS 10.2正常)
      // 原因 某些浏览器不支持 forEach (UC,魅族自带,微信等) 改用 for 循环
      rightUl.addEventListener('scroll', () => {
        // 当前scrollTop
        var thisST = rightUl.scrollTop
        // console.log('滚动条上去高度', this.scrollTop)
        // 算每个标题offsetTop来决定当前asIndex
        /* ti.forEach(function (e, i) {
          // console.log(e.offsetTop)
          if (thisST >= e.offsetTop) {
            // console.log(i)
            asIndex = i;
          }
        }); */
        for (var i = 0; i < ti.length; i++) {
          if (thisST >= ti[i].offsetTop) {
            // console.log(i)
            asIndex = i
          }
        };
        // 给左目录列表所有的li去掉激活样式
        for (var j = 0, x = leftLI.length; j < x; j++) {
          leftLI[j].classList.remove('active_ia')
        }
        // 当前滚动到的li加激活样式
        leftLI[asIndex].classList.add('active_ia')
      }, false)
    },
    // 左列表点击控制右列表滚动
    leftControlRightScroll (index) {
      /**
       * [scrollMove 右侧Ul滚动，以当前scrollTop与目标的差值/10为滚动距离，滚动过远的话会有点生硬]
       * @param  {[DOM]} ele    [目标元素ul]
       * @param  {[Number]} target [滚动到的位置]
       * @return {[void]}        [description]
       */
      var scrollMove = (ele, target) => {
        // 根据当前scrollTop与目标点距离算出单次改变量
        var vector = Math.round((target - ele.scrollTop) / 10)
        console.log('vector', vector)
        var scrollTimer = setInterval(() => {
          ele.scrollTop += vector
          // 超出目标点后 或者 已经滚动到底清空定时器
          // 上滑(scrollTop>=目标点 且 vector为正) 或 下滑(scrollTop <= 目标点 且 vector为负)或 滑到最底
          if (((ele.scrollTop >= target) && vector > 0) || ((ele.scrollTop <= target) && vector < 0) || ((ele.scrollTop + ele.clientHeight + 1) >= ele.scrollHeight)) {
            // +1 正确激活当前左栏状态
            ele.scrollTop = target + 1
            clearInterval(scrollTimer)
          }
        }, 1000 / 100)
      }
      var rightUl_ = this.$refs.ullist
      // 右列表应该滚动到的标题的offsetTop
      var rightTo_ = rightUl_.querySelectorAll('.type_title')[index].offsetTop
      scrollMove(rightUl_, rightTo_)
    },
    // 监控网页的resize来改变商品列表的高度
    watchHei () {
      var heightTimer = setTimeout(() => {
        this.computedContentHeight = window.innerHeight - (window.innerWidth / 10 * 4.2)
      }, 100)
      clearTimeout(heightTimer)// 节流
    },
    // 列表中的加按钮点击
    add_food (n, x, e) { // n 为大类 x为大类种商品
      // 大类标记 c1 ,大类名字 热销榜 ,商品名 吮指原味鸡 ,单个商品id 100001 ,单价 11
      // console.log(n.type_accumulation, n.name, x.name, x.one_food_id, x.unit_price);
      this.add_shopping_car(n.type_accumulation, n.name, x.name, x.one_food_id, x.unit_price)
      this.ball_fly(e)
    },
    // 向购物车添加
    add_shopping_car (type, typename, foodname, foodid, foodprice) {
      if (!this.shoppingCarList[foodid]) {
        this.shoppingCarList[foodid] = {
          'type_accumulation': type,
          'type_name': typename,
          'name': foodname,
          'one_food_id': foodid,
          'unit_price': foodprice,
          'count': 1
        }
      } else {
        this.shoppingCarList[foodid].count++
      }
      // 购物车改变 相关计算
      this.spChangeComputeAll()
    },
    // 减去单个食物--
    reduce_food (foodid) {
      // console.log(this.shoppingCarList[foodid].count);
      if (this.shoppingCarList && this.shoppingCarList[foodid].count > 0) {
        this.shoppingCarList[foodid].count--
        this.shoppingCarList[foodid].count <= 0 && delete this.shoppingCarList[foodid]
      }
      // 购物车改变 相关计算
      this.spChangeComputeAll()
    },
    // 购物车改变 相关计算
    spChangeComputeAll () {
      // console.log('dasd', this.shoppingCarList);
      // 清空左列表数字 再次计算
      this.reNub = {}
      for (var x in this.shoppingCarList) {
        if (!this.reNub[this.shoppingCarList[x].type_accumulation]) {
          this.reNub[this.shoppingCarList[x].type_accumulation] = this.shoppingCarList[x].count
        } else {
          this.reNub[this.shoppingCarList[x].type_accumulation] += this.shoppingCarList[x].count
        }
      }
      // 计算总件数
      var key = 0
      for (var j in this.reNub) {
        key += this.reNub[j]
      }
      this.allNub = key
      // 计算总价格
      var allPrice = 0
      for (var z in this.shoppingCarList) {
        // +=数量乘单价
        allPrice += this.shoppingCarList[z].count * this.shoppingCarList[z].unit_price
      }
      this.totalPrice = allPrice
      // 加运费
      this.allTotalPrice = allPrice + this.business_info.send_cost
    },
    // 结账
    checkout () {
      // 不够起送金额
      if (this.totalPrice < this.business_info.start_send) return
      // 够起送金额弹出支付
      this.alertBoxShow = true
    },
    // 支付成功
    paySuccess () {
      if (!this.isLogin) {
        alert('未登录')
        return
      }
      var d = new Date()
      var year = d.getFullYear()
      var month = d.getMonth() + 1
      var day = d.getDate()
      var hour = d.getHours()
      var mins = d.getMinutes()
      month = month < 10 ? ('0' + month) : month // 3月 -> 03月
      day = day < 10 ? ('0' + day) : day // 3日 -> 03日
      hour = hour < 10 ? ('0' + hour) : hour // 3点 -> 03点
      mins = mins < 10 ? ('0' + mins) : mins // 3分 -> 03分
      var orderTime = `${year}-${month}-${day} ${hour}:${mins}`
      var headerWord = () => {
        for (var s in this.shoppingCarList) {
          return this.shoppingCarList[s].name
        }
      }
      var footerWord = this.allNub > 1 ? `等${this.allNub}件商品` : ''
      var orderBriefInfo = headerWord() + footerWord
      console.log(orderBriefInfo)
      var order = {
        'restaurant_id': this.business_info.id, // 店id
        'img_src': '',
        'store_name': this.business_info.shop_name, // 店名
        'order_birth_time': orderTime, // 订单时间
        'order_state': '订单已完成',
        'order_content': this.shoppingCarList, // 购物车
        'order_brief_info': orderBriefInfo, // 简略信息
        'order_price': this.allTotalPrice // 总价
      }

      this.$store.dispatch('setOrder', order)
      this.$router.replace('/order')
    },
    // 修改版抛球效果，使用css3中的贝塞尔曲线实现
    ball_fly (e) {
      // 被点元素位置
      var bound = e.target.getBoundingClientRect()
      var boundTop = bound.top// 点击top值
      var boundLeft = bound.left// 点击left值
      // 目标元素位置
      var target = this.$refs.carIcon
      var targetData = target.getBoundingClientRect()
      var targetTop = targetData.top// 目标top值
      var targetLeft = targetData.left// 目标left值
      // 创建父球（父球横向运动）
      var father = document.createElement('div')
      father.className = 'father flyball'
      // 创建子球（子球垂直css3贝塞尔曲线运动，先上后下，得到抛球效果）
      var child = document.createElement('div')
      child.className = 'child inner'
      father.appendChild(child)
      // 设置父盒子生成的位置
      // father.style.cssText = 'top:' + boundTop + 'px;left:' + boundLeft + 'px;';
      father.style.top = boundTop + 'px'
      father.style.left = boundLeft + 'px'
      // append小球到页面中
      document.body.appendChild(father)
      setTimeout(() => {
        // 目标left - 所点元素left + 目标元素宽度的一半（修正落点）
        father.style.transform = 'translate3d(' + (targetLeft - boundLeft + targetData.width / 2) + 'px, 0px, 0px)'
        child.style.cssText = 'transform: translate3d(0px, ' + (targetTop - boundTop) + 'px, 0px);'
        // 运动结束后删掉小球
        setTimeout(() => {
          // 移除小球
          father.parentNode.removeChild(father)
          // 购物车添加弹弹弹的css
          this.$refs.carIcon.classList.add('tantantan')
        }, 500)
      }, 10)
    }
    // 生成小球抛出 计算left top 生成动画 不流畅 （css3的没想好）
    /* ball_fly (e) {
      // 被点元素宽高
      var bound = e.target.getBoundingClientRect(); // 被点元素位置
      // 创造元素
      var qiu = document.createElement('div');
      qiu.className = 'qiu';
      qiu.style.top = bound.top + 'px';
      qiu.style.left = bound.left + 'px';
      document.body.appendChild(qiu);
      // 目标元素位置
      var dsa = this.$refs.carIcon;
      var mubiao = dsa.getBoundingClientRect();
      var mubiaoT = mubiao.top;
      var mubiaoL = mubiao.left;
      var timer = null;
      // top差值 left差值
      var chaTop = mubiaoT - bound.top;
      // 要减掉目标宽度一半 让落点对准目标中心
      var chaLeft = bound.left - mubiaoL - dsa.offsetWidth / 2;
      // 规定上抛初速度为 top 差值的55分之1
      var g = chaTop / 55;
      // 规定上抛初速度为 top 差值的15分之1
      var vTop = chaTop / 15;
      timer = setInterval(() => {
        qiu.style.top = (qiu.getBoundingClientRect().top + (-vTop + g)) + 'px';
        qiu.style.left = (qiu.getBoundingClientRect().left + (-chaLeft / 14)) + 'px';
        // 每次 g 对速度的影响
        vTop -= g;
        if (qiu.getBoundingClientRect().top >= mubiaoT) {
          clearInterval(timer);
          qiu.parentNode.removeChild(qiu);
          this.$refs.carIcon.classList.add('tantantan');
        }
      }, 1000 / 25);
    } */
  }
}
</script>

<style lang="less">
@import "../css/business.less";

</style>
