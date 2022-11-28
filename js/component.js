const component = {};
component.registerPage = `
            <div class="register-container">
                            
                <form class="register-form" id="registerForm">
                    <div class="login">

                        <!-- Username -->
                        <label for="username">Username</label> <br>
                        <input id='username' type="text" class="fixed" name="username" placeholder="Username">
                        <br>
                        <span class="errorUserName" id="errorUserName"></span> <br>
                        
                        <!-- Email -->
                        <label for="email"> Email </label> <br>
                        <input id="email" type="text" class="fixed" name="email" placeholder="Email"> <br>
                        <span class="errorMail" id="errorMail" ></span> <br>
                        
                        <!-- Password -->
                        <label for="password">Password</label> <br>
                        <input id="password" class="fixed" type="password" name="password" placeholder="Password">
                        <i id="icon"  class="fa-solid fa-eye"></i> <br>
                        <span class="errorPass" id="errorPass" ></span> <br>
                        
                        <!-- Confirm Password -->
                        <label for="confirmPassword">Confirm password </label> <br>
                        <input id="confirmPassword" class="fixed" type="password" name="confirmPassword" placeholder="Confirm Password">
                        <i id="iconClose" class="fa-solid fa-eye"></i>
                        <span id="confirmError"></span> <br> <br>
                        
                        <!-- Nhớ tôi và quên mật khẩu -->
                        <input class="ok" id="checked" name="rules" type="checkbox">
                        <label for="checked">Agree to the <a>terms</a></label> <br>
                        <span id="ok-rules"></span> <br>
                        <!-- Nút đăng kí -->
                        <button type="submit">Register</button>
                        <button id="cancelRegister">Cancel</button>
                    </div>
                    <!-- Thông báo chỉ dẫn -->
                    <div class="okAcount">
                        You already have an account. <br> <a id="redirectLogin">Login</a>
                    </div>
                </form>

            </div>
        `;
component.loginPage = `
            <div class="login-container">
                <div class="login-modal"></div>
                <form   class="login-form" id="loginForm" >
                    <div class="login login-login">
                        
                        <!-- Email -->
                        <label for="email"> Email </label> <br>
                        <input id="email1" class="fixed" type="text" name="email" placeholder="Email"> <br>
                        <span class="errorMail" id="errorMail" ></span> <br>
                        
                        <!-- Password -->
                        <label for="password">Password</label> <br>
                        <input id="passwordLogin" class="fixed" type="password" name="password" placeholder="Password">
                        <i id="iconLogin" class="fa-solid fa-eye"></i>
                        <span class="errorPassword" id="errorPassword" ></span> <br>
                        
                        <!-- Nhớ tôi -->
                        <input class="remember-me" id="remember-me" name="rememerInfor" type="checkbox">
                        <label for="remember-me">Remember me</label> <br>
                        
                        <!-- Nút đăng nhập -->
                        <span id="error" style="display: none;">Account does not exist</span>
                        <button type="submit">Login</button>
                        <button id="cancelLogin">Cancel</button>
                        
                        <!-- Thông báo chỉ dẫn -->
                        <div class="okAcount-login">
                            <div id="forgot">Forgot password</div> <br>
                            Do not have an account. <a id="redirectRegister">Register</a>
                        </div>
                    </div>
                </form>
            </div>
        `
