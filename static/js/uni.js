const lang = document.documentElement.lang;

async function updateCounter() {
  displayElement = document.querySelector("#week-number");

  let { week, suffix, verbose, exam, study, regWeek } = await getCurrentWeek(lang);

  if (study && !regWeek) {
    if (lang == "hu")  {
      week = week + suffix + " hét"
    } else {
      week = week + suffix + " week"
    }
  } else if (regWeek) {
    week = verbose;
  } else {
    if (lang == "hu") {
      week = verbose + " (" + week + " nap van hátra)";
    } else {
      week = verbose + " (" + week + " days left)";
    }
  }

  displayElement.innerHTML = week;
}

async function getCurrentWeek(
  lang = "en"
) {
  const url = new URL("https://api.ymstnt.com/uwc");

  url.searchParams.append("lang", lang);

  const response = await fetch(url, {
    method: "GET",
  });

  const result = await response.json();
  return { week: result.week, suffix: result.suffix, verbose: result.verbose, exam: result.exam, study: result.study, regWeek: result.regWeek };
}

updateCounter();
