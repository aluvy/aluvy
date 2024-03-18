


/** M06_F | Relation Offering */
function M06_F(el) {
    _proto = M06_F.prototype;

    this.$el = el;
    this.data = this.$el.data();
    this.addEventFlag = false;

    this.$carousel = this.$el.find(".owl-carousel");
    this.$carouselItem = this.$el.find(".owl-carousel .item");
    this.$pagn = this.$el.find(".owl-pagn");
    this.$control = {
        wrap: this.$el.find(".md_play"),
        playBtn: this.$el.find(".md_btn_play"),
        stopBtn: this.$el.find(".md_btn_stop"),

        prevBtn: this.$el.find(".owl-prev"),
        nextBtn: this.$el.find(".owl-next"),
    };
    var _this = this; // M06_F
    var deviceType; // "PC_LARGE", "PC_MEDIUM", "PC_SMALL", "TABLET", "MOBILE"
    var resizeTimer;
    var lang = $("html").attr("lang") || "en";
    var stopChk = false;

    var mhTarget = [".b_title", ".s_txt"];

    _proto.init = function(){
        //console.log("init:: M06_F")

        // Device type check
        deviceType = checkDeviceType();

        this.$el.find(".M06_F_cont").addClass("m"+this.$carouselItem.length);

        if(this.$carouselItem.length < 2) return;

        if(this.$carouselItem.length > 3) {
            this.$el.find(".M06_F_cont").addClass('itemMax');
        } 
        // else {
        //     this.$el.find(".M06_F_cont").addClass('pcItemMin')
        // }

        /* 210510 | 접근성 | 모바일 활성화 Nav */
        // if(this.$carouselItem.length >= 2){          
        //     this.$carousel.after('<div class="owl-navm"><button class="owl-prevm"><em class=\"blind\">'+(langSet[lang]["slide"]["prevStr"]).toString()+'</em></button><button class="owl-nextm"><em class=\"blind\">'+(langSet[lang]["slide"]["nextStr"]).toString()+'</em></button></div>');
        // }
        /* //210510 | 접근성 | 모바일 활성화 Nav */

        updateCarousel(this);
        // updatePagnAria(this);

        resizeTimer = new Timer(function(){
            var currentDeviceType = checkDeviceType();

            if(deviceType !== currentDeviceType){
                deviceType = currentDeviceType;
                updateCarousel(_this);
                // updatePagnAria(_this);
            }
        }, 100);

        // Set matchHeight item
        if(mhTarget.length){
            getMhItems(this);
            updateMhItem(this);
        }

        // Event binding 
        if(!this.addEventFlag){
            this.addEventFlag = true;
            this.addEvent();
        }
    }

    _proto.addEvent = function(){
        /* 웹접근 작업 : 알수 없는 키보드 작업 주석처리 */
        // _this.$carouselItem.on("focusin", function(e){
        //     if($(e.target).is(":hover")){
        //         return;
        //     }
        //     var currentIndex = _this.$carouselItem.index(e.delegateTarget);
        //     _this.$carousel.trigger('to.owl.carousel', currentIndex);

        //     _this.$carousel.children().scrollLeft() != 0 && _this.$carousel.children().scrollLeft(0);
        //     _this.$el.scrollLeft() != 0 && _this.$el.scrollLeft(0);
        // })
        /* //웹접근 작업 : 알수 없는 키보드 작업 주석처리 */

        // 확인 후 불필요(기능 역활 안함) keyup 기능 (없어도 될거 같음)
        // _this.$el.on("keyup", function(e){
        //     console.log("kkkkkkkkkk")
        //     e.stopPropagation();
            
        //     // if(!_this.$carousel.data("owl.carousel")){
        //     //     return;
        //     // }
            
        //     // if(e.keyCode == 37){
        //     //     console.log("kkkkkkkkkk Prev")
        //     //     _this.$carousel.trigger('prev.owl.carousel');
        //     // }else if(e.keyCode == 39){
        //     //     console.log("kkkkkkkkkk next")
        //     //     _this.$carousel.trigger('next.owl.carousel');
        //     // }
        // })

        /* 210510 | 접근성 | 모바일 활성화 Nav */
        _this.$el.find('.owl-navm button').on("click", function(e){
            e.stopPropagation();           

            if($(this).hasClass('owl-prevm')){
                _this.$carousel.trigger('prev.owl.carousel');
                _this.$carousel.find('.owl-item.active').get(0).focus();
            }else if($(this).hasClass('owl-nextm')){
                _this.$carousel.trigger('next.owl.carousel');
                _this.$carousel.find('.owl-item.active').get(0).focus();
            }
        })
        /* //210510 | 접근성 | 모바일 활성화 Nav */

        // 슬라이드 play,stop 버튼
        _this.$control.stopBtn.on("click", function(e){
            e.preventDefault();
            _this.$carousel.find('.owl-item').attr("data-slideStop", true);

            stopChk = true;
            sequenceControl(_this, "STOP", true);
            return false;
        });
        _this.$control.playBtn.on("click", function(e){
            e.preventDefault();
            _this.$carousel.find('.owl-item').attr("data-slideStop", "");

            stopChk = false;
            sequenceControl(_this, "PLAY", true);
            return false;
        });


        // 슬라이드 arrow 버튼
        _this.$control.prevBtn.on("click", function(e){
            // console.log("prev click");
            e.preventDefault();
            arrowBtnControl(_this, "PREV", true);

            if(_this.$carousel.find('.owl-item').attr('data-slideStop') == "true"){
                sequenceControl(_this, "STOP", true);
            }
            return false;
        });
        _this.$control.nextBtn.on("click", function(e){
            // console.log("next click");
            e.preventDefault();
            arrowBtnControl(_this, "NEXT", true);

            if(_this.$carousel.find('.owl-item').attr('data-slideStop') == "true"){
                sequenceControl(_this, "STOP", true);
            }
            return false;
        });
        _this.$control.prevBtn.add(_this.$control.nextBtn).on('mouseover', function(e){
            // 2024 접근성 수정 시작
            // _this.$carousel.trigger('stop.owl.autoplay');
            sequenceControl(_this, "STOP", true);
            // 2024 접근성 수정 끝
        });
        _this.$control.prevBtn.add(_this.$control.nextBtn).on('mouseleave', function(e){
            // 2024 접근성 수정 시작
            // _this.$carousel.trigger('play.owl.autoplay');
            sequenceControl(_this, "PLAY", true);
            if(_this.$carousel.find('.owl-item').attr('data-slideStop') == "true") {
                // _this.$carousel.trigger('stop.owl.autoplay');
                sequenceControl(_this, "STOP", true);
            }
            // 2024 접근성 수정 끝
        });

        /** 모달 팝업이 클릭됐을때 slide stop */
        $(document).on('click','.is_showPopup', function(e) {
            console.log('is_showPopup');
            sequenceControl(_this, "STOP", true);
        });
        /** 모달 팝업 닫기 버튼을 클릭됐을때 slide play */
        $(document).on('click','.is_closePopup', function(e) {
            console.log('is_closePopup');
            sequenceControl(_this, "PLAY", true);
        });


        // Window resize
        $(window).on("resize", function(){
            resizeTimer.start();
        })
    }

    // Init Match Height Item
    function getMhItems(_plugin){
        _plugin.mhItems = mhTarget.map(function(target){
            return _plugin.$carouselItem.find(target);
        });
    }

    // Update Match Height Item
    function updateMhItem(_plugin){
        var idx;
        var len =_plugin.mhItems.length;
        var opt = {
            init: { tbyRow: true, remove: false },
            remove: { tbyRow: false, remove: true }
        }

        switch (deviceType) {
            case "PC":
            case "TABLET":
                for (idx = 0; idx < len; idx++) {
                    _plugin.mhItems[idx].matchHeight(opt.init);
                }
                _plugin.$carousel.find('.b_title').matchHeight(opt.init);
                break;
            case "MOBILE":
                for (idx = 0; idx < len; idx++) {
                    _plugin.mhItems[idx].matchHeight(opt.remove);
                }
                _plugin.$carousel.find('.b_title').matchHeight(opt.init);
                break;
            // default:
            //     break;
        }
    }

    // Device type check
    function checkDeviceType(){
        if (window.innerWidth > 1023){
            return "PC";
        }else if(window.innerWidth > 600){
            return "TABLET";
        }else{
            return "MOBILE";
        }
    }
    
    function setCarousel(_plugin){
        // console.log("setCarousel start")
        if(_plugin.$carousel.data("owl.carousel")){
            return;
        }

        _plugin.$carousel.owlCarousel({
            // stageElement: 'ul',
            // itemElement: 'li',
            autoplay: true,
            autoplayTimeout:3000,
            autoplaySpeed: 700, //넘어가는 속도
            autoplayHoverPause: true,
            stopOnHover:true,
            autoWidth:false,
            loop: true,
            nav: false,
            // navText: [
            //     '<em class=\"blind\">'+(langSet[lang]["slide"]["prevStr"]).toString()+'</em>',
            //     '<em class=\"blind\">'+(langSet[lang]["slide"]["nextStr"]).toString()+'</em>'
            // ],
            dots: false,
            items:2,//기존3씩 나오던 item pc에서는 2개씩 나오게 수정
            singleItem : true,
            // smartSpeed: 500,
            responsive:{
                0:{
                    margin:10, //mobile
                    items:3, //모바일에선 기존 3개씩
                    autoWidth:true,
                    center:true,
                    autoplay: false,
                    autoplayHoverPause: false,
                }, 
                1023:{
                    margin:16,//pc
                }
            },
            onInitialized: function(e){
                // console.log("slide inint");
                initPagn(e, _plugin);
                // setCarouselAria(_plugin); //불필요 작업 (삭제예정 운영 반영에 이상 없는거 같음..)

                _plugin.$carousel.addClass("act");
            },
            onRefreshed: function(e){ // FIREFOX
                // console.log("slide onRefreshed");
                initPagn(e, _plugin);
                // setCarouselAria(_plugin); //불필요 작업 (삭제예정 운영 반영에 이상 없는거 같음..)

                _plugin.$carousel.addClass("act");

            },
            onChanged: function(e){
                // console.log("slide after");
                // console.log("000", e.relatedTarget.find(".owl-item"))
                // console.log("11 current: ", e.relatedTarget.current())
                // console.log("33 total: ", e.item.count)   //total
                updatePagn(e, _plugin);

                /** 의미없는 작업 삭제 */
                // setInterval(function(){
                //     _plugin.$el.scrollLeft(0); 
                // },100);

                _plugin.$carousel.removeClass("act");
                setAriaHidden(e, _plugin); /* 210510 | 접근성 | 모바일 활성화 Nav */
            },

            onResized: function(e){
                // console.log("slide onResized");
                if(_plugin.$carousel.find('.owl-item').attr('data-slideStop') == "true"){
                    // console.log("stop 걸림")
                    sequenceControl(_plugin, "STOP", true);
                }
                _plugin.$carousel.removeClass("act");
            }
        });
    }

    function updateCarousel(_plugin){
        switch (deviceType) {
            case "PC":
                (_plugin.$carouselItem.length < 3) //3개 였을때 슬라이드 비활성화 되던 수정내용 삭제
                    ? destroyCarousel(_plugin) // 1,2
                    : setCarousel(_plugin) // 3,4,5,6,7...
                break;
            case "TABLET":
            case "MOBILE":
                (_plugin.$carouselItem.length < 2)
                    ? destroyCarousel(_plugin) // 1
                    : setCarousel(_plugin) // 2,3,4,5,6,7...
                break;
            // default:
            //     break;
        }
    }

    //불필요 작업 (삭제예정 운영 반영에 이상 없는거 같음..)
    function setCarouselAria(_plugin){
        var $clonedItem = _plugin.$carousel.find('.owl-item.cloned');

        // $clonedItem.attr("aria-hidden", true)
        // $clonedItem.find("a, button").attr('tabindex', -1); 
    }

    function initPagn(e, _plugin){
        var slides = e.relatedTarget;
        var activeIndex = slides.relative(slides.current()) + 1;
        var barWidth = ( 100 / e.item.count ) * activeIndex;
        var ariaTxt = setNum(activeIndex) +" of "+ setNum(e.item.count);

        // _plugin.$pagn.attr("aria-labelledby", ariaTxt);
        _plugin.$pagn.find(".owl-pagn-bar p").css("width", barWidth + "%");
        _plugin.$pagn.find(".owl-pagn-st").text(setNum(activeIndex));
        _plugin.$pagn.find(".owl-pagn-ed").text(setNum(e.item.count));
    }

    function updatePagn(e, _plugin){
        var slides = e.relatedTarget;
        var activeIndex = slides.relative(slides.current()) + 1;
        var barWidth = ( 100 / e.item.count ) * activeIndex;
        var ariaTxt = setNum(activeIndex) +" of "+ setNum(e.item.count);
        
        if(isNaN(activeIndex)) return;
        
        // _plugin.$pagn.attr("aria-labelledby", ariaTxt);
        _plugin.$pagn.find(".owl-pagn-bar p").css("width", barWidth + "%");
        _plugin.$pagn.find(".owl-pagn-st").text(setNum(activeIndex));
    }

    function updatePagnAria(_plugin){
        switch (deviceType) {
            case "PC":
                (_plugin.$carouselItem.length < 4)
                    ? _plugin.$pagn.attr("aria-live","off") // 1,2,3
                    : _plugin.$pagn.attr("aria-live","polite") // 4,5,6,7...
                break;
            case "TABLET":
            case "MOBILE":
                (_plugin.$carouselItem.length < 2)
                    ? _plugin.$pagn.attr("aria-live","off") // 1
                    : _plugin.$pagn.attr("aria-live","polite") // 2,3,4,5,6,7...
                break;
            // default:
            //     break;
        }
        // _plugin.$pagn.find(".owl-pagn-inner").not("[aria-hidden]") && _plugin.$pagn.find(".owl-pagn-inner").attr("aria-hidden", true); /* 2023-04 접근성 수정 progressbar */
    }

    function destroyCarousel(_plugin){
        if(!_plugin.$carousel.data("owl.carousel")){
            return;
        }
        _plugin.$carousel.owlCarousel('destroy');
    }

    function setNum(num){
        return num < 10 ? "0" + num : num;
    }

    // Sequence Control: play, stop
    function sequenceControl(_plugin, option, changeFocus){

        // 2024 접근성 수정 시작
        const isMobile = $("html").attr("data-device") === 'mobile';
        // console.log('sequenceControl', option, isMobile);
        // 2024 접근성 수정 끝

        
        switch (option) {
            case "PLAY":
                // 2024 접근성 수정 시작
                if(isMobile) return;
                // 2024 접근성 수정 끝
                _this.$carousel.trigger('play.owl.autoplay');
                _plugin.$control.wrap.removeClass('on');
                break;
            case "STOP":
                _this.$carousel.trigger('stop.owl.autoplay');
                _plugin.$control.wrap.addClass('on');
                break;
            // default:
            //     break;
        }
    }
    // slide left right button
    function arrowBtnControl(_plugin, option, changeFocus){
        switch (option) {
            case "PREV":
                _this.$carousel.trigger('prev.owl.carousel');
                // _plugin.$control.wrap.removeClass('on');
                break;
            case "NEXT":
                _this.$carousel.trigger('next.owl.carousel');
                // _plugin.$control.wrap.addClass('on');
                break;
            // default:
            //     break;
        }
    }

    function setAriaHidden(e, _plugin){
        // var currentIdx = e.item.index;
        // var activeItem = $(e.target).find(".owl-item").eq(currentIdx);
        // console.log("sssssss", $(e.target).find(".active"))

        /** owlCarousel cloned 이슈 작업하면서 웹접근성 추가 작업 */
        $(e.target).find(".owl-item").add($(e.target).find(".owl-item .md_btn a")).attr({ 'aria-hidden': true, tabindex: -1 });
        setTimeout(function(){
            // console.log("실행")
            var activeEls = $(e.target).find('.owl-item.active');
            activeEls.add(activeEls.find(".md_btn a")).attr({'aria-hidden': false, tabindex: ""});
        },100);
        /** //owlCarousel cloned 이슈  작업하면서 웹접근성 추가 작업*/
    }

    this.init();
}

fo.addPlugin(M06_F);



