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
      if (manager.id == "6889038") {
        $leadComletedCount.addClass("js-button-firtUser  js-Center");
        $leadComletedCount.attr("data-bs-toggle", "modal");
        $leadComletedCount.attr("data-bs-target", "#firstModal");
      }
      if (manager.id == "9206253") {
        $leadComletedCount.addClass("js-button-secondUser js-Center");
        $leadComletedCount.attr("data-bs-toggle", "modal");
        $leadComletedCount.attr("data-bs-target", "#exampleModal");
      }
      console.log(manager.leadsFilterCompelted);
      for (let i = 0; i < manager.leadsFilterCompelted.length; i++) {
        totalSumm += Number(manager.leadsFilterCompelted[i].lead_sum);
        totalSummFormatted = totalSumm.toLocaleString("en-US");
      }
      const $summ = $("<td>").text(totalSummFormatted);

      const salary = Math.round((totalSumm / 100) * 10).toLocaleString("en-US");

      let $salaryFormatted = $("<td>").text(salary);
      $salaryFormatted.addClass(" js-Center");
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

  const newManagerListWithLeads = managers.map(async (item) => {
    // const leads = await loadLeads(item.id);

    const leadsFilterCompelted = filterLeadsComplete(leadsCompleted, item.id);
    return { ...item, /*leads, leadsCompleted,*/ leadsFilterCompelted };
  });
  const result = await Promise.all(newManagerListWithLeads);

  console.log(result);
  renderManagers(result);
  const table = document.querySelector("#myTables");
  const tableSecond = document.querySelector("#myTable");
  let sumFirst = 0;
  let sumSecond = 0;
  const firstUserButton = document.querySelector(".js-button-firtUser");
  const secondUserButton = document.querySelector(".js-button-secondUser");
  const centerStyle = document.querySelectorAll(".js-Center");
  centerStyle.forEach((element) => {
    element.style.textAlign = "center";
  });
  firstUserButton.addEventListener("click", (event) => {});

  leadsCompleted.forEach((element, index) => {
    if (element.lead_responsible_id == "6889038") {
      console.log(element.lead_responsible_id == "6889038");
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
      companyName.innerHTML = element.amo_company_name;
      leadAmoid.innerHTML = element.amo_lead_id;
      leadAmoid.classList = "firstTableAmoid";
      table.addEventListener("click", (event) => {
        if (event.target.classList.contains("firstTableAmoid")) {
          event.preventDefault();
          // console.log(event.target);
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
  });

  leadsCompleted.map((element, index) => {
    if (element.lead_responsible_id == "9206253") {
      const row = document.createElement("tr");

      const leadNumb = document.createElement("td");

      const leadAmoid = document.createElement("td");
      leadAmoid.style.color = "blue";
      leadAmoid.style.cursor = "pointer";
      const companyName = document.createElement("td");
      companyName.style.marginRight = "20px";
      companyName.style.width = "300px";

      sumSecond = sumSecond + 1;
      leadNumb.innerHTML = `${sumSecond}.`;

      companyName.innerText = element.amo_company_name;
      leadAmoid.innerHTML = element.amo_lead_id;
      leadAmoid.classList = "seconsTableAmoid";
      tableSecond.addEventListener("click", (event) => {
        if (event.target.classList.contains("seconsTableAmoid")) {
          event.preventDefault();
          // console.log(event.target);
          const leadIdTarget = event.target.innerText;
          window.open(
            `https://jenyanour.amocrm.ru/leads/detail/${leadIdTarget}`,
            "_blank"
          );
        }
      });
      // let amoId = document.querySelectorAll(".seconsTableAmoid");
      // amoId.forEach((item) => {
      //   item.addEventListener("click", (event) => {
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

      tableSecond.appendChild(row);
    }
  });
}

render();