component.start = `
            <div class="header">
                <ul class="menu"><h3>Menu</h3>  
                    <li class="li1" id="li1">Trang chủ</li>
                    <li class="li2" id="li2">Giới thiệu</li>
                    <li class="li3" id="li3">Hỗ trợ mua hàng online</li>
                </ul>
                <div class="support">
                    <div class="support-online da-0">
                        <a href=""><i class="fa-solid fa-headphones"></i> Hỗ trợ trực tuyến</a>
                    </div>
                    <div class="cart">
                        <a class="show-card"><i class="fa-solid fa-cart-shopping"></i></a>
                        <div id="card-value">0</div>
                        <p class="show-card">Giỏ hàng</p>
                    </div>
                </div>
            </div>
            <div class="boxAnimation" id="boxAnimation"></div>
            <div class="boxAnimation" id="boxAnimation1"></div>
            <div class="admin-contact">
                <div class="icon"><a href=""></a></div>
                <div class="icon"><a href=""></a></div>
                <div class="icon"><a href=""></a></div>
                <div class="icon"><a href=""></a></div>
            </div>
            <div id="acount"></div>
            <div class="body" id="body">
                <div class="container" id="container">
                    <div class="header-content">
                        <div class="logo da-0"></div>
                        <div class="contact da-10">
                            <div class="mobile-contact">
                                <div class="number">0988 592 692</div>
                                <div class="number">0386 678 985</div>
                                <div class="number">0976228953 </div>
                            </div>
                            <div class="address-contact">Số 2 Ngõ 156 - Lê Trọng Tấn - Thanh Xuân - Hà Nội</div>
                        </div>
                    </div>
                    <div class="main" id="main">
                        <div class="main-extension">
                            <div class="extension extension1">
                                <div class="menu-bar"><i class="fa-sharp fa-solid fa-bars fa-lg"></i></div>
                                <div class="menu-text">
                                    <h3>Danh mục sản phẩm</h3>
                                </div>
                            </div>
                            <div class="extension extension2 da-0 da-sm-0 da-md-0">
                                <div class="home-page-link">Trang chủ</div>
                                <div>Dịch vụ</div>
                                <div>Tin tức</div>
                                <div>Tư vấn</div>
                                <div>Phần mềm</div>
                                <div>Liên hệ</div>
                            </div>
                            <div class="extension extension3 da-0 da-sm-0">
                                <div class="built">
                                    <i class="fa-solid fa-wrench"></i>
                                    <span>Xây dựng cấu hình</span>
                                </div>
                            </div>
                            <div class="extension extension4 da-0">
                                    <div class="search-icon" id="searchIcon"><i class="fa-solid fa-magnifying-glass fa-lg"></i></div>
                                    <div class="search-content" id="searchContent">
                                        <label for="search">Bạn muốn tìm:</label>
                                        <input class="search" id="search" type="search" placeholder="Vd:Laptop, dell, acer,...">
                                    </div>
                            </div>
                        </div>
                        <div class="main-content" id="main-content">
                            <div class="main-menu" id="main-menu"></div>
                            <div class="main-show da-0" id="mainShow">
                                <div class="main-picture" id="listImage">
                                    <img id="img" src="/Image/main_picture1.jpg" width="100%" height="100%" alt="error">
                                </div>
                                <div class="sp-picture">
                                    <div class="picture picture1"><img width="100%" height="100%" src="/Image/picture1.jpg"
                                            alt=""></div>
                                    <div class="picture picture2"><img width="100%" height="100%" src="/Image/picture2.jpg"
                                            alt=""></div>
                                    <div class="picture picture3"><img width="100%" height="100%" src="/Image/picture3.jpg"
                                            alt=""></div>
                                </div>
                            </div>
                            <div class="main-show-search" id="mainShowSearch"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="productList"></div>
            <div id="chatbox"></div>
            <div class="chatListName" id="chatListName">
                <div class="nameHeader">
                    <h3>Contact</h3>
                    <ion-icon class="nameListClose" id="nameListClose" name="remove-outline"></ion-icon>
                </div>
                <div class="nameList" id="nameList"></div>
            </div>
            <div class="messNotify" id="messNotify">
                <ion-icon class="iconNotify"  name="water"></ion-icon>
                <span id="messNumber"></span>
            </div>
            <div class="changePassword" id="changePassword"></div>
            <div class="holine-box">
                <div class="hotline-motal">
                    <div class="hotline-left">
                        <p><strong style="font-size: 25px;">TỔNG ĐÀI GÓP Ý KHIẾU NẠI</strong></p>
                        <p>(08h00 - 21h00 tất cả các ngày trong tuần)</p>
                    </div>
                    <div class="hotline-right">
                        <img src="/Image/hotline.png" alt=""> <strong style="font-size: 28px; color:red">0393 974 843</strong>
                    </div>
                </div>
            </div>
            </div>
            <footer>
            </footer>
        `
