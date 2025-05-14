/**
 * 自动更新manifest.json中的版本号
 * 从package.json读取版本号并同步到manifest.json
 */
const fs = require('fs');
const path = require('path');

try {
  // 读取package.json获取新版本号
  const packageJsonPath = path.join(__dirname, '../package.json');
  const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
  const packageJson = JSON.parse(packageJsonContent);
  const newVersion = packageJson.version;

  // 更新manifest.json的版本号
  const manifestPath = path.join(__dirname, '../manifest.json');
  const manifestContent = fs.readFileSync(manifestPath, 'utf8');
  const manifest = JSON.parse(manifestContent);
  manifest.version = newVersion;

  // 写回manifest.json
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  console.log(`Updated manifest.json version to ${newVersion}`);
} catch (error) {
  console.error(`Error updating manifest version: ${error.message}`);
  console.error(error.stack);
  process.exit(1);
} 