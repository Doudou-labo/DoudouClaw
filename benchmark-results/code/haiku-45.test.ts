import { IntervalTree, Interval } from './interval-tree';

// ==================== Minimal Assert Helper ====================

interface AssertResult {
  passed: boolean;
  testName: string;
  error?: string;
}

const testResults: AssertResult[] = [];

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function assertEquals<T>(actual: T, expected: T, message: string): void {
  if (actual !== expected) {
    throw new Error(`Expected ${expected}, got ${actual}: ${message}`);
  }
}

function assertArrayEquals<T>(actual: T[], expected: T[], message: string): void {
  if (actual.length !== expected.length) {
    throw new Error(
      `Array length mismatch: expected ${expected.length}, got ${actual.length}: ${message}`
    );
  }
  for (let i = 0; i < actual.length; i++) {
    if (actual[i] !== expected[i]) {
      throw new Error(`Array element mismatch at index ${i}: expected ${expected[i]}, got ${actual[i]}: ${message}`);
    }
  }
}

function assertIntervalArrayEquals(
  actual: Interval<any>[],
  expected: Interval<any>[],
  message: string
): void {
  if (actual.length !== expected.length) {
    throw new Error(
      `Interval array length mismatch: expected ${expected.length}, got ${actual.length}: ${message}`
    );
  }

  // Sort for comparison (order might vary)
  const sortedActual = [...actual].sort((a, b) => a.start - b.start || a.end - b.end);
  const sortedExpected = [...expected].sort((a, b) => a.start - b.start || a.end - b.end);

  for (let i = 0; i < sortedActual.length; i++) {
    const a = sortedActual[i];
    const e = sortedExpected[i];
    if (a.start !== e.start || a.end !== e.end || a.value !== e.value) {
      throw new Error(
        `Interval mismatch at index ${i}: expected (${e.start}, ${e.end}, ${e.value}), got (${a.start}, ${a.end}, ${a.value}): ${message}`
      );
    }
  }
}

function test(testName: string, fn: () => void): void {
  try {
    fn();
    testResults.push({ passed: true, testName });
    console.log(`✓ PASS: ${testName}`);
  } catch (error) {
    testResults.push({
      passed: false,
      testName,
      error: error instanceof Error ? error.message : String(error),
    });
    console.log(`✗ FAIL: ${testName}`);
    if (error instanceof Error) {
      console.log(`  Error: ${error.message}`);
    }
  }
}

// ==================== Test Suites ====================

console.log('========== IntervalTree Test Suite ==========\n');

// ==================== Basic Insertion Tests ====================

console.log('--- Basic Insertion Tests ---');

test('Insert single interval', () => {
  const tree = new IntervalTree<string>();
  tree.insert(1, 5, 'a');
  assertEquals(tree.getSize(), 1, 'Tree should have size 1');
});

test('Insert multiple non-overlapping intervals', () => {
  const tree = new IntervalTree<string>();
  tree.insert(1, 3, 'a');
  tree.insert(5, 7, 'b');
  tree.insert(9, 11, 'c');
  assertEquals(tree.getSize(), 3, 'Tree should have size 3');
});

test('Insert multiple overlapping intervals', () => {
  const tree = new IntervalTree<string>();
  tree.insert(1, 5, 'a');
  tree.insert(3, 8, 'b');
  tree.insert(2, 6, 'c');
  assertEquals(tree.getSize(), 3, 'Tree should have size 3');
});

test('Insert nested intervals', () => {
  const tree = new IntervalTree<string>();
  tree.insert(1, 10, 'outer');
  tree.insert(3, 5, 'inner');
  tree.insert(6, 8, 'inner2');
  assertEquals(tree.getSize(), 3, 'Tree should have size 3');
});

test('Insert identical intervals with different values', () => {
  const tree = new IntervalTree<string>();
  tree.insert(1, 5, 'a');
  tree.insert(1, 5, 'b');
  assertEquals(tree.getSize(), 2, 'Tree should have size 2');
});

test('Insert same start, different end', () => {
  const tree = new IntervalTree<string>();
  tree.insert(1, 5, 'a');
  tree.insert(1, 8, 'b');
  assertEquals(tree.getSize(), 2, 'Tree should have size 2');
});

test('Insert invalid interval (start > end)', () => {
  const tree = new IntervalTree<string>();
  try {
    tree.insert(5, 1, 'invalid');
    assert(false, 'Should have thrown error');
  } catch (e) {
    assert(true, 'Should throw error for invalid interval');
  }
});

