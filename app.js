//Washington Post RSS API for IFTTT

//Initializing Entry point and testing API
var IFTTT_SERVICE_KEY = "-MRtrOGdwn39dcuvKTLnaIA_eaMepmDU1Bruynoy0cjx9IaVrkQ6WYRDYfKjl_eu"
const express = require('express')
const app = express()

const parser2 = require("fast-xml-parser");
const got = require("fix-esm").require("got");
const bodyParser = require("body-parser");
app.use(bodyParser.json())

app.get('/api/ping', (req,res) => {
    var response = { answer: "pong" }
    res.status(200).json(response)
})

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})

//const myFeedUrl = 'http://feeds.washingtonpost.com/rss/politics?itid=lk_inline_manual_2'
const myFeedUrl = 'https://rss.app/feeds/_96ajWY9y0j6W2zRl.xml'
const all ="_96ajWY9y0j6W2zRl"
const national ="tdsav0GhLPO5siKU"
const entertainment ="wNkhQuGEe0XypVUG"
const business ="CVrbOhIFQ796bQMM"
const sports ="xConq0IzudRi86i0"
const world ="iZLI9pTD2sCeOExW"
const lifestyle ="LRaKK8EByTTvg4PL"
const technology ="YcUiV5eFSKfuWks9"
const opinions ="zlzIyItLwhfkduxU"
const politics ="kZ2HQoc2bRrPqnrm"

const feedpt1 = "https://rss.app/feeds/" 
var feedpt2 =""








//Configuring RSS-Parser Package
let Parser = require('rss-parser')

let parser = new Parser({
    headers: { 'User-Agent': 'Chrome' }
});

function generateUnique8DigitString() {
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += Math.floor(Math.random() * 10);
    }
    return result;
}

function createAt() {
    var date = new Date();
    return date.toISOString();
  }

async function fetchRssFeed(feedUrl) {
    let feed = await parser.parseURL(feedUrl);
    let data = feed.items.slice(0,3).map(item => ({
        meta: {
            id: generateUnique8DigitString(),
            timestamp: Math.floor(Date.now() / 1000)
        },
                created_at: createAt(),
                title: item.title,
                link: item.link,
                date: item.pubDate
    }));
  
    let response2 = {
        data       
    }
    return response2
}  


async function fetchRssFeedOnly1(feedUrl) {
    let feed = await parser.parseURL(feedUrl);
    let data = feed.items.slice(0,1).map(item => ({
        meta: {
            id: generateUnique8DigitString(),
            timestamp: Math.floor(Date.now() / 1000)
        },
                created_at: createAt(),
                title: item.title,
                link: item.link,
                date: item.pubDate
    }));
  
    let response2 = {
        data       
    }
    return response2
}  


/////////////////////////////////// End Original Parser //////////////////////////////////////////////////////


// IFTTT Status Test
app.get('/ifttt/v1/status', function(req, res) {
    var serviceKey = req.header("IFTTT-Service-Key");
    if (serviceKey == IFTTT_SERVICE_KEY) {
      res.status(200).send('IFTTT Service is up');
    } else {
      res.status(401).json({
        status: 'error',
        message: 'Invalid Service key'
    })
    }
  });
  
  // Golden Record - Setup Test
  app.post('/ifttt/v1/test/setup', function(req, res) {
    var serviceKey = req.header("IFTTT-Service-Key");
    if (serviceKey == IFTTT_SERVICE_KEY) {
      //res.status(200).send('IFTTT Service is up');
      res.status(200).json({
        data: {
            "samples": {
                "triggers": {
                    "new_article_matching_search": {
                        "term": "U.S."
                    },
                    "news_article_from_section" :{
                        "section": "politics"
                    }
                }
            }
        },
      })
    } else {
      res.status(401).json({
        status: 'error',
        message: 'Invalid Service key'
    })
    }
  });
  

// Basic Test Routes

app.get('/api/news', async (req, res) => {
    await fetchRssFeed(myFeedUrl)
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            res.status(500).json({
                status: 'error',
                message: 'An error occurred when fetching news',
               
            })
        })
})

//My secondary function that checks a query string on request and returns any matching news on the response
app.get('/api/news/:searchString', async (req, res) => {
    await fetchRssFeed(myFeedUrl)
        .then(data => {
            const searchString = req.params.searchString
            const filteredData = data.filter(item => {
                return item.title.toLowerCase().includes(searchString.toLowerCase())
            })
            res.status(200).json(filteredData)
        })
        .catch(err => {
            res.status(500).json({
                status: "error",
                message: 'An error occured when fetching your data'
            })
        })
})

