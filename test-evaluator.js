const assert = require("node:assert/strict");
const { evaluateExpression } = require("./index.js");

assert.equal(evaluateExpression("2+3*4"), 14);
assert.equal(evaluateExpression("(2+3)*4"), 20);
assert.equal(evaluateExpression("-5+8"), 3);
assert.equal(evaluateExpression("8/2/2"), 2);
assert.equal(evaluateExpression("2*-3"), -6);
assert.equal(evaluateExpression(".5+1.25"), 1.75);
assert.equal(evaluateExpression("2+3"), 5);
assert.throws(() => evaluateExpression("1/0"), /Division by zero/);
assert.throws(() => evaluateExpression("1+"), /Expected number/);
assert.throws(() => evaluateExpression("2**3"), /Expected number|Invalid expression/);
assert.throws(() => evaluateExpression("alert(1)"), /Invalid expression/);
assert.throws(() => evaluateExpression("2;process.exit()"), /Invalid expression/);
console.log("calculator evaluator tests passed");
