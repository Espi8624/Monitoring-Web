class Appbar extends HTMLElement {
    connectedCallback() {
        let logo_content = document.createElement('div');
        logo_content.className = 'logo_content';
        this.appendChild(logo_content);

        let logo = document.createElement('div');
        logo.className = 'logo';
        logo_content.appendChild(logo);

        let main_logo = document.createElement('i');
        // main_logo.className = 'bx bxl-visual-studio';
        main_logo.className = 'logo_icon';
        logo.appendChild(main_logo);

        let logo_name = document.createElement('div');
        logo_name.className = 'logo_name';
        logo_name.innerHTML = '♻ AI SMARTFARM';
        logo.appendChild(logo_name);

        let menu_btn = document.createElement('i');
        menu_btn.className = 'bx bx-menu';
        menu_btn.id = 'btn';
        logo_content.appendChild(menu_btn);

        // menu list
        let nav_list = document.createElement('ul');
        nav_list.className = 'nav_list';
        this.appendChild(nav_list);

        // let menu_1 = document.createElement('li');
        // nav_list.appendChild(menu_1);
        // let menu_1_icon = document.createElement('i');
        // menu_1_icon.className = 'bx bx-search';
        // menu_1.appendChild(menu_1_icon);
        // let menu_1_text = document.createElement('input');
        // menu_1_text.placeholder = '検索';
        // menu_1.appendChild(menu_1_text);
        // let menu_1_tooltip = document.createElement('span');
        // menu_1_tooltip.className = 'tooltip';
        // menu_1_tooltip.innerHTML = '検索';
        // menu_1.appendChild(menu_1_tooltip);

        let menu_2 = document.createElement('li');
        nav_list.appendChild(menu_2);
        let menu_2_link = document.createElement('a');
        menu_2_link.href = '/monitoring';
        menu_2.appendChild(menu_2_link);
        let menu_2_icon = document.createElement('i');
        menu_2_icon.className = 'bx bx-grid-alt';
        menu_2_link.appendChild(menu_2_icon);
        let menu_2_text = document.createElement('span');
        menu_2_text.className = 'links_name';
        menu_2_text.innerHTML = '농장 모니터링';
        menu_2_link.appendChild(menu_2_text);
        let menu_2_tooltip = document.createElement('span');
        menu_2_tooltip.className = 'tooltip';
        menu_2_tooltip.innerHTML = '농장 모니터링';
        menu_2.appendChild(menu_2_tooltip);

        let menu_3 = document.createElement('li');
        nav_list.appendChild(menu_3);
        let menu_3_link = document.createElement('a');
        menu_3_link.href = '/dailyreport';
        menu_3.appendChild(menu_3_link);
        let menu_3_icon = document.createElement('i');
        menu_3_icon.className = 'bx bx-chat';
        menu_3_link.appendChild(menu_3_icon);
        let menu_3_text = document.createElement('span');
        menu_3_text.className = 'links_name';
        menu_3_text.innerHTML = '농장일지';
        menu_3_link.appendChild(menu_3_text);
        let menu_3_tooltip = document.createElement('span');
        menu_3_tooltip.className = 'tooltip';
        menu_3_tooltip.innerHTML = '농장일지';
        menu_3.appendChild(menu_3_tooltip);

        let menu_4 = document.createElement('li');
        nav_list.appendChild(menu_4);
        let menu_4_link = document.createElement('a');
        menu_4_link.href = '/sensor';
        menu_4.appendChild(menu_4_link);
        let menu_4_icon = document.createElement('i');
        menu_4_icon.className = 'bx bx-folder';
        menu_4_link.appendChild(menu_4_icon);
        let menu_4_text = document.createElement('span');
        menu_4_text.className = 'links_name';
        menu_4_text.innerHTML = '센서기록조회';
        menu_4_link.appendChild(menu_4_text);
        let menu_4_tooltip = document.createElement('span');
        menu_4_tooltip.className = 'tooltip';
        menu_4_tooltip.innerHTML = '센서기록조회';
        menu_4.appendChild(menu_4_tooltip);

        let menu_5 = document.createElement('li');
        nav_list.appendChild(menu_5);
        let menu_5_link = document.createElement('a');
        menu_5_link.href = '/camera';
        menu_5.appendChild(menu_5_link);
        let menu_5_icon = document.createElement('i');
        menu_5_icon.className = 'bx bx-pie-chart-alt-2';
        menu_5_link.appendChild(menu_5_icon);
        let menu_5_text = document.createElement('span');
        menu_5_text.className = 'links_name';
        menu_5_text.innerHTML = '촬열기록조회';
        menu_5_link.appendChild(menu_5_text);
        let menu_5_tooltip = document.createElement('span');
        menu_5_tooltip.className = 'tooltip';
        menu_5_tooltip.innerHTML = '촬열기록조회';
        menu_5.appendChild(menu_5_tooltip);

        // let menu_6 = document.createElement('li');
        // nav_list.appendChild(menu_6);
        // let menu_6_link = document.createElement('a');
        // menu_6_link.href = '#';
        // menu_6.appendChild(menu_6_link);
        // let menu_6_icon = document.createElement('i');
        // menu_6_icon.className = 'bx bx-folder';
        // menu_6_link.appendChild(menu_6_icon);
        // let menu_6_text = document.createElement('span');
        // menu_6_text.className = 'links_name';
        // menu_6_text.innerHTML = 'ファイル　マネージャー';
        // menu_6_link.appendChild(menu_6_text);
        // let menu_6_tooltip = document.createElement('span');
        // menu_6_tooltip.className = 'tooltip';
        // menu_6_tooltip.innerHTML = 'ファイル　マネージャー';
        // menu_6.appendChild(menu_6_tooltip);

        // let menu_7 = document.createElement('li');
        // nav_list.appendChild(menu_7);
        // let menu_7_link = document.createElement('a');
        // menu_7_link.href = '#';
        // menu_7.appendChild(menu_7_link);
        // let menu_7_icon = document.createElement('i');
        // menu_7_icon.className = 'bx bx-cart-alt';
        // menu_7_link.appendChild(menu_7_icon);
        // let menu_7_text = document.createElement('span');
        // menu_7_text.className = 'links_name';
        // menu_7_text.innerHTML = '注文';
        // menu_7_link.appendChild(menu_7_text);
        // let menu_7_tooltip = document.createElement('span');
        // menu_7_tooltip.className = 'tooltip';
        // menu_7_tooltip.innerHTML = '注文';
        // menu_7.appendChild(menu_7_tooltip);

        // let menu_8 = document.createElement('li');
        // nav_list.appendChild(menu_8);
        // let menu_8_link = document.createElement('a');
        // menu_8_link.href = '#';
        // menu_8.appendChild(menu_8_link);
        // let menu_8_icon = document.createElement('i');
        // menu_8_icon.className = 'bx bx-heart';
        // menu_8_link.appendChild(menu_8_icon);
        // let menu_8_text = document.createElement('span');
        // menu_8_text.className = 'links_name';
        // menu_8_text.innerHTML = '保存';
        // menu_8_link.appendChild(menu_8_text);
        // let menu_8_tooltip = document.createElement('span');
        // menu_8_tooltip.className = 'tooltip';
        // menu_8_tooltip.innerHTML = '保存';
        // menu_8.appendChild(menu_8_tooltip);

        // let menu_9 = document.createElement('li');
        // nav_list.appendChild(menu_9);
        // let menu_9_link = document.createElement('a');
        // menu_9_link.href = '#';
        // menu_9.appendChild(menu_9_link);
        // let menu_9_icon = document.createElement('i');
        // menu_9_icon.className = 'bx bx-cog';
        // menu_9_link.appendChild(menu_9_icon);
        // let menu_9_text = document.createElement('span');
        // menu_9_text.className = 'links_name';
        // menu_9_text.innerHTML = '設定';
        // menu_9_link.appendChild(menu_9_text);
        // let menu_9_tooltip = document.createElement('span');
        // menu_9_tooltip.className = 'tooltip';
        // menu_9_tooltip.innerHTML = '設定';
        // menu_9.appendChild(menu_9_tooltip);

        // profile space
        let profile_content = document.createElement('div');
        profile_content.className = 'profile_content';
        this.appendChild(profile_content);

        let profile = document.createElement('div');
        profile.className = 'profile';
        profile_content.appendChild(profile);

        let profile_detailes = document.createElement('div');
        profile_detailes.className = 'profile_details';
        profile.appendChild(profile_detailes);

        let profile_image = document.createElement('img');
        profile_image.src = 'profile.jpg';
        profile_image.alt = "";
        profile_detailes.appendChild(profile_image);

        let profile_explain = document.createElement('div');
        profile_explain.className = 'name_job';
        profile_detailes.appendChild(profile_explain);

        let name = document.createElement('div');
        name.className = 'name';
        name.innerHTML = 'Test User';
        profile_explain.appendChild(name);

        let job = document.createElement('div');
        job.className = 'job';
        job.innerHTML = '관리자';
        profile_explain.appendChild(job);

        let logout_icon = document.createElement('i');
        logout_icon.className = 'bx bx-log-out';
        logout_icon.id = 'log_out';
        profile.append(logout_icon);
    }
}

customElements.define('app-bar', Appbar);