const db = require('../config/db')
const Teams = {
    createTeam : async (teamName , group , flagUrl)=>{
        await db.query('INSERT INTO teams values (? , ? , ? , ?)' , [teamName , teamName , group , flagUrl])
    }
}

module.exports = Teams