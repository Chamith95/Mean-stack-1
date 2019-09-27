import { Injectable } from '@angular/core';
import { Liqour } from './liqour.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LiqourService {

  private liqour:Liqour[]=[];
  private liqourUpdated=new Subject<{liqour:Liqour[],liqourCount:number}>();

  constructor(private http:HttpClient,private router:Router){}

  getliqour(liqourPerPage:number,currentPage:number,searchCriteria:string){
      // if(searchCriteria.length==0){
      //     let search=
      // }
      const queryParams=`?pagesize=${liqourPerPage}&page=${currentPage}&searchCriteria=${searchCriteria}`
     this.http
.get<{message:string,liqour:any,maxliqour:number}>(
         "http://localhost:3000/api/liqour" +queryParams
         )
     .pipe(map((liqourData)=>{
          return{liqour: liqourData.liqour.map(liqour=>{
              return{
                  code: liqour.code,
                  category: liqour.category,
                  id: liqour._id,
                  brand:liqour.brand,
                  item_name:liqour.item_name,
                  price:liqour.price,
              }
          }),maxliqour:liqourData.maxliqour}
     }))
     .subscribe((transformedliqourData)=>{
         console.log(transformedliqourData);
        this.liqour= transformedliqourData.liqour;
        this.liqourUpdated.next({liqour:[...this.liqour],
          liqourCount:transformedliqourData.maxliqour})

     });
  }

  getLiqourUpdateListner(){
    return this.liqourUpdated.asObservable(); 
}
}
