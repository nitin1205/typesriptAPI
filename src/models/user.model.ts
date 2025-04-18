import { Schema, model, CallbackWithoutResultAndOptionalError, Types } from 'mongoose';
import bcrypt from 'bcrypt';
import config from 'config';


interface User {
    name: string;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  interface UserDocument extends User {
    _id: Types.ObjectId;
    isModified(field: string): boolean;
    save(): Promise<UserDocument>;
    comparePassword(candidatePassword: string): Promise<boolean>;
  }

  export type UserInput = Omit<UserDocument, 
  "_id" | 
  "createdAt" | 
  "updatedAt" | 
  "isModified" | 
  "save" | 
  "comparePassword"
>;


 
const userSchema = new Schema({
    email: {
        type: String,
        require: true,
        unique: true
    },
    name: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true
    }
},
{
    timestamps: true
});

userSchema.pre('save', async function(next: CallbackWithoutResultAndOptionalError) {
    let user = this as unknown as UserDocument;
    
    if(!user.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(config.get<number>('saltWorkFactor'));
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    return next();
})

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    let user = this as UserDocument
    return await bcrypt.compare(candidatePassword, user.password).catch(e => false);
}

const userModel = model<UserDocument>('User', userSchema);

export default userModel