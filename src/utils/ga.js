//
// 谷歌统计 (Google Analytics) SDK 币安小程序专用
// Google Analytics SDK for Binance's Mini Program
//
// 项目地址： https://github.com/rchunping/bnapp-google-analytics
//
// 参考协议：https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters
// 参考Android SDK接口：https://developers.google.com/analytics/devguides/collection/android/v4/
//

function GoogleAnalyticsFnc(app) {
  this.app = app //小程序App实例
  this.systemInfo = getSystemInfo()
  this.trackers = [] //可以有多个跟踪器，第一个为默认跟踪器
  this.appName = 'Mini Program'
  this.appVersion = 'unknow'
  this.log = true // enable console.log

  //console.log(this.systemInfo);

  var cidKey = '_ga_cid' // 存用户身份(UUID)

  var cid = bn.getStorageSync(cidKey) || false
  if (!cid) {
    cid = getUUID()
    bn.setStorageSync(cidKey, cid)
  }
  this.cid = cid
  this.userAgent = buildUserAgentFromSystemInfo(this.systemInfo)
  var pixelRatio = this.systemInfo.pixelRatio
  this.sr = param_screen_fix(
    Math.round(this.systemInfo.windowWidth * pixelRatio),
    Math.round(this.systemInfo.windowHeight * pixelRatio),
    this.systemInfo,
  )
  this.vp = [this.systemInfo.windowWidth, this.systemInfo.windowHeight]
    .map(function (x) {
      return x /*Math.floor(x)*/
    })
    .join('x')
}
GoogleAnalyticsFnc.prototype.setAppName = function (appName) {
  this.appName = appName
  return this
}
GoogleAnalyticsFnc.prototype.setAppVersion = function (appVersion) {
  this.appVersion = appVersion
  return this
}

GoogleAnalyticsFnc.prototype.getDefaultTracker = function () {
  return this.trackers[0]
}
GoogleAnalyticsFnc.prototype.newTracker = function (trackingID) {
  var t = new Tracker(this, trackingID)
  this.trackers.push(t)
  return t
}
GoogleAnalyticsFnc.prototype.setLog = function (flag) {
  this.log = !!flag
  return this
}

// 支持Measurement Protocol“&”符号语法
// 兼容兼容Android SDK中 .set('&uid','value') 的写法
function hit_param_fix(paramName) {
  return String(paramName).replace(/^&/, '')
}

function Tracker(ga, tid) {
  this.ga = ga
  this.trackerServer = 'https://www.google-analytics.com'
  this.hit = {
    tid: tid || '', // tracking Id
    cd: '', // screenName
  }
  this.next_hit = {} // 下一个hit需要设置的参数

  this.sending = false //数据发送状态
  this.send_queue = [] //发送队列
}
// 设置自定义的跟踪服务器地址，默认是 https://www.google-analytics.com
Tracker.prototype.setTrackerServer = function (server) {
  this.trackerServer = server
  return this
}
Tracker.prototype.get = function (key) {
  return this.hit[hit_param_fix(key)]
}
Tracker.prototype.set = function (key, value) {
  this.hit[hit_param_fix(key)] = value
  return this
}
// @param bool
Tracker.prototype.setAnonymizeIp = function (anonymize) {
  return this.set('aip', anonymize ? 1 : 0)
}
Tracker.prototype.setAppId = function (appId) {
  return this.set('aid', appId)
}
Tracker.prototype.setAppInstallerId = function (appInstallerId) {
  return this.set('aiid', appInstallerId)
}
Tracker.prototype.setAppName = function (appName) {
  return this.set('an', appName)
}
Tracker.prototype.setAppVersion = function (appVersion) {
  return this.set('av', appVersion)
}
// Includes the campaign parameters contained in the URI referrer in the next hit.
// @param String
Tracker.prototype.setCampaignParamsOnNextHit = function (uri) {
  var hit = parseUtmParams(uri)
  this.next_hit = {} //clear previous one
  for (var k in hit) {
    this.next_hit[k] = hit[k]
  }
  return this
}

