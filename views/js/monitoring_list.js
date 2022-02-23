
fetch("/monitoring/get/list")
    .then(res => { return res.json(); })
    .then(jsonData => createList(jsonData.data));

function createList(data) {
    let list = '';
    for (let i = 0; i < data.length; i++) {
        list += `<ul>\
                    <li>\
                        ${data[i]['farm_no']}\
                    </li>\
                    <li>\
                        ${data[i]['farm_name']}\
                    </li>\
                    <li>\
                        ${data[i]['farm_region']}\
                    </li>\
                    <li>\
                        ${data[i]['manager_id']}\
                    </li>\
                    <li>\
                        ${data[0]['ins_date'].split(" ")[0]}\
                    </li>\
                    <li>\
                        <a href="/monitoring/detail/${data[i]['farm_no']}">▶</a>\
                    </li>\
                </ul>`;
    }
    
    document.getElementById('display_list').innerHTML = list;
}