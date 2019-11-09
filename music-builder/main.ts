import { MusicGeneratorService } from "./music-generator.service";
import { BitString } from "./BitString";
import { Composition, TimePeriod } from "./composition";

const MGS = new MusicGeneratorService();
let bitstr = "";
for (let i = 0; i < 20; i++) {
    bitstr += Math.random() > 0.5 ? "0" : "1";
}
const seed = new BitString(bitstr);
const comp = new Composition(
    0.8,
    0.8,
    TimePeriod.Present,
    seed
);

(window as any).Comp = Composition;
(window as any).MGS = MGS;
(window as any).c = comp;

window.onload = function() {
    MGS.playSong(comp);
}