//My tiertiary fucntion that checks a string and then searches to the corresponding section and then returns that
app.get('/api/news/cat/:searchCategory', async (req, res) => {
    const searchCategory = req.params.searchCategory.toLowerCase()
    //Which category did the user pick?
    if(searchCategory == "poltiics")
        feedpt2 = politics
    else if(searchCategory == "business")
        feedpt2 = business
    else if(searchCategory == "national")
        feedpt2 = national
    else if(searchCategory == "entertainment")
        feedpt2 = entertainment
    else if(searchCategory == "sports")
        feedpt2 = sports
    else if(searchCategory == "world")
        feedpt2 = world
    else if(searchCategory == "lifestyle")
        feedpt2 = lifestyle
    else if(searchCategory == "business")
        feedpt2 = business
    else if(searchCategory == "technology")
        feedpt2 = technology
    else if(searchCategory == "opinions")
        feedpt2 = opinions
    else 
        feedpt2 = all
    
    //Building the correct feed
    var myFeedUrl2 = feedpt1 + feedpt2 + ".xml"
    
    //Check the if the Service Key is valid
    var serviceKey = req.header("IFTTT-Service-Key");
    if (serviceKey == IFTTT_SERVICE_KEY) {
       await fetchRssFeed(myFeedUrl2)
            .then(data => {
            res.status(200).json(data)
            })
            .catch(err => {
                res.status(500).json({
                    status: "error",
                    message: 'An error occured when fetching your data'
                })
            })
    }
    else {
        res.status(401).json({
            status: 'error',
            message: 'Invalid Service key',
            feed_url: myFeedUrl2,
            category: searchCategory
        })  
    }
})


////////////////////// IFTTT Endpoints  ////////////////////////////

//IFTTT - API Endpoint for any new article posted 
app.post('/ifttt/v1/triggers/news', async (req, res) => {
    var serviceKey = req.header("IFTTT-Service-Key");
    if (serviceKey == IFTTT_SERVICE_KEY) {
        await fetchRssFeed(myFeedUrl)
            .then(data => {
                res.status(200).json(data)
            })
            .catch(err => {
                res.status(401).json({
                    status: 'error',
                    message: 'An error occurred when fetching news'
                })
            })
    }
    else {
        res.status(401).json({
            status: 'error',
            message: 'Invalid Service key'
        })  
    }
})

//IFTTT Route for Looking for artciles w/ a specific title in it
app.post('/ifttt/v1/triggers/new_article_matching_search/', async (req, res) => {
    var serviceKey = req.header("IFTTT-Service-Key");
    var searchString = req.header("term");
    
    
    if (serviceKey == IFTTT_SERVICE_KEY) { 
            if(req.header('triggerFeilds') == ""){
            res.status(400).json({
                status: "error",
                message: 'An error occured from data check -TF:' + Tfs
                })
            }
    
        
        await fetchRssFeed(myFeedUrl)
            .then(data => {
                //const searchString = req.params.searchString
                searchString = req.params.searchString
                const filteredData = data.filter(item => {
                    return item.title.toLowerCase().includes(searchString.toLowerCase())
                })

                res.status(200).json(filteredData)
            })
        .catch(err => {
            res.status(500).json({
                status: "error",
                message: 'An error occured when fetching your data - DUDE!'
                })
            })
    }
    else 
    {
        res.status(401).json({
            status: 'error',
            errors: [
                {
                  "message": "Invalid AF",
                  "rando element": [
                    "Data Value 1'",
                    "Data Value 2'"
                  ],
                  "internal_message": "Ifttt::Protocol::AuthorizationError: Invalid IFTTT-Channel-Key"
                }
              ],
           notes: 'Invalid Service key ' + IFTTT_SERVICE_KEY + " == " + serviceKey
        })  
    }

})



