console.log('Running lambda');
const AWS = require('aws-sdk');

let personalizeevents = new AWS.PersonalizeEvents();

// Function to build necesssary params for 
let buildEventParams = (userID, itemID, category, session) => {
  let itemProps = {
    itemId: itemID,
    eventValue: category
  };

  let params = {
    eventList: [ 
      {
        eventType: 'PAGE_VIEW', 
        properties: itemProps,
        sentAt: Date.now()
      },
    ],
    sessionId: session,
    trackingId: process.env.TRACKING_ID,
    userId: userID
  };

  return params;
}

exports.handler = async (event) => {
  console.log('[ANDREAS PERSONALIZE EVENT SENDER] Event being processed');
  let user = event.queryStringParameters.userId;
  let item = event.queryStringParameters.itemId;
  let cat = event.queryStringParameters.category;
  let sessionID = event.queryStringParameters.sessionId;
  console.log('SESSION ID ', sessionID)
  // Params to be sent to Personalize
  let eventParams = buildEventParams(user, item, cat, sessionID);
  
  console.log('[ANDREAS PERSONALIZE EVENT SENDER] Event Params: ', JSON.stringify(eventParams));
  
  console.log('[ANDREAS PERSONALIZE EVENT SENDER] calling putEvents()');
  
  // promise to handle sending event
  const promise = new Promise((resolve, reject) => {

    // calling personalize api
    personalizeevents.putEvents(eventParams, (err, data) => {
      if (err) {
        console.log('[ANDREAS PERSONALIZE EVENT SENDER] ERROR calling putEvents()');
        console.log(err, err.stack);
        reject(Error(err))
      }
      else {
        console.log('[ANDREAS PERSONALIZE EVENT SENDER] Successfully putEvents()');
        console.log(data);
        const response = {
          statusCode: 200,
          body: JSON.stringify('SENT PERSONALIZE EVENT FUCK YA'),
        };
        resolve(response)
      }
    });
  });
  return promise;
};