// 一般是UUID
Tracker.prototype.setClientId = function (clientId) {
  return this.set('cid', clientId)
}
Tracker.prototype.setEncoding = function (encoding) {
  return this.set('de', encoding)
}
Tracker.prototype.setLanguage = function (language) {
  return this.set('ul', language)
}
// 两个字母的国家代号，比如CN,US... 或者地理位置ID
// https://developers.google.com/analytics/devguides/collection/protocol/v1/geoid
Tracker.prototype.setLocation = function (location) {
  return this.set('geoid', location)
}
// e.g. 24-bit
Tracker.prototype.setScreenColors = function (screenColors) {
  return this.set('sd', screenColors)
}
Tracker.prototype.setScreenName = function (screenName) {
  return this.set('cd', screenName)
}
Tracker.prototype.setScreenResolution = function (width, height) {
  return this.set('sr', [width, height].join('x'))
}
Tracker.prototype.setViewportSize = function (viewportSize) {
  return this.set('vp', viewportSize)
}
// @param Map<String,String> hit
Tracker.prototype.send = function (hit) {
  this.send_queue_push(this.ga, hit)
  return this
}
// 小程序最多只有5个并发网络请求，使用队列方式尽量不过多占用请求
Tracker.prototype.send_queue_push = function (ga, hit) {
  var t = this

  // 默认基础字段
  var data = {
    v: 1,
    //tid: t.hit.tid,
    cid: ga.cid,
    ds: 'app',
    ul: ga.systemInfo.language,
    de: 'UTF-8',
    sd: '24-bit',
    je: 0,
    //cd: t.hit.cd,//screenName
    an: ga.appName,
    av: ga.appVersion,
    sr: ga.sr,
    vp: ga.vp,
    ua: ga.userAgent,
  }

  // 合并Tracker上的参数
  for (var k in t.hit) {
    data[k] = t.hit[k]
  }
  // Tracker上有预设的单次发送数据
  for (var k in t.next_hit) {
    data[k] = t.next_hit[k]
  }
  t.next_hit = {} // clear

  // 合并Builder上的参数
  for (var k in hit) {
    data[k] = hit[k]
  }

  this.ga.log && console.log(['ga.queue.push', data])

  this.send_queue.push([data, new Date()])

  this._do_send()
}
Tracker.prototype._do_send = function () {
  if (this.sending) {
    return
  }

  if (this.send_queue.length <= 0) {
    this.sending = false
    return
  }

  this.sending = true
  var that = this

  var payloadEncoder = function (data) {
    var s = []
    for (var k in data) {
      s.push([encodeURIComponent(k), encodeURIComponent(data[k])].join('='))
    }
    return s.join('&')
  }

  var payloads = []
  while (this.send_queue.length > 0) {
    var sd = this.send_queue[0]
    var data = sd[0]
    data.qt = new Date().getTime() - sd[1].getTime() // 数据发生和发送的时间差，单位毫秒
    data.z = Math.floor(Math.random() * 2147483648)

    var payload = payloadEncoder(data)
    var old_len = payloads
      .map(function (a) {
        return a.length
      })
      .reduce(function (a, b) {
        return a + b
      }, 0)
    var add_len = payload.length

    // 批量上报有限制
    // 1. 单条8K
    // 2. 总共16K
    // 3. 最多20条
    if (old_len + add_len > 16 * 1024 || add_len > 8 * 1024 || payloads.length >= 20) {
      // 但是要保证至少有单次上报的数据
      if (payloads.length > 0) {
        break
      }
    }

    payloads.push(payload)
    this.send_queue.shift()

    this.ga.log && console.log(['ga.queue.presend[' + (payloads.length - 1) + ']', data])
  }

  var payloadData = payloads.join('\r\n')

  var apiUrl = this.trackerServer + '/collect'
  if (payloads.length > 1) {
    this.ga.log && console.log(['ga.queue.send.batch', payloadData])
    //使用批量上报接口
    apiUrl = this.trackerServer + '/batch'
  } else {
    this.ga.log && console.log(['ga.queue.send.collect', payloadData])
  }
  bn.request({
    url: apiUrl,
    data: payloadData,
    method: 'POST',
    header: {
      'content-type': 'text/plain', //"application/x-www-form-urlencoded"
    },
    success: function (res) {
      // success
      that.ga.log && console.log(['ga:success', res])
    },
    fail: function (res) {
      // fail
      that.ga.log && console.log(['ga:failed', res])
    },
    complete: function () {
      // complete
      that.sending = false
      setTimeout(function () {
        that._do_send()
      }, 0)
    },
  })
}

