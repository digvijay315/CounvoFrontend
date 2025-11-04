import React from 'react'

function Register() {
  return (
    <div>
      
    <div class="wrapper">

        <div class="fl-nav-wrapper">



            {/* <div class="fl-mobile-nav">

                <div id="dl-menu" class="dl-menuwrapper">
                    <button class="dl-trigger">Open Menu</button>
                    <ul class="dl-menu">
                        <li>
                            <a href="index.html">Home</a>
                        </li>
                        <li>
                            <a href="#">Our Listing</a>
                            <ul class="dl-submenu">
                                <li><a href="02_listings-list.html">Listing 1</a></li>
                                <li><a href="02_listings-grid.html">Listing 2</a></li>
                            </ul>
                        </li>
                        <li>
                            <a href="about.html">About</a>

                        </li>
                        <li>
                            <a href="blog.html">News</a>

                        </li>
                        <li>
                            <a href="">Pages</a>
                            <ul class="dl-submenu">
                                <li><a href="contact.html">Contact</a></li>
                                <li><a href="404.html">404 page</a></li>
                                <li><a href="login.html">Login</a></li>
                                <li><a href="register.html">Registration</a></li>
                            </ul>
                        </li>
                    </ul>

                </div>


                <a class="mobile-logo-img" href="index.html">
                    <img src="img/png/logo.png" alt="logo" width="172" height="45" />
                </a>



                <div class="m-login">
                    <a href="/"><i class="icon-user icons"></i><span>Login</span></a>
                </div>



            </div> */}


            <header class="fl-header">

{/* 
                <div class="dots-menu">
                    <div id="menu_button" class="link-dots" href="#" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrollingLeftMenu" aria-controls="offcanvasScrolling">
                        <div class="menu-toggle">
                            <div class="hamburger">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <div class="cross">
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                </div> */}

                {/* <div class="nav-logo d-flex align-items-center">
                    <a class="logo-img" href="index.html">
                        <img src="img/png/logo.png" alt="logo" width="172" height="45" />
                    </a>
                </div> */}

 <div class="nav-logo d-flex align-items-center">
                    <a class="logo-img" href="index.html">
                         <h3 style={{textAlign:'center', fontSize:'25px'}}><u>FindMyLawyer</u></h3>
                    </a>
                </div>



                {/* <div class="container-fluid d-flex align-items-center header-search">
                    <form class="d-flex w-100">
                        <button class="btn" type="submit">
                            <i class="icon-search-1" aria-hidden="true"></i>
                        </button>
                        <input class="form-control me-2" type="search" placeholder="Search anything .... " aria-label="Search" aria-placeholder="Search anything .... "/>
                    </form>
                </div> */}



                {/* <div class="link-reg d-flex align-items-center justify-content-sm-between justify-content-md-between justify-content-end ">
                    <ul class="d-flex nav-icons">
                        <li class="ic-site-settings">
                            <a href="#">
                                <i class="icon-settings"></i>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <i class="icon-alert"></i>
                            </a>
                        </li>
                    </ul>
                    <div class="user-area d-flex align-items-center">
                        <img src="img/png/avatar-header.png" alt="avatar-header" class="user-logo me-3"/>
                        <div class="user-data">
                            <p class="name">Bina Schwaznegar</p>
                            <p class="role">Premium User</p>
                        </div>

                        <div class="members-info_top ">
                            <ul>
                                <li><i class="fa-solid fa-user"></i><a href="#">User Acccount</a></li>
                                <li><i class="fa-solid fa-gear"></i><a href="#">Acccount Settings</a></li>
                                <li><i class="fa-solid fa-credit-card"></i><a href="#">Membership Info</a></li>
                                <li><i class="fa-solid fa-right-from-bracket"></i><a href="#">Log Out</a></li>
                            </ul>
                        </div>

                    </div>
                </div> */}



            </header>



        </div>
        <main class="main">
            <section class="page-register page-bg-color">
                <div class="box-form">
                    <form action="#" class="form d-flex flex-column">
                        <h4 class="form-title">Register an account</h4>

                        <input type="text" name="Account Email" placeholder="Account Email" class="input-reset form__input" />
                        <input type="text" name="Password" placeholder="Password" class="input-reset form__input" />
                        <input type="text" name="Re-Enter Password" placeholder="Re-Enter Password" class="input-reset form__input" />
                        <input type="text" name="Phone" placeholder="Phone" class="input-reset form__input" />
                        <div class="d-flex align-items-center">
                            <input type="radio" name="name" class="input-reset form__input" />
                            <label class="form__label">Private Seller </label>
                            <input type="radio" name="name" class="input-reset form__input" />
                            <label class="form__label">Business Seller</label>
                        </div>
                        <div class="d-flex">
                            <input type="checkbox" name="Имя" class="input-reset form__input" />
                            <label class="form__label">I accept</label>
                            <a href="#"><b>Privacy Policy</b></a>
                        </div>

                        <button class="link__template btn-hover-animate d-flex align-items-center justify-content-center">
                            <div class="text">register an account</div>

                        </button>

                    </form>
                </div>
            </section>
        </main>



        <footer class="footer footer-bg-color">

            <span class="fl-shape1 fl-animation">
                <i class="icon-shape"></i>
            </span>




            <div class="footer-email">

                <span class="fl-shape2 fl-animation">
                    <i class="icon-shape31"></i>
                </span>

                <div class="row">
                    <div class="col-12 col-lg-6 email-text">
                        <h2> SignUp for Updates, <br /> Get Subscribed Today! </h2>
                    </div>
                    <div class="col-12 col-lg-6 form-email d-flex align-items-center">
                        <form action="#">
                            <input type="email" name="" id="" placeholder="Your email .. " class="w-100" />
                            <button type="submit" class="btn-hover-animate first-bg-color">
                                <span class="btn-icon-span">
                                    <i class="fa fa-search fa-first"></i>
                                    <i class="fa fa-chevron-right fa-second"></i>
                                </span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <div class="footer-middle">
                <div class="container">
                    <div class="row">
                        <div class="col-lg col-12 column-first">
                            <a class="navbar-brand d-flex align-items-center logo-footer" href="index.html">
                                            <h3 style={{textAlign:'center', fontSize:'25px',color:'white'}}><u>FindMyLawyer</u></h3>
                                {/* <img src="img/png/footer-logo.png" alt="logo" width="172" height="45" /> */}
                            </a>
                            <p class="text"> We believe that the best way to make sure our products are the best they can be is to listen to what our customers have to say. That’s why we’re constantly asking for feedback and publishing reviews by customers on our website.</p>
                            <div class="d-flex flex-wrap flex-lg-column justify-content-between">
                                <a class="phone" href="tel:+12020003399"><i class="fa-solid fa-phone-volume"></i> +(1)202 00 3399</a>
                                <ul class="social d-flex">
                                    <li>
                                        <a href="#">
                                            <img src="img/svg/icon-f.svg" alt="facebook" />
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <img src="img/svg/icon-t.svg" alt="twitter" />
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <img src="img/svg/icon-g+.svg" alt="g+" />
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <img src="img/svg/icon-in.svg" alt="in" />
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <img src="img/svg/icon-v.svg" alt="v" />
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-12 col-sm-6 col-lg-3 column-second">
                            <h4 class="title">Categories</h4>
                            <ul class="px-0">
                                <li>
                                    <a href="#">Art & History</a>
                                </li>
                                <li>
                                    <a href="#">Entertainment</a>
                                </li>
                                <li>
                                    <a href="#">Food & Drink</a>
                                </li>
                                <li>
                                    <a href="#">Traveling</a>
                                </li>
                            </ul>
                        </div>
                        <div class="col-12 col-sm-6 col-lg-4 column-three">
                            <h4 class="title">Recent Listings</h4>
                            <ul class="px-0">
                                <li>
                                    <a href="#">
                                        <div class="d-flex flex-wrap card-list align-items-start">
                                            <img src="img/listing-1-small.jpg" width="60" height="60" alt="list-small" />
                                            <div class="card-content">
                                                <h6 class="card-title">Mercedes S-Class 2020</h6>
                                                <div class="card-price">$3,250.00</div>
                                                <div class="adress">
                                                    <i class="fa fa-map-pin"></i> Washington DC, USA
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <div class="d-flex flex-wrap card-list align-items-start">
                                            <img src="img/listing-2-small.jpg" width="60" height="60" alt="list-small" />
                                            <div class="card-content">
                                                <h6 class="card-title">Mercedes S-Class 2020</h6>
                                                <div class="card-price">$3,250.00</div>
                                                <div class="adress">
                                                    <i class="fa fa-map-pin"></i> Washington DC, USA
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div class="footer-bottom d-flex mx-0 align-items-center justify-content-center">
                <p>Copyrights © 2023 Alistia Listings. All Rights Reserved.</p>
                <ul class="px-0 d-flex flex-wrap align-items-lg-center justify-content-center">
                    <li>
                        <a href="#">Terms & Conditions</a>
                    </li>
                    <li>
                        <a href="#">\ </a>
                    </li>
                    <li>
                        <a href="#">FAQ’s </a>
                    </li>
                    <li>
                        <a href="#">\</a>
                    </li>
                    <li>
                        <a href="#">Privacy Policy</a>
                    </li>

                    <li>
                        <a href="#">\</a>
                    </li>
                    <li>
                        <a href="#">Sitemap</a>
                    </li>
                </ul>
            </div>

        </footer>

    </div>

    <div class="left__menu">
        <div class="offcanvas offcanvas-start" data-bs-backdrop="false" tabindex="-1" id="offcanvasScrollingLeftMenu" aria-labelledby="offcanvasScrollingLabel">
            <div class="offcanvas-body">
                <ul>
                    <li>
                        <a href="index.html">
                            <span class="icon_left_menu"><i class="fa-solid fa-house"></i></span>
                            Home
                        </a>
                    </li>

                    <li>
                        <a href="about.html">
                            <span class="icon_left_menu"><i class="fa-sharp fa-solid fa-people-group"></i></span>
                            About Us
                        </a>
                    </li>

                    <li class="active-link">
                        <a href="02_listings-list.html">
                            <span class="icon_left_menu"><i class="fa-solid fa-list"></i></span>
                            Listings
                        </a>
                    </li>
                    <li>
                        <a href="blog.html">
                            <span class="icon_left_menu"><i class="fa-solid fa-newspaper"></i></span>
                            Our News
                        </a>
                    </li>



                    <li>
                        <a href="contact.html">
                            <span class="icon_left_menu"><i class="fa fa-wrench" aria-hidden="true"></i></span>
                            Contact
                        </a>
                    </li>


                </ul>
                <div class="box__banner">
                    <h5 class="title">Upgrade to PRO</h5>
                    <p class="text">
                        Unlock some more benefits from Alistia and have good chances of
                        big sales
                    </p>
                    <a href="#" class="link__template d-flex align-items-center justify-content-center">
                        <div class="text">get started</div>
                        <span class="d-flex align-items-center justify-content-center">
                            <i class="fa  fa-paper-plane fa-second"></i>
                        </span>
                    </a>
                </div>
            </div>
        </div>
    </div>

    <script src="assest/jquery 3.6.0.js"></script>
    <script src="assest/jquery-migrate-1.2.1.js"></script>
    <script src="assest/uikit.min.js"></script>
    <script src="assest/slick.min.js"></script>
    <script src="assest/modernizr.custom.js"></script>
    <script src="assest/jquery.dlmenu.js"></script>
    <script src="assest/bootstrap.js"></script>
    <script src="assest/jquery.sticky.js"></script>
    <script src="assest/slider.js"></script>
    <script src="assest/custom.js"></script>

    </div>
  )
}

export default Register
