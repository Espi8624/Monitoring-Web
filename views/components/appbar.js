
class Appbar extends HTMLElement {
    constructor() {
        super();
        this.render();
    }

    render() {
        this.innerHTML = this.template();
    }

    template() {
        return `
            <div class="logo_content">
                <div class="logo">
                    <div class="logo_name">♻ AI SMARTFARM</div>
                </div>
                <i class='bx bx-menu' id="btn"></i>
            </div>

            <ul class="nav_list">
                <li>
                    <a href="/monitoring">
                        <i class='bx bx-grid-alt'></i>
                        <span class="links_name">농장 모니터링</span>
                    </a>
                    <span class="tooltip">농장 모니터링</span>
                </li>
                <li>
                    <a href="/dailyreport">
                        <i class='bx bx-chat'></i>
                        <span class="links_name">농장일지</span>
                    </a>
                    <span class="tooltip">농장일지</span>
                </li>
                <li>
                    <a href="/sensor">
                        <i class='bx bx-folder'></i>
                        <span class="links_name">센서기록조회</span>
                    </a>
                    <span class="tooltip">센서기록조회</span>
                </li>
                <li>
                    <a href="/camera">
                        <i class='bx bx-pie-chart-alt-2'></i>
                        <span class="links_name">촬영기록조회</span>
                    </a>
                    <span class="tooltip">촬영기록조회</span>
                </li>
            </ul>
            
            <div class="profile_content">
                <div class="profile">
                    <div class="profile_details">
                        <!--<img src="profile.jpg" alt="">-->
                        <div class="name_job">
                            <div class="name">Test User</div>
                            <div class="job">관리자</div>
                        </div>
                    </div>
                    <i class='bx bx-log-out' id="log_out"></i>
                </div>
            </div>`;
    }
}

window.customElements.define('app-bar', Appbar);
