import Phaser from 'phaser';

class HelpScene extends Phaser.Scene {

    constructor() {
		super({key : 'HelpScene'});
	}

    preload () {
    }

    create () {
        this.cameras.main.setBackgroundColor(0xffffff);
        var helpContent = '\
Add simple polygons to the lab\nso they can collide and merge into complex ones!\n\
Collect your favorite polygons or sell them for credits.\n\
\n\
Use arrow keys to scroll camera.\nQ / E to zoom in and out\n\
\n\
First time game-maker, sorry for any rough experience!\n\
\
';
        var helpTextStyle = {
            fontFamily: 'Arial',
            fontSize: '24px',
            fontStyle: 'bold',
            backgroundColor: null,
            color: '#000',
            stroke: '#000',
            align: 'center',
            fixedWidth: 800,

        };
        var helpText = this.add.text(0, 150, helpContent, helpTextStyle);
        var backButtonTextStyle = {
            fontFamily: 'Arial',
            fontSize: '32px',
            fontStyle: '',
            backgroundColor: null,
            color: '#000',
            stroke: '#000',
            strokeThickness: 0,
            shadow: {
                offsetX: 0,
                offsetY: 0,
                color: '#000',
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
        var backButtonGameObject = this.add.text(300, 500, 'BACK', backButtonTextStyle);

        backButtonGameObject.setInteractive().on('pointerdown', () => this.onBackButton());
    }

    onBackButton () {
        this.scene.switch('TitleScene');
    }

    update (time, delta) {

    }
}

export default HelpScene;
