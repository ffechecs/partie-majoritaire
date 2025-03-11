const logosAndLinks = [
  {
    src: "/logo/ffe.png",
    alt: "Logo de la FFE",
    link: "http://www.echecs.asso.fr/",
  },
  {
    src: "/logo/ans.png",
    alt: "Logo de l'ANS",
    link: "https://www.agencedusport.fr/",
  },
  {
    src: "/logo/classechecs.png",
    alt: "Logo de Class'échecs",
    link: "https://classechecs.ffechecs.fr/",
  },
]

export function Footer() {
  return (
    <div>
      <div className="mx-auto flex flex-col items-center justify-center gap-8 px-4 py-12 text-zinc-500 md:px-0">
        <div className="flex h-[100px] items-center justify-center gap-4">
          {logosAndLinks.map((logo) => (
            <a href={logo.link} key={logo.link}>
              <img
                className="transition-all duration-300 hover:scale-110 md:h-[100px]"
                src={logo.src}
                alt={logo.alt}
              />
            </a>
          ))}
        </div>
        <span>
          Plateforme de Partie Majoritaire, Fédération Française des Echecs
        </span>
      </div>
    </div>
  )
}
