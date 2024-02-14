import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
      },
      filename: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
      filePath: {
        type: String,
        required: true,
      }}
);



const Video = mongoose.model("Video", VideoSchema);
export default Video;