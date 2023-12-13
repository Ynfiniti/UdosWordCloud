CREATE DEFINER=`admin`@`%` PROCEDURE `TopicWordcloud`(dateMin char(10), dateMax char(10))
BEGIN
	WITH 
		dateID as (
			SELECT dateID
			FROM date 
			WHERE publish_date >= dateMin
			  AND publish_date <= dateMax
		),
		articleIDs as (
			SELECT articleID
			FROM article
			WHERE dateID IN (TABLE dateID)
		)
	SELECT t.name as name, count(t.name) as amount
	FROM topic t
	JOIN article_to_topic att USING(topicID)
	WHERE att.articleID IN (TABLE articleIDs)
	AND t.name REGEXP '[a-zA-z].*'
	GROUP BY t.name
	ORDER BY amount DESC
	LIMIT 100;
END