// HitBuilder [基础类]
function HitBuilder() {
  this.hit = {
    t: 'screenview', // default HitType
    ni: 0, // [nonInteraction] default: 0
  }
  this.custom_dimensions = []
  this.custom_metrics = []

  this.next_impression_index = 1 // max 200
  this.impression_product_list = {} // Map<impressionName,[impression_index,next_product_index]>
  this.next_product_index = 1 // max 200
  this.next_promotion_index = 1 // max 200
}

HitBuilder.prototype.get = function (paramName) {
  return this.hit[hit_param_fix(paramName)]
}
HitBuilder.prototype.set = function (paramName, paramValue) {
  this.hit[hit_param_fix(paramName)] = paramValue
  return this
}
// @param Map<String,String> params
HitBuilder.prototype.setAll = function (params) {
  for (var k in params) {
    this.set(k, params[k])
  }
  return this
}

// @param Product product
// @param String impressionList
HitBuilder.prototype.addImpression = function (product, impressionList) {
  if (!this.impression_product_list[impressionList]) {
    this.impression_product_list[impressionList] = [this.next_impression_index, 1]
    // 新的展示列表名字 il<impIndex>nm
    this.set('il' + this.next_impression_index + 'nm', impressionList)
    this.next_impression_index++
  }
  var impIndex = this.impression_product_list[impressionList][0]
  var prdIndex = this.impression_product_list[impressionList][1]

  for (var k in product.hit) {
    // il<impIndex>pi<prdIndex>XX
    this.set('il' + impIndex + 'pi' + prdIndex + k, product.hit[k])
  }

  // incr prdIndex
  this.impression_product_list[impressionList][1] = prdIndex + 1

  return this
}
// @param Product
HitBuilder.prototype.addProduct = function (product) {
  var prdIndex = this.next_product_index

  for (var k in product.hit) {
    // pr<prdIndex>XX
    this.set('pr' + prdIndex + k, product.hit[k])
  }

  this.next_product_index++
  return this
}
// @param Promotion
HitBuilder.prototype.addPromotion = function (promotion) {
  var promIndex = this.next_promotion_index

  for (var k in promotion.hit) {
    // promo<promIndex>XX
    this.set('promo' + promIndex + k, promotion.hit[k])
  }

  this.next_promotion_index++
  return this
}
// @param ProductAction
HitBuilder.prototype.setProductAction = function (action) {
  for (var k in action.hit) {
    this.set(k, action.hit[k])
  }
  return this
}
// @param String default: view
HitBuilder.prototype.setPromotionAction = function (action) {
  return this.set('promoa', action)
}
// Parses and translates utm campaign parameters to analytics campaign parameters and returns them as a map.
// @param String url
HitBuilder.prototype.setCampaignParamsFromUrl = function (url) {
  var hit = parseUtmParams(url)
  return this.setAll(hit)
}

// @param int index >= 1
// @param String dimension
HitBuilder.prototype.setCustomDimension = function (index, dimension) {
  this.custom_dimensions.push([index, dimension])
  return this
}
// @param int index >= 1
// @param float metric
HitBuilder.prototype.setCustomMetric = function (index, metric) {
  this.custom_metrics.push([index, metric])
  return this
}
// 新开session
HitBuilder.prototype.setNewSession = function () {
  this.hit.sc = 'start'
  return this
}
// 结束session
HitBuilder.prototype.setEndSession = function () {
  this.hit.sc = 'end'
  return this
}
// 非互动匹配
// @papam bool
HitBuilder.prototype.setNonInteraction = function (nonInteraction) {
  this.hit.ni = nonInteraction ? 1 : 0
  return this
}
// @param String hitType
HitBuilder.prototype.setHitType = function (hitType) {
  this.hit.t = hitType
  return this
}

