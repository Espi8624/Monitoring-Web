const loginButton = document.querySelector('input.login-btn');

loginButton.addEventListener('click', function() {
    login();
});

function login() {
    var id = document.getElementById('id').value;
    var pw = document.getElementById('pw').value;

    if (id == 'user1' && pw == '1234') {
        location.replace('/monitoring');
    } else {
        alert('계정을 확인해주세요.');
    }
}