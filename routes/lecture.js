var express = require("express");
var router = express.Router();
const mysql = require('mysql');
var mysqlConnection = require('../connection')


//Video Lecture Table CRUD

// create lecture table
router.get('/create-lecture-table', (req, res) => {
    let sql = "CREATE TABLE lecture(lecture_id INT AUTO_INCREMENT PRIMARY KEY, INT NOT NULL, topic_id INT NOT NULL, section TEXT, video_link TEXT, homework_link VARCHAR(1012), study_material TEXT, description TEXT, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (subject_id) REFERENCES subject(subject_id), FOREIGN KEY (topic_id) REFERENCES topic(topic_id))"
    mysqlConnection.query(sql, (err, result) => {
    if(err){
        console.log(err);
        res.status(500).send({ error: 'Error in creating lecture table' })
    }
    res.send(result);
    })
  });


// alter lecture table hide and priority
router.get('/alter-lecture-table', (req, res) => {
  let sql = "ALTER TABLE lecture ADD hide BOOLEAN NOT NULL DEFAULT FALSE, ADD priority INT AFTER description"
  mysqlConnection.query(sql, (err, result) => {
    if(err){
        console.log(err);
        res.status(500).send({ error: 'Error in altering lecture table' })
    }
    res.send(result);
    })
});
  
// insert lecture in the lecture table by making a post request
router.post('/insert-lecture', (req, res) => {
  var course_id = req.body.course_id;
  var subject_id  = req.body.subject_id ;
  var topic_id  = req.body.topic_id ;
  var section  = req.body.section || null;
  var video_link  = req.body.video_link || null;
  var homework_link = req.body.homework || null;
  var study_material  = req.body.study_material;
  var description    = req.body.description || null;
  var priority = req.body.priority || null;
  var hide = req.body.hide;
  if(!course_id || !subject_id || !topic_id){
    console.log("Invalid insert, course id, subject id or topic id field cannot be empty");
    res.status(500).send({ error: 'Compulsary field cannot be empty' })
  }
  else{
    var value    = [[course_id, subject_id, topic_id, section, video_link, homework_link, study_material, description, priority, hide]];
    let sql = "INSERT INTO lecture (course_id, subject_id, topic_id, section, video_link, homework_link, study_material, description, priority, hide) VALUES ?"
    mysqlConnection.query(sql, [value] , (err, result) => {
    if(err){
      console.log(err);
      res.status(500).send({ error: 'Error in inserting lecture into lecture table' })
    }
    res.send(result);
    })
  }
  });

// Fetch the entire table of the lectures
router.get('/fetch-lectures', (req, res) => {
  let sql = "SELECT * FROM lecture WHERE hide = 0 ORDER BY priority"
  mysqlConnection.query(sql , (err, result) => {
    if(err){
      console.log(err);
      res.status(500).send({ error: 'Error in fectching  all lectures' })
    }
    res.send(result);
    })
});


  
// Fetch a particular lecture from the lecture table
router.get('/fetch-lecture/:id', function(req, res) {
  var id = req.params.id;
  var sql = "SELECT * FROM lecture WHERE lecture_id="  + mysql.escape(id);
  mysqlConnection.query(sql, function(err, row, fields) {
    if(err){
      console.log(err);
      res.status(500).send({ error: 'Error in fectching a particular lecture' })
    }
    res.send(row);
  })
});

// Fetch all lectures from the lecture table with a particular topic
router.get('/fetch-lecture-topic/:user_id/:topic_id', function(req, res) {
  var user_id = req.params.user_id;
  var topic_id = req.params.topic_id;
  var sql = "SELECT S.lecture_id, S.user_id, S.created_at, S.completed_lecture, S.time_status, LI.like_lecture FROM lecture_status AS S LEFT JOIN like_table AS LI ON LI.lecture_id = S.lecture_id WHERE S.user_id="  + mysql.escape(user_id);
  mysqlConnection.query(sql, function(err, result) {
    if(err){
      console.log(err);
      res.status(500).send({ error: 'Error in joining' })
    }
    else{
      let sql2 = "SELECT * FROM lecture WHERE topic_id="  + mysql.escape(topic_id) + " AND hide=0 ORDER BY priority";
      mysqlConnection.query(sql2, function(err2, result2) {
        if(err2){
          console.log(err2);
          res.status(500).send({ error: 'Error in fectching lectures' });
        }
        else{
          var resultArr = [];
          
          result2.forEach(x => {
            var completed_lecture = null;
            var time_status       = null;
            var like_lecture      = null;
            result.forEach(y => {
              if(x.lecture_id == y.lecture_id){
                completed_lecture = y.completed_lecture;
                time_status       = y.time_status;
                like_lecture      = y.like_lecture;
              }
            });
            var lecture_id     = x.lecture_id;
            var subject_id     = x.subject_id;
            var topic_id       = x.topic_id;
            var section        = x.section;
            var video_link     = x.video_link;
            var homework_link  = x.homework_link;
            var study_material = x.study_material;
            var description    = x.description;
            var priority       = x.priority;
            var hide           = x.hide;
            var objt           = { lecture_id, completed_lecture, time_status, like_lecture, subject_id, topic_id, section, video_link, homework_link, study_material, description, priority, hide}
            resultArr.push(objt);
          });
          res.send(resultArr);
        }
      });
    }
  });
  
});
  
