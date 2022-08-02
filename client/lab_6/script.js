/* eslint-disable max-len */

/*
  Hook this script to index.html
  by adding `<script src="script.js">` just before your closing `</body>` tag
*/

/*
  ## Utility Functions
    Under this comment goes any utility functions you need - like an inclusive random number selector
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
*/

/*
  ## JS and HTML Injection
    There are a bunch of methods to inject text or HTML into a document using JS
    Mainly, they're considered "unsafe" because they can spoof a page pretty easily
    But they're useful for starting to understand how websites work
    the usual ones are element.innerText and element.innerHTML
    Here's an article on the differences if you want to know more:
    https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent#differences_from_innertext
*/
function injectHTML(list) {
  console.log('fired injectHTML');
  const target = document.querySelector('#restaurant_list');
  target.innerHTML = '';
  list.forEach((item) => {
    const str = `<li>${item.name} </li>`;
    target.innerHTML += str;
  });
}

/*
  ## Process Data Separately From Injecting It
    This function should accept your 1,000 records
    then select 15 random records
    and return an object containing only the restaurant's name, category, and geocoded location
    So we can inject them using the HTML injection function

    You can find the column names by carefully looking at your single returned record
    https://data.princegeorgescountymd.gov/Health/Food-Inspection/umjn-t2iz
*/

function processRestaurants(list) {
  console.log('fired restaurants list');
  const range = [...Array(15).keys()]; // Special notation to create an array of 15 elements

  // a Map function is like a forEach, but it returns a new array instead of changing the originals
  const newArray = range.map((m) => { // The Map function applies a function to each element and returns a new element to a new array
    const index = getRandomIntInclusive(0, list.length); // here we're getting a random number between nothing and our total list of restaurants
    return list[index]; // and here we're returning that element to the new array

    /* This method does not guarantee uniqueness, but it is about as simple to follow as is possible */
  });

  // Now that we've made an array, we should return it so we can do things with it somewhere else
  return newArray;
}

/*
  ## Main Event
    Separating your main programming from your side functions will help you organize your thoughts
    When you're not working in a heavily-commented "learning" file, this also is more legible
    If you separate your work, when one piece is complete, you can save it and trust it
*/

async function mainEvent() {
  // the async keyword means we can make API requests
  const form = document.querySelector('.main_form'); // get your main form so you can do JS with it
  const submit = document.querySelector('button[type="submit"]'); // get a reference to your submit button
  submit.style.display = 'none'; // let your submit button disappear

  /*
    Let's get some data from the API - it will take a second or two to load
    This next line goes to the request for 'GET' in the file at /server/routes/foodServiceRoutes.js
    It's at about line 27 - go have a look and see what we're retrieving and sending back.
   */
  const results = await fetch('/api/foodServicesPG');
  const arrayFromJson = await results.json(); // here is where we get the data from our request as JSON

  /*
    Here we log out a table of all the results using "dot notation"
    An alternate notation would be "bracket notation" - arrayFromJson["data"]
    Dot notation is preferred in JS unless you have a good reason to use brackets
    The 'data' key, which we set at line 38 in foodServiceRoutes.js, contains all 1,000 records we need
  */
  console.table(arrayFromJson.data);

  // try expanding this object in your browser console to see what fields are available for display
  console.log(arrayFromJson.data[0]);

  // this is called "string interpolation" and is how we build large text blocks with variables
  console.log(`${arrayFromJson.data[0].name} ${arrayFromJson.data[0].category}`);

  // This IF statement ensures we can't do anything if we don't have information yet
  if (arrayFromJson.data?.length > 0) { // the question mark in this means "if this is set at all"
    submit.style.display = 'block'; // let's turn the submit button back on by setting it to display as a block when we have data available

    // And here's an eventListener! It's listening for a "submit" button specifically being clicked
    // this is a synchronous event event, because we already did our async request above, and waited for it to resolve
    form.addEventListener('submit', (submitEvent) => {
      // This is needed to stop our page from changing to a new URL even though it heard a GET request
      submitEvent.preventDefault();

      // This constant will have the value of your 15-restaurant collection when it processes
      const restaurantList = processRestaurants(arrayFromJson.data);

      // And this function call will perform the "side effect" of injecting the HTML list for you
      injectHTML(restaurantList);

      // By separating the functions, we open the possibility of regenerating the list
      // without having to retrieve fresh data every time
      // We also have access to some form values, so we could filter the list based on name
    });
  }
}

/*
  This last line actually runs first!
  It's calling the 'mainEvent' function at line 57
  It runs first because the listener is set to when your HTML content has loaded
*/
document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests
