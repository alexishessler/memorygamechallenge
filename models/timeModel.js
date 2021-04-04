const mongoose = require("mongoose");

const timeSchema = mongoose.Schema(
    {
        timeScore: {
            type: Number, 
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

const TimeModel = mongoose.model('timemodel', timeSchema);

module.exports = TimeModel;