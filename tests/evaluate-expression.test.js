const test = require("node:test");
const assert = require("node:assert/strict");
const { evaluateExpression } = require("../index.js");

test("accepts typographic multiplication and division symbols", () => {
  assert.equal(evaluateExpression("6 × 7"), 42);
  assert.equal(evaluateExpression("21 ÷ 3"), 7);
});

test("respects arithmetic precedence", () => {
  assert.equal(evaluateExpression("2+3*4"), 14);
});

test("supports parentheses and nested expressions", () => {
  assert.equal(evaluateExpression("(2+3)*(4-(1+1))"), 10);
});

test("supports unary signs and decimals", () => {
  assert.equal(evaluateExpression("-2.5 + +.5"), -2);
});

test("rejects division by zero", () => {
  assert.throws(() => evaluateExpression("8/0"), /Division by zero/);
});

test("rejects empty and incomplete expressions", () => {
  assert.throws(() => evaluateExpression(""), /Empty expression/);
  assert.throws(() => evaluateExpression("2+"), /Expected number/);
});

test("rejects unsupported characters and code execution payloads", () => {
  assert.throws(() => evaluateExpression("2**3"));
  assert.throws(() => evaluateExpression("globalThis.process.exit()"));
  assert.throws(() => evaluateExpression("1;alert(1)"));
});

test("rejects non-finite arithmetic results", () => {
  assert.throws(() => evaluateExpression("99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999*99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999"), /Invalid expression/);
});
