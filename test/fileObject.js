var FileObject = require('../lib/index').FileObject;
var expect = require('chai').expect;

describe('fileObject测试', function () {
  var fo = new FileObject({
    filePath: __dirname + "/.latte.lock"
  });

  it('set', () => {
    fo.set('a', 0)
    fo.set('a', 1)
  });
  it('close', () => {
    fo.close();
  })
  it('renew', () => {
    fo = new FileObject({
      filePath: __dirname + "/.latte.lock"
    });

  });
  it('get', () => {
    expect(fo.get('a')).to.be.equal(1);
  })
});