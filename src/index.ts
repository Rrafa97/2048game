// ts类型定义
type UiConfig = {
  perBoxSize: number,
  gap: number,
  borderRadius: number,
  backgroundColor: string,
  backgroundBoxColor: string
}
// 盒子配置相关
class BoxUtil {
  // 数字配置包括数字颜色背景颜色和字号
  private static nums = {
    "3": {
      "color": "#776e65",
      "backgroundColor": "rgb(251, 238, 226)",
      "fontSize": 48
    },
    "4": {
      "color": "#776e65",
      "backgroundColor": "rgb(249, 233, 205)",
      "fontSize": 48
    },
    "8": {
      "color": "#776e65",
      "backgroundColor": "rgb(251, 153, 104)",
      "fontSize": 42
    },
    "16": {
      "color": "#776e65",
      "backgroundColor": "rgb(234, 137, 88)",
      "fontSize": 42
    },
    "32": {
      "color": "#776e65",
      "backgroundColor": "rgb(228, 104, 40)",
      "fontSize": 42
    },
    "64": {
      "color": "#776e65",
      "backgroundColor": "#eee4da",
      "fontSize": 38
    },
    "128": {
      "color": "#776e65",
      "backgroundColor": "#eee4da",
      "fontSize": 38
    },
    "256": {
      "color": "#776e65",
      "backgroundColor": "#eee4da",
      "fontSize": 38
    },
    "512": {
      "color": "#776e65",
      "backgroundColor": "#eee4da",
      "fontSize": 38
    },
    "1024": {
      "color": "#776e65",
      "backgroundColor": "#eee4da",
      "fontSize": 35
    },
    "2048": {
      "color": "#776e65",
      "backgroundColor": "#eee4da",
      "fontSize": 35
    },
    "4096": {
      "color": "#776e65",
      "backgroundColor": "#eee4da",
      "fontSize": 35
    },
    "8192": {
      "color": "#776e65",
      "backgroundColor": "#eee4da",
      "fontSize": 35
    },
  }

/**
 * 
 * @param left 左偏移
 * @param top 上偏移
 * @param size 盒子宽度
 * @param borderRadius 盒子边框圆滑
 * @param color 盒子背景颜色
 * @returns 返回创建好后的盒子html
 */
  static createBackgroundBox(left: number, top: number, size: number,
    borderRadius: number, color: string) {
    return $(`<div style="position: absolute;
    left: ${left}px; 
    top: ${top}px; 
    width: ${size}px;
    height: ${size}px;
    border-radius: ${borderRadius}px;
    background-color: ${color};z-index: 0;
    "></div>
    `)
  }

  /**
   * 
   * @param num 盒子数量
   * @param col 列数
   * @param row 行数
   * @param size 大小
   * @param borderRadius 盒子边框圆滑
   * @param gap 盒子间隙
   * @returns 
   */
  static createNumBox(
    num: number,
    col: number,
    row: number,
    size: number,
    borderRadius: number,
    gap: number
  ) {
    const numInfo = this.nums["" + num]
    return $(`
    <div class="numBox" style="
    position: absolute;
    left: ${gap + (gap + size) * col}px;
    top: ${gap + (gap + size) * row}px;
    width: ${size}px;
    height: ${size}px;
    border-radius: ${borderRadius}px;
    color: ${numInfo.color};
    font-size: ${numInfo.fontSize}px;
    line-height: ${size}px;
    text-align: center;
    background-color: ${numInfo.backgroundColor};
    z-index: 1;
    ">${num}</div>
    `)
  }
}


/**
 * 数字盒子
 */
class NumBox {
  private container: JQuery<HTMLElement>;
  num: number;
  box: JQuery<HTMLElement>
  col: number;
  row: number
  private size: number
  private borderRadius: number
  private gap: number
  isMerged: boolean


  // constructor
  constructor(container: JQuery<HTMLElement>, num: number, col: number, row: number, size: number, borderRadius: number, gap: number) {
    this.container = container
    this.num = num
    this.col = col
    this.row = row
    this.size = size
    this.borderRadius = borderRadius
    this.gap = gap
    this.refresh()
  }
// 刷新重新绘制
  refresh() {
    if (this.box) {
      this.box.remove()
    }
    this.box = BoxUtil.createNumBox(this.num, this.col, this.row, this.size, this.borderRadius, this.gap);
    this.box.appendTo(this.container)
  }
// 移动函数
  async moveTo(newCol: number, newRow: number) {
    const hMovDis = (newCol - this.col) * (this.size + this.gap)
    const vMovDis = (newRow - this.row) * (this.size + this.gap)
    if (hMovDis + vMovDis !== 0) {
      this.col = newCol
      this.row = newRow
      return new Promise<void>(resolve => {
        const moveTime = (Math.abs(hMovDis + vMovDis) / (this.size + this.gap)) * 80
        this.box.animate({ left: (this.box[0].offsetLeft + hMovDis) + 'px', top: (this.box[0].offsetTop + vMovDis) + 'px', }, moveTime, "easeInOutCubic")
        resolve()
      })
    }
  }
// 移动后销毁不需要的盒子
  private destory() {
    this.box.fadeOut(() => {
      this.box.remove()
    })
  }

