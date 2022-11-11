const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
console.log('counter func', counter);

var items = {};
exports.dataDir = path.join(__dirname, 'data');

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    // console.log('get unique inner cb', id);
    items['id'] = id;
    items['text'] = text;

    // console.log('Item ID', items.id);

    var uniquePath = path.join(exports.dataDir, `/${items.id}.txt`);

    fs.writeFile(uniquePath, text, (err) => {
      if (err) {
        console.log('write err', err);
        callback(err);
      } else {
        callback(null, { id: items.id, text: text });
      }
    });
  });
};

exports.readAll = (callback) => {
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });

  var fileNames = fs.readdirSync(exports.dataDir);

  var data = _.map(fileNames, (text, index) => {
    // console.log('text', text.replace('.txt', ''), 'index', index);
    return {'id': text.replace('.txt', ''), 'text': text.replace('.txt', '')};
  });

  // console.log('Read Dir Log', data);
  callback(null, data);
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

// exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
