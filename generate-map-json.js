const fs = require('fs');
const args = process.argv.slice(2);
const axios = require('axios');

const rollD20 = (qNumber) => {
    const rollResult = Math.floor(qNumber / 12.75);
    return rollResult ? rollResult : 1;
}

const callQRNG = async (numberOfRolls) => {
    return await axios.get(`https://qrng.anu.edu.au/API/jsonI.php?length=${numberOfRolls}&type=uint8`).then((response) => {
        return response.data.data.map(rollD20);
    } ).catch(() => Math.floor(Math.random * 21));
}

const generateHexJson = async () => {
    const [width, height] = args;
    const totalNumberOfHex = width * height;
    const terrainTypeRolls = await callQRNG(totalNumberOfHex);
    const hexTypeRolls = await callQRNG(totalNumberOfHex);
    
    const hexes = {};
    
    const getTerrianType = (index) => {
        const number = terrainTypeRolls[index];
        switch(number) {
            case 1:
            case 2:
            case 3:
                return 'Forest';
            case 4:
            case 5:
            case 6:
                return 'Hill';
            case 7:
            case 8:
                return 'Marsh';
            case 9:
            case 10:
                return 'Mountain';
            case 11:
            case 12: 
            case 13:
                return 'Plain';
            case 14:
                return 'Settlement';
            case 15:
            case 16:
                return 'Water';
            case 17:
            case 18: 
            case 19:
            case 20:
                return 'Previous terrain';
            default: 
                return 'Previous terrain'
    
        }
    }
    
    const getHexType = (index) => {
        const number = hexTypeRolls[index];
        switch(number) {
            case 1:
            case 2:
            case 3:
                return 'Difficult';
            case 4:
            case 5:
            case 6:
                return 'Feature';
            case 7:
            case 8:
            case 9:
            case 10:
                return 'Hunting Ground';
            case 11:
            case 12:
                return 'Resource';
            case 13:
            case 14:
                return 'Secret';
            case 15:
            case 16:
            case 17:
            case 18: 
            case 19:
            case 20:
                return 'Standard';
            default: 
                return 'Standard';
    
        }
    }
    
    const generateHexInfo = async (numberOfXHexes, numberOfYHexes) => {
        hexes['maxWidth'] = numberOfXHexes;
        hexes['maxHeight'] = numberOfYHexes;
        hexes['hexes'] = {};
    
    
        let totalHexesRemaining = totalNumberOfHex;
    
    
        for (let i = 0; i < numberOfXHexes; i++) {
           for (let j = 0; j < numberOfYHexes; j++) {
            const currentHexIndex = totalHexesRemaining - 1 ;
            hexes['hexes'][`X: ${i + 1} Y: ${j + 1}`] = {
                terrainType: getTerrianType(currentHexIndex),
                hexType: getHexType(currentHexIndex),
                optionalInfo: null
            };
    
            totalHexesRemaining--;
           } 
        }
    }
    
    return generateHexInfo(width, height).then(() => {
        const json = JSON.stringify(hexes);
    
        fs.writeFile('./map-data/rando.json', json, 'utf8', () => console.log('Json Created!'));
    });
    
    
}

generateHexJson();