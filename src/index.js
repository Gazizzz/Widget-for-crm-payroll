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
// console.log(filterDateParams);
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

function loadLeadsComplete() {
  const queryParams = {
    type: "filter_complete_leads",
    data: { from: "1682899200", to: "1685491200" },
    // data: filterDateParams,
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
function filterLeadsComplete(leads, managerId) {
  const filteredDatas = leads.filter(
    (item) => Number(item.lead_responsible_id) == managerId
  );

  return filteredDatas;
}

function renderManagers(managersArr) {
  const fragment = $(document.createDocumentFragment());
  let num = 0;
  managersArr.forEach((manager, index) => {
    if (
      manager.name == "Евгения Ф. 8(909)886-75-17 (Кредитный специалист)" ||
      manager.name == "Мариам А. 8(918)916-96-50 (Кредитный специалист)"
    ) {
      let totalSumm = 0;
      let totalSummFormatted;

      const $row = $("<tr>");
      const $index = $("<td>").text((num = num + 1));
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
    }
  });
  $("table tbody").append(fragment);
}
async function render() {
  const managers = await loadManagers();
  const leadsCompleted = await loadLeadsComplete();
  console.log(leadsCompleted);
  // let tt = leadsCompleted.forEach((items) => {
  //   console.log(items.lead_closed_at);
  // });
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
