const numberWithCommas = x => {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    if (parts[1]===null) return x.toFixed(2)
    else return parts.join(",");
}

const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.2
}

const callback = (entries,observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting&&entry.target.className==="lazy-cont") {
            let url = entry.target.firstChild.getAttribute("data-src");
            if (url) {
                entry.target.firstChild.src = url;
                observer.unobserve(entry.target)
            }
        }
    });
}

const observer = new IntersectionObserver(callback,options);

const generateCell = (data) => {
    let html = ""
    html += "<div class='lazy-cont'>"
    html += "<img class='lazy-image' data-src="+data.img+" />"
    html += "</div>"
    html += "<div class='slide-name' > "+data.name+" </div>"
    html += "<div class='slide-price'> "+data.price.substring(1)+"</div>"
    html += "<div class='slide-fee'>"+data.fee+"</div>"
    html += "<button class='slide-btn' >Sepete Ekle</button>"
    return html
}

const getData = url => {
    return new Promise(resolve => {
        $.getJSON(url).then(r => {
            resolve(r.responses[0][0].params);
        })
    })
}

const generateList = async (url,elementID,index) => {
    const res = await getData(url);
    const rr = res.recommendedProducts;
    const ru = res.userCategories;
    for (let key of rr[ru[index]]) {
        const data = {
            img: key.image,
            name: key.name,
            price: new Intl.NumberFormat('tr-TR',{style:"currency",currency:"TRY"}).format(key.price).toString()+" TL",
            fee: key.params.shippingFee==='FREE'?"Ücretsiz Kargo":new Intl.NumberFormat('tr-TR',{style:"currency",currency:"TRY"}).format(key.params.shippingFee).toString()+" TL"
        }
        let cell = document.createElement("div");
        cell.className = "splide__slide slide"
        cell.innerHTML = generateCell(data)
        document.getElementById(elementID).appendChild(cell)
        observer.observe(cell.firstChild);
    }

    let itemsWidth = "70vw"
    let itemWidth = "275px"
    let itemHeight = "70vh"
    if (document.body.scrollWidth<800||window.screen.width<800) {
        itemsWidth="99vw";
        itemWidth = "250px"
        itemHeight = "80vh"
    }
    new Splide(".splide",{
        fixedWidth: itemWidth,
        fixedHeight: itemHeight,
        width: itemsWidth
    }).mount()

    $("ul.splide__pagination").remove()

    for (let key of $(".slide-btn")) {
        key.addEventListener("click",() => {
            $('#popup').css("bottom","10%")
            $('#popup').css("transform","scale(1)")
        })
    }
    document.getElementById("closeMark").addEventListener("click",() => {
        $('#popup').css("bottom","-20%")
        $('#popup').css("transform","scale(0)")
    })
}