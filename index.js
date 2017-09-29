import React, { Component, PropTypes } from 'react';
import XML2JS from 'xml2js';
import WeatherController from './WeatherController.js';
import BannerController from './BannerController.js';

//logo url : http://kotv.images.worldnow.com/images/12670727_G.png
const jQuery = window['$'];

const stationCall = window.location.hostname.toLowerCase() === 'www.news9.com' ? 'kwtv' : 'kotv';
const stationID = stationCall === 'kwtv' ? 2 : 1;
const bannerUrl = `http://kotv.com/api/GetBanners.aspx?station=${stationCall}&IsWeb=true`;

const headerbar = {
  position: 'fixed', 
  top: 0,
  left: 0,
  zIndex: '10000', 
  width: '100%'
};
const headertop = {
  height: '111px', 
  backgroundColor: '#222'
};
const headerbottom = {
  height: '48px', 
  backgroundColor: '#be0000'
};
const navul = {
  listStyle: 'none',
  margin: 0, 
  padding: 0
};
const navli = {
  float: 'left'
};
const navlia = {
		color: '#fff', 
		textDecoration: 'none', 
		textTransform: 'uppercase', 
		height: '48px', 
		lineHeight: '48px',
		fontWeight: 'bold',
		fontSize: '17.84px',
		padding: '0 15px',
		display: 'block'
};
const navliaham = {
		color: '#fff', 
		textDecoration: 'none', 
		textTransform: 'uppercase', 
		height: '48px', 
		lineHeight: '48px',
		fontWeight: 'bold',
		fontSize: '20.84px',
		padding: '0 15px',
		display: 'block'
};
const contsty = {
  margin: '0 auto'
};
const logostyone = {
  width: '64px',
  height: '60px'
};
const logostytwo = {
  width: '64px',
  height: '60px',
  transform: 'rotateZ(180deg)'
};
const logosty = stationCall === 'kwtv' ? logostyone : logostytwo;
const meganavmain = {
  background: '#fff', 
  padding: '30px 0'
};
const meganavul = {
  margin: '0 0 10px 0', 
  listStyle: 'none', 
  float: 'left', 
  width: '242px'
};
const meganavli = {
  margin: 0
};
const meganavabold = {
  fontWeight: 'bold', 
  textDecoration: 'none', 
  color: '#333',
  fontSize: '20.84px',
  textTransform: 'uppercase'
};
const meganava = {
  textDecoration: 'none', 
  color: '#333',
  fontSize: '17.84px',
  lineHeight: '30px'
};
const meganavclear = {
  clear: 'both'
};
const wxMiniTop = {
  fontSize: '12.63px', 
  textAlign: 'right'
};
const wxRadarImg = {
  height: '50px'
};
const fLeft = {
  float: 'left'
};
const radarBox = {
  float: 'left', 
  marginTop: '11px'
};
const highlowBox = {
  float: 'left', 
  margin: '10px 10px 0 0', 
  lineHeight: '15px'
};
const feelslike = {
  fontSize: '12.63px', 
  color: '#ccc'
};
const highlow = {
  fontSize: '16px', 
  color: '#fff'
};
const labelHigh = {
  fontSize: '10.22px', 
  color: '#f9cf6c', 
  fontWeight: 500
};
const labelLow = {
  fontSize: '10.22px', 
  color: '#92a4c4', 
  fontWeight: 500, 
  paddingLeft: '3px'
};
const loclink = {
  color: '#fff', 
  textDecoration: 'underline', 
  fontWeight: 'bold'
};
const mobilemeganav = {
  display: 'none',
  width: '100%',
  height: '100%',
  zIndex: 20000,
  position: 'absolute',
  background: '#000',
  top: 0,
  left: 0
};
const bannertitle = {
  fontWeight: 600,
  textTransform: 'uppercase'
};


class Header extends Component{
	constructor(props){
		super(props);
		this.state = {
			headerImgUrl: 'http://kotv.images.worldnow.com/images/12670727_G.png',
			radarImg: `http://aws.kotv.com/MorHtml5/kotv/ssite/110x62_new/main_anim.gif?${(new Date()).getTime()}`,
			navItems: [], 
      megaNav: [], 
      city: '', 
      state: '', 
      conditionIcon: '', 
      temp: '', 
      feelsLike: '',
			high: '',
      low: '',
      firstbanner: {},
      allbanners: []
		}
	}

  componentDidMount(){
    jQuery.ajax({ url:'http://ftpcontent.worldnow.com/kotv/test/wx/tempnav.json', dataType:'jsonp', jsonpCallback:'Nav'}).then((data) => { this.buildState(data); });
    let wxController = new WeatherController(stationID);
    wxController.getCache('currents', this.buildWeather);
    //let bannerController = new BannerController(stationID);
    //bannerController.getCache(this.buildBanners);
    //jQuery.ajax({ url:bannerUrl, dataType: 'json'}).then((data) => { this.buildBanners(data); });
    //console.log('after calling ajax');
    /*$.ajax({
      url: 'http://kotv.com/api/GetNavigation.ashx?Station=' + stationCall + '&NavTypeId=1',
      dataType:'text'
    }).then((data) => { 
      this.buildState(data);
      //this.setState({ navHtml: data['html'] });
    });*/
  }

