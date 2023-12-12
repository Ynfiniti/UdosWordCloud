CREATE DEFINER=`admin`@`%` PROCEDURE `InsertOrUpdateDate`(IN search_date_param DATETIME)
BEGIN
    DECLARE date_id_found INT;

    INSERT IGNORE INTO date (publish_date) VALUES (search_date_param);
    SET date_id_found = 0;
    
    SELECT dateID INTO date_id_found FROM date WHERE publish_date = search_date_param;
    
    SELECT date_id_found AS found_dateID;
END