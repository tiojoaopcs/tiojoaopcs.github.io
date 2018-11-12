let dinheiroSpan = $('#dinheiro');
let botaoPc = $('#pc');
let divPc = $('#div-pc');
let valorDoClique,valorDoSeg;
let dinheiro,dinAnterior;
let upgrades = $('.abaDeProdutos :not([data-diferente])>li'); /* "Diferente" é um atributo que pode ser incluído nos elementos UL
para indicar que as opções de compra dentro dele não vão ter o comportamento padrão. As peças e os programadores têm esse
comportamento, enquanto os upgardes não, pois eles têm peculiaridades como poderem ser comprados apenas uma vez, não
proporcionarem lucro diretamente, etc. */
let comPopop=$("[data-indicepopup]"); /* "Indicepopup" é um atributo que indica qual é o popup que está vinculado àquele upgrade.
É um número que é 0 para o primeiro popup, 1 para o segundo e assim por diante, baseado an ordem em que os divs dos popups
(com a classe fundoPop) aparecem no HTML. Esses popups serão exibidos assim que, após uma compra, a propriedade "comprados" do
elemento for maior ou igual ao valor do seu atributo "qtdpopup". Voltando a essa linha de código, seu objetivo é colocar em uma
variável todos os produtos que tenham um popup vinculado a ele (até então, só as memórias rã e o programador de Portugol). */
let qtdCompra=1; /* Quantos produtos estão sendo comprados por clique. Seu valor pode ser alterado pelo usuário através do input
de id "qtosComprar". */
let dinGasto,tempo,clicksDados; /* Variáveis que guardam o tempo de jogo e todo o dinheiro gasto. */
let clicksPS;
let nAtivouCronometro=true;


// Pegar custo inicial

for(let i=0; i<upgrades.length; i++){
  upgrades[i].custoInicial=+upgrades[i].dataset.custo;
  upgrades[i].lucroInicial=+upgrades[i].dataset.add;
}


// Contagem de tempo

function criaNumerinho(cor,elPai,num){
  let x=document.createElement("span");
  x.classList.add("numPt");
  x.style.color=cor;
  elPai.appendChild(x);
  x.innerHTML="+"+num.formata(2);
  return x;
}

function posicionaNumerinho(x,left,top){
  x.style.top=top+"px";
  x.style.left=left+"px";
  x.style.opacity="0";

  setTimeout(function(){
    x.remove();
  },1000);
}

let pararJogo;

function setaTempo(){ /* Retoma contagem de tempo e lucro por segundo. */
  pararJogo=setInterval(function () {
    tempo++;

    if(tempo%100==0 && valorDoSeg){
      mudaDin(valorDoSeg);
      let x=criaNumerinho("#00dfdf",divPc[0],valorDoSeg);
      posicionaNumerinho(x,(botaoPc[0].offsetWidth-x.offsetWidth)/2,(botaoPc[0].offsetHeight-x.offsetHeight)/2);
    }
  },10);
}

function pausa(){
  clearInterval(pararJogo);
}

setaTempo();


// Menu!

let lisMenu=document.querySelectorAll("#menu>li");
let divsCentral=document.querySelectorAll(".abaDeProdutos");
const width=100/lisMenu.length+"%";
for(let i=0; i<lisMenu.length; i++) lisMenu[i].style.width=width; /* Ajusta a largura das abas do menu para que fiquem iguais. */

for(let i=0; i<lisMenu.length; i++) /* Troca entre as abas (upgrades, peças, programadores). Se você for adicionar uma nova aba,
(teoricamente) você não vai precisar mexer em nada aqui, só ir no HTML e acrescentar dentro do <div id="central"> um elemento
<section> com determinado ID, e em seguida acrescentar na <ul id="menu"> um elemento <li> com o atributo "data-mostra" igual ao id
que você inventou. */
  lisMenu[i].addEventListener("click",function(e){
    const id=e.currentTarget.dataset.mostra;

    for(let i=0; i<lisMenu.length; i++){
      if(lisMenu[i]==e.currentTarget) lisMenu[i].classList.add("atual");
      else lisMenu[i].classList.remove("atual");
    }

    for(let i=0; i<divsCentral.length; i++){
      if(divsCentral[i].id==id) divsCentral[i].classList.add("visivel");
      else divsCentral[i].classList.remove("visivel");
    }

    if(id=="progs"){
      alfaceCrespa(); // TOP SECRET NÃO MEXE NISSO
      addEventListener("resize",alfaceCrespa);
    }
    else removeEventListener("resize",alfaceCrespa);
  });


// Funções conquistas

function fecharOnclick(x){
  x.style.opacity="0";
  //removeEventListener("click",fecharOnclick);
  setTimeout(function(){
    x.remove();
  },100);
}

