// Types pour les données de l'événement
export type Presenter = {
  name: string;
  title: string;
};

export type Workshop = {
  id: number;
  title: string;
  subtitle?: string;
  presenters: Presenter[];
  room: string;
  floor?: string;
  time: string;
  icon?: string;
  category?: string;
};

export type Meeting = {
  id: number;
  title: string;
  presenters: Presenter[];
  room: string;
  floor?: string;
  time: string;
};

export type SpecialEvent = {
  id: number;
  title: string;
  description?: string;
  location: string;
  time: string;
  image?: string;
};

// MERCREDI 15 OCTOBRE 2025
export const wednesdayData = {
  morningWorkshops: [
    {
      id: 1,
      title: "Communication, entretien motivationnel et hésitation vaccinale",
      subtitle: "Atelier 1",
      presenters: [
        { name: "Patrick Pladys", title: "Néonatologiste - Rennes" },
        { name: "Matthieu Revest", title: "Infectiologue - Rennes" }
      ],
      room: "Salle 1",
      floor: "Étage 1",
      time: "10h30 - 12h00",
      icon: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?q=80&w=150&auto=format&fit=crop&ixlib=rb-4.0.3",
      category: "Communication médicale",
      introduction: "L'atelier proposé s'intéresse aux aspects de communication dans le cadre de l'hésitation vaccinale qui en anténatal concerne les vaccinations contre la grippe, la coqueluche et le virus respiratoire syncitial et en post-natal l'initiation du programme vaccinal. L'atelier sera structuré avec une introduction sur les vaccins concernés suivi d'un échange avec la salle s'intéressant aux situations auxquelles ont été confrontés les participants à l'atelier. L'atelier sera conclu par une introduction à l'entretien motivationnel qui est un outil puissant pour favoriser l'adhésion aux politiques vaccinales.",
    },
    {
      id: 2,
      title: "Soins de développement (NBO)",
      subtitle: "Atelier 2",
      presenters: [
        { name: "Isabelle Olivard", title: "Formatrice NIDCAP - Brest" },
        { name: "Jean-Michel Roue", title: "Pédiatre – Brest" }
      ],
      room: "Salle 2",
      floor: "Étage 1",
      time: "10h30 - 12h00",
      icon: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=150&auto=format&fit=crop&ixlib=rb-4.0.3",
      category: "Soins pédiatriques",
    },
    {
      id: 3,
      title: "Sensibilisation à la santé-environnement",
      subtitle: "Atelier 3",
      presenters: [
        { name: "Christine Capdelacarrere Henon", title: "Sage-Femme - Saint-Malo" },
        { name: "Marie Le Guen", title: "Sage-Femme - Rennes" },
        { name: "Clémence Mielle", title: "Sage-Femme - Rennes" },
        { name: "Cécile Ory", title: "Sage-Femme - Saint-Malo" }
      ],
      room: "Salle 3",
      floor: "Étage 1",
      time: "10h30 - 12h00",
      icon: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=150&auto=format&fit=crop&ixlib=rb-4.0.3",
      category: "Bien-être prénatal",
      introduction: "Les premiers 1000 jours d'une vie, de la conception jusqu'au deuxième anniversaire, représentent une période de développement cruciale. C'est durant cette fenêtre temporelle que les fondations d'une santé à long terme sont établies. Les enfants sont particulièrement sensibles aux différents polluants qui les entourent et ceux-ci peuvent avoir un impact sur la santé future de l'enfant. C'est pourquoi il est important de pouvoir sensibiliser au mieux les futurs parents et parents de jeunes enfants. Venez échanger sous forme ludique avec des sages-femmes lors d'un l'atelier de sensibilisation à la santé environnementale. Lieu d'information sur les sources possibles de pollution de l'air intérieur, sur les risques pour la santé liés à l'alimentation, aux produits ménagers et cosmétiques.",
    },
  ],
  meetings: [
    {
      id: 1,
      title: "Réunion du Bureau de la SFMP",
      presenters: [],
      room: "Salle 4",
      floor: "Étage 1",
      time: "10h30 - 11h30",
    },
    {
      id: 2,
      title: "Conseil d'Administration de la SFMP",
      presenters: [],
      room: "Salle 4",
      floor: "Étage 1",
      time: "11h30 - 14h30",
    },
  ],
  afternoonWorkshops: [
    {
      id: 4,
      title: "Approche physiopathologique du RCF",
      subtitle: "Atelier 4",
      presenters: [
        { name: "Maela Le Lous", title: "Gynécologue Obstétricienne - Rennes" },
        { name: "Blanche Graesslin", title: "Sage-Femme - Rennes" }
      ],
      room: "Salle 1",
      floor: "Étage 1",
      time: "13h00 - 14h30",
      icon: "https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?q=80&w=150&auto=format&fit=crop&ixlib=rb-4.0.3",
      category: "Suivi médical",
      introduction: "Bases physiopathologiques de la tolérance fœtale pendant le travail, interprétation de l'enregistrement du rythme cardiaque fœtal et identification des 4 principaux types d'hypoxie fœtale : hypoxie chronique, hypoxie aigue, hypoxie subaiguë, hypoxie évolutive compensée ou décompensée",
    },
    {
      id: 5,
      title: "Encéphalopathie anoxoischémique",
      subtitle: "Atelier 5",
      presenters: [
        { name: "François Anouilh", title: "Sage-Femme - Brest" },
        { name: "Stéphanie Malexieux-Evrard", title: "Pédiatre - Brest" }
      ],
      room: "Salle 2",
      floor: "Étage 1",
      time: "13h00 - 14h30",
      icon: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=150&auto=format&fit=crop&ixlib=rb-4.0.3",
      category: "Soins pédiatriques",
      introduction: "Identification et anticipation d'une situation d'anoxoischémie périnatale et prise en charge d'un enfant suspect d'encéphalopathie anoxoischémique, au travers de cas cliniques. A destination des sages-femmes, gynécologues obstétriciens et pédiatres. Situations à risque et monitorage, prise en charge en salle de naissance, identifications des enfants suspects d'encéphalopathie anoxoischémique par le pH au cordon, l'évaluation clinique évolutive aidée du score de Sarnat, les objectifs secondaires à remplir (surveillance glycémique, objectif de température, contrôles biologiques éventuels) ainsi que la préparation à un possible transfert dans les délais optimaux.",
    },
    {
      id: 6,
      title: "Sensibilisation à la santé-environnement",
      subtitle: "Atelier 6",
      presenters: [
        { name: "Marie-Christine Capdelacarrere Henon", title: "Sage-Femme - Saint-Malo" },
        { name: "Marie Le Guen", title: "Sage-Femme - Rennes" },
        { name: "Clémence Mielle", title: "Sage-Femme - Rennes" },
        { name: "Cécile Ory", title: "Sage-Femme - Saint-Malo" }
      ],
      room: "Salle 3",
      floor: "Étage 1",
      time: "13h00 - 14h30",
      icon: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=150&auto=format&fit=crop&ixlib=rb-4.0.3",
      category: "Bien-être prénatal",
      introduction: "Les premiers 1000 jours d'une vie, de la conception jusqu'au deuxième anniversaire, représentent une période de développement cruciale. C'est durant cette fenêtre temporelle que les fondations d'une santé à long terme sont établies. Les enfants sont particulièrement sensibles aux différents polluants qui les entourent et ceux-ci peuvent avoir un impact sur la santé future de l'enfant. C'est pourquoi il est important de pouvoir sensibiliser au mieux les futurs parents et parents de jeunes enfants. Venez échanger sous forme ludique avec des sages-femmes lors d'un l'atelier de sensibilisation à la santé environnementale. Lieu d'information sur les sources possibles de pollution de l'air intérieur, sur les risques pour la santé liés à l'alimentation, aux produits ménagers et cosmétiques.",
    },
  ],
  welcomeEvent: {
    id: 7,
    title: "Bienvenue à Rennes !",
    presenters: [
      { name: "Comité d'organisation", title: "SFMP 2025" },
    ],
    room: "Salle plénière",
    time: "14h45 - 15h00",
  },
  afternoonPause: {
    id: 8,
    title: "Pause",
    time: "16h00 - 16h30",
    location: "Hall / partenaires",
  },
  plenary: {
    id: 9,
    title: "Table Ronde 1 : Expositions chimiques périnatales",
    presenters: [
      { name: "Dr. Sylvie Marchand", title: "Toxicologue - Paris" },
      { name: "Dr. Marc Durand", title: "Épidémiologiste - Lyon" }
    ],
    room: "Salle plénière",
    time: "15h00 - 17h30",
  },
  parallelSession: {
    id: 10,
    title: "Session FFRSP : L'accouchement extrahospitalier",
    presenters: [
      { name: "Dr. Anne Lefebvre", title: "Sage-Femme - Toulouse" },
      { name: "Dr. Pierre Moreau", title: "Gynécologue Obstétricien - Marseille" }
    ],
    room: "Salle 1",
    time: "15h00 - 17h30",
  },
  actualityConference: {
    id: 11,
    title: "Conférence d'actualité : La parentalité en milieu carcéral",
    subtitle: "L'expérience du centre de détention de Rennes",
    presenters: [
      { name: "Dr. Marie Dubois", title: "Psychiatre - Rennes" },
      { name: "Sophie Lambert", title: "Travailleuse sociale - Rennes" }
    ],
    room: "Salle plénière",
    time: "17h30 - 18h15",
  },
  specialEvent: {
    id: 12,
    title: "Foulée SFMP",
    description: "Course ou marche à pied sur une distance de 5 kms",
    location: "Extérieur",
    time: "19h00",
    image: "/capture-d-e-cran-2025-03-18-a--09-51-21-1.png",
  }
};

