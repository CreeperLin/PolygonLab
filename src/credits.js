import Phaser from 'phaser';

class CreditsScene extends Phaser.Scene {

    constructor() {
		super({key : 'CreditsScene'});
	}

    preload () {
    }

    create () {
        this.cameras.main.setBackgroundColor(0xffffff);
        var creditsContent = '\
Made by\n\
Creeper Lin\n\
<creeperlin@mail.com>\n\
\n\
Libraries & Repos\n\
Phaser3\n\
phaser3-project-template\n\
Electron\n\
electron-builder\n\
\n\
Tools & Environments\n\
Ubuntu 20.04, VSCode, Chromium, Git, etc.\n\
\n\
PolygonLab Repo (MIT License)\n\
github.com/CreeperLin/PolygonLab\n\
\n\
\
';
        var creditsTextStyle = {
            fontFamily: 'Arial',
            fontSize: '24px',
            fontStyle: 'bold',
            backgroundColor: null,
            color: '#000',
            stroke: '#000',
            align: 'center',
            fixedWidth: 800,
        };
        var creditsText = this.add.text(0, 50, creditsContent, creditsTextStyle);
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

export default CreditsScene;
