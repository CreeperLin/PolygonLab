import Phaser from 'phaser';
import eventManager from './eventman';
import { getPolyValue, getPolyDescHash, addPolygonGameObject } from './common';
import { getPolyTable } from './states';

class GalleryScene extends Phaser.Scene {

    constructor() {
        super({ key: 'GalleryScene' });
    }

    preload() {
    }

    create() {
        this.page = 0;
        this.numItems = 0;
        this.polyTable = getPolyTable();
        this.galleryEnabled = 0;
        var fillColor = 0xeeeeee;
        var fillAlpha = 0.7;
        var GalleryRect = this.add.rectangle(400, 350, 700, 500, fillColor, fillAlpha);
        var backButtonTextStyle = {
            fontFamily: 'Arial',
            fontSize: '32px',
            fontStyle: '',
            backgroundColor: null,
            color: '#000',
            stroke: '#000',
            align: 'center',  // 'left'|'center'|'right'|'justify'
            fixedWidth: 50,
            fixedHeight: 50,
        };
        let prevButtonGameObject = this.add.text(80, 315, '⏪', backButtonTextStyle);
        let nextButtonGameObject = this.add.text(675, 315, '⏩', backButtonTextStyle);
        prevButtonGameObject.setInteractive().on('pointerup', () => { this.onPrevButton(); });
        nextButtonGameObject.setInteractive().on('pointerup', () => { this.onNextButton(); });
        let gRows = 3;
        let gCols = 4;
        let gItems = [];
        for (let i = 0; i < gRows; ++i) {
            for (let j = 0; j < gCols; ++j) {
                let x = 215 + j * 125;
                let y = 200 + i * 125;
                let item = this.add.rectangle(x, y, 100, 100, 0xdddddd, 0.7);
                let img = this.add.image(x, y, '__WHITE');
                gItems.push(img);
            }
        }
        this.numPageText = this.add.text(375, 520, '0', backButtonTextStyle);
        this.gItems = gItems;
        this.numItemsPage = gRows * gCols;
        this.showItems();
        eventManager.on('poly-table-updated', () => { this.showItems(); });
    }

    showItems() {
        for (let i = 0; i < this.gItems.length; ++i) {
            this.gItems[i].setTexture('__WHITE');
        }
        let index = -1;
        for (let key in this.polyTable) {
            ++index;
            if (index < this.page * this.numItemsPage || index >= (this.page + 1) * this.numItemsPage) continue;
            let polyDesc = this.polyTable[key];
            let img = this.gItems[index - this.page * this.numItemsPage];
            img.setTexture(getPolyDescHash(polyDesc));
        }
        this.numItems = index + 1;
        this.numPageText.text = this.page + 1;
    }

    onPrevButton() {
        if (this.page <= 0) return;
        --this.page;
        this.showItems();
    }

    onNextButton() {
        if ((this.page + 1) * this.numItemsPage >= this.numItems) return;
        ++this.page;
        this.showItems();
    }

    update(time, delta) {
    }
}

export default GalleryScene;
