import { db } from "../libs/db.js"


// create playList


const createPlayList = async(req,res)=>{
    // get name and description for body 
    // user must be login 
    //check the existingPlaylIst
    //create the playlsit in db 
    // send back the response 
    const userId = req.user.id
    if(!userId){
        return res.status(400).json({
            error : "user not allowed, You must login first"
        })
    }

    const {name,description} = req.body

    if(!name){
        return res.status(400).json({
            error : "Playlist name is required"
        })
    }

 try {
       const existingPlaylist = await db.playlist.findFirst({
           where : {
               name
           }
       })
   
       if(existingPlaylist){
           return res.status(400).json({
               error : "playlist already exists"
           })
       }
   
       const playlist = await db.playlist.create({
           data : {
               name,
               description,
               userId
           }
       })

       return res.status(201).json({
        success : true,
        message : "Playlist created successfully",
        playlist
       })
 } catch (error) {
    console.error("Error while creating Playlist",error)
    return res.status(500).json({
        error : "Internal Error while creating playlist"
    })

    
 }

}


export {createPlayList}