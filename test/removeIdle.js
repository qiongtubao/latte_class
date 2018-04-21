var RemoveIdle = require('../lib/index').RemoveIdle;
var expect = require('chai').expect;

describe('removeidle的测试', function () {

  this.timeout(15000);

  it('release', () => {
    var r = new RemoveIdle({
      idleTimeoutMillis: 1000
    });
    var obj = "1";
    r.release(obj);
    expect(r.size()).to.be.equal(1);
  })
  it('desroy', () => {
    var r = new RemoveIdle({
      idleTimeoutMillis: 1000
    });

    var obj = "1";
    r.release(obj);
    expect(r.size()).to.be.equal(1);
    r.destroy(obj);
    expect(r.size()).to.be.equal(0);


  })
  it('destroyAllNow', () => {
    var r = new RemoveIdle({
      idleTimeoutMillis: 1000
    });
    var obj = "1";
    r.release(obj);
    expect(r.size()).to.be.equal(1);
    r.destroyAllNow();
    expect(r.size()).to.be.equal(0);
  })

  it('update', (done) => {
    var r = new RemoveIdle({
      idleTimeoutMillis: 1000
    });
    var obj = "1";
    r.release(obj);
    expect(r.size()).to.be.equal(1);
    setTimeout(function () {
      r.update(obj);
      r.removeIdle();
      expect(r.size()).to.be.equal(1);
      setTimeout(function () {
        expect(r.size()).to.be.equal(0);
        done();
      }, 1000);
    }, 1000);
  })
});