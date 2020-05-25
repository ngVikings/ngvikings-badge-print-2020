var XLSX = require('xlsx');
var moment = require('moment');
var _ = require('lodash');

function createParticipant(participant) {
  var firstName = participant['Ticket First Name'] || '';
  var lastName = participant['Ticket Last Name'] || '';

  if (firstName.trim() && lastName.trim()) {
    var fullName = [firstName.trim(), lastName.trim()].join(' ');
  } else {
    console.log(
      'Unassigned ticket for ticket ' +
        participant['Ticket Reference'] +
        '. Using order name ' + participant['Order Name']
    );
    var fullName = participant['Order Name'];
  }

  var company = participant['Ticket Company Name'];

  var email = participant['Ticket Email'];

  var ticketId = participant['Ticket Reference'];

  var crewType = participant['Crew type'];
  var number = participant['Number'];

  var modifiedDate = moment(
    participant['Ticket Last Updated Date'],
    'MM/DD/YY'
  ); // Last Updated | Created

  var twitter =
    participant['Twitter handle to print on your badge'] &&
    participant['Twitter handle to print on your badge'] !== '-'
      ? '@' +
        _.trimStart(
          participant['Twitter handle to print on your badge']
            .replace('https://twitter.com/', '')
            .replace('https://github.com/', ''),
          '@'
        )
      : null;

  return {
    fullName,
    company,
    modifiedDate,
    twitter,
    firstName,
    lastName,
    email,
    ticketId,
    crewType,
    number
  };
}

function participants(filename, startingDate) {
  var workbook = XLSX.readFile(filename);
  var worksheet = workbook.Sheets[workbook.SheetNames[0]];
  var participantsRaw = XLSX.utils.sheet_to_json(worksheet);
  var participantsProcessed = participantsRaw
    .map(function (participant) {
      return createParticipant(participant);
    })
    .filter(function (p) {
      if (startingDate) {
        if (p.modifiedDate.isSameOrAfter(startingDate)) {
          console.log('Modified date: ' + p.modifiedDate.format());
          STATS.filteredByDate++;
          return true;
        } else {
          return true; //  Set to false when filtering by date
        }
      } else {
        return true;
      }
    })
    .sort(function (a, b) {
      return a.fullName.localeCompare(b.fullName);
    });

  return participantsProcessed;
}

module.exports = participants;
