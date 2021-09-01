DROP TABLE IF EXISTS person;

CREATE TABLE person  (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(256) NOT NULL,
  age int(3) DEFAULT NULL,
  address varchar(256) NOT NULL,
  bilde_base64 longtext,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
