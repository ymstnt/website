const lang = document.documentElement.lang;

async function updateCounter() {
  displayElement = document.querySelector("#week-number");

  let currentWeek = await getCurrentWeek();
  console.log(currentWeek);
  if (lang == "hu") {
    currentWeek = await getCurrentWeek("hu");
  }

  if (currentWeek > 0 && currentWeek <= 14) {
    if (lang == "hu")  {
      currentWeek = currentWeek + " hét"
    } else {
      currentWeek = currentWeek + " week"
    }
  }

  displayElement.innerHTML = currentWeek;
}

async function getCurrentWeek(
  lang = "en",
  verbose = true,
  countdown = true
) {
  const url = new URL("https://uwc.ymstnt.com/uwc");

  url.searchParams.append("lang", lang);
  // Only append the parameters if they are true
  if (verbose) {
    url.searchParams.append("verbose", "");
  }
  if (countdown) {
    url.searchParams.append("countdown", "");
  }

  const response = await fetch(url, {
    method: "GET",
  });

  const result = await response.json();
  return result.message;
}

updateCounter();
