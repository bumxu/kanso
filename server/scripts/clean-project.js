const rimraf = require('rimraf');

(async () => {
    console.log('Cleaning project...');

    // Remove folder ./dist
    await rimraf.rimraf('./dist');
    console.log('Folder "dist" removed');

    // Remove folder ./temp
    await rimraf.rimraf('./temp');
    console.log('Folder "temp" removed');

    console.log('Done');

})();
