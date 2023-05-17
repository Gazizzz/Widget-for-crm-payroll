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

let filterDateParams = {
  from: month().getTimeMonthFrom,
  to: month().getTimeMonthTo,
};
console.log(filterDateParams);
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

function loadLeadsComplete(managerId) {
  const queryParams = {
    type: "filter_complete_leads",
    data: filterDateParams,
    // manager_id: managerId,
  };
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "https://app.aaccent.su/jenyanour/",
      type: "post",
      data: queryParams,
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
function filterLeadsComplete(leadss, managerId) {
  const filteredDatas = leadss.filter(
    (item) => Number(item.lead_responsible_id) == managerId
  );

  return filteredDatas;
}

function renderManagers(managersArr) {
  const fragment = $(document.createDocumentFragment());

  managersArr.forEach((manager, index) => {
    let totalSumm = 0;
    let totalSummFormatted;

    const $row = $("<tr>");
    const $index = $("<td>").text(index + 1);
    const $name = $("<td>").text(manager.name);
    const $leadComletedCount = $("<td>").text(
      manager.leadsFilterCompelted.length
    );
    for (let i = 0; i < manager.leadsFilterCompelted.length; i++) {
      totalSumm += Number(manager.leadsFilterCompelted[i].lead_sum);
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
  const leadsCompleted = await loadLeadsComplete();
  const newManagerListWithLeads = managers.map(async (item) => {
    // const leads = await loadLeads(item.id);

    const leadsFilterCompelted = filterLeadsComplete(leadsCompleted, item.id);
    return { ...item, /*leads, leadsCompleted,*/ leadsFilterCompelted };
  });
  const result = await Promise.all(newManagerListWithLeads);

  console.log(result);
  renderManagers(result);
}
render();
