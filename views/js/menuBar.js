menuBar();
function menuBar() {
    const toggleBtn = document.querySelector('.list_icon');
    const menu1 = document.querySelector('.menu');

    toggleBtn.addEventListener('click', () => {
        menu1.classList.toggle('active');
    });

    const toggleBtn1 = document.querySelector('.chart_icon');
    const menu2 = document.querySelector('.chart');

    toggleBtn1.addEventListener('click', () => {
        menu2.classList.toggle('active');
    });

    const toggleBtn2 = document.querySelector('.on_chart_icon');
    const menu3 = document.querySelector('.chart');

    toggleBtn2.addEventListener('click', () => {
        menu3.classList.toggle('active');
    });
}