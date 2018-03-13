'use strict';

const doc = require('dynamodb-doc');
const dynamodb = new doc.DynamoDB();

exports.handler = (input, context, callback) => {
  console.log('Received input:', JSON.stringify(input, null, 2));
  if (input.fail_create_image) {
    console.log("ERROR " + input.fail_create_image);  
    callback("Internal Server Error");
  } else {
    var day = new Date();
    var n = day.getMilliseconds();  
    
    var images = input.product.images;
    
    console.log("ID " + n);
    console.log("input " + input);
    console.log("images " + images.length);
    
    var i;
    
    var idsImages = [];
    for(i = 0; i < images.length; i++){
        
        console.log("creating image[" + (i+1) + "]");
        console.log("creating image[name] = ["+images[i].name+"]");
        console.log("creating image[path] = ["+images[i].path+"]");
            
        let req = {
            TableName: "ImageByProduct",
            Item: { 
                ID          : n,
                name        : images[i].name,
                path        : images[i].path,
                idproduct   : input.CreateBasicProductResult.idproduct,
                createTime  : day.toLocaleString()
            }
        }
        
        idsImages.push(n);
        
        dynamodb.putItem(req, function(err, data) {
          if (err) console.log(err);
          else console.log(data);
        });
        
        day = new Date();
        n = day.getMilliseconds();
        
    }
            
    var parameters = { 
        "idproduct": input.CreateBasicProductResult.idproduct,
        "idsimages": idsImages
    }
    
    console.log("callback parameters = ["+JSON.stringify(parameters,null,2)+"]");
    
    callback(null, parameters);
    
  }
};