// Fetch all lectures from the lecture table with a particular subject
router.get('/fetch-lecture-subject/:user_id/:subject_id', function(req, res) {
  var user_id = req.params.user_id;
  var subject_id = req.params.subject_id;
  var sql = "SELECT S.lecture_id, S.user_id, S.created_at, S.completed_lecture, S.time_status, LI.like_lecture FROM lecture_status AS S LEFT JOIN like_table AS LI ON LI.lecture_id = S.lecture_id WHERE S.user_id="  + mysql.escape(user_id);
  mysqlConnection.query(sql, function(err, result) {
    if(err){
      console.log(err);
      res.status(500).send({ error: 'Error in joining' })
    }
    else{
      let sql2 = "SELECT * FROM lecture WHERE subject_id="  + mysql.escape(subject_id) + " AND hide=0 ORDER BY priority";
      mysqlConnection.query(sql2, function(err2, result2) {
        if(err2){
          console.log(err2);
          res.status(500).send({ error: 'Error in fectching lectures' })
        }
        else{
          var resultArr = [];
          
          result2.forEach(x => {
            var completed_lecture = null;
            var time_status       = null;
            var like_lecture      = null;
            result.forEach(y => {
              if(x.lecture_id == y.lecture_id){
                completed_lecture = y.completed_lecture;
                time_status       = y.time_status;
                like_lecture      = y.like_lecture;
              }
            });
            var lecture_id     = x.lecture_id;
            var subject_id     = x.subject_id;
            var topic_id       = x.topic_id;
            var section        = x.section;
            var video_link     = x.video_link;
            var homework_link  = x.homework_link;
            var study_material = x.study_material;
            var description    = x.description;
            var priority       = x.priority;
            var hide           = x.hide;
            var objt           = { lecture_id, completed_lecture, time_status, like_lecture, subject_id, topic_id, section, video_link, homework_link, study_material, description, priority, hide}
            resultArr.push(objt);
          });
          res.send(resultArr);
        }
      });
    }
  });
  
});

// Update any field of lecture
router.put('/update-lecture', function(req, res) {
  var id = req.body.id;
    var sql = "SELECT * FROM lecture WHERE lecture_id="  + mysql.escape(id);
    mysqlConnection.query(sql, function(err, result) {
      if(err) {
        res.status(500).send({ error: err })
      }
      else{
        if(result.length !=0){
            var course_id      = req.body.course_id      || result[0].course_id;
            var subcourse_id   = req.body.subcourse_id   || result[0].subcourse_id;
            var subject_id     = req.body.subject_id     || result[0].subject_id;
            var topic_id       = req.body.topic_id       || result[0].topic_id;
            var section        = req.body.section        || result[0].section;
            var video_link     = req.body.video_link     || result[0].video_link;
            var description    = req.body.description    || result[0].description;
            var study_material = req.body.study_material || result[0].study_material;
            var priority       = req.body.priority       || result[0].priority;
            var hide           = req.body.hide           || result[0].hide;

            let sql2 = "UPDATE lecture SET course_id = ?, subcourse_id = ?, subject_id = ?, topic_id = ?, section = ?, video_link = ?, description = ?, study_material = ?, priority = ?, hide = ? WHERE lecture_id= ?";
            mysqlConnection.query(sql2, [course_id, subcourse_id, subject_id, topic_id, section, video_link, description, study_material, priority, hide, id], (err2, result2) => {
                if(err2) {
                    res.status(500).send({ error: err2 })
                }
                else{
                    res.status(200).send({success : "Table was succesfully updated."});
                }
            });
        }
        else{
            res.status(400).send({error : "No lecture with this lectureid exits."});
        }
      }
    })
});

  // delete a particular lecture from the lecture table
