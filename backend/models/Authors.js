import mongoose from "mongoose";
import bcrypt from "bcrypt";

const authorSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    cognome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    dataDiNascita: { type: String },
    avatar: { type: String },
    password: { type: String },
    googleId: { type: String }, // NEW! Nuovo campo per l'ID di Google
  }, {
    timestamps: true,
    collection: "authors"
});


// Confronto password
authorSchema.methods.comparePassword = function(candidatePassword){
  return bcrypt.compare(candidatePassword, this.password);
}

// Middleware per l'hashing delle password
authorSchema.pre('save', async function(next) {
  // Esegui l'hashing solo se la pssword è stata modificata o è nuova
  if(!this.isModified('password')) return next();

  try {
    // Genera un salt
    const salt = await bcrypt.genSalt(10);
    // Hashing della password
    this.password = await bcrypt.hash(this.password, salt);
  } catch(error){
    next(error);
  }
});



export default mongoose.model('Author', authorSchema);