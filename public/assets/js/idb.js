// Create variable to hold DB connection.
let db;

// Establish a connection to IndexedDB database called 'pizza_hunt' and set it to version 1.
// Variable db stores connected database object when the connection is complete.
// Request variable acts as event listener for the database.
const request = indexedDB.open("pizza_hunt", 1);

// This event will emit if the database version changes (nonexistant to verion 1, v1 to v2, etc.)
request.onupgradeneeded = function (event) {
  // Saves a reference to the database.
  const db = event.target.result;
  // Create an object store (table) called `new_pizza`, set it to have an auto incrementing primary key of sorts.
  db.createObjectStore("new_pizza", { autoIncrement: true });
};

request.onsuccess = function (event) {
  // when db is successfully created with its object store (from onupgradedneeded event above) or simply established a connection, save reference to db in global variable
  db = event.target.result;

  // check if app is online, if yes run uploadPizza() function to send all local db data to api
  if (navigator.onLine) {
    uploadPizza();
  }
};

request.onerror = function (event) {
  // Log error here
  console.log(event.target.errorCode);
};

// This function will be executed if we attempt to submit a new pizza and there's no internet connection.
function saveRecord(record) {
  const transaction = db.transaction(["new_pizza"], "readwrite");

  const pizzaObjectStore = transaction.objectStore("new_pizza");

  // add record to your store with add method.
  pizzaObjectStore.add(record);
}

function uploadPizza() {
  // Open a transaction on your pending db
  const transaction = db.transaction(["new_pizza"], "readwrite");

  // Access your pending object store
  const pizzaObjectStore = transaction.objectStore("new_pizza");

  // Get all records from store and set to a variable
  const getAll = pizzaObjectStore.getAll();

  // Upon a successful .getAll() execution, run this function.
  // After geAll executes successfully, getAll variable will have a .result property that's an array of all the data we retreieved from new_pizza object store.
  getAll.onsuccess = function () {
    // if there was data in indexedDb's store, let's send it to the api server
    if (getAll.result.length > 0) {
      fetch("/api/pizzas", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((serverResponse) => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }

          // Open one more transaction.
          const transaction = db.transaction(["new_pizza"], "readwrite");
          // Access the new_pizza object store.
          const pizzaObjectStore = transaction.objectStore("new_pizza");
          // clear all items in your store
          pizzaObjectStore.clear();

          alert("All saved pizza has been submitted!");
        })
        .catch((err) => {
          // set reference to redirect back here
          console.log(err);
        });
    }
  };
}

// Listen for browser regaining internet connection using the online event.
// If browser comes back online, we exectue the uploadPizza function.
window.addEventListener("online", uploadPizza);
