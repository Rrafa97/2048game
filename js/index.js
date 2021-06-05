var BoxUtil = /** @class */ (function () {
    function BoxUtil() {
    }
    BoxUtil.createBackgroundBox = function (left, top, size, borderRadius, color) {
        return $("\n    <div style=\"position: absolute;\n    left: " + left + "px;\n    top: " + top + "px;\n    width: " + size + "px;\n    height: " + size + "px;\n    border-radius: " + borderRadius + "px;\n    background-color: " + color + ";\n    z-index: 0;\n    \"></div>\n    ");
    };
    return BoxUtil;
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