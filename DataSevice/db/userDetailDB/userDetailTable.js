let mongoose=require("mongoose");
let Scheme=mongoose.Schema;

let UserDetail=new Scheme({
    key:{
        type:String,
        required:true
    },
    articles:{
        type:Array
    },
    comments:{
        type:Array
    },
    likes:{
        type:Array
    },
    attentions:{
        type:Array
    },
    blacklist:{
        type:Array
    },
    fans:{
        type:Array
    },
    news:{
        type:Array
    }
});

const UserDetailTables=mongoose.model("UserDetailTables",UserDetail);

module.exports=UserDetailTables;