// JEUDI 16 OCTOBRE 2025
export const thursdayData = {
  morningWorkshops: [
    {
      id: 10,
      title: "Session GEGA : Grossesse et addiction au Tramadol",
      subtitle: "Session parallèle",
      presenters: [
        { name: "Dr. Lucie Bertrand", title: "Addictologue - Marseille" },
        { name: "Dr. Thomas Lemoine", title: "Psychiatre - Toulouse" }
      ],
      room: "Salle 1",
      floor: "Étage 1",
      time: "08h30 - 10h30",
      icon: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=150&auto=format&fit=crop&ixlib=rb-4.0.3",
      category: "Suivi médical",
    },
    {
      id: 11,
      title: "Session CARO : Hypnose en périnatalité",
      subtitle: "Session parallèle",
      presenters: [
        { name: "Dr. Isabelle Moreau", title: "Hypnothérapeute - Paris" },
        { name: "Dr. Pierre Dubois", title: "Anesthésiste - Lyon" }
      ],
      room: "Salle 2",
      floor: "Étage 1",
      time: "08h30 - 10h30",
      icon: "https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?q=80&w=150&auto=format&fit=crop&ixlib=rb-4.0.3",
      category: "Bien-être prénatal",
    },
  ],
  afternoonWorkshops: [
    {
      id: 12,
      title: "Communications libres Accouchement 1",
      subtitle: "Session de présentations",
      presenters: [
        { name: "Divers intervenants", title: "Professionnels de santé" }
      ],
      room: "Salle plénière",
      floor: "RDC",
      time: "14h30 - 16h30",
      icon: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?q=80&w=150&auto=format&fit=crop&ixlib=rb-4.0.3",
      category: "Préparation à l'accouchement",
    },
    {
      id: 13,
      title: "Communications libres Néonatalogie 1",
      subtitle: "Session de présentations",
      presenters: [
        { name: "Divers intervenants", title: "Néonatologues" }
      ],
      room: "Salle 1",
      floor: "Étage 1",
      time: "14h30 - 16h30",
      icon: "https://images.unsplash.com/photo-1612531933037-91b2f5f229cc?q=80&w=150&auto=format&fit=crop&ixlib=rb-4.0.3",
      category: "Soins pédiatriques",
    },
    {
      id: 14,
      title: "Communications libres Santé maternelle 1",
      subtitle: "Session de présentations",
      presenters: [
        { name: "Divers intervenants", title: "Spécialistes santé maternelle" }
      ],
      room: "Salle 2",
      floor: "Étage 1",
      time: "14h30 - 16h30",
      icon: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?q=80&w=150&auto=format&fit=crop&ixlib=rb-4.0.3",
      category: "Suivi médical",
    },
  ],
  plenary: {
    id: 15,
    title: "Table ronde : Cardiopathies congénitales en périnatalité",
    presenters: [
      { name: "Dr. François Martin", title: "Cardiologue pédiatrique - Paris" },
      { name: "Dr. Marie Lefevre", title: "Cardiologue congénital - Lyon" }
    ],
    room: "Salle plénière",
    time: "08h30 - 10h30",
  },
  specialEvent: {
    id: 16,
    title: "Soirée du Congrès",
    description: "Soirée conviviale avec cocktail dînatoire (sur inscription)",
    location: "À préciser",
    time: "20h30",
    image: "/capture-d-e-cran-2025-03-18-a--09-44-56-1.png",
  }
};

