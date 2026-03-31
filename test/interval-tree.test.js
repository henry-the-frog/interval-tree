import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { IntervalTree } from '../src/index.js';

describe('Insert', () => {
  it('should insert intervals', () => {
    const t = new IntervalTree();
    t.insert(15, 20).insert(10, 30).insert(17, 19);
    assert.equal(t.size, 3);
  });
});

describe('Point query', () => {
  it('should find intervals containing point', () => {
    const t = new IntervalTree();
    t.insert(15, 20, 'a').insert(10, 30, 'b').insert(5, 7, 'c');
    const results = t.queryPoint(18);
    assert.ok(results.some(r => r.data === 'a'));
    assert.ok(results.some(r => r.data === 'b'));
    assert.ok(!results.some(r => r.data === 'c'));
  });
  it('should return empty for non-covered point', () => {
    const t = new IntervalTree();
    t.insert(1, 5).insert(10, 15);
    assert.equal(t.queryPoint(7).length, 0);
  });
  it('should include boundary points', () => {
    const t = new IntervalTree();
    t.insert(5, 10);
    assert.equal(t.queryPoint(5).length, 1);
    assert.equal(t.queryPoint(10).length, 1);
  });
});

describe('Range query', () => {
  it('should find overlapping intervals', () => {
    const t = new IntervalTree();
    t.insert(1, 5, 'a').insert(3, 8, 'b').insert(10, 15, 'c');
    const results = t.queryRange(4, 6);
    assert.equal(results.length, 2); // a and b overlap [4,6]
    assert.ok(!results.some(r => r.data === 'c'));
  });
  it('should handle non-overlapping query', () => {
    const t = new IntervalTree();
    t.insert(1, 5).insert(10, 15);
    assert.equal(t.queryRange(6, 9).length, 0);
  });
});

describe('overlaps', () => {
  it('should detect overlap', () => {
    const t = new IntervalTree();
    t.insert(1, 5).insert(10, 15);
    assert.equal(t.overlaps(3, 7), true);
    assert.equal(t.overlaps(6, 9), false);
  });
});

describe('toArray', () => {
  it('should list all intervals in order', () => {
    const t = new IntervalTree();
    t.insert(10, 20).insert(5, 15).insert(25, 30);
    const arr = t.toArray();
    assert.equal(arr.length, 3);
    assert.ok(arr[0].low <= arr[1].low);
  });
});

describe('Schedule example', () => {
  it('should find conflicting meetings', () => {
    const t = new IntervalTree();
    t.insert(9, 10, 'standup');
    t.insert(10, 11, 'review');
    t.insert(14, 15, 'retro');
    // Find conflicts with 9:30-10:30
    const conflicts = t.queryRange(9.5, 10.5);
    assert.equal(conflicts.length, 2); // standup and review
  });
});
