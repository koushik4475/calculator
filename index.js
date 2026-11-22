function evaluateExpression(expression) {
  const tokens = expression.match(/\d+(?:\.\d*)?|\.\d+|[()+\-*/]/g) || [];
  if (tokens.join("") !== expression.replace(/\s/g, "")) {
    throw new Error("Invalid expression");
  }

  let index = 0;

  function peek() {
    return tokens[index];
  }

  function consume(expected) {
    if (expected && peek() !== expected) {
      throw new Error("Expected " + expected);
    }
    return tokens[index++];
  }

  function primary() {
    if (peek() === "(") {
      consume("(");
      const value = sum();
      consume(")");
      return value;
    }

    if (peek() === "+" || peek() === "-") {
      const sign = consume();
      return (sign === "-" ? -1 : 1) * primary();
    }

    const token = consume();
    if (token === undefined || !/^\d+(?:\.\d*)?$|^\.\d+$/.test(token)) {
      throw new Error("Expected number");
    }

    const value = Number(token);
    if (!Number.isFinite(value)) throw new Error("Invalid number");
    return value;
  }

  function product() {
    let value = primary();
    while (peek() === "*" || peek() === "/") {
      const operator = consume();
      const right = primary();
      if (operator === "/" && right === 0) throw new Error("Division by zero");
      value = operator === "*" ? value * right : value / right;
    }
    return value;
  }

  function sum() {
    let value = product();
    while (peek() === "+" || peek() === "-") {
      const operator = consume();
      const right = product();
      value = operator === "+" ? value + right : value - right;
    }
    return value;
  }

  if (!tokens.length) throw new Error("Empty expression");
  const result = sum();
  if (index !== tokens.length || !Number.isFinite(result)) {
    throw new Error("Invalid expression");
  }
  return result;
}

if (typeof document !== "undefined") {
  const buttons = document.querySelectorAll("button");
  const result = document.getElementById("result");
  let justEvaluated = false;

  function applyInput(value) {
    if (value === "CLEAR") {
      result.value = "";
      justEvaluated = false;
      return;
    }

    if (value === "=") {
      try {
        result.value = String(evaluateExpression(result.value));
      } catch {
        result.value = "Error";
      }
      justEvaluated = true;
      return;
    }

    if (result.value === "Error" || justEvaluated) result.value = "";
    result.value += value;
    justEvaluated = false;
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.dataset.action || button.textContent.trim();
      applyInput(value);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.target instanceof HTMLElement &&
        event.target.matches("input:not([readonly]), textarea, select, [contenteditable='true']")) {
      return;
    }

    const keyMap = {
      Enter: "=",
      "=": "=",
      Escape: "CLEAR",
    };
    let value = keyMap[event.key];

    if (/^[0-9()+\-*/.]$/.test(event.key)) value = event.key;
    if (event.key === "Backspace") {
      event.preventDefault();
      result.value = result.value === "Error" ? "" : result.value.slice(0, -1);
      justEvaluated = false;
      return;
    }

    if (value !== undefined) {
      event.preventDefault();
      applyInput(value);
    }
  });
}

if (typeof module !== "undefined") {
  module.exports = { evaluateExpression };
}
