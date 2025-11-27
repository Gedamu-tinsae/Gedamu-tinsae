const path = require('path');

const EXTENSION_MAP = {
  js: 'JavaScript',
  jsx: 'JavaScript',
  ts: 'TypeScript',
  tsx: 'TypeScript',
  py: 'Python',
  java: 'Java',
  rb: 'Ruby',
  go: 'Go',
  rs: 'Rust',
  php: 'PHP',
  cs: 'C#',
  cpp: 'C++',
  cxx: 'C++',
  cc: 'C++',
  c: 'C',
  swift: 'Swift',
  kt: 'Kotlin',
  m: 'Objective-C',
  mm: 'Objective-C++',
  scala: 'Scala',
  sh: 'Shell',
  ps1: 'PowerShell',
  psd1: 'PowerShell',
  psm1: 'PowerShell',
  html: 'HTML',
  htm: 'HTML',
  css: 'CSS',
  scss: 'SCSS',
  sass: 'SASS',
  less: 'LESS',
  json: 'JSON',
  md: 'Markdown',
  sql: 'SQL',
  yaml: 'YAML',
  yml: 'YAML',
};

function detectLanguage(filename) {
  const ext = path.extname(filename).toLowerCase().replace('.', '');
  if (!ext) return null;
  return EXTENSION_MAP[ext] || null;
}

module.exports = {
  detectLanguage,
};