function achievementUnlock(conq){
  if(conq.tem) return;
  conq.tem=true;
  conq.el.classList.add("desbloqueada");

  conqsObtidas++;
  conqSpans[0].innerHTML=conqsObtidas;

  let x=document.createElement("div");
  x.className="ach pendingFade";
  x.innerHTML="<section class='ultimoMargem0 sans'>\
  <button class='fechar' onclick='fecharOnclick(this.parentNode.parentNode)'>×</button>\
  <h3 style='margin-right:28px'>"+conq.nom+"</h3>\
  <p>"+conq.dsc+"</p></section>";
  document.body.appendChild(x);

  function eventoX(){
    x.classList.remove("pendingFade");
    x.removeEventListener("mousemove",eventoX);
  }

  x.addEventListener("mousemove",eventoX);

  setTimeout(function(){
    if(x.classList.contains("pendingFade")){
      //removeEventListener("click",fecharOnclick);
      x.remove();
    }
  },4000);
}


// Variáveis conquistas

let conqs=[
  // Não ocultas
  [
    {
      nom:"Nova Era da Informática",
      dsc:"Compre um programador de Portugol."
    },
    {
      nom:"Compensa a longo prazo...",
      dsc:"Faça uma compra que não dará lucro pelos próximos 10 minutos ou 1.200 clicks."
    },
    {
      nom:"Config do Venaum",
      dsc:"Compre 10.000 rãs, 2.000 GTX-1080 e 30 I7 dual-core."
    },
    {
      nom:"Aqui tem coraje",
      dsc:"Compre uma aleatoriedade."
    },
    {
      nom:"Frota do hasão",
      dsc:"Compre 1.000 programadores de JavaScript."
    },
    {
      nom:"Efeito samuel",
      dsc:"Tenha um total de 5.000 programadores antes de comprar o seu primeiro de JavaScript."
    },
    {
      nom:"Dedicação é tudo!",
      dsc:"Clique um total de 100.000 vezes."
    },
    {
      nom:"You burro man?",
      dsc:"Clique 100 vezes antes de comprar qualquer coisa."
    },
    {
      nom:"Foco no que importa",
      dsc:"Compre um programador de portugol antes de qualquer outro programador."
    },
    {
      nom:"Subversão da lógica",
      dsc:"Tenha mais programadores de Portugol do que cliques dados."
    },
    {
      nom:"Maluco é brabo",
      dsc:"Compre 1.000 itens com apenas 1 clique."
    },
    {
      nom:"De volta as origens",
      dsc:"Compre uma memória	rã já tendo 5.000 I7 dual-core."
    },
  ],

  // Ocultas
  [
    {
      nom:"Ráquer do anônimous",
      dsc:"Parabéns, agora vai raquear um banco e ganhar dinheiro infinito na vida real!"
    },
    {
      nom:"Não foi Macro, né?",
      dsc:"Clique 40 vezes em 5 segundos."
    },
    {
      nom:"Desativa vagabundo '-'",
      dsc:"Clique 100 vezes em 10 segundos"
    },
    {
      nom:"Preguiçoso...",
      dsc:"Fique 5 minutos sem clicar"
    },
  ]
];

let conqsObtidas=0;


// Popups genéricos

function fecharAoClicarFora(e) {
  if(e.target==this){
    fecha(this);
  }
}

function abre(el){ /* Abre um popup. O parâmetro "el" deve ser o elemento HTML desse popup (um <div> com a classe "fundoPop"). */
  el.classList.remove("pseudoOculto");
  el.addEventListener("click",fecharAoClicarFora);
  pausa();
}

function fecha(el){
  el.classList.add("pseudoOculto");
  el.removeEventListener("click",fecharAoClicarFora);
  setaTempo();
}

let pops=document.querySelectorAll(".fundoPop"); /* Faz com que botões de fechar
fechem seus popups. Para incluir essa função em um botão, basta colocar a classe "jsfechar" nele. O botão deve estar dentro de um
<div> de classe "fundoPop" (o div com o fundo perto semitransparente). */
for(let i=0; i<pops.length; i++){
  let btnsFechar=pops[i].querySelectorAll(".jsfechar"); // Isso funciona !!!!!!1
  for(let j=0; j<btnsFechar.length; j++){
    btnsFechar[j].addEventListener("click",function () {
      fecha(pops[i]);
    });
  }
}


// Popups!

let divPop=document.querySelector("#unlockPopup");
let txtPop=document.querySelectorAll("#unlockPopup section");

function unlock(li){
  for(let i=0; i<lisMenu.length; i++){
    if(lisMenu[i].dataset.mostra==li) lisMenu[i].classList.remove("oculto");
  }
}
function abrePopop(ind){
  let li;
  for(let i=0; i<txtPop.length; i++){
    if(i!=ind) txtPop[i].classList.add("oculto");
    else {
      txtPop[i].classList.remove("oculto");
      li=txtPop[i].dataset.mostra;
    }
  }

  unlock(li);
  abre(divPop);
}