// @return Map<String,String>
HitBuilder.prototype.build = function () {
  var that = this
  var i
  var del_keys = [] // 需要删除的无效字段

  if (this.hit.ni == 0) {
    del_keys.push('ni')
  }

  // 清理旧的cd<index> ,cm<index>
  for (var k in this.hit) {
    if (k.match(/^(cd|cm)\d+$/)) {
      del_keys.push(k)
    }
  }

  // 删除无效字段
  del_keys.map(function (k) {
    delete that.hit[k]
  })

  // 处理自定义维度和指标
  var cd_arr = this.custom_dimensions
  var cm_arr = this.custom_metrics

  for (i = 0; i < cd_arr.length; i++) {
    var cd = cd_arr[i]
    this.hit['cd' + cd[0]] = cd[1]
  }

  for (i = 0; i < cm_arr.length; i++) {
    var cm = cm_arr[i]
    this.hit['cm' + cm[0]] = cm[1]
  }

  return this.hit
}

// 用来删除一些无效的可选参数
function hit_delete_if(hitbuilder, paramName, condValue) {
  if (hitbuilder.hit[paramName] == condValue) {
    delete hitbuilder.hit[paramName]
  }
}

// ScreenView
function ScreenViewBuilder() {
  HitBuilder.call(this)
  this.setHitType('screenview')
}
ScreenViewBuilder.prototype = Object.create(HitBuilder.prototype)
ScreenViewBuilder.prototype.constructor = ScreenViewBuilder
ScreenViewBuilder.prototype.build = function () {
  return HitBuilder.prototype.build.apply(this, arguments)
}
// Event
function EventBuilder() {
  HitBuilder.call(this)
  this.setHitType('event')
  this.setAll({
    ec: '', // category
    ea: '', // action
    el: '', // [label]
    ev: 0, // [value]
  })
}
EventBuilder.prototype = Object.create(HitBuilder.prototype)
EventBuilder.prototype.constructor = EventBuilder

EventBuilder.prototype.setCategory = function (category) {
  return this.set('ec', category)
}
EventBuilder.prototype.setAction = function (action) {
  return this.set('ea', action)
}
EventBuilder.prototype.setLabel = function (label) {
  return this.set('el', label)
}
// @param int
EventBuilder.prototype.setValue = function (value) {
  return this.set('ev', value)
}
EventBuilder.prototype.build = function () {
  // 去除无效字段字段
  hit_delete_if(this, 'ev', 0)
  hit_delete_if(this, 'el', '')

  return HitBuilder.prototype.build.apply(this, arguments)
}
// Social
// @Deprecated
function SocialBuilder() {
  HitBuilder.call(this)
  this.setHitType('social')
  this.setAll({
    sn: '', // network
    sa: '', // action
    st: '', // [target]
  })
}
SocialBuilder.prototype = Object.create(HitBuilder.prototype)
SocialBuilder.prototype.constructor = SocialBuilder
SocialBuilder.prototype.setNetwork = function (network) {
  return this.set('sn', network)
}
SocialBuilder.prototype.setAction = function (action) {
  return this.set('sa', action)
}
SocialBuilder.prototype.setTarget = function (target) {
  return this.set('st', target)
}
SocialBuilder.prototype.build = function () {
  hit_delete_if(this, 'st', '')

  return HitBuilder.prototype.build.apply(this, arguments)
}
// Exception
function ExceptionBuilder() {
  HitBuilder.call(this)
  this.setHitType('exception')
  this.setAll({
    exd: '', // description
    exf: 1, // is_fatal, default:1
  })
}
ExceptionBuilder.prototype = Object.create(HitBuilder.prototype)
ExceptionBuilder.prototype.constructor = ExceptionBuilder
ExceptionBuilder.prototype.setDescription = function (description) {
  return this.set('exd', description)
}
// @param bool is_fatal
ExceptionBuilder.prototype.setFatal = function (is_fatal) {
  return this.set('exf', is_fatal ? 1 : 0)
}

