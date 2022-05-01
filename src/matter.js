import Phaser from 'phaser';
import { combinePolyDesc, addPolygon } from './common';
import eventManager from './eventman';

class MatterScene extends Phaser.Scene {

    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
    }

    create() {
        this.polyTable = {};
        this.worldWidth = 1200;
        this.worldHeight = 1200;
        var matterBoundRect = this.add.rectangle(this.worldWidth / 2, this.worldHeight / 2, this.worldWidth, this.worldHeight);
        matterBoundRect.setStrokeStyle(4, 0, 1);
        this.matter.world.setBounds(0, 0, this.worldWidth, this.worldHeight, 200);
        const cam = this.cameras.main;
        cam.centerOn(600, 600);
        eventManager.on('game-exit', () => {
            eventManager.emit('poly-table-recording-disable');
            this.scene.sleep('HUDScene');
            this.scene.switch('TitleScene');
        }, this);
        eventManager.on('polygon-create', (x, y, polyDesc) => {
            let worldX = cam.scrollX + cam.centerX + (x - cam.centerX) / cam.zoomX;
            let worldY = cam.scrollY + cam.centerY + (y - cam.centerY) / cam.zoomY;
            console.log(x, y, worldX, worldY, cam.zoomX, cam.zoomY);
            let offset = 20;
            worldX += Phaser.Math.Between(-offset, offset);
            worldY += Phaser.Math.Between(-offset, offset);
            worldX = worldX < 0 ? 0 : worldX;
            worldX = worldX > this.worldWidth ? this.worldWidth : worldX;
            worldY = worldY < 0 ? 0 : worldY;
            worldY = worldY > this.worldHeight ? this.worldHeight : worldY;
            addPolygon(this, worldX, worldY, polyDesc);
        }, this);
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            eventManager.off('game-exit');
        });
        this.events.on(Phaser.Scenes.Events.WAKE, function () {
            this.scene.run('HUDScene');
        }, this);
        this.events.on(Phaser.Scenes.Events.SLEEP, function () {
            this.scene.sleep('HUDScene');
        }, this);
        eventManager.emit('poly-table-recording-enable');
        this.scene.run('HUDScene');
        // this.cameras.main.setBackgroundColor(0x111111);
        this.cameras.main.setBackgroundColor(0xffffff);
        var sideLen = 20;
        var objcount = 100;
        for (var i = 0; i < objcount; i++) {
            var x = Phaser.Math.Between(50, this.worldWidth - 50);
            var y = Phaser.Math.Between(50, this.worldHeight - 50);
            var sides = 3;
            addPolygon(this, x, y, { sides: sides });
        }

        this.matter.world.on('collisionstart', function (event, bodyA, bodyB) {
            if (event.pairs.length > 1) return;
            if (!bodyA.gameObject || !bodyB.gameObject) return;
            let dist = Phaser.Math.Distance.BetweenPoints(bodyA.position, bodyB.position);
            let polySidesA = bodyA.gameObject.polySides;
            let polySidesB = bodyB.gameObject.polySides;
            let innerRA = sideLen / 2 / Math.sin(Math.PI / polySidesA) * Math.sin(Math.PI / 2 - Math.PI / polySidesA);
            let innerRB = sideLen / 2 / Math.sin(Math.PI / polySidesB) * Math.sin(Math.PI / 2 - Math.PI / polySidesB);
            let minDist = innerRA + innerRB;
            let res = dist - minDist;
            // if (res > 0 && res < 0.1) {
            if (Math.abs(res) < 0.5) {
                console.log(dist, polySidesA, polySidesB, minDist, res);
                let polyDescA = bodyA.gameObject.polyDesc;
                let polyDescB = bodyB.gameObject.polyDesc;
                bodyA.gameObject.destroy();
                bodyB.gameObject.destroy();
                let polyDescC = combinePolyDesc(polyDescA, polyDescB);
                let newX = Phaser.Math.Between(bodyA.position.x, bodyB.position.x);
                let newY = Phaser.Math.Between(bodyA.position.y, bodyB.position.y);
                addPolygon(this.scene, newX, newY, polyDescC);
            }
        });

        this.matter.add.mouseSpring();

        var cursors = this.input.keyboard.createCursorKeys();

        var controlConfig = {
            camera: cam,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
            acceleration: 0.06,
            drag: 0.0005,
            maxSpeed: 1.0
        };

        this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
    }

    update(time, delta) {
        this.controls.update(delta);
    }
}

export default MatterScene;