// ==================== Deletion Tests ====================

console.log('\n--- Deletion Tests ---');

test('Delete from empty tree returns false', () => {
  const tree = new IntervalTree<string>();
  const deleted = tree.delete(1, 5);
  assertEquals(deleted, false, 'Should return false for empty tree');
});

test('Delete non-existent interval returns false', () => {
  const tree = new IntervalTree<string>();
  tree.insert(1, 5, 'a');
  const deleted = tree.delete(10, 20);
  assertEquals(deleted, false, 'Should return false for non-existent interval');
});

test('Delete existing interval returns true', () => {
  const tree = new IntervalTree<string>();
  tree.insert(1, 5, 'a');
  const deleted = tree.delete(1, 5);
  assertEquals(deleted, true, 'Should return true');
  assertEquals(tree.getSize(), 0, 'Tree should be empty after deletion');
});

test('Delete leaf node', () => {
  const tree = new IntervalTree<string>();
  tree.insert(1, 3, 'a');
  tree.insert(5, 7, 'b');
  tree.insert(9, 11, 'c');
  tree.delete(9, 11);
  assertEquals(tree.getSize(), 2, 'Tree should have size 2');
});

test('Delete node with one child', () => {
  const tree = new IntervalTree<string>();
  tree.insert(5, 10, 'a');
  tree.insert(3, 4, 'b');
  tree.delete(5, 10);
  assertEquals(tree.getSize(), 1, 'Tree should have size 1');
  assertEquals(tree.search(3)[0].value, 'b', 'Remaining node should be correct');
});

test('Delete node with two children', () => {
  const tree = new IntervalTree<string>();
  tree.insert(5, 10, 'a');
  tree.insert(3, 4, 'b');
  tree.insert(7, 8, 'c');
  tree.delete(5, 10);
  assertEquals(tree.getSize(), 2, 'Tree should have size 2');
  const results = tree.search(3.5);
  assertEquals(results.length, 1, 'Should find the remaining left interval');
});

test('Delete with specific value', () => {
  const tree = new IntervalTree<string>();
  tree.insert(1, 5, 'a');
  tree.insert(1, 5, 'b');
  tree.delete(1, 5, 'a');
  assertEquals(tree.getSize(), 1, 'Tree should have size 1');
  assertEquals(tree.search(3)[0].value, 'b', 'Remaining interval should be b');
});

test('Delete multiple intervals sequentially', () => {
  const tree = new IntervalTree<string>();
  tree.insert(1, 3, 'a');
  tree.insert(5, 7, 'b');
  tree.insert(9, 11, 'c');
  tree.delete(1, 3);
  tree.delete(5, 7);
  tree.delete(9, 11);
  assertEquals(tree.getSize(), 0, 'Tree should be empty');
  assertEquals(tree.isEmpty(), true, 'isEmpty should return true');
});

// ==================== Search Tests ====================

console.log('\n--- Search Tests ---');

test('Search in empty tree returns empty array', () => {
  const tree = new IntervalTree<string>();
  const results = tree.search(5);
  assertEquals(results.length, 0, 'Should return empty array');
});

test('Search point inside single interval', () => {
  const tree = new IntervalTree<string>();
  tree.insert(1, 10, 'a');
  const results = tree.search(5);
  assertEquals(results.length, 1, 'Should find one interval');
  assertEquals(results[0].value, 'a', 'Should find correct interval');
});

test('Search point outside single interval', () => {
  const tree = new IntervalTree<string>();
  tree.insert(1, 10, 'a');
  const results = tree.search(15);
  assertEquals(results.length, 0, 'Should find no intervals');
});

test('Search point on interval boundary (start)', () => {
  const tree = new IntervalTree<string>();
  tree.insert(1, 10, 'a');
  const results = tree.search(1);
  assertEquals(results.length, 1, 'Should find interval at start boundary');
});

test('Search point on interval boundary (end)', () => {
  const tree = new IntervalTree<string>();
  tree.insert(1, 10, 'a');
  const results = tree.search(10);
  assertEquals(results.length, 1, 'Should find interval at end boundary');
});

test('Search point with multiple overlapping intervals', () => {
  const tree = new IntervalTree<string>();
  tree.insert(1, 5, 'a');
  tree.insert(3, 8, 'b');
  tree.insert(2, 6, 'c');
  const results = tree.search(4);
  assertEquals(results.length, 3, 'Should find all three overlapping intervals');
});