// Timing
function TimingBuilder() {
  HitBuilder.call(this)
  this.setHitType('timing')
  this.setAll({
    utc: '', // category
    utv: '', // variable
    utt: 0, // value
    utl: '', // [label]
  })
}
TimingBuilder.prototype = Object.create(HitBuilder.prototype)
TimingBuilder.prototype.constructor = TimingBuilder
TimingBuilder.prototype.setCategory = function (category) {
  return this.set('utc', category)
}
TimingBuilder.prototype.setVariable = function (variable) {
  return this.set('utv', variable)
}
// @param long 单位：毫秒
TimingBuilder.prototype.setValue = function (value) {
  return this.set('utt', value)
}
TimingBuilder.prototype.setLabel = function (label) {
  return this.set('utl', label)
}
TimingBuilder.prototype.build = function () {
  hit_delete_if(this, 'utl', '')

  return HitBuilder.prototype.build.apply(this, arguments)
}

// ecommerce 增强型电子商务相关相关
// Product
function Product() {
  this.hit = {}
}
Product.prototype.setBrand = function (brand) {
  this.hit['br'] = brand
  return this
}
Product.prototype.setCategory = function (category) {
  this.hit['ca'] = category
  return this
}
Product.prototype.setCouponCode = function (couponCode) {
  this.hit['cc'] = couponCode
  return this
}
// @param int index
// @param String value
Product.prototype.setCustomDimension = function (index, value) {
  this.hit['cd' + index] = value
  return this
}
// @param int index
// @param double value
Product.prototype.setCustomMetric = function (index, value) {
  this.hit['cm' + index] = value
  return this
}
// Product SKU
// @param String id
Product.prototype.setId = function (id) {
  this.hit['id'] = id
  return this
}
// @param String name
Product.prototype.setName = function (name) {
  this.hit['nm'] = name
  return this
}
// 产品在列表中的位置 1-200
// @param int position
Product.prototype.setPosition = function (position) {
  this.hit['ps'] = position
  return this
}
// @param double price
Product.prototype.setPrice = function (price) {
  this.hit['pr'] = price
  return this
}
// @param int
Product.prototype.setQuantity = function (quantity) {
  this.hit['qt'] = quantity
  return this
}
// 产品款式款式
// @param String
Product.prototype.setVariant = function (variant) {
  this.hit['va'] = variant
  return this
}

// 活动促销类 Promotion
function Promotion() {
  this.hit = {}
}
Promotion.ACTION_CLICK = 'click'
Promotion.ACTION_VIEW = 'view'
// @param String
Promotion.prototype.setCreative = function (creative) {
  this.hit['cr'] = creative
  return this
}
// @param String
Promotion.prototype.setId = function (id) {
  this.hit['id'] = id
  return this
}
// @param String
Promotion.prototype.setName = function (name) {
  this.hit['nm'] = name
  return this
}
// @param String
Promotion.prototype.setPosition = function (positionName) {
  this.hit['ps'] = positionName
  return this
}

// 产品操作 ProductAction
function ProductAction(action) {
  this.hit = {
    pa: action, // action : ACTION_XXXX
  }
}
ProductAction.ACTION_ADD = 'add'
ProductAction.ACTION_CHECKOUT = 'checkout'
ProductAction.ACTION_CHECKOUT_OPTION = 'checkout_option'
// @Deprecated use ACTION_CHECKOUT_OPTION
// ProductAction.ACTION_CHECKOUT_OPTIONS = "checkout_options";
ProductAction.ACTION_CLICK = 'click'
ProductAction.ACTION_DETAIL = 'detail'
ProductAction.ACTION_PURCHASE = 'purchase'
ProductAction.ACTION_REFUND = 'refund'
ProductAction.ACTION_REMOVE = 'remove'

