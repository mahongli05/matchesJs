
module.exports = {
    
    dragTargetName: ['dragNum', 'dragAs', 'dragMd', 'dragEq'],
    
    dragFlag0: 0x3f,
    dragFlag1: 0xc,
    dragFlag2: 0x76,
    dragFlag3: 0x5e,
    dragFlag4: 0x4d,
    dragFlag5: 0x5b,
    dragFlag6: 0x7b,
    dragFlag7: 0xe,
    dragFlag8: 0x7f,
    dragFlag9: 0x5f,
    
    dragFlagA: 0x3,
    dragFlagS: 0x2,
    dragFlagM: 0x3,
    dragFlagD: 0x1,
    dragFlagEQ: 0x3,
    
    dragNum: [0x3f, 0xc, 0x76,
        0x5e, 0x4d, 0x5b,
        0x7b, 0xe, 0x7f,
        0x5f],
    
    dragValueMap: { 0x3f: '0', 0xc: '1', 0x76: '2',
        0x5e: '3', 0x4d: '4', 0x5b: '5',
        0x7b: '6', 0xe: '7', 0x7f: '8',
        0x5f: '9'},
    
    distanceToLine: function (posA, posB, angle) {
        var v = new cc.Vec2();
        v.x = posA.x - posB.x;
        v.y = posA.y - posB.y;
        var an = cc.pToAngle(v);
        return cc.pLength(v) * Math.abs(Math.sin(an - angle/180 * Math.PI));
    },
    
    getDragTargetScript: function (container) {
        if (container != null) {
            var result = null;
            for (var i = 0; i < this.dragTargetName.length; i++) {
                result = container.getComponent(this.dragTargetName[i]);
                if (result != null) {
                    return result;
                }
            }
        }
        return null;
    },
    
    isPointInBox: function (box, pos) {
        return box.x < pos.x && box.x + box.width > pos.x
            && box.y + box.height > pos.y && box.y < pos.y;
    },
    
    getNumFlag: function (num) {
        if (num >= 0 && num <= 9) {
            return this.dragNum[num];
        }
        return 0;
    },
}