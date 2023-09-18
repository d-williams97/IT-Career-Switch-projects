$(window).on("load", function () {
  if ($("#preloader").length) {
    $("#preloader")
      .delay(1500)
      .fadeOut("slow", function () {
        $(this).remove();
      });
  }
});

// -- TOASTS -- //
let addEmpToast = new bootstrap.Toast($("#addEmpToast"));
let addDepToast = new bootstrap.Toast($("#addDepToast"));
let addLocToast = new bootstrap.Toast($("#addLocToast"));

let depEditToast = new bootstrap.Toast($("#depEditToast"));
let empEditToast = new bootstrap.Toast($("#empEditToast"));
let locEditToast = new bootstrap.Toast($("#locEditToast"));

let delEmpToast = new bootstrap.Toast($("#delEmpToast"));
let delDepToast = new bootstrap.Toast($("#delDepToast"));
let delLocToast = new bootstrap.Toast($("#delLocToast"));

let failDelDepToast = new bootstrap.Toast($("#failDelDepToast"));
let failDelLocToast = new bootstrap.Toast($("#failDelLocToast"));

// -------------------------------- EMPLOYEES TAB ----------------------------- //

let empLocInput;
let empDepSelect;
let empDepSelectID;
let empFirstName;
let empLastName;
let empEmail;
let empJob;

let allEmployeeData;

let newFirstName;
let newLastName;
let newDepartment;
let newDepartmentId;
let newEmail;
let newJobTitle;
let employeeID;
let departmentID;
let delID;
let personnelId;

// ---------- EMPLOYEES TAB FUNCTIONS ---------- //

let addEmployeeFunc = function (selectVal, departments) {
  console.log(selectVal);
  let empLocObj = $.grep(departments, function (department, i) {
    return department.department.toLowerCase() === selectVal.toLowerCase();
  });
  empLocInput = empLocObj[0].location;
  $("#locationInput").val(empLocInput);
};

let fillTable = (data) => {
  $("#employeeTableBody").empty();
  for (let i = 0; i < data.length; i++) {
    let row = $(`<tr id=employeeRow'${[i]}'>`);

    // -- NAME CELLS -- //
    let nameTableCell = $("<td>")
      .addClass("align-middle text-nowrap")
      .html(`${data[i].firstName}, ${data[i].lastName}`);

    row.append(nameTableCell);

    // -- JOB CELLS -- //
    let jobTableCell = $("<td>")
      .addClass("align-middle text-nowrap d-none d-sm-table-cell")
      .html(data[i].jobTitle)
      .addClass("text-start mb-0");
    row.append(jobTableCell);

    // -- DEPARTMENT CELLS -- //
    let departmentCell = $("<td>")
      .addClass("align-middle text-nowrap d-none d-md-table-cell")
      .html(data[i].department);

    row.append(departmentCell);

    // -- LOCATION CELLS -- //
    let locationsCell = $("<td>")
      .addClass("align-middle text-nowrap d-none d-lg-table-cell")
      .html(data[i].location);
    row.append(locationsCell);

    // -- EMAIL CELLS -- //
    let emails = $("<td>")
      .addClass("align-middle text-nowrap d-none d-xl-table-cell")
      .html(data[i].email);
    row.append(emails);

    // -- BUTTONS -- //
    let buttonCells = $("<td>").addClass("align-middle text-end text-nowrap");
    let editButtons = $("<button>")
      .addClass("btn btn-none btn-sm editBtn")
      .attr("data-bs-target", "#editEmpModal")
      .attr("data-id", data[i].id)
      .attr("data-bs-toggle", "modal");
    let editIcons = $("<i>").addClass("fa-solid fa-pencil fa-lg text-primary");
    let deleteButtons = $("<button>")
      .addClass("btn btn-none btn-sm ms-3 deleteBtn")
      .attr("data-bs-target", "#deleteEmpModal")
      .attr("data-id", data[i].id)
      .attr("data-bs-toggle", "modal");
    let deleteIcons = $("<i>").addClass(
      "fa-regular fa-trash-can fa-lg text-danger"
    );

    editButtons.append(editIcons);
    deleteButtons.append(deleteIcons);
    buttonCells.append(editButtons);
    buttonCells.append(deleteButtons);
    row.append(buttonCells);

    $("#employeeTableBody").append(row);
  }
  updateDepartmentOptions(departments);
  $("#empNumber").html(`${data.length} Employees`);
};

