const view = {};
view.setScreenActive = (screenName) => {
    switch (screenName) {
        case "registerPage":
            let app = document.getElementById("app");
            app.innerHTML = component.registerPage;
            let registerForm = document.getElementById("registerForm");
            registerForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const data = {
                    Username: registerForm.username.value,
                    Email: registerForm.email.value,
                    Password: registerForm.password.value,
                    ConfirmPassword: registerForm.confirmPassword.value,
                    Rules: registerForm.rules.checked
                };
                controller.register(data);
            });

            let iconRegister = document.getElementById("icon")
            iconRegister.addEventListener("click", () => {
                view.showPassword(password, icon);
            })

            cancelRegister.addEventListener("click", () => {
                view.setScreenActive("loginPage");
            })

            let iconConfirm = document.getElementById("iconClose");
            iconConfirm.addEventListener("click", () => {
                view.showPassword(confirmPassword, iconClose);
            })

            view.setErrorMessage = (id, content) => {
                document.getElementById(id).innerHTML = content;
            };

            let redirectLogin = document.getElementById("redirectLogin");
            redirectLogin.addEventListener("click", () => {
                view.setScreenActive("loginPage");
            });
            break;
        case "loginPage":
            document.getElementById("app").innerHTML = component.loginPage;
            model.checkCheckbox();
            let loginForm = document.getElementById("loginForm");
            loginForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const data = {
                    email: loginForm.email.value,
                    password: loginForm.password.value,
                    remember: loginForm.rememerInfor.checked
                };
                controller.login(data);
            });

            view.setErrorMessage = (id, content) => {
                document.getElementById(id).innerHTML = content;
            };
            let redirectRegister = document.getElementById("redirectRegister");
            redirectRegister.addEventListener("click", () => {
                view.setScreenActive("registerPage");
            });
            cancelLogin.addEventListener("click", () => {
                view.setScreenActive("start");
            })
            iconLogin.addEventListener("click", () => {
                view.showPassword(passwordLogin, iconLogin);
            })

            forgot.addEventListener("click", () => {
                let acountEmail = prompt("M???i b???n nh???p email:");
                model.forgotPass(acountEmail);
            })
            break;
        case "start":
            document.getElementById("app").innerHTML = component.start;
            localStorage.setItem("currentView", JSON.stringify("start"));
            view.showElement("mainMenu");
            view.showElement("iconsContact");
            view.showElement("mainPicture");
            view.acount();
            view.boxAnimation();
            view.changePass();
            // view.pageDiv("menu-list");
            view.footer();

            // view.setScreenActive("informationUser")

            var homePageLink = document.getElementsByClassName("home-page-link");
            for (let i = 0; i < homePageLink.length; i++) {
                homePageLink[i].addEventListener("click", () => {
                    view.setScreenActive("start");
                })
            }
            chatbox.innerHTML = component.chatbox;
            model.pushDataComputer();
            model.admin()
                .then(([arrId, arrUserName]) => {
                    let userAccountMiss = document.getElementsByClassName("userAccountMiss");
                    let statusUser = document.getElementsByClassName("statusUser");
                    for (let i in arrId) {
                        model.getMissAdmin(arrId[i], userAccountMiss[i])
                        model.status(arrUserName[i], statusUser[i])
                    }
                })
            if (auth.currentUser != undefined && auth.currentUser.email != "ducanh@gmail.com") {
                messNotify.addEventListener("click", () => {
                    chatbox.classList.add("chatbox");
                    chatbox.classList.remove("chatboxClose");
                    chatbox.setAttribute("style", "display:block");
                    messNotify.style.display = "none";
                    messNumber.innerHTML = 0;
                    mesBoxContent.scrollTop = mesBoxContent.scrollHeight;
                    lastTime = new Date();
                    localStorage.setItem("lastTime", lastTime.getTime());
                })
            }
            chatInput.addEventListener("keydown", async (event) => {
                if (event.key == "Enter") {
                    if (auth.currentUser.email != "ducanh@gmail.com") {
                        await firebase.firestore()
                            .collection("messSave")
                            .doc(firebase.auth().currentUser.email)
                            .update({
                                messWait: ""
                            })
                        controller.chatBox(chatInput.value);
                    } else {
                        await firebase.firestore()
                            .collection("AdminMessSave")
                            .doc(currentChatEmail)
                            .update({
                                messWait: ""
                            })
                        controller.chatBox(chatInput.value, currentChatName, currentChatEmail);
                    }
                }
            });
            chatInput.addEventListener("input", async () => {
                try {
                    if (auth.currentUser.email != "ducanh@gmail.com") {
                        let response = await firebase.firestore()
                            .collection("messSave")
                            .doc(firebase.auth().currentUser.email)
                            .get()

                        if (response.data() == undefined) {
                            await firebase.firestore()
                                .collection("messSave")
                                .doc(firebase.auth().currentUser.email)
                                .set({
                                    messWait: chatInput.value
                                })
                        } else {
                            await firebase.firestore()
                                .collection("messSave")
                                .doc(firebase.auth().currentUser.email)
                                .update({
                                    messWait: chatInput.value
                                })
                        }
                    } else {
                        let response = await firebase.firestore()
                            .collection("AdminMessSave")
                            .doc(currentChatEmail)
                            .get()

                        if (response.data() == undefined) {
                            await firebase.firestore()
                                .collection("AdminMessSave")
                                .doc(currentChatEmail)
                                .set({
                                    messWait: chatInput.value
                                })
                        } else {
                            await firebase.firestore()
                                .collection("AdminMessSave")
                                .doc(currentChatEmail)
                                .update({
                                    messWait: chatInput.value
                                })
                        }
                    }
                } catch (error) {
                    console.log(error.message);
                }

            });

            let li1 = document.getElementById("li1");
            li1.addEventListener("click", () => {
                view.setScreenActive("start");
            })
            let showCart = document.getElementsByClassName("show-card");
            for (let i = 0; i < showCart.length; i++) {
                showCart[i].addEventListener("click", () => {
                    view.setScreenActive("carthome");
                })
            }
            searchIcon.addEventListener("click", () => {
                if (searchContent.style.display == "none" || searchContent.style.display == "") {
                    searchContent.style.display = "block";
                    mainShowSearch.innerHTML = "";
                    mainShowSearch.style.visibility = "visible";
                    productList.style.display = "none";
                } else {
                    searchContent.style.display = "none";
                    mainShowSearch.style.visibility = "hidden";
                    productList.style.display = "block";
                    mainShowSearch.innerHTML = "";
                    window.onload()
                }
            })
            search.addEventListener("input", () => {
                if (search.value == "" || search.value == " ") {
                    mainShowSearch.innerHTML = "";
                } else {
                    model.search(search.value);

                }
            })

            firebase.auth().onAuthStateChanged(async (user) => {
                let flag = false;
                if (user) {
                    flag = true;
                    let icon = document.getElementsByClassName("icon");
                    icon[2].addEventListener("click", () => {
                        window.location.href = "http://facebook.com/Ho??ng-H??-Computer-526270654499607/";
                    })
                }
                // console.log(flag);
                let computerCart = document.getElementsByClassName("computer-cart");
                for (let i = 0; i < computerCart.length; i++) {
                    if (flag == true) {
                        model.requesProductQuanlity();
                        computerCart[i].addEventListener("click", () => {
                            let idea = confirm("B???n c?? mu???n th??m s???n ph???m n??y v??o gi??? h??ng?");
                            if (idea) {
                                model.addProductToCard(computerCart[i].id);
                                alert("B???n ???? th??m 1 s???n ph???m v??o gi??? h??ng");
                            }
                        })
                    } else {
                        computerCart[i].addEventListener("click", () => {
                            console.log(111);
                            alert("B???n ph???i ????ng nh???p ????? mua s???n ph???m n??y");
                            view.setScreenActive("loginPage");
                        })
                    }
                }
            })
            searchSmaller.addEventListener("click", () => {
                support.style.display = "none";
                searchInput.style.display = "block";
                smallHeader.style.width = "100%";
                searchSmaller.style.display = "none";
                smallerBut.style.display = "block";
                smallerSearchContent.style.visibility = "visible";
            })
            smallerBut.addEventListener("click", () => {
                support.style.display = "block";
                searchInput.style.display = "none";
                smallHeader.style.width = "10%";
                searchSmaller.style.display = "block";
                smallerBut.style.display = "none";
                smallerSearchContent.style.visibility = "hidden";
                location.reload();
            })
            searchInput.addEventListener("input", () => {
                if (searchInput.value == "" || searchInput.value == " ") {
                    smallerSearchContent.innerHTML = "";
                } else {
                    model.search(searchInput.value, smallerSearchContent);
                }
            })
            break;
        case "carthome":
            document.getElementById("body").innerHTML = component.cartHome;
            localStorage.setItem("currentView", JSON.stringify("carthome"));
            view.showElement("mainMenu1");
            homePageLink = document.getElementsByClassName("home-page-link");
            for (let i = 0; i < homePageLink.length; i++) {
                homePageLink[i].addEventListener("click", () => {
                    view.setScreenActive("start");
                })
            }
            productList.setAttribute("style", "display:none");

            let mainMenu1 = document.getElementById("main-menu1");
            let extension1 = document.getElementById("extension1");
            extension1.addEventListener("mouseover", () => {
                mainMenu1.setAttribute("style", "display:block");
            })
            let menuList1 = document.getElementsByClassName("menu-list1");
            let content = document.getElementsByClassName("content");
            for (let i = 0; i < menuList1.length; i++) {
                menuList1[i].addEventListener("mouseover", () => {
                    previewProduct.style.visibility = "visible";
                    previewProduct.innerHTML = content[i].innerHTML;
                    model.pageDiv();
                    // if (previewProduct.style.visibility == "visible") {
                    //     console.log(111);
                    //     document.addEventListener("click", (e) => {
                    //         let check = e.target.classList.contains("preview-product");
                    //         if (!check) {
                    //             console.log(check);
                    //             previewProduct.style.visibility = "hidden";
                    //             mainMenu1.setAttribute("style", "display:none");
                    //         }
                    //     })
                    // }
                })

            }
            previewProduct.addEventListener("mouseleave", () => {
                previewProduct.style.visibility = "hidden";
                mainMenu1.setAttribute("style", "display:none");
            })
            let logo = document.getElementById("logo");
            logo.addEventListener("click", () => {
                view.setScreenActive("start");
            })
            buyCont.addEventListener("click", () => {
                view.setScreenActive("start");
            })
            updateCont.addEventListener("click", () => {
                location.reload();
            })
            purchase.addEventListener("click", () => {
                let checkBuy = document.getElementsByClassName("check-buy");
                let flag = false;
                for (let i = 0; i < checkBuy.length; i++) {
                    if (checkBuy[i].checked == true) {
                        flag = true;
                        break;
                    }
                }
                if (flag == true) {
                    let Confirm = confirm("B???n c?? ch???c mu???n thanh to??n v???i s???n ph???m v?? s??? l?????ng ???? ch???n?");
                    if (Confirm == true) {
                        if (auth.currentUser != null) {
                            purchaseTab.style.display = "block";
                            model.purchase();
                        } else {
                            alert("B???n ph???i ????ng nh???p ????? s??? d???ng t??nh n??ng!")
                            view.setScreenActive("loginPage")
                        }
                    }
                } else {
                    alert("B???n ph???i ch???n ??t nh???t 1 s???n ph???m ????? thanh to??n")
                }
            })
            buyBtn.addEventListener("click", async () => {
                let checkPur = document.getElementsByClassName("checkPur");
                let buyInfor = {
                    Name: iptName.value,
                    Email: iptEmail.value,
                    Mobile: iptMobile.value,
                    Address: iptAddress.value,
                    check: checkPur
                }
                let time = new Date;
                let response = await firebase.firestore()
                    .collection("User")
                    .doc(auth.currentUser.email)
                    .get()
                let clickedArr = response.data().clickedArr;
                let responseBought = await firebase.firestore()
                    .collection("User")
                    .doc(auth.currentUser.email)
                    .get()
                let bought;
                if (responseBought.data().bought == undefined) {
                    bought = [];
                } else {
                    bought = responseBought.data().bought;
                }
                let checkBuy = document.getElementsByClassName("check-buy");
                for (let i = 0, j = 0; i < clickedArr.length, j < checkBuy.length; i++, j++) {
                    if (i == clickedArr.length || j == checkBuy.length) {
                        break;
                    } else {
                        if (checkBuy[j].checked == true) {
                            let obj = clickedArr[i];
                            obj.time = `${time}`;
                            bought.push(obj);
                            clickedArr.splice(i, 1);
                            i = i - 1;
                        }
                    }
                }
                controller.purchase(buyInfor, clickedArr, bought);
            })
            cancelPurchase.addEventListener("click", () => {
                purchaseTab.style.display = "none";
            })
            model.productClickded();
            break;
        case "informationUser":
            if (document.getElementById("main") != undefined) {
                document.getElementById("main").innerHTML = component.inforForm;
            } else {
                document.getElementById("main1").innerHTML = component.inforForm;
            }
            model.getInforUpdate();
            model.inforForm();
            model.getImgAvatar();
            model.boughtList();
            userAvatar.addEventListener("mouseover", () => {
                imgUpload.style.display = "block"
            })
            imgUpload.addEventListener("click", () => {
                imgUpTable.style.display = "block";
            })
            uploadBtn.addEventListener("click", () => {
                imageUploadInput.click()
            })
            imageUploadInput.addEventListener("change", () => {
                model.ImgUpload(imageUploadInput);
            })
            uploadCancel.addEventListener("click", () => {
                imgUpTable.style.display = "none";
            })
            userAvatar.addEventListener("mouseleave", () => {
                imgUpload.style.display = "none"
            })
            updateInfor.addEventListener("click", () => {
                inforBefore.classList.add("infor-before");
                inforBefore.classList.remove("infor-before-down");
                inforBefore.style.display = "block";
                setTimeout(() => {
                    infor.style.display = "none";
                }, 1500)
            })
            cancelInfor.addEventListener("click", () => {
                inforBefore.classList.remove("infor-before");
                inforBefore.classList.add("infor-before-down");
                infor.style.display = "block";
                setTimeout(() => {
                    inforBefore.style.display = "none";
                }, 1500)
            })
            saveInfor.addEventListener("click", () => {
                let inforUpdate = {
                    Name: newName.value,
                    MobileNumber: newMobileNum.value,
                    Email: newEmail.value,
                    Address: `${homeAddress.value}, ${wards.value}, ${districts.value}, ${cities.value}`
                }
                controller.inforForm(inforUpdate);
            })
            break;
    }
}
view.pageDiv = (Class) => {
    let menuList = document.getElementsByClassName(Class);
    let content = document.getElementsByClassName("content");
    for (let i = 0; i < menuList.length; i++) {
        menuList[i].addEventListener("mouseover", () => {
            searchContent.style.display = "none";
            mainShowSearch.style.visibility = "visible";
            mainShowSearch.innerHTML = content[i].innerHTML;
            productList.style.display = "none";
            model.pageDiv();
        })
        // if (mainShowSearch.style.visibility != "hidden") {
        //     document.addEventListener("click", function handleClick(event) {
        //         console.log(222);
        //         let check = event.target.classList.contains("main-show-search");
        //         if (check == false) {
        //             mainShowSearch.style.visibility = "hidden";
        //             productList.style.display = "block";
        //         }
        //     });
        // }
    }
    mainShowSearch.addEventListener("mouseleave", () => {
        mainShowSearch.style.visibility = "hidden";
        productList.style.display = "block";
        searchContent.style.display = "none";
    })

}
view.showElement = (id) => {
    switch (id) {
        case "mainMenu":
            let arrMenuBar = ["TR???N B??? M??Y T??NH C??/M???I", "CASE V??N PH??NG", "CASEGAME-????? H???A (C??)", "CASEGAME-????? H???A (M???I)", "C??Y DUAL XEON", "M??Y T??NH ?????NG B???", "CH??P B??? VI X??? L?? (CPU)", "MAINBOARD (BO M???CH CH???)", "RAM (B??? NH??? TRONG)", "HDD && SSD (??? C???NG)", "VGA (CARD M??N H??NH)", "PSU (NGU???N M??Y T??NH)", "CASE-V??? M??Y T??NH", "M??N H??NH M??Y T??NH (M???I)", "M??N H??NH M??Y T??NH C??", "GAMING GEAR", "LAPTOP C??"];
            let listIcons = ["/Image/listIcons1.png", "/Image/listIcons2.png", "/Image/listIcons3.png", "/Image/listIcons4.png", "/Image/listIcons5.png", "/Image/listIcons6.png", "/Image/listIcons7.png", "/Image/listIcons8.png", "/Image/listIcons9.png", "/Image/listIcons10.png", "/Image/listIcons11.png", "/Image/listIcons12.png", "/Image/listIcons13.png", "/Image/listIcons14.png", "/Image/listIcons15.png", "/Image/listIcons16.png", "/Image/listIcons17.png"]
            let mainMenu = document.getElementById("main-menu");
            for (let i = 0; i < arrMenuBar.length; i++) {
                mainMenu.innerHTML +=
                    `
                                        <div class="menu-list"><a href="#link${i}"><img class="list-icon" src="${listIcons[i]}" alt="">${arrMenuBar[i]}</a></div>
                                    `
            }
            let arrId = ["new-old-content", "office-content", "old-game-content", "new-game-content", "xeon-content", "synchronized-content", "cpu-content", "mainboard-content", "ram-content", "hdd-ssd-content", "vga-content", "psu-content", "case-content", "new-screen-content", "old-screen-content", "gear-content", "old-laptop-content"];
            let arrSpan = [
                ["Gi?? t??? 2tr ?????n 3.5tr", "Gi?? t??? 3.5tr ?????n 4.5tr", "Gi?? t??? 4.5tr ?????n 6tr", "Gi?? t??? 6tr ?????n 10tr", "C??y m??y t??nh m???i 100%"],
                ["Gi?? t??? 2tr ?????n 3tr5", "Gi?? t??? 3tr5 ?????n 5tr"],
                [""], [""], [""],
                ["C??y ?????ng B??? Dell", "C??y ?????ng B??? HP", "C??y ?????ng B??? Lenovo", "C??y Worstation- ????? Ho???", "C??y Render - Si??u Kh???ng"],
                ["SOCKET 775", "SOCKET 1155", "SOCKET 1150", "SOCKET 1151-V1", "SOCKET 1151-V2"],
                ["Main Socket 775", "Main Socket 1155", "Main Socket 1150", "Main Socket 1151 - V1", "Main Socket 1151 - V2"],
                ["DDR 2", "DDR 3", "DDR 4", "RAM ECC", "REGISTERED"],
                ["??? C???NG HDD", "Hdd Laptop", "??? SSD ( ??? c???ng Th??? R???n)"],
                ["VGA 1GB", "VGA 2GB", "VGA 3GB", "VGA 4GB", "VGA 6GB"],
                ["Ngu???n Th?????ng", "Ngu???n c??ng su???t th???c"],
                [""],
                ["M??n h??nh 20 inch m???i", "M??n h??nh 22 inch m???i", "M??n h??nh 24 inch m???i", "M??n h??nh 27 inch m???i", "M??n h??nh 32 inch m???i"],
                ["M??n h??nh 17 inch", "M??n h??nh 18.5 inch", "M??n h??nh 20 inch", "M??n h??nh 22 inch", "M??n h??nh 24 inch"],
                ["T???n Nhi???t", "Tai Nghe", "Chu???t - B??n ph??m", "Loa m??y t??nh", "B??? Ph??t Wifi"],
                ["Laptop Dell c??", "Laptop HP c??", "Laptop Asus c??", "Laptop Vaio c??", "Laptop Lenovo c??"]

            ]
            let container = document.getElementById("container");
            for (let i = 0; i < arrMenuBar.length; i++) {
                productList.innerHTML += `
                                        <div>
                                            <div class="box">
                                                <div class="box1 da-10 da-sm-10" id="link${i}">
                                                    <h3><img class="list-icon" src="${listIcons[i]}" alt="">${arrMenuBar[i]}</h3>
                                                </div>
                                                <div class="box2 da-0 da-sm-0">
                                                </div>
                                            </div>
                                            <div class="${arrId[i]} content" id="${arrId[i]}"></div>
                                        </div>
                                    `
            }

            let box2 = document.getElementsByClassName("box2");
            for (let i = 0; i < box2.length; i++) {
                for (let j = 0; j < arrSpan[i].length; j++) {
                    box2[i].innerHTML += `
                                            <span class="da-0">${arrSpan[i][j]}</span>
                                            `
                }
            }
            let arrComputerName = ["B??? Fujisu H81/ Chip G3220/ Ram 4gb/ SSD 128GB + ..", "Case H81 Chip i5 4570/ Ram 8gb/ SSD 120Gb/ M??n ..", "B??? m??y t??nh H61/ G2010/ram 4gb/Ssd 120g + M??n 20", "Case B85/ chip i5 4570/ Ram 8gb/ SSD 120gb /M??n 20", "Case Dell 7040/ chip i5 6400/ ram 4gb/ SSD 240 + ..", "Case I5 6400/ Ram 8gb/ SSD 120GB + HDD 500gb/ M??n ..", "Dell 9020/ Chip i3 4150/ Ram 4gb/ SSD 128gb + m??n ..", "Case B85/ chip i7 4790/ Ram 8gb/ SSD 120 + HDD ..", "Dell 9020/ Chip G3220/ Ram 4gb/ SSD 128gb + M??n ..", "Dell 9020 chip i5 4570/ ram 4gb/SSD 240gb + M??n ..", "B??? m??y t??nh core i5 4570/ ram 8gb/ vga GTX 750Ti ..", "B??? m??y t??nh Core i7/ Ram 8gb/ SSD 120 + M??n 20''", "B??? m??y H110, Ch??p I3 6100, Ram 4gb, SSD120, M??n ..", "B??? m??y H110, Ch??p G 4400, Ram 4gb, Ssd 120g , M??n ..", "B??? m??y t??nh core i5 /Ram 8gb/SSD 120gb + M??n 19 ..", "B??? m??y t??nh i5/ram 8gb/SSD 120 + M??n 19 icnh"];
            let arrComputerPrice = ["4.200.000 ??", "5.550.000 ??", "4.000.000 ??", "5.800.000 ??", "6.150.000 ??", "6.500.000 ??", "4.650.000 ??", "7.300.000 ??", "4.250.000 ??", "5.450.000 ??", "9.100.000 ??", "5.600.000 ??", "5.600.000 ??", "5.200.000 ??", "4.800.000 ??", "5.100.000 ??"];
            let newOldContent = document.getElementById("new-old-content");
            let counter = 1;
            for (let i = 0; i < arrComputerName.length; i++) {
                if (i == 4) {
                    newOldContent.innerHTML += `
                                        <div class="computer-items ${counter}">
                                            <div>
                                                <img class="computer-img" src="/Image/newold1_img.jpg" alt="">
                                            </div>
                                            <div class="computer-text">${arrComputerName[i]}</div>
                                            <div class="computer-price">${arrComputerPrice[i]}</div>
                                            <p><div class="computer-cart" id="${counter}"><i class="fa-solid fa-cart-shopping"></i><span class="card-click">Th??m v??o gi??? h??ng</span></div></p>
                                        </div>                   
                                        `
                    counter++;
                } else {
                    newOldContent.innerHTML += `
                                        <div class="computer-items ${counter}">
                                            <div>
                                                <img class="computer-img" src="/Image/newold_img.jpg" alt="">
                                            </div>
                                            <div class="computer-text">${arrComputerName[i]}</div>
                                            <div class="computer-price">${arrComputerPrice[i]}</div>
                                            <p><div class="computer-cart" id="${counter}"><i class="fa-solid fa-cart-shopping"></i><span class="card-click">Th??m v??o gi??? h??ng</span></div></p>
                                        </div>  
                                        `
                    counter++;

                }
            }

            let arrOfficeImg = ["/Image/office1.jpg", "/Image/office2.jpg", "/Image/office3.jpg", "/Image/office4.jpg", "/Image/office5.jpg"];
            let arrOfficeName = ["C??y m??y t??nh H410/ chip I3 10105/ Ram 8gb/ SSD ..", "Case H110/ Chip I3 6100/ Ram 8gb/ SSD 120GB", "C??y m??y t??nh H410/ Chip G6400/ Ram 8gb/ SSD 120GB", "Case H81/i3 4150/ram 4gb/ SSD 120", "Case B85/ chip i5 4570/ Ram 8gb/ SSD 120gb"];
            let arrOfficePrice = ["7.200.000 ??", "4.300.000 ??", "5.800.000 ??", "3.300.000 ??", "4.100.000 ??"];


            let arrOldGameImg = ["/Image/old_game1.jpg", "/Image/old_game2.jpg", "/Image/old_game3.jpg", "/Image/old_game4.jpg", "/Image/old_game5.jpg"];
            let arrOldGameName = ["C???u h??nh Game- ????? H???a -Render i7 4790/ ram 16/ ..", "Case H81/ Chip I5 4570/ Ram 8gb/ GTX 1050/ SSD 120", "Case B85/ Chip i5 4570/ Ram 8gb/ GTX 1050ti/ SSD ..", "Case h81/ chip i3 4150/ Ram 8gb/ SSD 120/ GTX 75- ..", "Case H310/ chip i3 9100F/ Ram 8gb/ SSD 120 / GTX .."];
            let arrOldGamePrice = ["8.200.000 ??", "5.500.000 ??", "6.000.000 ??", "4.950.000 ??", "6.250.000 ??"];

            let arrNewGameImg = ["/Image/new_game1.jpg", "/Image/new_game2.jpg", "/Image/new_game3.jpg", "/Image/new_game4.jpg", "/Image/new_game5.jpg", "/Image/new_game6.jpg", "/Image/new_game7.jpg", "/Image/new_game8.jpg", "/Image/new_game9.jpg", "/Image/new_game10.jpg"];
            let arrNewGameName = ["Case Gaming I5 9400F/Ram 16gb/ GTX 1650/ SSD 256gb", "Case Game ????? H???a B460/ Chip i5 10400F/ Ram 8gb/ ..", "Case ????? H???a Game Z490/ chip i7 10700k/ Ram 16gb/ ..", "Case B460/ chip i5 10400/ ram 16gb/ ssd 256/ Vga ..", "Case H410/ Chip i3 10100F/ Ram 8gb/ SSD 120/ GTX ..", "Main B365/ Chip G5400/ Ram 8gb/ SSD 120 GTX 1050TI", "Case H510/ chip i3 10105/ Ram 8gb/ SSD 120GB", "Case H510/ chip i3 10100/ ram 8gb/ SSD 120 / VGA ..", "Case B460/ chip I7 10700/ Ram 16gb/ SSD 250gb/ ..", "Case B360/ I5 9400F/ Ram 8gb/ GTX 1060 gb/ SSD 120"];
            let arrNewGamePrice = ["Li??n h???", "12.000.000 ??", "22.400.000 ??", "15.600.000 ??", "8.200.000 ??", "Li??n h???", "7.200.000 ??", "8.650.000 ??", "15.500.000 ??", "Li??n h???"];

            let arrXeonImg = ["/Image/xeon1.jpg", "/Image/xeon2.jpg", "/Image/xeon3.jpg", "/Image/xeon4.jpg", "/Image/xeon5.jpg", "/Image/xeon6.jpg", "/Image/xeon7.jpg", "/Image/xeon8.jpg", "/Image/xeon9.jpg", "/Image/xeon10.jpg"];
            let arrXeonName = ["WOKSTATION RENDER Dual Xeon E5 2689 /RAM 64G ..", "NOXPLAYER APP TOOL - DUAL XEON E5 2670v2 /64Gb / ..", "HP Workstation Z440 Chip E5 2678 v3 Ram 16gb/ Vga ..", "HP Workstation Z440 Chip E5 2678 V3 Ram 32gb/ Vga ..", "Dell Precision T3610 / chip Xeon 1650/ Ram 16GB/ ..", "XEON E5 2678V3/ Ram 64GB/SSD 250/ VGA GTX1060-6gb", "XEON E5 2678V3 / 32Gb / SSD 250 /VGA 2Gb", "NOXPLAYER APP TOOL - XEON E5 2678V3 / 32Gb / ..", "C???U H??NH NOXPLAYER - XEON E5 2678V3 / 64Gb / GTX ..", "DUAL XEON E5 2678V3 /64Gb /GTX 1050Ti-4gb"];
            let arrXeonPrice = ["Li??n h???", "13.500.000 ??", "15.700.000 ??", "14.500.000 ??", "Li??n h???", "16.800.000 ??", "11.800.000 ??", "12.500.000 ??", "14.000.000 ??", "16.000.000 ??"];

            let arrSynchronizedImg = ["/Image/Synchronized1.jpg", "/Image/Synchronized2.jpg", "/Image/Synchronized3.jpg", "/Image/Synchronized4.jpg", "/Image/Synchronized5.jpg", "/Image/Synchronized6.jpg", "/Image/Synchronized7.jpg", "/Image/Synchronized8.jpg", "/Image/Synchronized9.jpg", "/Image/Synchronized10.jpg", "/Image/Synchronized11.jpg"];
            let arrSynchronizedName = ["M??y t??nh HP ProDesk 600 G2 Mini Core i3 6300T / ..", "M??y T??nh Lenovo ThinkCentre M900 SFF CPU Core I5 ..", "Dell optiplex 9020 / i5 4570/ Ram 4gb/ ssd 128gb", "Dell optiplex 9020 / i3 4150/ Ram 4gb/ ssd 128gb", "Dell optiplex 9020 / G3220/ Ram 4gb/ ssd 120gb", "Dell Precision T1700/ I3 4160/ram 4gb/HDD 250gb", "Dell Precision T1700/ I5 4570 /ram 4gb/HDD 500gb", "Dell Precision T1700/ I7 4770 /ram 8gb/HDD 500gb", "Dell Optiplex 7040 /chip i5 6400/ Ram 4GB/ SSD ..", "Dell Optiplex 7040/ chip i3 6100/ Ram 4gb/ SSD ..", "Dell Optiplex 7040/ Chip G 4400/ Ram 4gb / SSD .."];
            let arrSynchronizedPrice = ["4.500.000 ??", "6.100.000 ??", "4.350.000 ??", "3.800.000 ??", "3.300.000 ??", "3.500.000 ??", "4.200.000 ??", "6.350.000 ??", "5.400.000 ??", "4.850.000 ??", "4.450.000 ??"];

            let arrCPUImg = ["/Image/CPU1.jpg", "/Image/CPU2.jpg", "/Image/CPU3.jpg", "/Image/CPU4.jpg", "/Image/CPU5.jpg", "/Image/CPU6.jpg", "/Image/CPU7.jpg", "/Image/CPU8.jpg", "/Image/CPU9.jpg", "/Image/CPU10.jpg", "/Image/CPU11.jpg", "/Image/CPU12.jpg", "/Image/CPU13.jpg", "/Image/CPU14.jpg", "/Image/CPU15.jpg", "/Image/CPU16.jpg", "/Image/CPU17.jpg", "/Image/CPU18.jpg", "/Image/CPU19.jpg", "/Image/CPU20.jpg"];
            let arrCPUName = ["Chip I3 10100 Tray 3.60GHz tubo 4.30 Socket 1200 ..", "Chip I5 10400 Tray 2.90GHz tubo 4.30 Socket 1200 ..", "CPU Intel Pentium Gold G7400 Processor", "CPU Intel Core i3-12100F", "CPU Intel Core i5-12400F", "CPU Intel Core i5-12400", "CPU Intel Core i7-12700", "Chip I3 10100F 3.60GHz tubo 4.30 Socket 1200 ..", "Ch??p i3 4130, 4150 c??", "Ch??p I5 4590 c?? ( 3.30GHz tubo 3.70 )", "Ch??p core I7 4790 (8mb cache up to 4.00 GHz)", "Chip I3 6100 c?? ( 3.70 GHz)", "Chip core i3 9100F (3.6 Ghz uptu 4.20 )", "CPU intel i5 9400F 2.90GHz tubo 4.10 Socket 1151 ..", "Chip Intel Core i5 8400 2.8Ghz Turbo Up to 4Ghz ..", "CPU intel i3 10100 3.60GHz tubo 4.30 Socket 1200 ..", "CPU intel i5 10400 2.90GHz tubo 4.30 Socket 1200 ..", "CPU intel i7 10700 2.90GHz tubo 4.80 Socket 1200 ..", "CPU intel i5 10400F 2.90GHz tubo 4.30 Socket 1200 ..", "CPU intel i7 10700K 3.80GHz tubo 5.10 Socket 1200 .."];
            let arrCPUPrice = ["2.800.000 ??", "3.650.000 ??", "1.850.000 ??", "2.500.000 ??", "4.000.000 ??", "4.500.000 ??", "8.500.000 ??", "2.250.000 ??", "500.000 ??", "750.000 ??", "1.600.000 ??", "1.300.000 ??", "1.950.000 ??", "2.700.000 ??", "2.750.000 ??", "2.900.000 ??", "4.050.000 ??", "7.100.000 ??", "3.500.000 ??", "8.250.000 ??"];

            let arrMainboardImg = ["/Image/MAINBOARD1.jpg", "/Image/MAINBOARD2.jpg", "/Image/MAINBOARD3.jpg", "/Image/MAINBOARD4.jpg", "/Image/MAINBOARD5.jpg", "/Image/MAINBOARD6.jpg", "/Image/MAINBOARD7.jpg", "/Image/MAINBOARD8.jpg", "/Image/MAINBOARD9.jpg", "/Image/MAINBOARD10.jpg", "/Image/MAINBOARD11.jpg", "/Image/MAINBOARD12.jpg", "/Image/MAINBOARD13.jpg", "/Image/MAINBOARD14.jpg", "/Image/MAINBOARD15.jpg", "/Image/MAINBOARD16.jpg", "/Image/MAINBOARD17.jpg", "/Image/MAINBOARD18.png", "/Image/MAINBOARD19.jpg", "/Image/MAINBOARD20.jpg"];
            let arrMainboardName = ["Main B75 Samsung ( 4 khe Ram)", "Main MSI H87-G43 Gaming ( 4 khe ram )", "Mainboard ASRock Fatal1ty H97 Performance", "Main Gigabyte H110M-DS2", "Main Gigabyte B150M-D3H", "Main MSI H410M-A Pro", "Mainboard Gigabyte B660M DS3H DDR4", "Mainboard Asus TUF GAMING B660M-PLUS WIFI D4", "Mainboard Gigabyte B660M GAMING DDR4", "Mainboard Gigabyte Z690 GAMING X", "Main H61 c?? ( s???ch ?????p nh?? m???i)", "Main ASUS H81M-D c??", "Main gigabyte B85m-d2v", "Main Gigabyte H81 c??", "Main Gigabyte H87-HD3", "Main ASROCK B365M-Pro4", "Gigabyte B365 D2V", "GIGABYTE B360 AORUS Pro", "Main Z390-UD Gigabyte", "Mainboard ASUS TUF Gaming B460M-PLus"];
            let arrMainboardPrice = ["900.000 ??", "1.300.000 ??", "1.200.000 ??", "600.000 ??", "900.000 ??", "1.600.000 ??", "3.150.000 ??", "4.600.000 ??", "2.950.000 ??", "6.300.000 ??", "650.000 ??", "700.000 ??", "900.000 ??", "650.000 ??", "1.150.000 ??", "2.050.000 ??", "950.000 ??", "2.200.000 ??", "2.200.000 ??", "2.650.000 ??"];

            let arrRAMImg = ["/Image/RAM1.png", "/Image/RAM2.jpg", "/Image/RAM3.jpg", "/Image/RAM4.jpg", "/Image/RAM5.jpg", "/Image/RAM6.jpg", "/Image/RAM7.jpg", "/Image/RAM8.jpg", "/Image/RAM9.jpg", "/Image/RAM10.jpg", "/Image/RAM11.jpg", "/Image/RAM12.jpg"];
            let arrRAMName = ["Ram Corsair Vengeance LPX 16GB 3200MHz DDR4 ..", "RAM TEAMGROUP T-Force Dark Z 16GB DDR4 3200MHz", "Ram 4gb/DDR3", "Ram 4gb Bus 1600 T???n Nhi???t Corsai", "Ram 4gb DDr 4 Bus 2133 & 2400", "Ram 8gb ddr3 c??", "Ram 8gb- DDr4 XPG ADATA Bus 2666", "Ram kingston 16gb/ ddr4 bus 2400", "RAM G.SKILL Trident Z RGB 16GB 3000MHz DDR4 ..", "Ram Kingston Hyper 8gb- DDr4- Bus 2666", "Ram GSKILL 8gb bus 2666 AEGIS ( 1x8)", "Ram 16gb GSKILL RIPJAWS DDr4 Bus 3000 ( 16GB x1)"];
            let arrRAMPrice = ["1.500.000 ??", "1.600.000 ??", "250.000 ??", "350.000 ??", "350.000 ??", "550.000 ??", "950.000 ??", "1.500.000 ??", "2.450.000 ??", "1.000.000 ??", "1.000.000 ??", "2.300.000 ??"];

            let arrHDSDImg = ["/Image/HDD1.jpg", "/Image/HDD2.jpg", "/Image/HDD3.jpg", "/Image/HDD4.jpg", "/Image/HDD5.jpg", "/Image/HDD6.jpg", "/Image/HDD7.jpg", "/Image/HDD8.jpg", "/Image/HDD9.jpg", "/Image/HDD10.jpg",];
            let arrHDSDName = ["HDD 250gb", "HDD 500gb C??", "HDD 1TB", "HDD WD 2TB", "SSD 250 Lexar NM610 M2 Gen3x4", "SSD 120Gb Kingfast", "SSD M2 1TB intel 655P NVMe 2280", "SSD 256 Samsung NVMe PM981 M.2 PCIe Gen3 x4", "??? c???ng laptop 500gb c??", "??? c???ng ( HDD) laptop c?? 1TB"];
            let arrHDSDPrice = ["250.000 ??", "350.000 ??", "600.000 ??", "900.000 ??", "800.000 ??", "Li??n h???", "3.150.000 ??", "Li??n h???", "300.000 ??", "600.000 ??"];

            let arrVGAImg = ["/Image/VGA1.jpg", "/Image/VGA2.jpg", "/Image/VGA3.jpg", "/Image/VGA4.jpg", "/Image/VGA5.jpg", "/Image/VGA6.jpg", "/Image/VGA7.jpg", "/Image/VGA8.jpg", "/Image/VGA9.jpg", "/Image/VGA10.jpg", "/Image/VGA11.jpg", "/Image/VGA12.jpg", "/Image/VGA13.jpg", "/Image/VGA14.jpg", "/Image/VGA15.jpg", "/Image/VGA16.jpg", "/Image/VGA17.jpg", "/Image/VGA18.jpg", "/Image/VGA19.jpg", "/Image/VGA20.jpg"];
            let arrVGAName = ["Card m??n h??nh NVIDIA RTX A4000 16GB", "Vga GTX 950 - 2gb - d5 -128 b??t", "Galax GTX 1060-3gb OC D5 192 bit", "Vga Asrock RX 6500 XT Phantom Gaming D 4GB OC", "VGA MSI GTX 1650 VENTUF -4GB OC", "MSI GTX 1050 Ti 4gb OC", "Vga ASUS GTX 1050 - 2GB-D5 Dual Fan", "VGA ASUS 710 -1GB-D5", "Vga GALAX GTX 1050-2gb-D5-128 bit", "Gigabyte GTX 960-2gb-d5-128Bit", "MSI GTX 960-2gb-d5-128 bit ( 2 Fan)", "Vga MSI GTX 760 Gaming 2gb-d5-256 bit", "Vga Gigabyte GTX 1050 - 2gb - DDr5 - 128 b??t", "Vga giga GTX 1060 c?? 3gb- DDR5 - 192 b??t", "MSI GTX 1050ti 4gb-d5-128 bit", "Vga Gigabyte GTX 1660 Super 6gb-DDR6", "VGA Zotac GTX 1660- 6gb- d5 192bit", "VGA GALAX 1650 XE ( 1Click OC) -4gb-DRR6 -128Bit", "VGA Gigabyte GTX 1650 Super 4gb - DDR6 - 128Bit", "VGA Gigabyte RTX 2060 Super 8GB - D5 - 256 B??t"];
            let arrVGAPrice = ["12.000.000 ??", "2.200.000 ??", "2.100.000 ??", "5.400.000 ??", "2.900.000 ??", "2.200.000 ??", "1.800.000 ??", "700.000 ??", "1.850.000 ??", "2.200.000 ??", "2.600.000 ??", "Li??n h???", "1.800.000 ??", "2.000.000 ??", "2.100.000 ??", "2.850.000 ??", "Li??n h???", "Li??n h???", "Li??n h???", "4.600.000 ??"];

            let arrPSUImg = ["/Image/PSU1.jpg", "/Image/PSU2.jpg", "/Image/PSU3.jpg", "/Image/PSU4.jpg", "/Image/PSU5.jpg"];
            let arrPSUName = ["Ngu???n Cooler Master 700w Elite V3 PC700", "Ngu???n Antec V550", "Ngu???n Cooler Matster 500W & 550W", "Ngu???n SAMA 700w 80 plus Bzonze", "Ngu???n Xigmatek II X650 Chu???n 80 Plus"];
            let arrPSUPrice = ["1.000.000 ??", "650.000 ??", "450.000 ??", "950.000 ??", "850.000 ??"];

            let arrCASEImg = ["/Image/CASE1.png", "/Image/CASE2.jpg", "/Image/CASE3.jpg", "/Image/CASE4.jpg", "/Image/CASE5.jpg", "/Image/CASE6.jpg"];
            let arrCASEName = ["Case XIGMATEK AQUARIUS S", "V??? Case SAMA 3301", "Case Xtech F3", "Case Vietech Duty X8", "Casse Viettech X21 Stric", "Case Xigmatek VENOM (EN41479)"];
            let arrCASEPrice = ["950.000 ??", "750.000 ??", "550.000 ??", "600.000 ??", "580.000 ??", "800.000 ??"];

            let arrNewScreenImg = ["/Image/new_screen1.jpg", "/Image/new_screen2.jpg", "/Image/new_screen3.jpg", "/Image/new_screen4.jpg", "/Image/new_screen5.jpg", "/Image/new_screen6.jpg", "/Image/new_screen7.jpg", "/Image/new_screen8.jpg", "/Image/new_screen9.jpg", "/Image/new_screen10.jpg", "/Image/new_screen11.jpg", "/Image/new_screen12.jpg", "/Image/new_screen13.jpg", "/Image/new_screen14.jpg", "/Image/new_screen15.jpg", "/Image/new_screen16.jpg"];
            let arrNewScreenName = ["M??n h??nh m??y t??nh HKC MB21V13 21.5 inch FHD VA", "M??n h??nh Dahua DHI-LM22-A200 (21.5 ..", "Ma??n hi??nh HP N246V 23.8Inch IPS", "M??n h??nh Dell S2421HN ..", "M??n h??nh m??y t??nh MSI MD241PW 23.8inch FHD IPS", "M??n h??nh MSI Optix G241 ..", "M??n h??nh MSI 24 Pro MP241X 75Hz", "M??n h??nh 27 VSP IP2703S Esport Gaming 165 Hz", "M??n H??nh 24 Inch DUAN BYK 248 - IPS Full Vi???n 75 ..", "M??n H??nh 22 Inch DUAN BYK 220 AH- IPS Full Vi???n ..", "M??n H??nh 22 KingView IPS KV 2219H Full Vi???n", "M??n H??nh LED Cong 24 Sam sung C24F390FHE", "M??n h??nh HKC HA 238 IPS Full HD", "M??n h??nh Asus TUF GAMING VG27VQ Cong Full HD ..", 'M??n H??nh MSI Optix G27CQ4 Cong 27" 2k 165 Hz 1Ms', 'M??n H??nh Dell P2719H 27" FHD IPS full Vi???n'];
            let arrNewScreenPrice = ["2.850.000 ??", "2.300.000 ??", "2.950.000 ??", "4.850.000 ??", "5.900.000 ??", "Li??n h???", "2.700.000 ??", "3.450.000 ??", "2.350.000 ??", "2.000.000 ??", "Li??n h???", "Li??n h???", "Li??n h???", "6.500.000 ??", "7.890.000 ??", "5.100.000 ??"];

            let arrOldScreenImg = ["/Image/old_screen1.jpg", "/Image/old_screen2.jpg", "/Image/old_screen3.jpg", "/Image/old_screen4.jpg", "/Image/old_screen5.jpg", "/Image/old_screen6.jpg", "/Image/old_screen7.jpg", "/Image/old_screen8.jpg", "/Image/old_screen9.jpg", "/Image/old_screen10.jpg", "/Image/old_screen11.jpg", "/Image/old_screen12.jpg", "/Image/old_screen13.jpg", "/Image/old_screen14.jpg", "/Image/old_screen15.jpg", "/Image/old_screen16.jpg", "/Image/old_screen17.jpg", "/Image/old_screen18.jpg", "/Image/old_screen19.jpg", "/Image/old_screen20.jpg", "/Image/old_screen21.jpg"];
            let arrOldScreenName = ["M??n h??nh LED 17 LENOVO 1714", "M??n H??nh HP 20 Prodisplay P200 Led", "M??n H??nh 20 HKC S2035 Full HD 1920x1080", "M??n h??nh 22 Dell P2214H", "M??n h??nh HP ELITEDISPLAY E222 1920x1080", "Ma??n hi??nh HP P224 Full vi???n", "M??n h??nh Dell SE2219HX 21.5Inch IPS", "Ma??n hi??nh Dell P2217H 21.5Inch IPS Ch??n Xoay", "Dell S2418HN tr??n vi???n", "M??n h??nh AOC I2490 VXH/ BS Full vi???n", "M??n H??nh 24 BenQ Xl2411144Hz 1Ms Chuy??n Game", "Dell Utrashap U2417 full Vi???n", "M??n h??nh Philip 24 Led IPS 75Hz Full HD (1080P)", "M??n h??nh 18.5'' HP LV 1911 LED", "M??n h??nh 20 Dell E2016", "M??n H??nh Dell E 2316 Led Full HD 1920X1080", "M??n h??nh Dell 22 (E2216H)", "M??n h??nh 22 LED Viewsonic VX 2209", "M??n H??nh dell E 2416 ( Full HD 1920x1080 )", "M??n Dell UltraSharp LED - U 2312 HM full HD", 'M??n H??nh Sam sung 27" Cong 27F397'];
            let arrOldScreenPrice = ["600.000 ??", "Li??n h???", "1.250.000 ??", "Li??n h???", "Li??n h???", "2.300.000 ??", "2.900.000 ??", "2.850.000 ??", "2.900.000 ??", "2.600.000 ??", "3.000.000 ??", "4.100.000 ??", "Li??n h???", "1.250.000 ??", "1.300.000 ??", "2.250.000 ??", "1.750.000 ??", "Li??n h???", "2.350.000 ??", "Li??n h???", "3.200.000 ??"];

            let arrGEARImg = ["/Image/GEAR1.jpg", "/Image/GEAR2.jpg", "/Image/GEAR3.jpg", "/Image/GEAR4.jpg", "/Image/GEAR5.jpg", "/Image/GEAR6.jpg", "/Image/GEAR7.jpg", "/Image/GEAR8.jpg", "/Image/GEAR9.jpg", "/Image/GEAR10.jpg"];
            let arrGEARName = ["B??n Ph??m Fuhlen 411", "B??n ph??m C?? quang G-Net LK 718", "Chu???t Fuhlen G90", "Chu???t Fuhlen G90S", "Ph??m c?? Fuhlen D destroyer", "Web Cam Dahua Z2+ 1080P C?? Mic Si??u n??t, C???ng USB", "Chu???t Fuhlen", "T???n Nhi???t CPU cooler master MA 610", "T???n CPU Jonsbo CR-1000", "Tai Nghe Dareu EH 416"];
            let arrGEARPrice = ["180.000 ??", "700.000 ??", "350.000 ??", "395.000 ??", "850.000 ??", "350.000 ??", "120.000 ??", "1.000.000 ??", "380.000 ??", "390.000 ??"];

            let arrOldLaptopImg = ["/Image/old_laptop1.jpg", "/Image/old_laptop2.jpg", "/Image/old_laptop3.jpg", "/Image/old_laptop4.jpg", "/Image/old_laptop5.jpg", "/Image/old_laptop6.jpg", "/Image/old_laptop7.jpg", "/Image/old_laptop8.jpg", "/Image/old_laptop9.jpg", "/Image/old_laptop10.jpg", "/Image/old_laptop11.jpg", "/Image/old_laptop12.jpg", "/Image/old_laptop13.jpg", "/Image/old_laptop14.jpg", "/Image/old_laptop15.jpg"];
            let arrOldLaptopName = ["Macbook Pro Retina 15'' 2014 core I7 Ram 16gb ..", "Dell Latitude E6540 i7 4810MQ- Ram 16gb-SSD 256gb", "Laptop Dell 7537 i5 4200U ram 6gb-SSD 120gb Vga ..", "Laptop dell 5548/ i5 5200/ ram 4gb/ ssd 240gb/Vga ..", "Laptop Dell Vostro 5568 i7 7500U/8GB/SSD ..", "Dell Inspiron 3558 Core i5 - 5200U/ Ram 4GB/ SSD ..", "Dell E5450/ Core I5 5300/ Ram 8GB/ SSD 120GB/ M??n ..", "Laptop Dell E6430/ I5 3320/ ram 4gb / SSD 120Gb/ ..", "Laptop Dell G3 15 3500 i5 ..", "Laptop HP Pavilion 14 ce1008TU i5 8265U/4GB/SSD ..", "Laptop HP 430 G1 core i5 4200u ram 8g ssd 120g", "Laptop HP Probook 650 G1 Core i5 4200/ Ram 4GB/ ..", "Laptop HP ProBook 450 G6 (5YM80PA) I5 8265U Ram ..", "ASUS TUF A15 FA506II-AL016T (Ryzen 7-4800H, 16G, ..", "Laptop ASUS FX503V i7-7700HQ/16G/1T+128G .."];
            let arrOldLaptopPrice = ["15.800.000 ??", "Li??n h???", "Li??n h???", "Li??n h???", "Li??n h???", "Li??n h???", "7.800.000 ??", "Li??n h???", "13.800.000 ??", "6.500.000 ??", "5.000.000 ??", "6.400.000 ??", "9.500.000 ??", "17.000.000 ??", "14.500.000 ??"];

            let arrName = [arrOfficeName, arrOldGameName, arrNewGameName, arrXeonName, arrSynchronizedName, arrCPUName, arrMainboardName, arrRAMName, arrHDSDName, arrVGAName, arrPSUName, arrCASEName, arrNewScreenName, arrOldScreenName, arrGEARName, arrOldLaptopName];
            let arrImg = [arrOfficeImg, arrOldGameImg, arrNewGameImg, arrXeonImg, arrSynchronizedImg, arrCPUImg, arrMainboardImg, arrRAMImg, arrHDSDImg, arrVGAImg, arrPSUImg, arrCASEImg, arrNewScreenImg, arrOldScreenImg, arrGEARImg, arrOldLaptopImg];
            let arrPrice = [arrOfficePrice, arrOldGamePrice, arrNewGamePrice, arrXeonPrice, arrSynchronizedPrice, arrCPUPrice, arrMainboardPrice, arrRAMPrice, arrHDSDPrice, arrVGAPrice, arrPSUPrice, arrCASEPrice, arrNewScreenPrice, arrOldScreenPrice, arrGEARPrice, arrOldLaptopPrice];
            for (let k = 1; k < arrId.length; k++) {
                let getId = document.getElementById(arrId[k]);
                for (let i = 0; i < arrName[k - 1].length; i++) {
                    getId.innerHTML += `
                                            <div class="computer-items ${counter}">
                                                <div>
                                                    <img class="computer-img" src="${arrImg[k - 1][i]}" alt="error">
                                                </div>
                                                <div class="computer-text">${arrName[k - 1][i]}</div>
                                                <div class="computer-price">${arrPrice[k - 1][i]}</div>
                                                <p><div class="computer-cart" id="${counter}"><i class="fa-solid fa-cart-shopping"></i><span class="card-click">Th??m v??o gi??? h??ng</span></div></p>
                                            </div>  
                                            `
                    counter++;
                }
            }

            break;
        case "iconsContact":
            let arrIcon = ["/Image/tel.jpg", "/Image/zalo.jpg", "/Image/facebook.webp", "/Image/messager.jpg"];
            let icon = document.getElementsByClassName("icon");
            for (let i = 0; i < icon.length; i++) {
                icon[i].setAttribute("style", `background-image: url(${arrIcon[i]});background-size: 105% 105%; background-repeat: no-repeat;`)
            }
            break;
        case "mainPicture":
            let arrMainPicture = ["Image/main_picture1.jpg", "Image/main_picture2.jpg", "/Image/main_picture3.jpg", "/Image/main_picture4.jpg", "/Image/main_picture5.jpg"];
            let mainImg = document.getElementById("img");
            let count = 1;
            let test = () => {
                mainImg.setAttribute("src", `${arrMainPicture[count]}`)
                count++;
                if (count == arrMainPicture.length) {
                    count = 0;
                }
            }
            setInterval(() => {
                test();
            }, 2000);
            break;
        case "mainMenu1":
            let arrMenuBar1 = ["TR???N B??? M??Y T??NH C??/M???I", "CASE V??N PH??NG", "CASEGAME-????? H???A (C??)", "CASEGAME-????? H???A (M???I)", "C??Y DUAL XEON", "M??Y T??NH ?????NG B???", "CH??P B??? VI X??? L?? (CPU)", "MAINBOARD (BO M???CH CH???)", "RAM (B??? NH??? TRONG)", "HDD && SSD (??? C???NG)", "VGA (CARD M??N H??NH)", "PSU (NGU???N M??Y T??NH)", "CASE-V??? M??Y T??NH", "M??N H??NH M??Y T??NH (M???I)", "M??N H??NH M??Y T??NH C??", "GAMING GEAR", "LAPTOP C??"];
            let listIcons1 = ["/Image/listIcons1.png", "/Image/listIcons2.png", "/Image/listIcons3.png", "/Image/listIcons4.png", "/Image/listIcons5.png", "/Image/listIcons6.png", "/Image/listIcons7.png", "/Image/listIcons8.png", "/Image/listIcons9.png", "/Image/listIcons10.png", "/Image/listIcons11.png", "/Image/listIcons12.png", "/Image/listIcons13.png", "/Image/listIcons14.png", "/Image/listIcons15.png", "/Image/listIcons16.png", "/Image/listIcons17.png"]
            let mainMenu1 = document.getElementById("main-menu1");
            for (let i = 0; i < arrMenuBar1.length; i++) {
                mainMenu1.innerHTML +=
                    `
                                            <div class="menu-list1 da-10"><img class="list-icon" src="${listIcons1[i]}" alt="">${arrMenuBar1[i]}</a></div>
                                        `
            }
            break;
    }
}
view.acount = async () => {
    acount.innerHTML = component.acount;
    await firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            let response = await firebase.firestore()
                .collection("User")
                .doc(auth.currentUser.email)
                .get()
            loginName.innerHTML = response.data().userInfor.Username;
            information.addEventListener("click", () => {
                view.setScreenActive("informationUser");
                productList.setAttribute("style", "display:none");
            })
            // if (signOut != null) {
            signOut.addEventListener("click", async () => {
                let confirmSignOut = confirm("B???n c?? mu???n tho??t phi??n ????ng nh???p hi???n t???i");
                if (confirmSignOut) {
                    await firebase.firestore()
                        .collection("User")
                        .doc(auth.currentUser.email)
                        .update({
                            status: "offline"
                        })
                    firebase.auth().signOut();
                    alert("C???m ??n b???n ???? quan t??m ?????n s???n ph???m c???a ch??ng t??i!");
                    localStorage.setItem("currentView", "start");

                    // location.reload();
                }
            });
            changePass.addEventListener("click", () => {
                if (changePassword.style.display == "" || changePassword.style.display == "none") {
                    changePassword.style.display = "block";
                }
            })
            // } else {
            //     location.reload();
            // }
        } else {
            let a = new Promise((resolve, reject) => {
                tabUl.innerHTML = `
                        <button class="signIn" id="signIn">????ng nh???p</button>
                        `;
                return resolve(tabUl);
            })
            a.then((data) => {
                data.addEventListener("click", () => {
                    view.setScreenActive("loginPage");
                });
            })
                .catch(() => {
                    console.log("Sai r???i!");
                })
        }
    })
}
view.showPassword = (password, icon) => {
    if (password.type == "password") {
        password.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    } else {
        password.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    }
}
view.chatInput = (username, email) => {
    mesBoxContent.innerHTML += `
                <div class="currentUser" id="currentUser">
                    <p>${chatInput.value}</p>
                </div>
            `;
    mesBoxContent.scrollTop = mesBoxContent.scrollHeight;
    let mess = {
        content: chatInput.value,
        owner: firebase.auth().currentUser.email,
        createdAt: `${new Date()}`,
    };
    if (auth.currentUser.email != "ducanh@gmail.com") {

        model.chatSave(mess);
    } else {
        // if (chatName.innerHTML == username) {
        //     mesBoxContent.innerHTML += `
        //             <div class="currentUser" id="currentUser">
        //                 <p>${chatInput.value}</p>
        //             </div>
        //         `;
        //     mesBoxContent.scrollTop = mesBoxContent.scrollHeight;
        // }
        model.chatSave(mess, username, email);
    }
    chatInput.value = "";
}
view.changePass = () => {
    view.setErrorMessage = (id, content) => {
        document.getElementById(id).innerHTML = content;
    };
    changePassword.innerHTML = component.changePass;
    oldPassIcon.addEventListener("click", () => {
        view.showPassword(oldPassword, oldPassIcon);
    })
    newIcon.addEventListener("click", () => {
        view.showPassword(newPassword, newIcon);
    })
    confirmNewIcon.addEventListener("click", () => {
        view.showPassword(confirmNewPass, confirmNewIcon);
    })
    cancelUpdatePass.addEventListener("click", (e) => {
        e.preventDefault();
        changePassword.style.display = "none";
    })
    changePasswordForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        let response = await db.collection("User")
            .doc(auth.currentUser.email)
            .get()
        let pass = response.data().userInfor.Password;
        const data = {
            oldPassword: changePasswordForm.oldPassword.value,
            newPassword: changePasswordForm.newPassword.value,
            confirmNewPass: changePasswordForm.confirmNewPass.value
        };
        controller.changePass(data, pass);
    });
}
view.boxAnimation = () => {
    boxAnimation.innerHTML = component.boxAnimation;
    boxAnimation1.innerHTML = component.boxAnimation;
    boxAnimation2.innerHTML = component.boxAnimation;
    boxAnimation3.innerHTML = component.boxAnimation;

}
view.footer = () => {
    footer.innerHTML = component.footer
}