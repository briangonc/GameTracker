const jogosLista = document.getElementById("jogos-lista");

let ofertasold = [
  {
    title: "RAGE 2",
    salePrice: "0,00",
    normalPrice: "199,00",
    thumb: "assets/imgs/548570.jpg",
  },
  {
    title: "Batman™: Arkham Knight",
    salePrice: "12,49",
    normalPrice: "49,99",
    thumb: "assets/imgs/208650.jpg",
  },
  {
    title: "The Sims™ 4",
    salePrice: "39,75",
    normalPrice: "159,00",
    thumb: "assets/imgs/1222670.jpg",
  },
  {
    title: "Street Fighter V",
    salePrice: "15,99",
    normalPrice: "39,99",
    thumb: "assets/imgs/310950.jpg",
  },
  {
    title: "Divinity: Original Sin 2 - Definitive Edition",
    salePrice: "36,39",
    normalPrice: "90,99",
    thumb: "assets/imgs/435150.jpg",
  },
  {
    title: "Planet Zoo",
    salePrice: "50,00",
    normalPrice: "100,00",
    thumb: "assets/imgs/703080.jpg",
  },
  {
    title: "Battlefield V",
    salePrice: "119,60",
    normalPrice: "299,00",
    thumb: "assets/imgs/1238810.jpg",
  },

  {
    title: "Arma 3",
    salePrice: "17,49",
    normalPrice: "69,99",
    thumb: "assets/imgs/107410.jpg",
  },
  {
    title: "Zombie Army 4: Dead War",
    salePrice: "84,59",
    normalPrice: "93,99",
    thumb: "assets/imgs/694280.jpg",
  },
  {
    title: "Sniper Ghost Warrior Contracts",
    salePrice: "34,99",
    normalPrice: "69,99",
    thumb: "assets/imgs/973580.jpg",
  },
  {
    title: "Jurassic World Evolution",
    salePrice: "19,99",
    normalPrice: "79,99",
    thumb: "assets/imgs/648350.jpg",
  },
  {
    title: "RollerCoaster Tycoon® 3: Complete Edition",
    salePrice: "22,79",
    normalPrice: "37,99",
    thumb: "assets/imgs/1368820.jpg",
  },
];
let ofertas = [];
window.onload = async () => {
  await getListFromAPI();

  //addDiscount();
  orderGamesBy();
};

const getListFromAPI = async () => {
  const response = await fetch(
    "https://www.cheapshark.com/api/1.0/deals?pageNumber=0&pageSize=12&storeID=1&onSale=1&AAA=1"
  );
  let data = await response.json();

  ofertas = await Promise.all(
    data.map(async (oferta) => {
      let newThumb = await fetch(
        "https://cdn.akamai.steamstatic.com/steam/apps/" +
          oferta.steamAppID +
          "/header.jpg"
      ).catch((e)=>{console.log("não foi possível encontrar a imagem do jogo" + oferta.title)});
      if(newThumb && newThumb.url){
        oferta.thumb = newThumb.url;
      }
      return oferta;
    })
  );
};

const addDiscount = () => {
  ofertas = ofertas.map((oferta) => {
    let discount =
      1 - parseInt(oferta.salePrice) / parseInt(oferta.normalPrice);
    let percentage = -100 * discount.toFixed(2);
    oferta.discount = percentage;
    return oferta;
  });
};

const insertGamesOnPage = (ofertas) => {
  jogosLista.innerHTML = "";

  ofertas.map((oferta) => {
    jogosLista.innerHTML += `
      <article class="oferta">
        <figure>
          <img class="game-image" src="${oferta.thumb}" alt="${oferta.title}">
        </figure>
        <section>
          <h2 class="text title">
            ${oferta.title}
          </h2>
        </section>
      
        <section class="game-info">
          <div>
            <button class="details">
              <h3 class="text-bold ">
                DETALHES
              </h3>
            </button>
          </div>
          <div class="game-value">
            <div class="game-price">
              <small class="preco-normal">$ ${oferta.normalPrice}</small>
              <h5 class="preco-oferta text-bold">$ ${oferta.salePrice}</h5>
            </div>
            <div class="game-discount">
              <h3 class="text-bold">
                ${
                  oferta.savings == 100
                    ? "GRÁTIS"
                    : -parseInt(oferta.savings).toFixed(0) + "%"
                }
              </h3>
            </div>
          </div>
        </section> 
      </article>
      `;
  });
};

const orderList = (criteria, order) => {
  if (criteria == "salePrice") {
    return (a, b) => {
      let result = 0;
      if (parseInt(a.salePrice) < parseInt(b.salePrice)) result = -1;
      if (parseInt(a.salePrice) > parseInt(b.salePrice)) result = 1;
      if (order == "decrescent") result = -result;
      return result;
    };
  } else {
    return (a, b) => {
      if (a[criteria] < b[criteria]) return -1;
      if (a[criteria] > b[criteria]) return 1;
      return 0;
    };
  }
};

const orderGamesBy = () => {
  let criteria = document.getElementById("orderBy").value;
  let order = "crescent";

  if (criteria == "price-decrescent") {
    criteria = "salePrice";
    order = "decrescent";
  } else if (criteria == "price-crescent") {
    criteria = "salePrice";
  }
  if (filteredOfertas.length > 0) {
    filteredOfertas.sort(orderList(criteria, order));
    insertGamesOnPage(filteredOfertas);
  } else {
    ofertas.sort(orderList(criteria, order));
    insertGamesOnPage(ofertas);
  }
};
let filteredOfertas = [];
const search = () => {
  let entry = document.getElementById("search").value;
  filteredOfertas = ofertas.filter((oferta) =>
    oferta.title.toLowerCase().includes(entry)
  );
  insertGamesOnPage(filteredOfertas);
};