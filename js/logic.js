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
    return distances[a.length][b.length];
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
        displayResults(results);
      });
        /*let results = findSimilarProducts(json, query);

        // Display the search results
        displayResults(results);*/
      });
  }
  
  function displayResults(results, query) {
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
  
  function trigger() {
    var searchQuery = $('#search-input').val();
    search(searchQuery)
  }

  function findSimilarProducts(jsonArray, query, synonyms) {
    // Split the query into an array of individual words
    let queryWords = query.trim().split(' ');
            for (let queryWord of queryWords) {
                for (const synonym of synonyms) {
                    // If the current synonym matches the word, add it to the matched synonyms string
                    if (levenshtein(synonym.synonym.toLowerCase(), queryWord.toLowerCase()) <= 2) {
                        query = synonym.skuName + ' ' + query;
                    }
                }
            }
            queryWords = query.trim().split(' ');
    //console.log(queryWords);

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

                // If the distance is less than or equal to 2 (arbitrary threshold), consider the words a match
                if (dist <= 2) {
                  
                    // Add the distance to the total distance
                    totalDistance = Math.min(dist, totalDistance);

                    // Set the flag to indicate that a match was found
                    foundMatch = true;
                    //console.log(dist + ' ' + queryWord + ' ' + cat4LowerWord + ' ' + foundMatch);
                    matchingProducts.push(product);
                    break;
                }
            }

            // If no match was found for the current query word, set the flag to indicate that the product is not a match
            if (!foundMatch) {
                isMatch = false;
                break;
            }
        }

        // If the product is a match, add it to the list of matching products
        if (isMatch) {
          //alert(product);
            // Add the total distance as a property of the product object
            product.totalDistance = totalDistance;
            matchingProducts.push(product);
            //console.log(product);
        }
    }

    // Sort the matching products by their total distance from the query
    matchingProducts.sort((a, b) => a.totalDistance - b.totalDistance);

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