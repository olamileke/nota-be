const ejs = require('ejs');
const config = require('./config');
const mailgun = require('mailgun-js')({ apiKey:config.mailApiKey, domain:config.mailDomain });

module.exports = data => {

    const mail = {...config.mail};
    mail.to = data.to;
    mail.subject = data.subject;

    ejs.renderFile(data.mailPath, {
        clientUrl:config.clientUrl,
        name:data.name,
        token:data.token,
    }, (err, str) => {
        if(err) {
            throw err;
        }

        mail.html = str;

        mailgun.messages().send(mail, (err, body) => {
            if(err) {
                throw err;
            }
        })
    })
}