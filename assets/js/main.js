var totalPrice=0 , articleCount=0;
//créé la liste cart qui correspond au contenu du panier
var cart=[];
//on créé une liste de tous les articles de la page,
var articlesList = [];
// quand la page est chargée
$(document).ready(function(){
//    confirm("En accedant à votre site préféré, vous nous autorisez à utiliser vos données personnelles à des fins commerciales.\nNous vous conseillons donc de créer dès maintenant une addresse email de secours.")
    createArticlesList();
    createArticleModal();
    switchCategories();
    updateCartModal();
    validateCart();
});
//cette fonction cree la liste des articles de la page
function createArticlesList(){
    //on parcours tous les éléments de la page qui portent la classe 'article'
    $('.article').each(function(){
        //on créé un nouveau tableau articleInfos qui comportera toutes les infos de l'article en cours
        let articleInfos = [];
        //on recupere tous les elements qui nous interessent
        articleInfos[0]=$(this).attr('id');                         //l'id de l'article
        articleInfos[1]=$(this).find('img').attr('src');            //l'image qui lui est associée
        articleInfos[2]=$(this).find('.articleName').text();        //le nom de l'article
        articleInfos[3]=$(this).find('.articleDescription').text(); //sa description
        articleInfos[4]=$(this).find('.price').text(); //son prix
        articleInfos[5]=$(this).find('.finalPrice').text(); //son prix
        //et on injecte ce tableau dans notre liste d'articles
        articlesList.push(articleInfos);
    });
    var text ="";
    for(i=0;i<articlesList.length;i++){
        text += articlesList[i] + "\n";
    }
};
//cette fontion ajoute un article au panier
function addToCart(){
    //si je clique sur un bouton ajouter au panier
    $('#addToCartButton').click(function(){
        //je check quel article est affiché en ce moment
        article=$('#articleModal').find('h5').attr('id');
        //i = l'index de l'article que l'on ajoute au panier
        i = searchArticleinArray(article);
        //on verifie si un article similaire est deja dans le panier
        cartIndex=cart.indexOf(articlesList[i][0]);
        //si c'est le cas on change juste la quantité
        if ( cartIndex !=-1 ){
            cart[ (cartIndex+1) ]++;
        }else{
            //sinon on ajoute une entrée au tableau
            cart.push(articlesList[i][0]);
            cart.push(1);
        }
        //j'appelle ma fonction qui met a jour la mise en page du panier
        updateCartModal();
    })
};
//cette fonction fait apparaitre une modale lorsque l'on clique sur un article1
function createArticleModal(){
    //lorsque l'on clique sur un article de la classe article
    $('.article').click(function(){
        article=$(this).attr('id');
        //j'appelle la fonction pour savoir quel article a été cliqué
        i = searchArticleinArray(article);
        //je recupere les infos de l'article qui m'interessent
        var modalId=articlesList[i][0];
        var modalImg=articlesList[i][1];
        var modalTitle=articlesList[i][2];
        var modalDescription=articlesList[i][3];
        var modalPrice=articlesList[i][4];
        var modalFinalPrice=articlesList[i][5];
        //je créé la modale de l'article sélectionné
        var modal= $('  <div id="articleModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">\
                            <div class="modal-dialog modal-lg shadow">\
                                <div class="modal-content">'
                                    +'<div class="row m-2">'
                                        +'<div class="col-6">'
                                            +'<img class="img-fluid mb-2" src="' + modalImg +'"></img>'
                                            +'<p class="my-0 py-0">Prix initial: <strike>'+modalPrice+'€</strike><p>'
                                            +'<div class="bgc5">'
                                                +'<p class="my-0">Pour vous seulement :</p>'
                                                +'<p style="font-size:2em;"><b>'+modalFinalPrice+'€</b><p>'
                                            +'</div>'
                                        +'</div>'
                                        +'<div class="col-6">'
                                            +'<h5 id="'+modalId+'" class="font-weight-bold">' + modalTitle + '</h5>'
                                            +'<hr>'
                                            +'<small class="text-left">'+modalDescription+'</small>'
                                        +'</div>'
                                    +'</div>'
                                    +'<div class="row m-2 my-2 justify-content-center">'
                                        +'<button id="addToCartButton" class="btn bgc1 txc4 mx-1 shadow" data-toggle="tooltip" data-placement="top" title="Article ajouté au panier">Ajouter au panier</button>'
                                        +'<button class="btn bgc6 mx-1 shadow" data-dismiss="modal">Continuer mes achats</button>'
                                    +'</div>'
                                    +'<small class="alert alert-success" id="popupAjout"><strong>'+modalTitle+'</strong> a bien été ajouté au panier.</small>'
                                +'</div>\
                            </div>\
                        </div>');
        //j'injecte la modal dans le DOM après l'article
        $('#articleModal').remove();
        $(this).after(modal);
        $('#articleModal').modal('toggle');
        //je cache le popupAjout et je lui colle un addEventListener
        $("#popupAjout").hide();
        $("#addToCartButton").click(function showAlert() {
            $("#popupAjout").show().delay(1000).fadeOut(1000);
        });
        addToCart();
    });
}
//cette fonction permet d'afficher ou de masquer les categories d'articles
function switchCategories(){
    //si je clique sur tout afficher
    $('.showCatAll').click(function(){
        $('.article').show();
    });
    $('.showCat1').click(function(){
        $('.article').hide();
        $('.cat1').show();
    });
    $('.showCat2').click(function(){
        $('.article').hide();
        $('.cat2').show();
    });
    $('.showCat3').click(function(){
        $('.article').hide();
        $('.cat3').show();
    });
}
//cette fonction permet de rétrouver l'index ou se trouve l'argument en parametre
function searchArticleinArray(article){
    //on parcours le tableau des articles pour retrouver l'index
    for (i=0; i<articlesList.length;i++){
        //des que je tombe sur l'id de l'element cliqué (premiere entrée du sous tableau) je quitte la boucle
        if (articlesList[i][0]==article){
            break;
        }
    }
    return i;
};
//cette fonction met a jour le contenu de la page panier
function updateCartModal(){
    //on vide l'affichage du contenu du panier et du resume de la commande
    $('#articlesPanier').empty();
    $('#resumeCommande').empty();
    // si le panier est vide on affiche que le panier est vide
    if ( cart.length<1 ){
        var content='<p class="text-center"><br>Votre panier est vide<br><br><br></p>';
        $('#articlesPanier').append(content);
    }else{
        totalPrice=0;
        articleCount=0;
        var content='';
        for (var art=0;art<cart.length;art+=2){
            console.log(art);
            //je recupere l'id de l'article en cours et je retrouve sa place dans le tableau des articles
            tmpArt=searchArticleinArray(cart[art]);
            let tmpName=articlesList[tmpArt][2];  //je recupere le nom de l'article
            let tmpPrice=articlesList[tmpArt][4];  //je recupere le prix de l'article
            let tmpFinalPrice=articlesList[tmpArt][5];  //je recupere le prix final
            let tmpQuantity=cart[art+1];  //je recupere le nombre d'articles
            totalPrice+=tmpFinalPrice*tmpQuantity;
            articleCount+=tmpQuantity;
            content +=  '<p class="font-weight-bold">'+tmpName+'</p>'
                        +'<p class="text-right">'
                            +'<button class="minusButton '+(art+1)+' btn bgc5 txc4">-</button>'
                            +'<button class="plusButton '+(art+1)+' btn bgc1 txc4">+</button>'
                            +'Quantité: <b>'+tmpQuantity+'</b>'
                        +'</p>'
                        +'<p class="text-right">Prix total: <strike>'+(tmpPrice*tmpQuantity).toFixed(2)+'</strike> <b>'+(tmpFinalPrice*tmpQuantity).toFixed(2)+'€</b></p>'
                        +'<small class="d-block text-right text-muted font-italic">Vous économisez '+((tmpPrice*tmpQuantity)-(tmpFinalPrice*tmpQuantity)).toFixed(2)+'€</small>'
        }
        $('#articlesPanier').append(content);
        //on s'occupe maintenant de remplir la partie resume de la commande
        content='<p>Nombre d\'articles dans votre panier:</p>'
                +'<p class="font-weight-bold text-right">'+articleCount+'</p>'
                +'<p>Prix total de votre panier:</p>'
                +'<p id="totalPrice" class="text-right font-weight-bold">'+totalPrice.toFixed(2)+'€</p>'
                +'<p class="text-muted text-right"><small>Frais de port négociables:<br>Contactez JP et Amadou pour plus d\'infos...</small></p>'
        $('#resumeCommande').append(content);
    }
    changeQuantities();
    //je supprime les icones bulles des paniers
    $('.cartbubble').remove();
    //pour chaque icone de panier j'ajoute une info bulle indiquant le nombre d'articles
    $('.iconePanier').each(function(){
        if ( cart.length >0){
            tmpBubble='<small class="cartbubble">'+articleCount+'</small>';
            $(this).after(tmpBubble);
        }
    });
}
//cette fonction permet de changer les quantités dans le panier
function changeQuantities(){
    //quand je clique sur le bouton MOINS
    $('.minusButton').click(function(){
        //je recupere la deuxième classe du bouton (c'est l'id de l'article)
        let art=$(this).attr('class').split(" ")[1];
        if ( cart[art] <2 ){
            if (confirm("Vous êtes sur le point de supprimer cet article de votre panier.\nVous pourriez le regretter.")){
                cart.splice(art-1,2);
            }
        }else{
            cart[art]--;
        }
        updateCartModal();
    });
    //quand je clique sur le bouton MOINS
    $('.plusButton').click(function(){
        //je recupere la deuxième classe du bouton (c'est l'id de l'article)
        let art=$(this).attr('class').split(" ")[1];
        cart[art]++;
        updateCartModal();
    });
}
function validateCart(){
    //si j'appuie sur le bouton valider panier
    $('#validateCart').click(function(){
        //si mon panier est vide
        if (articleCount<1){
            alert("Votre panier est vide.\nNous savons que vous avez essayé juste pour voir si ce cas de figure était prévu.\nPetit malin.");
        }else{
            alert("Félicitation, vous avez encore dépensé pour "+totalPrice+"€.\nGrace à votre soutien, "+ (totalPrice/10).toFixed() + " bébés chats seront sacrifiés et " + (totalPrice/20).toFixed() + " ours polaires seront sauvés.");
        }
    });
}
