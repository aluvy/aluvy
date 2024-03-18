/* 210510 | 접근성 | 리소스 모바일일때 title 추가 */
    function setResourceTitle(){
        var lang = $("html").attr("lang") || "en";

        // 2024 접근성 수정 시작
        const offering = $('.filterContainer #resource_tab .btn').eq(0);    // 오퍼링
        const content = $('.filterContainer #resource_tab .btn').eq(1);     // 콘텐츠 유형
        
        const title = {
            ko: ["오퍼링 선택하기", "콘텐츠 유형 선택하기"],
            en: ["Choose an offerings", "Choose a content types"],
        };

        // $('.filterContainer #resource_tab .btn').attr("title", langSet[lang].layerPop.layerOpen);
        offering.attr("title", `${title[lang][0]} - ${langSet[lang].layerPop.layerOpen}`);
        content.attr("title", `${title[lang][1]} - ${langSet[lang].layerPop.layerOpen}`);
        // 2024 접근성 수정 끝
    }
