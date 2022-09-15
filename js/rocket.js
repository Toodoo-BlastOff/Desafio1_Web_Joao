const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);

const rocketId = urlParams.get("id");

if (!rocketId) {
  window.location = "/index.html";
}

async function loadRocket() {
  try {
    const { data } = await axios.get(
      `https://api.spacexdata.com/v3/rockets/${rocketId}`
    );

    console.log(data);

    const { flickr_images, rocket_name, description } = data;

    document.title = `Desafio Blast-off (Curiosidades) | Foguete - ${rocket_name}`;

    if (flickr_images.length > 0) {
      document.getElementById("rocket").src = flickr_images[0];
    }

    document.getElementById("rocket-title").textContent = rocket_name;
    document.getElementById("about-rocket-name").textContent =
      `Conheça o ${rocket_name}`.toUpperCase();

    const imgElement = document.createElement("img");

    imgElement.src =
      flickr_images.length >= 1 ? flickr_images[1] : flickr_images[0];

    document.getElementById("about").appendChild(imgElement);
    document.getElementById("rocket-description").textContent = description;
  } catch (err) {
    window.location = "/index.html";
  }
}

async function loadLaunchments() {
  try {
    const { data } = await axios.get(
      `https://api.spacexdata.com/v3/launches/past?rocket_id=${rocketId}`
    );

    const table = document.getElementById("launchments");

    data.forEach((launch) => {
      const {
        launch_date_local,
        launch_site,
        launch_success,
        rocket,
        details,
      } = launch;

      const date = new Date(launch_date_local);

      var dataFormatted = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
      var launchSite = launch_site.site_name;
      var rocketType = rocket.rocket_type;

      var cores = [];

      rocket.first_stage.cores.forEach((core) => cores.push(core.core_serial));

      var payload =
        rocket.second_stage.payloads.length > 0
          ? rocket.second_stage.payloads[0].payload_mass_kg
          : 0;

      const tableRow = document.createElement("tr");

      var tableDatas = [];

      for (var i = 0; i < 7; i++) {
        const tableData = document.createElement("td");
        tableDatas.push(tableData);
      }

      tableDatas[0].textContent = dataFormatted;
      tableDatas[1].textContent = launchSite;
      tableDatas[2].textContent = launch_success ? "SUCCESS" : "FAILURE";
      tableDatas[2].classList.add(launch_success ? "success" : error);
      tableDatas[3].textContent = rocketType;
      tableDatas[4].textContent =
        cores.length > 0 ? `CORES: ${cores.join()}` : "Nothing";
      tableDatas[5].textContent = `PAYLOADS: ${payload}KG`;
      tableDatas[6].textContent = details
        ? details.substring(0, 60)
        : "Nothing";

      tableDatas.forEach((data) => tableRow.appendChild(data));

      table.appendChild(tableRow);
    });

    if (data.length > 0 && data[0].links.youtube_id)
      document.getElementById(
        "youtube-video"
      ).src = `https://www.youtube.com/embed/${data[0].links.youtube_id}`;
  } catch (err) {
    console.log(err);
  }
}

loadRocket();
loadLaunchments();
