// Make a GET request to the server to fetch todo data endpoint
fetch("api/todo")
    // Parse the JSON response
    .then(response => response.json())
    .then(data => {
        // console.log("Data received from server:", data);

        document.getElementById("todo-list").textContent = JSON.stringify(data, null, 2);
    })
    .catch(error => {
        console.error("Error fetching todo data:", error);
    });