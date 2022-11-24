const controller = {};
controller.register = (data) => {
    console.log(data);
    if (data.Username == "") {
        view.setErrorMessage("errorUserName", "Please input username again!")
    } else {
        view.setErrorMessage("errorUserName", "")
    }
    if (data.Email == "") {
        view.setErrorMessage("errorMail", "Please input email again!")

    } else {
        view.setErrorMessage("errorMail", "")
    }
    if (data.Password == "") {
        view.setErrorMessage("errorPass", "Please input password again!")
    } else {
        view.setErrorMessage("errorPass", "")
    }
    if (data.ConfirmPassword == "") {
        view.setErrorMessage("confirmError", "Please input confirmPassword again!")
    } else {
        view.setErrorMessage("confirmError", "");
    }
    if (data.ConfirmPassword !== data.Password) {
        view.setErrorMessage("confirmError", "Password is not correct!")
    } else {
        view.setErrorMessage("confirmError", "");
    }
    if (data.Rules == false) {
        view.setErrorMessage("ok-rules", "You must agree to the terms")
    } else {
        view.setErrorMessage("ok-rules", "");
    }
    if (data.Username != "" && data.Email !== "" &&
        data.Password != "" && data.ConfirmPassword == data.Password && data.Rules == true
    ) {
        model.register(data);
    }
}
controller.login = (data) => {

    if (data.email == "") {
        view.setErrorMessage("errorMail", "Please input email again!")
    } else {
        view.setErrorMessage("errorMail", "")
    }
    if (data.password == "") {
        view.setErrorMessage("errorPassword", "Please input password again!")
    } else {
        view.setErrorMessage("errorPassword", "")
    }
    if (data.email && data.password) {
        localStorage.setItem("LoginEmail", data.email);
        let checkbox = document.getElementById("remember-me");
        console.log(checkbox);
        if (checkbox.checked === true) {
            localStorage.setItem("checkbox", "true");
        } else {
            localStorage.setItem("checkbox", "false");
        }
        model.login(data)
    }
}
controller.chatBox = (data, username, email) => {
    if (data !== "") {
        if (username == undefined) {
            view.chatInput();
        } else {
            view.chatInput(username, email);
        }
    }
}
controller.changePass = (data, pass) => {
    if (data.oldPassword == "" || data.oldPassword != pass) {
        view.setErrorMessage("errorOldPass", "Please input password again!")
    } else {
        view.setErrorMessage("errorOldPass", "")
    }
    if (data.newPassword == "" || data.newPassword == pass) {
        view.setErrorMessage("errorNewPass", "Please input password again!")
    } else {
        view.setErrorMessage("errorNewPass", "")
    }
    if (data.confirmNewPass == "" || data.confirmNewPass != data.newPassword) {
        view.setErrorMessage("errorConfNewPass", "Please input password again!")
    } else {
        view.setErrorMessage("errorConfNewPass", "")
    }
    if (data.oldPassword != "" && data.oldPassword == pass && data.newPassword != "" && data.newPassword != pass && data.confirmNewPass != "" && data.confirmNewPass == data.newPassword) {
        model.changePass(data);
        // console.log("ok");
    }
}
controller.inforForm = (data) => {
    console.log(data);
    let vnf_regex = /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;
    if (vnf_regex.test(data.MobileNumber) == false) {
        newMobileNum.setAttribute("style", "color:red;border:1px solid red;background-color:pink");
    } else {
        newMobileNum.setAttribute("style", "color:black;border:none;background-color:rgba(191, 191, 237, 0.775");

    }
    let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (re.test(data.Email) == false) {
        newEmail.setAttribute("style", "color:red;border:1px solid red;background-color:pink")
    } else {
        newEmail.setAttribute("style", "color:black;border:none;background-color:rgba(191, 191, 237, 0.775");
    }
    if (homeAddress.value == "") {
        homeAddress.setAttribute("style", "color:red;border:1px solid red;")
    } else {
        homeAddress.setAttribute("style", "color:black;border:none;background-color:rgba(191, 191, 237, 0.775");
    }
    if (cities.value == "") {
        cities.setAttribute("style", "color:red;border:1px solid red;")
    } else {
        cities.setAttribute("style", "color:black;border:none;");
    }
    if (districts.value == "") {
        districts.setAttribute("style", "color:red;border:1px solid red;")
    } else {
        districts.setAttribute("style", "color:black;border:none;");
    }
    if (wards.value == "") {
        wards.setAttribute("style", "color:red;border:1px solid red;")
    } else {
        wards.setAttribute("style", "color:black;border:none;");
    }
    if (vnf_regex.test(data.MobileNumber) && re.test(data.Email) && homeAddress.value != "" && cities.value != "" && districts.value != "" && wards.value != "") {
        model.inforFormUpdate(data);
    }
}
