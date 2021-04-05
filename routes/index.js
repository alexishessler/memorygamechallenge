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
    
    // Destructuration de la clef time dans l'objet body 
    const { time } = req.body;

    // Utilisation de l'opérateur new pour créer une instance de l'objet TimeModel
    // Cet objet doit respecter un schéma de données créé dans le fichier /models/timeModel.js
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