// Adiciona estatísticas de compra nas li's!

for(let i=0; i<upgrades.length; i++){ /* Adiciona nas <li>'s que seguem o comportamento padrão uma indicação de seu preço, lucro
gerado e quantidade de compras. */
  upgrades[i].innerHTML+="<div class='descLi'><dl><div><dt>Comprados</dt><dd class='comprados'></div></dd><div><dt>Custo</dt><dd class='custoUpgrade'></dd></div><div><dt>Lucro</dt><dd class='lucro'></dd></div></dl></div>";
}
const custos = $('.custoUpgrade'),
  lucros=$('.lucro'),
  comprados=$(".comprados");
for(let i=0; i<upgrades.length; i++) {
  upgrades[i].ddCusto=custos[i]; // Elemento HTML que contém o custo de cada produto.
  upgrades[i].ddLucro=lucros[i]; // Elemento HTML que contém o lucro de cada produto.
  upgrades[i].ddCompr=comprados[i];  // Elemento HTML que contém o número de compras já feitas de cada produto.
}

Number.prototype.formata=function(cd=-1){ /* Sendo x um real e y um inteiro, x.formata(y) retorna uma string cujo conteúdo é o
  número x com y casas decimais e seus milhares separados por vírgulas. fitz"berg" ce é foda*/
  let ret="",str;
  if(cd!=-1){
    str=this.toFixed(cd);
    let posPonto=str.indexOf(".");
    let i;
    for(i=0; i<posPonto-2; i++){
      ret+=str[i];
      if((posPonto-i)%3==1) ret+=",";
    }
    for(; i<posPonto+3; i++){
      ret+=str[i];
    }
    return ret;
  }

  // Se for inteiro

  str=String(this);
  for(i=0; i<str.length; i++){
    ret+=str[i];
    if((posPonto-i)%3==1) ret+=",";
  }
  return ret;
}

function mudaDin(x){ /* Atualiza o <span> com o dinheiro do jogador. Chamada sempre que o dinheiro muda. */
  // 4/10/2018 nova funcionalidade: também testa se o cara é um hacker
  if(dinheiro>dinAnterior) achievementUnlock(conqs[1][0]);
  dinheiro+=x;
  dinheiroSpan.html(dinheiro.formata(2));
  dinAnterior=dinheiro;
}

function comprar(obj){ /* Verifica se custo do elemento obj é menor ou igual ao dinheiro e, se sim, retorna true e o preço é pago. */
  let float= +obj.dataset.custo;
  let ret=dinheiro >= float;
  if(ret){
    dinGasto+=float;
    mudaDin(-float);
  }
  return ret;
}


function Pagar(e){ /* Função evocada na compra de peças ou programadores (os que seguem o "comportamento padrão"). Faz os devidos
ajustes no preço, valorDoSeg ou valorDoClique, número de objetos comprados... */
  let sht=e.currentTarget;
  if(comprar(sht)){
    sht.custoSemArr+=sht.inflacao*qtdCompra;
    Add(sht);
    refresh(sht);
  }
}

function Add(obj){
  let aumentoDoLucro=parseFloat(obj.dataset.add)*qtdCompra;
  let necessario=600;

  if(obj.parentNode.dataset.autoclick===undefined){
    valorDoClique += aumentoDoLucro;
    necessario*=2;
  }
  else{
    valorDoSeg+=aumentoDoLucro;
  }

  if(necessario*aumentoDoLucro< +obj.dataset.custo){
    achievementUnlock(conqs[0][1]);
  }

  obj.contribLucro+=aumentoDoLucro;
  obj.comprados+=Number(qtdCompra);

  //conquistas
  if (upgrades[0].comprados >= 10000 && upgrades[1].comprados >= 2000 && upgrades[2].comprados >= 30)
    achievementUnlock(conqs[0][2]);

  if (upgrades[5].comprados >= 1000)
    achievementUnlock(conqs[0][4]);

  if ((upgrades[3].comprados + upgrades[4].comprados + upgrades[6].comprados) >= 5000 && upgrades[5].comprados == 0)
    achievementUnlock(conqs[0][5]);

  if (upgrades[6].comprados > 0 && upgrades[5].comprados == 0 && upgrades[4].comprados == 0 && upgrades[3].comprados == 0)
    achievementUnlock(conqs[0][8]);

  if (upgrades[6].comprados > clicksDados)
    achievementUnlock(conqs[0][9]);

  if (qtdCompra == 1000)
    achievementUnlock(conqs[0][10]);

  if (obj == upgrades[0] && upgrades[2].comprados >= 5000)
    achievementUnlock(conqs[0][11]);
}

