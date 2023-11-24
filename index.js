const smtp = require('smtp-server');
const mailparser = require('mailparser');

const server = new smtp.SMTPServer({
    // using smtp-server module, accept any auth attempt
    authOptional: true,
    // on mail event, parse the mail and print its subject
    onData: (stream, session, callback) => {
        mailparser.simpleParser(stream, {}, (err, parsed) => {
            console.log('New message parsed: ');
            console.log(`To: ${parsed.to.text}`);
            console.log(`Subject: ${parsed.subject}`);
            console.log('--------------------------')

            const fs = require('fs');
            const path = require('path');

            const date = Date.now()
            const textfile = `email-${date}.txt`;
            const htmlfile = `email-${date}.html`;
            const textfilepath = path.join(__dirname, 'emails', textfile);
            const htmlfilepath = path.join(__dirname, 'emails', htmlfile);
            const textdata = `From: ${parsed.from.text}\nTo: ${parsed.to.text}\nSubject: ${parsed.subject}\nText body: ${parsed.text}`;
            const htmldata = parsed.html;


            if (!fs.existsSync(path.join(__dirname, 'emails'))) {
                fs.mkdirSync(path.join(__dirname, 'emails'));
            }

            fs.writeFile(textfilepath, textdata, (err) => {
                if (err) {
                    console.log(err);
                }
            })
            fs.writeFile(htmlfilepath, htmldata, (err) => {
                if (err) {
                    console.log(err);
                }
            })
            callback();
        });
    },

    // return ok status code to any email event
    onRcptTo: (address, session, callback) => {
        callback();
    },
});

server.listen(3030, () => {
    console.log('SMTP server listening on port 3030');
});
