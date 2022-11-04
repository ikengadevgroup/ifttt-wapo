//Washington Post RSS API for IFTTT

//Initializing Entry point and testing API
var IFTTT_SERVICE_KEY = "-MRtrOGdwn39dcuvKTLnaIA_eaMepmDU1Bruynoy0cjx9IaVrkQ6WYRDYfKjl_eu"
const express = require('express')
//const res = require('express/lib/response')
const app = express()



app.get('/api/ping', (req,res) => {
    var response = { answer: "pong" }
    res.status(200).json(response)
})

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})

const myFeedUrl = 'http://feeds.washingtonpost.com/rss/politics?itid=lk_inline_manual_2'




////////////////////////////////// Fast RSS Parser //////////////////////////////////////////////////////////

var parser3 = require('rssparser2');
var options = {};
//rss feeds
/*parser3.parseURL('http://laymansite.com/feed', options, function(err, out){
	console.log(out);
});
*/

////////////////////////////// End Fast Parser /////////////////////////////////////////////////////////////

//////////////////////////////////////// Original RSS Parser /////////////////////////////////////////////////

//Configuring RSS-Parser Package
let Parser = require('rss-parser')

//let parser = new Parser();

let parser = new Parser({
    headers: { 'User-Agent': 'Chrome' }
});



//This function is supposed ot read the RSS Feed
async function fetchRssFeed(feedUrl) {
    let feed = await parser.parseURL(feedUrl);
    /*

    let feed = await parser3.parseURL(feedUrl, options, function(err, out){
        console.log(out);
    });
    */
	return feed.items.map(item => {
        return {
            title: item.title,
            link: item.link,
            date: item.pubDate
        }
    });
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
    var myFeedUrl2 = ""
    var serviceKey = req.header("IFTTT-Service-Key");
    if (serviceKey == IFTTT_SERVICE_KEY) {
        if(searchCategory == "technology"){
            myFeedUrl2 = "http://feeds.washingtonpost.com/rss/business/" + searchCategory    
        }
        else{
            myFeedUrl2 = "http://feeds.washingtonpost.com/rss/" + searchCategory
        }   
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
            message: 'Invalid Service key'
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
    
    var Tfs = req.header('triggerFeilds');
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
                message: 'An error occured when fetching your data - Tfs' + Tfs
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
           notes: 'Invalid Service key ' + IFTTT_SERVICE_KEY + " == " + serviceKey + " // " + Tfs
        })  
    }

})



app.post('/ifttt/v1/triggers/news_article_from_section/', async (req, res) => {
    var searchCategory = req.header("section");
    var myFeedUrl2 = ""
    var serviceKey = req.header("IFTTT-Service-Key");
    if (serviceKey === IFTTT_SERVICE_KEY) {
               
        if(searchCategory == "technology"){
            myFeedUrl2 = "http://feeds.washingtonpost.com/rss/business/" + searchCategory    
        }
        else{
            myFeedUrl2 = "http://feeds.washingtonpost.com/rss/" + searchCategory + " == " + serviceKey
        }   
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

app.post('/ifttt/v1/triggers/news_article_from_section/:searchCategory', async (req, res) => {
    const searchCategory = req.params.searchCategory.toLowerCase()
    var myFeedUrl2 = ""
    var serviceKey = req.header("IFTTT-Service-Key");
    if (serviceKey === IFTTT_SERVICE_KEY) {
        if(searchCategory == "Technology"){
            myFeedUrl2 = "http://feeds.washingtonpost.com/rss/business/" + searchCategory    
        }
        else{
            myFeedUrl2 = "http://feeds.washingtonpost.com/rss/" + searchCategory
        }   
        await fetchRssFeed(myFeedUrl2)
            .then(data => {
            res.status(200).json(data)
            })
            .catch(err => {
                res.status(500).json({
                    status: "error",
                    message: 'An error occured when fetching your data' + IFTTT_SERVICE_KEY
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

