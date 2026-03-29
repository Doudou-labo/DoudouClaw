import assert from 'assert';
import { IntervalTree } from "./glm-4.7-flash.js";

let testsPassed = 0;
let testsFailed = 0;
let testsExecuted = 0;

function runTest(name, fn) {
  testsExecuted++;
  try {
    fn();
    testsPassed++;
    console.log(`✓ ${name}`);
  } catch (error) {
    testsFailed++;
    console.log(`✗ ${name}`);
    console.log(`  Error: ${error.message}`);
  }
}

console.log('\nRunning IntervalTree tests...\n');

runTest('should insert and retrieve intervals', () => {
  try {
    const tree = new IntervalTree();
    console.log('Tree created:', tree);
    tree.insert(1, 5, 10);
    console.log('After insert 1:', tree.root);
    tree.insert(10, 20, 30);
    console.log('After insert 2:', tree.root);
    tree.insert(15, 25, 40);
    console.log('After insert 3:', tree.root);
    const result = tree.search(18);
    console.log('Search result:', result);
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].value, 30);
  } catch (error) {
    console.log('Error in test:', error);
    throw error;
  }
});

console.log(`\nTotal: ${testsExecuted}, Passed: ${testsPassed}, Failed: ${testsFailed}`);
process.exit(testsFailed === 0 ? 0 : 1);
