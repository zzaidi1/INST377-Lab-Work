function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

async function getData(url) {
  const request = await fetch(url);
  const json = await request.json();
  return json.data;
}

async function handleButtonClick(event) {
  console.log('clicked button', event.target);
  console.log('button value', event.target.value);
  const inputField = document.querySelector('#inputField');
  const url = '/api/dining';
  const request = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ /* FORM VALUES */ })
  });
  console.log('resolved request', request);
  const result = await request.json();
  console.log(result);

  // do something with a result here
}

async function windowActions() {
  console.log('loaded window');
  const allMediaRequest = await getData('/api/media');
  const allMedia = await allMediaRequest.json();
  
  allMedia.forEach((element) => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${element.title}</td>
        <td>${element.genre_name}</td>
        <td>${element.rating_description}</td>
        <td>${element.studio_name}</td>
        <td>${element.year}</td>
        <td>${element.total_invoices}</td>
        `;
    body.append(row);
  });
}

window.onload = windowActions;