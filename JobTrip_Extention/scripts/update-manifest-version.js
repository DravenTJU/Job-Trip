/**
 * 自动更新manifest.json中的版本号
 * 从package.json读取版本号并同步到manifest.json
 */
const fs = require('fs');
const path = require('path');

// 读取package.json获取新版本号
const packageJson = require('../package.json');
const newVersion = packageJson.version;

// 更新manifest.json的版本号
const manifestPath = path.join(__dirname, '../manifest.json');
const manifest = require(manifestPath);
manifest.version = newVersion;

// 写回manifest.json
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

console.log(`Updated manifest.json version to ${newVersion}`); 