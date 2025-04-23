const redis = require('./redis'); // asegurate que apunta a tu archivo de conexión

(async () => {
  const mensajes = await redis.hGetAll('messages:est123:prof456'); // cambiar IDs según tus pruebas
  Object.entries(mensajes).forEach(([key, val]) => {
    console.log(`ID: ${key}`);
    console.log('Mensaje:', JSON.parse(val));
  });

  await redis.quit();
})();