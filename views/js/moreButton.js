moreButton();
function moreButton() {
    const moreButton = document.querySelector('.moreKeywordButton');
    const dailySearchKeyword = document.querySelector('.dailySearchKeyword');
    const fieldset = document.querySelector('.contentsWrap');

    moreButton.addEventListener('click', () => {
        dailySearchKeyword.classList.toggle('active');
        if (moreButton.innerHTML == '+') {
            moreButton.innerHTML = '-';
            fieldset.style.height = '270px';
        } else if (moreButton.innerHTML == '-') {
            moreButton.innerHTML = '+';
            fieldset.style.height = '225px';
        }
    });
}