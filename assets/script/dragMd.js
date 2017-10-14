var dragTarget = require('dragTarget');

cc.Class({
    extends: dragTarget,
    
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
    },
    
    onResLoad: function () {
        this.cellCenter = new Array();
        this.cellCenter.push(new cc.Vec2(0, 0));
        this.cellCenter.push(new cc.Vec2(0, 0));
        
        this.cellAngle = new Array();
        this.cellAngle.push(135);
        this.cellAngle.push(45);
    }
});
