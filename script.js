const modal=document.getElementById("enrollModal");
let selectedCourse="", selectedPrice=0;
function openEnroll(course,price){
 selectedCourse=course; selectedPrice=price;
 document.getElementById("modalCourse").textContent=course;
 document.getElementById("modalPrice").textContent=`GHS ${price.toLocaleString()}`;
 modal.classList.add("show"); modal.setAttribute("aria-hidden","false");
}
function closeEnroll(){modal.classList.remove("show");modal.setAttribute("aria-hidden","true")}
modal.addEventListener("click",e=>{if(e.target===modal)closeEnroll()});

async function submitEnrollment(e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!name || !phone || !email || !selectedCourse) {
    alert("Please complete all enrollment details.");
    return;
  }

  try {
    const response = await fetch("/api/initialize-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        phone,
        email,
        course: selectedCourse
      })
    });

    const result = await response.json();

    if (!response.ok || !result.authorization_url) {
      throw new Error(result.error || "Payment initialization failed");
    }

    window.location.href = result.authorization_url;

  } catch (error) {
    alert(error.message || "Unable to connect to Paystack.");
  }
}
