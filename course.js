const mongoose = require('mongoose');
const slugify = require('slugify');

// 1. Definir el schema
let courseSchema = new mongoose.Schema({
  // _id: ObjectId: Identificador único de tu documento
  title:{
    type: String,
    required: true
  },
  description: {
    type: String,
    minlength: [50, 'No se cumple la longitud mínima de 50'],
    maxlength: 300,
    select: false
  },
  numberOfTopics: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  publishedAt: Date,
  slug: {
    type: String,
    required: true
  }
});

courseSchema.virtual('videos').get(function(){
  return mongoose.model('Video').find({course: this._id});
})

courseSchema.virtual('info')
  .get(function(){
    // this => documento
    return ` ${this.description}. Temas: ${this.numberOfTopics}. Fecha de lanzamiento: ${this.publishedAt} `;
  });


/*
validate
save
remove
updateOne
deleteOne
init => sync
*/
courseSchema.pre('validate',function(next){
  // Curso profesional de Mongoose
  // curso-profesional-mongoose
  this.slug = slugify(this.title);
  next();
})

// 2. Definir el modelo
mongoose.model('Course', courseSchema);