// @param String
ProductAction.prototype.setCheckoutOptions = function (options) {
  this.hit['col'] = options
  return this
}
// @param int
ProductAction.prototype.setCheckoutStep = function (step) {
  this.hit['cos'] = step
  return this
}
// @param String
ProductAction.prototype.setProductActionList = function (productActionList) {
  this.hit['pal'] = productActionList
  return this
}
// @param String
ProductAction.prototype.setProductListSource = function (productListSource) {
  // NOTE: 查不到协议字段名,但是Android SDK中查到是pls
  this.hit['pls'] = productListSource
  return this
}
// @param String 交易关联公司
ProductAction.prototype.setTransactionAffiliation = function (transactionAffiliation) {
  this.hit['ta'] = transactionAffiliation
  return this
}
// @param String 在交易中使用的优惠券
ProductAction.prototype.setTransactionCouponCode = function (transactionCouponCode) {
  this.hit['tcc'] = transactionCouponCode
  return this
}
// @param String
ProductAction.prototype.setTransactionId = function (transactionId) {
  this.hit['ti'] = transactionId
  return this
}
// @param double  交易收入，指总收入：此值应包含所有运费或税费。
ProductAction.prototype.setTransactionRevenue = function (revenue) {
  this.hit['tr'] = revenue
  return this
}
// @param double 交易运费
ProductAction.prototype.setTransactionShipping = function (shipping) {
  this.hit['ts'] = shipping
  return this
}
// @param double 交易税费
ProductAction.prototype.setTransactionTax = function (tax) {
  this.hit['tt'] = tax
  return this
}

