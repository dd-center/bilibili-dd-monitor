// @ts-ignore
import storage from 'electron-json-storage'

function _printDefaultDataPath () {
  const defaultDataPath = storage.getDefaultDataPath()
  // C:\Users\{user}\AppData\Roaming\bilibili-dd-monitor\storage
  console.log(defaultDataPath)
}

function _printDataPath () {
  const dataPath = storage.getDataPath();
  // C:\Users\{user}\AppData\Roaming\bilibili-dd-monitor\storage
  console.log(dataPath);
}

function _getDemo () {
  storage.get('foobar', function(error: any, data: {}) {
    if (error) throw error;
    console.log(data);//{}
  });
}

function _getSyncDemo () {
  const data = storage.getSync('foobar');
  console.log(data);
}

function _setDemo () {
  // setting path =>  C:\Users\wdpm\AppData\Roaming\bilibili-dd-monitor\foobar.json
  // content =>  {"foo":"bar"}
  storage.set('foobar', { foo: 'bar' }, function(error: any) {
    if (error) throw error;
  });
}

function _hasDemo () {
  storage.has('foobar', function(error: boolean | Error, hasKey: boolean) {
    if (error) throw error;

    if (hasKey) {
      console.log('There is data stored as `foobar`');
    }
  });
}

function _removeDemo () {
  // remove foobar.json file
  storage.remove('foobar', function(error: boolean | Error) {
    if (error) throw error;
  });
}

function _clear () {
  // remove all files under /storage folder
  storage.clear(function(error: boolean | Error) {
    if (error) throw error;
  });
}

export {
  _printDefaultDataPath,
  _printDataPath,
  _getDemo,
  _getSyncDemo,
  _setDemo,
  _hasDemo,
  _removeDemo,
  _clear
}
