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

  let locFilterToast = new bootstrap.Toast(document.getElementById('locFilterToast'));

  let allEmployeeData;

  let fillTable = (data) => {
    console.log(data);
    for (let i = 0; i < data.length; i++) {
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
        .html(`${data[i].firstName}, ${data[i].lastName}`)
        .addClass("fw-bold text-start mb-0 employeeName");
      let jobs = $("<p>").addClass("text-muted text-start mb-0");
      let jobsData = $("<small>").html(data[i].jobTitle);

      jobs.append(jobsData);
      namesData.append(jobs);
      namesDiv.append(namesData);
      name_JobTableCell.append(namesDiv);
      row.append(name_JobTableCell);

      let emails = $("<td>")
        .addClass("cell-width employeeEmail")
        .attr("data-id", i);
      emails
        .html(data[i].email)
        .addClass("text-nowrap align-middle d-md-table-cell ps-3");
      row.append(emails);

      let department_locationCell = $("<td>")
        .addClass("cell-width pb-0 employeeDep")
        .attr("data-id", i);
      let departmentsDiv = $("<div>").addClass(
        "d-flex flex-column align-items-start employeeDep"
      );
      let departmentsData = $("<p>")
        .html(data[i].department)
        .addClass("fw-bold text-start mb-0");
      let locations = $("<p>").addClass("text-muted text-start mb-0");
      let locationsData = $("<small>").html(data[i].location);

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
      let editIcons = $("<i>").addClass(
        "fa-solid fa-pencil fa-lg text-primary"
      );
      let deleteButtons = $("<button>")
        .addClass("btn btn-none btn-sm ms-3")
        .attr("data-bs-toggle", "modal")
        .attr("data-bs-target", "#deleteEmployeeModal");
      let deleteIcons = $("<i>").addClass(
        "fa-regular fa-trash-can fa-lg text-danger"
      );

      editButtons.append(editIcons);
      deleteButtons.append(deleteIcons);
      buttonDiv.append(editButtons);
      buttonDiv.append(deleteButtons);
      buttonCells.append(buttonDiv);
      row.append(buttonCells);

      $("#employeeTableBody").append(row);
    }
  };

  let fillDepartmentTable = (data) => {
    for (let i = 0; i < data.length; i++) {
      let department = data[i].department;
      departments.push(department);

      let row = $(`<tr id=departmentRow'${[i]}'>`).addClass("d-flex");

      // -- DEPARTMENT COLUMN -- //
      let departmentDepartmentCells = $("<td>")
        .addClass("ps-4 departmentDepartmentCells")
        .attr("data-id", i);
      let departmentDepartmentDiv = $("<div>").addClass(
        "d-flex align-items-start"
      );
      let departmentDepartmentNames = $("<p>")
        .html(department)
        .addClass("fw-bold text-start mb-0 departmentName");

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
        .html(data[i].location)
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
      let editIcons = $("<i>").addClass(
        "fa-solid fa-pencil fa-lg text-primary"
      );
      let deleteButtons = $("<button>")
        .addClass("btn btn-none btn-sm ms-3")
        .attr("data-bs-toggle", "modal")
        .attr("data-bs-target", "#deleteDepartmentModal");
      let deleteIcons = $("<i>").addClass(
        "fa-regular fa-trash-can fa-lg text-danger"
      );

      editButtons.append(editIcons);
      deleteButtons.append(deleteIcons);
      buttonDiv.append(editButtons);
      buttonDiv.append(deleteButtons);
      buttonCells.append(buttonDiv);
      row.append(buttonCells);

      $("#departmentTableBody").append(row);
    }
  };

  let fillLocationTable = (data) => {
    for (let i = 0; i < data.length; i++) {
      let location = data[i].location;
      locations.push(location);

      let row = $(`<tr id=locationRow'${[i]}'>`).addClass(
        "d-flex align-items-center"
      );

      // -- LOCATION COLUMN -- //
      let locationLocationCells = $("<td>")
        .addClass("ps-4 locationLocationCells")
        .attr("data-id", i);
      let locationLocationDiv = $("<div>").addClass("d-flex align-items-start");
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
      let editIcons = $("<i>").addClass(
        "fa-solid fa-pencil fa-lg text-primary"
      );
      let deleteButtons = $("<button>")
        .addClass("btn btn-none btn-sm ms-3")
        .attr("data-bs-toggle", "modal")
        .attr("data-bs-target", "#deleteDepartmentModal");
      let deleteIcons = $("<i>").addClass(
        "fa-regular fa-trash-can fa-lg text-danger"
      );

      editButtons.append(editIcons);
      deleteButtons.append(deleteIcons);
      buttonDiv.append(editButtons);
      buttonDiv.append(deleteButtons);
      buttonCells.append(buttonDiv);
      row.append(buttonCells);

      $("#locationTableBody").append(row);
    }
  };

  // -------- LOADING EMPLOYEE TABLE -------- //
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

  // -------- LOADING DEPARTMENTS TABLE ----------- //

  let departments = [];
  let allDepartmentData;

  $.ajax({
    url: "libs/php/getDepartments.php",
    type: "POST",
    dataType: "json",
    success: function (result) {
      if (result.status.name == "ok") {
        allDepartmentData = result.data;
        fillDepartmentTable(allDepartmentData);
      }

      //-- Create Department Filter Options -- //
      $.map(departments, function (department, i) {
        $("#selectEmpDep").append(
          `<option value='${department.toLowerCase()}'>${department}</option>`
        );
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      console.log(errorThrown);
    },
  });

  // -------- LOADING LOCATIONS TABLE ----------- //

  let locations = [];
  let allLocationData;

  $.ajax({
    url: "libs/php/getLocations.php",
    type: "POST",
    dataType: "json",
    success: function (result) {
      if (result.status.name == "ok") {
        console.log(result);
        allLocationData = result.data;
        fillLocationTable(allLocationData);
      }
      //-- Create Location Filter Options -- //
      $.map(locations, function (location, i) {
        $("#selectEmpLoc").append(
          `<option value='${location.toLowerCase()}'>${location}</option>`
        );
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      console.log(errorThrown);
    },
  });

  // ------------- GET SELECTED TAB ----------- //

  let searchTerm;
  let selectedTab = $(".active").attr("id");
  if (selectedTab === "pills-employees-tab") {
    $("#searchBar").on("keyup", function () {
      searchTerm = $(this).val().toLowerCase(); // Get the current value of the input
      console.log(allEmployeeData);
      let filteredData = allEmployeeData.filter(function (val) {
        if (
          val.firstName.toLowerCase().startsWith(searchTerm) ||
          val.lastName.toLowerCase().startsWith(searchTerm)
        ) {
          return val;
        }
      });
      console.log(filteredData);
      $("#employeeTableBody").empty();
      fillTable(filteredData);
    });
  }

  // ------------- FILTERING DATA FROM SEARCH BAR ----------- //

  $(".nav-link").on("click", function () {

    if ($(this).hasClass("active")) {

      selectedTab = $(this).attr("id");

      if (selectedTab === "pills-employees-tab") {
        $('#filterButton').attr('disabled', false);
        $("#searchBar").on("keyup", function () {
          searchTerm = $(this).val().toLowerCase(); // Get the current value of the input
          let filteredData = allEmployeeData.filter(function (val) {
            if (
              val.firstName.toLowerCase().startsWith(searchTerm) ||
              val.lastName.toLowerCase().startsWith(searchTerm)
            ) {
              return val;
            }
          });
          $("#employeeTableBody").empty();

          fillTable(filteredData);
        });

        // Change to filter button to employee filter
      } else if (selectedTab === "pills-departments-tab") {

        $('#filterButton').attr('disabled', false);
        $("#searchBar").on("keyup", function () {
          searchTerm = $(this).val().toLowerCase();
          let filteredData = allDepartmentData.filter(function (val) {
            if (val.department.toLowerCase().startsWith(searchTerm)) {
              return val;
            }
          });
          $("#departmentTableBody").empty();
          fillDepartmentTable(filteredData);

        });
      } else if (selectedTab === "pills-locations-tab") {

        $('#filterButton').attr('disabled', true);
        $("#searchBar").on("keyup", function () {
          searchTerm = $(this).val().toLowerCase();
          let filteredData = allLocationData.filter(function (val) {
            if (val.location.toLowerCase().startsWith(searchTerm)) {
              return val;
            }
          });
          $("#locationTableBody").empty();

          fillLocationTable(filteredData);
        });
      }
    }
  });



  // ------------- CHANGING FILTER MODAL BY TAB ----------- //


  $('#filterButton').on('click', function () {

    // -- DEPARTMENTS TAB -- //
    if (selectedTab === 'pills-departments-tab') {
     
      $("#depFilterModal").modal('show');

     $.map(locations, function (location, i ) {
      $('#selectDepLoc').append(`<option value='${location.toLowerCase()}'>${location}</option>`)
     }) 

     let selectDepLoc;
     $("#selectDepLoc").on("change", function () {
       selectDepLoc = $(this).val();
       console.log(selectDepLoc);
     });
   
     $("#depFilterReset").on("click", function () {
      $("#selectDepLoc").prop("selectedIndex", 0);
      selectDepLoc = null;
      console.log(selectDepLoc)
      $("#departmentTableBody").empty();
      fillDepartmentTable(allDepartmentData);
    });
  
    $("#depFilterConfirm").on("click", function () {
      let filteredData = allDepartmentData.filter(function (val) {
        if (val.location.toLowerCase() === selectDepLoc) {
          return val
        }
      });
      console.log(filteredData);
      $("#departmentTableBody").empty();
      fillDepartmentTable(filteredData);
    })

      // -- EMPLOYEES TAB -- //
    } else if (selectedTab === 'pills-employees-tab') {
      console.log(selectedTab);
      $("#filterModal").modal('show');

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
    selectEmpLoc = '';
    selectEmpDep = '';
    console.log(selectEmpDep, selectEmpLoc);
    $("#employeeTableBody").empty();
    fillTable(allEmployeeData);
  });

  $("#empFilterConfirm").on("click", function () {
    let filteredData = allEmployeeData.filter(function (val) {
      const departmentMatches = val.department.toLowerCase() === selectEmpDep; // if a value is selected
      const locationMatches = val.location.toLowerCase() === selectEmpLoc; // if a value is selected
  
      if (selectEmpDep && selectEmpLoc) {
        return departmentMatches && locationMatches;
      } else {
        return departmentMatches || locationMatches;
      }
    });
  
    $("#employeeTableBody").empty();
    fillTable(filteredData);
  });
    }
  })


    // ------------- ADD OPTIONS BY TAB ----------- //

  $('#plusButton').on('click', function () {
    console.log('added');
    if (selectedTab === 'pills-employees-tab') {
      console.log(selectedTab);
      $("#addEmployeeModal").modal('show');

      
    } else if (selectedTab === 'pills-departments-tab') {
      console.log(selectedTab);
    }
    else if (selectedTab === 'pills-locations-tab') {
      console.log(selectedTab);
    }

  })

















  
});