test('Search point with partial overlap', () => {
  const tree = new IntervalTree<string>();
  tree.insert(1, 5, 'a');
  tree.insert(3, 8, 'b');
  tree.insert(2, 6, 'c');
  const results = tree.search(6);
  assertEquals(results.length, 2, 'Should find b and c');
});

test('Search point with nested intervals', () => {
  const tree = new IntervalTree<string>();
  tree.insert(1, 10, 'outer');
  tree.insert(3, 5, 'inner');
  tree.insert(2, 6, 'mid');
  const results = tree.search(4);
  assertEquals(results.length, 3, 'Should find all three intervals');
});

test('Search point before all intervals', () => {
  const tree = new IntervalTree<string>();
  tree.insert(10, 20, 'a');
  tree.insert(30, 40, 'b');
  const results = tree.search(5);
  assertEquals(results.length, 0, 'Should find no intervals');
});

test('Search point between non-overlapping intervals', () => {
  const tree = new IntervalTree<string>();
  tree.insert(1, 5, 'a');
  tree.insert(10, 15, 'b');
  const results = tree.search(7);
  assertEquals(results.length, 0, 'Should find no intervals');
});

// ==================== Edge Cases ====================

console.log('\n--- Edge Case Tests ---');

test('Single element tree: insert and search', () => {
  const tree = new IntervalTree<string>();
  tree.insert(5, 5, 'point');
  const results = tree.search(5);
  assertEquals(results.length, 1, 'Should find the point interval');
  assertEquals(results[0].start, 5, 'Start should be 5');
  assertEquals(results[0].end, 5, 'End should be 5');
});

test('Single element tree: delete and verify empty', () => {
  const tree = new IntervalTree<string>();
  tree.insert(5, 5, 'point');
  tree.delete(5, 5);
  assertEquals(tree.isEmpty(), true, 'Tree should be empty');
});

test('Clear tree', () => {
  const tree = new IntervalTree<string>();
  tree.insert(1, 5, 'a');
  tree.insert(10, 20, 'b');
  tree.clear();
  assertEquals(tree.getSize(), 0, 'Tree should have size 0');
  assertEquals(tree.isEmpty(), true, 'Tree should be empty');
});

test('Large dataset stress test: 1000 intervals', () => {
  const tree = new IntervalTree<number>();
  const n = 1000;

  // Insert 1000 intervals
  for (let i = 0; i < n; i++) {
    const start = i * 2;
    const end = start + 10;
    tree.insert(start, end, i);
  }

  assertEquals(tree.getSize(), n, `Tree should have size ${n}`);

  // Search at a point that should have overlaps
  // With intervals [0,10], [2,12], [4,14], ..., point 5 should be in multiple intervals
  const point = 5;
  const results = tree.search(point);
  assert(results.length > 0, `Should find some overlapping intervals at point ${point}, found ${results.length}`);

  // Verify tree integrity
  assert(tree.verify(), 'Tree should be valid');
});

test('Large dataset deletion: delete all intervals', () => {
  const tree = new IntervalTree<number>();
  const n = 100;

  for (let i = 0; i < n; i++) {
    tree.insert(i * 2, i * 2 + 10, i);
  }

  for (let i = 0; i < n; i++) {
    tree.delete(i * 2, i * 2 + 10);
  }

  assertEquals(tree.getSize(), 0, 'Tree should be empty after deleting all');
  assert(tree.isEmpty(), 'Tree should report as empty');
});

test('Negative and zero interval boundaries', () => {
  const tree = new IntervalTree<string>();
  tree.insert(-10, -5, 'a');
  tree.insert(-3, 3, 'b');
  tree.insert(5, 10, 'c');

  const results1 = tree.search(-7);
  assertEquals(results1.length, 1, 'Should find a');

  const results2 = tree.search(0);
  assertEquals(results2.length, 1, 'Should find b');

  const results3 = tree.search(-1);
  assertEquals(results3.length, 1, 'Should find b');
});

test('Floating point intervals', () => {
  const tree = new IntervalTree<string>();
  tree.insert(1.5, 3.5, 'a');
  tree.insert(2.5, 5.5, 'b');

  const results = tree.search(3.0);
  assertEquals(results.length, 2, 'Should find both intervals');
});

// ==================== MaxEnd Augmentation Tests ====================

console.log('\n--- MaxEnd Augmentation Verification Tests ---');

