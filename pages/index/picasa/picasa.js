// pages/other/other.js
var that;
var Bmob = require('../../../utils/bmob.js');
var common = require('../../../utils/common.js');
Page({
  data: {
    urlArr: {},
    loading: false
  },
  onLoad: function (e) {
    console.log(e.id);

    this.setData({
      id: e.id,

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
  delImg: function () {//图片删除
    var path;
    //删除第一张
    path = this.data.urlArr[0].url;
    var s = new Bmob.Files.del(path).then(function (res) {
      if (res.msg == "ok") {
        console.log('删除成功');
        common.showModal("删除成功");
      }
      console.log(res);
    }, function (error) {
      console.log(error)
    }
    );


  },
  upImg: function () {
    var that = this;
    var id = this.data.id;
    console.log(id);
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        that.setData({
          loading: false
        })
        var urlArr = new Array();
        // var urlArr={};
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths)
        var imgLength = tempFilePaths.length;
        if (imgLength > 0) {
          var newDate = new Date();
          var newDateStr = newDate.toLocaleDateString();

          for (var i = 0; i < imgLength; i++) {
            console.log(i);
            var tempFilePath = [tempFilePaths[i]];
            var extension = /\.([^.]*)$/.exec(tempFilePath[0]);
            if (extension) {
              extension = extension[1].toLowerCase();
            }
            var name = newDateStr + "." + extension;//上传的图片的别名      

            var file = new Bmob.File(name, tempFilePath);
            file.save().then(function (res) {
              var url = res.url();
              console.log("第" + i + "张Url" + url);

              urlArr.push({ "url": url });
              that.setData({
                loading: true,
                urlArr: urlArr
              })

              var Diary = Bmob.Object.extend("photo");
              var diary = new Diary();

              var album = Bmob.Object.extend("album");
              var albumQuery = new album();
              albumQuery.id = id;
              diary.set("pid", albumQuery);
              diary.set("sorts", 9);
              diary.set("pic_url", res);
              // console.log(file, res, 'ssss')


              //添加数据，第一个入口参数是null
              diary.save(null, {
                success: function (result) {
                  // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
                  // console.log("日记创建成功, objectId:" + result.id);
                },
                error: function (result, error) {
                  // 添加失败
                  console.log('创建日记失败');

                }
              });

            }, function (error) {
              console.log(error)
            });

          }



          //如果你突然发现这个文件传了又想立即删了，可以直接执行
          // file.destroy();
        }

      }
    })
  }
})