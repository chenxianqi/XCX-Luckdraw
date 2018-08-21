/// 很简单的一个小程序游戏大转盘抽奖实现思路
/// 通过后台调取API接口，获取用户抽奖权限，如获得的抽奖次数（luckDrawCount），奖品数据
/// 然后调取相应的API接口抽奖，抽奖结果返回，开启转盘动画，将转盘的rotateZ转到已经设置好奖项的位置
/// 弹出modal显示抽奖结果
/// （理论支撑微信小程序和支付宝小程序,只需做些许修改）

Page({
  data: {
    gameAnimation: null, //转盘动画
    gameState: false,   // 游戏状态
    gameModal: false,   // 模态框控制状态
    luckDrawCount: 3,  //  抽奖次数
    gameModalData: {}  //  奖品modal显示的数据（抽奖结果数据）
  },
  onLoad() {
  },
  // 点击立即使用按钮
  actionBtn(){
    console.log('去向'); // 抽中奖可以重定向到其他页面，如业务办理，商品购买页面
    this.closeModal(); // 关闭模态框
  },
  // 关闭模态框
  closeModal(){
    this.setData({
      gameModal: false
    })
  },
  // 打开模态框
  showModal(){
    this.setData({
      gameModal: true
    })
  },
  // 奖品设置 传入一个奖项，0，1，2，3，4， 分别是12345等奖
  prizeData(grade){
    const prize = [
      // 一等奖 || 免单
      {
        title: '手气不错哟～恭喜获得',         // 奖品辩题
        prize: '免单',                      // 中奖内容
        invalid_date: '请在2018.09.05前使用' // 失效日期
      },
      // 二等奖 || 9.5折优惠券
      {
        title: '手气不错哟～恭喜获得',         // 奖品辩题
        prize: '9.5折优惠券',               // 中奖内容
        invalid_date: '请在2018.09.05前使用' // 失效日期
      },
      // 三等奖 || 免服务费
      {
        title: '手气不错哟～恭喜获得',        // 奖品辩题
        prize: '免服务费',                  // 中奖内容
        invalid_date: '请在2018.09.05前使用'// 失效日期
      },
      // 四等奖 || 10元代金券
      {
        title: '手气不错哟～恭喜获得',         // 奖品辩题
        prize: '10元代金券',                 // 中奖内容
        invalid_date: '请在2018.09.05前使用' // 失效日期
      },
      // 五等奖 || 5元代金券
      {
        title: '手气不错哟～恭喜获得',        // 奖品辩题
        prize: '5元代金券',                 // 中奖内容
        invalid_date: '请在2018.09.05前使用'// 失效日期
      },
    ];
    return prize[grade]; // 返回奖品数据
  },
  // 开始游戏
  gameAction(){
    // 模拟抽奖
    var rotateZPositionIndex = Math.round(Math.random()* 4)
    // 判断游戏是否进行中
    if(this.data.gameState) return;
    // 判断是否还有抽奖资格
    console.log(this.data.luckDrawCount)
    if(this.data.luckDrawCount <= 0){
      my.showToast({
        content: 'Sorry 您没有抽奖机会了',
        duration: 3000,
        success: () => {},
      });
      return;
    }
    this.gameAnimationRun(rotateZPositionIndex);

  },
  // 游戏实现部分
  gameAnimationRun(rotateZPositionIndex){
    //重置rotateZ = 0
    var reAnimation = my.createAnimation({ // 动画实例
        duration: 1,
        timeFunction: 'ease'
      });
    reAnimation.rotateZ(0).step();
    this.setData({
      gameAnimation: reAnimation.export(),
    })

    // 奖品指针位置20 一等奖，290二等奖，200，三等奖， 110 四等奖，68 五等奖，
    // 计算归着，每次抽奖最终rotateZ值 + 相应的奖品值位置 = (rotateZCount + rotateZPosition[0]) 等于一等奖
    var rotateZPosition = [20,290, 200, 110, 68];

    var rotateZ = 360;     // 一圈360deg
    var rotateZCount = 10; // 旋转圈数的倍数
    var toRotateZCount = rotateZPosition[rotateZPositionIndex] + rotateZ * rotateZCount; // 达到圈数位置

    var animation = my.createAnimation({ // 动画实例
      duration: 5000, // 动画持续5秒
      delay: 10,
      timeFunction: 'ease', // 由慢-加快-降速停止
    });
    animation.rotateZ(toRotateZCount).step();
    this.setData({
      gameState: true,
      gameAnimation: animation.export()
    })

    // 设置状态
    setTimeout(_=>{
      this.showModal();   // 当转盘停止显示模态框显示抽奖结果
      this.setData({ 
        luckDrawCount: this.data.luckDrawCount-1,          // 抽奖次数减一
        gameState: false,                                   // 将转盘状态切换为可抽奖
        gameModalData: this.prizeData(rotateZPositionIndex) // 设置奖品数据
      })
    }, 5000)
  }
});
