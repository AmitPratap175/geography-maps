import { shuffle } from "./shuffle";
import assert from 'node:assert';

function testShuffle() {
  console.log("Testing shuffle function...");

  // 1. maintain the same elements
  const input = [1, 2, 3, 4, 5];
  const result = shuffle(input);
  assert.strictEqual(result.length, input.length, "Result length should match input length");
  assert.deepStrictEqual([...result].sort(), [...input].sort(), "Result should have the same elements as input");

  // 2. return a new array
  assert.notStrictEqual(result, input, "Should return a new array instance");

  // 3. handle empty array
  const emptyInput: number[] = [];
  const emptyResult = shuffle(emptyInput);
  assert.deepStrictEqual(emptyResult, [], "Empty array should return empty array");
  assert.notStrictEqual(emptyResult, emptyInput, "Should return a new array instance even for empty");

  // 4. handle single element array
  const singleInput = [1];
  const singleResult = shuffle(singleInput);
  assert.deepStrictEqual(singleResult, [1], "Single element array should return same element");
  assert.notStrictEqual(singleResult, singleInput, "Should return a new array instance even for single element");

  // 5. shuffle elements (probabilistic)
  const largeInput = Array.from({ length: 100 }, (_, i) => i);
  const largeResult = shuffle(largeInput);
  // It's extremely unlikely that a 100-element array remains in the same order
  assert.notDeepStrictEqual(largeResult, largeInput, "100 elements should likely be shuffled");

  console.log("✅ All shuffle tests passed!");
}

try {
  testShuffle();
} catch (error) {
  console.error("❌ Shuffle tests failed:");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
