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
  let allEmployeeData;

  let fillTable = (data) => {
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
        .addClass("btn btn-none btn-sm editBtn")
        // .attr("data-bs-toggle", "modal")
        // .attr("data-bs-target", "#editEmployeeModal");
      let editIcons = $("<i>").addClass(
        "fa-solid fa-pencil fa-lg text-primary"
      );
      let deleteButtons = $("<button>")
        .addClass("btn btn-none btn-sm ms-3 deleteBtn")
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


      editButtons.on("click", function () {
        let firstName = data[i].firstName;
        let lastName = data[i].lastName;
        let jobTitle = data[i].jobTitle;
        let email = data[i].email;
        let department = data[i].department;
        let location = data[i].location;
        let id = data[i].id;
        let departmentID = data[i].departmentID;
        console.log(departmentID);

        openEditEmpModal(firstName, lastName, jobTitle, email, department, id, departmentID)
      });



      $("#employeeTableBody").append(row);
    }
  };

  let newFirstName;
  let newLastName;
  let newDepartment
  let newEmail;
  let newJobTitle;
  let employeeID;
  let departmentID;
  let depOption;
  

  function editEmpIDFunc (selectVal, departments) {
    console.log(selectVal);
    let empObj = $.grep(departments, function (department, i) {
      return department.department.toLowerCase() === selectVal.toLowerCase();
    });
    departmentID = empObj[0].departmentID;
    console.log(departmentID);
  };



function openEditEmpModal(firstName, lastName, jobTitle, email, department,id, depID) {

  newFirstName = firstName;
  newLastName = lastName;
  newDepartment = department;
  newEmail =  email;
  newJobTitle = jobTitle;
  employeeID = id;
  departmentID = depID;


  let selectedOption = $('#editEmpDepSel option').filter(function () {
    return $(this).text() === department;
  });

  selectedOption.prop("selected", true);
  console.log(newDepartment);



  $('#editEmpTitle').html(`Edit ${firstName}, ${lastName}`);
  $('#editFirstName').val(firstName);
  $('#editLastName').val(lastName);
  $('#editEmail').val(email);
  $('#editJob').val(jobTitle);


  $('#editFirstName').on('keyup', function() {
    newFirstName = $(this).val()
    console.log(newFirstName)
  })
  $('#editLastName').on('keyup', function() {
    newLastName = $(this).val();
    console.log(newLastName)
  })
  $('#editEmail').on('keyup', function() {
    newEmail = $(this).val();
    console.log(newEmail)
  })
  $('#editJob').on('keyup', function() {
    newJobTitle = $(this).val();
    console.log(newJobTitle)
  })

  $('#editEmpDepSel').on('change', function() {
    newDepartment = $(this).val();
    editEmpIDFunc(newDepartment, departments)
 
  })

  $('#editEmpModal').modal('show');

}


$('#cancelEditEmpBtn').on('click', function () {
  $('#editEmpTitle').html('');
  $('#editFirstName').val('');
  $('#editLastName').val('');
  $('#editEmail').val('');
  $('#editJob').val('');
})



