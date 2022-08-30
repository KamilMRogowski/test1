const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
const heorkuPort = process.env.PORT;
const localPort = 3000;
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
    const email = req.body.email;
    const first = req.body.first;
    const last = req.body.last;

    //new json formatted object, using tag names from mailchimp
    const data = {
        members: [
            {
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: first,
                LNAME: last
            }}]};
    //cast json as short string
    const jsonData = JSON.stringify(data);

    const audienceId = "902ea68b6e";
    const url = "https://us13.api.mailchimp.com/3.0/lists/" + audienceId; 
    
    //options for https request
    const options = {
        method: "POST",
        headers: {
            authorization:"kamil: 24fba3c1c8f6fa50b94ab66cec1b4707-us13"
        }
        } 

// to save data we want to send it needs to be saved as constant
    const request = https.request(url, options, (httpsres) => {
        if (httpsres.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/fail.html");
        }
        //parse data to console to check if its working
        httpsres.on("data", (data) => {
            console.log(JSON.parse(data));
        });
    });
    //send files to mailchimp
    //request.write(jsonData);
    //signal that you ended sending
    request.end();
});

app.post("/failure", (req, res) => {
    res.redirect("/");
})

app.listen(heorkuPort || localPort, () => {
    if (heorkuPort) {
        console.log("Server started on port" + heorkuPort);
    } else  {
        console.log("Server started on port" + localPort);
    }   
});

