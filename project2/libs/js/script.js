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
let newEmail;
let newJobTitle;
let employeeID;
let departmentID;
let delID;

// ---------- EMPLOYEES TAB FUNCTIONS ---------- //

let addEmployeeFunc = function (selectVal, departments) {
  console.log(selectVal);
  let empLocObj = $.grep(departments, function (department, i) {
    return department.department.toLowerCase() === selectVal.toLowerCase();
  });
  empLocInput = empLocObj[0].location;
  $("#locationInput").val(empLocInput);
};

function deleteEmployee(firstName, lastName, id) {
  console.log(firstName, lastName, id);
  delID = id;
  $("#deleteEmpMessage").html(
    `Are you sure you want to delete <b>${firstName} ${lastName}<b>?`
  );
  $("#deleteEmpModal").modal("show");
}

function editEmpIDFunc(selectVal, departments) {
  console.log(selectVal);
  let empObj = $.grep(departments, function (department, i) {
    return department.department.toLowerCase() === selectVal.toLowerCase();
  });
  departmentID = empObj[0].departmentID;
  console.log(departmentID);
}

function openEditEmpModal(
  firstName,
  lastName,
  jobTitle,
  email,
  department,
  id,
  depID
) {
  newFirstName = firstName;
  newLastName = lastName;
  newDepartment = department;
  newEmail = email;
  newJobTitle = jobTitle;
  employeeID = id;
  departmentID = depID;

  let selectedOption = $("#editEmpDepSel option").filter(function () {
    return $(this).text() === department;
  });

  selectedOption.prop("selected", true);
  console.log(newDepartment);

  $("#editEmpTitle").html(`Edit ${firstName}, ${lastName}`);
  $("#editFirstName").val(firstName);
  $("#editLastName").val(lastName);
  $("#editEmail").val(email);
  $("#editJob").val(jobTitle);

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
    newDepartment = $(this).val();
    editEmpIDFunc(newDepartment, departments);
  });
  $("#editEmpModal").modal("show");
}

let fillTable = (data) => {
  $("#employeeTableBody").empty();
  for (let i = 0; i < data.length; i++) {
    let row = $(`<tr id=employeeRow'${[i]}'>`);

    // -- NAME CELLS -- //
    let nameTableCell = $("<td>")
      .addClass("align-middle text-nowrap")
      .attr("data-id", i).html(`${data[i].firstName}, ${data[i].lastName}`)

    row.append(nameTableCell);

    // -- JOB CELLS -- //
    let jobTableCell = $("<td>").addClass("align-middle text-nowrap d-none d-sm-table-cell").attr("data-id", i).html(data[i].jobTitle)
      .addClass("text-start mb-0");
    row.append(jobTableCell);

    // -- DEPARTMENT CELLS -- //
    let departmentCell = $("<td>")
      .addClass("align-middle text-nowrap d-none d-md-table-cell")
      .attr("data-id", i).html(data[i].department);
   
    row.append(departmentCell);

    // -- LOCATION CELLS -- //
    let locationsCell = $("<td>")
      .addClass("align-middle text-nowrap d-none d-lg-table-cell")
      .attr("data-id", i).html(data[i].location)
    row.append(locationsCell);


    // -- EMAIL CELLS -- //
    let emails = $("<td>")
      .addClass("align-middle text-nowrap d-none d-xl-table-cell")
      .attr("data-id", i).html(data[i].email)
    row.append(emails);


    // -- BUTTONS -- //
    let buttonCells = $("<td>").addClass('align-middle text-end text-nowrap');
    let editButtons = $("<button>").addClass("btn btn-none btn-sm editBtn");
    let editIcons = $("<i>").addClass("fa-solid fa-pencil fa-lg text-primary");
    let deleteButtons = $("<button>")
      .addClass("btn btn-none btn-sm ms-3 deleteBtn")
      .attr("data-bs-target", "#deleteEmployeeModal");
    let deleteIcons = $("<i>").addClass(
      "fa-regular fa-trash-can fa-lg text-danger"
    );

    editButtons.append(editIcons);
    deleteButtons.append(deleteIcons);
    buttonCells.append(editButtons);
    buttonCells.append(deleteButtons);
    row.append(buttonCells);

    editButtons.on("click", function () {
      let firstName = data[i].firstName;
      let lastName = data[i].lastName;
      let jobTitle = data[i].jobTitle;
      let email = data[i].email;
      let department = data[i].department;
      let location = data[i].location;
      let id = data[i].id;
      let departmentID = data[i].departmentID;

      openEditEmpModal(
        firstName,
        lastName,
        jobTitle,
        email,
        department,
        id,
        departmentID
      );
    });

    deleteButtons.on("click", function () {
      let firstName = data[i].firstName;
      let lastName = data[i].lastName;
      let id = data[i].id;
      deleteEmployee(firstName, lastName, id);
    });

    $("#employeeTableBody").append(row);
  }
  updateDepartmentOptions(departments);
  $("#empNumber").html(`${data.length} Employees`);
};

// ---------- EMPLOYEES TAB EVENT HANDLERS ---------- //

