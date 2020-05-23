var fs = require('fs');
var PDFDocument = require('pdfkit');
const delay = require('delay');
var _ = require('lodash');

var type= "Attendee"

function printParticipant(participant) {
  var filenameBase = 'output/' + participant.ticketId;
  console.log(participant.fullName)

  // Create a document
  doc = new PDFDocument({
    size: [1915, 1920],
    autoFirstPage: false,
  });

  doc.pipe(fs.createWriteStream(filenameBase + '.pdf'));

  doc.addPage();

  image = 'shield-' + type + '.png';

  var height = doc.page.height;
  var width = doc.page.height;
  var maxWidth = doc.page.width - 600;
  var margin = 10;

  doc.image(image, 0, 0, {
    height,
    width,
  });

  // First name
  doc.font('NorseBold-2Kge.otf').fontSize(180).fillColor('#ffffff');
  if (doc.widthOfString(participant.fullName) > maxWidth) {
    doc.fontSize(140);
    if (doc.widthOfString(participant.fullName) > maxWidth) {
      doc.fontSize(80);
    }
  }

  doc.text(participant.fullName, margin, 1100, {
    align: 'center',
    height,
    width,
  });


  // Company

  if (participant.company) {
    doc.font('NorseBold-2Kge.otf').fontSize(100).fillColor('#e46025');
    if (doc.widthOfString(participant.company) > maxWidth) {
      doc.fontSize(80);
      if (doc.widthOfString(participant.company) > maxWidth) {
        doc.fontSize(60);
      }
    }
    doc.text(participant.company, margin, 1300, {
      align: 'center',
      height,
      width,
    });
  }

  // Twitter

  var twitter = participant.crewType || type


    doc.font('NorseBold-2Kge.otf').fontSize(80).fillColor('#ffffff');
    if (doc.widthOfString(twitter) > maxWidth) {
      doc.fontSize(60);
      if (doc.widthOfString(twitter) > maxWidth) {
        doc.fontSize(40);
      }
    }
    doc.text(twitter, margin, 1485, {
      align: 'center',
      height,
      width,
    });
  

  doc.end();



  require('pdf-to-png')(
    {
      input: filenameBase + '.pdf',
      output: filenameBase + '.png', // 'output/badge-' + _.snakeCase(participant.fullName) + '.png', // 
      scale: 0.5
    },
    //deleteFile(filenameBase + '.pdf')
  );

  
}

function deleteFile(file) {
  try{
    var sourceUrl = file;
    fs.unlinkSync(sourceUrl);
   }catch(err){
    console.log(err);
   }
}

async function badgePrint(participants) {
  for (var participant of participants) {
    if (participant['fullName'] != ' ') {
      printParticipant(participant);
      await delay(500);
    } else {
      console.log('Empty name, skipping...');
    }
  }
}

module.exports = {
  badgePrint,
};
