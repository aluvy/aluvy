/** Page | 오퍼링 > 인사이트 리스트 | MP_insight_list */
/** MP_insight_list */
function MP_insight_list(el) {
    _proto = MP_insight_list.prototype;
    this.$el = el;
    this.data = this.$el.data();
    this.addEventFlag = false;
    this.startIndex = 0;
    this.currentIndex = this.startIndex;
    this.$carousel = this.$el.find('.carousel');
    this.$carouselItem = this.$el.find('.carousel .li');
    this.$pagn = this.$el.find('.md_pagn');
    this.$nav = this.$el.find('.arrow-nav');
    this.$txtArea = this.$carousel.find('.txt');
    this.$visualArea = this.$carousel.find('.visual_img .img_p, .visual_img .img_m');
    this.$control = {
        wrap: this.$el.find('.md_play'),
        playBtn: this.$el.find('.md_btn_play'),
        stopBtn: this.$el.find('.md_btn_stop'),
    };
    this.$searchBox = {
        wrap: this.$el.find('.insight_sch'),
        cate: this.$el.find('.category_wrap'),
        toggleBtn: this.$el.find('.inner_sch_form .toggle_btn'),
    };

    var _this = this;
    var deviceType; // "PC", "TABLET", "MOBILE"
    var resizeTimer;
    var lang = $('html').attr('lang') || 'en';

    var $hd = $('.M00_A');

    _proto.init = function() {
        //console.log("init:: MP_insight_list")

        // Device type check
        deviceType = checkDeviceType();

        // 20240305 featured 페이지 임시 분기
        let path = window.location.pathname;
        console.log(path);
        if ( path.includes('test') ) {
            this.$carousel.addClass('new_featured');
        } else {
            this.$carousel.addClass('old_featured');
        }

        // Set visual img
        this.setVisualImg();
        // Set visual txt break
        this.setTxtBreak();

        if (this.$carouselItem.length < 2) {
            this.$nav.remove();
            this.$pagn.remove();
            return;
        }

        // Set carousel
        setCarousel(this);

        resizeTimer = new Timer(function() {
            var currentDeviceType = checkDeviceType();
            if (deviceType !== currentDeviceType) {
                deviceType = currentDeviceType;
                updateCarouselAria(_this);
            }
        }, 100);

        // Event binding
        if (!this.addEventFlag) {
            this.addEventFlag = true;
            this.addEvent();
        }

        /**20220826 모바일일때 검색 카테고리 컨텐츠 업상태 */
        if (deviceType == 'MOBILE') {
            _this.$searchBox.toggleBtn.addClass('act').attr('aria-expanded', 'false');
            _this.$searchBox.cate.addClass('act');
        }
    };

    // Set visual img
    _proto.setVisualImg = function() {
        this.$visualArea.imgLiquid({
            fill: true,
            horizontalAlign: 'center',
            verticalAlign: 'center',
        });
    };

    _proto.setTxtBreak = function() {
        var $title = this.$txtArea.find('.tit_b');

        $title.lettering('lines');
        $title.find('span').wrapInner('<i></i>');
    };

    _proto.addEvent = function() {
        _this.$carouselItem.on({
            focusin: function(e) {
                switch (deviceType) {
                    case 'PC':
                        //
                        break;
                    case 'TABLET':
                    case 'MOBILE':
                        var isPagnToSlide = $(e.relatedTarget).is(_this.$pagn);

                        if (!isPagnToSlide) {
                            var currentIndex = _this.$carouselItem.index(e.delegateTarget);
                        } else {
                            var currentIndex = 0;
                            _this.$carouselItem.eq(0).find('a, button').first().focus();
                        }

                        _this.$carousel.trigger('slideTo', [currentIndex, 0, true]);
                        break;
                        // default:
                        //     break;
                }
            },
            focusout: function(e) {
                switch (deviceType) {
                    case 'PC':
                        //
                        break;
                    case 'TABLET':
                    case 'MOBILE':
                        var isSameSequence = $(e.delegateTarget).find(e.relatedTarget).length;
                        var isLastSequence = $(e.delegateTarget).is(_this.$carouselItem.last());

                        if (!isSameSequence && isLastSequence) {
                            _this.$pagn.focus();
                        }
                        break;
                        // default:
                        //     break;
                }
            },
        });

        _this.$control.stopBtn.on('click', function(e) {
            e.preventDefault();
            sequenceControl(_this, 'STOP', true);
            return false;
        });

        _this.$control.playBtn.on('click', function(e) {
            e.preventDefault();
            sequenceControl(_this, 'PLAY', true);
            return false;
        });

        _this.$searchBox.toggleBtn.on('click', function() {
            var $this = $(this);
            $this.toggleClass('act');
            _this.$searchBox.cate.slideToggle('fast').toggleClass('act');
            if ($this.hasClass('act')) {
                $this.attr('aria-expanded', 'false');
            } else {
                $this.attr('aria-expanded', 'true');
            }
        });

        // Window resize
        $(window).on('resize', function() {
            resizeTimer.start();
        });

        $(window).on('scroll', function(event) {
            setFixScroll(_this);
        });
    };

    // Device type check
    function checkDeviceType() {
        if (window.innerWidth > 1023) {
            return 'PC';
        } else if (window.innerWidth > 600) {
            return 'TABLET';
        } else {
            return 'MOBILE';
        }
    }

    function setFixScroll(_plugin) {
        var headerHeight = $hd.height() - -1 * parseInt($hd.css('top'));
        var thisTop = parseInt(_plugin.$searchBox.wrap.offset().top);

        if ($(window).scrollTop() >= thisTop - headerHeight) {
            if (!_plugin.$searchBox.wrap.hasClass('fixed')) {
                if ($('.empty_box').length == 0) {
                    _plugin.$searchBox.wrap.before('<div class="empty_box"></div>');
                    $('.empty_box').height(_plugin.$searchBox.wrap.innerHeight());
                }
                _plugin.$searchBox.wrap.addClass('fixed');
            }
            //_plugin.$searchBox.wrap.css('top' , headerHeight);
        } else {
            /*
                  $('.empty_box').remove();
                  _plugin.$searchBox.wrap.removeClass("fixed");
                  _plugin.$searchBox.wrap.css('top' , 0); */
        }

        if ($('.empty_box').length > 0 && $(window).scrollTop() <= $('.empty_box').offset().top - $hd.innerHeight() / 2) {
            $('.empty_box').height(_plugin.$searchBox.wrap.innerHeight());
            $('.empty_box').remove();
            _plugin.$searchBox.wrap.removeClass('fixed');
            //_plugin.$searchBox.wrap.css('top' , 0);
        }
    }

    function setCarousel(_plugin) {
        var $prevBtn = _plugin.$el.find('.arrow-prev');
        var $nextBtn = _plugin.$el.find('.arrow-next');

        _plugin.$carousel.carouFredSel({
            responsive: true,
            height: 'variable',
            auto: {
                play: true,
                timeoutDuration: 5000,
            },
            prev: {
                button: $prevBtn,
            },
            next: {
                button: $nextBtn,
            },
            items: {
                start: _plugin.currentIndex,
                visible: 1,
                height: 'variable',
            },
            pagination: {
                container: _plugin.$pagn,
            },
            swipe: {
                onMouse: true,
                onTouch: true,
            },
            scroll: {
                fx: 'fade',
                duration: 0,
                items: 1,
                onAfter: function(data) {
                    _plugin.currentIndex = _plugin.$carouselItem.index(data.items.visible);

                    _plugin.$carouselItem.removeClass('active').eq(_plugin.currentIndex).addClass('active');

                    // Update
                    updateControl(_plugin);
                    updateCarouselAria(_plugin);

                    if (_plugin.$control.wrap.hasClass('on')) {
                        sequenceControl(_plugin, 'STOP', true);
                    }

                    /* 2023-04 접근성 수정 시작 */
                    _plugin.$carouselItem.attr({ 'aria-hidden': true, tabindex: -1 }).find('a, button').attr({ 'aria-hidden': true, tabindex: -1 });
                    _plugin.$carouselItem.eq(_plugin.currentIndex).removeAttr('aria-hidden tabindex').find('a, button').removeAttr('aria-hidden tabindex');
                    /* // 2023-04 접근성 수정 끝 */
                },
            },
            onCreate: function() {
                _plugin.$carouselItem.removeClass('active').eq(_plugin.currentIndex).addClass('active');

                $prevBtn.wrapInner('<em class="blind">' + langSet[lang]['slide']['prevStr'].toString() + '</em>');
                $nextBtn.wrapInner('<em class="blind">' + langSet[lang]['slide']['nextStr'].toString() + '</em>');

                // Update
                updateCarouselAria(_plugin);

                /* 2023-04 접근성 수정 시작 */
                _plugin.$carouselItem.attr({ 'aria-hidden': true, tabindex: -1 }).find('a, button').attr({ 'aria-hidden': true, tabindex: -1 });
                _plugin.$carouselItem.filter('.active').removeAttr('aria-hidden tabindex').find('a, button').removeAttr('aria-hidden tabindex');
                /* // 2023-04 접근성 수정 끝 */
            },
        });
    }

    function updateCarouselAria(_plugin) {
        switch (deviceType) {
            case 'PC':
                _plugin.$carouselItem.attr('aria-hidden', true).find('a, button').attr('tabindex', -1);
                _plugin.$carouselItem.eq(_plugin.currentIndex).removeAttr('aria-hidden').find('a, button').removeAttr('tabindex');
                _plugin.$pagn.is('[tabindex]') && _plugin.$pagn.removeAttr('tabindex');
                break;
            case 'TABLET':
            case 'MOBILE':
                /* 2023-04 접근성 수정 시작 */
                _plugin.$carouselItem.removeAttr('aria-hidden').find('a, button').removeAttr('tabindex');
                // _plugin.$pagn.not("[tabindex]") && _plugin.$pagn.attr("tabindex", 0);
                /* // 2023-04 접근성 수정 끝 */
                break;
                // default:
                //     break;
        }
    }

    // Update Control
    function updateControl(_plugin) {
        if (!_plugin.$control.wrap.hasClass('on')) {
            sequenceControl(_plugin, 'PLAY', false);
        } else {
            sequenceControl(_plugin, 'STOP', false);
        }
    }

    // Sequence Control: play, stop
    function sequenceControl(_plugin, option, changeFocus) {
        switch (option) {
            case 'PLAY':
                _plugin.$carousel.trigger('isPaused', function() {
                    _plugin.$control.wrap.removeClass('on');
                    _plugin.$carousel.trigger('play', true);
                    _plugin.$carouselItem.find('video').trigger('play');

                    changeFocus && _plugin.$control.stopBtn.focus();
                });
                break;
            case 'STOP':
                _plugin.$carousel.trigger('isScrolling', function() {
                    _plugin.$control.wrap.addClass('on');
                    _plugin.$carousel.trigger('pause', true);
                    _plugin.$carouselItem.find('video').trigger('pause');

                    changeFocus && _plugin.$control.playBtn.focus();
                });
                break;
                // default:
                //     break;
        }
    }

    this.init();
}

fo.addPlugin(MP_insight_list);