let achClicks=0,achClicks2=0, achClicks3=0;
function Pc(){
  mudaDin(valorDoClique);
  clicksDados++;

  // Conquista
  if(conqs[1][1].tem==false){
    achClicks++;
    setTimeout(function () {
      achClicks--;
    },5000);
    if(achClicks>=40){
      achievementUnlock(conqs[1][1]);
    }
  }

  if(conqs[1][2].tem==false){
    achClicks2++;
    setTimeout(function () {
      achClicks2--;
    },10000);
    if(achClicks2>=100){
      achievementUnlock(conqs[1][2]);
    }
  }

  achClicks3++;
  setTimeout(function () {
    achClicks3--;
    if(achClicks3<=0){
      achievementUnlock(conqs[1][3]);
    }
  },300000);

  if (clicksDados == 100000)
    achievementUnlock(conqs[0][6]);

  if (clicksDados == 100 && dinGasto < 0.0000000001)
    achievementUnlock(conqs[0][7]);

}


function refreshCusto(obj){ /* Atualiza na tela o custo de "obj". */
  let x=(obj.custoSemArr+obj.inflacao*(qtdCompra-1)/2)*qtdCompra;
  obj.ddCusto.innerHTML =x.formata(2)+" contos";
  obj.dataset.custo=x.toFixed(2);
}

function refresh(obj){ /* Atualiza na tela o custo, lucro e quantidade comprada de "obj". */
  refreshCusto(obj);
  obj.ddLucro.innerHTML = parseFloat(obj.dataset.add).formata(2)+" contos";
  obj.ddCompr.innerHTML = obj.comprados;
}

function refreshAll(){ /* Manda um Refresh em todos os elementos do vetor upgrades e atualiza o <span> com o dinheiro do jogador. */
  for(let i=0; i<upgrades.length; i++){
    refresh(upgrades[i]);
  }
  mudaDin(0);
}

upgrades.click(Pagar);

botaoPc.click(function(e){
  Pc();
  let x=criaNumerinho("#00ff00",document.body,valorDoClique);
  posicionaNumerinho(x,e.pageX-x.offsetWidth/2,e.pageY-x.offsetHeight/2);
});

comPopop.click(function(e){ /* Se a quantidade do produto for maior que seu atributo "qtdpopup", abre seu popup e desbloqueia uma
nova aba */
  const data=this.dataset;
  if(this.disponivel && this.comprados>=Number(data.qtdpopup)){
    abrePopop(Number(data.indicepopup));
    this.disponivel=false;
  }
});


// Scroll de comprar mais

let ele=document.querySelector("#qtosComprar");
let eleSpan=document.querySelector("#num");

function inputUpdateVisual(){
  eleSpan.innerHTML=Math.round(ele.value*ele.value);
}
function inputUpdateVar(){
  qtdCompra=Number(eleSpan.innerHTML);
  for(let i=0; i<upgrades.length; i++){
    refreshCusto(upgrades[i]);
  }
}
function updateAll(){
  inputUpdateVisual();
  inputUpdateVar();
}

ele.addEventListener("input",inputUpdateVisual);
ele.addEventListener("change",inputUpdateVar);


// Upgrades!

let ups=$("[data-diferente=\"up\"]>li"); /* A lista de upgrades tem seu atributo "diferente" igual a "up". Esse atributo indica
que os upgrades têm um comportamento próprio de si, e não seguem aquele modelo de lucro, inflação, etc. */
function mult(chosen,mul,ants=true){ /* O primeiro parâmetro é um vetor de elementos HTML. O segundo é o valor pelo qual o lucro
  de cada um dos elementos será multiplicado. O terceiro, opcional, indica se o lucro dos produtos já comprados deve ser
  multiplicado também, caso em que deve ter o valor "true", ou o upgrade afetará apenas novos produtos, caso em que deve ser
  "false". */
  let tem=chosen[0].parentNode.dataset.autoclick;
  for(let i=0; i<chosen.length; i++){
    let velho=Number(chosen[i].dataset.add);
    let novo=velho*mul;
    if(ants){
      if(tem===undefined) valorDoClique+=(mul-1)*chosen[i].contribLucro;
      else valorDoSeg+=(mul-1)*chosen[i].contribLucro;
      chosen[i].contribLucro*=mul;
    }
    chosen[i].dataset.add=novo;
    refresh(chosen[i]);
  }
}