// 微信小程序相关的辅助类类
function CampaignParams() {
  this.params = {}
  this.params_map = {
    utm_source: 'cs',
    utm_medium: 'cm',
    utm_term: 'ck',
    utm_content: 'cc',
    utm_campaign: 'cn',
    gclid: 'gclid',
  }
}
CampaignParams.prototype.set = function (paramName, paramValue) {
  if (paramName in this.params_map) {
    this.params[paramName] = paramValue
  }
  return this
}
// 转换成广告推广连接,形式： https://example.com?utm_XXXX=xxxx&utm_YYYY=yyyy
CampaignParams.prototype.toUrl = function () {
  var kv = []
  for (var k in this.params) {
    kv.push([encodeURIComponent(k), encodeURIComponent(this.params[k])].join('='))
  }

  return 'https://example.com?' + kv.join('&')
}
// 从微信小程序Page.onLoad(options) 中解析path中的参数
// @param Map<String,String> options
// @param Map<String,String> map 参数映射关系，把其他名字的参数映射到utm_xxxx的形式
CampaignParams.parseFromPageOptions = function (options, map) {
  options = options || {}
  map = map || {}

  var cp = new CampaignParams()

  var kv = []

  for (var k in options) {
    var v = options[k]
    if (k in map) {
      k = map[k]
    }
    if (k.match(/^utm_/) || k == 'gclid') {
      cp.set(k, v)
    }
  }
  //console.log(cp);

  return cp
}
// 从微信小程序场景值生成
// @param int scene
CampaignParams.buildFromWeappScene = function (scene) {
  var scenemap = {
    1001: '发现栏小程序主入口',
    1005: '顶部搜索框的搜索结果页',
    1006: '发现栏小程序主入口搜索框的搜索结果页',
    1007: '单人聊天会话中的小程序消息卡片',
    1008: '群聊会话中的小程序消息卡片',
    1011: '扫描二维码',
    1012: '长按图片识别二维码',
    1013: '手机相册选取二维码',
    1014: '小程序模版消息',
    1017: '前往体验版的入口页',
    1019: '微信钱包',
    1020: '公众号profile页相关小程序列表',
    1022: '聊天顶部置顶小程序入口',
    1023: '安卓系统桌面图标',
    1024: '小程序profile页',
    1025: '扫描一维码',
    1026: '附近小程序列表',
    1027: '顶部搜索框搜索结果页“使用过的小程序”列表',
    1028: '我的卡包',
    1029: '卡券详情页',
    1030: '自动化测试下打开小程序',
    1031: '长按图片识别一维码',
    1032: '手机相册选取一维码',
    1034: '微信支付完成页',
    1035: '公众号自定义菜单',
    1036: 'App 分享消息卡片',
    1037: '小程序打开小程序',
    1038: '从另一个小程序返回',
    1039: '摇电视',
    1042: '添加好友搜索框的搜索结果页',
    1043: '公众号模板消息',
    1044: '带shareTicket的小程序消息卡片',
    1045: '朋友圈广告',
    1046: '朋友圈广告详情页',
    1047: '扫描小程序码',
    1048: '长按图片识别小程序码',
    1049: '手机相册选取小程序码',
    1052: '卡券的适用门店列表',
    1053: '搜一搜的结果页',
    1054: '顶部搜索框小程序快捷入口',
    1056: '音乐播放器菜单',
    1057: '钱包中的银行卡详情页',
    1058: '公众号文章',
    1059: '体验版小程序绑定邀请页',
    1064: '微信连Wifi状态栏',
    1067: '公众号文章广告',
    1068: '附近小程序列表广告',
    1069: '移动应用',
    1071: '钱包中的银行卡列表页',
    1072: '二维码收款页面',
    1073: '客服消息列表下发的小程序消息卡片',
    1074: '公众号会话下发的小程序消息卡片',
    1077: '摇周边',
    1078: '连Wi-Fi成功页',
    1079: '微信游戏中心',
    1081: '客服消息下发的文字链',
    1082: '公众号会话下发的文字链',
    1084: '朋友圈广告原生页',
    1089: '微信聊天主界面下拉',
    1090: '长按小程序右上角菜单唤出最近使用历史',
    1091: '公众号文章商品卡片',
    1092: '城市服务入口',
    1095: '小程序广告组件',
    1096: '聊天记录',
    1097: '微信支付签约页',
    1099: '页面内嵌插件',
    1102: '公众号 profile 页服务预览',
    1103: '发现栏小程序主入口，「我的小程序」列表（基础库2.2.4版本起废弃）',
    1104: '微信聊天主界面下拉，「我的小程序」栏（基础库2.2.4版本起废弃）',
    1106: '聊天主界面下拉，从顶部搜索结果页，打开小程序',
    1107: '订阅消息，打开小程序',
    1113: '安卓手机负一屏，打开小程序（三星）',
    1114: '安卓手机侧边栏，打开小程序（三星）',
    1124: '扫“一物一码”打开小程序',
    1125: '长按图片识别“一物一码”',
    1126: '扫描手机相册中选取的“一物一码”',
    1129: '微信爬虫访问',
    1131: '浮窗打开小程序',
    1133: '硬件设备打开小程序',
    1135: '小程序 profile 页其他小程序列表，打开小程序',
    1146: '地理位置信息打开出行类小程序',
    1148: '卡包-交通卡，打开小程序',
    1150: '扫一扫商品条码结果页打开小程序',
    1153: '“识物”结果页打开小程序',
    1154: '朋友圈内打开“单页模式”',
    1155: '“单页模式”打开小程序',
    1158: '群工具打开小程序',
    1167: 'H5 通过开放标签打开小程序',
    1169: '发现栏小程序主入口，各个生活服务入口（例如快递服务、出行服务等）',
  }

  var cp = new CampaignParams()

  if (scene in scenemap) {
    cp.set('utm_source', '小程序场景')
    cp.set('utm_medium', scene + ':' + scenemap[scene])
  } else if (scene) {
    cp.set('utm_source', '小程序场景')
    cp.set('utm_medium', scene + ':')
  }
  //console.log(cp);

  return cp
}
CampaignParams.parseFromUrl = function (url) {
  var queryString = url.replace(/^[^?]+\?/, '')
  var hit = {}
  var cp = new CampaignParams()
  var map = cp.params_map

  queryString.split('&').map(function (a) {
    var kv = a.split('=')
    var k = decodeURIComponent(kv[0])
    if (kv.length != 2 || kv[1] === '' || !map[k]) return
    var v = decodeURIComponent(kv[1])
    cp.set(k, v)
  })

  return cp
}

