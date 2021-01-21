create schema IBUStest;

CREATE TABLE IBUStest.printRequests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(128) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE table IBUStest.printRequests_history(
		id int auto_increment primary key,
        printRequest_id int,
        uuid char(128) not null,
        name varchar(255) not null,
        description varchar(255),
        created_at timestamp default now(),
        updated_at timestamp default now()
    );
    
 # create de triggers
delimiter ;;
create trigger IBUStest.before_insert_printRequests
before insert on IBUStest.printRequests for each row
BEGIN
  IF new.uuid IS NULL OR new.uuid = '' THEN
    SET new.uuid = uuid();
  END IF;
END;; 
delimiter ;

delimiter ;;
CREATE 
    TRIGGER  IBUStest.before_update_printRequests
 BEFORE UPDATE ON IBUStest.printRequests FOR EACH ROW
BEGIN
    INSERT INTO IBUStest.printRequests_history(printRequest_id , uuid , name , description , created_at , updated_at) VALUES (old.id, old.uuid , old.name , old.description , old.created_at , old.updated_at);
	SET new.updated_at = now();
END;;
delimiter ;

# insert some values   
INSERT INTO IBUStest.printRequests(name , description) VALUES ('testName' , 'I like potatoes');
UPDATE IBUStest.printRequests 
SET 
    description = 'I like carrots'
WHERE
    id = 1
    
    
    
    
    
    
