var BoxUtil = /** @class */ (function () {
    function BoxUtil() {
    }
    BoxUtil.createBackgroundBox = function (left, top, size, borderRadius, color) {
        return $("<div style=\"position: absolute;\n     left: " + left + "px; top: " + top + "px; width: " + size + "px; height: " + size + "px; border-radius: " + borderRadius + "px;\n    background-color: " + color + ";z-index: 0;\n    \"></div>\n    ");
    };
    BoxUtil.createNumBox = function (num, col, row, size, borderRadius, gap) {
        var numInfo = this.nums["" + num];
        return $("\n    <div class=\"numBox\" style=\"\n    position: absolute;\n    left: " + (gap + (gap + size) * col) + "px;\n    top: " + (gap + (gap + size) * row) + "px;\n    width: " + size + "px;\n    height: " + size + "px;\n    border-radius: " + borderRadius + "px;\n    color: " + numInfo.color + ";\n    font-size: " + numInfo.fontSize + ";\n    line-height: " + size + ";\n    text-align: center;\n    background-color: " + numInfo.backgroundColor + ";\n    z-index: 1;\n    \"></div>\n    ");
    };
    BoxUtil.nums = {
        "2": {
            "color": "#776e65",
            "backgroundColor": "#eee4da",
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
    };
    return BoxUtil;
}());
var NumBox = /** @class */ (function () {
    // constructor
    function NumBox(container, num, col, row, size, borderRadius, gap) {
        this.container = container;
        this.num = num;
        this.col = col;
        this.row = row;
        this.size = size;
        this.borderRadius = borderRadius;
        this.gap = gap;
    }
    NumBox.prototype.refresh = function () {
    };
    return NumBox;
}());
var Game2048 = /** @class */ (function () {
    function Game2048(container, config) {
        if (config === void 0) { config = {
            perBoxSize: 100,
            gap: 4,
            borderRadius: 4,
            backgroundColor: "#000000",
            backgroundBoxColor: "rgba(238,228,218,1)"
        }; }
        this.container = $(container);
        if (!this.container.length) {
            throw new Error("container(" + container + ") err");
        }
        this.uiConfig = config;
        this.initUi();
    }
    Game2048.prototype.initUi = function () {
        var _this = this;
        var width = this.uiConfig.perBoxSize * 4 + this.uiConfig.gap * 5;
        this.container.css("width", width);
        var uiPanel = $("\n    <div class=\"uiPanel\" style=\"position:relative;display:inline-block;\n    width:100%;\n    color:#666;\n    line-height:32px\n    \">\n    <div style=\"float:left;\">score: <span class=\"scoreSpan\">0</span></div>\n    <div class=\"newGameBtn\" style=\"float: right;cursor: pointer;\">new game</div>\n    </div>\n    ");
        this.container.append(uiPanel);
        this.scoreSpan = uiPanel.find('.scoreSpan');
        uiPanel.find(".newGameBtn").on("click", function (event) { return _this.newGame(); });
        this.mainPanel = $("\n    <div class=\"mainPanel\" style=\"position: relative;width: " + width + "px; height: " + width + "px;\"></div>\n    ");
        this.container.append(this.mainPanel);
        this.mainPanel.append(BoxUtil.createBackgroundBox(0, 0, width, this.uiConfig.borderRadius, this.uiConfig.backgroundColor));
        console.log('开始编译');
        for (var i = 0; i < 16; i++) {
            this.mainPanel.append(BoxUtil.createBackgroundBox((this.uiConfig.perBoxSize + this.uiConfig.gap) * (i % 4) + this.uiConfig.gap, (this.uiConfig.perBoxSize + this.uiConfig.gap) * Math.floor(i / 4) + this.uiConfig.gap, this.uiConfig.perBoxSize, this.uiConfig.borderRadius, this.uiConfig.backgroundBoxColor));
        }
    };
    Game2048.prototype.newGame = function () {
    };
    return Game2048;
}());
//# sourceMappingURL=index.js.map