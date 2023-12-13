CREATE DEFINER=`admin`@`%` PROCEDURE `TopicTimeline`(searchString LONGTEXT)
BEGIN
	WITH
		topicID as (
			SELECT topicID
			FROM topic
			WHERE name LIKE searchString
		)
	SELECT a.href, count(articleID) as amount,
	DATE_FORMAT(d.publish_date, '%Y-%m-%d') as date
	FROM article_to_topic att
	JOIN article a USING(articleID)
	JOIN date d USING(dateID)
	WHERE att.topicID = (TABLE topicID)
	GROUP BY d.publish_date, articleID
	ORDER BY d.publish_date ASC;
END