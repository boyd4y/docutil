#!/usr/bin/env node

var yargs = require('yargs');
require('shelljs/global');

// Variables
var currentDir = process.cwd();
var currentBaseImage = null;
var currentBranch = null;

function check() {
  // system requirement
  if (!which('git')) {
    console.error('Sorry, this script requires git');
    exit(1);
  }

  // branch
  var gitInfo = exec('git rev-parse --abbrev-ref HEAD', {silent: true});
  if (gitInfo.code != 0) {
    console.error('Sorry, current directory is not a git repo');
    exit(1);
  }

  currentFolderName = currentDir.match(/.+\/(.+)/)[1];
  currentBranch = gitInfo.stdout.trim();
  currentBaseImage = `${currentFolderName}/${currentBranch}`
}


yargs
  .epilog('@winston copyright 2016')
  .command(
    'b',
    'build with current folder',
    function(yargs) {
      return yargs.option();
    },
    function(argv) {
      console.log(`Try to build image ${currentBaseImage}`);
      check();
      exec(`docker build -t ${currentBaseImage} .`);
    }
  )
  .command(
    'r',
    'run with latest local image',
    function(yargs) {
      var ops = {
        'c': {
          alias: 'command',
          default: '',
          describe: 'the command to execute'
        }
      };
      return yargs.option(ops);
    },
    function(argv) {
      var command = argv.command;
      check();
      exec(`docker run --rm --net=host -v ${currentDir}:/src -i ${currentBaseImage} ${command}`);
    }
  )
  .help('h')
  .argv