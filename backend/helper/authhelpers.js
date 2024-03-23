const bcrypt = require("bcrypt")


exports.hashpassword = async (password) =>{
    try {
        const saltRounds = 10
        const hashedpassword = await bcrypt.hash(password, saltRounds)
        return hashedpassword
    } catch (error) {
        console.log(error)
    }
}

exports.comparepassword =async (password, hashedpassword)=>{
      return bcrypt.compare(password, hashedpassword)
}  