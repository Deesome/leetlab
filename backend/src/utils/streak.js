import { db} from "../libs/db.js"

 async function updateLoginStreak(user) {
    // user will pass as param from login controller
    // if its null then increment by one 
    // if its already exist then check for the condiotion 
    // 1. If date is today then no increment
    // 2. If date is previous day date then increase the streak by one 
    // 3.if date is less then previos day then reset streak to 0
    //  


    //have to get rid of time in date, otherwise we cannot compare
    const today = new Date()
    today.setUTCHours(0,0,0,0)
    // const day = today.getDate()
    // const month = today.getMonth()
    // const year = today.getFullYear()

    // const currentDay = `${year}/${month}/${day}`
   
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate()-1)
    yesterday.setUTCHours(0,0,0,0,)

    // const pDay = yesterday.getDate()
    // const pMonth = yesterday.getMonth()
    // const pYear = yesterday.getFullYear()

    // const previousDay = `${pYear}/${pMonth}/${pYear}`

    console.log(yesterday)
   
    if(!user){
        return res.status(401).json({
            message : "User is required to update streak"
        })
    }

    const userStreak = user.Streak
    
    if(!userStreak){
        await db.Streak.create({
            data : {
                userId : user.id,
                lastLoginDate : today,
                loginStreak : 1,
                longestLoginStreak : 1
            }
        })
        return
        

    }

     // today , last login are objects we cannot compare directly , first have to convert it into string
    const lastLogin = new Date(userStreak.lastLoginDate)
    console.log(typeof lastLogin.toISOString())
   


    if(lastLogin.toISOString() === today.toISOString()){
        console.log("Streak already incremented")
        
    }

    if(lastLogin.toISOString() === yesterday.toISOString() ){
       await db.Streak.update({
        where : {
            id : userStreak.id
        },
        data : {
            loginStreak : userStreak.loginStreak + 1,
            lastLoginDate : today,
            longestLoginStreak : Math.max(loginStreak, longestLoginStreak)
        }
       })
      
    }

    // if both the cases are not valid then reset the streak to 1
    await db.Streak.update({
    where: { id: userStreak.id },
    data: {
      loginStreak: 1,
      lastLoginDate: today,
    },
  });






 }



 export {updateLoginStreak}