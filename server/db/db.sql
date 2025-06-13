CREATE TABLE IF NOT EXISTS registration (
  user_id int NOT NULL AUTO_INCREMENT,
  user_name varchar(50) NOT NULL,
  user_email varchar(254) NOT NULL,
  password varchar(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id)
);

CREATE TABLE IF NOT EXISTS profile (
  user_profile_id int NOT NULL AUTO_INCREMENT,
  user_id int NOT NULL,
  first_name varchar(50) NOT NULL,
  last_name varchar(50) NOT NULL,
  PRIMARY KEY (user_profile_id),
  FOREIGN KEY (user_id) REFERENCES registration(user_id)
);

CREATE TABLE IF NOT EXISTS question (
  question_id int NOT NULL AUTO_INCREMENT,
  question_title varchar(100) NOT NULL,
  question_description text,
  tag varchar(20),
  user_id int NOT NULL,
  post_id int NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (question_id),
  FOREIGN KEY (user_id) REFERENCES registration(user_id)
);

CREATE TABLE IF NOT EXISTS answer (
  answer_id int NOT NULL AUTO_INCREMENT,
  answer text NOT NULL,
  user_id int NOT NULL,
  question_id int NOT NULL,
  PRIMARY KEY (answer_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES registration(user_id),
  FOREIGN KEY (question_id) REFERENCES question(question_id)
);


