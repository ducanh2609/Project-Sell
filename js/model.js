const model = {};
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAckg3gf4bU-Tt1QJxVXVScbNyJX5oTL8E",
    authDomain: "sell-computer-a5ef1.firebaseapp.com",
    databaseURL: "https://sell-computer-a5ef1-default-rtdb.firebaseio.com",
    projectId: "sell-computer-a5ef1",
    storageBucket: "sell-computer-a5ef1.appspot.com",
    messagingSenderId: "1062564485145",
    appId: "1:1062564485145:web:030b8bc8ff8c47929df288"
});
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
model.register = async (data) => {
    try {
        await auth.createUserWithEmailAndPassword(data.Email, data.Password);
        auth.currentUser.sendEmailVerification();
        await firebase.firestore()
            .collection("User")
            .doc(auth.currentUser.email)
            .set({ userInfor: data })
        firebase.auth().signOut();
    } catch (error) {
        alert(error.message);
    }
}

model.login = async (data) => {

    try {
        let response = await auth.signInWithEmailAndPassword(data.email, data.password);
        if (response) {
            location.reload();
        } else {
            alert("please verify email");
        }
    } catch (error) {
        alert(error.message);
    }
}

// Up dữ liệu tất cả sp lên firebase
model.pushDataComputer = async () => {
    let productArr = [];
    let productObj = {};
    let computerItems = document.getElementsByClassName("computer-items");
    let computerImg = document.getElementsByClassName("computer-img");
    let computerText = document.getElementsByClassName("computer-text");
    let computerPrice = document.getElementsByClassName("computer-price");
    let computerCart = document.getElementsByClassName("computer-cart");
    for (let i = 0; i < computerItems.length; i++) {
        productObj = {
            Id: computerCart[i].id,
            Img: computerImg[i].src,
            Name: computerText[i].innerHTML,
            Price: computerPrice[i].innerHTML
        }
        productArr.push(productObj);
    }
    await firebase.firestore()
        .collection("Product")
        .doc("ComputerList")
        .update({ list: productArr })
}
// Thêm sản phẩm và số lượng lên firebase
model.addProductToCard = async (data) => {
    let response = await firebase.firestore()
        .collection("User")
        .doc(auth.currentUser.email)
        .get()
    let clickedArr = response.data().clickedArr;
    if (clickedArr == undefined) {
        await firebase.firestore()
            .collection("User")
            .doc(auth.currentUser.email)
            .update({
                clickedArr: [{
                    id: data,
                    count: 1
                }]
            })
    } else {
        let flag = false;
        for (let i = 0; i < clickedArr.length; i++) {
            if (clickedArr[i].id == data) {
                clickedArr[i].count++;
                flag = true;
                break;
            }
        }
        if (flag == false) {
            var obj = {
                id: data,
                count: 1
            }
            clickedArr.push(obj);
        }
        await firebase.firestore()
            .collection("User")
            .doc(auth.currentUser.email)
            .update({
                clickedArr: clickedArr
            })
    }
    model.requesProductQuanlity();
}

// In ra số sp trong giỏ hàng ở trang chủ
model.requesProductQuanlity = async () => {
    let response = await firebase.firestore()
        .collection("User")
        .doc(auth.currentUser.email)
        .get()
    let clickedArr = response.data().clickedArr;
    if (clickedArr != undefined) {
        let cartValue = document.getElementById("card-value");
        let sumCount = 0;
        for (let i = 0; i < clickedArr.length; i++) {
            sumCount += Number(clickedArr[i].count);
        }
        cartValue.innerHTML = sumCount;
    }
}

