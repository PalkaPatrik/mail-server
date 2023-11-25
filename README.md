# Mail Server

## Description

Simple SMTP mail server to be used for local email testing. It saves the received email to a file, and also saves the
event to a database.

Doesn't actually send the email anywhere, so it's safe to use for testing.

## Usage

Easiest way to run it is to use docker:

```bash
docker-compose up
```

This will start the mail server on port 3030, and the database on port 3307.

You can also run it without docker, but you'll need to have a MySQL database running somewhere, and you'll need to set
its configuration in the `environment/local.env` file.
After that, you can run the server with:

```bash
npm run start
```
