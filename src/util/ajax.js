const fetch = url => {
  if (!window && wx.request) {
    return new Promise((resolve, reject) => {
      wx.request({
        url,
        success(res) {
          resolve(res.data);
        },
        fail() {
          reject('请求失败~');
        },
        error(e) {
          reject('请求出错了~');
        },
      });
    });
  }
  return window
    .fetch(url)
    .then(response => response.text())
    .then(str => str)
    .catch(err => err);
};

export default fetch;
