const { Schema, model } = require('mongoose');

const DevSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    bio: String,

    avatar: {
        type: String,
        required: true
    },
    matches: [{
        //kinda of relantionship
        type: Schema.Types.ObjectId, //mongo ID
        ref: 'Dev' //referente a qual model
    }],
    likes: [{
        //kinda of relantionship
        type: Schema.Types.ObjectId, //mongo ID
        ref: 'Dev' //referente a qual model
    }],
    dislikes: [{
        type: Schema.Types.ObjectId, //mongo ID
        ref: 'Dev' //referente a qual model
    }]
},
    { //createdAt, updateAt
        timestamps: true
    });

    module.exports = model('Dev', DevSchema); //model nane & schema