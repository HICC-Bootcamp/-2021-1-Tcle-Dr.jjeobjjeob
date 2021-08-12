function checkPwd() {
    var password = document.getElementById("password").value;
    var password_confirm = document.getElementById("password_confirm").value;

    if (password != password_confirm) {
        alert("입력한 두 개의 비밀번호가 서로 일치하지 않습니다.");
        return false;
    }
    else {
        return true;
    }
}