#!/usr/bin/env node

const inquirer = require('inquirer');
const cmd = require('node-cmd');
const fs = require('fs');

const CHOICES = fs.readdirSync(`${__dirname}/templates`);
const CURRENT_DIR = process.cwd();

const QUESTIONS = [
  {
    name: 'project-template',
    type: 'list',
    message: 'What project template would you like to generate?',
    choices: CHOICES
  },
  {
    name: 'project-name',
    type: 'input',
    message: 'Enter project name',
    validate: (input) =>
      /^([A-Za-z\-\_\d])+$/.test(input) || 'Project name may only include letters, numbers, underscores and hashes.'
  }
];

const createDirectoryContents = (templatePath, newProjectPath) =>
  fs.readdirSync(templatePath)
    .map((file) => (file === '.npmignore' ? '.gitignore' : file))
    .forEach((file) => {
      const originalPath = `${templatePath}/${file}`;
      const stats = fs.statSync(originalPath);

      if (stats.isFile()) {
        const encoding = 'utf8';
        const contents = fs.readFileSync(originalPath, encoding);
        const writePath = `${CURRENT_DIR}/${newProjectPath}/${file}`;
        fs.writeFileSync(writePath, contents, encoding);
      } else if (stats.isDirectory()) {
        fs.mkdirSync(`${CURRENT_DIR}/${newProjectPath}/${file}`);
        createDirectoryContents(`${templatePath}/${file}`, `${newProjectPath}/${file}`);
      }
    });

inquirer.prompt(QUESTIONS)
  .then((answers) => {
    const projectTemplate = answers['project-template'];
    const projectName = answers['project-name'];

    const templatePath = `${__dirname}/templates/${projectTemplate}`;

    fs.mkdirSync(`${CURRENT_DIR}/${projectName}`);

    createDirectoryContents(templatePath, projectName);

    cmd.run(`
      cd ${projectName}
      git init && yarn && yarn autoclean --init
    `);
  });
