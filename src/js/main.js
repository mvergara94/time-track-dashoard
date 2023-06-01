const cardsContainer = document.querySelector('.cards-container');
const buttons = document.querySelectorAll('.timeframe-buttons');
let objetoJSON = null; // Variável para armazenar o JSON após o fetch

// Realizar o fetch do JSON e executar as operações necessárias após obter os dados
fetch('data.json')
  .then(response => response.json())
  .then(json => {
    objetoJSON = json;
    createCards();

    buttons.forEach(button => {
      button.addEventListener('click', handleClick);
    });
  });

// Função para criar os cards
function createCards() {
  objetoJSON.forEach(item => {
    const title = item.title;
    const { currentTime, previousTime } = getTimeFrame(item);
    const cardHTML = createCard(title, currentTime, previousTime);

    const cardElement = document.createElement('div');
    cardElement.dataset.type = `${title}`;
    cardElement.classList.add('card');
    cardElement.innerHTML = cardHTML;
    cardsContainer.appendChild(cardElement);
  });
}

// Função para atualizar os dados dos cards com base no botão clicado
function updateCardData(selectedTimeFrame) {
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, index) => {
    const { currentTime, previousTime } = getTimeFrame(
      objetoJSON[index],
      selectedTimeFrame
    );
    const cardDataElement = card.querySelector('.card-data');
    const updatedCardData = createCardData(
      currentTime,
      previousTime,
      selectedTimeFrame
    );

    cardDataElement.innerHTML = updatedCardData;
  });
}

// Função de manipulação do evento de clique nos botões
function handleClick(event) {
  const buttonsRemove = buttons[0].children;
  Array.from(buttonsRemove).forEach(element => {
    element.classList.remove('active');
  });
  event.target.classList.add('active');
  const clickedButton = event.target.innerHTML.toLowerCase();
  updateCardData(clickedButton);
}

function getTimeFrame(item, timeFrame = 'weekly') {
  const currentTime = item.timeframes[timeFrame].current;
  const previousTime = item.timeframes[timeFrame].previous;
  return { currentTime, previousTime };
}

function createCard(title, currentTime, previousTime, timeLapse = 'weekly') {
  const cardData = createCardData(currentTime, previousTime, timeLapse);

  return `
  <div>
    <h2 >${title}</h2>
    <a href=""><img src="src/images/icon-ellipsis.svg" alt="more Options" /></a>
  </div>
  <div class="card-data">
    ${cardData}
  </div>
  `;
}

function createCardData(currentTime, previousTime, timeLapse) {
  let lastTime;
  if (timeLapse === 'weekly') {
    lastTime = 'Last Week';
  } else if (timeLapse === 'monthly') {
    lastTime = 'Last Month';
  } else if (timeLapse === 'daily') {
    lastTime = 'Yesterday';
  }

  return `
    <h3>${currentTime}hrs</h3>
    <p>${lastTime} - ${previousTime}hrs</p>
  `;
}
