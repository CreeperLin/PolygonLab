import Phaser from 'phaser';
import eventManager from './eventman';
import { getPolyValue, addPolygonGameObject } from './common';

class HUDScene extends Phaser.Scene {

    constructor() {
        super({ key: 'HUDScene' });
    }

    preload() {
    }

    create() {
        this.galleryEnabled = 0;
        this.toolBoxEnabled = 0;
        this.toolSelected = 0;
        this.score = 100;
        var fnAddPolygon = (scene, pointer, polyDesc) => {
            let price = 2 * getPolyValue(polyDesc);
            if (scene.score < price) return;
            var touchX = pointer.x;
            var touchY = pointer.y;
            if (touchY < 150) return;
            eventManager.emit('polygon-create', touchX, touchY, polyDesc);
            scene.score -= price;
        };
        this.tools = [
            {
                name: 'None',
                text: '🚫',
            },
            {
                name: 'Sell',
                text: '💲',
                fnPolygonTouched: (scene, gameObject) => {
                    scene.score += getPolyValue(gameObject.polyDesc);
                    gameObject.destroy();
                },
            },
            {
                name: 'Add ($6)',
                poly: 3,
                fnClicked: function (scene, pointer) {
                    let polyDesc = { sides: 3 };
                    fnAddPolygon(scene, pointer, polyDesc);
                },
            },
            {
                name: 'Add ($8)',
                poly: 4,
                fnClicked: function (scene, pointer) {
                    let polyDesc = { sides: 4 };
                    fnAddPolygon(scene, pointer, polyDesc);
                },
            },
            {
                name: 'Add ($10)',
                poly: 5,
                fnClicked: function (scene, pointer) {
                    let polyDesc = { sides: 5 };
                    fnAddPolygon(scene, pointer, polyDesc);
                },
            },
            {
                name: 'Add ($12)',
                poly: 6,
                fnClicked: function (scene, pointer) {
                    let polyDesc = { sides: 6 };
                    fnAddPolygon(scene, pointer, polyDesc);
                },
            },
        ];
        eventManager.on('polygon-touched', (gameObject) => {
            let tool = this.tools[this.toolSelected];
            if (tool.fnPolygonTouched) tool.fnPolygonTouched(this, gameObject);
        }, this);
        this.input.on('pointerup', function (pointer) {
            let tool = this.tools[this.toolSelected];
            if (tool.fnClicked) tool.fnClicked(this, pointer);
        }, this);
        var fillColor = 0xeeeeee;
        var fillAlpha = 0.7;
        var HUDRect = this.add.rectangle(0, 0, 1600, 150, fillColor, fillAlpha);
        var scoreTextStyle = {
            fontFamily: 'Arial',
            fontSize: '24px',
            fontStyle: 'bold',
            backgroundColor: null,
            color: '#000',
            stroke: '#000',
            align: 'center',
            fixedWidth: 800,
        };
        this.scoreText = this.add.text(0, 20, '', scoreTextStyle);
        var backButtonTextStyle = {
            fontFamily: '"Noto Color Emoji", "Apple Color Emoji", "Segoe UI Emoji", Times, Symbola, Aegyptus, Code2000, Code2001, Code2002, Musica, serif, LastResort',
            fontSize: '32px',
            fontStyle: '',
            backgroundColor: null,
            color: '#000',
            stroke: '#000',
            align: 'center',  // 'left'|'center'|'right'|'justify'
            fixedWidth: 50,
            fixedHeight: 50,
        };
        var backButtonGameObject = this.add.text(700, 20, '🔙', backButtonTextStyle);
        var galleryButtonGameObject = this.add.text(625, 20, '📘', backButtonTextStyle);
        var toolsButtonGameObject = this.add.text(50, 20, '🧰', backButtonTextStyle);
        backButtonGameObject.setInteractive().on('pointerdown', () => this.onBackButton());
        galleryButtonGameObject.setInteractive().on('pointerdown', () => this.onGalleryButton());
        toolsButtonGameObject.setInteractive().on('pointerdown', () => this.onToolsButton());
        var toolBoxRectFillColor = 0xdddddd;
        var toolTextStyle = {
            fontFamily: 'Arial',
            fontSize: '20px',
            fontStyle: 'bold',
            color: '#000',
            stroke: '#000',
            align: 'left',
            fixedWidth: 100,
            fixedHeight: 50,
        };
        this.toolBoxRect = this.add.rectangle(0, 325, 450, 500, toolBoxRectFillColor, fillAlpha);
        this.toolBoxRect.setVisible(false);
        this.toolButtons = [];
        this.toolTexts = [];
        for (let i = 0; i < this.tools.length; ++i) {
            let tool = this.tools[i];
            let toolBtn;
            if (tool.text) {
                toolBtn = this.add.text(20, 100 + i * 70, tool.text, backButtonTextStyle);
            } else if (tool.poly) {
                toolBtn = addPolygonGameObject(this, 50, 115 + i * 70, { sides: tool.poly });
            }
            toolBtn.setInteractive().on('pointerup', () => {
                setTimeout(() => { this.toolSelected = i; }, 100);
                this.toolSelectedGameObject.text = this.tools[i].text || this.tools[i].poly;
                this.hideToolBox();
            });
            toolBtn.setVisible(false);
            this.toolButtons.push(toolBtn);
            let toolText = this.add.text(90, 105 + i * 70, tool.name, toolTextStyle);
            toolText.setInteractive().on('pointerup', () => {
                setTimeout(() => { this.toolSelected = i; }, 100);
                this.toolSelectedGameObject.text = this.tools[i].text || this.tools[i].poly;
                this.hideToolBox();
            });
            toolText.setVisible(false);
            this.toolTexts.push(toolText);
        }
        var toolSelectedRect = this.add.rectangle(150, 40, 40, 40, fillColor, fillAlpha);
        toolSelectedRect.setStrokeStyle(2, 0, 1);
        var toolSelectedTextStyle = {
            fontFamily: 'Arial',
            fontSize: '24px',
            fontStyle: '',
            color: '#000',
            stroke: '#000',
            align: 'center',  // 'left'|'center'|'right'|'justify'
            fixedWidth: 50,
            fixedHeight: 50,
        };
        this.toolSelectedGameObject = this.add.text(125, 25, '', toolSelectedTextStyle);
        this.toolSelectedGameObject.text = this.tools[this.toolSelected].text;
    }

    onGalleryButton() {
        if (!this.galleryEnabled) {
            this.scene.run('GalleryScene');
            this.galleryEnabled = 1;
        } else {
            this.scene.sleep('GalleryScene');
            this.galleryEnabled = 0;
        }
    }

    onToolsButton() {
        if (!this.toolBoxEnabled) this.showToolBox();
        else this.hideToolBox();
    }

    showToolBox() {
        this.toolSelected = 0;
        this.toolBoxRect.setVisible(true);
        for (let i = 0; i < this.toolButtons.length; ++i) {
            this.toolButtons[i].setVisible(true);
            this.toolTexts[i].setVisible(true);
        }
        this.toolBoxEnabled = 1;
    }

    hideToolBox() {
        this.toolBoxRect.setVisible(false);
        for (let i = 0; i < this.toolButtons.length; ++i) {
            this.toolButtons[i].setVisible(false);
            this.toolTexts[i].setVisible(false);
        }
        this.toolBoxEnabled = 0;
    }

    onBackButton() {
        eventManager.emit('game-exit');
    }

    update(time, delta) {
        this.scoreText.text = `Credits: ${this.score}`
    }
}

export default HUDScene;
