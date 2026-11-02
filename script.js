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
function submitEnrollment(e){
 e.preventDefault();
 const name=document.getElementById("name").value.trim();
 const phone=document.getElementById("phone").value.trim();
 const email=document.getElementById("email").value.trim();
 const subject=encodeURIComponent(`Enrollment enquiry: ${selectedCourse}`);
 const body=encodeURIComponent(`Hello MGI Skills Academy,\n\nI want to enroll in: ${selectedCourse}\nCourse price: GHS ${selectedPrice.toLocaleString()}\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nPlease send me the payment instructions.`);
 window.location.href=`mailto:emmanuelbibson@gmail.com?subject=${subject}&body=${body}`;
}
