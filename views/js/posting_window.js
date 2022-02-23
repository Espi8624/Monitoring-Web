// Modal

const body = document.querySelector('body');
const postBox = document.querySelector('.post_box');
const newPostButton = document.querySelector('.posting_button');

const postTitle = document.querySelector('.post_title');
const postContents = document.querySelector('.post_contents');

newPostButton.addEventListener('click', () => {
    postBox.classList.toggle('show');

    if (postBox.classList.contains('show')) {
        body.style.overflow = 'hidden';
    }

    postTitle.value = '';
    postContents.value = '';
});

postBox.addEventListener('click', (event) => {
    if (event.target === postBox) {
        postBox.classList.toggle('show');

        if (!postBox.classList.contains('show')) {
            body.style.overflow = 'auto';
        }
    }
});

const postSubmit = document.querySelector('.post_submit');
postSubmit.addEventListener('click', () => {
    postBox.classList.toggle('show');

    if (postBox.classList.contains('show')) {
        body.style.overflow = 'hidden';
    }

    const get_time = new Date();
    const years = get_time.getFullYear();
    const month = get_time.getMonth() + 1;
    const date = get_time.getDate();
    const hours = get_time.getHours();
    const minutes = get_time.getMinutes();
    const seconds = get_time.getSeconds();

    const regist_time = `${years}-${month}-${date} ${hours}:${minutes}:${seconds}`;

    const url = '/dailyreport/newreport';
    let data = {
        "postData" : [
            {
                "title" : postTitle.value,
                "contents" : postContents.value,
                "regist_time" : regist_time,
            }
        ]
    }

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then((response) => response.json());

    location.reload();
});