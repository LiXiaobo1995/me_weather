//index.js  
//获取应用实例  
//var util = require("../../utils/util.js");
var app = getApp()
Page({
  data: {

  },

  //当页面加载完成  
  onLoad: function () {
    var that = this;

    wx.getLocation({
      success: function (res) {
        var latitude = res.latitude;//纬度  
        var longitude = res.longitude;//经度
        that.City(latitude, longitude);//获取地点信息
        that.Weather(latitude, longitude);//获取实时天气
        that.Forecast(latitude, longitude);//获取天气预报
      },
    })
  },

  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },


  //下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    var that = this;
    that.image('福利', 5);
    wx.getLocation({
      success: function (res) {
        var latitude = res.latitude;//纬度  
        var longitude = res.longitude;//经度
        that.City(latitude, longitude);
        that.Weather(latitude, longitude);
        that.Forecast(latitude, longitude);
        that.setData({
          inputVal: ""
        });
      },
    })
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  
  //转发
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
    }

    return {
      title: 'me天气',
      path: 'pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  //城市输入框
  inputTyping: function (res) {
    var that = this;
    that.setData({
      inputVal: res.detail.value
    });
  },
  //搜索
  showInput: function (res) {
    var that = this;
    var tableID = 20078;
    var query = new wx.BaaS.Query();
    var cityname = that.data.inputVal;
    var query1 = query.contains('town', cityname);
    // 应用查询对象
    var Product = new wx.BaaS.TableObject(tableID);
    Product.setQuery(query1).find().then((res) => {
      // success
      var latitude = res.data.objects[0].Latitude;
      var longitude = res.data.objects[0].Longitude;
      that.City(latitude, longitude);
      that.Weather(latitude, longitude);
      that.Forecast(latitude, longitude);
    }, (err) => {
      // err
    })
  },
  //回车键搜索
  searchSubmit:function(res){
    var that = this;
    var tableID = 20078;
    var query = new wx.BaaS.Query();
    var cityname = that.data.inputVal;
    var query1 = query.contains('town', cityname);
    // 应用查询对象
    var Product = new wx.BaaS.TableObject(tableID);
    Product.setQuery(query1).find().then((res) => {
      // success
      var latitude = res.data.objects[0].Latitude;
      var longitude = res.data.objects[0].Longitude;
      that.City(latitude, longitude);
      that.Weather(latitude, longitude);
      that.Forecast(latitude, longitude);
    }, (err) => {
      // err
    })

  },

  //分类数据: http://gank.io/api/data/数据类型/请求个数/第几页
  //数据类型： 福利 | Android | iOS | 休息视频 | 拓展资源 | 前端 | all
  //请求个数： 数字，大于0
  //第几页：数字，大于0

  //每日数据： http://gank.io/api/day/年/月/日
  //http://gank.io/api/day/2015/08/06

  //随机数据：http://gank.io/api/random/data/分类/个数
  //数据类型：福利 | Android | iOS | 休息视频 | 拓展资源 | 前端
  //个数： 数字，大于0
  //http://gank.io/api/random/data/Android/20
  image(category, num) {

    var url = "https://gank.io/api/random/data/" + category + "/" + num + "";
    var that = this;

    wx.request({
      url: url,
      success: function (res) {
        var result = res.data.results;
        that.setData({
          result: result
        });
      }
    })
  },


  //获取实时天气信息彩云提供
  Weather(latitude, longitude) {

    var url = "https://api.caiyunapp.com/v2/EpRvwCDKns1LILYm/" + longitude + "," + latitude + "/realtime.json";
    var that = this;

    wx.request({
      url: url,
      success: function (res) {
        var aqi = res.data.result.aqi;  //空气质量
        var temperature = res.data.result.temperature;  //温度
        var skycon = res.data.result.skycon;  //天气状况
        var pm25 = res.data.result.pm25;  //pm2.5
        var humidity = res.data.result.humidity;//相对湿度
        var winddirection = res.data.result.wind.direction;//风向。单位是度。正北方向为0度，顺时针增加到360度
        var windspeed = res.data.result.wind.speed;//风速，米制下是公里每小时

        that.setData({
          aqi: aqi,
          temperature: temperature,
          skycon: skycon,
          pm25: pm25,
          humidity: humidity,
          winddirection: winddirection,
          windspeed: windspeed
        });
      }
    })
  },

  //获取天气预报彩云提供
  Forecast(latitude, longitude) {

    var url = "https://api.caiyunapp.com/v2/EpRvwCDKns1LILYm/" + longitude + "," + latitude + "/forecast.json";
    var that = this;

    wx.request({
      url: url,
      success: function (res) {

        var coldRisk = res.data.result.daily.coldRisk;  //感冒指数
        var daily_tem = res.data.result.daily.temperature;  //范围温度
        var daily_skycon = res.data.result.daily.skycon;  //五日天气
        var astro = res.data.result.daily.astro;  //日出日落时间
        var ultraviolet = res.data.result.daily.ultraviolet;  //紫外线强度
        var dressing = res.data.result.daily.dressing;  //穿衣指数
        var carWashing = res.data.result.daily.carWashing;  //洗车指数

        var hour_desc = res.data.result.hourly.description;//小时预告
        var hour_skycon = res.data.result.hourly.skycon;//小时天气
        var hour_tem = res.data.result.hourly.temperature;//小时温度
        var minute_desc = res.data.result.minutely.description;//分钟预告

        var hour = [];
        var day = [];
        for (var i = 0; i < hour_skycon.length; i++) {
          hour.push([hour_skycon[i].datetime, hour_skycon[i].value, hour_tem[i].value])
        }

        for (var i = 0; i < daily_skycon.length; i++) {
          day.push([daily_skycon[i].date, daily_skycon[i].value, daily_tem[i].min, daily_tem[i].max, daily_tem[i].avg])
        }


        that.setData({
          coldRisk: coldRisk,
          daily_tem: daily_tem,
          astro: astro,
          ultraviolet: ultraviolet,
          dressing: dressing,
          carWashing: carWashing,
          hour_desc: hour_desc,
          hour_skycon: hour_skycon,
          hour_tem: hour_tem,
          minute_desc: minute_desc,
          hour: hour,
          day: day,
        });
      }
    })
  },

  //获取城市名称
  City(latitude, longitude) {

    var url = "https://restapi.amap.com/v3/assistant/coordinate/convert?key=7823103d0de5d70d56c5b0b74798efec&locations=" + longitude + "," + latitude + "&coordsys=gps";
    var that = this;

    wx.request({
      url: url,
      success: function (res) {
        var locations_gd = res.data.locations;  //高德位置

        that.setData({
          locations_gd: locations_gd
        });
        that.getCity(locations_gd);
      }
    })
  },

  //获得城市的函数定义  
  getCity: function (locations_gd) {
    var url = "https://restapi.amap.com/v3/geocode/regeo?location=" + locations_gd + "&output=json&key=7823103d0de5d70d56c5b0b74798efec";

    var that = this;
    //发出请求获取数据  
    wx.request({
      url: url,
      success: function (res) {
        //var city = res.data.regeocode.addressComponent.city;
        var district = res.data.regeocode.addressComponent.district;
        var street = res.data.regeocode.addressComponent.streetNumber.street;
        that.setData({
          //city: city,
          district: district,
          street: street,
        });
      }
    })
  },

}) 