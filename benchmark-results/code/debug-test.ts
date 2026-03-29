import { IntervalTree } from './glm-4.7';

const tree = new IntervalTree<number>();
console.log('Inserting intervals...');
tree.insert(-10, -5);
tree.insert(-3, 0);
tree.insert(2, 5);

console.log('Searching for point -4...');
const result = tree.search(-4);
console.log(`Found ${result.length} intervals:`);
result.forEach((interval, i) => {
  console.log(`  ${i+1}. [${interval.low}, ${interval.high}]`);
});