// Hiện sp đã chọn vào giỏ hàng
model.productClickded = async () => {
    let response = await firebase.firestore()
        .collection("User")
        .doc(auth.currentUser.email)
        .get()
    let response1 = await firebase.firestore()
        .collection("Product")
        .doc("ComputerList")
        .get()
    let clickedArr = response.data().clickedArr;
    let productArr = response1.data().list;
    let newDiv = "";
    if (clickedArr != undefined && productArr != undefined) {
        for (let i = 0; i < clickedArr.length; i++) {
            for (let j = 0; j < productArr.length; j++) {
                if (clickedArr[i].id == productArr[j].Id) {
                    newDiv += `
                                        <div class="row-header" style="background-color: black;height: 70px;line-height: 70px;">
                                            <div class="cart-col col-image">
                                                <img  class="computer-img1" width=80% height=80% src="${productArr[j].Img}" alt="error">
                                                </div>
                                            <div class="cart-col col-name">${productArr[j].Name}</div>
                                            <div class="cart-col col-price">${productArr[j].Price}</div>
                                            <div class="cart-col col-count">
                                                <input class="count"  type="number" value="${clickedArr[i].count}" min="0"></input>
                                            </div>
                                            <div class="cart-col col-price-total"></div>
                                            <div class="cart-col col-delete"><i class="fa-solid fa-trash"></i></div>
                                        </div>
                        `
                }
            }
        }
    }

    updateCard.innerHTML = newDiv;
    model.eachPrice();
    model.mainPriceTotal();
    model.productQualityChanged();
    model.delProduct();
}

// Tính tổng tiền mỗi sp

model.eachPrice = () => {
    console.log("111");
    let productPriceTotal = document.getElementsByClassName("col-price-total");
    let productCount = document.getElementsByClassName("count");
    let productPrice = document.getElementsByClassName("col-price");
    for (let i = 1; i <= productCount.length; i++) {
        if (productPrice[i].innerHTML != "Liên hệ") {
            let Price = Number(productPrice[i].innerHTML.slice(0, -1).replace('.', '').replace('.', ''));
            productPriceTotal[i].innerHTML = `${((Price * Number(productCount[i - 1].value)).toString()).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đ`;
        } else {
            productPriceTotal[i].innerHTML = "0 đ"
        }

    }
}

