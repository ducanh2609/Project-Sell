window.onload = () => {
    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {

            let currentView = JSON.parse(localStorage.getItem("currentView"));
            if (currentView == null) {
                view.setScreenActive("start");
            } else {
                if (currentView == "start") {
                    view.setScreenActive(currentView);
                } else {
                    view.setScreenActive("start");
                    view.setScreenActive(currentView);
                }
            }
            if (auth.currentUser.email != "ducanh@gmail.com") {
                await firebase.firestore()
                    .collection("User")
                    .doc(auth.currentUser.email)
                    .update({
                        status: "online"
                    })
                model.getMessMiss();
                model.messWaiting(auth.currentUser.email);
            }
            await firebase.firestore()
                .collection("messSave")
                .doc(firebase.auth().currentUser.email)
                .onSnapshot(async () => {
                    if (auth.currentUser.email != "ducanh@gmail.com") {
                        model.getChatSave();
                        let audio = new Audio("/Audio/Nhac-chuong-tin-nhan-Zalo.mp3");
                        let response = await firebase.firestore()
                            .collection("messSave")
                            .doc(auth.currentUser.email)
                            .get()
                        if (response.data() != undefined) {
                            let arrMess = response.data().admin;
                            let miss = JSON.parse(localStorage.getItem("miss"));
                            if (arrMess != undefined) {
                                for (let i = 0; i < arrMess.length; i++) {
                                    if (arrMess[i].owner != firebase.auth().currentUser.email) {
                                        let lastTime = JSON.parse(localStorage.getItem("lastTime"));
                                        let time = new Date(arrMess[i].createdAt)
                                        if (lastTime != undefined) {
                                            if (time.getTime() > lastTime) {
                                                if (chatbox.style.display == "none" || chatbox.style.display == "") {
                                                    messNumber.innerHTML = Number(miss) + 1;
                                                    audio.play();
                                                    messNotify.style.display = "block";
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            if (chatbox.style.display == "none") {
                                miss++;
                                localStorage.setItem("miss", miss);
                            }
                        }
                    }
                })
            if (auth.currentUser.email == "ducanh@gmail.com") {
                let response = await firebase.firestore()
                    .collection("AdminMessSave")
                    .get()
                for (let i = 0; i < response.docs.length; i++) {
                    let userRes = await firebase.firestore()
                        .collection("User")
                        .doc(response.docs[i].id)
                        .get()
                    let userName = userRes.data().userInfor.Username;
                    await firebase.firestore()
                        .collection("AdminMessSave")
                        .doc(response.docs[i].id)
                        .onSnapshot(async () => {
                            model.getChatAdmin(userName, response.docs[i].id);
                            let audio = new Audio("/Audio/Nhac-chuong-tin-nhan-Zalo.mp3");
                            let response1 = await firebase.firestore()
                                .collection("AdminMessSave")
                                .doc(response.docs[i].id)
                                .get()
                            let userAccount = document.getElementsByClassName("userAccount");
                            let userAccountMiss = document.getElementsByClassName("userAccountMiss");
                            if (response1.data() != undefined) {
                                let arrMess = response1.data()[userName];
                                let lastTimeAdmin = JSON.parse(localStorage.getItem("lastTimeAdmin"));
                                let check;
                                if (lastTimeAdmin != null) {
                                    if (arrMess != undefined) {
                                        for (let l = 0; l < arrMess.length; l++) {
                                            if (arrMess[l].owner != "ducanh@gmail.com") {
                                                let time = new Date(arrMess[l].createdAt);
                                                for (let j = 0; j < lastTimeAdmin.length; j++) {
                                                    if (lastTimeAdmin[j].username == userName) {
                                                        if (lastTimeAdmin[j].time != undefined) {
                                                            if (time.getTime() > lastTimeAdmin[j].time) {
                                                                if (chatbox.style.display == "none" || chatbox.style.display == "") {
                                                                    for (let k = 0; k < userAccount.length; k++) {
                                                                        if (userAccount[k].innerHTML == userName) {
                                                                            userAccountMiss[k].innerHTML = Number(lastTimeAdmin[j].missAd) + 1;
                                                                            audio.play();
                                                                            userAccountMiss[k].style.display = "block";
                                                                            break;
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                        check = j;
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                        if (chatbox.style.display == "none") {
                                            if (lastTimeAdmin[check] != undefined) {
                                                lastTimeAdmin[check].missAd = Number(lastTimeAdmin[check].missAd) + 1;
                                                localStorage.setItem("lastTimeAdmin", JSON.stringify(lastTimeAdmin));
                                            }
                                        }
                                    }
                                }

                            }
                        })
                    await firebase.firestore()
                        .collection("User")
                        .doc(response.docs[i].id)
                        .onSnapshot(async () => {
                            let res = await firebase.firestore()
                                .collection("User")
                                .doc(response.docs[i].id)
                                .get()
                            let getStatus = res.data().status;
                            let statusUser = document.getElementsByClassName("statusUser");
                            console.log(statusUser[i]);
                            console.log(getStatus);
                            if (getStatus == "online") {
                                statusUser[i].classList.add("status");
                                statusUser[i].classList.remove("status-off");
                            } else {
                                statusUser[i].classList.remove("status");
                                statusUser[i].classList.add("status-off");
                            }
                        })
                }

            }

        } else {
            view.setScreenActive("start");
        }
    })
    // window.onbeforeunload = async (e) => {
    //     if (e.path[0].closed != true) {
    //         setTimeout(()=>{
    //             window.onload();
    //         },3000)
    //         await firebase.firestore()
    //             .collection("User")
    //             .doc(auth.currentUser.email)
    //             .update({
    //                 status: "offline"
    //             })
    //     }
    // }
}
