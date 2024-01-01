const fs = require("fs");

module.exports = async function (filename, data) {
  try {
    let json = JSON.stringify(data, null, 4);
    await fs.writeFileSync(filename, json, 'utf8');
  } catch (error) {
    throw error;
  }
}