var Queue = require('../lib/index').Queue;
var expect = require('chai').expect;

describe('queue的测试', function () {
    var q = new Queue(2);
    it('enqueue', () => {
        q.enqueue("1", 0);
    })
    it('size', () => {
        expect(q.size()).to.be.equal(1);
    });
    it('dequeue', () => {
        expect(q.dequeue()).to.be.equal("1");
    })
    it('sort', () => {
        q.enqueue("1", 0);
        q.enqueue("2", 1);
        q.enqueue("3", 0);
        expect(q.size()).to.be.equal(3);
        expect(q.dequeue()).to.be.equal("1");
        expect(q.dequeue()).to.be.equal("3");
        expect(q.dequeue()).to.be.equal("2");
    });
});