const funcoesUps=[ /* Vetor com funções que serão executadas na compra de cada upgrade, na ordem pela qual os upgrades aparecem
  no HTML. */
  function(){
    mult(document.querySelectorAll("#ra"),10);
  },
  function(){
    mult(document.querySelectorAll("#html"),5);
  },
  function(){
    let chosen=document.querySelector("#gtx");
    chosen.inflacao/=20;
    refresh(chosen);
  },
  function(){
    let chosen=document.querySelectorAll("#progs li");
    for(let i=0; i<chosen.length; i++){
      mult([chosen[i]],1+chosen[i].comprados*0.0007);
    }
  },
  function(){
    let chosen=document.querySelectorAll("#progs li:not(.portugol)");
    let total=0;
    for(let i=0; i<chosen.length; i++){
      total+=chosen[i].comprados;
      valorDoSeg-=chosen[i].contribLucro;
      chosen[i].contribLucro=0;
      chosen[i].comprados=0;
      refresh(chosen[i]);
    }

    let renegade=document.querySelector("#special");
    let ganho=renegade.dataset.add*total;
    valorDoSeg+=ganho;
    renegade.contribLucro+=ganho;
    renegade.comprados+=total;
    refresh(renegade);
  }
];

function aplicarUp(i){ /* Executa a função do upgrade de índice i e remove-o da lista */
  funcoesUps[i]();
  ups[i].classList.add("oculto");
}

for(let i=0; i<ups.length; i++){
  /* Adicionar no HTML dos upgrades uma descrição breve deles, contida no atributo "desc", e o custo, no atributo "custo". */
  ups[i].innerHTML+="<div class='descLi'><p>"+ups[i].dataset.desc+"</p><dl><div><dt>Custo</dt><dd>"+Number(ups[i].dataset.custo).formata(2)+" contos</dd></div></dl></div>";
  /* Event Listeners dos upgrades */
  ups[i].addEventListener("click",function(){
    if(comprar(this)){
      aplicarUp(i);
    }
  });
}


// Save

let saveBtn=document.querySelector("#save");
function save(){ /* Salva todas as variáveis importantes no Local Storage */
  localStorage.setItem("dinheiro",dinheiro);
  localStorage.setItem("valorDoClique",valorDoClique);
  localStorage.setItem("valorDoSeg",valorDoSeg);

  localStorage.setItem("dinGasto",dinGasto);
  localStorage.setItem("clicksDados",clicksDados);
  localStorage.setItem("tempo",tempo);

  let vdo=[];
  for(let i=0; i<upgrades.length; i++){
    let a=upgrades[i];
    vdo[i]={
      custoSemArr: a.custoSemArr,
      comprados:a.comprados,
      contribLucro: a.contribLucro,
      inflacao: a.inflacao,
    };
  }
  localStorage.setItem("vdo",JSON.stringify(vdo));

  let upsComprados=[];
  for(let i=0; i<ups.length; i++){
    if(ups[i].classList.contains("oculto")){
      upsComprados.push(i);
    }
  }
  localStorage.setItem("ups",JSON.stringify(upsComprados));


  // Salvar conquistas

  let conseguidas=[[],[]];
  for(let i=0; i<2; i++){
    for(let j=0; j<conqs[i].length; j++){
      conseguidas[i][j]=conqs[i][j].tem;
    }
  }
  localStorage.setItem("conseguidas",JSON.stringify(conseguidas));
}

saveBtn.addEventListener("click",save);


// Reset

let resetBtn=document.querySelector("#reset"),resetPop=document.querySelector("#resetPop");
resetBtn.addEventListener("click",function () {
  abre(resetPop);
});

let resetaDeVerdade=document.querySelector("#resetaDeVerdade");
resetaDeVerdade.addEventListener("click",function () {
  ele.value=1;
  updateAll();
  zera();
  refreshAll();
});

// Load

function zera(){
  for(let i=0; i<upgrades.length; i++){
    upgrades[i].comprados=0;
    upgrades[i].custoSemArr=upgrades[i].custoInicial; // custoSemArr = custo sem arredondamento
    upgrades[i].dataset.add=upgrades[i].lucroInicial;
    upgrades[i].inflacao=upgrades[i].custoSemArr/10; // O tanto que o preço aumenta a cada compra
    upgrades[i].contribLucro=0; /* Para guardar a participação de cada tipo de produto no lucro */
  }

  let mostraLis=[];

  for(let i=0; i<comPopop.length; i++){
    if(comPopop[i].disponivel==false){
      comPopop[i].disponivel=true;
      mostraLis.push(txtPop[+comPopop[i].dataset.indicepopup].dataset.mostra);
    }
  }

  // Nossa, eu era muito ruim em programação para fazer um código desses.
  // Olha o que eu precisei fazer para resetar os upgrades!

  for(let i=0; i<lisMenu.length; i++){
    for(let j=0; j<mostraLis.length; j++){
      const mostra=lisMenu[i].dataset.mostra;

      if(mostra==mostraLis[j]){
        mostraLis.splice(j,1);
        const classes=lisMenu[i].classList;
        classes.add("oculto");

        if(classes.contains("atual")){
          classes.remove("atual");
          for(let k=0; k<divsCentral.length; k++){
            if(divsCentral[k].id==mostra){
              divsCentral[k].classList.remove("visivel");
            }
            else if(divsCentral[k].id=="pecas"){
              divsCentral[k].classList.add("visivel");
            }
          }
          lisMenu[2].classList.add("atual");
        }
      }
    }
  }

  valorDoClique = 0.01;
  valorDoSeg=0.00;
  dinheiro = 0.0;

  dinGasto=0;
  tempo=0;
  clicksDados=0;
  let temEl=conqs[0][0].el!=undefined;

  for(let i=0; i<2; i++){
    for(let j=0; j<conqs[i].length; j++){
      conqs[i][j].tem=false;
      if(temEl) conqs[i][j].el.classList.remove("desbloqueada");
    }
  }

  for(let i=0; i<ups.length; i++){
    ups[i].classList.remove("oculto");
  }

  conqsObtidas=0;
  if(temEl) conqSpans[0].innerHTML="0";
}

