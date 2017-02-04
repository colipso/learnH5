$( function( ) {
  $("#navbarToggle").blur( function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  });
} 
  );

(function (global) {
  var dc = {};
  var homeHtml = "snippets/home-snippet.html";
  //var getDataUrl = "http://localhost:8080/getData";

  var insertHtml = function(selector ,html) {
    var targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;
  };

  var showLoading = function(selector){
    var html = "<div class = 'text-center'>";
    html += "<img src = 'images/ajax-loader2.gif'></div>";
    insertHtml(selector , html);
  };

  document.addEventListener("DOMContentLoaded" , function (event) {
    showLoading("#main-content");


    var returnData = 
      $.ajax({
        url:"http://localhost:8080/getData/?jsoncallback=?",
        dataType: 'jsonp',
        crossDomain: true,
        //jsonp: "jsonpCallback",
        success: function(data) {
          console.log(data)
          //console.log(data.result)
          document.querySelector("#serverData").innerHTML += data;
        },
        error:function(){  
            alert('fail');  
        }
        });
    console.log(returnData);

    $ajaxUtils.sendGetRequest( homeHtml, function(responseText) {
      document.querySelector("#main-content").innerHTML = responseText;
    } ,
    false);

  });
  global.$dc = dc;
})(window);