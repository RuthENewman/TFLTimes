const corsProxy = "https://cors-anywhere.herokuapp.com/";
const baseCodeURL = "https://api.tfl.gov.uk/journey/journeyresults";
const baseRoutesURL = "https://api.tfl.gov.uk/journey/journeyresults/";

const fromDestinationInput = document.getElementById('from');
const toDestinationInput = document.getElementById('to');
const formSubmitButton = document.getElementById('click');
const showJourneysDiv = document.querySelector('.showJourneys');
const tempMessageDiv = document.querySelector('.tempMessage');

function getCodes(from, to) {
  tempMessageDiv.style.display = 'block';
  fetch(`${corsProxy}${baseCodeURL}/${from}/to/${to}`)
    .then(response => response.json())
    .then(data => {
      getRoute(data.fromLocationDisambiguation.disambiguationOptions[0].parameterValue, data.toLocationDisambiguation.disambiguationOptions[0].parameterValue)
        tempMessageDiv.style.display = 'none';
      })
}

function getRoute(fromDestination,toDestination) {
  let routeURL = `${corsProxy}${baseRoutesURL}${fromDestination}/to/${toDestination}`;
  fetch(routeURL)
    .then(response => response.json())
    .then(data => {
      data.journeys.forEach(journey => {
        showJourneysDiv.innerHTML += `
        <div class="journeyDetails" id=${journey.startDateTime}>
        <h3 class="journeyDetailsHeader">Journey option</h3>
        <h4 class="journeyDetailsHeading">Date: <span>${journey.startDateTime.slice(8,10)}</span> / <span>${journey.startDateTime.slice(5,7)}</span> / <span>${journey.startDateTime.slice(0,4)}</span></h4>
        <h4 class="journeyDetailsHeading">Start time: <span>${journey.startDateTime.slice(11,16)}</span></h4>
        <h4 class="journeyDetailsHeading">Arrival time: <span>${journey.arrivalDateTime.slice(11,16)}</span></h4>
        <h4 class="journeyDetailsHeading">Duration: <span>${journey.duration} minutes</span></h4>
        </div>
        `;
        journey.legs.forEach(leg => {
          document.getElementById(`${journey.startDateTime}`).innerHTML += `
            <div class="leg">
              <h5 class="legHeading">Leg</h5>
              <h5>Departure point: <span>${leg.departurePoint.commonName}</span></h5>
              <h5>Arrival point: <span>${leg.arrivalPoint.commonName}</span></h5>
              <h5>Duration: <span>${leg.duration}</span> minutes</h5>
              <h5>Mode: <span>${leg.mode.name}</span></h5>
              <h5>Line: <span>${leg.routeOptions[0].name}</h5>
            </div>
          `;
        })
      });
    })
}


formSubmitButton.addEventListener('click', event => {
  event.preventDefault();
  getCodes(fromDestinationInput.value.toLowerCase(), toDestinationInput.value.toLowerCase())
})
