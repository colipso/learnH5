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
  var allCategoriesUrl = "http://davids-restaurant.herokuapp.com/categories.json";
  var categoriesTitleHtml = "snippets/categories-title-snippet.html";
  var categoryHtml = "snippets/categories-snippet.html";
  var menuItemsUrl = "http://davids-restaurant.herokuapp.com/menu_items.json?category=";
  var menuItemsTitleHtml = "snippets/menu-items-title.html";
  var menuItemHtml = "snippets/menu-item.html";
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

  var swithMenuToActive = function (){
    var classes = $("#navHomeButton")[0].className;
    console.log(classes);
    console.log()
    classes = classes.replace(new RegExp("active" , "g"),"");
    $("#navHomeButton")[0].className = classes;

    classes = $("#navMenuButton")[0].className;
    if (classes.indexOf("active")== -1 ) {
      classes += " active";
      $("#navMenuButton")[0].className = classes;
    }
  };

  var insertProperty = function (string , propName , propValue) {
    var propToReplace = "{{" + propName + "}}";
    string = string.replace(new RegExp(propToReplace , "g"), propValue);
    return string;
  };

  var buildAndShowCategoriesHTML = function (categories) {
    $ajaxUtils.sendGetRequest(categoriesTitleHtml , function(categoriesTitleHtml) {
      $ajaxUtils.sendGetRequest(categoryHtml , function(categoryHtml) {
        var categoriesViewHtml = buildCategoriesViewHtml(categories , categoriesTitleHtml , categoryHtml);
        insertHtml("#main-content" , categoriesViewHtml);
      }, false);
    } , false);
  };

  var buildCategoriesViewHtml = function(categories ,categoriesTitleHtml , categoryHtml) {
    var finalHtml = categoriesTitleHtml;
    finalHtml += "<section class='row'>";
    for(var i = 0 ; i < categories.length ; i++) {
      var html = categoryHtml;
      var name = "" + categories[i].name;
      var short_name = categories[i].short_name;
      html = insertProperty(html ,"name" , name);
      html = insertProperty(html , "short_name" , short_name);
      finalHtml += html;
    }
    finalHtml += "</section>";
    return finalHtml;
  };

  document.addEventListener("DOMContentLoaded" , 
    function (event) {
    showLoading("#main-content");

    var returnData = 
      $.ajax({
        url:"http://localhost:8080/getData/?jsoncallback=?",
        dataType: 'jsonp',
        crossDomain: true,
        //jsonp: "jsonpCallback",
        success: function(data) {
          console.log(data);
          //console.log(data.result)
          document.querySelector("#serverData").innerHTML += data;
        },
        error:function(){  
            alert('fail');  
        }
        });
    //console.log(returnData);

    $ajaxUtils.sendGetRequest( homeHtml, function(responseText){
      document.querySelector("#main-content").innerHTML = responseText;
    } ,
    false);
  });

  dc.loadMenuCategories = function() {
    showLoading("#main-content");
    swithMenuToActive();
    $ajaxUtils.sendGetRequest(allCategoriesUrl , buildAndShowCategoriesHTML)
  };

  dc.loadMenuItems = function (categoryShort) {
    showLoading("#main-content");
    var url = menuItemsUrl + categoryShort;
    console.log(url)
    $ajaxUtils.sendGetRequest(url, buildAndShowMenuItemsHTML);
  };

  var buildAndShowMenuItemsHTML = function(categoryMenuItems) {
    console.log(categoryMenuItems);
    swithMenuToActive();
    $ajaxUtils.sendGetRequest(menuItemsTitleHtml , function(menuItemsTitleHtml) {
      $ajaxUtils.sendGetRequest(menuItemHtml , function(menuItemHtml) {
        var menuItemsViewHtml = 
          buildMenuItemsViewHtml(categoryMenuItems , menuItemsTitleHtml , menuItemHtml);
        insertHtml("#main-content" , menuItemsViewHtml);
      }, false);
    } , false);
  };

  var insertItemPrice = function (html , pricePropName , priceValue) {
    if(!priceValue) {
      return insertProperty(html , pricePropName,"");
    }
    priceValue = "$" + priceValue.toFixed(2);
    html = insertProperty(html , pricePropName , priceValue);
    return html;
  };

  var insertItemPortionName = function(html , portionPropName , portionValue){
    if(!portionValue) {
      return insertProperty(html , portionPropName , "");
    }

    portionValue = "(" + portionValue + ")";
    html = insertProperty(html , portionPropName , portionValue);
    return html;
  };

  var buildMenuItemsViewHtml = function(categoryMenuItems,
                                                                            menuItemsTitleHtml,
                                                                            menuItemHtml) {
    // console.log(categoryMenuItems);
    // console.log(categoryMenuItems.category)
    menuItemsTitleHtml = insertProperty(menuItemsTitleHtml,
                                                                "name" ,
                                                                categoryMenuItems.category.name);
    menuItemsTitleHtml = insertProperty(menuItemsTitleHtml,
                                                                "special_instructions",
                                                                categoryMenuItems.category.special_instructions);
    var menuItems = categoryMenuItems.menu_items;
    var catShortName = categoryMenuItems.category.short_name;
    var finalHtml = menuItemsTitleHtml;
    finalHtml += "<section class='row'>";

    for(var i = 0 ; i < menuItems.length ; i++){
      var html = menuItemHtml;
      html = insertProperty(html , "short_name" , menuItems[i].short_name);
      html = insertProperty(html,"catShortName",catShortName);
      html = insertItemPrice(html , "price_small" , menuItems[i].price_small);
      html = insertItemPortionName(html , "small_portion_name", menuItems[i].small_portion_name);
      html = insertItemPrice(html , "price_large" , menuItems[i].price_large);
      html = insertItemPortionName(html , "large_portion_name" , menuItems[i].large_portion_name);
      html = insertProperty(html , "name" , menuItems[i].name);
      html = insertProperty(html , "description" , menuItems[i].description);
      if (i %2 != 0) {
        html += "<div class='clearfix visible-lg-block visible-md-block'></div>";
      }
      finalHtml += html;
    }
    finalHtml += "</section>";
    return finalHtml;
  };



  global.$dc = dc;
})(window);