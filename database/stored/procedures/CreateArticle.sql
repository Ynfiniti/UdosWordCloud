CREATE DEFINER=`admin`@`%` PROCEDURE `CreateArticle`(IN search_date_param DATETIME,IN href_param VARCHAR(300),IN topic_array_param VARCHAR(65535),IN token_array_param VARCHAR(65535))
BEGIN
	
	DECLARE date_id INT;
    DECLARE article_id INT;
    DECLARE temp_val INT;
       
    -- insert date into table date and get id as date_id
    INSERT IGNORE INTO date (publish_date) 
    VALUES (search_date_param);
    
    SET date_id = 0;
    
    SELECT dateID INTO date_id 
    FROM date 
    WHERE publish_date = search_date_param;
    
    -- create article in database
    INSERT IGNORE INTO article (href,dateID) 
    VALUES (href_param,date_id);
    
    SET article_id = 0;
    
    SELECT articleID INTO article_id 
    FROM article 
    WHERE href = href_param
		AND dateID = date_id;
        
	-- insert topics
	SET temp_val = InsertTopics(topic_array_param,article_id);
    
    -- insert token
    SET temp_val = InsertTokens(token_array_param,article_id);
    
    -- return article id
    SELECT article_id AS article_id;
END