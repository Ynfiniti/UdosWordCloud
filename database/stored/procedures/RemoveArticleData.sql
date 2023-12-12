CREATE DEFINER=`admin`@`%` PROCEDURE `RemoveArticleData`(IN article_id_param INT)
BEGIN
	DELETE FROM article_to_topic WHERE articleID = article_id_param;
    DELETE FROM token WHERE articleID = article_id_param;
    DELETE FROM article WHERE articleID = article_id_param;
END