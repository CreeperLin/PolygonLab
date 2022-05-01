import Phaser from 'phaser';
import eventManager from './eventman';

export function getCompoundVerts(desc, v1, v2) {
    let sides = desc.sides;
    let children = desc.children || {};
    let verts = [];
    let lastVert = v1;
    let last2Vert = v2;
    let angle = Math.PI * (sides - 2) / sides;
    for (let i = 0; i < sides; ++i) {
        let vert = {};
        if (i == 0) {
            vert = v2;
        } else if (i == sides - 1) {
            vert = v1;
        } else {
            let vecX = last2Vert.x - lastVert.x;
            let vecY = last2Vert.y - lastVert.y;
            let newX = Math.cos(angle) * vecX + Math.sin(angle) * vecY;
            let newY = Math.cos(angle) * vecY - Math.sin(angle) * vecX;
            vert = { x: lastVert.x + newX, y: lastVert.y + newY };
            // vert = Phaser.Math.Rotate({x: vecX, y: vecY}, -angle);
        }
        let childDesc = children[i];
        if (childDesc) {
            let cVerts = getCompoundVerts(childDesc, vert, lastVert);
            verts = verts.concat(cVerts.slice(1, -1));
        }
        verts.push(vert);
        last2Vert = lastVert;
        lastVert = vert;
    }
    // verts.push(v1);
    return verts;
}

export function getCompoundVertsRoot(desc, sideLen) {
    let sides = desc.sides;
    let angle = 2 * Math.PI / sides;
    let radius = sideLen / 2 / Math.sin(angle / 2);
    let v1 = { x: radius, y: 0 };
    let v2 = { x: radius * Math.cos(angle), y: radius * Math.sin(angle) };
    return getCompoundVerts(desc, v1, v2);
}

export function zeroAlignPoints(points) {
    let xmin = 0;
    let ymin = 0;
    let alignPoints = [];
    for (let i = 0; i < points.length; ++i) {
        if (points[i].x < xmin) xmin = points[i].x;
        if (points[i].y < ymin) ymin = points[i].y;
    }
    for (let i = 0; i < points.length; ++i) {
        alignPoints.push({ x: points[i].x - xmin, y: points[i].y - ymin });
    }
    return alignPoints;
}

export function combinePolyDesc(descA, descB) {
    let newDesc = JSON.parse(JSON.stringify(descA));
    let children = newDesc.children || {};
    newDesc.children = children;
    var randomOrder = [];
    for (let i = 1; i < newDesc.sides; ++i) {
        randomOrder.push(i);
    }
    randomOrder = randomOrder.sort(function () {
        return .5 - Math.random();
    });
    for (let i = 1; i < newDesc.sides; ++i) {
        let idx = randomOrder[i];
        if (children[idx]) {
            continue;
        }
        children[idx] = JSON.parse(JSON.stringify(descB));
        return newDesc;
    }
    for (let i = 0; i < newDesc.sides; ++i) {
        let idx = randomOrder[i];
        let childDesc = children[idx];
        if (childDesc) {
            let newChildDesc = combinePolyDesc(childDesc, descB);
            if (newChildDesc) {
                children[idx] = newChildDesc;
                return newDesc;
            }
        }
    }
    return null;
}

export function getPolySides(desc) {
    let sides = desc.sides;
    let children = desc.children || {};
    let childSides = 0;
    for (let i = 0; i < sides; ++i) {
        let childDesc = children[i];
        if (childDesc) {
            let childValue = getPolySides(childDesc);
            childSides += childValue - 2;
        }
    }
    return sides + childSides;
}

export function getPolyValue(desc) {
    let sides = desc.sides;
    let children = desc.children || {};
    let childNum = 0;
    let childValNorm = 0;
    for (let i = 0; i < sides; ++i) {
        let childDesc = children[i];
        if (childDesc) {
            let childValue = getPolyValue(childDesc);
            childValNorm = Math.max(childValue, childValNorm);
            ++childNum;
        }
    }
    return sides + (childValNorm + 2) * childNum;
}

var polyColors = [
    0x000000,
    0x000000,
    0x000000,
    0xff0000,
    0x00ff00,
    0x0000ff,
    0xff7f00,
    0x00ffff,
    0xff00ff,
];

export function getPolyColor(desc) {
    return polyColors[desc.sides];
}

export function drawPolygon(graphics, polyDesc, v1, v2) {
    var lineColor = getPolyColor(polyDesc);
    var lineAlpha = 0.7;
    let lineWidth = 4;
    let sides = polyDesc.sides;
    let children = polyDesc.children || {};
    graphics.lineStyle(lineWidth, lineColor, lineAlpha);
    graphics.beginPath();
    graphics.moveTo(v1.x, v1.y);
    let lastVert = v1;
    let last2Vert = v2;
    let angle = Math.PI * (sides - 2) / sides;
    for (let i = 0; i < sides; ++i) {
        let vert = {};
        if (i == 0) {
            vert = v2;
        } else if (i == sides - 1) {
            vert = v1;
        } else {
            let vecX = last2Vert.x - lastVert.x;
            let vecY = last2Vert.y - lastVert.y;
            let newX = Math.cos(angle) * vecX + Math.sin(angle) * vecY;
            let newY = Math.cos(angle) * vecY - Math.sin(angle) * vecX;
            vert = { x: lastVert.x + newX, y: lastVert.y + newY };
        }
        graphics.lineTo(vert.x, vert.y);
        graphics.closePath();
        graphics.strokePath();
        let childDesc = children[i];
        if (childDesc) {
            drawPolygon(graphics, childDesc, vert, lastVert);
        }
        graphics.lineStyle(lineWidth, lineColor, lineAlpha);
        graphics.beginPath();
        graphics.moveTo(vert.x, vert.y);
        last2Vert = lastVert;
        lastVert = vert;
    }
    graphics.moveTo(v2.x, v2.y);
    graphics.closePath();
    graphics.strokePath();
}

