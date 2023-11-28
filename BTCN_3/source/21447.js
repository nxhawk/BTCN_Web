const fs = require("fs");
const fsp = require("fs/promises");

//lay gia tri cua bien
function getValueFromPath(object, path) {
  const parts = path.split(".");
  let value = object;
  for (const part of parts) {
    if (value.hasOwnProperty(part)) {
      value = value[part];
    } else {
      return "";
    }
  }
  return value;
}

async function renderPartials(rendered) {
  const RegexStr = /21447{\+\s*([\w.]+)\s*}/g;
  let match;
  while ((match = RegexStr.exec(rendered)) !== null) {
    const [fullMatch, partialName] = match;

    const partialContent = await fsp.readFile(
      `./views/partials/${partialName}.html`,
      {
        encoding: "utf-8",
      }
    );
    const replacedPartialContent = await renderPartials(partialContent);
    rendered = rendered.replace(fullMatch, replacedPartialContent);
  }
  return rendered;
}

// replace variable
function render(rendered, data) {
  const RegexStr = /21447{\s*([\w.]+)\s*}/g;
  let match;
  while ((match = RegexStr.exec(rendered)) !== null) {
    const [fullMatch, variableName] = match;
    const value = getValueFromPath(data, variableName);
    rendered = rendered.replace(fullMatch, value);
  }
  return rendered;
}

function replaceIfElse(rendered, data) {
  const RegexStr =
    /21447{\s*if\s+([\w.]+)\s*}([\s\S]*?){\s*else\s*}([\s\S]*?){\s*\/if\s*}/gs;
  let match;
  while ((match = RegexStr.exec(rendered)) !== null) {
    const [fullMatch, condition, ifContent, elseContent] = match;
    const value = getValueFromPath(data, condition);
    const replacement = value ? ifContent : elseContent || "";
    rendered = rendered.replace(fullMatch, replacement);
  }

  return rendered;
}

function replaceFor(rendered, options) {
  const RegexStr =
    /21447{for\s+(\w+)\s+in\s+(\w+)\s*}([\s\S]*?){\s*\/for\s*}/gs;
  while ((match = RegexStr.exec(rendered)) !== null) {
    const [fullMatch, variable, array, content] = match;
    const items = options[array];
    if (Array.isArray(items)) {
      const replacement = items
        .map((item) => {
          const object = { [variable]: item };
          const itemContent = render(content, object);
          return itemContent;
        })
        .join("");
      rendered = rendered.replace(fullMatch, replacement);
    } else {
      rendered = rendered.replace(fullMatch, "");
    }
  }
  return rendered;
}

function renderNestedFor(rendered, options) {
  const RegexStr =
    /21447{for\s+(\w+)\s+in\s+(\w+)\s*}([\s\S]*?)\s*21447{for\s+(\w+)\s+in\s+(\w+)\s*}([\s\S]*?){\s*\/for\s*}([\s\S]*?){\s*\/for\s*}/gs;
  let match;
  while ((match = RegexStr.exec(rendered)) !== null) {
    const [
      fullMatch,
      outerVar,
      outerArrName,
      outerContent,
      innerVar,
      innerArrName,
      innerInnerVar,
      innerContent,
    ] = match;
    const outerArrays = getValueFromPath(options, outerArrName);
    if (Array.isArray(outerArrays)) {
      const outerReplacement = outerArrays
        .map((outerArr) => {
          const innerArr = outerArr;
          if (Array.isArray(innerArr)) {
            const innerReplacement = innerArr
              .map((innerItem) => {
                const object = { [innerVar]: innerItem };
                const itemContent = render(innerInnerVar, object);
                return itemContent;
              })
              .join("");
            return innerReplacement;
          }
          return "";
        })
        .join("");

      rendered = rendered.replace(fullMatch, outerReplacement);
    }
  }

  return rendered;
}

// xu li bieu thuc tinh toan
function evaluateExpression(rendered, options) {
  const RegexStr = /21447{(\s*([\w.]+)\s*([+\-*%]\s*([\w.]+)\s*)*)}/g;
  while ((match = RegexStr.exec(rendered)) !== null) {
    let [fullMatch, expression] = match;

    const operands = expression.split(/\s+/);
    for (let op of operands) {
      if (!op.match(/[+\-*\/%\d]/)) {
        try {
          const value = getValueFromPath(options, op);
          expression = expression.replace(op, value);
        } catch (error) {
          return rendered;
        }
      }
    }
    try {
      rendered = rendered.replace(fullMatch, eval(expression));
    } catch (error) {
      return rendered;
    }
  }

  return rendered;
}

// xu li if
function replaceIf(rendered, options) {
  const RegexStr = /21447{\s*if\s+([\w.]+)\s*}([\s\S]*?){\s*\/if\s*}/gs;
  let match;
  while ((match = RegexStr.exec(rendered)) !== null) {
    const [fullMatch, condition, ifContent] = match;
    const value = getValueFromPath(options, condition);
    let replacement = "";
    if (value) replacement = ifContent;
    rendered = rendered.replace(fullMatch, replacement);
  }
  return rendered;
}

function replaceNestIfElse(rendered, options) {
  const RegexStr =
    /21447{\s*if\s+([\w.]+)\s*}([\s\S]*?){\s*else\s*}([\s\S]*?){\s*\/if\s*}/gs;
  let match;
  while ((match = RegexStr.exec(rendered)) !== null) {
    const [fullMatch, condition, ifContent, elseContent] = match;
    const value = getValueFromPath(options, condition);

    let tmp = replaceIf(ifContent, options);
    let replacement = "";
    if (!value) replacement = elseContent;
    else replacement = tmp;
    rendered = rendered.replace(fullMatch, replacement);
  }

  return rendered;
}

const renderTemplate = function (filePath, options, callback) {
  fs.readFile(filePath, "utf-8", async (err, content) => {
    if (err) return callback(err);
    let rendered = content.toString();

    rendered = await renderPartials(rendered);
    rendered = await require("./utils/getFileIndex")(
      rendered,
      filePath,
      options
    );
    rendered = replaceFor(rendered, options);
    rendered = replaceFor(rendered, options);
    rendered = replaceNestIfElse(rendered, options);
    rendered = replaceIfElse(rendered, options);
    rendered = replaceIfElse(rendered, options);
    rendered = evaluateExpression(rendered, options);
    rendered = render(rendered, options);

    return callback(null, rendered);
  });
};

module.exports = renderTemplate;