  // 合并两个盒子
  async mergeTo(otherBox: NumBox) {
    this.box.css('z-index', 2);
    await this.moveTo(otherBox.col, otherBox.row)
    // console.log
    otherBox.num *= 2
    otherBox.refresh()
    this.destory()
  }
}

// 主函数
class Game2048 {

  private uiConfig: UiConfig
  private container: JQuery<HTMLElement>
  private scoreSpan: JQuery<HTMLElement>
  private mainPanel: JQuery<HTMLElement>
  private numBoxes: NumBox[] = new Array(16).fill(null)
  private score: number
  private isGameOver: boolean = false
  private isMerging: boolean = false

  constructor(container: string, config: UiConfig = {
    perBoxSize: 60,
    gap: 4,
    borderRadius: 4,
    backgroundColor: "rgb(183, 160, 145)",
    backgroundBoxColor: "rgb(212, 196, 183)"
  }) {

    this.container = $(container)

    if (!this.container.length) {
      throw new Error(`container(${container}) err`)
    }

    this.uiConfig = config
    this.initUi() //初始化
    this.newGame() //新游戏
    this.bindKeys() //绑定按键和滑动监听
  }

  // 初始化函数，第一次进入游戏调用此函数将会绘制游戏盘
  private initUi() {
    const width = this.uiConfig.perBoxSize * 4 + this.uiConfig.gap * 5;
    this.container.css("width", width)
    console.log('初始化编译')
    const uiPanel = $(`
    <div class="uiPanel" style="position:relative;display:inline-block;
    width:100%;
    color:#666;
    line-height:32px
    ">
    <div style="float:left;">score: <span class="scoreSpan">0</span></div>
    <div class="newGameBtn" style="float: right;cursor: pointer;">new game</div>
    </div>
    `);
    this.container.append(uiPanel) //将元素添加绑定到获取的元素
    this.scoreSpan = uiPanel.find('.scoreSpan') // 绑定分数计算
    uiPanel.find(".newGameBtn").on("click", event => this.newGame()) // 绑定按键按下新游戏时候重新开始游戏
    this.mainPanel = $(`
    <div class="mainPanel" style="position: relative;width: ${width}px; height: ${width}px;"></div>
    `) // 绘制主函数
    this.container.append(this.mainPanel)

    this.mainPanel.append(BoxUtil.createBackgroundBox(0, 0, width, this.uiConfig.borderRadius, this.uiConfig.backgroundColor))
    console.log('开始编译')
    // 绘制盒子
    for (let i = 0; i < 16; i++) {
      this.mainPanel.append(BoxUtil.createBackgroundBox(
        (this.uiConfig.perBoxSize + this.uiConfig.gap) * (i % 4) + this.uiConfig.gap,
        (this.uiConfig.perBoxSize + this.uiConfig.gap) * Math.floor(i / 4) + this.uiConfig.gap,
        this.uiConfig.perBoxSize, this.uiConfig.borderRadius, this.uiConfig.backgroundBoxColor))
    }

    // const numBox =  new NumBox(this.mainPanel,2,0,0,this.uiConfig.perBoxSize,this.uiConfig.borderRadius,this.uiConfig.gap)
    // // numBox.moveTo(3,0)
    // const numBox1 =  new NumBox(this.mainPanel,2,0,2,this.uiConfig.perBoxSize,this.uiConfig.borderRadius,this.uiConfig.gap)
    // numBox1.mergeTo(numBox)
  }

