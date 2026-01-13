async function loadCars() {
    let res = await fetch("/replicas");
    let data = await res.json();
  
    let road = document.getElementById("road");
    road.innerHTML = "";
  
    for(let i=0;i<data.replicas;i++){
      let car = document.createElement("div");
      car.className = "car";
      car.style.top = (i*40)+20+"px";
      car.style.animationDelay = (i*0.5)+"s";
      road.appendChild(car);
    }
  }
  
  setInterval(loadCars, 3000);
  loadCars();
  