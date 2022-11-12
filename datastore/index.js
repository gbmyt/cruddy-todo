const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = []; // { id: 00001, text: 'str' }
var itemsTest = items;
exports.itemsTest = itemsTest;

// items = [
//   { id: '00001', text: 'todo 1' },
//   { id: '00002', text: 'todo 2' }
// ]
exports.dataDir = path.join(__dirname, 'data');

// Public API - Fix these CRUD functions /////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    // console.log('get unique inner cb', id);
    var todo = {
      'id': id,
      'text': text
    };
    items.push(todo);

    // console.log('Item ID', items.id);

    var uniquePath = path.join(exports.dataDir, `/${id}.txt`);

    fs.writeFile(uniquePath, text, (err) => {
      if (err) {
        console.log('write err', err);
        callback(err);
      } else {
        callback(null, todo);
      }
    });
  });
};

exports.readAll = (callback) => {
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });

  fs.readdir(exports.dataDir, (err, fileNames) => {
    if (err) {
      callback(err);
    } else {

      var data = _.map(fileNames, (id, index) => {
        // console.log('text', text.replace('.txt', ''), 'index', index);
        return { 'id': id.replace('.txt', ''), 'text': items[index].text };
      });

      // console.log('Read Dir Log', data);
      callback(null, data);
    }
  });
};

exports.readOne = (id, callback) => {
  var paddedNum = id;

  var pathName = path.join(exports.dataDir, paddedNum + '.txt');

  fs.readFile(pathName, (err, data) => {
    if (err) {
      callback(err);
    } else {
      callback(null, { 'id': id, 'text': data.toString() });
    }
  });
};

// First pass .update refactor (passes test suite)
exports.update = (id, text, callback) => {

  var filePath = path.join(exports.dataDir, id + '.txt');

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.log('Hi :)');
      callback(err);
    } else {
      fs.writeFile(filePath, text, (err, data) => {
        if (err) {
          callback(err);
        } else {
          callback({ id, text });

          for (var i of items) {
            if (i['id'] === id) {
              i['text'] = text;
            }
          }

        }
      });
    }
  });
  // }
};

exports.delete = (id, callback) => {

  var filePath = path.join(exports.dataDir, id + '.txt');

  fs.unlink(filePath, (err, data) => {
    if (err) {
      callback(err);
    } else {
      callback(null, data);

      for (var i = 0; i < items.length; i++) {
        if (items[i]['id'] === id) {
          items.splice(i, 1);
        }
      }
    }
  });
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

// exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};