// ---------- EMPLOYEES TAB EVENT HANDLERS ---------- //

// -- Delete Employee Modal Shows -- //
$("#deleteEmpModal").on("show.bs.modal", function (e) {
  $.ajax({
    url: "libs/php/getPersonnelByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: $(e.relatedTarget).attr("data-id"), // Retrieves the data-id attribute from the calling button
    },
    success: function (result) {
      if (result.status.code == 200) {
        personnelId = result.data.personnel[0].id;
        $("#deleteEmpMessage").html(
          `Are you sure you want to delete <b>${result.data.personnel[0].firstName} ${result.data.personnel[0].lastName}<b>?`
        );
      } else {
        $("#deleteEmpModal .modal-title").replaceWith("Error retrieving data");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#deleteEmpModal .modal-title").replaceWith("Error retrieving data");
    },
  });
});

// -- Delete Employee Confirm Routine -- //
$("#deleteEmpConfirm").on("click", function (e) {
  $.ajax({
    url: "libs/php/deleteEmployee.php",
    type: "POST",
    dataType: "json",
    data: {
      id: personnelId,
    },
    success: function (result) {
      if (result.status.code == 200) {
        fillTable(result.data);
        $("#deleteEmpModal").modal("hide");
        delEmpToast.show();
      } else {
        console.log("failed");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {},
  });
});

$("#cancelEditEmpBtn").on("click", function () {
  $("#editEmpTitle").html("");
  $("#editFirstName").val("");
  $("#editLastName").val("");
  $("#editEmail").val("");
  $("#editJob").val("");
});

// -- Edit Employee Modal Shows -- //
$("#editEmpModal").on("show.bs.modal", function (e) {
  $.ajax({
    url: "libs/php/getPersonnelByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: $(e.relatedTarget).attr("data-id"), // Retrieves the data-id attribute from the calling button
    },
    success: function (result) {
      if (result.status.code == 200) {
        $("#editEmpDepSel").empty();
        $.map(result.data.department, function (department, i) {
          $("#editEmpDepSel").append(
            `<option value='${department.id}'>${department.name}</option>`
          );
        });
        newFirstName = result.data.personnel[0].firstName;
        newLastName = result.data.personnel[0].lastName;
        newJobTitle = result.data.personnel[0].jobTitle;
        newEmail = result.data.personnel[0].email;
        personnelId = result.data.personnel[0].id;
        newDepartment = $("#editEmpDepSel option:selected").text();
        newDepartmentId = $("#editEmpDepSel").val();

        $("#editFirstName").val(result.data.personnel[0].firstName);
        $("#editLastName").val(result.data.personnel[0].lastName);
        $("#editJob").val(result.data.personnel[0].jobTitle);
        $("#editEmail").val(result.data.personnel[0].email);
      } else {
        $("#editEmpModal .modal-title").replaceWith("Error retrieving data");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#editEmpModal .modal-title").replaceWith("Error retrieving data");
    },
  });
});

// -- SUBMIT EMPLOYEE MODAL FORM -- //

$("#editEmpForm").on("submit", function (e) {
  e.preventDefault();
  console.log(personnelId);
  $.ajax({
    url: "libs/php/updateEmployee.php",
    type: "POST",
    dataType: "json",
    data: {
      newFirstName,
      newLastName,
      newDepartment,
      newEmail,
      newJobTitle,
      personnelId,
      newDepartmentId,
    },
    success: function (result) {
      if (result.status.name == "ok") {
        fillTable(result.data);
        allEmployeeData = result.data;
        $("#editEmpModal").modal("hide");
        empEditToast.show();
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
  $("#locLocInput").val("");
});

$("#editFirstName").on("keyup", function () {
  newFirstName = $(this).val();
  console.log(newFirstName);
});
$("#editLastName").on("keyup", function () {
  newLastName = $(this).val();
  console.log(newLastName);
});
$("#editEmail").on("keyup", function () {
  newEmail = $(this).val();
  console.log(newEmail);
});
$("#editJob").on("keyup", function () {
  newJobTitle = $(this).val();
  console.log(newJobTitle);
});

$("#editEmpDepSel").on("change", function () {
  newDepartment = $("#editEmpDepSel option:selected").text();
  newDepartmentId = $(this).val();
});

// -------------------------------- DEPARTMENTS TAB ----------------------------- //

let delDepID;
let delDepName;

let departments = [];
let allDepartmentData;

let newDepLoc;
let newDepLocId;
let newDepDep;
let newDepId;

// ----- DEPARTMENTS TAB FUNCTIONS ----- //

let updateDepartmentOptions = function (location) {
  $("#selectEmpDep").empty();
  $("#selectEmpDep").append("<option> Select a department </option>");
  $.map(departments, function (location, i) {
    $("#selectEmpDep").append(
      `<option value='${location.department.toLowerCase()}'>${
        location.department
      }</option>`
    );
  });
};

function deleteDepartment(departmentName, id) {
  delDepID = id;
  delDepName = departmentName;
  $("#deleteDepMessage").html(
    `Are you sure you want to delete <b>${departmentName}</b>?`
  );
  $("#deleteDepModal").modal("show");
}

let fillDepartmentTable = (data) => {
  // console.log(data);
  departments = [];
  $("#departmentTableBody").empty();
  for (let i = 0; i < data.length; i++) {
    let department = data[i];
    departments.push(department);

    let row = $(`<tr id=departmentRow${[i]}>`);

    // -- DEPARTMENT COLUMN -- //
    let departmentDepartmentCells = $("<td>")
      .addClass("align-middle text-nowrap")
      .html(data[i].department);

    row.append(departmentDepartmentCells);

    // -- LOCATION COLUMN -- //
    let departmentLocationCells = $("<td>")
      .addClass("align-middle text-nowrap d-none d-md-table-cell")
      .html(data[i].location);
    row.append(departmentLocationCells);

    // -- BUTTONS -- //
    let buttonCells = $("<td>").addClass("align-middle text-end text-nowrap");
    let editButtons = $("<button>")
      .addClass("btn btn-none btn-sm editBtn")
      .attr("data-bs-toggle", "modal")
      .attr("data-id", data[i].departmentID)
      .attr("data-bs-target", "#editDepartmentModal");
    let editIcons = $("<i>").addClass("fa-solid fa-pencil fa-lg text-primary");
    let deleteButtons = $("<button>")
      .addClass("btn btn-none btn-sm ms-3 deleteDepBtn")
      .attr("data-id", data[i].departmentID);
    let deleteIcons = $("<i>").addClass(
      "fa-regular fa-trash-can fa-lg text-danger"
    );

    editButtons.append(editIcons);
    deleteButtons.append(deleteIcons);
    buttonCells.append(editButtons);
    buttonCells.append(deleteButtons);
    row.append(buttonCells);

    $("#departmentTableBody").append(row);
  }
  updateDepartmentOptions(departments);
  $("#depNumber").html(`${data.length} Departments`);
};

// ----- DEPARTMENT EVENT HANDLERS ----- //

// -- Edit Dep Modal Show -- //
$("#editDepartmentModal").on("show.bs.modal", function (e) {
  $.ajax({
    url: "libs/php/getDepartmentByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: $(e.relatedTarget).attr("data-id"),
    },
    success: function (result) {
      if (result.status.code == 200) {
        $("#editDepLocSel").empty();
        $.map(result.locationData, function (location, i) {
          $("#editDepLocSel").append(
            `<option value='${location.id}'>${location.name}</option>`
          );
        });

        newDepDep = result.data[0].name;
        newDepId = result.data[0].id;
        newDepLocId = $("#editDepLocSel").val();

        $("#editDepInput").val(newDepDep);
      } else {
        $("#editDepartmentModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#editDepartmentModal .modal-title").replaceWith(
        "Error retrieving data"
      );
    },
  });
});

// -- Edit Dep Form Submit -- //
$("#editDepForm").on("submit", function (e) {
  e.preventDefault();
  $.ajax({
    url: "libs/php/updateDepartment.php",
    type: "POST",
    dataType: "json",
    data: {
      locationID: newDepLocId,
      department: newDepDep,
      departmentID: newDepId,
    },
    success: function (result) {
      if (result.status.name == "ok") {
        fillTable(result.allData);
        fillDepartmentTable(result.departmentData);
        allDepartmentData = result.departmentData;
        $("#editDepartmentModal").modal("hide");
        depEditToast.show();
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
});

$("#editDepLocSel").on("change", function () {
  newDepLocId = $(this).val();
});
$("#editDepInput").on("keyup", function () {
  newDepDep = $(this).val();
});

// -- Delete Dep Button Click -- //
$(document).on("click", ".deleteDepBtn", function () {
  delDepID = $(this).attr("data-id");
  $.ajax({
    url: "libs/php/deleteDepartmentByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: $(this).attr("data-id"),
    },
    success: function (result) {
      console.log(result);
      if (result.status.code == 200) {
        if (result.data[0].departmentCount == 0) {
          $("#deleteDepModal").modal("show");
          $("#deleteDepMessage").html(
            `Are you sure you want to delete <b>${result.data[0].departmentName}</b>?`
          );
        } else {
          $("#deleteDepWarningModal").modal("show");
          $("#deleteDepWarningMessage").html(
            `You cannot remove the entry for <b>${result.data[0].departmentName}</b> because it has <b>${result.data[0].departmentCount}</b> employees assigned to it.`
          );
        }
      } else {
        $("#deleteEmpModal .modal-title").replaceWith("Error retrieving data");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#deleteEmpModal .modal-title").replaceWith("Error retrieving data");
    },
  });
});

// -- Delete Dep Confirm -- //
$("#deleteDepConfirm").on("click", function () {
  console.log("clicked");
  $.ajax({
    url: "libs/php/deleteDepartment.php",
    type: "POST",
    dataType: "json",
    data: {
      id: delDepID,
    },
    success: function (result) {
      if (result.status.name == "ok") {
        allDepartmentData = result.data;
        $("#deleteDepModal").modal("hide");
        fillDepartmentTable(result.data);
        delDepToast.show();
      } else {
        console.log(result);
        $("#deleteDepModal").modal("hide");
        failDelDepToast.show();
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
});

// -------------------------------- LOCATIONS TAB ----------------------------- //

let delLocID;
let delLocName;

let newLocLoc;
let locLocID;

let locations = [];
let allLocationData;

// ----- LOCATION TAB FUNCTIONS ----- //

let updateLocationOptions = function (locations) {
  $("#selectEmpLoc").empty();
  $("#selectEmpLoc").append("<option>Select a location</option>");
  $.map(locations, function (location, i) {
    $("#selectEmpLoc").append(
      `<option value='${location.location.toLowerCase()}'>${
        location.location
      }</option>`
    );
  });

  $("#selectDepLoc").empty();
  $.map(locations, function (location, i) {
    $("#selectDepLoc").append(
      `<option value='${location.location.toLowerCase()}'>${
        location.location
      }</option>`
    );
  });
  $("#depLocSel").empty();
  $.map(locations, function (location, i) {
    $("#depLocSel").append(
      `<option value='${location.locationID}'>${location.location}</option>`
    );
  });
};

let fillLocationTable = (data) => {
  $("#locationTableBody").empty();
  locations = [];
  for (let i = 0; i < data.length; i++) {
    let location = data[i];
    locations.push(location);

    let row = $(`<tr id=locationRow'${[i]}'>`);

    // -- LOCATION COLUMN -- //
    let locationLocationCells = $("<td>")
      .addClass("align-middle text-nowrap")
      .html(location.location);

    row.append(locationLocationCells);

    // -- BUTTONS -- //
    let buttonCells = $("<td>").addClass("align-middle text-end text-nowrap");
    let editButtons = $("<button>")
      .addClass("btn btn-none btn-sm editBtn")
      .attr("data-bs-toggle", "modal")
      .attr("data-id", data[i].locationID)
      .attr("data-bs-target", "#editLocationModal");
    let editIcons = $("<i>").addClass("fa-solid fa-pencil fa-lg text-primary");
    let deleteButtons = $("<button>")
      .addClass("btn btn-none btn-sm ms-3 deleteLocBtn")
      .attr("data-id", data[i].locationID);
    let deleteIcons = $("<i>").addClass(
      "fa-regular fa-trash-can fa-lg text-danger"
    );

    editButtons.append(editIcons);
    deleteButtons.append(deleteIcons);
    buttonCells.append(editButtons);
    buttonCells.append(deleteButtons);
    row.append(buttonCells);

    $("#locationTableBody").append(row);
  }
  updateLocationOptions(locations);
  $("#locNumber").html(`${data.length} Locations`);
};

// ----- LOCATION TAB EVENT HANDLERS ----- //

// -- Edit Location Modal Show -- //
$("#editLocationModal").on("show.bs.modal", function (e) {
  console.log($(e.relatedTarget).attr("data-id"));

  $.ajax({
    url: "libs/php/getLocationByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: $(e.relatedTarget).attr("data-id"),
    },
    success: function (result) {
      if (result.status.code == 200) {
        console.log(result);
        newLocLoc = result.data[0].name;
        locLocID = result.data[0].id;

        $("#editLocInput").val(newLocLoc);
      } else {
        $("#editLocationModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#editLocationModal .modal-title").replaceWith("Error retrieving data");
    },
  });
});

$("#editLocInput").on("keyup", function () {
  newLocLoc = $(this).val();
});

// -- Edit Location Form Submit -- //
$("#editLocForm").on("submit", function (e) {
  e.preventDefault();
  $.ajax({
    url: "libs/php/updateLocation.php",
    type: "POST",
    dataType: "json",
    data: {
      location: newLocLoc,
      locationID: locLocID,
    },
    success: function (result) {
      if (result.status.name == "ok") {
        console.log(result);
        fillTable(result.allData);
        fillDepartmentTable(result.departmentData);
        fillLocationTable(result.locationData);
        allLocationData = result.locationData;
        $("#editLocationModal").modal("hide");
        locEditToast.show();
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
});

// -- Delete Loc Button Click -- //
$(document).on("click", ".deleteLocBtn", function () {
  delLocID = $(this).attr("data-id");
  $.ajax({
    url: "libs/php/deleteLocationByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: $(this).attr("data-id"),
    },
    success: function (result) {
      console.log(result);
      if (result.status.code == 200) {
        if (result.data[0].locationCount == 0) {
          $("#deleteLocModal").modal("show");
          $("#deleteLocMessage").html(
            `Are you sure you want to delete <b>${result.data[0].locationName}</b>?`
          );
        } else {
          $("#deleteLocWarningModal").modal("show");
          $("#deleteLocWarningMessage").html(
            `You cannot remove the entry for <b>${result.data[0].locationName}</b> because it has <b>${result.data[0].locationCount}</b> departments assigned to it.`
          );
        }
      } else {
        $("#deleteLocModal .modal-title").replaceWith("Error retrieving data");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#deleteLocModal .modal-title").replaceWith("Error retrieving data");
    },
  });
});

// -- Delete Loc Confirm -- //
$("#deleteLocConfirm").on("click", function () {
  $.ajax({
    url: "libs/php/deleteLocation.php",
    type: "POST",
    dataType: "json",
    data: {
      id: delLocID,
    },
    success: function (result) {
      if (result.status.name == "ok") {
        allLocationData = result.data;
        fillLocationTable(result.data);
        $("#deleteLocModal").modal("hide");
        delLocToast.show();
      } else {
        $("#deleteLocModal").modal("hide");
        failDelLocToast.show();
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
});

// ---------------- GET SELECTED TAB ----------------- //

let searchTerm;
let selectedTab = $(".active").attr("id");
if (selectedTab === "pills-employees-tab") {
  $("#searchBar").on("keyup", function () {
    searchTerm = $(this).val().toLowerCase(); // Get the current value of the input
    let filteredData = [];
    allEmployeeData.filter(function (val) {
      if (
        val.firstName.toLowerCase().startsWith(searchTerm) ||
        val.lastName.toLowerCase().startsWith(searchTerm)
      ) {
        filteredData.push(val);
      }
    });
    fillTable(filteredData);
  });
}

// ------------- SEARCH BAR FILTER FEATURE ----------- //

$(".nav-link").on("click", function () {
  if ($(this).hasClass("active")) {
    selectedTab = $(this).attr("id");

    if (selectedTab === "pills-employees-tab") {
      $("#filterButton").attr("disabled", false);
      $("#searchBar").on("keyup", function () {
        searchTerm = $(this).val().toLowerCase(); // Get the current value of the input
        let filteredData = [];
        allEmployeeData.filter(function (val) {
          if (
            val.firstName.toLowerCase().startsWith(searchTerm) ||
            val.lastName.toLowerCase().startsWith(searchTerm)
          ) {
            filteredData.push(val);
          }
        });
        fillTable(filteredData);
      });

      // Change to filter button to employee filter
    } else if (selectedTab === "pills-departments-tab") {
      $("#filterButton").attr("disabled", false);
      $("#searchBar").on("keyup", function () {
        searchTerm = $(this).val().toLowerCase();
        let filteredData = [];
        allDepartmentData.filter(function (val) {
          if (val.department.toLowerCase().startsWith(searchTerm)) {
            filteredData.push(val);
          }
        });
        fillDepartmentTable(filteredData);
      });
    } else if (selectedTab === "pills-locations-tab") {
      $("#filterButton").attr("disabled", true);
      $("#searchBar").on("keyup", function () {
        searchTerm = $(this).val().toLowerCase();
        let filteredData = [];
        allLocationData.filter(function (val) {
          if (val.location.toLowerCase().startsWith(searchTerm)) {
            filteredData.push(val);
          }
        });
        fillLocationTable(filteredData);
      });
    }
  }
});

// ------------- FILTER DATA FEATURE BY TAB  ----------- //

$("#filterButton").on("click", function () {
  // -- DEPARTMENTS TAB -- //
  if (selectedTab === "pills-departments-tab") {
    $("#depFilterModal").modal("show");

    let selectDepLoc;
    $("#selectDepLoc").on("change", function () {
      selectDepLoc = $(this).val();
    });

    $("#depFilterSave").on("click", function () {
      let filteredData = allDepartmentData.filter(function (val) {
        if (val.location.toLowerCase() === selectDepLoc) {
          return val;
        }
      });
      $("#departmentTableBody").empty();
      fillDepartmentTable(filteredData);
    });

    // -- EMPLOYEES TAB -- //
  } else if (selectedTab === "pills-employees-tab") {
    $("#filterModal").modal("show");

    let selectEmpDep;
    $("#selectEmpDep").on("change", function () {
      selectEmpDep = $(this).val();
    });

    let selectEmpLoc;
    $("#selectEmpLoc").on("change", function () {
      selectEmpLoc = $(this).val();
    });

    $("#empFilterSave").on("click", function () {
      let filteredData = allEmployeeData.filter(function (val) {
        const departmentMatches = val.department.toLowerCase() === selectEmpDep;
        const locationMatches = val.location.toLowerCase() === selectEmpLoc;

        if (selectEmpDep && selectEmpLoc) {
          return departmentMatches && locationMatches;
        } else {
          return departmentMatches || locationMatches;
        }
      });
      console.log(filteredData);
      if (filteredData.length === 0) {
      } else {
        fillTable(filteredData);
      }
    });
  }
});

// ------------------- ADD DATA FEATURE BY TAB ------------------- //

// --- ADDING NEW EMPLOYEE --- //
$("#plusButton").on("click", function () {
  if (selectedTab === "pills-employees-tab") {
    $("#addEmployeeModal").modal("show");

    $.map(departments, function (department, i) {
      $("#departmentSelect").append(
        `<option value='${department.departmentID}'>${department.department}</option>`
      );
    });

    // --- GETTING EMPLOYEE FORM DATA --- //

    empDepSelectID = $("#departmentSelect").val();
    empDepSelect = $("#departmentSelect option:selected").text();
    console.log(empDepSelect);
    console.log(empDepSelectID);
    addEmployeeFunc(empDepSelect, departments);

    $("#departmentSelect").on("change", function () {
      empDepSelectID = $(this).val();
      empDepSelect = $("#departmentSelect option:selected").text();
      addEmployeeFunc(empDepSelect, departments);
    });

    $("#firstNameInput").on("keyup", function () {
      empFirstName = $(this).val();
    });

    $("#lastNameInput").on("keyup", function () {
      empLastName = $(this).val();
    });

    $("#emailInput").on("keyup", function () {
      empEmail = $(this).val();
    });

    $("#jobInput").on("keyup", function () {
      empJob = $(this).val();
      console.log(empJob);
    });

    $("#cancelEmployeeBtn").on("click", function () {
      $("#emailInput").val("");
      $("#firstNameInput").val("");
      $("#lastNameInput").val("");
    });

    $("#addEmployeeBtn").on("click", function (e) {
      e.preventDefault();
      // -- EMP FORM VALIDATION -- //
      $("#addEmpForm").validate({
        rules: {
          firstName: "required",
          lastName: "required",
          empDepSel: "required",
          empLocation: "required",
          email: { required: true, email: true },
          jobTitle: "required",
        },
        messages: {
          firstName: "Please enter a first name.",
          lastName: "Please enter a last name.",
          empDepSel: "Please enter a email.",
          jobTitle: "Please enter a job title.",
        },
      });

      if ($("#addEmpForm").valid()) {
        $.ajax({
          url: "libs/php/insertEmployee.php",
          type: "POST",
          dataType: "json",
          data: {
            firstName: empFirstName,
            lastName: empLastName,
            department: empDepSelect,
            departmentID: empDepSelectID,
            location: empLocInput,
            email: empEmail,
            job: empJob,
          },
          success: function (result) {
            if (result.status.name == "ok") {
              allEmployeeData = result.data;
              fillTable(result.data);
              $("#addEmployeeModal").modal("hide");
              $("#firstNameInput").val("");
              $("#lastNameInput").val("");
              $("#departmentSelect").prop("selectedIndex", 0);
              $("#emailInput").val("");
              $("#jobInput").val("");
              addEmpToast.show();
            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
          },
        });
      } else {
        console.log("form not valid");
      }
    });

    // ---- ADD NEW DEPARTMENT ---- //
  } else if (selectedTab === "pills-departments-tab") {
    console.log(selectedTab);
    let depDepVal;

    $("#addDepartmentModal").modal("show");

    let depLocVal = $("#depLocSel").val();
    // console.log(depLocVal);

    $("#depLocSel").on("change", function () {
      depLocVal = $("#depLocSel").val();
    });

    $("#depDepInput").on("keyup", function () {
      depDepVal = $("#depDepInput").val();
    });

    $("#cancelDepBtn, #closeDepBtn").on("click", function () {
      $("#depDepInput").val("");
      $("#addDepartmentModal").modal("hide");
    });

    // -- DEP FORM VALIDATION -- //
    $("#addDepBtn").on("click", function (e) {
      e.preventDefault();

      $("#addDepForm").validate({
        rules: {
          depDepInput: "required",
          depLocSel: "required",
        },
        messages: {
          depDepInput: "Please enter a department name.",
          depLocSel: "Please select a department.",
        },
      });
      if ($("#addDepForm").valid()) {
        console.log(depDepVal);
        console.log(depLocVal);
        $.ajax({
          url: "libs/php/insertDepartment.php",
          type: "POST",
          dataType: "json",
          data: {
            department: depDepVal,
            locationID: depLocVal,
          },
          success: function (result) {
            if (result.status.name == "ok") {
              fillDepartmentTable(result.data);
              allDepartmentData = result.data;
              $("#addDepartmentModal").modal("hide");
              $("#depDepInput").val("");
              $("#depLocSel").prop("selectedIndex", 0);
              addDepToast.show();
            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
          },
        });
      } else {
        console.log("false");
      }
    });
    // --- ADD NEW LOCATION --- //
  } else if (selectedTab === "pills-locations-tab") {
    console.log(selectedTab);
    let locLocVal;
    $("#addLocationModal").modal("show");

    $("#locLocInput").on("keyup", function () {
      locLocVal = $(this).val();
      console.log(locLocVal);
    });
    // -- LOC FORM VALIDATION -- //
    $("#addLocBtn").on("click", function (e) {
      e.preventDefault();

      $("#addLocForm").validate({
        rules: {
          locLocInput: "required",
        },
        messages: {
          locLocInput: "Please enter a location.",
        },
      });
      if ($("#addLocForm").valid()) {
        console.log(locLocVal);
        $.ajax({
          url: "libs/php/insertLocation.php",
          type: "POST",
          dataType: "json",
          data: {
            location: locLocVal,
          },
          success: function (result) {
            if (result.status.name == "ok") {
              fillLocationTable(result.data);
              allLocationData = result.data;
              $("#addLocationModal").modal("hide");
              $("#locLocInput").val("");
              addLocToast.show();
            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
          },
        });
      } else {
        console.log("data not found");
      }
    });
    $("#cancelLocBtn").on("click", function () {
      $("#locLocInput").val("");
    });
  }
});

// ------------------- RESET DATA FEATURE BY TAB ------------------- //

$("#refreshBtn").on("click", function () {
  if (selectedTab === "pills-employees-tab") {
    $("#selectEmpLoc").prop("selectedIndex", 0);
    $("#selectEmpDep").prop("selectedIndex", 0);
    selectEmpLoc = "";
    selectEmpDep = "";
    fillTable(allEmployeeData);
  } else if (selectedTab === "pills-departments-tab") {
    $("#selectDepLoc").prop("selectedIndex", 0);
    selectDepLoc = null;
    console.log(selectDepLoc);
    fillDepartmentTable(allDepartmentData);
  } else if (selectedTab === "pills-locations-tab") {
    fillLocationTable(allLocationData);
  }
});

// ---------- REMOVING CLICK EVENT LISTENERS WHEN MODAL CLOSES ---------- //

$("#addEmployeeModal").on("hidden.bs.modal", function () {
  $("#addEmployeeBtn").off();
});

$("#addDepartmentModal").on("hidden.bs.modal", function () {
  $("#addDepBtn").off();
});

$("#addLocationModal").on("hidden.bs.modal", function () {
  $("#addLocBtn").off();
});

$(document).ready(function () {
  // ----------------- FETCHING TABLE DATA ----------------- //

  // --- LOADING EMPLOYEE TABLE --- //
  $.ajax({
    url: "libs/php/getAll.php",
    type: "POST",
    dataType: "json",
    success: function (result) {
      if (result.status.name == "ok") {
        allEmployeeData = result.data;
        fillTable(allEmployeeData);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      console.log(errorThrown);
    },
  });

  // --- LOADING DEPARTMENTS TABLE --- //

  $.ajax({
    url: "libs/php/getDepartments.php",
    type: "POST",
    dataType: "json",
    success: function (result) {
      if (result.status.name == "ok") {
        allDepartmentData = result.data;
        fillDepartmentTable(allDepartmentData);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      console.log(errorThrown);
    },
  });

  // --- LOADING LOCATIONS TABLE --- //

  $.ajax({
    url: "libs/php/getLocations.php",
    type: "POST",
    dataType: "json",
    success: function (result) {
      if (result.status.name == "ok") {
        allLocationData = result.data;
        fillLocationTable(allLocationData);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
});
