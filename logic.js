function levenshteinDistance(a, b) {
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
    fetch('data.json')
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        // Filter the JSON data based on the search query
        var results = json.filter(function(item) {
          return item.name.includes(query);
        });
  
        // Display the search results
        displayResults(results);
      });
  }
  
  function displayResults(results) {
    // Clear the previous search results
    $('#search-results').empty();
  
    // Iterate over the results and create the result elements
    results.forEach(function(result) {
      var div = document.createElement('div');
      div.className = 'result';
      div.innerHTML = result.name;
      $('#search-results').append(div);
    });
  }
  
  $('form').on('submit', function(e) {
    e.preventDefault();
    var searchQuery = $('#search-input').val();
    search(searchQuery);
  })  