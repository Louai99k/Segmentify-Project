(function(){
    generateList("../product-list.json","root",0)
    const list = document.getElementById("cate-list").children;
    for (let i=0;i<list.length;i++) {
        list.item(i).addEventListener("click",eve => {
            $("li.active").removeClass("active")
            eve.target.className += "active"
            $("div#root").children(".splide__slide").remove()
            generateList("../product-list.json","root",i)
        })
    }
})();