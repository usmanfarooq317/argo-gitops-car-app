async function loadCars() {
  let res = await fetch("/replicas");
  let data = await res.json();

  let road = document.getElementById("road");
  road.innerHTML = "";

  let laneHeight = road.clientHeight / data.replicas;

  for (let i = 0; i < data.replicas; i++) {
    let car = document.createElement("div");
    car.className = "car";

    // Place each car in its own lane
    car.style.top = (i * laneHeight + laneHeight / 2 - 20) + "px";

    // Random speed for realism
    let speed = 4 + Math.random() * 3;
    car.style.animationDuration = speed + "s";

    // Random color per replica
    let colors = ["#ff3c3c", "#3cff77", "#3ca0ff", "#ffb703", "#9b5de5"];
    car.style.background = colors[i % colors.length];

    road.appendChild(car);
  }
}

setInterval(loadCars, 3000);
loadCars();
