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

// get all playlist

const getAllPlaylistDetails = async(req,res) => {
    // user must be login
    //find all the playlist related to user
    // attach all the problems with playlist
    // send bak the response

    const userId = req.user.id

    if(!userId){
        return res.status(400).json({
            error : "User not allowed : You must login first"
        })
    }

    try {
        const allPlaylist = await db.playlist.findMany({
            where : {
                userId
            },
            include : {
                problems : {
                    include : {
                        problem : true
                    }
                }
            }
        })

        if(!allPlaylist){
            return res.status(400).josn({
                error : "Playlists not found"
            })
        }

        return res.status(200).json({
            success : true,
            message : "all playlists fetched SuccessFully",
            allPlaylist
        })
    } catch (error) {
        console.log("Error fetching all playlist for user",error)
        return res.status(500).json({
            error : "Failded to fetch all playlists for user"
        })
        
    }
}

// get playlist details

const getPlaylistDetails = async(req,res)=>{
    // user must be login
    // get playlistid from params to fetch the details 
    // querry the db on the baisis of userid and playlist id
    // send back the response

    const userId = req.user.id
    const playlistId = req.params.playlistId

    if(!userId){
        return res.status(400).json({
            error : "User not allowed, You must login first"
        })
    }

    if(!playlistId){
        return res.status(400).json({
            error : "Playlist id is required"
        })
    }

  try {
      const playlist = await db.playlist.findUnique({
          where : {
              userId,
              id : playlistId
          },
          include : {
              problems : {
                  include : {
                      problem : true
                  }
              }
          }
      })
  
      if(!playlist){
          return res.status(400).json({
              error : "Paylist not found"
          })
      }
      return res.status(200).json({
          success : true,
          message : "Playlist by ID  fetched Successfully",
          playlist
      })
  } catch (error) {
    console.error("Error fetching playlist by ID:", error);
    res.status(500).json({ error: "Failed to fetch playlist by ID" });
    
  }
}

// add problem to playlist

const addProblemToPlaylist = async(req,res) => {
    // user must be login
    // get problemId from body // we can send array of problemids
    // get playlist id from params
    // search the playlist in db 
    // add problem id

    const userId = req.user.id
    if(!userId){
        return res.status(500).json({
            error : "user not allowed, you must login first"
        })
    }

    const {problemIds} = req.body

    if(!Array.isArray(problemIds) || problemIds.length ===0){
        return res.status(400).json({
            error : "Problemids must be in Array"
        })
    }

    const playlistId = req.params.playlistId

    if(!playlistId){
        return res.status(400).json({
            error : "Plyalist id is required"
        })
    }

   try {
     const addProblem = await db.problemInPlaylist.createMany({
         data : problemIds.map((problemId)=>({
             problemId,
             playListId : playlistId
         }))
     })
     
 
     return res.status(201).json({
         success :  true,
         message : "Problem has been saved to playlist",
         addProblem
     })
   } catch (error) {
    console.log("Error in adding problem to playlst",error)
    return res.status(500).json({
        error:"Error in adding problem to playlist"
    })
    
   }





}

// delete Problem

const deleteProblemFromPlaylist = async(req,res)=>{
    // user must be login
    // get problemids from body 
    //get playlistid
    // remove the problem for playlist

    const playlistId = req.params.playlistId
    const {problemIds} = req.body

    // problemIds must be in array

    if(!Array.isArray(problemIds) || problemIds.length ===0){
        return res.status(400).json({
            error: "Invalid or missing problemsIds"
        })
    }

    if(!playlistId){
        return res.status(400).json({
            error : "playlist id is required"
        })
    }

    try {
        const deleteProblem = await db.problemInPlaylist.deleteMany({
            where : {
                playlistId : playlistId,
                problemId : {
                    in : problemIds
                }
            }
        })
    
        res.status(200).json({
            success : true,
            message : "Problem removed from playlist Successfully",
            deleteProblem
        })
        
    } catch (error) {
        console.log("Error in removing problem from playlist",error)
        return res.status(500).json({
            error : "Error while deleting problem from playlist"
        })
        
    }


    


}

// delete Playlist

const deletePlaylist = async(req,res)=>{
    // user must be login 
    //get playlistid from params
    // search the playlist id and remove it 
    // send back the response 

    const userId = req.user.id
    if(!userId){
        return res.status(400).json({
            error : "User not allowed, You must login first"
        })
    }
    const playlistId = req.params.playListId

    if(!playlistId){
        return res.status(400).json({
            error : "Invalid data or missing data"
        })
    }

  try {
      const playlist = await db.playlist.delete({
          where : {
              userId,
              id : playlistId
          }
      })

      return res.status(200).json({
        success : true,
        message : "Playlist deleted Successfully",
        playlist
      })
  
  } catch (error) {
     console.error("Error in removing the playlist : ",error)
     return res.status(500).json({
        error : "Error while removing the playlist"
     })
    
  }



}




export {createPlayList,
    getAllPlaylistDetails,
    getPlaylistDetails,
    addProblemToPlaylist
    ,deleteProblemFromPlaylist
    ,deletePlaylist}