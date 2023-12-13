CREATE DEFINER=`admin`@`%` PROCEDURE `TokenTimeline`(searchString LONGTEXT)
BEGIN
	SELECT a.href, sum(t.amount) as amount,
	DATE_FORMAT(d.publish_date, '%Y-%m-%d') as date
	FROM token t
	JOIN article a USING(articleID)
	JOIN date d USING(dateID)
	WHERE t.name LIKE searchString 
	GROUP BY d.publish_date, articleID
	ORDER BY d.publish_date ASC;
END