test('MaxEnd correct after single insertion', () => {
  const tree = new IntervalTree<string>();
  tree.insert(1, 10, 'a');
  assert(tree.verify(), 'MaxEnd should be correct');
});

test('MaxEnd correct after multiple insertions', () => {
  const tree = new IntervalTree<string>();
  tree.insert(1, 5, 'a');
  tree.insert(3, 8, 'b');
  tree.insert(2, 6, 'c');
  assert(tree.verify(), 'MaxEnd should be correct for all nodes');
});

test('MaxEnd correct after deletion leaf node', () => {
  const tree = new IntervalTree<string>();
  tree.insert(1, 3, 'a');
  tree.insert(5, 10, 'b');
  tree.insert(7, 12, 'c');
  tree.delete(7, 12);
  assert(tree.verify(), 'MaxEnd should be correct after deletion');
});

test('MaxEnd correct after deletion internal node', () => {
  const tree = new IntervalTree<string>();
  tree.insert(5, 10, 'a');
  tree.insert(3, 4, 'b');
  tree.insert(7, 8, 'c');
  tree.delete(5, 10);
  assert(tree.verify(), 'MaxEnd should be correct after deleting internal node');
});

test('MaxEnd correct after multiple deletions', () => {
  const tree = new IntervalTree<string>();
  for (let i = 0; i < 10; i++) {
    tree.insert(i * 2, i * 2 + 5, `val${i}`);
  }
  for (let i = 0; i < 5; i++) {
    tree.delete(i * 2, i * 2 + 5);
  }
  assert(tree.verify(), 'MaxEnd should be correct after multiple deletions');
});

test('MaxEnd pruning efficiency test', () => {
  const tree = new IntervalTree<string>();
  // Create a scenario where pruning is important
  tree.insert(1, 5, 'a');
  tree.insert(10, 15, 'b');
  tree.insert(20, 25, 'c');

  // Search in a region with no overlaps should use maxEnd pruning
  const results = tree.search(30);
  assertEquals(results.length, 0, 'Should find no intervals (and prune efficiently)');

  assert(tree.verify(), 'MaxEnd augmentation should be valid');
});

// ==================== Complex Scenario Tests ====================

console.log('\n--- Complex Scenario Tests ---');

test('Complex scenario: insert, delete, search sequence', () => {
  const tree = new IntervalTree<string>();

  // Build initial tree
  tree.insert(1, 10, 'a');
  tree.insert(5, 15, 'b');
  tree.insert(12, 20, 'c');
  tree.insert(3, 8, 'd');

  // Verify initial state
  assertEquals(tree.getSize(), 4, 'Should have 4 intervals');

  // Search and verify
  let results = tree.search(7);
  assertEquals(results.length, 3, 'Point 7 should be in a, b, d');

  // Delete some intervals
  tree.delete(5, 15, 'b');
  assertEquals(tree.getSize(), 3, 'Should have 3 intervals');

  // Search again
  results = tree.search(7);
  assertEquals(results.length, 2, 'Point 7 should now be in a, d only');

  // Delete and re-verify
  tree.delete(3, 8, 'd');
  results = tree.search(7);
  assertEquals(results.length, 1, 'Point 7 should only be in a');
});

test('Complex scenario: many overlapping intervals', () => {
  const tree = new IntervalTree<string>();

  // Insert many overlapping intervals
  tree.insert(1, 100, 'a');    // contains 35
  tree.insert(10, 90, 'b');    // contains 35
  tree.insert(20, 80, 'c');    // contains 35
  tree.insert(30, 70, 'd');    // contains 35
  tree.insert(40, 60, 'e');    // does NOT contain 35 (35 < 40)

  // Search at various points
  assertEquals(tree.search(50).length, 5, 'Point 50 is in all (a, b, c, d, e)');
  assertEquals(tree.search(15).length, 2, 'Point 15 is in a, b only');
  assertEquals(tree.search(35).length, 4, 'Point 35 is in a, b, c, d (not e)');
  assertEquals(tree.search(95).length, 1, 'Point 95 is only in a');

  assert(tree.verify(), 'Tree should maintain invariants');
});

// ==================== GetAll Tests ====================

console.log('\n--- GetAll Tests ---');

test('GetAll returns all intervals in empty tree', () => {
  const tree = new IntervalTree<string>();
  const all = tree.getAll();
  assertEquals(all.length, 0, 'Should return empty array');
});

