/* Sección 3 · El Observatorio (6.º y 7.º grado) — libros nuevos (parte A) */
const PD = (obra) => `Adaptación libre de ${obra}, obra de dominio público`;

module.exports = [
  {
    slug: 'cuentos-de-la-selva-y-del-miedo',
    title: 'Cuentos de la selva y del miedo',
    author: 'Horacio Quiroga (adaptación de la Biblioteca)',
    license: PD('cuentos de Horacio Quiroga («El almohadón de plumas», 1907; «La tortuga gigante» y «Las medias de los flamencos», de Cuentos de la selva, 1918)'),
    synopsis: 'Horacio Quiroga vivió en la selva de Misiones y escribió algunos de los cuentos más famosos de nuestra literatura: unos tiernos y llenos de animales que hablan, otros inquietantes, de esos que se quedan dando vueltas en la cabeza. Tres de sus relatos, contados de nuevo para lectores de hoy.',
    genres: ['Cuento', 'Terror', 'Naturaleza'],
    gradeMin: 6, gradeMax: 7,
    cover: { scene: 'bosque', c1: '#606c38', c2: '#283618' },
    chapters: [
      {
        title: 'Las medias de los flamencos',
        illustration: 'oceano',
        content: `Cierta vez las víboras dieron un gran baile. Invitaron a las ranas y a los sapos, a los flamencos, a los yacarés y a los peces. Los peces, como no caminan, no pudieron bailar; pero, sentados a la orilla del río, aplaudían con la cola.

Los yacarés, para estar elegantes, se pusieron en el pescuezo un collar de bananas. Los sapos se pegaron escamas de pescado en todo el cuerpo y caminaban meneándose, como si nadaran. Las ranas se perfumaron y caminaban en dos pies. Pero las más lindas eran las víboras de coral, que llevaban un traje de rayas rojas, blancas y negras, y bailaban como serpentinas.

Sólo los flamencos estaban tristes. En aquel tiempo tenían las patas blancas, y como son tan poco inteligentes, no se les había ocurrido cómo adornarse. Envidiaban a todos, y sobre todo a las víboras de coral.

—Ya sé —dijo uno—. Vamos a ponernos medias coloradas, blancas y negras, y las víboras se van a enamorar de nosotros.

Fueron al almacén del pueblo.

—¡Tan-tan! ¿Tiene medias coloradas, blancas y negras?

—No hay —contestó el almacenero.

Fueron a otro, y a otro. En ninguna parte había. Entonces un tatú, que había ido a tomar agua al río, se quiso burlar de ellos:

—Yo sé dónde hay medias así. Vayan a ver a la lechuza.

La lechuza, que era muy pícara, les dijo:

—Esperen un momento. —Y volvió con unas medias preciosas, rojas, blancas y negras—. Pero no dejen de bailar ni un instante. Si se detienen, en vez de bailar, van a llorar.

Las medias no eran medias: eran cueros de víboras de coral, que la lechuza había cazado.

Los flamencos se las pusieron muy contentos y llegaron al baile. Todos se quedaron mirándolos. Las víboras, sobre todo, no les sacaban los ojos de encima a esas medias. Bailaron y bailaron, hasta que, cansados, tuvieron que detenerse un instante. Entonces las víboras se acercaron, vieron de cerca las medias… y descubrieron que eran cueros de sus hermanas.

—¡No son medias! —gritaron—. ¡Nos mataron a nuestras hermanas!

Y se lanzaron sobre los flamencos, mordiéndoles las patas. Los flamencos huyeron volando, con las patas ardiendo por el veneno, y se metieron en el agua para calmar el dolor.

Desde entonces, los flamencos tienen las patas coloradas, como si todavía les ardieran. Y se pasan el día parados en el agua, con las patas rojas metidas en el río, tratando de calmar ese ardor que no se les pasa nunca.`
      },
      {
        title: 'La tortuga gigante',
        illustration: 'bosque',
        content: `Había una vez un hombre que vivía en Buenos Aires y estaba muy contento porque era fuerte y trabajador. Pero un día se enfermó, y los médicos le dijeron que solamente yéndose al campo podría curarse. Él no quería ir, porque tenía hermanos chicos a quienes daba de comer; pero se enfermaba cada día más. Entonces, un amigo suyo, que era director del Zoológico, le dijo:

—Usted es amigo mío, y es un hombre bueno y trabajador. Por eso quiero que se vaya a vivir al monte, a hacer mucho ejercicio al aire libre para curarse. Y como usted tiene mucha puntería con la escopeta, cace bichos del monte para traerme los cueros.

El hombre se fue a vivir al monte, lejos, más lejos que Misiones todavía. Hacía allá mucho calor, y eso le hacía bien. Comía pájaros y bichos del monte, dormía bajo los árboles y poco a poco se puso fuerte.

Un día vio a un tigre enorme que quería comerse a una tortuga, una tortuga grandísima, a la que el tigre le había lastimado la cabeza. El hombre le apuntó al tigre y, de un solo tiro, la salvó. Después le curó la herida con trapos y grasa, y la cuidó durante días, dándole hierbas para comer, hasta que la tortuga se curó.

Pero entonces fue el hombre el que se enfermó. Le dio una fiebre terrible y se quedó tirado, sin poder moverse.

—Me voy a morir —dijo—. Estoy solo, y tengo mucha sed.

La tortuga lo oyó. Ella no sabía hablar, pero lo había comprendido todo.

—El hombre no me comió, aunque tenía hambre, y me curó —pensó—. Ahora yo lo voy a curar a él.

Fue al arroyo, juntó agua en la cáscara de un caracol y le dio de beber. Le buscó raíces y hierbas. Pero el hombre seguía enfermo. Entonces la tortuga tomó una decisión. Se lo cargó en el lomo, atado con enredaderas, y empezó a caminar hacia Buenos Aires.

Caminó durante días, semanas, meses. Cruzó montes, pantanos y ríos. Comía cuando podía, dormía poco. Llevaba al hombre arriba, que deliraba de fiebre. Cuando estaba ya muerta de cansancio, una noche, vio a lo lejos un resplandor en el cielo: eran las luces de Buenos Aires.

Siguió caminando, a la madrugada, por las calles de la ciudad, hasta que llegó al Zoológico. Golpeó la puerta con el pico. El director salió, vio al hombre enfermo atado sobre una tortuga gigante, y no lo pudo creer.

Lo curaron. El hombre se mejoró y, cuando supo lo que la tortuga había hecho por él, no quiso separarse de ella. Pero como no podía tenerla en su casa, el director le dio un lugar en el Zoológico, donde la cuidaron como a una reina.

Y el hombre fue todos los días a visitarla. Le hacía cariños en la cabeza, y ella, aunque no hablaba, lo miraba como se mira a un amigo.`
      },
      {
        title: 'El almohadón de plumas',
        illustration: 'casona',
        content: `Su luna de miel fue un largo escalofrío. Alicia, rubia, angelical y tímida, se había casado con Jordán, un hombre serio, callado y de carácter duro. Ella lo quería mucho, pero el carácter frío de su marido la hacía estremecerse a veces.

La casa en que vivían tampoco ayudaba. Era una casa grande, silenciosa, con paredes blancas y patios de mármol, donde todo resonaba y donde siempre parecía hacer frío, aun en verano.

Alicia empezó a adelgazar. Tuvo un ataque de gripe que se arrastró durante días, y después ya no se recuperó. Una tarde, paseando por el jardín, se quedó sin fuerzas. Esa noche ya no se levantó de la cama.

El médico la revisó con atención.

—No sé qué tiene —dijo—. Está muy débil, como si cada día perdiera sangre. Pero no veo ninguna herida. No vomita, no tiene fiebre alta. Simplemente, se apaga.

Los días pasaron. Alicia empeoraba. Por las mañanas se despertaba más pálida que la noche anterior, y durante el día parecía recuperarse un poco. Pero cada noche volvía a hundirse. Tenía alucinaciones: veía en la alfombra figuras horribles que se arrastraban hacia ella. Jordán caminaba de un lado al otro de la sala, sin saber qué hacer.

Una mañana, Alicia ya no despertó.

Cuando la sirvienta entró a deshacer la cama, se quedó mirando el almohadón de plumas donde Alicia había apoyado la cabeza.

—Señor —dijo, en voz baja—, el almohadón tiene unas manchas que parecen de sangre.

Jordán se acercó. En el lugar donde había descansado la cabeza de Alicia se veían dos puntitos oscuros. Levantó el almohadón. Pesaba muchísimo, como si estuviera lleno de algo más que plumas.

Lo llevó a la mesa del comedor y lo abrió con un cuchillo. Las plumas volaron, y la sirvienta dio un grito: entre las plumas, moviéndose lentamente, había un animal monstruoso, una bola viviente y viscosa, hinchada como un globo, con unas patitas velludas. Estaba tan lleno de sangre que apenas se le veía la boca.

Noche tras noche, desde que Alicia había caído en cama, aquel animal había aplicado su boca a las sienes de ella, chupándole la sangre en silencio. La picadura era casi imperceptible. Y como Alicia apoyaba la cabeza todas las noches en el mismo almohadón, el animal había ido creciendo mientras ella se apagaba.

Estos parásitos de las aves, diminutos en el medio común, llegan a adquirir en ciertas condiciones proporciones enormes. La sangre humana parece serles particularmente favorable, y no es raro encontrarlos en los almohadones de plumas.`
      }
    ],
    quiz: [
      { question: 'Según "Las medias de los flamencos", ¿por qué los flamencos tienen las patas rojas?', options: ['Por el sol', 'Por el veneno de las víboras que los mordieron', 'Porque las pintaron', 'Porque comen frutas rojas'], correct: 1, explanation: 'Es un cuento que "explica" de forma fantástica un rasgo de la naturaleza.' },
      { question: '¿Qué hizo la tortuga gigante para salvar al hombre?', options: ['Llamó a un médico', 'Lo llevó en su lomo hasta Buenos Aires', 'Le dio un remedio mágico', 'Buscó a otros animales'], correct: 1, explanation: 'Caminó durante meses cargándolo.' },
      { question: '¿Qué valores aparecen en "La tortuga gigante"?', options: ['La envidia', 'La gratitud y la amistad', 'La venganza', 'El engaño'], correct: 1, explanation: 'La tortuga devuelve el cuidado que había recibido.' },
      { question: '¿Qué provocaba la enfermedad de Alicia en "El almohadón de plumas"?', options: ['Un virus', 'Un parásito escondido en el almohadón que le chupaba la sangre', 'La tristeza', 'Un veneno'], correct: 1, explanation: 'El final revela la causa de manera sorpresiva.' },
      { question: '¿Qué tipo de final tiene "El almohadón de plumas"?', options: ['Feliz', 'Sorpresivo, con una revelación inquietante', 'Abierto sin explicación', 'Cómico'], correct: 1, explanation: 'Quiroga guarda la explicación para el final, como en muchos cuentos de terror.' }
    ]
  },
  {
    slug: 'el-corazon-delator-y-la-mascara-de-la-muerte-roja',
    title: 'El corazón delator y otros cuentos de Poe',
    author: 'Edgar Allan Poe (adaptación de la Biblioteca)',
    license: PD('«El corazón delator» (1843) y «La máscara de la Muerte Roja» (1842) de Edgar Allan Poe'),
    synopsis: 'Un narrador que insiste en que no está loco mientras cuenta un crimen que lo atormenta. Un príncipe que se encierra con sus amigos en un palacio para escapar de una peste. Dos cuentos de Edgar Allan Poe, el maestro del terror psicológico, en una versión para lectores valientes.',
    genres: ['Terror', 'Suspenso', 'Cuento'],
    gradeMin: 6, gradeMax: 7,
    cover: { scene: 'casona', c1: '#1b1b2f', c2: '#9d0208' },
    chapters: [
      {
        title: 'El corazón delator (I): el ojo',
        illustration: 'casona',
        content: `¡Es verdad! Soy nervioso, terriblemente nervioso. Siempre lo fui. Pero ¿por qué dicen que estoy loco? La enfermedad agudizó mis sentidos; no los destruyó. Sobre todo, el oído. Oía todo lo que pasa en el cielo y en la tierra. ¿Cómo, entonces, puedo estar loco? Escuchen. Observen con qué calma, con qué cordura les cuento esta historia.

Es imposible decir cómo se me metió la idea en la cabeza. No había un motivo. Yo quería al viejo con quien vivía. Nunca me había hecho daño. Nunca me había ofendido. No deseaba su dinero. Creo que fue su ojo. ¡Sí, eso fue! Tenía un ojo como el de un buitre: un ojo celeste pálido, cubierto por una tela. Cada vez que me miraba, se me helaba la sangre. Y así, poco a poco, muy gradualmente, decidí librarme para siempre de aquel ojo.

Ustedes me creen loco. Los locos no saben nada. Pero deberían haberme visto. ¡Con qué prudencia procedí! Nunca fui tan amable con el viejo como durante la semana anterior. Y cada noche, cerca de las doce, giraba el picaporte de su puerta y la abría, ¡oh, tan despacio! Metía una linterna sorda, cerrada, que no dejaba salir ninguna luz, y después la cabeza. Tardaba una hora en meter la cabeza por la abertura, tan lentamente para no despertarlo. ¿Haría eso un loco? Después, cuando mi cabeza estaba dentro, abría la linterna con cuidado, sólo lo suficiente para que un rayo finito cayera sobre el ojo del buitre.

Durante siete noches hice lo mismo. Y siempre encontré el ojo cerrado. Así que era imposible hacer el trabajo, porque no era el viejo quien me molestaba, sino su ojo maldito.

La octava noche fui más cuidadoso que nunca. El minutero de un reloj se mueve más rápido que mi mano. Estaba abriendo la puerta, poco a poco, cuando el viejo se movió en la cama. Mi dedo resbaló sobre el cierre de la linterna, y el viejo se incorporó, gritando:

—¿Quién anda ahí?

Me quedé inmóvil. Durante una hora entera no moví un músculo, y en todo ese tiempo no lo oí volver a acostarse. Estaba sentado en la cama, escuchando, igual que yo lo había hecho tantas noches, oyendo los ruidos de la muerte en la pared.`
      },
      {
        title: 'El corazón delator (II): el latido',
        illustration: 'luna',
        content: `Al rato oí un gemido. No era de dolor ni de pena: era el gemido sordo que sube desde el fondo de un alma llena de terror. Yo conocía ese sonido. Muchas noches había brotado de mi propio pecho. El viejo sabía que había alguien en la habitación. Sentía la presencia de la muerte, aunque no la viera.

Abrí la linterna, muy poco, hasta que un único rayo, fino como un hilo de araña, cayó sobre el ojo del buitre. Estaba abierto. Abierto de par en par. Y me enfureció mirarlo.

Entonces llegó a mis oídos un sonido apagado y rápido, como el de un reloj envuelto en algodón. Yo conocía ese sonido. Era el latido del corazón del viejo. Aumentó mi furia, como el redoble de un tambor aumenta el coraje del soldado.

El latido crecía, más rápido, más fuerte. El terror del viejo debía ser extremo. ¡Más fuerte, más fuerte! Y temí que algún vecino pudiera oírlo. Llegó la hora del viejo. Con un grito, abrí la linterna y salté dentro de la habitación. Él gritó una sola vez. En un instante todo terminó. El corazón siguió latiendo unos minutos con un sonido ahogado. Después se detuvo. El ojo no volvería a molestarme.

Si todavía me creen loco, ya no lo creerán cuando les cuente las precauciones que tomé para esconder el cuerpo. Levanté tres tablas del piso de la habitación y lo escondí allí, entre las vigas. Después volví a colocar las tablas con tanta habilidad que ningún ojo humano, ni siquiera el suyo, hubiera podido notar nada.

A las cuatro de la mañana golpearon la puerta. Eran tres policías. Un vecino había escuchado un grito durante la noche y habían venido a investigar.

Los hice pasar con una sonrisa. ¿Qué tenía que temer? El grito, les dije, lo había dado yo, en sueños. El viejo, les expliqué, estaba de viaje en el campo. Les mostré la casa entera. Los llevé, por último, a su habitación. Traje sillas y, en mi entusiasmo, puse la mía justo encima de las tablas bajo las cuales descansaba la víctima.

Los policías estaban satisfechos. Charlaban tranquilos. Pero al rato sentí que palidecía. Me dolía la cabeza y me zumbaban los oídos. El zumbido se volvió más claro. Era un sonido apagado y rápido… como el de un reloj envuelto en algodón.

Hablé más fuerte. Me levanté, discutí, golpeé la silla contra el piso. Pero el sonido crecía. ¿Cómo era posible que ellos no lo oyeran? ¡Lo oían! ¡Sospechaban! ¡Se burlaban de mi horror! ¡Más fuerte! ¡Más fuerte!

—¡Basta de fingir! —grité—. ¡Lo confieso todo! ¡Levanten esas tablas! ¡Ahí, ahí! ¡Es el latido de su horrible corazón!`
      },
      {
        title: 'La máscara de la Muerte Roja',
        illustration: 'castillo',
        content: `Hacía mucho tiempo que la Muerte Roja devastaba el país. Nunca una peste había sido tan terrible. Sus señales eran el color rojo y el horror de la sangre: dolores agudos, un mareo repentino y, en menos de media hora, el fin.

Pero el príncipe Próspero era feliz, valiente y astuto. Cuando la mitad de su reino había muerto, convocó a mil amigos sanos y alegres de su corte y se retiró con ellos a una de sus abadías fortificadas. Una muralla alta rodeaba el edificio, con puertas de hierro. Una vez adentro, los cortesanos soldaron los cerrojos. No pensaban dejar salir a nadie, ni dejar entrar a la desesperación. Afuera, que el mundo se arreglara solo. Adentro había músicos, bailarines, vino y belleza. Afuera, la Muerte Roja.

Al quinto o sexto mes de encierro, mientras la peste arrasaba el exterior, el príncipe ofreció a sus invitados un baile de máscaras de una magnificencia nunca vista.

El baile se hizo en siete salones conectados entre sí, cada uno de un color: el primero azul, el segundo púrpura, el tercero verde, el cuarto anaranjado, el quinto blanco, el sexto violeta. El séptimo estaba cubierto de terciopelo negro, y sus ventanas eran de un rojo intenso, color sangre. Pocos invitados se animaban a entrar en él. Allí había, además, un gigantesco reloj de ébano. Cada vez que daba la hora, sonaba de un modo tan extraño que los músicos dejaban de tocar y los bailarines se quedaban quietos, pálidos, con un escalofrío. Después se reían de sus nervios, y la fiesta seguía.

Cuando el reloj dio las doce de la noche, la multitud notó la presencia de una figura enmascarada que nadie había visto antes. Era alta, delgada, envuelta en un sudario como el de las tumbas. Su máscara imitaba el rostro rígido de un cadáver. Y su ropa y su cara estaban salpicadas de manchas rojas: el disfraz imitaba a la Muerte Roja.

El príncipe Próspero se puso rojo de furia.

—¿Quién se atreve a burlarse de nosotros de esta manera? —gritó—. ¡Agárrenlo y quítenle la máscara!

Pero nadie se animó a tocar al desconocido, que caminó lentamente por los salones: el azul, el púrpura, el verde, el anaranjado, el blanco, el violeta. El príncipe, avergonzado de su propio miedo, sacó un puñal y corrió detrás de él. Lo alcanzó en el salón negro. La figura se dio vuelta. Se oyó un grito, y el príncipe cayó muerto sobre la alfombra.

Los invitados, desesperados, se lanzaron sobre el enmascarado y le arrancaron el sudario y la máscara. Debajo no había nada. Ninguna forma. Sólo vacío.

Entonces reconocieron la presencia de la Muerte Roja. Había llegado como un ladrón en la noche. Y uno a uno fueron cayendo los invitados en los salones de la fiesta. El reloj de ébano se detuvo. Y las tinieblas, la ruina y la Muerte Roja tuvieron un dominio ilimitado sobre todo.`
      }
    ],
    quiz: [
      { question: '¿Por qué el narrador de "El corazón delator" insiste tanto en que no está loco?', options: ['Porque es médico', 'Porque intenta convencernos, aunque su relato muestra lo contrario', 'Porque lo dice un juez', 'Porque es verdad'], correct: 1, explanation: 'Es un narrador poco confiable: su propia forma de contar lo delata.' },
      { question: '¿Qué molestaba al narrador del viejo?', options: ['Su dinero', 'Su ojo de buitre', 'Sus gritos', 'Su casa'], correct: 1, explanation: 'Él mismo dice que no tenía otro motivo.' },
      { question: '¿Por qué confiesa el crimen ante los policías?', options: ['Porque lo vieron', 'Porque cree oír el latido del corazón del viejo y no lo soporta', 'Porque encontraron el cuerpo', 'Porque un vecino lo acusó'], correct: 1, explanation: 'Su culpa y sus nervios lo traicionan.' },
      { question: 'En "La máscara de la Muerte Roja", ¿qué intentó hacer el príncipe Próspero?', options: ['Curar a los enfermos', 'Encerrarse con sus amigos para escapar de la peste', 'Huir a otro país', 'Buscar un médico'], correct: 1, explanation: 'Se aisló dejando al pueblo afuera, sufriendo la peste.' },
      { question: '¿Qué idea transmite el final de ese cuento?', options: ['Que el dinero salva de todo', 'Que nadie puede escapar de la muerte, por más poder que tenga', 'Que las fiestas son peligrosas', 'Que los relojes dan miedo'], correct: 1, explanation: 'La peste entra igual: el poder no protege del destino común.' }
    ]
  },
  {
    slug: 'frankenstein',
    title: 'Frankenstein',
    author: 'Mary Shelley (adaptación de la Biblioteca)',
    license: PD('«Frankenstein o el moderno Prometeo» de Mary Shelley (1818)'),
    synopsis: 'Víctor Frankenstein, un joven científico obsesionado, logra dar vida a un ser hecho con sus propias manos. Pero cuando lo ve abrir los ojos, huye horrorizado y lo abandona. La criatura, sola y rechazada por todos, buscará respuestas… y su creador tendrá que enfrentar las consecuencias. Una de las primeras novelas de ciencia ficción de la historia.',
    genres: ['Ciencia ficción', 'Terror', 'Novela'],
    gradeMin: 6, gradeMax: 7,
    featured: true,
    cover: { scene: 'castillo', c1: '#2b2d42', c2: '#588157' },
    chapters: [
      {
        title: 'Un hombre en el hielo',
        illustration: 'pinguino',
        content: `En el verano de 1797, el barco del explorador Robert Walton avanzaba lentamente entre los hielos del Polo Norte. Walton soñaba con llegar a donde nadie había llegado, aunque para eso tuviera que arriesgarlo todo.

Una mañana, la tripulación vio algo increíble: a lo lejos, sobre el hielo, un trineo tirado por perros, y en él una figura de forma humana pero de un tamaño gigantesco, que se alejó rápidamente hacia el norte. Al día siguiente encontraron otro trineo, a la deriva sobre un témpano. En él había un hombre casi muerto de frío y cansancio. Lo subieron al barco.

Cuando se recuperó un poco, el hombre miró a Walton con ojos muy tristes.

—Usted busca el conocimiento a cualquier precio, como lo hice yo —le dijo—. Escuche mi historia. Tal vez le sirva de advertencia.

Se llamaba Víctor Frankenstein. Había nacido en Ginebra, en una familia feliz. Tenía un hermano pequeño, William, y una prima que se crió con él, Elizabeth, a quien amaba profundamente. Su mejor amigo era Henry Clerval, un muchacho alegre que adoraba la poesía.

Desde chico, a Víctor le apasionaban los secretos de la naturaleza. Leía a viejos alquimistas que buscaban el elixir de la vida. Cuando entró a la universidad de Ingolstadt, en Alemania, descubrió la química moderna y la electricidad, y se obsesionó con una pregunta: ¿de dónde viene la vida? ¿Se podría crear?

Durante dos años trabajó en secreto, día y noche, en un cuarto alto de su casa. Dejó de escribirle a su familia. Dejó de ver a sus amigos. Adelgazó, se puso pálido. Juntaba materiales en lugares oscuros que prefería no recordar. Quería crear un ser vivo. Y como las partes pequeñas eran difíciles de trabajar, decidió hacerlo enorme: de casi dos metros y medio de altura.

—Pensaba que sería un benefactor de la humanidad —le dijo a Walton—. Que una nueva especie me bendeciría como su creador. No pensé en nada más.`
      },
      {
        title: 'Lo que abrió los ojos',
        illustration: 'luna',
        content: `Fue una noche lúgubre de noviembre. La lluvia golpeaba los vidrios y la vela estaba casi consumida. A la luz temblorosa, Víctor vio cómo se abría el ojo amarillento y sin brillo de la criatura. Respiró con dificultad. Un movimiento convulsivo agitó sus miembros.

Víctor había elegido sus rasgos pensando que serían hermosos. Pero ahora, con vida, aquel ser le pareció espantoso: la piel amarillenta apenas cubría los músculos, el pelo era negro y brillante, los dientes blanquísimos, y los ojos acuosos parecían del mismo color que las cuencas en que estaban. Sus labios eran negros y rectos.

El sueño de dos años se convirtió en horror. Víctor salió corriendo de la habitación y se encerró en su dormitorio. Esa noche, despertó sobresaltado: la criatura estaba junto a su cama, mirándolo, con una mano extendida hacia él, como pidiéndole algo. Sus labios hicieron unos sonidos que no entendió. Quizás sonreía. Víctor huyó a la calle y pasó la noche caminando bajo la lluvia.

Cuando volvió, con su amigo Clerval, que había llegado de visita, la criatura ya no estaba. Víctor cayó enfermo con una fiebre que le duró meses. Clerval lo cuidó con paciencia. Víctor nunca le contó lo que había hecho.

Meses después, recibió una carta terrible de su padre: su hermanito William había sido asesinado en un bosque cerca de Ginebra. Víctor viajó de inmediato. Era de noche y había tormenta cuando llegó al lugar. Un relámpago iluminó los árboles, y entre ellos vio una figura gigantesca, deforme, que trepaba por las rocas con una agilidad imposible.

Lo supo en ese mismo instante: era su criatura. Era ella la que había matado a William.

Pero lo peor estaba por llegar. Habían acusado del crimen a Justine, una joven muy querida que trabajaba en la casa de la familia, porque encontraron entre sus cosas un medallón de William. Víctor sabía que era inocente. Pero ¿cómo iba a explicar la verdad? ¿Quién le iba a creer que había creado un monstruo? Calló. Y Justine fue condenada.

Víctor se sentía el verdadero culpable de las dos muertes.`
      },
      {
        title: 'La historia de la criatura',
        illustration: 'montanas',
        content: `Para escapar de su dolor, Víctor subió a las montañas de los Alpes, hasta un enorme glaciar llamado el Mar de Hielo. Allí, entre la niebla, vio acercarse a la criatura saltando sobre las grietas del hielo.

—¡Demonio! —gritó Víctor—. ¡Ojalá pudiera destruirte!

—Esperaba que me recibieras así —dijo la criatura, con una voz grave y una sorprendente elocuencia—. Todos odian a los desgraciados. Pero yo soy tu creación. Debería ser tu Adán, y soy más bien el ángel caído al que expulsaste sin culpa. Escúchame. Después decidirás.

Y le contó su historia.

Al principio no entendía nada. Veía, oía, sentía frío y hambre sin saber qué eran esas cosas. Vagó por los bosques. La primera vez que entró a un pueblo, la gente gritó, los perros lo persiguieron y le tiraron piedras. Se escondió en un cobertizo pegado a la casa de una familia pobre: un anciano ciego, De Lacey, y sus dos hijos.

Durante meses los observó en secreto por una rendija. Vio su cariño, su tristeza, su música. Por las noches, les dejaba leña cortada para ayudarlos. Escuchándolos, aprendió a hablar. Encontró unos libros y aprendió a leer. Leyendo, descubrió qué era: un ser solo, sin familia, sin nombre, sin nadie parecido a él.

Un día se animó a presentarse ante el anciano ciego, que no podía ver su aspecto. El anciano lo escuchó con bondad. Pero en ese momento volvieron sus hijos, y al verlo, lo atacaron horrorizados. La familia abandonó la casa para siempre.

—Ese día —dijo la criatura— algo se rompió en mí. Yo era bueno. La desgracia me hizo malo. Busqué a mi creador, y en el camino encontré a tu hermano. Al saber que era de tu familia… Sí, fui yo. Y yo puse el medallón entre las ropas de Justine.

Víctor temblaba de odio y de horror. Pero la criatura hizo un pedido.

—Estoy solo. Hazme una compañera, de mi misma especie, tan horrible como yo. Nos iremos lejos, a las selvas de América del Sur, donde ningún humano nos vea. Te juro que nunca más le haré daño a nadie.`
      },
      {
        title: 'Hasta el fin del hielo',
        illustration: 'pinguino',
        content: `Víctor aceptó, atormentado. Viajó con Clerval a Inglaterra y después se encerró solo en una cabaña de una isla remota de Escocia para trabajar en la compañera. Pero mientras trabajaba, las dudas lo devoraban. ¿Y si ella no aceptaba el pacto? ¿Y si tenían hijos, y nacía una raza de seres que amenazara a la humanidad?

Una noche, al levantar la vista, vio a la criatura en la ventana, observándolo con una sonrisa. En ese momento, Víctor destrozó lo que había hecho.

La criatura soltó un aullido de desesperación.

—Recordá esto —le dijo antes de desaparecer en la noche—: estaré contigo en tu noche de bodas.

La venganza llegó como una tormenta. Primero, Clerval apareció sin vida en una playa de Irlanda. Después, cuando Víctor, al volver a Suiza, se casó con Elizabeth, sucedió lo que la criatura había anunciado: la noche de bodas, Víctor escuchó un grito, corrió a la habitación y encontró a Elizabeth muerta. Por la ventana vio a la criatura, que se burlaba de él y huía hacia el lago. Poco después, el padre de Víctor murió de pena.

Víctor ya no tenía a nadie. Sólo le quedaba un propósito: perseguir a su creación hasta destruirla. La siguió por Europa y Rusia, hasta los hielos del Ártico. A veces la criatura le dejaba mensajes y comida, como si quisiera que la persecución no terminara nunca.

Así lo había encontrado Walton. Pocos días después de contar su historia, Víctor Frankenstein murió en el barco.

Esa misma noche, Walton oyó ruidos en el camarote. Al entrar, vio a la criatura inclinada sobre el cuerpo de su creador. Lloraba.

—Él también es mi víctima —dijo—. Y yo soy la suya. Busqué amor y encontré odio. Ahora todo terminó. Me iré al extremo norte del mundo y no volveré a ser visto.

Saltó por la ventana a un témpano de hielo, y pronto se perdió en la oscuridad y la distancia.

Walton decidió volver. Había aprendido que la búsqueda del conocimiento sin responsabilidad puede ser una tragedia. Y que, a veces, los verdaderos monstruos no nacen monstruos: los crea el abandono.`
      }
    ],
    quiz: [
      { question: '¿Cuál fue el primer error grave de Víctor después de crear a la criatura?', options: ['Venderla', 'Abandonarla horrorizado', 'Enseñarle a leer', 'Encerrarla'], correct: 1, explanation: 'Huyó y la dejó sola, sin guía ni cuidado.' },
      { question: '¿Cómo aprendió a hablar y leer la criatura?', options: ['En una escuela', 'Observando en secreto a la familia De Lacey', 'Víctor le enseñó', 'Nunca aprendió'], correct: 1, explanation: 'Los escuchaba por una rendija del cobertizo.' },
      { question: '¿Qué le pidió la criatura a Víctor en el glaciar?', options: ['Dinero', 'Una compañera de su misma especie', 'Volver a su casa', 'Un nombre'], correct: 1, explanation: 'Prometió irse lejos y no hacer daño a nadie.' },
      { question: '¿Por qué Víctor guardó silencio cuando acusaron a Justine?', options: ['Porque la odiaba', 'Porque pensó que nadie le creería la verdad', 'Porque estaba de viaje', 'Porque no se enteró'], correct: 1, explanation: 'Su silencio lo hizo sentirse culpable de su condena.' },
      { question: '¿Qué reflexión deja la novela?', options: ['Que la ciencia es mala', 'Que crear sin hacerse responsable puede causar tragedias, y que el abandono crea monstruos', 'Que los monstruos existen', 'Que el hielo es peligroso'], correct: 1, explanation: 'Es una reflexión sobre la responsabilidad del creador.' }
    ]
  },
  {
    slug: 'el-extrano-caso-del-dr-jekyll-y-mr-hyde',
    title: 'El extraño caso del Dr. Jekyll y Mr. Hyde',
    author: 'Robert Louis Stevenson (adaptación de la Biblioteca)',
    license: PD('«El extraño caso del Dr. Jekyll y Mr. Hyde» de Robert Louis Stevenson (1886)'),
    synopsis: 'En la niebla de Londres, un hombre pequeño y desagradable comete actos crueles y desaparece por la puerta trasera de la casa de un médico respetado. El abogado Utterson no entiende qué relación hay entre el bondadoso doctor Jekyll y el siniestro señor Hyde. La verdad será más inquietante de lo que imagina.',
    genres: ['Suspenso', 'Terror', 'Misterio'],
    gradeMin: 6, gradeMax: 7,
    cover: { scene: 'ciudad', c1: '#1d3557', c2: '#457b9d' },
    chapters: [
      {
        title: 'La historia de la puerta',
        illustration: 'ciudad',
        content: `El señor Utterson era un abogado serio, de pocas palabras, que casi nunca sonreía, pero que tenía un gran corazón y siempre ayudaba a sus amigos en problemas. Todos los domingos paseaba por Londres con su primo, el señor Enfield.

Una tarde pasaron frente a una puerta extraña, en una calle lateral: una puerta vieja, sin timbre, con la pintura descascarada, que parecía no pertenecer a nadie.

—Esa puerta me recuerda una historia muy rara —dijo Enfield—. Una noche, a eso de las tres de la mañana, volvía a casa por acá. De pronto vi a un hombre pequeño que caminaba muy rápido y a una nena que corría desde la esquina. Chocaron. Y el hombre, en lugar de detenerse, pasó por encima de la nena caída, tranquilamente, dejándola llorando en el suelo. Fue horrible.

Enfield lo había atrapado. Se juntaron vecinos furiosos. Para evitar un escándalo, el hombre aceptó pagar cien libras a la familia de la nena. Y para buscar el dinero, entró por esa puerta, y volvió con un cheque firmado por una de las personas más respetadas de Londres.

—Pensé que era falso —dijo Enfield—. Pero al día siguiente, en el banco, lo cobré. Era auténtico.

—¿Y cómo se llamaba el hombre? —preguntó Utterson.

—Hyde. Edward Hyde. Hay algo en él que da asco, algo deforme, aunque no sabría decir qué. Nunca vi a nadie que me causara tanto rechazo.

Utterson se quedó callado. Él conocía ese nombre. Esa misma noche, en su casa, abrió la caja fuerte y sacó un documento: el testamento de su viejo amigo, el doctor Henry Jekyll. Decía que, si el doctor moría o desaparecía durante más de tres meses, todos sus bienes debían pasar a "mi amigo y benefactor, Edward Hyde".

Y la puerta de la historia de Enfield… era la puerta trasera del laboratorio del doctor Jekyll.`
      },
      {
        title: 'Un crimen en la niebla',
        illustration: 'luna',
        content: `Utterson empezó a vigilar la puerta. Una noche fría y despejada, vio llegar a un hombre pequeño, vestido con sencillez. Se acercó.

—¿Señor Hyde?

El hombre retrocedió, siseando como una serpiente. No mostró la cara enseguida, pero al final la levantó. Era pálido y bajo, y daba una impresión de deformidad sin tener ningún defecto visible. Tenía una sonrisa desagradable y una voz ronca y quebrada. Utterson sintió una mezcla de miedo y repugnancia que no pudo explicar.

Fue a ver a Jekyll. El doctor era un hombre alto, de unos cincuenta años, amable y apreciado por todos.

—Henry, tu testamento me preocupa. Ese Hyde…

El rostro de Jekyll se ensombreció.

—Te pido que no hables más del asunto. Puedo librarme de Hyde cuando quiera. Te doy mi palabra. Sólo te pido que, si me pasa algo, lo ayudes a obtener lo que le corresponde.

Pasó un año. Una noche de niebla, una sirvienta que miraba por la ventana vio a un caballero anciano y amable, Sir Danvers Carew, que se acercó a preguntar algo a un hombre pequeño. Era Hyde. De pronto, sin ningún motivo, Hyde estalló en furia y atacó al anciano con su pesado bastón, con una violencia salvaje, hasta matarlo. Después huyó.

La policía encontró la mitad del bastón roto. Utterson lo reconoció con horror: era un bastón que él mismo le había regalado al doctor Jekyll.

Fueron a la casa donde vivía Hyde, pero había escapado. Utterson corrió a ver a Jekyll y lo encontró en el laboratorio, enfermo, pálido, temblando.

—Juro que nunca volveré a verlo —dijo Jekyll—. Se terminó. Nunca más se sabrá de él.

Y durante un tiempo pareció ser verdad. Jekyll volvió a ser el de antes: alegre, sociable, ayudaba a los pobres. Hasta que, de un día para otro, se encerró en su casa y dejó de recibir visitas.`
      },
      {
        title: 'La puerta del laboratorio',
        illustration: 'casona',
        content: `El doctor Lanyon, un viejo amigo de Jekyll y de Utterson, enfermó de repente. Cuando Utterson fue a visitarlo, lo encontró envejecido, con la cara de alguien que ha visto algo terrible.

—No quiero oír hablar más del doctor Jekyll —dijo Lanyon—. Para mí está muerto. Algún día sabrás por qué.

Pocas semanas después, Lanyon murió. Dejó para Utterson un sobre cerrado con una indicación: "No abrir hasta la muerte o desaparición del doctor Henry Jekyll".

Una noche de marzo, Poole, el mayordomo de Jekyll, apareció en la casa de Utterson, pálido de miedo.

—Señor, algo malo pasa. El doctor está encerrado en el laboratorio desde hace una semana. Nos pasa papelitos por debajo de la puerta, pidiendo una sustancia química que tenemos que buscar en todas las farmacias de Londres. Pero cada vez que la traemos, dice que no sirve, que no es pura. Y la voz que se oye detrás de la puerta… señor, no es la voz del doctor.

Fueron juntos. Llamaron a la puerta.

—Utterson —gritó—, ¡exijo verte!

—¡Por el amor de Dios, ten piedad! —respondió una voz ronca.

—Esa no es la voz de Jekyll —dijo Utterson—. ¡Es la de Hyde! ¡Poole, derribemos la puerta!

Golpearon con un hacha. Al quinto golpe, la puerta cayó. Dentro, sobre el piso, yacía el cuerpo sin vida de un hombre pequeño, vestido con ropa demasiado grande para él: la ropa del doctor Jekyll. Era Edward Hyde. Había tomado veneno.

Buscaron a Jekyll por toda la casa. No estaba en ninguna parte. Sobre el escritorio encontraron un sobre a nombre de Utterson. Adentro había una carta larga, con la letra del doctor: "Declaración completa de Henry Jekyll sobre el caso".`
      },
      {
        title: 'La confesión de Henry Jekyll',
        illustration: 'llave',
        content: `"Nací con una gran fortuna, buenas cualidades y deseos de ser respetado. Pero también tenía en mí una tendencia a los placeres egoístas y a la impaciencia, que escondía bajo una cara seria. Con los años me di cuenta de algo: el ser humano no es uno solo, sino dos. Dentro de cada uno conviven el bien y el mal, peleando.

Pensé: ¿y si se pudieran separar? El lado bueno podría vivir en paz, sin la vergüenza del malo; y el malo podría hacer lo que quisiera, sin la culpa del bueno.

Investigué durante años, hasta que preparé una sustancia, una mezcla con una sal especial. Una noche la bebí. Sentí dolores terribles, náuseas, un horror del espíritu. Y después, una sensación nueva: me sentía más joven, más ligero, sin ataduras, libre de toda conciencia. Me miré en el espejo. Era Edward Hyde. Más pequeño, más joven, porque mi lado malo había vivido menos, había sido menos ejercitado que el bueno. Hyde no era una mezcla de bien y mal, como todos: era mal puro.

Al principio, ser Hyde era un juego. Bebía la sustancia, salía a la noche, hacía lo que quería y volvía a beberla para ser Jekyll otra vez. Hyde era cada vez más cruel, y yo me decía que no era mi responsabilidad: era él.

Pero un día me desperté en mi cama… y mi mano, sobre la sábana, era la mano de Hyde. Me había transformado sin beber nada. El mal estaba ganando. Juré no volver a usar la sustancia. Durante dos meses resistí. Pero la tentación pudo más, y esa noche, siendo Hyde, con toda la furia acumulada, maté a Sir Danvers Carew.

Desde entonces, las transformaciones llegaban solas, cada vez con más frecuencia. Necesitaba dosis más fuertes para volver a ser yo. Y la sal se terminó. Pedí más a todas las farmacias, pero ninguna servía: ahora sé que la primera tenía una impureza desconocida, y que era esa impureza la que hacía funcionar la mezcla. Nunca podré volver a conseguirla.

Esta es la última vez que escribo como Henry Jekyll. Dentro de poco, Hyde va a ocupar mi lugar para siempre. Aquí, con este papel, termino la vida del desdichado Henry Jekyll".

Utterson dejó la carta sobre el escritorio. Afuera, la niebla cubría Londres. Pensó en su amigo, que había querido separar el bien del mal para no tener que elegir, y había terminado dejando que el mal lo devorara todo.`
      }
    ],
    quiz: [
      { question: '¿Qué le llamó la atención a Utterson del testamento de Jekyll?', options: ['Que no tenía firma', 'Que dejaba todo a Edward Hyde', 'Que era muy corto', 'Que estaba en otro idioma'], correct: 1, explanation: 'Le parecía muy sospechoso que heredara un hombre tan siniestro.' },
      { question: '¿Qué pista vinculó el crimen de Carew con Jekyll?', options: ['Una carta', 'El bastón roto que Utterson le había regalado a Jekyll', 'Una huella', 'Un testigo'], correct: 1, explanation: 'Hyde usó un bastón que pertenecía a Jekyll.' },
      { question: '¿Qué intentaba lograr Jekyll con su sustancia?', options: ['Ser invisible', 'Separar el lado bueno del malo del ser humano', 'Curar enfermedades', 'Volverse inmortal'], correct: 1, explanation: 'Quería vivir sin el conflicto entre el bien y el mal.' },
      { question: '¿Por qué Hyde era más pequeño y joven que Jekyll?', options: ['Por la ropa', 'Porque el lado malo de Jekyll había sido menos ejercitado', 'Porque era otra persona', 'Por la niebla'], correct: 1, explanation: 'Es una metáfora de la parte oculta de la personalidad.' },
      { question: '¿Qué idea plantea la novela?', options: ['Que las personas son todas buenas', 'Que en cada persona conviven el bien y el mal, y somos responsables de nuestras elecciones', 'Que la química es peligrosa', 'Que Londres es aburrido'], correct: 1, explanation: 'Jekyll quiso escapar de esa responsabilidad y lo perdió todo.' }
    ]
  }
];
