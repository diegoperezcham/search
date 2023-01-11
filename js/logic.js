function levenshtein(a, b) {
    // Create a two-dimensional array to store the distances
    var distances = [];
    for (var i = 0; i <= a.length; i++) {
      distances[i] = [];
      for (var j = 0; j <= b.length; j++) {
        distances[i][j] = 0;
      }
    }
  
    // Initialize the first row and column of the distances array
    for (var i = 0; i <= a.length; i++) {
      distances[i][0] = i;
    }
    for (var j = 0; j <= b.length; j++) {
      distances[0][j] = j;
    }
  
    // Calculate the distances
    for (var j = 1; j <= b.length; j++) {
      for (var i = 1; i <= a.length; i++) {
        if (a[i - 1] == b[j - 1]) {
          distances[i][j] = distances[i - 1][j - 1];
        } else {
          distances[i][j] = Math.min(
            distances[i - 1][j] + 1,
            distances[i][j - 1] + 1,
            distances[i - 1][j - 1] + 1
          );
        }
      }
    }
  
    // Return the distance between the two strings
    let x = 0;
    if (b.substr(0, a.length)===a)x=-4
    return distances[a.length][b.length]+x;
  }

  function search(query) {
    if (query===""){
      displayResults([]);
      return;
    }
    fetch('js/data.json')
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {

        fetch('js/synonyms.json')
        .then(function(response) {
        return response.json();
      })
      .then(function(synonyms) {
        let results = findSimilarProducts(json, query, synonyms);
        
        // Display the search results
        displayResults(removeDuplicates(results));
      });
        /*let results = findSimilarProducts(json, query);

        // Display the search results
        displayResults(results);*/
      });
  }
  
  /*function displayResults(results, query) {
    // Clear the previous search results
    $('#search-results').empty();
  
    // Iterate over the results and create the result elements
    results.forEach(function(result) {
      var div = document.createElement('div');
      div.className = 'result';
      div.innerHTML = result.cat4Lower;
      $('#search-results').append(div);
    });
  }
  
  function displayResults(products) {
    // Get the element to display the results
    const resultsElement = document.getElementById('#search-results');
  
    // Clear the results element
    //resultsElement.innerHTML = '';
    $('#search-results').empty();

    // Iterate through the products
    for (const product of products) {
      // Create a list item for the product
      const productElement = document.createElement('div');
  
      // Set the onclick attribute to open the URL
      productElement.onclick = () => {
        window.open(`https://undostres.com.mx/?product_type=${product.cat2}`, '_blank');
      };
  
      // Set the content of the list item
      productElement.innerHTML = `${product.cat2} - ${product.cat4Lower}`;
  
      // Add the list item to the results element
      //resultsElement.appendChild(productElement);
      productElement.className = 'result';
      $('#search-results').append(productElement);
    }
  }*/

  function displayResults(products) {
    // Get the element to display the results
    const resultsElement = document.getElementById('search-results');
  
    // Clear the results element
    $('#search-results').empty();
  
    // Initialize a variable to store the current category
    let currentCategory = '';
  
    // Iterate through the products
    let i = 0;
    for (const product of products) {
      //print 5 products
      //if (i > 5) 
      //break;

      // Check if the category has changed
      if (product.cat2 !== currentCategory) {
        // If the category has changed, update the current category and insert a new element with the cat2 property
        currentCategory = product.cat2;
        const cat2Element = document.createElement('h2');
        cat2Element.innerHTML = currentCategory;
        resultsElement.appendChild(cat2Element);
        i=0
      }
      //sum +1 5 products
      //i++
  
      // Create a list item for the product
      const productElement = document.createElement('div');
  
      // Set the onclick attribute to open the URL
      productElement.onclick = () => {
        window.open(`https://undostres.com.mx/?product_type=${product.cat2}`, '_blank');
      };
  
      // Create an element for the cat4Lower property
      const cat4LowerElement = document.createElement('div');
      cat4LowerElement.innerHTML = product.cat4Lower;
  
      // Append the elements to the list item
      productElement.appendChild(cat4LowerElement);
  
      // Add the list item to the results element
      productElement.className = 'result';
      //$('#search-results').append(productElement);
      // print 5 per category
      if (i < 5){
        $('#search-results').append(productElement);
      }
      // sum +1 5 per category
      i++
    }
  }
  
  function trigger() {
    var searchQuery = $('#search-input').val();
    search(searchQuery)
  }

  function removeDuplicates(products) {
    // Create a Set to store the unique sku_id values
    const uniqueIds = new Set();
  
    // Create a new array to store the unique products
    const uniqueProducts = [];
  
    // Iterate through the products
    for (const product of products) {
      // If the sku_id is not in the Set, add it and add the product to the unique products array
      if (!uniqueIds.has(product.cat4Lower)) {
        uniqueIds.add(product.cat4Lower);
        uniqueProducts.push(product);
      }
    }
  
    return uniqueProducts;
  }

  function filterShortWords(words) {
    // Use the Array.filter() method to create a new array with only the words that have a length greater than or equal to 2
    const filteredWords = words.filter(word => word.length >= 2);
  
    return filteredWords;
  }

  function replaceSpecialCharacters(words) {
    // Use the Array.map() method to create a new array with the modified words
    const modifiedWords = words.map(word => {
      // Use a regular expression to replace special characters with their plain counterparts
      return word.replace(/[^\w\s]/gi, '');
    });
  
    return modifiedWords;
  }

  function findSimilarProducts(jsonArray, query, synonyms) {
    //query = query.replace("san luis potosi", "san-luis-potosi")
    // Split the query into an array of individual words
    //console.log(query);
    let queryWords = query.trim().split(' ');
    //queryWords = replaceSpecialCharacters(queryWords);
            for (let queryWord of queryWords) {
                for (const synonym of synonyms) {
                    // If the current synonym matches the word, add it to the matched synonyms string
                    if (levenshtein(synonym.synonym.toLowerCase().replace(/[^\w\s]/gi, ''), queryWord.toLowerCase().replace(/[^\w\s]/gi, '')) <= 1) {
                        query = synonym.skuName + ' ' + query;
                    }
                }
            }
            queryWords = query.trim().split(' ');
            queryWords = filterShortWords(queryWords);
    console.log(queryWords);

    // Create an empty list to store the matching products
    const matchingProducts = [];

    // Iterate through the JSON array
    for (const product of jsonArray) {
        // Split the cat4Lower property into an array of individual words
        const cat4LowerWords = product.cat4Lower.split(' ');

        // Initialize a flag to track whether the product is a match
        let isMatch = true;

        // Initialize a variable to keep track of the total Levenshtein distance for the product
        let totalDistance = 1000;

        //console.log(cat4LowerWords);
        // Iterate through each word in the query
        for (const queryWord of queryWords) {
            // Initialize a flag to track whether the current query word has a matching word in the cat4Lower property
            let foundMatch = false;
            

            // Iterate through each word in the cat4Lower property
            for (const cat4LowerWord of cat4LowerWords) {
                // Remove special characters and convert both words to lowercase
                let queryWordClean = queryWord.replace(/[^\w\s]/gi, '').toLowerCase();
                const cat4LowerWordClean = cat4LowerWord.replace(/[^\w\s]/gi, '').toLowerCase();

                // Calculate the Levenshtein distance between the query word and the cat4Lower word
                const dist = levenshtein(queryWordClean, cat4LowerWordClean);
                //if(queryWordClean === 'wallet' && cat4LowerWordClean === 'wallet') alert(dist);

                // If the distance is less than or equal to 4 (arbitrary threshold), consider the words a match
                if (dist <= 4) {
                  
                    // Add the distance to the total distance
                    totalDistance = Math.min(dist, totalDistance);

                    // Set the flag to indicate that a match was found
                    foundMatch = true;
                    product.totalDistance = totalDistance;
                    if(product.cat2 === ""){
                      product.cat2="Sin categoría"
                    }
                    //console.log(dist + ' ' + queryWord + ' ' + cat4LowerWord + ' ' + foundMatch);
                    matchingProducts.push(product);
                    //break;
                    
                }
            }

            // If no match was found for the current query word, set the flag to indicate that the product is not a match
            if (!foundMatch) {
                isMatch = false;
                //break;
            }
        }

        // If the product is a match, add it to the list of matching products
        if (isMatch) {
          //alert(product);
            // Add the total distance as a property of the product object
            product.totalDistance = totalDistance;
            if(product.cat2 === ""){
              product.cat2="Sin categoría"
            }
            matchingProducts.push(product);
            //console.log(product);
        }
    }

    // Sort the matching products by their total distance from the query
    matchingProducts.sort((a, b) => a.totalDistance - b.totalDistance);

    // sort priority product
    matchingProducts.sort((a, b) => parseInt(a.priority_product) - parseInt(b.priority_product));

    // sort priority category
    matchingProducts.sort((a, b) => parseInt(a.priority_category) - parseInt(b.priority_category));

    return matchingProducts;
}

function findSynonyms(word, synonymList) {
  // Initialize a string to store the matched synonyms
  let matchedSynonyms = '';

  // Iterate through the synonym list to find synonyms of the word
  for (const synonym of synonymList) {
    // If the current synonym matches the word, add it to the matched synonyms string
    if (synonym.synonym.toLowerCase() === word.toLowerCase()) {
      matchedSynonyms += synonym.skuName + ' ';
    }
  }

  return matchedSynonyms.trim();
}