function load(){
  let moni=localStorage.getItem("dinheiro");
  if(moni!=null){
    dinheiro=Number(moni);
    valorDoClique = Number(localStorage.getItem("valorDoClique"));
    valorDoSeg=Number(localStorage.getItem("valorDoSeg"));

    dinGasto=Number(localStorage.getItem("dinGasto"));
    tempo=Number(localStorage.getItem("tempo"));
    clicksDados=+localStorage.getItem("clicksDados"); // Mais converte para número, igual a Number(x);

    let vdo=JSON.parse(localStorage.getItem("vdo"));
    for(let i=0; i<upgrades.length; i++){
      upgrades[i].comprados=vdo[i].comprados;
      upgrades[i].custoSemArr=vdo[i].custoSemArr;
      upgrades[i].inflacao=vdo[i].inflacao;
      upgrades[i].contribLucro=vdo[i].contribLucro;
    }

    // Aplica upgrades já comprados
    let iuc=JSON.parse(localStorage.getItem("ups"));
    for(let i=0; i<iuc.length; i++){
      aplicarUp(iuc[i]);
    }

    // Aplica conquistas
    let conseguidas=JSON.parse(localStorage.getItem("conseguidas"));
    for(let i=0; i<2; i++){
      for(let j=0; j<conqs[i].length; j++){
        if(conqs[i][j].tem=conseguidas[i][j]){
          conqsObtidas++;
        }
      }
    }
  }
  else {
    zera();
  }
}
load();
refreshAll();

for(let i=0; i<comPopop.length; i++){
  if(comPopop[i].comprados>=Number(comPopop[i].dataset.qtdpopup)){
    comPopop[i].disponivel=false;
    unlock(txtPop[i].dataset.mostra);
  }
  else comPopop[i].disponivel=true;
}


// Conquistas

let conqSpans=document.querySelectorAll("#numConqs span");
conqSpans[0].innerHTML=conqsObtidas;
conqSpans[1].innerHTML=conqs[0].length+conqs[1].length;

let conqsUl=document.querySelector("#listaConqs");
let conqsLi=document.querySelector("#conqs"),conqsPop=document.querySelector("#conqsPop");

conqsLi.addEventListener("click",function () {
  abre(conqsPop);
});

for(let i=0; i<2; i++){
  for(let j=0; j<conqs[i].length; j++){
    let x=conqs[i][j].el=document.createElement("li");

    x.innerHTML="<section><h3>"+conqs[i][j].nom+"</h3><p>"+conqs[i][j].dsc+"</p></section>";
    if(conqs[i][j].tem){
      x.classList.add("desbloqueada");
    }
    if(i==1){
      x.innerHTML+="<!--Seu raquerzinho enxerido (para raquear mais ainda aperte F12, vá no console e escreva \"dinheiro=100000000000000000000000000000000\")--><section class='inicial'><h3>Conquista oculta</h3><p>Não vou te falar o que tem que fazer para desbloquear essa conquista! Nem adianta inspecionar pra saber!</p></section>";
      x.classList.add("nVouTeFalar");
    }

    conqsUl.appendChild(x);
  }
}


// Setinha!!!

let liEspecifica=document.querySelector("#special");
let setas=document.querySelectorAll(".seta");
/*let portu=document.querySelector("#portu");
let parar;*/

function remover(){
  if(this.comprados>=1||dinheiro>=this.dataset.custo){
    liEspecifica.classList.remove("special");
    liEspecifica.removeEventListener("click",remover);
    achievementUnlock(conqs[0][0]);
  }
}
liEspecifica.addEventListener("click",remover);

function alfaceCrespa(){
  for(let i=0; i<setas.length; i++) setas[i].style.bottom=(liEspecifica.offsetHeight-setas[i].offsetHeight)/2+"px";
}


// Tela Sobre. Nada importante aqui.

let sobre=$("#sobre"),sobrePop=document.querySelector("#sobrePop");
let promo=document.querySelector("#promo");
let ptt=document.querySelectorAll(".ptt");

for(let i=0; i<3; i++){
  ptt[i].v=Number(ptt[i].innerHTML);
}

