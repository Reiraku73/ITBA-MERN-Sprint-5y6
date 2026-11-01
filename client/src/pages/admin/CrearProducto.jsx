import { useNavigate } from 'react-router-dom';
import ProductoForm from '../../components/admin/ProductoForm.jsx';
import { crearProducto } from '../../services/productService.js';

export default function CrearProducto() {
  const navigate = useNavigate();

  async function handleCrear(producto) {
    const creado = await crearProducto(producto);
    // Si el backend devuelve el producto con su id, vamos al detalle.
    // Si no, volvemos al catálogo.
    navigate(creado?.id ? `/productos/${creado.id}` : '/productos');
  }

  return (
    <main>
      <section>
        <h1>Crear producto</h1>
        <ProductoForm onSubmit={handleCrear} textoBoton="Crear producto" />
      </section>
    </main>
  );
}