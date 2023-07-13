const recordModel = require( '../models/recordModel' );
const userModel = require("../models/userModel");

exports.createRecord = async ( req, res ) => {
    try {
        const { mathScore, englishScore } = req.body;
        // create a new record
        const record = new recordModel( {
            mathScore,
            englishScore,
            createdBy: req.session.user._id,
        } );

        // save the record to the database
         await record.save();
        res.status( 201 ).json( {
            message: "Record created successfully",
            data: record
        })
    } catch ( error ) {
        return res.status( 500 ).json( {
            message: error.message
        })
    }
}



// show all database records
exports.readRecords = async(req, res) =>{
    try {
        const records = await recordModel.find();
        res.status(200).json({
            message: "All records",
            data: records
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}



// finds all records of a specific user
exports.readAllRecordsOfSpecificUser = async ( req, res ) => {
    try {
        const records = await recordModel.find({createdBy:req.session.user._id,});
        if(!records){
       return res.status( 404 ).json( {
        message: "This user has no record"
         })
    } else {
        res.status(200).json({
            message: "All my records.",
            data: records
        });
    }
    } catch ( error ) {
        res.status( 500 ).json( {
            message: error.message
        })
    }
}


// find one record
exports.readRecord = async ( req, res ) => {
   
    try {
        const { id } = req.params;
        const record = await recordModel.findById( id );
        if(!record) {
        return res.status( 404 ).json( {
            message: "Record not found"
        
        })
    }

    // check if the logged-in user owns the record
    if(record.createdBy.toString() !== req.session.user._id.toString()) {
        return res.status(401).json({message: "Unauthorized"});
    }

    res.status(200).json(record);
    } catch ( error ) {
        res.status( 500 ).json( {
            message: error.message
        })
    }
}


// update one record
exports.updateRecord = async ( req, res ) => {
  try {
    const {id} = req.params;
    const record = await recordModel.findById(id);

    if(!record) {
        return res.status(404).json({message: 'Record not found'});
    }

    // check if the logged-in user owns the record
    if(record.createdBy.toString() !== req.session.user._id.toString()) {
        return res.status(401).json({message: 'Unauthorized'});
    }

    record.mathScore = req.body.mathScore || record.mathScore;
    record.englishScore = req.body.englishScore || record.englishScore;

    // save the updated record
    await record.save();
    res.status(200).json({message:'Record updated successfully'});
  } catch (error) {
    res.status(500).json({message: error.message})
  }
};



// Delete one record
exports.deleteRecord = async ( req, res ) => {
    try {
      const {id} = req.params;
      const record = await recordModel.findById(id);
  
      if(!record) {
          return res.status(404).json({message: 'Record not found'});
      }
  
      // check if the logged-in user owns the record
      if(record.createdBy.toString() !== req.session.user._id.toString()) {
          return res.status(401).json({message: 'Unauthorized'});
      }
  
     // Remove the record from the user's records array
     const user = await userModel.findById(req.session.user._id);
    //  console.log(user)
     user.records = user.records.filter((recordId) => recordId.toString() !== record._id.toString());
     await record.save();

     // Delete the record from the database
     await recordModel.findByIdAndDelete(id);
      res.status(200).json({message:'Record deleted successfully'});
    } catch (error) {
      res.status(500).json({message: error.message})
    }
  };