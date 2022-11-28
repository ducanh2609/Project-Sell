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
                                                if (chatbox.style.display == "none") {
                                                    messNumber.innerHTML = Number(miss) + 1;
                                                    audio.play();
                                                    messNotify.style.display = "block";
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            miss++;
                            localStorage.setItem("miss", miss);
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
                            console.log("111");
                            model.getChatAdmin(userName, response.docs[i].id);
                            let audio = new Audio("/Audio/Nhac-chuong-tin-nhan-Zalo.mp3");
                            let response1 = await firebase.firestore()
                                .collection("AdminMessSave")
                                .doc(response.docs[i].id)
                                .get()
                            console.log(response.docs[i].id);
                            console.log(userName);
                            let userAccount = document.getElementsByClassName("userAccount");
                            let userAccountMiss = document.getElementsByClassName("userAccountMiss");
                            if (response1.data() != undefined) {
                                let arrMess = response1.data()[userName];
                                console.log(arrMess);
                                if (arrMess != undefined) {
                                    for (let l = 0; l < arrMess.length; l++) {
                                        if (arrMess[l].owner != "ducanh@gmail.com") {
                                            let lastTimeAdmin = JSON.parse(localStorage.getItem("lastTimeAdmin"));
                                            let time = new Date(arrMess[l].createdAt)
                                            for (let j in lastTimeAdmin) {
                                                if (lastTimeAdmin[j].username == userName) {
                                                    if (lastTimeAdmin[j].time != undefined) {
                                                        if (time.getTime() > lastTimeAdmin[j].time) {
                                                            if (chatbox.style.display == "none") {
                                                                for (let k = 0; k < userAccountMiss.length; k++) {
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
                                                    lastTimeAdmin[j].missAd = Number(lastTimeAdmin[j].missAd) + 1;
                                                    localStorage.setItem("lastTimeAdmin", JSON.stringify(lastTimeAdmin));
                                                    break;
                                                }
                                            }
                                        }

                                    }
                                }

                            }
                        })
                }
            }

        } else {
            view.setScreenActive("start");
        }
    })
}
