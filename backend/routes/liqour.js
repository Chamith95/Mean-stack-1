const express =require("express");
const Liquor =require('../models/liquor');
const router =express.Router();

router.get("",(req,res,next)=>{
 
    const pageSize=+req.query.pagesize;
    const currentPage=+req.query.page;
    const searchCategory=req.query.searchCategory
    const searchBrand=req.query.searchBrand
    const searchName=req.query.searchName
    const searchCode=req.query.searchCode
    console.log(searchBrand)
    const liqourQuery=Liquor.find()
    const liqourQuerysearchTotal=Liquor.find()
    let fetchedliqour;

    let a=new RegExp("^" + searchName.trim().toLowerCase(), "i")

    // if(pageSize && currentPage && !searchtrue){
    //     liqourQuery.find({$text: {$search: searchCriteria}})
    //         .skip(pageSize *(currentPage -1))
    //         .limit(pageSize);
    // }else
    

    //  if(pageSize && searchCategory==-1){
    //     liqourQuery
    //     .skip(pageSize *(currentPage -1))
    //     .limit(pageSize)
    //     .then(documents =>{
    //         fetchedliqour=documents;
    //         return Liquor.countDocuments();
    //     }).then(count=>{
    //         res.status(200).json({
    //             message:"Liqours fetched successfully",
    //             liqour:fetchedliqour,
    //             maxliqour:count,
    //             totalfromSearch:count
    //             // liquorCount:Object.keys(documents).length
    //         })
    //     }
    //     )

    // }else {
  
        // console.log(searchBrand)
        // console.log(searchBrand.trim()==updatedSearchBrand)
        // console.log(searchBrand.trim())

    Promise.all([
        liqourQuerysearchTotal
        .where("item_name").regex(searchName !=-1 ?  `${searchName.trim()}`:".*?")
        .where("code").regex(searchCode !=-1 ? searchCode.trim():".*?")
        .where('category').regex(searchCategory!=-1 ? searchCategory:".*?")
        .where('brand').regex(searchBrand !=-1 ? searchBrand.trim():".*?")
        .then(documents =>{
            // console.log(documents)
            // fetchedliqour=documents;
            // console.log(Object.keys(documents).length)
            return Object.keys(documents).length;
        }),

      
        liqourQuery
        .where("item_name").regex(searchName !=-1 ? `${searchName.trim()}`:".*?")
        .where("code").regex(searchCode !=-1 ? searchCode.trim():".*?")
        .where('category').regex(searchCategory !=-1 ? searchCategory:".*?")
        .where('brand').regex(searchBrand !=-1 ? searchBrand.trim():".*?")
        .skip(pageSize *(currentPage -1))
        .limit(pageSize)
        .then(documents =>{
            // console.log(documents)
            fetchedliqour=documents;
            // console.log(Object.keys(documents).length)
            return Liquor.countDocuments();
        })
    ]).then(
        ([total,documents])=>{
            //  console.log(total)
            let a=documents
            // console.log(Object.keys(fetchedliqour).length)
             res.status(200).json({
                message:"Liqours fetched successfully",
                liqour:fetchedliqour,
                maxliqour:documents,
                totalfromSearch:total
                
                // liquorCount:Object.keys(documents).length
            })
        }
    )
        //  console.log(matchingCount)
        // liqourQuery
        // .where('category').equals(searchCategory)
        // .skip(pageSize *(currentPage -1))
        // .limit(pageSize);
    
    // liqourQuery
    //     .then(documents =>{
    //         // console.log(documents)
    //         fetchedliqour=documents;
    //         // console.log(Object.keys(documents).length)
    //         return Liquor.countDocuments();
    //     }).then(count=>{
    //         res.status(200).json({
    //             message:"Liqours fetched successfully",
    //             liqour:fetchedliqour,
    //             maxliqour:count,
    //             // liquorCount:Object.keys(documents).length
    //         })
    //     }
    //     )

});
module.exports =router;