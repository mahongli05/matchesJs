var dragHelper = require('dragHelper');

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        
        cellCenter : Array,
        cellAngle : Array,
        
        selectBg: {
            default: null,
            type: cc.Node
        },
        
        activeCellIndex: Number(-1),
    },

    // use this for initialization
    onLoad: function () {
        var self = this;
        cc.loader.loadRes("prefab/matches_select_bg", function (err, prefab) {
            var child = cc.instantiate(prefab);
            child.setTag(-1);
            child.visibility = false;
            self.node.addChild(child);
            self.selectBg = child;
            self.selectBg.active = false;
        });
        self.onResLoad();
    },
    
    onDragEnter: function (pos) {
        var self = this;
        console.log('onEnter');
        var index = this.findNearestCellIndex(pos);
        // 显示选中状态
        if (index >= 0 && self.node.getChildByTag(index) === null) {
            self.selectBg.setPosition(this.cellCenter[index]);
            self.selectBg.rotation = this.cellAngle[index];
            self.selectBg.active = true;
            self.activeCellIndex = index;
            console.log('set bg: true');
        } else {
            self.selectBg.active = false;
            self.activeCellIndex = -1;
            console.log('set bg: false');
        }
    },
    
    onDragExit: function (pos) {
        // 隐藏显示状态
        var self = this;
        console.log('onExit');
        self.selectBg.active = false;
        self.activeCellIndex = -1;
        console.log('set bg: false');
    },
    
    onDragMove: function (pos) {
        // 更新选中状态
        this.onDragEnter(pos);
    },
    
    setFlag: function (flag) {
        var self = this;
        if (self.selectBg === null) {
            self.onLoad();
        }
        self.resetNode();
        console.log('flag is: ', flag);
        for (var i = 0; i < self.cellCenter.length; i++) {
            console.log('check i : ', i);
            console.log('mask: ', 1 << i);
            if (!self.isCellEmpty(i, flag)) {
                console.log('add child by', i);
                (function (num) {
                    cc.loader.loadRes("prefab/matches", function (err, prefab) {
                        var child = cc.instantiate(prefab);
                        child.setTag(num);
                        child.setPosition(self.cellCenter[num]);
                        child.rotation = self.cellAngle[num];
                        self.node.addChild(child);
                    });
                })(i);
            }
        }
    },
    
    getFlag: function () {
        var self = this;
        var flag = 0;
        for (var i = 0; i < self.cellCenter.length; i++) {
            if (self.node.getChildByTag(i) !== null) {
                flag |= (1<<i);
            }
        }
        return flag;
    },
    
    findDragView: function (pos) {
        var self = this;
        var index = self.findNearestCellIndex(pos);
        console.log('find index: ', index);
        if (index >= 0) {
            return self.node.getChildByTag(index);
        }
        return null;
    },
    
    isCellEmpty: function (index, flag) {
        var mask = 1 << index;
        return (flag & mask) === 0;
    },
    
    findNearestCellIndex: function (pos) {
        var self = this;
        var posToNode = self.node.convertToNodeSpaceAR(pos);
        var index = -1;
        var distance = -1;
        for (var i = 0; i < self.cellCenter.length; i++) {
            var newDistance = cc.pDistance(self.cellCenter[i], posToNode);
            if (distance == -1 || distance > newDistance) {
                distance = newDistance;
                index = i;
            } else if (distance == newDistance) {
                if (distance > 0) {
                    var d1 = dragHelper.distanceToLine(posToNode, self.cellCenter[index], self.cellAngle[index]);
                    var d2 = dragHelper.distanceToLine(posToNode, self.cellCenter[i], self.cellAngle[i]);
                    if (d1 >= d2) {
                        index = i;
                    }
                } else {
                    index = i;
                }
            }
        }
        return index;
    },
    
    removeDragView: function (dragView) {
        var self = this;
        if (dragView !== null) {
            self.node.removeChild(dragView);
        }
    },
    
    addDragView: function (dragView) {
        var _self = this;
        if (dragView !== null) {
            if (this.activeCellIndex !== -1 && this.node.getChildByTag(this.activeCellIndex) === null) {
                dragView.removeFromParent(false);
                dragView.setPosition(this.cellCenter[this.activeCellIndex]);
                dragView.rotation = this.cellAngle[this.activeCellIndex];
                dragView.setTag(this.activeCellIndex);
                _self.node.addChild(dragView);
                _self.activeCellIndex = -1;
                _self.selectBg.active = false;
                console.log('set bg: false');
                return true;
            }
        }
        return false;
    },
    
    addDragViewToIndex: function (dragView, index) {
        this.activeCellIndex = index;
        this.addDragView(dragView);
    },
    
    addDragViewToPosition: function (dragView, pos) {
        var self = this;
        var index = this.findNearestCellIndex(pos);
        if (index >= 0) {
            self.activeCellIndex = index;
            self.addDragView(dragView);
        }
    },
    
    resetNode: function () {
        var self = this;
        for (var i = 0; i < this.cellCenter.length; i++) {
            self.node.removeChildByTag(i);
        }
        self.activeCellIndex = -1;
    },
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (this.selectBg != null) {
            console.log('selectBg: visibility = ', this.selectBg.active);
        }
    },
});
