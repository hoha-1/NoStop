let mongoose=require("mongoose");
let Schema=mongoose.Schema;

let tipOffData=Schema({
    blogId: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    cover: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    reason:{
        type:String,
        required:true
    },
    authorName:{
        type:String,
        required:true
    }
})

let TipOffTables=mongoose.model("TipOffTables",tipOffData)
module.exports=TipOffTables;