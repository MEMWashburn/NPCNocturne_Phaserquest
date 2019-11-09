// import SliderPlugin from '../../plugins/slider-plugin.js';

var config = {
    width:980,
    height: 500,
    renderer: (navigator.userAgent.toLowerCase().indexOf('firefox') > -1 ? Phaser.CANVAS : Phaser.AUTO),
    parent: document.getElementById('game'),
    state: null,
    transparent: true,
    antialias: false,
    plugins: {
        global: [{
            key: 'rexSlider',
            // plugin: SliderPlugin,
            start: true
        },
        ]
    }
}

var game = new Phaser.Game(config);

game.state.add('Home',Home);
game.state.add('Game',Game);
game.state.start('Home');

