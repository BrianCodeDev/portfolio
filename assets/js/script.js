 // Function to set the theme and update UI
 function setTheme(theme) {
    document.body.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
    var switchThemeBtn = document.getElementById('switchTheme');
    if (switchThemeBtn) {
        switchThemeBtn.innerHTML = theme === 'dark' ?  '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-stars-fill"></i>';
    }
    //console.log(`Switched to ${theme} theme`);
}

var currentTheme = localStorage.getItem('theme') || 'dark';
setTheme(currentTheme);

// Event listener for the switch theme button
var switchThemeBtn = document.getElementById('switchTheme');
if (switchThemeBtn) {
    switchThemeBtn.addEventListener('click', () => {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(currentTheme);
    });
}

//AOS Initiliaze
AOS.init();

// Fixed Header & back to top button on Scroll
window.addEventListener('scroll', () => {
    // fixed header
    const header = document.getElementById('header');
    if (window.scrollY > 30 && !header.classList.contains('fixed-top')) {
        header.classList.add('fixed-top');
        document.getElementById('offcanvasNavbar').classList.add('fixedHeaderNavbar');
    } else if (window.scrollY <= 30 && header.classList.contains('fixed-top')) {
        header.classList.remove('fixed-top');
        document.getElementById('offcanvasNavbar').classList.remove('fixedHeaderNavbar');
    }

    //backtotop
    const backToTopButton = document.getElementById("backToTopButton");
    if (window.scrollY > 400 && backToTopButton.style.display === 'none') {
        backToTopButton.style.display = 'block';
    } else if (window.scrollY <= 400 && backToTopButton.style.display === 'block') {
        backToTopButton.style.display = 'none';
    }
});


//jumping to top function
function scrollToTop(){
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

//Testimonial Slider
$(document).ready(function(){
    $("#testimonial-slider").owlCarousel({
        items:3,
        nav:true,
        loop: true,
        autoplay: true,
        autoplayTimeout: 3000,
        responsive:{
            0:{
                items:1,
            },
            768:{
                items:2,
            },
            1170:{
                items:3,
            }
        }
    });
});
 import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";
  import { getFirestore, doc, getDoc, setDoc } 
    from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "AIzaSyAK5YNUuUwAZo53JWgAjhKGAvFcw9pH3Yk",
    authDomain: "followbutton-a823c.firebaseapp.com",
    projectId: "followbutton-a823c",
    storageBucket: "followbutton-a823c.firebasestorage.app",
    messagingSenderId: "417669528190",
    appId: "1:417669528190:web:ddb2f0fe56742a9842b62f",
    measurementId: "G-MM6PPBYVXJ"
  };

  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const db = getFirestore(app);

  const counterRef = doc(db, "followbutton", "followbutton");
  const btn = document.getElementById("followBtn");

  const LOCAL_KEY = "userFollowed";
  let userFollowed = localStorage.getItem(LOCAL_KEY) === "true";

  function updateButton(count) {
    btn.innerText = userFollowed ? `Following ${count}` : `Follow ${count}`;
  }

  // 🔹 Button click to toggle follow/unfollow
  btn.addEventListener("click", async () => {
    const snap = await getDoc(counterRef);
    let count = snap.exists() ? snap.data().count : 0;

    if (!userFollowed) {
      count++;
      userFollowed = true;
      localStorage.setItem(LOCAL_KEY, "true");
    } else {
      count--;
      userFollowed = false;
      localStorage.setItem(LOCAL_KEY, "false");
    }

    await setDoc(counterRef, { count }, { merge: true });
    updateButton(count);
  });

  // 🔹 Auto-update every 1 second
  setInterval(async () => {
    try {
      const snap = await getDoc(counterRef);
      if (snap.exists()) {
        updateButton(snap.data().count);
      }
    } catch (err) {
      console.error("Error updating count:", err);
    }
  }, 1000);