// set donation amount
const fifteen = document.querySelector("#fifteen");
const twentyFive = document.querySelector("#twentyfive");
const fifty = document.querySelector("#fifty");
const oneHundred = document.querySelector("#onehundred");
const amount = document.querySelector("#amount");

fifteen.addEventListener("click", async (event) => {
  event.preventDefault();
  amount.value = fifteen.value;
  amount.focus();
});

twentyFive.addEventListener("click", async (event) => {
  event.preventDefault();
  amount.value = twentyFive.value;
  amount.focus();
});

fifty.addEventListener("click", async (event) => {
  event.preventDefault();
  amount.value = fifty.value;
  amount.focus();
});

oneHundred.addEventListener("click", async (event) => {
  event.preventDefault();
  amount.value = oneHundred.value;
  amount.focus();
});