function set(i,lim,dec=1){
  let x=ptt[i];
  x.lim=lim;
  x.dec=dec;
}
set(2,100);
set(1,60);
set(0,-1);

let ptParar;

function fimPromo(){
  promo.remove();
  clearInterval(ptParar);
}

sobre.click(function () {
  abre(sobrePop);

  function f(i){
    let x=ptt[i];
    if(x.v==0){
      if(i==0){
        fimPromo();
        return;
      }
      x.v=x.lim-x.dec;
      f(i-1);
    }
    else{
      x.v-=x.dec;
    }
    if(!sobrePop.classList.contains("oculto")) x.innerHTML=x.v<10? "0"+x.v: x.v;
  }

  if(nAtivouCronometro){
    ptParar=setInterval(function () {
      f(2,100);
    },10);
    nAtivouCronometro=false;
  }
  pausa();
});

let clickme=$("#clickme");
clickme.click(function(){
  setTimeout(function () {
    alert("Não dá para saber se você realmente baixou, mas como tem 1% de chance de você ter baixado vamos te dar 1% do dinheiro. Aproveite seu conto!");
  },10);
  mudaDin(1);
  fimPromo();
  clickme.off("click");
});


// Estatísticas

let statTable=document.querySelector("#statTable"); // Gera tabela
let tdsContrib=[],tdsTempo=[];

for(let i=0; i<upgrades.length; i++){
  let criadas=0;

  let tr=document.createElement("tr");
  statTable.appendChild(tr);

  let th=document.createElement("th");
  tr.appendChild(th);
  th.valor=i;
  th.innerHTML=upgrades[i].firstChild.textContent;
  th.dataset.ind=0;

  let temAutoclick=upgrades[i].parentNode.dataset.autoclick==="";

  function createTd(vtrue,vfalse,vetor){
    let td=document.createElement("td");
    tr.appendChild(td);
    td.innerHTML=vtrue;
    vetor[i]=td;

    let span=document.createElement("span");
    td.insertBefore(span,td.firstChild);
    vetor[i].conv=span;

    if(!temAutoclick){
      function innerHTMLQNBuga(el,html){
        el.appendChild(document.createTextNode(html));
      }

      innerHTMLQNBuga(td," (");
      let span2=document.createElement("span");
      td.appendChild(span2);
      vetor[i].semConv=span2;
      innerHTMLQNBuga(td,vfalse+")");
    }

    td.dataset.ind=++criadas;
  }

  createTd("/s","/clique",tdsContrib);
  createTd("s"," cliques",tdsTempo);
}

let statPop=document.querySelector("#statPop"),statLi=document.querySelector("#stats");
let tdTempo=document.querySelector("#tempoJogo"),tdDin=document.querySelector("#dinGasto"),
tdClicks=document.querySelector("#clicksDados"),tdClicksPS=document.querySelector("#clicksPS");

function converteSegundos(so){
  let h = Math.floor(so/3600);
  let m = Math.floor((so%3600)/60);
  let s = so%60;
  function poeZero(x){
    if(x<10) return "0"+x;
    return String(x);
  }
  return (h? poeZero(h)+":": "")+poeZero(m)+":"+poeZero(s);
}


// Organizadores

function sortTable(i){
  let vetorEl=statTable.querySelectorAll('[data-ind="'+i+'"]');
  let copia=[];
  const orient=sorters[i].dataset.orient;

  for(let k=0; k<vetorEl.length; k++){
    copia[k]={
      ind:k,
      valor:vetorEl[k].valor
    };
  }

  for(let k = 1,l; k < copia.length; k++) {
    let el = copia[k];
    l = k - 1;
    while (l >= 0 && (orient=="1"? (copia[l].valor > el.valor): (copia[l].valor < el.valor))) {
      copia[l+1] = copia[l];
      l--;
    }
    copia[l+1] = el;
  }

  for(let k=0; k<copia.length; k++){
    statTable.appendChild(vetorEl[copia[k].ind].parentNode);
  }
}

let sorters=document.querySelectorAll(".sorter");
for(let i=0; i<sorters.length; i++){
  sorters[i].addEventListener("click",function () {
    for(let j=0; j<sorters.length; j++){
      const sd=sorters[j].dataset;
      if(j!=i){
        sd.orient="0";
      }
      else{
        if(sd.orient=="0"){
          sd.orient=sd.padrao;
        }
        else{
          sd.orient*=-1;
        }

        sortTable(i);
      }
    }
  });
}