component.cartHome = `
            <div class="container" id="container">
                <div class="header-content">
                    <div id="logo" class="logo da-0"></div>
                    <div class="contact da-10">
                        <div class="mobile-contact">
                            <div class="number">0988 592 692</div>
                            <div class="number">0386 678 985</div>
                            <div class="number">0976228953 </div>
                        </div>
                        <div class="address-contact">Số 2 Ngõ 156 - Lê Trọng Tấn - Thanh Xuân - Hà Nội</div>
                    </div>
                </div>
                <div class="main1" id="main1">
                    <div class="main-extension">
                        <div class="extension extension1" id="extension1">
                            <div class="menu-bar"><i class="fa-sharp fa-solid fa-bars fa-lg"></i></div>
                            <div class="menu-text">
                                <h3>Danh mục sản phẩm</h3>
                            </div>
                        </div>
                        <div class="extension extension2 da-0 da-sm-0 da-md-0">
                            <div class="home-page-link">Trang chủ</div>
                            <div>Dịch vụ</div>
                            <div>Tin tức</div>
                            <div>Tư vấn</div>
                            <div>Phần mềm</div>
                            <div>Liên hệ</div>
                        </div>
                        <div class="extension extension3 da-0 da-sm-0">
                            <div class="built">
                                <i class="fa-solid fa-wrench"></i>
                                <span>Xây dựng cấu hình</span>
                            </div>
                        </div>
                    </div>
                    <div class="main-content">
                        <div class="main-menu1" id="main-menu1"></div>
                        <div class="preview-product" id="previewProduct"></div>
                        <div class="main-body">
                            <div class="main-body-header">
                                <span>Trang chủ ></span>
                                <span>Giỏ hàng</span>
                            </div>
                            <div class="main-body-content">
                                <div class="main-title">
                                    <h4>GIỎ HÀNG</h4>
                                </div>
                                <div class="main-card">
                                    <div class="main-card-chart">
                                        <div class="chart">
                                            <div class="step-number">
                                                <h4>1</h4>
                                            </div>
                                            <div class="step-name">GIỎ HÀNG</div>
                                        </div>
                                        <div class="chart-line"></div>
                                        <div class="chart">
                                            <div class="step-number">
                                                <h4>2</h4>
                                            </div>
                                            <div class="step-name">THANH TOÁN</div>
                                        </div>
                                        <div class="chart-line"></div>
                                        <div class="chart">
                                            <div class="step-number">
                                                <h4>3</h4>
                                            </div>
                                            <div class="step-name">SUCCESS</div>
                                        </div>
                                    </div>
                                    <div class="main-card-table" id="main-card-table">
                                        <div class="row-header">
                                            <div class="cart-col col-image" style="padding-top:0px !important">Ảnh</div>
                                            <div class="cart-col col-name">Tên sản phẩm</div>
                                            <div class="cart-col col-price">Đơn giá</div>
                                            <div class="cart-col col-count">Số lượng</div>
                                            <div class="cart-col col-price-total">Giá VNĐ</div>
                                            <div class="cart-col col-delete">Xóa</div>
                                        </div>
                                        <div id="updateCard"></div>

                                    </div>
                                    <div class="main-price-total" id="main-price-total">
                                        Tổng tiền: <span id="sum">0</span> VNĐ
                                    </div>
                                    <div class="main-card-customer">
                                        <button id="buyCont">
                                            <h3>TIẾP TỤC MUA</h3>
                                        </button>
                                        <div>
                                            <button style="background-color:red">
                                                <h3>ĐẶT HÀNG</h3>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
component.acount = `
            <ul class="tabUl" id="tabUl">
                <span class="user-icon">
                    <span id="loginName"></span>
                    <ion-icon name="person"></ion-icon>
                </span>
                <li class="acountTab tab1" id="information">Thông tin khách hàng</li>
                <li class="acountTab tab2" id="changePass">Đổi mật khẩu</li>
                <li class="acountTab tab3" id="signOut" >Đăng xuất</li>     
            </ul>
        `
component.chatbox = `
            <div class="messageBox" id="messageBox">
                <div class="mesBoxheader" id="mesBoxheader">
                    <b>Admin</b>
                    <span class="close" id="boxClose"><i class="fa-sharp fa-solid fa-square-xmark fa-lg"></i></span>
                </div>
                <div class="mesBoxContent" id="mesBoxContent"></div>
                <div class="messWaiting" id="messWaiting">
                    <p style="font-size: 10px"><i>Đối phương đang nhập tin nhắn...</i></p>
                </div>
                <input id="chatInput" type="text" class="mesBoxInput" id="mesBoxInput" placeholder="...">
            </div>
        `
component.changePass = `
            <div class="changePassword-container">

                <form class="changePasswordForm" id="changePasswordForm">
                <div class="changePass">
                    <!-- Password -->
                    <label for="oldPassword">Mật khẩu cũ</label> <br>
                    <input id="oldPassword" type="password" name="oldPassword" placeholder="Mật khẩu cũ">
                    <i id="oldPassIcon" class="fa-solid fa-eye"></i> <br>
                    <span class="errorOldPass" id="errorOldPass" style="color:red"></span> <br>

                    <!-- Password -->
                    <label for="newPassword">Mật khẩu mới</label> <br>
                    <input id="newPassword" type="password" name="newPassword" placeholder="Mật khẩu mới">
                    <i id="newIcon" class="fa-solid fa-eye"></i> <br>
                    <span class="errorNewPass" id="errorNewPass" style="color:red"></span> <br>

                    <!-- Confirm Password -->
                    <label for="confirmNewPass">Xác nhận mật khẩu </label> <br>
                    <input id="confirmNewPass" type="password" name="confirmNewPass" placeholder="Xác nhận mật khẩu">
                    <i id="confirmNewIcon" class="fa-solid fa-eye"></i> <br>
                    <span id="errorConfNewPass" style="color:red"></span> <br> <br>

                    <!-- Nút đăng kí -->
                    <div class="btn-change">
                    <button type="submit">Lưu</button>
                    <button id="cancelUpdatePass">Hủy</button>
                    </div>
                </div>
                </form>
            </div>
        `
component.inforForm = `
            <div class="inforForm">
                <div class="inforTable">
                    <div class="avatar" id="avatar">
                        <div class="userAvatar" id="userAvatar">
                            <img src="" id="imgeUpload" alt="">
                            <div class="imgUpload" id="imgUpload">
                                <ion-icon class="imgUpImg" name="camera-reverse-outline"></ion-icon>
                            </div>
                        </div>
                        <p class="UsName" id="UsName"></p>
                    </div>
                    <div class="infor" id="infor">
                        Tên khách hàng: <br> <input id="nameReceive" type="text" readonly value=""></input> <br>
                        Số điện thoại: <br> <input id="mobileReceive" type="number" readonly></input> <br>
                        Email: <br> <input id="emailReceive" type="text" readonly></input> <br>
                        Địa chỉ: <br>
                        <textarea name="" id="addressReceive" cols="30" rows="10" readonly></textarea>
                        <div class="btnInfor">
                            <button class="updateInfor" id="updateInfor">Chỉnh sửa</button>
                        </div>

                    </div>
                    <div class="infor infor-before" id="inforBefore">
                        Tên khách hàng: <br> <input id="newName" type="text" value=""></input> <br>
                        Số điện thoại(*): <br> <input id="newMobileNum" type="number"></input> <br>
                        Email(*): <br> <input id="newEmail" type="text"></input> <br>
                        Địa chỉ(*): <br>
                        <div class="address">
                            Số nhà(*): <input id="homeAddress" type="text"> <br>
                            Thành Phố(*):
                            <select name="" id="cities"></select> <br>
                            Quận/Huyện(*):
                            <select name="" id="districts"></select> <br>
                            Xã/Phường(*):
                            <select name="" id="wards"></select>
                        </div>
                        <div class="btnInfor">
                            <button class="saveInfor" id="saveInfor">Lưu</button>
                            <button class="cancelInfor" id="cancelInfor">Hủy</button>
                        </div>
                    </div>
                </div>
                <div class="imgUpTable" id="imgUpTable">
                    <div class="img">
                        <img id="imageTest" src="">
                    </div>
                    <div class="uploadBtn">
                        <input type="file" id="imageUploadInput" style="display:none" accept=".jpg,.png"> <br>
                        <button id="uploadBtn">Chọn hình</button>
                        <button id="uploadSave">Lưu</button>
                        <button id="uploadCancel">Hủy</button>
                    </div>
                </div>
                <div class="boughtNotify">
                    <div class="boughtNotify-content">
                    </div>
                </div>
            </div>
        `
component.boxAnimation = `
            <div class="top"></div>
            <div>
                <span style="--i:0;"></span>
                <span style="--i:1;"></span>
                <span style="--i:2;"></span>
                <span style="--i:3;"></span>
            </div>
        `