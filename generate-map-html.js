// create columns and rows
// create a hex for each data point with a div
// create stylesheet to color each hex 
// allow GM to Hide hex type.

const fs = require('fs').promises;
const args = process.argv.slice(2);
const hideHexData = args[0] === 'true';

const createHexes = async () => {
    const rawMapData = await fs.readFile('./map-data/rando.json').catch((err) => console.log(err));
    const mapData = JSON.parse(rawMapData.toString());
    const { hexes, maxHeight, maxWidth }  = mapData;
    
    const checkPreviousTerrain = (terrainType, currentX, currentY) => {
        if (terrainType !== 'Previous terrain') {
            return terrainType;
        }
        
        if (currentX === 1 && terrainType  === 'Previous terrain') {
            return 'Plain';
        }

        const previousHex = hexes[`X: ${currentX - 1} Y: ${currentY}`].terrainType;

        return checkPreviousTerrain(previousHex, currentX -1, currentY);
    }
    
    let htmlMap = `<!doctype html> <html><head><title>Test Map</title><meta charset="UTF-8"><link rel="stylesheet" href="styles.css"></head><body><div class="map-container"><div class="honeycomb">`;

    for (let i = 0; i < maxHeight; i++) {
        const currentX = i + 1;
        
        htmlMap += `<div class="col col-${currentX}">`;

        for (let j = 0; j < maxWidth; j++) {
            const currentY = j + 1;
            const { terrainType, hexType, optionalInfo} = hexes[`X: ${currentX} Y: ${currentY}`];
            const terrain = checkPreviousTerrain(terrainType, currentX, currentY);
            htmlMap += `<a class="hex hex-${currentX}-${currentY} "><div class="wrapper"><div class="hexagon ${terrain}"></div></div> <span class="content"> <small>${hideHexData ? '' : hexType}</small> <strong>${optionalInfo ? `${optionalInfo} - ` : ' '}${terrain}</strong> </span> </a>`
        }
        
        htmlMap += '</div>';

    }

    htmlMap += `</div></div><div class="shadows"></div></body</html>`

    return fs.writeFile('./map-html-files/map-1.html', htmlMap);
}

createHexes().then(() => console.log('Done!'));