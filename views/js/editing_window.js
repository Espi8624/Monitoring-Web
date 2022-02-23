
const editBox = document.querySelector('.edit_box');
const listClick = document.querySelectorAll('#display_list');

const editSeq = document.querySelector('.edit_seq');
const editTitle = document.querySelector('.edit_title');
const editContents = document.querySelector('.edit_contents');
const editSubmit = document.querySelector('.edit_submit');

listClick[0].addEventListener('click', (e) => {
    if (e.target.classList.value != '') {
        editBox.classList.toggle('show');

        if (editBox.classList.contains('show')) {
            body.style.overflow = 'hidden';
        }

        fetch("/dailyreport/get/posting")
            .then(res => { return res.json(); })
            .then(jsonData => parse_jsonData(jsonData.data, e.target.classList.value))

        editTitle.value = '';
        editContents.value = '';
    }
});

editBox.addEventListener('click', (event) => {
    if (event.target === editBox) {
        editBox.classList.toggle('show');

        if (!editBox.classList.contains('show')) {
            body.style.overflow = 'auto';
        }
    }
});

function parse_jsonData(data, target) {
    for (i = 0; i < data.length; i++) {
        if (data[i]['seq'] === Number(target)) {
            editSeq.value = data[i]['seq'];
            editTitle.value = data[i]['plant'];
            editContents.value = data[i]['report'];
        }
    }
}

editSubmit.addEventListener('click', () => {
    editBox.classList.toggle('show');

    if (editBox.classList.contains('show')) {
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

    const url = '/dailyreport/edit';
    let edit_data = {
        "editData": [
            {
                "seq": editSeq.value,
                "title": editTitle.value,
                "contents": editContents.value,
                "regist_time": regist_time,
            }
        ]
    }

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(edit_data)
    }).then((response) => response.json());

    location.reload();
});