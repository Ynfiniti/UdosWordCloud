CREATE DATABASE IF NOT EXISTS udocloud;

USE udocloud;

CREATE TABLE IF NOT EXISTS date(
    dateID INT NOT NULL AUTO_INCREMENT,
    publish_date datetime NOT NULL,
    state INT,
    PRIMARY KEY(dateID),
    UNIQUE KEY unique_date_constraint (publish_date),
    INDEX (publish_date)
);

CREATE TABLE IF NOT EXISTS article(
    articleID INT NOT NULL AUTO_INCREMENT,
    dateID INT NOT NULL,
    href VARCHAR(300),
    PRIMARY KEY(articleID),
    FOREIGN KEY(dateID) REFERENCES date(dateID),
    UNIQUE KEY unique_article_constraint(dateID,href)
);

CREATE TABLE IF NOT EXISTS token(
    tokenID INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100),
    amount INT,
    articleID INT NOT NULL,
    PRIMARY KEY(tokenID),
    FOREIGN KEY(articleID) REFERENCES article(articleID),
    UNIQUE KEY unique_token_constraint(articleID,name,amount)
    INDEX (name)
);

CREATE TABLE IF NOT EXISTS topic(
    topicID INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100),
    PRIMARY KEY(topicID),
    UNIQUE KEY unique_topic_constraint(name),
    UNIQUE INDEX (name)
);

CREATE TABLE IF NOT EXISTS article_to_topic(
    articleID INT NOT NULL,
    topicID INT NOT NULL,
    FOREIGN KEY(articleID) REFERENCES article(articleID),
    FOREIGN KEY(topicID) REFERENCES topic(topicID),
    UNIQUE KEY unique_article_to_topic_constraint(articleID,topicID)
);