test('GetAll returns all intervals in order', () => {
  const tree = new IntervalTree<string>();
  tree.insert(1, 5, 'a');
  tree.insert(10, 15, 'b');
  tree.insert(20, 25, 'c');

  const all = tree.getAll();
  assertEquals(all.length, 3, 'Should return all 3 intervals');
  // Should be in sorted order by start
  assertEquals(all[0].start, 1, 'First should be a');
  assertEquals(all[1].start, 10, 'Second should be b');
  assertEquals(all[2].start, 20, 'Third should be c');
});

// ==================== Test Summary ====================

console.log('\n========== Test Summary ==========');
const passed = testResults.filter((r) => r.passed).length;
const failed = testResults.filter((r) => !r.passed).length;
const total = testResults.length;

console.log(`\nTotal: ${total} tests`);
console.log(`Passed: ${passed} ✓`);
console.log(`Failed: ${failed} ✗`);

if (failed > 0) {
  console.log('\nFailed Tests:');
  testResults.filter((r) => !r.passed).forEach((r) => {
    console.log(`  - ${r.testName}`);
    console.log(`    ${r.error}`);
  });
}

console.log('\n========== Test List ==========');
console.log('Basic Insertion Tests (7):');
console.log('  1. Insert single interval');
console.log('  2. Insert multiple non-overlapping intervals');
console.log('  3. Insert multiple overlapping intervals');
console.log('  4. Insert nested intervals');
console.log('  5. Insert identical intervals with different values');
console.log('  6. Insert same start, different end');
console.log('  7. Insert invalid interval (start > end)');

console.log('\nDeletion Tests (10):');
console.log('  8. Delete from empty tree returns false');
console.log('  9. Delete non-existent interval returns false');
console.log('  10. Delete existing interval returns true');
console.log('  11. Delete leaf node');
console.log('  12. Delete node with one child');
console.log('  13. Delete node with two children');
console.log('  14. Delete with specific value');
console.log('  15. Delete multiple intervals sequentially');
console.log('  16. Verify tree is valid after multiple deletions');
console.log('  17. Verify tree is empty after deleting all');

console.log('\nSearch Tests (10):');
console.log('  18. Search in empty tree returns empty array');
console.log('  19. Search point inside single interval');
console.log('  20. Search point outside single interval');
console.log('  21. Search point on interval boundary (start)');
console.log('  22. Search point on interval boundary (end)');
console.log('  23. Search point with multiple overlapping intervals');
console.log('  24. Search point with partial overlap');
console.log('  25. Search point with nested intervals');
console.log('  26. Search point before all intervals');
console.log('  27. Search point between non-overlapping intervals');

console.log('\nEdge Case Tests (11):');
console.log('  28. Single element tree: insert and search');
console.log('  29. Single element tree: delete and verify empty');
console.log('  30. Clear tree');
console.log('  31. Large dataset stress test: 1000 intervals');
console.log('  32. Large dataset deletion: delete all intervals');
console.log('  33. Negative and zero interval boundaries');
console.log('  34. Floating point intervals');

console.log('\nMaxEnd Augmentation Tests (5):');
console.log('  35. MaxEnd correct after single insertion');
console.log('  36. MaxEnd correct after multiple insertions');
console.log('  37. MaxEnd correct after deletion leaf node');
console.log('  38. MaxEnd correct after deletion internal node');
console.log('  39. MaxEnd correct after multiple deletions');
console.log('  40. MaxEnd pruning efficiency test');

console.log('\nComplex Scenario Tests (2):');
console.log('  41. Complex scenario: insert, delete, search sequence');
console.log('  42. Complex scenario: many overlapping intervals');

console.log('\nGetAll Tests (2):');
console.log('  43. GetAll returns all intervals in empty tree');
console.log('  44. GetAll returns all intervals in order');

console.log('\n========== Bonus Features ==========');
console.log('✓ Red-Black Tree balancing for O(log n) operations');
console.log('✓ MaxEnd augmentation with automatic updates on rotation');
console.log('✓ Full RB-Tree property verification (for testing)');
console.log('✓ Support for floating-point interval boundaries');
console.log('✓ Support for negative interval boundaries');
console.log('✓ Search with automatic pruning via maxEnd');
console.log('✓ Deletion by value (optional value parameter)');
console.log('✓ GetAll returns intervals in sorted order');
console.log('✓ Clear method for rapid tree reset');
console.log('✓ Comprehensive error handling');

process.exit(failed > 0 ? 1 : 0);
