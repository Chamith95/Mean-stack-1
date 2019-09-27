const mongoose =require('mongoose');

const liqourSchema =mongoose.Schema({
    code:{type:String,required:true},
    category:{type:String,required:true},
    brand:{type:String,required:true},
    item_name:{type:String,required:true},
    price:{type:String,required:true},
});

liqourSchema.index({'$**': 'text'});

module.exports=mongoose.model('Liqour',liqourSchema);