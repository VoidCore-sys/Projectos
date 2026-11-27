/*
 * Clásicos agregados a pedido. Todos son obras de dominio público en Argentina y en EE. UU.
 * Los textos son adaptaciones propias en español (no se usa ninguna traducción protegida)
 * y siguen las obras originales, no versiones cinematográficas.
 */
const PD = (obra) => `Adaptación libre de ${obra}, obra de dominio público en Argentina y en Estados Unidos`;

module.exports = [
  /* ------------------------- Sección 1: 1.º a 3.º ------------------------- */
  {
    slug: 'el-gato-con-botas',
    title: 'El gato con botas',
    author: 'Charles Perrault (adaptación de la Biblioteca)',
    license: PD('«El gato con botas» de Charles Perrault (1697)'),
    synopsis: 'Un molinero deja a su hijo menor una sola herencia: un gato. El muchacho se pone triste, pero el gato le pide un par de botas y una bolsa, y le promete que no se va a arrepentir. Con astucia y mucho ingenio, el gato convertirá a su dueño en el Marqués de Carabás.',
    genres: ['Cuento', 'Aventura', 'Humor'],
    gradeMin: 1, gradeMax: 3,
    cover: { scene: 'castillo', c1: '#ffcb77', c2: '#fe6d73' },
    chapters: [
      {
        title: 'Una herencia muy rara',
        illustration: 'huerta',
        content: `Había una vez un molinero que tenía tres hijos. Cuando el molinero murió, dejó todo lo que tenía: un molino, un burro y un gato.

El hijo mayor se quedó con el molino. El del medio, con el burro. Y al más chico le tocó el gato.

—¡Qué mala suerte! —se lamentó el muchacho—. Mis hermanos pueden trabajar con el molino y con el burro. Pero yo, ¿qué hago con un gato?

El gato, que lo había escuchado todo, se le acercó con aire serio.

—No te pongas triste, amo. Sólo dame un par de botas para caminar por el monte y una bolsa. Vas a ver que no te tocó tan mal herencia como pensás.

El muchacho no le tenía mucha fe, pero como el gato era muy listo para cazar ratones, decidió darle lo que pedía. Le compró unas botas de cuero y una bolsa.

El gato se puso las botas, se miró en un charco y quedó muy contento. Se colgó la bolsa al cuello, puso adentro un poco de lechuga y se fue al monte. Se acostó como si estuviera dormido, esperando. Al rato, un conejo joven y curioso se metió en la bolsa para comer la lechuga. ¡Zas! El gato cerró la bolsa.

Muy orgulloso, el gato se fue directo al palacio del rey.`
      },
      {
        title: 'Regalos para el rey',
        illustration: 'castillo',
        content: `En el palacio, el gato hizo una gran reverencia frente al rey.

—Majestad, le traigo este conejo de regalo de parte de mi señor, el Marqués de Carabás.

El nombre se lo había inventado él, porque le pareció muy elegante.

—Decile a tu señor que se lo agradezco mucho —contestó el rey.

Al día siguiente, el gato cazó dos perdices y se las llevó también al rey. Y así, durante semanas, le llevó regalos "de parte del Marqués de Carabás". El rey estaba encantado con ese marqués tan generoso que nunca había visto.

Un día, el gato se enteró de que el rey iba a pasear en carroza por la orilla del río con su hija, la princesa.

—Amo —le dijo al muchacho—, hacé lo que te digo y vas a tener suerte. Metete a bañar en el río, en el lugar que yo te muestre, y dejá el resto en mis manos.

El muchacho no entendía nada, pero obedeció. Mientras se bañaba, el gato escondió su ropa vieja detrás de una piedra. Cuando pasó la carroza, el gato empezó a gritar:

—¡Socorro! ¡Socorro! ¡Unos ladrones le robaron la ropa al Marqués de Carabás!

El rey reconoció al gato que le llevaba regalos. Mandó a sus guardias a ayudar y a buscar uno de sus mejores trajes. Cuando el muchacho se lo puso, parecía un verdadero marqués. Era tan buen mozo que la princesa lo miró y sonrió. El rey lo invitó a subir a la carroza.`
      },
      {
        title: 'El castillo del ogro',
        illustration: 'castillo',
        content: `El gato salió corriendo delante de la carroza. Llegó a unos campos donde unos campesinos cortaban el trigo.

—Cuando pase el rey y les pregunte de quién son estos campos —les dijo—, contesten que son del Marqués de Carabás. ¡Es muy importante!

Cuando pasó la carroza, el rey preguntó:

—¿De quién son estos campos tan hermosos?

—¡Del Marqués de Carabás! —contestaron los campesinos.

Y así pasó en cada campo, en cada prado y en cada bosque. El rey estaba cada vez más impresionado.

Pero en realidad todas esas tierras eran de un ogro, un gigante muy rico y muy malo que vivía en un castillo enorme. El gato llegó al castillo y pidió hablar con él.

—Señor Ogro —le dijo, con una reverencia—, me contaron que usted puede convertirse en cualquier animal. Que puede ser un león o un elefante. No lo puedo creer.

—¡Es verdad! —rugió el ogro, y se convirtió en un león enorme.

El gato se asustó tanto que trepó al techo. Cuando el ogro volvió a su forma, el gato bajó.

—Impresionante. Pero seguro que convertirse en un animal muy chiquito es imposible. Por ejemplo, en un ratón.

—¿Imposible? ¡Mirá!

Y el ogro se convirtió en un ratoncito que corría por el piso. ¡El gato saltó y se lo comió de un bocado!

Cuando llegó la carroza, el gato los esperaba en la puerta del castillo.

—¡Bienvenidos al castillo del Marqués de Carabás!

El rey quedó maravillado. Poco tiempo después, el muchacho y la princesa se casaron. Y el gato se convirtió en un gran señor, que ya no cazaba ratones por necesidad, sino sólo de vez en cuando, para divertirse.

Moraleja: el ingenio y la astucia a veces valen más que una gran herencia.`
      }
    ],
    quiz: [
      { question: '¿Qué le dejó el molinero a su hijo menor?', options: ['Un molino', 'Un burro', 'Un gato', 'Un castillo'], correct: 2, explanation: 'Al principio el muchacho pensó que era la peor herencia.' },
      { question: '¿Qué le pidió el gato a su amo?', options: ['Comida', 'Unas botas y una bolsa', 'Un sombrero', 'Una casa'], correct: 1, explanation: 'Con eso empezó su plan.' },
      { question: '¿Cómo venció el gato al ogro?', options: ['Peleando', 'Lo convenció de convertirse en ratón y se lo comió', 'Lo encerró', 'Llamó al rey'], correct: 1, explanation: 'Usó la astucia en lugar de la fuerza.' },
      { question: '¿Qué cualidad del gato lo ayudó más?', options: ['Su fuerza', 'Su ingenio', 'Su tamaño', 'Su velocidad'], correct: 1, explanation: 'Todo lo logró pensando planes inteligentes.' }
    ]
  },
  {
    slug: 'caperucita-roja',
    title: 'Caperucita Roja',
    author: 'Charles Perrault y hermanos Grimm (adaptación de la Biblioteca)',
    license: PD('«Caperucita Roja» de Charles Perrault (1697) y de los hermanos Grimm (1812)'),
    synopsis: 'Una nena con una capa roja atraviesa el bosque para llevarle una canasta a su abuela enferma. Su mamá le pide que no se desvíe del camino ni hable con desconocidos. Pero en el bosque vive un lobo muy astuto.',
    genres: ['Cuento', 'Valores'],
    gradeMin: 1, gradeMax: 2,
    cover: { scene: 'bosque', c1: '#ff8fa3', c2: '#9b2226' },
    chapters: [
      {
        title: 'La capa roja',
        illustration: 'bosque',
        content: `Había una vez, en un pueblito a la orilla del bosque, una nena muy dulce a la que todos querían. Su abuela le había cosido una capa roja con capucha, y le quedaba tan linda que la nena la usaba todos los días. Por eso, todos la llamaban Caperucita Roja.

Una mañana, su mamá le dijo:

—Caperucita, la abuela está enferma. Llevale esta canasta con pan, miel y un frasco de dulce. Vive del otro lado del bosque. Pero acordate: no te salgas del camino y no hables con desconocidos.

—Sí, mamá. Te lo prometo.

Caperucita tomó la canasta y salió, muy contenta, cantando una canción.

El bosque era lindo. Los pájaros cantaban, las mariposas volaban de flor en flor y el sol pasaba entre las hojas. Caperucita iba por el camino, como le había dicho su mamá.

Pero detrás de un árbol, alguien la estaba mirando. Era un lobo grande, de pelo gris y ojos amarillos. El lobo tenía mucha hambre, y pensó: "Esa nena se ve muy rica. Pero si me la como acá, los leñadores me van a ver. Tengo que ser astuto".

Entonces salió de atrás del árbol, con su voz más amable.

—Buenos días, nena linda. ¿Adónde vas tan temprano?`
      },
      {
        title: 'El camino largo y el camino corto',
        illustration: 'huerta',
        content: `Caperucita se había olvidado de lo que le había dicho su mamá. El lobo le parecía muy simpático.

—Voy a la casa de mi abuela, que está enferma. Vive del otro lado del bosque, en la casita que está debajo de los tres robles grandes.

—¡Qué nena tan buena! —dijo el lobo—. ¿Y por qué no le llevás también un ramo de flores? Mirá qué lindas que hay por allá.

Caperucita miró. Era cierto: un poco más lejos del camino había un campo lleno de flores de todos los colores.

—¡A la abuela le van a encantar!

Y se salió del camino para juntar flores. Mientras tanto, el lobo corrió, corrió y corrió por un atajo hasta la casa de la abuela. Golpeó la puerta.

—¿Quién es? —preguntó la abuela desde la cama.

—Soy yo, Caperucita —dijo el lobo, con voz finita—. Te traigo pan y miel.

—Levantá el pestillo y pasá, querida.

El lobo entró. Pero la abuela, que tenía muy buena vista aunque estuviera enferma, vio la cola gris por la puerta, saltó de la cama y se escondió dentro del ropero. El lobo buscó por todos lados y no la encontró. Entonces se puso el camisón y el gorro de dormir de la abuela, se metió en la cama y se tapó hasta la nariz, esperando a Caperucita.`
      },
      {
        title: '¡Qué ojos tan grandes tenés!',
        illustration: 'casona',
        content: `Al rato llegó Caperucita con la canasta y un ramo enorme de flores. La puerta estaba abierta. Entró y se acercó a la cama.

—Abuela, ¡qué orejas tan grandes tenés!

—Son para escucharte mejor —dijo el lobo.

—Abuela, ¡qué ojos tan grandes tenés!

—Son para verte mejor.

—Abuela, ¡qué manos tan grandes tenés!

—Son para abrazarte mejor.

—Abuela… ¡qué boca tan grande tenés!

—¡Es para comerte mejor!

Y el lobo saltó de la cama. Caperucita gritó tan fuerte que la escucharon en todo el bosque. Corrió alrededor de la mesa, el lobo detrás de ella, tirando sillas y platos.

Justo en ese momento pasaba por ahí un leñador. Al escuchar los gritos, entró corriendo con su hacha. El lobo, al verlo, se asustó tanto que saltó por la ventana y huyó al fondo del bosque. Nunca más volvió por ahí.

La abuela salió del ropero y abrazó a Caperucita. El leñador se quedó a tomar la merienda con ellas: comieron pan con miel y pusieron las flores en un florero.

—Abuela, perdón —dijo Caperucita—. Mamá me dijo que no me saliera del camino y que no hablara con desconocidos. Y yo no le hice caso.

—Lo importante es que aprendiste —le dijo la abuela.

Y desde ese día, Caperucita siempre fue por el camino. Y cuando un desconocido le hablaba, por más amable que pareciera, se iba enseguida a buscar a un adulto de confianza.

Moraleja: no todos los que hablan con dulzura tienen buenas intenciones.`
      }
    ],
    quiz: [
      { question: '¿Qué le pidió su mamá a Caperucita?', options: ['Que corriera', 'Que no se saliera del camino ni hablara con desconocidos', 'Que juntara flores', 'Que buscara al leñador'], correct: 1, explanation: 'Eran dos consejos muy importantes.' },
      { question: '¿Qué hizo el lobo para llegar primero?', options: ['Voló', 'Distrajo a Caperucita con las flores y tomó un atajo', 'Se escondió', 'Le pidió ayuda a la abuela'], correct: 1, explanation: 'El lobo fue astuto y engañador.' },
      { question: '¿Dónde se escondió la abuela?', options: ['Bajo la cama', 'En el ropero', 'En el techo', 'En el bosque'], correct: 1, explanation: 'Vio la cola del lobo y se escondió a tiempo.' },
      { question: '¿Qué aprendió Caperucita?', options: ['Que el bosque es aburrido', 'Que hay que hacer caso a los consejos y no confiar en desconocidos', 'Que los lobos son amigos', 'Que hay que juntar flores'], correct: 1, explanation: 'Si un desconocido te habla, buscá a un adulto de confianza.' }
    ]
  },
  {
    slug: 'la-guerra-de-los-yacares',
    title: 'La guerra de los yacarés',
    author: 'Horacio Quiroga (adaptación de la Biblioteca)',
    license: PD('«La guerra de los yacarés» de Horacio Quiroga, de Cuentos de la selva (1918)'),
    synopsis: 'En un río de la selva, donde nunca había entrado el hombre, viven cientos de yacarés. Un día escuchan un ruido extraño: ¡un barco de vapor! Los yacarés deciden defender su río, aunque para eso tendrán que pedir ayuda al viejo y sabio surubí.',
    genres: ['Cuento', 'Aventura', 'Naturaleza'],
    gradeMin: 2, gradeMax: 3,
    cover: { scene: 'oceano', c1: '#90be6d', c2: '#277da1' },
    chapters: [
      {
        title: 'El ruido en el río',
        illustration: 'oceano',
        content: `En un río muy grande, en un país de selva donde nunca había entrado el hombre, vivían muchísimos yacarés. Eran más de cien, o más de mil. Comían pescados, y bichos que iban a tomar agua al río, pero sobre todo pescados. Dormían la siesta en la arena de la orilla y a veces jugaban sobre el agua cuando había noches de luna.

Todos vivían muy tranquilos y contentos. Pero una tarde, mientras dormían la siesta, un yacaré se despertó de golpe y levantó la cabeza, porque creía haber sentido un ruido. Prestó atención y, lejos, muy lejos, oyó efectivamente un ruido sordo y profundo.

—¡Despierten! —gritó al yacaré que dormía a su lado—. ¡Viene algo!

Todos se despertaron y se quedaron mirando río abajo. El ruido crecía. Al rato vieron un humito a lo lejos, y después una cosa enorme que avanzaba por el agua echando humo y haciendo "¡chas! ¡chas!" con unas ruedas que golpeaban el río.

—¿Qué es eso? —preguntó un yacaré joven, asustado.

El yacaré más viejo y más sabio, que tenía sólo dos dientes sanos en los costados de la boca, y que una vez había hecho un viaje hasta el mar, dijo de repente:

—¡Yo sé lo que es! ¡Es una ballena! Son grandes, echan agua blanca por la nariz y después la tragan.

Los yacarés chicos se asustaron muchísimo y se metieron bajo el agua gritando: "¡Es una ballena!".

Pero no era una ballena. Era un vapor, un barco de los hombres. Pasó echando humo, hizo mucho ruido, y se fue río arriba. Los yacarés, desde el agua, lo miraban con los ojos muy abiertos.`
      },
      {
        title: 'El dique de troncos',
        illustration: 'bosque',
        content: `Al día siguiente, el vapor volvió a pasar. Y al otro día también. Con tanto ruido, los peces se asustaban y se iban lejos, y los yacarés empezaron a pasar hambre.

—Si el vapor sigue pasando, nos vamos a quedar sin pescados —dijo el yacaré viejo—. Tenemos que impedirlo.

—¿Pero cómo? ¡Es enorme!

El yacaré viejo pensó un largo rato. Después dijo:

—Vamos a hacer un dique. Vamos a cerrar el río con troncos, para que el vapor no pueda pasar.

Todos se pusieron a trabajar. Fueron al bosque de la orilla y cortaron árboles con los dientes, los más grandes que encontraron. Los arrastraron hasta el río y los clavaron en el fondo, uno al lado del otro, bien juntos, cruzando el agua de una orilla a la otra. Trabajaron toda la noche, sin descansar.

Al amanecer, el dique estaba terminado. Era un muro de troncos tan apretado que ni un pescadito podía pasar.

A media mañana se escuchó otra vez el "¡chas! ¡chas!". El vapor llegó, vio el dique, y se detuvo. Los hombres miraron desde arriba, se rascaron la cabeza, discutieron… y al final dieron media vuelta y se fueron río abajo.

¡Los yacarés gritaron de alegría! Hicieron una fiesta en la arena, nadaron, saltaron y cantaron hasta la noche.

Pero el yacaré viejo no festejaba.

—Van a volver —dijo—. Y la próxima vez van a volver con algo peor.`
      },
      {
        title: 'El buque de guerra',
        illustration: 'barco',
        content: `El yacaré viejo tenía razón. Unos días después, se escuchó un ruido distinto, más grave y más fuerte. Era otro barco, mucho más grande, de color gris, con cañones. Era un buque de guerra.

Se detuvo frente al dique y, de pronto: ¡bum! ¡bum! ¡bum! Los cañones dispararon. Los troncos volaron por el aire hechos astillas. En pocos minutos, el dique quedó destruido. Muchos peces del río murieron con las explosiones.

Los yacarés huyeron asustados hasta el fondo del río. Esa noche, tristes y lastimados, se juntaron todos.

—Necesitamos ayuda —dijo el yacaré viejo—. Hay alguien que puede ayudarnos: el Surubí.

El Surubí era un pez viejo y enorme, de bigotes largos, que vivía solo en un pozo muy profundo del río. Hacía mucho tiempo, un barco de los hombres había perdido allí una cosa extraña: un torpedo. Y el Surubí lo guardaba en su cueva, como un tesoro.

Los yacarés fueron a verlo.

—Surubí —le dijeron—, los hombres destruyeron nuestro dique y quieren quedarse con el río. Sus cañones mataron a muchos peces, tus hermanos. ¿Nos prestarías tu torpedo?

El Surubí se quedó en silencio. Después, con su voz lenta y grave, contestó:

—El río es de los que viven en él. Les voy a prestar el torpedo. Y les voy a enseñar cómo usarlo.`
      },
      {
        title: 'El río de los yacarés',
        illustration: 'oceano',
        content: `Los yacarés trabajaron toda la noche y construyeron un dique nuevo, todavía más fuerte que el primero. Y en el medio, escondido bajo el agua, pusieron el torpedo del Surubí, apuntando río abajo.

A la mañana siguiente, volvió el buque de guerra, gris y enorme. Los hombres vieron el nuevo dique y se rieron.

—¡Otra vez estos troncos! —dijeron—. Los vamos a volar como la otra vez.

Pero antes de que pudieran disparar, los yacarés más fuertes empujaron el torpedo con la cabeza. El torpedo salió disparado bajo el agua, dejando una línea de espuma, y chocó contra el costado del buque. Se escuchó una explosión terrible, y el agua saltó hasta el cielo.

El buque de guerra empezó a hundirse despacio. Los marineros bajaron rápido a los botes y remaron hacia la orilla, muy asustados, y se alejaron por la selva para no volver nunca más.

Los yacarés se acercaron nadando a ver cómo el buque gris desaparecía bajo el agua. Después, despacito, volvieron a la arena.

Desde ese día, ningún barco volvió a entrar en ese río. Los peces regresaron, el agua se calmó y los yacarés siguieron durmiendo la siesta al sol, tranquilos y contentos, como siempre.

Y el viejo Surubí, en su pozo profundo, se quedó con un recuerdo nuevo para contarles a los pececitos jóvenes: el de la vez que los habitantes del río defendieron juntos su casa.`
      }
    ],
    quiz: [
      { question: '¿Qué creyó el yacaré viejo que era el vapor?', options: ['Un pez gigante', 'Una ballena', 'Un tronco', 'Un yacaré'], correct: 1, explanation: 'Nunca había visto un barco de vapor.' },
      { question: '¿Por qué los yacarés querían que el vapor no pasara?', options: ['Porque era feo', 'Porque espantaba a los peces y se quedaban sin comida', 'Porque querían subirse', 'Porque les tiraba agua'], correct: 1, explanation: 'El ruido alejaba a los pescados.' },
      { question: '¿Quién los ayudó con un torpedo?', options: ['El tigre', 'El viejo Surubí', 'Un hombre', 'Una tortuga'], correct: 1, explanation: 'El Surubí guardaba un torpedo perdido por un barco.' },
      { question: '¿Qué enseña el cuento?', options: ['Que el río es de los barcos', 'Que trabajando juntos se puede defender la casa de todos', 'Que los yacarés son malos', 'Que hay que dormir mucho'], correct: 1, explanation: 'Los habitantes del río se unieron para protegerlo.' }
    ]
  },

  /* ------------------------- Sección 2: 4.º y 5.º ------------------------- */
  {
    slug: 'alicia-en-el-pais-de-las-maravillas',
    title: 'Alicia en el País de las Maravillas',
    author: 'Lewis Carroll (adaptación de la Biblioteca)',
    license: PD('«Las aventuras de Alicia en el País de las Maravillas» de Lewis Carroll (1865)'),
    synopsis: 'Una tarde aburrida, Alicia ve pasar a un Conejo Blanco con chaleco y reloj que dice: "¡Llego tarde!". Lo sigue por una madriguera y cae a un mundo donde nada tiene sentido: se agranda y se achica, toma el té con un Sombrerero que vive en las seis de la tarde y juega al croquet con una reina que quiere cortarle la cabeza a todos.',
    genres: ['Fantasía', 'Aventura', 'Humor'],
    gradeMin: 4, gradeMax: 5,
    featured: true,
    cover: { scene: 'huerta', c1: '#a2d2ff', c2: '#cdb4db' },
    chapters: [
      {
        title: 'Por la madriguera del conejo',
        illustration: 'bosque',
        content: `Alicia empezaba a aburrirse de estar sentada junto a su hermana en la orilla del río sin nada que hacer. Una o dos veces había espiado el libro que su hermana leía, pero no tenía dibujos ni diálogos. "¿Y para qué sirve un libro sin dibujos ni diálogos?", pensaba Alicia.

De pronto, un Conejo Blanco de ojos rosados pasó corriendo a su lado. Eso no tenía nada de raro. Tampoco le pareció muy raro que el Conejo dijera: "¡Ay, ay, ay! ¡Voy a llegar tarde!". Pero cuando el Conejo sacó un reloj del bolsillo del chaleco, lo miró y siguió corriendo, Alicia se levantó de un salto. Nunca había visto un conejo con chaleco, y mucho menos con reloj.

Lo siguió por el campo y alcanzó a verlo meterse en una madriguera bajo un cerco. Alicia entró detrás de él, sin pensar ni por un momento cómo iba a salir.

La madriguera seguía derecha como un túnel y de repente se hundía. Alicia cayó por lo que parecía un pozo muy profundo. Caía tan despacio que tuvo tiempo de mirar a su alrededor: las paredes estaban llenas de armarios y estantes con libros, mapas y frascos. Tomó uno que decía "Mermelada de naranja", pero estaba vacío.

"¿Me estaré cayendo hasta el otro lado de la Tierra?", pensó. "¡Qué gracioso sería salir entre esa gente que camina cabeza abajo!".

Por fin, ¡pum!, cayó sobre un montón de hojas secas. Estaba en un salón largo, lleno de puertas, todas cerradas. Sobre una mesita de cristal había una llave de oro, pequeñísima, que abría una puertita de cuarenta centímetros. Por ella se veía el jardín más hermoso del mundo. Pero Alicia era demasiado grande para pasar.

Sobre la mesa apareció un frasquito con una etiqueta: "BÉBEME". Alicia lo probó (tenía gusto a tarta de cereza, a pollo asado y a tostadas con manteca) y empezó a achicarse, como un telescopio que se cierra, hasta medir apenas veinticinco centímetros. Pero, ¡qué mala suerte!: se había olvidado la llavecita sobre la mesa, y ahora no la alcanzaba.`
      },
      {
        title: 'Un consejo de una oruga',
        illustration: 'huerta',
        content: `Bajo la mesa, Alicia encontró una cajita con un pastel que decía "CÓMEME". Lo comió y empezó a crecer, y crecer, y crecer, hasta que su cabeza chocó contra el techo.

—¡Cada vez más curiosísimo! —exclamó (estaba tan sorprendida que se olvidó de hablar bien).

Como no podía pasar por la puerta ni grande ni chica, se puso a llorar. Lloró litros de lágrimas, hasta que se formó un charco enorme alrededor. Entonces encontró un abanico, se abanicó, se volvió a achicar… y resbaló en su propio charco de lágrimas, que ahora era como un mar. Allí nadaban también un ratón, un pato, un loro, un aguilucho y otros animales raros.

Cuando todos salieron del agua, empapados, el Dodó propuso una "carrera loca" para secarse: cada uno empezaba cuando quería y terminaba cuando quería. Al final, el Dodó declaró:

—¡Todos ganaron, y todos deben tener premio!

Más tarde, Alicia encontró sobre un hongo a una Oruga azul, que fumaba una larga pipa con mucha calma.

—¿Quién eres tú? —le preguntó la Oruga, con voz de sueño.

—Yo… no sé muy bien, señora —contestó Alicia—. Sé quién era cuando me levanté esta mañana, pero desde entonces cambié tantas veces…

—Explícate.

—No me puedo explicar, porque no soy yo misma, ¿ve?

—No veo —dijo la Oruga.

Antes de irse, la Oruga le dio un consejo:

—Un lado del hongo te hará crecer; el otro lado te hará achicar.

Alicia guardó un pedacito de cada lado. Probando un poquito de uno y un poquito del otro, aprendió a ponerse del tamaño que quería.`
      },
      {
        title: 'Una merienda de locos',
        illustration: 'reloj',
        content: `En el camino, Alicia vio una sonrisa enorme, flotando en una rama. Poco a poco apareció el resto: era el Gato de Cheshire, un gato que sonreía de oreja a oreja.

—¿Me podría decir qué camino tengo que tomar? —le preguntó Alicia.

—Eso depende mucho de adónde quieras llegar —dijo el Gato.

—No me importa mucho adónde…

—Entonces, no importa qué camino tomes.

El Gato le explicó que por un lado vivía un Sombrerero y por el otro una Liebre de Marzo, y que los dos estaban locos.

—Pero yo no quiero estar con locos —protestó Alicia.

—Oh, eso no lo puedes evitar —dijo el Gato—. Aquí todos estamos locos. Yo estoy loco. Tú estás loca.

—¿Y cómo sabe que yo estoy loca?

—Debes estarlo, si no, no habrías venido.

Y el Gato desapareció muy despacio, empezando por la cola y terminando por la sonrisa, que se quedó flotando un rato en el aire.

Alicia llegó a una casa donde, bajo un árbol, había una mesa larguísima. En una punta tomaban el té el Sombrerero, la Liebre de Marzo y un Lirón dormido, al que usaban como almohadón.

—¡No hay lugar! ¡No hay lugar! —gritaron al verla llegar.

—¡Hay muchísimo lugar! —dijo Alicia, indignada, y se sentó.

—¿Por qué se parece un cuervo a un escritorio? —le preguntó el Sombrerero.

Alicia pensó un buen rato.

—Me rindo. ¿Cuál es la respuesta?

—No tengo la menor idea —dijo el Sombrerero.

Le explicaron que, desde que el Sombrerero se había peleado con el Tiempo, eran siempre las seis de la tarde, la hora del té. Por eso no tenían tiempo de lavar las tazas, y se iban corriendo de lugar en la mesa a medida que las ensuciaban.

—¡Es la merienda más tonta a la que fui en mi vida! —dijo Alicia, y se fue.`
      },
      {
        title: 'El juicio de la Reina de Corazones',
        illustration: 'castillo',
        content: `Por fin, Alicia llegó al hermoso jardín que había visto por la puertita. Allí estaban la Reina y el Rey de Corazones, rodeados de una corte de naipes: los soldados eran tréboles, los nobles eran diamantes y los príncipes eran corazones.

La Reina tenía un carácter terrible. Por cualquier cosa, gritaba:

—¡Que le corten la cabeza!

Invitó a Alicia a jugar al croquet. Pero era el croquet más raro del mundo: las pelotas eran erizos vivos, los mazos eran flamencos y los arcos eran soldados doblados. Los erizos se iban caminando, los flamencos se daban vuelta para mirar a los jugadores y los soldados se paraban y se iban. Y la Reina, furiosa, gritaba "¡Que le corten la cabeza!" cada medio minuto. Por suerte, el Rey, en voz baja, perdonaba a todos.

Después hubo un juicio. Acusaban a la Sota de Corazones de haberse robado unas tartas que había hecho la Reina. El Rey era el juez, y los jurados eran doce animalitos que anotaban cualquier cosa en sus pizarras.

Llamaron a declarar al Sombrerero, que temblaba tanto que mordió la taza en lugar del pan. Después llamaron a la cocinera, que no dijo nada útil. Y al final llamaron a Alicia.

Mientras tanto, Alicia había empezado a crecer otra vez, sin haber comido nada.

—¡Que dicten primero la sentencia y después el veredicto! —ordenó la Reina.

—¡Qué disparate! —dijo Alicia en voz alta—. ¡Primero se decide si es culpable!

—¡Que le corten la cabeza a esta chica! —gritó la Reina, roja de furia.

Pero Alicia ya era grande, de su tamaño normal, y no tenía ningún miedo.

—¿Y a quién le importa? —dijo—. ¡No son más que una baraja de cartas!

En ese momento, todos los naipes se elevaron en el aire y se le vinieron encima. Alicia dio un grito, medio de miedo y medio de enojo, trató de apartarlos… y se encontró acostada en la orilla del río, con la cabeza en la falda de su hermana, que le sacaba unas hojas secas que le habían caído en la cara.

—¡Despertate, Alicia! ¡Qué siesta tan larga!

—¡Ay, tuve un sueño tan curioso! —dijo Alicia.

Y le contó todas las extrañas aventuras que acaban de leer.`
      }
    ],
    quiz: [
      { question: '¿Por qué Alicia siguió al Conejo Blanco?', options: ['Porque tenía hambre', 'Porque nunca había visto un conejo con chaleco y reloj', 'Porque la llamó', 'Porque se perdió'], correct: 1, explanation: 'La curiosidad la llevó a la madriguera.' },
      { question: '¿Qué le enseñó la Oruga?', options: ['A nadar', 'Que un lado del hongo la hacía crecer y el otro achicar', 'A tomar té', 'A jugar al croquet'], correct: 1, explanation: 'Así pudo controlar su tamaño.' },
      { question: '¿Por qué siempre eran las seis de la tarde en la merienda del Sombrerero?', options: ['Porque el reloj se rompió', 'Porque el Sombrerero se había peleado con el Tiempo', 'Porque les gustaba', 'Porque era de noche'], correct: 1, explanation: 'Es uno de los muchos disparates del libro.' },
      { question: '¿Qué hacía siempre la Reina de Corazones?', options: ['Cantaba', 'Gritaba "¡Que le corten la cabeza!"', 'Cocinaba tartas', 'Dormía'], correct: 1, explanation: 'Aunque el Rey perdonaba a todos en secreto.' },
      { question: '¿Cómo termina la historia?', options: ['Alicia se queda a vivir allí', 'Alicia despierta y descubre que todo fue un sueño', 'La Reina la atrapa', 'El Conejo la lleva a su casa'], correct: 1, explanation: 'Se despierta en la orilla del río junto a su hermana.' }
    ]
  },
  {
    slug: 'peter-pan',
    title: 'Peter Pan',
    author: 'J. M. Barrie (adaptación de la Biblioteca)',
    license: PD('la novela «Peter y Wendy» de J. M. Barrie (1911)'),
    synopsis: 'Una noche, un chico que nunca quiso crecer entra por la ventana de la casa de los Darling buscando su sombra. Así empieza el viaje de Wendy, Juan y Miguel al País de Nunca Jamás, donde viven los Niños Perdidos, las sirenas, las hadas y el temible capitán Garfio.',
    genres: ['Fantasía', 'Aventura', 'Novela'],
    gradeMin: 4, gradeMax: 5,
    cover: { scene: 'luna', c1: '#264653', c2: '#2a9d8f' },
    chapters: [
      {
        title: 'La sombra perdida',
        illustration: 'ciudad',
        content: `Todos los chicos crecen, menos uno.

En una casa de Londres vivía la familia Darling: el señor y la señora Darling, y sus tres hijos, Wendy, Juan y Miguel. Como no tenían mucho dinero, la niñera de los chicos era una perra terranova muy grande y muy seria, llamada Naná, que los bañaba, les daba los remedios y los llevaba a la escuela.

Una noche, mientras la señora Darling cosía junto a la chimenea del cuarto de los chicos, se quedó dormida. Al despertarse, vio a un chico en la ventana: tenía más o menos la edad de Wendy, estaba vestido con hojas secas y conservaba todos sus dientes de leche. Naná saltó ladrando, y el chico escapó. Pero la ventana se cerró de golpe y le cortó la sombra, que quedó en el cuarto. La señora Darling la enrolló y la guardó en un cajón.

Unos días después, el chico volvió a buscar su sombra. Esta vez lo acompañaba una lucecita que volaba rapidísimo: era un hada llamada Campanilla, que no hablaba con palabras sino con un sonido de campanitas.

El chico encontró la sombra, pero no pudo pegársela. Probó con jabón. No funcionó. Se sentó en el piso y se puso a llorar. El llanto despertó a Wendy.

—¿Por qué llorás? —le preguntó—. ¿Cómo te llamás?

—Peter Pan.

Wendy, que era muy práctica, sacó aguja e hilo y le cosió la sombra a los pies. Peter saltó de alegría, sin agradecerle nada, porque era muy orgulloso.

Peter le contó que vivía en el País de Nunca Jamás, con los Niños Perdidos: chicos que se habían caído de sus cochecitos cuando las niñeras miraban para otro lado.

—Me escapé el día que nací —dijo—, porque escuché a mis padres hablar de lo que iba a ser cuando fuera grande. Y yo no quiero crecer nunca. Quiero ser siempre un chico y divertirme.

Y después le hizo una propuesta:

—Wendy, vení conmigo a Nunca Jamás. Podés contarles cuentos a los Niños Perdidos. Ninguno de nosotros tiene mamá.`
      },
      {
        title: 'Segunda estrella a la derecha',
        illustration: 'luna',
        content: `—¡Pero no sé volar! —dijo Wendy.

—Yo te enseño. Sólo tenés que pensar en cosas lindas, maravillosas, y ellas te levantan por el aire.

Peter sopló sobre ellos un poco de polvo de hada que le sacudió a Campanilla. Wendy, Juan y Miguel pensaron en cosas lindas… y empezaron a flotar. Primero chocaban contra el techo, pero enseguida aprendieron.

Salieron volando por la ventana justo cuando el señor y la señora Darling entraban corriendo al cuarto. Llegaron tarde.

—¿Por dónde se va a Nunca Jamás? —preguntó Juan.

—Segunda estrella a la derecha —dijo Peter—, y todo derecho hasta la mañana.

Volaron durante muchos días y muchas noches, sobre mares y nubes. Cuando tenían hambre, Peter les sacaba la comida del pico a los pájaros. Cuando tenían sueño, a veces se dormían en el aire y se caían, y Peter los atajaba en el último momento… o casi.

Por fin vieron la isla de Nunca Jamás. Era exactamente como la habían soñado: con lagunas, bosques, cuevas, montañas, un barco pirata anclado en una bahía y fuegos de campamento que brillaban en la oscuridad.

En el barco pirata vivía el enemigo de Peter: el capitán Garfio, un pirata elegante y cruel, de pelo largo y rizado, que tenía un garfio de hierro en lugar de mano derecha. Peter le había cortado la mano en una pelea, y se la había tirado a un cocodrilo. Al cocodrilo le gustó tanto el sabor que desde entonces seguía a Garfio por todos lados, esperando comerse el resto. Por suerte para Garfio, el cocodrilo se había tragado también un reloj, y hacía "tic-tac, tic-tac" cada vez que se acercaba.`
      },
      {
        title: 'En el País de Nunca Jamás',
        illustration: 'isla',
        content: `Campanilla estaba celosa de Wendy, porque quería a Peter sólo para ella. Así que voló adelante y les dijo a los Niños Perdidos, con su voz de campanitas, que Peter quería que derribaran a un "pájaro Wendy" que se acercaba. Uno de ellos, Lelo, le disparó una flecha, y Wendy cayó del cielo. Por suerte, la flecha había pegado en un botón que Peter le había regalado.

Cuando Peter se enteró de la mentira de Campanilla, se enojó tanto que la desterró por una semana. Pero en el fondo la quería mucho, y la perdonó enseguida.

Los Niños Perdidos le construyeron a Wendy una casita en el bosque. Vivían todos bajo tierra, en una casa secreta a la que se entraba por los troncos huecos de los árboles. Wendy les cocinaba, les remendaba las medias y todas las noches les contaba cuentos. Los Niños Perdidos la llamaban "mamá".

Vivieron muchas aventuras. En la Laguna de las Sirenas, salvaron a una princesa que los piratas habían dejado atada en la Roca de los Abandonados, donde iba a subir la marea. Peter imitó la voz de Garfio para engañar a los piratas, y peleó contra el capitán en persona. Garfio lo lastimó, y Peter quedó solo en la roca mientras el agua subía. Por un momento tuvo miedo. Pero después sonrió y dijo:

—Morir debe ser una aventura enorme.

Un ave que hacía su nido en el agua le prestó su nido flotante, y Peter se salvó navegando en él.

Pero con el tiempo, Wendy se dio cuenta de algo: Juan y Miguel se estaban olvidando de sus papás. Miguel ya creía que Wendy era su verdadera mamá. Y ella extrañaba su casa.

—Tenemos que volver —les dijo a todos—. Nuestra mamá debe estar muy triste.

Los Niños Perdidos quisieron ir con ellos, a tener una mamá de verdad. Peter, en cambio, se negó.

—Yo no voy a crecer nunca —dijo, con la cara seria.`
      },
      {
        title: 'La última batalla',
        illustration: 'barco',
        content: `Esa noche, mientras se despedían, los piratas atacaron. Garfio y sus hombres capturaron a Wendy y a los Niños Perdidos y se los llevaron al barco. Peter se había quedado dormido en la casa subterránea.

Garfio, antes de irse, puso unas gotas de veneno en el vaso de remedio de Peter. Cuando Peter se despertó y fue a tomarlo, Campanilla se lo impidió: se tomó ella el veneno para salvarlo. Su lucecita empezó a apagarse.

—¡Campanilla! ¡No te mueras!

Con una vocecita débil, el hada le dijo que podría curarse si los chicos creyeran en las hadas. Entonces Peter se dirigió a todos los chicos del mundo que en ese momento estaban soñando con Nunca Jamás:

—¡Si creen en las hadas, aplaudan! ¡No dejen que Campanilla se muera!

Y desde muy lejos se escucharon aplausos, muchísimos aplausos. La luz de Campanilla se encendió más fuerte que nunca.

Peter voló hasta el barco pirata. Para que no lo descubrieran, imitó el "tic-tac" del cocodrilo, y Garfio se escondió temblando. Peter se metió en el barco, liberó a los chicos y empezó la pelea. Los Niños Perdidos lucharon con espadas, y los piratas fueron cayendo al agua uno por uno.

Al final, sólo quedaron Peter y Garfio, frente a frente, espada contra garfio. Peter era más rápido. Garfio, vencido, saltó al agua… justo donde lo esperaba el cocodrilo, con la boca abierta.

Peter llevó a los chicos de vuelta a Londres. La señora Darling los esperaba con la ventana abierta, como todas las noches desde que se habían ido. Lloró de felicidad. Y adoptó a todos los Niños Perdidos.

Peter no quiso quedarse.

—Si me quedo, me van a mandar a la escuela, y después a una oficina, y me voy a convertir en un hombre. Y yo quiero ser siempre un chico y divertirme.

Prometió volver a buscar a Wendy todas las primaveras. Con el tiempo, Wendy creció, se casó y tuvo una hija, Juana. Una noche, Peter volvió a entrar por la ventana, igual que siempre, con todos sus dientes de leche. Wendy ya era grande y no podía volar. Pero Juana sí.

Y así seguirá pasando para siempre, mientras haya chicos alegres, inocentes y sin miedo.`
      }
    ],
    quiz: [
      { question: '¿Por qué Peter Pan no quería crecer?', options: ['Porque le daba miedo la escuela', 'Porque quería ser siempre un chico y divertirse', 'Porque estaba enfermo', 'Porque vivía con piratas'], correct: 1, explanation: 'Escapó el día que nació al escuchar cómo sería de grande.' },
      { question: '¿Cómo se llega a Nunca Jamás?', options: ['En barco', 'Segunda estrella a la derecha y todo derecho hasta la mañana', 'Por un túnel', 'En tren'], correct: 1, explanation: 'Es la famosa indicación de Peter.' },
      { question: '¿Por qué el capitán Garfio le temía al cocodrilo?', options: ['Porque era muy grande', 'Porque se había comido su mano y quería comerse el resto', 'Porque nadaba rápido', 'Porque era de Peter'], correct: 1, explanation: 'Su tic-tac lo delataba porque se había tragado un reloj.' },
      { question: '¿Cómo salvó Campanilla a Peter?', options: ['Lo despertó', 'Se tomó el veneno que Garfio había puesto en su remedio', 'Llamó a las sirenas', 'Lo escondió'], correct: 1, explanation: 'Después la salvaron los aplausos de los chicos que creen en las hadas.' },
      { question: '¿Por qué Wendy decidió volver a su casa?', options: ['Porque se aburría', 'Porque sus hermanos olvidaban a sus padres y ella los extrañaba', 'Porque Peter la echó', 'Porque llovía'], correct: 1, explanation: 'Sabía que su mamá estaría muy triste.' }
    ]
  },
  {
    slug: 'las-aventuras-de-pinocho',
    title: 'Las aventuras de Pinocho',
    author: 'Carlo Collodi (adaptación de la Biblioteca)',
    license: PD('«Las aventuras de Pinocho» de Carlo Collodi (1883)'),
    synopsis: 'El viejo carpintero Geppetto talla un muñeco de madera que, apenas terminado, habla, se ríe y sale corriendo. Pinocho es travieso, mentiroso y desobediente, y por eso se mete en un problema tras otro. Pero en el fondo tiene un buen corazón, y un largo viaje le enseñará qué significa ser un chico de verdad.',
    genres: ['Fantasía', 'Aventura', 'Valores'],
    gradeMin: 4, gradeMax: 5,
    cover: { scene: 'oceano', c1: '#f4a261', c2: '#264653' },
    chapters: [
      {
        title: 'Un pedazo de madera que hablaba',
        illustration: 'escuela',
        content: `Había una vez… —¡Un rey!, dirán enseguida mis pequeños lectores. No, chicos, se equivocaron. Había una vez un pedazo de madera.

No era una madera de lujo, sino un simple tronco de los que se usan en invierno para la chimenea. Pero ese tronco llegó al taller del maestro Cereza, un carpintero que tenía la nariz roja como una cereza madura. Cuando quiso tallarlo para hacer la pata de una mesa, una vocecita gritó:

—¡No me pegues tan fuerte!

El maestro Cereza se asustó tanto que se le cayó el hacha. Cuando ese mismo día llegó su amigo Geppetto, un viejo bueno y pobre que quería fabricarse un muñeco de madera para recorrer el mundo dando funciones, Cereza le regaló el tronco con mucho gusto.

Geppetto vivía en un cuartito muy pobre, con una chimenea pintada en la pared. Empezó a tallar el muñeco, y decidió llamarlo Pinocho. Pero apenas le hizo los ojos, los ojos se movieron y lo miraron fijo. Cuando le hizo la nariz, la nariz empezó a crecer y crecer. Cuando le hizo la boca, la boca se rió de él. Y cuando le hizo los pies, Pinocho le dio una patada en la nariz, saltó al piso y salió corriendo por la calle.

Un policía lo atrapó, pero como la gente decía que Geppetto era muy severo, el policía se llevó preso al pobre viejo.

Pinocho volvió solo a la casa. Allí escuchó un "cri-cri-cri". Era un Grillo que hablaba, que vivía en ese cuarto desde hacía más de cien años.

—¡Ay de los chicos que desobedecen a sus padres y se escapan de su casa! —le dijo el Grillo—. Nunca les va a ir bien en el mundo.

—Cantá lo que quieras —le contestó Pinocho—. Yo no quiero ir a la escuela ni trabajar. Quiero comer, beber, dormir, divertirme y andar de vagabundo de la mañana a la noche.

—Si sigues así, vas a terminar mal —dijo el Grillo.

Pinocho, furioso, le tiró un martillo de madera. El Grillo saltó a la pared y desapareció por una grieta.`
      },
      {
        title: 'El abecedario y las monedas de oro',
        illustration: 'ciudad',
        content: `Cuando Geppetto salió de la cárcel, perdonó a Pinocho. Le dio de comer las tres peras que tenía para su propio almuerzo, le hizo pies nuevos (porque Pinocho se había quemado los suyos de madera en el brasero) y le fabricó ropa con papel floreado.

—Mañana vas a ir a la escuela —le dijo.

—¡Pero no tengo abecedario!

Geppetto no tenía dinero. Así que se puso su viejo saco, salió y, al rato, volvió en mangas de camisa, temblando de frío, con un abecedario nuevo.

—¿Y el saco, papá?

—Lo vendí. Tenía demasiado calor.

Pinocho entendió lo que había hecho su papá y lo abrazó con fuerza.

Al día siguiente, camino a la escuela, Pinocho escuchó música de tambores. Era un teatro de títeres. Pinocho vendió su abecedario por cuatro monedas y entró a ver la función. Los títeres, al verlo, lo reconocieron como un hermano de madera y lo llevaron al escenario. El dueño del teatro, Comefuego, un gigante de barba negra hasta el piso, se enojó tanto que quiso usar a Pinocho como leña para asar su cena. Pero cuando Pinocho le habló de su pobre papá, Comefuego estornudó (que era su forma de conmoverse), lo perdonó y le regaló cinco monedas de oro para Geppetto.

En el camino de vuelta, Pinocho se encontró con un Zorro que se hacía el rengo y un Gato que se hacía el ciego.

—¿Quieres que esas cinco monedas se conviertan en dos mil? —le dijo el Zorro—. En el País de los Bobos hay un campo mágico, el Campo de los Milagros. Si entierras tus monedas allí, en una noche crece un árbol lleno de monedas de oro.

Pinocho se olvidó de su papá y fue con ellos. Por el camino, el fantasma del Grillo Parlante se le apareció para advertirle, pero Pinocho no le hizo caso. Por supuesto, los dos bribones le robaron las monedas. Y lo dejaron colgado de un árbol en el bosque.

Allí lo rescató un Hada de cabellos color turquesa, que vivía en una casita blanca. Lo curó y le preguntó dónde estaban las monedas. Pinocho mintió. Y su nariz empezó a crecer. Mintió otra vez, y la nariz creció más. Al final, la nariz estaba tan larga que no podía darse vuelta en la habitación.

—Las mentiras, chico mío, se descubren enseguida —le dijo el Hada riendo—. Hay mentiras que tienen las piernas cortas y mentiras que tienen la nariz larga. Las tuyas son de nariz larga.`
      },
      {
        title: 'El País de los Juguetes',
        illustration: 'castillo',
        content: `Pinocho prometió portarse bien. Fue a la escuela y, durante un tiempo, fue un buen alumno. El Hada le prometió que, si seguía así, al día siguiente dejaría de ser un muñeco de madera y se convertiría en un chico de verdad. Iba a haber una gran fiesta.

Pero esa misma tarde, Pinocho se encontró con su mejor amigo de la escuela, un chico flaco y travieso al que todos llamaban Mecha.

—Esta noche me voy al País de los Juguetes —le dijo Mecha—. Allí no hay escuelas, ni maestros, ni libros. Los jueves no hay clases, y cada semana tiene seis jueves y un domingo. Las vacaciones empiezan el primero de enero y terminan el treinta y uno de diciembre. ¡Vení conmigo!

Pinocho dudó. Pensó en el Hada, en Geppetto, en la fiesta. Pero cuando llegó un carro tirado por doce pares de burritos, lleno de chicos que gritaban de alegría, no pudo resistirse. Se subió.

El País de los Juguetes era como Mecha había dicho: todos jugaban, gritaban y se divertían de la mañana a la noche. Pinocho y Mecha pasaron cinco meses sin abrir un libro.

Una mañana, Pinocho se despertó con una picazón en la cabeza. Se tocó las orejas. ¡Le habían crecido! Eran largas y peludas, como las de un burro. Corrió a ver a Mecha y descubrió que a él le había pasado lo mismo. Se rieron de nervios, y la risa se les convirtió en rebuznos. En pocos minutos, se transformaron por completo en burros.

Los chicos que no estudian y sólo quieren divertirse, decía el libro, terminan convertidos en burros.

El dueño del carro, un hombrecito sonriente, los vendió. A Pinocho lo compró un circo, donde lo obligaron a saltar aros. Se lastimó una pata, y entonces lo vendieron a un hombre que quería su cuero para hacer un tambor. El hombre lo tiró al mar con una piedra atada para ahogarlo. Pero en el agua, los peces se comieron el cuero de burro… y debajo apareció otra vez el muñeco de madera, que salió nadando.`
      },
      {
        title: 'En el vientre del Gran Tiburón',
        illustration: 'oceano',
        content: `Mientras nadaba, Pinocho vio que se acercaba un monstruo marino espantoso: el Terrible Tiburón, un pez enorme, tan largo como un edificio, con una boca como un túnel y tres filas de dientes. El Tiburón abrió la boca y se tragó a Pinocho de un solo sorbo.

Adentro del Tiburón estaba todo oscuro. Pero a lo lejos se veía una lucecita. Pinocho caminó hacia ella y encontró una mesa, una vela, y sentado frente a ella, un viejito muy flaco, con el pelo blanco como la nieve.

—¡Papá! ¡Querido papá!

Era Geppetto. Hacía dos años que vivía dentro del Tiburón. Había salido a buscar a Pinocho en un botecito, y una tormenta lo había hundido. El Tiburón se lo había tragado junto con un barco lleno de provisiones, que lo habían mantenido vivo todo ese tiempo. Pero ya se le terminaba la última vela.

—Tenemos que escapar —dijo Pinocho—. ¡Ahora mismo!

El Tiburón era viejo y dormía con la boca abierta, porque sufría de asma. Pinocho tomó de la mano a Geppetto y caminaron por la garganta del monstruo, por la lengua, entre los dientes. Pinocho se subió a Geppetto en los hombros y saltó al mar.

Nadó con todas sus fuerzas en la noche, cargando a su papá. Cuando ya no podía más, un Atún, que también había escapado del Tiburón, los llevó en su lomo hasta la costa.

Desde ese día, Pinocho cambió. Trabajó todos los días sacando agua de un pozo para un hortelano, a cambio de un vaso de leche para Geppetto, que estaba muy débil. Por las noches estudiaba a la luz de una vela y aprendió a tejer canastos para vender. Con el dinero que ahorró, quiso comprarse ropa nueva, pero se enteró de que el Hada estaba enferma y pobre, y le mandó todo.

Esa noche, Pinocho soñó con el Hada, que le sonreía y le decía: "Muy bien, Pinocho. Por tu buen corazón, te perdono todas tus travesuras".

Cuando se despertó, se miró en el espejo. Ya no era un muñeco de madera. Era un chico de verdad, de pelo castaño y ojos celestes. A su lado, apoyado contra una silla, había un muñeco de madera con la cabeza inclinada.

—¡Qué gracioso era yo cuando era un muñeco! —dijo Pinocho—. ¡Y qué contento estoy de haberme convertido en un chico como los demás!`
      }
    ],
    quiz: [
      { question: '¿Qué vendió Geppetto para comprarle el abecedario a Pinocho?', options: ['Su casa', 'Su saco', 'Sus herramientas', 'Su reloj'], correct: 1, explanation: 'Volvió temblando de frío, pero feliz.' },
      { question: '¿Qué le pasaba a Pinocho cuando mentía?', options: ['Le crecían las orejas', 'Le crecía la nariz', 'Se ponía rojo', 'Se convertía en burro'], correct: 1, explanation: 'Es el rasgo más famoso del personaje.' },
      { question: '¿Qué les pasó a los chicos en el País de los Juguetes?', options: ['Se hicieron ricos', 'Se convirtieron en burros', 'Aprendieron mucho', 'Se perdieron'], correct: 1, explanation: 'Es una advertencia sobre sólo querer divertirse.' },
      { question: '¿A quién encontró Pinocho dentro del Gran Tiburón?', options: ['Al Hada', 'A Geppetto', 'A Mecha', 'Al Grillo'], correct: 1, explanation: 'Hacía dos años que vivía allí.' },
      { question: '¿Por qué Pinocho se convirtió en un chico de verdad?', options: ['Por magia sin motivo', 'Por su buen corazón: trabajó, estudió y cuidó a su papá', 'Porque se lo pidió a Comefuego', 'Porque encontró monedas'], correct: 1, explanation: 'Su cambio de actitud fue lo que lo transformó.' }
    ]
  },

  /* ------------------------- Sección 3: 6.º y 7.º ------------------------- */
  {
    slug: 'dracula',
    title: 'Drácula',
    author: 'Bram Stoker (adaptación de la Biblioteca)',
    license: PD('la novela «Drácula» de Bram Stoker (1897)'),
    synopsis: 'Un joven abogado inglés viaja a un castillo de Transilvania para cerrar un negocio con un conde misterioso. Pronto descubre que es su prisionero, y que su anfitrión no proyecta reflejo en los espejos. Contada a través de diarios y cartas, la novela que dio forma al mito del vampiro, en una versión para lectores valientes.',
    genres: ['Terror', 'Suspenso', 'Novela'],
    gradeMin: 6, gradeMax: 7,
    featured: true,
    cover: { scene: 'casona', c1: '#2b2d42', c2: '#8d0801' },
    chapters: [
      {
        title: 'Diario de Jonathan Harker: el castillo',
        illustration: 'castillo',
        content: `3 de mayo. Bistritz. Salí de Munich a las 8:35 de la noche. Mañana sigo hacia el Paso de Borgo, en lo alto de los Cárpatos, en Transilvania. Mi empresa me envió para cerrar la venta de una casa en Londres a un noble de la región, el conde Drácula.

4 de mayo. En la posada, cuando dije adónde iba, la dueña se puso pálida. Me rogó que no fuera. "¿No sabe qué día es hoy? Es la víspera de San Jorge. Esta noche, cuando el reloj dé las doce, todas las cosas malas del mundo tendrán todo el poder". Como no la escuché, se sacó un crucifijo del cuello y me lo puso. No soy supersticioso, pero no me animé a rechazarlo.

5 de mayo. El castillo. En el Paso de Borgo me esperaba un carruaje negro, tirado por cuatro caballos negros. El cochero era alto, con una barba castaña, y tenía unos ojos que brillaban rojos a la luz de las lámparas. Durante el viaje escuché aullidos de lobos, muy cerca. En un momento, los lobos rodearon el carruaje. El cochero levantó los brazos, dijo algo en voz alta, y los lobos se fueron.

El castillo era enorme, en ruinas, sobre un precipicio. Me recibió un anciano alto, vestido de negro de la cabeza a los pies, sin una sola mancha de color.

—Bienvenido a mi casa —dijo, en un inglés excelente pero con un acento extraño—. Entre libremente y por su propia voluntad.

Al darme la mano, sentí que estaba helada, como la de un muerto. Tenía la cara delgada, la nariz aguileña, cejas muy espesas, orejas puntiagudas y unos dientes blancos y afilados que sobresalían sobre los labios, extrañamente rojos. Me pareció haber visto antes al cochero.

7 de mayo. El conde es un anfitrión amable y culto. Habla de la historia de su pueblo con orgullo, como si él mismo hubiera estado en las batallas de hace siglos. Nunca lo vi comer ni beber. Sólo aparece de noche.

8 de mayo. Esta mañana me estaba afeitando frente al espejo junto a la ventana cuando sentí una mano en el hombro y oí la voz del conde: "Buenos días". Me sobresalté, porque no lo había visto entrar. En el espejo se veía toda la habitación detrás de mí. Pero el conde no aparecía. No había reflejo.

Me corté con la navaja. Cuando el conde vio la gota de sangre, sus ojos brillaron con una especie de furia, y se lanzó sobre mi cuello. Su mano tocó el crucifijo que me había dado la mujer de la posada. Retrocedió de inmediato. Tiró el espejo por la ventana.

Más tarde descubrí que todas las puertas del castillo están cerradas con llave. No hay salida. Soy un prisionero.`
      },
      {
        title: 'Diario de Jonathan Harker: la fuga',
        illustration: 'luna',
        content: `15 de mayo. Anoche, desde mi ventana, vi algo que me heló la sangre. El conde salió por una ventana de más abajo y empezó a bajar por la pared del castillo, cabeza abajo, sobre el precipicio, con la capa abierta como alas enormes, agarrándose de las piedras como una lagartija. ¿Qué clase de hombre es este? ¿Es un hombre?

16 de mayo. Desobedeciendo al conde, que me había advertido que no durmiera en ninguna otra habitación, me quedé dormido en un salón antiguo. Me desperté a la luz de la luna y vi a tres mujeres jóvenes, pálidas, de labios rojos, que me miraban y susurraban. Se acercaron. Sentí un miedo y un sopor extraños, como si no pudiera moverme. En ese momento apareció el conde, furioso, y las echó: "¡Este hombre me pertenece!". Me desmayé de terror.

Junio. Descubrí el secreto del conde. Bajé por la pared, como él, hasta su habitación. Por un pasadizo llegué a una capilla en ruinas, donde había cincuenta grandes cajones de madera llenos de tierra. En uno de ellos, sobre la tierra, estaba el conde, inmóvil, con los ojos abiertos y fijos, pero sin respirar. No estaba muerto. Tampoco vivo. Y en sus labios había gotas de sangre fresca.

Ahora lo entiendo todo. El conde no compró una casa en Londres para vivir tranquilo. Va a llevar a Inglaterra esos cajones con la tierra de su tumba, porque necesita dormir en ella durante el día. Y en Londres, entre millones de personas, va a encontrar un nuevo terreno de caza.

29 de junio. Hoy unos hombres se llevaron los cajones en carros. El conde partió con ellos. Me dejó aquí, encerrado, con las tres mujeres.

30 de junio. No voy a esperar mi destino. Voy a bajar por el muro del castillo hasta donde pueda, y después correr por el bosque. Prefiero el precipicio a quedarme. Adiós, Mina, si no vuelvo.`
      },
      {
        title: 'Diario de Mina: la llegada del barco',
        illustration: 'faro',
        content: `Mina Murray, la prometida de Jonathan, estaba de vacaciones en Whitby, un pueblo junto al mar, en el norte de Inglaterra, con su mejor amiga, Lucy Westenra. No tenía noticias de Jonathan desde hacía semanas y estaba muy preocupada.

Diario de Mina, 8 de agosto. Anoche hubo una tormenta espantosa. En medio de los rayos, un barco ruso, el Demeter, entró en el puerto como empujado por una mano invisible, y encalló en la arena. Cuando los hombres del puerto subieron, encontraron al capitán muerto, atado al timón. No había nadie más a bordo. Y en el momento en que el barco tocó tierra, un perro enorme, negro, saltó a la playa y desapareció. La carga del barco era muy extraña: cincuenta cajones de madera llenos de tierra.

El diario del capitán contaba una historia de terror: durante el viaje, los marineros fueron desapareciendo uno a uno, en la noche. Algunos decían haber visto en cubierta a un hombre alto y delgado que no pertenecía a la tripulación.

Diario de Mina, 11 de agosto. Lucy volvió a caminar dormida. Anoche, al despertarme, su cama estaba vacía. La encontré sentada en un banco del cementerio, junto al mar, profundamente dormida. Sobre ella se inclinaba algo largo y negro. Cuando me acerqué, la sombra se levantó y vi una cara pálida y unos ojos rojos brillantes. Luego no había nada. En el cuello de Lucy había dos pequeñas marcas, como pinchazos.

Desde entonces, Lucy está cada día más pálida y más débil, aunque come y duerme. De noche está inquieta, y por la mañana, más cansada. Los médicos no saben qué tiene.

Al fin llegaron noticias de Jonathan: había aparecido en un hospital de Budapest, con fiebre cerebral, delirando sobre lobos, sangre y un castillo. Mina viajó a buscarlo y se casaron allí mismo. Pero Jonathan, al principio, no quería hablar de lo que había vivido.`
      },
      {
        title: 'El profesor Van Helsing',
        illustration: 'casona',
        content: `Lucy empeoraba. Uno de sus pretendientes, el doctor John Seward, que dirigía un hospital para enfermos mentales, llamó a su antiguo maestro: el profesor Abraham Van Helsing, de Ámsterdam, un médico sabio que conocía enfermedades extrañas.

Van Helsing examinó a Lucy y vio las marcas del cuello. Se puso muy serio, pero no dijo nada. Le hicieron transfusiones de sangre, ofrecida por sus amigos, porque estaba perdiendo sangre sin explicación. Después, el profesor llenó la habitación de flores de ajo, colgó una corona de ajos al cuello de Lucy y frotó con ajo las ventanas.

—No pregunten —dijo—. Sólo obedezcan.

Durante unas noches, Lucy mejoró. Pero la madre de Lucy, sin saber nada, sacó las flores "porque olían mal" y abrió la ventana para que entrara aire. Esa noche, un lobo enorme rompió la ventana. Y a pesar de todos los esfuerzos de los médicos, Lucy murió unos días después.

Pero la historia no terminó ahí. Poco tiempo después, los diarios de Londres hablaban de una "dama hermosa" que de noche se acercaba a los chicos en los parques. Los chicos aparecían con pequeñas heridas en el cuello.

Van Helsing reunió a los amigos de Lucy: el doctor Seward, su prometido Arthur Holmwood y el texano Quincey Morris. Les explicó la verdad.

—Lucy fue atacada por un no-muerto, un vampiro. Un ser que vive desde hace siglos alimentándose de la sangre de los vivos. Duerme de día en tierra sagrada de su tumba, no proyecta reflejo ni sombra, puede convertirse en lobo, en murciélago o en niebla, y le temen el ajo y los objetos sagrados. Pero tiene un límite: no puede entrar en una casa si no lo invitan. Y quien muere por su mordida puede convertirse en uno de ellos.

Esa noche, en el cementerio, vieron a Lucy caminar entre las tumbas, pálida y con los labios rojos, y no era la Lucy que conocían. Con los ritos antiguos que Van Helsing conocía, le dieron a su alma el descanso que necesitaba. Al terminar, la cara de Lucy recuperó la dulzura y la paz de antes.

Cuando Jonathan escuchó todo esto, supo que no había soñado. Entendió quién estaba en Londres.

—El conde Drácula —dijo—. Yo mismo lo traje aquí.`
      },
      {
        title: 'La caza del conde',
        illustration: 'montanas',
        content: `Los amigos formaron un grupo para cazar al conde: Van Helsing, Jonathan, Mina, Seward, Arthur y Quincey. Mina, con su máquina de escribir, ordenó todos los diarios, cartas y recortes, y así reconstruyeron la historia completa. Descubrieron que el conde había distribuido sus cincuenta cajones de tierra por distintas casas de Londres.

Uno por uno, encontraron los cajones y colocaron en cada uno una hostia consagrada, para que la tierra ya no le sirviera al vampiro como refugio. Pero mientras los hombres trabajaban, el conde se vengó: entró como niebla en la habitación de Mina y la mordió. Mina empezó a sentirse cada vez más débil, y a veces, en la mañana, parecía saber lo que hacía el conde.

Cuando ya sólo le quedaba un cajón, Drácula huyó de Inglaterra en barco, de vuelta a Transilvania.

—Ahora tenemos una ventaja —dijo Van Helsing—. El vínculo que el conde tiene con Mina funciona en los dos sentidos.

Con hipnosis, al amanecer y al atardecer, Mina describía lo que el conde escuchaba y sentía: el ruido del agua contra el barco, cuerdas, gritos de marineros. Así supieron que viajaba hacia el puerto de Varna, en el mar Negro, y después río arriba hacia su castillo.

El grupo viajó en tren a toda velocidad, cruzando Europa. Se separaron para cubrir todos los caminos. Van Helsing llegó con Mina al castillo y, antes de que cayera la noche, le dio descanso a las tres mujeres que vivían allí.

El 6 de noviembre, al atardecer, en la nieve, los cazadores alcanzaron un carro que llevaba un cajón grande hacia el castillo, custodiado por un grupo de hombres armados. Hubo una lucha feroz en la nieve. Jonathan y Quincey llegaron al cajón y lo abrieron. Adentro estaba el conde, pálido como la cera, con los ojos rojos encendidos de odio, mirando cómo se ponía el sol. Antes de que el último rayo desapareciera, Jonathan y Quincey lo atacaron con sus cuchillos.

Y en ese instante, ante sus ojos, el cuerpo del conde se deshizo en polvo. Mina contó después que, en el último momento, vio en la cara de Drácula algo que nunca hubiera imaginado: una expresión de paz.

Quincey Morris había quedado gravemente herido en la lucha. Murió sonriendo, en la nieve, al ver que la marca de la mordida había desaparecido de la frente de Mina. Estaba libre.

Siete años después, Jonathan y Mina tuvieron un hijo. Lo llamaron Quincey. Y a veces, cuando lo miran jugar, recuerdan que el valor y la amistad pueden vencer hasta a la oscuridad más antigua.`
      }
    ],
    quiz: [
      { question: '¿Cómo está contada la novela?', options: ['Por un narrador omnisciente', 'A través de diarios, cartas y recortes de distintos personajes', 'En verso', 'Como una obra de teatro'], correct: 1, explanation: 'Es una novela epistolar: cada personaje aporta su parte.' },
      { question: '¿Qué descubrió Jonathan frente al espejo?', options: ['Que estaba enfermo', 'Que el conde no tenía reflejo', 'Una puerta secreta', 'Una carta'], correct: 1, explanation: 'Fue la primera señal clara de que algo andaba mal.' },
      { question: '¿Para qué llevaba el conde cajones con tierra?', options: ['Para plantar flores', 'Porque necesitaba descansar de día en la tierra de su tumba', 'Para venderla', 'Para construir una casa'], correct: 1, explanation: 'Por eso los cazadores los inutilizaron uno por uno.' },
      { question: '¿Qué límite tiene el vampiro según Van Helsing?', options: ['No puede volar', 'No puede entrar en una casa si no lo invitan', 'No puede hablar', 'No puede salir de noche'], correct: 1, explanation: 'Por eso al llegar dijo "Entre libremente y por su propia voluntad".' },
      { question: '¿Cómo usaron el vínculo entre Mina y el conde?', options: ['No lo usaron', 'Con hipnosis, Mina describía lo que el conde percibía y así lo rastrearon', 'Mina lo llamó', 'Lo encerraron'], correct: 1, explanation: 'Convirtieron la debilidad de Mina en una ventaja.' }
    ]
  }
];
