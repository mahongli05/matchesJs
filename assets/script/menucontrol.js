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
        stage: {
            default: 0,
            type: cc.Integer
        },

        stageLayout: {
            default: null,
            type: cc.Layout
        },
    },

    // use this for initialization
    onLoad: function () {
        console.log('onLoad');
        this.stageLayout = this.node.getChildByName("stageLayout");
        if (this.stage == 0 && this.stageLayout != null) {
            console.log('find stageLayout');
            var layout = this.stageLayout;
            cc.loader.loadRes("prefab/stageButton", function (err, prefab) {
                var button = cc.instantiate(prefab);
                layout.addChild(button);
            });
        }
        console.log('onLoad finish');
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
