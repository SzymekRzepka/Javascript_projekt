/**
 * @file Quiz o Markach Samochodów
 * @description Aplikacja do przeprowadzania quizu o markach samochodów.
 * @version 1.0.0
 */

/**
 * Główny obiekt przechowujący dane o quizie.
 * @typedef {Object} QuizData
 * @property {Array<Object>} loga - Tablica obiektów reprezentujących loga samochodowe.
 * @property {number} biezaceLogoIndex - Indeks bieżącego logo w tablicy logów.
 * @property {string} poprawnaOdpowiedz - Poprawna odpowiedź na bieżące pytanie.
 * @property {boolean} czyTrybTrudny - Flaga określająca, czy quiz jest w trybie trudnym.
 * @property {number} liczbaPoprawnychOdpowiedzi - Liczba poprawnych odpowiedzi.
 * @property {number} liczbaWszystkichPytan - Liczba wszystkich pytań.
 */
let loga;
let biezaceLogoIndex;
let poprawnaOdpowiedz;
let czyTrybTrudny;
let liczbaPoprawnychOdpowiedzi = 0;
let liczbaWszystkichPytan = 0;

/**
 * Rozpoczyna quiz, inicjalizując dane i wczytując loga z pliku JSON.
 * @function
 * @returns {void}
 */
function rozpocznijQuiz() {
  czyTrybTrudny = document.getElementById("trudnosc").value === "trudny";
  fetch("loga.json")
    .then((reakcja) => reakcja.json())
    .then((dane) => {
      loga = dane;
      zresetujQuiz();
      kolejnePytanie();
    })
    .catch((blad) =>
      console.error("Błąd podczas pobierania danych JSON:", blad)
    );
}

/**
 * Przygotowuje kolejne pytanie w quizie.
 * @function
 * @returns {void}
 */
function kolejnePytanie() {
  biezaceLogoIndex = Math.floor(Math.random() * loga.length);
  poprawnaOdpowiedz = loga[biezaceLogoIndex].odpowiedz.toLowerCase();

  document.getElementById("logoImage").src = loga[biezaceLogoIndex].src;
  document.getElementById("opcje").innerHTML = "";

  if (!czyTrybTrudny) {
    wyswietlOpcje();
    document.getElementById("odpowiedz").value = "";
    document.getElementById("odpowiedz").style.display = "none";
  } else {
    document.getElementById("opcje").innerHTML = "Wpisz odpowiedź:";
    document.getElementById("odpowiedz").style.display = "block";
    if (czyTrybTrudny) {
      document.getElementById("odpowiedz").value = "";
    }
  }

  document.getElementById("wynik").textContent = "";
  document.getElementById("kontenerQuizu").style.display = "block";
}

/**
 * Wyświetla opcje odpowiedzi dla łatwego poziomu trudności.
 * @function
 * @returns {void}
 */
function wyswietlOpcje() {
  const opcjeDiv = document.getElementById("opcje");

  const pozostaleOpcje = loga
    .filter((_, index) => index !== biezaceLogoIndex)
    .map((opcja) => opcja.odpowiedz);
  const opcje = [poprawnaOdpowiedz, ...losoweOpcje(pozostaleOpcje, 3)].sort(
    () => Math.random() - 0.5
  );

  opcje.forEach((opcja, index) => {
    const radioInput = document.createElement("input");
    radioInput.type = "radio";
    radioInput.name = "opcjaOdpowiedzi";
    radioInput.value = opcja;
    radioInput.id = `opcja${index}`;

    const label = document.createElement("label");
    label.textContent = opcja.toLowerCase();
    label.setAttribute("for", `opcja${index}`);

    opcjeDiv.appendChild(radioInput);
    opcjeDiv.appendChild(label);
    opcjeDiv.appendChild(document.createElement("br"));
  });
}

/**
 * Losuje określoną liczbę losowych opcji z podanej tablicy.
 * @function
 * @param {Array} array - Tablica, z której losować opcje.
 * @param {number} count - Liczba opcji do wylosowania.
 * @returns {Array} - Tablica z wylosowanymi opcjami.
 */
function losoweOpcje(array, count) {
  const shuffledArray = array.sort(() => Math.random() - 0.5);
  return shuffledArray.slice(0, count);
}

/**
 * Sprawdza odpowiedź użytkownika i aktualizuje wynik quizu.
 * @function
 * @returns {void}
 */
function sprawdzOdpowiedz() {
  liczbaWszystkichPytan++;

  const odpowiedzUzytkownika = czyTrybTrudny
    ? document.getElementById("odpowiedz").value.toLowerCase()
    : document
        .querySelector('input[name="opcjaOdpowiedzi"]:checked')
        ?.value?.toLowerCase();

  const wynikDiv = document.getElementById("wynik");

  if (odpowiedzUzytkownika === poprawnaOdpowiedz) {
    liczbaPoprawnychOdpowiedzi++;
    wynikDiv.textContent = "Poprawna odpowiedź!";
    wynikDiv.className = "zielony";
  } else {
    wynikDiv.textContent =
      "Błędna odpowiedź. Poprawna odpowiedź to: " + poprawnaOdpowiedz;
    wynikDiv.className = "czerwony";
  }

  setTimeout(kolejnePytanie, 800);
}

/**
 * Kończy quiz, wyświetlając wynik w alercie.
 * @function
 * @returns {void}
 */
function zakonczQuiz() {
  const wynik = `Wynik: ${liczbaPoprawnychOdpowiedzi} / ${liczbaWszystkichPytan}`;
  alert(`${wynik}`);
  zresetujQuiz();
}

/**
 * Resetuje stan quizu do początkowego.
 * @function
 * @returns {void}
 */
function zresetujQuiz() {
  document.getElementById("kontenerQuizu").style.display = "none";
  document.getElementById("odpowiedz").style.display = "none";
  document.getElementById("wynik").textContent = "";
  liczbaPoprawnychOdpowiedzi = 0;
  liczbaWszystkichPytan = 0;
}
