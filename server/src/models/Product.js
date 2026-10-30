import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio.'],
      trim: true,
    },
    descripcion: {
      type: String,
      trim: true,
      default: '',
    },
    precio: {
      type: Number,
      required: [true, 'El precio es obligatorio.'],
      min: [0, 'El precio no puede ser negativo.'],
    },
    stock: {
      type: Number,
      min: [0, 'El stock no puede ser negativo.'],
      validate: {
        validator: Number.isInteger,
        message: 'El stock debe ser un número entero.',
      },
    },
    imagenUrl: {
      type: String,
      trim: true,
      alias: 'imagen',
    },
    categoria: {
      type: String,
      trim: true,
    },
    destacado: {
      type: Boolean,
      default: false,
    },
    specs: {
      type: [
        new mongoose.Schema(
          {
            label: { type: String, required: true, trim: true },
            value: { type: String, required: true, trim: true },
          },
          { _id: false },
        ),
      ],
      default: [],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Product = mongoose.models.Product ?? mongoose.model('Product', productSchema);

export default Product;
