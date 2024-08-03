function startCountdown(seconds) {
    var counter = seconds;
    var countdownElement = document.getElementById('countdown');
    
    var interval = setInterval(function() {
        countdownElement.textContent = counter;
        counter--;

        if (counter < 0) {
            clearInterval(interval);
        }
    }, 1000);
}

window.onload = function() {
    startCountdown(3);

    // prevent right click and copy content
    document.addEventListener('contextmenu', event => event.preventDefault());
    document.addEventListener('copy', event => event.preventDefault());
    document.addEventListener('cut', event => event.preventDefault());
    document.addEventListener('selectstart', event => event.preventDefault());
};