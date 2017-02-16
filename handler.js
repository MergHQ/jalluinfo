'use strict';
const needle = require('needle');
const cheerio = require('cheerio');
const JALLU_URL = 'https://www.alko.fi/tuotteet/000706/Jaloviina-';

module.exports.jallu = (event, context, callback) => {
  getJalluInfo((err, res) => {
    if (err) {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Error'
        })
      });
      return;
    }
    
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Success',
        data: res
      })
    };
    callback(null, response);
  });
};

function getJalluInfo(cb) {
  needle.get(JALLU_URL, (err, res) => {
    if (err) {
      cb(err, null);
      return;
    }
    let $ = cheerio.load(res.body);
    let price = $('.price-part')[0].parent.attribs.content;
    let factData = $('.fact-data');
    try {
      let alcohol = factData[0].children[0].data;
      let sugar = factData[1].children[0].data;
      let energy = factData[2].children[0].data;
      let pricePerLiter = factData[3].children[0].data;
      const obj = {
        price,
        alcohol,
        sugar,
        energy,
        pricePerLiter
      }
      cb(null, obj);
    } catch (e) {
      cb(e, null);
    }
  });
}
