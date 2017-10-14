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
        editBox: {
            default: null,
            type: cc.EditBox
        },
        
        prefabNum: {
            default: null,
            type: cc.Node
        },
    
        prefabAs: {
            default: null,
            type: cc.Node
        },
    
        prefabMd: {
            default: null,
            type: cc.Node
        },
    
        prefabEq: {
            default: null,
            type: cc.Node
        },
        
        dragNodes: [],
    },

    // use this for initialization
    onLoad: function () {
        var self = this;
        cc.loader.loadRes("prefab/num", function (err, prefab) {
            self.prefabNum =  prefab;
        });
        cc.loader.loadRes("prefab/as", function (err, prefab) {
            self.prefabAs =  prefab;
        });
        cc.loader.loadRes("prefab/md", function (err, prefab) {
            self.prefabMd =  prefab;
        });
        cc.loader.loadRes("prefab/eq", function (err, prefab) {
            self.prefabEq =  prefab;
        });
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    
    // 0, 48; 9, 57
    // +, 43; *, 42; -, 45; /, 47; =, 61
    onClick: function () {
        console.log("onClick");
        this.clearDragNodes();
        var s = this.editBox.string;
        this.resetDragNodes(s);
    },
    
    clearDragNodes: function () {
        for (var i = 0; i < this.dragNodes.length; i++) {
            this.node.removeChild(this.dragNodes[i]);
        }
        this.dragNodes = [];
    },
    
    resetDragNodes: function (s) {
        for (var i = 0; i < s.length; i++) {
            var c = s.charCodeAt(i);
            if (c >= 48 && c <= 57) {
                var _node = cc.instantiate(this.prefabNum);
                this.dragNodes.push(_node);
                var dragScript = dragHelper.getDragTargetScript(_node);
                dragScript.setFlag(dragHelper.getNumFlag(c - 48));
            } else if (c == 43) {
                var _node = cc.instantiate(this.prefabAs);
                this.dragNodes.push(_node);
                var dragScript = dragHelper.getDragTargetScript(_node);
                dragScript.setFlag(dragHelper.dragFlagA);
            } else if (c == 42) {
                var _node = cc.instantiate(this.prefabMd);
                this.dragNodes.push(_node);
                var dragScript = dragHelper.getDragTargetScript(_node);
                dragScript.setFlag(dragHelper.dragFlagM);
            } else if (c == 45) {
                var _node = cc.instantiate(this.prefabAs);
                this.dragNodes.push(_node);
                var dragScript = dragHelper.getDragTargetScript(_node);
                dragScript.setFlag(dragHelper.dragFlagS);
            } else if (c == 47) {
                var _node = cc.instantiate(this.prefabMd);
                this.dragNodes.push(_node);
                var dragScript = dragHelper.getDragTargetScript(_node);
                dragScript.setFlag(dragHelper.dragFlagD);
            } else if (c == 61) {
                var _node = cc.instantiate(this.prefabEq);
                this.dragNodes.push(_node);
                var dragScript = dragHelper.getDragTargetScript(_node);
                dragScript.setFlag(dragHelper.dragFlagEQ);
            }
        }
    
        var length = 0;
        for (var i = 0; i < this.dragNodes.length; i++) {
            length += this.dragNodes[i].width;
        }
    
        var offset = -length / 2;
        for (var i = 0; i < this.dragNodes.length; i++) {
            var halfW = this.dragNodes[i].width / 2;
            offset += halfW;
            this.dragNodes[i].setPositionX(offset);
            this.dragNodes[i].setPositionY(0);
            this.node.addChild(this.dragNodes[i]);
            offset += halfW;
        }
    },
    
    checkResult: function () {
        var s = '';
        for (var i = 0; i < this.dragNodes.length; i++) {
            var dragScript = dragHelper.getDragTargetScript(this.dragNodes[i]);
            if (dragScript !== null) {
                s += dragScript.getChar();
            }
        }
        
        console.log("result: ", s);
        if (s.indexOf('?') !== -1) {
            return false;
        }
        
        var r = eval(s);
        console.log("result value: ", r);
        return r;
    }
    
});
