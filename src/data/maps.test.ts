import assert from 'node:assert';
import { QUESTIONS, MapScope, MapType } from './maps.js';

const VALID_MAP_TYPES: MapType[] = ["political", "physical", "climatic", "capitals", "rivers"];
const VALID_MAP_SCOPES: MapScope[] = ["world", "asia", "africa", "europe", "north-america", "south-america", "oceania", "india", "odisha"];

function validateQuestions() {
  const ids = new Set<string>();
  const scopes = Object.keys(QUESTIONS) as MapScope[];

  // 1. Verify all scopes are present in the QUESTIONS record
  for (const scope of VALID_MAP_SCOPES) {
    assert.ok(QUESTIONS[scope] !== undefined, `Missing MapScope: ${scope} in QUESTIONS`);
  }

  // 2. Iterate through each scope and its questions
  for (const scope of scopes) {
    const questions = QUESTIONS[scope];
    assert.ok(Array.isArray(questions), `QUESTIONS[${scope}] should be an array`);

    questions.forEach((q, index) => {
      const context = `Scope: ${scope}, Question Index: ${index}, ID: ${q.id}`;

      // 3. Ensure ID uniqueness
      assert.ok(!ids.has(q.id), `Duplicate ID found: ${q.id} in ${context}`);
      ids.add(q.id);

      // 4. Ensure non-empty required fields
      assert.ok(q.id.trim().length > 0, `Empty ID in ${context}`);
      assert.ok(q.text.trim().length > 0, `Empty text in ${context}`);
      assert.ok(q.targetId.trim().length > 0, `Empty targetId in ${context}`);
      assert.ok(q.targetName.trim().length > 0, `Empty targetName in ${context}`);

      // 5. Ensure valid category
      assert.ok(VALID_MAP_TYPES.includes(q.category), `Invalid category: ${q.category} in ${context}`);
    });
  }

  console.log('✅ All QUESTIONS configuration validation tests passed!');
}

try {
  validateQuestions();
} catch (error) {
  console.error('❌ Validation failed:');
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