router.delete('/delete-lecture/:id', function(req, res, next) {
    var id = req.params.id;
    var sql = "DELETE FROM lecture WHERE lecture_id=" + mysql.escape(id);
    mysqlConnection.query(sql, function(err, result) {
      if(err){
        console.log(err);
        res.status(500).send({ error: 'Error in deleting a  question' })
      }
      res.send(result);
    })
  });
  
  // delete all lectures from the lecture table of a particular topic
router.delete('/delete-lecture-topic/:id', function(req, res, next) {
  var id = req.params.id;
  var sql = "DELETE FROM lecture WHERE topic_id=" + mysql.escape(id);
  mysqlConnection.query(sql, function(err, result) {
    if(err){
      console.log(err);
      res.status(500).send({ error: 'Error in deleting a  lecture using topic id' })
    }
    res.send(result);
  })
});

// delete all lectures from the lecture table of a particular subject
router.delete('/delete-lectures-subject/:id', function(req, res, next) {
  var id = req.params.id;
  var sql = "DELETE FROM lecture WHERE subject_id=" + mysql.escape(id);
  mysqlConnection.query(sql, function(err, result) {
    if(err){
      console.log(err);
      res.status(500).send({ error: 'Error in deleting a  lecture using subject id' })
    }
    res.send(result);
  })
});


// Like
// Create Like table for lecture
router.get('/create-like-table', (req, res) =>{
  let sql = "CREATE TABLE like_table(lecture_id INT, user_id INT, like_lecture BOOLEAN DEFAULT FALSE, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (lecture_id) REFERENCES lecture(lecture_id), FOREIGN KEY (user_id) REFERENCES user(user_id))"
  mysqlConnection.query(sql, (err, result) => {
    if(err){
        console.log(err);
        res.status(500).send({ error: 'Error in creating like table' })
    }
    else{
      res.send({success : result});
    }
    
  });
});

router.post('/insert-like-lecture', (req, res)=>{
  var user_id = req.body.user_id;
  var lecture_id = req.body.lecture_id;
  var like_lecture = req.body.like_lecture;
  
  if(!user_id || !lecture_id){
    console.log("Invalid insert, user id or lecture id field cannot be empty");
    res.status(500).send({ error: 'Compulsary filed cannot be empty' })
  }
  else{
    let sql2 = "SELECT * FROM like_table WHERE user_id="+ mysql.escape(user_id)+" AND lecture_id="+ mysql.escape(lecture_id);
    mysqlConnection.query(sql2, (err2, result2) => {
      if(err2){
        res.status(500).send({ error: err2 })
      }
      else{
        if(result2.length !=0){
          res.send({error: "This entry is already there"})
        }
        else{
          var value    = [[lecture_id, user_id, true]];
          let sql = "INSERT INTO like_table(lecture_id, user_id, like_lecture) VALUES ?";
          mysqlConnection.query(sql, [value] , (err, result) => {
          if(err){
            console.log(err);
            res.status(500).send({ error: 'Error in inserting lecture into lecture table' })
          }
          else{
            res.send(result);
          }
          });
        }
      }
    })
  }
});

// Fetch a particular user from like table
router.get('/fetch-like-lecture/:id', function(req, res) {
  var user_id = req.params.id;
  var sql = "SELECT * FROM like_table WHERE user_id="  + mysql.escape(user_id);
  mysqlConnection.query(sql, function(err, result) {
    if(err){
      console.log(err);
      res.status(500).send({ error: 'Error in fectching a likes of a user' })
    }
    res.send(result);
  })
});

// Fetch a particular user paticular lecture from like table
router.get('/fetch-like-lecture-bylectureid/:user_id/:lecture_id', function(req, res) {
  var user_id = req.params.user_id;
  var lecture_id =  req.params.lecture_id;
  var sql = "SELECT * FROM like_table WHERE user_id="  + mysql.escape(user_id) + " AND lecture_id="+ mysql.escape(lecture_id);
  mysqlConnection.query(sql, function(err, result) {
    if(err){
      console.log(err);
      res.status(500).send({ error: 'Error in fectching a likes of a user' })
    }
    res.send(result);
  })
});

