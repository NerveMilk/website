const handler = require('serve-handler');
const micro = require('micro');
const fs = require('fs');
const moment = require('moment');
const sgMail = require('@sendgrid/mail');

require('dotenv').load();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const server = micro((request, response) => {
  if (request.method === 'POST' && request.url === '/sendemail') {
    let body = [];
    request.on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(body).toString();
      const dataObj = JSON.parse(body);
      saveToFile(dataObj);
      const msg = {
        to: 'fxy0111@gmail.com',
        from: dataObj.email,
        subject: '新故事',
        html: 'title:<br>' + dataObj.title + '<br><br>story:<br>' + dataObj.story
      };
      sgMail.send(msg);
      response.statusCode = 200;
      response.setHeader('Content-Type', 'application/json');
      return response.end()
    });
  } else {
    return handler(request, response, {
      public: 'public'
    });
  }
})

function saveToFile(data){
  fs.readdir('content/post/', function(err, items) {
    const articles = items.filter( one => one.endsWith('.md'));
    const fileNumber = ("000" + (articles.length + 1)).substr(-3,3);
    const fileName = fileNumber + '_' + data.title + '.md';
    const filePath = 'content/post/' + fileName;
    // console.log('save to file', filePath, data);
    // ---
    // description: "001"
    // title: "WiFi诗人"
    // date: 2017-02-03T16:10:01-04:00
    // author: "Northy Chen"
    // draft: false
    // ---
    const fileContent = '---\n'
      + 'description: "' + fileNumber + '"\n'
      + 'title: "' + data.title + '"\n'
      + 'date: ' + moment().format() + '\n'
      + 'authur: "' + data.arthur + '"\n'
      + 'draft: true\n'
      + '---\n'
      + data.story
    fs.writeFile(filePath, fileContent, (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
    });
  });
}

server.listen(3000, () => {
  console.log('Running at http://localhost:3000');
});
