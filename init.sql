CREATE TABLE IF NOT EXISTS `email_log` (
    `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `from` VARCHAR(255) NULL DEFAULT NULL,
    `to` VARCHAR(500) NULL DEFAULT NULL,
    `subject` VARCHAR(255) NULL DEFAULT NULL,
    `text_body` VARCHAR(4000) NULL DEFAULT NULL,
    `file_name` VARCHAR(255) NULL DEFAULT NULL,
    PRIMARY KEY (`id`)
);

--create user 'logger'@'localhost' identified by password 'cactus';
grant all privileges on smtp_server_log.email_log to 'logger'@'localhost';