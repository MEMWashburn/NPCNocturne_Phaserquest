import { MusicGeneratorService } from "./music-generator.service";
import { BitString } from "./BitString";
import { Composition, TimePeriod } from "./composition";

var gamedb = require('../assets/json/db.json');

var mons: string[] = [];
var bossSongs: Composition[] = [];
var bossKey: string = "";
Object.keys(gamedb).forEach(function(key) {
    if (key === 'monsters') {
        bossKey = key;
    }
});

const MGS = new MusicGeneratorService();
function newBitString(): BitString {
    let bitstr = "";
    for (let i = 0; i < 20; i++) {
        bitstr += Math.random() > 0.5 ? "0" : "1";
    }
    const seed = new BitString(bitstr);
    return seed;
}

// function convertRange(value: number, inHigh: number, inLow: number,
//     outHigh: number, outLow: number): number {
//     return ((value - inLow) / (inHigh - inLow)) * (outHigh - outLow) + outLow;
// }

// ************************************************************
// Tying NPC attributes to music generation parameters here.
// For the time being, arousal maps to speed
//                     valence maps to life
// Max / min NPC attribute values from "../assets/json/db.json"
// ************************************************************
let maxLife = 351,  minLife = 24;
let maxSpeed = 501, minSpeed = 199;
let maxAtk = 4,     minAtk = 1;
let maxDef = 15,    minDef = 2;
for (let mon in gamedb[bossKey]) {
    // Grasslands Boss  = ogre          = 0
    // Desert Boss      = spectre       = 1
    // Final Boss       = boss          = 2 (Lava Boss)
    // Graveyard Boss   = deathknight   = 3
    mons.push(mon);
    if (mon === 'ogre' || mon === 'spectre' || mon === 'boss'|| mon === 'deathknight') {
        var arousal = 0.5, valence = 0;
        for (let attrib in gamedb[bossKey][mon]) {
            if (attrib === 'speed') {
                let speed = parseInt(gamedb[bossKey][mon][attrib], 10); 
                arousal = (((speed - minSpeed) * (0.9 - 0.1)) / (maxSpeed - minSpeed)) + 0.1;
                console.log('boss: ' + mon + ', speed: ' + speed);
            }
            if (attrib === 'life') {
                let life = parseInt(gamedb[bossKey][mon][attrib], 10); 
                valence = (((life - minLife) * (0.9 + 0.9)) / (maxLife - minLife)) - 0.9;;
                console.log('boss: ' + mon + ', life: ' + life);
            }
        }
        console.log('BOSS: ' + mon + ':: arousal: ' + arousal + ', valence: ' + valence);
        bossSongs.unshift(
            new Composition(
                arousal,
                valence,
                TimePeriod.Present,
                newBitString()
            )
        );
    }
}

(window as any).monsSpeed = gamedb[bossKey][mons[0]];

const comp = new Composition(
    0.8,    //  0.1 --> 0.9
    0.8,   // -0.9 --> 0.9
    TimePeriod.Present,
    newBitString()
);

(window as any).GameDB = gamedb;
(window as any).FoundMons = mons;

(window as any).BitString = BitString;
(window as any).Comp = Composition;
(window as any).MGS = MGS;
(window as any).c = comp;

(window as any).grasslandsComp = bossSongs[0];
(window as any).desertComp = bossSongs[1];
(window as any).finalComp = bossSongs[2];
(window as any).graveyardComp = bossSongs[3];

// window.onload = function() {
//     var context = new AudioContext();
//     // One-liner to resume playback when user interacted with the page.
//     document.querySelector('button').addEventListener('click', function() {
//         context.resume().then(() => {
//         console.log('Playback resumed successfully');
//         });
//     });
//     MGS.playSong(comp);
// }