// Update lecture like table
router.post('/update-like-lecture/:user_id/:lecture_id', function(req, res) {
  if(req.body.like_lecture){
    let sql = "UPDATE like_table SET like_lecture="+mysql.escape(req.body.like_lecture)+" WHERE lecture_id=" + mysql.escape(req.params.lecture_id) + " AND user_id=" + mysql.escape(req.params.user_id);
    mysqlConnection.query(sql, (err, result) => {
        if(err){
            console.log(err);
            res.status(500).send({ error: 'Error in updating a like in like_lecture table' })
        }
        else{
          res.send({'status': 'success'})
        }
    })
  }
});

// delete like from a like table
router.delete('/delete-like-lecture/:user_id/:lecture_id', function(req, res, next) {
  var user_id = req.params.user_id;
  var lecture_id = req.params.lecture_id;
  var sql = "DELETE FROM like_table WHERE user_id=" + mysql.escape(user_id) + " AND lecture_id="+ mysql.escape(lecture_id);
  mysqlConnection.query(sql, function(err, result) {
    if(err){
      console.log(err);
      res.status(500).send({ error: 'Error in deleting a like from table' });
    }
    res.send(result);
  })
});


// Lecture status table
// Create lecture status table for lecture
router.get('/create-lecture-status-table', (req, res) =>{
  let sql = "CREATE TABLE lecture_status(lecture_id INT, user_id INT, completed_lecture BOOLEAN DEFAULT FALSE, time_status INT, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (lecture_id) REFERENCES lecture(lecture_id), FOREIGN KEY (user_id) REFERENCES user(user_id))"
  mysqlConnection.query(sql, (err, result) => {
    if(err){
        console.log(err);
        res.status(500).send({ error: 'Error in creating like table' })
    }
    else{
      res.send({success : result});
    }
    
  });
});

// Insert lecture status table
router.post('/insert-lecture-status', (req, res)=>{
  var user_id = req.body.user_id;
  var lecture_id = req.body.lecture_id;
  var time_status = req.body.time_status;
  var completed_lecture = req.body.completed_lecture || false;
  
  if(!user_id || !lecture_id){
    console.log("Invalid insert, user id or lecture id field cannot be empty");
    res.status(500).send({ error: 'Compulsary filed cannot be empty' })
  }
  else{
    let sql2 = "SELECT * FROM lecture_status WHERE user_id="+ mysql.escape(user_id)+" AND lecture_id="+ mysql.escape(lecture_id);
    mysqlConnection.query(sql2, (err2, result2) => {
      if(err2){
        res.status(500).send({ error: err2 })
      }
      else{
        if(result2.length != 0){
          res.send({error: "This entry is already there"})
        }
        else{
          var value    = [[lecture_id, user_id, completed_lecture, time_status]];
          let sql = "INSERT INTO lecture_status(lecture_id, user_id, completed_lecture, time_status) VALUES ?";
          mysqlConnection.query(sql, [value] , (err, result) => {
          if(err){
            console.log(err);
            res.status(500).send({ error: 'Error in inserting status into lecture status table' })
          }
          else{
            res.send(result);
          }
          });
        }
      }
    })
  }
});

// Fetch a particular user from lecture status table
router.get('/fetch-lecture-status/:id', function(req, res) {
  var user_id = req.params.id;
  var sql = "SELECT * FROM lecture_status WHERE user_id="  + mysql.escape(user_id);
  mysqlConnection.query(sql, function(err, result) {
    if(err){
      console.log(err);
      res.status(500).send({ error: 'Error in fectching lecture status of a user' })
    }
    res.send(result);
  })
});

// Fetch a particular user paticular lecture from lecture status table
router.get('/fetch-lecture-status-bylectureid/:user_id/:lecture_id', function(req, res) {
  var user_id = req.params.user_id;
  var lecture_id =  req.params.lecture_id;
  var sql = "SELECT * FROM lecture_status WHERE user_id="  + mysql.escape(user_id) + " AND lecture_id="+ mysql.escape(lecture_id);
  mysqlConnection.query(sql, function(err, result) {
    if(err){
      console.log(err);
      res.status(500).send({ error: 'Error in fectching lecture status of a particular lecture' })
    }
    res.send(result);
  })
});
  
