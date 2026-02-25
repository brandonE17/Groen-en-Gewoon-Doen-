document.addEventListener("DOMContentLoaded", function () {

    const modal = document.getElementById("loginModal");
    const btn = document.getElementById("loginBtn");
    const closeBtn = document.querySelector(".close");

    btn.addEventListener("click", function () {
        modal.style.display = "block";
    });

    closeBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });

    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

});