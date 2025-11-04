import React from 'react'
// import '../css/style.css'
import Header from './Layout/header';

import { useNavigate } from 'react-router-dom';
import logo from '../components/counvoImg/WhatsApp Image 2025-06-11 at 14.06.30_494422bf.jpg'
function Home() {

    const navigate=useNavigate()
  return (
    <div>
 

    <div id="page-preloader"><span class="spinner border-t_second_b border-t_prim_a"></span></div>

    <div class="wrapper">
        <div class="container__1620">
            <div class="fl-mobile-nav" >
             <div id="dl-menu" class="dl-menuwrapper" style={{zIndex:"9999", position:"relative"}}>
                    <button class="dl-trigger">Open Menu</button>
                    <ul class="dl-menu" >
                        <li>
                            <a href="index.html">Home</a>
                        </li>
                        <li>
                            <a href="#">Find Lawyers</a>
                            <ul class="dl-submenu">
                                <li><a href="02_listings-list.html">Listing 1</a></li>
                                <li><a href="02_listings-grid.html">Listing 2</a></li>
                            </ul>
                        </li>
                        <li>
                            <a href="about.html">How It Works</a>

                        </li>
                        <li>
                            <a href="blog.html">Legal Resources</a>

                        </li>
                        <li>
                            <a href="blog.html">About Us</a>

                        </li>
                        <li>
                                <a href="contact.html">Contact</a>
                        </li>
                         <li>
                            <a href='/login' >Login/SignUp</a>
                         </li>
                      
                    </ul>

                </div>
              
                <a class="mobile-logo-img" href="index.html">
                    <img style={{textAlign:'center', fontSize:'25px',cursor:"pointer"}}  onClick={()=>navigate('/') } src={logo} width="10" height="7px" />
                    {/* <img src="img/png/logo.png" alt="logo" width="172" height="45"/> */}
                </a>
                <div class="m-login">
                    <a href="/"><i class="icon-user icons"></i><span>Login</span></a>
                </div>
            </div>
             <Header/>
          
        </div>
        <main class="main">
            <div class="container__1620">
                <section class="first__screen">
                    <div class="row">
                     
                            <div>
                                <img
                                    src="https://www.liveabout.com/thmb/X2Ro71jYgY2aTac5pLAIh_wRSmc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/lawyer-and-client-10072958-5c571531c9e77c000102c66c.jpg"
                                    alt="businessman"
                                    className="responsive-img"
                                />
                                </div>

                            <div style={{height:"500px",backgroundColor:"white",marginTop:"-150px",borderRadius:"8px",width:"70%",marginLeft:"15%",padding:"20px"}}>
                             <div >
                                <div class="svg45">
                                    {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64.57 13.01">
                                        <polyline class="a" points="1.66 3.6 10.41 9.41 19.15 3.6 27.9 9.41 36.65 3.6 45.4 9.41 54.16 3.6 62.91 9.41" />
                                    </svg> */}
                                </div>
                                <h1 class="first__screen-title" style={{fontSize:'40px'}}> Connect with Verified Lawyers Instantly  <br/> Get Legal Help When You Need It</h1>
                                <p class="first__screen-description"style={{fontSize:'30px'}}>Chat with experienced lawyers in real-time. First 5 minutes free, then pay per minute for expert legal advice.</p>
                                <div class="first__screen-form" style={{width:'100%'}}>
                                    <form action="#">
                                        <div class="input-group">
                                            {/* <input type="search" class="form-control" aria-label="Text input with dropdown button" placeholder="Search anything .... "/> */}
                                            <span class="form-input-midle"></span>
                                            <button class="btn  dropdown-toggle btn-1" type="button" data-bs-toggle="dropdown" aria-expanded="false"> Legal specialization </button>
                                            <button class="btn  dropdown-toggle btn-2" type="button" data-bs-toggle="dropdown" aria-expanded="false">Location/jurisdiction</button>
                                            <button class="btn  dropdown-toggle btn-3" type="button" data-bs-toggle="dropdown" aria-expanded="false"> Language </button>
                                            <button class="btn  dropdown-toggle btn-4" type="button" data-bs-toggle="dropdown" aria-expanded="false"> Availability status </button>
                                            <ul class="dropdown-menu dropdown-menu-end">
                                                <li>
                                                    <a class="dropdown-item" href="#">London</a>
                                                </li>
                                                <li>
                                                    <a class="dropdown-item" href="#">Paris</a>
                                                </li>
                                                <li>
                                                    <a class="dropdown-item" href="#">New Yourk</a>
                                                </li>
                                                <li>
                                                    <a class="dropdown-item" href="#">Madrid</a>
                                                </li>
                                            </ul>
                                            <button type="submit" class="first-bg-color btn-hover-animate"> search
                                                 <span class="btn-icon-span-1">
                                                    <i class="fa fa-search fa-first"></i>
                                                    <i class="fa fa-chevron-right fa-second"></i>
                                                </span>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                                <div class="first__screen-recent">

                                </div>
                            </div>
                            </div>
                    </div>
                    
                </section>
            </div>
              
            <section class="hand__picked">
                <div class="container">
                    <h3 class="hand__picked-subtitle text-center first-color"> Explore all offer for business</h3>
                    <h2 class="hand__picked-title text-center"> Legal Specializations or Find Lawyers by Practice Area </h2>
                    <div class="row gx-0">
                        <div class="col">
                            <div class="hand__picked-wrap">
                                <div class="hand__picked-item vehicles d-flex flex-column align-items-center justify-content-center">
                                    <div class="fl-icon-box">
                                        <img src='https://www.freeiconspng.com/uploads/family-icon-9.png'/>
                                       
                                    </div>
                                    <span class="hand__picked-item--line"></span>
                                    <h3 class="hand__picked-item--title">Family Law</h3>
                                    <p>Divorce, custody, adoption </p>
                                </div>
                            </div>
                        </div>
                        <div class="col mt-30">
                            <div class="hand__picked-wrap">
                                <div class="hand__picked-item jobs d-flex flex-column align-items-center justify-content-center">
                                    <div class="fl-icon-box">
                                        <img src='https://www.freeiconspng.com/uploads/gavel-icon-8.png'/>
                                        {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 511.99 512">
                                        </svg> */}
                                    </div>
                                    <span class="hand__picked-item--line"></span>
                                    <h3 class="hand__picked-item--title">Criminal Defense</h3>
                                    <p>Criminal cases, DUI, traffic</p>
                                </div>
                            </div>
                        </div>
                        <div class="col mt-60">
                            <div class="hand__picked-wrap">
                                <div class="hand__picked-item fashion d-flex flex-column align-items-center justify-content-center">
                                    <div class="fl-icon-box">
                                        <img src='https://icon-library.com/images/building-icon-png/building-icon-png-23.jpg'/>
                                        {/* <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 360 324">
                                        </svg> */}
                                    </div>
                                    <span class="hand__picked-item--line"></span>
                                    <h3 class="hand__picked-item--title">Corporate Law</h3>
                                    <p>Business contracts, compliance </p>
                                </div>
                            </div>
                        </div>
                        <div class="col mt-30">
                            <div class="hand__picked-wrap">
                                <div class="hand__picked-item jobs d-flex flex-column align-items-center justify-content-center">
                                    <div class="fl-icon-box">
                                        <img src='https://static-00.iconduck.com/assets.00/small-house-icon-2048x2048-0vo6aiym.png'/>
                                        {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        </svg> */}
                                    </div>
                                    <span class="hand__picked-item--line"></span>
                                    <h3 class="hand__picked-item--title">Property Law</h3>
                                    <p>Real estate, property disputes </p>
                                </div>
                            </div>
                        </div>
                        <div class="col">
                            <div class="hand__picked-wrap">
                                <div class="hand__picked-item vehicles d-flex flex-column align-items-center justify-content-center">
                                    <div class="fl-icon-box">
                                        <img src='https://png.pngtree.com/png-clipart/20230409/original/pngtree-globe-line-icon-png-image_9039317.png'/>
                                        {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 434.78">
                                        </svg> */}
                                    </div>
                                    <span class="hand__picked-item--line"></span>
                                    <h3 class="hand__picked-item--title">Immigration Law</h3>
                                    <p>Visa, citizenship, deportation </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <span class="shape-1">
                        {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 76.81 211.79" width="22px" height="56px">
                        </svg> */}
                    </span>
                    <h3 class="hand__picked-featured text-center"> We're Featured On ... </h3>
                </div>
                <div class="container__1320">
                    <div class=" row justify-content-lg-between justify-content-center align-items-center flex-wrap text-center">
                        <div class="mb-12 col-sm-12 col-lg-12 d-flex justify-content-center">
                            <div class="hand__picked-brand"><img src="https://tse3.mm.bing.net/th?id=OIP.EXyMVn2AvTU58ahj_1DGvQHaDj&pid=Api&P=0&h=180" alt="eastin"style={{width:'350px',height:'200px'}}/></div>
                             <div class="hand__picked-brand"><img src="https://gttb.com/wp-content/uploads/2024/06/Lawyer-International-Legal-100-2024-GTB-Technologies-Inc.-1.pdf-1.pdf-1.png" alt="eastin"style={{width:'350px',height:'200px'}}/></div>
                              <div class="hand__picked-brand"><img src="https://www.revechat.com/wp-content/uploads/2022/10/types-of-customer-satisfaction-rating-scale.png" alt="eastin" style={{width:'350px',height:'200px'}}/></div>
                               <div class="hand__picked-brand"><img src="https://static1.galls.com/photos/styles/qm/zoom/S01-663.jpg" alt="eastin" style={{width:'350px',height:'200px'}}/></div>
                        </div>
                    </div>
                </div>
            </section>
            <section class="featured__category second-bg-color py-105">
                <div class="container__1320">
                    <h3 class="featured__category-subtitle text-center">
                        <span class="caption-decore"></span>
                        Explore all offer for business
                    </h3>
                    <h2 class="featured__category-title text-center"> Featured Categories </h2>
                    <div class="row text-center g-5">
                        <div class="col-12 col-md-6 col-lg-3 col-xl-3">
                            <div class="featured__category_box featured__category_box_style2">
                                <a href="#">
                                    <img 
                                    src="https://www.freeiconspng.com/uploads/family-icon-9.png" 
                                    alt="gamer"
                                   />
                                    <div class="caption-info">
                                        <div class="caption-decore"></div>
                                        <h5>Family Law Consultation</h5>
                                        <h6></h6>
                                    </div>
                                </a>
                            </div>
                        </div>
                        <div class="col-12 col-md-6 col-lg-3 col-xl-3">
                            <div class="featured__category_box featured__category_box_style2">
                                <a href="#">
                                    <img src="https://static.vecteezy.com/system/resources/previews/031/716/638/non_2x/transparent-background-settings-icon-png.png" alt="community-talk"
                                     />
                                    <div class="caption-info">
                                        <div class="caption-decore"></div>
                                        <h5>Business Legal Advice</h5>
                                        <h6></h6>
                                    </div>
                                </a>
                            </div>
                        </div>
                        <div class="col-12 col-md-6 col-lg-3 col-xl-3">
                            <div class="featured__category_box featured__category_box_style2">
                                <a href="#">
                                    <img src="https://png.pngtree.com/png-vector/20240125/ourmid/pngtree-judge-and-courtroom-png-image_11550438.png" 
                                    alt="phone-laptops"/>

                                    <div class="caption-info">
                                        <div class="caption-decore"></div>
                                        <h5>Criminal Defense"</h5>
                                        <h6></h6>
                                    </div>
                                </a>
                            </div>
                        </div>
                        <div class="col-12 col-md-6 col-lg-3 col-xl-3">
                            <div class="featured__category_box featured__category_box_style2">
                                <a href="#">
                                    <img src="http://getdrawings.com/free-icon-bw/commercial-real-estate-icons-22.png"
                                     alt="baby-accessories"
                                     />
                                    <div class="caption-info">
                                        <div class="caption-decore"></div>
                                        <h5>Property Disputes"</h5>
                                        <h6></h6>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                    <a href="#" class="link__template btn-hover-animate d-flex align-items-center justify-content-center">
                        <div class="text">view all categories</div>
                        <span class="btn-icon-span-2">
                            <i class="fa fa-list fa-first"></i>
                            <i class="fa fa-chevron-right fa-second"></i>
                        </span>
                    </a>
                </div>
            </section>
            <section class="popular__listing py-105 mb-105">
                <div class="container">
                    <h3 class="popular__listing-subtitle text-center first-color">
                        Best bargains nearby in real-time
                    </h3>
                    <h2 class="popular__listing-title text-center"> Popular Listings Now </h2>
                </div>
                <div class="container__1575">
                    <div class="listing__products">
                        <ul class="nav nav-pills d-flex justify-content-center" id="pills-tab" role="tablist">
                            <li class="nav-item" role="presentation">
                                <button class="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-all" type="button" role="tab" data-aria-controls="pills-all" aria-selected="true"> All </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-rated" type="button" role="tab" data-aria-controls="pills-profile" aria-selected="false"> Top Rated </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="pills-contact-tab1" data-bs-toggle="pill" data-bs-target="#pills-most-viewed" type="button" role="tab" data-aria-controls="pills-contact" aria-selected="false"> Most Viewed </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="pills-contact-tab2" data-bs-toggle="pill" data-bs-target="#pills-most-popular" type="button" role="tab" data-aria-controls="pills-contact" aria-selected="false"> Most Popular </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="pills-contact-tab3" data-bs-toggle="pill" data-bs-target="#pills-choice" type="button" role="tab" data-aria-controls="pills-contact" aria-selected="false"> Editor’s Choice </button>
                            </li>
                        </ul>
                        <div class="tab-content" id="pills-tabContent" >
                            <div class="tab-pane fade show active" id="pills-all" role="tabpanel" data-aria-labelledby="pills-home-tab">
                                <div class="row slww" >
                                    <div class=" col-12 col-xl-4 col-md-6">
                                        <div class="listing-card ll-none">
                                            <div class="listing-card__box listing-card__box_featured" data-marker="3">
                                                <div class="listing-card__media shine">
                                                    <a href="02_listings-grid.html">
                                                        <img src="https://static2.bigstockphoto.com/5/6/3/large1500/365525101.jpg" width="360" height="270" alt="Fadisy Restaurant"/>
                                                    </a>
                                                    <div class="listing-card__bookmark active">
                                                        Featured
                                                    </div>
                                                    {/* <div class="listing-btn-action">
                                                        <a class="listing-btn-ico view_more_link" href="02_listings-grid.html" data-uk-tooltip="View More" title="" data-aria-describedby="data-uk-tooltip-0">
                                                            <i class="fa-solid fa-eye"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Addto Compare" title="" data-aria-describedby="data-uk-tooltip-1">
                                                            <i class="fa-solid fa-code-compare"></i>
                                                            <i class="fa-solid fa-not-equal"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Add to Favorite" title="" data-aria-describedby="data-uk-tooltip-2">
                                                            <i class="fa-regular fa-heart"></i>
                                                            <i class="fa-solid fa-heart"></i>
                                                        </a>
                                                    </div> */}
                                                </div>
                                                <div class="listing-card__middle">
                                                    <div class="listing-card__body">
                                                        <div class="body-wrapper">
                                                            <div class="title">
                                                                <a href="#">Free Online Shopping</a>
                                                            </div>
                                                            <div class="heart active">
                                                                {/* <img src="img/svg/icon-heart.svg" alt="ico-heart"/> */}
                                                            </div>
                                                        </div>
                                                        <div class="data_info">
                                                            <i class="fa fa-map-pin"></i>Washington DC, USA
                                                        </div>
                                                        <p class="body-text">
                                                            Quis nostrud exercitation ullamco laboris nisit
                                                            aliquip ex ea commodo consequat...
                                                        </p>
                                                    </div>
                                                    <div class="listing-card__info ">
                                                        <div class="info-wrapper custom-hover">
                                                            <div class="price">$3,250.00</div>
                                                            <ul class="data-item d-flex justify-content-between">
                                                                 <li>💬 Chat</li>
                                                                <li>📞 Call</li>
                                                                <li>🟢 whatsapp</li>
                                                            
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class=" col-12 col-xl-4 col-md-6">
                                        <div class="listing-card ll-none">
                                            <div class="listing-card__box" data-marker="1">
                                                <div class="listing-card__media shine">
                                                    <a href="02_listings-grid.html">
                                                        <img src="https://www.lawyer.com/img/banner-image.jpg" width="360" alt="Fadisy Restaurant"/>
                                                    </a>
                                                    {/* <div class="listing-btn-action">
                                                        <a class="listing-btn-ico view_more_link" href="02_listings-grid.html" data-uk-tooltip="View More" title="" data-aria-describedby="data-uk-tooltip-0">
                                                            <i class="fa-solid fa-eye"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Addto Compare" title="" data-aria-describedby="data-uk-tooltip-1">
                                                            <i class="fa-solid fa-code-compare"></i>
                                                            <i class="fa-solid fa-not-equal"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Add to Favorite" title="" data-aria-describedby="data-uk-tooltip-2">
                                                            <i class="fa-regular fa-heart"></i>
                                                            <i class="fa-solid fa-heart"></i>
                                                        </a>
                                                    </div> */}
                                                </div>
                                                <div class="listing-card__middle">
                                                    <div class="listing-card__body">
                                                        <div class="body-wrapper">
                                                            <div class="title">
                                                                <a href="#">Zeon Luxury Apartments</a>
                                                            </div>
                                                        </div>
                                                        <div class="data_info">
                                                            <i class="fa fa-map-pin"></i>Washington DC, USA
                                                        </div>
                                                        <p class="body-text">
                                                            Quis nostrud exercitation ullamco laboris nisit
                                                            aliquip ex ea commodo consequat...
                                                        </p>
                                                    </div>
                                                    <div class="listing-card__info ">
                                                        <div class="info-wrapper custom-hover">
                                                            <div class="price">$3,250.00</div>
                                                            <ul class="data-item d-flex justify-content-between">
                                                                 <li >💬 Chat</li>
                                                                <li>📞 Call</li>
                                                                <li>🟢 whatsapp</li>
                                                            
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class=" col-12 col-xl-4 col-md-6">
                                        <div class="listing-card ll-none">
                                            <div class="listing-card__box">
                                                <div class="listing-card__media shine">
                                                    <a href="02_listings-grid.html">
                                                        <img src="https://fthmb.tqn.com/Kcf8EVzEvVsS3hV4l_3KVipw6GE=/4841x3633/filters:fill(auto,1)/Gettywomanlawyer-5955ab903df78cdc296e8f7e.jpg" width="360" height="270" alt="Fadisy Restaurant"/>
                                                    </a>
                                                    {/* <div class="listing-btn-action">
                                                        <a class="listing-btn-ico view_more_link" href="02_listings-grid.html" data-uk-tooltip="View More" title="" data-aria-describedby="data-uk-tooltip-0">
                                                            <i class="fa-solid fa-eye"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Addto Compare" title="" data-aria-describedby="data-uk-tooltip-1">
                                                            <i class="fa-solid fa-code-compare"></i>
                                                            <i class="fa-solid fa-not-equal"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Add to Favorite" title="" data-aria-describedby="data-uk-tooltip-2">
                                                            <i class="fa-regular fa-heart"></i>
                                                            <i class="fa-solid fa-heart"></i>
                                                        </a>
                                                    </div> */}
                                                </div>
                                                <div class="listing-card__middle">
                                                    <div class="listing-card__body">
                                                        <div class="body-wrapper">
                                                            <div class="title">
                                                                <a href="#">Traveling to Bankok</a>
                                                            </div>
                                                            {/* <div class="heart active">
                                                                <img src="img/svg/icon-heart.svg" alt="ico-heart"/>
                                                            </div> */}
                                                        </div>
                                                        <div class="data_info">
                                                            <i class="fa fa-map-pin"></i>Washington DC, USA
                                                        </div>
                                                        <p class="body-text">
                                                            Quis nostrud exercitation ullamco laboris nisit
                                                            aliquip ex ea commodo consequat...
                                                        </p>
                                                    </div>
                                                    <div class="listing-card__info ">
                                                        <div class="info-wrapper custom-hover">
                                                            <div class="price">$3,250.00</div>
                                                            <ul class="data-item d-flex justify-content-between">
                                                                 <li >💬 Chat</li>
                                                                <li>📞 Call</li>
                                                                <li>🟢 whatsapp</li>
                                                            
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class=" col-12 col-xl-4 col-md-6">
                                        <div class="listing-card ll-none">
                                            <div class="listing-card__box">
                                                <div class="listing-card__media shine">
                                                    <a href="02_listings-grid.html">
                                                        <img src="https://img.freepik.com/premium-photo/professional-lawyer-image-generated-ai_644690-13316.jpg" width="360" height="270" alt="Fadisy Restaurant"/>
                                                    </a>
                                                    {/* <div class="listing-btn-action">
                                                        <a class="listing-btn-ico view_more_link" href="02_listings-grid.html" data-uk-tooltip="View More" title="" data-aria-describedby="data-uk-tooltip-0">
                                                            <i class="fa-solid fa-eye"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Addto Compare" title="" data-aria-describedby="data-uk-tooltip-1">
                                                            <i class="fa-solid fa-code-compare"></i>
                                                            <i class="fa-solid fa-not-equal"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Add to Favorite" title="" data-aria-describedby="data-uk-tooltip-2">
                                                            <i class="fa-regular fa-heart"></i>
                                                            <i class="fa-solid fa-heart"></i>
                                                        </a>
                                                    </div> */}
                                                </div>
                                                <div class="listing-card__middle">
                                                    <div class="listing-card__body">
                                                        <div class="body-wrapper">
                                                            <div class="title">
                                                                <a href="#">Mercedes S-Class 2020 </a>
                                                            </div>
                                                            <div class="heart active">
                                                                <img src="img/svg/icon-heart.svg" alt="ico-heart"/>
                                                            </div>
                                                        </div>
                                                        <div class="data_info">
                                                            <i class="fa fa-map-pin"></i>Washington DC, USA
                                                        </div>
                                                        <p class="body-text">
                                                            Quis nostrud exercitation ullamco laboris nisit
                                                            aliquip ex ea commodo consequat...
                                                        </p>
                                                    </div>
                                                    <div class="listing-card__info ">
                                                        <div class="info-wrapper custom-hover">
                                                            <div class="price">$3,250.00</div>
                                                            <ul class="data-item d-flex justify-content-between">
                                                             <li >💬 Chat</li>
                                                                <li>📞 Call</li>
                                                                <li>🟢 whatsapp</li>
                                                            
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class=" col-12 col-xl-4 col-md-6">
                                        <div class="listing-card ll-none">

                                            {/* <div class="listing-card__box">
                                                <div class="listing-card__media shine">
                                                    <a href="02_listings-grid.html">
                                                        <img src="https://c8.alamy.com/comp/B5WK0P/portrait-of-a-female-lawyer-holding-a-book-B5WK0P.jpg" width="360" height="270" alt="Fadisy Restaurant"/>
                                                    </a>
                                                    <div class="listing-btn-action">
                                                        <a class="listing-btn-ico view_more_link" href="02_listings-grid.html" data-uk-tooltip="View More" title="" data-aria-describedby="data-uk-tooltip-0">
                                                            <i class="fa-solid fa-eye"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Addto Compare" title="" data-aria-describedby="data-uk-tooltip-1">
                                                            <i class="fa-solid fa-code-compare"></i>
                                                            <i class="fa-solid fa-not-equal"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Add to Favorite" title="" data-aria-describedby="data-uk-tooltip-2">
                                                            <i class="fa-regular fa-heart"></i>
                                                            <i class="fa-solid fa-heart"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                                <div class="listing-card__middle">
                                                    <div class="listing-card__body">
                                                        <div class="body-wrapper">
                                                            <div class="title">
                                                                <a href="#">Traveling to Bankok</a>
                                                            </div>
                                                            <div class="heart active">
                                                                <img src="img/svg/icon-heart.svg" alt="ico-heart"/>
                                                            </div>
                                                        </div>
                                                        <div class="data_info">
                                                            <i class="fa fa-map-pin"></i>Washington DC, USA
                                                        </div>
                                                        <p class="body-text">
                                                            Quis nostrud exercitation ullamco laboris nisit
                                                            aliquip ex ea commodo consequat...
                                                        </p>
                                                    </div>
                                                    <div class="listing-card__info">
                                                        <div class="info-wrapper">
                                                            <div class="price">$3,250.00</div>
                                                            <ul class="data-item d-flex justify-content-between">
                                                                <li>Automatic</li>
                                                                <li>Petrol</li>
                                                                <li>AWD</li>
                                                                <li>2021</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>






                            {/* <div class="tab-pane fade" id="pills-rated" role="tabpanel" data-aria-labelledby="pills-profile-tab">
                                <div class="row slww">
                                    <div class=" col-12 col-xl-4 col-md-6">
                                        <div class="listing-card ll-none">
                                            <div class="listing-card__box" data-marker="1">
                                                <div class="listing-card__media shine">
                                                    <a href="02_listings-grid.html">
                                                        <img src="img/listing-2.jpg" width="360" height="270" alt="Fadisy Restaurant"/>
                                                    </a>
                                                    <div class="listing-btn-action">
                                                        <a class="listing-btn-ico view_more_link" href="02_listings-grid.html" data-uk-tooltip="View More" title="" data-aria-describedby="data-uk-tooltip-0">
                                                            <i class="fa-solid fa-eye"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Addto Compare" title="" data-aria-describedby="data-uk-tooltip-1">
                                                            <i class="fa-solid fa-code-compare"></i>
                                                            <i class="fa-solid fa-not-equal"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Add to Favorite" title="" data-aria-describedby="data-uk-tooltip-2">
                                                            <i class="fa-regular fa-heart"></i>
                                                            <i class="fa-solid fa-heart"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                                <div class="listing-card__middle">
                                                    <div class="listing-card__body">
                                                        <div class="body-wrapper">
                                                            <div class="title">
                                                                <a href="#">Zeon Luxury Apartments</a>
                                                            </div>
                                                        </div>
                                                        <div class="data_info">
                                                            <i class="fa fa-map-pin"></i>Washington DC, USA
                                                        </div>
                                                        <p class="body-text">
                                                            Quis nostrud exercitation ullamco laboris nisit
                                                            aliquip ex ea commodo consequat...
                                                        </p>
                                                    </div>
                                                    <div class="listing-card__info">
                                                        <div class="info-wrapper">
                                                            <div class="price">$3,250.00</div>
                                                            <ul class="data-item d-flex justify-content-between">
                                                                <li>Automatic</li>
                                                                <li>Petrol</li>
                                                                <li>AWD</li>
                                                                <li>2021</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class=" col-12 col-xl-4 col-md-6">
                                        <div class="listing-card ll-none">
                                            <div class="listing-card__box listing-card__box_featured" data-marker="3">
                                                <div class="listing-card__media shine">
                                                    <a href="02_listings-grid.html">
                                                        <img src="img/listing-3.jpg" width="360" height="270" alt="Fadisy Restaurant"/>
                                                    </a>
                                                    <div class="listing-card__bookmark active">
                                                        Featured
                                                    </div>
                                                    <div class="listing-btn-action">
                                                        <a class="listing-btn-ico view_more_link" href="02_listings-grid.html" data-uk-tooltip="View More" title="" data-aria-describedby="data-uk-tooltip-0">
                                                            <i class="fa-solid fa-eye"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Addto Compare" title="" data-aria-describedby="data-uk-tooltip-1">
                                                            <i class="fa-solid fa-code-compare"></i>
                                                            <i class="fa-solid fa-not-equal"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Add to Favorite" title="" data-aria-describedby="data-uk-tooltip-2">
                                                            <i class="fa-regular fa-heart"></i>
                                                            <i class="fa-solid fa-heart"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                                <div class="listing-card__middle">
                                                    <div class="listing-card__body">
                                                        <div class="body-wrapper">
                                                            <div class="title">
                                                                <a href="#">Free Online Shopping</a>
                                                            </div>
                                                            <div class="heart active">
                                                                <img src="img/svg/icon-heart.svg" alt="ico-heart"/>
                                                            </div>
                                                        </div>
                                                        <div class="data_info">
                                                            <i class="fa fa-map-pin"></i>Washington DC, USA
                                                        </div>
                                                        <p class="body-text">
                                                            Quis nostrud exercitation ullamco laboris nisit
                                                            aliquip ex ea commodo consequat...
                                                        </p>
                                                    </div>
                                                    <div class="listing-card__info">
                                                        <div class="info-wrapper">
                                                            <div class="price">$3,250.00</div>
                                                            <ul class="data-item d-flex justify-content-between">
                                                                <li>Automatic</li>
                                                                <li>Petrol</li>
                                                                <li>AWD</li>
                                                                <li>2021</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class=" col-12 col-xl-4 col-md-6">
                                        <div class="listing-card ll-none">
                                            <div class="listing-card__box" data-marker="1">
                                                <div class="listing-card__media shine">
                                                    <a href="02_listings-grid.html">
                                                        <img src="img/listing-2.jpg" width="360" height="270" alt="Fadisy Restaurant"/>
                                                    </a>
                                                    <div class="listing-btn-action">
                                                        <a class="listing-btn-ico view_more_link" href="02_listings-grid.html" data-uk-tooltip="View More" title="" data-aria-describedby="data-uk-tooltip-0">
                                                            <i class="fa-solid fa-eye"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Addto Compare" title="" data-aria-describedby="data-uk-tooltip-1">
                                                            <i class="fa-solid fa-code-compare"></i>
                                                            <i class="fa-solid fa-not-equal"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Add to Favorite" title="" data-aria-describedby="data-uk-tooltip-2">
                                                            <i class="fa-regular fa-heart"></i>
                                                            <i class="fa-solid fa-heart"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                                <div class="listing-card__middle">
                                                    <div class="listing-card__body">
                                                        <div class="body-wrapper">
                                                            <div class="title">
                                                                <a href="#">Zeon Luxury Apartments</a>
                                                            </div>
                                                        </div>
                                                        <div class="data_info">
                                                            <i class="fa fa-map-pin"></i>Washington DC, USA
                                                        </div>
                                                        <p class="body-text">
                                                            Quis nostrud exercitation ullamco laboris nisit
                                                            aliquip ex ea commodo consequat...
                                                        </p>
                                                    </div>
                                                    <div class="listing-card__info">
                                                        <div class="info-wrapper">
                                                            <div class="price">$3,250.00</div>
                                                            <ul class="data-item d-flex justify-content-between">
                                                                <li>Automatic</li>
                                                                <li>Petrol</li>
                                                                <li>AWD</li>
                                                                <li>2021</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class=" col-12 col-xl-4 col-md-6">
                                        <div class="listing-card ll-none">
                                            <div class="listing-card__box">
                                                <div class="listing-card__media shine">
                                                    <a href="02_listings-grid.html">
                                                        <img src="img/listing-4.jpg" width="360" height="270" alt="Fadisy Restaurant"/>
                                                    </a>
                                                    <div class="listing-btn-action">
                                                        <a class="listing-btn-ico view_more_link" href="02_listings-grid.html" data-uk-tooltip="View More" title="" data-aria-describedby="data-uk-tooltip-0">
                                                            <i class="fa-solid fa-eye"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Addto Compare" title="" data-aria-describedby="data-uk-tooltip-1">
                                                            <i class="fa-solid fa-code-compare"></i>
                                                            <i class="fa-solid fa-not-equal"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Add to Favorite" title="" data-aria-describedby="data-uk-tooltip-2">
                                                            <i class="fa-regular fa-heart"></i>
                                                            <i class="fa-solid fa-heart"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                                <div class="listing-card__middle">
                                                    <div class="listing-card__body">
                                                        <div class="body-wrapper">
                                                            <div class="title">
                                                                <a href="#">Traveling to Bankok</a>
                                                            </div>
                                                            <div class="heart active">
                                                                <img src="img/svg/icon-heart.svg" alt="ico-heart"/>
                                                            </div>
                                                        </div>
                                                        <div class="data_info">
                                                            <i class="fa fa-map-pin"></i>Washington DC, USA
                                                        </div>
                                                        <p class="body-text">
                                                            Quis nostrud exercitation ullamco laboris nisit
                                                            aliquip ex ea commodo consequat...
                                                        </p>
                                                    </div>
                                                    <div class="listing-card__info">
                                                        <div class="info-wrapper">
                                                            <div class="price">$3,250.00</div>
                                                            <ul class="data-item d-flex justify-content-between">
                                                                <li>Automatic</li>
                                                                <li>Petrol</li>
                                                                <li>AWD</li>
                                                                <li>2021</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class=" col-12 col-xl-4 col-md-6">
                                        <div class="listing-card ll-none">
                                            <div class="listing-card__box">
                                                <div class="listing-card__media shine">
                                                    <a href="02_listings-grid.html">
                                                        <img src="img/listing-1.jpg" width="360" height="270" alt="Fadisy Restaurant"/>
                                                    </a>
                                                    <div class="listing-btn-action">
                                                        <a class="listing-btn-ico view_more_link" href="02_listings-grid.html" data-uk-tooltip="View More" title="" data-aria-describedby="data-uk-tooltip-0">
                                                            <i class="fa-solid fa-eye"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Addto Compare" title="" data-aria-describedby="data-uk-tooltip-1">
                                                            <i class="fa-solid fa-code-compare"></i>
                                                            <i class="fa-solid fa-not-equal"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Add to Favorite" title="" data-aria-describedby="data-uk-tooltip-2">
                                                            <i class="fa-regular fa-heart"></i>
                                                            <i class="fa-solid fa-heart"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                                <div class="listing-card__middle">
                                                    <div class="listing-card__body">
                                                        <div class="body-wrapper">
                                                            <div class="title">
                                                                <a href="#">Mercedes S-Class 2020 </a>
                                                            </div>
                                                            <div class="heart active">
                                                                <img src="img/svg/icon-heart.svg" alt="ico-heart"/>
                                                            </div>
                                                        </div>
                                                        <div class="data_info">
                                                            <i class="fa fa-map-pin"></i>Washington DC, USA
                                                        </div>
                                                        <p class="body-text">
                                                            Quis nostrud exercitation ullamco laboris nisit
                                                            aliquip ex ea commodo consequat...
                                                        </p>
                                                    </div>
                                                    <div class="listing-card__info">
                                                        <div class="info-wrapper">
                                                            <div class="price">$3,250.00</div>
                                                            <ul class="data-item d-flex justify-content-between">
                                                                <li>Automatic</li>
                                                                <li>Petrol</li>
                                                                <li>AWD</li>
                                                                <li>2021</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class=" col-12 col-xl-4 col-md-6">
                                        <div class="listing-card ll-none">
                                            <div class="listing-card__box">
                                                <div class="listing-card__media shine">
                                                    <a href="02_listings-grid.html">
                                                        <img src="img/listing-4.jpg" width="360" height="270" alt="Fadisy Restaurant"/>
                                                    </a>
                                                    <div class="listing-btn-action">
                                                        <a class="listing-btn-ico view_more_link" href="02_listings-grid.html" data-uk-tooltip="View More" title="" data-aria-describedby="data-uk-tooltip-0">
                                                            <i class="fa-solid fa-eye"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Addto Compare" title="" data-aria-describedby="data-uk-tooltip-1">
                                                            <i class="fa-solid fa-code-compare"></i>
                                                            <i class="fa-solid fa-not-equal"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Add to Favorite" title="" data-aria-describedby="data-uk-tooltip-2">
                                                            <i class="fa-regular fa-heart"></i>
                                                            <i class="fa-solid fa-heart"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                                <div class="listing-card__middle">
                                                    <div class="listing-card__body">
                                                        <div class="body-wrapper">
                                                            <div class="title">
                                                                <a href="#">Traveling to Bankok</a>
                                                            </div>
                                                            <div class="heart active">
                                                                <img src="img/svg/icon-heart.svg" alt="ico-heart"/>
                                                            </div>
                                                        </div>
                                                        <div class="data_info">
                                                            <i class="fa fa-map-pin"></i>Washington DC, USA
                                                        </div>
                                                        <p class="body-text">
                                                            Quis nostrud exercitation ullamco laboris nisit
                                                            aliquip ex ea commodo consequat...
                                                        </p>
                                                    </div>
                                                    <div class="listing-card__info">
                                                        <div class="info-wrapper">
                                                            <div class="price">$3,250.00</div>
                                                            <ul class="data-item d-flex justify-content-between">
                                                                <li>Automatic</li>
                                                                <li>Petrol</li>
                                                                <li>AWD</li>
                                                                <li>2021</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                            {/* <div class="tab-pane fade" id="pills-most-viewed" role="tabpanel" data-aria-labelledby="pills-contact-tab">
                                <div class="row slww">
                                    <div class=" col-12 col-xl-4 col-md-6">
                                        <div class="listing-card ll-none">
                                            <div class="listing-card__box" data-marker="1">
                                                <div class="listing-card__media shine">
                                                    <a href="02_listings-grid.html">
                                                        <img src="img/listing-2.jpg" width="360" height="270" alt="Fadisy Restaurant"/>
                                                    </a>
                                                    <div class="listing-btn-action">
                                                        <a class="listing-btn-ico view_more_link" href="02_listings-grid.html" data-uk-tooltip="View More" title="" data-aria-describedby="data-uk-tooltip-0">
                                                            <i class="fa-solid fa-eye"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Addto Compare" title="" data-aria-describedby="data-uk-tooltip-1">
                                                            <i class="fa-solid fa-code-compare"></i>
                                                            <i class="fa-solid fa-not-equal"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Add to Favorite" title="" data-aria-describedby="data-uk-tooltip-2">
                                                            <i class="fa-regular fa-heart"></i>
                                                            <i class="fa-solid fa-heart"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                                <div class="listing-card__middle">
                                                    <div class="listing-card__body">
                                                        <div class="body-wrapper">
                                                            <div class="title">
                                                                <a href="#">Zeon Luxury Apartments</a>
                                                            </div>
                                                        </div>
                                                        <div class="data_info">
                                                            <i class="fa fa-map-pin"></i>Washington DC, USA
                                                        </div>
                                                        <p class="body-text">
                                                            Quis nostrud exercitation ullamco laboris nisit
                                                            aliquip ex ea commodo consequat...
                                                        </p>
                                                    </div>
                                                    <div class="listing-card__info">
                                                        <div class="info-wrapper">
                                                            <div class="price">$3,250.00</div>
                                                            <ul class="data-item d-flex justify-content-between">
                                                                <li>Automatic</li>
                                                                <li>Petrol</li>
                                                                <li>AWD</li>
                                                                <li>2021</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class=" col-12 col-xl-4 col-md-6">
                                        <div class="listing-card ll-none">
                                            <div class="listing-card__box" data-marker="1">
                                                <div class="listing-card__media shine">
                                                    <a href="02_listings-grid.html">
                                                        <img src="img/listing-2.jpg" width="360" height="270" alt="Fadisy Restaurant"/>
                                                    </a>
                                                    <div class="listing-btn-action">
                                                        <a class="listing-btn-ico view_more_link" href="02_listings-grid.html" data-uk-tooltip="View More" title="" data-aria-describedby="data-uk-tooltip-0">
                                                            <i class="fa-solid fa-eye"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Addto Compare" title="" data-aria-describedby="data-uk-tooltip-1">
                                                            <i class="fa-solid fa-code-compare"></i>
                                                            <i class="fa-solid fa-not-equal"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Add to Favorite" title="" data-aria-describedby="data-uk-tooltip-2">
                                                            <i class="fa-regular fa-heart"></i>
                                                            <i class="fa-solid fa-heart"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                                <div class="listing-card__middle">
                                                    <div class="listing-card__body">
                                                        <div class="body-wrapper">
                                                            <div class="title">
                                                                <a href="#">Zeon Luxury Apartments</a>
                                                            </div>
                                                        </div>
                                                        <div class="data_info">
                                                            <i class="fa fa-map-pin"></i>Washington DC, USA
                                                        </div>
                                                        <p class="body-text">
                                                            Quis nostrud exercitation ullamco laboris nisit
                                                            aliquip ex ea commodo consequat...
                                                        </p>
                                                    </div>
                                                    <div class="listing-card__info">
                                                        <div class="info-wrapper">
                                                            <div class="price">$3,250.00</div>
                                                            <ul class="data-item d-flex justify-content-between">
                                                                <li>Automatic</li>
                                                                <li>Petrol</li>
                                                                <li>AWD</li>
                                                                <li>2021</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class=" col-12 col-xl-4 col-md-6">
                                        <div class="listing-card ll-none">
                                            <div class="listing-card__box listing-card__box_featured" data-marker="3">
                                                <div class="listing-card__media shine">
                                                    <a href="02_listings-grid.html">
                                                        <img src="img/listing-3.jpg" width="360" height="270" alt="Fadisy Restaurant"/>
                                                    </a>
                                                    <div class="listing-card__bookmark active">
                                                        Featured
                                                    </div>
                                                    <div class="listing-btn-action">
                                                        <a class="listing-btn-ico view_more_link" href="02_listings-grid.html" data-uk-tooltip="View More" title="" data-aria-describedby="data-uk-tooltip-0">
                                                            <i class="fa-solid fa-eye"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Addto Compare" title="" data-aria-describedby="data-uk-tooltip-1">
                                                            <i class="fa-solid fa-code-compare"></i>
                                                            <i class="fa-solid fa-not-equal"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Add to Favorite" title="" data-aria-describedby="data-uk-tooltip-2">
                                                            <i class="fa-regular fa-heart"></i>
                                                            <i class="fa-solid fa-heart"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                                <div class="listing-card__middle">
                                                    <div class="listing-card__body">
                                                        <div class="body-wrapper">
                                                            <div class="title">
                                                                <a href="#">Free Online Shopping</a>
                                                            </div>
                                                            <div class="heart active">
                                                                <img src="img/svg/icon-heart.svg" alt="ico-heart"/>
                                                            </div>
                                                        </div>
                                                        <div class="data_info">
                                                            <i class="fa fa-map-pin"></i>Washington DC, USA
                                                        </div>
                                                        <p class="body-text">
                                                            Quis nostrud exercitation ullamco laboris nisit
                                                            aliquip ex ea commodo consequat...
                                                        </p>
                                                    </div>
                                                    <div class="listing-card__info">
                                                        <div class="info-wrapper">
                                                            <div class="price">$3,250.00</div>
                                                            <ul class="data-item d-flex justify-content-between">
                                                                <li>Automatic</li>
                                                                <li>Petrol</li>
                                                                <li>AWD</li>
                                                                <li>2021</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class=" col-12 col-xl-4 col-md-6">
                                        <div class="listing-card ll-none">
                                            <div class="listing-card__box">
                                                <div class="listing-card__media shine">
                                                    <a href="02_listings-grid.html">
                                                        <img src="img/listing-4.jpg" width="360" height="270" alt="Fadisy Restaurant"/>
                                                    </a>
                                                    <div class="listing-btn-action">
                                                        <a class="listing-btn-ico view_more_link" href="02_listings-grid.html" data-uk-tooltip="View More" title="" data-aria-describedby="data-uk-tooltip-0">
                                                            <i class="fa-solid fa-eye"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Addto Compare" title="" data-aria-describedby="data-uk-tooltip-1">
                                                            <i class="fa-solid fa-code-compare"></i>
                                                            <i class="fa-solid fa-not-equal"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Add to Favorite" title="" data-aria-describedby="data-uk-tooltip-2">
                                                            <i class="fa-regular fa-heart"></i>
                                                            <i class="fa-solid fa-heart"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                                <div class="listing-card__middle">
                                                    <div class="listing-card__body">
                                                        <div class="body-wrapper">
                                                            <div class="title">
                                                                <a href="#">Traveling to Bankok</a>
                                                            </div>
                                                            <div class="heart active">
                                                                <img src="img/svg/icon-heart.svg" alt="ico-heart"/>
                                                            </div>
                                                        </div>
                                                        <div class="data_info">
                                                            <i class="fa fa-map-pin"></i>Washington DC, USA
                                                        </div>
                                                        <p class="body-text">
                                                            Quis nostrud exercitation ullamco laboris nisit
                                                            aliquip ex ea commodo consequat...
                                                        </p>
                                                    </div>
                                                    <div class="listing-card__info">
                                                        <div class="info-wrapper">
                                                            <div class="price">$3,250.00</div>
                                                            <ul class="data-item d-flex justify-content-between">
                                                                <li>Automatic</li>
                                                                <li>Petrol</li>
                                                                <li>AWD</li>
                                                                <li>2021</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class=" col-12 col-xl-4 col-md-6">
                                        <div class="listing-card ll-none">
                                            <div class="listing-card__box">
                                                <div class="listing-card__media shine">
                                                    <a href="02_listings-grid.html">
                                                        <img src="img/listing-1.jpg" width="360" height="270" alt="Fadisy Restaurant"/>
                                                    </a>
                                                    <div class="listing-btn-action">
                                                        <a class="listing-btn-ico view_more_link" href="02_listings-grid.html" data-uk-tooltip="View More" title="" data-aria-describedby="data-uk-tooltip-0">
                                                            <i class="fa-solid fa-eye"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Addto Compare" title="" data-aria-describedby="data-uk-tooltip-1">
                                                            <i class="fa-solid fa-code-compare"></i>
                                                            <i class="fa-solid fa-not-equal"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Add to Favorite" title="" data-aria-describedby="data-uk-tooltip-2">
                                                            <i class="fa-regular fa-heart"></i>
                                                            <i class="fa-solid fa-heart"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                                <div class="listing-card__middle">
                                                    <div class="listing-card__body">
                                                        <div class="body-wrapper">
                                                            <div class="title">
                                                                <a href="#">Mercedes S-Class 2020 </a>
                                                            </div>
                                                            <div class="heart active">
                                                                <img src="img/svg/icon-heart.svg" alt="ico-heart"/>
                                                            </div>
                                                        </div>
                                                        <div class="data_info">
                                                            <i class="fa fa-map-pin"></i>Washington DC, USA
                                                        </div>
                                                        <p class="body-text">
                                                            Quis nostrud exercitation ullamco laboris nisit
                                                            aliquip ex ea commodo consequat...
                                                        </p>
                                                    </div>
                                                    <div class="listing-card__info">
                                                        <div class="info-wrapper">
                                                            <div class="price">$3,250.00</div>
                                                            <ul class="data-item d-flex justify-content-between">
                                                                <li>Automatic</li>
                                                                <li>Petrol</li>
                                                                <li>AWD</li>
                                                                <li>2021</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class=" col-12 col-xl-4 col-md-6">
                                        <div class="listing-card ll-none">
                                            <div class="listing-card__box">
                                                <div class="listing-card__media shine">
                                                    <a href="02_listings-grid.html">
                                                        <img src="img/listing-4.jpg" width="360" height="270" alt="Fadisy Restaurant"/>
                                                    </a>
                                                    <div class="listing-btn-action">
                                                        <a class="listing-btn-ico view_more_link" href="02_listings-grid.html" data-uk-tooltip="View More" title="" data-aria-describedby="data-uk-tooltip-0">
                                                            <i class="fa-solid fa-eye"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Addto Compare" title="" data-aria-describedby="data-uk-tooltip-1">
                                                            <i class="fa-solid fa-code-compare"></i>
                                                            <i class="fa-solid fa-not-equal"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Add to Favorite" title="" data-aria-describedby="data-uk-tooltip-2">
                                                            <i class="fa-regular fa-heart"></i>
                                                            <i class="fa-solid fa-heart"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                                <div class="listing-card__middle">
                                                    <div class="listing-card__body">
                                                        <div class="body-wrapper">
                                                            <div class="title">
                                                                <a href="#">Traveling to Bankok</a>
                                                            </div>
                                                            <div class="heart active">
                                                                <img src="img/svg/icon-heart.svg" alt="ico-heart"/>
                                                            </div>
                                                        </div>
                                                        <div class="data_info">
                                                            <i class="fa fa-map-pin"></i>Washington DC, USA
                                                        </div>
                                                        <p class="body-text">
                                                            Quis nostrud exercitation ullamco laboris nisit
                                                            aliquip ex ea commodo consequat...
                                                        </p>
                                                    </div>
                                                    <div class="listing-card__info">
                                                        <div class="info-wrapper">
                                                            <div class="price">$3,250.00</div>
                                                            <ul class="data-item d-flex justify-content-between">
                                                                <li>Automatic</li>
                                                                <li>Petrol</li>
                                                                <li>AWD</li>
                                                                <li>2021</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                            {/* <div class="tab-pane fade" id="pills-most-popular" role="tabpanel" data-aria-labelledby="pills-contact-tab">
                                <div class="row slww">
                                    <div class=" col-12 col-xl-4 col-md-6">
                                        <div class="listing-card ll-none">
                                            <div class="listing-card__box" data-marker="1">
                                                <div class="listing-card__media shine">
                                                    <a href="02_listings-grid.html">
                                                        <img src="img/listing-2.jpg" width="360" height="270" alt="Fadisy Restaurant"/>
                                                    </a>
                                                    <div class="listing-btn-action">
                                                        <a class="listing-btn-ico view_more_link" href="02_listings-grid.html" data-uk-tooltip="View More" title="" data-aria-describedby="data-uk-tooltip-0">
                                                            <i class="fa-solid fa-eye"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Addto Compare" title="" data-aria-describedby="data-uk-tooltip-1">
                                                            <i class="fa-solid fa-code-compare"></i>
                                                            <i class="fa-solid fa-not-equal"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Add to Favorite" title="" data-aria-describedby="data-uk-tooltip-2">
                                                            <i class="fa-regular fa-heart"></i>
                                                            <i class="fa-solid fa-heart"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                                <div class="listing-card__middle">
                                                    <div class="listing-card__body">
                                                        <div class="body-wrapper">
                                                            <div class="title">
                                                                <a href="#">Zeon Luxury Apartments</a>
                                                            </div>
                                                        </div>
                                                        <div class="data_info">
                                                            <i class="fa fa-map-pin"></i>Washington DC, USA
                                                        </div>
                                                        <p class="body-text">
                                                            Quis nostrud exercitation ullamco laboris nisit
                                                            aliquip ex ea commodo consequat...
                                                        </p>
                                                    </div>
                                                    <div class="listing-card__info">
                                                        <div class="info-wrapper">
                                                            <div class="price">$3,250.00</div>
                                                            <ul class="data-item d-flex justify-content-between">
                                                                <li>Automatic</li>
                                                                <li>Petrol</li>
                                                                <li>AWD</li>
                                                                <li>2021</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class=" col-12 col-xl-4 col-md-6">
                                        <div class="listing-card ll-none">
                                            <div class="listing-card__box listing-card__box_featured" data-marker="3">
                                                <div class="listing-card__media shine">
                                                    <a href="02_listings-grid.html">
                                                        <img src="img/listing-3.jpg" width="360" height="270" alt="Fadisy Restaurant"/>
                                                    </a>
                                                    <div class="listing-card__bookmark active">
                                                        Featured
                                                    </div>
                                                    <div class="listing-btn-action">
                                                        <a class="listing-btn-ico view_more_link" href="02_listings-grid.html" data-uk-tooltip="View More" title="" data-aria-describedby="data-uk-tooltip-0">
                                                            <i class="fa-solid fa-eye"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Addto Compare" title="" data-aria-describedby="data-uk-tooltip-1">
                                                            <i class="fa-solid fa-code-compare"></i>
                                                            <i class="fa-solid fa-not-equal"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Add to Favorite" title="" data-aria-describedby="data-uk-tooltip-2">
                                                            <i class="fa-regular fa-heart"></i>
                                                            <i class="fa-solid fa-heart"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                                <div class="listing-card__middle">
                                                    <div class="listing-card__body">
                                                        <div class="body-wrapper">
                                                            <div class="title">
                                                                <a href="#">Free Online Shopping</a>
                                                            </div>
                                                            <div class="heart active">
                                                                <img src="img/svg/icon-heart.svg" alt="ico-heart"/>
                                                            </div>
                                                        </div>
                                                        <div class="data_info">
                                                            <i class="fa fa-map-pin"></i>Washington DC, USA
                                                        </div>
                                                        <p class="body-text">
                                                            Quis nostrud exercitation ullamco laboris nisit
                                                            aliquip ex ea commodo consequat...
                                                        </p>
                                                    </div>
                                                    <div class="listing-card__info">
                                                        <div class="info-wrapper">
                                                            <div class="price">$3,250.00</div>
                                                            <ul class="data-item d-flex justify-content-between">
                                                                <li>Automatic</li>
                                                                <li>Petrol</li>
                                                                <li>AWD</li>
                                                                <li>2021</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class=" col-12 col-xl-4 col-md-6">
                                        <div class="listing-card ll-none">
                                            <div class="listing-card__box">
                                                <div class="listing-card__media shine">
                                                    <a href="02_listings-grid.html">
                                                        <img src="img/listing-4.jpg" width="360" height="270" alt="Fadisy Restaurant"/>
                                                    </a>
                                                    <div class="listing-btn-action">
                                                        <a class="listing-btn-ico view_more_link" href="02_listings-grid.html" data-uk-tooltip="View More" title="" data-aria-describedby="data-uk-tooltip-0">
                                                            <i class="fa-solid fa-eye"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Addto Compare" title="" data-aria-describedby="data-uk-tooltip-1">
                                                            <i class="fa-solid fa-code-compare"></i>
                                                            <i class="fa-solid fa-not-equal"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Add to Favorite" title="" data-aria-describedby="data-uk-tooltip-2">
                                                            <i class="fa-regular fa-heart"></i>
                                                            <i class="fa-solid fa-heart"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                                <div class="listing-card__middle">
                                                    <div class="listing-card__body">
                                                        <div class="body-wrapper">
                                                            <div class="title">
                                                                <a href="#">Traveling to Bankok</a>
                                                            </div>
                                                            <div class="heart active">
                                                                <img src="img/svg/icon-heart.svg" alt="ico-heart"/>
                                                            </div>
                                                        </div>
                                                        <div class="data_info">
                                                            <i class="fa fa-map-pin"></i>Washington DC, USA
                                                        </div>
                                                        <p class="body-text">
                                                            Quis nostrud exercitation ullamco laboris nisit
                                                            aliquip ex ea commodo consequat...
                                                        </p>
                                                    </div>
                                                    <div class="listing-card__info">
                                                        <div class="info-wrapper">
                                                            <div class="price">$3,250.00</div>
                                                            <ul class="data-item d-flex justify-content-between">
                                                                <li>Automatic</li>
                                                                <li>Petrol</li>
                                                                <li>AWD</li>
                                                                <li>2021</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class=" col-12 col-xl-4 col-md-6">
                                        <div class="listing-card ll-none">
                                            <div class="listing-card__box">
                                                <div class="listing-card__media shine">
                                                    <a href="02_listings-grid.html">
                                                        <img src="img/listing-1.jpg" width="360" height="270" alt="Fadisy Restaurant"/>
                                                    </a>
                                                    <div class="listing-btn-action">
                                                        <a class="listing-btn-ico view_more_link" href="02_listings-grid.html" data-uk-tooltip="View More" title="" data-aria-describedby="data-uk-tooltip-0">
                                                            <i class="fa-solid fa-eye"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Addto Compare" title="" data-aria-describedby="data-uk-tooltip-1">
                                                            <i class="fa-solid fa-code-compare"></i>
                                                            <i class="fa-solid fa-not-equal"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Add to Favorite" title="" data-aria-describedby="data-uk-tooltip-2">
                                                            <i class="fa-regular fa-heart"></i>
                                                            <i class="fa-solid fa-heart"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                                <div class="listing-card__middle">
                                                    <div class="listing-card__body">
                                                        <div class="body-wrapper">
                                                            <div class="title">
                                                                <a href="#">Mercedes S-Class 2020 </a>
                                                            </div>
                                                            <div class="heart active">
                                                                <img src="img/svg/icon-heart.svg" alt="ico-heart"/>
                                                            </div>
                                                        </div>
                                                        <div class="data_info">
                                                            <i class="fa fa-map-pin"></i>Washington DC, USA
                                                        </div>
                                                        <p class="body-text">
                                                            Quis nostrud exercitation ullamco laboris nisit
                                                            aliquip ex ea commodo consequat...
                                                        </p>
                                                    </div>
                                                    <div class="listing-card__info">
                                                        <div class="info-wrapper">
                                                            <div class="price">$3,250.00</div>
                                                            <ul class="data-item d-flex justify-content-between">
                                                                <li>Automatic</li>
                                                                <li>Petrol</li>
                                                                <li>AWD</li>
                                                                <li>2021</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class=" col-12 col-xl-4 col-md-6">
                                        <div class="listing-card ll-none">
                                            <div class="listing-card__box">
                                                <div class="listing-card__media shine">
                                                    <a href="02_listings-grid.html">
                                                        <img src="img/listing-4.jpg" width="360" height="270" alt="Fadisy Restaurant"/>
                                                    </a>
                                                    <div class="listing-btn-action">
                                                        <a class="listing-btn-ico view_more_link" href="02_listings-grid.html" data-uk-tooltip="View More" title="" data-aria-describedby="data-uk-tooltip-0">
                                                            <i class="fa-solid fa-eye"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Addto Compare" title="" data-aria-describedby="data-uk-tooltip-1">
                                                            <i class="fa-solid fa-code-compare"></i>
                                                            <i class="fa-solid fa-not-equal"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Add to Favorite" title="" data-aria-describedby="data-uk-tooltip-2">
                                                            <i class="fa-regular fa-heart"></i>
                                                            <i class="fa-solid fa-heart"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                                <div class="listing-card__middle">
                                                    <div class="listing-card__body">
                                                        <div class="body-wrapper">
                                                            <div class="title">
                                                                <a href="#">Traveling to Bankok</a>
                                                            </div>
                                                            <div class="heart active">
                                                                <img src="img/svg/icon-heart.svg" alt="ico-heart"/>
                                                            </div>
                                                        </div>
                                                        <div class="data_info">
                                                            <i class="fa fa-map-pin"></i>Washington DC, USA
                                                        </div>
                                                        <p class="body-text">
                                                            Quis nostrud exercitation ullamco laboris nisit
                                                            aliquip ex ea commodo consequat...
                                                        </p>
                                                    </div>
                                                    <div class="listing-card__info">
                                                        <div class="info-wrapper">
                                                            <div class="price">$3,250.00</div>
                                                            <ul class="data-item d-flex justify-content-between">
                                                                <li>Automatic</li>
                                                                <li>Petrol</li>
                                                                <li>AWD</li>
                                                                <li>2021</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                            {/* <div class="tab-pane fade" id="pills-choice" role="tabpanel" data-aria-labelledby="pills-contact-tab">
                                <div class="row slww">
                                    <div class=" col-12 col-xl-4 col-md-6">
                                        <div class="listing-card ll-none">
                                            <div class="listing-card__box" data-marker="1">
                                                <div class="listing-card__media shine">
                                                    <a href="02_listings-grid.html">
                                                        <img src="img/listing-2.jpg" width="360" height="270" alt="Fadisy Restaurant"/>
                                                    </a>
                                                    <div class="listing-btn-action">
                                                        <a class="listing-btn-ico view_more_link" href="02_listings-grid.html" data-uk-tooltip="View More" title="" data-aria-describedby="data-uk-tooltip-0">
                                                            <i class="fa-solid fa-eye"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Addto Compare" title="" data-aria-describedby="data-uk-tooltip-1">
                                                            <i class="fa-solid fa-code-compare"></i>
                                                            <i class="fa-solid fa-not-equal"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Add to Favorite" title="" data-aria-describedby="data-uk-tooltip-2">
                                                            <i class="fa-regular fa-heart"></i>
                                                            <i class="fa-solid fa-heart"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                                <div class="listing-card__middle">
                                                    <div class="listing-card__body">
                                                        <div class="body-wrapper">
                                                            <div class="title">
                                                                <a href="#">Zeon Luxury Apartments</a>
                                                            </div>
                                                        </div>
                                                        <div class="data_info">
                                                            <i class="fa fa-map-pin"></i>Washington DC, USA
                                                        </div>
                                                        <p class="body-text">
                                                            Quis nostrud exercitation ullamco laboris nisit
                                                            aliquip ex ea commodo consequat...
                                                        </p>
                                                    </div>
                                                    <div class="listing-card__info">
                                                        <div class="info-wrapper">
                                                            <div class="price">$3,250.00</div>
                                                            <ul class="data-item d-flex justify-content-between">
                                                                <li>Automatic</li>
                                                                <li>Petrol</li>
                                                                <li>AWD</li>
                                                                <li>2021</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class=" col-12 col-xl-4 col-md-6">
                                        <div class="listing-card ll-none">
                                            <div class="listing-card__box listing-card__box_featured" data-marker="3">
                                                <div class="listing-card__media shine">
                                                    <a href="02_listings-grid.html">
                                                        <img src="img/listing-3.jpg" width="360" height="270" alt="Fadisy Restaurant"/>
                                                    </a>
                                                    <div class="listing-card__bookmark active">
                                                        Featured
                                                    </div>
                                                    <div class="listing-btn-action">
                                                        <a class="listing-btn-ico view_more_link" href="02_listings-grid.html" data-uk-tooltip="View More" title="" data-aria-describedby="data-uk-tooltip-0">
                                                            <i class="fa-solid fa-eye"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Addto Compare" title="" data-aria-describedby="data-uk-tooltip-1">
                                                            <i class="fa-solid fa-code-compare"></i>
                                                            <i class="fa-solid fa-not-equal"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Add to Favorite" title="" data-aria-describedby="data-uk-tooltip-2">
                                                            <i class="fa-regular fa-heart"></i>
                                                            <i class="fa-solid fa-heart"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                                <div class="listing-card__middle">
                                                    <div class="listing-card__body">
                                                        <div class="body-wrapper">
                                                            <div class="title">
                                                                <a href="#">Free Online Shopping</a>
                                                            </div>
                                                            <div class="heart active">
                                                                <img src="img/svg/icon-heart.svg" alt="ico-heart"/>
                                                            </div>
                                                        </div>
                                                        <div class="data_info">
                                                            <i class="fa fa-map-pin"></i>Washington DC, USA
                                                        </div>
                                                        <p class="body-text">
                                                            Quis nostrud exercitation ullamco laboris nisit
                                                            aliquip ex ea commodo consequat...
                                                        </p>
                                                    </div>
                                                    <div class="listing-card__info">
                                                        <div class="info-wrapper">
                                                            <div class="price">$3,250.00</div>
                                                            <ul class="data-item d-flex justify-content-between">
                                                                <li>Automatic</li>
                                                                <li>Petrol</li>
                                                                <li>AWD</li>
                                                                <li>2021</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class=" col-12 col-xl-4 col-md-6">
                                        <div class="listing-card ll-none">
                                            <div class="listing-card__box">
                                                <div class="listing-card__media shine">
                                                    <a href="02_listings-grid.html">
                                                        <img src="img/listing-4.jpg" width="360" height="270" alt="Fadisy Restaurant"/>
                                                    </a>
                                                    <div class="listing-btn-action">
                                                        <a class="listing-btn-ico view_more_link" href="02_listings-grid.html" data-uk-tooltip="View More" title="" data-aria-describedby="data-uk-tooltip-0">
                                                            <i class="fa-solid fa-eye"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Addto Compare" title="" data-aria-describedby="data-uk-tooltip-1">
                                                            <i class="fa-solid fa-code-compare"></i>
                                                            <i class="fa-solid fa-not-equal"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Add to Favorite" title="" data-aria-describedby="data-uk-tooltip-2">
                                                            <i class="fa-regular fa-heart"></i>
                                                            <i class="fa-solid fa-heart"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                                <div class="listing-card__middle">
                                                    <div class="listing-card__body">
                                                        <div class="body-wrapper">
                                                            <div class="title">
                                                                <a href="#">Traveling to Bankok</a>
                                                            </div>
                                                            <div class="heart active">
                                                                <img src="img/svg/icon-heart.svg"  alt="ico-heart"/>
                                                            </div>
                                                        </div>
                                                        <div class="data_info">
                                                            <i class="fa fa-map-pin"></i>Washington DC, USA
                                                        </div>
                                                        <p class="body-text">
                                                            Quis nostrud exercitation ullamco laboris nisit
                                                            aliquip ex ea commodo consequat...
                                                        </p>
                                                    </div>
                                                    <div class="listing-card__info">
                                                        <div class="info-wrapper">
                                                            <div class="price">$3,250.00</div>
                                                            <ul class="data-item d-flex justify-content-between">
                                                                <li>Automatic</li>
                                                                <li>Petrol</li>
                                                                <li>AWD</li>
                                                                <li>2021</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class=" col-12 col-xl-4 col-md-6">
                                        <div class="listing-card ll-none">
                                            <div class="listing-card__box">
                                                <div class="listing-card__media shine">
                                                    <a href="02_listings-grid.html">
                                                        <img src="img/listing-1.jpg" width="360" height="270" alt="Fadisy Restaurant"/>
                                                    </a>
                                                    <div class="listing-btn-action">
                                                        <a class="listing-btn-ico view_more_link" href="02_listings-grid.html" data-uk-tooltip="View More" title="" data-aria-describedby="data-uk-tooltip-0">
                                                            <i class="fa-solid fa-eye"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Addto Compare" title="" data-aria-describedby="data-uk-tooltip-1">
                                                            <i class="fa-solid fa-code-compare"></i>
                                                            <i class="fa-solid fa-not-equal"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Add to Favorite" title="" data-aria-describedby="data-uk-tooltip-2">
                                                            <i class="fa-regular fa-heart"></i>
                                                            <i class="fa-solid fa-heart"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                                <div class="listing-card__middle">
                                                    <div class="listing-card__body">
                                                        <div class="body-wrapper">
                                                            <div class="title">
                                                                <a href="#">Mercedes S-Class 2020 </a>
                                                            </div>
                                                            <div class="heart active">
                                                                <img src="img/svg/icon-heart.svg" alt="ico-heart"/>
                                                            </div>
                                                        </div>
                                                        <div class="data_info">
                                                            <i class="fa fa-map-pin"></i>Washington DC, USA
                                                        </div>
                                                        <p class="body-text">
                                                            Quis nostrud exercitation ullamco laboris nisit
                                                            aliquip ex ea commodo consequat...
                                                        </p>
                                                    </div>
                                                    <div class="listing-card__info">
                                                        <div class="info-wrapper">
                                                            <div class="price">$3,250.00</div>
                                                            <ul class="data-item d-flex justify-content-between">
                                                                <li>Automatic</li>
                                                                <li>Petrol</li>
                                                                <li>AWD</li>
                                                                <li>2021</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class=" col-12 col-xl-4 col-md-6">
                                        <div class="listing-card ll-none">
                                            <div class="listing-card__box">
                                                <div class="listing-card__media shine">
                                                    <a href="02_listings-grid.html">
                                                        <img src="img/listing-4.jpg" width="360" height="270" alt="Fadisy Restaurant"/>
                                                    </a>
                                                    <div class="listing-btn-action">
                                                        <a class="listing-btn-ico view_more_link" href="02_listings-grid.html" data-uk-tooltip="View More" title="" data-aria-describedby="data-uk-tooltip-0">
                                                            <i class="fa-solid fa-eye"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Addto Compare" title="" data-aria-describedby="data-uk-tooltip-1">
                                                            <i class="fa-solid fa-code-compare"></i>
                                                            <i class="fa-solid fa-not-equal"></i>
                                                        </a>
                                                        <a class="listing-btn-ico listing-tgl-button" href="#" data-uk-tooltip="Add to Favorite" title="" data-aria-describedby="data-uk-tooltip-2">
                                                            <i class="fa-regular fa-heart"></i>
                                                            <i class="fa-solid fa-heart"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                                <div class="listing-card__middle">
                                                    <div class="listing-card__body">
                                                        <div class="body-wrapper">
                                                            <div class="title">
                                                                <a href="#">Traveling to Bankok</a>
                                                            </div>
                                                            <div class="heart active">
                                                                <img src="img/svg/icon-heart.svg" alt="ico-heart"/>
                                                            </div>
                                                        </div>
                                                        <div class="data_info">
                                                            <i class="fa fa-map-pin"></i>Washington DC, USA
                                                        </div>
                                                        <p class="body-text">
                                                            Quis nostrud exercitation ullamco laboris nisit
                                                            aliquip ex ea commodo consequat...
                                                        </p>
                                                    </div>
                                                    <div class="listing-card__info">
                                                        <div class="info-wrapper">
                                                            <div class="price">$3,250.00</div>
                                                            <ul class="data-item d-flex justify-content-between">
                                                                <li>Automatic</li>
                                                                <li>Petrol</li>
                                                                <li>AWD</li>
                                                                <li>2021</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </section>
            <section class="we__offer">
                <div class="container">
                    <div  >
                        <div class="row">
                            <div class="col-12 col-lg-6">
                                <h2 class="we__offer-title"> We Offer Wide Range of Listings Promoting Your Business </h2>
                            </div>
                            <div class="col-12 col-lg-6">
                                <div class="col-a-right">
                                    <a href="#" class="link__template btn-hover-animate d-flex ">
                                        <div class="text">get started today</div>
                                        <span class="btn-icon-span-3">
                                            <i class="fa fa-chevron-right fa-first"></i>
                                            <i class="fa  fa-paper-plane fa-second"></i>
                                        </span>
                                    </a>
                                    <p>Free Listings also available</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row we__offer-item">
                        <div class="col-12 col-lg-4 p-0 m-0">
                            <div class="we__offer-card d-flex flex-column">
                                <div class="we__offer-card_icon"><i class="icon-search second-color"></i></div>
                                <h5 class="title">Huge Products Listings</h5>
                                <p class="text"> If you enjoy the thrill of a bargain, you're probably always shopping online, on your phone or in the high street. </p>
                            </div>
                        </div>
                        <div class="col-12 col-lg-4 p-0 m-0">
                            <div class="we__offer-card d-flex flex-column">
                                <div class="we__offer-card_icon"><i class="icon-scope second-color"></i></div>
                                <h5 class="title">Easily Find Services</h5>
                                <p class="text"> Easily Find Services is the best way to find top-rated businesses in your area. Check us out today! </p>
                            </div>
                        </div>
                        <div class="col-12 col-lg-4 p-0 m-0">
                            <div class="we__offer-card d-flex flex-column">
                                <div class="we__offer-card_icon"><i class="icon-finder second-color"></i></div>
                                <h5 class="title">Guaranteed Prices</h5>
                                <p class="text"> No matter what your budget is, we guarantee that you'll find something you love at our store! </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section class="reviews reviews2 py-105">
                <div class="container__1575" style={{marginTop:'-300px'}}>
                    <h3 class="reviews__subtitle text-center first-color"> We're proud to have earned their trust </h3>
                    <h2 class="reviews__title">
                        Reviews By Customers
                        <span class="shape-1">
                            {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 76.81 211.79" width="22px" height="56px">
                                <path d="M45,60.9l-45,45,45,45-45,45,15.91,15.9,60.9-60.9-45-45,45-45L15.91,0,0,15.91Z"></path>
                            </svg> */}
                        </span>
                    </h2>
                    <div class="reviews__slider">
                        <div class="item">
                            <div class="item-card">
                                <i class="icon-quote second-color"></i>
                                <div class="fl-text "> I love the templines that come with this feeder. The birders in my area love them too. They are easy to assemble and make it easy for me to change the birdseed. </div>
                                <div class="row g-0">
                                    <div class="col-lg-2">
                                        <img src="img/customers-1.jpg" class="img-fluid rounded-start" alt="customer"/>
                                    </div>
                                    <div class="col-lg-10">
                                        <div class="card-body">
                                            <h5 class="card-title mb-0">John McKenzie</h5>
                                            <p class="card-text">Customer</p>
                                            <div class="card-body-review-star">
                                                <i class="fa fa-star fa-star-active" aria-hidden="true"></i>
                                                <i class="fa fa-star fa-star-active" aria-hidden="true"></i>
                                                <i class="fa fa-star " aria-hidden="true"></i>
                                                <i class="fa fa-star " aria-hidden="true"></i>
                                                <i class="fa fa-star" aria-hidden="true"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="item">
                            <div class="item-card">
                                <i class="icon-quote second-color"></i>
                                <div class="fl-text "> I love the templines that come with this feeder. The birders in my area love them too. They are easy to assemble and make it easy for me to change the birdseed. </div>
                                <div class="row g-0">
                                    <div class="col-lg-2">
                                        <img src="img/customers-2.jpg" class="img-fluid rounded-start" alt="customer"/>
                                    </div>
                                    <div class="col-lg-10">
                                        <div class="card-body">
                                            <h5 class="card-title mb-0">John McKenzie</h5>
                                            <p class="card-text">Customer</p>
                                            <div class="card-body-review-star">
                                                <i class="fa fa-star fa-star-active" aria-hidden="true"></i>
                                                <i class="fa fa-star fa-star-active" aria-hidden="true"></i>
                                                <i class="fa fa-star fa-star-active" aria-hidden="true"></i>
                                                <i class="fa fa-star fa-star-active" aria-hidden="true"></i>
                                                <i class="fa fa-star fa-star-active" aria-hidden="true"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="item">
                            <div class="item-card">
                                <i class="icon-quote second-color"></i>
                                <div class="fl-text "> I love the templines that come with this feeder. The birders in my area love them too. They are easy to assemble and make it easy for me to change the birdseed. </div>
                                <div class="row g-0">
                                    <div class="col-lg-2">
                                        <img src="img/customers-3.jpg" class="img-fluid rounded-start" alt="customer"/>
                                    </div>
                                    <div class="col-lg-10">
                                        <div class="card-body">
                                            <h5 class="card-title mb-0">John McKenzie</h5>
                                            <p class="card-text">Customer</p>
                                            <div class="card-body-review-star">
                                                <i class="fa fa-star fa-star-active" aria-hidden="true"></i>
                                                <i class="fa fa-star fa-star-active" aria-hidden="true"></i>
                                                <i class="fa fa-star fa-star-active" aria-hidden="true"></i>
                                                <i class="fa fa-star fa-star-active" aria-hidden="true"></i>
                                                <i class="fa fa-star" aria-hidden="true"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="item">
                            <div class="item-card">
                                <i class="icon-quote second-color"></i>
                                <div class="fl-text "> I love the templines that come with this feeder. The birders in my area love them too. They are easy to assemble and make it easy for me to change the birdseed. </div>
                                <div class="row g-0">
                                    <div class="col-lg-2">
                                        <img src="img/customers-2.jpg" class="img-fluid rounded-start" alt="customer"/>
                                    </div>
                                    <div class="col-lg-10">
                                        <div class="card-body">
                                            <h5 class="card-title mb-0">John McKenzie</h5>
                                            <p class="card-text">Customer</p>
                                            <div class="card-body-review-star">
                                                <i class="fa fa-star fa-star-active" aria-hidden="true"></i>
                                                <i class="fa fa-star fa-star-active" aria-hidden="true"></i>
                                                <i class="fa fa-star fa-star-active" aria-hidden="true"></i>
                                                <i class="fa fa-star " aria-hidden="true"></i>
                                                <i class="fa fa-star" aria-hidden="true"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="news__pagination">
                        <div class="slider-dots-box"></div>
                    </div>
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
                        <h2> SignUp for Updates, <br/> Get Subscribed Today! </h2>
                    </div>
                    <div class="col-12 col-lg-6 form-email d-flex align-items-center">
                        <form action="#">
                            <input type="email" placeholder="Your email .. " class="w-100"/>
                            <button type="submit" class="btn-hover-animate first-bg-color">
                                <span class="btn-icon-span-4">
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
                            {/* <a class="navbar-brand d-flex align-items-center logo-footer" href="index.html">
                                <img src="img/png/footer-logo.png" alt="logo" width="172" height="45"/>
                            </a> */}
                            <p class="text"> We believe that the best way to make sure our products are the best they can be is to listen to what our customers have to say. That’s why we’re constantly asking for feedback and publishing reviews by customers on our website.</p>
                            <div class="d-flex flex-wrap flex-lg-column justify-content-between">
                                <a class="phone" href="tel:+12020003399"><i class="fa-solid fa-phone-volume"></i> +(1)202 00 3399</a>
                                <ul class="social d-flex">
                                    <li>
                                        <a href="#">
                                            <img src="img/svg/icon-f.svg" alt="facebook"/>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <img src="img/svg/icon-t.svg" alt="twitter"/>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <img src="img/svg/icon-g+.svg" alt="g+"/>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <img src="img/svg/icon-in.svg" alt="in"/>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <img src="img/svg/icon-v.svg" alt="v"/>
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
                                            <img src="img/listing-1-small.jpg" width="60" height="60" alt="list-small"/>
                                            <div class="card-content">
                                                <h6 class="card-title">Mercedes S-Class 2020</h6>
                                                <div class="card-price">$3,250.00</div>
                                                <div class="data_info">
                                                    <i class="fa fa-map-pin"></i> Washington DC, USA
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <div class="d-flex flex-wrap card-list align-items-start">
                                            <img src="img/listing-2-small.jpg" width="60" height="60" alt="list-small"/>
                                            <div class="card-content">
                                                <h6 class="card-title">Mercedes S-Class 2020</h6>
                                                <div class="card-price">$3,250.00</div>
                                                <div class="data_info">
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
    <script src="assest/jquery.js"></script>
    <script src="assest/jquery-migrate-1.2.1.js"></script>
    <script src="assest/uikit.min.js"></script>
    <script src="assest/slick.min.js"></script>
    <script src="assest/modernizr.custom.js"></script>
    <script src="assest/jquery.dlmenu.js"></script>
    <script src="assest/bootstrap.js"></script>
    <script src="assest/custom.js"></script>

    </div>
  )
}

export default Home
