/* Sección 3 · El Observatorio (6.º y 7.º grado) — libros nuevos (parte B) */
const PD = (obra) => `Adaptación libre de ${obra}, obra de dominio público`;

module.exports = [
  {
    slug: 'la-maquina-del-tiempo',
    title: 'La máquina del tiempo',
    author: 'H. G. Wells (adaptación de la Biblioteca)',
    license: PD('«La máquina del tiempo» de H. G. Wells (1895)'),
    synopsis: 'Un inventor construye una máquina capaz de viajar a través del tiempo y llega al año 802.701. Encuentra un mundo que parece un paraíso, habitado por seres pequeños y alegres. Pero cuando su máquina desaparece, descubre que bajo la tierra se esconde otra especie… y una verdad inquietante sobre el futuro de la humanidad.',
    genres: ['Ciencia ficción', 'Novela', 'Aventura'],
    gradeMin: 6, gradeMax: 7,
    cover: { scene: 'reloj', c1: '#3a0ca3', c2: '#f72585' },
    chapters: [
      {
        title: 'La cuarta dimensión',
        illustration: 'reloj',
        content: `Un jueves por la noche, en una casa de Richmond, cerca de Londres, un grupo de amigos cenaba con su anfitrión, un científico e inventor a quien llamaremos simplemente el Viajero del Tiempo. Era un hombre de ojos grises, brillantes, que hablaba con entusiasmo de ideas que los demás encontraban absurdas.

—Ustedes saben que todo objeto tiene largo, ancho y alto —dijo—. Tres dimensiones. Pero ningún objeto puede existir si no dura un tiempo. El tiempo es la cuarta dimensión. Nos movemos libremente por las otras tres, pero por el tiempo sólo avanzamos en una dirección, a un ritmo fijo, como un barco arrastrado por la corriente. ¿Y si se pudiera navegar a voluntad, hacia adelante o hacia atrás?

Los invitados se rieron. El Viajero sonrió y trajo una pequeña máquina de metal brillante y cristal, del tamaño de un reloj de mesa, con dos palancas diminutas.

—Este es un modelo. La máquina verdadera está casi terminada en mi laboratorio.

Le pidió a uno de los invitados que empujara una palanca. La maquinita giró, se volvió borrosa, como un fantasma, y desapareció. No quedó nada sobre la mesa.

—Viajó hacia el futuro —dijo el Viajero, muy tranquilo.

Nadie le creyó del todo.

Una semana después, los invitados volvieron a cenar. El anfitrión no estaba. Llegó tarde, cuando ya habían empezado a comer, y su aspecto los dejó helados: estaba pálido, despeinado, con la ropa sucia y rota, y rengueaba. Tenía la cara de alguien que ha sufrido mucho.

Comió con un hambre feroz, en silencio. Después se sentó junto al fuego.

—Les voy a contar dónde estuve —dijo—. Pero no me interrumpan. Hoy, a las diez de la mañana, partí en mi máquina. Y estuve ocho días fuera… en un tiempo muy lejano.`
      },
      {
        title: 'Los eloi',
        illustration: 'bosque',
        content: `"Me senté en la máquina, empujé la palanca y el mundo se volvió loco. El sol saltaba por el cielo como un relámpago, los días y las noches se convertían en un parpadeo gris. Vi crecer edificios y derrumbarse. La máquina vibraba y yo sentía un vértigo terrible. Cuando por fin frené, la máquina volcó y caí sobre el pasto. Miré los diales: estaba en el año 802.701.

Llovía granizo. Frente a mí había una enorme estatua de piedra blanca, con forma de esfinge con alas. Alrededor, un paisaje de jardines, flores y edificios gigantescos, cubiertos de vegetación, como palacios en ruinas.

Pronto aparecieron unos seres pequeños, de poco más de un metro, vestidos con túnicas de colores. Eran delicados, hermosos, con ojos grandes y risas alegres. Se acercaron sin miedo, me tocaron con curiosidad y me llevaron a uno de los grandes edificios, donde comían frutas sentados sobre almohadones. Les llamé los eloi.

Al principio, pensé que había llegado a un paraíso. No había enfermedades, ni guerras, ni trabajo. Los eloi pasaban el día jugando, bañándose en los ríos, adornándose con flores. Pero pronto noté algo raro: eran como niños. Se cansaban enseguida de cualquier conversación, no les interesaba nada, olvidaban todo. Pensé que la humanidad, después de vencer todas las dificultades, se había vuelto tan cómoda que había perdido la fuerza y la inteligencia.

Un día, una pequeña eloi se cayó al río y empezó a ahogarse. Los demás miraban sin hacer nada. Me tiré al agua y la saqué. Se llamaba Weena. Desde entonces me siguió a todas partes y me regalaba flores. Fue mi única amiga en ese mundo extraño.

Esa misma tarde, volví al pasto donde había dejado mi máquina. No estaba. Había desaparecido".`
      },
      {
        title: 'Los morlocks',
        illustration: 'luna',
        content: `"Me desesperé. Grité, corrí, busqué por todos lados como un loco. Las huellas en el pasto mostraban que alguien la había arrastrado hasta la base de la esfinge blanca, que tenía unas puertas de bronce cerradas. Golpeé las puertas hasta lastimarme las manos. No se abrieron.

Noté otras cosas extrañas. Los eloi le tenían terror a la oscuridad. Al caer la noche, se encerraban todos juntos en los grandes edificios y no salían por nada del mundo. Y en el paisaje había unos pozos profundos, como chimeneas, de los que salía un ruido sordo de máquinas y un aire caliente.

Una madrugada, a la luz gris, vi unas figuras pálidas que se escabullían entre las ruinas. Una noche, en un edificio, sentí que una mano fría me tocaba en la oscuridad. Encendí un fósforo y lo vi: un ser pálido, de ojos grandes y rojizos, sin color en la piel, como un animal que vive siempre bajo tierra. Huyó de la luz con un chillido.

Me animé a bajar por uno de los pozos, agarrándome de unos ganchos de metal. Abajo había túneles, máquinas enormes que zumbaban y criaturas como aquella. Los llamé morlocks. Eran muchos. Me rodearon en la oscuridad. Sólo me salvaron mis fósforos: la luz los encandilaba y los hacía retroceder. Logré subir, temblando.

Entonces entendí la terrible verdad. Hace muchísimo tiempo, la humanidad se había dividido en dos: los ricos, que vivían en la superficie sin trabajar, y los trabajadores, que vivían bajo tierra manejando las máquinas. Con los siglos, se habían convertido en dos especies distintas. Los eloi, descendientes de los ricos, se habían vuelto débiles e indefensos. Los morlocks, descendientes de los trabajadores, seguían manejando las máquinas… y de noche subían a la superficie. Los eloi no les tenían miedo a la oscuridad por capricho. Los morlocks los cazaban".`
      },
      {
        title: 'El fin del mundo y la flor de Weena',
        illustration: 'cohete',
        content: `"Decidí buscar armas. Con Weena caminé hasta un edificio lejano, un gigantesco museo abandonado al que llamé el Palacio de Porcelana Verde. Allí había esqueletos de dinosaurios, máquinas oxidadas y libros que se deshacían en polvo. Encontré una barra de hierro y una caja de fósforos.

Al volver, nos sorprendió la noche en un bosque. Los morlocks nos rodearon. Encendí una fogata para mantenerlos lejos, pero el fuego se extendió por el bosque seco y se convirtió en un incendio enorme. En la confusión, entre el humo y las llamas, perdí a Weena. La busqué desesperadamente. Nunca la volví a encontrar.

Al amanecer volví a la esfinge. Las puertas de bronce estaban abiertas. Adentro, en la oscuridad, estaba mi máquina. Era una trampa: apenas entré, las puertas se cerraron y los morlocks se abalanzaron sobre mí. Pero había preparado las palancas. Me senté en la máquina, los aparté a golpes y empujé hacia adelante.

Viajé todavía más lejos. Millones de años. Llegué a una playa donde el sol era una enorme bola roja y apagada, inmóvil en el cielo. Hacía frío. No había casi vida: sólo líquenes verdes y unos cangrejos gigantescos que se arrastraban por la arena. Más adelante, treinta millones de años después, ya no se movía nada. Todo era silencio, nieve y oscuridad. Sentí un horror inmenso y volví.

Ahora estoy aquí".

Los invitados se miraron. Nadie le creía. Uno pensó que era un gran escritor. Otro, que se había vuelto loco.

Entonces el Viajero sacó de su bolsillo dos flores blancas, marchitas, de una especie que ningún botánico conocía. Se las había dado Weena.

Al día siguiente, uno de los amigos volvió a su casa. Lo vio subir a la máquina con una cámara de fotos y una mochila. Hubo un viento, un brillo… y la máquina desapareció. Esperaron días, meses, años. El Viajero del Tiempo nunca volvió.

Quizás está en el pasado, entre dinosaurios. Quizás en un futuro mejor que el que vio. Lo único que nos dejó fueron dos flores blancas, como prueba de que, incluso cuando la inteligencia y la fuerza desaparecen, todavía queda en el corazón humano la gratitud y la ternura".`
      }
    ],
    quiz: [
      { question: '¿Qué es la "cuarta dimensión" según el Viajero?', options: ['El espacio exterior', 'El tiempo', 'La velocidad', 'La memoria'], correct: 1, explanation: 'Además del largo, el ancho y el alto, todo objeto dura un tiempo.' },
      { question: '¿Cómo eran los eloi?', options: ['Fuertes y trabajadores', 'Pequeños, alegres, pero débiles y sin curiosidad', 'Gigantes', 'Robots'], correct: 1, explanation: 'Vivían sin esfuerzo y habían perdido fuerza e inteligencia.' },
      { question: '¿Qué descubrió el Viajero sobre los morlocks?', options: ['Que eran amigos de los eloi', 'Que vivían bajo tierra, manejaban máquinas y de noche cazaban a los eloi', 'Que eran extraterrestres', 'Que no existían'], correct: 1, explanation: 'La humanidad se había dividido en dos especies.' },
      { question: '¿Qué crítica plantea Wells con la división entre eloi y morlocks?', options: ['Que la tecnología es mala', 'Que la desigualdad extrema entre ricos y trabajadores puede tener consecuencias terribles', 'Que los bosques son peligrosos', 'Que viajar en el tiempo es fácil'], correct: 1, explanation: 'La novela reflexiona sobre la sociedad de su época.' },
      { question: '¿Qué prueba mostró el Viajero de su aventura?', options: ['Una foto', 'Dos flores desconocidas que le dio Weena', 'Un morlock', 'Un diario'], correct: 1, explanation: 'Las flores simbolizan la ternura que sobrevive.' }
    ]
  },
  {
    slug: 'veinte-mil-leguas-de-viaje-submarino',
    title: 'Veinte mil leguas de viaje submarino',
    author: 'Julio Verne (adaptación de la Biblioteca)',
    license: PD('«Veinte mil leguas de viaje submarino» de Julio Verne (1870)'),
    synopsis: 'En 1866, un misterioso monstruo marino hunde barcos en todos los océanos. El profesor Aronnax se une a una expedición para cazarlo y termina prisionero de algo mucho más asombroso: el Nautilus, un submarino eléctrico comandado por el enigmático capitán Nemo, un hombre que juró no volver a pisar tierra.',
    genres: ['Aventura', 'Ciencia ficción', 'Exploración'],
    gradeMin: 6, gradeMax: 7,
    cover: { scene: 'oceano', c1: '#0077b6', c2: '#03045e' },
    chapters: [
      {
        title: 'El monstruo de los mares',
        illustration: 'barco',
        content: `En el año 1866, el mundo entero hablaba de un fenómeno inexplicable. Varios barcos habían visto en el mar una "cosa enorme", larga, en forma de huso, a veces fosforescente, mucho más grande y rápida que una ballena. Algunos barcos habían chocado contra ella y aparecían con agujeros en el casco, como si los hubieran atravesado con una lanza gigante.

Los diarios no hablaban de otra cosa. ¿Era un narval gigantesco, ese cetáceo con un largo cuerno en la cabeza? ¿Un monstruo desconocido de las profundidades?

Yo, Pierre Aronnax, profesor del Museo de Historia Natural de París, había escrito que probablemente se trataba de un narval de tamaño colosal. Por eso, cuando el gobierno de Estados Unidos preparó una fragata, la Abraham Lincoln, para cazar al monstruo, me invitaron a participar. Acepté de inmediato, acompañado por mi fiel ayudante, Conseil, un muchacho tranquilo que sabía clasificar a todos los animales del mundo, pero que no se sorprendía de nada.

A bordo conocimos a Ned Land, un arponero canadiense, el mejor del mundo, fuerte, impaciente y de mal carácter, pero de gran corazón.

Durante meses recorrimos los océanos sin ver nada. Hasta que una noche, en el Pacífico, apareció una luz bajo el agua. El "monstruo" se acercó a una velocidad increíble. La fragata lo persiguió. Ned Land lanzó su arpón con todas sus fuerzas, y el arpón rebotó con un sonido metálico.

En ese momento, dos chorros de agua enormes cayeron sobre la cubierta. La fragata recibió un choque terrible. Yo salí despedido al mar.

Nadé en la oscuridad, cada vez más cansado, hasta que sentí que alguien me sostenía: era Conseil, que se había tirado al agua para seguirme. Poco después, una voz nos llamó. Era Ned Land, subido sobre el lomo del "monstruo". Trepamos con él.

Bajo nuestros pies no había piel ni escamas. Había placas de metal remachadas. El monstruo no era un animal: era un barco que navegaba bajo el agua. Un submarino.`
      },
      {
        title: 'El capitán Nemo',
        illustration: 'oceano',
        content: `Al amanecer, se abrió una escotilla y unos hombres nos hicieron bajar. Nos encerraron en un cuarto oscuro. Después de varias horas, entró un hombre alto, de mirada firme y orgullosa, de unos cuarenta años, que nos estudió en silencio.

—Señores —dijo por fin en perfecto francés—, ustedes atacaron mi barco. Podría devolverlos al mar. Pero voy a permitir que se queden a bordo, con una condición: nunca podrán volver a tierra. Ustedes conocen ahora un secreto que no puedo permitir que se revele. Me llamo el capitán Nemo, y este es el Nautilus.

"Nemo" quiere decir "nadie" en latín.

El capitán nos mostró su barco. Era una maravilla. Tenía una biblioteca con doce mil libros, un salón con pinturas de grandes artistas, un órgano en el que el capitán tocaba música en las noches, ventanales gigantes desde los que se veía el fondo del mar iluminado por reflectores. Todo funcionaba con electricidad, que el capitán producía con su propia invención. Del mar sacaba todo lo que necesitaba: comida, ropa, hasta el tabaco que fumaba, hecho con algas.

—El mar es todo —nos dijo—. Cubre siete décimas partes del planeta. En el mar no hay tiranos. Allí soy libre.

Aronnax no podía creer su suerte: iba a estudiar lo que ningún científico había visto. Conseil clasificaba peces sin parar. Sólo Ned Land, el arponero, sufría como un león enjaulado y soñaba con escapar.

Nemo era un misterio. Era culto, generoso con los pobres, pero odiaba profundamente a algunas naciones, aunque nunca decía por qué. A veces se encerraba durante días. A veces parecía llorar mientras tocaba el órgano.`
      },
      {
        title: 'Maravillas del fondo del mar',
        illustration: 'tortuga',
        content: `Durante meses recorrimos los océanos. Con escafandras que tenían tanques de aire, caminamos por el fondo del mar, en bosques de algas gigantes y corales de todos los colores, entre peces que nunca nadie había descrito.

En las costas de Ceilán, lo que hoy es Sri Lanka, vimos a un pobre pescador de perlas que buceaba sin equipo. De pronto, un tiburón enorme se lanzó sobre él. El capitán Nemo, con un puñal, se interpuso y luchó contra el tiburón. Ned Land lo remató con su arpón. Después, Nemo le regaló al pescador una bolsa de perlas.

—Ese hombre es un habitante del país de los oprimidos —dijo el capitán—. Y yo seré siempre de ese país.

Atravesamos el canal secreto que, según Nemo, unía el mar Rojo con el Mediterráneo por debajo de la tierra. En el fondo del Atlántico, una noche, el capitán me llevó a caminar entre ruinas cubiertas de algas, iluminadas por un volcán submarino. Eran templos, columnas, murallas. Con un pedazo de tiza, Nemo escribió en una roca una sola palabra: "Atlántida".

Llegamos hasta el Polo Sur, rompiendo el hielo. Nemo plantó allí una bandera negra con una "N" de oro. Al volver, una montaña de hielo se dio vuelta y nos dejó atrapados bajo una capa congelada. El aire se terminaba. Durante días, todos los tripulantes, incluso nosotros, picamos el hielo con piquetas, por turnos, respirando un aire cada vez más pesado. Nemo usó también agua hirviendo para debilitar el hielo. Cuando estábamos a punto de perder el conocimiento, el Nautilus rompió la última capa con su espolón y salimos al mar abierto. Nunca el aire me pareció tan hermoso.

Pero lo más terrible estaba por llegar. Cerca de las islas Bahamas, unos calamares gigantes, de ocho metros, atacaron el Nautilus. Sus tentáculos se enredaban en la hélice. Subimos a cubierta con hachas. Fue una lucha espantosa. Uno de los tripulantes fue atrapado por un tentáculo y arrastrado al mar. Nemo lloró por él.`
      },
      {
        title: 'El torbellino',
        illustration: 'montanas',
        content: `Después de la lucha con los calamares, algo cambió en el capitán. Un día, un barco de guerra nos persiguió y nos atacó con cañones. Nemo, con una furia helada que nunca le había visto, lanzó el Nautilus contra él y lo hundió. Desde los ventanales vi cómo el barco se iba al fondo.

Me horroricé. Comprendí que el capitán Nemo, a pesar de su bondad con los pobres y su amor por la ciencia, llevaba en el alma una herida profunda y una sed de venganza. Más tarde, en su camarote, vi un retrato de una mujer y dos niños. Nemo lo miraba de rodillas, sollozando: "¡Dios todopoderoso, basta, basta!".

Ned Land tenía razón: teníamos que huir.

Una noche, el Nautilus navegaba cerca de las costas de Noruega. Ned nos avisó: era la oportunidad. Subimos en silencio al bote que el submarino llevaba sujeto en su lomo. Justo cuando íbamos a soltarlo, escuchamos gritos dentro del submarino. Una palabra se repetía: "¡Maelstrom! ¡Maelstrom!".

El Maelstrom es un torbellino gigantesco del mar del norte, capaz de tragarse barcos enteros. El Nautilus había entrado en él. El bote se soltó con un golpe y empezó a girar como una hoja. Me golpeé la cabeza y perdí el conocimiento.

Cuando desperté, estaba en la cabaña de un pescador, en una isla de Noruega, junto a Ned Land y Conseil. Estábamos vivos. Del Nautilus, nadie sabía nada.

Habíamos recorrido veinte mil leguas bajo los mares en diez meses. Una legua es una medida antigua, de unos cuatro kilómetros: en total, cerca de ochenta mil kilómetros, casi dos vueltas al mundo.

¿Qué fue del capitán Nemo? ¿Sobrevivió al torbellino? No lo sé. Sólo espero que, si sigue recorriendo los océanos, haya encontrado la paz, y que el sabio que había en él haya vencido al hombre que buscaba venganza.

Porque, como escribió un antiguo libro, sólo dos hombres tienen derecho a responder la pregunta del Eclesiastés, "¿Quién pudo sondear nunca las profundidades del abismo?": el capitán Nemo y yo.`
      }
    ],
    quiz: [
      { question: '¿Qué era en realidad el "monstruo" que hundía barcos?', options: ['Un narval gigante', 'Un submarino, el Nautilus', 'Una ballena', 'Un calamar gigante'], correct: 1, explanation: 'Su lomo era de placas de metal remachadas.' },
      { question: '¿Qué significa "Nemo" en latín?', options: ['Mar', 'Nadie', 'Capitán', 'Libre'], correct: 1, explanation: 'El capitán elige un nombre que oculta su identidad.' },
      { question: '¿Con qué energía funcionaba el Nautilus?', options: ['Vapor', 'Electricidad', 'Viento', 'Petróleo'], correct: 1, explanation: 'Verne imaginó un submarino eléctrico mucho antes de que existieran.' },
      { question: '¿Cómo salieron cuando quedaron atrapados bajo el hielo?', options: ['Esperaron el verano', 'Picaron el hielo por turnos y usaron agua hirviendo hasta romperlo', 'Pidieron ayuda', 'Usaron explosivos'], correct: 1, explanation: 'Fue un trabajo en equipo al límite del aire.' },
      { question: '¿Cómo es el capitán Nemo?', options: ['Un villano sin sentimientos', 'Un personaje complejo: sabio y generoso, pero con una herida profunda y deseo de venganza', 'Un pirata ladrón', 'Un científico aburrido'], correct: 1, explanation: 'Es uno de los personajes más ambiguos de Verne.' }
    ]
  },
  {
    slug: 'la-senal-de-las-3-33',
    title: 'La señal de las 3:33',
    author: 'Tomás Insaurralde',
    synopsis: 'Abril vive en San Juan, cerca de los cielos más limpios del país. Su abuelo es radioaficionado y una madrugada, con su vieja radio, captan una señal que se repite todas las noches a la misma hora: una serie de pitidos que forman números primos. ¿Es un mensaje del espacio? Lo que descubran será más sorprendente —y más cercano— de lo que imaginan.',
    genres: ['Ciencia ficción', 'Suspenso', 'Ciencia'],
    gradeMin: 6, gradeMax: 7,
    cover: { scene: 'cohete', c1: '#14213d', c2: '#fca311' },
    chapters: [
      {
        title: 'Pitidos en la madrugada',
        illustration: 'luna',
        content: `En la casa del abuelo Rubén había un cuarto que olía a polvo y a electricidad. Estaba lleno de radios viejas, cables enrollados, perillas, auriculares y un mapa del mundo lleno de alfileres de colores. Cada alfiler era una persona con la que el abuelo había hablado por radio, desde Japón hasta Islandia.

—La radio es magia de verdad —decía el abuelo—. Ondas invisibles que viajan por el aire a la velocidad de la luz y dan la vuelta al mundo rebotando en la atmósfera.

Abril, de doce años, pasaba las vacaciones de invierno con él en un pueblo de San Juan. Las noches eran heladas y el cielo era tan limpio que la Vía Láctea parecía un río de leche. No por casualidad, cerca de ahí, en El Leoncito, había observatorios astronómicos.

Una noche de julio, Abril no podía dormir. Fue al cuarto de las radios y encontró al abuelo con los auriculares puestos, muy concentrado.

—Escuchá esto —le susurró, y le pasó un auricular.

Entre el ruido de la estática, se oía algo claro y preciso: pitidos. Dos pitidos. Pausa. Tres pitidos. Pausa. Cinco. Siete. Once. Trece. Diecisiete… Después silencio. Y otra vez: dos, tres, cinco, siete…

Abril miró el reloj de la pared. Eran las 3:33 de la madrugada.

—Abuelo… esos números… dos, tres, cinco, siete, once, trece. Son números primos. Los que sólo se pueden dividir por uno y por sí mismos. Lo vimos en Matemática.

El abuelo la miró por encima de los anteojos.

—Exacto. Y ningún fenómeno natural produce números primos, Abril. Esto lo hizo alguien. O algo.

A las 3:41, la señal desapareció.`
      },
      {
        title: 'El cuaderno de las señales',
        illustration: 'cohete',
        content: `La noche siguiente, a las 3:33, la señal volvió. Y la siguiente también. Siempre a la misma hora, durante unos ocho minutos, en la misma frecuencia.

Abril empezó un cuaderno. Anotaba la hora exacta de comienzo y de fin, la intensidad y los números. Con el abuelo descubrieron algo raro: cada noche, la señal empezaba unos segundos más tarde que la anterior.

—Si la señal viniera de una estrella lejana —razonó el abuelo—, aparecería cuatro minutos antes cada noche, por cómo gira la Tierra respecto de las estrellas. Esto no se comporta así.

—¿Y si es una nave? ¿Algo que gira alrededor de la Tierra?

El abuelo se rascó la barba.

—Puede ser. Hay miles de satélites dando vueltas. Pero los satélites que funcionan transmiten datos, no números primos. Y ninguno usa esta frecuencia.

Abril no podía dejar de pensar. Leyó en internet sobre los radiotelescopios que buscan señales de vida inteligente en el espacio. Los científicos decían que, si alguna vez una civilización quisiera comunicarse con nosotros, usaría matemáticas, porque los números son iguales en todo el universo. Y los números primos eran el ejemplo clásico.

Esa noche, a las 3:33, Abril escuchó los pitidos con la piel de gallina. ¿Y si alguien, muy lejos, estaba llamando?

Al cuarto día, el abuelo decidió pedir ayuda. Llamó a una vieja amiga, la doctora Mónica Videla, astrónoma de uno de los observatorios de El Leoncito.

—Rubén —le dijo ella por teléfono, con la voz tensa—, no se lo cuentes a nadie todavía. Mañana voy para allá.`
      },
      {
        title: 'Lo que dijo el cielo',
        illustration: 'montanas',
        content: `La doctora Videla llegó con una computadora portátil y una antena especial. Era una mujer de pelo corto y canoso, que hablaba rápido y anotaba todo.

Esa noche, los tres esperaron en el cuarto de las radios. A las 3:33, los pitidos aparecieron. La doctora movió la antena despacio, siguiendo la señal, y escribió números en la computadora.

—La señal se mueve por el cielo —dijo—. De oeste a este, bastante rápido. Ocho minutos de horizonte a horizonte. No viene de las estrellas. Viene de algo que está en órbita, a unos setecientos kilómetros de altura.

—Entonces es una nave —susurró Abril.

—Es un satélite —dijo la doctora—. Uno muy pequeño. Pero en mi lista de satélites activos no hay nada en esa órbita.

Pasó la noche haciendo cálculos. A la mañana tenía una respuesta. Buscó en catálogos de satélites viejos, apagados hacía décadas, que siguen dando vueltas como basura espacial. Uno coincidía.

—Se llama Cóndor-E1 —leyó—. Lanzado en 1996. Un satélite educativo pequeño, construido con ayuda de alumnos de escuelas secundarias argentinas. Dejó de funcionar en 1999. Lo dieron por muerto.

—¿Y por qué volvió a transmitir? —preguntó el abuelo.

—Pasa a veces —dijo la doctora—. Las baterías de los satélites viejos se rompen, y quedan "en cortocircuito". Si con los años la órbita cambia y los paneles solares vuelven a recibir luz del sol directamente, el satélite se puede reactivar solo, sin batería, sólo mientras está al sol. Es como un fantasma que despierta. Hay casos reales de satélites "zombi" que volvieron a transmitir décadas después.

Abril estaba un poco decepcionada. No eran extraterrestres.

—¿Y los números primos?

La doctora sonrió.

—Eso es lo más lindo. Según este registro, el mensaje de prueba del satélite lo programaron los propios alumnos. Eligieron números primos "para que, si algún día los escucha alguien del espacio, sepa que en la Tierra hay seres que piensan". Firmaba el proyecto una escuela de San Juan.

El abuelo se quedó muy quieto. Se le habían llenado los ojos de lágrimas.`
      },
      {
        title: 'Un mensaje para el futuro',
        illustration: 'escuela',
        content: `—¿Qué escuela? —preguntó el abuelo, con la voz quebrada.

La doctora leyó el nombre. Era la escuela secundaria del pueblo. La misma donde la abuela de Abril, Elena, había sido profesora de Física durante treinta años.

El abuelo se levantó, fue a su biblioteca y volvió con una caja de cartón. Adentro había fotos viejas. En una, de 1996, se veía un grupo de adolescentes sonrientes alrededor de una cajita metálica con antenas. En el medio, con guardapolvo blanco, estaba la abuela Elena.

—Ella nunca me contó los detalles —dijo el abuelo—. Sólo que sus alumnos habían mandado "un mensaje al cielo". Murió hace cinco años. Y ahora… el mensaje volvió.

Abril tomó la foto con cuidado. No había conocido mucho a su abuela; era chica cuando murió. Pero ahora sentía que la estaba escuchando. Cada noche, a las 3:33, su abuela y sus alumnos le hablaban desde el espacio, con el idioma más universal que existe: las matemáticas.

La noticia salió en los diarios: "Satélite educativo argentino despierta después de 27 años". La doctora Videla organizó un encuentro en la escuela del pueblo, y vinieron algunos de aquellos alumnos, que ya eran adultos: un ingeniero, una maestra, un médico, un mecánico. Todos lloraron al escuchar los pitidos grabados.

—La profesora Elena nos decía que la ciencia es una carta al futuro —dijo uno de ellos—. Que nunca sabés quién la va a leer.

Esa noche, Abril y el abuelo esperaron a las 3:33 con los auriculares puestos. Cuando los pitidos llegaron —dos, tres, cinco, siete, once, trece—, Abril tomó el micrófono de la radio. Sabía que el pequeño satélite no podía escucharla. Pero igual habló.

—Hola, abuela. Te escuchamos.

Afuera, en el cielo de San Juan, entre millones de estrellas, una lucecita diminuta cruzaba de oeste a este, llevando un mensaje que alguien había lanzado con amor hacía casi treinta años. Abril decidió en ese momento que iba a estudiar ciencia. Para escribir, ella también, su propia carta al futuro.`
      }
    ],
    quiz: [
      { question: '¿Por qué los pitidos llamaron tanto la atención?', options: ['Porque eran muy fuertes', 'Porque formaban números primos, que no produce la naturaleza', 'Porque sonaban como música', 'Porque eran de día'], correct: 1, explanation: 'Una secuencia de primos indica que alguien la programó.' },
      { question: '¿Qué es un número primo?', options: ['Un número par', 'Un número que sólo se puede dividir por uno y por sí mismo', 'Un número mayor que cien', 'Un número negativo'], correct: 1, explanation: 'Ejemplos: 2, 3, 5, 7, 11, 13…' },
      { question: '¿Cómo supo la doctora que la señal venía de algo en órbita?', options: ['Por el sonido', 'Porque se movía rápido por el cielo de oeste a este en pocos minutos', 'Porque lo dijo la radio', 'Por un mensaje'], correct: 1, explanation: 'Las estrellas se mueven mucho más lento en el cielo.' },
      { question: '¿Por qué el viejo satélite volvió a transmitir?', options: ['Alguien lo reparó', 'Sus paneles volvieron a recibir sol y se reactivó solo', 'Fue un error de la radio', 'Lo encendieron desde la Tierra'], correct: 1, explanation: 'Hay satélites "zombi" que reviven décadas después.' },
      { question: '¿Qué significa la frase "la ciencia es una carta al futuro"?', options: ['Que hay que escribir cartas', 'Que lo que investigamos hoy puede servir o emocionar a personas que todavía no conocemos', 'Que el futuro es aburrido', 'Que los satélites llevan cartas'], correct: 1, explanation: 'El mensaje de los alumnos llegó décadas después.' }
    ]
  },
  {
    slug: 'desaparecido-en-la-quebrada',
    title: 'Desaparecido en la Quebrada',
    author: 'Lucía Ferrer',
    synopsis: 'En el viaje de egresados de séptimo grado a la Quebrada de Humahuaca, Santi desaparece de madrugada sin dejar rastro. Los adultos lo buscan desesperados. Sus amigos Emma y Joaquín saben algo que los demás no: Santi tenía un plan secreto. Para encontrarlo antes de que caiga la noche, tendrán que pensar como él.',
    genres: ['Misterio', 'Suspenso', 'Aventura'],
    gradeMin: 6, gradeMax: 7,
    cover: { scene: 'montanas', c1: '#e76f51', c2: '#6d597a' },
    chapters: [
      {
        title: 'La cama vacía',
        illustration: 'montanas',
        content: `El viaje de egresados de séptimo grado era a la Quebrada de Humahuaca, en Jujuy. Hacía cuatro días que recorrían pueblos de adobe, cerros de colores y caminos de tierra. Habían visto el Cerro de los Siete Colores en Purmamarca, el monumento a la Independencia en Humahuaca y los cardones gigantes que parecían personas con los brazos levantados.

La noche del cuarto día durmieron en un albergue en Tilcara. A las seis de la mañana, la profesora Ana entró al cuarto de los varones para despertarlos. Contó las camas. Una estaba vacía.

—¿Dónde está Santiago?

Nadie sabía. Lo buscaron en los baños, en el comedor, en el patio, en la calle. Nada. Su mochila tampoco estaba. Su celular sonaba "apagado o fuera del área de cobertura".

En una hora, todo se volvió un caos. La profesora llamó a la policía, al guía, a los papás de Santi en Buenos Aires. Los chicos estaban asustados. Algunos lloraban. Circulaban rumores terribles: que se había escapado, que se lo habían llevado, que se había caído al río.

Emma y Joaquín, sus dos mejores amigos, estaban sentados en el patio del albergue, pálidos, sin hablar. Hasta que Emma rompió el silencio.

—Joaco. Vos sabés lo mismo que yo.

Joaquín bajó la vista.

—Lo del amanecer.

—Lo del amanecer. Tenemos que decirlo.

—Pero le prometimos que no…

—Joaquín —dijo Emma, firme—. Hay promesas que no se pueden cumplir cuando alguien puede estar en peligro.`
      },
      {
        title: 'El plan secreto de Santi',
        illustration: 'luna',
        content: `Fueron a hablar con la profesora Ana y con el comisario, un hombre de bigote espeso llamado Mamaní, que tomaba notas en una libreta.

—Santi está obsesionado con la astronomía y con la fotografía —explicó Emma—. Hace días que hablaba de sacar una foto del amanecer desde el Pucará de Tilcara, con el sol saliendo justo detrás de los cerros. Decía que era el mejor lugar de toda la Quebrada. Nos dijo que iba a ir de madrugada, solo, y que volvía antes de que nos despertáramos.

—¿Y no se lo dijeron a nadie? —preguntó la profesora, entre enojada y asustada.

—Le dijimos que era peligroso —dijo Joaquín, con la voz temblorosa—. Pero nos hizo jurar que no íbamos a contar nada. Pensamos que no lo iba a hacer.

El comisario mandó un grupo de rescatistas al Pucará, las ruinas de una antigua fortaleza en lo alto de un cerro, a la salida del pueblo. Volvieron dos horas después. No había rastros de Santi.

—Revisamos todo el Pucará —dijo un rescatista—. Si estuvo, ya se fue. O nunca llegó.

Emma sintió que se le cerraba la garganta. Si no estaba en el Pucará, ¿dónde podía estar? Pensó en Santi: en cómo hablaba, en lo que le gustaba, en sus manías. Y recordó algo.

—Joaquín, ¿te acordás del cuaderno que Santi llevaba a todos lados?

—El de las tapas verdes. Lo tiene siempre en la mochila.

—No. Ayer a la noche lo dejó cargando el celular en el comedor… y el cuaderno quedó en la mesa. Yo lo guardé para dárselo hoy.

Emma corrió a su cuarto y volvió con el cuaderno. Lo abrieron juntos. Estaba lleno de dibujos de constelaciones, horarios, números y bocetos de paisajes. En la última página había algo escrito con letra apurada.`
      },
      {
        title: 'Pensar como Santi',
        illustration: 'montanas',
        content: `La última página decía:

"Amanecer Tilcara: 7:42. Azimut del sol: 112°, más o menos al este-sudeste.
Pucará: el sol sale detrás del cerro grande. NO SIRVE: el cerro tapa.
Mejor: cruzar la quebrada seca hacia el este. Subir a la loma de las piedras rojas. Desde ahí, el sol sale por la abertura del valle Y el Pucará queda en primer plano.
Salida: 5:45. Llevar: linterna, agua, campera, cámara".

Y debajo, un dibujo: una línea que representaba el río Grande, el pueblo, el Pucará, y una flecha que cruzaba hacia el otro lado del río, hasta una loma marcada con una estrella.

—No fue al Pucará —dijo Joaquín—. Fue al otro lado. A fotografiar el Pucará desde lejos.

Llevaron el cuaderno al comisario. Mamaní lo estudió con atención.

—Esa loma está del otro lado del río, a unos tres kilómetros. Hay que cruzar una quebrada seca, con piedras sueltas. Si salió de noche, con linterna… pudo resbalar.

El comisario organizó un nuevo grupo de búsqueda. Emma y Joaquín pidieron ir.

—Ustedes se quedan —dijo la profesora.

—Por favor —insistió Emma—. Nosotros sabemos cómo piensa. Si encontramos alguna pista, la vamos a entender más rápido. Vamos con los rescatistas, no nos separamos de ellos y hacemos todo lo que nos digan.

El comisario y la profesora se miraron. Al final, Mamaní asintió.

—Vienen conmigo. Y no se separan de mí ni un metro.

Eran las dos de la tarde. El sol de la Quebrada quemaba. Y a las seis y media, el sol se escondería detrás de los cerros, y la temperatura bajaría bajo cero.`
      },
      {
        title: 'La loma de las piedras rojas',
        illustration: 'montanas',
        content: `Cruzaron el río por un puente de troncos y caminaron por la quebrada seca. Las piedras se movían bajo los pies. El aire era fino y Emma sentía que le faltaba el aliento por la altura. Los rescatistas gritaban "¡Santiago!" cada pocos minutos. Sólo respondía el eco.

Joaquín iba mirando el suelo. De pronto se agachó.

—¡Miren!

Entre las piedras había un envoltorio de un alfajor, de la marca que Santi comía todo el tiempo. Más adelante, Emma vio otra cosa: una huella de zapatilla en la arena de un arroyito seco, con el dibujo de una estrella en la suela. Las zapatillas de Santi.

Siguieron las huellas hacia la loma de piedras rojas. A mitad de la subida, las huellas terminaban de golpe en el borde de una pequeña barranca. Abajo, a unos cuatro metros, había un hueco entre rocas.

—¡Santi! —gritó Emma.

Una voz débil contestó desde abajo.

—¡Acá! ¡Estoy acá!

Santi estaba sentado en el fondo del hueco, con la pierna estirada y la cara llena de tierra. Se había resbalado en la oscuridad, a la madrugada, y se había torcido el tobillo. No podía subir. El celular se le había roto en la caída. Había pasado todo el día gritando, sin que nadie lo escuchara.

Los rescatistas bajaron con sogas, le inmovilizaron el tobillo y lo subieron con cuidado. Cuando estuvo arriba, Emma y Joaquín lo abrazaron tan fuerte que casi se caen los tres.

—Perdón —dijo Santi, llorando—. Fue una idea estúpida.

—Fue una idea peligrosa —lo corrigió el comisario Mamaní, serio pero aliviado—. La montaña no perdona a los que andan solos de noche sin avisar. Tuviste suerte. Y tus amigos tuvieron la valentía de romper una promesa para salvarte.

Llegaron al albergue justo cuando el sol desaparecía y empezaba el frío. Todo el grupo los recibió con aplausos.

Esa noche, en el comedor, Santi le pidió a Emma el cuaderno de tapas verdes. Lo abrió en la última página y, debajo de su plan, escribió con letra temblorosa:

"Lección: los mejores planes se comparten. Nunca solo. Nunca sin avisar. Y los amigos que rompen una promesa para cuidarte son los que vale la pena tener".

Al día siguiente, al amanecer, a las 7:42, todo el grupo subió al Pucará con los guías. El sol salió detrás del cerro, tal como Santi había calculado. No era el ángulo perfecto. Pero era, sin duda, el amanecer más lindo de sus vidas.`
      }
    ],
    quiz: [
      { question: '¿Por qué Emma decidió contar el plan secreto de Santi?', options: ['Porque estaba enojada', 'Porque una promesa no puede cumplirse si alguien puede estar en peligro', 'Porque se lo pidió Joaquín', 'Porque quería castigarlo'], correct: 1, explanation: 'La seguridad de su amigo era más importante que el secreto.' },
      { question: '¿Qué pista clave encontraron en el cuaderno?', options: ['Un mapa del tesoro', 'El plan de ir a una loma del otro lado del río para fotografiar el amanecer', 'Una carta de despedida', 'Un número de teléfono'], correct: 1, explanation: 'Santi había descartado el Pucará porque el cerro tapaba el sol.' },
      { question: '¿Qué indica el "azimut" en las notas de Santi?', options: ['La altura de una montaña', 'La dirección en el horizonte por donde sale el sol', 'La temperatura', 'La hora'], correct: 1, explanation: 'El azimut es un ángulo que marca una dirección sobre el horizonte.' },
      { question: '¿Por qué era urgente encontrarlo antes de la noche?', options: ['Porque cerraba el albergue', 'Porque al anochecer la temperatura en la Quebrada baja bajo cero', 'Porque había tormenta', 'Porque se iba el micro'], correct: 1, explanation: 'El frío nocturno de la montaña es muy peligroso.' },
      { question: '¿Qué aprendió Santi?', options: ['Que la fotografía es aburrida', 'Que los planes se comparten y nunca hay que ir solo sin avisar', 'Que no hay que hacer amigos', 'Que el Pucará es feo'], correct: 1, explanation: 'Lo escribió él mismo en su cuaderno.' }
    ]
  }
];
