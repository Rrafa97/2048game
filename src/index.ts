type UiConfig = {
  perBoxSize: number,
  gap: number,
  borderRadius: number,
  backgroundColor: string,
  backgroundBoxColor: string
}

class BoxUtil {
  static createBackgroundBox(
    left: number,
    top: number,
    size: number,
    borderRadius: number,
    color: string
  ) {
    return $(`
    <div style="position: absolute;
    left: ${left}px;
    top: ${top}px;
    width: ${size}px;
    height: ${size}px;
    border-radius: ${borderRadius}px;
    background-color: ${color};
    z-index: 0;
    "></div>
    `)
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
        this.uiConfig.perBoxSize,this.uiConfig.borderRadius, this.uiConfig.backgroundBoxColor))
    }
  }


  private newGame() {

  }
}