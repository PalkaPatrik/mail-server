const smtp = require('smtp-server');
const mailparser = require('mailparser');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
})

const server = new smtp.SMTPServer({
    authOptional: true,
    onData: (stream, session, callback) => {
        mailparser.simpleParser(stream, {}, (err, parsed) => {
            console.log('New message parsed: ');
            console.log(`To: ${parsed.to.text}`);
            console.log(`Subject: ${parsed.subject}`);

            const fs = require('fs');
            const path = require('path');

            const date = Date.now()
            const textFile = `email-${date}.txt`;
            const htmlFile = `email-${date}.html`;
            const textFilePath = path.join(__dirname, 'emails', textFile);
            const htmlFilePath = path.join(__dirname, 'emails', htmlFile);
            const textData = `From: ${parsed.from.text}\nTo: ${parsed.to.text}\nSubject: ${parsed.subject}\nText body: ${parsed.text}`;
            const htmlData = parsed.html;

            try {
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
            } catch (err) {
                console.error('Unable to connect to the database')
                console.error(err);
            }

            try {
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
            } catch (err) {
                console.error('Unable to write to file');
                console.error(err);
            }

            console.log('--------------------------')
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
