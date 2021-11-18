import fs from 'fs'
import _ from 'lodash'

_.mixin({mapForObject,parse,read,fchain,overFunc,arr,str,diff,server,content})

_()
.arr(process.argv.slice(2)[0],process.argv.slice(2)[1])  // créer un tableau avec tous les arguments de la function "arr"
.overFunc(fchain)                                        // éxecute la fonction "fchain" pour chaque éléments du tableau et retourne tous les résultats dans un tableau 
.diff()                                                  // supprime les doublons dans chaque tableau et garde que les différences
.str()                                                   // converti les élement du tableau en string
.content()                                               // ajoute le template html
.server("html")                                          // démarre le serveur web
.value()                                                 // fin de la chaine

// template html

function content(x) {
  let [a,b] = x
  return `<div style="display:flex;width:100%">
  <pre style="white-space: break-spaces;width:95vh;">${process.argv.slice(2)[0]} : ${a}</pre>
  <pre style="white-space: break-spaces;">${process.argv.slice(2)[1]} : ${b}</pre>
  </div>`
}

// function récursive

function mapForObject(x,callback,arr=[]){
  for ( y of Object.keys(x) ) {
    if ( typeof x[y] != 'object' ){
      ( x => x && arr.push(x) )(callback(x[y],y))
    }else{
      mapForObject(x[y],callback,arr)
    }
  }
  return arr
}

// Stringify la valeur ou les éléments du tableau

function str(x){

	if( Array.isArray(x) )
		return x.map( y => JSON.stringify(y,null,2))

	return JSON.stringify(x)
	.replace("[[","[\n  [")
	.replace("],[","],\n  [")
	.replace("]]","]\n]")

}

//

function parse(x){

	return JSON.parse(x)
}

//

function read(x){

	return fs.readFileSync(x,'utf8')
}

// server http

function server(x,n) {

	const http = require("http")
	const PORT = 8080

	http.createServer(function (req, res) {
		
		res.writeHead(200,{"content-type":`text/${n};charset=utf8`})

		res.end(x)
	  
	}).listen(PORT)

	console.log(`Running at port ${PORT}`)

}

// lit, parse et map le JSON contenu dans un ficher Bookmarks de Google Chrome

function fchain(x){

	return _(x).read().parse().mapForObject( (x,i) => i == 'url' && x ).value()
}

// converti les arguments en tableau

function arr(...args){

	return args.splice(1)
}

// éxecute une fonction sur chaque élément contenu dans le tableau "x"

function overFunc(x,y){

	return x.map( x => y(x) )

}

// évite de faire _.difference(a,b) et _.difference(b,a) à chaque fois grâce à la fonction lodash "_.flip"

function diff(x){

	let a = _.difference(...x)

	let b = _.flip( (...y) => _.difference(...y) )(...x)

	return[a,b]

}
