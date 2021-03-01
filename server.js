const express = require('express');
const mongoose = require('mongoose');
require('./course');
require('./video');

mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb://localhost/mongoose-course", () => {
  console.log("Me conecté a la BD");
});

const app = express();

const Course = mongoose.model('Course');
const Video = mongoose.model('Video');

app.get("/", (req, res) => {
  Course.find({})
    .populate('videos')
    .then(collection => {
      res.json(collection);
    })
    .catch(err => {
      res.json(err);
    })
});

app.get("/cursos", (req, res) => {
  Course.find({}).then(docs => {
    res.json(docs);
  }).catch(err => {
    res.json(err);
  })
})

app.post('/cursos', (req, res) => {
  Course.create({
    title: 'A Primer Curso de JavaScript',
    description: 'Lorem asjdnasdja sbdhjabs dhjabs dhjasb dashj bdhajs bdahjs'
  }).then(doc => {
    res.json(doc);
  }).catch(err => {
    console.log(err);
    res.json(err);
  });
})

app.get("/cursos/:id", (req, res) => {
  Course.findById(req.params.id).then(doc => {
    res.json(doc);
  }).catch(err => {
    res.json(err);
  })
})

app.put("/cursos/:id", (req, res) => {
  // 1. Actualizar múltiples vez 0 a N
  // Course.update({ numberOfTopics: 0 },{ publishedAt: new Date() },{multi: true}).then(r => {
  //   res.json(r);
  // }).catch(err => res.json(err));

  // 2. findOneAndUpdate
  Course.findByIdAndUpdate(req.params.id, {
    numberOfTopics: 2
  }, { new: true }).then(doc => res.json(doc))
    .catch(err => res.json(err));

  //3. Encontrar primero el documento y luego guardarlo
  // Course.findById(req.params.id).then(course =>{
  //   course.publishedAt = new Date();
  //   return course.save();
  // }).then(saveResponse => res.json(saveResponse))
  // .catch(err => res.json(err));
});

app.delete("/cursos/:id", (req, res) => {
  // 1. Eliminar múltiples a la vez 0 a N
  // Course.deleteMany({ numberOfTopics: 0 }).then(r => {
  //   res.json(r);
  // }).catch(err => res.json(err));

  // 2. findByIdAndDeletee
  Course.findByIdAndDelete(req.params.id).then(doc => res.json(doc))
    .catch(err => res.json(err));

  //3. Encontrar primero el documento y luego eliminarlo
  // Course.findById(req.params.id).then(course => {
  //   // course.publishedAt = new Date();
  //   return course.delete();
  // }).then(deleteResponse => res.json(deleteResponse))
  //   .catch(err => res.json(err));
});

app.post('/videos', (req, res) => {
  Video.create({
    title: 'Primer vídeo',
    course: '5e3c8f2ba3d360566511b97a',
    tags: [
      {
        title: 'Ruby'
      },
      {
        title: 'Web'
      }
    ]
  }).then(video => {
    res.json(video);
  }).catch(err => {
    console.log(err);
    res.json(err);
  })
});

app.get('/videos', (req, res) => {
  Video.find().populate('course')
    .then(videos => res.json(videos)).catch(err => {
      console.log(err);
      res.json(err);
    })
});

app.put('/videos/:id', (req, res) => {
  // 5e4af7fe9e2d9a1235624660
  let video = Video.findById(req.params.id).then(video => {
    video.tags[1] = { title: "Web v3" };
    return video.save();

  }).then(video => {
    res.json(video);
  }).catch(err => {
    console.log(err);
    res.json(err);
  })
});

app.post('/videos/:id/tags/', (req, res) => {
  // 5e4af7fe9e2d9a1235624660
  Video.updateOne({
    _id: req.params.id
  },{
    $push : {
      tags : {
        $each: [{
          title: 'Hola'
        }],
        $position: 0
      }
    }
  }).then(response => {
    res.json(response);
  }).catch(err => {
    console.log(err);
    res.json(err);
  })
});

app.delete('/videos/:id/tags/:tag_id', (req, res) => {
  // 5e4af7fe9e2d9a1235624660
  Video.updateOne({_id: req.params.id},{
    $pull:{
      tags: {
        _id: req.params.tag_id
      }
    }
  }).then(response => {
    res.json(response);
  }).catch(err => {
    console.log(err);
    res.json(err);
  })
});


app.listen(8080, () => console.log("Server started"));