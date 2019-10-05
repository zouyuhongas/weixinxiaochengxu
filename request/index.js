
// 1 同时发送异步请求的次数
let requestTimes = 0;

/**
 * promise 形式的 异步代码
 * @param {object} params 请求的参数
 */

export const request = (params) => {
  /* 
  1 自己判断要不要带token  从 url上来判断 有没有 /my/
   */

  let header = { ...params.header };
  //  if(params.url.indexOf())
  if (params.url.includes("/my/")) {
    // “”.indexOf('')
    header["Authorization"] = wx.getStorageSync("token");
  }


  // 2 发送了几次 被递增几个 
  requestTimes++;
  wx.showLoading({
    title: "加载中",
    // 遮罩层  true-> 用户无法再次点击 屏幕 
    mask: true
  });

  // 1 公共的url
  const baseUrl = "https://api.zbztb.cn/api/public/v1";
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      url: baseUrl + params.url,
      header,
      // header:{...header,...params.header},
      success: (result) => {
        // resolve(result);
        // console.log(result);
        if (result.data.meta && result.data.meta.status === 200) {
          resolve(result.data.message);
        } else {
          reject(result);
        }
      },
      fail: (err) => {
        reject(err);
      },
      complete: () => {
        // console.log(requestTimes);
        requestTimes--;
        requestTimes === 0 && wx.hideLoading();
        // if(requestTimes===0){
        //   console.log(requestTimes);
        //   wx.hideLoading();
        // }

      }
    });
  })
}


/**
 * promise 形式的 getSetting
 */
export const getSetting = () => {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: (result) => {
        resolve(result)
      },
      fail: (err) => {
        reject(err);
      }
    });

  })
}

/**
 * promise 形式的 openSetting
 */
export const openSetting = () => {
  return new Promise((resolve, reject) => {
    wx.openSetting({
      success: (result) => {
        resolve(result)
      },
      fail: (err) => {
        reject(err);
      }
    });

  })
}

/**
 * promise 形式的 chooseAddress
 */
export const chooseAddress = () => {
  return new Promise((resolve, reject) => {
    wx.chooseAddress({
      success: (result) => {
        resolve(result)
      },
      fail: (err) => {
        reject(err);
      }
    });

  })
}

export const showModal = (params) => {
  return new Promise((resolve, reject) => {
    wx.showModal({
      ...params,
      success(res) {
        resolve(res.confirm);
      }
    })
  })
}

export const showToast = (params) => {
  return new Promise((resolve, reject) => {
    wx.showToast({
      ...params,
      success: (result) => {
        resolve(result);
      }
    });
  })
}


export const login = (params) => {
  return new Promise((resolve, reject) => {
    wx.login({
      timeout: 10000,
      success: (result) => {
        resolve(result)
      },
      fail: (err) => {
        reject(err);
      }
    });

  })
}

/**
 * 发起微信支付的api
 * @param {object} pay 支付参数
 */
export const requestPayment = (pay) => {
  return new Promise((resolve, reject) => {
    wx.requestPayment({
      ...pay,
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      }
    });

  })
}