// 一些工具函数
function getUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function buildUserAgentFromSystemInfo(si) {
  var isAndroid = si.system.toLowerCase().indexOf('android') > -1
  var isIPad = !isAndroid && si.model.toLowerCase().indexOf('iphone') == -1
  //console.log([isAndroid, isIPad]);
  if (isAndroid) {
    return (
      'Mozilla/5.0 (Linux; U; ' +
      si.system +
      '; ' +
      si.model +
      ' Build/000000) AppleWebKit/537.36 (KHTML, like Gecko)Version/4.0 Chrome/49.0.0.0 Mobile Safari/537.36 MicroMessenger/' +
      si.version
    )
  } else if (!isIPad) {
    // iOS
    var v = si.system
      .replace(/^.*?([0-9.]+).*?$/, function (x, y) {
        return y
      })
      .replace(/\./g, '_')
    return (
      'Mozilla/5.0 (iPhone; CPU iPhone OS ' +
      v +
      ' like Mac OS X) AppleWebKit/602.3.12 (KHTML, like Gecko) Mobile/14C92 MicroMessenger/' +
      si.version
    )
  } else {
    // iPad
    var v = si.system
      .replace(/^.*?([0-9.]+).*?$/, function (x, y) {
        return y
      })
      .replace(/\./g, '_')
    return (
      'Mozilla/5.0 (iPad; CPU OS ' +
      v +
      ' like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Mobile/10A406 MicroMessenger/' +
      si.version
    )
  }
}

// Parses and translates utm campaign parameters to analytics campaign parameters and returns them as a map.
// @param String  Example: http://examplepetstore.com/index.html?utm_source=email&utm_medium=email_marketing&utm_campaign=summer&utm_content=email_variation_1
function parseUtmParams(url) {
  var cp = CampaignParams.parseFromUrl(url)
  var map = cp.params_map
  var hit = {}
  for (var k in cp.params) {
    hit[map[k]] = cp.params[k]
  }
  return hit
}

function param_screen_fix(w, h, si) {
  var isAndroid = si.system.toLowerCase().indexOf('android') > -1
  var isIPad = !isAndroid && si.model.toLowerCase().indexOf('iphone') == -1
  // TODO: 修正常见机型的分辨率
  return [w, h].join('x')
}

function getInstance(app) {
  //必须要App实例
  //if (typeof app.getCurrentPage != 'function') {
  //    var e = "Fatal Error: GoogleAnalytics.getInstance(app): The argument must be instanceof App!";
  //    console.log(e);
  //    throw e;
  //}
  app = app || {}
  if (!app.defaultGoogleAnalyticsInstance) {
    app.defaultGoogleAnalyticsInstance = new GoogleAnalyticsFnc(app)
  }
  return app.defaultGoogleAnalyticsInstance
}

var getSystemInfo = function () {
  if (typeof bn == 'object' && typeof bn.getSystemInfoSync == 'function') {
    return bn.getSystemInfoSync()
  }
  // default
  return {
    brand: 'unknow',
    screenWidth: 0,
    screenHeight: 0,
    windowWidth: 0,
    windowHeight: 0,
    pixelRatio: 1,
    language: 'zh_CN',
    system: 'unknow',
    model: 'unknow',
    version: 'unknow',
    platform: 'unknow',
    fontSizeSetting: 0,
    SDKVersion: 'unknow',
  }
}
const GoogleAnalytics = {
  getInstance: getInstance,
}
const HitBuilders = {
  HitBuilder: HitBuilder,
  ScreenViewBuilder: ScreenViewBuilder,
  EventBuilder: EventBuilder,
  SocialBuilder: SocialBuilder,
  ExceptionBuilder: ExceptionBuilder,
  TimingBuilder: TimingBuilder,
}
export {
  GoogleAnalytics,
  HitBuilders,
  // ecommerce 电子商务类
  Product,
  ProductAction,
  Promotion,
  // 广告系列参数辅助类
  CampaignParams,
}
