CREATE DEFINER=`admin`@`%` FUNCTION `InsertTokens`(token_array_param VARCHAR(65535),article_id_param INT) RETURNS int
    READS SQL DATA
    DETERMINISTIC
BEGIN
-- token loop
    DECLARE token_array_local VARCHAR(100);
    DECLARE start_pos SMALLINT;
    DECLARE comma_pos SMALLINT;
    DECLARE current_token VARCHAR(100);
    DECLARE current_token_key VARCHAR(100);
    DECLARE current_token_value INT;
    DECLARE current_token_id INT;
    DECLARE end_loop TINYINT;
    -- 
    
	SET token_array_local = token_array_param;
    SET start_pos = 1;
    SET comma_pos = locate(',', token_array_local);
    
    -- loop tokens
    REPEAT
        IF comma_pos > 0 THEN
            SET current_token = substring(token_array_local, start_pos, comma_pos - start_pos);
            SET end_loop = 0;
        ELSE
            SET current_token = substring(token_array_local, start_pos);
            SET end_loop = 1;
        END IF;
        
        -- LOOP CONTENT
     
		-- get key and value
        SET current_token_key = substring_index(current_token,':',1);
        SET current_token_value = CAST(substring_index(current_token,':',-1) AS SIGNED);
        -- insert single token
        INSERT IGNORE INTO token (name,amount,articleID) VALUES (current_token_key,current_token_value,article_id_param);
        
        -- END LOOP CONTENT

        IF end_loop = 0 THEN
            SET token_array_local = substring(token_array_local, comma_pos + 1);
            SET comma_pos = locate(',', token_array_local);
        END IF;
    UNTIL end_loop = 1
    
    END REPEAT;
RETURN 1;
END