// Tính tổng số tiền sp
model.mainPriceTotal = () => {
    let productPriceTotal = document.getElementsByClassName("col-price-total");
    let mainPriceTotal = document.getElementById("sum");
    let sum = 0;
    for (let i = 1; i < productPriceTotal.length; i++) {
        let productPriceTotal_1 = Number(productPriceTotal[i].innerHTML.slice(0, -1).replace('.', '').replace('.', ''));
        sum = Number(sum) + Number(productPriceTotal_1);
    }
    mainPriceTotal.innerHTML = `${(sum.toString()).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

// Hiển thị só sp khi thay đổi số lượng trong giỏ hàng
model.productQualityChanged = async () => {
    let response = await firebase.firestore()
        .collection("User")
        .doc(auth.currentUser.email)
        .get()
    let clickedArr = response.data().clickedArr;
    let productCount = document.getElementsByClassName("count");
    for (let i = 0; i < productCount.length; i++) {
        productCount[i].addEventListener("change", async () => {
            model.eachPrice();
            model.mainPriceTotal();
            clickedArr[i].count = productCount[i].value;
            await firebase.firestore()
                .collection("User")
                .doc(auth.currentUser.email)
                .update({
                    clickedArr: clickedArr
                })
            model.requesProductQuanlity();
        })
    }
}


// Xóa 1 sản phẩm đã chọn
model.delProduct = async () => {
    let response = await firebase.firestore()
        .collection("User")
        .doc(auth.currentUser.email)
        .get()
    let clickedArr = response.data().clickedArr;
    let delProduct = document.getElementsByClassName("col-delete");
    for (let i = 1; i < delProduct.length; i++) {
        delProduct[i].addEventListener("click", async () => {
            let idea = confirm("Bạn có muốn xóa sản phẩm này không?");
            if (idea) {
                clickedArr.splice(i - 1, 1);
                await firebase.firestore()
                    .collection("User")
                    .doc(auth.currentUser.email)
                    .update({
                        clickedArr: clickedArr
                    })
                model.productClickded();
                model.requesProductQuanlity();
                model.delProduct();
            }
        })
    }
}
model.checkCheckbox = () => {
    let checkbox = localStorage.getItem("checkbox");
    let getEmail = localStorage.getItem("LoginEmail");
    let rememberMe = document.getElementById("remember-me");
    if (checkbox == "true") {
        document.getElementById("email1").value = getEmail;
        rememberMe.setAttribute("checked", "true");
    } else {
        rememberMe.removeAttribute("checked");
    }
}
model.forgotPass = async (data) => {
    await firebase.auth().sendPasswordResetEmail(data)
        .then(() => {
            alert("Một tin nhắn đã gửi tới email của bạn")
        })
        .catch((error) => {
            alert("Email không tồn tại")
        });
}


//--> Sửa lại vs admin
model.chatSave = async (data, username, email) => {
    console.log(data, username);
    try {
        if (username == undefined) {
            let response = await firebase.firestore()
                .collection("messSave")
                .doc(auth.currentUser.email)
                .get()
            console.log(response.data());
            let responseUser = await db.collection("User")
                .doc(auth.currentUser.email)
                .get()
            let username = responseUser.data().userInfor.Username;
            console.log(responseUser.data().userInfor);
            let responseAdmin = await db.collection("AdminMessSave")
                .doc(responseUser.data().userInfor.Email)
                .get()
            if (response.data() == undefined) {
                await firebase.firestore()
                    .collection("messSave")
                    .doc(auth.currentUser.email)
                    .set({ admin: [data] });
            } else {
                await firebase.firestore()
                    .collection("messSave")
                    .doc(auth.currentUser.email)
                    .update({
                        admin: firebase.firestore.FieldValue.arrayUnion(data)
                    });
            }
            if (responseAdmin.data() == undefined) {
                await db.collection("AdminMessSave")
                    .doc(responseUser.data().userInfor.Email)
                    .set({ [username]: [data] });
            } else {
                await db.collection("AdminMessSave")
                    .doc(responseUser.data().userInfor.Email)
                    .update({
                        [username]: firebase.firestore.FieldValue.arrayUnion(data)
                    });
            }

        } else {
            let response = await firebase.firestore()
                .collection("AdminMessSave")
                .doc(email)
                .get()
            console.log(response.data());
            if (response.data() == undefined) {
                await firebase.firestore()
                    .collection("AdminMessSave")
                    .doc(email)
                    .set({ [username]: [data] });
            } else {
                await firebase.firestore()
                    .collection("AdminMessSave")
                    .doc(email)
                    .update({
                        [username]: firebase.firestore.FieldValue.arrayUnion(data)
                    });
            }
            await db.collection("messSave")
                .doc(email)
                .update({
                    admin: firebase.firestore.FieldValue.arrayUnion(data)
                });
        }

    } catch (err) {
        console.log(err.message);
    }
}
//--> Đã sửa xong


model.getChatSave = async () => {
    try {
        let response = await firebase.firestore()
            .collection("messSave")
            .doc(auth.currentUser.email)
            .get();
        if (response.data() != undefined) {
            let data = response.data().admin;
            let result = "";
            console.log(111);
            for (let i = 0; i < data.length; i++) {
                if (firebase.auth().currentUser.email == data[i].owner) {
                    result += `
                            <div class="currentUser" id="currentUser">
                                <p class="messMenuOpen">${data[i].content}</p>
                            </div>
                                `
                } else {
                    result += `
                            <div class="difUser" id="difUser">
                                <p class="messMenuOpen">${data[i].content}</p>
                            </div>
                                `
                }
            }
            mesBoxContent.innerHTML = result;
            mesBoxContent.scrollTop = mesBoxContent.scrollHeight;
        }
        // let messMenuOpen = document.getElementsByClassName("messMenuOpen");
        // for (let i = 0; i < messMenuOpen.length; i++) {
        //     messMenuOpen[i].addEventListener("dblclick", () => {
        //         console.log("111"); 
        //     })
        // }
    } catch (err) {
        console.log(err.message);
    }
}

model.search = async (data) => {
    console.log(data);
    let response = await firebase.firestore()
        .collection("Product")
        .doc("ComputerList")
        .get()
    let productArr = response.data().list;
    let nameProArr = productArr.reduce((arr, item) => {
        return [...arr, item.Name]
    }, [])
    let index = [];
    nameProArr.filter((item, i) => {
        console.log(item.indexOf(data));
        if (item.indexOf(data) != -1) {
            index.push(i);
        }
    }, [])
    console.log(index);
    let result = "";
    for (let i = 0; i < index.length; i++) {
        for (let j = 0; j < productArr.length; j++) {
            if (j == index[i]) {
                console.log(productArr[j]);
                result += `
                        <div class="computer-items ${productArr[j].Id}">
                            <div>
                                <img class="computer-img" src="/Image/newold1_img.jpg" alt="">
                            </div>
                            <div class="computer-text">${productArr[j].Name}</div>
                            <div class="computer-price">${productArr[j].Price}</div>
                            <p><div class="computer-cart" id="${productArr[j].Id}"><i class="fa-solid fa-cart-shopping"></i>Thêm vào giỏ hàng</div></p>
                        </div>                                    
                    `
            }
        }
    }
    mainShowSearch.innerHTML = result;
    firebase.auth().onAuthStateChanged(async (user) => {
        let flag = false;
        if (user) {
            flag = true;
        }
        let computerCart = document.getElementsByClassName("computer-cart");
        for (let i = 0; i < computerCart.length; i++) {
            if (flag == true) {
                model.requesProductQuanlity();
                computerCart[i].addEventListener("click", () => {
                    let idea = confirm("Bạn có muốn thêm sản phẩm này vào giỏ hàng?");
                    if (idea) {
                        model.addProductToCard(computerCart[i].id);
                        alert("Bạn đã thêm 1 sản phẩm vào giỏ hàng");
                    }
                })
            } else {
                computerCart[i].addEventListener("click", () => {
                    alert("Bạn phải đăng nhập để mua sản phẩm này");
                    view.setScreenActive("loginPage");
                })
            }
        }
    })
};
let currentChatName;
let currentChatEmail;
let lastTime;
let miss;
model.admin = async () => {
    if (auth.currentUser != null) {
        let icon = document.getElementsByClassName("icon");
        if (auth.currentUser.email == "ducanh@gmail.com") {
            icon[3].addEventListener("click", () => {
                chatListName.setAttribute("style", "display:block");
            })
            let response = await firebase.firestore()
                .collection("messSave")
                .get()

            let id = response.docs;
            let arrId = id.map((item) => {
                return item.id
            })
            console.log(arrId);
            let arrUserName = [];
            for (let i in arrId) {
                if (arrId[i] != "ducanh@gmail.com") {
                    let userMess = await firebase.firestore()
                        .collection("User")
                        .doc(arrId[i])
                        .get()
                    console.log(userMess.data());
                    arrUserName.push({
                        username: userMess.data().userInfor.Username,
                        email: arrId[i]
                    });
                }
            }
            console.log(arrUserName);
            let result = "";
            for (let i in arrUserName) {
                result += `
                        <div class="userAccount" id="userAccount">${arrUserName[i].username}</div>
                    `
            }
            nameList.innerHTML = result;
            nameListClose.addEventListener("click", () => {
                if (nameList.style.display == "" || nameList.style.display == "block") {
                    nameList.setAttribute("style", "display:none")
                } else {
                    nameList.setAttribute("style", "display:block")
                }
            })
            let userAccount = document.getElementsByClassName("userAccount");
            console.log(userAccount);
            for (let i = 0; i < userAccount.length; i++) {
                userAccount[i].addEventListener("click", () => {
                    let username = arrUserName[i].username;
                    currentChatName = username;
                    currentChatEmail = arrUserName[i].email;
                    console.log(currentChatEmail);
                    chatbox.setAttribute("style", "display:block");
                    mesBoxheader.innerHTML = `
                                <b>${arrUserName[i].username}</b>
                                <span class="close" id="boxClose"><i class="fa-sharp fa-solid fa-square-xmark fa-lg"></i></span>
                            `
                    boxClose.addEventListener("click", () => {
                        lastTime = {
                            username: username,
                            time: new Date(),
                            messMiss: 0
                        }
                        console.log(lastTime.time);
                        chatbox.setAttribute("style", "display:none");
                    })
                    model.getChatAdmin(username, currentChatEmail);
                    model.messWaitingAdmin(currentChatEmail);
                })
            }

        } else {
            icon[3].addEventListener("click", () => {
                chatbox.setAttribute("style", "display:block");
                messNotify.style.display = "none";
                mesBoxContent.scrollTop = mesBoxContent.scrollHeight;
            })
            model.getChatSave();
            boxClose.addEventListener("click", () => {
                lastTime = new Date();
                miss = 0;
                console.log(lastTime.getTime());
                localStorage.setItem("lastTime", lastTime.getTime());
                localStorage.setItem("miss", miss);
                chatbox.setAttribute("style", "display:none");
            })
        }
    }
}


// --> Sửa lại với admin
model.getChatAdmin = async (username, email) => {
    let userMess = "";
    let getMessAdmin = await firebase.firestore()
        .collection("AdminMessSave")
        .doc(email)
        .get()
    let messEachUser = getMessAdmin.data()[username];
    for (let j = 0; j < messEachUser.length; j++) {
        if (messEachUser[j].owner == "ducanh@gmail.com") {
            userMess += `
                        <div class="currentUser" id="currentUser">
                            <p>${messEachUser[j].content}</p>
                        </div>
                    `
        } else {
            userMess += `
                        <div class="difUser" id="difUser">
                            <p>${messEachUser[j].content}</p>
                        </div>
                    `
        }
    }
    mesBoxContent.innerHTML = userMess;
    mesBoxContent.scrollTop = mesBoxContent.scrollHeight;
}
// --> Đã sửa xong



model.messWaiting = async (email) => {
    await firebase.firestore()
        .collection("AdminMessSave")
        .doc(email)
        .onSnapshot((data) => {
            console.log(data.data());
            if (auth.currentUser.email != "ducanh@gmail.com" && data.data() != undefined) {
                if (data.data().messWait != "" && data.data().messWait != undefined) {
                    mesBoxContent.scrollTop = mesBoxContent.scrollHeight;
                    messWaiting.setAttribute("style", "display:block");
                } else {
                    messWaiting.setAttribute("style", "display:none");
                }
            }
        })
};
model.messWaitingAdmin = async (email) => {
    console.log(email);
    await firebase.firestore()
        .collection("messSave")
        .doc(email)
        .onSnapshot((data) => {
            console.log(data.data());
            if (auth.currentUser.email == "ducanh@gmail.com") {
                if (data.data().messWait != "" && data.data().messWait != undefined) {
                    mesBoxContent.scrollTop = mesBoxContent.scrollHeight;
                    messWaiting.setAttribute("style", "display:block")
                } else {
                    messWaiting.setAttribute("style", "display:none")
                }
            }
        })
}
model.getMessMiss = async () => {
    let response = await firebase.firestore()
        .collection("messSave")
        .doc(auth.currentUser.email)
        .get()
    // console.log(response.data().admin);
    if (response.data() != undefined) {
        let arrMess = response.data().admin;
        let sum = 0;
        if (arrMess != undefined) {
            for (let i = 0; i < arrMess.length; i++) {
                let lastTime = JSON.parse(localStorage.getItem("lastTime"));
                let time = new Date(arrMess[i].createdAt);
                console.log(time);
                if (lastTime != undefined) {
                    if (time.getTime() > lastTime) {
                        sum += 1;
                    }
                }
            }
            if (sum == 0) {
                messNotify.style.display = "none";
            } else {
                messNumber.innerHTML = sum;
                messNotify.style.display = "block";
            }
        }

    }
}
model.changePass = async (data) => {
    console.log(data);
    let user = firebase.auth().currentUser;
    console.log(data.newPassword);
    await firebase.auth()
        .signInWithEmailAndPassword(user.email, data.oldPassword)
        .then((data1) => {
            console.log(data1);
            firebase.auth().currentUser.updatePassword(data.newPassword)
                .then(async () => {
                    changePassword.style.display = "none";
                    alert("Update successful.");
                    let response = await db.collection("User")
                        .doc(auth.currentUser.email)
                        .get()
                    let obj = response.data().userInfor;
                    obj.Password = data.newPassword;
                    await db.collection("User")
                        .doc(auth.currentUser.email)
                        .update({
                            userInfor: obj
                        })
                })
                .catch((error) => {
                    console.log("Lỗi");
                });
        })
}
model.inforForm = () => {
    let url = "https://provinces.open-api.vn/api/?depth=3";
    let Cities = [];
    fetch(url)
        .then(data => data.json())
        .then((data) => {
            for (let i = 0; i < data.length; i++) {
                let objCity = {};
                objCity.Name = data[i].name;
                objCity.Districts = [];
                for (let j = 0; j < data[i].districts.length; j++) {
                    let objDistrict = {};
                    objDistrict.Name = data[i].districts[j].name;
                    objDistrict.Wards = [];
                    for (let k = 0; k < data[i].districts[j].wards.length; k++) {
                        objDistrict.Wards.push(data[i].districts[j].wards[k].name)
                    }
                    objCity.Districts.push(objDistrict)
                }
                Cities.push(objCity)
            }
        }).then(() => {
            let result = "";
            for (let i in Cities) {
                result += `
            <option class="cities">${Cities[i].Name}</option> <br>
          `
            }
            cities.innerHTML = result;
        }).then(() => {
            let result;
            let id;
            cities.addEventListener("click", () => {
                result = "";
                for (let i = 0; i < Cities.length; i++) {
                    if (Cities[i].Name == cities.value) {
                        id = i;
                    }
                }
                for (let i = 0; i < Cities[id].Districts.length; i++) {
                    console.log(id);
                    result += `
                    <option class="district">${Cities[id].Districts[i].Name}</option> <br>
                  `
                }
                districts.innerHTML = result;
            })
        }).then(() => {
            let result;
            let data;
            let id;
            districts.addEventListener("click", () => {
                result = "";
                for (let i = 0; i < Cities.length; i++) {
                    if (Cities[i].Name == cities.value) {
                        data = i;
                    }
                }
                for (let i = 0; i < Cities[data].Districts.length; i++) {
                    if (Cities[data].Districts[i].Name == districts.value) {
                        id = i;
                    }
                }
                for (let i = 0; i < Cities[data].Districts[id].Wards.length; i++) {
                    result += `
                    <option class="ward">${Cities[data].Districts[id].Wards[i]}</option> <br>
                  `
                }
                wards.innerHTML = result;
            })
        })
}
model.inforFormUpdate = async (data) => {
    await db.collection("User")
        .doc(auth.currentUser.email)
        .update({
            inforUpdate: data
        })
    model.getInforUpdate();
};
model.getInforUpdate = async () => {
    let response = await db.collection("User")
        .doc(auth.currentUser.email)
        .get()
    let inforUpdate = response.data().inforUpdate;
    if (inforUpdate == undefined) {
        nameReceive.value = response.data().userInfor.Username;
        emailReceive.value = response.data().userInfor.Email;
    } else {
        if (inforUpdate.Name != "") {
            nameReceive.value = inforUpdate.Name
        }
        emailReceive.value = inforUpdate.Email;
        mobileReceive.value = inforUpdate.MobileNumber;
        emailReceive.value = inforUpdate.Email;
        addressReceive.value = inforUpdate.Address;
    }
};

model.ImgUpload = (fileInput) => {
    let url;
    if (fileInput.files && fileInput.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            imageTest.src = e.target.result;
            url = e.target.result;
        }
        reader.readAsDataURL(fileInput.files[0]);
        model.uploadSend(fileInput.files[0]);
    }
}
model.getImgAvatar = async () => {
    let res = await firebase.storage().ref(auth.currentUser.email)
        .child("currentUpload")
        .listAll()
    let url = await res.items[0].getDownloadURL();
    console.log(url);
    imgeUpload.src = `${url}`;
};
model.uploadSend = async (file) => {
    uploadSave.addEventListener("click", async () => {
        let res = await firebase.storage().ref(auth.currentUser.email)
            .child("currentUpload")
            .listAll()
        if (await res.items[0] != undefined) {
            console.log(111);
            let url = await res.items[0].getDownloadURL();
            await firebase.storage().refFromURL(url)
                .delete()
        }
        await firebase.storage().ref(auth.currentUser.email)
            .child("currentUpload")
            .child(file.name)
            .put(file)
        await firebase.storage().ref(auth.currentUser.email)
            .child("Avatar")
            .child(file.name)
            .put(file)
        model.getImgUpload()
    })
};
model.getImgUpload = async () => {
    model.getImgAvatar()
    imgUpTable.style.display = "none";
}