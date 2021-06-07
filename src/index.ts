type UiConfig = {
  perBoxSize: number,
  gap: number,
  borderRadius: number,
  backgroundColor: string,
  backgroundBoxColor: string
}

class BoxUtil {
  private static nums = {
    "2": {
      "color": "#776e65",
      "backgroundColor": "#eff4da",
      "fontSize": 65
    },
    "4": {
      "color": "#776fe5",
      "backgroundColor": "#ede08c",
      "fontSize": 65
    },
    "8": {
      "color": "#f9f6f2",
      "backgroundColor": "#f2b179",
      "fontSize": 55
    },
    "16": {
      "color": "#776e65",
      "backgroundColor": "#eee4da",
      "fontSize": 65
    },
    "32": {
      "color": "#776e65",
      "backgroundColor": "#eee4da",
      "fontSize": 65
    },
    "64": {
      "color": "#776e65",
      "backgroundColor": "#eee4da",
      "fontSize": 40
    },
    "128": {
      "color": "#776e65",
      "backgroundColor": "#eee4da",
      "fontSize": 40
    },
    "256": {
      "color": "#776e65",
      "backgroundColor": "#eee4da",
      "fontSize": 40
    },
    "512": {
      "color": "#776e65",
      "backgroundColor": "#eee4da",
      "fontSize": 40
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

class NumBox {
  private container: JQuery<HTMLElement>;
  num: number;
  box: JQuery<HTMLElement>
  col: number;
  row: number
  private size: number
  private borderRadius: number
  private gap: number

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

  refresh() {
    if(this.box) {
      this.box.remove()
    }
    this.box = BoxUtil.createNumBox(this.num,this.col,this.row,this.size, this.borderRadius,this.gap);
    this.box.appendTo(this.container)
  }

  async moveTo (newCol: number,newRow:number) {
    const hMovDis = (newCol - this.col) * (this.size + this.gap)
    const vMovDis = (newRow - this.row) * (this.size + this.gap)
    if(hMovDis + vMovDis !== 0) {
      this.col = newCol
      this.row = newRow
      return new Promise<void>( resolve => {
        const moveTime = (Math.abs(hMovDis + vMovDis) / (this.size + this.gap)) * 80
        this.box.animate({
          left: (this.box[0].offsetLeft + hMovDis) + 'px',
          top: (this.box[0].offsetTop + vMovDis) + 'px',
        },moveTime, "easeInOutCubic")
      })
    }
  }
}

class Game2048 {

  private uiConfig: UiConfig
  private container: JQuery<HTMLElement>
  private scoreSpan: JQuery<HTMLElement>
  private mainPanel: JQuery<HTMLElement>

  constructor(container: string, config: UiConfig = {
    perBoxSize: 100,
    gap: 4,
    borderRadius: 4,
    backgroundColor: "#000000",
    backgroundBoxColor: "rgba(238,228,218,1)"
  }) {

    this.container = $(container)

    if (!this.container.length) {
      throw new Error(`container(${container}) err`)
    }

    this.uiConfig = config
    this.initUi()
  }

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
    this.container.append(uiPanel)
    this.scoreSpan = uiPanel.find('.scoreSpan')
    uiPanel.find(".newGameBtn").on("click", event => this.newGame())
    this.mainPanel = $(`
    <div class="mainPanel" style="position: relative;width: ${width}px; height: ${width}px;"></div>
    `)
    this.container.append(this.mainPanel)

    this.mainPanel.append(BoxUtil.createBackgroundBox(0, 0, width, this.uiConfig.borderRadius, this.uiConfig.backgroundColor))
    console.log('开始编译')
    for (let i = 0; i < 16; i++) {
      this.mainPanel.append(BoxUtil.createBackgroundBox(
        (this.uiConfig.perBoxSize + this.uiConfig.gap) * (i % 4) + this.uiConfig.gap,
        (this.uiConfig.perBoxSize + this.uiConfig.gap) * Math.floor(i / 4) + this.uiConfig.gap,
        this.uiConfig.perBoxSize, this.uiConfig.borderRadius, this.uiConfig.backgroundBoxColor))
    }

    const numBox =  new NumBox(this.mainPanel,2,0,0,this.uiConfig.perBoxSize,this.uiConfig.borderRadius,this.uiConfig.gap)
    numBox.moveTo(3,0)
  }


  private newGame() {

  }
  private newTabNav() { }
}