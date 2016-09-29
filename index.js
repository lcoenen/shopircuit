'strict mode'

/*
  So I was at the HTML5 meetup about web accessibility in Montreal - 
  that took place at shopify. I saw you guys were looking for an intern, so 
  I started to hack this. It took me around an hour and I was listening to
  conversation.
  
  It's not flawless - I would have used Promise and/or ECMA6 if I had the time,
  but it does the job. Keep in mind that I was really hungry - I didn't
  even took the time to have some pizza you proposed.
  
  There's  a trick in your challenge - you said to buy everything in the store, but 
  in which color? That's why I added a feature - you can now set your prefered color
  in the PREFERED_COLORS variable and he will take that into account. The order is 
  important : if you prefer light blue over dark orange (if that exists) and that both
  are proposed in the shop, he'll choose light blue. If there's none of your favorite
  colors, he'll just take the first variant.
  
*/

var http = require('http'),
    sprintf = require('sprintf');
    
var URL = 'http://shopicruit.myshopify.com/products.json?page=%s';
var PREFERED_COLORS = [];

/*  The system will compute variants in priority if it's in the prefered color */
function findPreferedVariant(variants){

  var i = PREFERED_COLORS.length;
  
  while(i--){
  
    var preferedColor = PREFERED_COLORS[i];
    
    var j = variants.length;
    
    while(j--){
    
      var variant = variants[j]
      
      if(variant.title == preferedColor){
      
        return variant;
      
      }
      
    }
    
  }
  
}

/*  Compute the total price of all clocks & watch on a page */
function computePrice(object){

  var i = object.length,
  totalPrice = 0;
  
  while(i--){
  
    var item = object[i];
    
    if(item.product_type == 'Watch' || item.product_type == 'Clock'){
    
      preferedVariant = findPreferedVariant(item.variants) == undefined? item.variants[0]: preferedVariant;
      
      console.log('preferedVariant', preferedVariant)
      
      totalPrice += Number(preferedVariant.price);
    
    }
    
  }
  
  return totalPrice;

} 


/*  Recursive function, seek the page N, compute the price
    of target items, add it to totalPrice and call cb if it's the last one
*/
function computePage(page, cb, totalPrice){

    console.log('scraping page', page);

    http.get(sprintf(URL, page), function(request){
      
      body = '';
      
      request.on('data', function(chunk) {
      
        body += chunk;
      
      });
      
      request.on('end', function(){
      
        response = JSON.parse(body);
        
        if(!response.products.length) return cb(totalPrice)
        
        var thisPrice = Number(computePrice(response.products));
        
        console.log('Object ', thisPrice)
        
        computePage(++page, cb, totalPrice + thisPrice);
        
      });
      
  });

}

/*
  Starting point
*/
computePage(1, function(total){ console.log('Total', total)}, 0);
