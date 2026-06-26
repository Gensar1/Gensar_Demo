var fs = require('fs');
var path = require('path');
var collections = ['services', 'team', 'jobs', 'programs'];
collections.forEach(function (name) {
  var dir = path.join(__dirname, 'content', name);
  if (!fs.existsSync(dir)) { fs.mkdirSync(dir, { recursive: true }); }
  var files = fs.readdirSync(dir).filter(function (f) { return f.endsWith('.md'); }).map(function (f) { return f.replace(/\.md$/, ''); }).sort();
  fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(files, null, 2));
  console.log('Generated manifest for ' + name + ': ' + files.length + ' entries');
});