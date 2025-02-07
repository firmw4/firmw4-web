document.addEventListener("DOMContentLoaded", function () {
  let sidebar = document.getElementById("sidebar");
  let sidebarToggler = document.getElementById("sidebar-toggler");
  let closeSidebar = document.getElementById("close-sidebar");
  let overlay = document.getElementById("overlay");

  // Tampilkan Sidebar & Overlay
  function openSidebar() {
    sidebar.classList.add("show");
    overlay.style.opacity = "1";
    overlay.style.visibility = "visible";
  }

  // Tutup Sidebar & Overlay
  function closeSidebarFunc() {
    sidebar.classList.remove("show");
    overlay.style.opacity = "0";
    overlay.style.visibility = "hidden";
  }

  // Event Listener
  sidebarToggler.addEventListener("click", openSidebar);
  closeSidebar.addEventListener("click", closeSidebarFunc);
  overlay.addEventListener("click", closeSidebarFunc);
});