statLi.addEventListener("click",function () {
  abre(statPop);
  clicksPS=clicksDados/(tempo/100);

  for(let i=0; i<upgrades.length; i++){
    function set(el,expr,eDireta){
      if(clicksDados!=0 || !(el.semConv)){
        let exprEmS=el.semConv?
        (eDireta? expr*clicksPS: expr/clicksPS):
        expr;
        el.valor=exprEmS;
        el.conv.innerHTML=exprEmS.formata(2);
      }
      else{
        el.valor=0;
        el.conv.innerHTML="0.00";
      }
      if(el.semConv) el.semConv.innerHTML=expr.formata(2);
    }

    set(tdsContrib[i],upgrades[i].contribLucro,true);
    set(tdsTempo[i],(Math.round(upgrades[i].custoSemArr*100)/100)/upgrades[i].dataset.add,false);
  }

  tdTempo.innerHTML=converteSegundos(Math.round(tempo/100));
  tdDin.innerHTML=dinGasto.formata(2)+" contos";
  tdClicks.innerHTML=clicksDados;
  tdClicksPS.innerHTML=clicksPS.formata(2);

  for(let i=0; i<sorters.length; i++){
    if(sorters[i].dataset.orient!="0"){
      sortTable(i);
      break;
    }
  }
});


// parte das Aleatoriedades *********************************************

let aleatorios = document.querySelectorAll("[data-diferente=\"aleat\"]>li")
let spinnerImg = document.querySelector("#spinner")
let tormentaButton = document.querySelector("#tormenta")
let fogoImg = document.querySelector("#fogo")

for(let i = 0; i < aleatorios.length; i++){ // copiei la de cima fitz
  // Copiou mas tirou o ponto e vírgula, né? kk
  aleatorios[i].innerHTML+="<div class='descLi'><p>"+aleatorios[i].dataset.desc+"</p><dl><div><dt>Custo</dt><dd>"+Number(aleatorios[i].dataset.custo).formata(2)+" contos</dd></div></dl></div>"
}


for(let i = 0; i < aleatorios.length; i++){
  aleatorios[i].addEventListener("click", function(){
    if(comprar(aleatorios[i])){
      funcoesAleatorias[i]()
      achievementUnlock(conqs[0][3]);
      aleatorios[i].classList.add("oculto"); /* A função "fecha" é só para os popups porque ela para o tempo e tem outros efeitos
      colaterais */
    }
  });
}

let girando = 1;
let tormenta = 0;
let tormentaOff = 0;
let rodamento=0;
let girarFunc,numsDoidoes;

const funcoesAleatorias = [ // array com funcoes para as aleatoriedades, me inspirei na de la de cima tambem
  function(){
    tormentaButton.classList.remove('oculto')
    spinnerImg.classList.remove('oculto');
    spinnerImg.addEventListener("click",giraSpinner);
  },
  function(){

  },
  function(){

  },
  function() {

  },
  function(){

  }
];

function giraSpinner(){
  if(girando){
    girando = 0;
    girarFunc =setInterval(function(){
      spinnerImg.style.transform="rotateZ("+rodamento+"deg)";
      rodamento+=19;
      let valorTormenta = Math.round(valorDoClique*100)/2000;
      if(valorTormenta < 0.05) valorTormenta = 0.05;
    }, 33);
    if(tormenta){
      numsDoidoes=setInterval(spanTormenta,33);
    }
  }
  else{
    girando = 1;
    clearInterval(girarFunc);
    clearInterval(numsDoidoes);
  }
}


//Tormenta do spinner

tormentaButton.addEventListener("click", ativaTormenta)

function ativaTormenta(e){
  if(!tormentaOff){
    tormentaOff = 1;
    tormentaButton.innerHTML = "A <em>Tormenta do Spinner</em> está ativa!"
    fogoImg.classList.remove("oculto")
    tormenta = 1;
    spinnerImg.style.backgroundImage = "aleatoriedades/url(fogo.gif)"

    setTimeout(function(){
      spinnerImg.style.backgroundImage = ""
      fogoImg.classList.add("oculto")
      tormentaButton.innerHTML = "A <em>Tormenta do Spinner</em> está carregando"
      tormenta = 0;
      clearInterval(numsDoidoes);
    }, 30000)

    setTimeout(function(){
      tormentaOff = 0
      tormentaButton.innerHTML = "Ativar a <em>Tormenta do Spinner</em>"
    }, 60000);

    if(girando==0){
      numsDoidoes=setInterval(spanTormenta,33);
    }
  }
  else if(tormenta == 0){
    alert('ta carregando po calma ai')
  }
}


function spanTormenta(e){
  let valorTormenta = Math.round(valorDoClique*100)/2000;
  if(valorTormenta < 0.05) valorTormenta = 0.05;
  mudaDin(valorTormenta);
  let x=criaNumerinho("#ff0000",divPc[0],valorTormenta);
  posicionaNumerinho(x,(botaoPc[0].offsetWidth-x.offsetWidth)*Math.sqrt(Math.random()*Math.random()),(botaoPc[0].offsetHeight-x.offsetHeight)*Math.sqrt(Math.random()*Math.random()));
}
