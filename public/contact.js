// handle contact form data
window.addEventListener("DOMContentLoaded", ()=> {

    // get the contact form elements defined in HTML
    
    const form = document.getElementById("contact-form");
    const status = document.getElementById("contact-form-status");

    // Contact Success and Error functions for after the form is submitted
    
    function success() {
      form.reset();
      alert("message sent!");
    }

    function error() {
      status.innerHTML = "Please check form for errors.";
    }

    // handle the contact form submission event

    form.addEventListener("submit", (event)=> {
      event.preventDefault();
      const data = new FormData(form);
      ajax(form.method, form.action, data, success, error);
    });
  });
  
  // helper function for sending an AJAX request

  function ajax(method, url, data, success, error) {
    const xhr = new XMLHttpRequest();
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