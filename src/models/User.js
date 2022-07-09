import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {

    }
)

const User = mongoose.model("User", userSchema);
export default User;
