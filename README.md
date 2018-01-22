# ZSSN (Zombie Survival Social Network)  - BACKEND  

Solving the [BACKEND ZNSS Test](https://gist.github.com/akitaonrails/711b5553533d1a14364907bbcdbee677)   

## Rest API (Node.js + Express)  
### Routes  

**/api/survivors/**  
    .post - Create a survivor  
        requires: name, age, gender, water, food, medication, ammunition;  
        optional: latitude, longitude;  

    .get - List all survivors registered  


**/api/survivors/:survivor_id/**    
    .get - List a survivor by the ID     
        requires: survivor_id;     

    .put - Update a survivor's location    
        requires: latitude, longitude, survivor_id;    

    .delete - Delete a survivor    
        requires: survivor_id;  


**/api/survivors/:survivor_id/infection/**     
    .get - List infection's data of the survivor     
        requires: survivor_id;    

    .put - Update survivor's infection     
        requires: reportedId, reporterId;    

**api/survivors/:survivor_id/inventory/**    
    .get - List survivor's inventory items    
        requires: survivor_id;    

    .put - Trade items of 2 survivors    
        requires: survivorId1, survivorId2, water1, water2, food1, food2, medication1, medication2, ammunition1, ammunition2;    

ps.: item1 is the item offered by the survivor1 and item2 is the item offered by the survivor2.    


**/api/reports**    
    .get - Generate Reports    
