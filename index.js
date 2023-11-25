const smtp = require('smtp-server');
const mailparser = require('mailparser');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'logger',
    password: 'cactus',
    database: 'smtp_server_log',
})

const server = new smtp.SMTPServer({
    authOptional: true,
    onData: (stream, session, callback) => {
        mailparser.simpleParser(stream, {}, (err, parsed) => {
            console.log('New message parsed: ');
            console.log(`To: ${parsed.to.text}`);
            console.log(`Subject: ${parsed.subject}`);
            console.log('--------------------------')

            const fs = require('fs');
            const path = require('path');

            const date = Date.now()
            const textFile = `email-${date}.txt`;
            const htmlFile = `email-${date}.html`;
            const textFilePath = path.join(__dirname, 'emails', textFile);
            const htmlFilePath = path.join(__dirname, 'emails', htmlFile);
            const textData = `From: ${parsed.from.text}\nTo: ${parsed.to.text}\nSubject: ${parsed.subject}\nText body: ${parsed.text}`;
            const htmlData = parsed.html;

            db.connect((err) => {
                if (err) {
                    console.log(err);
                } else {
                    db.query(`INSERT INTO email_log (\`from\`, \`to\`, subject, text_body, file_name) VALUES ('${parsed.from.text}', '${parsed.to.text}', '${parsed.subject}', '${parsed.text}', '${htmlFile}')`, (err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('Email logged to database');
                        }
                    });
                }
            })


            if (!fs.existsSync(path.join(__dirname, 'emails'))) {
                fs.mkdirSync(path.join(__dirname, 'emails'));
            }

            fs.writeFile(textFilePath, textData, (err) => {
                if (err) {
                    console.log(err);
                }
            })
            fs.writeFile(htmlFilePath, htmlData, (err) => {
                if (err) {
                    console.log(err);
                }
            })
            callback();
        });
    },

    onRcptTo: (address, session, callback) => {
        callback();
    },
});

server.listen(3030, () => {
    console.log('SMTP server listening on port 3030');
});
