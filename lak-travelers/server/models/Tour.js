import mongoose from 'mongoose';

const tourSchema = mongoose.Schema({
  name: { type: String, required: true },       // පැකේජයේ නම (උදා: Historical Tour)
  description: { type: String, required: true }, // විස්තරය
  price: { type: Number, required: true },       // මිල
  duration: { type: String, required: true },    // කාලය (උදා: "3 Days")
  destinations: { type: String, required: true }, // යන තැන් (උදා: "Kandy, Sigiriya")
  groupSize: { type: Number, required: true },   // උපරිම කී දෙනෙක්ටද
  image: { type: String, required: true },       // Cover Photo එක
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // කවුද මේ පැකේජ් එක දැම්මේ (Admin/Vendor)
  },
}, {
  timestamps: true,
});

const Tour = mongoose.model('Tour', tourSchema);
export default Tour;