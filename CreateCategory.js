'use strict';

const doc = require('dynamodb-doc');
const dynamodb = new doc.DynamoDB();

exports.handler = (input, context, callback) => {
  console.log('Received input:', JSON.stringify(input, null, 2));
  if (input.fail_create_category) {
    callback("Internal Server Error");
  } else {
  
    var categories = input.product.categories;
    
    console.log("input " + input);
    console.log("idproduct " + input.CreateBasicProductResult.idproduct);
    console.log("idcustomer " + input.idcustomer);
    console.log("categories " + categories.length);
    
    var i;
    var idsCategories = [];
    var idsProductsByCategory = [];
    for(i = 0; i < categories.length; i++){
        
        console.log("creating categories[" + (i+1) + "]");
        console.log("creating categories[name] = ["+categories[i].name+"]");
        console.log("creating categories[description] = ["+categories[i].description+"]");
        
        var day = new Date();
        var idCategory = day.getMilliseconds();  
            
        let reqCategory = {
            TableName: "Category",
            Item: { 
                ID          : idCategory,
                name        : categories[i].name,
                description : categories[i].description,
                statep      : 'CREATED',
                idproduct   : input.CreateBasicProductResult.idproduct,
                createdBy   : input.idcustomer,
                createTime  : new Date().toLocaleString()
            }
        }
        
        idsCategories.push(idCategory);
        
        day = new Date();
        var idProductByCategory = day.getMilliseconds();
        
        dynamodb.putItem(reqCategory, function(err, data) {
          if (err) console.log(err);
          else console.log(data);
        });
        
        console.log("creating productbycategory idproduct = ["+input.CreateBasicProductResult.idproduct+"]");
        console.log("creating productbycategory idcategory = ["+idCategory+"]");
        
        let reqProductByCategory = {
            TableName: "ProductByCategory",
            Item: { 
                ID          : idProductByCategory,
                idproduct   : input.CreateBasicProductResult.idproduct,
                idcategory  : idCategory,
                createTime  : new Date().toLocaleString()
            }
        }
        
        idsProductsByCategory.push(idProductByCategory);
        
        dynamodb.putItem(reqProductByCategory, function(err, data) {
          if (err) console.log(err);
          else console.log(data);
        });
        
    }
            
    var parameters = { 
        "idproduct": input.CreateBasicProductResult.idproduct,
        "idscategories": idsCategories,
        "idsproductbycategories": idsProductsByCategory
    }
    
    console.log("callback parameters = ["+JSON.stringify(parameters,null,2)+"]");

    callback(null, parameters);
    
  }
};