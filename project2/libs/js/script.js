$(window).on("load", function () {
  if ($("#preloader").length) {
    $("#preloader")
      .delay(1500)
      .fadeOut("slow", function () {
        $(this).remove();
      });
  }
});

$(document).ready(function () {
  console.log("ready");

  // LOADING EMPLOYEE TABLE //

  $.ajax({
    url: "libs/php/getAll.php",
    type: "POST",
    dataType: "json",
    success: function (result) {
      if (result.status.name == "ok") {
        let allEmployeeData = result.data;
        for (let i = 0; i < allEmployeeData.length; i++) {
          // console.log(allEmployeeData[i]);
          let row = $(`<tr id=employeeRow'${[i]}'>`).addClass(
            "d-flex align-items-center"
          );

          let name_JobTableCell = $("<td>")
            .addClass("ps-4 cell-width")
            .attr("data-id", i);
          let namesDiv = $("<div>").addClass(
            "d-flex flex-column align-items-start"
          );
          let namesData = $("<p>")
            .html(
              `${allEmployeeData[i].firstName}, ${allEmployeeData[i].lastName}`
            )
            .addClass("fw-bold text-start mb-0");
          let jobs = $("<p>").addClass("text-muted text-start mb-0");
          let jobsData = $("<small>").html(allEmployeeData[i].jobTitle);

          jobs.append(jobsData);
          namesData.append(jobs);
          namesDiv.append(namesData);
          name_JobTableCell.append(namesDiv);
          row.append(name_JobTableCell);

          let emails = $("<td>")
            .addClass("cell-width employeeEmail")
            .attr("data-id", i);
          emails
            .html(allEmployeeData[i].email)
            .addClass("text-nowrap align-middle d-md-table-cell ps-3");
          row.append(emails);

          let department_locationCell = $("<td>")
            .addClass("cell-width pb-0 employeeDep")
            .attr("data-id", i);
          let departmentsDiv = $("<div>").addClass(
            "d-flex flex-column align-items-start employeeDep"
          );
          let departmentsData = $("<p>")
            .html(allEmployeeData[i].department)
            .addClass("fw-bold text-start mb-0");
          let locations = $("<p>").addClass("text-muted text-start mb-0");
          let locationsData = $("<small>").html(allEmployeeData[i].location);

          locations.append(locationsData);
          departmentsData.append(locations);
          departmentsDiv.append(departmentsData);
          department_locationCell.append(departmentsDiv);
          row.append(department_locationCell);

          // -- BUTTONS -- //
          let buttonCells = $("<td>").addClass("employeeCells");
          let buttonDiv = $("<div>").addClass(
            "d-flex justify-content-end employeeButtons me-3"
          );
          let editButtons = $("<button>")
            .addClass("btn btn-none btn-sm")
            .attr("data-bs-toggle", "modal")
            .attr("data-bs-target", "#editEmployeeModal");
          let editIcons = $("<i>").addClass("fa-solid fa-pencil fa-lg text-primary");
          let deleteButtons = $("<button>")
            .addClass("btn btn-none btn-sm ms-3")
            .attr("data-bs-toggle", "modal")
            .attr("data-bs-target", "#deleteEmployeeModal");
          let deleteIcons = $("<i>").addClass("fa-regular fa-trash-can fa-lg text-danger");

          editButtons.append(editIcons);
          deleteButtons.append(deleteIcons);
          buttonDiv.append(editButtons);
          buttonDiv.append(deleteButtons);
          buttonCells.append(buttonDiv);
          row.append(buttonCells);

          $("#employeeTableBody").append(row);
        }
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      console.log(errorThrown);
    },
  });

  // -------- LOADING DEPARTMENTS TABLE ----------- //

  let departments = [];

  $.ajax({
    url: "libs/php/getDepartments.php",
    type: "POST",
    dataType: "json",
    success: function (result) {
      if (result.status.name == "ok") {
        console.log(result);
        let allDepartmentData = result.data;

        for (let i = 0; i < allDepartmentData.length; i++) {
          let department = allDepartmentData[i].department;
          departments.push(department);

          

          let row = $(`<tr id=departmentRow'${[i]}'>`).addClass(
            "d-flex"
          );

          // -- DEPARTMENT COLUMN -- //
          let departmentDepartmentCells = $("<td>")
            .addClass("ps-4 departmentDepartmentCells")
            .attr("data-id", i);
          let departmentDepartmentDiv = $("<div>").addClass(
            "d-flex align-items-start"
          );
          let departmentDepartmentNames = $("<p>")
            .html(department)
            .addClass("fw-bold text-start mb-0");

          departmentDepartmentDiv.append(departmentDepartmentNames);
          departmentDepartmentCells.append(departmentDepartmentDiv);
          row.append(departmentDepartmentCells);

            // -- LOCATION COLUMN -- //
          let departmentLocationCells = $("<td>")
            .addClass("ps-4 departmentLocationCells")
            .attr("data-id", i);
          let departmentLocationDiv = $("<div>").addClass(
            "d-flex align-items-start"
          );
          let departmentLocationNames = $("<p>")
            .html(allDepartmentData[i].location)
            .addClass("fw-bold text-start mb-0");

          departmentLocationDiv.append(departmentLocationNames);
          departmentLocationCells.append(departmentLocationDiv);
          row.append(departmentLocationCells);

          // -- BUTTONS -- //
          let buttonCells = $("<td>").addClass("departmentButtonCells pb-4 pt-2");
          let buttonDiv = $("<div>").addClass(
            "d-flex justify-content-end employeeButtons me-3"
          );
          let editButtons = $("<button>")
            .addClass("btn btn-none btn-sm")
            .attr("data-bs-toggle", "modal")
            .attr("data-bs-target", "#editDepartmentModal");
          let editIcons = $("<i>").addClass("fa-solid fa-pencil fa-lg text-primary");
          let deleteButtons = $("<button>")
            .addClass("btn btn-none btn-sm ms-3")
            .attr("data-bs-toggle", "modal")
            .attr("data-bs-target", "#deleteDepartmentModal");
          let deleteIcons = $("<i>").addClass("fa-regular fa-trash-can fa-lg text-danger");

          editButtons.append(editIcons);
          deleteButtons.append(deleteIcons);
          buttonDiv.append(editButtons);
          buttonDiv.append(deleteButtons);
          buttonCells.append(buttonDiv);
          row.append(buttonCells);

          $("#departmentTableBody").append(row);
        }
        console.log(departments);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      console.log(errorThrown);
    },
  });



    // -------- LOADING LOCATIONS TABLE ----------- //

    let locations = [];

  $.ajax({
    url: "libs/php/getLocations.php",
    type: "POST",
    dataType: "json",
    success: function (result) {
      if (result.status.name == "ok") {
        console.log(result);
        let allLocationData = result.data;

        for (let i = 0; i < allLocationData.length; i++) {
          let location = allLocationData[i].location;
          locations.push(location);

          

          let row = $(`<tr id=locationRow'${[i]}'>`).addClass(
            "d-flex align-items-center"
          );

          // -- LOCATION COLUMN -- //
          let locationLocationCells = $("<td>")
            .addClass("ps-4 locationLocationCells")
            .attr("data-id", i);
          let locationLocationDiv = $("<div>").addClass(
            "d-flex align-items-start"
          );
          let locationLocationNames = $("<p>")
            .html(location)
            .addClass("fw-bold text-start mb-0");

          locationLocationDiv.append(locationLocationNames);
          locationLocationCells.append(locationLocationDiv);
          row.append(locationLocationCells);


          // -- BUTTONS -- //
          let buttonCells = $("<td>").addClass("locationButtonCells pb-4 pt-2");
          let buttonDiv = $("<div>").addClass(
            "d-flex justify-content-end employeeButtons me-3"
          );
          let editButtons = $("<button>")
            .addClass("btn btn-none btn-sm")
            .attr("data-bs-toggle", "modal")
            .attr("data-bs-target", "#editDepartmentModal");
          let editIcons = $("<i>").addClass("fa-solid fa-pencil fa-lg text-primary");
          let deleteButtons = $("<button>")
            .addClass("btn btn-none btn-sm ms-3")
            .attr("data-bs-toggle", "modal")
            .attr("data-bs-target", "#deleteDepartmentModal");
          let deleteIcons = $("<i>").addClass("fa-regular fa-trash-can fa-lg text-danger");

          editButtons.append(editIcons);
          deleteButtons.append(deleteIcons);
          buttonDiv.append(editButtons);
          buttonDiv.append(deleteButtons);
          buttonCells.append(buttonDiv);
          row.append(buttonCells);

          $("#locationTableBody").append(row);
        }
        console.log(locations);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      console.log(errorThrown);
    },
  });










});
