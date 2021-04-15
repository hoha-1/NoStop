let mongoose =require("mongoose");
let Scheme =mongoose.Schema;

let blogItem=new Scheme({
    title:{
        type:String,
        required:true
    },
    tags:{
        type:Array,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    cover:{
        type:String,
        required:true
    },
    content:{
        type:String,
    },
    comment:{
        type:Array,
    },
    author:{
        type:Object,
        required:true
    },
    lastModified: {
        type: Date,
        required: true
    },
    views: {
        type: Number,
    },
    likes: {
        type:Number
    },
    blogId: {
        type: Number,
        required: true
    },
    approved: {
        type: Boolean,
        required: true
    }
});

const blogTables = mongoose.model('blogTables', blogItem);

module.exports = blogTables;