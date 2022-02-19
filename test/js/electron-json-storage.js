const storage = require('electron-json-storage');

var data = storage.getSync('foobar');
console.log(data);
