function FormField({ id, label, error, ...inputProps }) {
  return (
    <div className="form-field form-field--float">
      <div className="form-field__control">
        <input id={id} name={id} placeholder=" " {...inputProps} />
        <label htmlFor={id}>{label}</label>
      </div>
      <p className="form-field__error" role="alert">
        {error}
      </p>
    </div>
  );
}

export default FormField;
