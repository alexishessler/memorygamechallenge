const express = require('express'), 
  router = express.Router(),
  TimeModel = require('../models/timeModel');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Memory Game' });
});

/* POST newscore. */
router.post('/save', async (req, res) => {
  try {
    
    const { time } = req.body;

    const saveNewTime = new TimeModel({timeScore:time})
    await saveNewTime.save()
  
    res.json({result: true, saveNewTime})

  } catch(err){
    res.json({result: false, err})
  }
});

/* GET besttimes. */
router.get('/besttimes', async (req, res) => {
  try {

    const times = await TimeModel.find().sort({'timeScore': 1})

    console.log(times)
  
    res.json({result: true, bestimes: {
      time1: times[0].timeScore,
      time2: times[1].timeScore,
      time3: times[2].timeScore,
    }})

  } catch(err){
    res.json({result: false, err})
  }
});

module.exports = router;
