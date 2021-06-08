var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class BoxUtil {
    static createBackgroundBox(left, top, size, borderRadius, color) {
        return $(`<div style="position: absolute;
    left: ${left}px; 
    top: ${top}px; 
    width: ${size}px;
    height: ${size}px;
    border-radius: ${borderRadius}px;
    background-color: ${color};z-index: 0;
    "></div>
    `);
    }
    static createNumBox(num, col, row, size, borderRadius, gap) {
        const numInfo = this.nums["" + num];
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
    `);
    }
}
BoxUtil.nums = {
    "2": {
        "color": "#776e65",
        "backgroundColor": "rgb(251, 238, 226)",
        "fontSize": 65
    },
    "4": {
        "color": "#776e65",
        "backgroundColor": "rgb(249, 233, 205)",
        "fontSize": 65
    },
    "8": {
        "color": "#776e65",
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
};
class NumBox {
    // constructor
    constructor(container, num, col, row, size, borderRadius, gap) {
        this.container = container;
        this.num = num;
        this.col = col;
        this.row = row;
        this.size = size;
        this.borderRadius = borderRadius;
        this.gap = gap;
        this.refresh();
    }
    refresh() {
        if (this.box) {
            this.box.remove();
        }
        this.box = BoxUtil.createNumBox(this.num, this.col, this.row, this.size, this.borderRadius, this.gap);
        this.box.appendTo(this.container);
    }
    moveTo(newCol, newRow) {
        return __awaiter(this, void 0, void 0, function* () {
            const hMovDis = (newCol - this.col) * (this.size + this.gap);
            const vMovDis = (newRow - this.row) * (this.size + this.gap);
            if (hMovDis + vMovDis !== 0) {
                this.col = newCol;
                this.row = newRow;
                return new Promise(resolve => {
                    const moveTime = (Math.abs(hMovDis + vMovDis) / (this.size + this.gap)) * 80;
                    this.box.animate({ left: (this.box[0].offsetLeft + hMovDis) + 'px', top: (this.box[0].offsetTop + vMovDis) + 'px', }, moveTime, "easeInOutCubic");
                    resolve();
                });
            }
        });
    }
    destory() {
        this.box.fadeOut(() => {
            this.box.remove();
        });
    }
    mergeTo(otherBox) {
        return __awaiter(this, void 0, void 0, function* () {
            this.box.css('z-index', 2);
            console.log(1, otherBox);
            yield this.moveTo(otherBox.col, otherBox.row);
            console.log(2, otherBox);
            // console.log
            otherBox.num = 4;
            otherBox.refresh();
            this.destory();
        });
    }
}
class Game2048 {
    constructor(container, config = {
        perBoxSize: 100,
        gap: 4,
        borderRadius: 4,
        backgroundColor: "rgb(183, 160, 145)",
        backgroundBoxColor: "rgb(212, 196, 183)"
    }) {
        this.numBoxes = new Array(16).fill(null);
        this.isGameOver = false;
        this.container = $(container);
        if (!this.container.length) {
            throw new Error(`container(${container}) err`);
        }
        this.uiConfig = config;
        this.initUi();
        this.newGame();
    }
    initUi() {
        const width = this.uiConfig.perBoxSize * 4 + this.uiConfig.gap * 5;
        this.container.css("width", width);
        console.log('初始化编译');
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
        this.container.append(uiPanel);
        this.scoreSpan = uiPanel.find('.scoreSpan');
        uiPanel.find(".newGameBtn").on("click", event => this.newGame());
        this.mainPanel = $(`
    <div class="mainPanel" style="position: relative;width: ${width}px; height: ${width}px;"></div>
    `);
        this.container.append(this.mainPanel);
        this.mainPanel.append(BoxUtil.createBackgroundBox(0, 0, width, this.uiConfig.borderRadius, this.uiConfig.backgroundColor));
        console.log('开始编译');
        for (let i = 0; i < 16; i++) {
            this.mainPanel.append(BoxUtil.createBackgroundBox((this.uiConfig.perBoxSize + this.uiConfig.gap) * (i % 4) + this.uiConfig.gap, (this.uiConfig.perBoxSize + this.uiConfig.gap) * Math.floor(i / 4) + this.uiConfig.gap, this.uiConfig.perBoxSize, this.uiConfig.borderRadius, this.uiConfig.backgroundBoxColor));
        }
        // const numBox =  new NumBox(this.mainPanel,2,0,0,this.uiConfig.perBoxSize,this.uiConfig.borderRadius,this.uiConfig.gap)
        // // numBox.moveTo(3,0)
        // const numBox1 =  new NumBox(this.mainPanel,2,0,2,this.uiConfig.perBoxSize,this.uiConfig.borderRadius,this.uiConfig.gap)
        // numBox1.mergeTo(numBox)
    }
    newGame() {
        this.mainPanel.find('.numBox').remove();
        this.numBoxes.fill(null);
        this.score = 0;
        this.isGameOver = false;
        this.addNewNumBox(2);
    }
    addNewNumBox(size) {
        const emptyPosArr = this.getRandomEmptyGrids(size);
        for (let index of emptyPosArr) {
            const num = Math.random() < 0.8 ? 2 : 4;
            this.numBoxes[index] = new NumBox(this.mainPanel, num, index % 4, Math.floor(index / 4), this.uiConfig.perBoxSize, this.uiConfig.borderRadius, this.uiConfig.gap);
            this.score += num;
        }
        this.scoreSpan.text("" + this.score);
    }
    getRandomEmptyGrids(size) {
        const emptyPosArr = [];
        this.numBoxes.forEach((item, index) => {
            if (!item) {
                emptyPosArr.push(index);
            }
        });
        const res = [];
        while (res.length < size && emptyPosArr.length > 0) {
            let randomI = Math.floor(Math.random() * emptyPosArr.length);
            res.push(emptyPosArr.splice(randomI, 1)[0]);
        }
        return res;
    }
    merge(startIndexes, nextDelta) {
        return __awaiter(this, void 0, void 0, function* () {
            let addNew = false;
            const promise = [];
            for (let startIndex of startIndexes) {
                for (let i = 1; i < 4; i++) {
                    const curIndex = startIndex + i * nextDelta;
                    const curBox = this.numBoxes[curIndex];
                    if (curBox) {
                        const reachableBox = this.findReachableBox(curIndex, -nextDelta, startIndex);
                        if (reachableBox !== null) {
                            addNew = true;
                            if (reachableBox.box) {
                                this.numBoxes[curIndex] == null;
                                reachableBox.box.isMerged = true;
                                promise.push(curBox.mergeTo(reachableBox.box));
                            }
                            else {
                                this.numBoxes[curIndex] = null;
                                this.numBoxes[reachableBox.index] = curBox;
                                promise.push(curBox.moveTo(reachableBox.index % 4, Math.floor(reachableBox.index / 4)));
                            }
                        }
                    }
                }
            }
            yield Promise.all(promise);
            if (addNew) {
                this.addNewNumBox(1);
            }
        });
    }
    findReachableBox(curIndex, nextDelta, endIndex) {
        let reachableInfo = null;
        const curNumBox = this.numBoxes[curIndex];
        for (let i = 1; i <= 3; i++) {
            let otherIndex = curIndex + nextDelta * i;
            const otherBox = this.numBoxes[otherIndex];
            if (!otherBox) {
                reachableInfo = {
                    index: otherIndex,
                    box: null
                };
            }
            else if (!otherBox.isMerged && curNumBox.num === otherBox.num) {
                reachableInfo = {
                    index: otherIndex,
                    box: otherBox
                };
            }
            else {
                break;
            }
        }
        return reachableInfo;
    }
    newTabNav() {
    }
}
//# sourceMappingURL=index.js.map