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
        let time = new Date();
        await firebase.firestore()
            .collection("AdminMessSave")
            .doc(auth.currentUser.email)
            .set({
                [data.Username]: [{
                    content: `Chào mừng bạn đến với cửa hàng\nTôi có thể giúp gì bạn`,
                    createdAt: `${time}`,
                    owner: "ducanh@gmail.com"
                }]
            })
        await firebase.firestore()
            .collection("messSave")
            .doc(auth.currentUser.email)
            .set({
                admin: [{
                    content: `Chào mừng bạn đến với cửa hàng. Tôi có thể giúp gì bạn`,
                    createdAt: `${time}`,
                    owner: "ducanh@gmail.com"
                }]
            })
        firebase.auth().signOut();
    } catch (error) {
        alert(error.message);
    }
}

model.login = async (data) => {
    try {
        await auth.signInWithEmailAndPassword(data.email, data.password);
        await firebase.firestore()
            .collection("User")
            .doc(auth.currentUser.email)
            .update({
                status: "online"
            })
        location.reload();
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
                                <div class="cart-col col-check-product">
                                    <input class="check-buy" type="checkbox"></input>
                                </div>
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

model.eachPrice = (index, sum) => {
    let productPriceTotal = document.getElementsByClassName("col-price-total");
    let productCount = document.getElementsByClassName("count");
    let productPrice = document.getElementsByClassName("col-price");
    let Price;
    let tag;
    for (let i = 1; i <= productCount.length; i++) {
        if (productPrice[i].innerHTML != "Liên hệ") {
            Price = Number(productPrice[i].innerHTML.slice(0, -1).replace('.', '').replace('.', ''));
            productPriceTotal[i].innerHTML = `${((Price * Number(productCount[i - 1].value)).toString()).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đ`;
        } else {
            Price = 0;
            productPriceTotal[i].innerHTML = "0 đ"
        }
        if (index != undefined) {
            if (i == index) {
                tag = Price
            }
        }
    }
    if (index != undefined) {
        let checkBuy = document.getElementsByClassName("check-buy");
        if (checkBuy[index].checked == true) {
            model.mainPriceTotal(index);
        }
    }
}

// Tính tổng số tiền sp
model.mainPriceTotal = (index) => {
    let productPriceTotal = document.getElementsByClassName("col-price-total");
    let mainPriceTotal = document.getElementById("sum");
    let checkBuy = document.getElementsByClassName("check-buy");
    if (index == undefined) {
        for (let i = 0; i < checkBuy.length; i++) {
            checkBuy[i].addEventListener("click", () => {
                let sum = Number(mainPriceTotal.innerHTML.replace(/\./g, ''));
                if (checkBuy[i].checked == true) {
                    let productPriceTotal_1 = Number(productPriceTotal[i + 1].innerHTML.slice(0, -1).replace('.', '').replace('.', ''));
                    sum = Number(sum) + Number(productPriceTotal_1);
                    mainPriceTotal.innerHTML = `${(sum.toString()).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
                } else {
                    let sum = Number(mainPriceTotal.innerHTML.replace(/\./g, ''));
                    let productPriceTotal_1 = Number(productPriceTotal[i + 1].innerHTML.slice(0, -1).replace('.', '').replace('.', ''));
                    sum = Number(sum) - Number(productPriceTotal_1);
                    if (sum < 0) {
                        sum = 0;
                    }
                    mainPriceTotal.innerHTML = `${(sum.toString()).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
                }
            })
        }
    } else {
        let sum = 0;
        for (let i = 0; i < checkBuy.length; i++) {
            if (checkBuy[i].checked == true) {
                let productPriceTotal_1 = Number(productPriceTotal[i + 1].innerHTML.slice(0, -1).replace('.', '').replace('.', ''));
                console.log(productPriceTotal_1);
                sum = Number(sum) + Number(productPriceTotal_1);
                mainPriceTotal.innerHTML = `${(sum.toString()).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
            }
        }
    }
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
            model.eachPrice(i);
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
    try {
        if (username == undefined) {
            let response = await firebase.firestore()
                .collection("messSave")
                .doc(auth.currentUser.email)
                .get()
            let responseUser = await db.collection("User")
                .doc(auth.currentUser.email)
                .get()
            let username = responseUser.data().userInfor.Username;
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

model.search = async (data, smallerSearchContent) => {
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
        if (item.indexOf(data) != -1) {
            index.push(i);
        }
    }, [])
    let result = "";
    for (let i = 0; i < index.length; i++) {
        for (let j = 0; j < productArr.length; j++) {
            if (j == index[i]) {
                result += `
                        <div class="computer-items ${productArr[j].Id}">
                            <div>
                                <img class="computer-img" src="${productArr[j].Img}" alt="">
                            </div>
                            <div class="computer-text">${productArr[j].Name}</div>
                            <div class="computer-price">${productArr[j].Price}</div>
                            <p><div class="computer-cart" id="${productArr[j].Id}"><i class="fa-solid fa-cart-shopping"></i><span class="card-click">Thêm vào giỏ hàng</span></div></p>
                        </div>                                    
                    `
            }
        }
    }
    if (smallerSearchContent == undefined) {
        mainShowSearch.innerHTML = result;
    } else {
        smallerSearchContent.innerHTML = result;
    }
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
}
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
                messNotify.style.display = "none";
            })
            let response = await firebase.firestore()
                .collection("messSave")
                .get()

            let id = response.docs;
            let arrId = id.map((item) => {
                return item.id
            })
            let arrUserName = [];
            for (let i in arrId) {
                if (arrId[i] != "ducanh@gmail.com") {
                    let userMess = await firebase.firestore()
                        .collection("User")
                        .doc(arrId[i])
                        .get()
                    arrUserName.push({
                        username: userMess.data().userInfor.Username,
                        email: arrId[i],
                        status: userMess.data().status
                    });
                }
            }
            let result = "";
            for (let i in arrUserName) {
                result += `
                            <div class="div">
                                <div class="userAccount" id="userAccount"><span class="statusUser status-off"></span>${arrUserName[i].username}</div>
                                <div class="userAccountMiss">0</div>
                            </div>
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
            let userAccountMiss = document.getElementsByClassName("userAccountMiss");
            for (let i = 0; i < userAccount.length; i++) {
                userAccount[i].addEventListener("click", () => {
                    userAccountMiss[i].innerHTML = 0;
                    userAccountMiss[i].style.display = "none";
                    lastTime = new Date();
                    localStorage.setItem("lastTime", lastTime.getTime());
                    let username = arrUserName[i].username;
                    currentChatName = username;
                    currentChatEmail = arrUserName[i].email;
                    chatbox.setAttribute("style", "display:block");
                    mesBoxheader.innerHTML = `
                                <b>${arrUserName[i].username}</b>
                                <span class="close" id="boxClose"><i class="fa-sharp fa-solid fa-square-xmark fa-lg"></i></span>
                            `
                    chatbox.classList.add("chatbox");
                    chatbox.classList.remove("chatboxClose");
                    boxClose.addEventListener("click", () => {
                        let lastTimeAdmin = JSON.parse(localStorage.getItem("lastTimeAdmin"));
                        if (lastTimeAdmin == undefined) {
                            lastTimeAdmin = [];
                            lastTime = {
                                username: username,
                                time: new Date().getTime(),
                                missAd: 0
                            }
                            lastTimeAdmin.push(lastTime);
                            localStorage.setItem("lastTimeAdmin", JSON.stringify(lastTimeAdmin));
                        } else {
                            lastTime = {
                                username: username,
                                time: new Date().getTime(),
                                missAd: 0
                            }
                            let flag = false;
                            for (let i = 0; i < lastTimeAdmin.length; i++) {
                                if (lastTimeAdmin[i].username == username) {
                                    lastTimeAdmin[i].time = new Date().getTime();
                                    lastTimeAdmin[i].missAd = 0;
                                    flag = true;
                                    break;
                                }
                            }
                            if (flag == false) {
                                lastTimeAdmin.push(lastTime);
                            }
                            localStorage.setItem("lastTimeAdmin", JSON.stringify(lastTimeAdmin));
                        }
                        chatbox.classList.remove("chatbox");
                        chatbox.classList.add("chatboxClose");
                        setTimeout(() => {
                            chatbox.style.display = "none";
                        }, 1000)
                    })

                    model.getChatAdmin(username, currentChatEmail);
                    model.messWaitingAdmin(currentChatEmail);
                })
            }
            return [arrId, arrUserName];
        } else {
            icon[3].addEventListener("click", () => {
                chatbox.classList.add("chatbox");
                chatbox.classList.remove("chatboxClose");
                chatbox.setAttribute("style", "display:block");
                messNotify.style.display = "none";
                messNumber.innerHTML = 0;
                mesBoxContent.scrollTop = mesBoxContent.scrollHeight;
                lastTime = new Date();
                localStorage.setItem("lastTime", lastTime.getTime());
            })
            model.getChatSave();
            boxClose.addEventListener("click", () => {
                lastTime = new Date();
                localStorage.setItem("lastTime", lastTime.getTime());
                chatbox.classList.remove("chatbox");
                chatbox.classList.add("chatboxClose");
                setTimeout(() => {
                    chatbox.style.display = "none";
                }, 1000)
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
            if (auth.currentUser.email != "ducanh@gmail.com" && data.data() != undefined) {
                if (data.data().messWait != "" && data.data().messWait != undefined) {
                    mesBoxContent.scrollTop = mesBoxContent.scrollHeight;
                    messWaiting.setAttribute("style", "display:block");
                } else {
                    messWaiting.setAttribute("style", "display:none");
                }
            }
        })
}
model.messWaitingAdmin = async (email) => {
    await firebase.firestore()
        .collection("messSave")
        .doc(email)
        .onSnapshot((data) => {
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
model.getMessMiss = async (audio) => {
    let response = await firebase.firestore()
        .collection("messSave")
        .doc(auth.currentUser.email)
        .get()
    if (response.data() != undefined) {
        let arrMess = response.data().admin;
        let sum = 0;
        if (arrMess != undefined) {
            for (let i = 0; i < arrMess.length; i++) {
                if (arrMess[i].owner != auth.currentUser.email) {
                    let lastTime = JSON.parse(localStorage.getItem("lastTime"));
                    let time = new Date(arrMess[i].createdAt);
                    if (lastTime != undefined) {
                        if (time.getTime() > lastTime) {
                            sum += 1;
                            if (audio != undefined) {
                                if (chatbox.style.display == "none") {
                                    audio.play()
                                }
                            }
                        }
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
model.getMissAdmin = async (email, userAccountMiss, audio) => {
    let response = await firebase.firestore()
        .collection("AdminMessSave")
        .doc(email)
        .get()
    let userRes = await firebase.firestore()
        .collection("User")
        .doc(email)
        .get()
    let userName = userRes.data().userInfor.Username;
    let userMess = response.data()[userName];
    let sum = 0;
    let lastTimeAdmin = JSON.parse(localStorage.getItem("lastTimeAdmin"));
    for (let i in lastTimeAdmin) {
        if (lastTimeAdmin[i].username == userName) {
            lastTime = lastTimeAdmin[i].time;
            break;
        }
    }
    if (userMess != undefined) {
        for (let i = 0; i < userMess.length; i++) {
            if (userMess[i].owner == email) {
                let time = new Date(userMess[i].createdAt);
                if (lastTime != undefined) {
                    console.log(time.getTime());
                    console.log(lastTime);
                    if (time.getTime() > lastTime) {
                        sum += 1;
                        if (audio != undefined) {
                            if (chatbox.style.display == "none") {
                                audio.play()
                            }
                        }
                    }
                }
            }
        }
        if (sum == 0) {
            userAccountMiss.style.display = "none";
        } else {
            if (chatbox.style.display != "block") {
                userAccountMiss.innerHTML = sum;
                userAccountMiss.style.display = "block";
            }
        }
    }
}
model.changePass = async (data) => {
    let user = firebase.auth().currentUser;
    await firebase.auth()
        .signInWithEmailAndPassword(user.email, data.oldPassword)
        .then((data1) => {
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
model.inforForm = async () => {
    let response = await firebase.firestore()
        .collection("User")
        .doc(auth.currentUser.email)
        .get()
    if (nameReceive.value == undefined) {
        UsName.innerHTML = response.data().userInfor.Username;
    } else {
        console.log(loginName.innerHTML);
        UsName.innerHTML = nameReceive.value;
    }
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
    inforBefore.classList.remove("infor-before");
    inforBefore.classList.add("infor-before-down");
    infor.style.display = "block";
    setTimeout(() => {
        inforBefore.style.display = "none";
    }, 1500)
    model.getInforUpdate();
}
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
}

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
    if (res.items[0] != undefined) {
        let url = await res.items[0].getDownloadURL();
        imgeUpload.src = `${url}`;
    }
}
model.uploadSend = async (file) => {
    uploadSave.addEventListener("click", async () => {
        let res = await firebase.storage().ref(auth.currentUser.email)
            .child("currentUpload")
            .listAll()
        if (await res.items[0] != undefined) {
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
}
model.getImgUpload = async () => {
    model.getImgAvatar()
    imgUpTable.style.display = "none";
}
model.pageDiv = async () => {
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
}
model.purchase = async () => {
    let response = await firebase.firestore()
        .collection("User")
        .doc(auth.currentUser.email)
        .get()
    let infor = response.data().inforUpdate;
    if (response.data().inforUpdate != undefined) {
        iptName.value = infor.Name;
        iptEmail.value = infor.Email;
        iptMobile.value = infor.MobileNumber;
        iptAddress.value = infor.Address;
    }
}
model.bought = async (data, clickedArr, bought) => {
    await firebase.firestore()
        .collection("User")
        .doc(auth.currentUser.email)
        .update({
            clickedArr: clickedArr
        })
    await firebase.firestore()
        .collection("User")
        .doc(auth.currentUser.email)
        .update({
            bought: bought
        })
    purchaseTab.style.display = "none";
    await firebase.firestore()
        .collection("User")
        .doc(auth.currentUser.email)
        .update({
            inforUpdate: {
                Name: data.Name,
                Email: data.Email,
                MobileNumber: data.Mobile,
                Address: data.Address
            }
        })
    alert("Bạn đã đặt hàng thành công.\nCảm ơn bạn đã tin dùng sản phẩm của chúng tôi!");
    location.reload()
}
model.boughtList = async () => {
    let response = await firebase.firestore()
        .collection("Product")
        .doc("ComputerList")
        .get()
    let productList = response.data().list
    let responseBought = await firebase.firestore()
        .collection("User")
        .doc(auth.currentUser.email)
        .get()
    let bought = responseBought.data().bought;
    let result = "";
    for (let i = 0; i < bought.length; i++) {
        for (let j = 0; j < productList.length; j++) {
            if (bought[i].id == productList[j].Id) {
                let total = Number(productList[j].Price.slice(0, -1).replace('.', '').replace('.', '')) * Number(bought[i].count);
                result += `
                        <div class="product-bought">
                            <div class="bought-img">
                                <img class="boughtImg" src="${productList[j].Img}" alt="error">
                            </div>
                            <div class="bought-name">
                                Tên: <span class="boughtName">${productList[j].Name}</span> <br>
                                Số lượng: <span class="boughtCount">${bought[i].count}</span> <br>
                                Đơn giá: <span class="boughtEachPrice">${productList[j].Price}</span>
                            </div>
                            <div class="bought-time">${bought[i].time}</div>
                            <div class="bought-price">${(total.toString()).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} VNĐ</div>
                        </div>
                `
                break;
            }
        }
    }
    productBought.innerHTML = result;
}
model.status = (arrUserName, statusUser) => {
    if (arrUserName.status == "online") {
        statusUser.classList.add("status");
        statusUser.classList.remove("status-off");
    } else {
        statusUser.classList.remove("status");
        statusUser.classList.add("status-off");
    }
}