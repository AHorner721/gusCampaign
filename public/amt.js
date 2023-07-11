// set donation amount
const five = document.querySelector("#five");
const ten = document.querySelector("#ten");
const fifteen = document.querySelector("#fifteen");
const twenty = document.querySelector("#twenty");
const amount = document.querySelector("#amount");

five.addEventListener("click", async (event) => {
  event.preventDefault();
  amount.value = five.value;
  amount.focus();
});

ten.addEventListener("click", async (event) => {
  event.preventDefault();
  amount.value = ten.value;
  amount.focus();
});

fifteen.addEventListener("click", async (event) => {
  event.preventDefault();
  amount.value = fifteen.value;
  amount.focus();
});

twenty.addEventListener("click", async (event) => {
  event.preventDefault();
  amount.value = twenty.value;
  amount.focus();
});