  buildBanners = (data) =>{
    window.bannerData = data;
    if (data.length){
      let allBanners = [];
      for(let i = 0; i < data.length; i += 1){
        let tmpObj = {
          desc: data[i]['Description'],
          title: data[i]['Title'],
          link: data[i]['Link'],
          id: data[i]['BannerTypeId']
        };
        allBanners.push(tmpObj);
      }
      //jQuery('body').css('padding-top', '191px');
      jQuery('body').addClass('hasbanner');
      //let newBanner = jQuery(`<div id="topBanner">${firstBanner.description}</div>`);
      let firstBanner = allBanners[0];
      this.setState({
        firstbanner: firstBanner,
        allbanners: allBanners
      });
    }
  }

	buildState(data){
		window.testnavdata = data;
		let maindata = data['items'];
		maindata.shift();
		let mainArr = [];
		let megaArr = [];
    let megaMobileArr = [];
		maindata.map(function(item, i){
			if(typeof item['subItems'] !== "undefined"){ megaArr.push(item); }
			if(item['title'] !== 'About Us'){ mainArr.push(item); }
		});

    window.testMegaArr = megaArr;
    window.testMainArr = mainArr;



		this.setState({
			navItems: mainArr,
			megaNav: megaArr
		});

		jQuery('#meganav').masonry({
			columnWidth:242,
			itemSelector:'.grid-item'
			//percentPosition: true
		});
		jQuery('#hamburg').on('click', function(e){
			e.preventDefault();
			jQuery('#meganav').toggleClass('open');
			jQuery('#hamburg').toggleClass('open');
			//window.dispatchEvent(new Event('resize'));
		});
	}

	buildWeather = (data) =>{
		let parseString = XML2JS.parseString,
			forecasts = [], jsondata,
			parsefunc = parseString(data, {attrNameProcessors: [(name => "@" + name)], explicitArray: false, charkey: "#text", mergeAttrs: true}, function(err, result){ jsondata = result; }),
			maindata = jsondata["WxSources"],
			forecastdata = maindata["forecast"]["WxForecasts"],
			todaysforecast = forecastdata["WxForecast"][0],
			currentdata = maindata["conditions"]["sfc_ob"];

		window.testHeaderData = maindata;

		this.setState({
			city: currentdata["location"]["#text"],
			state: currentdata["location"]["@region"],
			conditionIcon: 'http://ftpcontent.worldnow.com/griffin/gnm/testing/svg/day/' + currentdata["WxIconType"]["#text"] + '.svg',
			temp: currentdata["temp"]["#text"],
			feelsLike: currentdata["apparent_temp"]["#text"],
			high: todaysforecast["High"],
			low: todaysforecast["Low"]
		});
	}

  goHome(e){
    e.preventDefault();
    let dabody = jQuery('body');
    if(!dabody.hasClass('isanimating')){
      if(dabody.hasClass('story-page')){
        dabody.addClass('isanimating');
        jQuery('#story').fadeOut(400, function(){
          dabody.removeClass('story-page');
          jQuery('body').scrollTop(0);
          jQuery('#home').fadeIn(400, function(){
            dabody.removeClass('isanimating');
          });
        });
      }
    }
  }

  openMobileNav(e){
    e.preventDefault();
    //mobile nav code
    window.savedScrollTop = jQuery('body').scrollTop();
    jQuery('#meganavmobile').show();
    jQuery('body').addClass('mobilenavopen');
    jQuery('body').scrollTop(0);
  }

  showSubMenu(e, itemCat){
    if(itemCat !== 'About Us'){
      e.preventDefault();
      jQuery('.subItems').removeClass('active');
      //jQuery(`.subItems[data-cat=${itemCat}]`).show();
      jQuery(`.subItems[data-cat=${itemCat}]`).addClass('active');
    }
  }

  goBack(e){
    e.preventDefault();
    jQuery('.subItems').removeClass('active');
  }

  closeBanner(e){
    e.preventDefault();
    //jQuery('#firstBanner').animate({ height: 0 }, 400);
    jQuery('#firstBanner').addClass('closed');
    jQuery('body').addClass('bannerclosed');
    jQuery('body').scrollTop(window.savedScrollTop);
  }

  closeMobileMenu(e){
    e.preventDefault();
    jQuery('#meganavmobile').hide();
    jQuery('body').removeClass('mobilenavopen');
  }

