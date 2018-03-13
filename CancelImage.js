'use strict';

const doc = require('dynamodb-doc');
const dynamodb = new doc.DynamoDB();

exports.handler = (input, context, callback) => {
  console.log('Received input:', JSON.stringify(input, null, 2));
  if (input.fail_cancel_image) {
    console.log("ERROR " + input.fail_create_image);  
    callback("Internal Server Error");
  } else {
   
    var images = input.CreateImageResult.idsimages;
    
    console.log("input " + input);
    console.log("images " + images.length);
    
    var i;

    for(i = 0; i < images.length; i++){
        
        console.log("deleting imageid[" + (i+1) + "]");
        console.log("deleting imageid[i] = ["+images[i]+"]");
            
        let req = {
            TableName: "ImageByProduct",
            Key: { 
                "ID"          : images[i]
            }
        }
        
        dynamodb.deleteItem(req, function(err, data) {
          if (err) console.log(err);
          else console.log(data);
        });
        
    }
            
    var parameters = { 
        "idproduct": input.CreateBasicProductResult.idproduct
    }
    
    console.log("callback parameters = ["+JSON.stringify(parameters,null,2)+"]");
    
    callback(null, parameters);
    
  }
};