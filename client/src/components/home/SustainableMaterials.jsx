// Datos de las tarjetas de materiales
const MATERIALES = [
  {
    id: 'fsc',
    titulo: 'Madera certificada FSC',
    descripcion:
      'De bosques argentinos manejados de forma responsable, con prioridad a maderas nativas: algarrobo, quebracho y caldén.',
    imagen: '/images/relacionadas/FSC.png',
    alt: 'Troncos de madera apilados en un aserradero',
  },
  {
    id: 'acabados',
    titulo: 'Acabados naturales',
    descripcion:
      'Aceite de lino prensado en frío, cera de abejas y tintes vegetales de base agua, siempre de bajo COV.',
    imagen: '/images/relacionadas/acabados-naturales.jpg',
    alt: 'Barniz natural aplicado a mano sobre una superficie de madera',
  },
  {
    id: 'herencia-viva',
    titulo: 'Programa Herencia Viva',
    descripcion:
      'Garantía extendida (10 años en estructura, 5 en acabados), servicio de restauración y recompra de hasta el 40% del valor.',
    imagen: '/images/relacionadas/muebles-de-restauracion.jpg',
    alt: 'Mueble de madera restaurado a mano en un taller de carpintería',
  },
];

// Tarjeta individual: recibe los datos de un material por props
function MaterialCard({ titulo, descripcion, imagen, alt }) {
  return (
    <li className="material-card">
      <figure>
        <img src={imagen} alt={alt} width="500" height="500" loading="lazy" />
      </figure>
      <h3>{titulo}</h3>
      <p>{descripcion}</p>
    </li>
  );
}

export default function SustainableMaterials() {
  return (
    <section className="materiales">
      <div className="materiales__intro">
        <h2>Materiales sustentables</h2>
        <p>
          Nuestro compromiso con el medio ambiente guía cada decisión de abastecimiento: madera
          certificada, acabados naturales y un programa propio para que cada pieza tenga una segunda
          vida.
        </p>
      </div>

      <ul className="materiales__grid">
        {MATERIALES.map((material) => (
          <MaterialCard
            key={material.id}
            titulo={material.titulo}
            descripcion={material.descripcion}
            imagen={material.imagen}
            alt={material.alt}
          />
        ))}
      </ul>
    </section>
  );
}
