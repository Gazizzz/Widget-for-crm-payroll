import * as dateFns from "date-fns";
import {
  periodDay,
  yesterday,
  startEndWeek,
  month,
  strDatefrom,
  strDateto,
  url,
} from "./helpers.js";

let monthsWithQuoter = {
  0: 1,
  1: 1,
  2: 1,
  3: 2,
  4: 2,
  5: 2,
  6: 3,
  7: 3,
  8: 3,
  9: 4,
  10: 4,
  11: 4,
};

// let out3 = document.querySelector(".out3");

// что подаем на вход:
//  arrDatefrom;
// что возвращаем  - return quarter

// function findMonthQuarter(date) {
//   let arrDataWithoutDot = date.split(".");
//   let [day, month, year] = arrDataWithoutDot;
//   let dateDayMonthYear = new Date(year, month, day);
//   let findQuarter =
//     monthsWithQuoter[
//       dateDayMonthYear.getMonth()
//     ]; /*  Это тоже самое, что и  let monthItemDT = arr.find((item) => item.month == Dateto.getMonth());
//                                                                                        console.log(monthItemDT.quarter);   */
//   return findQuarter;
// }

// let quaterFrom = findMonthQuarter(strDatefrom);
// let quarterTo = findMonthQuarter(strDateto);
// console.log(quaterFrom);
// console.log(quarterTo);

const period = url.searchParams.get("period");
let postDataFilterDate = {
  type: "filter_leads",
  data: {
    from: "",

    to: function () {
      if (period == "day") {
        return "1682083862";
      }
    },
    manager_id: "",
  },
};

let postDataFilterDateComplete = {
  type: "filter_complete_leads",
  data: {
    table: "complete_leads_info",
    from: function () {
      if (period == "day") {
        return periodDay()[0];
      }
      if (period == "yesterday") {
        return yesterday()[0];
      }
      if (period == "week") {
        return startEndWeek()[0];
      }
      if (period == "month") {
        return month()[0];
      }
      if (period == "custom") {
        let parsestrDatefrom = dateFns.parse(
          strDatefrom,
          "dd.MM.yyyy",
          new Date()
        );
        let dateFrom = parsestrDatefrom.getTime();
        return dateFrom;
      }
    },

    to: function () {
      if (period == "day") {
        return periodDay()[1];
      }
      if (period == "yesterday") {
        return yesterday()[1];
      }
      if (period == "week") {
        return startEndWeek()[1];
      }
      if (period == "month") {
        return month()[1];
      }
      if (period == "custom") {
        let parsestrDateTo = dateFns.parse(strDateto, "dd.MM.yyyy", new Date());
        let dateTo = parsestrDateTo.getTime();

        return dateTo;
      }
    },
    manager_id: "",
  },
};

let postDataManagers = {
  type: "managers",
  data: {},
};
function loadManagers() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "https://app.aaccent.su/jenyanour/",
      type: "post",
      data: {
        type: "managers",
      },
      dataType: "json", // Expected response data type
      success: function (data) {
        resolve(data);
      },
      error: function (error) {
        reject(error);
      },
    });
  });
}

function loadLeads(managerId) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "https://app.aaccent.su/jenyanour/",
      type: "POST",

      data: {
        type: "filter_leads",
        data: { manager_id: managerId },
      },
      dataType: "json", // Expected response data type
      success: function (data) {
        resolve(data);
      },
      error: function (error) {
        reject(error);
      },
    });
  });
}

function loadLeadsComplete(managerId) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "https://app.aaccent.su/jenyanour/",
      type: "post",
      data: {
        type: "filter_complete_leads",
        manager_id: managerId,
      },
      dataType: "json", // Expected response data type
      success: function (data) {
        resolve(data);
      },
      error: function (error) {
        reject(error);
      },
    });
  });
}
function renderManagers(managersArr) {
  const fragment = $(document.createDocumentFragment());

  managersArr.forEach((manager, index) => {
    let totalSumm = 0;
    let totalSummFormatted;
    console.log(manager);
    const $row = $("<tr>");
    const $index = $("<td>").text(index + 1);
    const $name = $("<td>").text(manager.name);
    const $leadComletedCount = $("<td>").text(manager.leadsCompleted.length);
    for (let i = 0; i < manager.leadsCompleted.length; i++) {
      totalSumm += Number(manager.leadsCompleted[i].lead_sum);
      totalSummFormatted = totalSumm.toLocaleString("en-US");
    }
    const $summ = $("<td>").text(totalSummFormatted);

    const salary = Math.round((totalSumm / 100) * 10).toLocaleString("en-US");

    let $salaryFormatted = $("<td>").text(salary);

    $row
      .append($index)
      .append($name)
      .append($leadComletedCount)
      // .append($summ)
      .append($salaryFormatted);
    fragment.append($row);
  });
  $("table tbody").append(fragment);
}
async function render() {
  const managers = await loadManagers();

  const newManagerListWithLeads = managers.map(async (item) => {
    const leads = await loadLeads(item.id);
    const leadsCompleted = await loadLeadsComplete(item.id);

    return { ...item, leads, leadsCompleted };
  });
  const result = await Promise.all(newManagerListWithLeads);

  console.log(result);
  renderManagers(result);
}
render();
