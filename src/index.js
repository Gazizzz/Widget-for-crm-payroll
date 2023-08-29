import * as dateFns from "date-fns";

import {
  periodDay,
  yesterday,
  startEndWeek,
  month,
  strDatefrom,
  strDateto,
  url,
  getMonthByNumber,
  getYearByNumber,
} from "./helpers.js";
let outFrom = document.querySelector(".out-from");
let yearr = new Date().getFullYear();
let periodMonth = document.querySelectorAll(".periodMonth");
let periodYear = document.querySelectorAll(".periodYear");
periodYear.forEach((year) => {
  year.addEventListener("click", (e) => {
    yearr = e.target.innerHTML;
  });
});

periodMonth.forEach((month) => {
  month.addEventListener("click", (e) => {
    const monthNumber = Number(e.target.dataset.number) - 1;
    const monthQuery = getMonthByNumber(monthNumber, yearr);
    const nameMonth = e.target.innerText;
    outFrom.innerHTML = `Период: ${nameMonth} месяц ${yearr} года`;
    render({
      from: monthQuery.getTimeMonthFrom,
      to: monthQuery.getTimeMonthTo,
    });
  });
});

let filterDateParams = {
  from: month().getTimeMonthFrom,
  to: month().getTimeMonthTo,
};

function loadManagers() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "https://amaranta.im3000.ru/bot/widget/my/users_json.php",
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

function loadLeadsComplete(query) {
  const filterQuery = query || filterDateParams;

  const queryParams = {
    type: "filter_complete_leads",
    // data: { from: "1685577600", to: "1688169599" },
    data: filterQuery,
    // manager_id: managerId,
  };
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "https://amaranta.im3000.ru/bot/widget/",
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
  const tableEl = $(".js-tbody");
  let num = 0;

  managersArr.forEach((manager, index) => {
    // if (
    //   manager.name == "Евгения Ф. 8(909)886-75-17 (Кредитный специалист)" ||
    //   manager.name == "Мариам А. 8(918)916-96-50 (Кредитный специалист)"
    // ) {
    let totalSumm = 0;
    let totalSummFormatted;

    const $row = $("<tr>");
    const $index = $("<td>").text((num = num + 1));
    const $name = $("<td>").text(manager.name);
    const $leadComletedCount = $("<td>").text(
      manager.leadsFilterCompelted.length
    );

    $leadComletedCount.addClass("js-button-firtUser  js-Center");
    $leadComletedCount.attr("data-bs-toggle", "modal");
    $leadComletedCount.attr("data-bs-target", "#firstModal");
    $leadComletedCount.attr("data-managerId", `${manager.id}`);

    for (let i = 0; i < manager.leadsFilterCompelted.length; i++) {
      totalSumm += Number(manager.leadsFilterCompelted[i].lead_sum);
    }
    if (totalSumm < 0) {
      totalSummFormatted = 0;
    } else {
      totalSummFormatted = totalSumm.toLocaleString("en-US");
    }
    const $summ = $("<td>").text(totalSummFormatted);
    $summ.addClass(" js-Center");

    const salary = Math.round((totalSumm / 100) * 10).toLocaleString("en-US");

    let $salaryFormatted = $("<td>").text(salary);
    $salaryFormatted.addClass(" js-Center");
    $row
      .append($index)
      .append($name)
      .append($leadComletedCount)
      .append($summ)
      .append($salaryFormatted);

    fragment.append($row);
    // }
  });

  tableEl.empty();
  tableEl.append(fragment);
}

async function render(query) {
  const managers = await loadManagers();

  const leadsCompleted = await loadLeadsComplete(query);

  const newManagerListWithLeads = managers.map(async (item) => {
    // const leads = await loadLeads(item.id);

    const leadsFilterCompelted = filterLeadsComplete(leadsCompleted, item.id);
    return { ...item, /*leads, leadsCompleted,*/ leadsFilterCompelted };
  });
  const result = await Promise.all(newManagerListWithLeads);
  renderManagers(result);
  console.log(result);
  const table = document.querySelector("#myTables");
  const tableSecond = document.querySelector("#myTable");
  let sumFirst = 0;
  let sumSecond = 0;
  const firstUserButton = document.querySelectorAll(".js-button-firtUser");
  const secondUserButton = document.querySelector(".js-button-secondUser");
  const centerStyle = document.querySelectorAll(".js-Center");
  centerStyle.forEach((element) => {
    element.style.textAlign = "center";
  });
  table.innerHTML = "";
  leadsCompleted.forEach((element, index) => {
    firstUserButton.forEach((btn) =>
      btn.addEventListener("click", (e) => {
        if (e.target.dataset.managerid == element.lead_responsible_id) {
          const row = document.createElement("tr");
          const leadNumb = document.createElement("td");
          const companyName = document.createElement("td");
          const leadAmoid = document.createElement("td");
          leadAmoid.style.color = "blue";
          leadAmoid.style.cursor = "pointer";
          sumFirst = sumFirst + 1;
          companyName.style.marginRight = "20px";
          companyName.style.width = "300px";
          leadNumb.innerHTML = `${sumFirst}.`;
          companyName.innerHTML = element.client_fio;
          leadAmoid.innerHTML = element.amo_lead_id;
          leadAmoid.classList = "firstTableAmoid";
          table.addEventListener("click", (event) => {
            if (event.target.classList.contains("firstTableAmoid")) {
              event.preventDefault();
              const leadIdTarget = event.target.innerText;
              window.open(
                `https://jenyanour.amocrm.ru/leads/detail/${leadIdTarget}`,
                "_blank"
              );
            }
          });
          // let amoId = document.querySelectorAll(".firstTableAmoid");
          // amoId.forEach((item) => {
          //   item.addEventListener("click", (event) => {
          //     event.preventDefault;
          //     const leadIdTarget = event.target.innerText;
          //     // console.log(leadIdTarget);
          //     window.open(
          //       ` https://jenyanour.amocrm.ru/leads/detail/${leadIdTarget}`,
          //       "_blank"
          //     );
          //   });
          // });
          row.append(leadNumb);
          row.append(companyName);
          row.append(leadAmoid);

          table.appendChild(row);
        }
      })
    );
  });
  const btnClose = document.querySelectorAll(".btn-secondary");
  btnClose.forEach((btn) =>
    btn.addEventListener("click", (e) => {
      table.innerHTML = " ";
      sumFirst = 0;
    })
  );

  const modal = document.querySelector(".modal");

  modal.addEventListener("hidden.bs.modal", function (event) {
    table.innerHTML = " ";
    sumFirst = 0;
  });
}

render();
