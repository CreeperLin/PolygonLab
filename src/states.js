import eventManager from './eventman';
import { getPolyDescHash, getCanonPolyDesc } from './common';

var polyTable = {};
var polyTableRecording = 0;

export function getPolyTable() {
    return polyTable;
}

export function initPolyTableRecorder() {
    eventManager.on('polygon-created', (polyDesc) => {
        if (!polyTableRecording) return;
        let key = getPolyDescHash(polyDesc);
        if (key in polyTable) return;
        polyTable[key] = getCanonPolyDesc(polyDesc);
        console.log('table', polyTable[key]);
        eventManager.emit('poly-table-updated');
    });
    eventManager.on('poly-table-recording-enable', () => { polyTableRecording = 1; });
    eventManager.on('poly-table-recording-disable', () => { polyTableRecording = 0; });
}
