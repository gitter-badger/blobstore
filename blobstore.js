var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
var blobstoreAbi = require('./blobstore.abi.json');
var blobstoreContract = web3.eth.contract(blobstoreAbi);
var blobstoreAddress = '0x3c531591cb807e01404574076f429d205f5ee981';
var blobstore = blobstoreContract.at(blobstoreAddress);

//Solidity version: 0.1.7-f86451cd/.-Emscripten/clang/int linked to libethereum-1.1.0-35b67881/.-Emscripten/clang/int

var storeBlob = function(blob) {
  var gas = 44800 + 78 * blob.length;
  blobstore.storeBlob('0x' + blob.toString('hex'), {gas: gas});
  return '0x' + web3.sha3(blob.toString('ascii'));
}

var getBlobBlock = function(hash) {
  return blobstore.getBlobBlock(hash).toFixed();
}

var getBlob = function(hash, callback) {

  var block = blobstore.getBlobBlock(hash).toFixed();
  var filter = web3.eth.filter({fromBlock: block, toBlock: block, address: blobstoreAddress, topics: [hash]});
  filter.get(function(error, result) {
    var length = parseInt(result[0].data.substr(66, 64), 16);
    callback(new Buffer(result[0].data.substr(130, length * 2), 'hex'));
  });
}

module.exports = {
  storeBlob: storeBlob,
  getBlobBlock: getBlobBlock,
  getBlob: getBlob
};
