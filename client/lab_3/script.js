/* eslint-disable max-len */
/*
  Welcome to Javascript!

  This file contains parts of a simple script to make your carousel work.
  Please feel free to edit away - the main version of this with all the notes is safely stored elsewhere
*/
/* eslint-enable max-len */
// set our first slide's position to "0", the opening position in an array
slidePosition = 0;

// gather a reference to every slide we're using via the class name and querySelectorAll
slides = document.querySelectorAll('.carousel_item');

// change that "NodeList" into a Javascript "array", to get access to "array methods"
slidesArray = Array.from(slides);

// Figure out how many slides we have available
totalSlides = slidesArray.length;

function updateSlidePosition() {
  // Using the .forEach array method, (array.forEach((element) => { per-element work goes here }))
  // loop through all the slides in your slideArray
  // and remove the 'visible' class from each classList
  // then add a class 'hidden' to all of them
  slidesArray.forEach((slide) => {
    slide.classList.remove('visible');
    slide.classList.add('hidden');
  });

  slidesArray[slidePosition].classList.add('visible');

  // outside your .forEach,
  // add a 'visible' class to the slide at the current slidePosition in slides
}

function moveToNextSlide() {
  /* check what current slide is against total slide array.
  Then get the next image and change the current slide to it.
  If at the last image and there is no next image, then go to first image */
  if (slidePosition === totalSlides - 1) {
    slidePosition = 0;
  } else { 
    slidePosition = slidePosition + 1;
  }
  /*
    add an if statement here that checks
    if you're already at the max number of slides
    and if so, sets your slidePosition to the first index of an array
    if not, set the slidePosition to the current position plus one
  */
  updateSlidePosition(); // this is how you call a function within a function
}
function moveToPrevSlide() {
  // add your code in here for when you click the "prev" button
  if (slidePosition === 0) {
    slidePosition = totalSlides - 1;
  } else {
    slidePosition = slidePosition - 1;
  }
  /*
    add an if statement here that checks
    if you're already at the first index position for an array
    and if so, sets your slidePosition to the last slide position in totalSlides
    if not, set the slidePosition to the current position minus one
  */
  updateSlidePosition();
}

/*
  These two functions have been assigned via "addEventListener"
  to the elements accessed by the "querySelector" set to the class name on each
*/
document.querySelector('.next') // Get the appropriate element (<button class="next">)
  .addEventListener('click', () => { // set an event listener on it - when it's clicked, do this callback function
    console.log('clicked next'), // let's tell the client console we made it to this point in the script
    moveToNextSlide(); // call the function above to handle this
  });

document.querySelector('.prev')
  .addEventListener('click', () =>  {
    //console.log('clicked prev');
    moveToPrevSlide();
  });