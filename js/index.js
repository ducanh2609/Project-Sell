window.onload = () => {
    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            view.setScreenActive("start");
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
                            miss++
                            console.log(miss);
                            localStorage.setItem("miss", miss);
                        }
                    }
                    // else {
                    //     model.getChatAdmin(currentChatName);
                    // }
                })
        } else {
            view.setScreenActive("start");
        }
    })
}
