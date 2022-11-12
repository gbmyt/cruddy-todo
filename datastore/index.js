const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
var Promise = require('bluebird');
// const readdir = Promise.promisify(fs.readdir);

var items = [];
var itemsTest = items;
exports.itemsTest = itemsTest;

exports.dataDir = path.join(__dirname, 'data');

// Public API - Fix these CRUD functions /////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    var todo = {
      'id': id,
      'text': text
    };
    items.push(todo);

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
  fs.readdir(exports.dataDir, (err, fileNames) => {
    if (err) {
      callback(err);
    } else {

      var data = _.map(fileNames, (id, index) => {
        return {
          'id': id.replace('.txt', ''),
          'text': items[index].text
        };
      });

      Promise.all(data).then(data => {
        callback(null, data);
      });
    }
  });
};

// exports.readAll = (callback) => {
//   var promise = new Promise((resolve, reject) => {
//     fs.readdir(exports.dataDir, (err, data) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(data);
//       }
//     });
//   });

//   Promise.all(promise).then((fileNames) => {
//     var data = _.map(fileNames, (id, index) => {
//       return { 'id': id.replace('.txt', ''), 'text': items[index].text };
//     });
//     // return data; // return here? resolve??
//     callback(null, data);
//   });
//   return promise;
// };

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