  // 绑定按键和滑动事件
  private bindKeys() {
    document.addEventListener('keyup', event => {
      switch (event.code) {
        case "ArrowLeft":
          this.leftMerge()
          break;
        case "ArrowRight":
          this.rightMerge()
          break;
        case "ArrowUp":
          this.upMerge()
          break;
        case "ArrowDown":
          this.downMerge()
          break;
      }

    })
    interface TouchEvent__ {
      changedTouches: Object
    }
    let pointStartX: number
    let pointStartY: number
    let pointEndX: number
    let pointEndY: number
    document.addEventListener('touchstart', (event: any) => {
      pointStartX = event.changedTouches[0].clientX
      pointStartY = event.changedTouches[0].clientY
    })
    document.addEventListener('touchend', (event: any) => {
      pointEndX = event.changedTouches[0].clientX
      pointEndY = event.changedTouches[0].clientY
      // if(pointStartX - pointEndX) {

      // }
      let axisXDistance = pointStartX - pointEndX
      let axisYDistance = pointStartY - pointEndY
      let switchEvt: number
      if (Math.abs(axisXDistance) - Math.abs(axisYDistance) > 20) {
        if (axisXDistance < 0) {
          switchEvt = 1
        } else {
          switchEvt = 0
        }
      } else if (Math.abs(axisYDistance) - Math.abs(axisXDistance) > 20) {

        if (axisYDistance < 0) {
          switchEvt = 3
        } else {
          switchEvt = 2
        }
      }
      switch (switchEvt) {
        case 0:
          this.leftMerge()
          break;
        case 1:
          this.rightMerge()
          break;
        case 2:
          this.upMerge()
          break;
        case 3:
          this.downMerge()
          break;
      }
    })

  }

  private newGame() {
    this.mainPanel.find('.numBox').remove()
    this.numBoxes.fill(null)
    this.score = 0
    this.isGameOver = false
    this.isMerging = false

    this.addNewNumBox(2)
  }

  private addNewNumBox(size: number) {
    const emptyPosArr = this.getRandomEmptyGrids(size)
    for (let index of emptyPosArr) {
      const num = Math.random() < 0.8 ? 2 : 4;
      this.numBoxes[index] = new NumBox(this.mainPanel, num, index % 4, Math.floor(index / 4), this.uiConfig.perBoxSize,
        this.uiConfig.borderRadius, this.uiConfig.gap)
      this.score += num
    }
    this.scoreSpan.text("" + this.score)
  }

  private getRandomEmptyGrids(size: number): Array<number> {
    const emptyPosArr = []
    this.numBoxes.forEach((item, index) => {
      if (!item) {
        emptyPosArr.push(index)
      }
    })

    const res = []
    while (res.length < size && emptyPosArr.length > 0) {
      let randomI = Math.floor(Math.random() * emptyPosArr.length)
      res.push(emptyPosArr.splice(randomI, 1)[0])
    }
    return res
  }


  private leftMerge() {
    return this.merge([0, 4, 8, 12], 1)
  }

  private rightMerge() {
    return this.merge([3, 7, 11, 15], -1)
  }

  private upMerge() {
    return this.merge([0, 1, 2, 3], 4)
  }

  private downMerge() {
    return this.merge([12, 13, 14, 15], -4)
  }

  private async merge(startIndexes: number[], nextDelta: number) {
    if (this.isGameOver || this.isMerging) {
      return
    }
    this.isMerging = true

    let addNew = false
    const promises = []

    this.numBoxes.forEach(item => item && (item.isMerged = false))

    for (let startIndex of startIndexes) {
      for (let i = 1; i < 4; i++) {
        const curIndex = startIndex + i * nextDelta
        const curBox = this.numBoxes[curIndex]
        if (curBox) {
          const reachableBox = this.findReachableBox(curIndex, -nextDelta, startIndex)
          if (reachableBox) {
            addNew = true
            if (reachableBox.box) {
              this.numBoxes[curIndex] = null
              reachableBox.box.isMerged = true
              promises.push(curBox.mergeTo(reachableBox.box))
            } else {
              this.numBoxes[curIndex] = null
              this.numBoxes[reachableBox.index] = curBox
              promises.push(curBox.moveTo(reachableBox.index % 4, Math.floor(reachableBox.index / 4)))
            }

          }
        }
      }
    }

    await Promise.all(promises)
    if (addNew) {
      this.addNewNumBox(1)

    }
    this.isMerging = false
  }

  private findReachableBox(curIndex: number, nextDelta: number, endIndex: number) {
    let reachableInfo = null
    const curNumBox = this.numBoxes[curIndex]
    for (let i = 1; i < 4; i++) {
      let otherIndex = curIndex + nextDelta * i
      const otherBox = this.numBoxes[otherIndex]
      if (!otherBox) {
        reachableInfo = {
          index: otherIndex,
          box: null
        }
      } else if (!otherBox.isMerged && curNumBox.num === otherBox.num) {
        reachableInfo = {
          index: otherIndex,
          box: otherBox
        }
      } else {
        break
      }

      if (otherIndex === endIndex) {
        break
      }
    }
    return reachableInfo
  }

  private newTabNav() {

  }
}
