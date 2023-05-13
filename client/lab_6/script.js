/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */

/* did that^ because it was getting annoying */
/* took a lot of the comments out becaues they were cluttering things */
/* it is important to remejmber that both max and min are inclusive */
/* maybe it does not make sense but moving the order around made it easier for me to go about it */

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// not entirely sure that this worked the way that I needed it to
function filterList(list, query) {
  const lowerCaseQuery = query.toLowerCase();
  return list.filter((item) => item.name.toLowerCase().includes(lowerCaseQuery));
}

function injectHTML(list) {
  console.log('fired injectHTML')
  const target = document.querySelector('#restaurant_list');
  target.innerHTML = '';
  list.forEach((item, index) => {
    const str = `<li>${item.name}</li>`;
    target.innerHTML += str;
  });
}

/* same funtion from lecture recording */
function cutRestaurantList(list) {
  console.log('fired cut list');
  const range = [...Array(15).keys()];
  return newArray = range.map((item) => {
    const index = getRandomIntInclusive(0, list.length - 1);
    return list[index]
  });
}

async function mainEvent() { // the async keyword means we can make API requests
  // practically everything below this comment is from the lecture recording
  const mainForm = document.querySelector('.main_form');
  const filterButton = document.querySelector('#filter');
  const loadDataButton = document.querySelector('#data_load');
  const generateListButton = document.querySelector('#generate');

  const loadAnimation = document.querySelector('#data_load_animation');
  loadAnimation.style.display = 'none';
  let currentList = [];

  loadDataButton.addEventListener('click', async () => { // async has to be declared on every function that needs to "await" something
    console.log('loading data');
    loadAnimation.style.display = 'inline-block';

    // our get request
    const results = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');

    currentList = await results.json();

    loadAnimation.style.display = 'none';
    console.table(currentList);
  });

  generateListButton.addEventListener('click', () => {
    console.log('generate new list');
    const restaurantsList = cutRestaurantList(currentList);
    console.log(restaurantsList);
    // trying to utilize the injectHTML functioning but I think there are errors in it
    injectHTML(restaurantsList);
  });

  filterButton.addEventListener('click', () => {
    console.log('clicked FilterButton');
    const formData = new FormData(mainForm);
    const formProps = Object.fromEntries(formData);

    console.log(formProps);
    const newList = filterList(currentList, formProps.resto);

    console.log(newList);
    injectHTML(newList);
  });
}

/*
  This last line actually runs first!
  It's calling the 'mainEvent' function at line 57
  It runs first because the listener is set to when your HTML content has loaded
*/

document.addEventListener('DOMContentLoaded', async () => mainEvent());
