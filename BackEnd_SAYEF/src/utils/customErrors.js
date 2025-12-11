export class CustomError extends Error {
  constructor(name, message, statusCode) {
    super(message);
    this.name = name;
    this.statusCode = statusCode || 500;
  }
}

export const generateUserError = (message) => new CustomError("UserError", message, 400);
export const generateAuthError = (message) => new CustomError("AuthError", message, 401);
export const generateProductError = (message) => new CustomError("ProductError", message, 400);
export const generateCartError = (message) => new CustomError("CartError", message, 400);

// Ejemplo de uso:
// throw generateProductError("El producto no existe");
