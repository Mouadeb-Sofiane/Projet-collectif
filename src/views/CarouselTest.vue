<script>
export default {
  mounted() {
    let items = document.querySelectorAll('.slider .list .item');
    let next = document.getElementById('next');
    let prev = document.getElementById('prev');
    let thumbnails = document.querySelectorAll('.thumbnail .item');

    let countItem = items.length;
    let itemActive = 0;

    next.onclick = function () {
        itemActive = itemActive + 1;
        if (itemActive >= countItem) {
            itemActive = 0;
        }
        showSlider();
    };

    prev.onclick = function () {
        itemActive = itemActive - 1;
        if (itemActive < 0) {
            itemActive = countItem - 1;
        }
        showSlider();
    };

    let refreshIntervalId = setInterval(() => {
        next.click();
    }, 5000);

    function showSlider() {
        let itemActiveOld = document.querySelector('.slider .list .item.active');
        let thumbnailActiveOld = document.querySelector('.thumbnail .item.active');
        itemActiveOld.classList.remove('active');
        thumbnailActiveOld.classList.remove('active');

        items[itemActive].classList.add('active');
        thumbnails[itemActive].classList.add('active');
    }

    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
            itemActive = index;
            showSlider();
        });
    });
  }
}

</script>

<template>
    <div class="slider">
        <div class="list">
            <div class="item active">
                <img src="../img/algeria-nature-wallpaper-preview.jpg" alt="image1" />
                <div class="content">
                    <p>Design</p>
                    <h2>Slider 01</h2>
                    <p>
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus, incidunt? 
                        Sint qui perferendis rerum fugit quaerat velit nisi? Doloremque dolorem 
                        blanditiis perferendis libero sapiente dignissimos praesentium vel fugiat ipsam aperiam?
                    </p>
                    <div class="button-container">
                        <button class="lecture">Lecture</button>
                        <button class="plus-infos">Plus d'infos</button>
                    </div>

                </div>
            </div>
            <div class="item">
                <img src="../img/desert-sahara-algeria-dune-wallpaper-preview.jpg" alt="image2" />
                <div class="content">
                    <p>Design</p>
                    <h2>Slider 02</h2>
                    <p>
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus, incidunt? 
                        Sint qui perferendis rerum fugit quaerat velit nisi? Doloremque dolorem 
                        blanditiis perferendis libero sapiente dignissimos praesentium vel fugiat ipsam aperiam?
                    </p>
                </div>
            </div>
            <div class="item">
                <img src="../img/snow-winter-nature-landscape-wallpaper-thumb.jpg" alt="image3" />
                <div class="content">
                    <p>Design</p>
                    <h2>Slider 03</h2>
                    <p>
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus, incidunt? 
                        Sint qui perferendis rerum fugit quaerat velit nisi? Doloremque dolorem 
                        blanditiis perferendis libero sapiente dignissimos praesentium vel fugiat ipsam aperiam?
                    </p>
                </div>
            </div>
            <div class="item">
                <img src="../img/5bbf9d82f5d81552db34bc8f92cf3da1.jpeg" alt="image4" />
                <div class="content">
                    <p>Design</p>
                    <h2>Slider 04</h2>
                    <p>
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus, incidunt? 
                        Sint qui perferendis rerum fugit quaerat velit nisi? Doloremque dolorem 
                        blanditiis perferendis libero sapiente dignissimos praesentium vel fugiat ipsam aperiam?
                    </p>
                </div>
            </div>
            <div class="item">
                <img src="../img/4k-oaax18kaapkokaro.jpg" alt="image5" />
                <div class="content">
                    <p>Design</p>
                    <h2>Slider 05</h2>
                    <p>
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus, incidunt? 
                        Sint qui perferendis rerum fugit quaerat velit nisi? Doloremque dolorem 
                        blanditiis perferendis libero sapiente dignissimos praesentium vel fugiat ipsam aperiam?
                    </p>
                </div>
            </div>
        </div>
        <div class="arrows">
            <button id="prev"><</button>
            <button id="next">></button>
        </div>
        <div class="thumbnail">
            <div class="item active">
                <img src="../img/algeria-nature-wallpaper-preview.jpg" alt="image3" />
                <div class="content">
                    Nom du slider
                </div>
            </div>
            <div class="item">
                <img src="../img/desert-sahara-algeria-dune-wallpaper-preview.jpg" alt="image2" />
                <div class="content">
                    Nom du slider
                </div>
            </div>
            <div class="item">
                <img src="../img/snow-winter-nature-landscape-wallpaper-thumb.jpg" alt="image3" />
                <div class="content">
                    Nom du slider
                </div>
            </div>
            <div class="item">
                <img src="../img/5bbf9d82f5d81552db34bc8f92cf3da1.jpeg" alt="image4" />
                <div class="content">
                    Nom du slider
                </div>
            </div>
            <div class="item">
                <img src="../img/4k-oaax18kaapkokaro.jpg" alt="image5" />
                <div class="content">
                    Nom du slider
                </div>
            </div>
        </div>
    </div>
</template>
<style>
.content {
    color: #fff;
}
.slider {
    height: 100vh;
    position: relative;
}
.slider .list .item{
    position: absolute;
    inset: 0 0 0 0;
    overflow: hidden;
    opacity: 0;
    transition: 0.5s;
}
.slider .list .item img{
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.slider .list .item::after {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    background-image: linear-gradient(
        to top, #000 40%, transparent 100%
    );
}
.slider .list .item .content {
    position: absolute;
    left: 10%;
    top: 5%;
    width: 500px;
    max-width: 80%;
    z-index: 1;
}
.slider .list .item .content p:nth-child(1) {
    text-transform: uppercase;
    letter-spacing: 10px;
}
.slider .list .item .content h2 {
    font-size: 100px;
    margin: 0;
}
.slider .list .item.active {
    opacity: 1;
    z-index: 10;
}
@keyframes ShowContent {
    to {
        transform: translateY(0);
        filter: blur(0);
        opacity: 1;
    }
    
}
.slider .list .item.active p:nth-child(1),
.slider .list .item.active h2,
.slider .list .item.active p:nth-child(3),
.slider .list .item.active button {
    transform: translateY(30px);
    filter: blur(20px);
    opacity: 0;
    animation: ShowContent .5s .7s ease-in-out 1 forwards;
}
.slider .list .item.active h2 {
    animation-delay: 1s;
}
.slider .list .item.active p:nth-child(3) {
    animation-delay: 1.3s;
}
.slider .list .item.active button {
    animation-delay: 1.5s;
}
.arrows {
    position: absolute;
    top: 30%;
    right: 50px;
    z-index: 100;
}
.arrows button {
    background-color: #eee5;
    border: none;
    font-family: monospace;
    width: 40px;
    height: 40px;
    border-radius: 5px;
    font-size: x-large;
    color: #eee;
    transition: .5s;
    }
.arrows button:hover {
    background-color: #000;
    color: #eee;
}
.thumbnail {
    position: absolute;
    bottom: 50px;
    z-index: 11;
    display: flex;
    gap: 10px;
    width: 100%;
    height: 250px;
    padding: 0 50px;
    box-sizing: border-box;
    overflow: auto;
    justify-content: center;
}
.thumbnail::-webkit-scrollbar {
    width: 0;
}
.thumbnail .item {
    width: 150px;
    height: 220px;
    filter: brightness(.5);
    flex-shrink: 0;
}
.thumbnail .item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
}
.thumbnail .item.active {
    filter: brightness(1.5);
}
.thumbnail .item .content {
    position: absolute;
    inset: auto 10px 10px 10px;
}
@media screen and (max-width: 768px) {
    .thumbnail {
        justify-content: start;
    }
    .slider .list .item .content h2 {
        font-size: 60px;
    }
    .arrows {
        top: 10%;
    }
}
.button-container {
    display: flex; /* Utilisation de flexbox pour aligner les boutons */
    gap: 10px; /* Espacement entre les boutons */
}
.lecture {
    background-color: #FFFFFF; /* Couleur de fond */
    color: #E57700; /* Couleur du texte */
    border: none; /* Pas de bordure */
    border-radius: 5px; /* Coins arrondis */
    padding: 10px 20px; /* Espacement intérieur */
    font-size: 16px; /* Taille de la police */
    cursor: pointer; /* Curseur de pointeur */
    transition: background-color 0.3s ease, transform 0.2s ease; /* Animation lors du survol */
}
.lecture:hover {
    background-color: #d1d1d1; /* Couleur de fond au survol */
    transform: translateY(-2px); /* Léger déplacement vers le haut */
}

.lecture:active {
    transform: translateY(0); /* Rétablissement lors du clic */
}
.plus-infos {
    background-color: #2A2A2A; /* Couleur de fond du deuxième bouton */
    color: white; /* Couleur du texte */
    border: 1px solid white; /* Bordure blanche */
    padding: 10px 20px; /* Espacement intérieur */
    font-size: 16px; /* Taille de la police */
    cursor: pointer; /* Curseur de pointeur */
    transition: background-color 0.3s ease, transform 0.2s ease; /* Animation lors du survol */
}

.plus-infos:hover {
    background-color: #454545; /* Couleur de fond au survol */
    transform: translateY(-2px); /* Léger déplacement vers le haut */
}

.plus-infos:active {
    transform: translateY(0); /* Rétablissement lors du clic */
}
</style>
