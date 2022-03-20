const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

const API_KEY = 'API_KEY_TEST'

router.post('/', (req, res) => {
    const params = req.body;

    var currentDate = new Date();
    if (params.start > currentDate.getTime() || 
        params.end > currentDate.getTime()) {
            res.status(400).send;   // 400 (Bad Request)
    }

    const getBrandsData = {
        'id': 1,
        'method': 'socialinsider_api.get_brands',
        'params': {
            'projectname': 'API_test'
        }
    };

    let table = [];

    fetch('https://app.socialinsider.io/api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + API_KEY
        },
        body: JSON.stringify(getBrandsData),
    })
    .then(response => response.json())
    .then(data => {
            var nrBrands = 0;
            data.result.forEach( (e) => {
                var tableEntry = {
                    'brandName': e.brandname,
                    'totalProfiles': e.profiles.length,
                    'totalFans': 0,
                    'totalEngagement': 0
                };
                var nrProfiles = 0;
                e.profiles.forEach( (profile) => {
                    let profileBody = {
                        "id" : 1,
                        "method" : "socialinsider_api.get_profile_data",
                        "params":{
                            "id": profile.id,
                            "profile_type": profile.profile_type,
                            "date": {
                                "start": params.start,
                                "end": params.end,
                                "timezone": "Europe/London"
                            }
                        }
                    }

                    fetch('https://app.socialinsider.io/api', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + API_KEY
                        },
                        body: JSON.stringify(profileBody),
                    })
                    .then(response => response.json())
                    .then(profileData => {
                        let profileFans = 0;
                        Object.values(profileData.resp[profile.id]).forEach( (p) => {
                            tableEntry.totalEngagement += p.engagement ? p.engagement : 0;
                            profileFans = p.fans ? p.fans : profileFans;                            
                        });
                        tableEntry.totalFans = profileFans;     // keep number of fans from the last day of the interval

                        /*
                            nrProfiles and nrBrands are counters for returning
                            the table data when all the profiles have been processed
                        */
                        nrProfiles++;
                        if (nrProfiles == e.profiles.length) {
                            nrBrands++;
                            table.push(tableEntry);
                            if (nrBrands == data.result.length) {
                                res.send(table);
                            }
                        }
                    })
                    .catch(error => console.error('Error get_profile_data:', error))
                });
            });
        })
    .catch(error => console.error('Error get_brands:', error))
});

module.exports = router;