
const searchOption = document.querySelector('.select_search_option_button');
const dateSearch = document.querySelector('.posting_search_date');
const keywordSearch = document.querySelector('.posting_search_keyword');

searchOption.addEventListener('click', (e) => {
    // console.log(e.target.innerHTML);
    if (e.target.innerHTML === '작성일자 검색') {
        dateSearch.style.display = "block";
        keywordSearch.style.display = "none";
    } else if (e.target.innerHTML === '키워드 검색') {
        dateSearch.style.display = "none";
        keywordSearch.style.display = "block";
    }
});

const dateSelect1 = document.querySelector('#date1');
const dateSelect2 = document.querySelector('#date2');
const keywordOption = document.querySelector('#selectKeyword');
const keywordInput = document.querySelector('.searchKeyword');
const searchButton = document.querySelector('.totalSearchButton');

searchButton.addEventListener('click', () => {
    if (dateSearch.style.display === "block" && keywordSearch.style.display === "none") {
        if(dateSelect1.value === "" || dateSelect2.value === "") {
            alert('날짜를 선택해주세요.');
        } else {
            let date1_parsing = mergeDate(dateSelect1.value);
            let date2_parsing = mergeDate(dateSelect2.value);

            fetch("/dailyreport/get/posting")
                .then(res => { return res.json(); })
                .then(jsonData => dateSearchList(jsonData.data, date1_parsing, date2_parsing));

            dateSelect1.value = "";
            dateSelect2.value = "";
        }

    } else if (dateSearch.style.display === "none" && keywordSearch.style.display === "block") {
        let keywordOptionValue = keywordOption.value;
        let keywordValue = keywordInput.value;

        if(keywordInput.value === "") {
            alert('키워드를 입력해주세요.');
        } else {
            fetch("/dailyreport/get/posting")
                .then(res => { return res.json(); })
                .then(jsonData => keywordSearchList(jsonData.data, keywordValue, keywordOptionValue));

            keywordInput.value = "";
        }
    }
});

fetch("/dailyreport/get/posting")
    .then(res => { return res.json(); })
    .then(jsonData => createList(jsonData.data));

function createList(data) {
    let list = '';
    for (let i = 0; i < data.length; i++) {
        list += `<ul>\
                    <li>\
                        ${data[i]['seq']}\
                    </li>\
                    <li>\
                        ${data[i]['plant']}\
                    </li>\
                    <li>\
                        ${data[i]['report']}\
                    </li>\
                    <li>\
                        ${data[i]['report_date'].split(" ")[0]}\
                    </li>\
                    <li class="${data[i]['seq']}">\
                        ▶\
                    </li>\
                    <li>\
                        <a href="/dailyreport/delete/${data[i]['seq']}">▶</a>\
                    </li>\
                </ul>`;
    }
    
    document.getElementById('display_list').innerHTML = list;
}

function mergeDate(date) {
    let date_split = date.toString().split('-');
    let mergeDate = date_split[0] + date_split[1] + date_split[2] 

    return Number(mergeDate);
}

function dateSearchList(data, date_1, date_2) {
    let list = '';
    for (let i = 0; i < data.length; i++) {
        if (mergeDate(data[i]['report_date'].split(" ")[0]) <= date_2 && mergeDate(data[i]['report_date'].split(" ")[0]) >= date_1) {
            list += `<ul>\
                    <li>\
                        ${data[i]['seq']}\
                    </li>\
                    <li>\
                        ${data[i]['plant']}\
                    </li>\
                    <li>\
                        ${data[i]['report']}\
                    </li>\
                    <li>\
                        ${data[i]['report_date'].split(" ")[0]}\
                    </li>\
                    <li>\
                        <a href="/dailyreport/edit/${data[i]['seq']}">▶</a>
                    </li>\
                    <li>\
                        <a href="/dailyreport/delete/${data[i]['seq']}">▶</a>\
                    </li>\
                </ul>`;
        } 
    }
    
    document.getElementById('display_list').innerHTML = list;
}

function keywordSearchList(data, keyword, option) {
    let list = '';
    for (let i = 0; i < data.length; i++) {
        if (option === "식물") {
            if (data[i]['plant'].search(keyword) !== -1) {
                list += `<ul>\
                        <li>\
                            ${data[i]['seq']}\
                        </li>\
                        <li>\
                            ${data[i]['plant']}\
                        </li>\
                        <li>\
                            ${data[i]['report']}\
                        </li>\
                        <li>\
                            ${data[i]['report_date'].split(" ")[0]}\
                        </li>\
                        <li>\
                            <a href="/dailyreport/edit/${data[i]['seq']}">▶</a>
                        </li>\
                        <li>\
                            <a href="/dailyreport/delete/${data[i]['seq']}">▶</a>\
                        </li>\
                    </ul>`;
            }
        } else if (option === "내용") {
            if (data[i]['report'].search(keyword) !== -1) {
                list += `<ul>\
                        <li>\
                            ${data[i]['seq']}\
                        </li>\
                        <li>\
                            ${data[i]['plant']}\
                        </li>\
                        <li>\
                            ${data[i]['report']}\
                        </li>\
                        <li>\
                            ${data[i]['report_date'].split(" ")[0]}\
                        </li>\
                        <li>\
                            <a href="/dailyreport/edit/${data[i]['seq']}">▶</a>
                        </li>\
                        <li>\
                            <a href="/dailyreport/delete/${data[i]['seq']}">▶</a>\
                        </li>\
                    </ul>`;
            }
        }
    }
    
    document.getElementById('display_list').innerHTML = list;
}