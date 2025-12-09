const userDetail = new Map();

export function setUserObjectId(userObjectId){
    console.log("Storing user ID in cache:", userObjectId); 
    userDetail.set("_id", String(userObjectId) );

}

export function getUserObjectId(){
    const val = userDetail.get("_id");
    console.log("Getting user ID from cache:", val); 

    return val;

}





