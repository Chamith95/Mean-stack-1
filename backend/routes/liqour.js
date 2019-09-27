const express =require("express");
const Liquor =require('../models/liquor');
const router =express.Router();

router.get("",(req,res,next)=>{
 
    const pageSize=+req.query.pagesize;
    const currentPage=+req.query.page;
    const searchCriteria=req.query.searchCriteria
    const searchCategory=req.query.searchCategory
    // console.log(searchCategory)
    const liqourQuery=Liquor.find()
    const liqourQuerysearchTotal=Liquor.find()
    let fetchedliqour;
    let searchtrue=(searchCriteria.length==9)

    // if(pageSize && currentPage && !searchtrue){
    //     liqourQuery.find({$text: {$search: searchCriteria}})
    //         .skip(pageSize *(currentPage -1))
    //         .limit(pageSize);
    // }else
    

     if(pageSize && searchCategory=='undefined'){
        liqourQuery
        //  .where('category').equals(searchCategory)
        .skip(pageSize *(currentPage -1))
        .limit(pageSize)
        .then(documents =>{
            // console.log(documents)
            fetchedliqour=documents;
            // console.log(Object.keys(documents).length)
            return Liquor.countDocuments();
        }).then(count=>{
            res.status(200).json({
                message:"Liqours fetched successfully",
                liqour:fetchedliqour,
                maxliqour:count,
                totalfromSearch:count
                // liquorCount:Object.keys(documents).length
            })
        }
        )

    }else {

    Promise.all([
        liqourQuerysearchTotal.where('category').equals(searchCategory)
        .then(documents =>{
            // console.log(documents)
            // fetchedliqour=documents;
            // console.log(Object.keys(documents).length)
            return Object.keys(documents).length;
        }),


        liqourQuery
        .where('category').equals(searchCategory)
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
            console.log(Object.keys(fetchedliqour).length)
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
    }
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