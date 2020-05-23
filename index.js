var participants = require("./participants");
var badgePrint = require('./badgePrint');
var moment = require('moment');

var argv = require('yargs').usage(
  'Usage: $0 --file [string] --date [31.01.2017]'
).argv;

var startingDate = argv.date || null;

if (!argv.file) {
  console.log('Only blank badges will be printed. Usage: $0 --file [string]');
} else {
  badgePrint.badgePrint(participants(argv.file, moment(startingDate, "DD.MM.YYYY")));
}