'use strict';

const fs = require('fs');
const path = require('path');
const vscode = require('vscode');
const prettier = require('prettier');

exports.activate = () => {
  const snippetsPath = path.resolve(__dirname, '../snippets/snippets.json');
  let obj = undefined;

  try {
    const snippets = fs.readFileSync(snippetsPath, 'utf8');
    obj = JSON.parse(snippets);
  } catch (error) {
    console.error(error);
  }

  // TODO: Format `obj.body` before inserting to a text document
};
