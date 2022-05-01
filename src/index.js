import Phaser from 'phaser';
import MatterScene from './matter';
import TitleScene from './title';
import CreditsScene from './credits';
import HelpScene from './help';
import HUDScene from './hud';
import GalleryScene from './gallery';
import { initPolyTableRecorder } from './states';

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    pixelArt: true,
    scale: {
        // Fit to window
        mode: Phaser.Scale.FIT,
        // Center vertically and horizontally
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'matter',
        // default: 'arcade',
        matter: {
            // plugins: {
            //     attractors: true,
            //     // ...
            // },
            gravity: {
                y: 0,
            },
            // debug: true,
        },
        arcade: {
            gravity: { y: 0 },
            debug: false
        },
    },
};

const game = new Phaser.Game(config);
initPolyTableRecorder();

var titleScene = new TitleScene();
var matterScene = new MatterScene();
var creditsScene = new CreditsScene();
var helpScene = new HelpScene();
var hudScene = new HUDScene();
var galleryScene = new GalleryScene();

game.scene.add('TitleScene', titleScene);
game.scene.add('GameScene', matterScene);
game.scene.add('CreditsScene', creditsScene);
game.scene.add('HelpScene', helpScene);
game.scene.add('HUDScene', hudScene);
game.scene.add('GalleryScene', galleryScene);

game.scene.start('TitleScene');
