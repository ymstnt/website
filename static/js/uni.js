const lang = document.documentElement.lang;

const examsDoneCheckbox = document.querySelector("#exams-done")
examsDoneCheckbox.checked = localStorage.getItem("checkboxState") === "true";

async function updateCounter(examsDone = false) {
  weekElement = document.querySelector("#week-number");
  daysLeftElement = document.querySelector("#days-left");

  let { week, suffix, verbose, daysLeft, exam, study, regWeek } = await getCurrentWeek(lang, examsDone);

  if (exam) {
    examsDoneCheckbox.style.visibility = "visible";
    document.querySelector("#exams-done-label").style.visibility = "visible";
  }

  if (study && !regWeek) {
    if (lang == "hu")  {
      week = week + suffix + " hét"
    } else {
      week = week + suffix + " week"
    }
  } else {
    week = verbose;
  }
 
  if (lang == "hu") {
    daysLeft = " (" + daysLeft + " nap van hátra)";
  } else {
    daysLeft = " (" + daysLeft + " days left)";
  }

  weekElement.innerHTML = week;
  daysLeftElement.innerHTML = daysLeft;
}

async function getCurrentWeek(
  lang = "en",
  examsDone = false
) {
  const url = new URL("https://api.ymstnt.com/uwc");

  url.searchParams.append("lang", lang);
  if (examsDone) {
    url.searchParams.append("countdown-breaks", '');
  }

  const response = await fetch(url, {
    method: "GET",
  });

  const result = await response.json();
  return { week: result.week, suffix: result.suffix, verbose: result.verbose, daysLeft: result.daysLeft, exam: result.exam, study: result.study, regWeek: result.regWeek };
}

updateCounter(examsDoneCheckbox.checked);

examsDoneCheckbox.addEventListener('change', (event) => {
  localStorage.setItem("checkboxState", event.target.checked);
  if (event.target.checked) {
    updateCounter(true);
  } else {
    updateCounter(false);
  }
});
