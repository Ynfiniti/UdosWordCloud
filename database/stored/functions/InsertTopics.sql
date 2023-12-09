CREATE DEFINER=`admin`@`%` FUNCTION `InsertTopics`(topic_array_param VARCHAR(65535),article_id INT) RETURNS int
    READS SQL DATA
    DETERMINISTIC
BEGIN
    -- topic loop
    DECLARE topic_array_local VARCHAR(100);
    DECLARE start_pos SMALLINT;
    DECLARE comma_pos SMALLINT;
    DECLARE current_topic VARCHAR(100);
    DECLARE current_topic_id INT;
    DECLARE end_loop TINYINT;
    -- 
    
	SET topic_array_local = topic_array_param;
    SET start_pos = 1;
    SET comma_pos = locate(',', topic_array_local);
    
    -- loop topics
    REPEAT
        IF comma_pos > 0 THEN
            SET current_topic = substring(topic_array_local, start_pos, comma_pos - start_pos);
            SET end_loop = 0;
        ELSE
            SET current_topic = substring(topic_array_local, start_pos);
            SET end_loop = 1;
        END IF;
        
        -- LOOP CONTENT
     
        -- insert single topic
        INSERT IGNORE INTO topic (name) VALUES (current_topic);
        -- get topic id
        SELECT topicID INTO current_topic_id
        FROM topic
        WHERE name = current_topic;
        -- set article_to_topic
        INSERT IGNORE INTO article_to_topic (topicID, articleID) 
        VALUES(current_topic_id,article_id);
        
        -- END LOOP CONTENT

        IF end_loop = 0 THEN
            SET topic_array_local = substring(topic_array_local, comma_pos + 1);
            SET comma_pos = locate(',', topic_array_local);
        END IF;
    UNTIL end_loop = 1
    
    END REPEAT;
RETURN 1;
END