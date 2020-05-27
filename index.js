// handle form data
window.addEventListener("DOMContentLoaded", function() {

    // get the form elements defined in HTML
    
    var form = document.getElementById("contact-form");
    var status = document.getElementById("contact-form-status");

    // Success and Error functions for after the form is submitted
    
    function success() {
      form.reset();
      alert("message sent!");
    }

    function error() {
      status.innerHTML = "Please check form for errors.";
    }

    // handle the form submission event

    form.addEventListener("submit", function(event) {
      event.preventDefault();
      var data = new FormData(form);
      ajax(form.method, form.action, data, success, error);
    });
  });
  
  // helper function for sending an AJAX request

  function ajax(method, url, data, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.onreadystatechange = function() {
      if (xhr.readyState !== XMLHttpRequest.DONE) return;
      if (xhr.status === 200) {
        success(xhr.response, xhr.responseType);
      } else {
        error(xhr.status, xhr.response, xhr.responseType);
      }
    };
    xhr.send(data);
  }