$('#editEmpBtn').on('click', function (e) {
  e.preventDefault();
  $('#editEmpForm').validate({
    rules: {
      editFirstName: 'required',
      editLastName: 'required',
      editEmpDepSel: 'required',
      editEmpLoc: 'required',
      editEmail: {
        required: true,
        email: true
      },
      editJob: 'required'

    },
    messages: {
        editFirstName: 'Please enter a first name.',
        editLastName: 'Please enter a last name',
        editJob: 'Please enter a job title.',
        editEmail: 'Please enter a valid email address.'
    }
    });
    if ($('#editEmpForm').valid()) {
      console.log('valid');
      console.log(departmentID);
      $.ajax({
        url: "libs/php/getEmployeeByID.php",
        type: "POST",
        dataType: "json",
        data: { newFirstName, newLastName, newDepartment, newEmail, newJobTitle, employeeID, departmentID},
        success: function (result) {
          if (result.status.name == "ok") {
            $("#employeeTableBody").empty();
            fillTable(result.data)

            $('#editEmpModal').modal('hide');
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(textStatus);
          console.log(errorThrown);
        },
      });
      $('#locLocInput').val('');
    } else {
      console.log('invalid');
    }
  
  
  
})




  let fillDepartmentTable = (data) => {
    departments = [];
    $("#departmentTableBody").empty();
    for (let i = 0; i < data.length; i++) {
      let department = data[i];
      departments.push(department);

      let row = $(`<tr id=departmentRow${[i]}>`).addClass("d-flex");

      // -- DEPARTMENT COLUMN -- //
      let departmentDepartmentCells = $("<td>")
        .addClass("ps-4 departmentDepartmentCells")
        .attr("data-id", i);
      let departmentDepartmentDiv = $("<div>").addClass(
        "d-flex align-items-start"
      );
      let departmentDepartmentNames = $("<p>")
        .html(data[i].department)
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
        .addClass("btn btn-none btn-sm editBtn")
        .attr("data-bs-toggle", "modal")
        .attr("data-bs-target", "#editDepartmentModal");
      let editIcons = $("<i>").addClass(
        "fa-solid fa-pencil fa-lg text-primary"
      );
      let deleteButtons = $("<button>")
        .addClass("btn btn-none btn-sm ms-3 deleteBtn")
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
    locations = [];
    for (let i = 0; i < data.length; i++) {
      let location = data[i];
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
        .html(location.location)
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
        .addClass("btn btn-none btn-sm editBtn")
        .attr("data-bs-toggle", "modal")
        .attr("data-bs-target", "#editDepartmentModal");
      let editIcons = $("<i>").addClass(
        "fa-solid fa-pencil fa-lg text-primary"
      );
      let deleteButtons = $("<button>")
        .addClass("btn btn-none btn-sm ms-3 deleteBtn")
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
  let updateDepartmentOptions = function (location) {
    $("#selectEmpDep").empty();
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


  }

  $.ajax({
    url: "libs/php/getDepartments.php",
    type: "POST",
    dataType: "json",
    success: function (result) {
      if (result.status.name == "ok") {
        allDepartmentData = result.data;
        fillDepartmentTable(allDepartmentData);
        updateDepartmentOptions(departments);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      console.log(errorThrown);
    },
  });

  // -------- LOADING LOCATIONS TABLE ----------- //

  let locations = [];
  let allLocationData;
  let updateLocationOptions = function (locations) {
    $("#selectEmpLoc").empty()
    $.map(locations, function (location, i) {
      $("#selectEmpLoc").append(
        `<option value='${location.location.toLowerCase()}'>${location.location}</option>`
      );
    });

    $("#selectDepLoc").empty()
    $.map(locations, function (location, i) {
      $("#selectDepLoc").append(
        `<option value='${location.location.toLowerCase()}'>${location.location}</option>`
      );
    });

    // $("#editEmpLoc").empty()
    // $.map(locations, function (location, i) {
    //   $("#editEmpLoc").append(
    //     `<option value='${location.location.toLowerCase()}'>${location.location}</option>`
    //   );
    // });

  }

  $.ajax({
    url: "libs/php/getLocations.php",
    type: "POST",
    dataType: "json",
    success: function (result) {
      if (result.status.name == "ok") {
        allLocationData = result.data;
        fillLocationTable(allLocationData);
        updateLocationOptions(locations);
      }
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
        $("#filterButton").attr("disabled", false);
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
        $("#filterButton").attr("disabled", false);
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
        $("#filterButton").attr("disabled", true);
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

  $("#filterButton").on("click", function () {
    // -- DEPARTMENTS TAB -- //
    if (selectedTab === "pills-departments-tab") {
      $("#depFilterModal").modal("show");

      updateLocationOptions(locations);

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
        console.log(selectEmpDep, selectEmpLoc);
        $("#employeeTableBody").empty();
        fillTable(allEmployeeData);
      });

      $("#empFilterConfirm").on("click", function () {
        let filteredData = allEmployeeData.filter(function (val) {
          const departmentMatches =
            val.department.toLowerCase() === selectEmpDep; // if a value is selected
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
  });




  // ------------- ADD OPTIONS BY TAB ----------- //

  let empLocInput;
  let empDepSelect;
  let empDepSelectID;
  let empFirstName;
  let empLastName;
  let empEmail;
  let empJob;

  let addEmployeeFunc = function (selectVal, departments) {
    console.log(selectVal);
    let empLocObj = $.grep(departments, function (department, i) {
      return department.department.toLowerCase() === selectVal.toLowerCase();
    });
    empLocInput = empLocObj[0].location;
    $("#locationInput").val(empLocInput);
  };


  $("#plusButton").on("click", function () {

    if (selectedTab === "pills-employees-tab") {
      console.log(selectedTab);
      $("#addEmployeeModal").modal("show");

      $.map(departments, function (department, i) {
        $("#departmentSelect").append(
          `<option value='${department.departmentID}'>${
            department.department
          }</option>`
        );
      });

      // ---------- GETTING EMPLOYEE FORM DATA ----------- //

      empDepSelectID = $("#departmentSelect").val()
      empDepSelect = $("#departmentSelect option:selected").text()
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

      $('#cancelEmployeeBtn').on('click', function () {
        $("#emailInput").val('');
        $("#firstNameInput").val('');
        $("#lastNameInput").val('');
      })

 // ---------- ADDING NEW EMPLOYEE ----------- //
      $('#addEmployeeBtn').on('click', function(e) {
        e.preventDefault()

        $('#addEmpForm').validate({
          rules: {
            firstName: 'required',
            lastName: 'required',
            empDepSel: 'required',
            empLocation: 'required',
            email: { required: true,
              email: true
            },
            jobTitle: 'required'
          },
          messages: {
            firstName: 'Please enter a first name.',
            lastName: 'Please enter a last name.',
            empDepSel: 'Please enter a email.',
            jobTitle: 'Please enter a job title.'
          }
          });

          if ($('#addEmpForm').valid()) {

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
            job: empJob
          },
          success: function (result) {
            if (result.status.name == "ok") {
              console.log(result);
              $.ajax({
                url: "libs/php/getAll.php",
                type: "POST",
                dataType: "json",
                success: function (result) {
                  if (result.status.name == "ok") {
                    $("#employeeTableBody").empty();
                    allEmployeeData = result.data;
                    fillTable(allEmployeeData);
                    //ADD A TOAST TO CONFIRM data added
                  } else {
                    // TOAST TO SAY THERE WAS AN ERROR
                  }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                  console.log(textStatus);
                  console.log(errorThrown);
                },
              });
            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
          },
        });

        $("#addEmployeeModal").modal("hide");
        $("#firstNameInput").val('');
        $("#lastNameInput").val('');
        $("#departmentSelect").prop("selectedIndex", 0);
        $("#emailInput").val('');
        $("#jobInput").val('');
          } else {
            console.log('form not valid')
          }
      })
    

 // ---------- ADD NEW DEPARTMENT ----------- //
    } else if (selectedTab === "pills-departments-tab") {
      console.log(selectedTab);
      let depDepVal


      $("#addDepartmentModal").modal("show");

      $.map(locations, function(location, i) {
        $('#depLocSelect').append(`<option value='${location.locationID}'>${
          location.location
        }</option>`)
      })

      let depLocVal = $('#depLocSelect').val();

      $('#depLocSelect').on('change', function() {
        depLocVal = $('#depLocSelect').val()
        console.log(depLocVal);
      })

      $('#depDepInput').on('keyup', function() {
        depDepVal = $('#depDepInput').val()
        console.log(depDepVal);
      })

      $('#cancelDepBtn').on('click', function () {
        $('#depDepInput').val('');
      })


      $('#addDepBtn').on('click', function(e) {
        e.preventDefault()

        $('#addDepForm').validate({
          rules: {
            depDepInput: 'required',
            depLocSel: 'required'
          },
          messages: {
            depDepInput: 'Please enter a department name.',
            depLocSel: 'Please select a department.'
          }
          });

          if ($('#addDepForm').valid()) {
            console.log(depDepVal);
            console.log(depLocVal);
            
            $.ajax({
                url: "libs/php/insertDepartment.php",
                type: "POST",
                dataType: "json",
                data: {
                  department: depDepVal,
                  locationID: depLocVal
                },
                success: function (result) {
                  if (result.status.name == "ok") {
                    console.log(result);
                    $.ajax({
                      url: "libs/php/getDepartments.php",
                      type: "POST",
                      dataType: "json",
                      success: function (result) {
                        if (result.status.name == "ok") {
                          allDepartmentData = result.data;
                          console.log(allDepartmentData);
                          fillDepartmentTable(allDepartmentData);
                          updateDepartmentOptions(departments)
                        }
                      },
                      error: function (jqXHR, textStatus, errorThrown) {
                        console.log(textStatus);
                        console.log(errorThrown);
                      },
                    });
      
                  }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                  console.log(textStatus);
                  console.log(errorThrown);
                },
              });

              $("#addDepartmentModal").modal("hide");
              $('#depDepInput').val('');
              $("#depLocSelect").prop("selectedIndex", 0);

          } else {
            console.log('false')
            //Could not add department
          }
      })

 // ---------- ADD NEW LOCATION ----------- //
    } else if (selectedTab === "pills-locations-tab") {
      console.log(selectedTab);
      let locLocVal;
      $("#addLocationModal").modal("show");

      $('#locLocInput').on('keyup', function() {
         locLocVal = $(this).val()
        console.log(locLocVal);
      })

      $('#addLocBtn').on('click', function(e) {
        e.preventDefault()

        $('#addLocForm').validate({
          rules: {
            locLocInput: 'required',
          },
          messages: {
            locLocInput: 'Please enter a location.',
          }
          });
          if ($('#addLocForm').valid()) {
            console.log(locLocVal);
            $.ajax({
              url: "libs/php/insertLocation.php",
              type: "POST",
              dataType: "json",
              data: {
                  location: locLocVal
              },
              success: function (result) {
                if (result.status.name == "ok") {

                  $.ajax({
                    url: "libs/php/getLocations.php",
                    type: "POST",
                    dataType: "json",
                    success: function (result) {
                      if (result.status.name == "ok") {
                        allLocationData = result.data;
                        fillLocationTable(allLocationData);
                        updateLocationOptions(locations);
                      }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                      console.log(textStatus);
                      console.log(errorThrown);
                    },
                  });
                  fillLocationTable(allLocationData);
                  $("#locationTableBody").empty();
                  updateLocationOptions(locations);
                }
              },
              error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
                console.log(errorThrown);
              },
            });

            $("#addLocationModal").modal("hide");
            $('#locLocInput').val('');
          } else {
            console.log('invalid');
          }

      })
      $('#cancelLocBtn').on('click', function() {
        $('#locLocInput').val('');
      })
    }









  });
});
