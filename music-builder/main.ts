import { MusicGeneratorService } from "./music-generator.service";
import { BitString } from "./BitString";
import { Composition, TimePeriod } from "./composition";
import { GMInstruments } from './musicKB';

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
    // TODO: REVERSE significance of boss speed and life --> higher speed / life = lower arousal / valence
    if (mon === 'ogre' || mon === 'spectre' || mon === 'boss'|| mon === 'deathknight') {
        var arousal = 0.5, valence = 0;
        for (let attrib in gamedb[bossKey][mon]) {
            if (attrib === 'speed') {
                let speed = parseInt(gamedb[bossKey][mon][attrib], 10);
                // speed = maxSpeed - speed + 10; // reversing significance
                // console.log('NEW speed: ' + speed);
                arousal = (((speed - minSpeed) * (0.9 - 0.1)) / (maxSpeed - minSpeed)) + 0.1;
                if (arousal < 0) { arousal = -arousal; }
                console.log('npc: ' + mon + ', speed: ' + speed);
            }
            if (attrib === 'life') {
                let life = parseInt(gamedb[bossKey][mon][attrib], 10); 
                life = maxLife - life + 10; // reversing significance
                console.log('NEW life: ' + life);
                valence = (((life - minLife) * (0.9 + 0.9)) / (maxLife - minLife)) - 0.9;
                console.log('npc: ' + mon + ', life: ' + life);
            }
        }
        // if (mon === 'boss' || mon === 'deathknight') { arousal = Math.abs(arousal - 0.5); }
        console.log('NPC: ' + mon + ':: arousal: ' + arousal + ', valence: ' + valence);
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

// TODO: Create mapping for instrument types to NPC friendliness

comp.instruments = {
    '1': GMInstruments.byCategory.strings.violin.number,
    '2': GMInstruments.byCategory.piano.acoustic_grand_piano.number,
    '3': GMInstruments.byCategory.guitar.acoustic_guitar_nylon.number,
};

// Grasslands Boss X
bossSongs[0].instruments = {
    '1': GMInstruments.byCategory.piano.acoustic_grand_piano.number,
    '2': GMInstruments.byCategory.guitar.acoustic_guitar_nylon.number,
    '3': GMInstruments.byCategory.reed.oboe.number,
};

// Desert Boss 
bossSongs[1].instruments = {
    '1': GMInstruments.byCategory.ethnic.koto.number,
    '2': GMInstruments.byCategory.ethnic.shamisen.number,
    '3': GMInstruments.byCategory.ethnic.kalimba.number,
};

// Final Boss X
bossSongs[2].instruments = {
    '1': GMInstruments.byCategory.strings.viola.number,
    '2': GMInstruments.byCategory.ensemble.synth_choir.number,
    '3': GMInstruments.byCategory.strings.violin.number,
};

// Graveyard Boss X
bossSongs[3].instruments = {
    '1': GMInstruments.byCategory.strings.violin.number,
    '2': GMInstruments.byCategory.pipe.ocarina.number,
    '3': GMInstruments.byCategory.chromatic_percussion.music_box.number,
};

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