// updating lecture status table
router.post('/update-lecture-status/:user_id/:lecture_id', function(req, res) {
  var flag = 0;
  if(req.body.completed_lecture){
    let sql = "UPDATE lecture_status SET completed_lecture="+mysql.escape(req.body.completed_lecture)+" WHERE lecture_id=" + mysql.escape(req.params.lecture_id) + " AND user_id=" + mysql.escape(req.params.user_id);
    mysqlConnection.query(sql, (err, result) => {
        if(err){
            flag= 1;
            console.log(err);
        }
    });
  }
  if(req.body.time_status){
    let sql = "UPDATE lecture_status SET time_status="+mysql.escape(req.body.time_status)+" WHERE lecture_id=" + mysql.escape(req.params.lecture_id) + " AND user_id=" + mysql.escape(req.params.user_id);
    mysqlConnection.query(sql, (err, result) => {
        if(err){
            flag=1;
            console.log(err);
        }
    })
  }
    if(flag==0){
      res.send({success: "Lecture status updated"});
    }
    
  
});

// delete lecture status table of a particular user
router.delete('/delete-lecture-status/:user_id/:lecture_id', function(req, res, next) {
  var user_id = req.params.user_id;
  var lecture_id = req.params.lecture_id;
  var sql = "DELETE FROM lecture_status WHERE user_id=" + mysql.escape(user_id) + " AND lecture_id="+ mysql.escape(lecture_id);
  mysqlConnection.query(sql, function(err, result) {
    if(err){
      console.log(err);
      res.status(500).send({ error: 'Error in deleting a like from table' });
    }
    res.send(result);
  })
});






// New Update 



// alter lecture table course id
router.get('/alter-lecture-table-2', (req, res) => {
  let sql = "ALTER TABLE lecture ADD course_id INT AFTER lecture_id, ADD subcourse_id INT AFTER lecture_id"
  mysqlConnection.query(sql, (err, result) => {
    if(err){
        res.status(500).send({ error: err })
    }
    else{
      let sql2 = "ALTER TABLE lecture ADD FOREIGN KEY (course_id) REFERENCES course(course_id), ADD FOREIGN KEY (subcourse_id) REFERENCES subcourse(subcourse_id)"
      mysqlConnection.query(sql2, (err2, result2) => {
        if(err2){
            res.status(500).send({ error: err2 })
        }
        res.send(result2);
      })
    }
  })
});

// Fetch all lectures from the lecture table with a particular topic WITHOUT HIDE
router.get('/fetch-lecture-topic-without-hide/:user_id/:topic_id', function(req, res) {
  var user_id = req.params.user_id;
  var topic_id = req.params.topic_id;
  var sql = "SELECT S.lecture_id, S.user_id, S.created_at, S.completed_lecture, S.time_status, LI.like_lecture FROM lecture_status AS S LEFT JOIN like_table AS LI ON LI.lecture_id = S.lecture_id WHERE S.user_id="  + mysql.escape(user_id);
  mysqlConnection.query(sql, function(err, result) {
    if(err){
      console.log(err);
      res.status(500).send({ error: 'Error in joining' })
    }
    else{
      let sql2 = "SELECT * FROM lecture WHERE topic_id="  + mysql.escape(topic_id) + " ORDER BY priority";
      mysqlConnection.query(sql2, function(err2, result2) {
        if(err2){
          console.log(err2);
          res.status(500).send({ error: 'Error in fectching lectures' });
        }
        else{
          var resultArr = [];
          
          result2.forEach(x => {
            var completed_lecture = null;
            var time_status       = null;
            var like_lecture      = null;
            result.forEach(y => {
              if(x.lecture_id == y.lecture_id){
                completed_lecture = y.completed_lecture;
                time_status       = y.time_status;
                like_lecture      = y.like_lecture;
              }
            });
            var lecture_id     = x.lecture_id;
            var subject_id     = x.subject_id;
            var topic_id       = x.topic_id;
            var section        = x.section;
            var video_link     = x.video_link;
            var homework_link  = x.homework_link;
            var study_material = x.study_material;
            var description    = x.description;
            var priority       = x.priority;
            var hide           = x.hide;
            var objt           = { lecture_id, completed_lecture, time_status, like_lecture, subject_id, topic_id, section, video_link, homework_link, study_material, description, priority, hide}
            resultArr.push(objt);
          });
          res.send(resultArr);
        }
      });
    }
  });
  
});



  
  
  module.exports = router;