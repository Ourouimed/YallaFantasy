const Rounds = require("../models/rounds");

exports.create = async (req, res) => {
  try {
    const { round_id, round_title, round_deadline } = req.body;

    if (!round_id || !round_title || !round_deadline) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const utc_round_deadline = new Date(round_deadline).toISOString().replace('T', ' ').substring(0, 19); 
    await Rounds.createRound(round_id, round_title, utc_round_deadline);

    res.json({
      message: "Round created successfully!",
      round: {
        round_id,
        round_title,
        round_deadline
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating round" });
  }
};

exports.update = async (req , res)=>{
  try {
    const { id } = req.params
    const { round_deadline , round_title } = req.body
    if (!id || !round_deadline || !round_title){
       return res.status(400).json({ error: "All fields are required" });
    }

    const [ round ] = await Rounds.getRoundById(id)
    if (!round){
      return res.status(404).json({error : 'Round not found'})
    }

    const utc_round_deadline = new Date(round_deadline).toISOString().replace('T', ' ').substring(0, 19); 

    await Rounds.updateRound(id , utc_round_deadline , round_title)
    return res.json({message : 'Round updated successfully' , round : {
      round_id : id , round_deadline , round_title
    }})
  }
  catch (err){
    console.log(err);
    res.status(500).json({error : 'Internal server error'})
  }
}

exports.getAllrounds = async (req , res)=>{
      try {
        const rounds = await Rounds.getAllrounds()
        res.json(rounds)
      }
      catch (err){
        console.log(err);
        res.status(500).json({error : 'Internal server error'})
      }
}

exports.delete = async (req , res)=>{
  const { id } = req.body
  if (!id){
    return res.status(400).json({ error: "No round Id provided" });
  }

  try {
    const results = await Rounds.deleteByid(id)
    if (results.affectedRows === 0){
       return res.status(404).json({ error: "Round not found" });
    }
    res.json({message : 'Round deleted successfully'})
  }
  catch(err) {
    console.log(err)
    return res.status(500).json({error : 'Error deleting Round!'})
  }
  
}