app.post('/ifttt/v1/triggers/news_article_from_section/', async (req, res) => {
    
    var triggerFields = req.body.triggerFields
    if(triggerFields != undefined)
        var searchCategory = triggerFields.section
    
    //Which category did the user pick?
    if(searchCategory == "politics")
        feedpt2 = politics
    else if(searchCategory == "business")
        feedpt2 = business
    else if(searchCategory == "national")
        feedpt2 = national
    else if(searchCategory == "entertainment")
        feedpt2 = entertainment
    else if(searchCategory == "sports")
        feedpt2 = sports
    else if(searchCategory == "world")
        feedpt2 = world
    else if(searchCategory == "lifestyle")
        feedpt2 = lifestyle
    else if(searchCategory == "business")
        feedpt2 = business
    else if(searchCategory == "technology")
        feedpt2 = technology
    else if(searchCategory == "opinions")
        feedpt2 = opinions
    else 
        feedpt2 = all
    //Building the correct feed
    var myFeedUrl2 = feedpt1 + feedpt2 + ".xml"
    
    //Check the if the Service Key is valid
    var serviceKey = req.header("IFTTT-Service-Key");
    if (serviceKey === IFTTT_SERVICE_KEY) {
        var n = req.body.limit
        
        if (typeof searchCategory === 'undefined'){
            console.log("Toasty. Tf = " + searchCategory || dp == 1)
            res.status(400).json({
                status: 'error',
                errors: [
                    {
                      "message": "Invalid AF",
                                         }
                  ],
               notes: 'Trigger Fields are Missing',
              
            })  
        }
        
        
        
        if(n ==0) {
            res.status(200).json({
                "data": []          
            })
        } 
        else if(n==1)  
        {
            await fetchRssFeedOnly1(myFeedUrl2)
            .then(data => {
                res.status(200).json(data)
            })
            .catch(err => {
                res.status(500).json({
                    status: "error, search Catergory was: " + searchCategory, 
                    message: 'An error occured when fetching your data. IFTTT-Service-Key:' + serviceKey,
                    feed_url: myFeedUrl2
                })
            })

        }
        else 
        {
        
            await fetchRssFeed(myFeedUrl2)
                .then(data => {
                    res.status(200).json(data)
                })
                .catch(err => {
                    res.status(500).json({
                        status: "error, search Catergory was: " + searchCategory, 
                        message: 'An error occured when fetching your data. IFTTT-Service-Key:' + serviceKey,
                        feed_url: myFeedUrl2
                    })
                })
        }
    }

    else
    {
        res.status(401).json({
            status: 'error',
            errors: [
                {
                  "message": "Invalid AF",
                  "rando element": [
                    "Data Value 1'",
                    "Data Value 2'"
                  ],
                  "internal_message": "Ifttt::Protocol::AuthorizationError: Invalid IFTTT-Channel-Key"
                }
              ],
           notes: 'Invalid Service key ' + IFTTT_SERVICE_KEY + " == " + serviceKey,
           feed_url: myFeedUrl2
        })  

    }
})

app.post('/ifttt/v1/triggers/news_article_from_section/:searchCategory', async (req, res) => {
    const searchCategory = req.params.searchCategory.toLowerCase()
    
    //Which category did the user pick?
    if(searchCategory == "poltiics")
        feedpt2 = politics
    else if(searchCategory == "business")
        feedpt2 = business
    else if(searchCategory == "national")
        feedpt2 = national
    else if(searchCategory == "entertainment")
        feedpt2 = entertainment
    else if(searchCategory == "sports")
        feedpt2 = sports
    else if(searchCategory == "world")
        feedpt2 = world
    else if(searchCategory == "lifestyle")
        feedpt2 = lifestyle
    else if(searchCategory == "business")
        feedpt2 = business
    else if(searchCategory == "technology")
        feedpt2 = business
    else if(searchCategory == "opinions")
        feedpt2 = business
    else 
        feedpt2 = all
    
    //Building the correct feed
    var myFeedUrl2 = feedpt1 + feedpt2 + ".xml"
    
    //Check the if the Service Key is valid
    var serviceKey = req.header("IFTTT-Service-Key");
    if (serviceKey === IFTTT_SERVICE_KEY) {
       await fetchRssFeed(myFeedUrl2)
            .then(data => {
            res.status(200).json(data)
            })
            .catch(err => {
                res.status(500).json({
                    status: "error",
                    message: 'An error occured when fetching your data' + IFTTT_SERVICE_KEY,
                    feed_url: myFeedUrl2
                })
            })
    }
    else {
        res.status(401).json({
            status: 'error',
            message: 'Invalid Service key',
            feed_url: myFeedUrl2
        })  
    }
})
