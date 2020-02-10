const path = require('path');

module.exports = {
    mode: 'development',
    entry: './music-builder/main.ts',
    // entry: path.join(__dirname, 'js/client/music-builder/music-generator.service.ts'),
    output: {
        filename: 'thing.js',
        path: path.resolve(__dirname, 'js')
        // path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
};