$("#deleteEmpConfirm").on("click", function () {
  console.log(delID);
  $.ajax({
    url: "libs/php/deleteEmployee.php",
    type: "POST",
    dataType: "json",
    data: {
      id: delID,
    },
    success: function (result) {
      fillTable(result.data);
      allEmployeeData = result.data;
      delEmpToast.show();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
  $("#deleteEmpModal").modal("hide");
});

$("#cancelEditEmpBtn").on("click", function () {
  $("#editEmpTitle").html("");
  $("#editFirstName").val("");
  $("#editLastName").val("");
  $("#editEmail").val("");
  $("#editJob").val("");
});

$("#editEmpBtn").on("click", function (e) {
  e.preventDefault();
  $("#editEmpForm").validate({
    rules: {
      editFirstName: "required",
      editLastName: "required",
      editEmpDepSel: "required",
      editEmpLoc: "required",
      editEmail: {
        required: true,
        email: true,
      },
      editJob: "required",
    },
    messages: {
      editFirstName: "Please enter a first name.",
      editLastName: "Please enter a last name",
      editJob: "Please enter a job title.",
      editEmail: "Please enter a valid email address.",
    },
  });
  if ($("#editEmpForm").valid()) {
    console.log("valid");
    console.log(departmentID);
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
        employeeID,
        departmentID,
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
  } else {
    console.log("invalid");
  }
});

// -------------------------------- DEPARTMENTS TAB ----------------------------- //

let delDepID;
let delDepName;

let departments = [];
let allDepartmentData;

let newDepLoc;
let newDepDep;
let newDepId;
let locId;

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
  $("#editEmpDepSel").empty();
  $.map(departments, function (location, i) {
    $("#editEmpDepSel").append(
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

function editDepIDFunc(selectLoc) {
  console.log(selectLoc);
  let depObj = $.grep(locations, function (location, i) {
    return location.location.toLowerCase() === selectLoc.toLowerCase();
  });
  locId = depObj[0].locationID;
  console.log(locId);
}

function openEditDepModal(department, location, depID) {
  newDepLoc = location;
  newDepDep = department;
  newDepId = depID;

  editDepIDFunc(location);

  $("#editDepInput").val(department);

  let selectedOption = $("#editDepLocSel option").filter(function () {
    return $(this).text() === location;
  });
  selectedOption.prop("selected", true);

  $("#editDepLocSel").on("change", function () {
    newDepLoc = $(this).val();
    editDepIDFunc(newDepLoc);
  });
  $("#editDepInput").on("keyup", function () {
    newDepDep = $(this).val();
  });
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
      .addClass('align-middle text-nowrap')
      .attr("data-id", i) .html(data[i].department);
  
    row.append(departmentDepartmentCells);

    // -- LOCATION COLUMN -- //
    let departmentLocationCells = $("<td>")
      .addClass("align-middle text-nowrap d-none d-md-table-cell")
      .attr("data-id", i) .html(data[i].location);
    row.append(departmentLocationCells);

    // -- BUTTONS -- //
    let buttonCells = $("<td>").addClass("align-middle text-end text-nowrap");
    let editButtons = $("<button>")
      .addClass("btn btn-none btn-sm editBtn")
      .attr("data-bs-toggle", "modal")
      .attr("data-bs-target", "#editDepartmentModal");
    let editIcons = $("<i>").addClass("fa-solid fa-pencil fa-lg text-primary");
    let deleteButtons = $("<button>")
      .addClass("btn btn-none btn-sm ms-3 deleteBtn")
      .attr("data-bs-target", "#deleteDepartmentModal");
    let deleteIcons = $("<i>").addClass(
      "fa-regular fa-trash-can fa-lg text-danger"
    );

    editButtons.append(editIcons);
    deleteButtons.append(deleteIcons);
    buttonCells.append(editButtons);
    buttonCells.append(deleteButtons);
    row.append(buttonCells);

    $("#departmentTableBody").append(row);

    editButtons.on("click", function () {
      let editDep = data[i].department;
      let editDepLoc = data[i].location;
      let editDepID = data[i].departmentID;
      openEditDepModal(editDep, editDepLoc, editDepID);
    });

    deleteButtons.on("click", function () {
      let depId = data[i].departmentID;
      let departmentName = data[i].department;
      deleteDepartment(departmentName, depId);
    });
  }
  updateDepartmentOptions(departments);
  $("#depNumber").html(`${data.length} Departments`);
};

// ----- DEPARTMENT EVENT HANDLERS ----- //

$("#deleteDepConfirm").on("click", function () {
  console.log("clicked");
  $.ajax({
    url: "libs/php/deleteDepartment.php",
    type: "POST",
    dataType: "json",
    data: {
      id: delDepID,
      department: delDepName,
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

$("#editDepBtn").on("click", function (e) {
  e.preventDefault();
  $("#editDepForm").validate({
    rules: {
      editDepLocSel: "required",
      editDepInput: "required",
    },
    messages: {
      editDepInput: "Please enter a department.",
      editDepLocSel: "Please select a location",
    },
  });
  if ($("#editDepForm").valid()) {
    console.log(locId, newDepLoc, newDepDep, newDepId);
    $.ajax({
      url: "libs/php/updateDepartment.php",
      type: "POST",
      dataType: "json",
      data: {
        locationID: locId,
        department: newDepDep,
        departmentID: newDepId,
        location: newDepLoc,
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
  } else {
    console.log("invalid");
  }
});

// -------------------------------- LOCATIONS TAB ----------------------------- //

let delLocID;
let delLocName;

let newLocLoc;
let locLocID;

let locations = [];
let allLocationData;

// ----- LOCATION TAB FUNCTIONS ----- //

function openEditLocModal(location, locationID) {
  newLocLoc = location;
  locLocID = locationID;
  $("#editLocInput").val(location);
  $("#editLocInput").on("keyup", function () {
    newLocLoc = $(this).val();
  });
}

function deleteLocation(locationName, id) {
  delLocID = id;
  delLocName = locationName;
  $("#deleteLocMessage").html(
    `Are you sure you want to delete <b>${locationName}</b>?`
  );
  $("#deleteLocModal").modal("show");
}

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

  $("#editDepLocSel").empty();
  $.map(locations, function (location, i) {
    $("#editDepLocSel").append(
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
      .attr("data-id", i).html(location.location);
   
    row.append(locationLocationCells);

    // -- BUTTONS -- //
    let buttonCells = $("<td>").addClass("align-middle text-end text-nowrap");
    let editButtons = $("<button>")
      .addClass("btn btn-none btn-sm editBtn")
      .attr("data-bs-toggle", "modal")
      .attr("data-bs-target", "#editLocationModal");
    let editIcons = $("<i>").addClass("fa-solid fa-pencil fa-lg text-primary");
    let deleteButtons = $("<button>")
      .addClass("btn btn-none btn-sm ms-3 deleteBtn")
      .attr("data-bs-target", "#deleteDepartmentModal");
    let deleteIcons = $("<i>").addClass(
      "fa-regular fa-trash-can fa-lg text-danger"
    );

    editButtons.append(editIcons);
    deleteButtons.append(deleteIcons);
    buttonCells.append(editButtons);
    buttonCells.append(deleteButtons);
    row.append(buttonCells);

    $("#locationTableBody").append(row);

    editButtons.on("click", function () {
      let editLocation = location.location;
      let locationID = location.locationID;
      openEditLocModal(editLocation, locationID);
    });

    deleteButtons.on("click", function () {
      let locName = location.location;
      let LocID = location.locationID;
      deleteLocation(locName, LocID);
    });
  }
  updateLocationOptions(locations);
  $("#locNumber").html(`${data.length} Locations`);
};

// ----- LOCATION TAB EVENT HANDLERS ----- //

$("#deleteLocConfirm").on("click", function () {
  $.ajax({
    url: "libs/php/deleteLocation.php",
    type: "POST",
    dataType: "json",
    data: {
      id: delLocID,
      location: delLocName,
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

$("#editLocBtn").on("click", function (e) {
  e.preventDefault();

  $("#editLocForm").validate({
    rules: {
      editLocInput: "required",
    },
    messages: {
      editLocInput: "Please enter a location.",
    },
  });
  if ($("#editLocForm").valid()) {
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
  } else {
    console.log("invalid");
  }
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
      console.log(departments);
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
      // console.log(locations)
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
      console.log(selectDepLoc);
    });

    $("#depFilterReset").on("click", function () {
      $("#selectDepLoc").prop("selectedIndex", 0);
      selectDepLoc = null;
      console.log(selectDepLoc);
      $("#departmentTableBody").empty();
      fillDepartmentTable(allDepartmentData);
    });

    $("#depFilterConfirm").on("click", function () {
      let filteredData = allDepartmentData.filter(function (val) {
        if (val.location.toLowerCase() === selectDepLoc) {
          return val;
        }
      });
      console.log(filteredData);
      $("#departmentTableBody").empty();
      fillDepartmentTable(filteredData);
    });

    // -- EMPLOYEES TAB -- //
  } else if (selectedTab === "pills-employees-tab") {
    console.log(selectedTab);
    $("#filterModal").modal("show");

    let selectEmpDep;
    $("#selectEmpDep").on("change", function () {
      selectEmpDep = $(this).val();
      console.log(selectEmpDep);
    });

    let selectEmpLoc;
    $("#selectEmpLoc").on("change", function () {
      selectEmpLoc = $(this).val();
      console.log(selectEmpLoc);
    });

    $("#empFilterReset").on("click", function () {
      $("#selectEmpLoc").prop("selectedIndex", 0);
      $("#selectEmpDep").prop("selectedIndex", 0);
      selectEmpLoc = "";
      selectEmpDep = "";
      fillTable(allEmployeeData);
    });

    $("#empFilterConfirm").on("click", function () {
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
    console.log(selectedTab);
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
      console.log(empFirstName);
    });

    $("#lastNameInput").on("keyup", function () {
      empLastName = $(this).val();
      console.log(empLastName);
    });

    $("#emailInput").on("keyup", function () {
      empEmail = $(this).val();
      console.log(empEmail);
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

    // --------------- ADD NEW DEPARTMENT ----------- //
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
