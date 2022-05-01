import Phaser from 'phaser';
import { addPolygon, getRandomPolyDesc } from './common';

class TitleScene extends Phaser.Scene {

    constructor() {
        super({ key: 'TitleScene' });
    }

    preload() {
    }

    create() {
        this.cameras.main.setBackgroundColor(0xffffff);
        this.matter.world.setBounds(0, 0, 800, 600);
        this.matter.add.mouseSpring();
        var titleTextStyle = {
            fontFamily: 'Arial',
            fontSize: '64px',
            fontStyle: 'bold',
            backgroundColor: null,
            color: '#000',
            stroke: '#000',
            align: 'center',
            fixedWidth: 500,
        };
        var titleText = this.add.text(150, 150, 'Polygon Lab', titleTextStyle);
        var startButtonTextStyle = {
            fontFamily: 'Arial',
            fontSize: '28px',
            fontStyle: '',
            backgroundColor: null,
            color: '#000',
            stroke: '#000',
            strokeThickness: 0,
            shadow: {
                offsetX: 0,
                offsetY: 0,
                color: '#fff',
                blur: 0,
                stroke: false,
                fill: false
            },
            align: 'center',  // 'left'|'center'|'right'|'justify'
            padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
            },
            maxLines: 0,
            lineSpacing: 0,
            fixedWidth: 200,
            fixedHeight: 0,
            rtl: false,
            wordWrap: {
                width: null,
                callback: null,
                callbackScope: null,
                useAdvancedWrap: false
            },
            metrics: false
        };
        // addPolygon(this, 100, 100, {sides: 3});
        addPolygon(this, 100, 100, {sides: 3, children: {0: {sides: 4,},1: {sides: 4,},2: {sides: 4,},}});
        addPolygon(this, 700, 500, { sides: 4, children: { 1: { sides: 4, children: {1: {sides: 3}, 2: {sides: 3}, 3: {sides: 3}}}, } });
        addPolygon(this, 100, 500, { sides: 5, children: { 1: { sides: 3, }, } });
        addPolygon(this, 700, 100, { sides: 6, children: { 1: { sides: 4, }, } });
        var startButtonGameObject = this.add.text(300, 350, 'PLAY', startButtonTextStyle);
        var helpButtonGameObject = this.add.text(300, 425, 'HELP', startButtonTextStyle);
        var creditsButtonGameObject = this.add.text(300, 500, 'CREDITS', startButtonTextStyle);
        helpButtonGameObject.setInteractive().on('pointerdown', () => this.scene.switch('HelpScene'));
        startButtonGameObject.setInteractive().on('pointerdown', () => this.onStartButton());
        creditsButtonGameObject.setInteractive().on('pointerdown', () => this.onCreditsButton());
        titleText.setInteractive().on('pointerdown', () => {
            addPolygon(this, 400, 300, getRandomPolyDesc(3));
        });
    }

    onStartButton() {
        this.scene.switch('GameScene');
    }

    onCreditsButton() {
        this.scene.switch('CreditsScene');
    }

    update(time, delta) {

    }
}

export default TitleScene;