	render(){
		return(
      <div>
  			<div style={headerbar}>
          <div id="bannerContainer">
            <div id="firstBanner" data-banner-id={this.state.firstbanner.id}>
              <div id="bannerContain">
                <div>
                  <span>{this.state.firstbanner.title}</span>
                  <span>: </span>
                  <span>{this.state.firstbanner.desc}</span>
                </div>
                <a className="closebanner" href="#close" onClick={(e) => { this.closeBanner(e); }}>
                  <i className="fa fa-times-circle"></i>
                </a>
              </div>
            </div>
          </div>
  				<div id="headerTop" style={headertop}>
  					<div className="container" style={contsty}>
              <div id="headerCenter">
                <button id="mobileMenu" type="button" className="navbar-toggle collapsed" onClick={(e) => { this.openMobileNav(e); }} data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                </button>
    						<div id="headerlogo"><a href="/" onClick={(e) => this.goHome(e)}><img src="http://ftpcontent.worldnow.com/kotv/test/wx/bug.svg" /></a></div>
    						<div className="headerad"><div className="ad728x90"><img src="http://ftpcontent.worldnow.com/kotv/test/wx/ad728x90.jpg" /></div></div>
    						<div id="wxMiniBlock">
    							<div id="headerLocation" style={wxMiniTop}>Currently in <a href="#" style={loclink}>{this.state.city}, {this.state.state}</a></div>
    							<div id="headerTempBox">
    								<div id="headerTempIcon"><img src={this.state.conditionIcon} /></div>
    								<div id="headerTempText">
    									<div className="wxTemp">{this.state.temp}&deg;</div>
    									<div className="headerFeelsLike" style={feelslike}>Feels like {this.state.feelsLike}&deg;</div>
    								</div>
    								<div id="headerHighLow" style={highlowBox}>
    									<div style={highlow}><span style={labelHigh}>HIGH </span>{this.state.high}</div>
    									<div style={highlow}><span style={labelLow}>LOW </span>{this.state.low}</div>
    								</div>
    								<div id="headerRadar" style={radarBox}>
    									<a href="#"><img style={wxRadarImg} src={this.state.radarImg} /></a>
    								</div>
    							</div>
    						</div>
              </div>
  					</div>
  				</div>
  				<div id="headerBottom" style={headerbottom}>
  					<div className="container" style={contsty}>
  						<ul style={navul}>
  							<li style={navli}><div id="hamburgbg"><a href="#" id="hamburg" style={navliaham}><i className="fa fa-bars"></i></a></div></li>
  							{this.state.navItems.map(function(navitem, i){
  								return (
  									<li key={i} style={navli}>
  										<a href={navitem['url']} style={navlia}>{navitem['title']}</a>
  									</li>
  								);
  							})}
  							<li style={navli}><a href="#" style={navlia} id="searchbtn"><i className="fa fa-search"></i></a></li>
  						</ul>
  					</div>
  				</div>
  				<div id="meganav" style={meganavmain}>
  					<div className="inner">
  						{this.state.megaNav.map(function(navitem, i){
  							return (
  								<ul key={i} style={meganavul} className="grid-item">
  									<li style={meganavli}>
  										<a href={navitem['url']} style={meganavabold}>{navitem['title']}</a>
  									</li>
  									{navitem.subItems.map(function(navsubitem, j){
  										return (
                        <li key={j} style={meganavli}>
  												<a href={navsubitem['url']} style={meganava}>{navsubitem['title']}</a>
  											</li>
  										);
  									})}
  								</ul>
  							);
  						})}
  						<div style={meganavclear}></div>
  					</div>
  				</div>
  			</div>
        <div id="meganavmobile" style={mobilemeganav}>
          <div className="mobilemenuheader">
            <span>Menu</span>
            <span id="closemenu" onClick={(e) => { this.closeMobileMenu(e); }}><i className="fa fa-times"></i></span>
          </div>
          <ul className="banners">
            {this.state.allbanners.map((banner, i) => {
              return (
                <li key={i} data-banner-id={banner.id}>
                  <div className="inner">
                    <a href="#gotobanner">
                      <span style={bannertitle}>{banner.title}</span>: {banner.desc}
                      <i className="fa fa-chevron-right"></i>
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
          <ul>
            {this.state.megaNav.map((navitem, i) => {
              return (
                <li key={i} className="mainItems" data-category-name={navitem['title']}>
                  <a href="#subnav" onClick={(e) => { this.showSubMenu(e, navitem['title']); }}>
                    <span>{navitem['title']}</span>
                    <i className="fa fa-chevron-right"></i>
                  </a>
                  <ul className="subItems" data-cat={navitem['title']}>
                    <li>
                      <a className="goback" href="#goback" onClick={(e) => { this.goBack(e); }}>
                        <i className="fa fa-chevron-left"></i>
                        <span>Back</span>
                      </a>
                    </li>
                    {navitem.subItems.map(function(navsubitem, j){
                      return (
                        <li key={j}>
                          <a href="#gotopage">{navsubitem['title']}</a>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
		);
	}
}

export default Header;
