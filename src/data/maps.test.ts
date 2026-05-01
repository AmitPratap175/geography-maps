import assert from 'node:assert';
import { QUESTIONS, MapScope, MapType, MAP_SOURCES, RIVER_SOURCES, LAKE_SOURCES } from './maps.js';

const VALID_MAP_TYPES: MapType[] = ["political", "physical", "climatic", "capitals", "rivers"];
const VALID_MAP_SCOPES: MapScope[] = ["world", "asia", "africa", "europe", "north-america", "south-america", "oceania", "india", "odisha"];

function validateSources() {
  // Validate MAP_SOURCES
  for (const scope of VALID_MAP_SCOPES) {
    const url = MAP_SOURCES[scope];
    assert.ok(url, `Missing MAP_SOURCES for scope: ${scope}`);
    assert.ok(url.startsWith('https://'), `Invalid URL for MAP_SOURCES[${scope}]: ${url}`);
  }

  // Validate RIVER_SOURCES
  for (const scope in RIVER_SOURCES) {
    const s = scope as MapScope;
    assert.ok(VALID_MAP_SCOPES.includes(s), `Invalid MapScope in RIVER_SOURCES: ${s}`);
    const url = RIVER_SOURCES[s];
    assert.ok(url && url.startsWith('https://'), `Invalid URL for RIVER_SOURCES[${s}]: ${url}`);
  }

  // Validate LAKE_SOURCES
  for (const scope in LAKE_SOURCES) {
    const s = scope as MapScope;
    assert.ok(VALID_MAP_SCOPES.includes(s), `Invalid MapScope in LAKE_SOURCES: ${s}`);
    const url = LAKE_SOURCES[s];
    assert.ok(url && url.startsWith('https://'), `Invalid URL for LAKE_SOURCES[${s}]: ${url}`);
  }

  console.log('✅ All Source configuration validation tests passed!');
}

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
  validateSources();
  validateQuestions();
} catch (error) {
  console.error('❌ Validation failed:');
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
