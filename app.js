//app.js
var Bmob = require('utils/bmob.js')
Bmob.initialize("8f4ec8d5087f2e0d33958189c0f888c9", "5347f17650576e065d6eb647d6e5a0fc");


App({
  onLaunch: function () {
    var user = new Bmob.User();//开始注册用户

    try
  {
    var newOpenid = wx.getStorageSync('openid')
    if (!newOpenid) {



console.log('get info')

    // wx.getUserInfo({
    //     success: function (result) {

    //       var userInfo = result.userInfo;
    //       var nickName = userInfo.nickName;
    //       var avatarUrl = userInfo.avatarUrl;


          wx.login({
            success: function (res) {
              user.loginWithWeapp(res.code).then(function (user) {


var userInfo;
          var nickName ;
          var avatarUrl ;
               
            

                var openid = user.get("authData").weapp.openid;
                console.log(user, 'user', user.id, res);

                if (user.get("nickName")) {
                  // 第二次访问
                  console.log(user.get("nickName"), 'res.get("nickName")');

                  wx.setStorageSync('openid', openid)
                } else {

                  var u = Bmob.Object.extend("_User");
                  var query = new Bmob.Query(u);
                  query.get(user.id, {
                    success: function (result) {
                      wx.setStorageSync('own', result.get("uid"));
                    },
                    error: function (result, error) {
                      console.log("查询失败");
                    }
                  });


                }

  wx.getUserInfo({
        success: function (result) {
          console.log(result);

           userInfo = result.userInfo;
 nickName = userInfo.nickName;
           avatarUrl = userInfo.avatarUrl;

                var u = Bmob.Object.extend("_User");
                var query = new Bmob.Query(u);
                // 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
                query.get(user.id, {
                  success: function (result) {
                    // 自动绑定之前的账号

                    result.set('nickName', nickName);
                    result.set("userPic", avatarUrl);
                    result.set("openid", openid);
                    result.save();

                  }
                });

                   }  });

                
              }, function (err) {
                console.log(err, 'errr');
              });

            }
          });
      //   }
      // });

    }
     }
catch(err)
  {
  //在这里处理错误
  console.log(err);
  }


  },
  getUserInfo: function (cb) {
    var that = this
    console.log('dd',cb);
    if (this.globalData.userInfo) {
      console.log('dd');
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      console.log('dd');
      //调用登录接口
      wx.login({
        success: function () {

          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null
  }
})