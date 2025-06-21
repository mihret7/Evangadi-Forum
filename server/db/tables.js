const create_registration = `
    CREATE TABLE IF NOT EXISTS registration (
      user_id int NOT NULL AUTO_INCREMENT,
      user_name varchar(50) NOT NULL,
      user_email varchar(254) NOT NULL,
      -- Using TIMESTAMP for created_at to automatically set the current timestamp
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      -- Using varchar(100) for password to allow for hashed passwords
      password varchar(100) NOT NULL,
      PRIMARY KEY (user_id)
    )`;

const create_profile = `
    CREATE TABLE IF NOT EXISTS profile (
      user_profile_id int NOT NULL AUTO_INCREMENT,
      user_id int NOT NULL,
      first_name varchar(50) NOT NULL,
      last_name varchar(50) NOT NULL,
      PRIMARY KEY (user_profile_id),
      FOREIGN KEY (user_id) REFERENCES registration(user_id)
    )`;

const create_question = `
    CREATE TABLE IF NOT EXISTS question (
      question_id int NOT NULL AUTO_INCREMENT,
      question_title varchar(100) NOT NULL,
      question_description text,
      tag varchar(20),
      -- Who asked the question
      user_id int NOT NULL,
      -- post_id is unique to ensure no two questions can have the same post_id
      post_id int NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (question_id),
      FOREIGN KEY (user_id) REFERENCES registration(user_id)
    )`;

const create_answer = `
    CREATE TABLE IF NOT EXISTS answer (
      answer_id int NOT NULL AUTO_INCREMENT,
      answer text NOT NULL,
      -- Who answered the question
      user_id int NOT NULL,
      -- Related question to the answer
      question_id int NOT NULL,
      PRIMARY KEY (answer_id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES registration(user_id),
      FOREIGN KEY (question_id) REFERENCES question(question_id)
    )`;

const create_likes_dislikes = `
    CREATE TABLE IF NOT EXISTS likes_dislikes (
      like_dislike_id int NOT NULL AUTO_INCREMENT,
      user_id int NOT NULL,
      question_id int NULL,
      answer_id int NULL,
      -- is_like indicates whether it's a like (true) or dislike (false)
      is_like boolean NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (like_dislike_id),
      FOREIGN KEY (user_id) REFERENCES registration(user_id),
      FOREIGN KEY (question_id) REFERENCES question(question_id) ON DELETE CASCADE,
      FOREIGN KEY (answer_id) REFERENCES answer(answer_id) ON DELETE CASCADE,
      CONSTRAINT unique_user_question UNIQUE (user_id, question_id),
      CONSTRAINT unique_user_answer UNIQUE (user_id, answer_id),
      CONSTRAINT check_single_target CHECK (
        (question_id IS NOT NULL AND answer_id IS NULL) OR 
        (question_id IS NULL AND answer_id IS NOT NULL)
      )
    )`;
    // If a question/answer is deleted, delete associated likes/dislikes automatically

module.exports = {
  create_registration,
  create_profile,
  create_question,
  create_answer,
  create_likes_dislikes,
};



// Constraint(Think of it like a guard or rule applied to a column or table that prevents invalid data from being inserted or updated.)        	              Type             	  
// unique_user_question	                                            UNIQUE              

// unique_user_answer                                               UNIQUE               

// check_single_target                                               CHECK               



// Purpose
// Prevent multiple likes/dislikes from the same user on the same question
// Prevent multiple likes/dislikes from the same user on the same answer
// Enforce that only one (question or answer) is targeted at a time





// const create_registration = `
//     CREATE TABLE IF NOT EXISTS registration (
//       user_id int NOT NULL AUTO_INCREMENT,
//       user_name varchar(50) NOT NULL,
//       user_email varchar(254) NOT NULL,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       password varchar(100) NOT NULL,
//       PRIMARY KEY (user_id)
//     )`;

// // Profile table
// const create_profile = `
//     CREATE TABLE IF NOT EXISTS profile (
//       user_profile_id int NOT NULL AUTO_INCREMENT,
//       user_id int NOT NULL,
//       first_name varchar(50) NOT NULL,
//       last_name varchar(50) NOT NULL,
//       PRIMARY KEY (user_profile_id),
//       FOREIGN KEY (user_id) REFERENCES registration(user_id)
//     )`;

// // Question table

// const create_question = `
//     CREATE TABLE IF NOT EXISTS question (
//       question_id int NOT NULL AUTO_INCREMENT,
//       question_title varchar(100) NOT NULL,
//       question_description text,
//       tag varchar(20),
//       user_id int NOT NULL,
//       post_id int NOT NULL UNIQUE,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       PRIMARY KEY (question_id),
//       FOREIGN KEY (user_id) REFERENCES registration(user_id)
//     )`;

// // Answer table
// const create_answer = `
//     CREATE TABLE IF NOT EXISTS answer (
//       answer_id int NOT NULL AUTO_INCREMENT,
//       answer text NOT NULL,
//       user_id int NOT NULL,
//       question_id int NOT NULL,
//       PRIMARY KEY (answer_id),
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       FOREIGN KEY (user_id) REFERENCES registration(user_id),
//       FOREIGN KEY (question_id) REFERENCES question(question_id)
//     )`;

// module.exports = {
//   create_registration,
//   create_profile,
//   create_question,
//   create_answer,
// };

// db/tables.js