// VENDREDI 17 OCTOBRE 2025
export const fridayData = {
  morningWorkshops: [
    {
      id: 17,
      title: "Communications libres Accouchement 2",
      subtitle: "Session de présentations",
      presenters: [
        { name: "Divers intervenants", title: "Obstétriciens" }
      ],
      room: "Salle plénière",
      floor: "RDC",
      time: "08h30 - 10h30",
      icon: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?q=80&w=150&auto=format&fit=crop&ixlib=rb-4.0.3",
      category: "Préparation à l'accouchement",
    },
    {
      id: 18,
      title: "Communications libres Néonatalogie 2",
      subtitle: "Session de présentations",
      presenters: [
        { name: "Divers intervenants", title: "Néonatologues" }
      ],
      room: "Salle 1",
      floor: "Étage 1",
      time: "08h30 - 10h30",
      icon: "https://images.unsplash.com/photo-1612531933037-91b2f5f229cc?q=80&w=150&auto=format&fit=crop&ixlib=rb-4.0.3",
      category: "Soins pédiatriques",
    },
    {
      id: 19,
      title: "Communications libres Santé maternelle 2",
      subtitle: "Session de présentations",
      presenters: [
        { name: "Divers intervenants", title: "Spécialistes santé maternelle" }
      ],
      room: "Salle 2",
      floor: "Étage 1",
      time: "08h30 - 10h30",
      icon: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?q=80&w=150&auto=format&fit=crop&ixlib=rb-4.0.3",
      category: "Suivi médical",
    },
  ],
  afternoonWorkshops: [
    {
      id: 20,
      title: "Table ronde : Retard de croissance intra-utérin",
      subtitle: "Session plénière",
      presenters: [
        { name: "Dr. Nathalie Rousseau", title: "Obstétricienne - Paris" },
        { name: "Dr. Julien Blanc", title: "Fœtopathologiste - Lyon" }
      ],
      room: "Salle plénière",
      floor: "RDC",
      time: "11h30 - 13h30",
      icon: "https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?q=80&w=150&auto=format&fit=crop&ixlib=rb-4.0.3",
      category: "Suivi médical",
    },
  ],
  closingSession: {
    id: 21,
    title: "Remise des prix et clôture du congrès",
    presenters: [
      { name: "Comité d'organisation", title: "SFMP 2025" },
      { name: "Dr. Catherine Lambert", title: "Présidente de la SFMP" }
    ],
    room: "Salle plénière",
    time: "13h30 - 13h45",
  }
};