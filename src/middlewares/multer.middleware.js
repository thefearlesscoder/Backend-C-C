import multer from "multer";

const storage = multer.diskStorage({


    

    destination: function (req, file, cb) {  //cb -> call back
        console.log("inside multer middle");
        cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {

        cb(null, file.originalname)
    }
})

export const upload = multer({
    storage,
})