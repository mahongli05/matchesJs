var dragTarget = require('dragTarget');
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
    
        dragContainer: {
            default: null,
            type: cc.Node
        },
        
        dragTargetView: {
            default: null,
            type: cc.Node
        },
        
        dragView: {
            default: null,
            type: cc.Node
        },
        
        longPressTime: Number(0),
        longPressCheckStart: false,
        dragStart: false,
        dragPos: cc.Vec2(0, 0),
        
        sourceContainer: {
            default: null,
            type: cc.Node
        },
        
        sourceIndex: {
            default: null,
            type: Number,
        },

    },

    // use this for initialization
    onLoad: function () {
        var self = this;
        
        self.dragContainer.on(cc.Node.EventType.TOUCH_START, function (event) {
            var touches = event.getTouches();
            var touchLoc = touches[0].getLocation();
            self.dragTargetView = self.findDragTargetView(touchLoc);
            var dragTargetScript = dragHelper.getDragTargetScript(self.dragTargetView);
            if (dragTargetScript != null) {
                self.dragView = dragTargetScript.findDragView(touchLoc);
                self.longPressCheckStart = true;
                self.longPressTime = 0;
                self.dragPos = touchLoc;
            }
        }, self.node);
        
        self.dragContainer.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            console.log('move: ');
            var touches = event.getTouches();
            var touchLoc = touches[0].getLocation();
           
            if (self.longPressCheckStart) {
                var targetView = self.findDragTargetView(touchLoc);
                var targetScript = dragHelper.getDragTargetScript(targetView);
                var view = targetScript != null ? targetScript.findDragView(touchLoc) : null;
                if (targetView != self.dragTargetView || view != self.dragView) {
                    self.longPressTime = 0;
                    self.longPressCheckStart = false;
                }
            }
            self.dragPos = touchLoc;
            
            if (self.dragStart) {
                if (self.dragTargetView != null) {
                    var box = self.dragTargetView.getBoundingBox();
                    var pos = self.dragTargetView.parent.convertToNodeSpaceAR(touchLoc);
                    if (dragHelper.isPointInBox(box, pos)) {
                        var dragTargetScript = dragHelper.getDragTargetScript(self.dragTargetView);
                        dragTargetScript.onDragMove(touchLoc);
                    } else {
                        var dragTargetScript = dragHelper.getDragTargetScript(self.dragTargetView);
                        dragTargetScript.onDragExit(touchLoc);
                        self.dragTargetView = null;
                    }
                }

                if (self.dragTargetView == null) {
                    var targetView = self.findDragTargetView(touchLoc);
                    if (targetView != null) {
                        self.dragTargetView = targetView;
                        var dragTargetScript = dragHelper.getDragTargetScript(self.dragTargetView);
                        dragTargetScript.onDragEnter(touchLoc);
                    }
                }
                
                var newPos = self.dragContainer.convertToNodeSpaceAR(touchLoc);
                self.dragView.setPosition(newPos);
                console.log('newPosition: ', newPos);
            }
        }, self.node);
        
        self.dragContainer.on(cc.Node.EventType.TOUCH_END, function (event) {
            self.onDragStop();
        }, self.node);
        
        self.dragContainer.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            self.onDragStop();
        }, self.node);
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        var self = this;
        if (self.longPressCheckStart) {
            self.longPressTime += dt;
            if (self.longPressTime > 0.03) {
                self.longPressTime = 0;
                self.longPressCheckStart = false;
                self.onLongPressed();
            }
        }
    },
    
    onLongPressed: function () {
        var self = this;
        if (self.dragTargetView != null && self.dragView != null) {
            self.onDragStart();
        }
    },
    
    findDragTargetView: function (touchPos) {
        var self = this;
        var target = null;
        var pos = self.dragContainer.convertToNodeSpaceAR(touchPos);
        for (var i = 0; i < self.dragContainer.children.length; i++) {
            var child = self.dragContainer.children[i];
            var box = child.getBoundingBox();
            if (dragHelper.isPointInBox(box, pos)) {
                if (target == null /*|| target.zIndex < this.child.zIndex*/) {
                    var targetComponent = child.getComponent(dragTarget);
                    if (targetComponent != null) {
                        target = child;
                    }
                }
            }
        }
        return target;
    },
    
    onDragStart: function () {
        console.log('onDragStart');
        var self = this;
        var dragTargetScript = dragHelper.getDragTargetScript(self.dragTargetView);
        if (self.dragView != null) {
            self.dragStart = true;
            self.sourceContainer = self.dragView.parent;
            self.sourceIndex = self.dragView.getTag();
            dragTargetScript.removeDragView(self.dragView);
            var pos = self.dragContainer.convertToNodeSpaceAR(self.dragPos);
            self.dragView.setPosition(pos);
            self.dragContainer.addChild(self.dragView);
            dragTargetScript.onDragEnter(self.dragPos);
        }
    },
    
    onDragStop: function () {
        console.log('onDragStop');
        var self = this;
        if (self.dragStart) {
            var addToTarget = false;
            if (self.dragTargetView != null) {
                var dragTargetScript = dragHelper.getDragTargetScript(self.dragTargetView);
                addToTarget = dragTargetScript.addDragView(self.dragView);
            }
            if (!addToTarget) {
                var dragTargetScript = dragHelper.getDragTargetScript(self.sourceContainer);
                dragTargetScript.addDragViewToIndex(self.dragView, self.sourceIndex);
            }
            self.dragStart = false;
            self.dragView = null;
            self.dragTargetView = null;
            self.sourceContainer = null;
        }
    }
});
