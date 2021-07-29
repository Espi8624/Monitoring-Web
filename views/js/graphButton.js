graphButton();
function graphButton() {
    const toggleGraphBtn_temp = document.querySelector('.chart_icon_temp');
    const tempGraph = document.querySelector('.chart_temp');
    const humiGraph = document.querySelector('.chart_humi');
    const switchGraph = document.querySelector('.chart_switch');

    toggleGraphBtn_temp.addEventListener('click', () => {
        tempGraph.classList.toggle('active');
        switchGraph.classList.toggle('active');
    });

    const toggleGraphBtn_humi = document.querySelector('.chart_icon_humi');

    toggleGraphBtn_humi.addEventListener('click', () => {
        humiGraph.classList.toggle('active');
        switchGraph.classList.toggle('active');
    });
}