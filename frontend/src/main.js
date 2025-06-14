document.querySelector(".continue-btn").addEventListener("click", () => {
  const email = document.querySelector('input[type="email"]').value;
  if (email.trim()) {
    alert(`You entered: ${email}`);
  } else {
    alert("Please enter your email.");
  }
});
