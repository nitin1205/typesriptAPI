import { Schema, model, ObjectId} from "mongoose";

import { UserDocument } from "./user.model";

export interface SessionDocument {
    // _id: ObjectId;
    user: UserDocument['_id'];
    valid: boolean;
    userAgent: string;
    createdAt?: Date;
    updateAt?: Date;
}


const sessionSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    valid: { type: Boolean, default: true },
    userAgent: { type: String }
},
{
    timestamps: true
});

const SessionModel = model('Session', sessionSchema);

export default SessionModel;