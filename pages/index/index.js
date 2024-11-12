// index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    token: '',
    imgSrc: '',
    baseData: '',
  },
   /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this;
    let grant_type = 'client_credentials';
    let client_id = 'JPixw3qJ7CCj4NDNLpH4zXKl';
    let client_secret = 'qCBQxds3WpWFJLj0bdUDs1mrbDbJZHW3';
    wx.request({
      url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=' + grant_type + '&client_id=' + client_id + '&client_secret=' + client_secret,
      method: 'post',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          token: res.data.access_token
        });
      }
    })
  },
  loadImage() {
    let that = this;
    wx.chooseImage({
      count: 0,
      sizeType: ['original', 'compressed'], //原图 / 压缩
      sourceType: ['album', 'camera'], //相册 / 相机拍照模式
      success(res) {
        that.setData({
          imgSrc: res.tempFilePaths[0]
        });
        //将图片转换为Base64格式
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0],
          encoding: 'base64',
          success(data) {
            let baseData = data.data; //'data:image/png;base64,' + data.data;
            that.setData({
              baseData: baseData
            });
          }
        });
      }
    })
  },
    //人脸检测
   //调用接口
  identify() {
    let that = this;
    let data = {image: that.data.baseData};
    wx.request({
      url: 'https://aip.baidubce.com/rest/2.0/image-process/v1/colourize?access_token=' + that.data.token,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: data,
      success: function (identify) {
        console.log(identify);
        that.setData({
          imgBase64: identify.data.image
        })
      }
    })
  },
  //保存图片
   downloadReport(){
    const that = this;
    var filepath = wx.env.USER_DATA_PATH+'/test.png';
    //获取文件管理器对象
    var aa = wx.getFileSystemManager();
    aa.writeFile({
        filePath: filepath,
        data: that.data.imgBase64,
        encoding:'base64',
        success: res => {
            wx.showLoading({
                title: '正在保存...',
                mask: true
            });
            //保存图片到相册
            wx.saveImageToPhotosAlbum({
                filePath: filepath,
                success: function (res) {
                    wx.hideLoading();
                    wx.showToast({
                        title: '保存成功！',
                        icon: 'success',
                        duration: 2000//持续的时间
                    })
                }
            })
        }, fail: err => {
            console.log(err)
        }
    })
},

})
