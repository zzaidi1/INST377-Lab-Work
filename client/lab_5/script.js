/*
  Hook this script to index.html
  by adding `<script src="script.js">` just before your closing `</body>` tag
*/

/* A quick filter that will return something based on a matching input */
function filterList(list, query) {
  return list.filter((item) => {
    const lowerCaseName = item.name.toLowerCase();
    const lowerCaseQuery = query.toLowerCase();
    return lowerCaseName.includes(lowerCaseQuery);
  });
  /*
    Using the .filter array method, 
    return a list that is filtered by comparing the item name in lower case
    to the query in lower case
    Ask the TAs if you need help with this
  */
}

async function mainEvent() { // the async keyword means we can make API requests
  const mainForm = document.querySelector('.main_form'); // This class name needs to be set on your form before you can listen for an event on it
  const filterButton = document.querySelector('.filter_button');
  // Add a querySelector that targets your filter button here

  let currentList = []; // this is "scoped" to the main event function
  mainForm.addEventListener('submit', async (submitEvent) => {
    submitEvent.preventDefault();
    console.log('form submission');

    // Basic GET request - this replaces the form Action
    const results = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');

    // This changes the response from the GET into data we can use - an "object"
    currentList = await results.json();

    /*
      This array initially contains all 1,000 records from your request,
      but it will only be defined _after_ the request resolves - any filtering on it before that
      simply won't work.
    */
    console.table(currentList);
  });

  filterButton.addEventListener('click', (event) => {
    console.log('clicked FilterButton');

    const formData = new FormData(mainForm);
    const formProps = Object.fromEntries(formData);

    console.log(formProps);
    const newList = filterList(currentList, formProps.resto);

    console.log(newList);
  });
  /*
    Now that you HAVE a list loaded, write an event listener set to your filter button
    it should use the 'new FormData(target-form)' method to read the contents of your main form
    and the Object.fromEntries() method to convert that data to an object we can work with
    When you have the contents of the form, use the placeholder at line 7
    to write a list filter
    Fire it here and filter for the word "pizza"
    you should get approximately 46 results
  */
}

/*
  This adds an event listener that fires our main event only once our page elements have loaded
  The use of the async keyword means we can "await" events before continuing in our scripts
  In this case, we load some data when the form has submitted
*/
document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests