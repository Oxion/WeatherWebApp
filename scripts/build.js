var fse = require('fs-extra');

fse.emptyDirSync('./dist/server');
fse.copySync('./src/server', './dist/server');