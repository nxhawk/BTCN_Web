const fs = require("fs");

module.exports = async function (filename) {
  try {
    const data = await fs.readFileSync(filename, "utf8");
    return await JSON.parse(data);
  } catch (error) {
    throw error;
  }
}
