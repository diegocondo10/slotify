console.log("VERCEL");
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";

// // Obtener la variable de entorno
// const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL_SERVER;

// if (!apiBaseUrl) {
//   console.error("Error: La variable NEXT_PUBLIC_API_BASE_URL_SERVER no está definida.");
//   process.exit(1);
// }

// // Configuración del archivo vercel.json
// const vercelConfig = {
//   rewrites: [
//     {
//       source: "/v1/(.*)", // Cambia el patrón para capturar cualquier cosa después de /v1/
//       destination: `${apiBaseUrl}$1/`, // Añade /api/v1/ en el destino
//     },
//   ],
// };

// // Obtener el directorio actual utilizando `import.meta.url`
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Ruta donde se guardará el archivo vercel.json
// const vercelConfigPath = path.join(__dirname, "vercel.json");

// // Escribir el archivo vercel.json
// fs.writeFileSync(vercelConfigPath, JSON.stringify(vercelConfig, null, 2));

// console.log("Archivo vercel.json generado con éxito:", vercelConfig);
