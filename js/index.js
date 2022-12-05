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
                        model.getMessMiss(audio);
                    }
                })
            if (auth.currentUser.email == "ducanh@gmail.com") {
                let response = await firebase.firestore()
                    .collection("AdminMessSave")
                    .get()
                let userAccountMiss = document.getElementsByClassName("userAccountMiss");
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
                            let audio = new Audio("/Audio/Nhac-chuong-tin-nhan-Zalo.mp3");
                            model.getChatAdmin(userName, response.docs[i].id, audio);
                            model.getMissAdmin(response.docs[i].id, userAccountMiss[i], audio);
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
