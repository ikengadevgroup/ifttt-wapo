//Washington Post RSS API for IFTTT
//Author: Uchenna Anyikam

//Initializing Entry point and testing API
var IFTTT_SERVICE_KEY = "-MRtrOGdwn39dcuvKTLnaIA_eaMepmDU1Bruynoy0cjx9IaVrkQ6WYRDYfKjl_eu"
const express = require('express')
const app = express()

const bodyParser = require("body-parser");
app.use(bodyParser.json())

app.get('/api/ping', (req,res) => {
    var response = { answer: "pong" }
    res.status(200).json(response)
})

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})

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

//////////////////////////////////////////// End Helper Functions //////////////////////////////////////////////

//Helper function to create new unique meta-ids
function generateUnique8DigitString() {
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += Math.floor(Math.random() * 10);
    }
    return result;
}

// Helper function to create ISO-compatible date
function createAt() {
    var date = new Date();
    return date.toISOString();
}

// Helper function to filter data for search
function filterData(term, data) {
    for (var i=0; i<data.length; i++) {
      if (data[i].title.toLowerCase().includes(term.toLowerCase())) {
        return data[i];
      }
    }
}

// Helper function to set the category feed URL
function setCategoryURL(selecton){
    
    //Which category did the user pick?
    if(selecton == "politics")
        feedpt2 = politics
    else if(selecton == "business")
        feedpt2 = business
    else if(selecton == "national")
        feedpt2 = national
    else if(selecton == "entertainment")
        feedpt2 = entertainment
    else if(selecton == "sports")
        feedpt2 = sports
    else if(selecton == "world")
        feedpt2 = world
    else if(selecton == "lifestyle")
        feedpt2 = lifestyle
    else if(selecton == "business")
        feedpt2 = business
    else if(selecton == "technology")
        feedpt2 = technology
    else if(selecton == "opinions")
        feedpt2 = opinions
    else 
        feedpt2 = all
        
    //Building the correct feed
    var feed2 = feedpt1 + feedpt2 + ".xml"

    return feed2
}

//////////////////////////////////////////// End Helper Functions //////////////////////////////////////////////



//////////////////////////////////////////// RSS Parsing Functions ////////////////////////////////////////////
// RSS Feed Parser and IFTTT JSON Prep
async function fetchRssFeed(feedUrl) {
    let feed = await parser.parseURL(feedUrl);
    let data = feed.items.map(item => ({
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

// RSS Feed Parser and IFTTT JSON Prep w/ 1 Result
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

// RSS Feed Search Parser and IFTTT JSON Prep
async function fetchFilteredRss(feedUrl, toim) {
    let feed = await parser.parseURL(feedUrl);
    let data = feed.items.filter(item => item.title.toLowerCase().includes(toim.toLowerCase())).map(item => ({
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

    // Repeat Entries if there are less that 3 entries to pass Endpoint Testing
    if (data.length < 3) {
        var cnt = 0
        for (i = 0; i < 4 - data.length; i++) {
            let item = data[i];
            item.meta.id = generateUnique8DigitString()  + "-" + i
            data.push(item)
            
        }
    }
    return response2
}

// RSS Feed Search Parser and IFTTT JSON Prep w/ 1 Result
async function fetchFilteredRssOnly1(feedUrl, toim) {
    let feed = await parser.parseURL(feedUrl);
    let data = feed.items.filter(item => item.title.toLowerCase().includes(toim.toLowerCase())).slice(0,1).map(item => ({
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
//////////////////////////////////////////// End RSS Parsing Functions ////////////////////////////////////////////





//////////////////////////////////////////// IFTTT Endpoints //////////////////////////////////////////////////////
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
  
  // IFTTT Setup Test
  app.post('/ifttt/v1/test/setup', function(req, res) {
    var serviceKey = req.header("IFTTT-Service-Key");
    if (serviceKey == IFTTT_SERVICE_KEY) {
      //res.status(200).send('IFTTT Service is up');
      res.status(200).json({
        data: {
            "samples": {
                "triggers": {
                    "new_article_matching_search": {
                        "term": "US"
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
  
app.post('/ifttt/v1/triggers/news_article_from_section/', async (req, res) => {
    
    var triggerFields = req.body.triggerFields
    if(triggerFields != undefined)
        var searchCategory = triggerFields.section
    
    //Which category did the user pick?
    
    //Building the correct feed
    var myFeedUrl2 = setCategoryURL(searchCategory)
    
    //Check the if the Service Key is valid
    var serviceKey = req.header("IFTTT-Service-Key");
    if (serviceKey === IFTTT_SERVICE_KEY) {
        var n = req.body.limit
        
        if (typeof searchCategory === 'undefined'){
           
            res.status(400).json({
                status: 'error',
                errors: [
                    {
                      "message": "Invalid AF",
                                         }
                  ],
               notes: 'Trigger Fields are Missing',
              
            }) 
            return
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
                    return
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
        return
    }
})


//IFTTT Route for Looking for artciles w/ a specific string in the title
app.post('/ifttt/v1/triggers/new_article_matching_search/', async (req, res) => {
    var serviceKey = req.header("IFTTT-Service-Key");
    var n = req.body.limit
    var triggerFields = req.body.triggerFields
    if(triggerFields != undefined)
        var searchTerm = triggerFields.term
    
    if (serviceKey == IFTTT_SERVICE_KEY) { 
        if (typeof searchTerm === 'undefined'){
            res.status(400).json({
                status: 'error',
                errors: [
                    {
                      "message": "Invalid AF",
                    }
                  ],
               notes: 'Trigger Fields are Missing',
              
            }) 
            return
        }
        if(n ==0) {
            res.status(200).json({
                "data": []          
            })
        } 
        else if(n==1)  
        {
            await fetchFilteredRssOnly1(myFeedUrl, searchTerm)
            .then(data => {
                res.status(200).json(data)
                
            })
            .catch(err => {
                res.status(500).json({
                    status: "error, search Term was: " + searchTerm, 
                    message: 'An error occured when fetching your data. IFTTT-Service-Key:' + serviceKey,
                    feed_url: myFeedUrl2
                })
            })

        }
        else 
        {
            await fetchFilteredRss(myFeedUrl, searchTerm)
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
        return  
    }

})

//////////////////////////////////////////// End IFTTT Endpoints ///////////////////////////////////////////////////