export function getCanonPolyDesc(polyDesc) {
    let sides = polyDesc.sides;
    let children = polyDesc.children || {};
    let newDesc = {};
    newDesc.sides = sides;
    newDesc.children = children;
    return newDesc;
    // let newChildren = {};
    // let canonChildren = [];
    // let canonChildrenPos = [];
    // newDesc.children = newChildren;
    // for (let i = 1; i < sides; ++i) {
    //     let childDesc = children[i];
    //     if (childDesc) {
    //         let childDescCanon = getCanonPolyDesc(childDesc);
    //         canonChildren.push(childDescCanon);
    //         canonChildrenPos.push(i);
    //     }
    // }
    // for (let i = 0; i < canonChildren.length; ++i) {
    //     newChildren[canonChildrenPos[i] - canonChildrenPos[0] + 1] = canonChildren[i];
    // }
    // return newDesc;
}

export function getPolyDescHash(polyDesc) {
    return JSON.stringify(getCanonPolyDesc(polyDesc));
}

export function addPolygonTexture(scene, polyDesc, verts, sideLen) {
    let key = getPolyDescHash(polyDesc);
    if (scene.textures.exists(key)) return key;
    var graphics = scene.make.graphics({ x: 0, y: 0, add: false });
    let sides = polyDesc.sides;
    let angle = 2 * Math.PI / sides;
    let radius = sideLen / 2 / Math.sin(angle / 2);
    let v1 = { x: radius, y: 0 };
    let v2 = { x: radius * Math.cos(angle), y: radius * Math.sin(angle) };
    let xmin = 0;
    let ymin = 0;
    let xmax = 0;
    let ymax = 0;
    for (let i = 0; i < verts.length; ++i) {
        if (verts[i].x > xmax) xmax = verts[i].x;
        if (verts[i].y > ymax) ymax = verts[i].y;
        if (verts[i].x < xmin) xmin = verts[i].x;
        if (verts[i].y < ymin) ymin = verts[i].y;
    }
    let width = xmax - xmin + 4;
    let height = ymax - ymin + 4;
    v1.x -= xmin - 1;
    v1.y -= ymin - 1;
    v2.x -= xmin - 1;
    v2.y -= ymin - 1;
    drawPolygon(graphics, polyDesc, v1, v2);
    graphics.generateTexture(getPolyDescHash(polyDesc), width, height);
    return key;
}

export function addPolygonGameObject(scene, x, y, polyDesc, verts, sideLen = 20) {
    if (!verts) verts = getCompoundVertsRoot(polyDesc, sideLen);
    let key = addPolygonTexture(scene, polyDesc, verts, sideLen);
    var gameobj = scene.add.image(x, y, key);
    return gameobj
}

export function addPolygon(scene, x, y, polyDesc) {
    polyDesc = getCanonPolyDesc(polyDesc);
    var sideLen = 20;
    let verts = getCompoundVertsRoot(polyDesc, sideLen);
    let gameobj = addPolygonGameObject(scene, x, y, polyDesc, verts, sideLen);
    verts = zeroAlignPoints(verts);
    gameobj.setInteractive().on('pointerdown', function (pointer, localX, localY, event) {
        eventManager.emit('polygon-touched', gameobj);
    }, scene);
    gameobj.polyDesc = polyDesc;
    gameobj.polySides = getPolySides(polyDesc);
    if (scene.matter) {
        var element_config = {
            // isStatic: true,
            restitution: 1,
            friction: 0,
            frictionStatic: 0,
            frictionAir: 0.0,
            slop: 0.05,

            collisionFilter: {
                group: 0,
                category: 0x0001,
                mask: 0xFFFFFFFF,
            },
        };
        element_config.shape = {
            type: 'fromVerts',
            verts: verts,
            flagInternal: false,
            // removeCollinear: 0.01,
            // minimumArea: 10,
        };
        scene.matter.add.gameObject(gameobj, element_config);
        if (!gameobj.body.position || !gameobj.body.positionPrev) return null;
        var velScale = 2.0;
        var angVelScale = 0.01;
        gameobj.setVelocity(velScale * (-1 + 2 * Phaser.Math.Between(0, 1)), velScale * (-1 + 2 * Phaser.Math.Between(0, 1)));
        gameobj.setAngularVelocity(angVelScale * (-1 + 2 * Phaser.Math.Between(0, 1)));
    }
    eventManager.emit('polygon-created', polyDesc);
    return gameobj
}


export function getRandomPolyDesc(maxDepth = 3, maxNum = 3) {
    let desc = {};
    var sides = Phaser.Math.Between(3, 5);
    desc.sides = sides;
    desc.children = {};
    if (maxDepth > 0) {
        for (let i = 1; i < sides; ++i) {
            if (Math.random() < 0.2 && maxNum) {
                desc.children[i] = getRandomPolyDesc(maxDepth - 1, --maxNum);
            }
        }
    }
    return desc;
}
