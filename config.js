var config = {
  base_url:'https://api.fda.gov/drug/event.json?',
  api_key: 'hio1wf7pqYENmmnF8Q0THFA94muLUSMqwy1nzYo7',
  server_port:4000,
  drug_event_url:'https://api.fda.gov/drug/event.json?',
  drug_enforcement_url:'https://api.fda.gov/drug/enforcement.json?',
  device_enforcement_url:'https://api.fda.gov/device/enforcement.json?',
  food_enforcement_url:'https://api.fda.gov/food/enforcement.json?',
  environment:{
    development:{
        host:'http://localhost',
        port:'4000'
    },
    intergration:{
        host:'http://10.63.48.27',
        port:'80'
    },
    production:{
      host:'http://localhost',
      port:'80'
    }
  }
};

module.exports = config;
