/* Sección 2 · La Isla de los Aventureros (4.º y 5.º grado) — libros nuevos (parte B) */
const PD = (obra) => `Adaptación libre de ${obra}, obra de dominio público`;

module.exports = [
  {
    slug: 'el-secreto-de-la-piedra-de-rosetta',
    title: 'El secreto de la piedra de Rosetta',
    author: 'Gonzalo Echeverría',
    synopsis: 'Para el cumpleaños de los mellizos Bruno y Vera, su abuela egiptóloga escondió el regalo en su estudio y dejó las pistas escritas en jeroglíficos. Para encontrarlo, tendrán que aprender a leer como los antiguos egipcios, siguiendo los pasos del joven que descifró uno de los mayores misterios de la historia.',
    genres: ['Historia', 'Misterio', 'Exploración'],
    gradeMin: 4, gradeMax: 5,
    cover: { scene: 'llave', c1: '#e9c46a', c2: '#8d5524' },
    chapters: [
      {
        title: 'Un regalo escrito en piedra',
        illustration: 'llave',
        content: `La abuela Irene era egiptóloga, es decir, una científica que estudia el antiguo Egipto. Había viajado muchas veces a ese país del norte de África, había caminado entre pirámides y templos, y su casa estaba llena de libros, mapas, réplicas de estatuas y cajas con etiquetas misteriosas.

El día que Bruno y Vera cumplieron diez años, la abuela les dio un sobre.

—Su regalo está escondido en mi estudio. Para encontrarlo, tienen que leer esto.

Dentro del sobre había una tarjeta con dibujos: un pájaro, una mano, una serpiente, un ojo, una línea de agua ondulada. Eran jeroglíficos, la escritura de los antiguos egipcios.

—¡Pero no sabemos leer esto! —protestó Bruno.

—Durante más de mil años, nadie en el mundo supo leerlo —dijo la abuela—. Los últimos que sabían escribir jeroglíficos vivieron hace unos mil seiscientos años. Después, el idioma se olvidó. La gente veía esos dibujos en templos y tumbas y no tenía idea de qué decían. Algunos creían que eran símbolos mágicos, que cada dibujo era una idea secreta.

—¿Y cómo se aprendió a leerlos otra vez? —preguntó Vera.

La abuela sonrió y señaló una réplica que tenía sobre el escritorio: una piedra oscura, rota en los bordes, cubierta de inscripciones.

—Gracias a esto. La piedra de Rosetta. Y a un joven francés muy testarudo. Pero esa es una historia para mientras buscan.`
      },
      {
        title: 'Tres escrituras en una piedra',
        illustration: 'cabildo',
        content: `Vera y Bruno se acercaron a la réplica. La piedra tenía tres partes, cada una con un tipo de escritura distinta.

—La piedra original fue encontrada en 1799, en Egipto, cerca de una ciudad llamada Rashid, que los europeos llamaban Rosetta —explicó la abuela—. Hoy está en un museo de Londres. Es un decreto, una especie de ley, escrito hace más de dos mil años. Lo importante es que el mismo texto está escrito tres veces: arriba, en jeroglíficos; en el medio, en otra escritura egipcia más rápida llamada demótica; y abajo, en griego antiguo.

—¡Y el griego sí se sabía leer! —dijo Vera.

—Exacto. Era como tener la misma frase en tres idiomas, uno conocido y dos desconocidos. Una llave. Pero aun así, descifrarla llevó más de veinte años.

—¿Por qué tanto?

—Porque los sabios pensaban que cada jeroglífico representaba una idea completa, como un dibujo que significa "sol" o "rey". Pero un joven llamado Jean-François Champollion, que de chico aprendía idiomas como quien junta figuritas, sospechó otra cosa: que muchos jeroglíficos representaban sonidos, como nuestras letras.

La abuela tomó una lupa y señaló unos óvalos en la piedra, con varios signos adentro.

—Estos óvalos se llaman cartuchos. Encierran nombres de reyes. Champollion comparó el cartucho del rey Ptolomeo, que aparecía en griego en la parte de abajo, con el de la reina Cleopatra, en otro monumento. Los dos nombres comparten sonidos: la "p", la "t", la "o", la "l". Y los signos para esos sonidos eran iguales en los dos cartuchos. ¡Así descubrió que eran letras!

—¿Y qué pasó?

—En 1822, Champollion entendió el sistema. Dicen que corrió a contarle a su hermano, gritó "¡Lo tengo!" y se desmayó de la emoción.

Bruno y Vera se rieron. Después volvieron a mirar la tarjeta con otros ojos.`
      },
      {
        title: 'Los mellizos descifradores',
        illustration: 'escuela',
        content: `En la biblioteca de la abuela encontraron un libro con una tabla: el "alfabeto" de los jeroglíficos que representan sonidos. No era exactamente un alfabeto como el nuestro, pero servía.

—El buitre es una especie de "a" —leyó Vera—. La pierna es "b". La mano, "d". La serpiente con cuernos es "f". La línea de agua es "n". La lechuza es "m". El pan es "t"…

—Los egipcios a veces no escribían todas las vocales —agregó Bruno, que leía la página siguiente—. Y podían escribir de derecha a izquierda, o de izquierda a derecha. Para saber para dónde leer, hay que mirar hacia dónde miran los animales y las personas: siempre miran hacia el principio de la frase.

Volvieron a la tarjeta. Los pájaros miraban hacia la izquierda. Empezaron por la izquierda.

Signo por signo, fueron armando una palabra. Lechuza: m. Buitre: a. Pierna: b… Les costó, se equivocaron, borraron y volvieron a empezar, igual que Champollion. Al final, en el papel, escrito con letras torcidas, leyeron:

"MAPA. ARMARIO AZUL".

Corrieron al armario azul del pasillo. En la puerta había un mapa de Egipto, y sobre la ciudad de Rashid, un círculo rojo y otro mensaje en jeroglíficos, más corto. Ya tenían práctica. En cinco minutos lo descifraron:

"DEBAJO".

Abrieron el armario. En el piso había una caja de madera con un cartucho dibujado en la tapa. Dentro del cartucho, en jeroglíficos, dos nombres: el de Vera y el de Bruno.`
      },
      {
        title: 'Escribir el propio nombre',
        illustration: 'llave',
        content: `Dentro de la caja había dos cuadernos de tapas de cuero, dos lápices dorados y un sobre. En el sobre, dos pasajes de avión. Debajo, con la letra prolija de la abuela, decía: "Para mis dos descifradores. El próximo verano, nos vamos juntos a Egipto".

Los mellizos gritaron tan fuerte que el perro del vecino empezó a ladrar.

Esa noche, la abuela les mostró fotos de sus viajes: las pirámides de Guiza, la esfinge con su cara de león y de hombre, el templo de Abu Simbel con sus estatuas gigantes, y las paredes llenas de jeroglíficos de colores que, gracias a Champollion, hoy se pueden leer.

—¿Sabés qué es lo que más me gusta de esta historia? —dijo la abuela—. Que muestra que el conocimiento se puede perder. Una escritura entera se olvidó durante siglos. Y también muestra que se puede recuperar, con paciencia, curiosidad y trabajo, comparando, probando y equivocándose.

Bruno pensó un momento.

—Entonces, si un día alguien encuentra nuestros cuadernos dentro de dos mil años…

—…ojalá que alguien sepa leerlos —completó Vera.

Antes de dormir, cada uno escribió en la primera página de su cuaderno su nombre en jeroglíficos, dentro de un cartucho, como los reyes y reinas del antiguo Egipto. Les quedó un poco torcido. Pero era la primera vez, en mucho tiempo, que alguien en esa casa escribía como hace tres mil años.`
      }
    ],
    quiz: [
      { question: '¿Por qué la piedra de Rosetta fue tan importante?', options: ['Porque era de oro', 'Porque tenía el mismo texto en jeroglíficos, demótico y griego', 'Porque era la más grande', 'Porque estaba en una pirámide'], correct: 1, explanation: 'El griego conocido sirvió como llave para descifrar los jeroglíficos.' },
      { question: '¿Qué descubrió Champollion?', options: ['Que los jeroglíficos eran sólo dibujos mágicos', 'Que muchos jeroglíficos representaban sonidos', 'Una pirámide nueva', 'El idioma griego'], correct: 1, explanation: 'Comparando cartuchos vio que los signos funcionaban como letras.' },
      { question: '¿Qué es un cartucho en la escritura egipcia?', options: ['Un óvalo que encierra el nombre de un rey o reina', 'Un tipo de papel', 'Una tumba', 'Un dibujo de un sol'], correct: 0, explanation: 'Los nombres reales se escribían dentro de un óvalo.' },
      { question: '¿Cómo se sabe hacia dónde leer los jeroglíficos?', options: ['Siempre de arriba abajo', 'Mirando hacia dónde miran los animales y personas dibujados', 'Al azar', 'Por los colores'], correct: 1, explanation: 'Las figuras miran hacia el comienzo de la frase.' }
    ]
  },
  {
    slug: 'la-bandera-junto-al-parana',
    title: 'La bandera junto al Paraná',
    author: 'Martín Aldaz',
    synopsis: 'Rosario, febrero de 1812. Catalina tiene once años y vive en una villa a orillas del río Paraná, donde el general Manuel Belgrano construye baterías para defender el río. Una tarde, el general le pide un favor inesperado. Una historia sobre el nacimiento de nuestra bandera.',
    genres: ['Historia', 'Aventura'],
    gradeMin: 4, gradeMax: 5,
    cover: { scene: 'barco', c1: '#75aadb', c2: '#f4f1de' },
    chapters: [
      {
        title: 'Los cañones de la barranca',
        illustration: 'barco',
        content: `En febrero de 1812, Rosario no era la gran ciudad que es hoy. Era un pueblo pequeño, la Villa del Rosario, con casas bajas, una capilla y calles de tierra que bajaban hasta la barranca del río Paraná. El río era ancho, marrón y tranquilo, y desde arriba se veían las islas verdes del otro lado.

Catalina tenía once años y vivía con su mamá, que cosía ropa para los vecinos. Esas semanas, el pueblo estaba revolucionado: había llegado el general Manuel Belgrano con sus soldados.

—Vino a construir baterías —le explicó su mamá—. Son lugares con cañones, para proteger el río. Los barcos realistas, los que defienden al rey de España, bajan desde Montevideo y atacan los pueblos de la costa.

Catalina bajaba todas las tardes a mirar. Los soldados cavaban, cargaban piedras y troncos, y acomodaban los cañones mirando al río. Una de las baterías estaba en la barranca y otra en una isla de enfrente. Los soldados decían que se iban a llamar "Libertad" e "Independencia".

El general Belgrano no era como Catalina se imaginaba a un general. Era un hombre delgado, de cara amable, que hablaba con todos, preguntaba mucho y escribía cartas a la luz de una vela hasta muy tarde. Le gustaba leer y decía que lo más importante para un pueblo eran las escuelas.

Un día, Catalina se animó a preguntarle a un soldado joven:

—¿Por qué los soldados de Belgrano usan una cinta celeste y blanca en el sombrero?

—Es la escarapela —le contestó el soldado, orgulloso—. El general pidió permiso al gobierno para usarla. Así nos distinguimos de los realistas. Antes usábamos los mismos colores que ellos, ¡y en las batallas era un lío!`
      },
      {
        title: 'Un encargo para la costurera',
        illustration: 'cabildo',
        content: `Una tarde golpearon la puerta de la casa de Catalina. Era un oficial del ejército.

—El general necesita una costurera de confianza. Le dijeron que su madre es la mejor del pueblo.

La mamá de Catalina se secó las manos en el delantal, nerviosa, y fue con el oficial. Catalina la siguió.

En una casa cerca de la barranca, el general Belgrano los recibió con una sonrisa cansada.

—Señora, quiero pedirle algo especial. Necesito una bandera. Una bandera que tenga los mismos colores de la escarapela: celeste y blanco. Que nuestros soldados vean flamear algo que sea sólo nuestro.

Les mostró las telas. Eran dos piezas, una celeste y otra blanca.

Catalina ayudó a su mamá durante toda la noche. Cortaban, medían y cosían a la luz de una vela de sebo. La mamá hacía las costuras finas, y Catalina enhebraba las agujas y sostenía la tela para que no se arrugara.

—¿Te das cuenta, hija? —dijo su mamá, en voz baja, cerca de la madrugada—. Estamos haciendo algo que nunca existió.

(Los historiadores no saben con seguridad quién cosió aquella primera bandera. Hay una tradición que dice que fue una vecina de Rosario llamada María Catalina Echevarría. Esta historia imagina cómo pudo haber sido esa noche).

Cuando salió el sol, la bandera estaba terminada. Catalina la miró extendida sobre la mesa: los dos colores juntos, como el cielo con una nube, le parecieron lo más lindo que había visto en su vida.`
      },
      {
        title: 'El 27 de febrero',
        illustration: 'barco',
        content: `La tarde del 27 de febrero de 1812, todo el pueblo bajó a la barranca. Los soldados estaban formados frente a la batería Libertad, con sus uniformes y la escarapela en el sombrero. El río brillaba con el sol de la tarde.

El general Belgrano se paró frente a ellos. Catalina, desde un costado, vio cómo un soldado subía la bandera que ella y su mamá habían cosido, y cómo la tela se abría con el viento del río. Celeste y blanca, flameando por primera vez sobre el Paraná.

Belgrano habló con voz fuerte. Les pidió a los soldados que juraran defender la patria y ser fieles a esa bandera. Los soldados gritaron que sí. Algunos tenían lágrimas en los ojos. Catalina también.

Esa noche, el general escribió una carta al gobierno, en Buenos Aires, para contar lo que había hecho. Estaba feliz.

Pero unos días después llegó una respuesta que nadie esperaba. El gobierno, que se llamaba el Primer Triunvirato, no estaba de acuerdo: le ordenaba guardar la bandera y no usarla. Les preocupaba que, en ese momento, tener una bandera propia se tomara como una declaración de independencia antes de tiempo, y que eso trajera problemas con otros países.

—¿Y ahora qué va a hacer el general? —le preguntó Catalina a su mamá.

—Lo que hace la gente que cree en algo —dijo ella—: no rendirse.`
      },
      {
        title: 'La bandera viaja al norte',
        illustration: 'montanas',
        content: `Belgrano no llegó a recibir a tiempo la orden del gobierno, porque ya había partido hacia el norte para ponerse al frente del Ejército del Norte, en Jujuy. Llevó la bandera con él.

Meses después, llegaron noticias a Rosario. El 25 de mayo de 1812, al cumplirse dos años de la Revolución de Mayo, Belgrano hizo bendecir la bandera en la catedral de San Salvador de Jujuy, y la mostró al pueblo y a sus soldados. Cuando el gobierno se enteró, se enojó otra vez, y Belgrano tuvo que guardarla.

Pero la bandera ya no se podía guardar en el corazón de la gente. Los soldados la habían visto. Los pueblos la habían visto. En 1816, cuando se declaró la independencia en Tucumán, el Congreso adoptó oficialmente la bandera celeste y blanca. Más tarde se le agregó el sol en el centro.

Catalina creció. Se hizo costurera, como su mamá. Cuando ya era una mujer grande, sus nietos le pedían que les contara la historia de la noche en que cosió la primera bandera. Ella siempre terminaba igual:

—El general nunca buscó la gloria para él. Murió pobre, en 1820, y casi nadie se acordó de él ese día. Pero la bandera que soñó junto al río sigue flameando.

Hoy, en el lugar donde estaba la batería Libertad, en Rosario, se levanta el Monumento Nacional a la Bandera. Y cada 20 de junio, el día que murió Manuel Belgrano, el país entero recuerda al hombre que, a orillas del Paraná, nos dio los colores que nos representan.`
      }
    ],
    quiz: [
      { question: '¿Por qué Belgrano construía baterías en Rosario?', options: ['Para hacer una fiesta', 'Para defender el río de los barcos realistas', 'Para pescar', 'Para construir un puerto'], correct: 1, explanation: 'Los barcos realistas atacaban los pueblos de la costa.' },
      { question: '¿Qué colores tenía la bandera que creó Belgrano?', options: ['Rojo y amarillo', 'Celeste y blanco', 'Verde y blanco', 'Azul y rojo'], correct: 1, explanation: 'Los mismos colores de la escarapela.' },
      { question: '¿Qué día se izó por primera vez la bandera a orillas del Paraná?', options: ['25 de mayo de 1810', '27 de febrero de 1812', '9 de julio de 1816', '20 de junio de 1820'], correct: 1, explanation: 'Fue el 27 de febrero de 1812, junto a la batería Libertad.' },
      { question: '¿Por qué el gobierno le ordenó a Belgrano guardar la bandera?', options: ['Porque no le gustaban los colores', 'Porque temía que se tomara como una declaración de independencia antes de tiempo', 'Porque estaba mal cosida', 'Porque ya existía otra'], correct: 1, explanation: 'En ese momento la independencia todavía no se había declarado.' }
    ]
  },
  {
    slug: 'la-isla-del-tesoro',
    title: 'La isla del tesoro',
    author: 'Robert Louis Stevenson (adaptación de la Biblioteca)',
    license: PD('«La isla del tesoro» de Robert Louis Stevenson (1883)'),
    synopsis: 'Jim Hawkins es un chico que ayuda en la posada de su madre, hasta que un viejo pirata le deja un mapa con una cruz roja. Pronto se embarca en la goleta Hispaniola rumbo a una isla lejana, sin saber que el simpático cocinero de una sola pierna, Long John Silver, esconde un plan muy peligroso.',
    genres: ['Aventura', 'Novela'],
    gradeMin: 4, gradeMax: 5,
    featured: true,
    cover: { scene: 'isla', c1: '#f6bd60', c2: '#1d3557' },
    chapters: [
      {
        title: 'El viejo pirata y el mapa',
        illustration: 'barco',
        content: `Mi nombre es Jim Hawkins, y esta es la historia de cómo encontramos el tesoro del capitán Flint.

Todo empezó en la posada de mis padres, el Almirante Benbow, junto al mar. Una tarde llegó un viejo marinero, alto, curtido, con una cicatriz en la mejilla y un cofre de marinero a cuestas. Cantaba con voz ronca:

"Quince hombres sobre el cofre del muerto,
¡yo-ho-ho, y una botella de ron!"

Se quedó a vivir en la posada. Se llamaba Billy Bones, pasaba el día mirando el mar con un catalejo y me pagaba una moneda por mes para que vigilara si aparecía "un marinero con una sola pierna".

Un día llegó un mendigo ciego, con un bastón que golpeaba el camino: toc, toc, toc. Le dio a Billy Bones un papelito con un círculo negro: la "marca negra", la señal con la que los piratas avisaban que vendrían por alguien. El viejo pirata se asustó tanto que, esa misma noche, cayó muerto.

Mi madre y yo abrimos su cofre. Entre ropa vieja y monedas había un paquete envuelto en tela encerada. Apenas lo tomé, escuchamos el toc-toc del bastón y pasos de muchos hombres. Escapamos por la puerta de atrás y nos escondimos bajo un puente, mientras los piratas destrozaban la posada buscando algo.

Lo que buscaban lo tenía yo en el bolsillo.

Llevé el paquete al doctor Livesey y al señor Trelawney, el caballero más rico de la zona. Al abrirlo, encontramos un mapa de una isla, con montes, bahías y tres cruces rojas. Al lado de una de ellas, una nota: "Aquí está el grueso del tesoro".

—¡Es el mapa del capitán Flint, el pirata más temido de los mares! —exclamó Trelawney—. Compraremos un barco y zarparemos de inmediato. Y vos, Jim, vendrás como grumete.`
      },
      {
        title: 'Lo que escuché dentro del barril',
        illustration: 'barco',
        content: `El señor Trelawney compró una goleta, la Hispaniola, y contrató a un capitán serio y estricto, el capitán Smollett. Para la tripulación, un hombre del puerto le recomendó a muchos marineros, y también un cocinero: Long John Silver.

Silver era alto y fuerte, aunque le faltaba una pierna y caminaba con una muleta, con una agilidad asombrosa. Era simpático, sonriente, y llevaba sobre el hombro un loro verde que gritaba: "¡Piezas de ocho! ¡Piezas de ocho!". Me cayó bien de inmediato. Me contaba historias de mar y me trataba como a un amigo.

El capitán Smollett, en cambio, desconfiaba de todos.

—No me gusta este viaje —le dijo a Trelawney—. Todos los marineros parecen saber más que yo sobre adónde vamos.

Una noche, poco antes de llegar a la isla, bajé a buscar una manzana al barril que estaba en cubierta. Como quedaban pocas, me metí adentro. Y mientras estaba ahí, alguien se sentó apoyando la espalda en el barril. Era Silver. Hablaba en voz baja con dos marineros.

—Yo era el contramaestre de Flint —decía—. Muchos de los que estamos acá navegamos con él. Cuando tengamos el tesoro en el barco, nos deshacemos del capitán, del caballero y del doctor. Pero no antes: necesitamos que nos lleven de vuelta.

Me quedé helado. El hombre de una sola pierna del que me había advertido Billy Bones era Long John Silver. Y la mitad de la tripulación eran piratas.

En ese momento, el vigía gritó: "¡Tierra a la vista!". Todos corrieron a mirar y yo pude salir del barril sin que me vieran. Fui directo a contarle todo al capitán, al doctor y al señor Trelawney.

—Somos pocos —dijo el capitán Smollett, tranquilo—, pero ahora sabemos la verdad. Y eso, muchacho, nos da ventaja.`
      },
      {
        title: 'Ben Gunn',
        illustration: 'isla',
        content: `Al llegar a la isla, el capitán dejó que la mayoría de los marineros bajara a tierra, para tenerlos lejos del barco. Sin pensarlo mucho, yo me escondí en uno de los botes y salté a la playa antes que nadie. Corrí hacia el bosque.

Fue una locura. Desde los arbustos vi cómo Silver mataba a un marinero que no quiso unirse a los piratas. Escapé temblando, sin saber adónde ir, hasta que me encontré con una figura extraña: un hombre flaco, quemado por el sol, vestido con harapos de lona y piel de cabra.

—Me llamo Ben Gunn —dijo, con voz de quien no habla hace mucho—. Hace tres años que estoy solo en esta isla. Mis compañeros me abandonaron aquí. ¿Tenés queso? ¡Daría cualquier cosa por un pedacito de queso!

Ben Gunn había navegado con Flint. Y me dijo algo en voz baja, guiñando un ojo:

—Decile a tu caballero que Ben Gunn es rico. Muy rico.

Mientras tanto, el capitán, el doctor, Trelawney y los marineros leales habían abandonado el barco y se habían refugiado en un fuerte de troncos que había en la isla. Los piratas los atacaron. Hubo disparos, gritos y humo. Cuando encontré a mis amigos, estaban heridos pero habían resistido.

Esa noche no pude dormir. Pensaba que mientras los piratas tuvieran la Hispaniola, nunca podríamos volver a casa. Entonces tuve una idea muy valiente… o muy tonta.`
      },
      {
        title: 'El tesoro de Flint',
        illustration: 'isla',
        content: `Me escapé del fuerte en la oscuridad, encontré el pequeño bote de Ben Gunn escondido en la costa y remé hasta la Hispaniola. A bordo sólo habían quedado dos piratas, borrachos y peleando. Corté la cuerda del ancla y el barco empezó a ir a la deriva. Después de una lucha terrible con uno de ellos, Israel Hands, logré esconder la goleta en una bahía del norte de la isla. ¡El barco era nuestro otra vez!

Cuando volví al fuerte, me llevé una sorpresa horrible: los piratas lo habían ocupado, y mis amigos se habían ido. Silver me atrapó. Pero en lugar de matarme, me protegió.

—Jim, el doctor me dio el mapa —me dijo en voz baja—. Algo raro está pasando. Si las cosas salen mal, vos vas a hablar a mi favor.

Silver era así: siempre jugaba para los dos lados.

Al día siguiente, los piratas fueron a buscar el tesoro, conmigo atado a una cuerda. Siguieron el mapa hasta un árbol enorme. Allí encontraron un pozo… vacío. Sólo había unas tablas rotas y una moneda.

Los piratas se volvieron contra Silver, furiosos. Justo cuando iban a atacarnos, sonaron disparos desde el bosque: eran el doctor, Ben Gunn y un marinero leal. Los piratas huyeron.

Entonces se aclaró todo. Ben Gunn había encontrado el tesoro hacía mucho tiempo, durante sus años solo en la isla, y lo había llevado a una cueva. El doctor lo sabía, y por eso le había dado a Silver un mapa que ya no servía.

En la cueva de Ben Gunn vi el tesoro de Flint: montañas de monedas de todos los países, lingotes, joyas. Tardamos días en cargarlo en la Hispaniola.

En el viaje de vuelta, Silver se escapó una noche en un puerto, llevándose una bolsa de monedas. Nunca más supimos de él. Y yo, aunque terminé siendo rico, todavía hoy me despierto algunas noches escuchando, en sueños, al loro que grita: "¡Piezas de ocho! ¡Piezas de ocho!".`
      }
    ],
    quiz: [
      { question: '¿Qué encontró Jim en el cofre de Billy Bones?', options: ['Una espada', 'El mapa del tesoro del capitán Flint', 'Un loro', 'Una carta de su padre'], correct: 1, explanation: 'Estaba envuelto en tela encerada.' },
      { question: '¿Cómo descubrió Jim el plan de los piratas?', options: ['Leyó una carta', 'Escuchó a Silver escondido dentro de un barril de manzanas', 'Se lo contó el loro', 'Se lo dijo el capitán'], correct: 1, explanation: 'Silver habló del motín sin saber que Jim estaba ahí.' },
      { question: '¿Por qué el pozo del tesoro estaba vacío?', options: ['Porque nunca hubo tesoro', 'Porque Ben Gunn lo había encontrado y llevado a una cueva', 'Porque se lo llevó el mar', 'Porque Silver lo escondió'], correct: 1, explanation: 'Ben Gunn lo descubrió durante sus años solo en la isla.' },
      { question: '¿Cómo era Long John Silver?', options: ['Siempre leal', 'Simpático pero traicionero, jugaba para los dos lados', 'Muy tímido', 'Un capitán honrado'], correct: 1, explanation: 'Es uno de los personajes más complejos de la novela.' }
    ]
  },
  {
    slug: 'el-misterio-del-tren-a-las-nubes',
    title: 'El misterio del tren a las nubes',
    author: 'Federico Lanús',
    synopsis: 'En un tren turístico que sube por las montañas de Salta hasta más de cuatro mil metros de altura, desaparece un antiguo charango de plata que iba a ser donado a un museo. El tren no se detuvo en ningún lugar. El ladrón tiene que estar a bordo. Mora, del Club de Detectives Lupa, vuelve a investigar.',
    genres: ['Policial', 'Misterio', 'Exploración'],
    gradeMin: 4, gradeMax: 5,
    cover: { scene: 'montanas', c1: '#f28482', c2: '#84a59d' },
    chapters: [
      {
        title: 'Rumbo a las nubes',
        illustration: 'montanas',
        content: `Mora, la presidenta del Club de Detectives Lupa, estaba de vacaciones en Salta con su tía Clara, que era periodista. Habían subido al Tren a las Nubes, un tren turístico que parte de la ciudad de Salta y sube por la Quebrada del Toro, entre cerros de colores, hasta el viaducto La Polvorilla, a más de cuatro mil metros sobre el nivel del mar.

—A esa altura hay menos oxígeno en el aire —les explicó Fermín, el guía del tren, un muchacho simpático con un poncho rojo—. Por eso algunas personas se marean o les duele la cabeza. En la zona lo llaman "apunamiento". Hay que moverse despacio y tomar mucha agua.

En el mismo vagón viajaban personajes interesantes. Un señor elegante, de bigote fino, que se presentó como coleccionista de instrumentos antiguos: el señor Benavente. Una señora que tejía sin parar: la señora Quispe, que viajaba a su pueblo. Un estudiante extranjero con una cámara enorme: Hans. Y una pareja de recién casados que se sacaba fotos todo el tiempo.

Pero lo más interesante iba en una vitrina al fondo del vagón: un charango antiguo, de más de doscientos años, con incrustaciones de plata. Lo acompañaba una mujer seria, la licenciada Ríos, del museo de la provincia.

—Este charango perteneció a un músico famoso de la Quebrada —explicó—. Lo vamos a llevar a San Antonio de los Cobres para una muestra especial y después vuelve al museo. Es una pieza única.

El señor Benavente se acercó a la vitrina y la miró largo rato, con los ojos brillantes.

—Daría una fortuna por tenerlo —murmuró.

Mora anotó eso en su libreta.`
      },
      {
        title: 'La vitrina vacía',
        illustration: 'barco',
        content: `El tren subía y subía, haciendo zigzags y vueltas en espiral para ganar altura. Por la ventana se veían cardones, llamas, cerros violetas y verdes, y un cielo azul intenso.

Cerca del mediodía, el tren entró en un túnel largo. Todo quedó a oscuras durante casi un minuto. Cuando salieron a la luz, la licenciada Ríos pegó un grito.

La vitrina estaba abierta. El charango había desaparecido.

—¡Que nadie se mueva! —dijo Fermín, el guía—. El tren no paró en ningún lugar. El charango tiene que estar acá.

Llamaron a un policía que viajaba en el tren, el cabo Mamaní, que empezó a revisar bolsos y equipajes. Todos estaban nerviosos. El señor Benavente se ofendió muchísimo:

—¡Esto es una vergüenza! ¡Yo soy un caballero!

Mora se acercó a la vitrina con su lupa. La cerradura no estaba rota: la habían abierto con una llave. En el piso, junto a la vitrina, encontró unos pelos finitos de color rojo, como de lana. Y en la manija de la vitrina, una mancha brillante, como de grasa.

—Tía, ¿quién tenía llave de la vitrina?

—La licenciada Ríos, supongo —dijo tía Clara—. Y quizás alguien del tren.

Mora habló con la licenciada.

—Sólo hay dos llaves —le dijo la mujer—. Yo tengo una, y la otra la tiene el personal del tren, por seguridad.

Revisaron todos los equipajes. No apareció el charango. Ni en el bolso del señor Benavente, ni en la mochila de Hans, ni en las bolsas de la señora Quispe, ni en ningún otro lado.

—Es imposible —dijo el cabo Mamaní, rascándose la cabeza—. Un charango no se puede esconder en el aire.

Mora miró por la ventana. Afuera, el tren avanzaba sobre un puente altísimo, de hierro, sobre un precipicio enorme. Era el viaducto La Polvorilla.`
      },
      {
        title: 'Lo que vio la lupa',
        illustration: 'montanas',
        content: `Mora repasó sus notas con cuidado, como le había enseñado su amigo Ulises: no hay que acusar sin pruebas, y las pistas pequeñas también importan.

Primera pista: la vitrina se abrió con llave. Segunda: pelos rojos de lana en el piso. Tercera: una mancha de grasa brillante en la manija. Cuarta: el robo fue durante el túnel, en la oscuridad, así que el ladrón sabía exactamente cuándo iba a entrar el tren al túnel y cuánto iba a durar.

—El señor Benavente quería el charango —dijo tía Clara—. Es el sospechoso perfecto.

—Demasiado perfecto —contestó Mora—. Y además, él no sabía cuándo venía el túnel. Es la primera vez que viaja. Lo dijo esta mañana.

Mora miró a su alrededor. ¿Quién conocía el recorrido de memoria? ¿Quién tenía acceso a la llave del personal del tren? ¿Quién usaba algo de lana roja?

Fermín, el guía, pasó por el pasillo, sonriendo, con su poncho rojo. Mora vio que tenía las manos un poco brillantes. Él dijo que se había puesto protector solar, porque en la altura el sol quema mucho.

Mora sintió un cosquilleo en la nuca, el que sentía siempre que estaba cerca de resolver un caso.

—Tía —susurró—, si yo me robara algo en un tren y no lo pudiera tener encima, porque me van a revisar, ¿qué haría?

—Lo escondería en algún lugar del tren y lo buscaría después, cuando todos se fueran.

—Exacto. Y ¿quién se queda en el tren cuando todos se van?

Tía Clara abrió muy grandes los ojos.

—El personal del tren.`
      },
      {
        title: 'El escondite',
        illustration: 'escuela',
        content: `Mora le contó sus deducciones al cabo Mamaní en voz baja. El policía dudó: Fermín era muy querido por todos y trabajaba en el tren hacía años. Pero aceptó revisar los lugares que sólo podía usar el personal.

En un armario de mantenimiento, junto a los baños, detrás de unas cajas de agua mineral, encontraron una bolsa de tela. Adentro, envuelto en una manta, estaba el charango de plata, intacto.

Cuando le mostraron la bolsa, Fermín se puso pálido. Primero dijo que no sabía nada. Pero en la manija de la vitrina había quedado la misma crema brillante que él tenía en las manos, y en la manta que envolvía el charango había pelitos rojos de su poncho. Además, él tenía la segunda llave.

Al final, Fermín confesó. Tenía muchas deudas, y un comprador desconocido le había ofrecido mucho dinero por el charango. Pensaba sacarlo del tren por la noche, cuando ya no hubiera pasajeros.

—Me equivoqué —dijo, mirando el piso—. Este charango es parte de la historia de mi tierra. No tendría que haberlo tocado.

El señor Benavente, que había estado ofendidísimo toda la mañana, se acercó a Mora y le dio la mano.

—Señorita, gracias por no dejarse llevar por las apariencias. Todos pensaban que yo era el ladrón.

La licenciada Ríos abrazó el charango como si fuera un bebé. Esa tarde, en San Antonio de los Cobres, se hizo la muestra. Un músico del pueblo tocó el charango de plata frente a todos: sonaba dulce, agudo, como si cantara.

Esa noche, en el hotel, Mora le escribió un mensaje a Benja y a Ulises, del Club Lupa:

"Caso N.º 8: resuelto. Lección: el sospechoso más evidente no siempre es el culpable. Y las pistas más chiquitas, como un pelito de lana, pueden ser las más importantes".`
      }
    ],
    quiz: [
      { question: '¿Por qué en la altura algunas personas se marean?', options: ['Porque hace calor', 'Porque hay menos oxígeno en el aire', 'Porque el tren va rápido', 'Por la comida'], correct: 1, explanation: 'A más de cuatro mil metros el aire tiene menos oxígeno: se llama apunamiento.' },
      { question: '¿Cuándo robaron el charango?', options: ['En la estación', 'Mientras el tren pasaba por un túnel oscuro', 'A la noche', 'En el viaducto'], correct: 1, explanation: 'El ladrón aprovechó la oscuridad y sabía cuánto duraba el túnel.' },
      { question: '¿Por qué Mora descartó al señor Benavente?', options: ['Porque era amable', 'Porque no conocía el recorrido ni tenía llave', 'Porque estaba dormido', 'Porque era rico'], correct: 1, explanation: 'El ladrón necesitaba conocer el túnel y tener la llave.' },
      { question: '¿Qué pistas incriminaron a Fermín?', options: ['Una foto', 'Pelos de lana roja de su poncho, la crema en la manija y la segunda llave', 'Una confesión escrita', 'Una huella de zapato'], correct: 1, explanation: 'Las pistas pequeñas resultaron decisivas.' }
    ]
  }
];
