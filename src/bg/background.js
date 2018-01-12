// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


//example of using a message handler from the inject scripts
// chrome.extension.onMessage.addListener(
//   function(request, sender, sendResponse) {
//   	chrome.pageAction.show(sender.tab.id);
//     sendResponse();
//   });

(function(angular) {
  'use strict';
  
  angular.module('cvSearchApp', []).controller('repeatController', function($scope, $sce) {
    let CORS_Proxy = "https://cors.now.sh/";

    // CV.LT Jobs
    $scope.cvLTjobs = [];
    $.get(CORS_Proxy + 'https://www.cv.lt/nuolatinis-darbas?department=1040&city=1020&ipp=1000', function (data) {
        let jobs = $(data).find('tr.data');
        $.each(jobs, function() {
          $(this).find(".Bookmark").parent().remove();
          $scope.$apply(function() {
               $scope.cvLTjobs.push({html: $sce.trustAsHtml($(this).html())});
          }.bind(this));        
        });
    });

    //CVBankas.LT Jobs
    $scope.cvBankasLTjobs = [];
    $.get(CORS_Proxy + 'https://www.cvbankas.lt/?miestas=Kaunas&padalinys%5B%5D=76', function(data) {
        let getPages = $(data).find('.pages_ul_inner').children().length;
        for (let i = 1; i <= getPages; i++) {
          $.get(CORS_Proxy + 'https://www.cvbankas.lt/?miestas=Kaunas&padalinys%5B0%5D=76&page=' + i, function(data) {
              let jobs = $(data).find('.list_a_has_logo');
               $.each(jobs, function() {
                $scope.$apply(function() {
                     let data = $(this);
                     let logo = data.find('.list_logo_c');
                     let pareigos = data.find('.list_a_wrapper > .list_cell > .list_h3');
                     let imone_galiojimas = data.find('.list_ads_c_last');
                     let miestas = data.find('.list_city');

                     $scope.cvBankasLTjobs.push({logo: $sce.trustAsHtml(logo.html()), pareigos: $sce.trustAsHtml(pareigos.html()), miestas: $sce.trustAsHtml(miestas.html()), imone_galiojimas: $sce.trustAsHtml(imone_galiojimas.html())});
                }.bind(this));        
              });    
          }); 
        }
    });

    //CVOnline.LT Jobs
    $scope.cvOnlineLTjobs = [];
    $.get(CORS_Proxy + 'https://www.cvonline.lt/darbo-skelbimai/informacines-technologijos/kauno', function(data) {
        let getPages = $(data).find('#page-pagination > ul > li:not(.page_next):not(.mobile_pagi):not(.page_prev)').length;
        for (let i = 0; i < getPages; i++) {
          $.get(CORS_Proxy + 'https://www.cvonline.lt/darbo-skelbimai/informacines-technologijos/kauno?page=' + i, function(data) {
              let jobs = $(data).find('.cvo_module_offers_wrap').children();
               $.each(jobs, function() {
                $scope.$apply(function() {
                     let data = $(this);
                     let pareigos = data.find('.offer_primary_info > h2');
                     let miestas = data.find('[itemprop="jobLocation"]');
                     let imone = data.find('[itemprop="hiringOrganization"]');
                     let galiojimas = data.find('[itemprop="datePosted"]');                    
                     $scope.cvOnlineLTjobs.push({
                       pareigos: $sce.trustAsHtml(pareigos.html()),
                       miestas: $sce.trustAsHtml(miestas.html()),
                       imone: $sce.trustAsHtml(imone.html()),
                       galiojimas: $sce.trustAsHtml(galiojimas.html())
                     });
                }.bind(this));        
              });    
          }); 
        }
    });

    //CVMarket.LT Jobs
    $scope.cvMarketLTjobs = [];

    //GeraPraktika.LT practices
    $scope.geraPraktikaLTpractice = [];

  });
})(window.angular);