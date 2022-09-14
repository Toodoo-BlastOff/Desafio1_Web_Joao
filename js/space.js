const date = new Date();

const rocketList = document.getElementById("rocket-list");

const loadingElement = document.getElementById("loading-element");

const SPACE_X_ROCKETS_ENDPOINT = "https://api.spacexdata.com/v3/rockets";

const SPACE_X_ROCKETS_LAUNCHES_ENDPOINT = `https://api.spacexdata.com/v3/launches/past?start=${
  date.getFullYear() - 2
}-${date.getMonth()}-${date.getDate()}&end=${date.getFullYear()}-${date.getMonth()}-${date.getDate()}&launch_success=true`;

async function loadRockets() {
  const rocketsList = document.getElementById("rockets-list");

  const { status, data } = await axios.get(SPACE_X_ROCKETS_ENDPOINT);

  if (status !== 200) {
    alert("Ocorreu um erro durante o carregamento dos foguetes.");
    return;
  }

  data.slice(0, 3).forEach(async (rocket) => {
    const { data: pastLaunches } = await axios.get(
      `https://api.spacexdata.com/v3/launches/past?rocket_id=${rocket.rocket_id}`
    );

    if (pastLaunches.length > 0) {
      const liElement = document.createElement("li");

      liElement.classList.add("card");

      liElement.classList.add("rocket-card");

      const imgElement = document.createElement("img");

      imgElement.style.width = "133px";

      imgElement.style.height = "133px";

      imgElement.src = pastLaunches[0].links.mission_patch;

      liElement.appendChild(imgElement);

      const launchParagraph = document.createElement("p");

      launchParagraph.classList.add("launch-info");

      launchParagraph.textContent = "ROCKET";

      liElement.appendChild(launchParagraph);

      const title = document.createElement("h4");

      title.textContent = rocket.rocket_name.toString().substring(0, 19);

      liElement.appendChild(title);

      const button = document.createElement("button");

      button.textContent = rocket.active ? "ACTIVE" : "INACTIVE";

      button.disabled = !rocket.active;

      liElement.appendChild(button);

      rocketsList.appendChild(liElement);
    }
  });
}

async function loadLastRocketsLaunches() {
  const rocketList = document.getElementById("rocket-list");
  const { status, data } = await axios.get(SPACE_X_ROCKETS_LAUNCHES_ENDPOINT);

  if (status !== 200) {
    alert("Ocorreu um erro durante o carregamento dos foguetes.");
    return;
  }

  loadingElement.remove();

  data.slice(0, 4).forEach((rocket) => {
    const liElement = document.createElement("li");

    liElement.classList.add("card");

    liElement.classList.add("rocket-card");

    /* Criando elemento imagem */

    const imgElement = document.createElement("img");

    imgElement.style.width = "133px";

    imgElement.style.height = "133px";

    imgElement.src = rocket.links.mission_patch_small;

    liElement.appendChild(imgElement);

    /* Criando elemento LAUNCH (paragrafo) */

    const launchParagraph = document.createElement("p");

    launchParagraph.classList.add("launch-info");

    launchParagraph.textContent = "LAUNCH";

    liElement.appendChild(launchParagraph);

    const title = document.createElement("h4");

    title.textContent = rocket.mission_name.toString().substring(0, 19);

    liElement.appendChild(title);

    const parsedDate = new Date(rocket.launch_date_local);

    const launchSiteInfo = document.createElement("p");

    launchSiteInfo.innerHTML = `${rocket.launch_site.site_name} <br/> ${
      (parsedDate.getDate().toString().length == 1 ? "0" : "") +
      parsedDate.getDate()
    }-${
      (parsedDate.getMonth().toString().length == 1 ? "0" : "") +
      parsedDate.getMonth()
    }-${parsedDate.getFullYear()}`;

    liElement.appendChild(launchSiteInfo);

    rocketList.appendChild(liElement);
  });

  console.log(data);
}

loadLastRocketsLaunches();
loadRockets();
